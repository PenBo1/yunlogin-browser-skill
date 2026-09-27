#!/usr/bin/env node

/**
 * YunLogin environment, group, and tag lifecycle helper.
 *
 * Creation prefers the documented server API and falls back to the local
 * desktop API. Deletion prefers the server API and falls back to the local
 * API. Every destructive command requires an explicit confirmation flag.
 *
 * Server routes:
 *   POST /v2/newbrowser/putalluri         create environments
 *   POST /v2/newbrowser/getconditionshops list environments
 *   POST /v2/newbrowser/putdeleteshop     delete environments
 *   POST /v2/newbrowser/getfingerprinturi creation template
 *   POST /v2/newbrowser/getdefaultfingerlist creation defaults
 *   POST /v2/newbrowser/getgroups         list groups
 *   POST /v2/newbrowser/putnewgroup       create or rename a group
 *   POST /v2/newbrowser/deletegroups      delete groups
 *   GET  /v2/proxy/device/findTags        list tags
 *   POST /v2/proxy/device/updateTag       create or rename a tag
 *   POST /v2/proxy/device/delTag          delete tags
 * Local routes:
 *   POST /api/v2/userapi/user/create      create fallback
 *   POST /api/v2/userapi/user/shopseriallist list fallback
 *   POST /api/v2/userapi/user/delete      delete fallback
 *   POST /api/v1/client/gpu_info          local GPU facts (port 52446)
 *   POST /api/v1/client/clean_env         clear local environment data (port 52446)
 *
 * See references/workflows/environment-lifecycle.md for the operator guidance.
 */

import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readLocalToken, readServerIdentity, readServerToken } from "./lib/local-token-store.mjs";
import { ensureFreshServerSession } from "./lib/server-token.mjs";
import { DEFAULT_TAG_COLOR, colorName, describeTagColor, resolveTagColor } from "./lib/tag-colors.mjs";
import { captureLocalToken } from "./yunlogin-cdp.mjs";

const DEFAULT_SERVER_ORIGIN = "https://d126447d359e70c0.yunlogin.com";
const DEFAULT_LOCAL_ORIGIN = "http://localhost:50213";
const DEFAULT_CLIENT_ORIGIN = "http://127.0.0.1:52446";
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_KERNEL = "Chrome";
const DEFAULT_KERNEL_VERSION = "141";
const DEFAULT_SYSTEM = "Windows 10";
const DEFAULT_CREATE_POLL_MS = 20000;
const MAX_NAME_LENGTH = 32;

const SERVER_CREATE_PATH = "/v2/newbrowser/putalluri";
const SERVER_LIST_PATH = "/v2/newbrowser/getconditionshops";
const SERVER_DELETE_PATH = "/v2/newbrowser/putdeleteshop";
const SERVER_TEMPLATE_PATH = "/v2/newbrowser/getfingerprinturi";
const SERVER_DEFAULTS_PATH = "/v2/newbrowser/getdefaultfingerlist";
const SERVER_GROUP_LIST_PATH = "/v2/newbrowser/getgroups";
const SERVER_GROUP_CREATE_PATH = "/v2/newbrowser/putnewgroup";
const SERVER_GROUP_DELETE_PATH = "/v2/newbrowser/deletegroups";
const SERVER_TAG_LIST_PATH = "/v2/proxy/device/findTags";
const SERVER_TAG_UPSERT_PATH = "/v2/proxy/device/updateTag";
const SERVER_TAG_DELETE_PATH = "/v2/proxy/device/delTag";
const LOCAL_CREATE_PATH = "/api/v2/userapi/user/create";
const LOCAL_LIST_PATH = "/api/v2/userapi/user/shopseriallist";
const LOCAL_DELETE_PATH = "/api/v2/userapi/user/delete";
const LOCAL_GPU_PATH = "/api/v1/client/gpu_info";
const LOCAL_CLEAN_PATH = "/api/v1/client/clean_env";

function usage() {
  console.error(`Usage:
  node scripts/yunlogin-env.mjs list [--name NAME] [--transport auto|server|local]
  node scripts/yunlogin-env.mjs create --name NAME [options]
  node scripts/yunlogin-env.mjs delete --account-id ID --confirm-delete [options]
  node scripts/yunlogin-env.mjs group-list [--name NAME]
  node scripts/yunlogin-env.mjs group-create --name NAME [--group-id ID] [--dry-run]
  node scripts/yunlogin-env.mjs group-delete --group-id ID --confirm-delete [--dry-run]
  node scripts/yunlogin-env.mjs tag-list
  node scripts/yunlogin-env.mjs tag-create --name NAME [--color N] [--dry-run]
  node scripts/yunlogin-env.mjs tag-delete --label-id ID --confirm-delete [--dry-run]
  node scripts/yunlogin-env.mjs clean-env --account-id ID --confirm-clean [--dry-run]
  node scripts/yunlogin-env.mjs bootstrap-token [options]

Commands:
  list             List environments. Server API first, local API fallback.
  create           Create environments. Server API first, local API fallback.
  delete           Delete environments. Server API first, local API fallback.
  group-list       List environment groups.
  group-create     Create a group, or rename one when --group-id is supplied.
  group-delete     Delete environment groups.
  tag-list         List environment tags.
  tag-create       Create a tag, or rename one when --label-id is supplied.
  tag-delete       Delete tags.
  clean-env        Clear the local data of one environment through the port 52446 client service.
  bootstrap-token  Capture the local API token, creating a temporary environment when needed.

Options:
  --name NAME                 Environment, group, or tag name.
  --number N                  Number of environments to create (default: 1, max 10).
  --system NAME               Operating system (default: ${DEFAULT_SYSTEM}).
  --kernel NAME               Browser kernel (default: ${DEFAULT_KERNEL}).
  --kernel-version VERSION    Kernel version (default: ${DEFAULT_KERNEL_VERSION}).
  --template-file FILE        JSON browser template for creation.
  --notes TEXT                Remark stored on the created environment.
  --label NAME                Tag to attach. Repeatable.
  --group NAME                Group to place the environment in.
  --create-missing            Create the group or tag when it does not exist.
  --confirm-attributes        Confirm that notes, tags, and the group may be applied.
  --accept-defaults           Skip the attribute question and create in the default group with no remark or tags.
  --transport MODE            auto, server, or local (default: auto).
  --account-id ID             Environment ID for delete, clean-env, or bootstrap-token.
  --group-id ID               Group ID for group-delete or group-create rename.
  --label-id ID               Tag ID for tag-delete or tag-create rename.
  --color N|NAME              Tag colour for tag-create: 1-8 or a palette name from tag-colors.mjs. Default: blue (1).
  --confirm-create            Confirm that bootstrap-token may create a temporary environment.
  --reuse-only                Forbid bootstrap-token from creating an environment.
  --create-if-missing         Accepted for compatibility; creation is allowed by default.
  --keep-environment          Keep an environment created by bootstrap-token.
  --confirm-delete            Confirm a destructive delete.
  --confirm-clean             Confirm that local environment data may be cleared.
  --cache-file FILE           Local token cache path for bootstrap-token.
  --timeout-ms MS             Request and capture timeout (default: ${DEFAULT_TIMEOUT_MS}).
  --dry-run                   Print the request that would be sent.
  -h, --help                  Show this help.

Environment:
  YUNLOGIN_SERVER_TOKEN       Server token override; otherwise the user-level cache is used.
  YUNLOGIN_SERVER_TOKEN_FILE  Server token cache path override.
  YUNLOGIN_SERVER_ORIGIN      Server origin override.
  YUNLOGIN_SERVER_COMPANY_ID  Default companyid for server calls.
  YUNLOGIN_SERVER_USER_ID     Default userid for server calls.
  YUNLOGIN_SERVER_COMPANY     Default company display name for server calls.
  YUNLOGIN_LOCAL_BASE_URL     Local v2 origin override (loopback only).
  YUNLOGIN_CLIENT_BASE_URL    Local v1 client origin override (loopback only).
  YUNLOGIN_LOCAL_TOKEN        Local bearer token override.
  YUNLOGIN_LOCAL_TOKEN_FILE   Local token cache path override.

Examples:
  node scripts/yunlogin-env.mjs list --name demo
  node scripts/yunlogin-env.mjs create --name demo --dry-run
  node scripts/yunlogin-env.mjs create --name demo --group Demo --label prod --notes "created by skill" --confirm-attributes
  node scripts/yunlogin-env.mjs delete --account-id <account id> --confirm-delete
  node scripts/yunlogin-env.mjs bootstrap-token --create-if-missing`);
}

function takeValue(args, index, option) {
  const value = args[index + 1];
  if (value === undefined || value.startsWith("--")) throw new Error(`${option} requires a value`);
  return value;
}

function parseArguments(argv) {
  const args = [...argv];
  if (args.includes("--help") || args.includes("-h")) {
    usage();
    process.exit(0);
  }
  const command = args.shift();
  if (!command) throw new Error("COMMAND is required");
  const options = {
    transport: "auto", number: 1, color: undefined, labels: [],
    keepEnvironment: false, dryRun: false, confirmDelete: false, confirmAttributes: false,
    confirmClean: false, createMissing: false, confirmCreate: false, reuseOnly: false, acceptDefaults: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--name") { options.name = takeValue(args, index, argument); index += 1; }
    else if (argument === "--number") { options.number = Number.parseInt(takeValue(args, index, argument), 10); index += 1; }
    else if (argument === "--system") { options.system = takeValue(args, index, argument); index += 1; }
    else if (argument === "--kernel") { options.kernel = takeValue(args, index, argument); index += 1; }
    else if (argument === "--kernel-version") { options.kernelVersion = takeValue(args, index, argument); index += 1; }
    else if (argument === "--template-file") { options.templateFile = takeValue(args, index, argument); index += 1; }
    else if (argument === "--notes") { options.notes = takeValue(args, index, argument); index += 1; }
    else if (argument === "--label") { options.labels.push(takeValue(args, index, argument)); index += 1; }
    else if (argument === "--group") { options.group = takeValue(args, index, argument); index += 1; }
    else if (argument === "--create-missing") { options.createMissing = true; }
    else if (argument === "--confirm-attributes") { options.confirmAttributes = true; }
    else if (argument === "--accept-defaults") { options.acceptDefaults = true; }
    else if (argument === "--transport") { options.transport = takeValue(args, index, argument); index += 1; }
    else if (argument === "--account-id") { options.accountId = takeValue(args, index, argument); index += 1; }
    else if (argument === "--group-id") { options.groupId = takeValue(args, index, argument); index += 1; }
    else if (argument === "--label-id") { options.labelId = takeValue(args, index, argument); index += 1; }
    else if (argument === "--color") { options.color = takeValue(args, index, argument); index += 1; }
    else if (argument === "--create-if-missing") { options.createIfMissing = true; }
    else if (argument === "--confirm-create") { options.confirmCreate = true; }
    else if (argument === "--reuse-only") { options.reuseOnly = true; }
    else if (argument === "--keep-environment") { options.keepEnvironment = true; }
    else if (argument === "--confirm-delete") { options.confirmDelete = true; }
    else if (argument === "--confirm-clean") { options.confirmClean = true; }
    else if (argument === "--cache-file") { options.cacheFile = takeValue(args, index, argument); index += 1; }
    else if (argument === "--timeout-ms") { options.timeoutMs = Number.parseInt(takeValue(args, index, argument), 10); index += 1; }
    else if (argument === "--dry-run") { options.dryRun = true; }
    else throw new Error(`Unknown option: ${argument}`);
  }
  if (!["auto", "server", "local"].includes(options.transport)) throw new Error("--transport must be auto, server, or local");
  if (!Number.isInteger(options.number) || options.number < 1 || options.number > 10) throw new Error("--number must be an integer between 1 and 10");
  // Accept a palette index or name and reject anything the panel cannot render.
  options.color = resolveTagColor(options.color);
  return { command, options };
}

// Environment names must stay readable and safe across the API, the file
// system, and log output. Unsupported characters collapse into a single dash.
export function normalizeName(value, options = {}) {
  const label = options.label ?? "name";
  const maxLength = options.maxLength ?? MAX_NAME_LENGTH;
  if (value === undefined || value === null) throw new Error(`--${label} is required`);
  let name = String(value);
  name = name.replace(/[\u0000-\u001f\u007f]/g, " ");
  name = name.replace(/[^\p{L}\p{N} _.-]/gu, "-");
  name = name.replace(/[\s_-]+/g, "-").replace(/^[-.]+|[-.]+$/g, "");
  if (name.length > maxLength) name = name.slice(0, maxLength).replace(/[-.]+$/g, "");
  if (!name) throw new Error(`--${label} did not contain any usable characters`);
  return name;
}

export function normalizeEnvironmentName(value) {
  return normalizeName(value, { label: "name" });
}

function twoDigit(value) {
  return String(value).padStart(2, "0");
}

// Temporary environments are short, readable, and sort by creation time.
// Example: skill-temp-141-0924-1705
export function buildTemporaryEnvironmentName(kernelVersion, date = new Date()) {
  const stamp = `${twoDigit(date.getMonth() + 1)}${twoDigit(date.getDate())}-${twoDigit(date.getHours())}${twoDigit(date.getMinutes())}`;
  return normalizeEnvironmentName(`skill-temp-${kernelVersion}-${stamp}`);
}

// Detail belongs in the remark, not in the name.
export function buildTemporaryEnvironmentNotes(date = new Date(), purpose = "local token capture") {
  return `auto-created for ${purpose}; safe to delete; ${date.toISOString()}`;
}

function serverOrigin() {
  const configured = process.env.YUNLOGIN_SERVER_ORIGIN ?? DEFAULT_SERVER_ORIGIN;
  let parsed;
  try { parsed = new URL(configured); } catch { throw new Error("YUNLOGIN_SERVER_ORIGIN must be a valid URL"); }
  if (parsed.protocol !== "https:") throw new Error("YUNLOGIN_SERVER_ORIGIN must use https");
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) throw new Error("YUNLOGIN_SERVER_ORIGIN must contain an origin only");
  return parsed.origin;
}

function loopbackOrigin(configured, variable, fallback) {
  let parsed;
  try { parsed = new URL(configured ?? fallback); } catch { throw new Error(`${variable} must be a valid origin`); }
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(`${variable} must use http or https`);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname)) throw new Error(`${variable} only permits loopback origins`);
  return parsed.origin;
}

function localOrigin() {
  return loopbackOrigin(process.env.YUNLOGIN_LOCAL_BASE_URL ?? process.env.YUNLOGIN_BASE_URL, "YUNLOGIN_LOCAL_BASE_URL", DEFAULT_LOCAL_ORIGIN);
}

function clientOrigin() {
  return loopbackOrigin(process.env.YUNLOGIN_CLIENT_BASE_URL, "YUNLOGIN_CLIENT_BASE_URL", DEFAULT_CLIENT_ORIGIN);
}

async function serverToken() {
  const token = await readServerToken();
  if (!token) {
    throw new Error("No server token is available. Set YUNLOGIN_SERVER_TOKEN or run: node scripts/yunlogin-auth.mjs save-server-token");
  }
  return token;
}

// The company and user come from the environment first and from the cached
// server session next, so a saved session removes the need for env vars.
async function serverIdentityValues() {
  const identity = await readServerIdentity();
  return { companyid: identity.companyId ?? "", userid: identity.userId ?? "", company: identity.company ?? "" };
}

function timeoutMs(options) {
  const value = options.timeoutMs ?? Number.parseInt(process.env.YUNLOGIN_TIMEOUT_MS ?? String(DEFAULT_TIMEOUT_MS), 10);
  if (!Number.isInteger(value) || value <= 0) throw new Error("--timeout-ms must be a positive integer");
  return value;
}

async function requestJson(base, requestPath, options = {}) {
  const requestHeaders = { accept: "application/json, text/plain, */*", ...(options.headers ?? {}) };
  if (options.body !== undefined) requestHeaders["content-type"] = "application/json";
  const response = await fetch(new URL(requestPath, `${base}/`), {
    method: options.method ?? "GET",
    headers: requestHeaders,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });
  const text = await response.text();
  let payload;
  try { payload = JSON.parse(text); } catch { payload = undefined; }
  return { status: response.status, ok: response.ok, payload, text };
}

async function serverRequest(requestPath, options = {}) {
  const send = async () =>
    requestJson(serverOrigin(), requestPath, {
      ...options,
      headers: {
        authorization: `Bearer ${await serverToken()}`,
        lang: process.env.YUNLOGIN_SERVER_LANG ?? "zh",
        "pay-lang": process.env.YUNLOGIN_SERVER_PAY_LANG ?? "zh-TW",
        ...(options.headers ?? {}),
      },
    });

  // Keep the cached session warm before the call. A refresh failure must not
  // block a request that may still succeed with the cached token.
  try {
    await ensureFreshServerSession({ verify: false });
  } catch {
    // Ignore; the request below reports the real server answer.
  }

  let result = await send();
  if (result.payload?.code === 1001) {
    const refreshed = await ensureFreshServerSession({ force: true, verify: false }).catch(() => ({ refreshed: false }));
    if (refreshed.refreshed) result = await send();
  }
  return result;
}

async function localRequest(requestPath, options = {}) {
  const token = await readLocalToken();
  const headers = { ...(options.headers ?? {}) };
  if (token) headers.authorization = `Bearer ${token}`;
  if (process.env.YUNLOGIN_LOCAL_COOKIE) headers.cookie = process.env.YUNLOGIN_LOCAL_COOKIE;
  return requestJson(localOrigin(), requestPath, { ...options, headers });
}

async function clientRequest(requestPath, options = {}) {
  return requestJson(clientOrigin(), requestPath, options);
}

function normalizeServerShops(payload) {
  return (payload?.shop ?? []).map((shop) => ({
    accountId: shop.shopid,
    name: shop.name,
    serial: shop.serial,
    kernel: shop.kernel,
    kernelVersion: shop.kernelVersion,
    group: shop.group?.name,
    labels: (shop.label ?? []).map((label) => label.name),
    notes: shop.notes,
    source: "server",
  }));
}

function normalizeLocalShops(payload) {
  return (payload?.data?.list ?? []).map((shop) => ({
    accountId: shop.shopId,
    name: shop.accountName,
    serial: shop.serial,
    source: "local",
  }));
}

function serverListBody(options, companyid, userid) {
  return {
    groupid: "", shopname: options.name ?? "", serial: 0, sortorder: 12, remark: "", label: "",
    authoritiesUserid: [], labelids: [], companyid, userid, enable: 1, offer: 0, number: options.number ?? 100,
    browserid: [], self: false, transfers: false, share: false, authorities: false,
    open_by_others: false, create_by_others: false,
  };
}

export async function listEnvironments(options = {}) {
  const transport = options.transport ?? "auto";
  const attempts = [];
  if (transport !== "local") {
    const { companyid, userid } = await serverIdentityValues();
    if (!companyid || !userid) {
      attempts.push({ transport: "server", error: "The server transport needs a company and user. Run node scripts/yunlogin-auth.mjs save-server-token, or set YUNLOGIN_SERVER_COMPANY_ID and YUNLOGIN_SERVER_USER_ID." });
    } else {
      try {
        const response = await serverRequest(SERVER_LIST_PATH, { method: "POST", body: serverListBody(options, companyid, userid) });
        if (response.ok && response.payload?.code === 200) {
          return { transport: "server", environments: normalizeServerShops(response.payload) };
        }
        attempts.push({ transport: "server", error: `HTTP ${response.status}, code=${response.payload?.code}, msg=${response.payload?.msg ?? ""}` });
      } catch (error) {
        attempts.push({ transport: "server", error: error.message });
      }
    }
    if (transport === "server") throw new Error(`Server list failed: ${attempts.at(-1).error}`);
  }
  const response = await localRequest(LOCAL_LIST_PATH, { method: "POST", body: { groupId: "", accountName: options.name ?? "" } });
  if (!response.ok || response.payload?.code !== 0) {
    throw new Error(`Local list failed: HTTP ${response.status}, code=${response.payload?.code}, msg=${response.payload?.msg ?? ""}${attempts.length ? ` (server attempt: ${attempts[0].error})` : ""}`);
  }
  return { transport: "local", environments: normalizeLocalShops(response.payload), serverAttempts: attempts };
}

export async function listGroups(options = {}) {
  const identity = await serverIdentityValues();
  const response = await serverRequest(SERVER_GROUP_LIST_PATH, {
    method: "POST",
    body: {
      company: identity.company,
      companyid: identity.companyid,
      userid: identity.userid,
      name: options.name ?? "",
    },
  });
  if (!response.ok || response.payload?.code !== 200) {
    throw new Error(`Group list failed: HTTP ${response.status}, code=${response.payload?.code}`);
  }
  return (response.payload.group ?? []).map((group) => ({ groupId: group.gropid, name: group.name, systemGroup: group.system_group }));
}

export async function createGroup(name, options = {}) {
  const identity = await serverIdentityValues();
  const body = {
    company: identity.company,
    companyid: identity.companyid,
    userid: identity.userid,
    group: name,
    groupid: options.groupId ?? "",
  };
  if (options.dryRun) return { dryRun: true, path: SERVER_GROUP_CREATE_PATH, body };
  const response = await serverRequest(SERVER_GROUP_CREATE_PATH, { method: "POST", body });
  if (!response.ok || response.payload?.code !== 200) {
    throw new Error(`Group create failed: HTTP ${response.status}, code=${response.payload?.code}, msg=${response.payload?.msg ?? ""}`);
  }
  return { path: SERVER_GROUP_CREATE_PATH, groupId: response.payload.categoryid, name: response.payload.name };
}

export async function deleteGroups(groupIds, options = {}) {
  const body = { groupid: groupIds };
  if (options.dryRun) return { dryRun: true, path: SERVER_GROUP_DELETE_PATH, body };
  const response = await serverRequest(SERVER_GROUP_DELETE_PATH, { method: "POST", body });
  return { path: SERVER_GROUP_DELETE_PATH, ok: response.ok && response.payload?.code === 200, code: response.payload?.code, msg: response.payload?.msg };
}

export async function listTags(options = {}) {
  const identity = await serverIdentityValues();
  const params = new URLSearchParams({
    company: identity.company,
    companyid: identity.companyid,
    keyword: options.keyword ?? "",
    page: "1",
    per_page: String(options.perPage ?? 10000),
  });
  const response = await serverRequest(`${SERVER_TAG_LIST_PATH}?${params.toString()}`);
  if (!response.ok || response.payload?.code !== 200) {
    throw new Error(`Tag list failed: HTTP ${response.status}, code=${response.payload?.code}`);
  }
  return (response.payload.data?.data ?? []).map((tag) => ({ labelId: tag.labelid, name: tag.name, color: tag.color, colorName: colorName(tag.color) }));
}

export async function upsertTag(name, options = {}) {
  const identity = await serverIdentityValues();
  const body = {
    company: identity.company,
    companyid: identity.companyid,
    color: options.color ?? DEFAULT_TAG_COLOR,
    label: name,
    labelid: options.labelId ?? "",
  };
  if (options.dryRun) return { dryRun: true, path: SERVER_TAG_UPSERT_PATH, body };
  const response = await serverRequest(SERVER_TAG_UPSERT_PATH, { method: "POST", body });
  if (!response.ok || response.payload?.code !== 200) {
    throw new Error(`Tag upsert failed: HTTP ${response.status}, code=${response.payload?.code}`);
  }
  return { path: SERVER_TAG_UPSERT_PATH, code: response.payload.code, msg: response.payload.msg };
}

export async function deleteTags(labelIds, options = {}) {
  const identity = await serverIdentityValues();
  const body = { company: identity.company, companyid: identity.companyid, labelid: labelIds };
  if (options.dryRun) return { dryRun: true, path: SERVER_TAG_DELETE_PATH, body };
  const response = await serverRequest(SERVER_TAG_DELETE_PATH, { method: "POST", body });
  return { path: SERVER_TAG_DELETE_PATH, ok: response.ok && response.payload?.code === 200, code: response.payload?.code, msg: response.payload?.msg };
}

export async function resolveGroup(name, options = {}) {
  const groups = await listGroups({ name });
  const exact = groups.find((group) => group.name === name);
  if (exact) return exact;
  if (!options.createMissing) throw new Error(`Group "${name}" does not exist. Pass --create-missing to create it.`);
  const created = await createGroup(name, options);
  return { groupId: created.groupId, name };
}

export async function resolveTags(names, options = {}) {
  const tags = await listTags();
  const resolved = [];
  for (const name of names) {
    const exact = tags.find((tag) => tag.name === name);
    if (exact) {
      resolved.push(exact);
      continue;
    }
    if (!options.createMissing) throw new Error(`Tag "${name}" does not exist. Pass --create-missing to create it.`);
    await upsertTag(name, { color: options.color });
    const refreshed = await listTags();
    const created = refreshed.find((tag) => tag.name === name);
    if (!created) throw new Error(`Tag "${name}" was created but could not be resolved`);
    resolved.push(created);
  }
  return resolved;
}

function randomMac() {
  const bytes = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));
  bytes[0] = (bytes[0] | 2) & 0xfe;
  return bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join("-");
}

function kernelIdFor(kernelVersion, defaults) {
  const match = (defaults?.kernelversion ?? []).find((entry) => String(entry.version) === String(kernelVersion));
  if (match?.id) return match.id;
  const numeric = Number.parseInt(kernelVersion, 10);
  return Number.isInteger(numeric) ? 10000 + numeric : undefined;
}

function uaFor(system, kernelVersion) {
  const platform = /windows/i.test(system)
    ? "Windows NT 10.0; Win64; x64"
    : /mac/i.test(system) ? "Macintosh; Intel Mac OS X 10_15_7" : "X11; Linux x86_64";
  return `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${kernelVersion}.0.0.0 Safari/537.36`;
}

export function buildFingerprintBlock(input) {
  const adapter = input.gpu?.adapters?.[0];
  return {
    kernel: input.kernel,
    kernelId: kernelIdFor(input.kernelVersion, input.defaults),
    kernelversion: String(input.kernelVersion),
    system: input.system,
    nextsystem: { MacOS: "", Linux: "", Android: "", IOS: "" },
    UAversion: String(input.kernelVersion),
    ua: uaFor(input.system, input.kernelVersion),
    language: [],
    zone: "",
    geographic: { enable: 1, user: 1, longitude: "", latitude: "", accuracy: "" },
    dpi: "default",
    widowssize: "default",
    font: { enable: 1, list: [] },
    fontfinger: 0,
    WebRTC: 0,
    WebRTCIP: "",
    Canvas: 0,
    WebGl: 1,
    WebGlInfo: 2,
    WebGLVendor: adapter ? `${adapter.vendorName ?? "Google Inc."} (${adapter.name ?? "Unknown"})` : "Google Inc. (Intel)",
    WebGLRenderer: adapter
      ? `ANGLE (${adapter.vendorName ?? "Unknown"}, ${adapter.name ?? "Unknown"} Direct3D11 vs_5_0 ps_5_0, D3D11)`
      : "ANGLE (Intel, Intel(R) UHD Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
    AudioContext: 0,
    clientRects: 1,
    SpeechVoices: 1,
    mediadevice: 0,
    cpu: 8,
    mem: 8,
    devicename: process.env.COMPUTERNAME ?? os.hostname() ?? "DESKTOP",
    mac: randomMac(),
    hardware: 1,
    Bluetooth: 0,
    Donottrack: 2,
    battery: 1,
    enablescanport: 1,
    scanport: "",
    enableCookie: 1,
    enableopen: 2,
    enablenotice: 1,
    enablepic: 2,
    picsize: "0",
    enablesound: 2,
    enablevideo: 2,
    enableGc: 2,
    gcTime: 5,
    enableClearStorage: 2,
    enableClearCookie: 2,
    randomFinger: 2,
  };
}

export function buildLocalFingerBlock(input) {
  return {
    kernel: input.kernel,
    kernelversion: String(input.kernelVersion),
    system: input.system,
    uaVersion: Number.parseInt(input.kernelVersion, 10),
    userAgent: uaFor(input.system, input.kernelVersion),
    webRTC: 0,
    canvas: 0,
    webGl: 1,
    randomFinger: 3,
    enableScanPort: 1,
  };
}

async function localGpuInfo() {
  try {
    const response = await clientRequest(LOCAL_GPU_PATH, { method: "POST", body: {} });
    return response.payload?.code === 0 ? response.payload.data : undefined;
  } catch {
    return undefined;
  }
}

// getfingerprinturi returns an empty proxy skeleton. Submitting it verbatim
// leaves deviceType, inlie, region and ipChannel empty, and the environment is
// then listed as "proxy deleted". Send the direct-connection template instead.
const LOCAL_PROXY_BLOCK = {
  dns: { mode: false, inside: true },
  deviceType: "local",
  inlie: "local",
  region: "random-random-random",
  ipChannel: "ipinfo",
  randEnv: false,
  proxyaddrArr: null,
};

export function buildLocalProxyBlock() {
  return { ...LOCAL_PROXY_BLOCK, dns: { ...LOCAL_PROXY_BLOCK.dns } };
}

// The cookie field must be a cookie object or the "[]" string, and url must be
// an array. The template ships empty values that the server rejects.
export function buildAccountsBlock() {
  return { url: [], cookie: "[]" };
}

export async function buildServerCreateBody(options) {
  const name = normalizeEnvironmentName(options.name);
  const attributes = options.attributes ?? {};
  if (options.templateFile) {
    const template = JSON.parse(await readFile(options.templateFile, "utf8"));
    const browser = template.browser ?? template;
    return {
      number: options.number ?? 1, randProxy: 0, batch_platform_id: "", batch_custom_id: "", batchProxy: [],
      browser: {
        ...browser,
        name,
        proxy: attributes.proxy ?? browser.proxy ?? buildLocalProxyBlock(),
        accounts: attributes.accounts ?? buildAccountsBlock(),
        ...(attributes.notes !== undefined ? { notes: attributes.notes } : {}),
        ...(attributes.groupId ? { categoryid: attributes.groupId } : {}),
        ...(attributes.labelIds ? { labelid: attributes.labelIds } : {}),
      },
    };
  }
  const system = options.system ?? DEFAULT_SYSTEM;
  const kernel = options.kernel ?? DEFAULT_KERNEL;
  const kernelVersion = String(options.kernelVersion ?? DEFAULT_KERNEL_VERSION);
  const responses = await Promise.all([
    serverRequest(SERVER_TEMPLATE_PATH, { method: "POST", body: { kernel, kernelVersion, system } }),
    serverRequest(SERVER_DEFAULTS_PATH, { method: "POST", body: { system, kernel, kernelVersion } }),
    localGpuInfo(),
  ]);
  const templateResponse = responses[0];
  const defaultsResponse = responses[1];
  const gpu = responses[2];
  if (templateResponse.payload?.code !== 200) {
    throw new Error(`getfingerprinturi returned code=${templateResponse.payload?.code}, msg=${templateResponse.payload?.msg ?? ""}`);
  }
  const browseinfo = templateResponse.payload.browseinfo ?? {};
  return {
    number: options.number ?? 1, randProxy: 0, batch_platform_id: "", batch_custom_id: "", batchProxy: [],
    browser: {
      name,
      notes: attributes.notes ?? browseinfo.notes ?? "",
      labelid: attributes.labelIds ?? [],
      is_star_tag: browseinfo.is_star_tag ?? 0,
      shopid: "",
      categoryid: attributes.groupId ?? browseinfo.categoryid ?? "",
      top_order: browseinfo.top_order ?? 0,
      proxy: attributes.proxy ?? buildLocalProxyBlock(),
      accounts: attributes.accounts ?? buildAccountsBlock(),
      fingerprint: buildFingerprintBlock({ system, kernel, kernelVersion, defaults: defaultsResponse.payload, gpu }),
    },
  };
}

async function waitForEnvironment(name, options) {
  const deadline = Date.now() + (options.createPollMs ?? DEFAULT_CREATE_POLL_MS);
  for (;;) {
    try {
      const listed = await listEnvironments({ name, transport: "auto" });
      const match = listed.environments.find((environment) => environment.name === name);
      if (match) return match;
    } catch {
      // Retry until the deadline.
    }
    if (Date.now() >= deadline) return undefined;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
}

export async function createEnvironment(options = {}) {
  const name = normalizeEnvironmentName(options.name);
  const transport = options.transport ?? "auto";
  const attempts = [];
  if (transport !== "local") {
    try {
      const body = await buildServerCreateBody({ ...options, name });
      if (options.dryRun) return { dryRun: true, transport: "server", path: SERVER_CREATE_PATH, name, body };
      const response = await serverRequest(SERVER_CREATE_PATH, { method: "POST", body });
      if (response.payload?.code === 200) {
        const returnedId = response.payload.shopid?.[0];
        const environment = returnedId ? { accountId: returnedId, name, source: "server" } : await waitForEnvironment(name, options);
        if (environment) return { transport: "server", path: SERVER_CREATE_PATH, name, environment, message: response.payload.msg };
        attempts.push({ transport: "server", error: "create succeeded but the environment was not listed before the deadline" });
      } else {
        attempts.push({ transport: "server", error: `HTTP ${response.status}, code=${response.payload?.code}, msg=${response.payload?.msg ?? ""}` });
      }
    } catch (error) {
      attempts.push({ transport: "server", error: error.message });
    }
    if (transport === "server") throw new Error(`Server create failed: ${attempts.at(-1).error}`);
  }
  const attributes = options.attributes ?? {};
  // The local route reads the group from accounts.groupid. A top-level groupid
  // is accepted but ignored, which silently drops the environment into the
  // default group. The local route exposes no tag field at all.
  const skippedAttributes = attributes.labelIds?.length
    ? {
        labels: attributes.labelNames ?? attributes.labelIds,
        reason: "The local create route has no tag field, so the tags were not applied. Use the server transport to set tags.",
      }
    : undefined;
  const body = {
    browser: Array.from({ length: options.number ?? 1 }, () => ({
      name,
      notes: attributes.notes ?? "",
      ...(attributes.groupId ? { accounts: { groupid: attributes.groupId } } : {}),
      proxy: { type: "local" },
      finger: buildLocalFingerBlock({
        system: options.system ?? DEFAULT_SYSTEM,
        kernel: options.kernel ?? DEFAULT_KERNEL,
        kernelVersion: String(options.kernelVersion ?? DEFAULT_KERNEL_VERSION),
      }),
    })),
  };
  if (options.dryRun) return { dryRun: true, transport: "local", path: LOCAL_CREATE_PATH, name, body, skippedAttributes, serverAttempts: attempts };
  const response = await localRequest(LOCAL_CREATE_PATH, { method: "POST", body });
  if (!response.ok || response.payload?.code !== 0) {
    throw new Error(`Local create failed: HTTP ${response.status}, code=${response.payload?.code}, msg=${response.payload?.msg ?? ""}${attempts.length ? ` (server attempt: ${attempts[0].error})` : ""}`);
  }
  const environment = await waitForEnvironment(name, options);
  if (!environment) throw new Error("Local create succeeded but the environment was not listed before the deadline");
  return { transport: "local", path: LOCAL_CREATE_PATH, name, environment, skippedAttributes, serverAttempts: attempts };
}

export async function deleteEnvironment(accountId, options = {}) {
  if (!accountId) throw new Error("--account-id is required for delete");
  const transport = options.transport ?? "auto";
  const attempts = [];
  if (transport !== "local") {
    const { companyid, userid, company } = await serverIdentityValues();
    const serverBody = { company, companyid, userid, shopid: [accountId] };
    if (companyid && userid && options.dryRun) return { dryRun: true, transport: "server", path: SERVER_DELETE_PATH, body: serverBody };
    if (companyid && userid) {
      try {
        const response = await serverRequest(SERVER_DELETE_PATH, { method: "POST", body: serverBody });
        if (response.ok && response.payload?.code === 200) {
          return { transport: "server", path: SERVER_DELETE_PATH, ok: true, code: response.payload.code, msg: response.payload.msg };
        }
        attempts.push({ transport: "server", error: `HTTP ${response.status}, code=${response.payload?.code}, msg=${response.payload?.msg ?? ""}` });
      } catch (error) {
        attempts.push({ transport: "server", error: error.message });
      }
    } else {
      attempts.push({ transport: "server", error: "The server transport needs a company and user. Run node scripts/yunlogin-auth.mjs save-server-token, or set YUNLOGIN_SERVER_COMPANY_ID and YUNLOGIN_SERVER_USER_ID." });
    }
    if (transport === "server") throw new Error(`Server delete failed: ${attempts.at(-1).error}`);
  }
  const body = { browserid: [accountId] };
  if (options.dryRun) return { dryRun: true, transport: "local", path: LOCAL_DELETE_PATH, body, serverAttempts: attempts };
  const response = await localRequest(LOCAL_DELETE_PATH, { method: "POST", body });
  return {
    transport: "local",
    path: LOCAL_DELETE_PATH,
    ok: response.ok && response.payload?.code === 0,
    status: response.status,
    code: response.payload?.code,
    msg: response.payload?.msg,
    serverAttempts: attempts,
  };
}

export async function cleanEnvironment(accountId, options = {}) {
  const body = { is_fireFox: false, env_id: accountId };
  if (options.dryRun) return { dryRun: true, path: LOCAL_CLEAN_PATH, body };
  const response = await clientRequest(LOCAL_CLEAN_PATH, { method: "POST", body });
  return { path: LOCAL_CLEAN_PATH, ok: response.ok && response.payload?.code === 0, code: response.payload?.code, msg: response.payload?.msg };
}

export async function bootstrapToken(options = {}) {
  let environment;
  let created = false;
  if (options.accountId) {
    environment = { accountId: options.accountId, name: options.name, source: "explicit" };
  } else {
    const listed = await listEnvironments({ name: options.name, transport: "auto" });
    environment = listed.environments[0];
  }
  if (!environment) {
    if (options.reuseOnly) {
      throw new Error("No environment is available and --reuse-only was passed.");
    }
    const plannedName = options.name
      ? normalizeEnvironmentName(options.name)
      : buildTemporaryEnvironmentName(options.kernelVersion ?? DEFAULT_KERNEL_VERSION);
    if (!options.confirmCreate) {
      return {
        needsConfirmation: true,
        reason: "no environment is available",
        planned: { name: plannedName, notes: buildTemporaryEnvironmentNotes(), system: options.system ?? DEFAULT_SYSTEM, kernel: options.kernel ?? DEFAULT_KERNEL, kernelVersion: String(options.kernelVersion ?? DEFAULT_KERNEL_VERSION) },
        message: "Ask the user whether a temporary environment may be created, then re-run with --confirm-create.",
      };
    }
    const createdResult = await createEnvironment({
      name: plannedName,
      system: options.system,
      kernel: options.kernel,
      kernelVersion: options.kernelVersion,
      transport: options.transport,
      timeoutMs: options.timeoutMs,
      attributes: { notes: buildTemporaryEnvironmentNotes() },
    });
    environment = createdResult.environment;
    created = true;
  }
  let capture;
  let captureError;
  try {
    capture = await captureLocalToken({
      accountId: environment.accountId,
      headless: "1",
      timeoutMs: options.timeoutMs,
      cacheFile: options.cacheFile,
      quiet: true,
    });
  } catch (error) {
    captureError = error;
  }
  // Cleanup is unconditional for an environment this helper created, so a
  // failed capture never leaves a temporary environment behind.
  let deleted;
  if (created && !options.keepEnvironment) {
    deleted = await deleteEnvironment(environment.accountId, { transport: options.transport });
  } else if (created) {
    deleted = { skipped: true, reason: "--keep-environment" };
  }
  if (captureError) {
    const failure = new Error(`Token capture failed: ${captureError.message}`);
    failure.environment = environment;
    failure.created = created;
    failure.deleted = deleted;
    throw failure;
  }
  return { environment, created, capture, deleted };
}

function confirmationRequired(command, detail) {
  console.error(JSON.stringify({
    command,
    needsConfirmation: true,
    ...detail,
    message: "Ask the user to confirm, then re-run with the documented confirmation flag.",
  }, null, 2));
  process.exitCode = 2;
}

async function main() {
  const { command, options } = parseArguments(process.argv.slice(2));

  if (command === "list") {
    const result = await listEnvironments(options);
    console.log(JSON.stringify({ command: "list", transport: result.transport, count: result.environments.length, environments: result.environments, serverAttempts: result.serverAttempts }, null, 2));
    return;
  }

  if (command === "group-list") {
    console.log(JSON.stringify({ command: "group-list", name: options.name ?? "", groups: await listGroups(options) }, null, 2));
    return;
  }

  if (command === "group-create") {
    const name = normalizeName(options.name, { label: "name" });
    console.log(JSON.stringify({ command: "group-create", name, ...(await createGroup(name, options)) }, null, 2));
    return;
  }

  if (command === "group-delete") {
    if (!options.groupId) throw new Error("--group-id is required for group-delete");
    if (!options.confirmDelete && !options.dryRun) {
      confirmationRequired("group-delete", { groupId: options.groupId });
      return;
    }
    console.log(JSON.stringify({ command: "group-delete", groupId: options.groupId, ...(await deleteGroups([options.groupId], options)) }, null, 2));
    return;
  }

  if (command === "tag-list") {
    console.log(JSON.stringify({ command: "tag-list", tags: await listTags(options) }, null, 2));
    return;
  }

  if (command === "tag-create") {
    const name = normalizeName(options.name, { label: "name" });
    console.log(JSON.stringify({ command: "tag-create", name, color: describeTagColor(options.color), ...(await upsertTag(name, options)) }, null, 2));
    return;
  }

  if (command === "tag-delete") {
    if (!options.labelId) throw new Error("--label-id is required for tag-delete");
    if (!options.confirmDelete && !options.dryRun) {
      confirmationRequired("tag-delete", { labelId: options.labelId });
      return;
    }
    console.log(JSON.stringify({ command: "tag-delete", labelId: options.labelId, ...(await deleteTags([options.labelId], options)) }, null, 2));
    return;
  }

  if (command === "clean-env") {
    if (!options.accountId) throw new Error("--account-id is required for clean-env");
    if (!options.confirmClean && !options.dryRun) {
      confirmationRequired("clean-env", { accountId: options.accountId });
      return;
    }
    console.log(JSON.stringify({ command: "clean-env", accountId: options.accountId, ...(await cleanEnvironment(options.accountId, options)) }, null, 2));
    return;
  }

  if (command === "create") {
    const wantsAttributes = options.notes !== undefined || options.labels.length > 0 || options.group !== undefined;
    if (!wantsAttributes && !options.acceptDefaults && !options.dryRun) {
      // Ask the user before creating a bare environment, and list the real
      // group and tag names so the question is concrete instead of a guess.
      let availableGroups = [];
      let availableTags = [];
      try {
        const [groups, tags] = await Promise.all([listGroups({}), listTags()]);
        availableGroups = groups.map((group) => group.name);
        availableTags = tags.map((tag) => tag.name);
      } catch {
        // The lists are a convenience; the question still stands without them.
      }
      console.log(JSON.stringify({
        command: "create",
        needsAttributes: true,
        name: options.name,
        availableGroups,
        availableTags,
        message: "Ask the user which group, remark, and tags to apply, then re-run with --group, --notes, and --label plus --confirm-attributes. Pass --accept-defaults to create in the default group with no remark and no tags.",
      }, null, 2));
      process.exitCode = 2;
      return;
    }
    if (wantsAttributes && !options.confirmAttributes && !options.dryRun) {
      confirmationRequired("create", {
        requested: { name: options.name, notes: options.notes, labels: options.labels, group: options.group },
        hint: "Re-run with --confirm-attributes after the user agrees to apply these attributes.",
      });
      return;
    }
    let attributes;
    if (wantsAttributes) {
      attributes = {};
      if (options.notes !== undefined) attributes.notes = options.notes;
      if (options.group !== undefined) {
        const group = await resolveGroup(normalizeName(options.group, { label: "group" }), options);
        attributes.groupId = group.groupId;
        attributes.groupName = group.name;
      }
      if (options.labels.length > 0) {
        const normalizedLabels = options.labels.map((label) => normalizeName(label, { label: "label" }));
        const tags = await resolveTags(normalizedLabels, options);
        attributes.labelIds = tags.map((tag) => tag.labelId);
        attributes.labelNames = tags.map((tag) => tag.name);
      }
    }
    const result = await createEnvironment({ ...options, attributes });
    const skipped = result.skippedAttributes;
    const appliedAttributes = attributes
      ? {
          ...(attributes.notes !== undefined ? { notes: attributes.notes } : {}),
          ...(attributes.groupName ? { group: attributes.groupName } : {}),
          ...(attributes.labelNames && !skipped?.labels ? { labels: attributes.labelNames } : {}),
        }
      : undefined;
    console.log(JSON.stringify({
      command: "create",
      ...result,
      appliedAttributes,
    }, null, 2));
    return;
  }

  if (command === "delete") {
    if (!options.accountId) throw new Error("--account-id is required for delete");
    if (!options.confirmDelete && !options.dryRun) {
      confirmationRequired("delete", { accountId: options.accountId });
      return;
    }
    console.log(JSON.stringify({ command: "delete", accountId: options.accountId, ...(await deleteEnvironment(options.accountId, options)) }, null, 2));
    return;
  }

  if (command === "bootstrap-token") {
    const result = await bootstrapToken(options);
    console.log(JSON.stringify({ command: "bootstrap-token", ...result }, null, 2));
    if (result.needsConfirmation) process.exitCode = 2;
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}
