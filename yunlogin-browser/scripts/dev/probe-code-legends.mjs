#!/usr/bin/env node

/**
 * Read-only code-legend probe.
 *
 * Several read routes return a numeric code next to a human label (``pay_type`` /
 * ``pay_type_text``). This script walks those payloads row by row and records the
 * code -> label pairs, so the skill can document what each value means.
 *
 * Only the paired labels are written; no free-form row data is kept.
 *
 * Usage:
 *   node scripts/dev/probe-code-legends.mjs [--output <file.json>]
 */

import { writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { readServerToken } from "../lib/local-token-store.mjs";

const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}
const outputPath = option("--output", path.join(os.tmpdir(), "yunlogin-code-legends.json"));

const base = "https://d126447d359e70c0.yunlogin.com";
const token = await readServerToken();
const headers = { accept: "application/json, text/plain, */*", authorization: `Bearer ${token}`, "content-type": "application/json", lang: "zh", "pay-lang": "zh-TW" };


// Some routes carry the label on a header row instead of in a sibling text field, for example
// team/right/list marks each permission module with flagId 0 and puts the module name in rightName.
const RULES = [
  {
    path: "/v2/team/right/list",
    // Each permission module owns a block of rows. Most modules mark the header with flagId 0;
    // one module does not, so fall back to the lowest flagId seen for that type.
    header: new Map(),
    collect(row) {
      if (!row.rightName) return;
      const key = String(row.type);
      const flagId = Number.parseInt(row.flagId ?? "0", 10);
      const current = this.header.get(key);
      if (current === undefined || flagId < current.flagId) this.header.set(key, { flagId, label: row.rightName });
    },
    finish(add) {
      for (const [type, entry] of this.header) add("$.data[].type", type, entry.label);
    },
  },
  {
    path: "/v2/team/right/listTemplate",
    collect(row, add) {
      if (row.name && row.templateType !== undefined) add("$.data[].templateType", row.templateType, row.name);
    },
  },
];

function applyRules(rule, payload, sink) {
  const add = (field, code, label) => {
    if (code === undefined || code === null || !label) return;
    if (!sink.has(field)) sink.set(field, new Map());
    sink.get(field).set(String(code), String(label).trim());
  };
  const visit = (value) => {
    if (Array.isArray(value)) { for (const item of value) visit(item); return; }
    if (!value || typeof value !== "object") return;
    rule.collect(value, add);
    for (const child of Object.values(value)) visit(child);
  };
  visit(payload);
  rule.finish?.(add);
}

const targets = [
  ["GET", "/v2/cost/costmanagement/getOrderManagementNew", undefined, { page: 1, pageSize: 100 }],
  ["GET", "/v2/cost/costmanagement/getrechargehistory", undefined],
  ["GET", "/v2/proxy/device/vcnplist", undefined, { page: 1, pageSize: 100 }],
  ["POST", "/v2/proxy/device/findVcnpList", { page: 1, pageSize: 100 }],
  ["GET", "/v2/plugin/getPluginCategoryGroupList", undefined],
  ["GET", "/v2/cost/costmanagement/getorderinfo", undefined],
  ["POST", "/v2/newbrowser/getUserPasswordList", { page: 1, pageSize: 200, number: 200, offer: 0 }],
  ["POST", "/v2/team/getMembers", {}],
  ["POST", "/v2/newbrowser/getconditionshops", { number: 100, offer: 0 }],
  ["GET", "/v2/proxy/device/findTags", undefined, { page: 1, pageSize: 200 }],
  ["POST", "/v2/team/loginlogs", { page: 1, pageSize: 50 }],
  ["GET", "/v2/cost/device/findorder", undefined, { page: 1, pageSize: 50 }],
  ["POST", "/v2/team/right/list", {}],
  ["POST", "/v2/team/right/listTemplate", {}],
];

function walk(value, fieldPath, sink) {
  if (Array.isArray(value)) { for (const item of value) walk(item, `${fieldPath}[]`, sink); return; }
  if (!value || typeof value !== "object") return;
  const keys = Object.keys(value);
  for (const key of keys) {
    if (!/(_text|Text)$/.test(key)) continue;
    const baseKey = key.replace(/(_text|Text)$/, "");
    const codeKey = keys.find((k) => k === baseKey) ?? keys.find((k) => k.toLowerCase() === baseKey.toLowerCase());
    if (codeKey === undefined) continue;
    const code = value[codeKey];
    const label = value[key];
    if (code === undefined || code === null || typeof label !== "string" || !label.trim()) continue;
    const target = `${fieldPath}.${codeKey}`.replace(/^\$\./, "$.");
    if (!sink.has(target)) sink.set(target, new Map());
    sink.get(target).set(String(code), label.trim());
  }
  for (const [key, child] of Object.entries(value)) walk(child, `${fieldPath}.${key}`, sink);
}

const results = [];
for (const [method, routePath, body, query] of targets) {
  const url = new URL(routePath, base);
  for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, String(v));
  const init = { method, headers, signal: AbortSignal.timeout(20000) };
  if (method !== "GET") init.body = JSON.stringify(body ?? {});
  try {
    const response = await fetch(url, init);
    const text = await response.text();
    let payload; try { payload = JSON.parse(text); } catch {}
    const sink = new Map();
    if (payload) walk(payload, "$", sink);
    const rule = RULES.find((r) => r.path === routePath);
    if (rule && payload) applyRules(rule, payload, sink);
    const legends = {};
    for (const [field, pairs] of sink) legends[field] = Object.fromEntries([...pairs.entries()].sort());
    results.push({ method, path: routePath, httpStatus: response.status, code: payload?.code, legends });
    console.error(`${routePath} http=${response.status} code=${payload?.code ?? "-"} legends=${Object.keys(legends).length}`);
  } catch (error) {
    results.push({ method, path: routePath, error: error.cause?.code ?? error.name });
    console.error(`${routePath} ERROR ${error.message}`);
  }
}
await writeFile(outputPath, JSON.stringify({ testedAt: new Date().toISOString(), origin: base, results }, null, 2), "utf8");
console.error(`Wrote ${outputPath}`);
