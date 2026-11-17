import assert from "node:assert/strict";
import { chmod, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { bootstrapLogin, injectStorage, loginStorage, parseCdp, readWebSession, validateLogin, writeWebSession } from "../yunlogin-workbench-web-login.mjs";

const raw = JSON.stringify({ value: "Bearer fixture-private", expire: -1 });
const identity = { user: { userId: "u-fixture", password: "drop-me", nickname: "fixture" }, company: { companyId: "c-fixture", name: "fixture-company", status: 2 }, expiresAtMs: null };
const calls = [];
const validated = await validateLogin(raw, { fetcher: async (url, request) => {
  calls.push({ url, request });
  return { status: 200, json: async () => ({ code: 200, data: url.endsWith("myUserinfo") ? identity.user : identity.company }) };
} });
assert.equal(validated.user.userId, identity.user.userId);
assert.equal(calls.length, 2);
assert(calls.every(item => item.request.headers.authorization === "Bearer fixture-private" && item.request.redirect === "error" && item.request.body === "{}"));
await assert.rejects(validateLogin("", { fetcher: () => { throw Error("must not fetch"); } }), { reasonCode: "source-token-missing" });
await assert.rejects(validateLogin(JSON.stringify({ value: "fixture", expire: 1 })), { reasonCode: "source-token-expired" });
await assert.rejects(validateLogin(raw, { fetcher: async () => ({ status: 200, json: async () => ({ code: 1001 }) }) }), { reasonCode: "management-token-rejected" });
const storage = loginStorage(raw, identity);
assert.equal(storage.Authorization, raw);
assert.equal(JSON.parse(storage.userinfo).userId, "u-fixture");
assert.equal(JSON.parse(storage.CompanyInfo).companyId, "c-fixture");
assert.equal(JSON.parse(storage.CompanyInfo).companyName, "fixture-company");
assert.equal(JSON.parse(storage.CompanyInfo).status, 3);
assert(!storage.userinfo.includes("drop-me"));
assert.equal(JSON.parse(loginStorage("Bearer fixture-private", identity).Authorization).value, "Bearer fixture-private");
for (const invalid of ["https://evil.test:9222", "http://user:secret@127.0.0.1:9222", "http://127.0.0.1:9222/path", "ws://127.0.0.1:9222/not-browser", "http://127.0.0.1:9222/?secret=x"]) assert.throws(() => parseCdp(invalid));
assert.equal(parseCdp("ws://127.0.0.1:9222/devtools/browser/fixture").port, "9222");
for (const origin of ["https://d126447d359e70c0.yunlogin.com", "https://example.com"]) {
  const values = new Map([["appPort", "41111"]]);
  let detached = false;
  const fakeCdp = { client: { send: async (method, params) => {
    if (method === "Target.attachToTarget") return { sessionId: "fixture" };
    if (method === "Target.detachFromTarget") { detached = true; return {}; }
    if (method === "Runtime.evaluate") return { result: { value: vm.runInNewContext(params.expression, {
      location: { origin }, localStorage: { setItem: (key, value) => values.set(key, value), getItem: key => values.get(key) },
    }) } };
    throw Error("Unexpected CDP method");
  } } };
  const injected = await injectStorage(fakeCdp, { targetId: "fixture" }, storage);
  assert.equal(injected, origin === "https://d126447d359e70c0.yunlogin.com");
  assert.equal(values.has("Authorization"), injected);
  assert.equal(values.get("appPort"), "41111");
  assert.equal(detached, true);
}

const target = { targetId: "target", type: "page", url: "https://d126447d359e70c0.yunlogin.com/" };
const count = { started: 0, cached: 0, injected: 0, closed: 0, read: 0 };
const source = { owner: { pid: 11, startedAt: "source" }, recheck: async () => {}, close: () => count.closed++ };
const destination = { owner: { pid: 22 }, recheck: async () => {}, close: () => count.closed++, client: { send: async () => ({ targetInfos: [target] }) } };
let saved;
const deps = {
  environment: async () => { count.started++; return { cdp: "ws://127.0.0.1:41111/devtools/browser/source", started: true }; },
  connect: async (_, match) => match.accountId ? source : destination,
  select: async () => ({ sourceTarget: {}, target, extensionOrigin: "fixture-extension" }),
  readSource: async () => { count.read++; return raw; }, validate: async () => identity,
  writeCache: async (session, { recheck } = {}) => { if (recheck) await recheck(); saved = session; count.cached++; },
  inject: async (_, selected, values) => { assert.equal(selected, target); assert.deepEqual(values, storage); count.injected++; return true; },
};
const options = { accountId: "env-fixture", extensionId: "a".repeat(32), targetCdp: "http://127.0.0.1:42222", targetProfile: "/tmp/profile-fixture", startEnvironment: true };
assert.equal((await bootstrapLogin({ ...options, dryRun: true }, deps)).dryRun, true);
assert.equal((await bootstrapLogin(options, deps)).needsConfirmation, true);
assert.deepEqual(count, { started: 0, cached: 0, injected: 0, closed: 0, read: 0 });
const result = await bootstrapLogin({ ...options, confirmTransfer: true }, deps);
assert.equal(result.authenticationTransferred, true);
assert.equal(result.cacheUpdated, true);
assert.equal(count.injected, 1);
assert.equal(count.closed, 2);
assert(!JSON.stringify(result).includes("fixture-private"));
assert(saved.source.accountId === "env-fixture");
const previousWrites = count.cached;
let reads = 0;
await assert.rejects(bootstrapLogin({ ...options, confirmTransfer: true }, { ...deps, readSource: async () => reads++ ? raw + "changed" : raw }), { reasonCode: "source-session-changed" });
assert.equal(count.cached, previousWrites);
// A later source drift must also leave the previous cache and target intact.
for (const changeAt of [4, 5]) {
  let reads = 0;
  const injectedBefore = count.injected;
  await assert.rejects(bootstrapLogin({ ...options, confirmTransfer: true }, { ...deps, readSource: async () => ++reads === changeAt ? raw + "changed" : raw }), { reasonCode: "source-session-changed", cacheUpdated: false });
  assert.equal(count.cached, previousWrites);
  assert.equal(count.injected, injectedBefore);
}
await assert.rejects(bootstrapLogin({ ...options, confirmTransfer: true }, { ...deps,
  select: async () => ({ sourceTarget: {}, target: { ...target, targetId: "closed-original" }, extensionOrigin: "fixture-extension" }),
}), { reasonCode: "target-management-page-ambiguous" });
assert.equal(count.cached, previousWrites);
await assert.rejects(bootstrapLogin({ ...options, confirmTransfer: true }, { ...deps, validate: async () => { throw Object.assign(Error(), { reasonCode: "management-token-rejected" }); } }), { reasonCode: "management-token-rejected" });
assert.equal(count.cached, previousWrites);
const reused = await bootstrapLogin({ targetCdp: options.targetCdp, targetProfile: options.targetProfile, fromCache: true, confirmTransfer: true }, { ...deps, readCache: async () => saved });
assert.equal(reused.authenticationTransferred, true);
await assert.rejects(bootstrapLogin({ targetCdp: options.targetCdp, targetProfile: options.targetProfile, fromCache: true, confirmTransfer: true }, { ...deps, readCache: async () => ({ ...saved, userId: "other" }) }), { reasonCode: "cache-identity-mismatch" });

const directory = await mkdtemp(path.join(os.tmpdir(), "yunlogin-web-login-test-"));
try {
  const file = path.join(directory, "web-session.json");
  await writeWebSession(saved, file);
  assert.equal((await stat(file)).mode & 0o777, 0o600);
  assert.deepEqual(await readWebSession(file), saved);
  await writeWebSession({ ...saved, validatedAt: "new" }, file);
  assert.equal((await readWebSession(file)).validatedAt, "new");
  await assert.rejects(writeWebSession({ ...saved, validatedAt: "must-not-commit" }, file, { recheck: async () => { throw Error("source changed before rename"); } }), /source changed/);
  assert.equal((await readWebSession(file)).validatedAt, "new");
  await chmod(file, 0o644);
  await assert.rejects(readWebSession(file), { reasonCode: "cache-permissions-invalid" });
} finally { await rm(directory, { recursive: true, force: true }); }
console.log("PASS environment login bootstrap: server identity, token wrappers, origin selection, no-read dry-run, source drift/rejection, private atomic cache, reuse and redacted summaries");
