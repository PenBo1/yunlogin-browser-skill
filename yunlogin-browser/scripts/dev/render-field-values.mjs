#!/usr/bin/env node

/**
 * Render observed value domains for enum-like response fields.
 *
 * Reads one or more probe inventories and writes references/server-api/FIELD_VALUES.md with two parts:
 * the curated catalog endpoints first, then the full extracted route surface.
 * The inventories only carry bounded, enum-like, non-sensitive scalars, so no free-form text,
 * identifiers, credentials, or account data reaches this document.
 *
 * Usage:
 *   node scripts/dev/render-field-values.mjs --catalog <probe.json> [--routes <routes.json>] [--out <md>]
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
const catalogPath = option("--catalog");
if (!catalogPath) throw new Error("--catalog <probe.json> is required");
const routesPath = option("--routes");
const outputPath = option("--out", path.join(skillDir, "references", "server-api", "FIELD_VALUES.md"));

function collect(inventory) {
  const sections = [];
  for (const result of inventory.results ?? []) {
    if (!result.fields) continue;
    const rows = Object.entries(result.fields)
      .filter(([, meta]) => Array.isArray(meta.values) && meta.values.length > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));
    if (rows.length === 0) continue;
    sections.push({ path: result.path, method: result.method, httpStatus: result.httpStatus, rows });
  }
  return sections;
}

function renderSections(lines, sections) {
  let fields = 0;
  let values = 0;
  for (const section of sections) {
    lines.push(`## ${section.method} ${section.path}`, "");
    lines.push("| Field | Types | Observed values |");
    lines.push("| --- | --- | --- |");
    for (const [field, meta] of section.rows) {
      fields += 1;
      values += meta.values.length;
      const types = (meta.types ?? []).join(", ").replace(/\|/g, "\\|");
      const rendered = meta.values.map((v) => `\`${String(v).replace(/`/g, "'")}\``).join(", ");
      lines.push(`| \`${field}\` | ${types} | ${rendered} |`);
    }
    lines.push("");
  }
  return { fields, values };
}

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const catalogSections = collect(catalog);
const routeSections = routesPath ? collect(JSON.parse(await readFile(routesPath, "utf8"))) : [];

const lines = [];
lines.push("# Server API Observed Value Domains", "");
lines.push("Generated from read-only probes of the management-center API. Only enum-like scalar fields");
lines.push("(status, state, type, flag, code, role, channel, and similar) are recorded, and only when the");
lines.push("value is short and non-sensitive. Free-form text, identifiers, credentials, and account data are");
lines.push("never written here, so every set below is an **observed sample, not a closed enum**.");
lines.push("");
lines.push("- Part 1 covers the curated catalog endpoints, called with their real defaults.");
lines.push("- Part 2 covers every route the full-surface sweep proved reachable, called with the generic body.");
lines.push("");
lines.push("## Coverage", "");
lines.push(`- Catalog endpoints with enum values: ${catalogSections.length}`);
lines.push(`- Full-surface routes with enum values: ${routeSections.length}`);
lines.push("");
lines.push("## Part 1 - Cataloged Endpoints", "");
lines.push("These calls use each endpoint's documented defaults, so the values reflect realistic payloads.");
lines.push("");
const part1 = renderSections(lines, catalogSections);
lines.push("## Part 2 - Full Extracted Route Surface", "");
lines.push("These calls reuse the full-surface sweep request (a generic company/user body), so a route that");
lines.push("needs real parameters returns only its error envelope and contributes few values.");
lines.push("");
const part2 = renderSections(lines, routeSections);
lines.push("## Where Value Meanings Come From", "");
lines.push("| Source | What it gives | Where it lands |");
lines.push("| --- | --- | --- |");
lines.push("| Paired label fields | The API returns \`X\` next to \`X_text\`, so the code meaning is authoritative | [CODE_LEGENDS.md](CODE_LEGENDS.md) |");
lines.push("| Client i18n bundle | The management-center client's own label for a field name | The field descriptions in [ROUTE_FIELDS.md](ROUTE_FIELDS.md) |");
lines.push("| Client code maps | None found for the numeric codes below | - |");
lines.push("");
lines.push("The bundles were searched for a code-to-label map and do not contain one for these fields, so their");
lines.push("values stay \"observed only\": \`isp_type\`, \`net_type\`, \`band_width_type\`, \`cidr_status\`,");
lines.push("\`pluginType\`, \`roleType\`, \`templateType\`, \`installStatus\`, \`devType\`, \`free_status\`, and the");
lines.push("\`RegionSupportV2\` flags. The i18n bundle does carry the field-name labels for some of them");
lines.push("(\`ispType\` -> ISP\u7c7b\u578b, \`pluginType\` -> \u63d2\u4ef6\u5206\u7c7b), which is why the field meaning is");
lines.push("documented even though the codes are not. Re-run");
lines.push("\`node scripts/dev/mine-bundle-enums.mjs <key>\` to re-check after a client update.");
lines.push("");
lines.push("## How To Read This", "");
lines.push("- A field absent here either never carried a sampled enum value or is free-form.");
lines.push("- `Types` lists every JSON type observed at that path, so `string, null` means the value is optional.");
lines.push("- Values are illustrative for the tested account. Treat them as observed examples, not a closed set.");
lines.push("");

const totalFields = part1.fields + part2.fields;
const totalValues = part1.values + part2.values;
lines.splice(12, 0, `- Enum-like fields with observed values: ${totalFields}`, `- Distinct observed values recorded: ${totalValues}`);

await writeFile(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${path.relative(skillDir, outputPath)}: part1=${catalogSections.length} routes/${part1.fields} fields, part2=${routeSections.length} routes/${part2.fields} fields`);
