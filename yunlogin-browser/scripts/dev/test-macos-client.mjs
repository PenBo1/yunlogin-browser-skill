import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { discoverMac, macBundleExecutable, macDesktopProcesses, macListeners, macProcessArguments, parseMacArgv, parseMacListeners, parseMacProcesses } from "../lib/macos-client.mjs";
import { launchClient, main } from "../yunlogin-client.mjs";
import { discoverPorts } from "../yunlogin-ports.mjs";
import { browserVersion, listFbProcesses, restartFbProcess } from "../yunlogin-fb-cdp.mjs";
import { verifyWorkbenchCdp } from "../lib/workbench-cdp.mjs";
import { workbenchIssue, workbenchRestartNotice } from "../lib/workbench-guidance.mjs";

// Serialized into an isolated Node executable named FbBrowser on native runs.
function cdpFixture() {
  const http = require("node:http"), crypto = require("node:crypto");
  const flag = process.argv.find(value => value.startsWith("--remote-debugging-port="));
  if (!flag) { setInterval(() => {}, 1000); return; }
  const port = Number(flag.split("=")[1]);
  const server = http.createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ webSocketDebuggerUrl: `ws://127.0.0.1:${port}/devtools/browser/fixture` }));
  });
  server.on("upgrade", (request, socket) => {
    const accept = crypto.createHash("sha1").update(request.headers["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
    socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
    let pending = Buffer.alloc(0);
    socket.on("error", () => {});
    socket.on("data", chunk => {
      pending = Buffer.concat([pending, chunk]);
      while (pending.length >= 2) {
        const opcode = pending[0] & 15, masked = Boolean(pending[1] & 128);
        let length = pending[1] & 127, offset = 2;
        if (length === 126) { if (pending.length < 4) return; length = pending.readUInt16BE(2); offset = 4; }
        if (length === 127) { socket.destroy(); return; }
        const key = masked ? pending.subarray(offset, offset + 4) : null;
        if (masked) offset += 4;
        if (pending.length < offset + length) return;
        const payload = Buffer.from(pending.subarray(offset, offset + length));
        pending = pending.subarray(offset + length);
        if (opcode === 8) { socket.end(); return; }
        if (opcode !== 1) continue;
        if (key) for (let i = 0; i < payload.length; i++) payload[i] ^= key[i % 4];
        const message = JSON.parse(payload.toString());
        const body = Buffer.from(JSON.stringify({ id: message.id, result: { product: "MockChrome/macOS", protocolVersion: "1.3" } }));
        const header = body.length < 126 ? Buffer.from([129, body.length]) : Buffer.from([129, 126, body.length >> 8, body.length & 255]);
        socket.write(Buffer.concat([header, body]));
      }
    });
  });
  server.listen(port, "127.0.0.1");
}

const temporary = await mkdtemp(path.join(os.tmpdir(), "yunlogin-macos-test-"));
const app = path.join(temporary, "Applications", "Renamed \u4e91\u767b Client.app");
const executable = path.join(app, "Contents", "MacOS", "Yunlogin Browser");
const bundle = name => `<?xml version="1.0" encoding="UTF-8"?><plist version="1.0"><dict><key>CFBundleIdentifier</key><string>com.yunlogin.fbmain</string><key>CFBundleExecutable</key><string>${name}</string></dict></plist>`;
const run = async (command, args) => {
  if (command === "/bin/ps") return { stdout: `12 1 ${executable}\n13 12 /other/FbBrowser Helper\n` };
  if (command === "/usr/bin/plutil") {
    if (args.at(-1) !== path.join(app, "Contents", "Info.plist")) throw new Error("Unrelated app");
    return { stdout: args[1] === "CFBundleIdentifier" ? "com.yunlogin.fbmain\n" : "Yunlogin Browser\n" };
  }
  throw new Error("Unexpected command");
};

async function capture(argv, dependencies) {
  const output = [];
  const previous = console.log, exitCode = process.exitCode;
  console.log = value => output.push(value);
  process.exitCode = 0;
  try { await main(argv, dependencies); return { code: process.exitCode, value: JSON.parse(output.join("\n")) }; }
  finally { console.log = previous; process.exitCode = exitCode; }
}

try {
  await mkdir(path.dirname(executable), { recursive: true });
  await writeFile(executable, "fixture");
  assert.deepEqual(parseMacProcesses(` 12  1 ${executable}\n`), [{ pid: 12, parentPid: 1, path: executable }]);
  assert.throws(() => parseMacProcesses("bad process row"), /unknown/);
  assert.equal(await macBundleExecutable(app, { run }), executable);
  assert.equal(await macBundleExecutable(executable, { run }), executable);
  await assert.rejects(macBundleExecutable("relative.app", { run }), /absolute/);
  await assert.rejects(macBundleExecutable("/other/Client.app", { run }), /Info.plist/);
  assert.equal((await macDesktopProcesses({ run }))[0].pid, 12);
  const discovered = await discoverMac({ run, applicationDirs: [path.dirname(app)] });
  assert.deepEqual(discovered.installed, [executable]);
  assert.equal(discovered.discoveryComplete, true);
  const notRunning = async (command, args) => command === "/bin/ps" ? { stdout: "" } : run(command, args);
  assert.deepEqual((await discoverMac({ run: notRunning, applicationDirs: [path.dirname(app)] })).installed, [executable]);
  await assert.rejects(discoverMac({ executable: app, run: async () => { throw new Error("query denied"); } }), /query denied/);

  const listenerText = "p12\nf1\ntIPv4\nn127.0.0.1:41111\nf2\ntIPv6\nn[::1]:41112\nf3\ntIPv6\nn*:41113\np99\nf4\ntIPv4\nn127.0.0.1:41114\n";
  assert.deepEqual(parseMacListeners(listenerText).map(p => p.address), ["127.0.0.1", "::1", "::", "127.0.0.1"]);
  assert.equal((await macListeners({ pids: [12], run: async () => ({ stdout: listenerText }) })).length, 3);
  assert.deepEqual(await macListeners({ pids: [], run: () => { throw new Error("must not query"); } }), []);
  assert.deepEqual(await macListeners({ pids: [12], run: async () => { throw Object.assign(new Error(), { code: 1, stdout: "", stderr: "" }); } }), []);
  await assert.rejects(macListeners({ pids: [12], run: async () => { throw Object.assign(new Error(), { code: 1, stderr: "Permission denied" }); } }), /unknown/);

  const argv = [executable, "--user-data-dir=/Users/test/Library/Application Support/Test Profile", "", "quote=\"a\"", "backslash=\\", "--base-data=fixture-secret", "--label=\u6d4b\u8bd5"];
  const header = Buffer.alloc(4); header.writeInt32LE(argv.length);
  const raw = Buffer.concat([header, Buffer.from(executable + "\0\0\0" + argv.join("\0") + "\0ENV=ignored\0")]);
  assert.deepEqual(parseMacArgv(raw).argv, argv);
  assert.throws(() => parseMacArgv(raw.subarray(0, 12)), /Incomplete/);

  let launches = 0, restarts = 0, syncs = 0;
  const stopped = { running: [], installed: [executable], warnings: [], discoveryComplete: true };
  const workbench = { pid: 23, browserId: "Workbench", creationDate: "test" };
  const deps = { discover: async () => stopped, services: async () => ({ localApi: { reachable: true }, clientApi: { reachable: true } }),
    findWorkbench: async () => workbench, ensureWorkbenchCdp: async options => { if (!options.dryRun) restarts++; return { ready: true, startedThisRun: options.startedThisRun }; },
    syncWorkbench: async () => { syncs++; return { synced: true }; }, launchClient: async () => { launches++; } };
  assert.equal((await capture(["start", "--dry-run"], deps)).value.dryRun, true);
  assert.equal((await capture(["start"], deps)).value.needsConfirmation, true);
  assert.equal(launches + restarts + syncs, 0);
  const started = await capture(["start", "--confirm-start"], deps);
  assert.equal(started.value.ready, true);
  assert.equal(started.value.workbenchCdp.startedThisRun, true);
  assert.equal(launches, 1);
  const running = { ...deps, discover: async () => ({ ...stopped, running: [{ pid: 12, path: executable }] }), ensureWorkbenchCdp: async () => ({ ready: false, needsRestart: true }) };
  assert.equal((await capture(["start"], running)).value.workbenchCdp.needsRestart, true);
  assert.equal(launches, 1);
  assert.equal(syncs, 1);
  assert.equal((await capture(["start", "--confirm-start"], { ...deps, discover: async () => ({ ...stopped, installed: [executable, "/other"] }) })).value.needsPath, true);
  assert.equal(launches, 1);
  const launchFailed = await capture(["start", "--confirm-start"], { ...deps, launchClient: async () => { throw new Error("private spawn error"); } });
  assert.equal(launchFailed.code, 4);
  assert.equal(launchFailed.value.workbenchCdp.reasonCode, "client-launch-failed");
  assert(!JSON.stringify(launchFailed).includes("private spawn error"));
  const failed = await capture(["start", "--confirm-start"], { ...deps, services: async () => { throw new Error("query denied"); } });
  assert.equal(failed.value.readinessUnknown, true);
  assert.equal(failed.value.workbenchCdp.reasonCode, "inspection-failed");
  assert.equal(launches, 2);

  const calls = { launch: 0, sync: 0 };
  const availableApis = { localApi: { reachable: true }, clientApi: { reachable: true } };
  const noticeDeps = { discover: async () => ({ ...stopped, running: [{ pid: 12, path: executable }] }), services: async () => availableApis,
    findWorkbench: async () => workbench, ensureWorkbenchCdp: async () => workbenchRestartNotice(workbench, "darwin"),
    launchClient: async () => { calls.launch++; }, syncWorkbench: async () => { calls.sync++; } };
  const missing = await capture(["status"], { ...noticeDeps, findWorkbench: async () => null });
  assert.equal(missing.value.workbench, null);
  assert.equal(missing.value.workbenchCdp.state, "workbench-not-running");
  assert.equal(missing.value.localApi.reachable, true);
  const unknown = await capture(["status"], { ...noticeDeps, findWorkbench: async () => { throw new Error("private query error"); } });
  assert.equal(unknown.value.workbenchCdp.state, "unknown");
  assert(!JSON.stringify(unknown).includes("private query error"));
  const stoppedStatus = await capture(["status"], { ...noticeDeps, discover: async () => stopped,
    findWorkbench: async () => { throw new Error("must not query Workbench"); } });
  assert.equal(stoppedStatus.value.workbenchCdp.state, "client-not-running");
  const blockedPlan = await capture(["start", "--dry-run"], noticeDeps);
  assert.equal(blockedPlan.value.restartRequiresConfirmation, false);
  assert.equal(blockedPlan.value.workbenchCdp.automaticSetupUnavailable, true);
  const blockedStart = await capture(["start", "--confirm-restart"], noticeDeps);
  assert.equal(blockedStart.code, 4);
  assert.equal(blockedStart.value.workbenchCdp.state, "cdp-unavailable");
  assert(blockedStart.value.action);
  assert.deepEqual(calls, { launch: 0, sync: 0 });
  const uncertainSetup = await capture(["start"], { ...noticeDeps, ensureWorkbenchCdp: async () => { throw new Error("private setup error"); } });
  assert.equal(uncertainSetup.value.workbenchCdp.reasonCode, "cdp-verification-failed");
  assert(!JSON.stringify(uncertainSetup).includes("private setup error"));
  let clock = 0;
  const timeout = await capture(["start", "--confirm-start"], { ...noticeDeps, discover: async () => stopped,
    findWorkbench: async () => null, sleep: async () => { clock += 30001; }, now: () => clock });
  assert.equal(timeout.value.workbenchCdp.reasonCode, "workbench-startup-timeout");
  assert.equal(calls.launch, 1);
  assert.equal(calls.sync, 0);
  const noLoginRead = await capture(["status"], { ...noticeDeps, ensureWorkbenchCdp: async () => ({ ready: true, pid: workbench.pid, port: 41111, cdpUrl: "ws://127.0.0.1:41111/devtools/browser/fixture" }) });
  assert.equal(noLoginRead.value.workbench.cdpReady, true);
  assert.equal(calls.sync, 0);
  console.log("PASS Workbench stopped/unknown/CDP/runtime guidance, dry-run and blocked-start behavior, startup timeout, API independence and no credential writes");
  console.log("PASS macOS bundle identity, renamed/custom paths, exact argv, listener ownership, query failures, dry-run, startup/restart gates and launch outcomes");

  if (process.argv.includes("--native")) {
    assert.equal(process.platform, "darwin", "Native checks require macOS");
    const argumentsToPreserve = ["-e", "setInterval(()=>{},1000)", "--", "a b", "", "quote=\"x\"", "backslash=\\", "\u6d4b\u8bd5"];
    const argumentProcess = spawn(process.execPath, argumentsToPreserve, { stdio: "ignore" });
    try {
      await new Promise((resolve, reject) => { argumentProcess.once("spawn", resolve); argumentProcess.once("error", reject); });
      assert.deepEqual((await macProcessArguments(argumentProcess.pid)).argv.slice(1), argumentsToPreserve);
    } finally { argumentProcess.kill("SIGTERM"); }
    await copyFile(process.execPath, executable);
    await writeFile(path.join(app, "Contents", "Info.plist"), bundle("Yunlogin Browser"));
    const boot = path.join(temporary, "boot.cjs");
    const resultFile = path.join(temporary, "started.json");
    await writeFile(boot, `const http=require('http'),fs=require('fs');const results={pid:process.pid,cwd:process.cwd(),ports:[]};for(const type of ['local','client']){const server=http.createServer((req,res)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(type==='local'?{code:0,msg:'ok'}:{code:0,data:{adapters:[]}}));});server.listen(0,'127.0.0.1',()=>{results.ports.push({type,port:server.address().port});if(results.ports.length===2)fs.writeFileSync(${JSON.stringify(resultFile)},JSON.stringify(results));});}`);
    const pid = await launchClient(executable, { env: { ...process.env, NODE_OPTIONS: `--require=${boot}` } });
    try {
      const deadline = Date.now() + 10000;
      while (!(await readFile(resultFile).catch(() => null)) && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 50));
      const result = JSON.parse(await readFile(resultFile, "utf8"));
      assert.equal(result.pid, pid);
      assert.equal(result.cwd, await realpath(path.dirname(executable)));
      const installed = await discoverMac({ executable: app });
      assert(installed.installed.includes(executable));
      const listeners = await macListeners({ pids: [pid] });
      assert(result.ports.every(item => listeners.some(listener => listener.pid === pid && listener.port === item.port)));
      const ports = await discoverPorts({ inventory: async () => ({ processes: [{ pid }], listeners }) });
      assert.equal(ports.clientApiOrigins.length, 1);
      assert.equal(ports.localApiOrigins.length, 1);
      console.log("PASS native macOS exact argv, .app executable launch, process discovery, PID-owned TCP listeners and real HTTP protocol probes (isolated fixture)");
    } finally { process.kill(pid, "SIGTERM"); }

    const browserExecutable = path.join(temporary, "FbBrowser.app", "Contents", "MacOS", "FbBrowser");
    await mkdir(path.dirname(browserExecutable), { recursive: true });
    await copyFile(process.execPath, browserExecutable);
    const guardedWorkbench = spawn(browserExecutable, ["-e", "setInterval(()=>{},1000)", "--", "--browser-id=Workbench", "--base-data=fixture-private-value"], { stdio: "ignore" });
    try {
      await new Promise((resolve, reject) => { guardedWorkbench.once("spawn", resolve); guardedWorkbench.once("error", reject); });
      for (const options of [{ dryRun: true }, { confirmRestart: true }]) {
        const notice = await restartFbProcess({ pid: String(guardedWorkbench.pid), port: 41111, ...options });
        assert.equal(notice.restartSkipped, true);
        assert.equal(notice.reasonCode, "macos-workbench-cdp-unavailable");
        assert(!JSON.stringify(notice).includes("fixture-private-value"));
        process.kill(guardedWorkbench.pid, 0);
      }
      console.log("PASS native macOS Workbench direct restart skips stop/spawn and preserves private launch values (isolated fixture)");
    } finally { guardedWorkbench.kill("SIGTERM"); }
    const browserId = `MacOSFixture-${process.pid}`;
    const preserved = [`--browser-id=${browserId}`, `--user-data-dir=${temporary}/Profile With Spaces`, "--base-data=fixture-private-value", "", "quote=\"x\"", "\u6d4b\u8bd5"];
    const initial = spawn(browserExecutable, ["-e", `(${cdpFixture.toString()})()`, "--", ...preserved], { stdio: "ignore" });
    let restarted;
    try {
      await new Promise((resolve, reject) => { initial.once("spawn", resolve); initial.once("error", reject); });
      const original = (await listFbProcesses()).find(p => p.pid === initial.pid);
      assert(original?.args.includes(preserved[1]));
      const reservation = createServer();
      await new Promise(resolve => reservation.listen(0, "127.0.0.1", resolve));
      const port = reservation.address().port;
      await new Promise(resolve => reservation.close(resolve));
      const plan = await restartFbProcess({ pid: String(initial.pid), port, dryRun: true });
      assert.equal(plan.portAvailable, true);
      assert(!JSON.stringify(plan).includes("fixture-private-value"));
      const gated = await restartFbProcess({ pid: String(initial.pid), port });
      assert.equal(gated.needsConfirmation, true);
      process.kill(initial.pid, 0);
      const guarded = `globalThis.WebSocket=undefined;const {restartFbProcess}=await import(${JSON.stringify(new URL("../yunlogin-fb-cdp.mjs", import.meta.url).href)});try{await restartFbProcess({pid:${JSON.stringify(String(initial.pid))},port:${port},confirmRestart:true});process.exitCode=1;}catch(error){if(!error.message.includes('Node.js 22+'))throw error;}`;
      await promisify(execFile)(process.execPath, ["--input-type=module", "-e", guarded]);
      process.kill(initial.pid, 0);
      restarted = await restartFbProcess({ pid: String(initial.pid), port, confirmRestart: true, timeoutMs: 10000 });
      const after = (await listFbProcesses()).find(p => p.pid === restarted.pid);
      assert.notEqual(after.pid, original.pid);
      assert.notEqual(after.creationDate, original.creationDate);
      assert.deepEqual(after.args.slice(-preserved.length - 2, -2), preserved);
      assert.equal((await browserVersion(restarted.cdpUrl, 2000)).product, "MockChrome/macOS");
      assert.equal((await verifyWorkbenchCdp(after)).pid, after.pid);
      assert.equal(await verifyWorkbenchCdp({ ...after, pid: process.pid }), null);
      console.log("PASS native macOS CDP restart confirmation, SIGTERM/relaunch, argv preservation/redaction, start-time identity, Browser.getVersion and listener ownership (isolated fixture)");
    } finally {
      const remaining = (await listFbProcesses()).filter(p => p.browserId === browserId);
      for (const candidate of new Set([initial.pid, restarted?.pid, ...remaining.map(p => p.pid)])) if (candidate) { try { process.kill(candidate, "SIGTERM"); } catch {} }
    }
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
