import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { readWorkbenchSession, sessionPath } from "./workbench-cache.mjs";

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
  return undefined;
}

export async function writeLocalToken(token, filePath = resolveLocalTokenFilePath()) {
  throw new Error("Local credentials are managed by the current Workbench session. Run yunlogin-auth.mjs sync-workbench.");
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
  const payload = await readWorkbenchSession();
  if (!payload) return {};
  return {
    token: payload.serverToken,
    companyId: payload.companyId,
    userId: payload.userId,
    company: payload.company,
    expiresAt: Number.isFinite(payload.serverExpiresAtMs) ? new Date(payload.serverExpiresAtMs).toISOString() : undefined,
    expiresAtMs: payload.serverExpiresAtMs ?? undefined,
    capturedAt: payload.capturedAt,
  };
}

export async function readServerToken() {
  const session = await readServerSession();
  return session.token;
}

export async function readServerIdentity() {
  const session = await readServerSession();
  return {
    companyId: session.companyId,
    userId: session.userId,
    company: session.company,
  };
}

export async function writeServerSession(payload, filePath = resolveServerTokenFilePath()) {
  throw new Error("Server credentials are managed by the current Workbench session. Run yunlogin-auth.mjs sync-workbench.");
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
