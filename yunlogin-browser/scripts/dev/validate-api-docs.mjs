#!/usr/bin/env node

import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { routeSafetyReason } from "../lib/route-safety.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const scriptsDir = path.resolve(scriptDir, "..");
const skillDir = path.resolve(scriptDir, "..", "..");
const localDir = path.join(skillDir, "references", "api");
const localIndexPath = path.join(localDir, "INDEX.md");
const serverDir = path.join(skillDir, "references", "server-api");
const serverCatalogPath = path.join(serverDir, "endpoints.json");
const serverIndexPath = path.join(serverDir, "INDEX.md");
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
const localFiles = (await readdir(localDir)).filter((name) => name.endsWith(".md") && name !== "INDEX.md").sort();
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
assert(serverCatalog.endpoints.length === 54, `Expected 54 server endpoints, got ${serverCatalog.endpoints.length}`);
assert(new Set(serverCatalog.endpoints.map((endpoint) => endpoint.id)).size === 54, "Server endpoint IDs are not unique");
assert(new Set(serverCatalog.endpoints.map((endpoint) => endpoint.document)).size === 54, "Server endpoint document paths are not unique");
const serverDocumentFiles = (await readdir(path.join(serverDir, "endpoints"))).filter((name) => name.endsWith(".md")).sort();
assert(serverDocumentFiles.length === serverCatalog.endpoints.length, `Expected ${serverCatalog.endpoints.length} server endpoint documents, got ${serverDocumentFiles.length}`);

// The index is the entry point, so every research deliverable must stay reachable from it.
assert(serverIndex.includes("(RESEARCH_SUMMARY.md)"), "Server index must link RESEARCH_SUMMARY.md");
assert(serverIndex.includes("(BLOCKLIST.md)"), "Server index must link BLOCKLIST.md");
assert(serverIndex.includes("(ENUM_MEANINGS.md)"), "Server index must link ENUM_MEANINGS.md");
assert(serverIndex.includes("(PARAM_ERRORS.md)"), "Server index must link PARAM_ERRORS.md");
assert(serverIndex.includes("(BUNDLE_DRIFT.md)"), "Server index must link BUNDLE_DRIFT.md");
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
assert(skillSource.includes("--dry-run"), "SKILL.md must require a dry run before the first live call");
assert(skillSource.includes("references/INDEX.md"), "SKILL.md must link the full API map");
assert(skillSource.includes("query with the server API, launch with the local API"), "SKILL.md must state the server-query and local-launch rule");
assert(skillSource.includes("references/INDEX.md"), "SKILL.md must link the top-level API navigation");
const playwrightGuidePath = path.join(skillDir, "references", "workflows", "playwright-cli.md");
assert(await exists(playwrightGuidePath), "Playwright CLI pairing guide is missing");
const playwrightGuide = await readFile(playwrightGuidePath, "utf8");
assert(playwrightGuide.includes("@playwright/cli"), "Playwright guide must name the official package");
assert(playwrightGuide.includes("playwright-cli install --skills agents"), "Playwright guide must document the skill install command");
assert(playwrightGuide.includes("ask whether to install it") && playwrightGuide.includes("ask before writing it"), "Playwright guide must require asking before installing the CLI and skill");
assert(playwrightGuide.includes("npm prefix -g"), "Playwright guide must document the PATH troubleshooting");
assert(skillSource.includes("ask before installing"), "SKILL.md must require asking before installing the Playwright CLI");
assert(skillSource.includes("references/workflows/playwright-cli.md"), "SKILL.md must link the Playwright CLI guide");
const environmentInputsPath = path.join(skillDir, "references", "workflows", "environment-inputs.md");
assert(await exists(environmentInputsPath), "Environment input source guide is missing");
const environmentInputs = await readFile(environmentInputsPath, "utf8");
assert(environmentInputs.includes("getfingerprinturi") && environmentInputs.includes("putalluri"), "Environment input guide must tie reads to the putalluri write");
assert(environmentInputs.includes("array") && environmentInputs.includes("string"), "Environment input guide must state the field type rules");
assert(environmentInputs.includes("browser.shopid"), "Environment input guide must describe the putalluri upsert key");
assert(skillSource.includes("references/workflows/environment-inputs.md"), "SKILL.md must link the environment input guide");
const doctorPath = path.join(scriptsDir, "yunlogin-doctor.mjs");
assert(await exists(doctorPath), "Skill self-test script is missing");
assert(await exists(path.join(scriptsDir, "yunlogin-fb-cdp.mjs")), "fb.exe CDP helper is missing");
assert(await exists(path.join(scriptsDir, "dev", "probe-server-api.mjs")), "Server field probe is missing");
assert(await exists(path.join(scriptsDir, "dev", "render-field-inventory.mjs")), "Server field inventory renderer is missing");
assert(await exists(path.join(scriptsDir, "dev", "render-field-values.mjs")), "Server field value renderer is missing");
assert(await exists(path.join(scriptsDir, "dev", "probe-code-legends.mjs")), "Server code legend probe is missing");
assert(await exists(path.join(scriptsDir, "dev", "render-code-legends.mjs")), "Server code legend renderer is missing");
assert(await exists(path.join(scriptsDir, "dev", "render-domain-index.mjs")), "Server domain index renderer is missing");
assert(await exists(path.join(scriptsDir, "dev", "render-coverage.mjs")), "Coverage renderer is missing");
assert(await exists(path.join(scriptsDir, "dev", "verify-audit-gates.mjs")), "Audit gate verifier is missing");
assert(await exists(path.join(scriptsDir, "dev", "check-links.mjs")), "Link checker is missing");
assert(await exists(path.join(scriptsDir, "dev", "start-forward-test.mjs")), "Forward-test scaffolder is missing");
assert(await exists(path.join(scriptsDir, "dev", "probe-request-params.mjs")), "Request parameter probe is missing");
assert(await exists(path.join(scriptsDir, "dev", "render-request-params.mjs")), "Request parameter renderer is missing");
assert(await exists(path.join(scriptsDir, "dev", "detect-route-drift.mjs")), "Route drift detector is missing");
assert(await exists(path.join(scriptsDir, "lib", "resolved-calls.mjs")), "Resolved route call list is missing");
assert(await exists(path.join(scriptsDir, "dev", "probe-write-effectiveness.mjs")), "Write effectiveness probe is missing");
assert(await exists(path.join(scriptsDir, "dev", "render-write-effectiveness.mjs")), "Write effectiveness renderer is missing");
assert(await exists(path.join(scriptsDir, "dev", "probe-delete-semantics.mjs")), "Delete semantics probe is missing");
assert(await exists(path.join(scriptsDir, "dev", "render-delete-semantics.mjs")), "Delete semantics renderer is missing");
assert(await exists(path.join(scriptsDir, "dev", "run-api-audit.mjs")), "End-to-end audit runner is missing");
assert(await exists(path.join(scriptsDir, "dev", "mine-bundle-enums.mjs")), "Bundle enum miner is missing");
assert(await exists(path.join(scriptsDir, "dev", "mine-i18n-labels.mjs")), "i18n label miner is missing");
assert(await exists(path.join(scriptsDir, "lib", "route-safety.mjs")), "Shared route safety classifier is missing");
assert(await exists(path.join(scriptsDir, "dev", "fixtures", "route-safety-cases.json")), "Route safety regression fixtures are missing");

// Regression cases for the classifier. A change that makes a blocked route look readable would
// re-open the junk-creating and money-spending paths the probes must never touch.
const safetyFixtures = JSON.parse(await readFile(path.join(scriptsDir, "dev", "fixtures", "route-safety-cases.json"), "utf8"));
const safetyMisses = [];
for (const item of safetyFixtures.cases) {
  const reason = routeSafetyReason({ method: item.method, path: item.path, name: item.name });
  const blocked = reason !== "read";
  const expectedBlocked = item.expect === "blocked";
  if (blocked !== expectedBlocked) safetyMisses.push(`${item.method} ${item.path} expected ${item.expect} but got ${reason} (${item.why})`);
}
assert(safetyMisses.length === 0, `route-safety regression cases failed:\n  ${safetyMisses.join("\n  ")}`);
assert(await exists(path.join(serverDir, "FIELD_INVENTORY.md")), "Server field inventory is missing");
assert(await exists(path.join(serverDir, "FIELD_VALUES.md")), "Server field value domains are missing");
assert(await exists(path.join(serverDir, "CODE_LEGENDS.md")), "Server code legends are missing");
assert(await exists(path.join(serverDir, "DOMAIN_INDEX.md")), "Server domain index is missing");
assert(await exists(path.join(serverDir, "REQUEST_PARAMS.md")), "Request parameter contract is missing");
assert(await exists(path.join(serverDir, "DRIFT.md")), "Route drift report is missing");
assert(await exists(path.join(serverDir, "COVERAGE.md")), "Research coverage summary is missing");
assert(await exists(path.join(serverDir, "WRITE_EFFECTIVENESS.md")), "Write effectiveness evidence is missing");
assert(await exists(path.join(serverDir, "DELETE_SEMANTICS.md")), "Delete semantics evidence is missing");
assert(await exists(path.join(serverDir, "route-baseline.json")), "Route drift baseline is missing");
assert(skillSource.includes("yunlogin-doctor.mjs"), "SKILL.md must document the skill self-test");
const navigationPath = path.join(skillDir, "references", "INDEX.md");
assert(await exists(navigationPath), "Top-level API navigation is missing");
const navigation = await readFile(navigationPath, "utf8");
assert(navigation.includes("Local API") && navigation.includes("Server API"), "Navigation must name both the local and the server surface");
assert(navigation.includes("environment-inputs.md"), "Top-level API navigation must link the environment input guide");
assert(navigation.includes("/api/v2/browser/start"), "Navigation must route launching to the local launch route");
assert(!/\| \*\*Start an environment\*\* \| Server/.test(navigation), "Navigation must not route launching to the server API");
assert(navigation.includes("api/INDEX.md"), "Navigation must link the local API index");
assert(navigation.includes("client-api/INDEX.md"), "Navigation must link the local client API guide");
assert(navigation.includes("server-api/INDEX.md"), "Navigation must link the server API index");
for (const endpoint of serverCatalog.endpoints) {
  assert(navigation.includes(`\`${endpoint.id}\``), `Top-level navigation is missing ${endpoint.id}`);
  assert(navigation.includes(`(server-api/${endpoint.document})`), `Top-level navigation is missing the doc link for ${endpoint.id}`);
}
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
assert(await exists(path.join(localDir, "INDEX.md")), "Local API index is missing");
assert(skillSource.length < 12000, "SKILL.md must stay lean and route detail into references");
assert(skillSource.includes("references/server-api/TEST_REPORT.md"), "SKILL.md must link the server test report");
assert(skillSource.includes("/api/v2/browser/start"), "SKILL.md must name the local launch route");
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
assert(cdpGuide.includes("sync-workbench"), "CDP guide must distinguish management session synchronization");
assert(cdpGuide.includes("Legacy token") || cdpGuide.includes("legacy token"), "CDP guide must distinguish legacy token sources from the active Workbench session");
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
const localClientGuidePath = path.join(skillDir, "references", "client-api", "INDEX.md");
assert(await exists(localClientGuidePath), "Local client API guide is missing");
const localClientGuide = await readFile(localClientGuidePath, "utf8");
assert(localClientGuide.includes("Port Discovery"), "Local client API guide must document client port discovery");
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
assert((tagColorGuide.match(/#[0-9A-Fa-f]{6}\b/g) ?? []).length >= 8, "Tag colour guide must list all eight colours");
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
// The summary must agree with the catalog it summarises, and the three routes that used to look
// unavailable must stay documented by their real method. A wrong HTTP method answers 404 here, so a
// bare wording check on "route not served" would freeze the stale pre-correction conclusion.
assert(testReport.includes(`| Total cataloged routes | ${serverCatalog.endpoints.length} |`), "Test report summary must state the catalog total");
for (const id of ["current-company-info", "team-authentication-get", "company-user-devices"]) {
  assert(testReport.includes(`\`${id}\``), `Test report must record the method-corrected route ${id}`);
}
const indexGuidePath = path.join(serverDir, "INDEX.md");
assert(await exists(indexGuidePath), "Server API index is missing");
const indexGuide = await readFile(indexGuidePath, "utf8");
for (const endpoint of serverCatalog.endpoints) {
  assert(indexGuide.includes(`\`${endpoint.id}\``), `Server index is missing ${endpoint.id}`);
  assert(indexGuide.includes(`(${endpoint.document})`), `Server index is missing the doc link for ${endpoint.id}`);
}
assert(indexGuide.includes("| I want to |"), "Server index must keep a task-based lookup table");
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

// The creation payload must carry a concrete proxy block, otherwise the server
// stores an empty one and the environment is listed as "proxy deleted".
assert(envHelperSource.includes("deviceType: \"local\""), "yunlogin-env.mjs must send a concrete proxy deviceType");
assert(envHelperSource.includes("inlie: \"local\""), "yunlogin-env.mjs must send a concrete proxy inlie");
assert(envHelperSource.includes("region: \"random-random-random\""), "yunlogin-env.mjs must send a concrete proxy region");
assert(envHelperSource.includes("ipChannel: \"ipinfo\""), "yunlogin-env.mjs must send a concrete proxy ipChannel");
assert(envHelperSource.includes('cookie: "[]"'), "yunlogin-env.mjs must send a valid accounts cookie value");
const createDoc = await readFile(path.join(serverDir, "endpoints", "environment-create.md"), "utf8");
assert(createDoc.includes("proxy deleted"), "environment-create.md must warn about the proxy-deleted symptom");
assert(createDoc.includes("deviceType"), "environment-create.md must document the proxy block");
const lifecycleDoc = await readFile(path.join(skillDir, "references", "workflows", "environment-lifecycle.md"), "utf8");
assert(lifecycleDoc.includes("Proxy Configuration"), "Environment lifecycle guide must document proxy configuration");
assert(lifecycleDoc.includes("random-random-random"), "Environment lifecycle guide must show the direct proxy template");
assert(lifecycleDoc.includes("user/update"), "Environment lifecycle guide must document how to repair a blank proxy block");
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
assert(authHelper.includes("sync-workbench"), "yunlogin-auth.mjs must expose sync-workbench");
assert(authHelper.includes("ensure-server"), "yunlogin-auth.mjs must expose ensure-server");
assert(authHelper.includes("ensure-local"), "yunlogin-auth.mjs must reject legacy ensure-local");
assert(authHelper.includes("workbenchStatus"), "yunlogin-auth.mjs must compare the live Workbench session");
const serverHelper = await readFile(path.join(scriptsDir, "yunlogin-server-api.mjs"), "utf8");
assert(serverHelper.includes("requires_auth"), "yunlogin-server-api.mjs must honor public endpoints");
assert(serverHelper.includes("header_defaults"), "yunlogin-server-api.mjs must apply catalog header defaults");
const loginEndpoint = serverCatalog.endpoints.find((endpoint) => endpoint.id === "sso-login");
assert(loginEndpoint?.path === "/v2/sso/login", "sso-login catalog entry is missing the login route");
assert(loginEndpoint?.requires_auth === false, "sso-login must be marked as a public endpoint");
const tokenStore = await readFile(path.join(scriptsDir, "lib", "local-token-store.mjs"), "utf8");
assert(tokenStore.includes("readWorkbenchSession"), "local-token-store.mjs must read the Workbench session cache");
assert(tokenStore.includes("readServerIdentity"), "local-token-store.mjs must expose the cached identity");
const tokenGuidePath = path.join(skillDir, "references", "workflows", "token-lifecycle.md");
assert(await exists(tokenGuidePath), "Token lifecycle guide is missing");
const tokenGuide = await readFile(tokenGuidePath, "utf8");
assert(tokenGuide.includes("workbench-session.json"), "Token lifecycle guide must document the active Workbench cache");
assert(tokenGuide.includes("sync-workbench"), "Token lifecycle guide must document synchronization");
assert(tokenGuide.includes("synchronization invalidates"), "Token lifecycle guide must document failed synchronization");
assert(skillSource.includes("token-lifecycle.md"), "SKILL.md must link the token lifecycle guide");
assert(!tokenStore.includes("console.log"), "The token store must not log token material");
assert(cdpGuide.includes("sync-workbench"), "CDP guide must document Workbench credential synchronization");
assert(cdpGuide.includes("management-center page"), "CDP guide must separate management credentials from browser CDP attachment");
assert(/legacy token/i.test(cdpGuide), "CDP guide must reject legacy token fallback");
assert(cdpGuide.includes("yunlogin-fb-cdp.mjs"), "CDP guide must document the fb.exe relaunch helper");
assert(cdpGuide.includes("--confirm-restart"), "CDP guide must require confirmation before restarting fb.exe");

const testingPath = path.join(skillDir, "references", "testing.md");
assert(await exists(testingPath), "Test coverage document is missing");
const testingGuide = await readFile(testingPath, "utf8");
assert(testingGuide.includes("All 23 documented local API routes were exercised"), "Local API test coverage summary is missing");
assert(testingGuide.includes("All 54 cataloged server routes were tested"), "Server API test coverage summary is missing");
assert(testingGuide.includes("Environment Lifecycle"), "Environment lifecycle coverage is missing");
assert(testingGuide.includes("putalluri"), "Environment create evidence is missing");
assert(testingGuide.includes("Playwright CLI"), "Playwright CLI test coverage is missing");
// Discoverability and the required skill-creator testing procedure, not a heading check.
assert(testingGuide.includes("(server-api/TEST_REPORT.md)"), "testing.md must link the server test report");
assert(/isolat/i.test(testingGuide) && /forward test/i.test(testingGuide), "testing.md must document the isolated forward-test procedure");
assert(testingGuide.includes("does not expose an attachable CDP endpoint"), "Workbench CDP conclusion is missing");
assert(testingGuide.includes("HeadlessChrome/107.0.5304.114"), "107 kernel headless version evidence is missing");
assert(testingGuide.includes("token-lifecycle.md"), "Testing notes must link the token lifecycle workflow");
assert(testingGuide.includes("capture-local-token"), "Extension token capture evidence is missing");
assert(testingGuide.includes("fb.exe CDP Relaunch"), "fb.exe CDP relaunch test coverage is missing");
assert(testingGuide.includes("FIELD_INVENTORY.md"), "Testing notes must link the field inventory");

const scriptsReadme = await readFile(path.join(skillDir, "references", "scripts.md"), "utf8");
assert(scriptsReadme.includes("sync-workbench"), "references/scripts.md must document sync-workbench");
assert(scriptsReadme.includes("local-token-store.mjs"), "references/scripts.md must document local-token-store.mjs");
assert(scriptsReadme.includes("yunlogin-fb-cdp.mjs"), "references/scripts.md must document yunlogin-fb-cdp.mjs");
assert(scriptsReadme.includes("FIELD_INVENTORY.md"), "references/scripts.md must document the field inventory renderer");
assert(scriptsReadme.includes("FIELD_VALUES.md"), "references/scripts.md must document the field value renderer");
assert(scriptsReadme.includes("probe-code-legends.mjs"), "references/scripts.md must document the code legend probe");
assert(scriptsReadme.includes("DOMAIN_INDEX.md"), "references/scripts.md must document the domain index renderer");
assert(scriptsReadme.includes("REQUEST_PARAMS.md"), "references/scripts.md must document the request parameter renderer");
assert(scriptsReadme.includes("detect-route-drift.mjs"), "references/scripts.md must document the route drift detector");
assert(scriptsReadme.includes("WRITE_EFFECTIVENESS.md"), "references/scripts.md must document the write effectiveness renderer");
assert(scriptsReadme.includes("DELETE_SEMANTICS.md"), "references/scripts.md must document the delete semantics renderer");
assert(scriptsReadme.includes("run-api-audit.mjs"), "references/scripts.md must document the end-to-end audit runner");
assert(scriptsReadme.includes("mine-i18n-labels.mjs"), "references/scripts.md must document the i18n label miner");
assert(scriptsReadme.includes("check-bundle-drift.mjs"), "references/scripts.md must document the bundle drift checker");
assert(scriptsReadme.includes("render-blocklist.mjs"), "references/scripts.md must document the withheld-route renderer");
assert(scriptsReadme.includes("render-param-errors.mjs"), "references/scripts.md must document the parameter-error renderer");
assert(scriptsReadme.includes("sweep-all-routes.mjs"), "references/scripts.md must document the full-surface sweep");
assert(scriptsReadme.includes("reprobe-resolved-routes.mjs"), "references/scripts.md must document the resolved-route re-probe");
assert(scriptsReadme.includes("probe-field-types.mjs"), "references/scripts.md must document the request-field type probe");
assert(scriptsReadme.includes("client-bundle.mjs"), "references/scripts.md must document the bundle discovery helper");
assert(scriptsReadme.includes("route-safety.mjs"), "references/scripts.md must document the shared route safety classifier");
assert(scriptsReadme.includes("COVERAGE.md"), "references/scripts.md must document the coverage renderer");
assert(scriptsReadme.includes("verify-audit-gates.mjs"), "references/scripts.md must document the audit gate verifier");
assert(scriptsReadme.includes("check-links.mjs"), "references/scripts.md must document the link checker");
assert(scriptsReadme.includes("start-forward-test.mjs"), "references/scripts.md must document the forward-test scaffolder");
assert(scriptsReadme.includes("--audit"), "references/scripts.md must document the doctor audit mode");

// Files that intentionally preserve raw API evidence may contain UTF-8 (for example
// a Chinese `msg` value captured from a live response). Prose documents and code
// stay ASCII-only; the token-leak guard still runs against every file.
// Self-test hook for the gate verifier: a deliberate failure proves the validator exits non-zero.
if (process.argv.includes("--fault")) assert(false, "injected validator fault");

const utf8EvidencePatterns = [
  /^references[\\/]server-api[\\/]ROUTE_FIELDS\.md$/,
  /^references[\\/]server-api[\\/]ROUTE_CATALOG\.md$/,
  /^references[\\/]server-api[\\/]CLIENT_CALLSITES\.md$/,
  /^references[\\/]server-api[\\/]WRITE_ROUTE_PARAMS\.md$/,
  /^references[\\/]server-api[\\/]WRITE_ROUNDTRIPS\.md$/,
  /^references[\\/]server-api[\\/]RESPONSE_SHAPES\.md$/,
  /^references[\\/]server-api[\\/]ERRORS\.md$/,
  /^references[\\/]server-api[\\/]TEST_REPORT\.md$/,
  /^references[\\/]server-api[\\/]client-callsites\.json$/,
  /^references[\\/]server-api[\\/]client-params\.json$/,
  /^references[\\/]server-api[\\/]route-sweep\.json$/,
  /^references[\\/]server-api[\\/]PARAMETER_MATRIX\.md$/,
  /^references[\\/]server-api[\\/]PARAM_ERRORS\.md$/,
  /^references[\\/]server-api[\\/]ENUM_MEANINGS\.md$/,
  /^references[\\/]server-api[\\/]FIELD_VALUES\.md$/,
  /^references[\\/]server-api[\\/]FIELD_INVENTORY\.md$/, // field meanings quote the client i18n label
  /^references[\\/]server-api[\\/]CODE_LEGENDS\.md$/,
  /^references[\\/]server-api[\\/]DOMAIN_INDEX\.md$/,
  /^references[\\/]server-api[\\/]COVERAGE\.md$/,
  /^references[\\/]server-api[\\/]endpoints[\\/][a-z0-9-]+\.md$/,
  /^scripts[\\/]dev[\\/]render-route-catalog\.mjs$/,
  /^scripts[\\/]dev[\\/]render-write-params\.mjs$/,
];
function allowsUtf8Evidence(relative) {
  return utf8EvidencePatterns.some((pattern) => pattern.test(relative));
}
for (const file of await listFiles(skillDir)) {
  assert(path.basename(file) !== "local-token.json", `Token cache must not live inside the skill: ${path.relative(skillDir, file)}`);
  assert(path.basename(file) !== "server-token.json", `Server session cache must not live inside the skill: ${path.relative(skillDir, file)}`);
  if (![".md", ".json", ".mjs", ".yaml"].includes(path.extname(file))) continue;
  const source = await readFile(file, "utf8");
  const relative = path.relative(skillDir, file);
  if (!allowsUtf8Evidence(relative)) {
    assert(!/[\u4e00-\u9fff]/.test(source), `Chinese text found in ${relative}`);
    assert(!/[^\x00-\x7F]/.test(source), `Non-ASCII text found in ${relative}`);
  }
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
