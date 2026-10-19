#!/usr/bin/env node

/**
 * End-to-end audit for the management-center API research artifacts.
 *
 * Runs the full chain in order and fails when anything changed, any write round trip failed to
 * persist or restore, any delete left a row behind, or any probe resource is still on the account:
 *
 *   1. documentation validation
 *   2. route drift check with a live replay of the parameterized routes
 *   3. write-effectiveness round trips (regenerates the evidence document)
 *   4. delete-semantics round trips (regenerates the evidence document)
 *   5. residue check across every resource type the probes touch
 *
 * Usage:
 *   node scripts/dev/run-api-audit.mjs [--skip-heavy] [--json]
 *
 * Network access: the drift replay and the two round-trip stages call the live server. --skip-heavy
 * keeps only stage 1 and stage 5's documentation-side checks.
 */

import { spawnSync } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readServerToken, readServerIdentity } from "../lib/local-token-store.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const args = process.argv.slice(2);
const skipHeavy = args.includes("--skip-heavy");
const asJson = args.includes("--json");
const faultIndex = args.indexOf("--fault");
const fault = faultIndex >= 0 ? args[faultIndex + 1] ?? "" : "";

const stages = [];
function runNode(script, scriptArgs, label) {
  const started = Date.now();
  const result = spawnSync(process.execPath, [path.join(scriptDir, script), ...scriptArgs], { cwd: skillDir, encoding: "utf8" });
  const ok = result.status === 0;
  stages.push({ name: label, ok, ms: Date.now() - started, detail: (result.stdout || result.stderr || "").trim().split("\n").slice(-1)[0] ?? "" });
  return { ok, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

runNode("validate-api-docs.mjs", [], "documentation validator");
runNode("check-links.mjs", [], "link check");

if (!skipHeavy) {
  runNode("detect-route-drift.mjs", ["--current", path.join("references", "server-api", "route-sweep.json"), "--verify-resolved"], "route drift and parameterized replay");

  const wePath = path.join(os.tmpdir(), "yunlogin-audit-write.json");
  const writeProbe = runNode("probe-write-effectiveness.mjs", ["--output", wePath], "write effectiveness round trips");
  if (writeProbe.ok) runNode("render-write-effectiveness.mjs", ["--input", wePath], "write effectiveness document");

  const dsPath = path.join(os.tmpdir(), "yunlogin-audit-delete.json");
  const deleteProbe = runNode("probe-delete-semantics.mjs", ["--output", dsPath], "delete semantics round trips");
  if (deleteProbe.ok) runNode("render-delete-semantics.mjs", ["--input", dsPath], "delete semantics document");

  // Refresh the value-domain documents from the same live evidence so the numbers never drift.
  const catPath = path.join(os.tmpdir(), "yunlogin-audit-catalog.json");
  const valPath = path.join(os.tmpdir(), "yunlogin-audit-values.json");
  const catProbe = runNode("probe-server-api.mjs", ["--output", catPath], "catalog field probe");
  const valProbe = runNode("probe-route-values.mjs", ["--output", valPath], "route value-domain probe");
  // endpoints.json records every cataloged endpoint as HTTP 200. Assert that live, so a route that stops
  // answering fails the audit instead of silently shrinking the generated field documents - the field probe
  // itself exits 0 whatever the server returns.
  if (catProbe.ok) {
    try {
      const inventory = JSON.parse(await readFile(catPath, "utf8"));
      const catalog = JSON.parse(await readFile(path.join(skillDir, "references", "server-api", "endpoints.json"), "utf8"));
      const byId = new Map((inventory.results ?? []).map((r) => [r.id, r]));
      const problems = [];
      for (const endpoint of catalog.endpoints) {
        const result = byId.get(endpoint.id);
        if (!result) problems.push(`${endpoint.id} not probed`);
        else if (result.mode !== "skipped" && result.httpStatus !== 200) problems.push(`${endpoint.id} http ${result.httpStatus}`);
      }
      // A skip is only acceptable with a stated reason, so a route cannot quietly drop out of the probe.
      for (const result of byId.values()) {
        if (result.mode !== "skipped") continue;
        const recognised = typeof result.reason === "string" || Array.isArray(result.missingContext);
        if (!recognised) problems.push(`${result.id} skipped without a reason`);
      }
      const answered = [...byId.values()].filter((r) => r.mode !== "skipped").length;
      const skipped = [...byId.values()].filter((r) => r.mode === "skipped").map((r) => r.id);
      stages.push({
        name: "catalog endpoints still live",
        ok: problems.length === 0,
        ms: 0,
        detail: problems.length ? problems.slice(0, 6).join("; ") : `${answered} of ${catalog.endpoints.length} answered HTTP 200; skipped: ${skipped.join(", ") || "none"}`,
      });
    } catch (error) {
      stages.push({ name: "catalog endpoints still live", ok: false, ms: 0, detail: String(error?.message ?? error).slice(0, 140) });
    }
  }

  // The value-domain probe must account for every live route: the read-only routes it re-probes plus the
  // mutations it refuses to replay have to add up to the sweep's live count. Without that identity a probe
  // that silently stopped answering would shrink the generated value document while the audit stayed green.
  if (valProbe.ok) {
    try {
      const values = JSON.parse(await readFile(valPath, "utf8"));
      const accounted = (values.endpointCount ?? 0) + (values.skippedMutationRoutes ?? 0);
      const problems = [];
      if (accounted !== values.liveRoutes) problems.push(`${values.endpointCount} probed + ${values.skippedMutationRoutes} skipped != ${values.liveRoutes} live`);
      const malformed = (values.results ?? []).filter((r) => typeof r.httpStatus !== "number" && typeof r.error !== "string");
      if (malformed.length) problems.push(`${malformed.length} results have neither httpStatus nor error`);
      stages.push({
        name: "value probe accounts for every live route",
        ok: problems.length === 0,
        ms: 0,
        detail: problems.length ? problems.join("; ") : `${values.endpointCount} probed + ${values.skippedMutationRoutes} skipped = ${values.liveRoutes} live`,
      });
    } catch (error) {
      stages.push({ name: "value probe accounts for every live route", ok: false, ms: 0, detail: String(error?.message ?? error).slice(0, 140) });
    }
  }

  if (catProbe.ok && valProbe.ok) runNode("render-field-values.mjs", ["--catalog", catPath, "--routes", valPath], "value domain document");
  if (catProbe.ok && valProbe.ok) runNode("render-domain-index.mjs", [], "domain index document");
  runNode("render-coverage.mjs", [], "coverage summary document");
}

const base = "https://d126447d359e70c0.yunlogin.com";
const token = await readServerToken();
const identity = await readServerIdentity();
const H = { accept: "application/json, text/plain, */*", authorization: `Bearer ${token}`, "content-type": "application/json", lang: "zh", "pay-lang": "zh-TW" };
async function call(method, routePath, body, query) {
  const url = new URL(routePath, base);
  for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, String(v));
  const init = { method, headers: H, signal: AbortSignal.timeout(30000) };
  if (method !== "GET") init.body = JSON.stringify(body ?? {});
  const response = await fetch(url, init);
  const text = await response.text();
  let payload; try { payload = JSON.parse(text); } catch {}
  return payload ?? {};
}

function countMatches(rows, needle) {
  return rows.filter((row) => JSON.stringify(row).includes(needle)).length;
}

// Resolve the first candidate path that yields an array. `null` with a numeric sibling `count` is a valid
// empty answer; anything else is unscanned, so the gate fails instead of reporting a clean zero.
function readRows(payload, paths) {
  const at = (p) => p.split(".").reduce((a, k) => (a == null ? undefined : a[k]), payload);
  for (const p of paths) if (Array.isArray(at(p))) return at(p);
  for (const p of paths) {
    if (at(p) !== null) continue;
    // A null list is a valid empty answer when the envelope states a numeric total. Both spellings are in
    // use: `count` (plugin groups, RPA groups) and `total` (credentials, dynamic proxies).
    const parent = p.includes(".") ? p.slice(0, p.lastIndexOf(".")) : "";
    const container = parent ? at(parent) : payload;
    if (container && (typeof container.count === "number" || typeof container.total === "number")) return [];
  }
  return null;
}

// Every resource row records whether the scan actually read a collection. A row that could not is marked
// unscanned, and the stage fails on that too, so no row can report a clean zero it never verified.
function residueRow(resource, ok, scanned, matches) {
  return { resource, scanned: ok ? scanned : 0, matches: ok ? matches : 0, ...(ok ? {} : { unscanned: true }) };
}

async function scanResidue() {
const residue = [];
{
  const envs = await call("POST", "/v2/newbrowser/getconditionshops", { number: 500, offer: 0, companyid: identity.companyId, userid: identity.userId });
  const envRows = readRows(envs, ["shop"]);
  residue.push(residueRow("environments", envRows !== null, envRows?.length ?? 0, countMatches(envRows ?? [], "codex")));

  const recycled = await call("POST", "/v2/newbrowser/getrecycleshoplist", { page: 1, pageSize: 500 });
  const recycledRows = readRows(recycled, ["data.list", "data.data"]);
  residue.push(residueRow("environments (recycle)", recycledRows !== null, recycledRows?.length ?? 0, countMatches(recycledRows ?? [], "codex")));

  const tags = await call("GET", "/v2/proxy/device/findTags", undefined, { companyid: identity.companyId, userid: identity.userId, page: 1, per_page: 300 });
  const tagRows = readRows(tags, ["data.data", "data.list"]);
  // A generated body creates an empty-name tag, so count those as residue as well.
  residue.push(residueRow("proxy tags", tagRows !== null, tagRows?.length ?? 0, countMatches(tagRows ?? [], "codex") + (tagRows ?? []).filter((t) => !String(t.name ?? "").trim()).length));

  const groups = await call("POST", "/v2/newbrowser/getgroups", { companyid: identity.companyId, userid: identity.userId });
  const groupRows = readRows(groups, ["group", "data.list"]);
  residue.push(residueRow("environment groups", groupRows !== null, groupRows?.length ?? 0, countMatches(groupRows ?? [], "codex") + (groupRows ?? []).filter((g) => !String(g.name ?? "").trim()).length));

  const platforms = await call("POST", "/v2/newbrowser/getalluserselfuri", { company: identity.company ?? "", companyid: identity.companyId, userid: identity.userId });
  const platformRows = readRows(platforms, ["self"]);
  residue.push(residueRow("custom platforms", platformRows !== null, platformRows?.length ?? 0, countMatches(platformRows ?? [], "codex")));

  const creds = await call("POST", "/v2/newbrowser/getUserPasswordList", { page: 1, pageSize: 500, number: 500, offer: 0 });
  const credRows = readRows(creds, ["data.list", "data.date"]);
  residue.push(residueRow("credentials", credRows !== null, credRows?.length ?? 0, countMatches(credRows ?? [], "codex")));

  // The `/v2/cost/invoice_user/` family is excluded from this skill by owner decision (2026-10-12);
  // its routes are not catalogued or swept, so no residue row is needed here.

  const proxies = await call("GET", "/v2/proxy/device/findDeviceProxyUserSelves", undefined, { status: 1, trademark: "self", page: 1, per_page: 500, companyid: identity.companyId, userid: identity.userId });
  const proxyRows = readRows(proxies, ["data.data"]);
  residue.push(residueRow("self proxies", proxyRows !== null, proxyRows?.length ?? 0, countMatches(proxyRows ?? [], "codex-probe")));

  const roleGroups = await call("POST", "/v2/team/role-group/page", { pageIndex: 1, pageSize: 300, total: 0 });
  const roleGroupList = readRows(roleGroups, ["data.list", "data.data", "data"]);
  // The live sweep used to call role-group/create with a generic body and leave an empty-name row behind.
  const emptyRoleGroups = (roleGroupList ?? []).filter((g) => !String(g.name ?? "").trim() && Number(g.isDefault) === 0);
  residue.push(residueRow("role groups", roleGroupList !== null, roleGroupList?.length ?? 0, countMatches(roleGroupList ?? [], "codex-del-") + emptyRoleGroups.length));

  const dynActive = await call("GET", "/v2/proxy/device/findDeviceDynamicProxies", undefined, { status: 0, trademark: "general", page: 1, per_page: 500, companyid: identity.companyId, userid: identity.userId });
  const dynRecycle = await call("GET", "/v2/proxy/device/findDeviceDynamicProxies", undefined, { status: 1, trademark: "general", page: 1, per_page: 500, companyid: identity.companyId, userid: identity.userId });
  const dynActiveRows = readRows(dynActive, ["data.data"]);
  const dynRecycleRows = readRows(dynRecycle, ["data.data"]);
  const dynRows = dynActiveRows !== null && dynRecycleRows !== null ? [...dynActiveRows, ...dynRecycleRows] : null;
  residue.push(residueRow("dynamic proxies", dynRows !== null, dynRows?.length ?? 0, countMatches(dynRows ?? [], "codex-del-")));

  const depts = await call("POST", "/v2/team/getDepts", {});
  const deptJson = depts && typeof depts.data === "object" && depts.data !== null ? JSON.stringify(depts.data) : null;
  residue.push(residueRow("departments", deptJson !== null, (deptJson?.match(/departmentName/g) ?? []).length, (deptJson?.match(/codex-/g) ?? []).length));

  // RPA groups come back as a top-level list. A generated body creates an empty-name group, so count those too.
  const rpaGroups = await call("GET", "/v2/rpa/getRpaGroupList", undefined, {});
  const rpaRows = readRows(rpaGroups, ["list"]);
  const rpaBad = (rpaRows ?? []).filter((g) => !String(g.name ?? "").trim() || JSON.stringify(g).includes("codex")).length;
  residue.push(residueRow("rpa groups", rpaRows !== null, rpaRows?.length ?? 0, rpaBad));

  // gitPluginGroupList needs its paging and group-type params; without them the server answers an
  // error and this row used to report scanned: 0, which let real empty-name rows pass the gate.
  const pluginGroupRows = [];
  let pluginGroupScanned = true;
  // groupType 0 holds the rows createPluginGroup actually writes; scanning only 1 and 2 missed
  // two empty-name plugin groups that a probe left behind on 2026-10-09.
  for (const groupType of [0, 1, 2]) {
    const page = await call("GET", "/v2/plugin/group/gitPluginGroupList", undefined, { pageIndex: 1, sort: 2, pageSize: 10086, groupType });
    const rows = readRows(page, ["list", "data.list"]);
    if (rows === null) { pluginGroupScanned = false; break; }
    pluginGroupRows.push(...rows);
  }
  // createPluginGroup stores groupName verbatim, so an empty name is the residue signature here.
  const pluginGroupBad = pluginGroupRows.filter((row) => {
    const group = row.pluginGroup ?? row;
    return !String(group.groupName ?? group.name ?? "").trim() || JSON.stringify(row).includes("codex");
  }).length;
  residue.push({ resource: "plugin groups", scanned: pluginGroupRows.length, matches: pluginGroupBad, ...(pluginGroupScanned ? {} : { unscanned: true }) });

  const promoLinks = await call("GET", "/v2/retail/getPromotionLinkList", undefined, {});
  const promoRows = readRows(promoLinks, ["data.list"]);
  const promoJson = JSON.stringify(promoLinks.data ?? {});
  residue.push(residueRow("promotion links", promoRows !== null, (promoJson.match(/promotionLinkId/g) ?? []).length, (promoJson.match(/codex/g) ?? []).length));
}
  return residue;
}
// Deterministic fault for verify-audit-gates.mjs: pretend one resource holds a probe row, so the
// gate can be proved to block without writing anything to the account. Re-applied after the retry
// re-scan, which would otherwise read the clean account and clear the injected fault.
const injectResidueFault = (rows) => fault === "residue"
  ? [...rows, { resource: "plugin groups (injected fault)", scanned: 1, matches: 1 }]
  : rows;
let residue = injectResidueFault(await scanResidue());
let residueMatches = residue.reduce((total, r) => total + r.matches, 0);
const residueUnscanned = () => residue.filter((r) => r.unscanned).length;
if (residueMatches > 0 || residueUnscanned() > 0) {
  // A throwaway row can linger for a moment right after a delete; re-scan once before failing.
  await new Promise((resolve) => setTimeout(resolve, 3000));
  residue = injectResidueFault(await scanResidue());
  residueMatches = residue.reduce((total, r) => total + r.matches, 0);
}
stages.push({ name: "residue check", ok: residueMatches === 0 && residueUnscanned() === 0, ms: 0, detail: residueUnscanned() > 0 ? `${residueUnscanned()} resource type(s) could not be scanned: ${residue.filter((r) => r.unscanned).map((r) => r.resource).join(", ")}` : residueMatches === 0 ? `${residue.reduce((t, r) => t + r.scanned, 0)} rows scanned, no probe residue` : `${residueMatches} probe rows still present` });

// The round-trip stages only need their JSON long enough to render the documents.
await rm(path.join(os.tmpdir(), "yunlogin-audit-write.json"), { force: true });
await rm(path.join(os.tmpdir(), "yunlogin-audit-delete.json"), { force: true });
await rm(path.join(os.tmpdir(), "yunlogin-audit-catalog.json"), { force: true });
await rm(path.join(os.tmpdir(), "yunlogin-audit-values.json"), { force: true });

const failed = stages.filter((s) => !s.ok);
if (asJson) {
  console.log(JSON.stringify({ auditedAt: new Date().toISOString(), stages, residue, ok: failed.length === 0 }, null, 2));
} else {
  for (const stage of stages) console.log(`${stage.ok ? "PASS" : "FAIL"}  ${stage.name.padEnd(42)} ${stage.detail}`);
  console.log("");
  for (const r of residue) console.log(`  ${r.resource.padEnd(20)} scanned=${String(r.scanned).padEnd(5)} probe rows=${r.matches}`);
  console.log(`\naudit ${failed.length === 0 ? "PASSED" : "FAILED"} (${stages.length} stages, ${failed.length} failing)`);
}
process.exit(failed.length === 0 ? 0 : 1);
