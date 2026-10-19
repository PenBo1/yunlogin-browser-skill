#!/usr/bin/env node

/**
 * Detect drift between two full-surface route sweeps.
 *
 * sweep-all-routes.mjs probes every route with a generic body. Routes that need real parameters
 * were later re-probed with their resolved inputs and carry `reprobedAt` in route-sweep.json;
 * a generic sweep is expected to disagree with those by design, so they are reported separately
 * instead of as drift.
 *
 * Usage:
 *   node scripts/dev/detect-route-drift.mjs --current <sweep.json> [--baseline <file>] [--update-baseline]
 *
 * Writes references/server-api/DRIFT.md and route-drift.json, and prints a summary.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readServerToken } from "../lib/local-token-store.mjs";
import { buildResolvedCalls, collectFields } from "../lib/resolved-calls.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const serverDir = path.join(skillDir, "references", "server-api");
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}
const currentPath = option("--current");
if (!currentPath) throw new Error("--current <sweep.json> is required");
const baselinePath = option("--baseline", path.join(serverDir, "route-baseline.json"));
const updateBaseline = args.includes("--update-baseline");
const verifyResolved = args.includes("--verify-resolved");

const current = JSON.parse(await readFile(currentPath, "utf8"));

// collectFields saturates at 300 paths, so two saturated counts are not comparable.
function fieldCountDiffers(a, b) {
  if (a === b) return false;
  const capped = (n) => (n ?? 0) >= 300;
  return !(capped(a) && capped(b));
}

function digest(row) {
  return {
    key: row.key,
    method: row.method,
    path: row.path,
    status: row.status,
    httpStatus: row.httpStatus ?? null,
    code: row.code ?? null,
    fieldCount: row.fieldCount ?? row.fields?.length ?? null,
    surface: row.surface ?? null,
    parameterized: Boolean(row.reprobedAt || row.reprobeNote),
  };
}

let baseline;
try {
  baseline = JSON.parse(await readFile(baselinePath, "utf8"));
} catch {
  baseline = null;
}

if (!baseline) {
  await writeFile(baselinePath, JSON.stringify({ createdAt: new Date().toISOString(), routes: current.results.map(digest) }, null, 2), "utf8");
  console.log(`No baseline found; created ${path.relative(skillDir, baselinePath)} with ${current.results.length} routes.`);
  console.log("Re-run after the next sweep to see drift.");
  process.exit(0);
}

const before = new Map(baseline.routes.map((r) => [r.key, r]));
const after = new Map(current.results.map((r) => [r.key, digest(r)]));

const added = [...after.keys()].filter((k) => !before.has(k));
const removed = [...before.keys()].filter((k) => !after.has(k));
const drifted = [];
const expected = [];
const coverage = [];
for (const [key, now] of after) {
  const then = before.get(key);
  if (!then) continue;
  const differences = [];
  if (then.status === "live" && now.status === "live") {
    if ((then.surface ?? null) !== (now.surface ?? null)) differences.push(`surface ${then.surface ?? "-"} -> ${now.surface ?? "-"}`);
    if (then.httpStatus !== now.httpStatus) differences.push(`http ${then.httpStatus} -> ${now.httpStatus}`);
    if (then.code !== now.code) differences.push(`code ${then.code} -> ${now.code}`);
    if (fieldCountDiffers(then.fieldCount, now.fieldCount)) differences.push(`fields ${then.fieldCount} -> ${now.fieldCount}`);
  } else if (then.status !== now.status) {
    // A sweep run with different skip flags changes coverage; that is not a server-side change.
    coverage.push({ key, path: now.path, method: now.method, differences: [`status ${then.status} -> ${now.status}`] });
    continue;
  }
  if (differences.length === 0) continue;
  const record = { key, path: now.path, method: now.method, differences };
  if (then.parameterized) expected.push({ ...record, reason: "parameterized route re-probed with resolved inputs; the generic sweep cannot reproduce it" });
  else drifted.push(record);
}

// --verify-resolved replays the parameterized calls so those routes are checked against the
// baseline with the inputs that actually make them answer, instead of being excused as expected.
const verifiedResolved = [];
const parameterizedBaseline = baseline.routes.filter((r) => r.parameterized);
if (verifyResolved && parameterizedBaseline.length > 0) {
  const token = await readServerToken();
  const { calls } = await buildResolvedCalls({ origin: "https://d126447d359e70c0.yunlogin.com", token });
  const byKey = new Map(calls.map((c) => [c.key, c]));
  for (const record of parameterizedBaseline) {
    const call = byKey.get(record.key);
    if (!call) continue;
    const then = before.get(record.key);
    const pending = expected.findIndex((e) => e.key === record.key);
    const url = new URL(call.path ?? record.path, "https://d126447d359e70c0.yunlogin.com");
    for (const [k, v] of Object.entries(call.query ?? {})) url.searchParams.set(k, String(v));
    const headers = { accept: "application/json, text/plain, */*", lang: "zh", authorization: `Bearer ${token}` };
    let body;
    if (record.method !== "GET") { headers["content-type"] = "application/json"; body = JSON.stringify(call.body ?? {}); }
    let result;
    try {
      const response = await fetch(url, { method: record.method, headers, body, signal: AbortSignal.timeout(20000) });
      const text = await response.text();
      let payload; try { payload = JSON.parse(text); } catch {}
      result = { httpStatus: response.status, code: payload?.code ?? null, fieldCount: collectFields(payload).length };
    } catch (error) {
      if (pending >= 0) expected.splice(pending, 1);
      drifted.push({ key: record.key, path: record.path, method: record.method, differences: [`replay failed: ${error.cause?.code ?? error.name}`] });
      continue;
    }
    const differences = [];
    if (then.httpStatus !== result.httpStatus) differences.push(`http ${then.httpStatus} -> ${result.httpStatus}`);
    if ((then.code ?? null) !== result.code) differences.push(`code ${then.code} -> ${result.code}`);
    if (fieldCountDiffers(then.fieldCount, result.fieldCount)) differences.push(`fields ${then.fieldCount} -> ${result.fieldCount}`);
    if (pending >= 0) expected.splice(expected.indexOf(expected.find((e) => e.key === record.key)), 1);
    if (differences.length === 0) verifiedResolved.push(record.key);
    else drifted.push({ key: record.key, path: record.path, method: record.method, differences });
  }
}

const lines = [];
lines.push("# Route Sweep Drift", "");
lines.push("Compares the latest full-surface sweep with the stored baseline. Only routes that are live in BOTH");
lines.push("sweeps are compared; a sweep run with different skip flags or a different collector version is not");
lines.push("server-side drift, so re-baseline after changing the sweep script. A changed HTTP status, business");
lines.push("code, or field count is listed here so a real change is noticed.");
lines.push("");
lines.push(`- Baseline: \`${path.basename(baselinePath)}\` created ${baseline.createdAt}`);
lines.push(`- Compared sweep: ${current.ranAt ?? "(no timestamp)"}`);
lines.push(`- Routes: ${after.size} current, ${before.size} in baseline`);
lines.push("");
lines.push("## Summary", "");
lines.push("| Category | Count |");
lines.push("| --- | ---: |");
lines.push(`| Drift (needs review) | ${drifted.length} |`);
lines.push(`| Expected difference (parameterized route) | ${expected.length} |`);
  lines.push(`| Verified parameterized route | ${verifiedResolved.length} |`);
lines.push(`| Coverage change (different skip flags) | ${coverage.length} |`);
lines.push(`| Added routes | ${added.length} |`);
lines.push(`| Removed routes | ${removed.length} |`);
lines.push("");

if (drifted.length > 0) {
  lines.push("## Drift", "");
  lines.push("| Route | Method | Change |");
  lines.push("| --- | --- | --- |");
  for (const d of drifted) lines.push(`| \`${d.path}\` | ${d.method} | ${d.differences.join("; ")} |`);
  lines.push("");
}
if (expected.length > 0) {
  lines.push("## Expected Differences (Parameterized Routes)", "");
  lines.push("These routes were re-probed with resolved inputs; a generic sweep is expected to disagree.", "");
  lines.push("| Route | Method | Change |");
  lines.push("| --- | --- | --- |");
  for (const d of expected) lines.push(`| \`${d.path}\` | ${d.method} | ${d.differences.join("; ")} |`);
  lines.push("");
}
if (added.length + removed.length > 0) {
  lines.push("## Added / Removed", "");
  for (const k of added) lines.push(`- added: \`${k}\``);
  for (const k of removed) lines.push(`- removed: \`${k}\``);
  lines.push("");
}
if (drifted.length === 0 && expected.length === 0 && added.length === 0 && removed.length === 0 && coverage.length === 0) {
  lines.push("No drift detected: every route matches the baseline.", "");
}

await writeFile(path.join(serverDir, "DRIFT.md"), lines.join("\n"), "utf8");
await writeFile(path.join(serverDir, "route-drift.json"), JSON.stringify({ comparedAt: new Date().toISOString(), baselineCreatedAt: baseline.createdAt, drift: drifted, expected, coverageChange: coverage.map((c) => c.path), added, removed }, null, 2) + "\n", "utf8");

if (updateBaseline) {
  await writeFile(baselinePath, JSON.stringify({ createdAt: new Date().toISOString(), routes: [...after.values()] }, null, 2), "utf8");
  console.log(`Baseline updated from ${current.results.length} routes.`);
}
console.log(`Drift: ${drifted.length} | expected (parameterized): ${expected.length} | coverage: ${coverage.length} | added: ${added.length} | removed: ${removed.length}`);

// Drift must fail the chain. Without this the audit reported PASS while the report listed changes.
// --update-baseline is the explicit "accept the new state" action, so it exits 0.
if (drifted.length > 0 && !updateBaseline) {
  console.error(`${drifted.length} route(s) drifted from the baseline; review DRIFT.md or re-baseline with --update-baseline`);
  process.exit(1);
}
