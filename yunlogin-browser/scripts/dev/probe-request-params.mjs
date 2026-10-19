#!/usr/bin/env node

/**
 * Read-only request-parameter probe.
 *
 * For each enum-like request parameter on the cataloged list routes, sends a baseline value and a
 * range of candidate values, then records the business code, message, and response size. The size
 * is what shows whether a filter actually filtered, was ignored, or fell through to "everything".
 *
 * Usage:
 *   node scripts/dev/probe-request-params.mjs [--output <file.json>]
 */

import { writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { readServerToken, readServerIdentity } from "../lib/local-token-store.mjs";
import { isReadOnlyRoute } from "../lib/route-safety.mjs";

const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}
const outputPath = option("--output", path.join(os.tmpdir(), "yunlogin-request-params.json"));

const base = "https://d126447d359e70c0.yunlogin.com";
const token = await readServerToken();
const id = await readServerIdentity();
const H = { accept: "application/json, text/plain, */*", authorization: `Bearer ${token}`, "content-type": "application/json", lang: "zh", "pay-lang": "zh-TW" };
const ctx = { userid: id.userId, companyid: id.companyId };
const companyName = id.company ?? "";

async function call(method, p, { body, query } = {}) {
  const u = new URL(p, base);
  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) u.searchParams.set(k, v === null ? "" : String(v));
  const init = { method, headers: H, signal: AbortSignal.timeout(20000) };
  if (method !== "GET") init.body = JSON.stringify(body ?? {});
  const started = Date.now();
  try {
    const r = await fetch(u, init);
    const text = await r.text();
    let j; try { j = JSON.parse(text); } catch {}
    const d = j?.data;
    const rows = Array.isArray(d) ? d.length : Array.isArray(d?.data) ? d.data.length : Array.isArray(d?.list) ? d.list.length : Array.isArray(j?.list) ? j.list.length : null;
    const total = d?.total ?? j?.count ?? null;
    return { httpStatus: r.status, code: j?.code ?? j?.msgCode, msg: typeof j?.msg === "string" ? j.msg.slice(0, 160) : undefined, rows, total, bytes: Buffer.byteLength(text), ms: Date.now() - started };
  } catch (e) {
    return { error: e.cause?.code ?? e.name, ms: Date.now() - started };
  }
}

const cloud = (status) => ["GET", "/v2/proxy/device/vcnplist", { query: { ...ctx, page: 1, per_page: 20, status } }];
const self = (over) => ["GET", "/v2/proxy/device/findDeviceProxyUserSelves", { query: { ...ctx, page: 1, per_page: 20, status: 1, trademark: "self", ...over } }];
const dyn = (over) => ["GET", "/v2/proxy/device/findDeviceDynamicProxies", { query: { ...ctx, page: 1, per_page: 20, status: 0, trademark: "general", ...over } }];
const notices = (noticeType) => ["POST", "/v2/message/user-notice/my", { body: { noticeType, page: 1, pageSize: 5 } }];
const rpa = (executeType) => ["POST", "/v2/rpa/getRpaPlanManagementList", { body: { userId: id.userId, accountIds: [], executeType } }];
const groups = (over) => ["POST", "/v2/newbrowser/getgroups", { body: { company: companyName, companyid: id.companyId, userid: id.userId, ...over } }];
const devices = (over) => ["POST", "/v2/proxy/device/findDevices", { body: { device_ids: [], trademark: "official", ...over } }];
const envOffer = (offer) => ["POST", "/v2/newbrowser/getconditionshops", { body: { number: 5, offer, companyid: id.companyId, userid: id.userId } }];
const cloudType = (v) => ["GET", "/v2/proxy/device/vcnplist", { query: { ...ctx, page: 1, per_page: 20, cloud_type: v } }];
const cloudEnable = (v) => ["GET", "/v2/proxy/device/vcnplist", { query: { ...ctx, page: 1, per_page: 20, is_enable: v } }];
const cloudPage = (page) => ["GET", "/v2/proxy/device/vcnplist", { query: { ...ctx, page, per_page: 2, status: 0 } }];
const couponPerPage = (per_page) => ["GET", "/v2/cost/costmanagement/user_coupons_list", { query: { type: 1, page: 1, per_page } }];
const invites = (status) => ["GET", "/v2/retail/getUserCompanyInviteList", { query: { pageIndex: 1, pageSize: 20, status } }];
const envs = (over) => ["POST", "/v2/newbrowser/getconditionshops", { body: { number: 5, offer: 0, companyid: id.companyId, userid: id.userId, ...over } }];
const coupons = (type) => ["GET", "/v2/cost/costmanagement/user_coupons_list", { query: { type, page: 1, per_page: 10 } }];
const core = (channel) => ["POST", "/v2/team/version/getCore", { body: { appVersion: "", versionCode: 0, bitness: "64", platform: "windows", browser: "chrome", deviceId: "", mac: "", computerName: "", channel, appId: "yunlogin" } }];

const CASES = [
  ["proxy-cloud-list", "status", [0, 1, 2, 3, 4, 99, "abc"], cloud],
  ["proxy-self-list", "status", [0, 1, 2, 99], (v) => self({ status: v })],
  ["proxy-self-list", "proxy_type", ["", "1", "2", "self", "official"], (v) => self({ proxy_type: v })],
  ["proxy-self-list", "ip_type", ["", "1", "2", "9"], (v) => self({ ip_type: v })],
  ["proxy-dynamic-list", "status", [0, 1, 2, 99], (v) => dyn({ status: v })],
  ["proxy-dynamic-list", "ip_type", ["", "1", "2", "9"], (v) => dyn({ ip_type: v })],
  ["user-notices", "noticeType", [0, 1, 2, 3, -1, 99], notices],
  ["rpa-plan-list", "executeType", [11, 0, 1, 2, 10, 12, 99], rpa],
  ["browser-list", "number", [1, 5, 0], (v) => envs({ number: v })],
  ["browser-list", "enable", [0, 1, 2], (v) => envs({ enable: v })],
  ["getgroups", "company", [companyName, "garbage-team-name"], (v) => groups({ company: v })],
  ["getgroups", "companyid", [id.companyId, "deadbeefdeadbeefdeadbeefdeadbeef"], (v) => groups({ companyid: v })],
  ["getgroups", "userid", [id.userId, "deadbeefdeadbeefdeadbeefdeadbeef"], (v) => groups({ userid: v })],
  ["find-devices", "trademark", ["self", "official", "garbage"], (v) => devices({ trademark: v })],
  ["find-devices", "device_type", [0, 1, 2], (v) => devices({ device_type: v })],
  ["find-devices", "status", [0, 1, 2], (v) => devices({ status: v })],
  ["browser-list", "companyid", [id.companyId, "deadbeefdeadbeefdeadbeefdeadbeef"], (v) => envs({ number: 5, companyid: v })],
  ["browser-list", "company", [companyName, "garbage-team-name"], (v) => envs({ number: 5, company: v })],
  ["browser-list", "currentPage", [1, 99], (v) => envs({ number: 5, currentPage: v })],
  ["browser-list", "o", [0, 1], (v) => envs({ number: 5, o: v })],
  ["browser-list", "self", [false, true], (v) => envs({ number: 50, self: v })],
  ["browser-list", "transfers", [false, true], (v) => envs({ number: 50, transfers: v })],
  ["browser-list", "share", [false, true], (v) => envs({ number: 50, share: v })],
  ["browser-list", "sortorder", [0, 1, 12, 99], (v) => envs({ number: 3, sortorder: v })],
  ["browser-list", "offer", [0, 5, 999999, -1], envOffer],
  ["proxy-cloud-list", "cloud_type", [1, 2, 4, 0, 99], cloudType],
  ["proxy-cloud-list", "is_enable", [1, 0, 2], cloudEnable],
  ["proxy-cloud-list", "page", [1, 2, 0, -1, 999999], cloudPage],
  ["user-coupons", "per_page", [1, 5, 100, 0, -1], couponPerPage],
  ["invite-list", "status", [1, 2, 3, 0, 99], invites],
  ["user-coupons", "type", [1, 2, 0, 99], coupons],
  ["version-core", "channel", ["", "stable", "beta", "dev", "x"], core],
];

// Guard: every parameter case must target a read-only route. A write route here would mutate the
// account on each run, which is exactly the failure mode the shared classifier exists to prevent.
for (const [endpoint, param, values, make] of CASES) {
  const [method, routePath] = make(values[0]);
  if (!isReadOnlyRoute({ method, path: routePath })) {
    throw new Error(`probe-request-params case ${endpoint}/${param} targets a write route: ${method} ${routePath}`);
  }
}

const cases = [];
for (const [endpoint, param, values, make] of CASES) {
  for (const value of values) {
    const [method, routePath, init] = make(value);
    const result = await call(method, routePath, init);
    cases.push({ endpoint, param, value, method, path: routePath, ...result });
    console.error(`${endpoint} ${param}=${JSON.stringify(value)} code=${result.code ?? result.error} rows=${result.rows ?? "-"} total=${result.total ?? "-"}`);
  }
}
await writeFile(outputPath, JSON.stringify({ testedAt: new Date().toISOString(), origin: base, cases }, null, 2), "utf8");
console.error(`Wrote ${outputPath} (${cases.length} cases)`);
