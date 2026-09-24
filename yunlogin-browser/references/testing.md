# Test Coverage

This document records the verification performed for the YunLogin Browser skill. Tokens, account IDs, environment IDs, proxy IDs, and cookies used during testing are not stored here.

## Local API

All 23 documented local API routes were exercised.

| Area | Result |
| --- | --- |
| `/status` | Success |
| Browser launch using POST | Success with CDP WebSocket URL |
| Browser status | Success; running and inactive states observed |
| Browser close | Success; final status was inactive |
| Browser list and detail | Success |
| Browser create, update, and delete | Success using a temporary environment that was deleted afterward |
| Group list | Success |
| Group create and rename | Negative validation tests only, to avoid creating persistent group data |
| Cookie clear and update | Success on the temporary environment |
| Self-proxy create, update, delete, and list | Success; temporary proxy was deleted |
| Plugin group list and environment binding | Success on the temporary environment |
| Account group update | Success on the temporary environment |
| URL catalog and browser serial list | Success |

Summary: 23 local routes exercised; 21 success paths and 2 safe negative-validation paths.

## Server API

Every cataloged route was exercised live on 2026-09-24. The per-endpoint HTTP status, business code, response size, and latency are recorded in [server-api/TEST_REPORT.md](server-api/TEST_REPORT.md); this section summarises the outcome.


All 52 cataloged server routes were tested against the server origin.

| Result | Count |
| --- | ---: |
| HTTP 200 with business `code: 200` | 49 |
| HTTP 404 and marked unavailable in the endpoint document | 3 |

## Environment Lifecycle

The creation, capture, and cleanup chain was exercised against the tested account.

| Check | Result |
| --- | --- |
| `POST /v2/newbrowser/putalluri` create through the server API | HTTP 200, `code: 200`; the environment appeared in `getconditionshops` |
| Empty and partial create payloads | `code: 400`, `msg: unknown error`; no environment created |
| Create with any `browser` object | `code: 200`; an environment is created, so validation is loose |
| Headless start of the created environment and token capture | Success; `verified: true`, `code: 0` |
| `POST /api/v2/userapi/user/delete` for the created environment | `code: 0`, `msg: Success`; a follow-up list returned zero matches |
| Server delete route | `POST /v2/newbrowser/putdeleteshop` returned `code: 200` and the environment disappeared |
| `bootstrap-token` against an existing environment | Reused it, created nothing, and deleted nothing |
| Server transport unavailable during `create` | Fell back to the local `user/create` route and created the environment |
| Local create payload schema | `browser[].finger.uaVersion` must be an integer; the server `UAversion` string is rejected |
| Headless start and token capture on a locally created environment | Success; `verified: true`, `code: 0` |
| Delete of the locally created environment | `code: 0`; zero remaining matches |
| `POST /api/v1/client/gpu_info` on port 52446 | `code: 0`; returned the local adapter list |
| `POST /api/v1/client/clean_env` on port 52446 | `code: 0`, `msg: Success` |
| `GET /api/v1/settings/get_config` on port 52446 | `code: 0`; payload contains live STS credentials and a cookie digest map, so nothing from it is stored |
| `POST /v2/team/roles` | `code: 200`; 18 roles returned |
| `POST /v2/team/getDepts` | `code: 200`; three-level department tree returned |
| `POST /v2/team/invite/getCode` with `reset: 0` | `code: 200`; the code is redacted by the helper |
| `POST /v2/team/version/getCore` | `code: 200`; 17 core builds returned |
| `POST /v2/team/authentication/get` | HTTP 404 on the tested origin; marked unavailable |
| `POST /v2/newbrowser/getsettings` | `code: 200`; global settings, personal settings, and three search engines returned |
| `POST /v2/message/user-notice/my` | `code: 200`; notice payload returned with `list: null` and `count: 0` |
| `POST /v2/newbrowser/getLatestOpenAccountIdList` | `code: 200`; 20 recent environment IDs returned |
| `POST /v2/rpa/getRpaPlanManagementList` | `code: 200`; empty plan list returned at the top level |
| `POST /v2/newbrowser/batchCloneShop` | `code: 200`; clone created and deleted in a round trip, and empty payloads clone nothing |
| Error contract probes | Wrong field types returned `code: 500` with a Go unmarshal message; a missing token returned HTTP 401 with `code: 1001`; a bad token returned HTTP 200 with `code: 1001`; an unknown environment ID on delete returned `code: 500`, `empty slice found` |
| Duplicate tag label | `code: 4020` |
| Lenient routes | `getconditionshops` and `getsettings` accept an empty body; `delTag` and `deletegroups` report success for unknown IDs |
| Tag colour round trip | Sending `0, 1, 8, 9, -1, 99` stored `1, 1, 8, 9, -1, 99`; only `0` was normalised, so the helper validates `1-8` itself |
| Empty-body tag probe | Created a tag with no name; deleted afterwards and the tag count returned to its previous value |
| `create` with group, tag, and remark, then read back | Group, tag, and remark all present on the created environment |
| `create` with attributes but no confirmation flag | Exit code 2 and a `needsConfirmation` payload; nothing created |
| `delete` without a confirmation flag | Exit code 2 and a `needsConfirmation` payload |
| `putnewgroup` then `deletegroups` round trip | `code: 200` both ways; the group disappeared |
| `updateTag` then `delTag` round trip | `code: 200` both ways; the tag disappeared |
| Environment name normalization | Chinese names preserved; `My Env // 01` became `My-Env-01`; `***` was rejected |

See `server-api/README.md` and the endpoint documents for the per-route test result.

## CDP and Playwright CLI

The tests used a real YunLogin test environment, not a standalone local Chrome.

| Capability | Result |
| --- | --- |
| YunLogin launch and CDP URL return | Success |
| Raw CDP `Browser.getVersion` | Success |
| Raw CDP target discovery | Success |
| Raw CDP page creation and evaluation | Success |
| Playwright CLI CDP attach | Success |
| Playwright CLI navigation and evaluation | Success |
| Playwright CLI detach and reattach | Success |
| Browser state persistence | `localStorage` value remained `ok` after detach and reattach |
| append_cmd launch | Success with `--disable-popup-blocking --disable-notifications` |
| Browser close after automation | Success |

## Extension Token Bootstrap

The bundled extension token was captured from a headless Chrome 140 environment through CDP.

| Check | Result |
| --- | --- |
| `capture-local-token` launch | Success; a headless environment started and returned a CDP WebSocket URL |
| Extension `DOMStorage` read | Success; `Authorization` was found in the extension origin `localStorage` |
| Ordinary page `eval` on the extension origin | Blocked by the browser security model; the `DOMStorage` domain is required |
| Token verification with `POST /api/v2/userapi/user/shopseriallist` | Success; business `code: 0` |
| Reuse of the captured value as a server token | Rejected; the captured token is local-only |
| Cache write | Success; the file was written outside the skill at the user-level cache path |
| Cached token reuse without `YUNLOGIN_LOCAL_TOKEN` | Success; the local user API returned `code: 0` |
| Environment cleanup after capture | Success; the final status was `Inactive` |

Headless extension storage capture is reliable on the Chrome 140 kernel. The Chrome 107 kernel still supports CDP automation, but its headless mode loads extensions less reliably, so use `--headless 0` there. Token capture never runs against a standalone local Chrome.

## Token Lifecycle

The two-credential model was exercised against the test account.

| Check | Result |
| --- | --- |
| `save-server-token` on an account with 5 companies and no `--company-id` | Refused with `needsCompany: true`; nothing written |
| `save-server-token --company-id <id>` | Saved; user ID and company name resolved automatically |
| `status` with no environment variables | Local usable from cache, server usable from cache, identity resolved |
| `ensure-server` with a valid cached token | Reported usable and kept the cache |
| `ensure-server` with a deliberately stale token | Deleted the cache and reported `needsNewToken: true` with the server reason |
| `ensure-local` on a build that does not enforce the token | Reported usable and did not refresh |
| `save-server-token` without a token | Non-zero exit with a clear message; nothing written |
| Server session cache path | `%LOCALAPPDATA%\yunlogin-browser\server-token.json` |
| Skill files and package after all tests | No token-like value found |

## Safety Boundaries

- Destructive mutations were performed only on a newly created temporary environment or temporary proxy and were cleaned up.
- Group creation and rename were tested with invalid input because the API set has no group deletion endpoint.
- No production or shared browser environment was deleted.
- No token, Cookie, account record, or real environment ID was written into the skill.
## 107 Kernel CDP Verification

The YunLogin 107 kernel environment was tested directly with `fb.exe`.

| Check | Result |
| --- | --- |
| Headless browser version | `HeadlessChrome/107.0.5304.114` |
| CDP protocol version | `1.3` |
| `launchBrowser` callback URL | Returned a valid `ws://127.0.0.1:<port>/devtools/browser/<id>` URL |
| Raw CDP `Browser.getVersion` | Success |
| Raw CDP `open` and `eval` | Success; page title was `Example Domain` |
| Playwright CLI `attach --cdp` | Success |
| Playwright CLI detach and reattach | Success |
| Persistence after reattach | `localStorage` value remained `ok` |
| Environment close | Success; final status was inactive |

The environment `fb.exe` uses a separate `Shop-...` user-data directory and starts with an ephemeral debugging port. The YunLogin API exposes the actual assigned port through `data.debuggingPort` and `data.ws.puppeteer`.

Conclusion: the YunLogin 107 kernel supports CDP connection and browser automation in headless mode.
## Workbench CDP Investigation

The YunLogin Workbench process was inspected separately from environment browsers.

| Check | Result |
| --- | --- |
| Workbench executable | Chromium-based `fb.exe` |
| `--remote-debugging-port` | Not present |
| `--remote-debugging-pipe` | Not present |
| TCP listening port owned by Workbench `fb.exe` | None |
| `DevToolsActivePort` file | Not found under the Workbench profile |
| `/json/version` CDP endpoint | Not available on Workbench ports |
| `--remote-allow-origins=*` | Present, but insufficient without a debugging transport |

Conclusion: the currently running Workbench process does not expose an attachable CDP endpoint. Environment browsers can expose CDP, but that endpoint is separate from the Workbench UI process. Connecting CDP to Workbench would require launching or restarting Workbench with a supported remote-debugging transport, or adding an official Workbench control endpoint.