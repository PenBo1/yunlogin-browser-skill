#!/usr/bin/env node
/**
 * Mine the management-center bundles for enum labels.
 *
 * The client has to translate every numeric code it renders, so the bundles carry the label maps.
 * This script discovers the bundles that are deployed right now, downloads them to a temp
 * directory, and prints a context window around each requested key. Output is read-only evidence
 * gathering, not an artifact generator.
 *
 * Usage: node scripts/dev/mine-bundle-enums.mjs <key> [<key> ...]
 */
import { writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { discoverBundles, fetchBundleText } from "../lib/client-bundle.mjs";

const keys = process.argv.slice(2);
if (keys.length === 0) throw new Error("usage: node scripts/dev/mine-bundle-enums.mjs <key> [<key> ...]");

const { main, i18n } = await discoverBundles();
console.log(`bundle: ${main}${i18n ? ` + ${i18n}` : ""}`);

const sources = [];
for (const bundle of [main, i18n].filter(Boolean)) {
  const text = await fetchBundleText(bundle);
  sources.push({ bundle, text });
  await writeFile(path.join(os.tmpdir(), path.basename(bundle)), text, "utf8");
}

for (const key of keys) {
  console.log(`\n########## ${key} ##########`);
  let shown = 0;
  for (const { bundle, text } of sources) {
    let index = 0;
    while ((index = text.indexOf(key, index)) >= 0 && shown < 8) {
      const window = text.slice(Math.max(0, index - 220), index + 260).replace(/\s+/g, " ");
      console.log(`[${path.basename(bundle)} @${index}] ${window}`);
      index += key.length;
      shown += 1;
    }
  }
  if (shown === 0) console.log("(no occurrence)");
}
