#!/usr/bin/env node
// Prepare a separate web management-center browser; never read authentication
// storage, launch a browser, or impersonate the native Workbench process.
import { access, mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { discoverPorts, verifyWebSocket } from "./yunlogin-ports.mjs";
import { clientServiceResponds } from "./lib/client-origin.mjs";

export const MANAGEMENT_ORIGIN = "https://d126447d359e70c0.yunlogin.com";

export async function bridgeStorage(snapshot, { checkClient = clientServiceResponds, checkSocket = verifyWebSocket } = {}) {
  if (snapshot.processes.length !== 1) throw new Error("Expected one running YunLogin client; start or select the intended client first.");
  const storage = {};
  const missing = [];
  // Current page code uses 127.0.0.1, even for IPv6/wildcard desktop sockets.
  // Reverify this address and only probe ports in the current owned inventory.
  for (const [key, purpose, verify] of [["appPort", "client-api", checkClient], ["port", "websocket", checkSocket]]) {
    const ports = [...new Set(snapshot.listeners.filter(p => p.pid === snapshot.processes[0].pid && p.purpose === purpose &&
      ["127.0.0.1", "0.0.0.0", "::1", "::"].includes(p.address)).map(p => p.port))];
    const verified = [];
    for (const port of ports) {
      if (await verify(`http://127.0.0.1:${port}`, 1000)) verified.push(port);
    }
    if (verified.length > 1) throw new Error(`Ambiguous ${key}; select the intended YunLogin listener before preparing the browser.`);
    if (verified.length === 1) storage[key] = String(verified[0]);
    else missing.push(key);
  }
  return { storage, missing, unmapped: ["rpaPort", "ipifyPort", "cookiefyPort"] };
}

export function initSource(storage) {
  for (const [key, value] of Object.entries(storage)) {
    if (!["appPort", "port"].includes(key) || !/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) throw new Error("Only verified bridge ports may enter this init script.");
  }
  return `// Generated bridge ports only; contains no login state. Reprepare after client restart.\n(() => {\n  if (location.origin !== ${JSON.stringify(MANAGEMENT_ORIGIN)}) return;\n  const ports = ${JSON.stringify(storage)};\n  for (const key of ["appPort", "port", "rpaPort", "ipifyPort", "cookiefyPort"]) {\n    if (Object.hasOwn(ports, key)) localStorage.setItem(key, ports[key]);\n    else localStorage.removeItem(key);\n  }\n})();\n`;
}

export async function freeCdpPort(requested) {
  if (requested !== undefined && (!Number.isInteger(requested) || requested < 1 || requested > 65535)) throw new Error("CDP port must be between 1 and 65535.");
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen({ host: "127.0.0.1", port: requested ?? 0, exclusive: true }, () => {
      const port = server.address().port;
      server.close(error => error ? reject(error) : resolve(port));
    });
  });
}

export function launchConfig(directory, port) {
  return { browser: { browserName: "chromium", userDataDir: path.join(directory, "profile"),
    launchOptions: { channel: "chrome", headless: false, args: [`--remote-debugging-address=127.0.0.1`, `--remote-debugging-port=${port}`] },
    initScript: [path.join(directory, "bridge-init.js")] } };
}

export async function prepare({ outputDir, cdpPort, dryRun = false }, { inventory = discoverPorts, resolveBridge = bridgeStorage, choosePort = freeCdpPort } = {}) {
  if (!outputDir || !path.isAbsolute(outputDir)) throw new Error("--output-dir requires an absolute directory outside the skill and existing browser profiles.");
  const directory = path.resolve(outputDir);
  const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  if (directory === skillDir || directory.startsWith(skillDir + path.sep)) throw new Error("Write generated files outside the skill directory.");
  const snapshot = await inventory();
  const { storage, missing, unmapped } = await resolveBridge(snapshot);
  const port = await choosePort(cdpPort);
  const configPath = path.join(directory, "cli.config.json"), initPath = path.join(directory, "bridge-init.js");
  const summary = { mode: "web-workbench", nativeWorkbench: false, dryRun, browserLaunched: false,
    configPath, cdpOrigin: `http://127.0.0.1:${port}`, observedAt: snapshot.observedAt,
    storageKeys: Object.keys(storage), missingPortKeys: [...missing, ...unmapped], authenticationTransferred: false,
    next: "Open a dedicated browser with this config, verify owned loopback CDP, then visit the management origin. For login use yunlogin-workbench-web-login.mjs with a selected YunLogin environment or its revalidated private cache, otherwise sign in in the new browser. Port preparation alone does not inject Authorization.",
    limits: "This prepares verified bridge ports only. Web login, local-network access, WebSocket application authentication and extension-only features must be verified separately. Native Workbench session-sync helpers do not target this browser." };
  if (dryRun) return summary;
  await mkdir(directory, { recursive: true, mode: 0o700 });
  // Refuse overwriting another browser's setup or importing an existing profile.
  for (const file of [configPath, initPath, path.join(directory, "profile")]) {
    if (await access(file).then(() => true, () => false)) throw new Error("Output already contains a setup/profile; choose a new dedicated directory.");
  }
  await writeFile(initPath, initSource(storage), { flag: "wx", mode: 0o600 });
  await writeFile(configPath, JSON.stringify(launchConfig(directory, port), null, 2) + "\n", { flag: "wx", mode: 0o600 });
  return summary;
}

async function main(args) {
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: node scripts/yunlogin-workbench-web.mjs --output-dir ABSOLUTE_PATH [--cdp-port PORT] [--dry-run]\nPrepare Playwright CLI config and origin-scoped bridge-port injection. No browser launch or login-data access. Dry-run probes current owned listeners but writes nothing."); return;
  }
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--output-dir") options.outputDir = args[++i];
    else if (args[i] === "--cdp-port") options.cdpPort = Number(args[++i]);
    else if (args[i] === "--dry-run") options.dryRun = true;
    else throw new Error("Unknown option; use --help.");
  }
  console.log(JSON.stringify(await prepare(options), null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => { console.error(`Error: ${error.message}`); process.exitCode = 1; });
}
