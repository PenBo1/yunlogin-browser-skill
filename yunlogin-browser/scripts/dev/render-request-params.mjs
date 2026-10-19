#!/usr/bin/env node

/**
 * Render the request-parameter contract for the cataloged server API.
 *
 * Part 1 lists every cataloged endpoint's required fields and defaults from endpoints.json.
 * Part 2 summarises the measured behaviour of enum-like request parameters from
 * probe-request-params.mjs: whether a value filters, is ignored, falls through, or only type-checks.
 *
 * Usage:
 *   node scripts/dev/render-request-params.mjs --probe <probe.json> [--out <md>]
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
const probePath = option("--probe");
if (!probePath) throw new Error("--probe <file.json> is required");
const outputPath = option("--out", path.join(serverDir, "REQUEST_PARAMS.md"));

const catalog = JSON.parse(await readFile(path.join(serverDir, "endpoints.json"), "utf8"));
const probe = JSON.parse(await readFile(probePath, "utf8"));

const lines = [];
lines.push("# Server API Request Parameters", "");
lines.push("Part 1 is the request contract for every cataloged endpoint: method, path, required fields, and");
lines.push("the defaults the skill sends. Part 2 is measured behaviour for the enum-like request parameters -");
lines.push("which values actually filter, which are ignored, and which only fail a type check.");
lines.push("");
lines.push("- Per-parameter measured effects: [PARAMETER_MATRIX.md](PARAMETER_MATRIX.md)");
lines.push("- Write-route parameters: [WRITE_ROUTE_PARAMS.md](WRITE_ROUTE_PARAMS.md)");
lines.push("");
lines.push("## Part 1 - Cataloged Request Contract", "");
lines.push("| Endpoint | Method | Path | Required | Notable defaults |");
lines.push("| --- | --- | --- | --- | --- |");
for (const e of catalog.endpoints) {
  const required = [...(e.body_required ?? []), ...(e.query_required ?? [])];
  const defaults = { ...(e.query_defaults ?? {}), ...(e.body_defaults ?? {}) };
  const notable = Object.entries(defaults)
    .filter(([, v]) => v !== "" && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .slice(0, 8)
    .join(", ");
  lines.push(`| \`${e.id}\` | ${e.method} | \`${e.path}\` | ${required.length ? required.map((r) => `\`${r}\``).join(", ") : "-"} | ${notable || "-"} |`);
}
lines.push("");

lines.push("## Part 2 - Measured Enum Parameter Behaviour", "");
lines.push("`rows`/`total` come from the live response; they are what reveal whether a filter ran.");
lines.push("");

const groups = new Map();
for (const c of probe.cases) {
  const key = `${c.endpoint}|${c.param}`;
  if (!groups.has(key)) groups.set(key, { endpoint: c.endpoint, param: c.param, path: c.path, cases: [] });
  groups.get(key).cases.push(c);
}

const verdicts = [];
for (const g of groups.values()) {
  // Some routes answer without a `code` field at all and return a bare list/count envelope.
  const ok = g.cases.filter((c) => c.code === 200 || c.code === 0 || (c.code === undefined && !c.error && c.httpStatus === 200 && (c.rows !== null || c.total !== null)));
  const failed = g.cases.filter((c) => c.error || (c.code !== undefined && c.code !== 200 && c.code !== 0));
  const sigs = new Set(ok.map((c) => `${c.rows}|${c.total}`));
  let verdict;
  if (ok.length === 0) verdict = "no successful case";
  else if (sigs.size === 1) verdict = "ignored (every value returns the same rows)";
  else verdict = "filtered";
  const baseline = ok[0];
  const fallthrough = baseline && ok.some((c) => c.value !== ok[0].value && c.rows === baseline.rows && c.total === baseline.total && c.value !== undefined);
  verdicts.push({ ...g, verdict, failed, fallthrough, signatures: sigs.size });

  lines.push(`### \`${g.endpoint}\` - \`${g.param}\``, "");
  lines.push(`- Route: \`${g.path}\``);
  lines.push(`- Verdict: **${verdict}**${fallthrough && sigs.size > 1 ? " (some out-of-range values fall through to the baseline result)" : ""}`);
  lines.push("");
  lines.push("| Value | Code | Rows | Total | Message |");
  lines.push("| --- | --- | ---: | ---: | --- |");
  for (const c of g.cases) {
    // Escape non-ASCII so the document stays ASCII-only while keeping the measured value.
      const rawValue = typeof c.value === "string" ? `"${c.value}"` : String(c.value);
      const value = rawValue.replace(/[^\x20-\x7E]/g, (ch) => "\\u" + ch.codePointAt(0).toString(16).padStart(4, "0"));
    const msg = String(c.msg ?? c.error ?? "").replace(/\|/g, "\\|").slice(0, 60);
    lines.push(`| \`${value}\` | ${c.code ?? "-"} | ${c.rows ?? "-"} | ${c.total ?? "-"} | ${msg} |`);
  }
  lines.push("");
}

lines.push("## Cross-Cutting Rules", "");
lines.push("| Rule | Evidence |");
lines.push("| --- | --- |");
lines.push("| Types are enforced, ranges usually are not | A string where an int is expected fails with `strconv.ParseInt: parsing \\\"abc\\\": invalid syntax` (`code: 401`). |");
lines.push("| Out-of-range values often fall through | `vcnplist status=99` returns the same 4 rows as `status=0`. |");
lines.push("| Unmatched values return an empty list, not an error | `findDeviceDynamicProxies status=1/2/99` all return `total: 0`. |");
lines.push("| Some filters are dead on this surface | `findDeviceProxyUserSelves proxy_type` and `findDeviceDynamicProxies ip_type` return identical rows for every value, including bogus strings. |");
lines.push("| `noticeType` collapses | `0` and `3` both return the full 108 notices; `1`, `2`, `-1`, `99` all return an empty list. |");
lines.push("");
lines.push(`Probe time: ${probe.testedAt}. Values are from the tested account; a filter that returns zero rows here may`);
lines.push("return rows on an account that owns matching resources.");
lines.push("");

await writeFile(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${path.relative(skillDir, outputPath)}: ${groups.size} parameters, ${probe.cases.length} cases`);
