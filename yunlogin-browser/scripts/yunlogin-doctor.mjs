#!/usr/bin/env node

/**
 * Self-test for the YunLogin browser skill.
 *
 * Runs the checks that catch a broken skill before a workflow depends on it:
 * required files, catalog and document consistency, secret and encoding
 * hygiene, and the observable behaviour of every helper CLI. Add --live to
 * probe the running desktop and the cached server session as well.
 *
 * Every check is read-only. Live probes never create, update, or delete data.
 */

import { spawnSync } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..");

const args = new Set(process.argv.slice(2));
if (args.has("-h") || args.has("--help")) {
  console.log(`Usage: node scripts/yunlogin-doctor.mjs [--live] [--json]

  --live   Also probe the local API, the local client API, and the cached
           server session. Every live probe is read-only.
  --json   Print only the machine-readable summary.
`);
  process.exit(0);
}
const liveMode = args.has("--live");
const jsonOnly = args.has("--json");

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail: String(detail ?? "") });
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

function runNode(scriptRelativePath, scriptArgs, extraEnv) {
  const result = spawnSync(process.execPath, [path.join(skillDir, scriptRelativePath), ...scriptArgs], {
    cwd: skillDir,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    env: extraEnv ? { ...process.env, ...extraEnv } : process.env,
  });
  return { status: result.status, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function parseTrailingJson(text) {
  const index = text.indexOf("{");
  if (index < 0) return undefined;
  try {
    return JSON.parse(text.slice(index));
  } catch {
    return undefined;
  }
}

const REQUIRED_PATHS = [
  "SKILL.md",
  "LICENSE",
  "agents/openai.yaml",
  "references/INDEX.md",
  "references/api/README.md",
  "references/client-api/README.md",
  "references/server-api/README.md",
  "references/server-api/INDEX.md",
  "references/server-api/endpoints.json",
  "references/server-api/ERRORS.md",
  "references/workflows/token-lifecycle.md",
  "references/workflows/environment-lifecycle.md",
  "references/workflows/environment-inputs.md",
  "references/workflows/cdp-automation.md",
  "scripts/yunlogin-api.mjs",
  "scripts/yunlogin-auth.mjs",
  "scripts/yunlogin-cdp.mjs",
  "scripts/yunlogin-env.mjs",
  "scripts/yunlogin-server-api.mjs",
  "scripts/lib/local-token-store.mjs",
  "scripts/lib/server-token.mjs",
  "scripts/lib/tag-colors.mjs",
  "scripts/dev/validate-api-docs.mjs",
];

const TEXT_EXTENSIONS = [".md", ".json", ".mjs", ".yaml", ".yml", ".txt"];
const TOKEN_LIKE = /eyJ[A-Za-z0-9_-]{20,}\./;
const REQUIRED_DOC_MARKERS = ["## Request", "## Response", "## Error Handling", "- Verified:"];

async function walkFiles(startDir) {
  const found = [];
  for (const entry of await readdir(startDir, { withFileTypes: true })) {
    const full = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      found.push(...(await walkFiles(full)));
    } else {
      found.push(full);
    }
  }
  return found;
}

async function checkStructure() {
  const missing = [];
  for (const relative of REQUIRED_PATHS) {
    if (!(await exists(path.join(skillDir, relative)))) missing.push(relative);
  }
  record("structure", missing.length === 0, missing.length ? `missing: ${missing.join(", ")}` : `${REQUIRED_PATHS.length} required paths present`);
}

async function checkCatalogs() {
  const catalog = JSON.parse(await readFile(path.join(skillDir, "references/server-api/endpoints.json"), "utf8"));
  const ids = catalog.endpoints.map((endpoint) => endpoint.id);
  const documents = catalog.endpoints.map((endpoint) => endpoint.document);
  const problems = [];
  if (new Set(ids).size !== ids.length) problems.push("duplicate endpoint ids");
  if (new Set(documents).size !== documents.length) problems.push("duplicate document paths");
  if (!catalog.business_success_codes.map(Number).includes(200)) problems.push("success codes do not include 200");

  const onDisk = (await readdir(path.join(skillDir, "references/server-api/endpoints"))).filter((name) => name.endsWith(".md"));
  if (onDisk.length !== catalog.endpoints.length) {
    problems.push(`${onDisk.length} documents on disk but ${catalog.endpoints.length} catalog entries`);
  }
  for (const endpoint of catalog.endpoints) {
    const documentPath = path.join(skillDir, "references/server-api", endpoint.document);
    if (!(await exists(documentPath))) {
      problems.push(`missing document ${endpoint.document}`);
      continue;
    }
    const source = await readFile(documentPath, "utf8");
    for (const marker of REQUIRED_DOC_MARKERS) {
      if (!source.includes(marker)) problems.push(`${endpoint.document} lacks ${marker}`);
    }
    if (!source.includes(`- Method: \`${endpoint.method}\``) || !source.includes(`- Path: \`${endpoint.path}\``)) {
      problems.push(`${endpoint.document} method or path does not match the catalog`);
    }
  }
  record("catalog", problems.length === 0, problems.length ? problems.slice(0, 5).join("; ") : `${catalog.endpoints.length} server endpoints and their documents agree`);

  const localIndex = await readFile(path.join(skillDir, "references/api/README.md"), "utf8");
  const localEntries = [...localIndex.matchAll(/\[[^\]]+\]\(\.\/([^)]+\.md)\)\s*\|\s*`([^`]+)`/g)];
  record("local-index", localEntries.length > 0, `${localEntries.length} local API rows in the index`);
}

async function checkHygiene() {
  const files = await walkFiles(skillDir);
  const textFiles = files.filter((file) => TEXT_EXTENSIONS.includes(path.extname(file).toLowerCase()));

  const secretHits = [];
  const encodingHits = [];
  for (const file of textFiles) {
    const source = await readFile(file, "utf8");
    if (TOKEN_LIKE.test(source)) secretHits.push(path.relative(skillDir, file));
    if (/[^\x00-\x7F]/.test(source)) encodingHits.push(path.relative(skillDir, file));
  }
  record("no-secrets", secretHits.length === 0, secretHits.length ? `token-like value in ${secretHits.join(", ")}` : `${textFiles.length} text files scanned`);
  record("ascii-only", encodingHits.length === 0, encodingHits.length ? `non-ASCII text in ${encodingHits.join(", ")}` : "all skill text is ASCII");

  const rootLicense = path.resolve(skillDir, "..", "LICENSE");
  if (await exists(rootLicense)) {
    const [a, b] = await Promise.all([readFile(rootLicense), readFile(path.join(skillDir, "LICENSE"))]);
    record("license-parity", a.equals(b), a.equals(b) ? "root and skill LICENSE are identical" : "root LICENSE differs from the skill copy");
  } else {
    record("license-parity", true, "repository root is outside this checkout; skill LICENSE present only");
  }

  const skillSource = await readFile(path.join(skillDir, "SKILL.md"), "utf8");
  const frontmatter = skillSource.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const hasName = Boolean(frontmatter && /^name:\s*[a-z0-9-]+\s*$/m.test(frontmatter[1]));
  const hasDescription = Boolean(frontmatter && /^description:\s*\S+/m.test(frontmatter[1]));
  record("frontmatter", hasName && hasDescription, hasName && hasDescription ? "name and description present" : "SKILL.md frontmatter is incomplete");
}

async function checkBehaviour() {
  const checks = [];

  const list = runNode("scripts/yunlogin-server-api.mjs", ["--list"]);
  const listPayload = parseTrailingJson(list.stdout);
  checks.push(["server-api --list", list.status === 0 && Array.isArray(listPayload?.endpoints), listPayload ? `${listPayload.count} endpoint ids` : list.stderr.trim().slice(0, 120)]);

  const tokenRefreshDryRun = runNode("scripts/yunlogin-server-api.mjs", ["token-refresh", "--dry-run"]);
  const tokenRefreshPlan = parseTrailingJson(tokenRefreshDryRun.stdout);
  const tokenRefreshWired =
    tokenRefreshDryRun.status === 0 &&
    tokenRefreshPlan?.url?.endsWith("/v2/sso/auth/tokenRefresh") === true &&
    tokenRefreshPlan?.method === "POST";
  checks.push([
    "token-refresh cataloged",
    tokenRefreshWired,
    tokenRefreshWired ? "dry-run resolves the refresh route" : tokenRefreshDryRun.stderr.trim().slice(0, 120),
  ]);

  const importCheck = spawnSync(
    process.execPath,
    ["-e", "import('./scripts/yunlogin-auth.mjs').then(() => console.log('ok'))"],
    { cwd: skillDir, encoding: "utf8" },
  );
  const importsResolve = importCheck.status === 0 && importCheck.stdout.includes("ok");
  checks.push([
    "auth helper imports",
    importsResolve,
    importsResolve ? "module graph resolves without running a command" : importCheck.stderr.trim().slice(0, 120),
  ]);

  const unknown = runNode("scripts/yunlogin-server-api.mjs", ["definitely-not-an-endpoint", "--dry-run"]);
  checks.push(["server-api rejects unknown id", unknown.status !== 0, `exit ${unknown.status}`]);

  const localDryRun = runNode("scripts/yunlogin-api.mjs", ["local", "GET", "/status", "--dry-run"]);
  const localOriginOk = localDryRun.status === 0 && parseTrailingJson(localDryRun.stdout)?.url?.startsWith("http://localhost:50213");
  checks.push(["local-api dry-run", localOriginOk, localOriginOk ? "loopback origin enforced" : localDryRun.stderr.trim().slice(0, 120)]);

  const envDelete = runNode("scripts/yunlogin-env.mjs", ["delete", "--account-id", "00000000000000000000000000000000"]);
  checks.push(["delete needs confirmation", envDelete.status === 2, `exit ${envDelete.status}`]);

  const envCreate = runNode("scripts/yunlogin-env.mjs", ["create", "--name", "doctor-probe", "--notes", "probe"]);
  checks.push(["attribute write needs confirmation", envCreate.status === 2, `exit ${envCreate.status}`]);

  const cdpUsage = runNode("scripts/yunlogin-cdp.mjs", []);
  checks.push(["cdp usage guard", cdpUsage.status !== 0 && /Usage:/i.test(cdpUsage.stderr), `exit ${cdpUsage.status}`]);

  const docValidator = runNode("scripts/dev/validate-api-docs.mjs", []);
  checks.push(["documentation validator", docValidator.status === 0, docValidator.status === 0 ? docValidator.stdout.trim().split("\n").join(" | ") : docValidator.stderr.trim().slice(0, 160)]);

  const failed = checks.filter(([, ok]) => !ok);
  for (const [name, ok, detail] of checks) record(`behaviour:${name}`, ok, detail);
  return failed.length;
}

async function probe(url, init) {
  try {
    const response = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
    const text = await response.text();
    return { httpStatus: response.status, payload: parseTrailingJson(text) };
  } catch (error) {
    return { error: error.message };
  }
}

async function checkLive() {
  const local = await probe("http://localhost:50213/status", { method: "GET" });
  record("live:local-api", Boolean(local.payload), local.error ?? `code=${local.payload?.code}`);

  const client = await probe("http://127.0.0.1:52446/api/v1/client/gpu_info", {
    method: "POST",
    headers: { "content-type": "text/plain;charset=UTF-8" },
    body: "{}",
  });
  record("live:client-api", client.payload?.code === 0, client.error ?? `code=${client.payload?.code} adapters=${client.payload?.data?.adapters?.length ?? 0}`);

  const status = runNode("scripts/yunlogin-auth.mjs", ["status"]);
  const statusPayload = parseTrailingJson(status.stdout);
  record("live:server-session", Boolean(statusPayload?.server?.usable), statusPayload ? `usable=${statusPayload.server?.usable} expiresAt=${statusPayload.server?.expiresAt ?? "unknown"}` : status.stderr.trim().slice(0, 120));

  const serverProbe = runNode("scripts/yunlogin-server-api.mjs", ["browser-settings"]);
  const serverPayload = parseTrailingJson(serverProbe.stdout);
  record("live:server-read", serverProbe.status === 0 && Number(serverPayload?.code) === 200, `code=${serverPayload?.code ?? serverProbe.status}`);

  // A skew larger than the token lifetime forces the proactive refresh path.
  const forcedRefresh = runNode("scripts/yunlogin-server-api.mjs", ["browser-settings"], {
    YUNLOGIN_SERVER_REFRESH_SKEW_MS: "999999999999",
  });
  const forcedPayload = parseTrailingJson(forcedRefresh.stdout);
  const refreshedBeforeCall = /Refreshed the server token/.test(forcedRefresh.stderr);
  record(
    "live:token-refresh",
    forcedRefresh.status === 0 && Number(forcedPayload?.code) === 200 && refreshedBeforeCall,
    refreshedBeforeCall ? "refreshed the session before the call" : "no refresh was attempted",
  );
}

async function main() {
  await checkStructure();
  await checkCatalogs();
  await checkHygiene();
  await checkBehaviour();
  if (liveMode) await checkLive();

  const failed = results.filter((result) => !result.ok);
  const summary = {
    skill: path.basename(skillDir),
    mode: liveMode ? "live" : "offline",
    checks: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    results,
  };

  if (!jsonOnly) {
    for (const result of results) {
      console.log(`${result.ok ? "PASS" : "FAIL"}  ${result.name.padEnd(38)} ${result.detail}`);
    }
    console.log("");
  }
  console.log(JSON.stringify(summary, null, 2));
  process.exitCode = failed.length === 0 ? 0 : 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ skill: path.basename(skillDir), error: error.message }, null, 2));
  process.exitCode = 1;
});
