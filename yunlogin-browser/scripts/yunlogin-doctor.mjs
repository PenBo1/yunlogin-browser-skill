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
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveClientOrigin } from "./lib/client-origin.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..");

const args = new Set(process.argv.slice(2));
if (args.has("--audit")) {
  const forwarded = ["--skip-heavy", "--json"].filter((flag) => args.has(flag));
  const result = spawnSync(process.execPath, [path.join(scriptDir, "dev", "run-api-audit.mjs"), ...forwarded], { cwd: skillDir, stdio: "inherit" });
  process.exit(result.status ?? 1);
}
if (args.has("-h") || args.has("--help")) {
  console.log(`Usage: node scripts/yunlogin-doctor.mjs [--live] [--json]

  --live   Also probe the local API, the local client API, and the cached
           server session. Every live probe is read-only.
  --audit  Run the full read/write/delete audit chain instead (scripts/dev/run-api-audit.mjs).
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
  "references/api/INDEX.md",
  "references/client-api/INDEX.md",
  "references/client-api/STARTUP.md",
  "references/server-api/INDEX.md",
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
  "scripts/yunlogin-fb-cdp.mjs",
  "scripts/yunlogin-client.mjs",
  "scripts/yunlogin-ports.mjs",
  "references/client-api/PORTS.md",
  "scripts/yunlogin-env.mjs",
  "scripts/yunlogin-server-api.mjs",
  "scripts/lib/local-token-store.mjs",
  "scripts/lib/server-token.mjs",
  "scripts/lib/client-bundle.mjs",
  "scripts/lib/tag-colors.mjs",
  "scripts/dev/validate-api-docs.mjs",
];

const TEXT_EXTENSIONS = [".md", ".json", ".mjs", ".yaml", ".yml", ".txt"];
// The management-center research surface records raw server messages verbatim,
// including Chinese business errors. Every other file in the skill stays ASCII-only.
const ASCII_NEUTRAL = /^references[\\/]server-api[\\/]|^scripts[\\/]dev[\\/]render-(route-catalog|write-params)\.mjs$/;

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

  const localIndex = await readFile(path.join(skillDir, "references/api/INDEX.md"), "utf8");
  const localEntries = [...localIndex.matchAll(/\[[^\]]+\]\(\.\/([^)]+\.md)\)\s*\|\s*`([^`]+)`/g)];
  record("local-index", localEntries.length > 0, `${localEntries.length} local API rows in the index`);

  // A full sweep overwrites route-sweep.json and leaves every route with its generic-body shape.
  // The resolved-route re-probe has to run afterwards or field coverage silently collapses back to
  // the envelope; this is the regression that produced the guard.
  const sweep = JSON.parse(await readFile(path.join(skillDir, "references/server-api/route-sweep.json"), "utf8"));
  const reprobed = (sweep.results ?? []).filter((row) => row.reprobedAt).length;
  const keys = (sweep.results ?? []).map((row) => row.key);
  const problems2 = [];
  if (!sweep.reprobedAt) problems2.push("no top-level reprobedAt; run reprobe-resolved-routes.mjs after a sweep");
  if (reprobed === 0) problems2.push("no route carries reprobedAt; the resolved-route re-probe has not run");
  if (new Set(keys).size !== keys.length) problems2.push("route-sweep.json has duplicate route keys");
  record("sweep-reprobe", problems2.length === 0, problems2.length ? problems2.join("; ") : `${reprobed} routes re-probed with resolved inputs`);
}

async function checkHygiene() {
  const files = await walkFiles(skillDir);
  const textFiles = files.filter((file) => TEXT_EXTENSIONS.includes(path.extname(file).toLowerCase()));

  const secretHits = [];
  const encodingHits = [];
  let neutralFiles = 0;
  for (const file of textFiles) {
    const source = await readFile(file, "utf8");
    const relative = path.relative(skillDir, file);
    if (TOKEN_LIKE.test(source)) secretHits.push(relative);
    if (!/[^\x00-\x7F]/.test(source)) continue;
    if (ASCII_NEUTRAL.test(relative)) { neutralFiles += 1; continue; }
    encodingHits.push(relative);
  }
  record("no-secrets", secretHits.length === 0, secretHits.length ? `token-like value in ${secretHits.join(", ")}` : `${textFiles.length} text files scanned`);
  record("ascii-only", encodingHits.length === 0, encodingHits.length ? `non-ASCII text in ${encodingHits.join(", ")}` : `all skill text is ASCII (${neutralFiles} management-center research files may quote raw server messages)`);

  // A tool once wrote a whole section with one character per line, which destroys the document while
  // every length, link, and schema check still passes. Detect a run of single-character lines whose
  // characters join back into prose, and ignore runs that are ordinary JSON or code punctuation.
  const corruptionHits = [];
  for (const file of textFiles) {
    const lines = (await readFile(file, "utf8")).split("\n");
    let run = [];
    let best = "";
    const flush = () => { if (run.join("").length > best.length) best = run.join(""); run = []; };
    for (const line of lines) {
      const stripped = line.replace(/\r$/, "");
      if (stripped.length === 1) run.push(stripped);
      else flush();
    }
    flush();
    if (best.length >= 40 && /[A-Za-z]{3,}\s[A-Za-z]{3,}\s[A-Za-z]{3,}/.test(best)) {
      corruptionHits.push(`${path.relative(skillDir, file)} (${best.length} chars)`);
    }
  }
  record("no-prose-corruption", corruptionHits.length === 0, corruptionHits.length ? `one-character-per-line block in ${corruptionHits.join(", ")}` : "no one-character-per-line prose blocks");

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
  // Enforce the full skill-creator frontmatter contract in-process so the skill stays valid
  // without requiring the Python validator to be installed.
  const frontmatterProblems = [];
  if (!frontmatter) frontmatterProblems.push("no YAML frontmatter");
  else {
    const block = frontmatter[1];
    const allowedKeys = new Set(["name", "description", "license", "allowed-tools", "metadata"]);
    for (const key of [...block.matchAll(/^([A-Za-z0-9_-]+):/gm)].map((m) => m[1])) {
      if (!allowedKeys.has(key)) frontmatterProblems.push(`unexpected key ${key}`);
    }
    const name = (block.match(/^name:\s*(.+)$/m)?.[1] ?? "").trim();
    if (!/^[a-z0-9-]+$/.test(name)) frontmatterProblems.push("name is not hyphen-case");
    else if (name.startsWith("-") || name.endsWith("-") || name.includes("--")) frontmatterProblems.push("name has a stray hyphen");
    else if (name.length > 64) frontmatterProblems.push("name is longer than 64 characters");
    const description = (block.match(/^description:\s*(.+)$/m)?.[1] ?? "").trim();
    if (!description) frontmatterProblems.push("description is empty");
    else if (description.length > 1024) frontmatterProblems.push("description is longer than 1024 characters");
    else if (description.includes("<") || description.includes(">")) frontmatterProblems.push("description contains an angle bracket");
    else if (description.startsWith("[TODO:")) frontmatterProblems.push("description is an unfinished TODO");
    const bodyWithoutCode = skillSource.slice(frontmatter[0].length).replace(/```[\s\S]*?```/g, "");
    if (/^\s*\[TODO:[^\]]*\]\s*$/m.test(bodyWithoutCode)) frontmatterProblems.push("body contains an unfinished TODO placeholder");
  }
  record("frontmatter", frontmatterProblems.length === 0, frontmatterProblems.length === 0 ? "name, description, and keys satisfy the skill-creator contract" : frontmatterProblems.join("; "));
}

// A validation-only run must never rewrite the user's token cache. A forward test found that
// "status" and "--dry-run" could both trigger a refresh, so the fingerprint is compared around them.
async function tokenCacheFingerprint() {
  const base = process.platform === "win32"
    ? process.env.LOCALAPPDATA ?? path.join(process.env.USERPROFILE ?? ".", "AppData", "Local")
    : path.join(process.env.HOME ?? ".", ".local", "share");
  const file = path.join(base, "yunlogin-browser", "server-token.json");
  try {
    const [buffer, info] = await Promise.all([readFile(file), stat(file)]);
    return `${createHash("sha256").update(buffer).digest("hex")}:${info.mtimeMs}`;
  } catch {
    return "absent";
  }
}

async function checkBehaviour() {
  const checks = [];
  const cacheBefore = await tokenCacheFingerprint();
  runNode("scripts/yunlogin-auth.mjs", ["status"]);
  runNode("scripts/yunlogin-server-api.mjs", ["browser-list", "--dry-run"]);
  const cacheAfter = await tokenCacheFingerprint();
  checks.push(["dry-run is side-effect free", cacheBefore === cacheAfter, cacheBefore === cacheAfter ? "status and browser-list --dry-run left the token cache untouched" : "the token cache changed during a validation-only run"]);

  // The documented no-cache-write mode must keep the user cache untouched even when the helper
  // would normally refresh. YUNLOGIN_SERVER_TOKEN_FILE redirects the cache path and a zero refresh
  // skew disables the proactive refresh, so neither the user cache nor the redirect path may change.
  const redirectedPath = path.join(os.tmpdir(), `yl-doctor-token-${process.pid}.json`);
  const redirectBefore = await tokenCacheFingerprint();
  runNode("scripts/yunlogin-server-api.mjs", ["browser-list", "--dry-run"], {
    YUNLOGIN_SERVER_TOKEN_FILE: redirectedPath,
    YUNLOGIN_SERVER_REFRESH_SKEW_MS: "0",
  });
  const redirectAfter = await tokenCacheFingerprint();
  const redirectClean = redirectBefore === redirectAfter && !(await exists(redirectedPath));
  checks.push([
    "token-file redirect leaves the cache untouched",
    redirectClean,
    redirectClean ? "the redirect path and the user cache both stayed clean" : "the user cache or the redirect path changed",
  ]);

  const list = runNode("scripts/yunlogin-server-api.mjs", ["--list"]);
  const listPayload = parseTrailingJson(list.stdout);
  checks.push(["server-api --list", list.status === 0 && Array.isArray(listPayload?.endpoints), listPayload ? `${listPayload.count} endpoint ids` : list.stderr.trim().slice(0, 120)]);

  const tokenRefreshDryRun = runNode("scripts/yunlogin-server-api.mjs", ["token-refresh", "--dry-run"]);
  const tokenRefreshWired =
    tokenRefreshDryRun.status !== 0 &&
    tokenRefreshDryRun.stderr.includes("Independent token refresh is disabled");
  checks.push([
    "independent token refresh blocked",
    tokenRefreshWired,
    tokenRefreshWired ? "no helper-only token rotation" : tokenRefreshDryRun.stderr.trim().slice(0, 120),
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

  const acceptDefaults = runNode("scripts/yunlogin-env.mjs", ["create", "--name", "doctor-dry-probe", "--accept-defaults", "--dry-run"]);
  const acceptPayload = parseTrailingJson(acceptDefaults.stdout);
  checks.push([
    "create dry-run with defaults",
    acceptDefaults.status === 0 && acceptPayload?.dryRun === true,
    acceptDefaults.status === 0 ? "the documented default path still plans a body" : acceptDefaults.stderr.trim().slice(0, 120),
  ]);

  const groupDryRun = runNode("scripts/yunlogin-env.mjs", ["group-create", "--name", "doctor-dry-group", "--dry-run"]);
  const groupDryPayload = parseTrailingJson(groupDryRun.stdout);
  checks.push([
    "group create dry-run",
    groupDryRun.status === 0 && groupDryPayload?.dryRun === true,
    groupDryRun.status === 0 ? "plans a group without sending it" : groupDryRun.stderr.trim().slice(0, 120),
  ]);

  const tagDryRun = runNode("scripts/yunlogin-env.mjs", ["tag-create", "--name", "doctor-dry-tag", "--dry-run"]);
  const tagDryPayload = parseTrailingJson(tagDryRun.stdout);
  checks.push([
    "tag create dry-run",
    tagDryRun.status === 0 && tagDryPayload?.dryRun === true,
    tagDryRun.status === 0 ? "plans a tag without the id lookup" : tagDryRun.stderr.trim().slice(0, 120),
  ]);

  const cdpUsage = runNode("scripts/yunlogin-cdp.mjs", []);
  checks.push(["cdp usage guard", cdpUsage.status !== 0 && /Usage:/i.test(cdpUsage.stderr), `exit ${cdpUsage.status}`]);

  const fbCdpUsage = runNode("scripts/yunlogin-fb-cdp.mjs", []);
  checks.push(["fb cdp usage guard", fbCdpUsage.status !== 0 && /Usage:/i.test(fbCdpUsage.stderr), `exit ${fbCdpUsage.status}`]);

  const clientUsage = runNode("scripts/yunlogin-client.mjs", []);
  checks.push(["client lifecycle usage guard", clientUsage.status !== 0 && /Usage:/i.test(clientUsage.stderr), `exit ${clientUsage.status}`]);

  const discovery = runNode("scripts/dev/test-client-discovery.mjs", []);
  checks.push(["client discovery and secrecy", discovery.status === 0, discovery.status === 0 ? discovery.stdout.trim() : discovery.stderr.trim().slice(0, 200)]);

  const workbenchTest = runNode("scripts/dev/test-workbench-session.mjs", []);
  checks.push(["workbench session synchronization", workbenchTest.status === 0, workbenchTest.status === 0 ? workbenchTest.stdout.trim() : workbenchTest.stderr.trim().slice(0, 200)]);

  const clientStartGate = runNode("scripts/yunlogin-client.mjs", ["start", "--dry-run"]);
  const clientStartPayload = parseTrailingJson(clientStartGate.stdout);
  checks.push(["client start dry-run gate", clientStartGate.status === 0 && clientStartPayload?.dryRun === true, `exit ${clientStartGate.status}`]);

  const syncDryRun = runNode("scripts/yunlogin-auth.mjs", ["sync-workbench", "--dry-run"]);
  const syncDryPayload = parseTrailingJson(syncDryRun.stdout);
  checks.push(["workbench sync dry-run", syncDryRun.status === 0 && syncDryPayload?.dryRun === true, syncDryRun.status === 0 ? "plans a sync without writing credentials" : syncDryRun.stderr.trim().slice(0, 120)]);

  const ssoLoginDryRun = runNode("scripts/yunlogin-server-api.mjs", ["sso-login", "--body", "{\"username\":\"doctor@example.test\",\"password\":\"doctor-password\"}", "--dry-run"]);
  const ssoLoginDryPayload = parseTrailingJson(ssoLoginDryRun.stdout);
  checks.push(["sso login dry-run", ssoLoginDryRun.status === 0 && ssoLoginDryPayload?.endpoint === "sso-login" && ssoLoginDryPayload?.body?.value?.password === "[REDACTED]", ssoLoginDryRun.status === 0 ? "plans the public login route" : ssoLoginDryRun.stderr.trim().slice(0, 120)]);

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

  const clientOrigin = await resolveClientOrigin();
  const client = await probe(`${clientOrigin}/api/v1/client/gpu_info`, {
    method: "POST",
    headers: { "content-type": "text/plain;charset=UTF-8" },
    body: "{}",
  });
  record("live:client-api", client.payload?.code === 0, client.error ? `${clientOrigin} ${client.error}` : `${clientOrigin} code=${client.payload?.code} adapters=${client.payload?.data?.adapters?.length ?? 0}`);

  const status = runNode("scripts/yunlogin-auth.mjs", ["status"]);
  const statusPayload = parseTrailingJson(status.stdout);
  record("live:server-session", Boolean(statusPayload?.server?.usable), statusPayload ? `usable=${statusPayload.server?.usable} expiresAt=${statusPayload.server?.expiresAt ?? "unknown"}` : status.stderr.trim().slice(0, 120));

  const serverProbe = runNode("scripts/yunlogin-server-api.mjs", ["browser-settings"]);
  const serverPayload = parseTrailingJson(serverProbe.stdout);
  record("live:server-read", serverProbe.status === 0 && Number(serverPayload?.code) === 200, `code=${serverPayload?.code ?? serverProbe.status}`);

  // Creating with no attribute flag must stop and ask, and must not create anything.
  const gateProbeName = "doctor-attributes-probe";
  const gate = runNode("scripts/yunlogin-env.mjs", ["create", "--name", gateProbeName]);
  const gatePayload = parseTrailingJson(gate.stdout);
  const gateList = runNode("scripts/yunlogin-server-api.mjs", ["browser-list", "--body", `{"shopname":"${gateProbeName}"}`]);
  const createdByGate = (parseTrailingJson(gateList.stdout)?.shop ?? []).length;
  const gateOk =
    gate.status === 2 &&
    gatePayload?.needsAttributes === true &&
    Array.isArray(gatePayload?.availableGroups) &&
    gatePayload.availableGroups.length > 0 &&
    createdByGate === 0;
  record(
    "live:attribute-question",
    gateOk,
    gateOk ? `${gatePayload.availableGroups.length} groups offered and nothing created` : `exit ${gate.status}, created ${createdByGate}`,
  );

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
