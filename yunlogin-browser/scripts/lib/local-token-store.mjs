import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const CACHE_DIR_NAME = "yunlogin-browser";
const LOCAL_TOKEN_FILE_NAME = "local-token.json";
const SERVER_TOKEN_FILE_NAME = "server-token.json";

function defaultCacheDir() {
  const base = process.platform === "win32"
    ? process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local")
    : path.join(os.homedir(), ".local", "share");
  return path.join(base, CACHE_DIR_NAME);
}

async function readJsonFile(filePath) {
  try {
    const source = await readFile(filePath, "utf8");
    const trimmed = source.trim();
    if (!trimmed) return undefined;
    try {
      return JSON.parse(trimmed);
    } catch {
      return { token: trimmed };
    }
  } catch {
    return undefined;
  }
}

async function writeSecret(filePath, payload) {
  const target = path.resolve(filePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(payload, null, 2), { encoding: "utf8", mode: 0o600 });
  return target;
}

// Read the exp claim without verifying the signature. The value is only used
// to decide when to refresh, never to trust the token.
export function jwtExpiryMs(token) {
  if (typeof token !== "string") return undefined;
  const parts = token.split(".");
  if (parts.length < 2) return undefined;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    const exp = Number(payload?.exp);
    return Number.isFinite(exp) ? exp * 1000 : undefined;
  } catch {
    return undefined;
  }
}

export function resolveLocalTokenFilePath() {
  if (process.env.YUNLOGIN_LOCAL_TOKEN_FILE) return path.resolve(process.env.YUNLOGIN_LOCAL_TOKEN_FILE);
  return path.join(defaultCacheDir(), LOCAL_TOKEN_FILE_NAME);
}

export function resolveServerTokenFilePath() {
  if (process.env.YUNLOGIN_SERVER_TOKEN_FILE) return path.resolve(process.env.YUNLOGIN_SERVER_TOKEN_FILE);
  return path.join(defaultCacheDir(), SERVER_TOKEN_FILE_NAME);
}

export function resolveTokenCacheDir() {
  return defaultCacheDir();
}

export async function readLocalToken() {
  if (process.env.YUNLOGIN_LOCAL_TOKEN) return process.env.YUNLOGIN_LOCAL_TOKEN;
  const payload = await readJsonFile(resolveLocalTokenFilePath());
  const token = typeof payload === "string" ? payload : payload?.token;
  return typeof token === "string" && token ? token : undefined;
}

export async function writeLocalToken(token, filePath = resolveLocalTokenFilePath()) {
  if (!token) throw new Error("Cannot write an empty local token");
  return writeSecret(filePath, { token, captured_at: new Date().toISOString() });
}

export async function clearLocalToken(filePath = resolveLocalTokenFilePath()) {
  try {
    await rm(path.resolve(filePath), { force: true });
    return true;
  } catch {
    return false;
  }
}

// The server session file keeps the bearer token plus the company and user
// context that most management-center routes require, so a customer configures
// the session once instead of exporting three variables.
export async function readServerSession() {
  const payload = await readJsonFile(resolveServerTokenFilePath());
  if (!payload || typeof payload !== "object") return {};
  const token = typeof payload.token === "string" && payload.token ? payload.token : undefined;
  const storedMs = Number(payload.expires_at_ms);
  const parsedMs = typeof payload.expires_at === "string" ? Date.parse(payload.expires_at) : NaN;
  const expiresAtMs = Number.isFinite(storedMs)
    ? storedMs
    : Number.isFinite(parsedMs)
      ? parsedMs
      : jwtExpiryMs(token);
  return {
    token,
    companyId: typeof payload.company_id === "string" && payload.company_id ? payload.company_id : undefined,
    userId: typeof payload.user_id === "string" && payload.user_id ? payload.user_id : undefined,
    company: typeof payload.company === "string" && payload.company ? payload.company : undefined,
    expiresAt: typeof payload.expires_at === "string" ? payload.expires_at : undefined,
    expiresAtMs,
    refreshedAt: typeof payload.refreshed_at === "string" ? payload.refreshed_at : undefined,
    capturedAt: typeof payload.captured_at === "string" ? payload.captured_at : undefined,
  };
}

export async function readServerToken() {
  if (process.env.YUNLOGIN_SERVER_TOKEN) return process.env.YUNLOGIN_SERVER_TOKEN;
  const session = await readServerSession();
  return session.token;
}

export async function readServerIdentity() {
  const session = await readServerSession();
  return {
    companyId: process.env.YUNLOGIN_SERVER_COMPANY_ID ?? session.companyId,
    userId: process.env.YUNLOGIN_SERVER_USER_ID ?? session.userId,
    company: process.env.YUNLOGIN_SERVER_COMPANY ?? session.company,
  };
}

export async function writeServerSession(payload, filePath = resolveServerTokenFilePath()) {
  if (!payload?.token) throw new Error("Cannot write a server session without a token");
  const record = { token: payload.token, captured_at: new Date().toISOString() };
  const expiresAtMs = Number.isFinite(payload.expiresAtMs) ? payload.expiresAtMs : jwtExpiryMs(payload.token);
  if (Number.isFinite(expiresAtMs)) {
    record.expires_at_ms = expiresAtMs;
    record.expires_at = typeof payload.expiresAt === "string" ? payload.expiresAt : new Date(expiresAtMs).toISOString();
  }
  if (typeof payload.refreshedAt === "string" && payload.refreshedAt) record.refreshed_at = payload.refreshedAt;
  for (const [key, value] of [["company_id", payload.companyId], ["user_id", payload.userId], ["company", payload.company]]) {
    if (typeof value === "string" && value) record[key] = value;
  }
  return writeSecret(filePath, record);
}

export async function writeServerToken(token, filePath = resolveServerTokenFilePath()) {
  const existing = await readServerSession();
  return writeServerSession({ ...existing, token }, filePath);
}

export async function clearServerToken(filePath = resolveServerTokenFilePath()) {
  try {
    await rm(path.resolve(filePath), { force: true });
    return true;
  } catch {
    return false;
  }
}
