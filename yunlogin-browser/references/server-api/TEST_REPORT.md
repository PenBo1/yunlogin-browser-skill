# Server API Test Report

Every cataloged server route was exercised against `https://d126447d359e70c0.yunlogin.com` on 2026-09-24 with a live bearer token. This report is the evidence behind the `tested` field in [endpoints.json](endpoints.json).

## How The Sweep Ran

- Read routes were called once with the catalog defaults plus the stored company and user.
- Write routes were exercised as a create-and-delete round trip with unique names, then verified by re-reading the list, so no test data was left behind.
- Sensitive responses were never copied into this repository. Only the status and the response size are recorded.
- The sweep used the cached server session, so no credentials appear in any command line.

## Summary

| Result | Count |
| --- | ---: |
| HTTP 200 with business `code: 200` | 49 |
| HTTP 404, route not served by this deployment | 3 |
| Total cataloged routes | 52 |

## Full Results

| Endpoint ID | Method | Path | HTTP | Code | Bytes | ms | Notes |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| `browser-list` | POST | `/v2/newbrowser/getconditionshops` | 200 | 200 | 166322 | 755 |  |
| `browser-settings` | POST | `/v2/newbrowser/getsettings` | 200 | 200 | 1023 | 128 |  |
| `browser-cookie` | POST | `/v2/newbrowser/getCookie` | 200 | 200 | 81 | 69 | real environment ID |
| `proxy-cloud-list` | GET | `/v2/proxy/device/vcnplist` | 200 | 200 | 48704 | 243 |  |
| `proxy-self-list` | GET | `/v2/proxy/device/findDeviceProxyUserSelves` | 200 | 200 | 13060 | 181 |  |
| `proxy-dynamic-list` | GET | `/v2/proxy/device/findDeviceDynamicProxies` | 200 | 200 | 15617 | 206 |  |
| `account-list` | POST | `/v2/newbrowser/getUserPasswordList` | 200 | 200 | 104674 | 1414 |  |
| `find-devices` | POST | `/v2/proxy/device/findDevices` | 200 | 200 | 595748 | 653 |  |
| `fingerprint-uri` | POST | `/v2/newbrowser/getfingerprinturi` | 200 | 200 | 1949 | 151 |  |
| `environment-create` | POST | `/v2/newbrowser/putalluri` | 200 | 200 | 81 | 61 | round trip |
| `user-notices` | POST | `/v2/message/user-notice/my` | 200 | 200 | 133 | 117 |  |
| `latest-open-environments` | POST | `/v2/newbrowser/getLatestOpenAccountIdList` | 200 | 200 | 794 | 66 |  |
| `rpa-plan-list` | POST | `/v2/rpa/getRpaPlanManagementList` | 200 | 200 | 100 | 46 |  |
| `environment-clone` | POST | `/v2/newbrowser/batchCloneShop` | 200 | 200 | 70 | 326 | round trip |
| `fingerprint-defaults` | POST | `/v2/newbrowser/getdefaultfingerlist` | 200 | 200 | 39045 | 98 |  |
| `platform-class-tree` | POST | `/v2/newbrowser/getalluri` | 200 | 200 | 130 | 60 |  |
| `platform-catalog` | GET | `/v2/newbrowser/getallurilist` | 200 | 200 | 142356 | 107 |  |
| `custom-platform-list` | POST | `/v2/newbrowser/getalluserselfuri` | 200 | 200 | 15758 | 77 |  |
| `plugin-list` | GET | `/v2/plugin/getAddedAndGlobalplugin` | 200 | 200 | 2746 | 76 |  |
| `auth-shop-brief-list` | POST | `/v2/newbrowser/getauthshopbriefinfolist` | 200 | 200 | 9065 | 344 |  |
| `bound-account-detail` | POST | `/v2/newbrowser/getBindUserPassword` | 200 | 200 | 987404 | 222 |  |
| `account-users-get` | POST | `/v2/newbrowser/account-users/get` | 200 | 200 | 80 | 71 | empty result; account has no bound users |
| `server-group-list` | POST | `/v2/newbrowser/getgroups` | 200 | 200 | 6755 | 61 |  |
| `proxy-tag-list` | GET | `/v2/proxy/device/findTags` | 200 | 200 | 20647 | 75 |  |
| `proxy-tag-upsert` | POST | `/v2/proxy/device/updateTag` | 200 | 200 | 98 | 75 | round trip |
| `proxy-tag-delete` | POST | `/v2/proxy/device/delTag` | 200 | 200 |  |  | round trip |
| `server-group-create` | POST | `/v2/newbrowser/putnewgroup` | 200 | 200 | 81 | 67 | round trip |
| `server-group-delete` | POST | `/v2/newbrowser/deletegroups` | 200 | 200 |  |  | round trip |
| `environment-delete` | POST | `/v2/newbrowser/putdeleteshop` | 200 | 200 |  |  | round trip |
| `proxy-device-logs` | GET | `/v2/proxy/device/findDeviceLogs` | 200 | 200 | 146 | 341 |  |
| `transfer-shop-list` | POST | `/v2/newbrowser/transferShopList` | 200 | 200 | 129 | 91 |  |
| `auth-log-permissions` | POST | `/v2/logs/auth/perms` | 200 | 200 | 20663 | 114 |  |
| `auth-log-options` | POST | `/v2/logs/auth/options` | 200 | 200 | 6682 | 215 |  |
| `team-login-logs` | POST | `/v2/team/loginlogs` | 200 | 200 | 7248 | 79 |  |
| `current-company-info` | GET | `/v2/team/curCompanyInfo` | 404 | - | 18 | 79 |  |
| `user-meal-settings` | GET | `/v2/cost/costmanagement/get_user_set_meal` | 200 | 200 | 1008 | 144 |  |
| `team-members` | POST | `/v2/team/getMembers` | 200 | 200 | 3570 | 156 |  |
| `team-roles` | POST | `/v2/team/roles` | 200 | 200 | 13292 | 100 |  |
| `team-departments` | POST | `/v2/team/getDepts` | 200 | 200 | 1511 | 80 |  |
| `team-invite-code` | POST | `/v2/team/invite/getCode` | 200 | 200 | 116 | 61 |  |
| `version-core` | POST | `/v2/team/version/getCore` | 200 | 200 | 10725 | 82 |  |
| `team-authentication-get` | POST | `/v2/team/authentication/get` | 404 | - | 18 | 115 |  |
| `my-companies` | POST | `/v2/team/myCompanies` | 200 | 200 | 2273 | 76 |  |
| `sms-settings` | POST | `/v2/message/sms-setting/get` | 200 | 200 | 105 | 79 |  |
| `member-profile` | POST | `/v2/team/member/myInfo` | 200 | 200 | 758 | 71 |  |
| `company-user-devices` | GET | `/v2/team/company/user/devices` | 404 | - | 18 | 342 |  |
| `settings-contact` | GET | `/v2/news/settings/info` | 200 | 200 | 766 | 364 |  |
| `settings-qrcode` | GET | `/v2/news/settings/info` | 200 | 200 | 1601 | 67 |  |
| `company-face-check` | GET | `/v2/team/authentication/companyFourElementsFaceCheck` | 200 | 200 | 352 | 71 |  |
| `role-department-meal` | POST | `/v2/team/company/getRoleDepartmentMeal` | 200 | 200 | 1837 | 139 |  |
| `authentication-check` | GET | `/v2/team/authentication/check` | 200 | 200 | 389 | 224 |  |
| `my-user-info` | POST | `/v2/sso/auth/myUserinfo` | 200 | 200 | 810 | 77 |  |

Time is the measured round-trip latency of a single call and is recorded only as an order-of-magnitude indicator.

## Unavailable Routes

These three routes are cataloged so the helper can report the tested state, but the deployment does not serve them. They must not be called live.

| Endpoint ID | Path | Response |
| --- | --- | --- |
| `current-company-info` | `/v2/team/curCompanyInfo` | HTTP 404, `404 page not found` |
| `team-authentication-get` | `/v2/team/authentication/get` | HTTP 404, `404 page not found` |
| `company-user-devices` | `/v2/team/company/user/devices` | HTTP 404, `404 page not found` |

## Route-Specific Findings

| Finding | Detail |
| --- | --- |
| Largest responses | `find-devices` (about 580 KB), `bound-account-detail` (about 960 KB), and `browser-list` (about 160 KB) return the whole account set. Filter by ID or name instead of paging through everything. |
| Empty defaults are not a valid create payload | `environment-create` with the default `browser: {}` returns `code: 400`, `unknown error`. Build the template from `fingerprint-uri` and `fingerprint-defaults` first. |
| Required identifiers are not validated | `browser-cookie` with an empty `shopid` returns `code: 400`; with a real environment ID it returns `code: 200` and the stored cookie payload. |
| Empty-body writes can store junk | `proxy-tag-upsert` with an empty label returns `code: 200` and creates a tag with no name. Always send a label. |
| Localised success messages | Several team routes return a localised success message rather than `Success` or `OK`. Branch on `code`, not on the message. |
| No `msg` field | `browser-settings`, `fingerprint-uri`, `fingerprint-defaults`, `version-core`, `bound-account-detail`, `server-group-list`, and `server-group-create` omit `msg` on success. |
| Token errors | An invalid token returns HTTP 200 with `code: 1001`; a missing token returns HTTP 401 with the same code. See [ERRORS.md](ERRORS.md). |

| Clone routes are silently lenient | `environment-clone` returns `code: 200`, `OK` for an empty body, an empty ID list, and unknown IDs, and creates nothing. Only a real source ID produces a clone, so verify with `browser-list`. |
| Notification list can be null | `user-notices` returns `list: null` with `count: 0` when the account has no notices. That is not an error. |
| Plan list has no `data` wrapper | `rpa-plan-list` returns `list`, `count`, `pageIndex`, `pageSize`, and `timestamp` at the top level, and omits `msg`. |
| Recent environments return identifiers only | `latest-open-environments` returns `data.accountIds` with no names, so resolve names with `browser-list`. |

| Account-user rows not observable | `account-users-get` returned an empty array for every sampled environment because no account user is bound to them, so the row field names could not be confirmed live. |

## Reproducing

```powershell
node scripts/yunlogin-auth.mjs ensure-server
node scripts/yunlogin-server-api.mjs --list
node scripts/yunlogin-server-api.mjs browser-list --dry-run
```

Write routes should always be probed with `--dry-run` first, because accepting a request is not proof that the payload was understood.
