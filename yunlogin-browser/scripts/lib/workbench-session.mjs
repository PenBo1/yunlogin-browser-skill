import { CdpClient } from "../yunlogin-cdp.mjs";
import { discoverPorts } from "../yunlogin-ports.mjs";
import { ensureWorkbenchCdp, findWorkbench } from "./workbench-cdp.mjs";
import { clearPinnedWorkbenchSession, invalidateWorkbenchSession, pinWorkbenchSession, readWorkbenchSession, updateWorkbenchSession } from "./workbench-cache.mjs";
import { jwtExpiryMs } from "./local-token-store.mjs";

const MANAGEMENT_ORIGIN = "https://d126447d359e70c0.yunlogin.com";

function asIdentity(raw, name, idKey) {
  let value;
  try { value = JSON.parse(raw); } catch { throw new Error(`Workbench ${name} is missing or invalid.`); }
  if (typeof value?.[idKey] !== "string" || !value[idKey]) throw new Error(`Workbench ${name} lacks ${idKey}.`);
  return value;
}

export function parseWorkbenchValues({ management, source }) {
  const serverToken = typeof management?.Authorization === "string" ? management.Authorization.trim().replace(/^Bearer\s+/i, "") : "";
  if (!serverToken) throw new Error("Workbench management-center Authorization is absent; sign in in Workbench.");
  const user = asIdentity(management.userinfo, "userinfo", "userId");
  const company = asIdentity(management.CompanyInfo, "CompanyInfo", "companyId");
  return { status: "valid", serverToken, userId: user.userId, companyId: company.companyId,
    company: company.name ?? company.companyName ?? "", serverExpiresAtMs: jwtExpiryMs(serverToken) ?? null,
    source, capturedAt: new Date().toISOString() };
}

export async function captureWorkbenchValues({ cdp = ensureWorkbenchCdp, find = findWorkbench, Client = CdpClient } = {}) {
  const workbench = await find();
  if (!workbench) throw new Error("Workbench is not running. Start YunLogin first.");
  const connection = await cdp({ dryRun: true });
  if (!connection.ready || connection.pid !== workbench.pid) throw new Error("Workbench CDP is unavailable; enable its loopback CDP port first.");
  const client = new Client(connection.cdpUrl, 10000);
  try {
    await client.connect();
    const targets = (await client.send("Target.getTargets")).targetInfos ?? [];
    const pages = targets.filter(item => item.type === "page" && (() => { try { return new URL(item.url).origin === MANAGEMENT_ORIGIN; } catch { return false; } })());
    if (pages.length !== 1) throw new Error("Expected one management-center page in Workbench; select the active page.");
    const attached = await client.send("Target.attachToTarget", { targetId: pages[0].targetId, flatten: true });
    try {
      const expression = `(() => { if (location.origin !== ${JSON.stringify(MANAGEMENT_ORIGIN)}) return null; return Object.fromEntries(["Authorization", "userinfo", "CompanyInfo"].map(key => [key, localStorage.getItem(key)])); })()`;
      const result = await client.send("Runtime.evaluate", { expression, returnByValue: true }, attached.sessionId);
      if (result.exceptionDetails || !result.result?.value) throw new Error("Could not read selected management-center storage fields.");
      return parseWorkbenchValues({ management: result.result.value,
        source: { browserId: "Workbench", pid: workbench.pid, processStartedAt: workbench.creationDate, cdpPort: connection.port, pageOrigin: MANAGEMENT_ORIGIN } });
    } finally { await client.send("Target.detachFromTarget", { sessionId: attached.sessionId }).catch(() => {}); }
  } finally { client.close(); }
}

export function sameWorkbenchState(a, b) {
  return Boolean(a && b && a.serverToken === b.serverToken && a.userId === b.userId && a.companyId === b.companyId &&
    a.source?.pid === b.source?.pid && a.source?.processStartedAt === b.source?.processStartedAt && a.source?.cdpPort === b.source?.cdpPort);
}

export async function validateCaptured(snapshot, { fetcher = fetch, ports = discoverPorts } = {}) {
  if (snapshot.serverExpiresAtMs != null && snapshot.serverExpiresAtMs <= Date.now()) throw new Error("Workbench token is expired; sign in in Workbench.");
  const verify = async (route, authorization) => {
    const response = await fetcher(`${MANAGEMENT_ORIGIN}${route}`, { method: "POST", headers: { accept: "application/json, text/plain, */*", "content-type": "application/json;charset=UTF-8", authorization, lang: "zh" }, body: "{}", redirect: "error", signal: AbortSignal.timeout(10000) });
    const body = await response.json().catch(() => null);
    return { status: response.status, code: body?.code, data: body?.data };
  };
  // The current page bundle sends its Authorization value directly. A build
  // that requires Bearer will be detected by this read-only identity check.
  const user = await verify("/v2/sso/auth/myUserinfo", snapshot.serverToken);
  if (user.status !== 200 || user.code !== 200 || String(user.data?.userId ?? "") !== snapshot.userId) {
    throw new Error("Workbench management-center token was rejected or the user differs; sign in again.");
  }
  const company = await verify("/v2/team/curCompanyInfo", snapshot.serverToken);
  if (company.status !== 200 || company.code !== 200 || String(company.data?.companyId ?? "") !== snapshot.companyId) {
    throw new Error("Workbench selected company differs from the server session.");
  }
  const currentPorts = await ports();
  if (currentPorts.localApiOrigins.length !== 1) throw new Error("Local API is unavailable or ambiguous.");
  return { localOrigin: currentPorts.localApiOrigins[0] };
}

export async function syncWorkbench({ capture = captureWorkbenchValues, validate = validateCaptured, cache = updateWorkbenchSession, invalidate = invalidateWorkbenchSession } = {}) {
  try {
    const overrides = ["YUNLOGIN_SERVER_TOKEN", "YUNLOGIN_SERVER_COOKIE", "YUNLOGIN_SERVER_COMPANY_ID", "YUNLOGIN_SERVER_USER_ID", "YUNLOGIN_SERVER_COMPANY"].filter(name => process.env[name]);
    if (overrides.length) throw new Error(`Remove independent Workbench credential overrides: ${overrides.join(", ")}.`);
    for (let attempt = 0; attempt < 2; attempt++) {
      const first = await capture();
      const { localOrigin } = await validate(first);
      const second = await capture();
      if (!sameWorkbenchState(first, second)) continue;
      const value = { ...second, localOrigin };
      await cache(value, { recheck: async () => { if (!sameWorkbenchState(second, await capture())) throw new Error("Workbench changed before cache commit."); } });
      pinWorkbenchSession(value);
      return { synced: true, userId: value.userId, companyId: value.companyId, source: value.source,
        capturedAt: value.capturedAt, serverExpiresAtMs: value.serverExpiresAtMs };
    }
    throw new Error("Workbench user, company, or token changed during synchronization.");
  } catch {
    clearPinnedWorkbenchSession();
    await invalidate("sync-failed").catch(() => {});
    throw new Error("Workbench synchronization failed. Check CDP, Workbench login, selected company, and local API readiness; details withheld.");
  }
}

export async function workbenchStatus({ capture = captureWorkbenchValues, cache = readWorkbenchSession, cdp = ensureWorkbenchCdp, validate = validateCaptured } = {}) {
  const stored = await cache();
  const connection = await cdp({ dryRun: true }).catch(() => null);
  if (!connection?.ready) return { connected: false, loggedIn: false, needsRestart: connection?.needsRestart ?? false, cachePresent: Boolean(stored), consistent: false };
  try {
    const live = await capture();
    await validate(live);
    return { connected: true, loggedIn: true, cachePresent: Boolean(stored), consistent: sameWorkbenchState(stored, live),
      userId: live.userId, companyId: live.companyId, serverExpiresAtMs: live.serverExpiresAtMs, source: live.source };
  } catch { return { connected: true, loggedIn: false, cachePresent: Boolean(stored), consistent: false }; }
}

export async function assertWorkbenchIdentity(snapshot, { capture = captureWorkbenchValues } = {}) {
  if (!sameWorkbenchState(snapshot, await capture())) throw new Error("Workbench account, company, or token changed; the request was stopped.");
}
