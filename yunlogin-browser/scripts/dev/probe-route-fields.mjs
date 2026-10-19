#!/usr/bin/env node

/**
 * Read-only field inventory probe over the full server route universe.
 *
 * probe-server-api.mjs covers the 54 cataloged endpoints. This tool covers the 507-route
 * universe from route-sweep.json, so an account with richer data can prove the response
 * shape of routes the first account could not reach. It calls only GET routes and POST
 * routes whose path is not write-named, sends `{}` as the body, and records field paths,
 * types, bounded enum-like values, and counts - never tokens, cookies, or free-form values.
 *
 * Identity is taken from the JWT `iss` (company) and `jti` (user) claims unless the
 * matching YUNLOGIN_SERVER_* variables override them, so the same tool runs against any
 * supplied session.
 */

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readServerToken } from "../lib/local-token-store.mjs";
import { isReadOnlyRoute } from "../lib/route-safety.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const sweepPath = path.join(skillDir, "references", "server-api", "route-sweep.json");

const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  const value = args[index + 1];
  if (value === undefined || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
}
const origin = option("--origin", "https://d126447d359e70c0.yunlogin.com");
const outputPath = option("--output", path.join(os.tmpdir(), "yunlogin-route-field-inventory.json"));
const timeoutMs = Number.parseInt(option("--timeout-ms", "15000"), 10);
const onlyUnreprobed = !args.includes("--all");
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) throw new Error("--timeout-ms must be a positive integer");

const ENUM_LEAF = /(status|state|type|kind|mode|level|category|platform|source|reason|role|flag|priority)$/i;
const NEVER_VALUE = /^(id|uuid|url|uri|token|password|secret|key|code|no|number|name|text|content|email|phone|mobile|ip|time|date|_at|created|updated|deleted)$/i;
const ID_LIKE = /^[0-9a-f]{16,}$/i;

function decodeJwtPayload(value) {
  if (!value || typeof value !== "string") return {};
  const parts = value.split(".");
  if (parts.length !== 3) return {};
  try { return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")); } catch { return {}; }
}

const token = process.env.YUNLOGIN_SERVER_TOKEN ?? await readServerToken();
if (!token) throw new Error("No server token: set YUNLOGIN_SERVER_TOKEN or save a session");
const jwt = decodeJwtPayload(token);
const companyId = process.env.YUNLOGIN_SERVER_COMPANY_ID ?? jwt.iss ?? "";
const userId = process.env.YUNLOGIN_SERVER_USER_ID ?? jwt.jti ?? "";

function recordEnumValue(entry, currentPath, value) {
  if (entry.values.size >= 30) return;
  const leaf = currentPath.split(".").pop().replace(/\[\]$/, "");
  if (!ENUM_LEAF.test(leaf) || NEVER_VALUE.test(leaf)) return;
  if (typeof value === "boolean") { entry.values.add(String(value)); return; }
  if (typeof value === "number" && Number.isFinite(value)) { entry.values.add(String(value)); return; }
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 24 || trimmed.includes("@") || ID_LIKE.test(trimmed)) return;
  entry.values.add(trimmed);
}

function summarize(value, currentPath = "$", output = new Map(), depth = 0) {
  if (depth > 8) return output;
  const entry = output.get(currentPath) ?? { types: new Set(), count: 0, arrayLengths: new Set(), values: new Set() };
  output.set(currentPath, entry);
  entry.count += 1;
  if (Array.isArray(value)) {
    entry.types.add("array");
    entry.arrayLengths.add(value.length);
    for (const item of value.slice(0, 50)) summarize(item, `${currentPath}[]`, output, depth + 1);
    return output;
  }
  if (value === null) { entry.types.add("null"); return output; }
  if (typeof value === "object") {
    entry.types.add("object");
    for (const [key, child] of Object.entries(value)) summarize(child, `${currentPath}.${key}`, output, depth + 1);
    return output;
  }
  entry.types.add(typeof value);
  recordEnumValue(entry, currentPath, value);
  return output;
}

function serializeSummary(summary) {
  return Object.fromEntries([...summary.entries()].map(([field, value]) => [field, {
    types: [...value.types].sort(),
    count: value.count,
    arrayLengths: [...value.arrayLengths].slice(0, 20),
    values: [...value.values].slice(0, 30),
  }]));
}

const sweep = JSON.parse(await readFile(sweepPath, "utf8"));
// The shared classifier keeps catastrophics (destroy, logout, identity) and writes out of the probe.
const universe = sweep.results.filter((route) => isReadOnlyRoute({ method: route.method, path: route.path }));
const candidates = onlyUnreprobed ? universe.filter((route) => !route.reprobedAt) : universe;

const headers = { authorization: `Bearer ${token}`, accept: "application/json, text/plain, */*", lang: process.env.YUNLOGIN_SERVER_LANG ?? "zh" };
const results = [];
let index = 0;
for (const route of candidates) {
  index += 1;
  const url = new URL(route.path, origin);
  const requestHeaders = { ...headers };
  let body;
  if (route.method !== "GET") { requestHeaders["content-type"] = "application/json"; body = "{}"; }
  let record;
  try {
    const response = await fetch(url, { method: route.method, headers: requestHeaders, body, signal: AbortSignal.timeout(timeoutMs) });
    const text = await response.text();
    let payload; try { payload = JSON.parse(text); } catch {}
    const fieldSummary = payload ? serializeSummary(summarize(payload)) : {};
    // Ten live routes legitimately omit `code` (the plugin catalogue, agreement pages). Success is
    // HTTP 200 with a JSON body that has fields, not the presence of a code field.
    const success = response.status === 200 && Object.keys(fieldSummary).length > 0 && (payload?.code === undefined || payload.code === 200 || payload.code === 0);
    record = {
      key: route.key,
      method: route.method,
      path: route.path,
      httpStatus: response.status,
      success,
      code: payload?.code ?? null,
      msg: typeof payload?.msg === "string" ? payload.msg.slice(0, 160) : undefined,
      fieldCount: Object.keys(fieldSummary).length,
      fields: fieldSummary,
    };
  } catch (error) {
    record = { key: route.key, method: route.method, path: route.path, error: error.cause?.code ?? error.name };
  }
  results.push(record);
  process.stdout.write(`\r${index}/${candidates.length} ${route.path}                    `);
}
process.stdout.write("\n");
const withFields = results.filter((row) => (row.fieldCount ?? 0) > 0).length;
console.log(`probed ${results.length}; routes with fields ${withFields}`);
await writeFile(outputPath, JSON.stringify({
  ranAt: new Date().toISOString(),
  origin,
  companyId,
  userId,
  scope: onlyUnreprobed ? "route-sweep rows without reprobedAt" : "all read-shaped routes",
  results,
}, null, 2));
console.error(`Wrote route field inventory: ${outputPath}`);
