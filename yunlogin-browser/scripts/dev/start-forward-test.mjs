#!/usr/bin/env node
/**
 * Scaffold an isolated forward test for this skill.
 *
 * The skill-creator flow asks for an independent agent, a realistic request, and an isolated workspace so
 * generated artifacts never enter the repository. This script creates that workspace and prints the exact
 * prompt to hand over. It deliberately does not spawn the agent itself.
 *
 * Usage:
 *   node scripts/dev/start-forward-test.mjs --request "..." [--allow-writes]
 */

import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const args = process.argv.slice(2);
function option(name) {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}
const request = option("--request");
if (!request) throw new Error('--request "<realistic user request>" is required');
const allowWrites = args.includes("--allow-writes");

const runId = Date.now().toString(36);
const workspace = path.join(os.tmpdir(), `yl-forward-${runId}`);
await mkdir(workspace, { recursive: true });
const notePath = path.join(workspace, "FORWARD-TEST.md");
await writeFile(notePath, [
  "# Forward test",
  "",
  "Realistic request handed to the evaluating agent:",
  "",
  `> ${request}`,
  "",
  "Rules that must be passed to the agent:",
  "",
  `- The only writable path is \`${workspace}\`.`,
  `- Do not create, modify, or delete anything inside \`${skillDir}\`.`,
  allowWrites
    ? "- Server mutations are permitted for this run only after the user confirms each one."
    : "- Keep the run read-only: do not change anything on the server.",
  "- Report the exact commands, the files read, the artifacts produced, and anything the skill failed to explain.",
  "",
  "Do not include the intended answer, a suspected bug, a proposed fix, or earlier conclusions.",
  "",
].join("\n"), "utf8");

console.log(`workspace: ${workspace}`);
console.log(`prompt notes: ${notePath}`);
console.log("");
console.log("Hand this to an independent agent, verbatim:");
console.log(`  Use the Codex skill at ${skillDir} to complete this realistic request.`);
console.log(`  Request: "${request}"`);
console.log(`  Write only inside ${workspace}; never modify ${skillDir}.`);
console.log(allowWrites
  ? "  Server changes are allowed only with my explicit confirmation for each one."
  : "  Do not change anything on the server.");
console.log("  Report what you ran, what you read, what you produced, and anything unclear or missing.");
