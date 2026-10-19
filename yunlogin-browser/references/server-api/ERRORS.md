# Server API Error Contract

The management-center API reports most failures inside the response body while the HTTP status stays `200`. Read the HTTP status and the business `code` separately, and never treat HTTP 200 as proof of success.

## Two Layers

| Layer | Meaning |
| --- | --- |
| HTTP status | Transport result. `200` for a handled request, `401` for a missing token, `404` for a route that the deployment does not serve. |
| Business `code` | Application result. `200` means success; everything else is a failure. |

## Business Codes

| Code | Observed message | Meaning | Example trigger |
| --- | --- | --- | --- |
| `200` | `Success`, `OK`, `ok`, or a localised success text | Success | A well-formed request. |
| `400` | `unknown error` | The payload was rejected before business validation | `POST /v2/newbrowser/putalluri` with an empty body or without a `browser` object. |
| `500` | `json: cannot unmarshal ...` or `empty slice found` | Server-side decoding or lookup failure | A wrong field type in `getconditionshops`, or a `putdeleteshop` call for an unknown environment ID. |
| `1001` | a localized token-error message | The bearer token is wrong, expired, or missing | Any authenticated route with an invalid or absent token. |
| `4020` | a localized already-exists message | The record already exists | Creating a tag whose label or ID collides with an existing tag. |
| `-99` | `请求过于频繁，请1秒后再试` | Rate limited. The body also carries `retry_after` (seconds). | `POST /v2/userapi/user/update` called twice within about one second. |

Codes arrive as numbers. A localised message is not a stable contract; branch on the code, and use the message only for the operator-facing explanation.

## HTTP Status Values

| Status | Body | Meaning |
| --- | --- | --- |
| `200` | JSON with a business code | The request was handled. The code decides success. |
| `401` | `{"code":1001,"msg":"<localized token message>"}` | No bearer token was supplied. |
| `404` | `404 page not found` | The route is not served by this deployment, or the HTTP method is wrong for the route. |

## Request Validation Is Inconsistent

Endpoints do not share one validation model. Measured behaviour:

| Endpoint | Request | Result |
| --- | --- | --- |
| `POST /v2/newbrowser/getconditionshops` | `{}` | `code: 200` and a default page of environments |
| `POST /v2/newbrowser/getconditionshops` | `{"companyid":1,"userid":[],"number":"many"}` | `code: 500` with a Go unmarshal error |
| `POST /v2/newbrowser/putalluri` | `{}` | `code: 400`, `unknown error` |
| `POST /v2/proxy/device/updateTag` | `{}` | `code: 200`, and an empty-name tag is created |
| `POST /v2/proxy/device/delTag` | unknown `labelid` | `code: 200`; deleting a missing tag is idempotent |
| `POST /v2/newbrowser/putnewgroup` | `{}` | `code: 200` |
| `POST /v2/newbrowser/deletegroups` | unknown `groupid` | `code: 200`, `OK`; deleting a missing group is idempotent |
| `POST /v2/newbrowser/putdeleteshop` | unknown `shopid` | `code: 500`, `empty slice found` |
| `POST /v2/newbrowser/getsettings` | malformed JSON | `code: 200`; the route ignores the body |

Two consequences matter in practice:

1. **Probing a create route can create real data.** `updateTag` with an empty body returned `200` and created a tag with no name. Never send a probe payload to a route that writes records; use `--dry-run` instead.
2. **Accepting a request is not the same as understanding it.** Several routes ignore unknown fields and defaults, so a typo in a field name can silently produce a record with default values.

## Handling Failures

| Situation | Action |
| --- | --- |
| `code: 200` | Read the payload. |
| `code: 1001` | Stop, run `node scripts/yunlogin-auth.mjs ensure-server`, and tell the user a fresh server token is required. Do not retry with the same token. |
| `code: 400` | Fix the request body. For `putalluri`, confirm a `browser` object is present. |
| `code: 500` | Treat it as a rejected or unhandled request. Check field types against the endpoint document and verify the target ID exists. |
| `code: 4020` | The record already exists. Re-read the resource instead of creating it again. |
| HTTP 404 | Do not retry. The route or method is wrong for this deployment; check `endpoints.json` and the endpoint document. |

## Helper Behaviour

`scripts/yunlogin-server-api.mjs` exits non-zero when the HTTP request fails or the business code is not listed in `business_success_codes`. It redacts sensitive response fields before printing, and `--dry-run` validates the request without sending it. Prefer `--dry-run` first for any route that writes data.

## Full-Surface Code Inventory (2026-10-09)

A sweep of all 507 client-defined server routes observed these business codes in addition to the curated-catalog codes above. See [ROUTE_CATALOG.md](ROUTE_CATALOG.md) for the per-route evidence.

| Code | Observed meaning | Notes |
| ---: | --- | --- |
| `0` | Success | The server-side `userapi` surface (`/v2/userapi/*`) uses `0`, not `200`. |
| `7` | Missing or invalid parameter | Newer plugin/retail routes. |
| `200` | Success | Management-center surface. |
| `400` | Validation/decoding error, or record not found | Body may be `unknown error`, `record not found`, or `NOT_FOUND`. |
| `401` | Missing required identifier / no access | Example: `device id is required`. |
| `403` | No access permission | Example: `暂无访问权限`. |
| `404` | Record/resource not found | Business code, distinct from an HTTP 404 route miss. |
| `500` | Business error | Already-exists, not-found, invalid, or dependency failure. |
| `1055` | No scan information received | Face/QR verification. |
| `4009` | Invalid request parameters | Billing/order routes. |
| `4011` | Retrieval failed | Proxy device routes. |
| `10003` | Username must be a registered phone or email | Login validation. |
| `10006` | Not logged in | Some routes rejected the session even with a valid token. |
| `10012` | At least one permission required | Role edit. |
| `10017` | No permission to delete | Department delete. |
| `10022` | No permission to modify | Department edit. |
| `30005` | Creation failed | Plugin group. |
| `30009` | Plugin already exists | Plugin upload. |
| `50002` | Update failed | RPA plan status. |
| `50004` | Retrieval failed | RPA config. |

The lesson from the curated catalog still holds: branch on the numeric code, and never assume `200` is the only success value — some routes use `0`, and the failure codes are not globally unique in meaning.

## Additional Observed Code

| Code | Meaning | Notes |
| ---: | --- | --- |
| `4013` | Unknown error | Credential batch-add route; recognized `kernel_version` but rejected the payload. |

## Upstream Dependency Failures

Four routes do not fail in the client or in the management-center: they fail while the server calls an
upstream service. They surface as a gateway status or as a `code: 500` envelope whose message contains
the upstream target. Retrying them does not help; the upstream has to recover.

| Route | Measured | Upstream |
| --- | --- | --- |
| `POST /v2/newbrowser/updateProxyShop` | HTTP `504` after 60s | upstream `updateProxyShop` did not answer |
| `POST /v2/newbrowser/updateYunShopProxy` | HTTP `502` after 23s | upstream `updateYunShopProxy` did not answer |
| `POST /v2/sso/auth/setInfo` | HTTP `200`, `code: 500` | `http://192.168.0.72/sellExt/setInfo` is unreachable |
| `POST /v2/sso/loginGoogle` | HTTP `200`, `code: 500` | `https://www.googleapis.com/oauth2` is unreachable |

The last two show that a `200` HTTP status can still carry a server-to-server dial timeout, and that the
message text is the only place the upstream target appears. Treat a `500` whose message starts with
`Post "http` as an infrastructure failure rather than a request-shape error.

Re-checked 2026-10-10 on the second test account, 40-60s client budget: `updateProxyShop` answered
HTTP `524` after 40s, `updateYunShopProxy` HTTP `524` after 40s, and `loginGoogle` HTTP `502` after 30s.
Two independent gateways and two accounts give the same result, so these are origin-side failures, not a
client timeout that a longer budget would fix. `sso/auth/setInfo` was not re-probed.
## Handler Panics

Two routes fail with a Go runtime panic instead of a validated error envelope. Both are server defects:
the request decodes, then a handler indexes or dereferences something that is not there. They are worth
knowing because the `500` looks like a rejected request, and a retry with the same shape keeps landing on
the same panic.

| Route | Request | Measured |
| --- | --- | --- |
| `POST /v2/newbrowser/getshopfromproxy` | `{"deviceid":""}` | `code: 500`, nil pointer dereference in the handler |
| `POST /v2/newbrowser/cloud-accounts/finger/get` | `{"shopid":"<shop with no cloud account>"}` | `code: 500`, `runtime error: index out of range [0] with length 0` |

For `getshopfromproxy`, supply a real, non-empty `deviceid`. For `cloud-accounts/finger/get`, the
panic happens whenever the target shop has zero cloud accounts, so a caller that wants the fingerprint
of a not-yet-provisioned shop gets a defect instead of an empty result. Treat both as unrecoverable by
retrying; change the input or skip the route.

## Generic-Body Probes Can Create Rows

The availability sweep sends one generic body to every non-blocklisted write route. Two routes accepted it
and wrote a row with an empty name, so each sweep run left a small piece of residue until the routes were
blocklisted:

| Route | What it created | Fix |
| --- | --- | --- |
| `POST /v2/rpa/createRpaGroup` | an RPA group with `name: ""` | moved to the catastrophic blocklist; the audit counts empty-name RPA groups |
| `POST /v2/proxy/device/updateTag` | a proxy tag with `name: ""` | moved to the catastrophic blocklist; the audit counts empty-name tags |

Every other resource the residue check scans was audited for the same signature and is clean: custom
platforms (6 rows, no blank `login_url`), self proxies (500 rows, no blank `device_name`), promotion links,
and environment groups (32 rows, no blank `name`). Those row counts are from the earlier account snapshot.

The `/v2/cost/invoice_user/...` family is excluded from this skill by owner decision (2026-10-12): its routes are not catalogued, swept, or probed, and the earlier residue row for invoice titles was removed with the family itself.

Credentials do carry six blank `name` rows, but their `created_at` values run from 2025-12 to 2026-08, well
before any probe ran, so blank credential names are real account data - the credential check must not treat
them as residue.

Take-away: a route that lacks server-side validation will happily store a generated body, and a residue
check that only matches a `codex` prefix will miss it. Count empty identifiers as well.
## Client-Surface Paths Were Probed Against The Server

The client bundle mixes three surfaces. Paths under `/api/v1/client/`, `/api/v1/settings/`,
`/api/v1/cores/`, and `/api/v1/ipify/` belong to the **local client API** on its discovered loopback port,
not to the management-center origin. The first sweeps sent all of them to the server and recorded 17 of
them as HTTP 405 "dead" paths - a routing mistake, not a dead route.

`sweep-all-routes.mjs` now routes by surface: those four prefixes go to the client origin resolved at run
time, everything else to the management-center origin, and each result records its `surface`. Probed on the
right port, all 17 answer `code: 0` with real fields - for example `GET /api/v1/cores/get_all` returns the
kernel list and `POST /api/v1/client/base_info` returns `{version: "20"}`.

At the time of the fix the account in use had live coverage go from 386 to **401** routes and the dead
bucket from 71 to **54**. Later account and deployment changes moved those to **370 live / 86 dead**; the
routing rule itself is unchanged.

## Paths The Deployment Does Not Serve Answer A Plain 404

A path the deployment has no handler for comes back with **HTTP 404 and a tiny plain-text body** -
`File not found.` (16 bytes) or `404 page not found` (18 bytes) - never JSON. Earlier in the same
session the very same paths answered the 2053-byte single-page-app shell or HTTP 405; the unknown-path
response changed under us. `sweep-all-routes.mjs` treats all three shapes as dead: the SPA shell,
HTTP 405, and a non-JSON 404 under 64 bytes.

With that rule, **86 of the 507 routes are dead**. Every one is a stale string in the client bundle that
the deployment does not serve; they cluster on retired prefixes:

- `/api/v1/users/*` and `/api/v2/users/*` - the legacy management-center API that moved to `/v2`
- `/api/v1/sendemailcode`
- a handful of `/v2/...` paths the client still references but the deployment never implemented

All 86 were also tested against both loopback surfaces (`localhost:50213` and the discovered client
port) and answer 404 there too, so they are genuinely retired rather than misrouted.

### Existence Oracle Per Surface (2026-10-10)

`OPTIONS` is a usable existence oracle **only on the local client service**: a live route answers
HTTP 200 and an unknown path answers 404. Re-confirmed against `POST /api/v1/client/gpu_info`
(HTTP 200, `code: 0`) versus a made-up path (404).

The same oracle is useless on the other two surfaces, because both answer 404 for a wrong method on a
live route: `localhost:50213` returns 404 for `OPTIONS /api/v2/browser/status` even though
`GET /api/v2/browser/status` returns 200, and the management-center origin returns 404 for any wrong
method (that is the trap described in [TEST_REPORT.md](TEST_REPORT.md)).

Applied to the legacy family, every `/api/v1/users/*` and `/api/v2/users/*` path answers 404 on all
three surfaces:

| Path | Management-center | Client service | Local desktop |
| --- | --- | --- | --- |
| `GET /api/v1/users/role/list` | 404 | 404 | 404 |
| `GET /api/v1/users/role/right` | 404 | 404 | 404 |
| `OPTIONS /api/v1/users` | - | 404 | 404 |
| `OPTIONS /api/v1/users/account/batchdelete` | - | 404 | 404 |
| `OPTIONS /api/v1/users/customplatformedit` | - | 404 | 404 |
| `OPTIONS /api/v1/users/role/curd` | - | 404 | 404 |
| `OPTIONS /api/v1/users/upnewuserpwd` | - | 404 | 404 |
| `OPTIONS /api/v2/users/register` | - | 404 | 404 |
| `OPTIONS /api/v2/users/sendCode` | - | 404 | 404 |

`GET /api/v1/users/sendsms` was deliberately never called, because it sends a real SMS. `OPTIONS`
covers it: the oracle answers before any handler runs.

A missing `code` is **not** a defect signal on its own. Ten live routes legitimately omit `code` and
still return JSON with real fields - the plugin catalogue (`getPluginCrxList`, `myPlugin`,
`getPluginCategoryGroupList`, `getPluginCrxUserList`, `getPluginCompaniesPersonageList`,
`getPluginHeatSearchesList`), the two agreement HTML pages, `gitPluginGroupList`, and
`getUserCompanyInviteList`. Check the content type and the byte size instead of the presence of `code`.

## Cloud-Account Fingerprint And Recycle List (2026-10-10)

Two routes that earlier looked blocked or empty are parameter-sensitive:

| Route | Wrong input | Right input |
| --- | --- | --- |
| `POST /v2/newbrowser/cloud-accounts/finger/get` | `{"shopid": "<cloud account row id or serial>"}` -> `code: 500 index out of range [0] with length 0` | `{"shopid": "<row.accountId>"}` from `cloud-accounts/page` -> `code: 200` with 126 field paths |
| `POST /v2/newbrowser/getrecycleshoplist` | `{"accountName":"","categoryId":"","transfers":0}` -> `code: 500` | `{}` or `{"page":1,"pageSize":10}` -> `code: 200` with 29 field paths |

The cloud-account page row carries both `id` (an internal row number) and `accountId` (the account
identifier). Only `accountId` works as the `shopid` for the fingerprint route; every other candidate,
including the numeric `id`, the `serial`, and an environment `shopid`, is rejected, and a shop with no
cloud account still panics. The recycle list is a plain paged read; the earlier body itself caused the
`500`.

## Wrong-Method 404s That Look Like Dead Paths (2026-10-10)

Because the management-center origin returns a plain `404 page not found` for the wrong method on a
live route, a path probed with the wrong verb is indistinguishable from a dead path. Nine read routes
were re-verified with the correct verb and now answer JSON on both the reference and second accounts:

| Route | Correct method | Wrong method |
| --- | --- | --- |
| `GET /v2/newbrowser/getallurilist` | GET -> 200 | POST -> 404 |
| `GET /v2/proxy/device/vcnpsummary` | GET -> 200 | POST -> 404 |
| `GET /v2/retail/findRetailUserInviteCode` | GET -> 200 | - |
| `GET /v2/retail/findRetailSettleConfig` | GET -> 200 | - |
| `GET /v2/retail/getPromotionLinkList` | GET -> 200 | - |
| `GET /v2/cost/costmanagement/getrechargecloudcoin` | GET -> 200 | - |
| `GET /v2/cost/costmanagement/getcloudsupport` | GET -> 200 | - |
| `GET /v2/cost/costmanagement/getcloudsupportnew` | GET -> 200 | - |
| `POST /v2/proxy/device/findVcnpList` | POST with `device_ids: []` -> 200 | - |

Before parking a path as dead, confirm the verb against `client-routes.json`; the extracted route key
already carries the intended method.

## Plugin-Group Enumeration And Residue (2026-10-10)

`GET /v2/plugin/group/gitPluginGroupList` splits its rows by `groupType`, and `groupType=0` is where
`createPluginGroup` writes. Two details matter:

| Detail | Evidence |
| --- | --- |
| The response has no `code`; success is a `list` array with `count`, `pageIndex`, `pageSize`. | `{"list":[{"pluginGroup":{...},"amount":0}],"count":2,...}` |
| `groupType=0` held two plugin groups with an **empty `groupName`**, both created 2026-10-09 20:47-20:52 with `isGlobal: 2`. | Created by the research probe, not by the user; removed with `DELETE /v2/plugin/group/deletePluginGroup {groupId}` -> `code: 200 ok`, and `count` returned to 0. |

Because the residue gate only scanned `groupType` 1 and 2, those two rows passed every audit run. The
gate now scans 0, 1, and 2.

`accountGroupList` stays unresolved even on an account with data. The server distinguishes the two
failure modes, which proves the parameter name is right: an **empty** `accountId` answers
`code: 7 缺少必要参数` (missing parameter), while any real value answers `code: 7 record not found`. The
second account owns eight named plugin groups and environments with bound credentials, yet every
value tried - environment shopids, a plugin row's `userId`, `companyId`, `groupId`, and the session's
own user and company ids - answers not-found. The route needs a precondition that neither account
satisfies, and it is not a plain "create a plugin group" gate.

## RPA And Method-Sensitive Routes (2026-10-10)

Two RPA lookups take a foreign key that is easy to confuse with an environment id, and one RPA list is
GET-only:

| Route | Rule |
| --- | --- |
| `GET /v2/rpa/getRpaShopList` | Correct method is GET; a POST answers a plain HTTP 404 even though the client route table registers the path. |
| `GET /v2/rpa/findRpaShop` | `shopId` must come from a `getRpaShopList` row, not from an environment `shopid`; the wrong id answers `404 record not found`. |
| `GET /v2/rpa/findRpaPlanManagement` | `planId` must come from a `getRpaPlanManagementList` row; a missing plan answers `404` while the route itself still answers 200. |

`getRpaPlanManagementList` accepts GET and POST and answered with 87 field paths on the second account;
`getRpaShopList` returned 23 rows (20 per page) and `findRpaShop` answered 49-56 field paths.

## Second-Account Re-Check Of The Unresolved Routes (2026-10-10)

The second, data-rich account re-probed every read-shaped route in the universe with
`scripts/dev/probe-route-fields.mjs`. The results split three ways.

**Resolved by the richer account.** 75 routes returned a success envelope with real fields that the
reference account could not reach, including `rpa/findRpaPlanManagement` (92 field paths),
`rpa/getRpaTaskLog` (20), `proxy/device/findDesignateDevices`, `cost/device/cart_find`,
`admin/device/third-proxy/page`, and the credential/plugin families. Per-route evidence is in
[CROSS_ACCOUNT_VERIFICATION.md](CROSS_ACCOUNT_VERIFICATION.md).

**Still dead.** These answer 404 on the management-center origin for both accounts, in every shape
tried, so their client strings are stale rather than their requests:

| Route | Note |
| --- | --- |
| `POST /v2/newbrowser/getallmessage` | Superseded by `POST /v2/message/user-notice/my` |
| `POST /v2/newbrowser/getreadmessage` | Superseded by the same message family |
| `POST /v2/newbrowser/world/getUserExpiredTime` | No handler on the origin |
| `GET /api/v1/users/*`, `GET /api/v2/users/*` | Retired legacy family, 404 on all three surfaces |
| `POST /api/v1/ipify/query`, `/queryV7`, `/getVersion`, `/fetchForwardProxyInfo` | 404 on the management center; the live client calls a loopback/IP service instead |

**Request shape pinned.** Two routes only failed earlier because of a field type:

| Route | Wrong | Right |
| --- | --- | --- |
| `POST /v2/team/select/company` | `clientType: 1` -> `code: 500` json unmarshal | `clientType: "web"` -> `code: 200`, 19 field paths |
| `GET /v2/plugin/getPluginCrxList` | `kernel: "Chrome"` -> `code: 7` ParseInt | `kernel: 0` or `1` -> a `list` of CRX rows |

The client bundle also references origins other than the management center
(`https://www.yunlogin.com`, `https://api.qflogin.com`, `https://api.mtlogin.com`, and
`http://127.0.0.1`), so a path that is dead on one origin is not automatically dead everywhere. Classify
dead paths per origin, not per path string.

## Routes That Were Blocked By The Server (Re-Checked 2026-10-10)

A 2026-10-09 pass could not exercise four routes because the server itself failed. Re-checked on
2026-10-10 against the second test account, three of the four answer cleanly and the old note is
obsolete:

| Route | 2026-10-09 | 2026-10-10 |
| --- | --- | --- |
| `GET /v2/plugin/group/gitPluginGroupList` | `code: 7`, MySQL `Error 3144 ... CHARACTER SET 'binary'`, two JSON objects concatenated | HTTP 200, clean `{"list":null,"count":0,"pageIndex":1,"pageSize":10}` |
| `GET /v2/plugin/group/gitGroupPluginList` | two `code: 7` MySQL error objects, then a valid payload with two `null` lists | HTTP 200, clean `{"code":200,"data":{"globalPlugin":{...},"userPlugin":{...}},"msg":"ok"}` |
| `GET /v2/rpa/getRpaCarbonConfigList` | `code: 50004` retrieval failure | HTTP 200, `code: 0`, real rows (10.6 KB for 2 configs) |
| `GET /v2/rpa/recycleRpaCarbonConfig` | `code: 50004` | HTTP 200, `code: 0`, `{list:[],count:0,pageIndex:0,pageSize:0}` |

Two consequences of the old note no longer hold:

- Plugin groups **can** be enumerated. `gitPluginGroupList` returns rows, needs `pageIndex`, `sort`,
  `pageSize` and `groupType`, and answers `{list:null,count:0}` for an empty group type. The audit's
  residue check reads both group types and counts empty `groupName` rows.
- An RPA carbon config **does** exist on this account, so the delete/recover round trip is testable.
  See [WRITE_ROUNDTRIPS.md](WRITE_ROUNDTRIPS.md).

`createRpaPlanManagement` is now documented at the field level (see
[WRITE_ROUNDTRIPS.md](WRITE_ROUNDTRIPS.md)): the decoder is `RpaPlanManagementCreate`, `account` is an
array of `{shopid string, serial int}`, and a real `configId` plus a real environment still answers
`code: 7 accountId invalid`. The blocker is account state, not the request: every environment carries
`accounts: ""`, `userPasswordIds: ""`, `passwords: []`, and `getUserPasswordList` returns 0 rows, so no
environment has a bound credential for a plan to drive. Binding a real platform credential is outside
the test account, so the create stays unexecuted.

## Behaviour Changes Between Sweeps

The drift check ([DRIFT.md](DRIFT.md)) compares each full-surface sweep with the stored baseline. Two
real changes surfaced when the 2026-09-24 baseline was compared with the 2026-10-09 re-sweep:

| Route | Before | After |
| --- | --- | --- |
| `GET /v2/team/authentication/check` | `code: 200`, 16 fields | `code: 500`, 5 fields (reproduced 3/3) |
| `POST /v2/plugin/createPluginCrx` | `code: 200` | `code: 30009` duplicate (the earlier probe created the plugin) |

Both are account-state dependent rather than contract changes: a passed authentication check and a free
plugin slot are preconditions, not guarantees. Re-read the resource instead of caching either result.

## Rate-Limit Envelope (2026-10-10)

Several routes throttle rapid repeats. The envelope differs from both normal conventions:

```json
{ "code": -99, "msg": "request too frequent, retry in 1 second", "reqId": "<uuid>", "retry_after": 0.660266934 }
```

- `code: -99` is the rate limit, and `msg` is a localized "too frequent" message.
- `retry_after` is a **fractional number of seconds** and is the only place the wait is stated.
- Seen on `POST /v2/userapi/officialproxy/list`, the `selfproxy` list, and the sso register / send-code
  family. Space repeated calls by more than a second and honour `retry_after` instead of assuming a fixed
  window.
