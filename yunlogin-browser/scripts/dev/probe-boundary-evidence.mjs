#!/usr/bin/env node

/**
 * Boundary evidence for the routes that remain blocked after two accounts were tested.
 *
 * For each candidate the script separates three questions: does the prerequisite exist on this
 * account, does the client ever call the route, and what did the server answer. That is what turns
 * "could not test" into "here is exactly which prerequisite is missing".
 *
 * Runs against whichever session YUNLOGIN_SERVER_TOKEN(_FILE) points at. Read-only: it inspects and
 * reports, it never creates the missing prerequisite.
 */

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { readServerToken, readServerIdentity } from "../lib/local-token-store.mjs";

const ORIGIN = process.env.YUNLOGIN_SERVER_ORIGIN ?? "https://d126447d359e70c0.yunlogin.com";
const token = await readServerToken();
if (!token) throw new Error("No server token: set YUNLOGIN_SERVER_TOKEN or save a session");
const identity = await readServerIdentity();
const headers = { authorization: `Bearer ${token}`, accept: "application/json, text/plain, */*", lang: "zh", "content-type": "application/json" };

async function call(method, routePath, body) {
  if (method === "GET") {
    const response = await fetch(new URL(routePath, ORIGIN), { method, headers, signal: AbortSignal.timeout(20000) });
    const text = await response.text();
    let payload; try { payload = JSON.parse(text); } catch {}
    return { httpStatus: response.status, code: payload?.code ?? null, payload, bytes: Buffer.byteLength(text) };
  }
  const response = await fetch(new URL(routePath, ORIGIN), { method, headers, body: JSON.stringify(body ?? {}), signal: AbortSignal.timeout(20000) });
  const text = await response.text();
  let payload; try { payload = JSON.parse(text); } catch {}
  return { httpStatus: response.status, code: payload?.code ?? null, payload, bytes: Buffer.byteLength(text) };
}

const clientRoutes = JSON.parse(await readFile(new URL("../../references/server-api/client-routes.json", import.meta.url), "utf8"));

function clientCalls(routePath) {
  const hits = Object.keys(clientRoutes.routes ?? {}).filter((key) => key.endsWith(routePath));
  return hits.length > 0;
}

const evidence = [];
function record(item, route, extra) {
  evidence.push({ item, route, ...extra });
}

// 1. Credentials: does this account own any, and does the credential-scoped read answer?
const companies = await call("POST", "/v2/team/myCompanies", {});
const companyId = identity.companyId ?? companies.payload?.data?.[0]?.companyId ?? "";
const shopPage = await call("POST", "/v2/newbrowser/getconditionshops", { number: 5, offer: 0, companyid: companyId, userid: identity.userId ?? "" });
const shops = shopPage.payload?.shop ?? [];
const firstShopId = shops[0]?.shopid ?? "";

const credentials = await call("POST", "/v2/newbrowser/getUserPasswordList", { bind: 0, name: "", page: 1, pageSize: 5, platformLock: 0, platform_id: "", platform_name: "", remark: "", user_name: "" });
const credentialRows = credentials.payload?.data?.list ?? [];
record("credentials", "POST /v2/newbrowser/getUserPasswordList", {
  prerequisite: "at least one credential record",
  present: credentialRows.length > 0,
  observedCode: credentials.code,
  detail: credentialRows.length > 0 ? `${credentialRows.length} rows on this page` : "no credential rows",
});
const userPasswordId = credentialRows[0]?.user_password_id ?? credentialRows[0]?.id ?? "";
if (userPasswordId) {
  const bound = await call("POST", "/v2/newbrowser/getBindUserPassword", { pageSize: 10, user_password_id: userPasswordId });
  record("credentials", "POST /v2/newbrowser/getBindUserPassword", { prerequisite: "a user_password_id", present: true, observedCode: bound.code });
  const accountPage = await call("POST", "/v2/newbrowser/cloud-accounts/page", { page: 1, pageSize: 5 });
  const accountId = (accountPage.payload?.data?.list ?? [])[0]?.accountId ?? "";
  const group = await call("GET", `/v2/plugin/group/accountGroupList?accountId=${encodeURIComponent(accountId)}`);
  record("credentials", "GET /v2/plugin/group/accountGroupList", { prerequisite: "an accountId owned by this company", present: Boolean(accountId), observedCode: group.code });
}

// 2. Cloud account: does any cloud account exist, and does the order route have an order?
const cloudPage = await call("POST", "/v2/newbrowser/cloud-accounts/page", { page: 1, pageSize: 5 });
const cloudRows = cloudPage.payload?.data?.list ?? [];
record("cloud account", "POST /v2/newbrowser/cloud-accounts/page", { prerequisite: "a purchased cloud account", present: cloudRows.length > 0, observedCode: cloudPage.code, detail: `${cloudRows.length} cloud rows` });

const orders = await call("GET", "/v2/cost/costmanagement/getOrderManagementNew?pageIndex=1&pageSize=5");
const orderRows = orders.payload?.data?.data ?? [];
record("orders", "GET /v2/cost/costmanagement/getOrderManagementNew", { prerequisite: "an order", present: orderRows.length > 0, observedCode: orders.code, detail: `${orderRows.length} order rows` });

const order = orderRows[0] ?? {};
const init = await call("POST", "/v2/newbrowser/cloud-accounts/free/shop/init", { order_no: order.order_no, oid: order.oid });
record("cloud init", "POST /v2/newbrowser/cloud-accounts/free/shop/init", { prerequisite: "an order eligible for a free cloud environment", present: false, observedCode: init.code, detail: String(init.payload?.msg ?? "").slice(0, 80) });

const status = await call("POST", "/v2/cost/costmanagement/getOrderDetailStatus", { oid: order.oid, oids: [order.oid] });
record("order status", "POST /v2/cost/costmanagement/getOrderDetailStatus", { prerequisite: "an accepted request shape", present: orderRows.length > 0, observedCode: status.code, detail: String(status.payload?.msg ?? "").slice(0, 80), clientCalls: clientCalls("/v2/cost/costmanagement/getOrderDetailStatus") });

// 3. RPA shop and sharing: does the RPA list exist, and is any environment shared in?
const rpaList = await call("GET", "/v2/rpa/getRpaShopList");
const rpaRows = rpaList.payload?.list ?? [];
record("rpa shop", "GET /v2/rpa/getRpaShopList", { prerequisite: "at least one RPA shop", present: rpaRows.length > 0, observedCode: rpaList.code, detail: `${rpaRows.length} rows` });
if (rpaRows[0]?.shopId) {
  const one = await call("GET", `/v2/rpa/findRpaShop?shopId=${encodeURIComponent(rpaRows[0].shopId)}`);
  record("rpa shop", "GET /v2/rpa/findRpaShop", { prerequisite: "an RPA shopId from the list", present: true, observedCode: one.code });
}
const sharedIn = shops.filter((shop) => shop.authorization === 1 && Number(shop.share_num ?? 0) > 0);
record("shared-in environment", "POST /v2/newbrowser/sharerCompanyId", { prerequisite: "an environment shared in from another company (authorization=1 and share_num>0)", present: sharedIn.length > 0, detail: `${sharedIn.length} of ${shops.length} sampled environments` });

// 4. Fingerprint UA: is it a permission gate or a data gate?
// The decoder wants kernel as a string (GetUAVersion.kernel of type string).
const ua = await call("POST", "/v2/newbrowser/getfingerprinturiua", { kernel: "1", kernelversion: "107", system: "Windows", UAversion: "" });
record("fingerprint ua", "POST /v2/newbrowser/getfingerprinturiua", { prerequisite: "permission to read the UA map", present: ua.code === 200, observedCode: ua.code, detail: String(ua.payload?.msg ?? "").slice(0, 80) });

// 5. Numeric code fields: does the client read them anywhere?
for (const field of ["band_width_type", "cidr_status", "roleType"]) {
  record("unlabelled enum", field, { prerequisite: "a client-side label map", present: false, detail: "response field only; no label map in the deployed client" });
}

const outputPath = process.env.BOUNDARY_OUTPUT ?? path.join(os.tmpdir(), "yunlogin-boundary-evidence.json");
await writeFile(outputPath, JSON.stringify({ ranAt: new Date().toISOString(), origin: ORIGIN, companyId, userId: identity.userId, evidence }, null, 2));
console.log(JSON.stringify({ companyId, rows: evidence.length }));
for (const row of evidence) console.log([row.item, row.route, `present=${row.present}`, `code=${row.observedCode ?? "-"}`, row.detail ?? ""].join("\t"));
console.error(`Wrote ${outputPath}`);
