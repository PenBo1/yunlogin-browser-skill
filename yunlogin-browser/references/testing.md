# Test Coverage

## Workbench CDP And Session Sync (2026-10-19)

- With user approval, the existing Workbench was reopened once: PID 28816 became PID 22340, and the verified loopback CDP port was 55876. `Browser.getVersion` returned Chrome/107.0.5304.114. YunLogin main process was not restarted.
- Playwright CLI 0.1.13 was already installed with the agents skill. A live `attach --cdp=<verified URL>`, `tab-list`, and `detach` succeeded against Workbench. The management-center tab and one pre-existing Baidu tab were listed; no navigation, click, or browser close was performed.
- The current management-center page's `Authorization`, `userinfo`, and `CompanyInfo` fields were read through same-origin CDP without printing values. Read-only server identity checks returned business `code: 1001` for both raw and Bearer-prefixed forms, so credential synchronization remains unavailable until the user signs in again in Workbench. Browser CDP attachment is independently usable.
- Opening the Workbench extension `popup.html` during initial investigation could trigger page behavior and was removed from the implementation. The final session helper does not access extensions. The Playwright example uses a user-level working directory; transient CLI files created during the live check were removed from the skill folder.
- `dev/test-workbench-session.mjs` uses isolated mocks to cover user/company/token changes, one retry then failure, cache invalidation, legacy-cache isolation, loopback CDP listener ownership, port conflict, and restart gating. No credential value or raw storage was logged.
- Current offline checks: skill doctor 30/30, skill-creator validation, 23 local and 54 server documentation checks, and 610 relative links. These checks do not establish a valid management login for this account.

## Client Startup And Dynamic Ports (2026-10-19)

- `yunlogin-ports.mjs` live read-only inventory: YunLogin-owned 50213 local API, 54823 client API, 54822 verified WebSocket transport, and 50313 retained as unknown by protocol discovery. These numbers are observations, not constants.
- Read-only `shm_fetch_proxy_info` mapping returned 54823; PID ownership and GPU response verified it. `get_config` returned HTTP 200/code 0 through the discovered client origin; raw settings were not logged or saved.
- Offline `dev/test-client-discovery.mjs` covers changed-port snapshots, stale shared-memory rejection, IPv6, unowned/non-loopback exclusion, stopped state, WebSocket classification, invalid origins and unknown/nested configuration secrets.
- Independent isolated mocks covered start confirmation, multiple installations, dry-run, already running, successful/failed spawn, and readiness-query failure after spawn. No real desktop startup/restart was performed.
- Skill doctor: 29/29; skill-creator and relative-link validation passed. Documentation validation included 23 local and 54 server endpoint documents.
- Native evidence and limitations, including core Ghidra startup timeout and supplemental LLVM disassembly, are retained in [client-api/PORTS.md](client-api/PORTS.md).

This document records the verification performed for the YunLogin Browser skill. Tokens, account IDs, environment IDs, proxy IDs, and cookies used during testing are not stored here.

## Skill Self-Test

`scripts/yunlogin-doctor.mjs` is the skill's own test. It is read-only and exits
non-zero when any check fails.

| Check | What it proves |
| --- | --- |
| structure | Every file the workflow depends on is present. |
| catalog | The server catalog, its documents, and the local index agree on id, method, path, and required sections. |
| no-secrets | No token-like value is stored anywhere in the skill text. |
| ascii-only | All skill text is ASCII, so no encoding-dependent rendering creeps in. |
| license-parity | The repository root `LICENSE` matches the skill copy byte for byte. |
| frontmatter | `SKILL.md` keeps a valid `name` and `description`. |
| behaviour | Each helper CLI runs and keeps its guards: dry-run works, unknown endpoint ids are refused, and mutations still require their confirmation flags. |
| token-refresh wiring | The catalog resolves the refresh route, and a server read refreshes the session first when the remaining lifetime is inside the skew window. |
| attribute question | `create` with no attribute flag exits 2 with `needsAttributes`, offers the real group names, and creates nothing. |
| create paths | The group and tag dry runs plan a request without sending it or performing the tag id lookup. |
| `--live` | The loopback API, the client service on its discovered loopback port, the cached server session, one cataloged server read, and the proactive refresh path answer correctly. |

Result on 2026-10-09: 22 offline checks passed. The most recent live run recorded 6 live checks on 2026-09-27.

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

Every cataloged route was exercised live on 2026-09-24; `sso-login` was added on 2026-10-09. The per-endpoint HTTP status, business code, response size, and latency are recorded in [server-api/TEST_REPORT.md](server-api/TEST_REPORT.md); this section summarises the outcome.


All 54 cataloged server routes were tested against the server origin.

| Result | Count |
| --- | ---: |
| HTTP 200 with business `code: 200` | 54 |
| HTTP 404 / unserved | 0 |

### SSO Login

`sso-login` was exercised live on 2026-10-09 with a test account. Credentials and the returned token are not stored in this repository.

| Check | Result |
| --- | --- |
| Minimal body | `{username,password}` returned HTTP 200, `code: 200`, a 160-character token, and a non-empty expiry. |
| Optional Cookie and AppInfo | The minimal request succeeded without Cookie or AppInfo, so those browser/client headers are not hard requirements on the tested origin. |
| Generic helper without a bearer token | `yunlogin-server-api.mjs sso-login` skipped Authorization, returned `code: 200`, and redacted `data.token` by default. |
| Auth helper cache | `yunlogin-auth.mjs login` saved the returned token to a temporary user-level session file when `--company-id` was supplied. |
| Multi-company account | Without `--company-id`, login succeeded but caching returned `needsCompany: true` and exit code 2. |
| Dry run | `login --dry-run` rendered the request without a username, password, Cookie, AppInfo, or token. |

### Full Server Field Inventory

All 54 cataloged server endpoints were exercised live on 2026-10-09. The read sweep produced 46 live responses (three earlier 404s were fixed by correcting the HTTP method: `curCompanyInfo` now POST, `authentication/get` now GET, `company/user/devices` now POST); the seven mutation routes were exercised with temporary round trips; and `sso-login` was exercised separately.

- The generated response field path/type inventory is [server-api/FIELD_INVENTORY.md](server-api/FIELD_INVENTORY.md).
- Temporary resources used for mutation testing were named with the `codex-field-`, `codex-group-`, and `codex-tag-` prefixes.
- Final cleanup verification found zero remaining test environments, groups, or tags.
- Response values, Tokens, Cookies, passwords, and credentials were not written to the inventory.

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
| `POST /api/v1/client/gpu_info` on the discovered client port | `code: 0`; returned the local adapter list. Resolved to `64992` on build 4.0.6.0 and to `52446` on the earlier build. |
| `POST /api/v1/client/clean_env` on the discovered client port | `code: 0`, `msg: Success` |
| `GET /api/v1/settings/get_config` on the discovered client port | `code: 0`; payload contains live STS credentials and a cookie digest map, so nothing from it is stored |
| `POST /v2/team/roles` | `code: 200`; 18 roles returned |
| `POST /v2/team/getDepts` | `code: 200`; three-level department tree returned |
| `POST /v2/team/invite/getCode` with `reset: 0` | `code: 200`; the code is redacted by the helper |
| `POST /v2/team/version/getCore` | `code: 200`; 17 core builds returned |
| `GET /v2/team/authentication/get` | `code: 200`; method corrected from POST to GET on 2026-10-09 |
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

See `server-api/INDEX.md` and the endpoint documents for the per-route test result.

### Environment Write Inputs

The create and modify input chain was exercised on 2026-09-27. See
[workflows/environment-inputs.md](workflows/environment-inputs.md) for the full
map.

| Check | Result |
| --- | --- |
| `POST /v2/team/myCompanies` | `code: 200`; five companies, each carrying `companyId`. |
| `POST /v2/newbrowser/getdefaultfingerlist` for Windows 10 / Chrome / 141 | `code: 200`; 17 kernel builds plus the UA, CPU, and memory presets. |
| `POST /v2/newbrowser/getfingerprinturi` without `shopid` | `code: 200`; returned the base template. |
| `POST /v2/newbrowser/getfingerprinturi` with `shopid` | `code: 200`; returned `browseinfo` and a 50-field `defaultfingerprint`. |
| `POST /v2/newbrowser/putalluri` with `browser.shopid` set | `code: 200`; the same `shopid` came back, no duplicate row appeared, and the changed `notes` read back. |
| `POST /v2/newbrowser/putalluri` with `browseinfo` sent unchanged | `code: 500` unmarshal errors on `user_password_ids` and `fingerprint.enableCookie`; nothing was written. |
| `putalluri` with an official proxy block and `browser.shopid` set | `code: 200`; the read-back showed `device_type: official`, `ipChannel: ipinfo`, the supplied `proxyId`, and `proxyDel: 0`. |
| `create` with no attribute flag | Exit code 2 with `needsAttributes` plus the real group and tag names; nothing was created. |
| `create --group --notes --label --confirm-attributes` on the server route | Group, tag, and remark all read back correctly. |
| `create --accept-defaults` | Created in the default group with no remark and no tags; `appliedAttributes` was null. |
| `create --transport local --group <name>` | Landed in the requested group once the helper sent `browser[].accounts.groupid`. |
| The same create with a top-level `browser[].groupid` | Accepted with `code: 0` and ignored; the environment landed in the default group. |
| `create --transport local --label <name>` | The local route has no tag field, so the result reported `skippedAttributes` for the tag and `appliedAttributes` omitted it. |
| Temporary environments used for these checks | Deleted; a follow-up `getconditionshops` returned zero matches. |

### Group, Tag, And Remark Interfaces

Exercised live on 2026-09-27. Every temporary group and tag was deleted and a
follow-up list confirmed it was gone.

| Check | Result |
| --- | --- |
| Group list | `getgroups` returned 86 groups with `groupId`, `name`, and `systemGroup`. |
| Group create, rename, delete | Created, found in the list, renamed in place, deleted with `code: 200`, absent from the next list. |
| Group delete without `--confirm-delete` | Exit code 2 with `needsConfirmation` on stderr; nothing was deleted. |
| Tag list | `findTags` returned 69 tags with `labelId`, `name`, `color`, and `colorName`. |
| Tag create, rename, delete | Created with colour `teal`, found in the list, renamed in place, deleted with `code: 200`, absent from the next list. |
| `tag-create` result | Returns the new `labelId` directly, so a caller no longer has to list the tags again to find it. |
| Tag delete without `--confirm-delete` | Exit code 2 with `needsConfirmation` on stderr. |
| Remark read and change | Created with a remark, read it back, changed it through the local `user/update`, and read the new value. |
| Remark cleared with `notes: ""`, `notes: null`, or an omitted `notes` | `code: 0` and the previous remark stayed, so the local route cannot clear it. |
| Remark cleared through the server route with a minimal body | The remark was stored empty, and the next read showed `kernelId: 0` with an empty proxy block. |

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

The bundled extension token was captured from a headless Chrome 140 environment through CDP; the storage and
refresh rules live in [workflows/token-lifecycle.md](workflows/token-lifecycle.md).

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

### Server Token Refresh

Exercised on 2026-09-27 against the tested origin.

| Check | Result |
| --- | --- |
| `POST /v2/sso/auth/tokenRefresh` with a valid token | HTTP 200, `code: 200`, `msg: ok`; returned a 215-character token and an explicit `expire` |
| `expire` versus the JWT `exp` claim | Identical to the second |
| Observed token lifetime | 168 hours (7 days) |
| Refresh with and without `ApiSource: 1` | Identical payload both ways, so the header is sent but not enforced on the tested origin |
| `scripts/yunlogin-auth.mjs refresh-server-token` | `refreshed: true`; the cache was rewritten with the new expiry |
| Server read with `YUNLOGIN_SERVER_REFRESH_SKEW_MS` above the lifetime | Refreshed before the call, then returned `code: 200` |
| Server read with a deliberately invalid token | Reported `code: 1001`, attempted no doomed retry, and exited 1 |
| `server-token.json` fields after a refresh | `token`, `captured_at`, `expires_at`, `expires_at_ms`, `refreshed_at`, `company_id`, `user_id`, `company` |

## Forward Testing

Static checks prove the documents agree with each other; they cannot prove that a different agent, starting
fresh, applies the skill correctly. Forward testing is the skill-creator procedure for that, and this skill is
complex enough to need it.

Procedure:

1. Start an independent agent that has not seen the design discussion, and give it only a realistic user
   request plus the skill path. Do not include the intended answer, a suspected bug, a proposed fix, or any
   earlier conclusion.
2. Create an isolated workspace for anything the task writes, for example
   `node scripts/dev/start-forward-test.mjs --request "..."`, so generated files never enter this repository.
3. Keep the run read-only unless the task genuinely needs a mutation, and never point it at a live production
   system or a cost-incurring action without asking the user first.
4. Read the agent's report and its artifacts, then act only on what the run actually demonstrates.

Requests used so far, and what each one surfaced:

| Request | What the run demonstrated | Fix it produced |
| --- | --- | --- |
| Report which environments exist, the proxy on the `JB-147` environment, and whether any proxy is missing, read-only | The agent routed, paged, and redacted correctly, and found that `--dry-run` and `status` could refresh and rewrite the token cache, that `dynamic` is a constant `2`, and that `proxy` is never null | Dry-run and status became side-effect free, with a cache-fingerprint regression check; both field meanings were corrected |
| Sign in as a second test account, with the credentials deliberately absent | The agent stopped, asked for the credentials, told the user to inject them locally instead of pasting them, warned that a chat value stays in the transcript, and refused to reuse the cached session | The credential-request contract gained the login path, the 2FA question, and the rule that `login` persists the token, so a no-disk-write instruction must be raised with the user |
| Group the environments by group name and write a summary file into an isolated directory | The agent paged 36 windows, deduplicated by `shopid`, reached exactly `allshopnumb`, wrote only inside the permitted directory, and made no token-cache write. It reported that `shop[].group` can be blank, that offsets can repeat a row on a live list, that `server-group-list` has no member counts, and that the helper prints the payload on stdout and the status line on stderr | `browser-list.md` gained the grouping and paging invariants, the server index now says where per-group counts come from, and the script documentation records the output split |
| Create a throwaway environment named `fwd-<id>`, confirm it in the list, then delete it | The agent read the endpoint docs first, dry-ran with both helpers, created exactly one environment, confirmed it by exact name, deleted it, and confirmed the empty list; it never wrote inside the skill directory and redacted the `Authorization` header as `[SET]`. It also reported that the environment helper builds its `--dry-run` body from live read-only template calls, that no documented no-cache-write mode existed, and that `shop` is `null` rather than `[]` on an empty result | `TOKEN_SETUP.md` gained a no-cache-write recipe (`YUNLOGIN_SERVER_REFRESH_SKEW_MS=0` plus `YUNLOGIN_SERVER_TOKEN_FILE`) and `scripts.md` now separates no-network from no-mutation dry-runs; `browser-list.md` notes the `null` empty list and reconciles the `allshopnumb` wording | A read-only follow-up run resolved "which proxies are missing" with no code change: the agent paged once, matched `allshopnumb` to the returned rows, redacted proxy credentials by default, and reported the two environments with an empty `proxy` object. It made no token-cache write in the real profile, noted that the 54-endpoint catalog has no dedicated environment-detail route and used `browser-list` instead of guessing, and flagged that a legitimately empty list differs from a permission failure. Reading the empty `proxy` object as "no proxy assigned" was correct and needed no clarification. |
Observation (2026-10-09): the test account had a transient, server-side outage that lasted several hours. During it, `my-user-info`, `my-companies`, and `current-company-info` returned `code: 500` with an `object does not exist or is not visible to you` message, environment and group lists came back empty, and a create that returned `code: 200` could not be listed or deleted. A fresh token issued during the outage failed the same way. It later cleared on its own on both tokens, so the account was never deleted and no client-side fix was needed. Before blaming the skill for an empty account, retry the probe and compare a second token: a server-side outage looks exactly like a permission failure.

Method note: run a forward test against a skill that is not being edited at the same time. One run observed the
files changing underneath it, which is a reminder to freeze the skill for the duration and to treat concurrent
timestamps as the evaluator's own observation, not as activity by the agent under test.

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

## fb.exe CDP Relaunch

The Windows helper was validated on 2026-10-08 without closing the active Workbench process.

| Check | Result |
| --- | --- |
| `yunlogin-fb-cdp.mjs list --main-only` | Found the Workbench main process and kept child processes separate. |
| Default redaction | The `--base-data` value was replaced with `[REDACTED]`; the raw value was absent from stdout. |
| Command-line identity | Printed the original command-line length and SHA-256 without storing the command line in the skill. |
| `restart --pid <pid> --port 9322 --dry-run` | Planned `--remote-debugging-address=127.0.0.1` and `--remote-debugging-port=9322`; `portAvailable` was true and no process changed. |
| Parser test | Quoted executable paths, quoted values with spaces, and base64-like values parsed correctly. |
| Confirmation gate | A restart without `--confirm-restart` returned `needsConfirmation: true` and exit code 2. |
| Isolated end-to-end path | A Node executable copied to `fb.exe` ran a mock CDP server. `restart` stopped it, relaunched it with `--remote-debugging-port=19444`, and `Browser.getVersion` returned `MockChrome/1.0`. |
| CDP control chain | `check`, `targets`, `eval`, and `close` succeeded against the relaunched mock process; `eval` returned `mock-title`, and `close` stopped the process. |
| Isolated real `fb.exe` probe | A separate Chrome 107 instance with a unique browser ID, profile, and CDP port started successfully; `/json/version` returned `Chrome/107.0.5304.114`. |
| Real `fb.exe` CDP control | `check`, `targets`, `eval`, and `close` succeeded against the isolated Chrome 107 instance; `eval` returned `chrome://newtab/` and `close` stopped the process in under one second. |
| Live restart | Not executed automatically because it would close the active Workbench process. The helper requires an explicit `--confirm-restart` for that operation. |

The unverified-live boundary is deliberate: a successful dry run proves discovery, planning, redaction, and port validation, while the actual stop and relaunch needs a user-approved browser downtime window.
