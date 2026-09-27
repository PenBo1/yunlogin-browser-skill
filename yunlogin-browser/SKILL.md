---
name: yunlogin-browser
description: Operate YunLogin's local desktop and management-center APIs for browser environments, accounts, cookies, proxies, groups, tags, and tokens. Routes each request to the correct surface; do not use for arbitrary website automation.
license: MIT
metadata:
  short-description: Manage YunLogin environments, accounts, and proxies by API
  author: PenBo
  version: 1.0.0
  updated: 2026-09-24
  repository: https://github.com/PenBo1/yunlogin-browser-skill
---

# YunLogin Browser And Server APIs

YunLogin exposes three documented surfaces. Decide the target before reading documentation or building a request:

| Surface | Origin | Index |
| --- | --- | --- |
| Local API | `http://localhost:50213/api/v2/...` | [references/api/README.md](references/api/README.md) |
| Local client API | `http://127.0.0.1:52446/api/v1/...` | [references/client-api/README.md](./references/client-api/README.md) |
| Server API | `https://d126447d359e70c0.yunlogin.com/v2/...` | [references/server-api/INDEX.md](references/server-api/INDEX.md) |

Never silently switch surfaces. A path or parameter that works on one surface does not prove it exists on another.

## Invocation And Execution

`agents/openai.yaml` enables automatic discovery, but discovery never sends a request. Send a live request only when the user asks for an operation that requires it.

- Read the selected endpoint document before calling it.
- Use `--dry-run` before the first live call. On server routes this is mandatory, because some create routes accept an empty payload and store a record.
- A missing token blocks that surface only. Do not fall back to a different surface.
- If a request could belong to either surface and the user has not said which, ask.

## API Navigation

Full map: [references/INDEX.md](references/INDEX.md). Server route list: [references/server-api/INDEX.md](references/server-api/INDEX.md).

**Split the work by surface: query with the server API, launch with the local API.**

| Task | Surface | Entry point |
| --- | --- | --- |
| Read or search account data: environments, proxies, accounts, team, plans, notices | Server | [references/server-api/INDEX.md](references/server-api/INDEX.md) |
| Create, clone, delete, group, or tag an environment | Server | `environment-create`, `environment-clone`, `environment-delete` |
| **Start, stop, or check an environment browser** | **Local** | `POST /api/v2/browser/start`, `GET /api/v2/browser/status`, `GET /api/v2/browser/stop` |
| Inject or clear environment Cookies | Local | [references/api/README.md](references/api/README.md) |
| Read GPU facts or clear local environment data | Local client | [references/client-api/README.md](./references/client-api/README.md) |
| Drive the launched browser | CDP | [references/workflows/cdp-automation.md](./references/workflows/cdp-automation.md) |
| Set up or refresh a credential | Either | [references/workflows/token-lifecycle.md](./references/workflows/token-lifecycle.md) |

The server API has no launch route, so an environment cannot be started from the management center. Resolve the target with the server API, then launch it with the local API and attach over CDP.

## Token Lifecycle

Two credentials exist and are not interchangeable: the **local token** grants the loopback API and is captured from the bundled browser extension, and the **server token** grants the management-center API and is supplied by the user once. Both are cached in the user profile, outside this skill. The server cache also holds the company and user, so environment variables are optional once a session is saved. It additionally records the expiry returned by `POST /v2/sso/auth/tokenRefresh`, and the helpers refresh before a call when that expiry is close, so a session stays warm without user action.

```powershell
node scripts/yunlogin-auth.mjs status
node scripts/yunlogin-auth.mjs save-server-token
node scripts/yunlogin-auth.mjs ensure-server
node scripts/yunlogin-auth.mjs refresh-server-token
node scripts/yunlogin-auth.mjs ensure-local --confirm-create
```

Replace a credential only when it stops working. A rejected local token is captured again; a rejected server token is deleted and needs a fresh value from the user. Never print, commit, or paste a token, and keep the cache files outside the repository.

Read [references/workflows/token-lifecycle.md](./references/workflows/token-lifecycle.md) for storage paths, resolution order, and the refresh rules.

## Environment Lifecycle

Read [references/workflows/environment-lifecycle.md](./references/workflows/environment-lifecycle.md) before touching environments, groups, or tags.

Resolve every field of a create or modify from its documented source before writing. `putalluri` is an upsert keyed by `browser.shopid`, and a read response is not a valid write body. Read [references/workflows/environment-inputs.md](./references/workflows/environment-inputs.md) for the input map and the field type rules.

- Create and delete through the server API first and the local API second.
- Use `scripts/yunlogin-env.mjs` so every step stays on a documented route.
- Names are normalized before sending: unsupported characters collapse to a dash, and the result is capped at 32 characters. Keep names short and put detail in the remark.
- Tag colours come from the eight-value palette in [references/server-api/tag-colors.md](references/server-api/tag-colors.md).

Creation, deletion, grouping, and tagging are mutations. Confirm the target with the user first.

- `create` refuses a remark, tag, or group until `--confirm-attributes` is passed.
- Every delete command refuses to run until `--confirm-delete` (or `--confirm-clean`) is passed.
- Without the flag the helper exits with code 2 and a `needsConfirmation` payload instead of acting.

```powershell
node scripts/yunlogin-env.mjs list --name <optional filter>
node scripts/yunlogin-env.mjs create --name <name> --dry-run
node scripts/yunlogin-env.mjs delete --account-id <account-id> --confirm-delete
```

## Local Workflow

1. Find the operation in [references/api/README.md](references/api/README.md) and read its document.
2. Check availability with `GET /status`; local success codes are endpoint-specific.
3. Resolve names to IDs with documented reads before mutating anything.

```powershell
node scripts/yunlogin-api.mjs local GET /status
node scripts/yunlogin-api.mjs local POST /documented/path '{"documentedField":"value"}' --dry-run
```

## Server Workflow

1. Start with [references/server-api/INDEX.md](references/server-api/INDEX.md) to pick the route, then read its endpoint document plus [references/server-api/ERRORS.md](references/server-api/ERRORS.md).
2. Configure the session with `node scripts/yunlogin-auth.mjs save-server-token`. See [references/server-api/TOKEN_SETUP.md](references/server-api/TOKEN_SETUP.md).
3. Call a cataloged endpoint ID with `scripts/yunlogin-server-api.mjs`. It rejects unknown IDs and supports `--dry-run`.
4. Read the HTTP status and the business `code` separately. Most failures arrive as HTTP 200 with a non-200 code, and the message may be localised.

```powershell
node scripts/yunlogin-server-api.mjs browser-list --dry-run
node scripts/yunlogin-server-api.mjs browser-cookie --body '{"shopid":"<shopid>"}' --dry-run
node scripts/yunlogin-server-api.mjs proxy-cloud-list --query page=1 --query per_page=20
```

The helper accepts only the 53 endpoints cataloged in [references/server-api/endpoints.json](references/server-api/endpoints.json) and never sends an arbitrary URL. All 53 have been exercised; the evidence is in [references/server-api/TEST_REPORT.md](references/server-api/TEST_REPORT.md).

## CDP Automation

Read [references/workflows/cdp-automation.md](./references/workflows/cdp-automation.md) to launch an environment and connect over CDP.

- Use `scripts/yunlogin-cdp.mjs` for `start`, `check`, `targets`, `open`, `eval`, `storage-get`, and `capture-local-token`.
- `data.ws.puppeteer` from the launch response is the CDP URL; an external CDP URL must be supplied explicitly.
- The official Playwright CLI is optional. Offer the pairing, **ask the user before installing**, then follow [references/workflows/playwright-cli.md](./references/workflows/playwright-cli.md). Attach with `playwright-cli -s=yunlogin attach --cdp=<url>` and detach when finished.
- `append_cmd` belongs to the local launch call only. Do not override environment-managed profile, proxy, fingerprint, or debugging-port settings.

## Authorization And Sensitive Data

A direct user request for a clearly identified read or change is authorization for that operation. Ask when the surface, the affected IDs, or the scope is ambiguous.

Require explicit authorization before mutations, credential changes, Cookie operations, proxy changes, account changes, or broad batch requests. Treat stored Cookies and account records as sensitive even for reads.

Never place tokens, Cookies, proxy credentials, account passwords, 2FA secrets, or session data in source files, Markdown, command arguments, logs, or responses. The helpers redact sensitive response fields by default; use `--show-sensitive` only when the user needs the raw values and the destination is safe.

## Maintenance

- Read [scripts/README.md](scripts/README.md) when selecting or maintaining a helper.
- Keep all skill text in English.
- Read [references/testing.md](references/testing.md) for current coverage and [references/server-api/TEST_REPORT.md](references/server-api/TEST_REPORT.md) for per-endpoint results.
- Run `node scripts/yunlogin-doctor.mjs` after any change. It checks structure, catalog consistency, secret and encoding hygiene, and the behaviour of every helper CLI; add `--live` to probe the running desktop and the cached server session.
- After changing either reference set or a catalog consumer, run `node scripts/dev/validate-api-docs.mjs`.
- Keep the helpers separated: the local helper must not accept a server origin, and the server helper must not accept a loopback origin.
