#!/usr/bin/env node

/**
 * Availability + shape sweep across every route in client-routes.json.
 *
 * The route table is extracted from the management-center client bundle and is
 * the authoritative list of server-side API calls. Read routes are probed live
 * with minimal input; write routes are skipped unless --include-writes is set,
 * and a small catastrophic blocklist is always skipped.
 *
 * Usage:
 *   node scripts/dev/sweep-all-routes.mjs --out out.json [--filter /v2/cost]
 *     [--include-writes] [--timeout-ms 20000]
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readServerToken, readServerIdentity } from "../lib/local-token-store.mjs";
import { isCatastrophic, isReadOnlyRoute } from "../lib/route-safety.mjs";
import { resolveClientOrigin } from "../lib/client-origin.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const origin = "https://d126447d359e70c0.yunlogin.com";
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}
const outPath = option("--out", path.join(process.env.TEMP ?? ".", "yunlogin-route-sweep.json"));
const filter = option("--filter");
const includeWrites = args.includes("--include-writes");
const timeoutMs = Number.parseInt(option("--timeout-ms", "20000"), 10);

const table = JSON.parse(await readFile(path.join(skillDir, "references", "server-api", "client-routes.json"), "utf8"));
const token = await readServerToken();
// The client bundle mixes three surfaces. Paths under these prefixes belong to the local client API and
// have to be probed on its discovered loopback port, not against the management-center origin.
const CLIENT_SURFACE = /^\/api\/v1\/(client|settings|cores|ipify)\//;
const clientOrigin = await resolveClientOrigin().catch(() => null);
function surfaceOf(routePath) {
  return CLIENT_SURFACE.test(routePath) ? "client" : "server";
}
const identity = await readServerIdentity();
if (!token) throw new Error("No server token available");


function protocolOf(method) { return method === "GET" ? "GET" : method; }

const results = [];
for (const [key, name] of Object.entries(table.routes)) {
  const [method, routePath] = key.split(" ");
  if (filter && !routePath.startsWith(filter)) continue;
  // Route safety comes from the shared classifier so every probe agrees on what a read is.
  const dangerous = isCatastrophic(name) || isCatastrophic(routePath);
  const readOnly = isReadOnlyRoute({ method, path: routePath, name });
  if (dangerous) { results.push({ key, name, path: routePath, method, status: "skipped", reason: "catastrophic blocklist" }); continue; }
  if (!readOnly && !includeWrites) { results.push({ key, name, path: routePath, method, status: "skipped", reason: "write route" }); continue; }
  const surface = surfaceOf(routePath);
  const targetOrigin = surface === "client" && clientOrigin ? clientOrigin : origin;
  const url = new URL(routePath.replace(/\{[^}]+\}/g, "00000000000000000000000000000000"), targetOrigin);
  const headers = { accept: "application/json, text/plain, */*", lang: "zh", authorization: `Bearer ${token}` };
  let body;
  if (method !== "GET") { headers["content-type"] = "application/json"; body = JSON.stringify({ companyid: identity.companyId, userid: identity.userId, company: identity.company }); }
  const started = Date.now();
  try {
    const response = await fetch(url, { method, headers, body, signal: AbortSignal.timeout(timeoutMs) });
    const text = await response.text();
    // Two HTML shapes mean the client is calling something the server will not serve as JSON:
    //   - HTTP 200 with the single-page-app shell (the path has no handler, so it falls through);
    //   - HTTP 405, a method the path does not allow.
    // Real HTML content pages (the agreement documents) stay live: they only match neither branch.
    const contentType = response.headers.get("content-type") ?? "";
    const isHtml = contentType.includes("text/html");
    const isSpaShell = response.status === 200 && isHtml && /\/js\/index-[\w-]+\.js/.test(text);
    const isMethodNotAllowed = response.status === 405 && isHtml;
    // The origin also answers a plain-text 404 for a path it has no handler for (either HTML
    // `File not found.` or Go's `404 page not found`), which is a dead route just like the SPA shell.
    const isPlainNotFound = response.status === 404 && text.length < 64 && !/^\s*[{[]/.test(text);
    if (isSpaShell || isMethodNotAllowed || isPlainNotFound) {
      const reason = isSpaShell ? "SPA shell: the path has no handler" : isMethodNotAllowed ? "HTTP 405: the client method is not allowed on this path" : "HTTP 404: the path has no handler";
      results.push({ key, name, path: routePath, method, surface, status: "dead", reason, httpStatus: response.status, bytes: Buffer.byteLength(text), ms: Date.now() - started });
      console.log(`${method} ${routePath}\tDEAD\t${reason}\t${Buffer.byteLength(text)}B`);
      continue;
    }
    let payload; try { payload = JSON.parse(text); } catch { payload = undefined; }
    const fields = new Set();
    (function walk(v, p, d) { if (!v || typeof v !== "object" || d > 6) return; if (Array.isArray(v)) { if (v[0] !== undefined) walk(v[0], p + "[]", d + 1); return; } for (const [k, c] of Object.entries(v)) { fields.add(`${p}.${k}`); walk(c, `${p}.${k}`, d + 1); } })(payload, "$", 0);
    results.push({ key, name, path: routePath, method, surface, status: "live", httpStatus: response.status, code: payload?.code, msgCode: payload?.msgCode, msg: typeof payload?.msg === "string" ? payload.msg.slice(0, 120) : undefined, bytes: Buffer.byteLength(text), ms: Date.now() - started, fieldCount: fields.size, fields: [...fields].slice(0, 300) });
    console.log(`${method} ${routePath}\thttp=${response.status}\tcode=${payload?.code ?? ""}\t${Buffer.byteLength(text)}B\t${typeof payload?.msg === "string" ? payload.msg.slice(0,40).replace(/\s+/g," ") : ""}`);
  } catch (error) {
    results.push({ key, name, path: routePath, method, surface, status: "error", ms: Date.now() - started, error: error.message });
    console.log(`${method} ${routePath}\tERROR\t${error.message}`);
  }
}
await writeFile(outPath, JSON.stringify({ ranAt: new Date().toISOString(), origin, total: results.length, results }, null, 2), "utf8");
const live = results.filter(r => r.status === "live");
const skipped = results.filter(r => r.status === "skipped");
const dead = results.filter(r => r.status === "dead");
console.log(`\nprobed=${live.length} skipped=${skipped.length} dead=${dead.length} total=${results.length}`);
console.log(`200=${live.filter(r=>r.httpStatus===200).length} 404=${live.filter(r=>r.httpStatus===404).length} other=${live.filter(r=>r.httpStatus!==200&&r.httpStatus!==404).length}`);
console.log(`wrote ${outPath}`);
