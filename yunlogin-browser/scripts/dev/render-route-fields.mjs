#!/usr/bin/env node

/**
 * Render the live field inventory produced by probe-route-fields.mjs into
 * references/server-api/FIELD_INVENTORY_ACCOUNT_B.md.
 *
 * The generated page is supplemental evidence: it records the response field paths, types, and
 * bounded enum-like values observed while probing the full route universe with a second, richer
 * account. It never contains tokens, cookies, free-form strings, or raw identifiers beyond the
 * company/user context that the probe already prints.
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
const inputPath = option("--input", path.join(process.env.TEMP ?? "/tmp", "yunlogin-route-field-inventory.json"));
const outputPath = option("--output", path.join(serverDir, "FIELD_INVENTORY_ACCOUNT_B.md"));

const inventory = JSON.parse(await readFile(inputPath, "utf8"));
const rows = inventory.results ?? [];
const byRoute = rows.map((row) => ({
  key: row.key,
  method: row.method,
  path: row.path,
  code: row.code,
  httpStatus: row.httpStatus,
  fieldCount: row.fieldCount ?? 0,
  fields: row.fields ?? {},
}));

const withFields = byRoute.filter((row) => row.fieldCount > 0);
const totalFields = withFields.reduce((sum, row) => sum + row.fieldCount, 0);
const valueFields = withFields.reduce((sum, row) => sum + Object.values(row.fields).filter((f) => (f.values ?? []).length > 0).length, 0);

const lines = [];
lines.push("# Route Field Inventory (Second Account)");
lines.push("");
lines.push("Supplemental, read-only evidence collected by `scripts/dev/probe-route-fields.mjs`. The primary");
lines.push("inventory (`FIELD_INVENTORY.md`) comes from the reference session. This page records what a second,");
lines.push("data-rich account returned, so routes the reference session could not reach still have a documented");
lines.push("response shape. Field values are bounded samples; identifiers, secrets, and free-form strings are not stored.");
lines.push("");
lines.push(`- Ran at: ${inventory.ranAt ?? "(unknown)"}`);
lines.push(`- Origin: \`${inventory.origin}\``);
lines.push(`- Scope: ${inventory.scope ?? "(unspecified)"}`);
lines.push(`- Routes probed: **${rows.length}**`);
lines.push(`- Routes that returned fields: **${withFields.length}**`);
lines.push(`- Distinct field paths recorded: **${totalFields}** (${valueFields} carry bounded enum-like values)`);
lines.push("");
lines.push("## Routes With Fields");
lines.push("");
lines.push("| Fields | Code | Method | Route |");
lines.push("| ---: | ---: | --- | --- |");
for (const row of [...withFields].sort((a, b) => b.fieldCount - a.fieldCount)) {
  lines.push(`| ${row.fieldCount} | ${row.code ?? "-"} | ${row.method} | \`${row.path}\` |`);
}
lines.push("");
lines.push("## Field Paths By Route");
lines.push("");
for (const row of [...withFields].sort((a, b) => a.path.localeCompare(b.path))) {
  lines.push(`### \`${row.method} ${row.path}\``);
  lines.push("");
  lines.push(`Business code \`${row.code ?? "-"}\`, HTTP \`${row.httpStatus ?? "-"}\`, ${row.fieldCount} field paths.`);
  lines.push("");
  lines.push("| Field path | Types | Sample values |");
  lines.push("| --- | --- | --- |");
  for (const [field, meta] of Object.entries(row.fields)) {
    const types = (meta.types ?? []).join(", ") || "-";
    // Keep the page ASCII: enum samples can be localised, and the skill keeps raw localised values out of English docs.
    const values = (meta.values ?? []).filter((value) => !/[^\x00-\x7F]/.test(String(value))).join(", ");
    lines.push(`| \`${field}\` | ${types || "-"} | ${values || ""} |`);
  }
  lines.push("");
}

await writeFile(outputPath, lines.join("\n") + "\n", "utf8");
console.error(`Wrote ${path.relative(skillDir, outputPath)}: ${withFields.length} routes, ${totalFields} field paths`);
