#!/usr/bin/env node

/**
 * Render delete-semantics evidence.
 *
 * Usage:
 *   node scripts/dev/render-delete-semantics.mjs --input <probe.json> [--out <md>]
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
const inputPath = option("--input");
if (!inputPath) throw new Error("--input <probe.json> is required");
const outputPath = option("--out", path.join(serverDir, "DELETE_SEMANTICS.md"));

const probe = JSON.parse(await readFile(inputPath, "utf8"));

// A delete response that carries a deletedAt tombstone means the row survives in storage; a null
// payload with the row gone from the list and no recycle route means it was removed outright.
function classify(result) {
  const data = result.deleteData ?? {};
  const hasTombstone = typeof data === "object" && data !== null && ("deletedAt" in data || "deleted" in data);
  if (result.presentAfterDelete) return { kind: "ineffective", why: "the row is still in the list after the delete call" };
  if (result.inRecycleAfterDelete) return { kind: "soft (recycle list)", why: "the row left the active list but still appears in the recycle list" };
  if (hasTombstone) return { kind: "soft (tombstone)", why: `the delete response returned ${Object.keys(data).join(", ")}` };
  return { kind: "hard (observed)", why: "the row left the list and the response carried no tombstone" };
}

const lines = [];
lines.push("# Delete Semantics", "");
lines.push("Each case creates a uniquely named throwaway resource, confirms it exists, deletes it, and re-reads");
lines.push("the list. The delete response is kept as evidence: a payload carrying `deleted` / `deletedAt` is a");
lines.push("tombstone (the row survives in storage), while a null payload plus a row that left the list and no");
lines.push("recycle route indicates the row was removed outright.");
lines.push("");
lines.push(`- Probe time: ${probe.testedAt}`);
lines.push("");
lines.push("## Measured Cases", "");
lines.push("| Resource | Create | Delete | Delete response | Gone from active list | In recycle list | Purge | Classification |");
lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
for (const r of probe.results) {
  const verdict = classify(r);
  const data = r.deleteData == null ? "`null`" : "`" + JSON.stringify(r.deleteData).replace(/\|/g, "\\|") + "`";
  const purge = r.purgeRoute ? `\`${r.purgeRoute}\` -> ${r.inRecycleAfterPurge ? "still present" : "removed"}` : "-";
  const inRecycle = r.recycleChecked ? (r.inRecycleAfterDelete ? "**yes**" : "no") : "not checked";
  lines.push(`| ${r.id} | \`${r.createRoute}\` | \`${r.deleteRoute}\` | ${data} | ${r.presentAfterDelete ? "**no**" : "yes"} | ${inRecycle} | ${purge} | **${verdict.kind}** - ${verdict.why} |`);
}
lines.push("");
lines.push("## Leftover Check", "");
lines.push("| Resource | Create code | Existed after create | Delete code | Leftover after delete |");
lines.push("| --- | ---: | --- | ---: | --- |");
for (const r of probe.results) {
  lines.push(`| ${r.id} | ${r.createCode ?? "-"} | ${r.existedAfterCreate ? "yes" : "no"} | ${r.deleteCode ?? "-"} | ${r.leftover ? "**yes**" : "no"} |`);
}
lines.push("");
lines.push("## Resources With A Separate Recycle List", "");
lines.push("The cases above have no recycle route, so \"hard (observed)\" means no second list exposes the row.");
lines.push("Two resource types do keep one, and their delete route is therefore soft by design:");
lines.push("");
lines.push("| Resource | Delete route | Recycle list | Purge route |");
lines.push("| --- | --- | --- | --- |");
lines.push("| Environment | `POST /v2/newbrowser/putdeleteshop` | `POST /v2/newbrowser/getrecycleshoplist` | `POST /v2/newbrowser/putdeleteshopfromrecycle { shopid: [id] }` |");
lines.push("| Self proxy | `POST /v2/proxy/device/delDeviceProxyUserSelves` | `findDeviceProxyUserSelves` with `enable: 0` | `POST /v2/proxy/device/recycleDelDeviceProxyUserSelves { device_ids: [id] }` |");
lines.push("");
lines.push("## Rule", "");
lines.push("A delete that returns `code: 200` and empties the row from the primary list can still be a soft delete.");
lines.push("Check the delete response for a `deletedAt` tombstone and check whether a recycle list exposes the row");
lines.push("before treating a resource as permanently removed.");
lines.push("");

await writeFile(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${path.relative(skillDir, outputPath)}: ${probe.results.length} cases`);
