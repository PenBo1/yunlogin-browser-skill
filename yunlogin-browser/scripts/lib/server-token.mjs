import {
  readServerIdentity,
  readServerSession,
  resolveServerTokenFilePath,
  writeServerSession,
} from "./local-token-store.mjs";

const DEFAULT_SERVER_ORIGIN = "https://d126447d359e70c0.yunlogin.com";
const DEFAULT_TIMEOUT_MS = 30000;

export const SERVER_TOKEN_PROBE_PATH = "/v2/sso/auth/myUserinfo";
export const SERVER_TOKEN_REFRESH_PATH = "/v2/sso/auth/tokenRefresh";

// Refresh when less than this much lifetime remains. The route hands out a
// token valid for several days, so the default keeps a session warm without
// refreshing on every single call. Set YUNLOGIN_SERVER_REFRESH_SKEW_MS larger
// than the token lifetime to force a refresh before every call.
const DEFAULT_REFRESH_SKEW_MS = 24 * 60 * 60 * 1000;

function normalizeOrigin(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("YUNLOGIN_SERVER_ORIGIN must be a valid URL");
  }
  if (parsed.protocol !== "https:") throw new Error("YUNLOGIN_SERVER_ORIGIN must use https");
  return parsed.origin;
}

export function serverOrigin() {
  return normalizeOrigin(process.env.YUNLOGIN_SERVER_ORIGIN ?? DEFAULT_SERVER_ORIGIN);
}

export function refreshSkewMs() {
  const raw = process.env.YUNLOGIN_SERVER_REFRESH_SKEW_MS;
  if (raw === undefined || raw === "") return DEFAULT_REFRESH_SKEW_MS;
  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("YUNLOGIN_SERVER_REFRESH_SKEW_MS must be a non-negative integer");
  }
  return value;
}

function requestTimeoutMs(options) {
  return options.timeoutMs ?? Number.parseInt(process.env.YUNLOGIN_TIMEOUT_MS ?? String(DEFAULT_TIMEOUT_MS), 10);
}

async function postJson(path, options = {}) {
  const headers = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json;charset=UTF-8",
    lang: process.env.YUNLOGIN_SERVER_LANG ?? "zh",
    ...(options.headers ?? {}),
  };
  if (options.token) headers.authorization = `Bearer ${options.token}`;
  if (process.env.YUNLOGIN_SERVER_COOKIE) headers.cookie = process.env.YUNLOGIN_SERVER_COOKIE;
  const response = await fetch(new URL(path, `${serverOrigin()}/`), {
    method: "POST",
    headers,
    body: options.body ?? "{}",
    signal: AbortSignal.timeout(requestTimeoutMs(options)),
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

function looksLikeAuthFailure(probe) {
  if (!probe) return false;
  const message = String(probe.payload?.msg ?? "");
  if (/invalid token|token.*(error|invalid)/i.test(message)) return true;
  if (probe.status === 401 || probe.status === 403) return true;
  if (probe.payload?.code === 1001) return true;
  return false;
}

export async function probeServerToken(token, options = {}) {
  const probe = await postJson(SERVER_TOKEN_PROBE_PATH, { token, body: "{}", ...options });
  return {
    usable: probe.payload?.code === 200,
    httpStatus: probe.status,
    code: probe.payload?.code,
    msg: probe.payload?.msg,
    userId: probe.payload?.data?.userId,
    nickname: probe.payload?.data?.nickname,
    authFailure: looksLikeAuthFailure(probe),
  };
}

// tokenRefresh answers with a fresh bearer token and the moment it expires.
// The expire field matches the JWT exp claim exactly on the tested server.
export async function refreshServerToken(options = {}) {
  const requestedToken = options.token;
  if (!requestedToken) {
    return { refreshed: false, reason: "no bearer token is available to refresh" };
  }
  const response = await postJson(SERVER_TOKEN_REFRESH_PATH, {
    token: requestedToken,
    body: "{}",
    // The refresh route only answers when the caller identifies itself as the
    // desktop client.
    headers: { apisource: "1" },
    ...options,
  });
  if (response.payload?.code !== 200) {
    return {
      refreshed: false,
      reason: `token refresh failed: HTTP ${response.status}, code=${response.payload?.code}, msg=${response.payload?.msg ?? ""}`,
    };
  }
  const token = response.payload?.data?.token;
  const expiresAt = response.payload?.data?.expire;
  if (typeof token !== "string" || !token) {
    return { refreshed: false, reason: "token refresh response did not include data.token" };
  }
  const expiresAtMs = expiresAt ? Date.parse(expiresAt) : undefined;
  if (options.verify !== false) {
    const probe = await probeServerToken(token, options);
    if (!probe.usable) {
      return { refreshed: false, reason: `refreshed token was rejected: code=${probe.code}, msg=${probe.msg ?? ""}` };
    }
  }
  const identity = await readServerIdentity();
  const path = await writeServerSession({
    token,
    expiresAt,
    expiresAtMs: Number.isFinite(expiresAtMs) ? expiresAtMs : undefined,
    refreshedAt: new Date().toISOString(),
    companyId: identity.companyId,
    userId: identity.userId,
    company: identity.company,
  });
  return {
    refreshed: true,
    path,
    tokenLength: token.length,
    expiresAt,
    expiresAtMs: Number.isFinite(expiresAtMs) ? expiresAtMs : undefined,
    need: response.payload?.data?.need,
  };
}

// Decide whether the cached session can be reused as-is.
export async function serverSessionStatus(options = {}) {
  const session = await readServerSession();
  const nowMs = options.nowMs ?? Date.now();
  const skewMs = options.skewMs ?? refreshSkewMs();
  const expiresAtMs = session.expiresAtMs;
  const remainingMs = Number.isFinite(expiresAtMs) ? expiresAtMs - nowMs : undefined;
  return {
    session,
    file: resolveServerTokenFilePath(),
    present: Boolean(session.token || process.env.YUNLOGIN_SERVER_TOKEN),
    source: process.env.YUNLOGIN_SERVER_TOKEN ? "environment" : session.token ? "cache" : "none",
    expiresAt: session.expiresAt,
    expiresAtMs,
    refreshedAt: session.refreshedAt,
    remainingMs,
    expired: Number.isFinite(remainingMs) ? remainingMs <= 0 : false,
    dueForRefresh: Number.isFinite(remainingMs) ? remainingMs <= skewMs : false,
    skewMs,
  };
}

// Refresh before a call when the stored token is missing, expired, or inside
// the skew window. A successful refresh replaces the cache; a failure leaves
// the existing token in place so the caller can still try it.
export async function ensureFreshServerSession(options = {}) {
  const status = await serverSessionStatus(options);
  if (!status.present) return { ...status, refreshed: false };
  if (!status.dueForRefresh && !options.force) return { ...status, refreshed: false };
  const token = await readServerTokenForRefresh();
  const refresh = await refreshServerToken({ ...options, token });
  if (!refresh.refreshed) return { ...status, refreshed: false, refreshError: refresh.reason };
  return { ...(await serverSessionStatus(options)), refreshed: true, refresh };
}

async function readServerTokenForRefresh() {
  if (process.env.YUNLOGIN_SERVER_TOKEN) return process.env.YUNLOGIN_SERVER_TOKEN;
  const session = await readServerSession();
  return session.token;
}
