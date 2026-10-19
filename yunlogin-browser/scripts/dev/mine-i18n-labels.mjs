#!/usr/bin/env node
/**
 * Look up field-name labels in the management-center i18n bundle.
 *
 * The i18n bundle carries the client's own label for each field name in every locale. This script
 * discovers the deployed bundle, splits it into its locale segments, and prints each locale's label
 * for the requested keys. That is authoritative evidence for a field's meaning even when the numeric
 * codes have no label map.
 *
 * Usage: node scripts/dev/mine-i18n-labels.mjs <key> [<key> ...]
 */
import { discoverBundles, fetchBundleText } from "../lib/client-bundle.mjs";

const keys = process.argv.slice(2);
if (keys.length === 0) throw new Error("usage: node scripts/dev/mine-i18n-labels.mjs <key> [<key> ...]");

const { i18n } = await discoverBundles();
if (!i18n) throw new Error("no i18n bundle is referenced by the client entry document");
const text = await fetchBundleText(i18n);
console.log(`bundle: ${i18n}`);

// Each locale is a separate object in the bundle: `zh:{...{...}}` / `"zh-TW":{...{...}}`.
// Split on those starts instead of fixed offsets, which break whenever the bundle is rebuilt.
function localeSegments(source) {
  const re = /(?:^|[},{])\s*"?([a-zA-Z]{2}(?:-[A-Za-z]{2})?)"?:\{\.\.\.\{/g;
  const starts = [];
  for (const match of source.matchAll(re)) {
    starts.push({ locale: match[1], start: match.index + match[0].indexOf(match[1]) });
  }
  return starts.map((entry, index) => ({
    locale: entry.locale,
    text: source.slice(entry.start, starts[index + 1]?.start ?? source.length),
  }));
}

function pick(objectText, key) {
  const re = new RegExp(`["']?${key}["']?\\s*:\\s*"([^"]{1,120})"`);
  const m = objectText.match(re);
  return m ? m[1] : null;
}

const segments = localeSegments(text);
if (segments.length === 0) throw new Error("no locale segments were found in the i18n bundle");
console.log(`locales: ${segments.map((s) => s.locale).join(", ")}`);
for (const key of keys) {
  const row = segments.map((segment) => `${segment.locale}=${pick(segment.text, key) ?? "-"}`);
  console.log(`${key.padEnd(24)} ${row.join("  ")}`);
}
