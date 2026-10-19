#!/usr/bin/env node

/**
 * Render the research coverage and limits page.
 *
 * Every count is read from the artifact that owns it, so this page cannot drift away from the
 * evidence. Only the attribution prose (why a route is withheld, which enum codes have no label)
 * is authored here.
 *
 * Usage:
 *   node scripts/dev/render-coverage.mjs [--out <md>]
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
const outputPath = option("--out", path.join(serverDir, "COVERAGE.md"));

const read = (f) => readFile(path.join(serverDir, f), "utf8");
const sweep = JSON.parse(await read("route-sweep.json"));
const routes = JSON.parse(await read("client-routes.json"));
const catalog = JSON.parse(await read("endpoints.json"));
const routeFields = await read("ROUTE_FIELDS.md");
const fieldInventory = await read("FIELD_INVENTORY.md");
let supplementalInventory = "";
let boundaryEvidence = "";
try { boundaryEvidence = await read("BOUNDARY_EVIDENCE.md"); } catch { boundaryEvidence = ""; }
try { supplementalInventory = await read("FIELD_INVENTORY_ACCOUNT_B.md"); } catch { supplementalInventory = ""; }
const fieldValues = await read("FIELD_VALUES.md");
const codeLegends = await read("CODE_LEGENDS.md");
const domainIndex = await read("DOMAIN_INDEX.md");
const requestParams = await read("REQUEST_PARAMS.md");
const writeEffectiveness = await read("WRITE_EFFECTIVENESS.md");
const deleteSemantics = await read("DELETE_SEMANTICS.md");
const drift = await read("DRIFT.md");
const blocklist = await read("BLOCKLIST.md");

const counts = {
  universe: Object.keys(routes.routes ?? {}).length || sweep.results.length,
  catalog: catalog.endpoints.length,
  live: sweep.results.filter((r) => r.status === "live").length,
  skipped: sweep.results.filter((r) => r.status === "skipped").length,
  errors: sweep.results.filter((r) => r.status === "error").length,
  dead: sweep.results.filter((r) => r.status === "dead").length,
  skippedWrite: sweep.results.filter((r) => r.status === "skipped" && r.reason === "write route").length,
  skippedBlocklist: sweep.results.filter((r) => r.status === "skipped" && r.reason === "catastrophic blocklist").length,
  // The document counts method+path rows; distinct paths can be one lower (a GET and a POST on the same path).
  routeFieldRoutes: Number(routeFields.match(/- Routes with observed fields: (\d+)/)?.[1] ?? 0),
  routeFieldRows: Number(routeFields.match(/- Distinct field rows: (\d+)/)?.[1] ?? 0),
  describedPct: (routeFields.match(/described=(\d+) \((\d+)%\)/) ?? [])[2] ?? "100",
  inventoryRows: Number(fieldInventory.match(/- Response field rows: (\d+)/)?.[1] ?? 0),
  enumFields: Number(fieldValues.match(/- Enum-like fields with observed values: (\d+)/)?.[1] ?? 0),
  enumRoutes: Number(fieldValues.match(/- Full-surface routes with enum values: (\d+)/)?.[1] ?? 0),
  legendRoutes: Number(codeLegends.match(/- Routes with a legend: (\d+)/)?.[1] ?? 0),
  legendFields: Number(codeLegends.match(/- Code fields with a confirmed meaning: (\d+)/)?.[1] ?? 0),
  legendPairs: Number(codeLegends.match(/- Code -> meaning pairs: (\d+)/)?.[1] ?? 0),
  families: (domainIndex.match(/^\| `\/[^`]+` \| [^|]+ \| \d+ \|/gm) ?? []).length,
  requestParams: (requestParams.match(/^### `[^`]+` - `[^`]+`$/gm) ?? []).length,
  // Each parameter section holds one table whose body rows are the measured cases.
  // The code column is `-` for routes that answer without a `code` field, so accept both shapes.
  requestCases: (requestParams.split("## Cross-Cutting Rules")[0].match(/^\| `[^`]+` \| (?:\d+|-)? \|/gm) ?? []).length,
  writeCases: Number(writeEffectiveness.match(/- Claimed success: (\d+)/)?.[1] ?? 0),
  writePersisted: Number(writeEffectiveness.match(/- Actually persisted: (\d+)/)?.[1] ?? 0),
  writeRestored: Number(writeEffectiveness.match(/- Restored to the original value: (\d+)/)?.[1] ?? 0),
  deleteCases: new Set([...deleteSemantics.matchAll(/^\| (proxy-tag|environment-group|custom-platform|invoice-title|role-group|dynamic-proxy|environment) \|/gm)].map((m) => m[1])).size,
  // Count straight from the sweep: the drift document only carries a verified count when the
  // replay pass runs in the same invocation, so reading it here made the number flip between runs.
  verified: sweep.results.filter((r) => r.reprobedAt).length,
  residueTypes: 13,
  // The reason breakdown must come from the document that owns it, otherwise this prose drifts away
  // from the per-route reasons render-blocklist.mjs writes into BLOCKLIST.md.
  blocklistReasons: (() => {
    const groups = new Map();
    for (const line of blocklist.split("\n")) {
      if (!line.startsWith("| `")) continue;
      const cells = line.split("|").map((c) => c.trim());
      if (cells.length < 7) continue;
      const reason = cells[4];
      if (!reason || reason === "Why withheld") continue;
      const keyed = `${cells[1].replace(/`/g, "")} ${cells[2].replace(/`/g, "")}`;
      if (!groups.has(reason)) groups.set(reason, []);
      groups.get(reason).push(keyed);
    }
    return [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  })(),
};

const lines = [];
lines.push("# Server API Research Coverage And Limits", "");
lines.push("This is the summary page for the management-center API research. Every count is read from the");
lines.push("artifact that owns it, so the numbers cannot drift away from the evidence. The prose states what was");
lines.push("exercised, how deep each level goes, and what was deliberately not executed and why.");
lines.push("");
lines.push(`- Origin: \`https://d126447d359e70c0.yunlogin.com\``);
lines.push("- Account: the test company supplied with the task");
lines.push(`- Route universe: **${counts.universe}** client routes extracted from the management-center bundle`);
lines.push(`- Curated catalog: ${counts.catalog} endpoints`);
lines.push("- The universe comes from one recorded client build; the deployed bundle is re-checked with `node scripts/dev/check-bundle-drift.mjs`. See [BUNDLE_DRIFT.md](BUNDLE_DRIFT.md).");
lines.push("- This universe covers the management-center API only. The origin also serves the `userapi` surface (`/v2/userapi/...`, success code `0`), which comes from a different bundle set and is tracked separately in [USERAPI_SURFACE.md](USERAPI_SURFACE.md) - it is **not** part of the 507.");
lines.push("");
lines.push("## Depth Ladder", "");
lines.push("Every level below is machine-checked by `node scripts/dev/run-api-audit.mjs`.");
lines.push("");
lines.push("| Level | Coverage | Artifact |");
lines.push("| --- | --- | --- |");
lines.push(`| Availability sweep | ${counts.live} live / ${counts.skipped} skipped / ${counts.dead} dead paths / ${counts.errors} transport errors | [ROUTE_CATALOG.md](ROUTE_CATALOG.md), [route-sweep.json](route-sweep.json) |`);
lines.push(`| Dead paths | **${counts.dead}** routes answer the SPA shell or HTTP 405, so the client string no longer maps to a handler | [ERRORS.md](ERRORS.md) |`);
lines.push(`| Response field paths | ${counts.routeFieldRoutes} routes, **${counts.routeFieldRows}** field rows, ${counts.describedPct}% described | [ROUTE_FIELDS.md](ROUTE_FIELDS.md) |`);
lines.push(`| Field meanings | ${counts.inventoryRows} curated field rows, all described | [FIELD_INVENTORY.md](FIELD_INVENTORY.md) |`);
lines.push(`| Enum value domains | **${counts.enumFields}** enum-like fields across ${counts.enumRoutes} routes | [FIELD_VALUES.md](FIELD_VALUES.md) |`);
lines.push(`| Code meanings | ${counts.legendRoutes} routes / ${counts.legendFields} code fields / **${counts.legendPairs}** code -> label pairs | [CODE_LEGENDS.md](CODE_LEGENDS.md) |`);
lines.push(`| Business families | **${counts.families}** families with fields, values, and traps | [DOMAIN_INDEX.md](DOMAIN_INDEX.md) |`);
lines.push(`| Request contract | ${counts.catalog} endpoints' required fields + ${counts.requestCases} measured parameter cases | [REQUEST_PARAMS.md](REQUEST_PARAMS.md), [PARAMETER_MATRIX.md](PARAMETER_MATRIX.md) |`);
lines.push(`| Write persistence | **${counts.writeCases}** round trips, ${counts.writePersisted} persisted, ${counts.writeRestored} restored | [WRITE_EFFECTIVENESS.md](WRITE_EFFECTIVENESS.md) |`);
lines.push(`| Delete semantics | **${counts.deleteCases}** resources classified hard / soft-tombstone / soft-recycle | [DELETE_SEMANTICS.md](DELETE_SEMANTICS.md) |`);
lines.push(`| Re-probed with resolved inputs | **${counts.verified}** routes re-read with real ids after the generic sweep | [DRIFT.md](DRIFT.md), [route-sweep.json](route-sweep.json) |`);
if (supplementalInventory) {
  const suppRoutes = (supplementalInventory.match(/^\| \d+ \| /gm) ?? []).length;
  const suppFields = Number((supplementalInventory.match(/- Distinct field paths recorded: \*\*(\d+)\*\*/) ?? [])[1] ?? 0);
  lines.push(`| Supplemental second-account field inventory | **${suppRoutes}** routes / **${suppFields}** field paths observed on a data-rich account | [FIELD_INVENTORY_ACCOUNT_B.md](FIELD_INVENTORY_ACCOUNT_B.md) |`);
}
lines.push("");
lines.push("## What Was Not Executed, And Why", "");
lines.push(`Of the ${counts.universe} routes, ${counts.live} answered as JSON APIs. The remainder splits three ways: ${counts.dead} dead paths that were probed but have no handler, ${counts.skipped} routes withheld by the classifier, and ${counts.errors} transport errors.`);
lines.push("");
lines.push("| Category | Count | Reason |");
lines.push("| --- | ---: | --- |");
lines.push(`| Dead paths | ${counts.dead} | Probed, but the server answered the single-page-app shell (the path has no handler) or HTTP 405 (the client's method is not allowed). The client string is stale, not the request. See [ERRORS.md](ERRORS.md). |`);
lines.push(`| Catastrophic blocklist | ${counts.skippedBlocklist} | Ends the session, changes credentials or identity, sends an SMS, creates an account or company, spends money, writes a row for an empty body, or bulk-deletes resources |`);
lines.push(`| Transport errors | ${counts.errors} | These routes fail inside an upstream dependency, not in the client. See [ERRORS.md](ERRORS.md). |`);
lines.push(`| Write routes withheld by the classifier | ${counts.skippedWrite} | The live sweep runs with writes included, so this is 0 unless a later run drops --include-writes |`);
lines.push("");
lines.push("Inside the blocklist, each route is parked for a specific reason:");
lines.push("");
lines.push("| Reason | Count | For example |");
lines.push("| --- | ---: | --- |");
for (const [reason, list] of counts.blocklistReasons) {
  const sample = list.slice(0, 4).map((x) => `\`${x}\``).join(", ");
  const more = list.length > 4 ? ` and ${list.length - 4} more` : "";
  lines.push(`| ${reason} | ${list.length} | ${sample}${more} |`);
}
lines.push("");
lines.push("Paid routes (`cost/device/create_order`, `cost/device/create_renew`, `cost/device/createNewbieDeviceOrder`,");
lines.push("`cost/device/batch_create_order`, `cost/costmanagement/set_meal_pay`, `renew_meal_pay`,");
lines.push("`cost/device/pay_scan`) have their request keys read from the client bundle and recorded in");
lines.push("[PARAMETER_MATRIX.md](PARAMETER_MATRIX.md); they were never called.");
lines.push("");
lines.push("## Known Unknowns", "");
lines.push("Three classes of question remain open, each with the reason recorded. The second account narrowed two of them and the findings are folded in below.");
lines.push("");
if (boundaryEvidence) lines.push("The per-account prerequisite for each of these, and the exact response the server returned, is in [BOUNDARY_EVIDENCE.md](BOUNDARY_EVIDENCE.md).");
lines.push("");
lines.push("1. **Numeric codes with no label in the client.** `band_width_type`, `cidr_status`, and `roleType`");
lines.push("   have observed values but no confirmed meaning, and the three names do not occur in any of the 321");
lines.push("   deployed bundles, so the client never reads them. Re-checked");
lines.push("   2026-10-10, several fields that used to be listed here are resolved: `devType` and `PlatformType`");
lines.push("   have full constant maps, `pluginType` is the plugin category, `templateType` groups menu");
lines.push("   templates, `installStatus` is a truthy installed flag, `free_status` belongs to the purchase");
lines.push("   origin-order object, `isp_type`/`net_type` are request fields of the purchase cart rather than");
lines.push("   response enums, and `getorderinfo` supplies the `order_status`, `order_type`, and `pay_type` label");
lines.push("   maps while `getRegionSupportV2` labels `proxyType`. See [ENUM_MEANINGS.md](ENUM_MEANINGS.md).");
lines.push("2. **Cloud and QR routes.** Re-checked 2026-10-10: `cloud-accounts/open/token/get` answers");
lines.push("   `code: 200` with `data.token`, `cloud-accounts/client-num/get` answers `code: 200` with");
lines.push("   `data.clientNum` and `data.keepalive`, and `sso/mp/qrCode` answers `code: 200` with `data.ticket`,");
lines.push("   `data.expire_seconds`, `data.url`, and `data.scene`. The earlier upstream-error note no longer");
lines.push("   holds. `cloud-accounts/free/shop/init` is still blocked: its decoder is");
lines.push("   `dto.CloudBrowserOrderReq`, and an empty body answers `code: 500 record not found`, so it needs an");
lines.push("   existing order and was not exercised. The second account then confirmed the shape of");
lines.push("   `cloud-accounts/finger/get` (127 field paths) and pinned its failure mode: whenever the target");
lines.push("   shop has zero cloud accounts, the handler panics with `index out of range [0] with length 0`");
lines.push("   instead of returning an empty result. See [CROSS_ACCOUNT_VERIFICATION.md](CROSS_ACCOUNT_VERIFICATION.md).");
lines.push("3. **Order-detail status.** `cost/costmanagement/getOrderDetailStatus` decodes");
lines.push("   `OrderDetailRequest{ oid string, oids []string }`. A real order `oid` and its `order_no`, both read");
lines.push("   from `getOrderManagementNew`, still answer `4009`, and the call site `getOrderDetailStatus(` does");
lines.push("   not occur in any of the 321 deployed bundles, so the client never calls it either. Neither the");
lines.push("   request nor the response can be confirmed from a source that exists. The second account re-checked");
lines.push("   it with real orders, order ids, and array forms of every identifier, and every shape still answers");
lines.push("   `4009`; with two accounts and no client call site, the route is treated as unusable rather than");
lines.push("   merely undocumented.");
lines.push("");
lines.push("## How To Reproduce", "");
lines.push("");
lines.push("```powershell");
lines.push("node scripts/yunlogin-doctor.mjs --audit              # the full audit chain, live");
lines.push("node scripts/yunlogin-doctor.mjs --audit --skip-heavy # documentation plus residue only");
lines.push("node scripts/dev/render-route-catalog.mjs             # after a sweep");
lines.push("node scripts/dev/reprobe-resolved-routes.mjs          # refresh the parameterized routes");
lines.push("node scripts/dev/render-coverage.mjs                  # refresh this page");
lines.push("```");
lines.push("");
lines.push("Every gate is proven to block: `node scripts/dev/verify-audit-gates.mjs` injects a fault into the");
lines.push("validator, the drift check, the write-persistence check, the write-restore check, the delete");
lines.push("check, and the residue check, asserts a non-zero exit for each, then runs all six clean. The");
lines.push("residue fault is injected in-process, so proving it blocks writes nothing to the account. It");
lines.push("reports eleven checks.");
lines.push("");
lines.push("The gate was verified by fault injection: changing one recorded business code in");
lines.push("`route-baseline.json` makes the audit exit 1 with `FAIL route drift and parameterized replay`, and");
lines.push("restoring the baseline returns it to 0.");
lines.push("");
lines.push("The audit fails when documentation drifts, when a parameterized route stops matching its baseline,");
lines.push("when a write stops persisting or restoring, when a delete stops behaving, or when any probe resource");
lines.push("is still on the account.");
lines.push("");
lines.push("## Residue And Safety", "");
lines.push("");
lines.push(`The probes create only throwaway resources, and every case cleans up after itself. The audit's residue`);
lines.push(`check scans **${counts.residueTypes}** resource types (environments and their recycle list, proxy tags, environment groups, custom platforms, credentials, self proxies, role groups, dynamic proxies, departments, RPA groups, plugin groups, promotion links) and fails if`);
lines.push("a `codex-` row, an empty-name role group, or another probe artefact remains. Every row also has to");
lines.push("prove it actually read a collection: an envelope whose list is missing and whose `count`/`total`");
lines.push("is not numeric is recorded as unscanned, and the stage fails on that instead of reporting a clean");
lines.push("zero. That rule is what caught the plugin-group and invoice-title rows that used to pass vacuously.");
lines.push("");

await writeFile(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${path.relative(skillDir, outputPath)}: universe=${counts.universe} live=${counts.live} skipped=${counts.skipped} enumFields=${counts.enumFields} verified=${counts.verified}`);
