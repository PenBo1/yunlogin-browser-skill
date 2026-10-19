#!/usr/bin/env node
/**
 * Infer request-field types by sending one deliberately wrong type per field.
 *
 * Go's decoder names the struct, the field, and the wanted type when a value has the wrong shape, for
 * example: `json: cannot unmarshal object into Go struct field AccountsGetPageReq.self of type bool`.
 * A wrong type is rejected before any write happens, so this probe cannot mutate the account. It only
 * works for routes whose remaining fields are already valid; feed it a valid baseline body.
 *
 * Usage: node scripts/dev/probe-field-types.mjs [--output <file.json>]
 */
import { readFile, writeFile } from "node:fs/promises";
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
const outputPath = option("--output", path.join(os.tmpdir(), "yunlogin-field-types.json"));

const base = "https://d126447d359e70c0.yunlogin.com";
const token = await readServerToken();
const id = await readServerIdentity();
const H = { accept: "application/json, text/plain, */*", authorization: `Bearer ${token}`, "content-type": "application/json", lang: "zh" };
const WRONG = { __type_probe__: 1 };

// Prerequisite ids so each baseline body actually succeeds.
async function readJson(method, routePath, body) {
  const r = await fetch(base + routePath, { method, headers: H, body: method === "GET" ? undefined : JSON.stringify(body ?? {}), signal: AbortSignal.timeout(20000) });
  try { return JSON.parse(await r.text()); } catch { return {}; }
}
const envs = await readJson("POST", "/v2/newbrowser/getconditionshops", { number: 1, offer: 0, companyid: id.companyId, userid: id.userId });
const shopid = (envs?.shop ?? [])[0]?.shopid ?? "";
const groups = await readJson("POST", "/v2/newbrowser/getgroups", { company: id.company ?? "", companyid: id.companyId, userid: id.userId });
const groupId = (groups?.group ?? [])[0]?.gropid ?? "";

async function post(routePath, body) {
  const r = await fetch(base + routePath, { method: "POST", headers: H, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
  const text = await r.text();
  let payload; try { payload = JSON.parse(text); } catch {}
  return { httpStatus: r.status, code: payload?.code, msg: typeof payload?.msg === "string" ? payload.msg.replace(/\s+/g, " ").slice(0, 200) : undefined };
}

// Each case supplies a baseline body that already succeeds, plus the fields to type-probe.
const CASES = [
  {
    route: "/v2/newbrowser/getconditionshops",
    baseline: { number: 1, offer: 0, companyid: id.companyId, userid: id.userId },
    fields: ["number", "offer", "companyid", "userid", "company", "enable", "browserid", "self", "transfers", "share", "authorities", "shopname", "sortorder", "currentPage", "o"],
  },
  {
    route: "/v2/proxy/device/findDevices",
    baseline: { device_ids: [], trademark: "self" },
    fields: ["device_ids", "trademark", "device_type", "status"],
  },
  {
    route: "/v2/message/user-notice/my",
    baseline: { noticeType: 0, page: 1, pageSize: 5, companyid: id.companyId, userid: id.userId },
    fields: ["noticeType", "page", "pageSize", "companyid", "userid"],
  },
  {
    route: "/v2/newbrowser/getShopAndAuthList",
    baseline: { shopid: [shopid] },
    fields: ["shopid"],
  },
  {
    route: "/v2/newbrowser/getshopnameandproxylist",
    baseline: { shopids: [shopid] },
    fields: ["shopids"],
  },
  {
    route: "/v2/newbrowser/getgroups",
    baseline: { company: id.company ?? "", companyid: id.companyId, userid: id.userId },
    fields: ["company", "companyid", "userid"],
  },
  {
    route: "/v2/newbrowser/getgroupusers",
    baseline: { groupid: groupId },
    fields: ["groupid"],
  },
  {
    route: "/v2/team/company/ids",
    baseline: { ids: [id.companyId] },
    fields: ["ids"],
  },
  {
    route: "/v2/team/company/info",
    baseline: { id: id.companyId },
    fields: ["id"],
  },
  {
    route: "/v2/team/company/getApprovals",
    baseline: { pageSize: 5, pageIndex: 1 },
    fields: ["pageSize", "pageIndex"],
  },
  {
    route: "/v2/rpa/getRpaPlanManagementList",
    baseline: { userId: id.userId, accountIds: [], executeType: 0 },
    fields: ["userId", "accountIds", "executeType"],
  },
  {
    route: "/v2/newbrowser/getuserauthshops",
    baseline: { userid: id.userId },
    fields: ["userid"],
  },
  {
    route: "/v2/newbrowser/getshopkernelVersions",
    baseline: { shopids: [shopid] },
    fields: ["shopids"],
  },
  {
    route: "/v2/cost/costmanagement/getOrderDetailNewByMultiple",
    baseline: { oids: [], details_nos: [] },
    fields: ["oids", "details_nos"],
  },
  {
    route: "/v2/team/role/members",
    baseline: { id: "" },
    fields: ["id"],
  },
  {
    route: "/v2/team/member/ids",
    baseline: { userIds: [id.userId] },
    fields: ["userIds"],
  },
];

// The route table maps `METHOD /path` to the client function name, which the classifier needs.
const routeTable = JSON.parse(await readFile(path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "")), "..", "..", "references", "server-api", "client-routes.json"), "utf8")).routes;
for (const c of CASES) {
  const name = routeTable[`POST ${c.route}`] ?? "";
  if (!isReadOnlyRoute({ method: "POST", path: c.route, name })) throw new Error(`field-type probe targets a write route: ${c.route} (${name})`);
}

const structRe = /Go struct field ([A-Za-z0-9_.]*?(\w+)) of type ([^"';]+)/;
const out = [];
for (const c of CASES) {
  const check = await post(c.route, c.baseline);
  if (check.code !== 200 && check.code !== 0) {
    out.push({ route: c.route, field: "(baseline)", ok: false, note: `baseline body is not accepted: code=${check.code} ${check.msg ?? ""}` });
    console.error(`${c.route} baseline rejected: ${check.code} ${check.msg ?? ""}`);
    continue;
  }
  for (const field of c.fields) {
    const body = { ...c.baseline, [field]: WRONG };
    const res = await post(c.route, body);
    const m = String(res.msg ?? "").match(structRe);
    out.push({ route: c.route, field, code: res.code, struct: m?.[1], wanted: m?.[3]?.trim(), msg: res.msg });
    console.error(`${c.route} ${field} -> code=${res.code} ${m ? `type=${m[3].trim()}` : (res.msg ?? "").slice(0, 60)}`);
  }
}
await writeFile(outputPath, JSON.stringify({ probedAt: new Date().toISOString(), origin: base, results: out }, null, 2), "utf8");
console.error(`Wrote ${outputPath} (${out.length} rows)`);
