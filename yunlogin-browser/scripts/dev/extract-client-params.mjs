#!/usr/bin/env node
// Extract candidate request-field keys from client-callsites.json.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "references", "server-api");
const data = JSON.parse(await readFile(path.join(dir, "client-callsites.json"), "utf8"));
const table = JSON.parse(await readFile(path.join(dir, "client-routes.json"), "utf8"));
const pathByName = {};
for (const [key, name] of Object.entries(table.routes)) pathByName[name] = key;

const KEY_RE = /([A-Za-z_$][A-Za-z0-9_$]*)\s*:/g;
const SKIP_IDENTS = new Set(["const", "let", "var", "true", "false", "null", "undefined", "return", "function", "if", "else"]);

function keysIn(text) {
  const keys = new Set();
  for (const m of text.matchAll(KEY_RE)) keys.add(m[1]);
  return [...keys];
}

function balancedObject(text, openIndex) {
  let depth = 0;
  for (let k = openIndex; k < text.length; k++) {
    const c = text[k];
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) return text.slice(openIndex, k + 1); }
  }
  return "";
}

function extractKeys(ctx, name) {
  const i = ctx.indexOf(name);
  if (i < 0) return [];
  const p = ctx.indexOf("(", i + name.length);
  if (p < 0) return [];
  let depth = 0, end = -1;
  for (let k = p; k < ctx.length; k++) {
    const c = ctx[k];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") { depth--; if (depth === 0) { end = k; break; } }
  }
  if (end < 0) return [];
  const args = ctx.slice(p + 1, end);
  const direct = keysIn(args);
  if (direct.length) return direct;

  // Most call sites pass a variable, for example `deleteRpaGroup(a)` where `const a = { groupId: e }`
  // sits a few characters earlier. Follow each identifier in the argument list back to its object
  // literal so the request keys are still recovered.
  const idents = [...new Set([...args.matchAll(/[A-Za-z_$][A-Za-z0-9_$]*/g)].map((m) => m[0]))]
    .filter((x) => !SKIP_IDENTS.has(x) && x !== name);
  const before = ctx.slice(Math.max(0, i - 600), i);
  const found = new Set();
  for (const ident of idents) {
    const re = new RegExp("(?:const|let|var)?\\s*" + ident.replace(/\$/g, "\\$") + "\\s*=\\s*\\{");
    const m = re.exec(before);
    if (!m) continue;
    const openIndex = before.indexOf("{", m.index);
    if (openIndex < 0) continue;
    for (const k of keysIn(balancedObject(before, openIndex))) found.add(k);
  }
  return [...found];
}

const out = {};
const lines = ["# Client Call Sites (Request-Parameter Evidence)", ""];
lines.push("Extracted from the management-center page chunks. The bundle mixes the management-center, local, and local-client surfaces, so a path here does not prove its target; see WORKFLOW.md for the prefix rule. Each entry shows the client function, its method/path, candidate request-field keys parsed from the call arguments, and the raw call context for manual confirmation.", "");
lines.push("When a call passes a variable instead of an inline literal, the keys are read from that variable's object literal in the surrounding context. Keys are still heuristic: confirm a large expression against the raw context shown for each entry.", "");
let withKeys = 0;
for (const [name, hits] of Object.entries(data.callsites)) {
  const keys = new Set();
  for (const h of hits) for (const k of extractKeys(h.ctx, name)) keys.add(k);
  const keyList = [...keys].filter((k) => k !== name);
  if (keyList.length) withKeys++;
  out[name] = { route: pathByName[name] ?? "", keys: keyList, hits };
}
lines.push(`- Routes with call sites: ${Object.keys(data.callsites).length}`);
lines.push(`- Routes with parsed request keys: ${withKeys}`);
lines.push("");
for (const [name, info] of Object.entries(out).sort((a, b) => (a[1].route || "").localeCompare(b[1].route || ""))) {
  lines.push(`## ${info.route || "(unknown route)"}`, "");
  lines.push(`- Client name: \`${name}\``);
  lines.push(`- Candidate request keys: ${info.keys.length ? info.keys.map((k) => `\`${k}\``).join(", ") : "_none parsed_"}`, "");
  for (const h of info.hits.slice(0, 1)) lines.push("```text", h.ctx, "```", "");
}
await writeFile(path.join(dir, "client-params.json"), JSON.stringify({ extractedAt: new Date().toISOString(), routesWithKeys: withKeys, params: out }, null, 2), "utf8");
await writeFile(path.join(dir, "CLIENT_CALLSITES.md"), lines.join("\n"), "utf8");
console.log(`Wrote CLIENT_CALLSITES.md / client-params.json: routes=${Object.keys(out).length} withKeys=${withKeys}`);
