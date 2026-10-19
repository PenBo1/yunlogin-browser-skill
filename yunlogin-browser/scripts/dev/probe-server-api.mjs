#!/usr/bin/env node

/**
 * Read-only field inventory probe for the cataloged server API.
 *
 * The script decodes company/user context from a JWT supplied through
 * YUNLOGIN_SERVER_TOKEN, calls cataloged endpoints in dependency order, and
 * records response field paths, types, and a bounded set of enum-like values. It never writes
 * free-form values, secrets, or the token to the inventory file.
 */

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readServerToken } from "../lib/local-token-store.mjs";

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

const endpointFilter = option("--endpoint", undefined);
const outputPath = option("--output", path.join(os.tmpdir(), "yunlogin-server-field-inventory.json"));
const timeoutMs = Number.parseInt(option("--timeout-ms", "30000"), 10);
const includeMutations = args.includes("--include-mutations");
const confirmMutations = args.includes("--confirm-mutations");
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) throw new Error("--timeout-ms must be a positive integer");

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const token = process.env.YUNLOGIN_SERVER_TOKEN ?? await readServerToken();

function decodeJwtPayload(value) {
  if (!value || typeof value !== "string") return {};
  const parts = value.split(".");
  if (parts.length !== 3) return {};
  try {
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    return {};
  }
}

const jwt = decodeJwtPayload(token);
const identity = {
  companyId: process.env.YUNLOGIN_SERVER_COMPANY_ID ?? jwt.iss ?? "",
  userId: process.env.YUNLOGIN_SERVER_USER_ID ?? jwt.jti ?? "",
};
const context = {
  shopIds: [],
  accountIds: [],
  deviceIds: [],
  groupIds: [],
  labelIds: [],
  userPasswordIds: [],
  platformIds: [],
  customIds: [],
  fingerprint: {},
  version: {},
};
const priority = [
  "my-user-info",
  "my-companies",
  "browser-settings",
  "browser-list",
  "platform-catalog",
  "platform-class-tree",
  "custom-platform-list",
  "server-group-list",
  "proxy-tag-list",
  "proxy-cloud-list",
  "proxy-self-list",
  "proxy-dynamic-list",
  "latest-open-environments",
  "fingerprint-defaults",
  "version-core",
];
const ordered = [...catalog.endpoints].sort((left, right) => {
  const leftIndex = priority.indexOf(left.id);
  const rightIndex = priority.indexOf(right.id);
  return (leftIndex < 0 ? 999 : leftIndex) - (rightIndex < 0 ? 999 : rightIndex);
});

function clone(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

function isEmpty(value) {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function addUnique(list, value) {
  if (typeof value !== "string" && typeof value !== "number") return;
  const text = String(value);
  if (!text || list.includes(text)) return;
  if (list.length < 20) list.push(text);
}

function contextValue(field) {
  const key = String(field).toLowerCase();
  if (key === "companyid") return identity.companyId || undefined;
  if (key === "userid" || key === "user_id") return identity.userId || undefined;
  if (key === "shopid") return context.shopIds[0];
  if (key === "accountids" || key === "account_ids") return context.accountIds.length ? [context.accountIds[0]] : (context.shopIds.length ? [context.shopIds[0]] : undefined);
  if (key === "device_ids" || key === "deviceids") return context.deviceIds.length ? [context.deviceIds[0]] : undefined;
  if (key === "groupid" || key === "group_id") return context.groupIds[0];
  if (key === "labelid" || key === "label_id") return context.labelIds[0];
  if (key === "user_password_id") return context.userPasswordIds[0];
  if (key === "platformid" || key === "platform_id") return context.platformIds[0];
  if (key === "batch_platform_id") return context.platformIds[0];
  if (key === "batch_custom_id") return context.customIds[0];
  if (key === "system") return context.fingerprint.system;
  if (key === "kernel") return context.fingerprint.kernel;
  if (key === "kernelversion") return context.fingerprint.kernelVersion;
  if (key === "appversion") return context.version.appVersion;
  if (key === "versioncode") return context.version.versionCode;
  if (key === "bitness") return context.version.bitness;
  if (key === "platform") return context.version.platform;
  if (key === "browser") return context.version.browser;
  if (key === "channel") return context.version.channel;
  if (key === "appid") return context.version.appId;
  return undefined;
}

function buildPlan(endpoint) {
  const body = clone(endpoint.body_defaults);
  const query = clone(endpoint.query_defaults);
  for (const [key, value] of Object.entries(body)) {
    if (isEmpty(value)) {
      const replacement = contextValue(key);
      if (replacement !== undefined) body[key] = replacement;
    }
  }
  for (const [key, value] of Object.entries(query)) {
    if (isEmpty(value)) {
      const replacement = contextValue(key);
      if (replacement !== undefined) query[key] = replacement;
    }
  }
  const missingBody = (endpoint.body_required ?? []).filter((key) => isEmpty(body[key]));
  const missingQuery = (endpoint.query_required ?? []).filter((key) => isEmpty(query[key]));
  const missing = [...missingBody, ...missingQuery];
  return { body, query, missing };
}

function harvest(value, key = "") {
  if (Array.isArray(value)) {
    for (const item of value.slice(0, 50)) harvest(item, key);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [childKey, childValue] of Object.entries(value)) {
    const normalized = childKey.toLowerCase();
    if (normalized === "shopid") addUnique(context.shopIds, childValue);
    else if (normalized === "accountid" || normalized === "account_id") addUnique(context.accountIds, childValue);
    else if (normalized === "deviceid" || normalized === "device_id") addUnique(context.deviceIds, childValue);
    else if (normalized === "groupid" || normalized === "group_id") addUnique(context.groupIds, childValue);
    else if (normalized === "labelid" || normalized === "label_id") addUnique(context.labelIds, childValue);
    else if (normalized === "user_password_id") addUnique(context.userPasswordIds, childValue);
    else if (normalized === "platformid" || normalized === "platform_id") addUnique(context.platformIds, childValue);
    else if (normalized === "customid" || normalized === "custom_id") addUnique(context.customIds, childValue);
    else if (["system", "kernel", "kernelversion"].includes(normalized)) {
      const field = normalized === "kernelversion" ? "kernelVersion" : normalized;
      if (context.fingerprint[field] === undefined) context.fingerprint[field] = childValue;
    } else if (["appversion", "versioncode", "bitness", "platform", "browser", "channel", "appid"].includes(normalized)) {
      const field = normalized === "appversion" ? "appVersion" : normalized === "versioncode" ? "versionCode" : normalized === "appid" ? "appId" : normalized;
      if (context.version[field] === undefined) context.version[field] = childValue;
    }
    harvest(childValue, childKey);
  }
}

// Only small, enum-like, non-sensitive scalar values are kept so the inventory can document
// value domains such as status/type/flag. Free-form text, ids, secrets, and long strings are dropped.
const ENUM_LEAF = /(status|state|type|kind|mode|level|flag|enable|enabled|role|stage|category|class|code|text|sex|gender|currency|unit|method|action|scope|pay|bill|channel|source|platform|kernel|system|day|week|month)$/i;
const NEVER_VALUE = /(pass|pwd|secret|token|cookie|credential|email|mobile|phone|account|username|url|uuid|serial|sign|key|salt|hash)/i;
const ID_LIKE = /^[0-9a-f]{16,}$/i;
function recordEnumValue(entry, currentPath, value) {
  if (entry.values.size >= 30) return;
  const leaf = currentPath.split(".").pop().replace(/\[\]$/, "");
  if (!ENUM_LEAF.test(leaf) || NEVER_VALUE.test(leaf)) return;
  if (typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) {
    entry.values.add(String(value));
    return;
  }
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 24) return;
  if (trimmed.includes("@") || ID_LIKE.test(trimmed)) return;
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
  if (value === null) {
    entry.types.add("null");
    return output;
  }
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
  return Object.fromEntries(
    [...summary.entries()].map(([field, value]) => [
      field,
      { types: [...value.types].sort(), count: value.count, arrayLengths: [...value.arrayLengths].slice(0, 20), values: [...value.values].slice(0, 30) },
    ]),
  );
}

function headersFor(endpoint) {
  const headers = new Headers({
    accept: "application/json, text/plain, */*",
    lang: process.env.YUNLOGIN_SERVER_LANG ?? "zh",
  });
  for (const [name, value] of Object.entries(endpoint.header_defaults ?? {})) headers.set(name, String(value));
  if (endpoint.requires_auth !== false) {
    if (!token) throw new Error("No YUNLOGIN_SERVER_TOKEN is available");
    headers.set("authorization", `Bearer ${token}`);
  }
  if (endpoint.method !== "GET") headers.set("content-type", "application/json");
  if (process.env.YUNLOGIN_SERVER_COOKIE) headers.set("cookie", process.env.YUNLOGIN_SERVER_COOKIE);
  if (process.env.YUNLOGIN_SERVER_APPINFO) headers.set("appinfo", process.env.YUNLOGIN_SERVER_APPINFO);
  return headers;
}

const results = [];
for (const endpoint of ordered) {
  if (endpointFilter && endpoint.id !== endpointFilter) continue;
  const plan = buildPlan(endpoint);
  const mutation = endpoint.mutation === true;
  if (mutation && !includeMutations) {
    results.push({ id: endpoint.id, method: endpoint.method, path: endpoint.path, mode: "skipped", reason: "mutation endpoints are excluded by default" });
    console.log([endpoint.id, "skipped", "mutation", "", "", "", "0", ""].join("\t"));
    continue;
  }
  if (endpoint.id === "sso-login" && !process.env.YUNLOGIN_LOGIN_USERNAME) {
    results.push({ id: endpoint.id, method: endpoint.method, path: endpoint.path, mode: "skipped", reason: "credentials are not configured" });
    console.log([endpoint.id, "skipped", "credentials", "", "", "", "0", ""].join("\t"));
    continue;
  }
  if (plan.missing.length > 0) {
    results.push({ id: endpoint.id, method: endpoint.method, path: endpoint.path, mode: "skipped", missingContext: plan.missing });
    console.log([endpoint.id, "skipped", "missing-context", "", "", "", "0", plan.missing.join(",")].join("\t"));
    continue;
  }
  if (mutation && !confirmMutations) {
    results.push({ id: endpoint.id, method: endpoint.method, path: endpoint.path, mode: "dry-run", plannedBodyKeys: Object.keys(plan.body), plannedQueryKeys: Object.keys(plan.query) });
    console.log([endpoint.id, "dry-run", "mutation", "", "", "", "0", ""].join("\t"));
    continue;
  }

  const url = new URL(endpoint.path, catalog.default_origin);
  for (const [name, value] of Object.entries(plan.query)) {
    if (value !== undefined && value !== null) url.searchParams.set(name, String(value));
  }
  const headers = headersFor(endpoint);
  const requestBody = endpoint.method === "GET" ? undefined : JSON.stringify(plan.body);
  const started = Date.now();
  try {
    const response = await fetch(url, { method: endpoint.method, headers, body: requestBody, signal: AbortSignal.timeout(timeoutMs) });
    const text = await response.text();
    const elapsed = Date.now() - started;
    let payload;
    try { payload = JSON.parse(text); } catch { payload = undefined; }
    if (payload) harvest(payload);
    const fieldSummary = payload ? serializeSummary(summarize(payload)) : {};
    const result = {
      id: endpoint.id,
      method: endpoint.method,
      path: endpoint.path,
      mode: "live",
      httpStatus: response.status,
      code: payload?.code,
      msg: typeof payload?.msg === "string" ? payload.msg.slice(0, 200) : undefined,
      bytes: Buffer.byteLength(text),
      ms: elapsed,
      fieldCount: Object.keys(fieldSummary).length,
      fields: fieldSummary,
    };
    results.push(result);
    console.log([endpoint.id, "live", response.status, payload?.code ?? "", result.bytes, elapsed, result.fieldCount, ""].join("\t"));
  } catch (error) {
    const elapsed = Date.now() - started;
    results.push({ id: endpoint.id, method: endpoint.method, path: endpoint.path, mode: "error", ms: elapsed, error: error.message });
    console.log([endpoint.id, "error", "", "", "", elapsed, "0", error.message].join("\t"));
  }
}

const inventory = {
  testedAt: new Date().toISOString(),
  tokenLength: token?.length ?? 0,
  identity: { companyIdSet: Boolean(identity.companyId), userIdSet: Boolean(identity.userId) },
  contextCounts: Object.fromEntries(Object.entries(context).map(([key, value]) => [key, Array.isArray(value) ? value.length : typeof value === "object" ? Object.keys(value).length : value ? 1 : 0])),
  endpointCount: results.length,
  results,
};
await writeFile(outputPath, JSON.stringify(inventory, null, 2), "utf8");
console.error(`Wrote field inventory: ${outputPath}`);