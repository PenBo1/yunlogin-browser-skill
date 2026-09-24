#!/usr/bin/env node

/**
 * Launch a YunLogin local browser environment or connect to a CDP endpoint.
 *
 * This helper uses the Node global WebSocket client and has no npm
 * dependencies. It supports local launch, external CDP URL input, basic
 * target discovery, page creation, and JavaScript evaluation.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readLocalToken, resolveLocalTokenFilePath, writeLocalToken } from "./lib/local-token-store.mjs";

const DEFAULT_TIMEOUT_MS = 30000;
const FORBIDDEN_APPEND_FLAGS = [
  "--user-data-dir",
  "--profile-directory",
  "--remote-debugging-port",
  "--remote-debugging-address",
];
const RISKY_APPEND_FLAGS = [
  "--no-sandbox",
  "--proxy-server",
  "--proxy-bypass-list",
  "--disable-web-security",
  "--ignore-certificate-errors",
  "--disable-features=IsolateOrigins",
  "--disable-features=SitePerProcess",
  "--disable-blink-features=AutomationControlled",
  "--remote-allow-origins",
  "--unsafely-treat-insecure-origin-as-secure",
];

function usage() {
  console.error(`Usage:
  node scripts/yunlogin-cdp.mjs start --account-id ID [options]
  node scripts/yunlogin-cdp.mjs check --cdp-url URL [options]
  node scripts/yunlogin-cdp.mjs targets --session-file FILE [options]
  node scripts/yunlogin-cdp.mjs open --cdp-url URL --url https://example.com [options]
  node scripts/yunlogin-cdp.mjs eval --session-file FILE --expression "document.title" [options]
  node scripts/yunlogin-cdp.mjs storage-get --cdp-url URL --origin ORIGIN --key KEY [options]
  node scripts/yunlogin-cdp.mjs capture-local-token --account-id ID [options]

Commands:
  start    Start a local YunLogin environment and print its CDP WebSocket URL.
  check    Connect to CDP and call Browser.getVersion.
  targets  List CDP targets (pages, service workers, and other target types).
  open     Create a new page target and navigate it to a URL.
  eval     Evaluate JavaScript in a page target.
  storage-get  Read a localStorage value through the CDP DOMStorage domain.
  capture-local-token  Launch headless YunLogin and cache its local Authorization token.

Options:
  --account-id ID       YunLogin environment ID for start.
  --append-cmd CMD      Chrome command-line argument string for start (repeatable).
  --headless 0|1        Start the local environment headless (default: 0).
  --output FILE         Save the full local start response to FILE.
  --cdp-url URL         CDP WebSocket URL or HTTP debugging endpoint.
  --session-file FILE   Read a saved start response or session object.
  --target-id ID        CDP target ID for eval (default: first page target).
  --url URL             URL to open for the open command.
  --expression JS       JavaScript expression for eval.
  --origin ORIGIN        Storage security origin for storage-get.
  --key KEY              Storage key for storage-get or capture-local-token.
  --extension-id ID      Chromium extension ID for capture-local-token (default: bundled YunLogin extension).
  --show-sensitive       Print the raw storage value instead of a redacted summary.
  --cache-file FILE      Local token cache path for capture-local-token.
  --keep-open            Leave the capture environment running.
  --timeout-ms MS       WebSocket request timeout (default: 30000).
  --allow-risky-cmd     Allow documented high-risk append_cmd flags.
  --dry-run             Print the local start request without sending it.
  -h, --help            Show this help.

Examples:
  node scripts/yunlogin-cdp.mjs start --account-id <account-id> --dry-run
  node scripts/yunlogin-cdp.mjs start --account-id <account-id> --append-cmd "--disable-popup-blocking"
  node scripts/yunlogin-cdp.mjs check --cdp-url ws://127.0.0.1:9222/devtools/browser/<id>
  node scripts/yunlogin-cdp.mjs targets --session-file session.json
  node scripts/yunlogin-cdp.mjs open --session-file session.json --url https://example.com
  node scripts/yunlogin-cdp.mjs eval --session-file session.json --expression "document.title"`);
}

function takeValue(args, index, option) {
  const value = args[index + 1];
  if (value === undefined || value.startsWith("--")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function takeRawValue(args, index, option) {
  const value = args[index + 1];
  if (value === undefined) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function parseArguments(argv) {
  const args = [...argv];
  if (args.includes("--help") || args.includes("-h")) {
    usage();
    process.exit(0);
  }
  const command = args.shift();
  if (!command || command.startsWith("--")) {
    usage();
    throw new Error("COMMAND is required");
  }
  const options = {
    appendCmds: [],
    dryRun: false,
    allowRiskyCmd: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--account-id") {
      options.accountId = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--append-cmd") {
      options.appendCmds.push(takeRawValue(args, index, argument));
      index += 1;
    } else if (argument === "--headless") {
      options.headless = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--output") {
      options.output = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--cdp-url") {
      options.cdpUrl = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--session-file") {
      options.sessionFile = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--target-id") {
      options.targetId = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--url") {
      options.url = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--expression") {
      options.expression = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--origin") {
      options.origin = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--key") {
      options.key = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--extension-id") {
      options.extensionId = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--show-sensitive") {
      options.showSensitive = true;
    } else if (argument === "--cache-file") {
      options.cacheFile = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--keep-open") {
      options.keepOpen = true;
    } else if (argument === "--timeout-ms") {
      options.timeoutMs = Number.parseInt(takeValue(args, index, argument), 10);
      index += 1;
    } else if (argument === "--allow-risky-cmd") {
      options.allowRiskyCmd = true;
    } else if (argument === "--dry-run") {
      options.dryRun = true;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }
  return { command, options };
}

function normalizeLocalOrigin() {
  const configured = process.env.YUNLOGIN_LOCAL_BASE_URL ?? process.env.YUNLOGIN_BASE_URL ?? "http://localhost:50213";
  let parsed;
  try {
    parsed = new URL(configured);
  } catch {
    throw new Error("YUNLOGIN_LOCAL_BASE_URL must be a valid origin");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("YUNLOGIN_LOCAL_BASE_URL must use http or https");
  }
  if (!["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname)) {
    throw new Error("Local browser launch only permits loopback origins");
  }
  if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("YUNLOGIN_LOCAL_BASE_URL must contain an origin only");
  }
  return parsed.origin;
}

function normalizeHeadless(value) {
  if (value === undefined || value === "" || value === "0" || value === "false") return "0";
  if (value === "1" || value === "true") return "1";
  throw new Error("--headless must be 0 or 1");
}

function containsFlag(command, flag) {
  const escaped = flag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s)${escaped}(?:=|,|\\s|$)`).test(command);
}

function validateAppendCmd(appendCmd, allowRiskyCmd) {
  for (const flag of FORBIDDEN_APPEND_FLAGS) {
    if (containsFlag(appendCmd, flag)) {
      throw new Error(`append_cmd must not set environment-managed flag: ${flag}`);
    }
  }
  const risky = RISKY_APPEND_FLAGS.find((flag) => containsFlag(appendCmd, flag));
  if (risky && !allowRiskyCmd) {
    throw new Error(`append_cmd contains a risky flag (${risky}); pass --allow-risky-cmd to confirm`);
  }
}
export async function launchEnvironment(options) {
  if (!options.accountId) throw new Error("--account-id is required for start");
  const headless = normalizeHeadless(options.headless);
  const appendCmd = (options.appendCmds ?? []).join(" ").trim();
  if (appendCmd) validateAppendCmd(appendCmd, options.allowRiskyCmd);
  const origin = normalizeLocalOrigin();
  const url = new URL("/api/v2/browser/start", origin);
  const body = { account_id: options.accountId, headless };
  if (appendCmd) body.append_cmd = appendCmd;

  if (options.dryRun) {
    if (!options.quiet) console.log(JSON.stringify({ command: "start", method: "POST", url: url.href, body }, null, 2));
    return { dryRun: true, url: url.href, body };
  }

  const headers = { accept: "application/json", "content-type": "application/json" };
  const localToken = await readLocalToken();
  if (localToken) headers.authorization = `Bearer ${localToken}`;
  if (process.env.YUNLOGIN_LOCAL_COOKIE) headers.cookie = process.env.YUNLOGIN_LOCAL_COOKIE;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(Number(process.env.YUNLOGIN_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS)),
  });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Local launch returned non-JSON response: HTTP ${response.status} ${text}`);
  }
  if (!response.ok || payload.code !== 0) {
    throw new Error(`Local launch failed: HTTP ${response.status}, code=${payload.code}, msg=${payload.msg ?? ""}`);
  }
  const cdpUrl = payload?.data?.ws?.puppeteer;
  if (!cdpUrl) throw new Error("Local launch response did not include data.ws.puppeteer");
  if (options.output) await writeFile(options.output, JSON.stringify(payload, null, 2), "utf8");
  if (!options.quiet) console.log(JSON.stringify({
    command: "start",
    account_id: options.accountId,
    code: payload.code,
    msg: payload.msg,
    cdpUrl,
    selenium: payload?.data?.ws?.selenium,
    debuggingPort: payload?.data?.debuggingPort,
    webdriver: payload?.data?.webdriver,
    sessionFile: options.output,
  }, null, 2));
  return { payload, cdpUrl, url: url.href, body };
}

function cdpUrlFromSession(session) {
  return session?.cdpUrl ?? session?.data?.ws?.puppeteer ?? session?.ws?.puppeteer;
}

async function resolveCdpUrl(options) {
  if (options.cdpUrl) return normalizeCdpUrl(options.cdpUrl);
  if (options.sessionFile) {
    let session;
    try {
      session = JSON.parse(await readFile(options.sessionFile, "utf8"));
    } catch (error) {
      throw new Error(`Unable to read --session-file: ${error.message}`);
    }
    const cdpUrl = cdpUrlFromSession(session);
    if (!cdpUrl) throw new Error("Session file does not contain a CDP WebSocket URL");
    return normalizeCdpUrl(cdpUrl);
  }
  throw new Error("Provide --cdp-url or --session-file");
}

async function normalizeCdpUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("--cdp-url must be a valid ws, wss, http, or https URL");
  }
  if (parsed.protocol === "ws:" || parsed.protocol === "wss:") return parsed.href;
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("--cdp-url must use ws, wss, http, or https");
  }
  const versionUrl = new URL("/json/version", parsed.origin);
  const response = await fetch(versionUrl, { signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`Unable to discover CDP WebSocket URL: HTTP ${response.status}`);
  const payload = await response.json();
  if (!payload.webSocketDebuggerUrl) throw new Error("CDP /json/version did not include webSocketDebuggerUrl");
  return payload.webSocketDebuggerUrl;
}

class CdpClient {
  constructor(url, timeoutMs) {
    this.url = url;
    this.timeoutMs = timeoutMs;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    if (typeof WebSocket !== "function") throw new Error("This Node.js runtime does not provide global WebSocket");
    this.socket = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("CDP WebSocket connection timed out")), this.timeoutMs);
      this.socket.addEventListener("open", () => { clearTimeout(timer); resolve(); }, { once: true });
      this.socket.addEventListener("error", (event) => { clearTimeout(timer); reject(new Error(`CDP WebSocket error: ${event.message ?? "unknown error"}`)); }, { once: true });
    });
    this.socket.addEventListener("message", (event) => this.handleMessage(event.data));
  }

  handleMessage(data) {
    let message;
    try {
      message = JSON.parse(typeof data === "string" ? data : data.toString());
    } catch {
      return;
    }
    if (message.id === undefined) return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    clearTimeout(pending.timer);
    if (message.error) pending.reject(new Error(`${message.error.code}: ${message.error.message}`));
    else pending.resolve(message.result);
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP request timed out: ${method}`));
      }, this.timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.socket.send(JSON.stringify(message));
    });
  }

  close() {
    if (this.socket) this.socket.close();
  }
}
function normalizeTimeout(value) {
  const timeout = value ?? Number.parseInt(process.env.YUNLOGIN_CDP_TIMEOUT_MS ?? String(DEFAULT_TIMEOUT_MS), 10);
  if (!Number.isInteger(timeout) || timeout <= 0) throw new Error("--timeout-ms must be a positive integer");
  return timeout;
}

async function withCdp(options, callback, dryRunPayload = {}) {
  const cdpUrl = await resolveCdpUrl(options);
  if (options.dryRun) {
    console.log(JSON.stringify({ ...dryRunPayload, cdpUrl }, null, 2));
    return;
  }
  const client = new CdpClient(cdpUrl, normalizeTimeout(options.timeoutMs));
  try {
    await client.connect();
    return await callback(client);
  } finally {
    client.close();
  }
}

async function runCheck(options) {
  await withCdp(options, async (client) => {
    const version = await client.send("Browser.getVersion");
    console.log(JSON.stringify({ command: "check", cdpUrl: client.url, version }, null, 2));
  }, { command: "check" });
}

async function runTargets(options) {
  await withCdp(options, async (client) => {
    const result = await client.send("Target.getTargets");
    const targets = (result.targetInfos ?? []).map((target) => ({
      targetId: target.targetId,
      type: target.type,
      title: target.title,
      url: target.url,
      attached: target.attached,
      browserContextId: target.browserContextId,
    }));
    console.log(JSON.stringify({ command: "targets", cdpUrl: client.url, targets }, null, 2));
  }, { command: "targets" });
}

async function runOpen(options) {
  if (!options.url) throw new Error("--url is required for open");
  await withCdp(options, async (client) => {
    const result = await client.send("Target.createTarget", { url: options.url });
    console.log(JSON.stringify({ command: "open", cdpUrl: client.url, targetId: result.targetId, url: options.url }, null, 2));
  }, { command: "open", url: options.url });
}

async function runEval(options) {
  if (!options.expression) throw new Error("--expression is required for eval");
  await withCdp(options, async (client) => {
    const targetResult = await client.send("Target.getTargets");
    const pages = (targetResult.targetInfos ?? []).filter((target) => target.type === "page");
    const target = options.targetId ? pages.find((item) => item.targetId === options.targetId) : pages[0];
    if (!target) throw new Error("No matching page target found for eval");
    const attached = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
    try {
      const result = await client.send(
        "Runtime.evaluate",
        { expression: options.expression, returnByValue: true, awaitPromise: true },
        attached.sessionId,
      );
      console.log(JSON.stringify({ command: "eval", cdpUrl: client.url, targetId: target.targetId, result }, null, 2));
    } finally {
      await client.send("Target.detachFromTarget", { sessionId: attached.sessionId });
    }
  }, { command: "eval", targetId: options.targetId, expression: options.expression });
}

async function runStorageGet(options) {
  if (!options.origin) throw new Error("--origin is required for storage-get");
  if (!options.key) throw new Error("--key is required for storage-get");
  await withCdp(options, async (client) => {
    const targets = await client.send("Target.getTargets");
    const pages = (targets.targetInfos ?? []).filter((target) => target.type === "page");
    const target = options.targetId
      ? pages.find((item) => item.targetId === options.targetId)
      : pages.find((item) => item.url.startsWith(`${options.origin}/`)) ?? pages[0];
    if (!target) throw new Error("No page target is available for storage-get");
    const attached = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
    try {
      const result = await client.send(
        "DOMStorage.getDOMStorageItems",
        { storageId: { securityOrigin: options.origin, isLocalStorage: true } },
        attached.sessionId,
      );
      const entry = (result.entries ?? []).find(([key]) => key === options.key);
      const value = entry ? entry[1] : null;
      console.log(JSON.stringify({
        command: "storage-get",
        targetId: target.targetId,
        origin: options.origin,
        key: options.key,
        found: Boolean(entry),
        valueLength: value ? value.length : 0,
        value: options.showSensitive ? value : entry ? "[REDACTED]" : null,
      }, null, 2));
    } finally {
      await client.send("Target.detachFromTarget", { sessionId: attached.sessionId });
    }
  }, { command: "storage-get", origin: options.origin, key: options.key });
}

const DEFAULT_EXTENSION_ID = "acggapndphpdolhlmjiodihbefeabekc";
const DEFAULT_TOKEN_STORAGE_KEY = "Authorization";
const EXTENSION_PAGE_PATH = "/fingerprint.html";
const TOKEN_VERIFY_PATH = "/api/v2/userapi/user/shopseriallist";

function resolveExtensionId(options) {
  const configured = String(
    options.extensionId ?? process.env.YUNLOGIN_EXTENSION_ID ?? DEFAULT_EXTENSION_ID,
  ).trim();
  const match = configured.match(/([a-p]{32})(?:\/)?$/i);
  if (!match) {
    throw new Error("--extension-id must be a 32-character Chromium extension ID");
  }
  return match[1].toLowerCase();
}

function extensionOriginFor(extensionId) {
  return `chrome-extension://${extensionId}`;
}

function extensionPageUrlFor(extensionId) {
  return `${extensionOriginFor(extensionId)}${EXTENSION_PAGE_PATH}`;
}

async function localRequest(origin, requestPath, options = {}) {
  const headers = { accept: "application/json" };
  if (options.body !== undefined) headers["content-type"] = "application/json";
  if (options.token) headers.authorization = `Bearer ${options.token}`;
  if (process.env.YUNLOGIN_LOCAL_COOKIE) headers.cookie = process.env.YUNLOGIN_LOCAL_COOKIE;
  const url = new URL(requestPath, `${origin}/`);
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(
      options.timeoutMs ?? Number(process.env.YUNLOGIN_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS),
    ),
  });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = undefined;
  }
  return { status: response.status, ok: response.ok, payload, text };
}

// Control calls (status, start, stop) also work anonymously on a fresh
// install. A stale cached token must not block bootstrap, so a rejected
// credential is retried once without the Authorization header.
async function controlRequest(origin, requestPath, options = {}) {
  const token = await readLocalToken();
  const authenticated = await localRequest(origin, requestPath, { ...options, token });
  if (authenticated.ok) return authenticated;
  if (token && (authenticated.status === 401 || authenticated.status === 403)) {
    return localRequest(origin, requestPath, { ...options, token: undefined });
  }
  return authenticated;
}

async function readExtensionStorageValue(client, extensionOrigin, key, sessionId) {
  try {
    await client.send("DOMStorage.enable", {}, sessionId);
  } catch {
    // DOMStorage.enable is optional and unsupported on some kernels.
  }
  const result = await client.send(
    "DOMStorage.getDOMStorageItems",
    { storageId: { securityOrigin: extensionOrigin, isLocalStorage: true } },
    sessionId,
  );
  const entry = (result.entries ?? []).find(([entryKey]) => entryKey === key);
  return entry ? entry[1] : undefined;
}

async function readExtensionTokenFromTargets(client, extensionOrigin, key) {
  const targets = await client.send("Target.getTargets");
  const targetInfos = targets.targetInfos ?? [];
  const extensionTargets = targetInfos.filter((target) =>
    typeof target.url === "string" && target.url.startsWith(extensionOrigin),
  );
  const fallbackTargets = targetInfos.filter(
    (target) =>
      target.type === "page" &&
      !(typeof target.url === "string" && target.url.startsWith(extensionOrigin)),
  );
  for (const target of [...extensionTargets, ...fallbackTargets]) {
    let sessionId;
    try {
      const attached = await client.send("Target.attachToTarget", {
        targetId: target.targetId,
        flatten: true,
      });
      sessionId = attached.sessionId;
    } catch {
      continue;
    }
    try {
      const value = await readExtensionStorageValue(client, extensionOrigin, key, sessionId);
      if (value) return { value, targetId: target.targetId, targetUrl: target.url, via: "target-session" };
    } catch {
      // Try the next candidate target.
    } finally {
      try {
        await client.send("Target.detachFromTarget", { sessionId });
      } catch {
        // Detach failures are not fatal.
      }
    }
  }
  // Some kernels expose the extension origin only at browser scope.
  try {
    const value = await readExtensionStorageValue(client, extensionOrigin, key, undefined);
    if (value) return { value, via: "browser-session" };
  } catch {
    // Browser-scope reads are a best-effort fallback.
  }
  return undefined;
}

async function waitForExtensionToken(client, extensionOrigin, key, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let attempt = 0;
  for (;;) {
    attempt += 1;
    try {
      const found = await readExtensionTokenFromTargets(client, extensionOrigin, key);
      if (found?.value) return { ...found, attempts: attempt };
    } catch {
      // Retry until the extension is fully initialized.
    }
    if (Date.now() >= deadline) return { value: undefined, attempts: attempt };
    await new Promise((resolve) => setTimeout(resolve, Math.min(500 + attempt * 100, 2000)));
  }
}

function unwrapStoredToken(rawValue) {
  if (typeof rawValue !== "string") return undefined;
  let value = rawValue.trim();
  if (!value) return undefined;
  const looksStructured =
    (value.startsWith("{") && value.endsWith("}")) ||
    (value.startsWith('"') && value.endsWith('"'));
  if (looksStructured) {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "string") {
        value = parsed.trim();
      } else if (parsed && typeof parsed === "object") {
        for (const field of ["token", "accessToken", "access_token", "Authorization", "authorization"]) {
          if (typeof parsed[field] === "string" && parsed[field].trim()) {
            value = parsed[field].trim();
            break;
          }
        }
      }
    } catch {
      // Keep the raw value when it is not valid JSON.
    }
  }
  return value.replace(/^Bearer\s+/i, "").trim() || undefined;
}

async function verifyLocalToken(origin, token, timeoutMs) {
  const response = await localRequest(origin, TOKEN_VERIFY_PATH, {
    method: "POST",
    body: { groupId: "", accountName: "" },
    token,
    timeoutMs,
  });
  return {
    ok: response.ok && response.payload?.code === 0,
    status: response.status,
    code: response.payload?.code,
    msg: response.payload?.msg,
  };
}

export async function captureLocalToken(options) {
  if (!options.accountId) throw new Error("--account-id is required for capture-local-token");
  const extensionId = resolveExtensionId(options);
  const extensionOrigin = extensionOriginFor(extensionId);
  const extensionPageUrl = extensionPageUrlFor(extensionId);
  const storageKey = options.key ?? DEFAULT_TOKEN_STORAGE_KEY;
  const headless = options.headless === undefined ? "1" : normalizeHeadless(options.headless);
  const timeoutMs = normalizeTimeout(options.timeoutMs);
  const origin = normalizeLocalOrigin();
  const cacheFile = options.cacheFile
    ? path.resolve(options.cacheFile)
    : resolveLocalTokenFilePath();
  const appendCmd = (options.appendCmds ?? []).join(" ").trim();
  if (appendCmd) validateAppendCmd(appendCmd, options.allowRiskyCmd);

  if (options.dryRun) {
    const body = { account_id: options.accountId, headless };
    if (appendCmd) body.append_cmd = appendCmd;
    console.log(JSON.stringify({
      command: "capture-local-token",
      accountId: options.accountId,
      extensionOrigin,
      extensionPageUrl,
      storageKey,
      headless,
      cacheFile,
      statusUrl: new URL(
        `/api/v2/browser/status?account_id=${encodeURIComponent(options.accountId)}`,
        origin,
      ).href,
      startUrl: new URL("/api/v2/browser/start", origin).href,
      body,
    }, null, 2));
    return;
  }

  const statusPath = `/api/v2/browser/status?account_id=${encodeURIComponent(options.accountId)}`;
  const status = await controlRequest(origin, statusPath, { timeoutMs });
  const alreadyActive =
    status.payload?.code === 0 && status.payload?.data?.status === "Active";
  let cdpUrl = alreadyActive ? status.payload?.data?.ws?.puppeteer : undefined;
  let launched = false;

  if (!cdpUrl) {
    const body = { account_id: options.accountId, headless };
    if (appendCmd) body.append_cmd = appendCmd;
    const started = await controlRequest(origin, "/api/v2/browser/start", {
      method: "POST",
      body,
      timeoutMs,
    });
    if (started.payload?.code !== 0) {
      throw new Error(
        `Local launch failed: HTTP ${started.status}, code=${started.payload?.code}, msg=${started.payload?.msg ?? ""}`,
      );
    }
    cdpUrl = started.payload?.data?.ws?.puppeteer;
    if (!cdpUrl) throw new Error("Local launch response did not include data.ws.puppeteer");
    launched = true;
    if (options.output) {
      await writeFile(options.output, JSON.stringify(started.payload, null, 2), "utf8");
    }
  }

  // A reused environment belongs to the caller; never close it implicitly.
  const keepOpen = options.keepOpen === true || alreadyActive;
  const client = new CdpClient(cdpUrl, timeoutMs);
  let summary;
  try {
    await client.connect();
    try {
      await client.send("Target.createTarget", { url: extensionPageUrl });
    } catch {
      // Extension pages may be unreachable by navigation on some kernels.
    }
    const found = await waitForExtensionToken(client, extensionOrigin, storageKey, timeoutMs);
    const token = unwrapStoredToken(found.value);
    if (!token) {
      throw new Error(
        `Unable to read ${storageKey} from ${extensionOrigin} localStorage within ${timeoutMs} ms`,
      );
    }
    const verification = await verifyLocalToken(origin, token, timeoutMs);
    if (!verification.ok) {
      throw new Error(
        `Captured ${storageKey} was rejected by the local API (HTTP ${verification.status}, code=${verification.code}, msg=${verification.msg ?? ""})`,
      );
    }
    const storedPath = await writeLocalToken(token, cacheFile);
    summary = {
      command: "capture-local-token",
      accountId: options.accountId,
      cdpUrl,
      extensionOrigin,
      storageKey,
      cacheFile: storedPath,
      tokenLength: token.length,
      verified: true,
      verificationCode: verification.code,
      reusedActiveEnvironment: alreadyActive,
      environmentLeftRunning: keepOpen,
    };
  } finally {
    client.close();
    if (!keepOpen) {
      try {
        await controlRequest(
          origin,
          `/api/v2/browser/stop?account_id=${encodeURIComponent(options.accountId)}`,
          { timeoutMs },
        );
      } catch {
        // Cleanup is best effort; the launch itself is reported separately.
      }
    }
  }
  if (!options.quiet) console.log(JSON.stringify(summary, null, 2));
  return summary;
}

export async function stopEnvironment(accountId, options = {}) {
  const origin = normalizeLocalOrigin();
  const timeoutMs = options.timeoutMs ?? Number.parseInt(process.env.YUNLOGIN_TIMEOUT_MS ?? String(DEFAULT_TIMEOUT_MS), 10);
  const response = await controlRequest(
    origin,
    `/api/v2/browser/stop?account_id=${encodeURIComponent(accountId)}`,
    { timeoutMs },
  );
  return { ok: response.ok && response.payload?.code === 0, status: response.status, code: response.payload?.code, msg: response.payload?.msg };
}

async function main() {
  const { command, options } = parseArguments(process.argv.slice(2));
  if (command === "start") return launchEnvironment(options);
  if (command === "check") return runCheck(options);
  if (command === "targets") return runTargets(options);
  if (command === "open") return runOpen(options);
  if (command === "eval") return runEval(options);
  if (command === "storage-get") return runStorageGet(options);
  if (command === "capture-local-token") return captureLocalToken(options);
  throw new Error(`Unknown command: ${command}`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}