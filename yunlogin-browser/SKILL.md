---
name: yunlogin-browser
description: Operate YunLogin browser environments and accounts through its local desktop, local client, and management-center APIs. Route each request to the correct surface and read the endpoint contract before sending it. Not for arbitrary website automation.
license: MIT
metadata:
  short-description: Manage YunLogin environments, accounts, and proxies by API
  author: PenBo
  version: 1.1.0
  updated: 2026-10-19
  repository: https://github.com/PenBo1/yunlogin-browser-skill
---

# YunLogin Browser And Server APIs

YunLogin exposes three documented surfaces. Decide the target before reading documentation or building a request:

| Surface | Origin | Index |
| --- | --- | --- |
| Local API | `http://localhost:50213/api/v2/...` | [references/api/INDEX.md](references/api/INDEX.md) |
| Local client API | loopback port discovered at runtime | [references/client-api/INDEX.md](./references/client-api/INDEX.md) |
| Server API | `https://d126447d359e70c0.yunlogin.com/v2/...` | [references/server-api/INDEX.md](references/server-api/INDEX.md) |

Never silently switch surfaces. A path or parameter that works on one surface does not prove it exists on another.

## Client Availability And Startup

Before a local call, check client availability:

```powershell
node scripts/yunlogin-client.mjs status
```

Follow [references/client-api/STARTUP.md](./references/client-api/STARTUP.md) for startup consent and installation. Run `node scripts/yunlogin-ports.mjs` for fresh ports; never reuse observed numbers.

The client bundle mixes all three, so a path alone does not prove its target: `/api/v1/client/`, `/api/v1/settings/`, `/api/v1/cores/`, and `/api/v1/ipify/` are **local client-API** paths, and sending one to the server origin answers HTTP 405 or a plain 404. Read [references/server-api/WORKFLOW.md](references/server-api/WORKFLOW.md) for the rest of the routing rule.

## Invocation And Execution

`agents/openai.yaml` enables automatic discovery, but discovery never sends a request. Send a live request only when the user asks for an operation that requires it.

- Read the selected endpoint document before calling it.
- Use `--dry-run` before the first live call. On server routes this is mandatory, because some create routes accept an empty payload and store a record.
- A missing token blocks that surface only. Do not fall back to a different surface.
- If a request could belong to either surface and the user has not said which, ask.
- Write any generated artifact outside this skill folder, and only where the user asks. Never write into the skill directory.

## API Navigation

Full map: [references/INDEX.md](references/INDEX.md). Server route list: [references/server-api/INDEX.md](references/server-api/INDEX.md). What was tested and what was not: [references/server-api/COVERAGE.md](references/server-api/COVERAGE.md).

**Split the work by surface: query with the server API, launch with the local API.**

| Task | Surface | Entry point |
| --- | --- | --- |
| Read or search account data: environments, proxies, accounts, team, plans, notices | Server | [references/server-api/INDEX.md](references/server-api/INDEX.md) |
| Create, clone, delete, group, or tag an environment | Server | `environment-create`, `environment-clone`, `environment-delete` |
| **Start, stop, or check an environment browser** | **Local** | `POST /api/v2/browser/start`, `GET /api/v2/browser/status`, `GET /api/v2/browser/stop` |
| Inject or clear environment Cookies | Local | [references/api/INDEX.md](references/api/INDEX.md) |
| Read GPU facts or clear local environment data | Local client | [references/client-api/INDEX.md](./references/client-api/INDEX.md) |
| Drive the launched browser | CDP | [references/workflows/cdp-automation.md](./references/workflows/cdp-automation.md) |
| Set up or refresh a credential | Either | [references/workflows/token-lifecycle.md](./references/workflows/token-lifecycle.md) |

The server API has no launch route, so an environment cannot be started from the management center. Resolve the target with the server API, then launch it with the local API and attach over CDP.

## Token Lifecycle

Workbench is the authority for the management-center credential. Every authenticated management operation re-reads the page's token, current user, and selected company before sending a business request. The cache is one user-level atomic snapshot, never an independent login or refresh source. The Workbench extension is outside this flow. On missing CDP, logout, mismatch, or sync failure, stop and guide the user to Workbench.

```powershell
node scripts/yunlogin-auth.mjs status
node scripts/yunlogin-auth.mjs sync-workbench --dry-run
node scripts/yunlogin-auth.mjs sync-workbench
node scripts/yunlogin-auth.mjs ensure-server
```

`status` compares Workbench with the snapshot without writing; `sync-workbench` validates and replaces it. The helpers do not call `tokenRefresh` separately. Browser automation can attach directly to the verified CDP URL through Playwright CLI, without credential synchronization. Never print, commit, or paste a token.

Read [references/workflows/token-lifecycle.md](./references/workflows/token-lifecycle.md) for source fields, consistency checks, failure handling, and cache rules. Ask the user to finish login or company selection in Workbench when synchronization cannot complete.

## Environment Lifecycle

Read [references/workflows/environment-lifecycle.md](./references/workflows/environment-lifecycle.md) before touching environments, groups, or tags, and [references/workflows/environment-inputs.md](./references/workflows/environment-inputs.md) for the input map and field type rules.

Creation, deletion, grouping, and tagging are mutations: confirm the target with the user first. Resolve every field of a write from its documented source - `putalluri` is an upsert keyed by `browser.shopid`, and a read response is not a valid write body. Use `scripts/yunlogin-env.mjs` so every step stays on a documented route: `create` refuses a remark, tag, or group until `--confirm-attributes` is passed, and every delete refuses to run until `--confirm-delete` or `--confirm-clean`. Tags need the server route; tag colours come from [references/server-api/tag-colors.md](references/server-api/tag-colors.md).

## Local Workflow

1. Find the operation in [references/api/INDEX.md](references/api/INDEX.md) and read its document.
2. Check availability with `GET /status`; local success codes are endpoint-specific.
3. Resolve names to IDs with documented reads before mutating anything.

```powershell
node scripts/yunlogin-api.mjs local GET /status
node scripts/yunlogin-api.mjs local POST /documented/path '{"documentedField":"value"}' --dry-run
```

## Server Workflow

1. Start with [references/server-api/INDEX.md](references/server-api/INDEX.md) to pick the route, then read its endpoint document plus [references/server-api/ERRORS.md](references/server-api/ERRORS.md).
2. Synchronize the Workbench session with `node scripts/yunlogin-auth.mjs sync-workbench`. See [references/server-api/TOKEN_SETUP.md](references/server-api/TOKEN_SETUP.md).
3. Call a cataloged endpoint ID with `scripts/yunlogin-server-api.mjs`. It rejects unknown IDs and supports `--dry-run`.
4. Read the HTTP status and the business `code` separately. Most failures arrive as HTTP 200 with a non-200 code, and the message may be localised.

```powershell
node scripts/yunlogin-server-api.mjs browser-list --dry-run
node scripts/yunlogin-server-api.mjs browser-cookie --body '{"shopid":"<shopid>"}' --dry-run
node scripts/yunlogin-server-api.mjs proxy-cloud-list --query page=1 --query per_page=20
```

The helper accepts only the 54 endpoints cataloged in [references/server-api/endpoints.json](references/server-api/endpoints.json) and never sends an arbitrary URL. All 54 have been exercised; the evidence is in [references/server-api/TEST_REPORT.md](references/server-api/TEST_REPORT.md). The live response field path/type inventory is in [references/server-api/FIELD_INVENTORY.md](references/server-api/FIELD_INVENTORY.md).

## CDP Automation

Read [references/workflows/cdp-automation.md](./references/workflows/cdp-automation.md) to launch an environment and connect over CDP.

- Use `scripts/yunlogin-cdp.mjs` for environment browser `start`, `check`, `targets`, `open`, `eval`, and `storage-get`; use `yunlogin-client.mjs start` for Workbench CDP and `yunlogin-auth.mjs sync-workbench` for credentials.
- `data.ws.puppeteer` from the launch response is the CDP URL; an external CDP URL must be supplied explicitly.
- The official Playwright CLI is optional. Detect it first; ask before installing the CLI or its skill, then follow [references/workflows/playwright-cli.md](./references/workflows/playwright-cli.md). Use `yunlogin-client.mjs status` for the current Workbench CDP URL, attach with `playwright-cli -s=yunlogin-workbench attach --cdp=<url>`, and detach when finished.
- For an already-running Windows `fb.exe` with no remote-debugging transport, use `scripts/yunlogin-fb-cdp.mjs` to inspect the process, plan a relaunch, and verify CDP. The process cannot be modified in place; `--confirm-restart` is required, the port is loopback-only, and raw command lines are redacted by default.
- `append_cmd` belongs to the local launch call only. Do not override environment-managed profile, proxy, fingerprint, or debugging-port settings.

## Authorization And Sensitive Data

A direct user request for a clearly identified read or change is authorization for that operation. Ask when the surface, the affected IDs, or the scope is ambiguous.

Require explicit authorization before mutations, credential changes, Cookie operations, proxy changes, account changes, or broad batch requests. Treat stored Cookies and account records as sensitive even for reads.

Never place tokens, Cookies, proxy credentials, account passwords, 2FA secrets, or session data in source files, Markdown, command arguments, logs, or responses. The helpers redact sensitive response fields by default; use `--show-sensitive` only when the user needs the raw values and the destination is safe.

## Maintenance

- Read [references/scripts.md](references/scripts.md) when selecting or maintaining a helper.
- Keep all skill text in English.
- Read [references/testing.md](references/testing.md) for current coverage and [references/server-api/TEST_REPORT.md](references/server-api/TEST_REPORT.md) for per-endpoint results.
- Run `node scripts/yunlogin-doctor.mjs` after any change. Add `--audit` to run the full research audit (documentation, drift replay, write and delete round trips, residue check). It checks structure, catalog consistency, secret and encoding hygiene, and the behaviour of every helper CLI; add `--live` to probe the running desktop and the cached server session.
- After changing either reference set or a catalog consumer, run `node scripts/dev/validate-api-docs.mjs`. The doctor also enforces the skill-creator frontmatter contract (hyphen-case name, allowed keys, a non-empty description with no angle brackets or TODO markers), so `quick_validate.py` from the skill-creator stays satisfied; run `node scripts/dev/check-links.mjs` after moving or renaming any reference.
- Keep the helpers separated: the local helper must not accept a server origin, and the server helper must not accept a loopback origin.
