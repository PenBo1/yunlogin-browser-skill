import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ensureWorkbenchCdp, verifyWorkbenchCdp } from "../lib/workbench-cdp.mjs";
import { parseWorkbenchValues, sameWorkbenchState, syncWorkbench, validateCaptured, workbenchStatus } from "../lib/workbench-session.mjs";
import { readLocalToken, readServerToken } from "../lib/local-token-store.mjs";
import { clearPinnedWorkbenchSession } from "../lib/workbench-cache.mjs";

function sample(token = "server-a", companyId = "company-a", pid = 41) {
  return parseWorkbenchValues({ management: { Authorization: token, userinfo: JSON.stringify({ userId: "user-a" }), CompanyInfo: JSON.stringify({ companyId, name: "A" }) },
    source: { browserId: "Workbench", pid, processStartedAt: "2026-10-19T00:00:00Z", cdpPort: 43821 } });
}
const a = sample();
assert.equal(a.serverToken, "server-a");
assert(!Object.hasOwn(a, "localToken"));
assert(!sameWorkbenchState(a, sample("server-b")));
assert(!sameWorkbenchState(a, sample("server-a", "company-b")));
assert(!sameWorkbenchState(a, sample("server-a", "company-a", 99)));
assert.throws(() => parseWorkbenchValues({ management: { Authorization: "", userinfo: "{}", CompanyInfo: "{}" }, source: a.source }), /Authorization is absent/);

let saved;
let invalidated = false;
const base = { validate: async () => ({ localOrigin: "http://127.0.0.1:50213" }), cache: async (value, { recheck }) => { await recheck(); saved = value; }, invalidate: async () => { invalidated = true; } };
assert.equal((await syncWorkbench({ ...base, capture: async () => a })).synced, true);
assert.equal(saved.serverToken, a.serverToken);
assert(!Object.hasOwn(saved, "localToken"));
assert.equal(await readServerToken(), a.serverToken);
assert.equal(await readLocalToken(), undefined);

let calls = 0;
const changed = [a, sample("server-b"), sample("server-b"), sample("server-b"), sample("server-b")];
await syncWorkbench({ ...base, capture: async () => changed[calls++] });
assert.equal(saved.serverToken, "server-b");
assert.equal(calls, 5);

calls = 0; invalidated = false;
await assert.rejects(syncWorkbench({ ...base, capture: async () => [a, sample("server-b"), a, sample("server-b")][calls++] }), /synchronization failed/);
assert.equal(invalidated, true);
const status = await workbenchStatus({ capture: async () => a, cache: async () => saved, cdp: async () => ({ ready: true }), validate: async () => ({ localOrigin: "http://127.0.0.1:50213" }) });
assert.equal(status.consistent, false);
assert(!JSON.stringify(status).includes("server-a"));

const requested = [];
const rejected = async url => { requested.push(url); return { status: 200, json: async () => ({ code: 1001 }) }; };
await assert.rejects(validateCaptured(a, { fetcher: rejected, ports: async () => { throw new Error("local port probe should not run"); } }), /rejected/);
assert.equal(requested.length, 1);

const workbench = { pid: 41, browserId: "Workbench", remoteDebuggingPort: "43821", creationDate: "2026-10-19T00:00:00Z" };
const withoutCdp = { ...workbench, remoteDebuggingPort: null };
assert.equal(await verifyWorkbenchCdp(workbench, { owner: async () => [99], fetchVersion: async () => { throw new Error("must not fetch"); } }), null);
const version = async () => ({ webSocketDebuggerUrl: "ws://127.0.0.1:43821/devtools/browser/id" });
assert.equal((await verifyWorkbenchCdp(workbench, { owner: async () => [41], fetchVersion: version, checkBrowser: async () => ({ product: "Chrome/107" }) })).pid, 41);
assert.equal(await verifyWorkbenchCdp(workbench, { owner: async () => [41], fetchVersion: async () => ({ webSocketDebuggerUrl: "ws://127.0.0.1:43822/devtools/browser/id" }), checkBrowser: async () => ({ product: "Chrome/107" }) }), null);

let restarts = 0;
const plan = await ensureWorkbenchCdp({ find: async () => withoutCdp, verify: async () => null, choosePort: async () => 44991, owner: async () => [], restart: async () => { restarts++; }, dryRun: true });
assert.equal(plan.needsRestart, true);
assert.equal(restarts, 0);
await assert.rejects(ensureWorkbenchCdp({ find: async () => withoutCdp, verify: async () => null, port: 44991, owner: async () => [999], restart: async () => { restarts++; } }), /in use/);
await assert.rejects(ensureWorkbenchCdp({ find: async () => workbench, verify: async () => null, owner: async () => [], restart: async () => { restarts++; } }), /failed process/);
const verified = { pid: 42, browserId: "Workbench", remoteDebuggingPort: "44991", creationDate: "2026-10-19T00:01:00Z" };
const ready = await ensureWorkbenchCdp({ find: async () => restarts ? verified : withoutCdp, verify: async item => item.pid === 42 ? { pid: 42, port: 44991 } : null,
  choosePort: async () => 44991, owner: async () => [], restart: async () => { restarts++; return { pid: 42, cdpUrl: "ws://127.0.0.1:44991/devtools/browser/id" }; }, startedThisRun: true });
assert.equal(ready.ready, true);
assert.equal(restarts, 1);

const previous = process.env.LOCALAPPDATA;
const temporary = await mkdtemp(path.join(os.tmpdir(), "yunlogin-session-test-"));
try {
  clearPinnedWorkbenchSession();
  process.env.LOCALAPPDATA = temporary;
  const legacy = path.join(temporary, "yunlogin-browser");
  await mkdir(legacy);
  await writeFile(path.join(legacy, "local-token.json"), JSON.stringify({ token: "old-local" }));
  await writeFile(path.join(legacy, "server-token.json"), JSON.stringify({ token: "old-server" }));
  assert.equal(await readLocalToken(), undefined);
  assert.equal(await readServerToken(), undefined);
} finally {
  if (previous === undefined) delete process.env.LOCALAPPDATA; else process.env.LOCALAPPDATA = previous;
  await rm(temporary, { recursive: true, force: true });
}
console.log("PASS management session sync, account changes, fail-closed cache, CDP ownership, restart gate and legacy-cache isolation");
