#!/usr/bin/env node

/**
 * Re-probe the routes that need real parameters and merge the fresh response shape into
 * route-sweep.json.
 *
 * sweep-all-routes.mjs probes every route with a generic body, so a route that needs a specific
 * query or body field only ever records its "missing parameter" shape. The reproducible call list
 * lives in ../lib/resolved-calls.mjs so the drift detector can replay the same calls.
 *
 * Usage: node scripts/dev/reprobe-resolved-routes.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readServerToken } from "../lib/local-token-store.mjs";
import { buildResolvedCalls, collectFields } from "../lib/resolved-calls.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const sweepPath = path.join(skillDir, "references", "server-api", "route-sweep.json");
const origin = "https://d126447d359e70c0.yunlogin.com";
const token = await readServerToken();
if (!token) throw new Error("No server token available");

// The origin occasionally drops a TLS handshake; one retry keeps the pass from aborting.
async function fetchWithRetry(url, init, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw lastError;
}

const { calls } = await buildResolvedCalls({ origin, token });
const sweep = JSON.parse(await readFile(sweepPath, "utf8"));
const byKey = new Map(sweep.results.map((r) => [r.key, r]));

for (const item of calls) {
  const row = byKey.get(item.key);
  if (!row) { console.log("skip (not in sweep):", item.key); continue; }
  const url = new URL(item.path ?? row.path, origin);
  for (const [k, v] of Object.entries(item.query ?? {})) url.searchParams.set(k, String(v));
  const headers = { accept: "application/json, text/plain, */*", lang: "zh", authorization: `Bearer ${token}` };
  let body;
  if (row.method !== "GET") { headers["content-type"] = "application/json"; body = JSON.stringify(item.body ?? {}); }
  const started = Date.now();
  const response = await fetchWithRetry(url, { method: row.method, headers, body, signal: AbortSignal.timeout(20000) });
  const text = await response.text();
  let payload; try { payload = JSON.parse(text); } catch {}
  const fields = collectFields(payload);
  row.httpStatus = response.status;
  row.code = payload?.code;
  row.msgCode = payload?.msgCode;
  row.msg = typeof payload?.msg === "string" ? payload.msg.slice(0, 120) : undefined;
  row.bytes = Buffer.byteLength(text);
  row.ms = Date.now() - started;
  // Replace, do not union: a union across runs would hide a field that the server stopped returning.
  row.fields = fields;
  row.fieldCount = row.fields.length;
  row.reprobedAt = new Date().toISOString();
  console.log(`${row.key}\thttp=${response.status}\tcode=${payload?.code ?? ""}\tfields=${fields.length}`);
}

sweep.reprobedAt = new Date().toISOString();
await writeFile(sweepPath, JSON.stringify(sweep, null, 2), "utf8");
console.log("updated", sweepPath);
