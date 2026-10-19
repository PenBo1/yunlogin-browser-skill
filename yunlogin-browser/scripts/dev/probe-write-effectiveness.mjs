#!/usr/bin/env node

/**
 * Write-effectiveness probe: prove whether a write route actually persisted.
 *
 * Several management-center write routes answer `code: 200` without changing anything. This script
 * performs a safe round trip for each case on one existing environment: read the current value,
 * write a temporary value, re-read to see whether it stuck, then write the original value back and
 * re-read again. Only environment fields that the environment itself reports are used, and every
 * case restores its original value.
 *
 * Usage:
 *   node scripts/dev/probe-write-effectiveness.mjs [--output <file.json>] [--env-id <id>]
 */

import { writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { readServerToken, readServerIdentity } from "../lib/local-token-store.mjs";

const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}
const outputPath = option("--output", path.join(os.tmpdir(), "yunlogin-write-effectiveness.json"));
const requestedEnvId = option("--env-id");
// Self-test hook: the gate verifier injects a synthetic failing case and expects a non-zero exit.
const fault = option("--fault");

const base = "https://d126447d359e70c0.yunlogin.com";
const token = await readServerToken();
const identity = await readServerIdentity();
const H = { accept: "application/json, text/plain, */*", authorization: `Bearer ${token}`, "content-type": "application/json", lang: "zh", "pay-lang": "zh-TW" };

async function call(method, routePath, body, query) {
  const url = new URL(routePath, base);
  for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, String(v));
  const init = { method, headers: H, signal: AbortSignal.timeout(25000) };
  if (method !== "GET") init.body = JSON.stringify(body ?? {});
  const response = await fetch(url, init);
  const text = await response.text();
  let payload; try { payload = JSON.parse(text); } catch {}
  return { httpStatus: response.status, code: payload?.code ?? payload?.Code, msg: payload?.msg ?? payload?.Msg, data: payload?.data, payload };
}

async function envRow(envId, labelIds) {
  const body = { number: 200, offer: 0, companyid: identity.companyId, userid: identity.userId };
  if (labelIds) body.labelids = labelIds;
  const res = await call("POST", "/v2/newbrowser/getconditionshops", body);
  const rows = res.payload?.shop ?? [];
  if (!envId) return rows[0] ?? {};
  return rows.find((r) => r.shopid === envId) ?? {};
}

const seed = requestedEnvId ? { shopid: requestedEnvId } : await envRow();
const envId = seed.shopid;
if (!envId) throw new Error("No environment available to probe");
console.error(`Using environment ${envId} (name="${seed.name}")`);

const MARK = "codex-write-probe";
const cases = [
  {
    id: "environment-name",
    route: "/v2/newbrowser/retsetshopName",
    field: "name",
    body: (v) => ({ shopid: [envId], accountName: v }),
    temp: MARK,
  },
  {
    id: "environment-notes",
    route: "/v2/newbrowser/putaddnotes",
    field: "notes",
    body: (v) => ({ shopid: [envId], notes: v }),
    temp: MARK,
  },
  {
    id: "environment-star",
    route: "/v2/newbrowser/retsetshopisstartag",
    field: "isstartag",
    body: (v) => ({ shopid: [envId], startag: v }),
    temp: 1,
  },
  {
    id: "environment-top",
    route: "/v2/newbrowser/retsetshopistop",
    field: "topOrder",
    body: (v) => ({ shopid: [envId], top: v }),
    temp: 3,
  },
];

const results = [];
for (const item of cases) {
  const before = await envRow(envId);
  const original = before[item.field];
  const write = await call("POST", item.route, item.body(item.temp));
  const afterWrite = await envRow(envId);
  const persisted = afterWrite[item.field] === item.temp || String(afterWrite[item.field]) === String(item.temp);
  const restore = await call("POST", item.route, item.body(original));
  const afterRestore = await envRow(envId);
  const restored = String(afterRestore[item.field] ?? "") === String(original ?? "");
  results.push({
    id: item.id,
    route: item.route,
    field: item.field,
    original,
    temp: item.temp,
    writeCode: write.code,
    writeMsg: write.msg,
    observedAfterWrite: afterWrite[item.field] ?? null,
    persisted,
    restoreCode: restore.code,
    observedAfterRestore: afterRestore[item.field] ?? null,
    restored,
  });
  console.error(`${item.id}: code=${write.code} ${item.field} ${JSON.stringify(original)} -> ${JSON.stringify(afterWrite[item.field] ?? null)} persisted=${persisted} restored=${restored}`);
}

// --- throwaway resources: create, rename in place, verify, restore, delete ------------------------
const stamp = Date.now().toString(36);

// Group rename
{
  const name = `codex-wr-${stamp}`;
  const renamed = `${name}-r`;
  const list = async () => {
    const r = await call("POST", "/v2/newbrowser/getgroups", { companyid: identity.companyId, userid: identity.userId });
    return r.payload?.group ?? r.payload?.data?.list ?? [];
  };
  const create = await call("POST", "/v2/newbrowser/putnewgroup", { companyid: identity.companyId, userid: identity.userId, group: name, groupid: "" });
  const created = (await list()).find((g) => (g.name ?? g.gropname) === name);
  const groupId = created?.gropid ?? created?.groupid ?? create.payload?.categoryid;
  const rename = await call("POST", "/v2/newbrowser/putnewgroup", { companyid: identity.companyId, userid: identity.userId, group: renamed, groupid: String(groupId) });
  const observed = (await list()).find((g) => String(g.gropid ?? g.groupid) === String(groupId));
  const persisted = (observed?.name ?? observed?.gropname) === renamed;
  const restore = await call("POST", "/v2/newbrowser/putnewgroup", { companyid: identity.companyId, userid: identity.userId, group: name, groupid: String(groupId) });
  const afterRestore = (await list()).find((g) => String(g.gropid ?? g.groupid) === String(groupId));
  const restoredOk = (afterRestore?.name ?? afterRestore?.gropname) === name;
  await call("POST", "/v2/newbrowser/deletegroups", { groupid: [String(groupId)] });
  results.push({
    id: "group-rename",
    route: "POST /v2/newbrowser/putnewgroup",
    field: "name",
    original: name,
    temp: renamed,
    writeCode: rename.code,
    writeMsg: rename.msg,
    observedAfterWrite: observed?.name ?? observed?.gropname ?? null,
    persisted,
    restoreCode: restore.code,
    observedAfterRestore: afterRestore?.name ?? afterRestore?.gropname ?? null,
    restored: restoredOk,
    cleanup: "deleted the throwaway group",
  });
}

// Tag rename
{
  const name = `codex-wr-${stamp}`;
  const renamed = `${name}-r`;
  const list = async () => {
    const r = await call("GET", "/v2/proxy/device/findTags", undefined, { companyid: identity.companyId, userid: identity.userId, page: 1, per_page: 300 });
    return r.payload?.data?.data ?? r.payload?.data?.list ?? [];
  };
  await call("POST", "/v2/proxy/device/updateTag", { companyid: identity.companyId, userid: identity.userId, label: name, color: 8 });
  const created = (await list()).find((t) => t.name === name);
  const tagId = created?.id ?? created?.labelid;
  const rename = tagId ? await call("POST", "/v2/proxy/device/updateTag", { companyid: identity.companyId, userid: identity.userId, label: renamed, color: 8, labelid: String(tagId) }) : { code: null };
  const observed = (await list()).find((t) => String(t.id ?? t.labelid) === String(tagId));
  const persisted = observed?.name === renamed;
  const restore = tagId ? await call("POST", "/v2/proxy/device/updateTag", { companyid: identity.companyId, userid: identity.userId, label: name, color: 8, labelid: String(tagId) }) : { code: null };
  const afterRestore = (await list()).find((t) => String(t.id ?? t.labelid) === String(tagId));
  const restoredOk = afterRestore?.name === name;
  if (tagId) await call("POST", "/v2/proxy/device/delTag", { companyid: identity.companyId, labelid: [String(tagId)] });
  results.push({
    id: "tag-rename",
    route: "POST /v2/proxy/device/updateTag",
    field: "name",
    original: name,
    temp: renamed,
    writeCode: rename.code,
    writeMsg: rename.msg,
    observedAfterWrite: observed?.name ?? null,
    persisted,
    restoreCode: restore.code,
    observedAfterRestore: afterRestore?.name ?? null,
    restored: restoredOk,
    cleanup: "deleted the throwaway tag",
  });
}

// Dynamic proxy rename
{
  const name = `codex-wr-${stamp}`;
  const renamed = `${name}-r`;
  const list = async () => {
    const r = await call("GET", "/v2/proxy/device/findDeviceDynamicProxies", undefined, { status: 0, trademark: "general", page: 1, per_page: 300, companyid: identity.companyId, userid: identity.userId });
    return r.payload?.data?.data ?? [];
  };
  const create = await call("POST", "/v2/proxy/device/updateDeviceDynamicProxies", { deviceid: "", trademark: "general", name, type: "http", autoswitch: 0, url: "127.0.0.1:8080", ip_query_channel: "ipinfo" });
  const deviceId = create.data?.deviceid ?? create.payload?.data?.deviceid;
  const rename = deviceId ? await call("POST", "/v2/proxy/device/updateDeviceDynamicProxies", { deviceid: deviceId, trademark: "general", name: renamed, type: "http", autoswitch: 0, url: "127.0.0.1:8080", ip_query_channel: "ipinfo" }) : { code: null };
  const observed = (await list()).find((p) => p.deviceid === deviceId);
  const persisted = observed?.name === renamed;
  const restore = deviceId ? await call("POST", "/v2/proxy/device/updateDeviceDynamicProxies", { deviceid: deviceId, trademark: "general", name, type: "http", autoswitch: 0, url: "127.0.0.1:8080", ip_query_channel: "ipinfo" }) : { code: null };
  const afterRestore = (await list()).find((p) => p.deviceid === deviceId);
  const restoredOk = afterRestore?.name === name;
  if (deviceId) {
    await call("POST", "/v2/proxy/device/delDeviceDynamicProxies", { device_ids: [deviceId] });
    await call("POST", "/v2/proxy/device/recycleDelDeviceDynamicProxies", { device_ids: [deviceId] });
  }
  results.push({
    id: "dynamic-proxy-rename",
    route: "POST /v2/proxy/device/updateDeviceDynamicProxies",
    field: "name",
    original: name,
    temp: renamed,
    writeCode: rename.code,
    writeMsg: rename.msg,
    observedAfterWrite: observed?.name ?? null,
    persisted,
    restoreCode: restore.code,
    observedAfterRestore: afterRestore?.name ?? null,
    restored: restoredOk,
    cleanup: "deleted and purged the throwaway proxy",
  });
}

if (fault === "not-persisted") {
  results.push({ id: "injected-fault", route: "(self-test)", field: "name", original: "a", temp: "b", writeCode: 200, observedAfterWrite: "a", persisted: false, restoreCode: 200, observedAfterRestore: "a", restored: true });
} else if (fault === "not-restored") {
  results.push({ id: "injected-fault", route: "(self-test)", field: "name", original: "a", temp: "b", writeCode: 200, observedAfterWrite: "b", persisted: true, restoreCode: 200, observedAfterRestore: "b", restored: false });
}

await writeFile(outputPath, JSON.stringify({ testedAt: new Date().toISOString(), origin: base, environmentId: envId, results }, null, 2), "utf8");
console.error(`Wrote ${outputPath}`);
const failedWrites = results.filter((r) => !r.persisted || !r.restored);
if (failedWrites.length > 0) {
  console.error(`${failedWrites.length} write case(s) did not persist or did not restore: ${failedWrites.map((r) => r.id).join(", ")}`);
  process.exit(1);
}
