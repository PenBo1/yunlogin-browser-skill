#!/usr/bin/env node

/**
 * Prove that each audit gate actually blocks.
 *
 * A green audit only means "nothing failed", not "something would be caught". This script injects a
 * controlled fault into every gate and asserts a non-zero exit, then runs the same gate clean and
 * asserts zero. It is the evidence that the pipeline has teeth.
 *
 * Usage:
 *   node scripts/dev/verify-audit-gates.mjs [--json]
 */

import { spawnSync } from "node:child_process";
import { copyFile, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const serverDir = path.join(skillDir, "references", "server-api");
const asJson = process.argv.includes("--json");

function run(script, scriptArgs) {
  const result = spawnSync(process.execPath, [path.join(scriptDir, script), ...scriptArgs], { cwd: skillDir, encoding: "utf8" });
  return result.status ?? 1;
}

const checks = [];
function expect(label, actual, wanted) {
  checks.push({ label, actual, wanted, ok: actual === wanted });
  console.error(`${actual === wanted ? "PASS" : "FAIL"}  ${label.padEnd(52)} exit=${actual} (wanted ${wanted})`);
}

// 1. documentation validator
expect("validator: injected fault", run("validate-api-docs.mjs", ["--fault"]), 1);
expect("validator: clean", run("validate-api-docs.mjs", []), 0);

// 2. route drift, using a corrupted copy of the baseline so the real one is untouched
const tempBaseline = path.join(os.tmpdir(), "yunlogin-gate-baseline.json");
await copyFile(path.join(serverDir, "route-baseline.json"), tempBaseline);
{
  const doc = JSON.parse(await readFile(tempBaseline, "utf8"));
  doc.routes[0].code = 999999;
  await writeFile(tempBaseline, JSON.stringify(doc, null, 2), "utf8");
}
expect("drift: corrupted baseline", run("detect-route-drift.mjs", ["--current", path.join("references", "server-api", "route-sweep.json"), "--baseline", tempBaseline]), 1);
expect("drift: clean baseline", run("detect-route-drift.mjs", ["--current", path.join("references", "server-api", "route-sweep.json")]), 0);
await rm(tempBaseline, { force: true });

// 3. write effectiveness
expect("write: injected not-persisted", run("probe-write-effectiveness.mjs", ["--fault", "not-persisted", "--output", path.join(os.tmpdir(), "yunlogin-gate-write.json")]), 1);
expect("write: injected not-restored", run("probe-write-effectiveness.mjs", ["--fault", "not-restored", "--output", path.join(os.tmpdir(), "yunlogin-gate-write.json")]), 1);
expect("write: clean round trips", run("probe-write-effectiveness.mjs", ["--output", path.join(os.tmpdir(), "yunlogin-gate-write.json")]), 0);

// 4. delete semantics
expect("delete: injected leftover", run("probe-delete-semantics.mjs", ["--fault", "leftover", "--output", path.join(os.tmpdir(), "yunlogin-gate-delete.json")]), 1);
expect("delete: clean round trips", run("probe-delete-semantics.mjs", ["--output", path.join(os.tmpdir(), "yunlogin-gate-delete.json")]), 0);

// 5. residue gate inside the audit, faulted deterministically so nothing is written to the account
expect("residue: injected plugin-group row", run("run-api-audit.mjs", ["--skip-heavy", "--fault", "residue"]), 1);
expect("residue: clean", run("run-api-audit.mjs", ["--skip-heavy"]), 0);

await rm(path.join(os.tmpdir(), "yunlogin-gate-write.json"), { force: true });
await rm(path.join(os.tmpdir(), "yunlogin-gate-delete.json"), { force: true });

const failed = checks.filter((c) => !c.ok);
if (asJson) console.log(JSON.stringify({ verifiedAt: new Date().toISOString(), checks, ok: failed.length === 0 }, null, 2));
else console.log(`\ngate verification ${failed.length === 0 ? "PASSED" : "FAILED"} (${checks.length} checks, ${failed.length} failing)`);
process.exit(failed.length === 0 ? 0 : 1);
