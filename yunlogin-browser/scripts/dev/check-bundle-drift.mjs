#!/usr/bin/env node
/**
 * Detect drift between the deployed management-center client and the recorded route universe.
 *
 * The route catalogue in references/server-api/client-routes.json was extracted from one client
 * build. The deployed build changes its hashed bundle names on every release, so a stale universe
 * silently stops covering new routes and keeps listing removed ones. This script compares the
 * deployed bundle against the recorded source and, with --routes, re-extracts the client route map
 * and prints what was added or removed.
 *
 * Usage:
 *   node scripts/dev/check-bundle-drift.mjs [--routes] [--json] [--strict]
 *
 * Exit codes: 0 = no drift (or drift reported without --strict), 1 = drift with --strict.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CLIENT_ORIGIN, discoverBundles, fetchBundleText } from "../lib/client-bundle.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const serverDir = path.join(skillDir, "references", "server-api");

const argv = new Set(process.argv.slice(2));
const wantRoutes = argv.has("--routes");
const asJson = argv.has("--json");
const strict = argv.has("--strict");

const table = JSON.parse(readFileSync(path.join(serverDir, "client-routes.json"), "utf8"));
const recorded = new Set(Object.keys(table.routes));
const recordedBundle = String(table.source).split("/").pop();

const bundles = await discoverBundles();
const deployedBundle = bundles.main.split("/").pop();
const bundleDrift = deployedBundle !== recordedBundle;

let added = [];
let removed = [];
let extracted = null;
if (wantRoutes) {
  const seen = new Set();
  const queue = [...bundles.refs];
  const spec = /([A-Za-z0-9_\-\.\/]+-\d{10,}-[A-Za-z0-9]+-104\.js)/g;
  const call = /[A-Za-z0-9_$]+:"(GET|POST|PUT|PATCH|DELETE|DEL|HEAD),([^"]{2,140})"/g;
  const routes = {};
  let fetched = 0;
  while (queue.length && fetched < 900) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    let raw;
    try { raw = await fetchBundleText(url, { origin: bundles.origin }); } catch { continue; }
    // The origin answers unknown /js/* paths with HTTP 200 and the 2053-byte SPA shell, so a stale
    // bundle name looks like a successful fetch. Treat HTML as "not a bundle" instead of extracting zero
    // routes from it, which would otherwise report every recorded route as removed.
    if (/^\s*<!doctype html/i.test(raw.slice(0, 200))) continue;
    fetched += 1;
    const text = raw.replace(/[`']/g, '"');
    for (const match of text.matchAll(call)) {
      const method = match[1] === "DEL" ? "DELETE" : match[1];
      let p = match[2].trim();
      if (!p.startsWith("/")) p = "/" + p;
      routes[`${method} ${p}`] = true;
    }
    for (const match of raw.matchAll(spec)) {
      const base = match[1].replace(/^\.\//, "").replace(/^\/js\//, "").split("/").pop();
      const url2 = "/js/" + base;
      if (!seen.has(url2)) queue.push(url2);
    }
  }
  extracted = new Set(Object.keys(routes));
  added = [...extracted].filter((k) => !recorded.has(k)).sort();
  removed = [...recorded].filter((k) => !extracted.has(k)).sort();
}

const drifted = bundleDrift || added.length > 0 || removed.length > 0;
if (asJson) {
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), origin: CLIENT_ORIGIN, recordedBundle, deployedBundle, bundleDrift, wantRoutes, extracted: extracted ? extracted.size : null, recorded: recorded.size, added, removed, drifted }, null, 2));
} else {
  console.log(`recorded bundle: ${recordedBundle}`);
  console.log(`deployed bundle: ${deployedBundle}${bundleDrift ? "  <- DRIFT" : "  (match)"}`);
  if (wantRoutes) {
    console.log(`recorded routes: ${recorded.size}`);
    console.log(`deployed routes: ${extracted.size}`);
    console.log(`added (${added.length}):`);
    for (const key of added) console.log(`  + ${key}`);
    console.log(`removed (${removed.length}):`);
    for (const key of removed) console.log(`  - ${key}`);
  }
  if (drifted && !wantRoutes) {
    console.log("bundle name changed; the origin rebuilds the client often. Re-run with --routes to confirm the route set is unchanged.");
  } else {
    console.log(drifted ? "route set changed" : "no bundle drift");
  }
}
process.exit(strict && drifted ? 1 : 0);
