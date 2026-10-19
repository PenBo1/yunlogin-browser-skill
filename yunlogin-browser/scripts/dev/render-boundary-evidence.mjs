#!/usr/bin/env node

/**
 * Render two probe-boundary-evidence.mjs outputs into references/server-api/BOUNDARY_EVIDENCE.md.
 *
 * The page states, per open question, what prerequisite each account actually has, what the server
 * answered, and whether the deployed client calls the route. It is the reproducible evidence behind
 * the "Known Unknowns" pointers in COVERAGE.md.
 */

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
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
const accountAPath = option("--account-a", path.join(os.tmpdir(), "yl-boundary-A.json"));
const accountBPath = option("--account-b", path.join(os.tmpdir(), "yl-boundary-B.json"));
const outputPath = option("--output", path.join(serverDir, "BOUNDARY_EVIDENCE.md"));

const a = JSON.parse(await readFile(accountAPath, "utf8"));
const b = JSON.parse(await readFile(accountBPath, "utf8"));
const rowsA = a.evidence ?? [];
const rowsB = b.evidence ?? [];
const byKey = (rows) => new Map(rows.map((row) => [`${row.item}\u0000${row.route}`, row]));
const mapA = byKey(rowsA);
const keys = [];
for (const row of [...rowsA, ...rowsB]) {
  const key = `${row.item}\u0000${row.route}`;
  if (!keys.includes(key)) keys.push(key);
}

const lines = [];
lines.push("# Boundary Evidence");
lines.push("");
lines.push("The routes that could not be fully exercised, with the prerequisite each account actually has and the");
lines.push("exact response the server returned. This turns \"could not test\" into \"this specific prerequisite was");
lines.push("missing\". Generated from two runs of `scripts/dev/probe-boundary-evidence.mjs`, one per account; the");
lines.push("probe inspects and reports, it never creates the missing prerequisite.");
lines.push("");
lines.push(`- Reference account: \`${a.companyId}\` (probe at ${a.ranAt})`);
lines.push(`- Second account: \`${b.companyId}\` (probe at ${b.ranAt})`);
lines.push("- Origin: `https://d126447d359e70c0.yunlogin.com`");
lines.push("");
lines.push("## Per-Question Evidence");
lines.push("");
lines.push("| Question | Route | Prerequisite | Reference account | Second account |");
lines.push("| --- | --- | --- | --- | --- |");
for (const key of keys) {
  const [item, route] = key.split("\u0000");
  const ra = mapA.get(key);
  const rb = byKey(rowsB).get(key);
  const prerequisite = (ra ?? rb)?.prerequisite ?? "-";
  const describe = (row) => {
    if (!row) return "not applicable";
    const present = row.present === undefined ? "" : row.present ? "prerequisite present" : "prerequisite absent";
    const code = row.observedCode === undefined || row.observedCode === null ? "-" : `code ${row.observedCode}`;
    // The skill keeps its files ASCII; a localised server message can be non-ASCII, so drop it here.
    const detail = row.detail && !/[^\x00-\x7F]/.test(row.detail) ? ` (${row.detail})` : "";
    return `${present}${present ? "; " : ""}${code}${detail}`;
  };
  lines.push(`| ${item} | \`${route}\` | ${prerequisite} | ${describe(ra)} | ${describe(rb)} |`);
}
lines.push("");
lines.push("## Findings");
lines.push("");
lines.push("| Question | Two-account conclusion |");
lines.push("| --- | --- |");
lines.push("| Credentials | The reference account owns no credential rows, so the credential-scoped routes have nothing to read; the second account owns 1000+ and both `getUserPasswordList` and `getBindUserPassword` answered `code: 200`. `accountGroupList` takes an environment `shopid` as its `accountId` (from the client call site). Even environments that already have a bound credential (5 credentials with one bound environment each on the second account) answered `code: 7 record not found`, and a 120-environment scan on the second account returned `code: 7` for every one. Both accounts have zero plugin groups (`gitPluginGroupList` reports `count: 0` for global and user), so the route needs plugin-group records that neither test account has, not a credential binding. |");
lines.push("| Cloud environment init | Both accounts have cloud-account and order rows, but scanning every order detail shows no cloud-browser purchase (the reference account has one 2025 activity-package order, the second account only proxy purchases), and `cloud-accounts/free/shop/init` answers `code: 500 record not found` for each candidate order. The account needs an actual cloud-browser order. |");
lines.push("| Order detail status | Two accounts, real `oid`/`order_no` and every identifier shape still answer `4009`; the deployed client never calls the route, so it is treated as unusable rather than missing a parameter. |");
lines.push("| RPA shop | The route itself is resolved: `getRpaShopList` returns a `shopId` and `findRpaShop` answers `code: 200`. The earlier 404 came from passing an environment `shopid` instead. |");
lines.push("| Shared-in environment | Both accounts returned zero environments with `authorization=1` and `share_num>0`, so `sharerCompanyId` has no input; the condition is reproduced from the client call site. |");
lines.push("| Fingerprint UA | Both accounts answer `code: 403` for every tested shape, including a string `kernel`; it is a permission gate, not a data gate. |");
lines.push("| Unlabelled numeric enums | `band_width_type`, `cidr_status`, and `roleType` appear only in response payloads; no deployed-client label map references them, so no meaning can be derived from the client. |");
lines.push("");
lines.push("## How To Reproduce");
lines.push("");
lines.push("```powershell");
lines.push("# reference account (default cached session)");
lines.push("node scripts/dev/probe-boundary-evidence.mjs");
lines.push("");
lines.push("# second account, no writes to the real cache");
lines.push('$env:YUNLOGIN_SERVER_TOKEN_FILE = "$env:TEMP\\yunlogin-second-account.json"');
lines.push('$env:YUNLOGIN_SERVER_REFRESH_SKEW_MS = "0"');
lines.push("node scripts/dev/probe-boundary-evidence.mjs");
lines.push("```");
lines.push("");
lines.push("The probe never creates the missing prerequisite, so it is safe to re-run against any account.");
lines.push("");

await writeFile(outputPath, lines.join("\n") + "\n", "utf8");
console.error(`Wrote ${path.relative(skillDir, outputPath)}: ${keys.length} question/route rows`);
