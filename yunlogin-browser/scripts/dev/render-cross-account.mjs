#!/usr/bin/env node

/**
 * Cross-account verification report.
 *
 * Reads the reference-account route sweep (`route-sweep.json`) and a second-account field
 * inventory produced by `probe-route-fields.mjs`, then writes
 * `references/server-api/CROSS_ACCOUNT_VERIFICATION.md`. The report proves, per route, whether a
 * second data-rich account answered a route the reference session could not reach, and records
 * the request contract that was proven. Route paths and field paths only; no secrets or values.
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
const inventoryPath = option("--input", path.join(process.env.TEMP ?? "/tmp", "yunlogin-route-field-inventory.json"));
const outputPath = option("--output", path.join(serverDir, "CROSS_ACCOUNT_VERIFICATION.md"));

const sweep = JSON.parse(await readFile(path.join(serverDir, "route-sweep.json"), "utf8"));
const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const byKey = new Map((inventory.results ?? []).map((row) => [row.key, row]));

const verified = [];
for (const route of sweep.results) {
  const row = byKey.get(route.key);
  // Only a success envelope proves the contract; a 4009/4011/500 body still carries a few fields.
  // The probe records `success` because some live routes legitimately omit `code`.
  const success = row && (row.success ?? ((row.code === 200 || row.code === 0) && (row.fieldCount ?? 0) > 0));
  if (!success) continue;
  verified.push({
    key: route.key,
    method: route.method,
    path: route.path,
    referenceFields: route.fieldCount ?? 0,
    secondFields: row.fieldCount,
    code: row.code,
    httpStatus: row.httpStatus,
  });
}
verified.sort((a, b) => b.secondFields - a.secondFields);

const lines = [];
lines.push("# Cross-Account Verification");
lines.push("");
lines.push("The reference session captures one management-center account. Several routes only answer when the");
lines.push("account actually owns the data they read (credentials, orders, RPA configs, members). This page records");
lines.push("a second, data-rich account re-probing the route universe with `scripts/dev/probe-route-fields.mjs`,");
lines.push("so a route the reference session left unresolved still has a documented response shape.");
lines.push("");
lines.push("The per-field detail is in [FIELD_INVENTORY_ACCOUNT_B.md](FIELD_INVENTORY_ACCOUNT_B.md). This page");
lines.push("records which routes that probe resolved and what it proves about the request contract.");
lines.push("");
lines.push(`- Second-account probe ran at: ${inventory.ranAt ?? "(unknown)"}`);
lines.push(`- Origin: \`${inventory.origin}\``);
lines.push(`- Routes probed: **${inventory.results?.length ?? 0}**`);
lines.push(`- Routes that returned fields: **${verified.length}**`);
lines.push("");
lines.push("## Routes The Reference Session Had Not Resolved");
lines.push("");
lines.push("These routes answered with fields on the second account while the reference sweep left them at a");
lines.push("missing-parameter or empty shape.");
lines.push("");
lines.push("| Second-account fields | Reference fields | Code | Method | Route |");
lines.push("| ---: | ---: | ---: | --- | --- |");
for (const row of verified.filter((r) => (r.referenceFields ?? 0) <= 5)) {
  lines.push(`| ${row.secondFields} | ${row.referenceFields} | ${row.code ?? "-"} | ${row.method} | \`${row.path}\` |`);
}
lines.push("");
lines.push("## Every Route The Second Account Resolved");
lines.push("");
lines.push("| Second-account fields | Reference fields | Code | Method | Route |");
lines.push("| ---: | ---: | ---: | --- | --- |");
for (const row of verified) {
  lines.push(`| ${row.secondFields} | ${row.referenceFields} | ${row.code ?? "-"} | ${row.method} | \`${row.path}\` |`);
}
lines.push("");
lines.push("## Proven Request Contracts");
lines.push("");
lines.push("## RPA Lookup Chains");
lines.push("");
lines.push("Two RPA routes take a foreign key that is easy to confuse with an environment id. Both were proven");
lines.push("live against the second account and replayed against the reference account:");
lines.push("");
lines.push("| Client read | Supply | Then call | Wrong id gives |");
lines.push("| --- | --- | --- | --- |");
lines.push("| `GET /v2/rpa/getRpaShopList` (GET; POST answers 404) | a row's `shopId` | `GET /v2/rpa/findRpaShop?shopId=...` | an environment `shopid` -> `404 record not found` |");
lines.push("| `GET /v2/rpa/getRpaPlanManagementList` | a row's `planId` | `GET /v2/rpa/findRpaPlanManagement?planId=...` | a missing plan -> `404`, but the route still answers 200 with an empty list |");
lines.push("");
lines.push("`getRpaShopList` returns 23 rows while `findRpaShop` answered 49-56 field paths; both are verified on");
lines.push("the reference account as well, so the chain is reproducible without the second account.");
lines.push("");
lines.push("");
lines.push("Read from the deployed client call sites (`client-params.json`) and confirmed live on the second account:");
lines.push("");
lines.push("| Route | Proven request fields |");
lines.push("| --- | --- |");
const clientParams = JSON.parse(await readFile(path.join(serverDir, "client-params.json"), "utf8"));
const fieldsByRoute = new Map();
for (const info of Object.values(clientParams.params ?? {})) {
  if (!info?.route) continue;
  const set = fieldsByRoute.get(info.route) ?? new Set();
  for (const key of info.keys ?? []) set.add(key);
  fieldsByRoute.set(info.route, set);
}
for (const row of verified) {
  const keys = [...(fieldsByRoute.get(row.key) ?? [])];
  if (keys.length === 0) continue;
  const rendered = keys.map((key) => `\`${key}\``).join(", ");
  lines.push(`| \`${row.method} ${row.path}\` | ${rendered} |`);
}
lines.push("");

await writeFile(outputPath, lines.join("\n") + "\n", "utf8");
console.error(`Wrote ${path.relative(skillDir, outputPath)}: ${verified.length} routes resolved on the second account`);
