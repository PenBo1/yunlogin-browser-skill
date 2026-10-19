#!/usr/bin/env node
/**
 * Discover the management-center JavaScript bundles that are deployed right now.
 *
 * The entry document lists hashed bundle names that change on every client build, so no caller may
 * hardcode a build hash. Fetch the root document and read the current names instead.
 */

export const CLIENT_ORIGIN = "https://d126447d359e70c0.yunlogin.com";

function timeoutMs(value) {
  const parsed = Number.parseInt(value ?? process.env.YUNLOGIN_TIMEOUT_MS ?? "30000", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30000;
}

export async function fetchBundleText(path, options = {}) {
  const origin = options.origin ?? CLIENT_ORIGIN;
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(options.timeoutMs ?? timeoutMs()) });
  if (!response.ok) {
    throw new Error(`${origin}${path} returned HTTP ${response.status}; the bundle name is stale or the origin changed`);
  }
  return response.text();
}

export async function discoverBundles(options = {}) {
  const origin = options.origin ?? CLIENT_ORIGIN;
  const response = await fetch(new URL("/", origin), { signal: AbortSignal.timeout(options.timeoutMs ?? timeoutMs()) });
  if (!response.ok) throw new Error(`client origin ${origin} returned HTTP ${response.status}`);
  const html = await response.text();
  const refs = [...new Set([...html.matchAll(/(?:src|href)="(\/js\/[^"]+\.js)"/g)].map((match) => match[1]))];
  const main = refs.find((path) => /\/main-[^/]+\.js$/.test(path));
  const i18n = refs.find((path) => /\/i18n-[^/]+\.js$/.test(path));
  if (!main) throw new Error("no main bundle is referenced by the client entry document");
  return { origin, refs, main, i18n };
}
