#!/usr/bin/env node

/**
 * Read the current Workbench management page credential and maintain one
 * verified user-level session. See references/workflows/token-lifecycle.md.
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
import {
  refreshServerToken as refreshServerSession,
  serverSessionStatus,
} from "./lib/server-token.mjs";
import { syncWorkbench, workbenchStatus } from "./lib/workbench-session.mjs";

const DEFAULT_LOCAL_ORIGIN = "http://localhost:50213";
const DEFAULT_SERVER_ORIGIN = "https://d126447d359e70c0.yunlogin.com";
const LOCAL_PROBE_PATH = "/api/v2/userapi/user/shopseriallist";
const SERVER_PROBE_PATH = "/v2/sso/auth/myUserinfo";
const SERVER_COMPANIES_PATH = "/v2/team/myCompanies";
const SERVER_LOGIN_PATH = "/v2/sso/login";
const SERVER_LOGIN_ORIGIN = "chrome-extension://iginhnpfilcejkhoifnjlhmcgoifmkao";
const SERVER_LOGIN_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";
const DEFAULT_TIMEOUT_MS = 30000;

function usage() {
  console.error(`Usage:
  node scripts/yunlogin-auth.mjs status
  node scripts/yunlogin-auth.mjs sync-workbench [--dry-run]
  node scripts/yunlogin-auth.mjs ensure-server [--dry-run]

Commands:
  status            Compare live Workbench state with the active cache without writing.
  sync-workbench    Read the active Workbench session and atomically synchronize the credential cache.
  ensure-server     Synchronize both current Workbench credentials before use.
  Independent login, import, refresh, and legacy cache-clearing commands are
  disabled in Workbench mode. Remove legacy token/Cookie/identity overrides.

Examples:
  node scripts/yunlogin-auth.mjs status
  node scripts/yunlogin-auth.mjs sync-workbench --dry-run
  node scripts/yunlogin-auth.mjs sync-workbench`);
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
    else if (argument === "--username") { options.username = takeValue(args, index, argument); index += 1; }
    else if (argument === "--password-file") { options.passwordFile = takeValue(args, index, argument); index += 1; }
    else if (argument === "--code") { options.code = takeValue(args, index, argument); index += 1; }
    else if (argument === "--os") { options.os = takeValue(args, index, argument); index += 1; }
    else if (argument === "--source") { options.source = takeValue(args, index, argument); index += 1; }
    else if (argument === "--last-login-port") { options.lastLoginPort = takeValue(args, index, argument); index += 1; }
    else if (argument === "--last-login-device") { options.lastLoginDevice = takeValue(args, index, argument); index += 1; }
    else if (argument === "--cl") { options.cl = takeValue(args, index, argument); index += 1; }
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
  if (options.body !== undefined && !headers["content-type"]) headers["content-type"] = "application/json";
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

function redactLoginBody(body) {
  return {
    ...body,
    username: "[REDACTED]",
    password: "[REDACTED]",
    code: body.code ? "[REDACTED]" : "",
  };
}

function redactLoginHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([name, value]) => [
      name,
      ["cookie", "appinfo", "authorization"].includes(name.toLowerCase()) ? "[SET]" : value,
    ]),
  );
}

async function resolveLoginBody(options) {
  const username = options.username ?? process.env.YUNLOGIN_LOGIN_USERNAME;
  if (!username) throw new Error("Login username is required. Set YUNLOGIN_LOGIN_USERNAME or pass --username.");
  let password = process.env.YUNLOGIN_LOGIN_PASSWORD;
  if (!password && options.passwordFile) {
    const raw = await readFile(options.passwordFile, "utf8");
    password = raw.trim();
  }
  if (!password) throw new Error("Login password is required. Set YUNLOGIN_LOGIN_PASSWORD or pass --password-file.");
  return {
    username,
    password,
    code: options.code ?? process.env.YUNLOGIN_LOGIN_CODE ?? "",
    os: options.os ?? process.env.YUNLOGIN_LOGIN_OS ?? "windows",
    source: options.source ?? process.env.YUNLOGIN_LOGIN_SOURCE ?? "112",
    last_login_port: options.lastLoginPort ?? process.env.YUNLOGIN_LOGIN_LAST_LOGIN_PORT ?? "client",
    last_login_device: options.lastLoginDevice ?? process.env.YUNLOGIN_LOGIN_LAST_LOGIN_DEVICE ?? "pc",
    cl: options.cl ?? process.env.YUNLOGIN_LOGIN_CL ?? "",
  };
}

export async function loginServer(options = {}) {
  throw new Error("Independent login is disabled in Workbench mode. Sign in through Workbench and run sync-workbench.");
  const origin = httpsOrigin("YUNLOGIN_SERVER_ORIGIN", DEFAULT_SERVER_ORIGIN);
  const body = await resolveLoginBody(options);
  const headers = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json;charset=UTF-8",
    apisource: process.env.YUNLOGIN_SERVER_APISOURCE ?? "1",
    origin: process.env.YUNLOGIN_LOGIN_ORIGIN ?? SERVER_LOGIN_ORIGIN,
    "user-agent": process.env.YUNLOGIN_SERVER_USER_AGENT ?? SERVER_LOGIN_USER_AGENT,
  };
  if (process.env.YUNLOGIN_SERVER_APPINFO) headers.appinfo = process.env.YUNLOGIN_SERVER_APPINFO;
  if (process.env.YUNLOGIN_SERVER_COOKIE) headers.cookie = process.env.YUNLOGIN_SERVER_COOKIE;
  const url = new URL(SERVER_LOGIN_PATH, `${origin}/`).href;
  if (options.dryRun) {
    return {
      loggedIn: false,
      dryRun: true,
      endpoint: "POST /v2/sso/login",
      url,
      headers: redactLoginHeaders(headers),
      body: redactLoginBody(body),
    };
  }
  const response = await requestJson(origin, SERVER_LOGIN_PATH, {
    method: "POST",
    body,
    headers,
    timeoutMs: options.timeoutMs,
  });
  const payload = response.payload;
  const token = payload?.data?.token;
  if (payload?.code !== 200 || typeof token !== "string" || !token) {
    return {
      loggedIn: false,
      httpStatus: response.status,
      code: payload?.code,
      msg: payload?.msg,
      reason: response.ok ? "the login response did not contain a usable token" : `HTTP ${response.status}`,
    };
  }
  const session = await saveServerToken({ ...options, tokenValue: token, dryRun: false });
  return {
    loggedIn: true,
    httpStatus: response.status,
    code: payload.code,
    msg: payload.msg,
    tokenLength: token.length,
    openId: payload.data?.openId,
    expire: payload.data?.expire,
    need: payload.data?.need,
    source: payload.data?.source,
    sessionSaved: session.saved === true,
    needsCompany: session.needsCompany === true,
    session,
  };
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
  throw new Error("Independent token import is disabled in Workbench mode. Run sync-workbench.");
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
  // tokenRefresh exchanges the token for one that carries an explicit expiry.
  // Without it the cache could only rely on the JWT exp claim.
  const refreshed = await refreshServerSession({ ...options, token, verify: false });
  return {
    saved: true,
    path,
    tokenLength: token.length,
    companyId,
    userId,
    company,
    nickname: probe.nickname,
    refreshed: refreshed.refreshed,
    expiresAt: refreshed.expiresAt,
    refreshReason: refreshed.refreshed ? undefined : refreshed.reason,
  };
}

export async function ensureServerToken(options = {}) {
  return options.dryRun ? { dryRun: true, wouldSyncWorkbench: true } : syncWorkbench();
  const status = await serverSessionStatus(options);
  if (!status.present) {
    return { usable: false, cached: false, needsNewToken: true, reason: "no server token is stored" };
  }

  let refreshed = false;
  let refreshNote;
  // A dry run only reports state. Refreshing here would rewrite the user's token cache, so a
  // verification command such as "status" must pass dryRun and never mutate the cache.
  if ((status.dueForRefresh && !options.dryRun) || options.forceRefresh) {
    const result = await refreshServerSession({ ...options, token: await readServerToken() });
    refreshed = result.refreshed;
    if (!result.refreshed) refreshNote = result.reason;
  }

  const probe = await probeServerToken(await readServerToken(), options);
  if (probe.usable) {
    const latest = await serverSessionStatus(options);
    return {
      usable: true,
      cached: true,
      refreshed,
      refreshNote,
      source: process.env.YUNLOGIN_SERVER_TOKEN ? "environment" : "cache",
      userId: probe.userId,
      identity: await readServerIdentity(),
      expiresAt: latest.expiresAt,
      expiresAtMs: latest.expiresAtMs,
      remainingMs: latest.remainingMs,
      dueForRefresh: latest.dueForRefresh,
      skewMs: latest.skewMs,
    };
  }

  // A rejected token still gets one refresh attempt before we drop it.
  if (!refreshed) {
    const retry = await refreshServerSession({ ...options, token: await readServerToken() });
    if (retry.refreshed) {
      const second = await probeServerToken(await readServerToken(), options);
      if (second.usable) {
        const latest = await serverSessionStatus(options);
        return {
          usable: true,
          cached: true,
          refreshed: true,
          source: "cache",
          userId: second.userId,
          identity: await readServerIdentity(),
          expiresAt: latest.expiresAt,
          expiresAtMs: latest.expiresAtMs,
          remainingMs: latest.remainingMs,
          dueForRefresh: latest.dueForRefresh,
          skewMs: latest.skewMs,
        };
      }
      refreshNote = "the refreshed token was rejected as well";
    } else {
      refreshNote = retry.reason;
    }
  }

  if (!options.dryRun) await clearServerToken();
  return {
    usable: false,
    cached: true,
    needsNewToken: true,
    cleared: !options.dryRun,
    reason: `the server rejected the stored token: HTTP ${probe.httpStatus}, code=${probe.code}, msg=${probe.msg ?? ""}`,
    refreshAttempt: refreshNote ?? "not attempted",
    hint: "Export a fresh token and run: node scripts/yunlogin-auth.mjs save-server-token",
  };
}

export async function ensureLocalToken(options = {}) {
  throw new Error("Local API token management is outside the Workbench management-session workflow.");
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
  if (command === "status") {
    console.log(JSON.stringify({ command, ...(await workbenchStatus()) }, null, 2));
    return;
  }
  if (["sync-workbench", "ensure-server"].includes(command)) {
    if (options.dryRun) {
      console.log(JSON.stringify({ command, dryRun: true, wouldRead: ["Workbench management page", "Workbench extension", "current identity"], wouldWrite: "user-level workbench-session.json" }, null, 2));
      return;
    }
    console.log(JSON.stringify({ command, ...(await syncWorkbench()) }, null, 2));
    return;
  }
  if (["ensure-local", "save-server-token", "login", "refresh-server-token", "clear-server-token", "clear-local-token"].includes(command)) {
    throw new Error("This command manages an independent credential and is disabled in Workbench mode. Sign in or renew in Workbench, then run sync-workbench.");
  }
  throw new Error(`Unknown command: ${command}`);
  const resolvedTimeout = timeoutMs(options);
  const context = { ...options, timeoutMs: resolvedTimeout };

  if (command === "status") {
    const localToken = await readLocalToken();
    const local = localToken ? await probeLocalToken(localToken, context) : { usable: false, reason: "no local token is stored" };
    const server = await ensureServerToken({ ...context, dryRun: true });
    const serverStatus = await serverSessionStatus(context);
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
        expiresAt: serverStatus.expiresAt,
        expiresAtMs: serverStatus.expiresAtMs,
        remainingMs: serverStatus.remainingMs,
        dueForRefresh: serverStatus.dueForRefresh,
        skewMs: serverStatus.skewMs,
        refreshedAt: serverStatus.refreshedAt,
        ...server,
      },
    }, null, 2));
    return;
  }

  if (command === "save-server-token") {
    console.log(JSON.stringify({ command, ...(await saveServerToken(context)) }, null, 2));
    return;
  }

  if (command === "login") {
    const result = await loginServer(context);
    console.log(JSON.stringify({ command, ...result }, null, 2));
    if (!result.dryRun && !result.loggedIn) process.exitCode = 1;
    else if (result.sessionSaved === false) process.exitCode = result.needsCompany ? 2 : 1;
    return;
  }

  if (command === "ensure-server") {
    console.log(JSON.stringify({ command, ...(await ensureServerToken(context)) }, null, 2));
    return;
  }

  if (command === "refresh-server-token") {
    const status = await serverSessionStatus(context);
    if (!status.present) {
      console.log(JSON.stringify({ command, refreshed: false, needsNewToken: true, reason: "no server token is stored" }, null, 2));
      process.exitCode = 2;
      return;
    }
    const result = await refreshServerSession({ ...context, token: await readServerToken() });
    const after = await serverSessionStatus(context);
    console.log(JSON.stringify({
      command,
      ...result,
      expiresAtMs: after.expiresAtMs,
      remainingMs: after.remainingMs,
      dueForRefresh: after.dueForRefresh,
      skewMs: after.skewMs,
    }, null, 2));
    if (!result.refreshed) process.exitCode = 1;
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
