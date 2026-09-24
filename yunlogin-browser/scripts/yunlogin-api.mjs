#!/usr/bin/env node

/**
 * Safe command-line client for the YunLogin desktop localhost API.
 *
 * Flow: parse arguments -> enforce a loopback origin -> validate the path ->
 * prepare and redact the request -> dry-run or fetch.
 * See scripts/README.md for operator-facing instructions.
 */

import { readFile } from "node:fs/promises";
import { readLocalToken } from "./lib/local-token-store.mjs";

const allowedMethods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const sensitiveKeyPattern =
  /cookie|authorization|token|password|passwd|pwd|secret|proxy.*(?:user|username|pass)|(?:user|username).*proxy/i;

function usage() {
  console.error(`Usage:
  node scripts/yunlogin-api.mjs local METHOD PATH [JSON_BODY] [options]
  node scripts/yunlogin-api.mjs METHOD PATH [JSON_BODY] [options]

The legacy form without local remains supported.

Options:
  --body-file FILE       Read a JSON request body from FILE
  --dry-run              Validate and print the request without sending it
  --show-sensitive       Disable response-field redaction
  -h, --help             Show this help

Environment:
  YUNLOGIN_LOCAL_BASE_URL  Local origin (default: http://localhost:50213)
  YUNLOGIN_BASE_URL        Backward-compatible alias for the local origin
  YUNLOGIN_LOCAL_TOKEN     Optional local Authorization bearer token
  YUNLOGIN_LOCAL_TOKEN_FILE Optional local token cache path
  YUNLOGIN_LOCAL_COOKIE    Optional local Cookie header
  YUNLOGIN_TIMEOUT_MS      Request timeout in milliseconds (default: 30000)

Examples:
  node scripts/yunlogin-api.mjs local GET /status --dry-run
  node scripts/yunlogin-api.mjs local POST /api/v2/userapi/group/create '{"name":"example"}' --dry-run`);
}

function takeValue(args, index, option) {
  const value = args[index + 1];
  if (value === undefined || value.startsWith("--")) {
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

  if (args[0] === "remote") {
    throw new Error(
      "Remote API mode is not supported by this localhost-only skill",
    );
  }

  let legacyLocalSyntax = true;
  if (args[0] === "local") {
    args.shift();
    legacyLocalSyntax = false;
  }
  if (args.length < 2) {
    usage();
    throw new Error("METHOD and PATH are required");
  }

  const rawMethod = args.shift();
  const requestPath = args.shift();
  const options = {
    bodyFile: undefined,
    bodyText: undefined,
    dryRun: false,
    showSensitive: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--body-file") {
      options.bodyFile = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--dry-run") {
      options.dryRun = true;
    } else if (argument === "--show-sensitive") {
      options.showSensitive = true;
    } else if (argument.startsWith("--")) {
      throw new Error(`Unknown option: ${argument}`);
    } else if (options.bodyText === undefined) {
      options.bodyText = argument;
    } else {
      throw new Error("Pass the JSON body as one quoted argument or use --body-file");
    }
  }

  if (options.bodyFile !== undefined && options.bodyText !== undefined) {
    throw new Error("Use either an inline JSON body or --body-file, not both");
  }

  return {
    legacyLocalSyntax,
    method: rawMethod.toUpperCase(),
    requestPath,
    ...options,
  };
}

function validateMethodAndPath(method, requestPath) {
  if (!allowedMethods.has(method)) {
    throw new Error(`Unsupported HTTP method: ${method}`);
  }
  if (
    !requestPath.startsWith("/") ||
    requestPath.startsWith("//") ||
    requestPath.includes("#") ||
    requestPath.includes("\\")
  ) {
    throw new Error(
      "PATH must start with one slash, contain no fragment, and must not be an absolute URL",
    );
  }
  const rawPathname = requestPath.split("?", 1)[0];
  for (const rawSegment of rawPathname.split("/")) {
    let segment;
    try {
      segment = decodeURIComponent(rawSegment);
    } catch {
      throw new Error("PATH contains an invalid percent-encoded segment");
    }
    if (segment === "." || segment === "..") {
      throw new Error("PATH must not contain directory-navigation segments");
    }
  }
}

function normalizeOrigin(value, variableName) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${variableName} must be a valid URL origin`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`${variableName} must use http or https`);
  }
  if (parsed.username || parsed.password) {
    throw new Error(`${variableName} must not contain embedded credentials`);
  }
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error(`${variableName} must contain an origin only, without a path`);
  }
  return parsed.origin;
}

function resolveLocalOrigin() {
  const configured =
    process.env.YUNLOGIN_LOCAL_BASE_URL ??
    process.env.YUNLOGIN_BASE_URL ??
    "http://localhost:50213";
  const origin = normalizeOrigin(configured, "YUNLOGIN_LOCAL_BASE_URL");
  const hostname = new URL(origin).hostname;
  if (!["localhost", "127.0.0.1", "[::1]"].includes(hostname)) {
    throw new Error(
      "Local API only permits localhost, 127.0.0.1, or ::1 origins",
    );
  }
  return origin;
}

function redact(value, parentKey = "") {
  if (Array.isArray(value)) return value.map((item) => redact(item, parentKey));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveKeyPattern.test(key) ||
        (/proxy|outbound|credential/i.test(parentKey) &&
          /^(?:user|username|account|login)$/i.test(key))
          ? "[REDACTED]"
          : redact(item, key),
      ]),
    );
  }
  return value;
}

async function prepareBody(options) {
  let bodyText = options.bodyText;
  if (options.bodyFile !== undefined) {
    bodyText = await readFile(options.bodyFile, "utf8");
  }

  if (options.method === "GET" && bodyText !== undefined) {
    throw new Error("GET requests do not accept a body in this helper");
  }
  if (bodyText === undefined) {
    return { body: undefined, contentType: undefined, summary: { type: "none" } };
  }

  let parsed;
  try {
    parsed = JSON.parse(bodyText);
  } catch (error) {
    throw new Error(`Request body is not valid JSON: ${error.message}`);
  }
  return {
    body: JSON.stringify(parsed),
    contentType: "application/json",
    summary: { type: "json", value: redact(parsed) },
  };
}

function buildHeaders(contentType, localToken) {
  const headers = new Headers({ accept: "application/json" });
  if (contentType) headers.set("content-type", contentType);
  if (localToken) {
    headers.set("authorization", `Bearer ${localToken}`);
  }
  if (process.env.YUNLOGIN_LOCAL_COOKIE) {
    headers.set("cookie", process.env.YUNLOGIN_LOCAL_COOKIE);
  }
  return headers;
}

function headersForDisplay(headers) {
  return Object.fromEntries(
    [...headers.entries()].map(([name, value]) => [
      name,
      name === "authorization" || name === "cookie" ? "[SET]" : value,
    ]),
  );
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  validateMethodAndPath(options.method, options.requestPath);

  const origin = resolveLocalOrigin();
  const preparedBody = await prepareBody(options);
  const localToken = await readLocalToken();
  const headers = buildHeaders(preparedBody.contentType, localToken);
  const url = new URL(options.requestPath, `${origin}/`);
  const timeoutMs = Number.parseInt(
    process.env.YUNLOGIN_TIMEOUT_MS ?? "30000",
    10,
  );
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("YUNLOGIN_TIMEOUT_MS must be a positive integer");
  }

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          target: "local",
          legacyLocalSyntax: options.legacyLocalSyntax,
          method: options.method,
          url: url.href,
          headers: headersForDisplay(headers),
          body: preparedBody.summary,
        },
        null,
        2,
      ),
    );
    return;
  }

  const response = await fetch(url, {
    method: options.method,
    headers,
    body: preparedBody.body,
    signal: AbortSignal.timeout(timeoutMs),
  });
  const responseText = await response.text();
  console.error(`${response.status} ${response.statusText}`);
  try {
    const parsed = JSON.parse(responseText);
    console.log(
      JSON.stringify(options.showSensitive ? parsed : redact(parsed), null, 2),
    );
  } catch {
    console.log(responseText);
  }
  if (!response.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});