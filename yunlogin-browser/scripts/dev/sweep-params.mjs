#!/usr/bin/env node

/**
 * Parameter sweep driver for the cataloged YunLogin management-center API.
 *
 * Runs an explicit list of request-parameter cases (from a JSON file) against
 * cataloged endpoints, writes each raw response to an output directory for
 * offline field analysis, and prints a compact status table.
 *
 * Usage:
 *   node scripts/dev/sweep-params.mjs --cases cases.json --out ./out
 *
 * Case shape:
 *   { "name": "browser-list/page-size", "id": "browser-list",
 *     "query": { "page": 2 }, "body": { "number": 5 }, "note": "..." }
 *
 * Raw response values are written only under --out (a temp directory by
 * default) and are never copied into the skill.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readServerToken, readServerIdentity } from "../lib/local-token-store.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const catalogPath = path.join(skillDir, "references", "server-api", "endpoints.json");
const args = process.argv.slice(2);

function option(name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  const value = args[index + 1];
  if (value === undefined || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return value;
}

const casesPath = option("--cases");
if (!casesPath) throw new Error("--cases FILE is required");
const outDir = option("--out", path.join(os.tmpdir(), "yunlogin-param-sweep"));
const timeoutMs = Number.parseInt(option("--timeout-ms", "30000"), 10);
const onlyId = option("--filter");
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) throw new Error("--timeout-ms must be a positive integer");

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const cases = JSON.parse(await readFile(casesPath, "utf8"));
const token = process.env.YUNLOGIN_SERVER_TOKEN ?? await readServerToken();
const identity = await readServerIdentity();
const companyId = process.env.YUNLOGIN_SERVER_COMPANY_ID ?? identity.companyId;
const userId = process.env.YUNLOGIN_SERVER_USER_ID ?? identity.userId;
if (!token) throw new Error("No server token is available (set YUNLOGIN_SERVER_TOKEN or cache a session)");

const byId = new Map(catalog.endpoints.map((endpoint) => [endpoint.id, endpoint]));
await mkdir(outDir, { recursive: true });

function isEmpty(value) {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function expandIdentity(endpoint, object) {
  for (const [key, value] of Object.entries(object)) {
    if (!isEmpty(value)) continue;
    const lower = key.toLowerCase();
    if (lower === "companyid") object[key] = companyId;
    else if (lower === "userid" || lower === "user_id") object[key] = userId;
  }
  return object;
}

function headersFor(endpoint) {
  const headers = new Headers({
    accept: "application/json, text/plain, */*",
    lang: process.env.YUNLOGIN_SERVER_LANG ?? "zh",
  });
  for (const [name, value] of Object.entries(endpoint.header_defaults ?? {})) headers.set(name, String(value));
  if (endpoint.requires_auth !== false) headers.set("authorization", `Bearer ${token}`);
  if (endpoint.method !== "GET") headers.set("content-type", "application/json");
  if (process.env.YUNLOGIN_SERVER_COOKIE) headers.set("cookie", process.env.YUNLOGIN_SERVER_COOKIE);
  return headers;
}

const index = [];
for (const testCase of cases) {
  if (onlyId && testCase.id !== onlyId) continue;
  const endpoint = byId.get(testCase.id);
  if (!endpoint) throw new Error(`Unknown endpoint id: ${testCase.id}`);
  const body = endpoint.method === "GET" ? undefined : expandIdentity(endpoint, { ...(endpoint.body_defaults ?? {}), ...(testCase.body ?? {}) });
  const query = expandIdentity(endpoint, { ...(endpoint.query_defaults ?? {}), ...(testCase.query ?? {}) });
  const url = new URL(endpoint.path, catalog.default_origin);
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) url.searchParams.set(name, String(value));
  }
  const started = Date.now();
  let httpStatus, text = "", payload;
  try {
    const response = await fetch(url, {
      method: endpoint.method,
      headers: headersFor(endpoint),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    httpStatus = response.status;
    text = await response.text();
    try { payload = JSON.parse(text); } catch { payload = undefined; }
  } catch (error) {
    httpStatus = "ERR";
    text = JSON.stringify({ error: error.message });
  }
  const ms = Date.now() - started;
  const file = path.join(outDir, `${testCase.name.replace(/[^\w.-]+/g, "_")}.json`);
  await writeFile(file, text, "utf8");
  const row = {
    name: testCase.name,
    id: testCase.id,
    method: endpoint.method,
    httpStatus,
    code: payload?.code,
    msg: typeof payload?.msg === "string" ? payload.msg.slice(0, 120) : undefined,
    bytes: Buffer.byteLength(text),
    ms,
    note: testCase.note,
    file,
    request: {
      query: endpoint.method === "GET" ? query : undefined,
      body,
    },
  };
  index.push(row);
  console.log([testCase.name, endpoint.method, httpStatus, payload?.code ?? "", row.bytes, ms, testCase.note ?? ""].join("\t"));
}

await writeFile(path.join(outDir, "_index.json"), JSON.stringify(index, null, 2), "utf8");
console.log(`\nWrote ${index.length} cases to ${outDir}`);
