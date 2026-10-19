import assert from "node:assert/strict";
import { discoverPorts, probeOrigin } from "../yunlogin-ports.mjs";
import { summarizeConfig } from "../yunlogin-client.mjs";
import { normalizeClientOrigin } from "../lib/client-origin.mjs";

// Two independent snapshots simulate a client restart and port reuse by another
// service. No operating-system mutation or network access occurs in this test.
const requests = [];
const makeInventory = (clientPort, pid) => async () => ({ processes: [{ pid }], publishedClientPort: 41001, listeners: [
  { pid, address: "127.0.0.1", port: clientPort },
  { pid, address: "::1", port: clientPort + 10 },
  { pid, address: "192.0.2.1", port: 9999 },
] });
const probeRequest = async (origin, route) => {
  requests.push(origin);
  return { route, httpStatus: 200, code: 0, gpuShape: origin.includes("127.0.0.1") && route.endsWith("gpu_info"), statusShape: origin.includes("[::1]") && route === "/status" };
};
const first = await discoverPorts({ inventory: makeInventory(41001, 101), probeRequest });
assert.deepEqual(first.clientApiOrigins, ["http://127.0.0.1:41001"]);
assert.deepEqual(first.localApiOrigins, ["http://[::1]:41011"]);
assert.equal(first.publishedClientPortVerified, true);
requests.length = 0;
const second = await discoverPorts({ inventory: makeInventory(47021, 202), probeRequest });
assert.deepEqual(second.clientApiOrigins, ["http://127.0.0.1:47021"]);
assert.equal(second.publishedClientPortVerified, false);
assert(!requests.some(p => p.includes("41001") || p.includes("192.0.2.1")));
assert.equal(second.listeners[2].purpose, "unknown");
const stopped = await discoverPorts({ inventory: async () => ({ processes: [], listeners: [] }), probeRequest: () => { throw new Error("must not probe"); } });
assert.equal(stopped.running, false);
const wsInventory = async () => ({ processes: [{ pid: 303 }], listeners: [{ pid: 303, address: "127.0.0.1", port: 49001 }] });
const upgradeProbe = async (_, route) => ({ route, httpStatus: 426 });
const ws = await discoverPorts({ inventory: wsInventory, probeRequest: upgradeProbe, websocketProbe: async () => true });
assert.deepEqual(ws.websocketOrigins, ["ws://127.0.0.1:49001"]);
const notWs = await discoverPorts({ inventory: wsInventory, probeRequest: upgradeProbe, websocketProbe: async () => false });
assert.deepEqual(notWs.websocketOrigins, []);
assert.equal(notWs.complete, false);
assert.equal(probeOrigin("0.0.0.0", 41234), "http://127.0.0.1:41234");
for (const origin of ["https://example.com", "http://user:secret@localhost", "http://localhost/path", "http://localhost/?q=1"]) assert.throws(() => normalizeClientOrigin(origin));
assert.equal(normalizeClientOrigin("http://[::1]:41234"), "http://[::1]:41234");
const summary = summarizeConfig({ code: 0, msg: "fixture-secret", data: { autoRun: true, remindCleanup: { password: "fixture-secret" }, rpaAutoCleanup: "fixture-secret", ossToken: "fixture-secret", newField: { credential: "fixture-secret" }, networkConfigInfo: '{"password":"fixture-secret"}' } });
assert.deepEqual(summary.settings, { autoRun: true });
assert(!JSON.stringify(summary).includes("fixture-secret"));
console.log("PASS dynamic restart discovery, stale shared-memory rejection, IPv6, WebSocket classification, no unrelated probes, stopped state, origin validation, and config allowlist");
