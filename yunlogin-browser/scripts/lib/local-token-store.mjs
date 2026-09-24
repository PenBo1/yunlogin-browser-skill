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
  return {
    token: typeof payload.token === "string" && payload.token ? payload.token : undefined,
    companyId: typeof payload.company_id === "string" && payload.company_id ? payload.company_id : undefined,
    userId: typeof payload.user_id === "string" && payload.user_id ? payload.user_id : undefined,
    company: typeof payload.company === "string" && payload.company ? payload.company : undefined,
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
