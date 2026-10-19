import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveTokenCacheDir } from "./local-token-store.mjs";
import { desktopListeners, probeOrigin } from "../yunlogin-ports.mjs";

export const CLIENT_PROBE_PATH = "/api/v1/client/gpu_info";

const CACHE_FILE_NAME = "client-origin.json";
const PROBE_TIMEOUT_MS = 1500;
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function resolveClientOriginFilePath() {
  if (process.env.YUNLOGIN_CLIENT_ORIGIN_FILE) return path.resolve(process.env.YUNLOGIN_CLIENT_ORIGIN_FILE);
  return path.join(resolveTokenCacheDir(), CACHE_FILE_NAME);
}

// Reject anything that is not a loopback http(s) origin. The client service is
// a local helper and must never be reached through a remote host.
export function normalizeClientOrigin(configured, variable = "YUNLOGIN_CLIENT_BASE_URL") {
  let parsed;
  try {
    parsed = new URL(configured);
  } catch {
    throw new Error(`${variable} must be a valid origin`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(`${variable} must use http or https`);
  if (!LOOPBACK_HOSTS.has(parsed.hostname)) throw new Error(`${variable} only permits loopback origins`);
  if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) throw new Error(`${variable} must be an origin without credentials, path, query or fragment`);
  return parsed.origin;
}

async function readCachedOrigin() {
  try {
    const parsed = JSON.parse(await readFile(resolveClientOriginFilePath(), "utf8"));
    const origin = typeof parsed?.origin === "string" ? parsed.origin : undefined;
    return origin ? normalizeClientOrigin(origin, "the cached client origin") : undefined;
  } catch {
    return undefined;
  }
}

async function writeCachedOrigin(origin) {
  try {
    const target = resolveClientOriginFilePath();
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, JSON.stringify({ origin }, null, 2), { encoding: "utf8", mode: 0o600 });
  } catch {
    // Caching is an optional hint; discovery still checks ownership next time.
  }
}

export async function clientServiceResponds(origin, timeoutMs = PROBE_TIMEOUT_MS) {
  try {
    const response = await fetch(new URL(CLIENT_PROBE_PATH, `${origin}/`), {
      method: "POST",
      headers: { "content-type": "text/plain;charset=UTF-8" },
      body: "{}",
      redirect: "error",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.status !== 200) return false;
    const payload = await response.json().catch(() => undefined);
    return payload?.code === 0 && Array.isArray(payload?.data?.adapters);
  } catch {
    return false;
  }
}

// Cached origins are hints only; recheck current process ownership and protocol.
export async function resolveClientOrigin({ timeoutMs = PROBE_TIMEOUT_MS } = {}) {
  const override = process.env.YUNLOGIN_CLIENT_BASE_URL ?? process.env.YUNLOGIN_CLIENT_ORIGIN;
  if (override) {
    const origin = normalizeClientOrigin(override);
    if (await clientServiceResponds(origin, timeoutMs)) return origin;
    throw new Error("The explicit YunLogin client origin did not pass the GPU probe. Check the override with yunlogin-ports.mjs.");
  }

  const cached = await readCachedOrigin();
  const snapshot = await desktopListeners();
  const owned = [...new Set(snapshot.listeners.map(p => probeOrigin(p.address, p.port)).filter(Boolean))];
  const candidates = cached && owned.includes(cached) ? [cached, ...owned] : owned;

  const verified = [];
  for (const origin of [...new Set(candidates)]) {
    if (!(await clientServiceResponds(origin, timeoutMs))) continue;
    verified.push(origin);
  }
  if (verified.length > 1) throw new Error("Multiple verified YunLogin client APIs; select a process and set YUNLOGIN_CLIENT_BASE_URL explicitly.");
  if (verified.length === 1) {
    if (verified[0] !== cached) await writeCachedOrigin(verified[0]);
    return verified[0];
  }

  throw new Error("No verified YunLogin client API was found. Run yunlogin-client.mjs status and follow client-api/STARTUP.md; do not guess a port.");
}
