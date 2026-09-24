# YunLogin Scripts

These scripts use Node.js ESM (`.mjs`) and do not require third-party npm packages. Run them from the `yunlogin-browser/` directory.

The skill has separate local and server helpers. Do not mix their origins, credentials, or endpoint IDs.

## Layout

```text
scripts/
  yunlogin-api.mjs          local desktop API client
  yunlogin-server-api.mjs   management-center API client
  yunlogin-auth.mjs         token setup, status, and refresh
  yunlogin-env.mjs          environment, group, and tag lifecycle
  yunlogin-cdp.mjs          launch, CDP attach, and token capture
  lib/                      shared modules imported by the commands
  dev/                      maintenance tooling, not run by hand during normal work
```

Only the five `yunlogin-*.mjs` files are commands a user runs. `lib/` holds code the commands import, and `dev/` holds the documentation validator the maintainer runs after editing references.

## Script Overview

| Script | Surface | Purpose | Network Access | Writes Files |
| --- | --- | --- | --- | --- |
| `yunlogin-api.mjs` | Local | Safely call the loopback API or validate a request with dry-run | Connects to the local service only when making a live request | Reads the file specified by `--body-file` only |
| `yunlogin-server-api.mjs` | Server | Safely call one cataloged management-center endpoint | Connects to the HTTPS server only when making a live request | Reads the file specified by `--body-file` only |
| `yunlogin-env.mjs` | Local/Server | Create, list, and delete environments, and bootstrap the local token; server API first with a local fallback | Connects to the server HTTPS origin and the loopback service only for the requested command | Writes only the local token cache and an optional session file |
| `yunlogin-cdp.mjs` | Local/CDP | Launch a local environment or connect to a CDP endpoint | Connects to localhost or an explicit CDP URL only when using connection commands | Optional session output with `--output` |
| `yunlogin-auth.mjs` | Local/Server | Verify, save, and refresh the cached local and server tokens | Connects to the loopback service and the server origin only for the requested command | Writes the user-level token cache only |
| `lib/local-token-store.mjs` | Local | Resolve, read, and write the cached local API token outside the skill | No | Writes the token cache file only |
| `dev/validate-api-docs.mjs` | Documentation | Verify local and server documentation, indexes, and endpoint definitions | No | No |

## Token Setup

Both credentials are cached in the user profile, outside the skill. See `references/workflows/token-lifecycle.md` for the full rules.

```powershell
node scripts/yunlogin-auth.mjs status
node scripts/yunlogin-auth.mjs save-server-token
node scripts/yunlogin-auth.mjs ensure-server
node scripts/yunlogin-auth.mjs ensure-local --confirm-create
```

A credential is replaced only when it stops working. A rejected server token is deleted from the cache and must be replaced by the user, because it cannot be captured automatically. A rejected local token is captured again from the browser extension, creating a temporary environment only after the user confirms.

## Local API

Read the endpoint document first. Use `GET /status` to check whether the local service is available:

```powershell
node scripts/yunlogin-api.mjs local GET /status
node scripts/yunlogin-api.mjs local POST /api/v2/userapi/group/create '{"name":"example"}' --dry-run
```

The local origin defaults to `http://localhost:50213`. Use `YUNLOGIN_LOCAL_BASE_URL` to override it. `YUNLOGIN_BASE_URL` is a backward-compatible alias. Only loopback hosts are accepted.

Some desktop builds require authentication for local user API calls. Capture the token from the bundled browser extension instead of asking the customer to paste it:

```powershell
node scripts/yunlogin-cdp.mjs capture-local-token --account-id <account-id>
```

The helper starts a headless environment, reads `Authorization` from the extension origin `localStorage` through the Chrome DevTools Protocol `DOMStorage` domain, verifies it with a local user API read, and stores it outside the skill. Resolution order: `YUNLOGIN_LOCAL_TOKEN`, then `YUNLOGIN_LOCAL_TOKEN_FILE`, then `%LOCALAPPDATA%\yunlogin-browser\local-token.json` on Windows and `~/.local/share/yunlogin-browser/local-token.json` on other platforms. The captured token is a local desktop credential and is not the server `YUNLOGIN_SERVER_TOKEN`.

For a manual fallback, set the value directly, and add `YUNLOGIN_LOCAL_COOKIE` when the build also needs a Cookie header:

```powershell
$env:YUNLOGIN_LOCAL_TOKEN = "<local token>"
$env:YUNLOGIN_LOCAL_COOKIE = "<optional Cookie header>"
```

## CDP Automation

Use `yunlogin-cdp.mjs` to launch a local environment and connect to its CDP WebSocket URL, or to connect to an external CDP endpoint explicitly:

```powershell
node scripts/yunlogin-cdp.mjs start --account-id <account-id> --output session.json
node scripts/yunlogin-cdp.mjs check --session-file session.json
node scripts/yunlogin-cdp.mjs targets --session-file session.json
node scripts/yunlogin-cdp.mjs open --session-file session.json --url https://example.com
node scripts/yunlogin-cdp.mjs eval --session-file session.json --expression "document.title"
node scripts/yunlogin-cdp.mjs check --cdp-url ws://127.0.0.1:9222/devtools/browser/<id>
node scripts/yunlogin-cdp.mjs storage-get --cdp-url <url> --origin chrome-extension://<extension-id> --key Authorization
node scripts/yunlogin-cdp.mjs capture-local-token --account-id <account-id>
```

To attach the Playwright CLI agents skill to the same browser, load `session.data.ws.puppeteer` and run:

```powershell
playwright-cli -s=yunlogin attach --cdp=$cdp
playwright-cli -s=yunlogin snapshot
playwright-cli -s=yunlogin detach
```

Read `references/workflows/cdp-automation.md` for the launch flow, the append_cmd flag list, the risky flag policy, external CDP input, and session lifecycle guidance, and `references/workflows/playwright-cli.md` for the optional Playwright CLI pairing.
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
node scripts/yunlogin-env.mjs bootstrap-token --create-if-missing
```

Names are normalized before use, so letters and digits from any script survive while unsupported characters collapse into a dash. Applying a remark, tag, or group requires `--confirm-attributes`, and every delete command requires its confirmation flag; without it the helper exits with code 2 and a `needsConfirmation` payload. Read `references/workflows/environment-lifecycle.md` for the template construction, transport fallback, and verified results.

## Server API

Configure the bearer token through the environment. See `references/server-api/TOKEN_SETUP.md` for customer-facing setup and cleanup guidance. Never pass the token as a command-line argument.

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
$env:YUNLOGIN_SERVER_COMPANY_ID = "<optional companyid default>"
$env:YUNLOGIN_SERVER_USER_ID = "<optional userid default>"
```

Use an endpoint ID from `references/server-api/endpoints.json`:

```powershell
node scripts/yunlogin-server-api.mjs browser-list --dry-run
node scripts/yunlogin-server-api.mjs browser-cookie --body '{"shopid":"<shopid>"}' --dry-run
node scripts/yunlogin-server-api.mjs proxy-cloud-list --query page=1 --query per_page=20
node scripts/yunlogin-server-api.mjs account-list --body-file request.json
node scripts/yunlogin-server-api.mjs --list
```

The server helper rejects unknown endpoint IDs, unknown query or body fields, and missing required fields. It requires `YUNLOGIN_SERVER_TOKEN` before networking and exits non-zero when the HTTP request fails or the response business code is not listed in `business_success_codes`. Optional server variables are documented in `references/server-api/README.md`.

## Dry Run and Sensitive Data

`--dry-run` validates the endpoint, query parameters, request body, URL, token presence, and redaction without sending an HTTP request. A live request is sent only when `--dry-run` is omitted.

Common sensitive response fields such as tokens, cookies, passwords, proxy credentials, 2FA secrets, and account usernames are replaced with `[REDACTED]` by default. Use `--show-sensitive` only when the user explicitly requests raw values and the output destination is safe.

## Documentation Validation

Run the validator after changing either API reference set or a catalog consumer:

```powershell
node scripts/dev/validate-api-docs.mjs
```

The validator checks the 23 local endpoint documents, the 47 cataloged server endpoint documents, the per-endpoint test report, the error contract, the tag colour palette, the token lifecycle, environment lifecycle, and local client API guides, the local token bootstrap guidance, and the user-level token cache boundary. See `references/testing.md` for the current API, CDP, and Playwright CLI test coverage. It also checks catalog IDs, methods, paths, defaults, required fields, test status, document coverage, `agents/openai.yaml` interface metadata, English-only content, and common token leakage patterns.