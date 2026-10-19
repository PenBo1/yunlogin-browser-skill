#!/usr/bin/env node

/**
 * Render the code legends observed from paired `X` / `X_text` response fields.
 *
 * Usage:
 *   node scripts/dev/render-code-legends.mjs --input <legends.json> [--out <md>]
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}
const inputPath = option("--input");
if (!inputPath) throw new Error("--input <legends.json> is required");
const valuesPath = option("--values");
const outputPath = option("--out", path.join(skillDir, "references", "server-api", "CODE_LEGENDS.md"));

const doc = JSON.parse(await readFile(inputPath, "utf8"));
const lines = [];
lines.push("# Server API Code Legends", "");
lines.push("Some read routes return a numeric or symbolic code next to a human label, for example a");
lines.push("`pay_type` code plus its `pay_type_text` label. This document pairs those fields from the live");
lines.push("response, so the meaning of each observed code comes from the API itself rather than a guess.");
lines.push("");
lines.push("Where a field has no sibling label the meaning is still unconfirmed - check");
lines.push("[FIELD_VALUES.md](FIELD_VALUES.md) for its observed values and this file for confirmed meanings.");
lines.push("");
lines.push(`- Probe time: ${doc.testedAt}`);
lines.push("");

let totalPairs = 0;
let totalFields = 0;
const sections = [];
for (const result of doc.results ?? []) {
  const legends = Object.entries(result.legends ?? {}).filter(([, pairs]) => Object.keys(pairs).length > 0);
  if (legends.length === 0) continue;
  totalFields += legends.length;
  totalPairs += legends.reduce((sum, [, pairs]) => sum + Object.keys(pairs).length, 0);
  sections.push({ method: result.method, path: result.path, legends });
}

lines.push(`- Routes with a legend: ${sections.length}`);
lines.push(`- Code fields with a confirmed meaning: ${totalFields}`);
lines.push(`- Code -> meaning pairs: ${totalPairs}`);
lines.push("");

for (const section of sections) {
  lines.push(`## ${section.method} ${section.path}`, "");
  lines.push("| Field | Code | Meaning |");
  lines.push("| --- | --- | --- |");
  for (const [field, pairs] of section.legends) {
    for (const [code, meaning] of Object.entries(pairs)) {
      lines.push(`| \`${field}\` | \`${code}\` | ${String(meaning).replace(/\|/g, "\\|")} |`);
    }
  }
  lines.push("");
}

// Values that are already self-describing (lowerCamel keywords or UPPER_SNAKE codes) need no
// pairing; list them so a reader can see the accepted symbolic vocabulary.
if (valuesPath) {
  const valuesText = await readFile(valuesPath, "utf8");
  const symbolic = [];
  let route = null;
  for (const line of valuesText.split(/\r?\n/)) {
    const h = line.match(/^## (GET|POST|PUT|DELETE) (\S+)$/);
    if (h) { route = h[2]; continue; }
    const m = line.match(/^\| \`(\$[^\`]+)\` \| ([^|]*)\| (.*) \|$/);
    if (!m || !route) continue;
    const leaf = m[1].split(".").pop().replace(/\[\]$/, "");
    if (!/(status|state|type|kind|mode|level|optype|flag)$/i.test(leaf)) continue;
    const values = [...m[3].matchAll(/\`([^\`]*)\`/g)].map((x) => x[1]);
    if (values.length < 2 || values.length > 24) continue;
    const allSymbolic = values.every((v) => /^([a-z][a-zA-Z0-9]*|[A-Z][A-Z0-9_]*)$/.test(v) && v.length <= 32);
    if (allSymbolic) symbolic.push({ route, field: m[1], values });
  }
  const seen = new Set();
  const unique = symbolic.filter((r) => { const k = r.field + "|" + r.values.join(","); if (seen.has(k)) return false; seen.add(k); return true; });
  if (unique.length > 0) {
    lines.push("## Symbolic Enums (values are already meaningful)", "");
    lines.push("These fields use keyword values instead of numeric codes, so no label pairing is needed.", "");
    lines.push("| Field | Values |");
    lines.push("| --- | --- |");
    for (const r of unique.slice(0, 40)) {
      lines.push("| `" + r.field + "` | " + r.values.map((v) => "`" + v + "`").join(", ") + " |");
    }
    lines.push("");
  }
}

lines.push("## Traps", "");
lines.push("- `vcnplist` / `findVcnpList` report `auto_renew: 1` as `????` (auto-renew **off**). Do not read that");
lines.push("  code as \"enabled\" - it is the inverse of the usual flag convention.");
lines.push("- `pay_status` and `order_status` are different enums with overlapping numbers. On the tested account");
lines.push("  `pay_status: 1` is `???` while `order_status: 1` was never observed; always read the matching `*_text`.");
lines.push("- A code that only appears with one label is still a sample: the API can return values this account has");
lines.push("  never produced, so treat the tables as confirmed examples, not closed enums.");
lines.push("");

await writeFile(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${path.relative(skillDir, outputPath)}: ${sections.length} routes, ${totalFields} fields, ${totalPairs} pairs`);
