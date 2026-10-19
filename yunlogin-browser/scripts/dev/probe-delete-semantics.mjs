#!/usr/bin/env node

/**
 * Delete-semantics probe: classify a delete route as hard, soft, or ineffective.
 *
 * Each case creates a uniquely named throwaway resource, verifies it exists, deletes it, re-reads
 * the list, and records whether the row disappeared for good, moved to a recycle list, or stayed.
 * Every case cleans up after itself.
 *
 * Usage:
 *   node scripts/dev/probe-delete-semantics.mjs [--output <file.json>]
 */

import { writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { readServerToken, readServerIdentity } from "../lib/local-token-store.mjs";

const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}
const outputPath = option("--output", path.join(os.tmpdir(), "yunlogin-delete-semantics.json"));
// Self-test hook: the gate verifier injects a synthetic leftover and expects a non-zero exit.
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
  return { httpStatus: response.status, code: payload?.code ?? payload?.Code, msg: payload?.msg, data: payload?.data, payload };
}

const stamp = Date.now().toString(36);
const results = [];

// --- proxy tag -------------------------------------------------------------------------------
{
  const name = `codex-del-${stamp}`;
  const listTags = async () => {
    const r = await call("GET", "/v2/proxy/device/findTags", undefined, { companyid: identity.companyId, userid: identity.userId, page: 1, per_page: 200 });
    return r.payload?.data?.data ?? r.payload?.data?.list ?? [];
  };
  const before = (await listTags()).length;
  const create = await call("POST", "/v2/proxy/device/updateTag", { companyid: identity.companyId, userid: identity.userId, label: name, color: 8 });
  const rows = await listTags();
  const row = rows.find((t) => t.name === name);
  const deleteRes = row ? await call("POST", "/v2/proxy/device/delTag", { companyid: identity.companyId, labelid: [String(row.id ?? row.labelid)] }) : { code: null, msg: "row not found; nothing deleted" };
  const after = await listTags();
  results.push({
    id: "proxy-tag",
    resource: name,
    createRoute: "POST /v2/proxy/device/updateTag",
    createCode: create.code,
    existedAfterCreate: Boolean(row),
    deleteRoute: "POST /v2/proxy/device/delTag",
    deleteCode: deleteRes.code,
    deleteData: deleteRes.data ?? deleteRes.payload?.data ?? null,
    presentAfterDelete: after.some((t) => t.name === name),
    listSizeBefore: before,
    listSizeAfter: after.length,
    recycleChecked: false,
    leftover: after.some((t) => t.name === name),
  });
}

// --- environment group -----------------------------------------------------------------------
{
  const name = `codex-del-${stamp}`;
  const listGroups = async () => {
    const r = await call("POST", "/v2/newbrowser/getgroups", { companyid: identity.companyId, userid: identity.userId });
    return r.payload?.group ?? r.payload?.data?.list ?? r.payload?.data ?? [];
  };
  const create = await call("POST", "/v2/newbrowser/putnewgroup", { companyid: identity.companyId, userid: identity.userId, group: name, groupid: "" });
  const rowsAfterCreate = await listGroups();
  const created = rowsAfterCreate.find((g) => (g.name ?? g.gropname) === name);
  const groupId = created?.gropid ?? created?.groupid ?? create.payload?.categoryid;
  const deleteRes = groupId ? await call("POST", "/v2/newbrowser/deletegroups", { groupid: [String(groupId)] }) : { code: null, msg: "no group id; nothing deleted" };
  const rowsAfterDelete = await listGroups();
  results.push({
    id: "environment-group",
    resource: name,
    createRoute: "POST /v2/newbrowser/putnewgroup",
    createCode: create.code,
    existedAfterCreate: Boolean(created),
    deleteRoute: "POST /v2/newbrowser/deletegroups",
    deleteCode: deleteRes.code,
    deleteData: deleteRes.data ?? deleteRes.payload?.data ?? null,
    presentAfterDelete: rowsAfterDelete.some((g) => (g.name ?? g.gropname) === name),
    listSizeBefore: rowsAfterCreate.length,
    listSizeAfter: rowsAfterDelete.length,
    recycleChecked: false,
    leftover: rowsAfterDelete.some((g) => (g.name ?? g.gropname) === name),
  });
}

// --- custom platform -------------------------------------------------------------------------
{
  const url = `https://codex-del-${stamp}.invalid/login`;
  const listPlatforms = async () => {
    const r = await call("POST", "/v2/newbrowser/getalluserselfuri", { company: identity.company ?? "", companyid: identity.companyId, userid: identity.userId });
    return r.payload?.self ?? [];
  };
  const create = await call("POST", "/v2/newbrowser/putuserselfuri", { company: identity.company ?? "", companyid: identity.companyId, userid: identity.userId, self: [{ login_url: url }] });
  const rowsAfterCreate = await listPlatforms();
  const created = rowsAfterCreate.find((p) => p.login_url === url);
  const platformId = created?.platform_id;
  const deleteRes = platformId ? await call("POST", "/v2/newbrowser/putdeleteuserselfuri", { company: identity.company ?? "", companyid: identity.companyId, userid: identity.userId, platformid: [String(platformId)] }) : { code: null, msg: "no platform id; nothing deleted" };
  const rowsAfterDelete = await listPlatforms();
  results.push({
    id: "custom-platform",
    resource: url,
    createRoute: "POST /v2/newbrowser/putuserselfuri",
    createCode: create.code,
    existedAfterCreate: Boolean(created),
    deleteRoute: "POST /v2/newbrowser/putdeleteuserselfuri",
    deleteCode: deleteRes.code,
    deleteData: deleteRes.data ?? deleteRes.payload?.data ?? null,
    presentAfterDelete: rowsAfterDelete.some((p) => p.login_url === url),
    listSizeBefore: rowsAfterCreate.length,
    listSizeAfter: rowsAfterDelete.length,
    recycleChecked: false,
    leftover: rowsAfterDelete.some((p) => p.login_url === url),
  });
}

// --- role group ------------------------------------------------------------------------------
{
  const name = `codex-del-${stamp}`;
  const listGroups = async () => {
    const r = await call("POST", "/v2/team/role-group/page", { pageIndex: 1, pageSize: 200, total: 0 });
    return r.payload?.data?.list ?? r.payload?.data?.data ?? r.payload?.data ?? [];
  };
  const create = await call("POST", "/v2/team/role-group/create", { companyId: identity.companyId, id: 0, intro: "codex probe", name });
  const createdId = create.data?.id;
  const rowsAfterCreate = await listGroups();
  const existed = rowsAfterCreate.some((g) => String(g.id) === String(createdId));
  const deleteRes = createdId ? await call("POST", "/v2/team/role-group/del", { ids: [createdId] }) : { code: null, msg: "no id; nothing deleted" };
  const rowsAfterDelete = await listGroups();
  results.push({
    id: "role-group",
    resource: name,
    createRoute: "POST /v2/team/role-group/create",
    createCode: create.code,
    existedAfterCreate: existed,
    deleteRoute: "POST /v2/team/role-group/del",
    deleteCode: deleteRes.code,
    deleteData: deleteRes.data ?? deleteRes.payload?.data ?? null,
    presentAfterDelete: rowsAfterDelete.some((g) => String(g.id) === String(createdId)),
    listSizeBefore: rowsAfterCreate.length,
    listSizeAfter: rowsAfterDelete.length,
    recycleChecked: false,
    leftover: rowsAfterDelete.some((g) => String(g.id) === String(createdId)),
  });
}

// --- dynamic proxy (soft delete, then purge) ---------------------------------------------------
{
  const name = `codex-del-${stamp}`;
  const listProxies = async (status) => {
    const r = await call("GET", "/v2/proxy/device/findDeviceDynamicProxies", undefined, { status, trademark: "general", page: 1, per_page: 300, companyid: identity.companyId, userid: identity.userId });
    return r.payload?.data?.data ?? [];
  };
  const create = await call("POST", "/v2/proxy/device/updateDeviceDynamicProxies", { deviceid: "", trademark: "general", name, type: "http", autoswitch: 0, url: "127.0.0.1:8080", ip_query_channel: "ipinfo" });
  const deviceId = create.data?.deviceid;
  const activeAfterCreate = (await listProxies(0)).some((p) => p.deviceid === deviceId);
  const deleteRes = deviceId ? await call("POST", "/v2/proxy/device/delDeviceDynamicProxies", { device_ids: [deviceId] }) : { code: null, msg: "no device id; nothing deleted" };
  const activeAfterDelete = (await listProxies(0)).some((p) => p.deviceid === deviceId);
  const recycleAfterDelete = (await listProxies(1)).some((p) => p.deviceid === deviceId);
  const purge = deviceId ? await call("POST", "/v2/proxy/device/recycleDelDeviceDynamicProxies", { device_ids: [deviceId] }) : { code: null };
  const recycleAfterPurge = (await listProxies(1)).some((p) => p.deviceid === deviceId);
  results.push({
    id: "dynamic-proxy",
    resource: name,
    createRoute: "POST /v2/proxy/device/updateDeviceDynamicProxies",
    createCode: create.code,
    existedAfterCreate: activeAfterCreate,
    deleteRoute: "POST /v2/proxy/device/delDeviceDynamicProxies",
    deleteCode: deleteRes.code,
    deleteData: deleteRes.data ?? deleteRes.payload?.data ?? null,
    presentAfterDelete: activeAfterDelete,
    inRecycleAfterDelete: recycleAfterDelete,
    purgeRoute: "POST /v2/proxy/device/recycleDelDeviceDynamicProxies",
    purgeCode: purge.code,
    inRecycleAfterPurge: recycleAfterPurge,
    listSizeBefore: null,
    listSizeAfter: null,
    recycleChecked: true,
    leftover: recycleAfterPurge || activeAfterDelete,
  });
}

// --- environment (soft delete into a real recycle list, then purge) ----------------------------
{
  const name = `codex-del-${stamp}`;
  const created = spawnSync(process.execPath, ["scripts/yunlogin-env.mjs", "create", "--name", name, "--accept-defaults"], { encoding: "utf8" });
  let accountId = "";
  try { accountId = JSON.parse(created.stdout).environment?.accountId ?? ""; } catch {}
  const activeEnvs = async () => {
    const r = await call("POST", "/v2/newbrowser/getconditionshops", { number: 500, offer: 0, companyid: identity.companyId, userid: identity.userId });
    return r.payload?.shop ?? [];
  };
  const recycledEnvs = async () => {
    const r = await call("POST", "/v2/newbrowser/getrecycleshoplist", { page: 1, pageSize: 200 });
    return r.payload?.data?.list ?? r.payload?.data?.data ?? [];
  };
  const activeAfterCreate = (await activeEnvs()).some((e) => e.shopid === accountId);
  const deleteRes = accountId
    ? await call("POST", "/v2/newbrowser/putdeleteshop", { companyid: identity.companyId, userid: identity.userId, shopid: [accountId] })
    : { code: null, msg: "no account id; nothing deleted" };
  const activeAfterDelete = (await activeEnvs()).some((e) => e.shopid === accountId);
  const recycledAfterDelete = (await recycledEnvs()).some((e) => (e.account_id ?? e.shopid) === accountId);
  const purge = accountId
    ? await call("POST", "/v2/newbrowser/putdeleteshopfromrecycle", { companyid: identity.companyId, userid: identity.userId, shopid: [accountId] })
    : { code: null };
  const recycledAfterPurge = (await recycledEnvs()).some((e) => (e.account_id ?? e.shopid) === accountId);
  results.push({
    id: "environment",
    resource: name,
    createRoute: "POST /v2/newbrowser/putalluri",
    createCode: created.status === 0 ? 200 : null,
    existedAfterCreate: activeAfterCreate,
    deleteRoute: "POST /v2/newbrowser/putdeleteshop",
    deleteCode: deleteRes.code,
    deleteData: deleteRes.data ?? deleteRes.payload?.data ?? null,
    presentAfterDelete: activeAfterDelete,
    inRecycleAfterDelete: recycledAfterDelete,
    purgeRoute: "POST /v2/newbrowser/putdeleteshopfromrecycle",
    purgeCode: purge.code,
    inRecycleAfterPurge: recycledAfterPurge,
    listSizeBefore: null,
    listSizeAfter: null,
    recycleChecked: true,
    leftover: recycledAfterPurge || activeAfterDelete,
  });
}

if (fault === "leftover") {
  results.push({ id: "injected-fault", resource: "(self-test)", createRoute: "(self-test)", createCode: 200, existedAfterCreate: true, deleteRoute: "(self-test)", deleteCode: 200, deleteData: null, presentAfterDelete: true, recycleChecked: false, leftover: true });
}

await writeFile(outputPath, JSON.stringify({ testedAt: new Date().toISOString(), origin: base, results }, null, 2), "utf8");
for (const r of results) console.error(`${r.id}: create=${r.createCode} existed=${r.existedAfterCreate} delete=${r.deleteCode} stillPresent=${r.presentAfterDelete} leftover=${r.leftover}`);
console.error(`Wrote ${outputPath}`);
const badDeletes = results.filter((r) => r.leftover || r.presentAfterDelete);
if (badDeletes.length > 0) {
  console.error(`${badDeletes.length} delete case(s) left the row behind or did not delete: ${badDeletes.map((r) => r.id).join(", ")}`);
  process.exit(1);
}
