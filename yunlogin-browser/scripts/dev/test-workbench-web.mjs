import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { bridgeStorage, initSource, launchConfig, MANAGEMENT_ORIGIN, prepare } from "../yunlogin-workbench-web.mjs";

const snapshot = { observedAt: "fixture", processes: [{ pid: 12 }], listeners: [
  { pid: 12, purpose: "client-api", address: "127.0.0.1", port: 41111 },
  { pid: 12, purpose: "websocket", address: "::", port: 41112 },
  { pid: 99, purpose: "client-api", address: "127.0.0.1", port: 49999 },
  { pid: 12, purpose: "unknown", address: "127.0.0.1", port: 41113 },
] };
const probed = [];
const verify = async url => { probed.push(url); return true; };
const bridge = await bridgeStorage(snapshot, { checkClient: verify, checkSocket: verify });
assert.deepEqual(bridge.storage, { appPort: "41111", port: "41112" });
assert.deepEqual(probed, ["http://127.0.0.1:41111", "http://127.0.0.1:41112"]);
await assert.rejects(bridgeStorage({ ...snapshot, processes: [] }), /one running/);
await assert.rejects(bridgeStorage({ ...snapshot, listeners: [...snapshot.listeners, { pid: 12, purpose: "client-api", address: "127.0.0.1", port: 41114 }] }, { checkClient: verify, checkSocket: verify }), /Ambiguous/);
assert.deepEqual((await bridgeStorage(snapshot, { checkClient: async () => false, checkSocket: async () => false })).missing, ["appPort", "port"]);
assert.throws(() => initSource({ Authorization: "secret" }), /Only verified/);
assert.throws(() => initSource({ port: "65536" }), /Only verified/);
for (const origin of [MANAGEMENT_ORIGIN, "https://example.com"]) {
  const values = new Map([["Authorization", "private-fixture"], ["rpaPort", "old"], ["port", "old"]]);
  vm.runInNewContext(initSource(bridge.storage), { location: { origin }, localStorage: { setItem: (k, v) => values.set(k, v), removeItem: k => values.delete(k) } });
  assert.equal(values.get("Authorization"), "private-fixture");
  assert.equal(values.get("port"), origin === MANAGEMENT_ORIGIN ? "41112" : "old");
  assert.equal(values.has("rpaPort"), origin !== MANAGEMENT_ORIGIN);
}
const directory = await mkdtemp(path.join(os.tmpdir(), "yunlogin-web-test-"));
try {
  const deps = { inventory: async () => snapshot, resolveBridge: async () => bridge, choosePort: async () => 42222 };
  const preview = await prepare({ outputDir: directory, dryRun: true }, deps);
  assert.equal(preview.browserLaunched, false);
  assert.deepEqual(await readdir(directory), []);
  const result = await prepare({ outputDir: directory }, deps);
  assert.equal(result.authenticationTransferred, false);
  assert.deepEqual(JSON.parse(await readFile(result.configPath, "utf8")), launchConfig(directory, 42222));
  assert.equal((await stat(result.configPath)).mode & 0o777, 0o600);
  assert(!(await readFile(result.configPath, "utf8")).includes("private-fixture"));
  await assert.rejects(prepare({ outputDir: directory }, deps), /Output already/);
  await assert.rejects(prepare({ outputDir: "relative" }, deps), /absolute/);
} finally { await rm(directory, { force: true, recursive: true }); }
console.log("PASS web Workbench prep: fresh owned bridge ports, ambiguity/missing services, scoped injection, login-state preservation, CDP config and no-write dry-run");
