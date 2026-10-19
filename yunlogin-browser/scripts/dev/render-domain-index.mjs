#!/usr/bin/env node

/**
 * Render a business-domain index for the management-center API.
 *
 * Aggregates the observed enum-like fields (FIELD_VALUES.md) and the confirmed code meanings
 * (CODE_LEGENDS.md) into families keyed by the route prefix, so a reader can browse the API by
 * business area instead of by endpoint. Route counts come from route-sweep.json.
 *
 * Usage:
 *   node scripts/dev/render-domain-index.mjs [--out <md>]
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const serverDir = path.join(skillDir, "references", "server-api");
const args = process.argv.slice(2);
function option(name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`${name} requires a value`);
  return v;
}
const outputPath = option("--out", path.join(serverDir, "DOMAIN_INDEX.md"));

const FAMILIES = [
  { key: "/v2/newbrowser", title: "Environments", purpose: "Environment (browser profile) lifecycle, fingerprint, storage, sharing, credentials, recycle bin." },
  { key: "/v2/proxy", title: "Proxies", purpose: "Self, dynamic, cloud and VCNP proxies, proxy tags, authority and IP segments." },
  { key: "/v2/cost", title: "Billing, Orders And Invoices", purpose: "Plans, orders, balance, coupons, recharge, invoice titles and applications." },
  { key: "/v2/team", title: "Team, Members And Permissions", purpose: "Company, departments, members, roles, invitations, authentication and plans." },
  { key: "/v2/plugin", title: "Plugins", purpose: "Plugin market, installed plugins, plugin groups and visibility." },
  { key: "/v2/rpa", title: "RPA Automation", purpose: "RPA groups, shops, plan management and task logs." },
  { key: "/v2/retail", title: "Retail And Distribution", purpose: "Retailer settlement, promotion links, withdrawals and invite lists." },
  { key: "/v2/sso", title: "Session And Authentication", purpose: "Login, token refresh, profile, binding, password and onboarding steps." },
  { key: "/v2/message", title: "Notifications And SMS", purpose: "In-app notices and SMS settings." },
  { key: "/v2/news", title: "Help And Legal Content", purpose: "Help centre, contact/QR settings and the legal agreement pages." },
  { key: "/v2/logs", title: "Audit Logs", purpose: "Authorization log permissions, options and member login logs." },
  { key: "/v2/admin", title: "Administration", purpose: "Internal admin surfaces such as third-party proxy pages." },
  { key: "/v2/tg", title: "Telemetry", purpose: "Client error reporting and browser IP telemetry." },
  { key: "/v2/yun", title: "Yun Services", purpose: "Yun-hosted share and expiry surfaces." },
  { key: "/v2/check", title: "Checks", purpose: "Proxy check helper." },
  { key: "/v2/collector", title: "Collector", purpose: "Management-center web telemetry." },
  { key: "/api/v1", title: "Legacy v1 Prefix", purpose: "Historical `/api/v1/*` client calls; the origin answers 405 HTML, not JSON." },
  { key: "/api/v2", title: "Legacy v2 Prefix", purpose: "Historical `/api/v2/*` client calls; the origin answers 405 HTML, not JSON." },
];

function familyOf(routePath) {
  const family = FAMILIES.find((f) => routePath === f.key || routePath.startsWith(`${f.key}/`));
  return family ?? { key: "(other)", title: "Other", purpose: "" };
}

// --- route counts from the sweep -------------------------------------------------------------
const sweep = JSON.parse(await readFile(path.join(serverDir, "route-sweep.json"), "utf8"));
const counts = new Map();
for (const f of FAMILIES) counts.set(f.key, { total: 0, live: 0, skipped: 0, error: 0, notServed: 0 });
for (const r of sweep.results) {
  const f = familyOf(r.path);
  const c = counts.get(f.key) ?? { total: 0, live: 0, skipped: 0, error: 0, notServed: 0 };
  c.total += 1;
  if (r.status === "live") { c.live += 1; if (r.httpStatus === 404) c.notServed += 1; }
  else if (r.status === "skipped") c.skipped += 1;
  else c.error += 1;
  counts.set(f.key, c);
}

// --- observed enum values from FIELD_VALUES.md -----------------------------------------------
const valuesText = await readFile(path.join(serverDir, "FIELD_VALUES.md"), "utf8");
const valueRows = [];
{
  let section = null;
  for (const line of valuesText.split(/\r?\n/)) {
    const h = line.match(/^## (GET|POST|PUT|DELETE) (\S+)$/);
    if (h) { section = h[2]; continue; }
    const m = line.match(/^\| `(\$[^`]+)` \| ([^|]*)\| (.*) \|$/);
    if (!m || !section) continue;
    const values = [...m[3].matchAll(/`([^`]*)`/g)].map((x) => x[1]);
    if (values.length === 0) continue;
    valueRows.push({ route: section, field: m[1], types: m[2].trim(), values });
  }
}

const ENVELOPE_LEAF = new Set(["code", "msgcode", "msg", "reqid", "traceid", "requestid", "total", "done", "current_page", "per_page", "page", "pagesize", "number", "offer", "count", "hasnext"]);
const byFamily = new Map();
for (const row of valueRows) {
  const family = familyOf(row.route).key;
  const segments = row.field.replace(/\[\]$/g, "").split(".");
  const leaf = segments.pop();
  if (ENVELOPE_LEAF.has(leaf.toLowerCase())) continue;
  const parent = segments.pop();
  const label = parent && parent !== "$" ? `${parent}.${leaf}` : leaf;
  if (!byFamily.has(family)) byFamily.set(family, new Map());
  const leaves = byFamily.get(family);
  if (!leaves.has(label)) leaves.set(label, { routes: new Set(), values: new Set(), types: new Set() });
  const entry = leaves.get(label);
  entry.routes.add(row.route);
  for (const v of row.values) entry.values.add(v);
  for (const t of row.types.split(",").map((s) => s.trim()).filter(Boolean)) entry.types.add(t);
}

// --- confirmed legends from CODE_LEGENDS.md --------------------------------------------------
const legendsText = await readFile(path.join(serverDir, "CODE_LEGENDS.md"), "utf8");
const legendRows = [];
{
  let section = null;
  for (const line of legendsText.split(/\r?\n/)) {
    const h = line.match(/^## (GET|POST|PUT|DELETE) (\S+)$/);
    if (h) { section = h[2]; continue; }
    const m = line.match(/^\| `([^`]+)` \| `([^`]+)` \| (.+?) \|$/);
    if (!m || !section) continue;
    legendRows.push({ route: section, field: m[1], code: m[2], meaning: m[3] });
  }
}

const lines = [];
lines.push("# Server API Domain Index", "");
lines.push("Browse the management-center API by business area. Each family aggregates the enum-like fields that");
lines.push("were observed live, the values they carried, and the codes whose meaning the API itself confirmed");
lines.push("through a paired `*_text` label. Route counts come from the full 507-route sweep.");
lines.push("");
lines.push("- Field paths and types per endpoint: [ROUTE_FIELDS.md](ROUTE_FIELDS.md)");
lines.push("- Observed value domains: [FIELD_VALUES.md](FIELD_VALUES.md)");
lines.push("- Confirmed code meanings: [CODE_LEGENDS.md](CODE_LEGENDS.md)");
lines.push("- Envelope and key-name traps: [RESPONSE_SHAPES.md](RESPONSE_SHAPES.md)");
lines.push("");

lines.push("## Family Overview", "");
lines.push("| Family | Title | Routes | Live | Skipped | Errors | Not served |");
lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: |");
for (const f of FAMILIES) {
  const c = counts.get(f.key) ?? {};
  lines.push(`| \`${f.key}\` | ${f.title} | ${c.total ?? 0} | ${c.live ?? 0} | ${c.skipped ?? 0} | ${c.error ?? 0} | ${c.notServed ?? 0} |`);
}
lines.push("");

// Enum-like fields (small, closed-looking value sets) rank above high-cardinality data such as
// region codes, so each family lists its semantics before its geography.
function rank(entry) {
  const n = entry.values.size;
  if (n >= 2 && n <= 20) return 0;
  if (n === 1) return 1;
  return 2;
}

for (const f of FAMILIES) {
  const c = counts.get(f.key) ?? {};
  lines.push(`## ${f.title} - \`${f.key}\``, "");
  lines.push(`${f.purpose}`, "");
  lines.push(`Routes: ${c.total ?? 0} total, ${c.live ?? 0} probed, ${c.skipped ?? 0} skipped (writes/blocklist), ${c.error ?? 0} transport errors, ${c.notServed ?? 0} not served (HTTP 404).`, "");

  const leaves = byFamily.get(f.key);
  if (leaves && leaves.size > 0) {
    const ranked = [...leaves.entries()]
      .map(([leaf, e]) => ({ leaf, ...e }))
      .sort((a, b) => rank(a) - rank(b) || b.values.size - a.values.size || a.leaf.localeCompare(b.leaf))
      .slice(0, 18);
    lines.push("Notable fields and observed values:", "");
    lines.push("| Field | Types | Routes | Observed values |");
    lines.push("| --- | --- | ---: | --- |");
    for (const entry of ranked) {
      const types = [...entry.types].join(", ").replace(/\|/g, "\\|");
      const total = entry.values.size;
      const sample = [...entry.values].slice(0, 8).map((v) => "`" + String(v).replace(/\|/g, "\\|") + "`").join(", ");
      const values = total > 24 ? sample + ` ... (${total} observed values, high cardinality)` : sample + (total > 8 ? ` (+${total - 8} more)` : "");
      lines.push(`| \`${entry.leaf}\` | ${types} | ${entry.routes.size} | ${values} |`);
    }
    lines.push("");
  }

  const legends = legendRows.filter((r) => familyOf(r.route).key === f.key);
  if (legends.length > 0) {
    lines.push("Confirmed code meanings:", "");
    lines.push("| Route | Field | Code | Meaning |");
    lines.push("| --- | --- | --- | --- |");
    for (const r of legends) lines.push(`| \`${r.route}\` | \`${r.field}\` | \`${r.code}\` | ${r.meaning} |`);
    lines.push("");
  }
}

lines.push("## Cross-Domain Traps", "");
lines.push("| Trap | Detail |");
lines.push("| --- | --- |");
lines.push("| Two success codes | `/v2/*` mostly uses `code: 200`; `/v2/userapi/*` and the RPA lists use `code: 0`. |");
lines.push("| `auto_renew: 1` | Means auto-renew **off** (`????`) on the VCNP lists - the inverse of the usual flag. |");
lines.push("| `pay_status` vs `order_status` | Different enums with overlapping numbers; always read the paired `*_text`. |");
lines.push("| Singular vs plural keys | `shopids`, `device_ids`, `ids` differ per route; the wrong key often returns an empty result instead of an error. |");
lines.push("| Silent success | Several create routes answer `200` without creating anything. Always re-read after a write. |");
lines.push("| Legacy prefix | `/api/*` returns 405 HTML for POST and a fixed SPA shell for GET. |");
lines.push("");
lines.push("See [RESPONSE_SHAPES.md](RESPONSE_SHAPES.md) for the full trap list and [ERRORS.md](ERRORS.md) for the code table.");
lines.push("");

await writeFile(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${path.relative(skillDir, outputPath)}`);
