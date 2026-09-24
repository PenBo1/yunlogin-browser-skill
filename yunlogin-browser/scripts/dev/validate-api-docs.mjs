#!/usr/bin/env node

import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const scriptsDir = path.resolve(scriptDir, "..");
const skillDir = path.resolve(scriptDir, "..", "..");
const localDir = path.join(skillDir, "references", "api");
const localIndexPath = path.join(localDir, "README.md");
const serverDir = path.join(skillDir, "references", "server-api");
const serverCatalogPath = path.join(serverDir, "endpoints.json");
const serverIndexPath = path.join(serverDir, "README.md");
const removedRemoteDir = path.join(skillDir, "references", "remote-api");
const allowedMethods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const endpointIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const documentPathPattern = /^endpoints\/[a-z0-9-]+\.md$/;
const tokenLikePattern = /eyJ[A-Za-z0-9_-]{20,}\./;
const sensitiveDefaultKeys = new Set(["companyid", "userid", "user_password_id", "shopid", "device_ids", "to_company_id", "password", "passwd", "tfa", "proxyu", "proxyp", "cookie"]);

function assert(condition, message) { if (!condition) throw new Error(message); }
async function exists(target) { try { await access(target); return true; } catch { return false; } }
async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(target)));
    else if (entry.isFile()) files.push(target);
  }
  return files;
}
function assertPlainObject(value, label) { assert(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`); }
function assertRequiredSubset(required, defaults, label) {
  assert(Array.isArray(required), `${label} must be an array`);
  for (const name of required) assert(Object.hasOwn(defaults, name), `${label} field is not present in defaults: ${name}`);
}
function walk(value, visitor, key = "") {
  if (Array.isArray(value)) for (const item of value) walk(item, visitor, key);
  else if (value && typeof value === "object") for (const [childKey, childValue] of Object.entries(value)) walk(childValue, visitor, childKey);
  else visitor(key, value);
}

assert(!(await exists(removedRemoteDir)), "Removed remote API directory must not be present");

const localIndex = await readFile(localIndexPath, "utf8");
const localEntries = [...localIndex.matchAll(/\[([^\]]+)\]\(\.\/([^)]+\.md)\)\s*\|\s*`([^`]+)`/g)].map((match) => ({ name: match[1], file: match[2], endpoint: match[3] }));
const localFiles = (await readdir(localDir)).filter((name) => name.endsWith(".md") && name !== "README.md").sort();
assert(localEntries.length === 23, `Expected 23 local index entries, got ${localEntries.length}`);
assert(localFiles.length === 23, `Expected 23 local API documents, got ${localFiles.length}`);
assert(new Set(localEntries.map((entry) => entry.file)).size === localEntries.length, "Local API document links are not unique");
assert(new Set(localEntries.map((entry) => entry.endpoint)).size === localEntries.length, "Local API endpoints are not unique");
const indexedLocalFiles = new Set(localEntries.map((entry) => entry.file));
for (const file of localFiles) assert(indexedLocalFiles.has(file), `Local API document is missing from the index: ${file}`);
for (const entry of localEntries) {
  assert(localFiles.includes(entry.file), `Missing local API document: ${entry.file}`);
  const source = await readFile(path.join(localDir, entry.file), "utf8");
  const match = source.match(/(?:^|[:\s>])(GET|POST|PUT|PATCH|DELETE)\s+(\/\S+)/mi);
  assert(match, `Endpoint not detected in ${entry.file}`);
  const actual = `${match[1].toUpperCase()} ${match[2]}`;
  assert(actual === entry.endpoint, `Local endpoint mismatch for ${entry.file}: index has ${entry.endpoint}, document has ${actual}`);
}

const serverCatalog = JSON.parse(await readFile(serverCatalogPath, "utf8"));
const serverIndex = await readFile(serverIndexPath, "utf8");
assertPlainObject(serverCatalog, "Server catalog");
assert(serverCatalog.surface === "server", "Server catalog surface must be server");
assert(Array.isArray(serverCatalog.endpoints), "Server catalog must contain an endpoints array");
assert(Array.isArray(serverCatalog.business_success_codes), "Server catalog must contain business_success_codes");
assert(serverCatalog.business_success_codes.map(Number).includes(200), "Server success codes must include 200");
assert(serverCatalog.endpoints.length === 52, `Expected 52 server endpoints, got ${serverCatalog.endpoints.length}`);
assert(new Set(serverCatalog.endpoints.map((endpoint) => endpoint.id)).size === 52, "Server endpoint IDs are not unique");
assert(new Set(serverCatalog.endpoints.map((endpoint) => endpoint.document)).size === 52, "Server endpoint document paths are not unique");
const serverDocumentFiles = (await readdir(path.join(serverDir, "endpoints"))).filter((name) => name.endsWith(".md")).sort();
assert(serverDocumentFiles.length === serverCatalog.endpoints.length, `Expected ${serverCatalog.endpoints.length} server endpoint documents, got ${serverDocumentFiles.length}`);

const serverIndexRows = [...serverIndex.matchAll(/^\| `[^`]+` \| (GET|POST|PUT|PATCH|DELETE) \| `\/[^`]+` \|/gm)];
assert(serverIndexRows.length === serverCatalog.endpoints.length, `Expected ${serverCatalog.endpoints.length} server index rows, got ${serverIndexRows.length}`);

const identities = new Set();
for (const endpoint of serverCatalog.endpoints) {
  assert(endpointIdPattern.test(endpoint.id), `Invalid server endpoint ID: ${endpoint.id}`);
  assert(allowedMethods.has(endpoint.method), `Invalid server method for ${endpoint.id}`);
  assert(endpoint.path.startsWith("/") && !endpoint.path.includes("?"), `Invalid server path for ${endpoint.id}`);
  assert(documentPathPattern.test(endpoint.document), `Invalid server document path for ${endpoint.id}`);
  assertPlainObject(endpoint.tested, `tested for ${endpoint.id}`);
  assert([200, 404].includes(endpoint.tested.http_status), `Invalid tested HTTP status for ${endpoint.id}`);
  if (endpoint.tested.http_status === 200) assert(endpoint.tested.code === 200, `Tested success endpoint ${endpoint.id} must record code 200`);
  else assert(endpoint.tested.code === null, `Tested unavailable endpoint ${endpoint.id} must record code null`);
  const bodyDefaults = endpoint.body_defaults ?? {};
  const queryDefaults = endpoint.query_defaults ?? {};
  assertPlainObject(bodyDefaults, `body_defaults for ${endpoint.id}`);
  assertPlainObject(queryDefaults, `query_defaults for ${endpoint.id}`);
  assertRequiredSubset(endpoint.body_required ?? [], bodyDefaults, `body_required for ${endpoint.id}`);
  assertRequiredSubset(endpoint.query_required ?? [], queryDefaults, `query_required for ${endpoint.id}`);
  assert(Array.isArray(endpoint.redact_keys ?? []), `redact_keys for ${endpoint.id} must be an array`);
  const identity = `${endpoint.method} ${endpoint.path} ${JSON.stringify(queryDefaults)}`;
  assert(!identities.has(identity), `Duplicate server endpoint identity: ${identity}`);
  identities.add(identity);
  walk(bodyDefaults, (key, value) => { if (sensitiveDefaultKeys.has(key)) assert(value === "" || (Array.isArray(value) && value.length === 0), `Sensitive default must be empty in ${endpoint.id}: ${key}`); });
  walk(queryDefaults, (key, value) => { if (sensitiveDefaultKeys.has(key)) assert(value === "" || (Array.isArray(value) && value.length === 0), `Sensitive query default must be empty in ${endpoint.id}: ${key}`); });
  const documentPath = path.join(serverDir, endpoint.document);
  assert(await exists(documentPath), `Missing server endpoint document: ${endpoint.document}`);
  assert(serverIndex.includes(`(${endpoint.document})`), `Server endpoint document is missing from the index: ${endpoint.document}`);
  const source = await readFile(documentPath, "utf8");
  assert(source.includes("## Error Handling"), `Error handling section missing in ${endpoint.document}`);
  assert(source.includes("- Verified:"), `Verified marker missing in ${endpoint.document}`);
  assert(source.includes(`- Method: \`${endpoint.method}\``), `Method mismatch in ${endpoint.document}`);
  assert(source.includes(`- Path: \`${endpoint.path}\``), `Path mismatch in ${endpoint.document}`);
  assert(source.includes("## Request"), `Request section missing in ${endpoint.document}`);
  assert(source.includes("## Response"), `Response section missing in ${endpoint.document}`);
}

const skillSource = await readFile(path.join(skillDir, "SKILL.md"), "utf8");
const frontmatterMatch = skillSource.match(/^---\r?\n([\s\S]*?)\r?\n---/);
assert(frontmatterMatch, "SKILL.md frontmatter is missing");
const skillNameMatch = frontmatterMatch[1].match(/^name:\s*([a-z0-9-]+)\s*$/m);
assert(skillNameMatch, "SKILL.md name is missing or invalid");
const skillName = skillNameMatch[1];
assert(skillSource.includes("## Invocation And Execution"), "SKILL.md invocation rules are missing");
assert(skillSource.includes("## API Navigation"), "SKILL.md API navigation section is missing");
assert(skillSource.includes("query with the server API, launch with the local API"), "SKILL.md must state the server-query and local-launch rule");
assert(skillSource.includes("references/INDEX.md"), "SKILL.md must link the top-level API navigation");
const playwrightGuidePath = path.join(skillDir, "references", "workflows", "playwright-cli.md");
assert(await exists(playwrightGuidePath), "Playwright CLI pairing guide is missing");
const playwrightGuide = await readFile(playwrightGuidePath, "utf8");
assert(playwrightGuide.includes("@playwright/cli"), "Playwright guide must name the official package");
assert(playwrightGuide.includes("playwright-cli install --skills agents"), "Playwright guide must document the skill install command");
assert(playwrightGuide.includes("Do not install anything on your own initiative"), "Playwright guide must require asking the user before installing");
assert(playwrightGuide.includes("npm prefix -g"), "Playwright guide must document the PATH troubleshooting");
assert(skillSource.includes("ask the user before installing"), "SKILL.md must require asking before installing the Playwright CLI");
assert(skillSource.includes("references/workflows/playwright-cli.md"), "SKILL.md must link the Playwright CLI guide");
const navigationPath = path.join(skillDir, "references", "INDEX.md");
assert(await exists(navigationPath), "Top-level API navigation is missing");
const navigation = await readFile(navigationPath, "utf8");
assert(navigation.includes("## Rule Of Thumb"), "Navigation must explain the surface rule");
assert(navigation.includes("Launch, stop, or inspect"), "Navigation must route launching to the local API");
assert(navigation.includes("server API has no launch route") || navigation.includes("no launch route"), "Navigation must state that the server API cannot launch");
assert(navigation.includes("api/README.md"), "Navigation must link the local API index");
assert(navigation.includes("client-api/README.md"), "Navigation must link the local client API guide");
assert(navigation.includes("server-api/INDEX.md"), "Navigation must link the server API index");
for (const endpoint of serverCatalog.endpoints) {
  assert(navigation.includes(`\`${endpoint.id}\``), `Top-level navigation is missing ${endpoint.id}`);
  assert(navigation.includes(`(server-api/${endpoint.document})`), `Top-level navigation is missing the doc link for ${endpoint.id}`);
}
assert(navigation.includes("## Server API"), "Navigation must contain a server API section");
assert(skillSource.includes("author:"), "SKILL.md metadata must carry an author");
assert(skillSource.includes("version:"), "SKILL.md metadata must carry a version");
// Contact is optional. When it is present it must be a usable address.
const contactMatch = skillSource.match(/^\s*contact:\s*(\S+)\s*$/m);
if (contactMatch) {
  assert(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactMatch[1]), `metadata.contact must be an email address, got ${contactMatch[1]}`);
}
const repositoryMatch = skillSource.match(/^\s*repository:\s*(\S+)\s*$/m);
assert(repositoryMatch, "SKILL.md metadata must carry a repository URL");
assert(/^https:\/\//.test(repositoryMatch[1]), `metadata.repository must be an https URL, got ${repositoryMatch[1]}`);
const licenseMatch = skillSource.match(/^license:\s*(\S+)\s*$/m);
assert(licenseMatch, "SKILL.md frontmatter must declare a license");
const declaredLicense = licenseMatch[1];
const licensePath = path.join(skillDir, "LICENSE");
assert(await exists(licensePath), "LICENSE file is missing from the skill root");
const licenseText = await readFile(licensePath, "utf8");
assert(/^MIT License/m.test(licenseText), `LICENSE file must contain the ${declaredLicense} text`);
const authorMatch = skillSource.match(/^\s*author:\s*(\S+)\s*$/m);
assert(authorMatch, "SKILL.md metadata must carry an author");
assert(licenseText.includes(authorMatch[1]), "LICENSE copyright line must name the author declared in SKILL.md");
assert(declaredLicense === "MIT", `Frontmatter license must match the MIT LICENSE file, got ${declaredLicense}`);

// The repository keeps a root copy so hosting platforms can detect the license.
const rootLicensePath = path.join(skillDir, "..", "LICENSE");
if (await exists(rootLicensePath)) {
  const rootLicense = await readFile(rootLicensePath, "utf8");
  assert(rootLicense === licenseText, "The repository-root LICENSE must stay identical to the skill LICENSE");
}
const shortDescriptionMatch = skillSource.match(/^\s*short-description:\s*(.+)$/m);
assert(shortDescriptionMatch, "SKILL.md metadata must carry a short-description");
const metadataShort = shortDescriptionMatch[1].trim();
assert(metadataShort.length >= 25 && metadataShort.length <= 64, `metadata.short-description must be 25-64 characters, got ${metadataShort.length}`);
for (const entry of localEntries) {
  assert(navigation.includes(`(api/${entry.file})`), `Navigation is missing the local route ${entry.file}`);
}
assert(await exists(path.join(localDir, "README.md")), "Local API index is missing");
assert(skillSource.length < 12000, "SKILL.md must stay lean and route detail into references");
assert(skillSource.includes("references/server-api/TEST_REPORT.md"), "SKILL.md must link the server test report");
assert(skillSource.includes("## CDP Automation"), "SKILL.md CDP automation section is missing");
const agentConfigPath = path.join(skillDir, "agents", "openai.yaml");
const agentConfig = await readFile(agentConfigPath, "utf8");
assert(agentConfig.startsWith("interface:\n"), "agents/openai.yaml must start with interface");
function readAgentString(field) {
  const match = agentConfig.match(new RegExp(`^  ${field}: "([^"]*)"$`, "m"));
  assert(match, `agents/openai.yaml is missing ${field}`);
  return match[1];
}
const displayName = readAgentString("display_name");
const shortDescription = readAgentString("short_description");
const defaultPrompt = readAgentString("default_prompt");
assert(displayName.length > 0, "agents/openai.yaml display_name must not be empty");
assert(shortDescription.length >= 25 && shortDescription.length <= 64, "agents/openai.yaml short_description must be 25-64 characters");
assert(defaultPrompt.includes(`${skillName}`), `agents/openai.yaml default_prompt must mention ${skillName}`);
for (const field of ["icon_small", "icon_large"]) {
  const value = readAgentString(field);
  const assetPath = path.join(skillDir, value.replace(/^\.\//, ""));
  assert(await exists(assetPath), `${field} asset is missing: ${value}`);
}
// A file named icon-<N>.png must really be N x N, so a scaled-up placeholder cannot slip back in.
for (const assetFile of (await readdir(path.join(skillDir, "assets"))).filter((name) => /^icon-\d+\.png$/.test(name))) {
  const expected = Number.parseInt(assetFile.match(/^icon-(\d+)\.png$/)[1], 10);
  const buffer = await readFile(path.join(skillDir, "assets", assetFile));
  assert(buffer.subarray(1, 4).toString("ascii") === "PNG", `${assetFile} is not a PNG file`);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  assert(width === expected && height === expected, `${assetFile} must be ${expected}x${expected}, got ${width}x${height}`);
}
const brandColor = readAgentString("brand_color");
assert(/^#[0-9A-Fa-f]{6}$/.test(brandColor), `brand_color must be a hex colour, got ${brandColor}`);
assert(/^policy:\n  allow_implicit_invocation: (true|false)$/m.test(agentConfig), "agents/openai.yaml policy is missing or malformed");
assert(!/^dependencies:/m.test(agentConfig), "YunLogin Browser does not require MCP dependencies");

const cdpGuidePath = path.join(skillDir, "references", "workflows", "cdp-automation.md");
assert(await exists(cdpGuidePath), "CDP automation guide is missing");
const cdpGuide = await readFile(cdpGuidePath, "utf8");
assert(cdpGuide.includes("append_cmd"), "CDP guide must document append_cmd");
assert(cdpGuide.includes("--cdp-url"), "CDP guide must document external CDP URL input");
assert(cdpGuide.includes("data.ws.puppeteer"), "CDP guide must document the launch response CDP URL");
assert(cdpGuide.includes("YUNLOGIN_LOCAL_TOKEN"), "CDP guide must document local API token authentication");
assert(cdpGuide.includes("YUNLOGIN_LOCAL_COOKIE"), "CDP guide must document optional local API Cookie authentication");
assert(cdpGuide.includes("playwright-cli.md"), "CDP guide must link the Playwright CLI pairing guide");
assert(cdpGuide.includes("Ask the user before installing"), "CDP guide must require asking before installing the Playwright CLI");
assert(cdpGuide.includes("playwright-cli -s=yunlogin attach --cdp="), "CDP guide must document Playwright CLI attach");
assert(!cdpGuide.includes("%APPDATA%"), "CDP guide must not hardcode a machine-specific npm path");
assert(await exists(path.join(scriptsDir, "yunlogin-cdp.mjs")), "yunlogin-cdp.mjs is missing");
assert(await exists(path.join(scriptsDir, "lib", "local-token-store.mjs")), "local-token-store.mjs is missing");
assert(await exists(path.join(scriptsDir, "yunlogin-env.mjs")), "yunlogin-env.mjs is missing");
const lifecycleGuidePath = path.join(skillDir, "references", "workflows", "environment-lifecycle.md");
assert(await exists(lifecycleGuidePath), "Environment lifecycle guide is missing");
const lifecycleGuide = await readFile(lifecycleGuidePath, "utf8");
assert(lifecycleGuide.includes("putalluri"), "Environment lifecycle guide must document the server create route");
assert(lifecycleGuide.includes("user/delete"), "Environment lifecycle guide must document the local delete route");
assert(lifecycleGuide.includes("bootstrap-token"), "Environment lifecycle guide must document token bootstrap");
assert(skillSource.includes("environment-lifecycle.md"), "SKILL.md must link the environment lifecycle guide");
const localClientGuidePath = path.join(skillDir, "references", "client-api", "README.md");
assert(await exists(localClientGuidePath), "Local client API guide is missing");
const localClientGuide = await readFile(localClientGuidePath, "utf8");
assert(localClientGuide.includes("52446"), "Local client API guide must document the second loopback port");
assert(localClientGuide.includes("gpu_info"), "Local client API guide must document gpu_info");
assert(localClientGuide.includes("get_config"), "Local client API guide must document get_config");
assert(localClientGuide.includes("ossToken"), "Local client API guide must flag the get_config credential");
assert(localClientGuide.includes("cookieMd5"), "Local client API guide must flag the get_config cookie map");
const errorsGuidePath = path.join(serverDir, "ERRORS.md");
assert(await exists(errorsGuidePath), "Server error contract guide is missing");
const errorsGuide = await readFile(errorsGuidePath, "utf8");
assert(errorsGuide.includes("1001"), "Error guide must document the token error code");
assert(errorsGuide.includes("4020"), "Error guide must document the duplicate-record code");
assert(errorsGuide.includes("--dry-run"), "Error guide must tell callers to probe with dry-run");
assert(skillSource.includes("ERRORS.md"), "SKILL.md must link the error contract guide");
const tagColorGuidePath = path.join(serverDir, "tag-colors.md");
assert(await exists(tagColorGuidePath), "Tag colour guide is missing");
const tagColorGuide = await readFile(tagColorGuidePath, "utf8");
assert(tagColorGuide.includes("#B84DFF"), "Tag colour guide must list all eight colours");
assert(tagColorGuide.includes("do not validate"), "Tag colour guide must record the server validation gap");
assert(await exists(path.join(scriptsDir, "lib", "tag-colors.mjs")), "tag-colors.mjs is missing");
const testReportPath = path.join(serverDir, "TEST_REPORT.md");
assert(await exists(testReportPath), "Server test report is missing");
const testReport = await readFile(testReportPath, "utf8");
const reportRows = [...testReport.matchAll(/^\| \`([a-z0-9-]+)\` \| (GET|POST|PUT|PATCH|DELETE) \|/gm)].map((match) => match[1]);
assert(reportRows.length === serverCatalog.endpoints.length, `Test report must cover every cataloged endpoint: ${reportRows.length} of ${serverCatalog.endpoints.length}`);
for (const endpoint of serverCatalog.endpoints) {
  assert(reportRows.includes(endpoint.id), `Test report is missing ${endpoint.id}`);
}
assert(testReport.includes("HTTP 404, route not served"), "Test report must list the unavailable routes");
const indexGuidePath = path.join(serverDir, "INDEX.md");
assert(await exists(indexGuidePath), "Server API index is missing");
const indexGuide = await readFile(indexGuidePath, "utf8");
for (const endpoint of serverCatalog.endpoints) {
  assert(indexGuide.includes(`\`${endpoint.id}\``), `Server index is missing ${endpoint.id}`);
  assert(indexGuide.includes(`(${endpoint.document})`), `Server index is missing the doc link for ${endpoint.id}`);
}
assert(indexGuide.includes("## Find By Task"), "Server index must offer task-based navigation");
const writeIds = serverCatalog.endpoints.filter((endpoint) => endpoint.mutation === true).map((endpoint) => endpoint.id);
assert(writeIds.length === 7, `Expected 7 mutation endpoints, got ${writeIds.length}`);
for (const id of writeIds) {
  const row = indexGuide.split("\n").find((line) => line.startsWith(`| \`${id}\` |`));
  assert(row, `Server index must list ${id}`);
  assert(row.includes("| write |"), `Server index must flag ${id} as a write`);
}
assert(skillSource.includes("server-api/INDEX.md"), "SKILL.md must link the server API index");
const tagColorsSource = await readFile(path.join(scriptsDir, "lib", "tag-colors.mjs"), "utf8");
assert(tagColorsSource.includes("resolveTagColor"), "tag-colors.mjs must validate colour input");
const envHelperSource = await readFile(path.join(scriptsDir, "yunlogin-env.mjs"), "utf8");
assert(envHelperSource.includes("resolveTagColor"), "yunlogin-env.mjs must validate the tag colour");
assert(skillSource.includes("tag-colors.md"), "SKILL.md must link the tag colour guide");
assert(lifecycleGuide.includes("putdeleteshop"), "Environment lifecycle guide must document the server delete route");
assert(lifecycleGuide.includes("confirm-attributes"), "Environment lifecycle guide must document attribute confirmation");
assert(lifecycleGuide.includes("confirm-delete"), "Environment lifecycle guide must document delete confirmation");
assert(lifecycleGuide.includes("normalize"), "Environment lifecycle guide must document name normalization");
assert(lifecycleGuide.includes("clean_env"), "Environment lifecycle guide must document the local clean route");
assert(!lifecycleGuide.includes("has no delete route"), "Environment lifecycle guide must not claim the server has no delete route");
assert(skillSource.includes("--confirm-attributes"), "SKILL.md must document attribute confirmation");
assert(skillSource.includes("--confirm-delete"), "SKILL.md must document delete confirmation");
const envHelperPath = path.join(scriptsDir, "yunlogin-env.mjs");
const envHelper = await readFile(envHelperPath, "utf8");
assert(envHelper.includes("normalizeName"), "yunlogin-env.mjs must normalize names");
assert(envHelper.includes("putdeleteshop"), "yunlogin-env.mjs must use the server delete route");
assert(envHelper.includes("confirmDelete"), "yunlogin-env.mjs must gate deletes behind confirmation");
assert(envHelper.includes("confirmAttributes"), "yunlogin-env.mjs must gate attributes behind confirmation");
assert(envHelper.includes("/api/v1/client/clean_env"), "yunlogin-env.mjs must expose the local clean route");
assert(await exists(path.join(scriptsDir, "yunlogin-auth.mjs")), "yunlogin-auth.mjs is missing");
const authHelper = await readFile(path.join(scriptsDir, "yunlogin-auth.mjs"), "utf8");
assert(authHelper.includes("save-server-token"), "yunlogin-auth.mjs must expose save-server-token");
assert(authHelper.includes("ensure-server"), "yunlogin-auth.mjs must expose ensure-server");
assert(authHelper.includes("ensure-local"), "yunlogin-auth.mjs must expose ensure-local");
const tokenStore = await readFile(path.join(scriptsDir, "lib", "local-token-store.mjs"), "utf8");
assert(tokenStore.includes("server-token.json"), "local-token-store.mjs must define the server session cache");
assert(tokenStore.includes("readServerIdentity"), "local-token-store.mjs must expose the cached identity");
const tokenGuidePath = path.join(skillDir, "references", "workflows", "token-lifecycle.md");
assert(await exists(tokenGuidePath), "Token lifecycle guide is missing");
const tokenGuide = await readFile(tokenGuidePath, "utf8");
assert(tokenGuide.includes("local-token.json") && tokenGuide.includes("server-token.json"), "Token lifecycle guide must document both cache files");
assert(tokenGuide.includes("save-server-token"), "Token lifecycle guide must document saving the server token");
assert(tokenGuide.includes("needsNewToken"), "Token lifecycle guide must document stale-token handling");
assert(skillSource.includes("token-lifecycle.md"), "SKILL.md must link the token lifecycle guide");
assert(!tokenStore.includes("console.log"), "The token store must not log token material");
assert(cdpGuide.includes("capture-local-token"), "CDP guide must document capture-local-token");
assert(cdpGuide.includes("DOMStorage"), "CDP guide must document the DOMStorage read path");
assert(cdpGuide.includes("YUNLOGIN_LOCAL_TOKEN_FILE"), "CDP guide must document the token cache override");
assert(cdpGuide.includes("yunlogin-browser") && cdpGuide.includes("local-token.json"), "CDP guide must document the user-level token cache path");
assert(cdpGuide.includes("YUNLOGIN_SERVER_TOKEN"), "CDP guide must separate the local token from the server token");

const testingPath = path.join(skillDir, "references", "testing.md");
assert(await exists(testingPath), "Test coverage document is missing");
const testingGuide = await readFile(testingPath, "utf8");
assert(testingGuide.includes("All 23 documented local API routes were exercised"), "Local API test coverage summary is missing");
assert(testingGuide.includes("All 52 cataloged server routes were tested"), "Server API test coverage summary is missing");
assert(testingGuide.includes("Environment Lifecycle"), "Environment lifecycle coverage is missing");
assert(testingGuide.includes("putalluri"), "Environment create evidence is missing");
assert(testingGuide.includes("Playwright CLI"), "Playwright CLI test coverage is missing");
assert(testingGuide.includes("107 Kernel CDP Verification"), "107 kernel CDP verification is missing");
assert(testingGuide.includes("Workbench CDP Investigation"), "Workbench CDP investigation is missing");
assert(testingGuide.includes("does not expose an attachable CDP endpoint"), "Workbench CDP conclusion is missing");
assert(testingGuide.includes("HeadlessChrome/107.0.5304.114"), "107 kernel headless version evidence is missing");
assert(testingGuide.includes("Extension Token Bootstrap"), "Extension token bootstrap coverage is missing");
assert(testingGuide.includes("capture-local-token"), "Extension token capture evidence is missing");

const scriptsReadme = await readFile(path.join(scriptsDir, "README.md"), "utf8");
assert(scriptsReadme.includes("capture-local-token"), "scripts/README.md must document capture-local-token");
assert(scriptsReadme.includes("local-token-store.mjs"), "scripts/README.md must document local-token-store.mjs");

for (const file of await listFiles(skillDir)) {
  assert(path.basename(file) !== "local-token.json", `Token cache must not live inside the skill: ${path.relative(skillDir, file)}`);
  assert(path.basename(file) !== "server-token.json", `Server session cache must not live inside the skill: ${path.relative(skillDir, file)}`);
  if (![".md", ".json", ".mjs", ".yaml"].includes(path.extname(file))) continue;
  const source = await readFile(file, "utf8");
  const relative = path.relative(skillDir, file);
  assert(!/[\u4e00-\u9fff]/.test(source), `Chinese text found in ${relative}`);
  assert(!/[^\x00-\x7F]/.test(source), `Non-ASCII text found in ${relative}`);
  assert(!tokenLikePattern.test(source), `Token-like value found in ${relative}`);
}

// Link integrity: a reorganisation must not leave a dangling reference.
const linkPattern = /\]\((?!https?:|#)([^)#]+\.md)(#[^)]*)?\)/g;
let checkedLinks = 0;
for (const file of await listFiles(skillDir)) {
  if (path.extname(file) !== ".md") continue;
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(linkPattern)) {
    checkedLinks += 1;
    const target = path.resolve(path.dirname(file), match[1]);
    assert(await exists(target), `Broken markdown link in ${path.relative(skillDir, file)}: ${match[1]}`);
  }
}
assert(checkedLinks > 250, `Expected the documentation set to contain hundreds of links, checked ${checkedLinks}`);

// Script path integrity: a "scripts/...mjs" reference must resolve too.
const scriptPathPattern = /scripts\/((?:[a-z0-9-]+\/)*[a-z0-9-]+\.mjs)/g;
let checkedScriptPaths = 0;
for (const file of await listFiles(skillDir)) {
  if (![".md", ".mjs", ".yaml"].includes(path.extname(file))) continue;
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(scriptPathPattern)) {
    checkedScriptPaths += 1;
    const target = path.join(skillDir, "scripts", match[1]);
    assert(await exists(target), `Script path in ${path.relative(skillDir, file)} does not exist: scripts/${match[1]}`);
  }
}
assert(checkedScriptPaths > 200, `Expected hundreds of script references, checked ${checkedScriptPaths}`);

console.log(`Validated ${localFiles.length} local API documents.`);
console.log(`Validated ${serverCatalog.endpoints.length} server API documents.`);