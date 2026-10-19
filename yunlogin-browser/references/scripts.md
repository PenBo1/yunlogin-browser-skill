# YunLogin Scripts

These scripts use Node.js ESM (`.mjs`) and do not require third-party npm packages. Run them from the `yunlogin-browser/` directory.

The skill has separate local and server helpers. Do not mix their origins, credentials, or endpoint IDs.

## Layout

```text
scripts/
  yunlogin-api.mjs          local desktop API client
  yunlogin-server-api.mjs   management-center API client
  yunlogin-auth.mjs         token login, setup, status, and refresh
  yunlogin-env.mjs          environment, group, and tag lifecycle
  yunlogin-cdp.mjs          launch, CDP attach, and token capture
  yunlogin-fb-cdp.mjs       inspect or relaunch a Windows fb.exe with CDP
  yunlogin-doctor.mjs       read-only self-test for the whole skill
  lib/                      shared modules imported by the commands and the dev tooling (including route-safety.mjs)
  dev/                      maintenance tooling, not run by hand during normal work
```

The `yunlogin-*.mjs` files are user-facing Node.js commands. `lib/` holds shared code, and `dev/` holds maintenance and offline checks.

## Script Overview

Commands you run:

| Script | Surface | Purpose | Network Access | Writes Files |
| --- | --- | --- | --- | --- |
| `yunlogin-ports.mjs` | Windows/local | Fresh process-owned TCP inventory; classify verified API ports | Read-only loopback probes on current YunLogin listeners | No |
| `yunlogin-client.mjs` | Windows/local | Locate/start client, enable Workbench CDP, synchronize current credentials | Read-only checks; authorized start or Workbench restart | User-level Workbench session cache after verified sync |
| `yunlogin-api.mjs` | Local | Safely call the loopback API or validate a request with dry-run | Connects to the local service only when making a live request | Reads the file specified by `--body-file` only |
| `yunlogin-server-api.mjs` | Server | Safely call one cataloged management-center endpoint | Connects to the HTTPS server only when making a live request | Reads the file specified by `--body-file` only |
| `yunlogin-env.mjs` | Local/Server | Operate environments using the synchronized Workbench session | Connects to Workbench CDP, server and loopback on live commands | User-level Workbench session cache |
| `yunlogin-cdp.mjs` | Local/CDP | Launch a local environment or connect to a CDP endpoint | Connects to localhost or an explicit CDP URL only when using connection commands | Optional session output with `--output` |
| `yunlogin-fb-cdp.mjs` | Windows/CDP | Inspect a running `fb.exe` process, plan a relaunch with a loopback CDP port, and verify the endpoint | Reads Win32 process data; connects only to a loopback CDP endpoint | Optional verified session output with `--output` |
| `yunlogin-auth.mjs` | Workbench | Compare or synchronize the current management-center page session | CDP and verification reads on live sync | Atomic user-level Workbench session cache |
| `lib/local-token-store.mjs` | Local/Server | Read the current validated Workbench snapshot | No | No |
| `yunlogin-doctor.mjs` | All | Self-test the skill: structure, catalogs, hygiene, and helper behaviour. `--audit` runs the full research audit chain | With `--live` or `--audit`; `--audit --skip-heavy` stays read-only | No |

Maintenance tooling (`scripts/dev/`). Read this group only when maintaining the research artifacts or the
documentation pipeline; ordinary operations never need it.

| Script | Surface | Purpose | Network Access | Writes Files |
| --- | --- | --- | --- | --- |
| `dev/probe-server-api.mjs` | Server | Call cataloged read endpoints and record response field paths/types without values | HTTPS only when run live | Writes the requested JSON inventory |
| `dev/probe-route-fields.mjs` | Server | Call every read-shaped route in the 507-route universe and record response field paths/types/enum samples without secrets | HTTPS only when run live | Writes the requested JSON inventory |
| `dev/render-route-fields.mjs` | Documentation | Render a route-field inventory JSON into `references/server-api/FIELD_INVENTORY_ACCOUNT_B.md` | No | Writes the supplemental field-page Markdown |
| `dev/render-cross-account.mjs` | Documentation | Render the second-account probe into `references/server-api/CROSS_ACCOUNT_VERIFICATION.md` | No | Writes the cross-account verification Markdown |
| `dev/render-route-status.mjs` | Documentation | Render a per-route evidence status page from `route-sweep.json` and `BLOCKLIST.md` | No | Writes `references/server-api/ROUTE_TEST_STATUS.md` |
| `dev/probe-boundary-evidence.mjs` | Server | Inspect the prerequisite each account has for the last blocked routes and record the server response | HTTPS only when run live | Writes the requested JSON evidence |
| `dev/render-boundary-evidence.mjs` | Documentation | Render two boundary-evidence JSON files into `references/server-api/BOUNDARY_EVIDENCE.md` | No | Writes the boundary evidence Markdown |
| `dev/render-field-inventory.mjs` | Documentation | Render a probe JSON file into `references/server-api/FIELD_INVENTORY.md` | No | Writes the field inventory Markdown |
| `dev/render-field-values.mjs` | Documentation | Render observed enum-like value domains into `references/server-api/FIELD_VALUES.md` | No | Writes the field value Markdown |
| `dev/render-code-legends.mjs` | Documentation | Render paired code meanings, plus self-describing symbolic enums, into `references/server-api/CODE_LEGENDS.md` | No | Writes the code legend Markdown |
| `dev/render-domain-index.mjs` | Documentation | Aggregate fields and values by business family into `references/server-api/DOMAIN_INDEX.md` | No | Writes the domain index Markdown |
| `dev/render-coverage.mjs` | Documentation | Read every artifact and render the coverage-and-limits page `references/server-api/COVERAGE.md` | No | Writes the coverage Markdown |
| `dev/render-request-params.mjs` | Documentation | Render the request contract and measured enum behaviour into `references/server-api/REQUEST_PARAMS.md` | No | Writes the request parameter Markdown |
| `dev/render-write-effectiveness.mjs` | Documentation | Render the round-trip evidence into `references/server-api/WRITE_EFFECTIVENESS.md` | No | Writes the write effectiveness Markdown |
| `dev/render-delete-semantics.mjs` | Documentation | Render the delete evidence into `references/server-api/DELETE_SEMANTICS.md` | No | Writes the delete semantics Markdown |
| `dev/run-api-audit.mjs` | Server | Run the whole chain: validate, drift check with replay, write and delete round trips, residue check | Live for every stage except `--skip-heavy` | Refreshes the two evidence documents |
| `dev/verify-audit-gates.mjs` | Server | Inject a fault into every audit gate and assert each one blocks, then run them clean | Live for the write and delete gates | None |
| `dev/check-links.mjs` | Documentation | Verify every relative Markdown link in the skill resolves | No | None |
| `dev/start-forward-test.mjs` | Documentation | Create an isolated workspace and print the prompt for an independent forward test | No | Writes the workspace and its notes file |
| `dev/mine-bundle-enums.mjs` | Documentation | Search the client bundles for an enum label map for the given keys | Fetches the bundles once | None |
| `dev/mine-i18n-labels.mjs` | Documentation | Look up the client i18n label for the given field-name keys | Fetches the i18n bundle once | None |
| `lib/client-bundle.mjs` | Documentation | Discover the hashed bundle names the deployed management-center client references right now | Fetches the client entry document | None |
| `dev/render-param-errors.mjs` | Documentation | Render the request-parameter rejections the sweep collected into `references/server-api/PARAM_ERRORS.md` | No | Writes the parameter-error Markdown |
| `dev/render-blocklist.mjs` | Documentation | Render every withheld route, its reason, and its candidate request keys into `references/server-api/BLOCKLIST.md` | No | Writes the blocklist Markdown |
| `dev/check-bundle-drift.mjs` | Documentation | Compare the deployed client bundle with the recorded route universe and, with `--routes`, re-extract and diff every route | Fetches the client bundles | None |
| `lib/client-origin.mjs` | Local client | Resolve the client service using fresh ownership and a GPU probe; reject stale addresses | Read-only loopback GPU probes | Updates the user-level origin hint cache |
| `lib/resolved-calls.mjs` | Server | Shared list of routes that need real ids before they answer, used by the re-probe and the drift replay | No | None |
| `lib/tag-colors.mjs` | Local/Server | Map tag colour numbers to the palette names the API uses | No | None |
| `lib/route-safety.mjs` | Server | Shared classifier that decides read, write, or catastrophic so no probe executes a destructive call | No | None |
| `lib/server-token.mjs` | Server | Verify a supplied Workbench bearer against documented identity routes; independent refresh is disabled | HTTPS verification reads | No |
| `dev/extract-client-routes.mjs` | Documentation | Re-derive the route universe from the live client bundle into `client-routes.json` | Fetches the client bundle | Writes the route table and the call sites |
| `dev/extract-client-params.mjs` | Documentation | Parse candidate request keys from the recorded call sites | No | Writes `client-params.json` and `CLIENT_CALLSITES.md` |
| `dev/render-route-catalog.mjs` | Documentation | Render the full route catalogue with each row's surface and status | No | Writes `ROUTE_CATALOG.md` |
| `dev/render-route-fields.mjs` | Documentation | Render the per-route response field inventory | No | Writes `ROUTE_FIELDS.md` |
| `dev/render-write-params.mjs` | Documentation | Render the write-route parameter table | No | Writes `WRITE_ROUTE_PARAMS.md` |
| `dev/sweep-params.mjs` | Server | Sweep request parameters across the route table | HTTPS only when run live | Writes the requested JSON evidence |
| `dev/fixtures/route-safety-cases.json` | Documentation | Safety-correct expectations for the classifier, asserted by the validator | No | No |
| `dev/sweep-all-routes.mjs` | Server | Probe every route in `client-routes.json` once with a generic body and write `references/server-api/route-sweep.json` | Live unless `--skip-heavy`; writes only when run | Writes the sweep JSON |
| `dev/reprobe-resolved-routes.mjs` | Server | Re-probe the routes that need real ids and merge their real shapes back into `route-sweep.json` | Live | Rewrites the sweep JSON |
| `dev/detect-route-drift.mjs` | Documentation | Compare a sweep with `route-baseline.json` and write `references/server-api/DRIFT.md` | No | Writes the drift report, drift JSON, and optionally the baseline |
| `dev/probe-write-effectiveness.mjs` | Server | Round-trip environment writes to prove persistence, then restore the original values | HTTPS only when run live | Writes the requested JSON evidence |
| `dev/probe-delete-semantics.mjs` | Server | Create, delete, and re-read throwaway resources to classify each delete as hard or soft | HTTPS only when run live | Writes the requested JSON evidence |
| `dev/probe-route-values.mjs` | Server | Re-probe every live route in `route-sweep.json` and record bounded enum-like value domains | HTTPS only when run live | Writes the requested JSON inventory |
| `dev/probe-code-legends.mjs` | Server | Pair each code field with its sibling `*_text` label and record the code meanings | HTTPS only when run live | Writes the requested JSON legends |
| `dev/probe-field-types.mjs` | Server | Send one wrong-typed value per request field and record the decoder error, which names the Go struct, field, and wanted type | HTTPS only when run live | Writes the requested JSON evidence |
| `dev/probe-request-params.mjs` | Server | Sweep enum-like request parameters and record code, rows, and totals | HTTPS only when run live | Writes the requested JSON cases |
| `dev/validate-api-docs.mjs` | Documentation | Verify local and server documentation, indexes, and endpoint definitions | No | No |

## Self Test

`sweep-all-routes.mjs` must be followed by `reprobe-resolved-routes.mjs`. A sweep gives every route only its
generic-body shape, so a route that needs real ids shows just its envelope; the re-probe pass restores the real
shapes. The doctor fails the `sweep-reprobe` check when that step has not run.
`yunlogin-doctor.mjs` verifies the skill before a workflow depends on it. It is read-only: no check creates, updates, or deletes anything.

```powershell
node scripts/yunlogin-doctor.mjs
node scripts/yunlogin-doctor.mjs --live
node scripts/yunlogin-doctor.mjs --json
```

| Mode | Checks |
| --- | --- |
| default | Required files, catalog and document agreement, token-like strings, ASCII-only text, LICENSE parity, frontmatter, and the observable exit behaviour of every helper CLI. |
| `--live` | Adds read-only probes of the loopback API on 50213, the client service on its discovered loopback port, the cached server session, and one cataloged server read. |

Every check prints `PASS` or `FAIL` and the command exits non-zero when any check fails. Use `--json` for machine-readable output.

## Token Setup

The current Workbench management-center session has one atomic user-level snapshot. See [workflows/token-lifecycle.md](workflows/token-lifecycle.md).

```powershell
node scripts/yunlogin-auth.mjs status
node scripts/yunlogin-auth.mjs sync-workbench --dry-run
node scripts/yunlogin-auth.mjs sync-workbench
node scripts/yunlogin-auth.mjs ensure-server
```

Each live authenticated management operation re-reads Workbench before its business call. A rejected token is handled in Workbench, followed by a fresh sync; independent login and token refresh are disabled.

## Local API

First follow [client-api/STARTUP.md](client-api/STARTUP.md). `yunlogin-ports.mjs` discovers current service ports; authenticated local calls use the verified Workbench snapshot and its local origin.

Read the endpoint document first. Use `GET /status` to check whether the local service is available:

```powershell
node scripts/yunlogin-api.mjs local GET /status
node scripts/yunlogin-api.mjs local POST /api/v2/userapi/group/create '{"name":"example"}' --dry-run
```

The local origin defaults to `http://localhost:50213`. Use `YUNLOGIN_LOCAL_BASE_URL` to override it. `YUNLOGIN_BASE_URL` is a backward-compatible alias. Only loopback hosts are accepted.

Management-center credentials are synchronized from the current Workbench page:

```powershell
node scripts/yunlogin-auth.mjs sync-workbench
```

The old token cache files do not replace current Workbench management storage. If synchronization fails, stop the authenticated management request. The local API's authentication is separate; do not read Workbench extensions to fill it.

## CDP Automation

Use `yunlogin-cdp.mjs` to launch a local environment and connect to its CDP WebSocket URL, or to connect to an external CDP endpoint explicitly:

```powershell
node scripts/yunlogin-cdp.mjs start --account-id <account-id> --output session.json
node scripts/yunlogin-cdp.mjs check --session-file session.json
node scripts/yunlogin-cdp.mjs targets --session-file session.json
node scripts/yunlogin-cdp.mjs open --session-file session.json --url https://example.com
node scripts/yunlogin-cdp.mjs eval --session-file session.json --expression "document.title"
node scripts/yunlogin-cdp.mjs check --cdp-url ws://127.0.0.1:9222/devtools/browser/<id>
node scripts/yunlogin-auth.mjs status
node scripts/yunlogin-auth.mjs sync-workbench
```

For an environment browser, load `session.data.ws.puppeteer`. For Workbench, read `workbench.cdpUrl` from `yunlogin-client.mjs status`. In either case, attach the CLI with the current URL:

```powershell
playwright-cli -s=yunlogin-workbench attach --cdp=$cdp
playwright-cli -s=yunlogin-workbench tab-list
playwright-cli -s=yunlogin-workbench detach
```

Read [workflows/cdp-automation.md](workflows/cdp-automation.md) for environment launch and [workflows/playwright-cli.md](workflows/playwright-cli.md) for Workbench or environment CDP attachment, detection, installation, and the agents skill setup.

### Existing `fb.exe` / Workbench

`yunlogin-cdp.mjs start` starts a managed environment with its own CDP endpoint. For Workbench, use the unified client helper to obtain and verify its dynamic loopback port:

```powershell
node scripts/yunlogin-client.mjs status
node scripts/yunlogin-client.mjs start --dry-run
# After approval if the existing Workbench lacks CDP:
node scripts/yunlogin-client.mjs start --confirm-restart
$state = node scripts/yunlogin-client.mjs status | ConvertFrom-Json
$cdp = $state.workbench.cdpUrl
```

Windows cannot add flags to a running process. The helper reopens Workbench once with a dynamically selected `127.0.0.1` CDP port only after the user authorizes the restart. It verifies process ownership and `Browser.getVersion`. See [workflows/playwright-cli.md](workflows/playwright-cli.md) for installation, attach, tab selection, detach, and generated file location.

## Environment Lifecycle

Use `yunlogin-env.mjs` for environment, group, and tag lifecycle work. Creation and deletion prefer the server API and fall back to the local API.

```powershell
node scripts/yunlogin-env.mjs list --name <optional filter>
node scripts/yunlogin-env.mjs create --name <environment name> --dry-run
node scripts/yunlogin-env.mjs create --name <environment name> --group <group> --label <tag> --notes "<remark>" --confirm-attributes --create-missing
node scripts/yunlogin-env.mjs delete --account-id <account-id> --confirm-delete
node scripts/yunlogin-env.mjs group-list
node scripts/yunlogin-env.mjs group-create --name <group name>
node scripts/yunlogin-env.mjs tag-list
node scripts/yunlogin-env.mjs tag-create --name <tag name>
node scripts/yunlogin-env.mjs clean-env --account-id <account-id> --confirm-clean
node scripts/yunlogin-auth.mjs sync-workbench
```

Names are normalized before use, so letters and digits from any script survive while unsupported characters collapse into a dash. Applying a remark, tag, or group requires `--confirm-attributes`, and every delete command requires its confirmation flag; without it the helper exits with code 2 and a `needsConfirmation` payload. Read `references/workflows/environment-lifecycle.md` for the template construction, transport fallback, and verified results. `create --dry-run` still issues the read-only `getfingerprinturi` and `getdefaultfingerlist` calls that build the default body, but it never sends the create itself; only `create` without `--dry-run` mutates the account.

## Server API

Authenticate in Workbench and synchronize its current session. See [server-api/TOKEN_SETUP.md](server-api/TOKEN_SETUP.md).

Use an endpoint ID from `references/server-api/endpoints.json`:

```powershell
node scripts/yunlogin-server-api.mjs browser-list --dry-run
node scripts/yunlogin-server-api.mjs browser-cookie --body '{"shopid":"<shopid>"}' --dry-run
node scripts/yunlogin-server-api.mjs proxy-cloud-list --query page=1 --query per_page=20
node scripts/yunlogin-server-api.mjs account-list --body-file request.json
node scripts/yunlogin-server-api.mjs --list
```

The server helper rejects unknown endpoint IDs and invalid fields. Authenticated live calls require a verified current Workbench session; `--dry-run` does not synchronize or write the cache.

## Helper Output

`yunlogin-server-api.mjs` writes the response payload to stdout and its short status line, such as
`200 OK`, to stderr. Capture stdout when parsing and keep stderr for the operator; a pipeline that merges
them will not parse as JSON.

## Dry Run and Sensitive Data

`yunlogin-server-api.mjs --dry-run` validates the endpoint, parameters, body, URL, and redaction without synchronizing credentials or sending an HTTP request. `yunlogin-env.mjs create --dry-run` can still issue read-only template calls; other environment dry-runs send no business request. No dry-run refreshes a token or writes the Workbench session.

Common sensitive response fields such as tokens, cookies, passwords, proxy credentials, 2FA secrets, and account usernames are replaced with `[REDACTED]` by default. Use `--show-sensitive` only when the user explicitly requests raw values and the output destination is safe.

## Documentation Validation

Run the validator after changing either API reference set or a catalog consumer:

```powershell
node scripts/dev/validate-api-docs.mjs
```

The validator checks the 23 local endpoint documents, the 47 cataloged server endpoint documents, the per-endpoint test report, the error contract, the tag colour palette, the token lifecycle, environment lifecycle, and local client API guides, the local token bootstrap guidance, and the user-level token cache boundary. See `references/testing.md` for the current API, CDP, and Playwright CLI test coverage. It also checks catalog IDs, methods, paths, defaults, required fields, test status, document coverage, `agents/openai.yaml` interface metadata, English-only content, and common token leakage patterns.
