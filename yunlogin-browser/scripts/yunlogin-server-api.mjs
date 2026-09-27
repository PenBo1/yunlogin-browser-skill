#!/usr/bin/env node

/**
 * Safe command-line client for the cataloged YunLogin management-center API.
 *
 * The helper resolves an endpoint ID from references/server-api/endpoints.json,
 * reads the bearer token from the environment, validates the request, and
 * optionally sends the request. Unknown endpoints are never sent.
 */

import { readFile } from "node:fs/promises";
import { readServerIdentity, readServerToken } from "./lib/local-token-store.mjs";
import { ensureFreshServerSession } from "./lib/server-token.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(
  scriptDir,
  "../references/server-api/endpoints.json",
);
const sensitiveKeyPattern =
  /authorization|cookie|token|secret|password|passwd|pwd|tfa|proxyp|proxyu|user_name|username|cdk/i;

function usage() {
  console.error(`Usage:
  node scripts/yunlogin-server-api.mjs ENDPOINT_ID [options]

Options:
  --query NAME=VALUE     Add or override a query parameter (repeatable)
  --body JSON            Override the JSON request body
  --body-file FILE       Read the JSON request body from FILE
  --dry-run              Validate and print the request without sending it
  --list                 List cataloged endpoint IDs without networking
  --show-sensitive       Disable response-field redaction
  -h, --help             Show this help

Environment:
  YUNLOGIN_SERVER_TOKEN       Bearer token override
  YUNLOGIN_SERVER_TOKEN_FILE  Server token cache path override

The bearer token is read from YUNLOGIN_SERVER_TOKEN first and from the
user-level cache next (%LOCALAPPDATA%\yunlogin-browser\server-token.json).
Store or refresh the session with:
  node scripts/yunlogin-auth.mjs save-server-token
  node scripts/yunlogin-auth.mjs ensure-server
  YUNLOGIN_SERVER_COOKIE      Optional Cookie header
  YUNLOGIN_SERVER_LANG        Optional Lang header (default: zh)
  YUNLOGIN_SERVER_COMPANY_ID  Optional companyid default
  YUNLOGIN_SERVER_USER_ID     Optional userid default
  YUNLOGIN_TIMEOUT_MS         Request timeout in milliseconds (default: 30000)

Examples:
  node scripts/yunlogin-server-api.mjs browser-list --dry-run
  node scripts/yunlogin-server-api.mjs browser-list --body-file request.json
  node scripts/yunlogin-server-api.mjs proxy-cloud-list --query status=0 --dry-run
  node scripts/yunlogin-server-api.mjs --list`);
}

function takeValue(args, index, option) {
  const value = args[index + 1];
  if (value === undefined || value.startsWith("--")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function parseNameValue(value, option) {
  const separator = value.indexOf("=");
  if (separator <= 0) {
    throw new Error(`${option} must use NAME=VALUE`);
  }
  return [value.slice(0, separator), value.slice(separator + 1)];
}

function parseArguments(argv) {
  const args = [...argv];
  if (args.includes("--help") || args.includes("-h")) {
    usage();
    process.exit(0);
  }
  if (args.length === 1 && args[0] === "--list") return { listOnly: true };
  if (args.length === 0 || args[0].startsWith("--")) {
    usage();
    throw new Error("ENDPOINT_ID is required");
  }

  const endpointId = args.shift();
  const options = {
    query: {},
    bodyText: undefined,
    bodyFile: undefined,
    dryRun: false,
    showSensitive: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--query") {
      const [name, value] = parseNameValue(
        takeValue(args, index, argument),
        argument,
      );
      options.query[name] = value;
      index += 1;
    } else if (argument === "--body") {
      options.bodyText = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--body-file") {
      options.bodyFile = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--dry-run") {
      options.dryRun = true;
    } else if (argument === "--show-sensitive") {
      options.showSensitive = true;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }

  if (options.bodyText !== undefined && options.bodyFile !== undefined) {
    throw new Error("Use either --body or --body-file, not both");
  }

  return { endpointId, ...options };
}

function asObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object`);
  }
  return value;
}

async function loadCatalog() {
  const payload = asObject(
    JSON.parse(await readFile(catalogPath, "utf8")),
    "Server API catalog",
  );
  if (!Array.isArray(payload.endpoints)) {
    throw new Error("Server API catalog is missing endpoints");
  }
  if (
    !Array.isArray(payload.business_success_codes) ||
    payload.business_success_codes.length === 0
  ) {
    throw new Error("Server API catalog is missing business_success_codes");
  }
  return payload;
}

function findEndpoint(catalog, endpointId) {
  const matches = catalog.endpoints.filter((item) => item.id === endpointId);
  if (matches.length !== 1) {
    throw new Error(`Unknown server endpoint ID: ${endpointId}`);
  }
  return matches[0];
}

async function readBody(options) {
  if (options.bodyFile !== undefined) {
    try {
      return JSON.parse(await readFile(options.bodyFile, "utf8"));
    } catch (error) {
      throw new Error(`Invalid JSON in --body-file: ${error.message}`);
    }
  }
  if (options.bodyText !== undefined) {
    try {
      return JSON.parse(options.bodyText);
    } catch (error) {
      throw new Error(`Invalid JSON in --body: ${error.message}`);
    }
  }
  return {};
}

function mergeBody(endpoint, suppliedBody) {
  const defaults = asObject(endpoint.body_defaults ?? {}, "body_defaults");
  const supplied = asObject(suppliedBody, "Request body");
  for (const name of Object.keys(supplied)) {
    if (!Object.hasOwn(defaults, name)) {
      throw new Error(`Unknown body field for ${endpoint.id}: ${name}`);
    }
  }
  return { ...defaults, ...supplied };
}

function mergeQuery(endpoint, suppliedQuery) {
  const defaults = asObject(endpoint.query_defaults ?? {}, "query_defaults");
  for (const name of Object.keys(suppliedQuery)) {
    if (!Object.hasOwn(defaults, name)) {
      throw new Error(`Unknown query parameter for ${endpoint.id}: ${name}`);
    }
  }
  return { ...defaults, ...suppliedQuery };
}

async function applyEnvironmentDefaults(endpoint, query, body) {
  const identity = await readServerIdentity();
  const companyId = identity.companyId;
  const userId = identity.userId;

  if (companyId) {
    if (Object.hasOwn(query, "companyid") && query.companyid === "") query.companyid = companyId;
    if (Object.hasOwn(body, "companyid") && body.companyid === "") body.companyid = companyId;
  }
  if (userId) {
    if (Object.hasOwn(query, "userid") && query.userid === "") query.userid = userId;
    if (Object.hasOwn(body, "userid") && body.userid === "") body.userid = userId;
  }
}

function validateRequired(required, values, label) {
  for (const name of required ?? []) {
    const value = values[name];
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      throw new Error(`Missing required ${label} field: ${name}`);
    }
  }
}

function resolveOrigin(catalog) {
  const configured = catalog.default_origin;
  let parsed;
  try {
    parsed = new URL(configured);
  } catch {
    throw new Error("Server catalog origin must be a valid HTTPS origin");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("Server catalog origin must use HTTPS");
  }
  if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("Server catalog origin must contain an origin only");
  }
  return parsed.origin;
}

async function buildHeaders(method) {
  const token = await readServerToken();
  if (!token) {
    throw new Error("No server token is available. Set YUNLOGIN_SERVER_TOKEN or run node scripts/yunlogin-auth.mjs save-server-token");
  }
  const headers = new Headers({
    accept: "application/json, text/plain, */*",
    authorization: `Bearer ${token}`,
    lang: process.env.YUNLOGIN_SERVER_LANG ?? "zh",
  });
  if (method !== "GET") headers.set("content-type", "application/json");
  if (process.env.YUNLOGIN_SERVER_COOKIE) {
    headers.set("cookie", process.env.YUNLOGIN_SERVER_COOKIE);
  }
  return headers;
}

function redact(value, parentKey = "", additionalKeys = []) {
  const normalizedAdditional = new Set(additionalKeys.map((key) => key.toLowerCase()));
  if (Array.isArray(value)) return value.map((item) => redact(item, parentKey, additionalKeys));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        const sensitive =
          sensitiveKeyPattern.test(key) ||
          normalizedAdditional.has(key.toLowerCase()) ||
          (/proxy|credential/i.test(parentKey) && /^(?:user|username|passwd|password)$/i.test(key));
        return [key, sensitive ? "[REDACTED]" : redact(item, key, additionalKeys)];
      }),
    );
  }
  return value;
}

function headersForDisplay(headers) {
  return Object.fromEntries(
    [...headers.entries()].map(([name, value]) => [
      name,
      name === "authorization" || name === "cookie" ? "[SET]" : value,
    ]),
  );
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function isBusinessSuccess(catalog, payload) {
  if (!payload || typeof payload !== "object" || !Object.hasOwn(payload, "code")) {
    return true;
  }
  const successCodes = catalog.business_success_codes.map(Number);
  return successCodes.includes(Number(payload.code));
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const catalog = await loadCatalog();
  if (options.listOnly) {
    console.log(JSON.stringify({ count: catalog.endpoints.length, endpoints: catalog.endpoints.map((item) => item.id) }, null, 2));
    return;
  }
  const endpoint = findEndpoint(catalog, options.endpointId);
  const origin = resolveOrigin(catalog);

  const body = endpoint.method === "GET" ? {} : mergeBody(endpoint, await readBody(options));
  const query = mergeQuery(endpoint, options.query);
  await applyEnvironmentDefaults(endpoint, query, body);

  if (endpoint.method === "GET" && (options.bodyText !== undefined || options.bodyFile !== undefined)) {
    throw new Error("GET endpoints do not accept a request body");
  }
  validateRequired(endpoint.query_required, query, "query");
  validateRequired(endpoint.body_required, body, "body");

  const url = new URL(endpoint.path, origin);
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) url.searchParams.set(name, String(value));
  }
// Keep the cached session warm before the call. A refresh failure must not
  // block the request: the response below reports the real server answer.
  try {
    const session = await ensureFreshServerSession({ verify: false });
    if (session.refreshed) {
      console.error(`Refreshed the server token; it now expires at ${session.expiresAt ?? "an unknown time"}.`);
    }
  } catch {
    // The cached token may still be usable, so continue and let the call decide.
  }

  const headers = await buildHeaders(endpoint.method);
  const requestBody = endpoint.method === "GET" ? undefined : JSON.stringify(body);
  const timeoutMs = Number.parseInt(process.env.YUNLOGIN_TIMEOUT_MS ?? "30000", 10);
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("YUNLOGIN_TIMEOUT_MS must be a positive integer");
  }

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          surface: "server",
          endpoint: endpoint.id,
          method: endpoint.method,
          url: url.href,
          headers: headersForDisplay(headers),
          body: requestBody === undefined ? { type: "none" } : { type: "json", value: redact(body, "", endpoint.redact_keys ?? []) },
        },
        null,
        2,
      ),
    );
    return;
  }

  async function send(requestHeaders) {
    const response = await fetch(url, {
      method: endpoint.method,
      headers: requestHeaders,
      body: requestBody,
      signal: AbortSignal.timeout(timeoutMs),
    });
    const responseText = await response.text();
    return { response, responseText, parsed: parseJson(responseText) };
  }

  let { response, responseText, parsed } = await send(headers);

  // A rejected bearer token is the one failure the helper can repair itself.
  if (parsed?.code === 1001) {
    const refreshed = await ensureFreshServerSession({ force: true, verify: false }).catch(() => ({ refreshed: false }));
    if (refreshed.refreshed) {
      console.error("The bearer token was rejected; refreshed the session and retrying once.");
      ({ response, responseText, parsed } = await send(await buildHeaders(endpoint.method)));
    }
  }

  console.error(`${response.status} ${response.statusText}`);
  if (parsed === undefined) {
    console.log(responseText);
  } else {
    console.log(
      JSON.stringify(options.showSensitive ? parsed : redact(parsed, "", endpoint.redact_keys ?? []), null, 2),
    );
    if (!isBusinessSuccess(catalog, parsed)) {
      console.error(`Business error: code=${parsed.code}${parsed.msg ? ` msg=${parsed.msg}` : ""}`);
      process.exitCode = 1;
    }
  }
  if (!response.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});