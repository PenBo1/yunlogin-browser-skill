#!/usr/bin/env node
// Explicit environment -> web Workbench login bootstrap. Credential values
// never enter argv, generated source/config, stdout, or native session caches.
import { chmod, lstat, mkdir, open, readFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { CdpClient } from "./yunlogin-cdp.mjs";
import { discoverPorts } from "./yunlogin-ports.mjs";
import { macListeners, macProcessArguments } from "./lib/macos-client.mjs";
import { jwtExpiryMs } from "./lib/local-token-store.mjs";
import { sessionPath } from "./lib/workbench-cache.mjs";
import { MANAGEMENT_ORIGIN } from "./yunlogin-workbench-web.mjs";

const KEYS = ["Authorization", "userinfo", "CompanyInfo"];
export const webSessionPath = () => path.join(path.dirname(sessionPath()), "web-workbench-session.json");

function fail(code) { throw Object.assign(new Error(code), { reasonCode: code }); }
function originOf(value) { try { return new URL(value).origin; } catch { return null; } }
function authValue(raw) {
  if (typeof raw !== "string" || !raw.trim()) fail("source-token-missing");
  let value = raw.trim();
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "string") value = parsed;
    else if (parsed && typeof parsed.value === "string") {
      if (Number(parsed.expire) > 0 && Number(parsed.expire) * 1000 <= Date.now()) fail("source-token-expired");
      value = parsed.value;
    }
  } catch (error) { if (error.reasonCode) throw error; }
  value = value.trim();
  if (!value || /[\r\n]/.test(value) || value.startsWith("{")) fail("source-token-invalid");
  const exp = jwtExpiryMs(value.replace(/^Bearer\s+/i, ""));
  if (exp != null && exp <= Date.now()) fail("source-token-expired");
  return { authorization: value, expiresAtMs: exp ?? null };
}

export async function validateLogin(rawAuthorization, { fetcher = fetch } = {}) {
  const { authorization, expiresAtMs } = authValue(rawAuthorization);
  const read = async route => {
    const response = await fetcher(MANAGEMENT_ORIGIN + route, { method: "POST", headers: {
      authorization, accept: "application/json, text/plain, */*", "content-type": "application/json", lang: "zh",
    }, body: "{}", redirect: "error", signal: AbortSignal.timeout(10000) });
    const payload = await response.json().catch(() => null);
    if (response.status !== 200 || payload?.code !== 200 || !payload?.data) fail("management-token-rejected");
    return payload.data;
  };
  const user = await read("/v2/sso/auth/myUserinfo");
  const company = await read("/v2/team/curCompanyInfo");
  if (typeof user.userId !== "string" || !user.userId || typeof company.companyId !== "string" || !company.companyId) fail("management-identity-incomplete");
  return { user, company, expiresAtMs };
}

function scrubProfile(value) {
  if (Array.isArray(value)) return value.map(scrubProfile);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !/password|passwd|secret|token|cookie|authorization/i.test(key)).map(([key, item]) => [key, scrubProfile(item)]));
}

export function loginStorage(rawAuthorization, identity) {
  const auth = authValue(rawAuthorization);
  // Current page reads Authorization through {value,expire}, but parses user
  // and company objects directly. Normalize only in the destination.
  let wrapped;
  try { const parsed = JSON.parse(rawAuthorization); if (typeof parsed?.value === "string") wrapped = rawAuthorization; } catch {}
  return {
    Authorization: wrapped ?? JSON.stringify({ value: auth.authorization, expire: auth.expiresAtMs ? Math.floor(auth.expiresAtMs / 1000) : -1 }),
    userinfo: JSON.stringify(scrubProfile(identity.user)),
    CompanyInfo: JSON.stringify({ ...scrubProfile(identity.company), companyName: identity.company.name ?? identity.company.companyName ?? "",
      status: identity.company.status === 2 ? 3 : identity.company.status }),
  };
}

export async function writeWebSession(session, file = webSessionPath(), { recheck } = {}) {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${randomUUID()}.tmp`;
  let handle;
  try {
    handle = await open(temporary, "wx", 0o600);
    await handle.writeFile(JSON.stringify(session));
    await handle.sync();
    await handle.close(); handle = null;
    if (recheck) await recheck();
    await rename(temporary, file);
    await chmod(file, 0o600);
  } finally { if (handle) await handle.close(); await rm(temporary, { force: true }); }
}

export async function readWebSession(file = webSessionPath()) {
  try {
    const stat = await lstat(file);
    if (!stat.isFile() || (stat.mode & 0o077) || (typeof process.getuid === "function" && stat.uid !== process.getuid())) fail("cache-permissions-invalid");
    const session = JSON.parse(await readFile(file, "utf8"));
    if (session.status !== "valid" || session.mode !== "environment-web-workbench" || !session.source?.accountId || !session.storage?.Authorization) fail("cache-invalid");
    return session;
  } catch (error) { if (error.reasonCode) throw error; fail("cache-missing-or-invalid"); }
}

export function parseCdp(value) {
  let url;
  try { url = new URL(value); } catch { fail("invalid-cdp-url"); }
  if (url.hostname !== "127.0.0.1" || !url.port || url.username || url.password || url.search || url.hash ||
      !["http:", "ws:"].includes(url.protocol) || (url.protocol === "http:" ? url.pathname !== "/" : !url.pathname.startsWith("/devtools/browser/"))) fail("invalid-cdp-url");
  return url;
}

async function ownedBrowser(url, { accountId, targetProfile } = {}) {
  // macOS bootstrap path only; do not infer Chrome ownership from a successful
  // HTTP endpoint. Windows native Workbench keeps its existing session flow.
  if (process.platform !== "darwin") fail("environment-bootstrap-platform-unverified");
  const listeners = (await macListeners({ port: Number(url.port) })).filter(item => item.address === "127.0.0.1" || item.address === "::1");
  const pids = [...new Set(listeners.map(item => item.pid))];
  if (pids.length !== 1) fail("cdp-listener-owner-ambiguous");
  const captured = await macProcessArguments(pids[0]);
  if (accountId && !captured.argv.includes(`--browser-id=Shop-${accountId}`)) fail("source-environment-owner-mismatch");
  if (targetProfile && !captured.argv.includes(`--user-data-dir=${path.resolve(targetProfile)}`)) fail("target-profile-owner-mismatch");
  return { pid: pids[0], startedAt: captured.creationDate };
}

export async function connectBrowser(endpoint, identity) {
  const url = parseCdp(endpoint);
  const owner = await ownedBrowser(url, identity);
  let socket = url.href;
  if (url.protocol === "http:") {
    const response = await fetch(url.origin + "/json/version", { redirect: "error", signal: AbortSignal.timeout(5000) });
    const payload = await response.json();
    const discovered = parseCdp(payload.webSocketDebuggerUrl);
    if (discovered.port !== url.port || discovered.protocol !== "ws:") fail("cdp-discovery-mismatch");
    socket = discovered.href;
  }
  const client = new CdpClient(socket, 10000);
  try { await client.connect(); await client.send("Browser.getVersion"); }
  catch { client.close(); fail("cdp-connection-failed"); }
  const recheck = async () => {
    const after = await ownedBrowser(url, identity);
    if (after.pid !== owner.pid || after.startedAt !== owner.startedAt) fail("cdp-owner-changed");
  };
  return { client, owner, recheck, close: () => client.close() };
}

async function evaluate(connection, target, expression) {
  const { sessionId } = await connection.client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
  try {
    const result = await connection.client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sessionId);
    if (result.exceptionDetails || !result.result || !Object.hasOwn(result.result, "value")) fail("storage-access-failed");
    return result.result.value;
  } finally { await connection.client.send("Target.detachFromTarget", { sessionId }).catch(() => {}); }
}

export async function selectTargets(source, destination, extensionId, targetId) {
  if (!/^[a-p]{32}$/.test(extensionId ?? "")) fail("source-extension-id-required");
  const origin = `chrome-extension://${extensionId}`;
  const sourceTargets = (await source.client.send("Target.getTargets")).targetInfos.filter(item => item.type === "page" && item.url.startsWith(origin + "/"));
  if (sourceTargets.length !== 1) fail("source-extension-target-ambiguous");
  const pages = (await destination.client.send("Target.getTargets")).targetInfos.filter(item => item.type === "page" && originOf(item.url) === MANAGEMENT_ORIGIN && (!targetId || item.targetId === targetId));
  if (pages.length !== 1) fail("target-management-page-ambiguous");
  return { sourceTarget: sourceTargets[0], target: pages[0], extensionOrigin: origin };
}

async function readSource(source, target, extensionOrigin) {
  return evaluate(source, target, `(() => { if (location.protocol + "//" + location.host !== ${JSON.stringify(extensionOrigin)}) return null; return localStorage.getItem("Authorization"); })()`);
}

export async function environmentSession(accountId, { startEnvironment = false, headless = "0" } = {}) {
  if (!/^[A-Za-z0-9_-]+$/.test(accountId ?? "")) fail("account-id-required");
  const snapshot = await discoverPorts();
  if (snapshot.localApiOrigins.length !== 1) fail("local-api-ambiguous-or-unavailable");
  const origin = snapshot.localApiOrigins[0];
  const response = await fetch(`${origin}/api/v2/browser/status?account_id=${encodeURIComponent(accountId)}`, { redirect: "error", signal: AbortSignal.timeout(10000) });
  const status = await response.json();
  if (!response.ok || status.code !== 0) fail("environment-status-failed");
  if (status.data?.status === "Active" && status.data?.ws?.puppeteer) return { cdp: status.data.ws.puppeteer, started: false };
  if (!startEnvironment) fail("source-environment-not-running");
  const started = await fetch(origin + "/api/v2/browser/start", { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ account_id: accountId, headless }), redirect: "error", signal: AbortSignal.timeout(45000) });
  const payload = await started.json();
  if (!started.ok || payload.code !== 0 || !payload.data?.ws?.puppeteer) fail("environment-start-failed");
  return { cdp: payload.data.ws.puppeteer, started: true };
}

export async function injectStorage(destination, target, storage) {
  return evaluate(destination, target, `(() => { if(location.origin !== ${JSON.stringify(MANAGEMENT_ORIGIN)}) return false;
    const values=${JSON.stringify(storage)};for(const key of ["Authorization","userinfo","CompanyInfo"])localStorage.setItem(key,values[key]);
    return ["Authorization","userinfo","CompanyInfo"].every(key=>localStorage.getItem(key)===values[key]); })()`);
}

export async function bootstrapLogin(options, deps = {}) {
  const { accountId, extensionId, targetCdp, targetProfile, targetId, fromCache = false, confirmTransfer = false, dryRun = false } = options;
  if (!targetProfile || !path.isAbsolute(targetProfile)) fail("target-profile-required");
  parseCdp(targetCdp);
  const publicPlan = { mode: "environment-web-workbench", source: fromCache ? "verified-web-session-cache" : "selected-environment-localStorage",
    authenticationTransferred: false, cacheUpdated: false, keys: KEYS, cachePath: webSessionPath(),
    needsConfirmation: !confirmTransfer && !dryRun, dryRun };
  if (dryRun || !confirmTransfer) return { ...publicPlan, wouldStartEnvironment: !fromCache && !!options.startEnvironment,
    wouldRead: fromCache ? "private web Workbench session cache; revalidate management identity" : "selected environment extension localStorage.Authorization; read management user/company",
    wouldWrite: "private web session cache and selected management page localStorage; no native cache changes" };
  const connect = deps.connect ?? connectBrowser, validate = deps.validate ?? validateLogin;
  let source, destination;
  let cacheUpdated = false;
  try {
    let session, captureAgain, selectedTargetId = targetId;
    if (fromCache) {
      session = await (deps.readCache ?? readWebSession)();
      const identity = await validate(session.storage.Authorization);
      if (identity.user.userId !== session.userId || identity.company.companyId !== session.companyId) fail("cache-identity-mismatch");
      session = { ...session, storage: loginStorage(session.storage.Authorization, identity), validatedAt: new Date().toISOString() };
    } else {
      const env = await (deps.environment ?? environmentSession)(accountId, { startEnvironment: options.startEnvironment, headless: options.headless ?? "0" });
      source = await connect(env.cdp, { accountId });
      destination = await connect(targetCdp, { targetProfile });
      if (source.owner.pid === destination.owner.pid) fail("source-target-must-differ");
      const selected = await (deps.select ?? selectTargets)(source, destination, extensionId, targetId);
      selectedTargetId = selected.target.targetId;
      const raw = await (deps.readSource ?? readSource)(source, selected.sourceTarget, selected.extensionOrigin);
      const identity = await validate(raw);
      captureAgain = async () => {
        await source.recheck();
        if (raw !== await (deps.readSource ?? readSource)(source, selected.sourceTarget, selected.extensionOrigin)) fail("source-session-changed");
      };
      await captureAgain();
      session = { mode: "environment-web-workbench", status: "valid", storage: loginStorage(raw, identity),
        userId: identity.user.userId, companyId: identity.company.companyId, expiresAtMs: identity.expiresAtMs,
        source: { accountId, extensionId, pid: source.owner.pid, startedAt: source.owner.startedAt }, validatedAt: new Date().toISOString() };
    }
    destination ??= await connect(targetCdp, { targetProfile });
    const targets = (await destination.client.send("Target.getTargets")).targetInfos.filter(item => item.type === "page" && originOf(item.url) === MANAGEMENT_ORIGIN && (!selectedTargetId || item.targetId === selectedTargetId));
    if (targets.length !== 1) fail("target-management-page-ambiguous");
    selectedTargetId = targets[0].targetId;
    await destination.recheck();
    if (captureAgain) await captureAgain();
    const identity = await validate(session.storage.Authorization);
    if (identity.user.userId !== session.userId || identity.company.companyId !== session.companyId) fail("source-identity-changed");
    // Cache only after server validation and source consistency checks. A later
    // page error is reported separately; this remains a usable validated cache.
    if (captureAgain) await captureAgain();
    const recheck = async () => {
      if (captureAgain) await captureAgain();
      await destination.recheck();
      const current = (await destination.client.send("Target.getTargets")).targetInfos.find(item => item.targetId === selectedTargetId);
      if (!current || current.type !== "page" || originOf(current.url) !== MANAGEMENT_ORIGIN) fail("target-management-page-changed");
    };
    await (deps.writeCache ?? ((value, checks) => writeWebSession(value, webSessionPath(), checks)))(session, { recheck });
    cacheUpdated = true;
    await destination.recheck();
    const injected = await (deps.inject ?? injectStorage)(destination, targets[0], session.storage);
    if (!injected) fail("target-storage-injection-failed");
    return { ...publicPlan, needsConfirmation: false, dryRun: false, authenticationTransferred: true, cacheUpdated: true,
      identityVerified: true, sourceUnchanged: fromCache ? null : true, cacheIdentityMatches: true, sourceEnvironmentLeftRunning: !fromCache,
      next: "Reload only the selected web Workbench page, then verify logged-in UI, current user/company and bridge readiness. Token injection is not proof of page readiness." };
  } catch (error) {
    error.cacheUpdated = cacheUpdated;
    throw error;
  } finally { source?.close(); destination?.close(); }
}

async function main(args) {
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node scripts/yunlogin-workbench-web-login.mjs --account-id ID --extension-id ID --target-cdp http://127.0.0.1:PORT --target-profile ABSOLUTE_PATH [--target-id ID] [--start-environment] [--headless 0|1] [--confirm-transfer] [--dry-run]\nUse --from-cache instead of --account-id/--extension-id to revalidate and inject the private web session. Dry-run reads no credentials, sends no requests and writes nothing. Live transfer reads the selected environment's Authorization in memory, validates management identity, caches privately and injects only the selected target. Does not change native Workbench cache or refresh tokens."); return;
  }
  const opts = {};
  const values = { "--account-id": "accountId", "--extension-id": "extensionId", "--target-cdp": "targetCdp", "--target-profile": "targetProfile", "--target-id": "targetId", "--headless": "headless" };
  for (let i = 0; i < args.length; i++) {
    if (values[args[i]]) { const key = values[args[i]], value = args[++i]; if (!value || value.startsWith("--")) fail("option-value-required"); opts[key] = value; }
    else if (args[i] === "--start-environment") opts.startEnvironment = true;
    else if (args[i] === "--from-cache") opts.fromCache = true;
    else if (args[i] === "--confirm-transfer") opts.confirmTransfer = true;
    else if (args[i] === "--dry-run") opts.dryRun = true;
    else fail("unknown-option");
  }
  if (!opts.fromCache && (!opts.accountId || !/^[a-p]{32}$/.test(opts.extensionId ?? ""))) fail("account-and-extension-required");
  if (opts.fromCache && (opts.accountId || opts.extensionId || opts.startEnvironment)) fail("source-options-conflict");
  if (opts.headless && !["0", "1"].includes(opts.headless)) fail("headless-invalid");
  const result = await bootstrapLogin(opts);
  console.log(JSON.stringify(result, null, 2));
  if (result.needsConfirmation) process.exitCode = 2;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => {
    console.error(JSON.stringify({ mode: "environment-web-workbench", authenticationTransferred: false, cacheUpdated: error.cacheUpdated ?? false, reasonCode: error.reasonCode ?? "bootstrap-failed",
      action: "Check the selected environment/CDP, user/company and target profile. No credential values are printed. Expired/rejected sessions require recapture or sign-in; do not repeat launches automatically." }));
    process.exitCode = 1;
  });
}
