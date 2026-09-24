#!/usr/bin/env node

/**
 * Token setup and refresh for the YunLogin skill.
 *
 * Two credentials exist and they are not interchangeable:
 *   local  - grants the loopback desktop API, captured from the bundled
 *            browser extension, refreshable without user input.
 *   server - grants the management-center HTTPS API, supplied by the user
 *            once and then cached in the user profile.
 *
 * Both live outside the skill in %LOCALAPPDATA%\yunlogin-browser\ on Windows
 * and ~/.local/share/yunlogin-browser/ elsewhere.
 *
 * See references/workflows/token-lifecycle.md for the full resolution and refresh rules.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  clearLocalToken,
  clearServerToken,
  readLocalToken,
  readServerIdentity,
  readServerToken,
  resolveLocalTokenFilePath,
  resolveServerTokenFilePath,
  writeLocalToken,
  writeServerSession,
} from "./lib/local-token-store.mjs";

const DEFAULT_LOCAL_ORIGIN = "http://localhost:50213";
const DEFAULT_SERVER_ORIGIN = "https://d126447d359e70c0.yunlogin.com";
const LOCAL_PROBE_PATH = "/api/v2/userapi/user/shopseriallist";
const SERVER_PROBE_PATH = "/v2/sso/auth/myUserinfo";
const SERVER_COMPANIES_PATH = "/v2/team/myCompanies";
const DEFAULT_TIMEOUT_MS = 30000;

function usage() {
  console.error(`Usage:
  node scripts/yunlogin-auth.mjs status
  node scripts/yunlogin-auth.mjs save-server-token [--token-file FILE] [--company-id ID] [--user-id ID]
  node scripts/yunlogin-auth.mjs ensure-server
  node scripts/yunlogin-auth.mjs ensure-local [--confirm-create] [--account-id ID]
  node scripts/yunlogin-auth.mjs clear-server-token
  node scripts/yunlogin-auth.mjs clear-local-token --confirm-clear

Commands:
  status             Verify both tokens and print where each one is stored.
  save-server-token  Verify a server token and cache it with its company and user context.
  ensure-server      Verify the cached server token; drop it when the server rejects it.
  ensure-local       Verify the cached local token; capture a new one when the local API rejects it.
  clear-server-token Delete the cached server token.
  clear-local-token  Delete the cached local token. Requires --confirm-clear.

Options:
  --token-file FILE   Read the server token from FILE instead of YUNLOGIN_SERVER_TOKEN.
  --company-id ID     Company for the server session. Required when the account has several companies.
  --user-id ID        User for the server session. Resolved automatically when omitted.
  --account-id ID     Environment used when ensure-local must capture a new token.
  --confirm-create    Allow ensure-local to create a temporary environment.
  --confirm-clear     Confirm deleting a cached token.
  --timeout-ms MS     Request timeout (default: ${DEFAULT_TIMEOUT_MS}).
  --dry-run           Print the planned action without sending it.
  -h, --help          Show this help.

Environment:
  YUNLOGIN_LOCAL_TOKEN        Local token override.
  YUNLOGIN_LOCAL_TOKEN_FILE   Local token cache path.
  YUNLOGIN_SERVER_TOKEN       Server token override.
  YUNLOGIN_SERVER_TOKEN_FILE  Server token cache path.
  YUNLOGIN_SERVER_COMPANY_ID  Company override for identity resolution.
  YUNLOGIN_SERVER_USER_ID     User override for identity resolution.
  YUNLOGIN_LOCAL_BASE_URL     Local origin override (loopback only).
  YUNLOGIN_SERVER_ORIGIN      Server origin override (https only).

Examples:
  node scripts/yunlogin-auth.mjs status
  node scripts/yunlogin-auth.mjs save-server-token
  node scripts/yunlogin-auth.mjs ensure-local --confirm-create`);
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
  const options = { confirmCreate: false, confirmClear: false, dryRun: false };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--token-file") { options.tokenFile = takeValue(args, index, argument); index += 1; }
    else if (argument === "--company-id") { options.companyId = takeValue(args, index, argument); index += 1; }
    else if (argument === "--user-id") { options.userId = takeValue(args, index, argument); index += 1; }
    else if (argument === "--account-id") { options.accountId = takeValue(args, index, argument); index += 1; }
    else if (argument === "--confirm-create") { options.confirmCreate = true; }
    else if (argument === "--confirm-clear") { options.confirmClear = true; }
    else if (argument === "--timeout-ms") { options.timeoutMs = Number.parseInt(takeValue(args, index, argument), 10); index += 1; }
    else if (argument === "--dry-run") { options.dryRun = true; }
    else throw new Error(`Unknown option: ${argument}`);
  }
  return { command, options };
}

function timeoutMs(options) {
  const value = options.timeoutMs ?? Number.parseInt(process.env.YUNLOGIN_TIMEOUT_MS ?? String(DEFAULT_TIMEOUT_MS), 10);
  if (!Number.isInteger(value) || value <= 0) throw new Error("--timeout-ms must be a positive integer");
  return value;
}

function loopbackOrigin(variable, fallback) {
  const configured = process.env[variable] ?? fallback;
  let parsed;
  try { parsed = new URL(configured); } catch { throw new Error(`${variable} must be a valid origin`); }
  if (!["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname)) throw new Error(`${variable} only permits loopback origins`);
  return parsed.origin;
}

function httpsOrigin(variable, fallback) {
  const configured = process.env[variable] ?? fallback;
  let parsed;
  try { parsed = new URL(configured); } catch { throw new Error(`${variable} must be a valid origin`); }
  if (parsed.protocol !== "https:") throw new Error(`${variable} must use https`);
  return parsed.origin;
}

async function requestJson(origin, requestPath, options = {}) {
  const headers = { accept: "application/json, text/plain, */*", ...(options.headers ?? {}) };
  if (options.body !== undefined) headers["content-type"] = "application/json";
  const response = await fetch(new URL(requestPath, `${origin}/`), {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
  });
  const text = await response.text();
  let payload;
  try { payload = JSON.parse(text); } catch { payload = undefined; }
  return { status: response.status, ok: response.ok, payload };
}

function looksLikeAuthFailure(probe) {
  if (!probe) return false;
  const message = String(probe.payload?.msg ?? "");
  if (/invalid token|token.*(error|invalid)/i.test(message)) return true;
  if (probe.status === 401 || probe.status === 403) return true;
  // 1001 is the management-center code for a rejected or missing bearer token.
  if (probe.payload?.code === 1001) return true;
  return false;
}

export async function probeLocalToken(token, options = {}) {
  const origin = loopbackOrigin("YUNLOGIN_LOCAL_BASE_URL", DEFAULT_LOCAL_ORIGIN);
  const probe = await requestJson(origin, LOCAL_PROBE_PATH, {
    method: "POST",
    body: { groupId: "", accountName: "" },
    headers: token ? { authorization: `Bearer ${token}` } : {},
    timeoutMs: options.timeoutMs,
  });
  const authFailure = looksLikeAuthFailure(probe);
  return {
    usable: probe.ok && probe.payload?.code === 0 && !authFailure,
    httpStatus: probe.status,
    code: probe.payload?.code,
    msg: probe.payload?.msg,
    authFailure,
  };
}

export async function probeServerToken(token, options = {}) {
  const origin = httpsOrigin("YUNLOGIN_SERVER_ORIGIN", DEFAULT_SERVER_ORIGIN);
  const probe = await requestJson(origin, SERVER_PROBE_PATH, {
    method: "POST",
    body: {},
    headers: token ? { authorization: `Bearer ${token}` } : {},
    timeoutMs: options.timeoutMs,
  });
  return {
    usable: probe.payload?.code === 200,
    httpStatus: probe.status,
    code: probe.payload?.code,
    msg: probe.payload?.msg,
    userId: probe.payload?.data?.userId,
    nickname: probe.payload?.data?.nickname,
  };
}

async function listCompanies(token, options) {
  const origin = httpsOrigin("YUNLOGIN_SERVER_ORIGIN", DEFAULT_SERVER_ORIGIN);
  const response = await requestJson(origin, SERVER_COMPANIES_PATH, {
    method: "POST",
    body: {},
    headers: { authorization: `Bearer ${token}` },
    timeoutMs: options.timeoutMs,
  });
  if (response.payload?.code !== 200) return [];
  const data = response.payload.data;
  const list = Array.isArray(data) ? data : (data?.list ?? []);
  return list.map((company) => ({ companyId: company.companyId, name: company.name }));
}

async function resolveTokenValue(options) {
  if (typeof options.tokenValue === "string" && options.tokenValue) return options.tokenValue;
  if (options.tokenFile) {
    const raw = await readFile(options.tokenFile, "utf8");
    const value = raw.trim();
    if (!value) throw new Error("--token-file is empty");
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "string") return parsed;
      if (typeof parsed?.token === "string") return parsed.token;
    } catch {
      return value;
    }
    return value;
  }
  const fromEnv = process.env.YUNLOGIN_SERVER_TOKEN;
  if (fromEnv) return fromEnv;
  const cached = await readServerToken();
  if (cached) return cached;
  throw new Error("No server token supplied. Set YUNLOGIN_SERVER_TOKEN or pass --token-file.");
}

export async function saveServerToken(options = {}) {
  const token = await resolveTokenValue(options);
  const probe = await probeServerToken(token, options);
  if (!probe.usable) {
    return { saved: false, reason: `server rejected the token: HTTP ${probe.httpStatus}, code=${probe.code}, msg=${probe.msg ?? ""}` };
  }
  const companies = await listCompanies(token, options);
  let companyId = options.companyId ?? process.env.YUNLOGIN_SERVER_COMPANY_ID;
  let company;
  if (companyId) {
    company = companies.find((item) => item.companyId === companyId)?.name;
  } else if (companies.length === 1) {
    companyId = companies[0].companyId;
    company = companies[0].name;
  } else if (companies.length > 1) {
    return {
      saved: false,
      reason: `the account belongs to ${companies.length} companies; pass --company-id`,
      companies,
      needsCompany: true,
    };
  }
  const userId = options.userId ?? process.env.YUNLOGIN_SERVER_USER_ID ?? probe.userId;
  if (options.dryRun) {
    return { dryRun: true, path: resolveServerTokenFilePath(), tokenLength: token.length, companyId, userId, company };
  }
  const path = await writeServerSession({ token, companyId, userId, company });
  return { saved: true, path, tokenLength: token.length, companyId, userId, company, nickname: probe.nickname };
}

export async function ensureServerToken(options = {}) {
  const cached = await readServerToken();
  if (!cached) {
    return { usable: false, cached: false, needsNewToken: true, reason: "no server token is stored" };
  }
  const probe = await probeServerToken(cached, options);
  if (probe.usable) {
    return { usable: true, cached: true, source: process.env.YUNLOGIN_SERVER_TOKEN ? "environment" : "cache", userId: probe.userId, identity: await readServerIdentity() };
  }
  if (!options.dryRun) await clearServerToken();
  return {
    usable: false,
    cached: true,
    needsNewToken: true,
    cleared: !options.dryRun,
    reason: `the server rejected the stored token: HTTP ${probe.httpStatus}, code=${probe.code}, msg=${probe.msg ?? ""}`,
    hint: "Export a fresh token and run: node scripts/yunlogin-auth.mjs save-server-token",
  };
}

export async function ensureLocalToken(options = {}) {
  const cached = await readLocalToken();
  if (cached) {
    const probe = await probeLocalToken(cached, options);
    if (probe.usable) {
      return { usable: true, refreshed: false, source: process.env.YUNLOGIN_LOCAL_TOKEN ? "environment" : "cache", path: resolveLocalTokenFilePath(), code: probe.code };
    }
  }
  if (options.dryRun) {
    return { usable: false, refreshed: false, dryRun: true, wouldCapture: true, reason: cached ? "the stored local token was rejected" : "no local token is stored" };
  }
  const { bootstrapToken } = await import("./yunlogin-env.mjs");
  const result = await bootstrapToken({
    accountId: options.accountId,
    createIfMissing: true,
    confirmCreate: options.confirmCreate,
    keepEnvironment: options.keepEnvironment,
    timeoutMs: options.timeoutMs,
    cacheFile: options.cacheFile,
  });
  if (result.needsConfirmation) {
    return {
      usable: false,
      refreshed: false,
      needsConfirmation: true,
      reason: result.reason,
      planned: result.planned,
      message: result.message,
    };
  }
  return { usable: true, refreshed: true, path: resolveLocalTokenFilePath(), capture: result.capture, environment: result.environment, created: result.created };
}

async function main() {
  const { command, options } = parseArguments(process.argv.slice(2));
  const resolvedTimeout = timeoutMs(options);
  const context = { ...options, timeoutMs: resolvedTimeout };

  if (command === "status") {
    const localToken = await readLocalToken();
    const local = localToken ? await probeLocalToken(localToken, context) : { usable: false, reason: "no local token is stored" };
    const server = await ensureServerToken({ ...context, dryRun: true });
    console.log(JSON.stringify({
      command: "status",
      local: {
        stored: Boolean(localToken),
        source: process.env.YUNLOGIN_LOCAL_TOKEN ? "environment" : localToken ? "cache" : "none",
        path: resolveLocalTokenFilePath(),
        ...local,
      },
      server: {
        stored: Boolean(await readServerToken()),
        path: resolveServerTokenFilePath(),
        ...server,
      },
    }, null, 2));
    return;
  }

  if (command === "save-server-token") {
    console.log(JSON.stringify({ command, ...(await saveServerToken(context)) }, null, 2));
    return;
  }

  if (command === "ensure-server") {
    console.log(JSON.stringify({ command, ...(await ensureServerToken(context)) }, null, 2));
    return;
  }

  if (command === "ensure-local") {
    const result = await ensureLocalToken(context);
    console.log(JSON.stringify({ command, ...result }, null, 2));
    if (result.needsConfirmation) process.exitCode = 2;
    return;
  }

  if (command === "clear-server-token") {
    const path = resolveServerTokenFilePath();
    const cleared = options.dryRun ? false : await clearServerToken();
    console.log(JSON.stringify({ command, path, cleared, dryRun: options.dryRun === true }, null, 2));
    return;
  }

  if (command === "clear-local-token") {
    if (!options.confirmClear && !options.dryRun) {
      console.error(JSON.stringify({ command, needsConfirmation: true, message: "Ask the user to confirm, then re-run with --confirm-clear." }, null, 2));
      process.exitCode = 2;
      return;
    }
    const path = resolveLocalTokenFilePath();
    const cleared = options.dryRun ? false : await clearLocalToken();
    console.log(JSON.stringify({ command, path, cleared, dryRun: options.dryRun === true }, null, 2));
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
