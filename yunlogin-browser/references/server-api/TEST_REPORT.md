# Server API Test Report

Every cataloged server route was exercised against `https://d126447d359e70c0.yunlogin.com` with a live bearer token. A full read sweep plus a 97-case request-parameter sweep and a create/verify/delete round trip for every write route ran on 2026-10-09. The field-level evidence lives in [FIELD_INVENTORY.md](FIELD_INVENTORY.md); the per-parameter evidence lives in [PARAMETER_MATRIX.md](PARAMETER_MATRIX.md). This report is the evidence behind the `tested` field in [endpoints.json](endpoints.json).

## Scope: The Catalog Was A Subset

The `endpoints.json` catalog of 54 routes is a curated subset. The management-center client bundle defines **507** server route entries. A full extraction and a broad availability sweep are recorded in [ROUTE_CATALOG.md](ROUTE_CATALOG.md), with the raw table in [client-routes.json](client-routes.json) and [route-sweep.json](route-sweep.json). Of the 507, 370 were probed live (365 returned HTTP 200), 86 answered no JSON handler, 48 were withheld by the write and blocklist classifier, and 3 failed in transport. This report covers the 54-route curated catalog in depth; the remaining routes are covered at availability-and-field level in the full catalog. Counts are a point-in-time snapshot of the test account, so treat the behaviour as the contract and the magnitudes as an illustration.

## How The Sweep Ran

- 47 read routes were called once each with catalog defaults plus the stored company and user, and every response field path was recorded.
- A further 97 read-only parameter cases varied one field at a time (filters, pagination, ids, flags) and compared result sizes and contents.
- The 7 write routes were exercised as a create/verify/delete round trip with unique names, then verified by re-reading the list, so no test data was left behind.
- The error contract was re-measured with missing, malformed, wrongly-typed, and unknown-id requests.
- Sensitive responses were never copied into this repository. Only status, size, field paths, and non-sensitive findings are recorded.
- The sweep used the cached server session, so no credentials appear in any command line.

## Summary

| Result | Count |
| --- | ---: |
| HTTP 200 with business `code: 200` | 54 |
| of which exercised as a create / verify / delete round trip | 7 |
| Read-only parameter cases measured separately | 97 |
| Total cataloged routes | 54 |

## Full Results

| Endpoint ID | Method | Path | HTTP | Code | Bytes | ms | Notes |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| `my-user-info` | POST | `/v2/sso/auth/myUserinfo` | 200 | 200 | 840 | 210 |  |
| `my-companies` | POST | `/v2/team/myCompanies` | 200 | 200 | 951 | 174 |  |
| `browser-settings` | POST | `/v2/newbrowser/getsettings` | 200 | 200 | 982 | 37 |  |
| `browser-list` | POST | `/v2/newbrowser/getconditionshops` | 200 | 200 | 164674 | 423 |  |
| `platform-catalog` | GET | `/v2/newbrowser/getallurilist` | 200 | 200 | 134892 | 219 |  |
| `platform-class-tree` | POST | `/v2/newbrowser/getalluri` | 200 | 200 | 154 | 9 |  |
| `custom-platform-list` | POST | `/v2/newbrowser/getalluserselfuri` | 200 | 200 | 1978 | 11 |  |
| `server-group-list` | POST | `/v2/newbrowser/getgroups` | 200 | 200 | 2678 | 45 |  |
| `proxy-tag-list` | GET | `/v2/proxy/device/findTags` | 200 | 200 | 4807 | 15 |  |
| `proxy-cloud-list` | GET | `/v2/proxy/device/vcnplist` | 200 | 200 | 148 | 36 |  |
| `proxy-self-list` | GET | `/v2/proxy/device/findDeviceProxyUserSelves` | 200 | 200 | 13367 | 128 |  |
| `proxy-dynamic-list` | GET | `/v2/proxy/device/findDeviceDynamicProxies` | 200 | 200 | 4169 | 40 |  |
| `latest-open-environments` | POST | `/v2/newbrowser/getLatestOpenAccountIdList` | 200 | 200 | 794 | 43 |  |
| `fingerprint-defaults` | POST | `/v2/newbrowser/getdefaultfingerlist` | 200 | 200 | 40168 | 771 |  |
| `version-core` | POST | `/v2/team/version/getCore` | 200 | 200 | 9582 | 15 |  |
| `browser-cookie` | POST | `/v2/newbrowser/getCookie` | 200 | 200 | 714 | 1015 |  |
| `account-list` | POST | `/v2/newbrowser/getUserPasswordList` | 200 | 200 | 18012 | 98 |  |
| `find-devices` | POST | `/v2/proxy/device/findDevices` | 200 | 200 | 98 | 17 |  |
| `fingerprint-uri` | POST | `/v2/newbrowser/getfingerprinturi` | 200 | 200 | 2067 | 22 |  |
| `user-notices` | POST | `/v2/message/user-notice/my` | 200 | 200 | 3515 | 119 |  |
| `rpa-plan-list` | POST | `/v2/rpa/getRpaPlanManagementList` | 200 | 200 | 100 | 8 |  |
| `plugin-list` | GET | `/v2/plugin/getAddedAndGlobalplugin` | 200 | 200 | 89 | 9 |  |
| `auth-shop-brief-list` | POST | `/v2/newbrowser/getauthshopbriefinfolist` | 200 | 200 | 8766 | 79 |  |
| `bound-account-detail` | POST | `/v2/newbrowser/getBindUserPassword` | 200 | 200 | 211 | 53 |  |
| `account-users-get` | POST | `/v2/newbrowser/account-users/get` | 200 | 200 | 80 | 5 |  |
| `proxy-device-logs` | GET | `/v2/proxy/device/findDeviceLogs` | 200 | 200 | 146 | 9 |  |
| `transfer-shop-list` | POST | `/v2/newbrowser/transferShopList` | 200 | 200 | 129 | 8 |  |
| `auth-log-permissions` | POST | `/v2/logs/auth/perms` | 200 | 200 | 11038 | 53 |  |
| `auth-log-options` | POST | `/v2/logs/auth/options` | 200 | 200 | 7551 | 98 |  |
| `team-login-logs` | POST | `/v2/team/loginlogs` | 200 | 200 | 7722 | 40 |  |
| `current-company-info` | POST | `/v2/team/curCompanyInfo` | 200 | 200 | 597 | 17 | method corrected GET->POST |
| `user-meal-settings` | GET | `/v2/cost/costmanagement/get_user_set_meal` | 200 | 200 | 994 | 6 |  |
| `team-members` | POST | `/v2/team/getMembers` | 200 | 200 | 2258 | 26 |  |
| `team-roles` | POST | `/v2/team/roles` | 200 | 200 | 4778 | 33 |  |
| `team-departments` | POST | `/v2/team/getDepts` | 200 | 200 | 2524 | 34 |  |
| `team-invite-code` | POST | `/v2/team/invite/getCode` | 200 | 200 | 116 | 8 |  |
| `team-authentication-get` | GET | `/v2/team/authentication/get` | 200 | 200 | 392 | 16 | method corrected POST->GET |
| `sms-settings` | POST | `/v2/message/sms-setting/get` | 200 | 200 | 105 | 8 |  |
| `member-profile` | POST | `/v2/team/member/myInfo` | 200 | 200 | 785 | 10 |  |
| `company-user-devices` | POST | `/v2/team/company/user/devices` | 200 | 200 | 4124 | 22 | method corrected GET->POST |
| `settings-contact` | GET | `/v2/news/settings/info` | 200 | 200 | 956 | 9 |  |
| `settings-qrcode` | GET | `/v2/news/settings/info` | 200 | 200 | 2032 | 5 |  |
| `company-face-check` | GET | `/v2/team/authentication/companyFourElementsFaceCheck` | 200 | 200 | 360 | 11 |  |
| `role-department-meal` | POST | `/v2/team/company/getRoleDepartmentMeal` | 200 | 200 | 583 | 12 |  |
| `authentication-check` | GET | `/v2/team/authentication/check` | 200 | 200 | 392 | 13 |  |
| `token-refresh` | POST | `/v2/sso/auth/tokenRefresh` | 200 | 200 | 389 | 9 |  |
| `environment-create` | POST | `/v2/newbrowser/putalluri` | 200 | 200 | 81 | - | create round trip verified |
| `environment-clone` | POST | `/v2/newbrowser/batchCloneShop` | 200 | 200 | 70 | - | clone round trip verified |
| `environment-delete` | POST | `/v2/newbrowser/putdeleteshop` | 200 | 200 | - | - | delete verified by re-read |
| `proxy-tag-upsert` | POST | `/v2/proxy/device/updateTag` | 200 | 200 | 98 | - | upsert round trip verified |
| `proxy-tag-delete` | POST | `/v2/proxy/device/delTag` | 200 | 200 | - | - | delete verified by re-read |
| `server-group-create` | POST | `/v2/newbrowser/putnewgroup` | 200 | 200 | 81 | - | create round trip verified |
| `server-group-delete` | POST | `/v2/newbrowser/deletegroups` | 200 | 200 | - | - | delete verified by re-read |
| `sso-login` | POST | `/v2/sso/login` | 200 | 200 | 347 | - | public; error path re-tested (code 10003) |

Time is the measured round-trip latency of a single call and is recorded only as an order-of-magnitude indicator.

## Method-Corrected Routes (2026-10-09)

Three cataloged routes were originally recorded as unavailable because they returned HTTP 404.
The 404 was caused by a wrong HTTP method, not by an unserved route. The client bundle maps
these management API names to specific verbs (see `client-routes.json`), and calling the
correct verb returns a normal 200 payload.

| Endpoint ID | Client name | Wrong -> right method | Path |
| --- | --- | --- | --- |
| `current-company-info` | `curCompanyInfo` | GET -> POST | `/v2/team/curCompanyInfo` |
| `team-authentication-get` | `authenticationGet` | POST -> GET | `/v2/team/authentication/get` |
| `company-user-devices` | `getDevices` | GET -> POST | `/v2/team/company/user/devices` |

Lesson: on this surface a wrong HTTP method returns HTTP 404 (empty body), not 405, so a 404
must be cross-checked against the client route table before concluding a route is unserved.

## Write Round Trips

Each write route was exercised and then cleaned up. The table records what was observed, including the fields that prove the write actually happened.

| Route | Created | Verified by | Deleted | Left behind |
| --- | --- | --- | --- | --- |
| `server-group-create` | `codex-sweep-group-<id>` (`categoryid` returned) | `server-group-list` contained the id | `server-group-delete` | no |
| `proxy-tag-upsert` | `codex-sweep-tag-<id>` (`color: 5`) | `proxy-tag-list` contained the name with `color: 5` | `proxy-tag-delete` | no |
| `environment-create` | `codex-sweep-env-<id>` (`shopid` array returned) | `browser-list` contained the id with `device_type: local` | `environment-delete` | no |
| `environment-clone` | clone named `148_19` | `browser-list` contained the clone id | `environment-delete` | no |

The delete calls are idempotent: deleting an unknown group or tag returns `code: 200`; deleting an unknown environment returns `code: 500`.

## Error Contract (Re-Measured)

| Request | HTTP | Code | `msg` | Meaning |
| --- | ---: | ---: | --- | --- |
| `my-user-info` with no token | 401 | 1001 | `无有效token` | Token missing at transport layer. |
| `my-user-info` with a bad token | 200 | 1001 | `Token有误` | Token rejected inside a 200 response. |
| `getconditionshops` with malformed JSON | 200 | 500 | Go decode error | Body must be valid JSON. |
| `getconditionshops` with empty body | 200 | 500 | `EOF` | Body must be present. |
| `getconditionshops` with `number` as a string | 200 | 500 | Go unmarshal error | `number` must be a number. |
| `getconditionshops` with `companyid` as an array | 200 | 200 | `Success` | The wrong-typed company id was coerced/ignored, not rejected. |
| `putalluri` with `{}` or no `browser` | 200 | 400 | `unknown error` | Creation needs a `browser` template. |
| `putdeleteshop` with an unknown or empty id list | 200 | 500 | `empty slice found` | Environment delete rejects empty/nonexistent sets. |
| `getCookie` with an empty `shopid` | 200 | 400 | `unknown error` | `shopid` is required. |
| `deletegroups` with an unknown group | 200 | 200 | `OK` | Group delete is idempotent. |
| `delTag` with an unknown tag | 200 | 200 | `ok` | Tag delete is idempotent. |
| a GET sent to a POST route | 404 | - | `404 page not found` | Wrong method looks like a missing route. |
| `sso-login` with a non phone/email username | 200 | 10003 | `必须手机号或者邮箱注册` | The username must be a registered phone or email. |
| second `updateTag` with the same label | 200 | 4020 | `数据已存在` | Duplicate tag name. |

## Second Server Surface

The management-center origin also serves the open/user API at `/v2/userapi/...` (no `/api` prefix), with a `code: 0` success convention. Seventeen of the nineteen candidate routes were present; the two plugin routes are local-only. Read routes were exercised live and the write routes were catalogued but not run destructively. See [USERAPI_SURFACE.md](USERAPI_SURFACE.md).

## Route-Specific Findings

See [RESPONSE_SHAPES.md](RESPONSE_SHAPES.md) for envelope, key-name, and type traps across the full surface.

| Finding | Detail |
| --- | --- |
| Largest responses | `find-devices` with real ids (hundreds of KB when the account owns cloud devices), `bound-account-detail` (about 960 KB historically), `browser-list` (about 160 KB), and `auth-log-options` (`count` 145674 rows). |
| Empty defaults are not a valid create payload | `environment-create` with the default `browser: {}` returns `code: 400`, `unknown error`. Build the template from `fingerprint-uri` and `fingerprint-defaults` first. |
| `find-devices` schema follows `trademark` | `trademark: "self"` returns self-proxy rows (`deviceid`, `proxyaddr`, `proxytype`, `ip_place`, `target_url[]` ...). `trademark: "official"` returns cloud-device rows. Recorded field names differ between the two. |
| `browser-list` `enable` filter is ignored | `enable: 0` and `enable: 1` both returned the full 165 KB set on the tested account. Do not rely on it to find disabled environments. |
| `browser-list` `number: 0` still reports `allshopnumb` | The row array is empty but `allshopnumb` (3512) is still returned. |
| `account-list` `bind` partitions cleanly | `bind: 1` (bound) + `bind: 0` (unbound) sizes sum to the baseline. |
| Localised success messages | Several team routes return a localised success message rather than `Success` or `OK`. Branch on `code`, not on the message. |
| Missing `msg` field | `browser-settings`, `fingerprint-uri`, `fingerprint-defaults`, `version-core`, `bound-account-detail`, `server-group-list`, and `server-group-create` omit `msg` on success. |
| Token errors | An invalid token returns HTTP 200 with `code: 1001`; a missing token returns HTTP 401 with the same code. See [ERRORS.md](ERRORS.md). |
| Clone routes are silently lenient | `environment-clone` returns `code: 200`, `OK` for an empty body, an empty ID list, and unknown IDs, and creates nothing. Only a real source ID produces a clone, so verify with `browser-list`. |
| Notification list can be null | `user-notices` returns `list: null` with `count: 0` when the account has no notices. That is not an error. |
| Plan list has no `data` wrapper | `rpa-plan-list` returns `list`, `count`, `pageIndex`, `pageSize`, and `timestamp` at the top level, and omits `msg`. |
| Recent environments return identifiers only | `latest-open-environments` returns `data.accountIds` with no names, so resolve names with `browser-list`. |
| Account-user rows not observable | `account-users-get` returned an empty array for every sampled environment, so the row field names could not be confirmed live. |
| `role-department-meal` spans companies | The response returned one row per company the user belongs to, including a second company not in the active session. |
| `server-group-list` `system_group` values | `1` is the default group, `2` is the transfer group, `0` is a custom group. |

## Reproducing

```powershell
node scripts/yunlogin-auth.mjs ensure-server
node scripts/yunlogin-server-api.mjs --list
node scripts/yunlogin-server-api.mjs browser-list --dry-run
node scripts/dev/probe-server-api.mjs --output inventory.json
node scripts/dev/render-field-inventory.mjs inventory.json
node scripts/dev/sweep-params.mjs --cases cases.json --out ./out
```

Write routes should always be probed with `--dry-run` first, because accepting a request is not proof that the payload was understood.
