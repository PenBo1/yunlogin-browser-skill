#!/usr/bin/env node
/**
 * Verify that every relative Markdown link in the skill resolves.
 *
 * Renaming a reference set is exactly the kind of change that silently breaks navigation. This check
 * extracts relative links from the skill's text files and fails when a target is missing.
 *
 * Usage:
 *   node scripts/dev/check-links.mjs [--json]
 */

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const asJson = process.argv.includes("--json");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      yield* walk(full);
    } else yield full;
  }
}

const LINKS = /\[[^\]]*\]\(([^)]+)\)/g;
const broken = [];
let checked = 0;

for await (const file of walk(skillDir)) {
  // Only prose carries real links; renderer sources hold link text as document data.
  if (![".md", ".yaml"].includes(path.extname(file))) continue;
  const text = await readFile(file, "utf8");
  // Fenced and inline code hold pasted client source, not navigation.
  const prose = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  for (const match of prose.matchAll(LINKS)) {
    const raw = match[1].trim();
    if (/^(https?:|mailto:|#|codex:)/i.test(raw)) continue;
    const target = raw.split("#")[0];
    if (!target) continue;
    checked += 1;
    const resolved = path.resolve(path.dirname(file), target);
    try {
      await stat(resolved);
    } catch {
      broken.push({ file: path.relative(skillDir, file), link: raw });
    }
  }
}

if (asJson) console.log(JSON.stringify({ checked, broken, ok: broken.length === 0 }, null, 2));
else {
  for (const b of broken) console.log(`BROKEN  ${b.file} -> ${b.link}`);
  console.log(`checked ${checked} relative links, ${broken.length} broken`);
}
process.exit(broken.length === 0 ? 0 : 1);
