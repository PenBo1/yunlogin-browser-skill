#!/usr/bin/env node

/**
 * Read-only value-domain probe for every live route in route-sweep.json.
 *
 * Re-issues the routes that the full-surface sweep already proved are reachable and records a
 * bounded set of enum-like scalar values per response path. It never overwrites route-sweep.json
 * and never writes free-form text, identifiers, credentials, or account data.
 *
 * Usage:
 *   node scripts/dev/probe-route-values.mjs [--output <file.json>] [--filter <substring>]
 */

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readServerToken, readServerIdentity } from "../lib/local-token-store.mjs";
import { isReadOnlyRoute } from "../lib/route-safety.mjs";

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
const outputPath = option("--output", path.join(os.tmpdir(), "yunlogin-route-values.json"));
const filter = option("--filter", undefined);
const timeoutMs = Number.parseInt(option("--timeout-ms", "15000"), 10);

const sweep = JSON.parse(await readFile(path.join(skillDir, "references", "server-api", "route-sweep.json"), "utf8"));
const token = process.env.YUNLOGIN_SERVER_TOKEN ?? await readServerToken();
const identity = await readServerIdentity();
if (!token) throw new Error("No server token is available");

const ENUM_LEAF = /(status|state|type|kind|mode|level|flag|enable|enabled|role|stage|category|class|code|text|sex|gender|currency|unit|method|action|scope|pay|bill|channel|source|platform|kernel|system|day|week|month)$/i;
const NEVER_VALUE = /(pass|pwd|secret|token|cookie|credential|email|mobile|phone|account|username|url|uuid|serial|sign|key|salt|hash)/i;
const ID_LIKE = /^[0-9a-f]{16,}$/i;
const CHINESE_OK = /^[\u4e00-\u9fff]{1,12}$/;

function record(bucket, fieldPath, value) {
  const leaf = fieldPath.split(".").pop().replace(/\[\]$/, "");
  if (!ENUM_LEAF.test(leaf) || NEVER_VALUE.test(leaf)) return;
  if (typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) {
    bucket.values.add(String(value));
    return;
  }
  if (typeof value !== "string") return;
  const t = value.trim();
  if (!t) return;
  if (t.length > 24 && !CHINESE_OK.test(t)) return;
  if (t.length > 12 && CHINESE_OK.test(t)) return;
  if (t.includes("@") || ID_LIKE.test(t)) return;
  bucket.values.add(t);
}

function walk(value, fieldPath, out, depth = 0) {
  if (depth > 8) return;
  const bucket = out.get(fieldPath) ?? { types: new Set(), count: 0, values: new Set() };
  out.set(fieldPath, bucket);
  bucket.count += 1;
  if (Array.isArray(value)) { bucket.types.add("array"); for (const item of value.slice(0, 50)) walk(item, `${fieldPath}[]`, out, depth + 1); return; }
  if (value === null) { bucket.types.add("null"); return; }
  if (typeof value === "object") { bucket.types.add("object"); for (const [k, v] of Object.entries(value)) walk(v, `${fieldPath}.${k}`, out, depth + 1); return; }
  bucket.types.add(typeof value);
  if (bucket.values.size < 30) record(bucket, fieldPath, value);
}

const headers = { accept: "application/json, text/plain, */*", authorization: `Bearer ${token}`, lang: "zh", "pay-lang": "zh-TW" };
const genericBody = { companyid: identity.companyId, userid: identity.userId, company: identity.company };
const results = [];
// Never replay a mutation: some write routes create a row even for an empty or generic body
// (role-group/create did), which would leave junk on the account. The classifier is shared with the
// full-surface sweep so a future probe cannot silently drift into calling writes.
const live = sweep.results.filter((r) => r.status === "live" && isReadOnlyRoute({ method: r.method, path: r.path, name: r.name }) && (!filter || r.path.includes(filter)));
const skippedWrites = sweep.results.filter((r) => r.status === "live" && !isReadOnlyRoute({ method: r.method, path: r.path, name: r.name })).length;
for (const route of live) {
  const url = new URL(route.path, sweep.origin ?? "https://d126447d359e70c0.yunlogin.com");
  const init = { method: route.method, headers, signal: AbortSignal.timeout(timeoutMs) };
  if (route.method !== "GET") { init.headers["content-type"] = "application/json"; init.body = JSON.stringify(genericBody); }
  try {
    const response = await fetch(url, init);
    const text = await response.text();
    let payload; try { payload = JSON.parse(text); } catch {}
    const out = new Map();
    if (payload) walk(payload, "$", out);
    const fields = {};
    for (const [k, v] of out) fields[k] = { types: [...v.types].sort(), count: v.count, values: [...v.values].slice(0, 30) };
    results.push({ method: route.method, path: route.path, httpStatus: response.status, code: payload?.code, fields });
  } catch (error) {
    results.push({ method: route.method, path: route.path, error: error.cause?.code ?? error.name });
  }
}
const doc = { testedAt: new Date().toISOString(), origin: sweep.origin, liveRoutes: sweep.results.filter((r) => r.status === "live").length, skippedMutationRoutes: skippedWrites, endpointCount: results.length, results };
await writeFile(outputPath, JSON.stringify(doc, null, 2), "utf8");
const withValues = results.filter((r) => r.fields && Object.values(r.fields).some((f) => f.values.length)).length;
console.error(`Wrote route values: ${outputPath} (${results.length} routes, ${withValues} with enum values, ${skippedWrites} mutation routes skipped)`);
