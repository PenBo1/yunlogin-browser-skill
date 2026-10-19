#!/usr/bin/env node
/**
 * Re-extract the management-center route universe from the deployed client bundle.
 *
 * The client stores its route table as an object literal of `name:"METHOD,path"` entries, so the
 * bundle is the authoritative list of server-side calls. This script discovers the deployed bundles,
 * crawls every chunk they import, and writes the machine-readable route table plus the raw call-site
 * contexts used by extract-client-params.mjs.
 *
 * It handles the DELETE verb, which earlier extractions missed.
 *
 * Usage: node scripts/dev/extract-client-routes.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { discoverBundles, fetchBundleText } from "../lib/client-bundle.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(scriptDir, "..", "..", "references", "server-api");

const bundles = await discoverBundles();
const seen = new Set();
const queue = [...bundles.refs];
const spec = /([A-Za-z0-9_\-\.\/]+-\d{10,}-[A-Za-z0-9]+-104\.js)/g;
const call = /([A-Za-z0-9_$]+):"(GET|POST|PUT|PATCH|DELETE|DEL|HEAD),([^"]{2,140})"/g;

const routes = {};
const texts = [];
let fetched = 0;
while (queue.length && fetched < 2000) {
  const url = queue.shift();
  if (seen.has(url)) continue;
  seen.add(url);
  let raw;
  try { raw = await fetchBundleText(url, { origin: bundles.origin }); } catch { continue; }
  fetched += 1;
  texts.push(raw);
  const text = raw.replace(/[`']/g, '"');
  for (const match of text.matchAll(call)) {
    const method = match[2] === "DEL" ? "DELETE" : match[2];
    let p = match[3].trim();
    if (!p.startsWith("/")) p = "/" + p;
    routes[`${method} ${p}`] = match[1];
  }
  for (const match of raw.matchAll(spec)) {
    const base = match[1].replace(/^\.\//, "").replace(/^\/js\//, "").split("/").pop();
    const next = "/js/" + base;
    if (!seen.has(next)) queue.push(next);
  }
}

// The invoice feature is out of scope for this skill by owner decision (2026-10-12). Drop its
// routes before names/callsites are derived so no downstream artifact catalogues them, and a
// later re-extraction from a new bundle keeps them excluded.
const EXCLUDED_PATH_PREFIXES = ["/v2/cost/invoice_user/"];
for (const key of Object.keys(routes)) {
  const routePath = key.split(" ", 2)[1];
  if (EXCLUDED_PATH_PREFIXES.some((prefix) => routePath.startsWith(prefix))) delete routes[key];
}

const names = [...new Set(Object.values(routes))];
const callsites = {};
for (const name of names) {
  const hits = [];
  for (const text of texts) {
    let i = 0;
    while ((i = text.indexOf("." + name + "(", i)) >= 0) {
      hits.push({ chunk: "", ctx: text.slice(Math.max(0, i - 260), i + 340) });
      i += name.length + 2;
      if (hits.length > 12) break;
    }
    if (hits.length > 12) break;
  }
  if (hits.length) callsites[name] = hits;
}

const source = `${bundles.origin}${bundles.main}`;
await writeFile(path.join(dir, "client-routes.json"), JSON.stringify({ extracted_at: new Date().toISOString(), source, total: Object.keys(routes).length, routes }, null, 2) + "\n", "utf8");
await writeFile(path.join(dir, "client-callsites.json"), JSON.stringify({ source, chunks: fetched, namesWithCallsites: Object.keys(callsites).length, callsites }, null, 2) + "\n", "utf8");
console.log(`Wrote client-routes.json (${Object.keys(routes).length} routes) and client-callsites.json (${Object.keys(callsites).length} names) from ${fetched} chunks; source=${bundles.main}`);
