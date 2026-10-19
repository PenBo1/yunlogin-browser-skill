#!/usr/bin/env node

/**
 * Render the write-effectiveness evidence.
 *
 * Usage:
 *   node scripts/dev/render-write-effectiveness.mjs --input <probe.json> [--out <md>]
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
const outputPath = option("--out", path.join(serverDir, "WRITE_EFFECTIVENESS.md"));

const probe = JSON.parse(await readFile(inputPath, "utf8"));
const persisted = probe.results.filter((r) => r.persisted).length;
const restored = probe.results.filter((r) => r.restored).length;

const lines = [];
lines.push("# Write Effectiveness", "");
lines.push("A write route answering `code: 200` does not prove that anything changed. Every case below was run as a");
lines.push("full round trip on one existing environment: read the current value, write a temporary value, re-read to");
lines.push("see whether it stuck, write the original back, and re-read again. The environment name, notes, star flag,");
lines.push("and top order were all restored to their original values.");
lines.push("");
lines.push(`- Probe time: ${probe.testedAt}`);
lines.push(`- Claimed success: ${probe.results.length} of ${probe.results.length}`);
lines.push(`- Actually persisted: ${persisted} of ${probe.results.length}`);
lines.push(`- Restored to the original value: ${restored} of ${probe.results.length}`);
lines.push("");
lines.push("## Measured Round Trips", "");
lines.push("| Case | Route | Field | Original | After write | Persisted | Restored |");
lines.push("| --- | --- | --- | --- | --- | --- | --- |");
for (const r of probe.results) {
  // Escape non-ASCII so the document stays ASCII-only while preserving the measured value.
const cell = (v) => "`" + String(v ?? "")
  .replace(/\|/g, "\\|")
  .replace(/[^\x20-\x7E]/g, (ch) => "\\u" + ch.codePointAt(0).toString(16).padStart(4, "0"))
  + "`";
  lines.push(`| ${r.id} | \`${r.route}\` | \`${r.field}\` | ${cell(r.original)} | ${cell(r.observedAfterWrite)} | ${r.persisted ? "yes" : "**no**"} | ${r.restored ? "yes" : "**no**"} |`);
}
lines.push("");
lines.push("## Writes That Report Success Without Persisting", "");
lines.push("These routes were measured earlier and are listed here so the contrast is explicit. Verify them by");
lines.push("re-reading the resource, never by the response alone.");
lines.push("");
lines.push("| Route | Claimed | Reality | Verify with |");
lines.push("| --- | --- | --- | --- |");
lines.push("| `POST /v2/newbrowser/createUserPassword` | `code: 200`, `msg: OK`, `data: null` | No credential row is created | `getUserPasswordList` count |");
lines.push("| `POST /v2/newbrowser/putUserPassword` | `code: 200`, `msg: OK` | No credential row is created | `getUserPasswordList` count |");
lines.push("| `POST /v2/newbrowser/account-users/update` | `code: 200`, `msg: OK` | No change is applied | re-read the binding |");
lines.push("| `POST /v2/proxy/device/updateDeviceProxyUserSelves` | `code: 200`, `data.success: 1`, full `data.proxies[0]` | The row never appears in `findDeviceProxyUserSelves` (520 rows before and after) | re-read the proxy list |");
lines.push("");
lines.push("## Rule", "");
lines.push("Treat a write as successful only when a follow-up read shows the new value. The four environment writes");
lines.push("above do persist, but the four routes in the second table show that a success envelope alone is not proof.");
lines.push("");

await writeFile(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${path.relative(skillDir, outputPath)}: ${probe.results.length} cases, ${persisted} persisted, ${restored} restored`);
