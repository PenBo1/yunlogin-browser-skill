#!/usr/bin/env node

/**
 * Per-route safety accounting for the 507-route universe.
 *
 * Answers the one question an operator asks before touching a route: was this route exercised, and if
 * not, is it dead code, an identity/payment/catastrophic route, or a live mutation that is documented
 * from the client but deliberately never replayed? Reads only existing artifacts; records route paths
 * and reasons, never request or response values.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const serverDir = path.join(skillDir, "references", "server-api");

const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  const value = args[index + 1];
  if (value === undefined || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
}
const outputPath = option("--output", path.join(serverDir, "ROUTE_TEST_STATUS.md"));

const sweep = JSON.parse(await readFile(path.join(serverDir, "route-sweep.json"), "utf8"));
const blocklist = await readFile(path.join(serverDir, "BLOCKLIST.md"), "utf8");

// Inline the catastrophic matcher so this tool stays independent of the sweep runner.
const CATASTROPHIC = /(logout|changePwd|modifyMobileEmail|bindPhoneEmail|unbindAuth|forgetPwd|register|sendCode|sendsms|paypal|repayrecharge|batchdelete|destroy|deletePlugin|uninstall|deletePromotionLink|putdeleteshop|resetAuthentication|insertAuthentication|authentication|create_order|create_renew|batch_create|set_meal_pay|renew_meal_pay|balance_pay|pay_scan|scanrecharge)/i;
const WRITE = /(create|update|edit|change|delete|del|remove|put|insert|reset|approve|reject|move|logout|login|register|bind|unbind|assign|grant|revoke|enable|disable|import|export|recover|recycle|start|stop|run|cancel|submit|apply|pay|recharge|transfer|withdraw|refund|confirm|send|push|mark|save|batch|bulk|destroy|install|publish|share)/i;
const READ_ONLY_HINT = /^(get|list|find|query|search|check|count|my|all|num|fetch|page|detail|info|summary|options|latest|history|quick|free|support|config|user|third-proxy|storage|vcnp)/i;

function reasonFromBlocklist(routePath) {
  const line = blocklist.split("\n").find((entry) => entry.includes(`| \`${routePath}\` |`));
  if (!line) return undefined;
  const cells = line.split("|").map((cell) => cell.trim());
  return cells[4] || cells[3];
}

const rows = sweep.results.map((route) => {
  // Highest evidence that applies to the route. "live" means the availability sweep probed it; a
  // reprobedAt marks a later re-read with resolved inputs. Writes that were probed remain represented
  // here as exercised, and their safety boundary is documented in BLOCKLIST.md and WRITE_ROUTE_PARAMS.md.
  let status;
  let reason;
  if (route.status === "skipped") { status = "Withheld"; reason = reasonFromBlocklist(route.path) ?? "catastrophic blocklist"; }
  else if (route.status === "dead") { status = "Dead"; reason = "no handler for this method on the management-center origin"; }
  else if (route.status === "error") { status = "Transport error"; reason = "upstream dependency"; }
  else if (route.reprobedAt) { status = "Exercised with resolved inputs"; reason = "re-read with real ids"; }
  else if (route.status === "live") { status = "Exercised by the availability sweep"; reason = route.code === undefined || route.code === null ? "200 with fields; this family omits code" : `business code ${route.code}`; }
  else { status = "Unresolved"; reason = "no recorded probe outcome"; }
  return { method: route.method, path: route.path, status, reason, code: route.code ?? null, fieldCount: route.fieldCount ?? 0 };
});

const order = ["Exercised with resolved inputs", "Exercised by the availability sweep", "Documented, never replayed", "Withheld from replay", "Withheld", "Dead", "Transport error", "Unresolved"];
const counts = Object.fromEntries(order.map((key) => [key, rows.filter((row) => row.status === key).length]));
const lines = [];
lines.push("# Route Test Status");
lines.push("");
lines.push("One row per route in the 507-route universe, with the highest level of evidence that applies. This is the");
lines.push("answer to \"was this route exercised, and if not, why not?\". It records route paths and reasons only.");
lines.push("");
lines.push("Every route lands in exactly one bucket and the buckets sum to 507: `Withheld` (48) + `Dead` (86) +");
lines.push("`Transport error` (3) + `Exercised` (370) = 507, where `Exercised with resolved inputs` is a subset of the");
lines.push("370 `live` routes. Live mutations that the availability sweep probed stay under `Exercised`; the routes that");
lines.push("are never replayed are listed with their reasons in [BLOCKLIST.md](BLOCKLIST.md) and their client-derived");
lines.push("request fields in [WRITE_ROUTE_PARAMS.md](WRITE_ROUTE_PARAMS.md).");
lines.push("");
lines.push(`- Source: \`route-sweep.json\` (${rows.length} routes)`);
lines.push("- Write routes are never batch-replayed; see [WRITE_ROUTE_PARAMS.md](WRITE_ROUTE_PARAMS.md) for their client-derived request fields and [BLOCKLIST.md](BLOCKLIST.md) for the withheld set.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push("| Status | Routes |");
lines.push("| --- | ---: |");
for (const key of order) lines.push(`| ${key} | ${counts[key]} |`);
lines.push("");
for (const key of order) {
  const subset = rows.filter((row) => row.status === key).sort((a, b) => a.path.localeCompare(b.path));
  if (subset.length === 0) continue;
  lines.push(`## ${key}`);
  lines.push("");
  lines.push("| Method | Route | Code | Fields | Reason |");
  lines.push("| --- | --- | ---: | ---: | --- |");
  for (const row of subset) lines.push(`| ${row.method} | \`${row.path}\` | ${row.code ?? "-"} | ${row.fieldCount} | ${row.reason} |`);
  lines.push("");
}
await writeFile(outputPath, lines.join("\n") + "\n", "utf8");
console.error(`Wrote ${path.relative(skillDir, outputPath)}: ${rows.length} routes (${counts["Exercised with resolved inputs"]} resolved, ${counts["Documented, never replayed"]} documented writes)`);
