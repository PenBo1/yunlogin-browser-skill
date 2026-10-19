# Server API Response Shapes And Traps

The management-center API is not uniform. This page collects the envelope, naming, and type quirks measured across the 507-route sweep and the round trips, so a client can parse every route correctly.

## Success Codes Are Per-Route

| Code | Where it means success |
| ---: | --- |
| `200` | Most `/v2/*` management routes (and `getAllUrlList`, `getRpaTaskLogList`, `findRpaGroup`, `findPluginCompanies`). |
| `0` | Server-side `userapi` CRUD (`/v2/userapi/*`) and the RPA list routes (`getRpaGroupList`, `getRpaShopList`, `getRpaShopGroupList`). |

Never treat a single numeric code as globally correct. Read the route's documented success code.

## Envelope Variations

| Shape | Example routes |
| --- | --- |
| `{ code, msg, data }` | most routes |
| `{ code, msgCode, data, msg, traceId }` | proxy device and newer routes |
| `{ code, msg, datas: [...] }` | `userapi/user/update` (`datas`, not `data`) |
| `{ code, msg, list, count, pageIndex, pageSize }` (no `data`) | `rpa/getRpaGroupList`, `rpa/getRpaTaskLogList` |
| `{ code, msg, shop, allshopnumb }` (no `data`) | `newbrowser/getconditionshops` |
| `{ code, msg, group }` (no `data`) | `newbrowser/getgroups` |
| `{ requestId, code, msg, data }` | `sso/*`, `team/*` |
| `{ reqId, code, msg }` | several delete routes |
| no `code` field at all | `plugin/getPluginCrxList`, `plugin/myPlugin`, `plugin/getPluginCategoryGroupList`, `plugin/getPluginCompaniesPersonageList`, `plugin/group/gitPluginGroupList`, `retail/getUserCompanyInviteList`, `retail/frozenList`, `retail/getRetailWithdrawLogList` |
| top-level fields, no `data` wrapper | `sso/auth/user/info/get` (`{ id, userId, mobile, email, bind }`) |
| two concatenated JSON objects | `plugin/group/gitPluginGroupList` (`{...code:7...}{"list":null,"count":1,...}`) |

`data` can be `null` (empty device list), `{}` (empty object), `[]` (empty array), or omitted. A missing `code` is not an error.

## Key-Name Traps (Spelling And Case)

These are real, load-bearing keys — do not "fix" them:

| Key | Route / meaning |
| --- | --- |
| `gropid` | group id in `newbrowser/getgroups` / `browser-list` |
| `rerpaGroup`, `rerpaTaskLog`, `resRpaShop` | RPA response keys |
| `repluginCompanies` | `plugin/findPluginCompanies` |
| `reretailSettleConfig` | `retail/findRetailSettleConfig` |
| `Code` (capital C) | `newbrowser/putnewgroup` rename response |
| `ID`, `CreatedAt`, `UpdatedAt` | `rpa/getRpaShopGroupList`, `retail/getPromotionLinkList`, `retail/findRetailSettleConfig` |
| `PublicIP`, `Addr`, `User`, `Passwd`, `Interval`, `Url`, `Type` | environment/proxy blocks |
| `widowssize`, `enableopen`, `random_finger`, `enable_gc`, `clearStorage` | fingerprint / settings blocks |
| `ipChannel`, `device_type`, `company_id`, `user_id`, `ip_query_channel`, `ip_place` | mixed camel/snake across routes |

## Type Traps

| Field | Trap |
| --- | --- |
| `device_ids` | self-proxy batch delete requires `device_ids: []string`; `deviceid`/`deviceId` are ignored |
| `shopid` | `retsetshopisstartag`/`retsetshopistop`/`putchangegroup` require an array; a bare string returns `500 ... SetShop.shopid of type []string` |
| `id` (role group) | `RoleGroupDto.id` is int64; `id:""` returns `500 cannot unmarshal string into ... int64` |
| `RenewSmsNotifyEnabled` | Go `required` rejects `0`, so the flag cannot be set to 0 |
| `tags` (env-settings) | must be non-empty (`gt` validator) |
| `titleId` (invoice delete) | must be in the URL path only; inside the body it fails `unknown field "titleId"` |
| `expectedVersion` + `request_id` | required for invoice title `delete`/`default` (optimistic concurrency + idempotency) |
| `data` (getCookie) | a JSON string, not an object |
| `menus` (sidebar) | a JSON string |

## HTTP vs Business Code

- Missing token -> HTTP 401 with `code: 1001`.
- Bad token -> HTTP 200 with `code: 1001`.
- Wrong HTTP method for a route -> HTTP 404 (`404 page not found`) or 405.
- `/api/*` legacy paths -> HTTP 200 SPA HTML (GET) or 405 (POST/PUT) - not JSON API.

## Message Fields Are Not Stable

Success `msg` values include `Success`, `OK`, `ok`, `查询成功`, `创建成功`, `删除成功`, `操作成功`, `成功`. Branch on `code`, not on `msg`.

## Null vs Empty

- `user-notices` returns `list: null` with `count: 0` when empty (not `[]`).
- `plugin/getAddedAndGlobalplugin` returns `distributionPlugin: []` (empty array).
- `getRpaGroupList` returns `list: []` (empty array).
- `product`/`label`/`authorized` fields frequently return `null` where an object is expected.

## Deletion Is Two-Phase For Some Resources

- Environment (`putdeleteshop`) and self-proxy (`delDeviceProxyUserSelves`) move records to a recycle bin; purge with `putdeleteshopfromrecycle` / `recycleDelDeviceProxyUserSelves`.
- Group/tag/role-group/department deletes are hard deletes.
- Plugin groups have no delete route at all.

## Silent / Lenient Behaviours (High-Risk)

Several write routes return success without doing what the caller expects, or accept a mis-typed field and apply a wrong default. These are the most dangerous behaviours measured:

| Route | Traps |
| --- | --- |
| `retsetshopName` | Name key is `accountName`; `shopid` must be an array. Using `shopname`/`newName` still returns `code:200 OK` but sets the environment name to an empty string. |
| `putaddlabel` | The correct body is `{ info: [ { shopid, label: [ { id } ] } ] }` and it **does** assign the label, but the environment row's `label` field stays `null`. Verify with the `browser-list` `labelids: [<labelid>]` filter (0 -> 1 -> 0), not by reading `row.label`. Flat `labelids`/`labelid`/`label` bodies return `code:200` with no effect. |
| `putalluri` | `browser.accounts.cookie` must be the string `"[]"` (or a cookie object); an array `[]` yields no usable `shopid` and the environment is not created as expected. |
| `updateDeviceProxyUserSelves` | `proxy` must be an array of proxy objects. Even with a correct array + `target_url` array + numeric `proxytype`, the route returns `{code:200, data.success:1, proxies:[{deviceid,...}]}` but re-reading `findDeviceProxyUserSelves` shows the same id set before and after (diff 0) and the echoed row carries `companyid:""`. `proxy:{...}`, `proxies:[...]`, `proxytype:"http"`, and a numeric `ipChannel` all misbehave (the last two return `401 ... Parameter type error`). |
| `createDeviceUserSelves` | Returns `code:200 ok` for empty/any body without creating a device; the working create route is `updateDeviceProxyUserSelves`. |
| `createUserPassword` / `putUserPassword` | Return `code:200 OK` without creating a credential record. |
| `account-users/update` | Returns `code:200 OK` without applying name/notes changes. |
| `deletegroups` / `delTag` | Deleting an unknown id returns `code:200 OK` (idempotent). |
| `putdeleteshop` | Unknown id returns `code:500 empty slice found`. |
| `environment-clone` | Empty body, empty id list, and unknown ids all return `code:200 OK` and create nothing. |
| `sms-setting/change` | `RenewSmsNotifyEnabled: 0` is rejected by the Go `required` validator (zero = missing); only truthy values work. |

Rule of thumb: after any write, re-read the resource. A `code:200`/`code:0` is an acceptance, not proof of a change.

## Concatenated JSON Bodies

Two plugin routes return several JSON objects concatenated into one HTTP body (a backend bug). Split on `}{` or parse greedily:

| Route | Objects | Real payload |
| --- | --- | --- |
| `plugin/group/gitPluginGroupList` | 2 | the 2nd `{"list":null,"count":1,"pageIndex":0,"pageSize":0}` |
| `plugin/group/gitGroupPluginList` | 3 | the 3rd `{code:200, data:{globalPlugin:{list,count,pageIndex,pageSize}, userPlugin:{list,count,pageIndex,pageSize}}, msg:"ok"}` |

A naive `JSON.parse` of the whole body throws. Parse the first object, then continue from the next `{`.

## Request Naming Traps

Request field names differ from the response names and between routes. Measured examples:

| Route | Correct request keys | Wrong-but-accepted / silent |
| --- | --- | --- |
| `postBatchAddUserPassword` | `{ list, kernelVersion, key }` (camelCase) | `kernel_version` -> `404`/`4013` |
| `putaddlabel` | `{ info: [ { shopid, label: [ { id } ] } ] }` | flat `labelids`/`labelid`/`label` -> `code:200` but no effect |
| `plugin/bind` | `{ accountIds, pluginId, isTeam, pluginCompanyId, accountIdsCompanyId }` | - |
| `retsetshopName` | `{ shopid: ["<id>"], accountName }` | `shopname`/`newName` -> sets name to "" |
| `updateDeviceProxyUserSelves` | `{ proxy: [ {...} ] }` | `proxy:{...}` / `proxies:[...]` -> no create |
| `putaddnotes` | `{ shopid: ["<id>"], notes }` | `remark` -> sets notes to "" |
| `delDeviceProxyUserSelves` | `{ device_ids: [...] }` | `deviceid`/`deviceId` -> `401` |
| `putdeleteauthority` | `{ company, companyid, userid, shopids, touserid }` | - |
| `putdeletegroupauthority` | `{ groupid: [...] }` | - |

`shopid` is a plain string on some routes and an array on others (the batch routes); `userid` (self) and `touserid` (target) coexist on authority routes.


## Internally Proxied Routes (Unusable Off-Network)

Some `/v2/sso/auth/*` profile writes are thin proxies to an internal service and cannot be
exercised against the public origin from outside that network. A live call returns HTTP 200
with a Go `net/http` dial error instead of a business payload.

| Route | Empty-body result |
| --- | --- |
| `POST /v2/sso/auth/setInfo` | `Post "http://192.168.0.72/sellExt/setInfo": dial tcp 192.168.0.72:80: i/o timeout` |
| `POST /v2/sso/auth/changeUserinfo` | times out on the same kind of internal hop (`ChangeUserinfoReq` struct) |

Observed request structs (from type errors, so field names are exact):

- `ChangeUserinfoReq.lastName : string` (the request mirrors `myUserinfo`: `firstName`, `lastName`, ...).
- `setNewbieStep` accepts a body and returns `{ "msg": "ok" }` for `{}`, but any field that triggers the downstream call also times out.
- `setIndustryInfo` returns `ok` for `{}` / `{ "industryId": ... }`.

Treat these as "available only inside the deployment network" rather than broken. The read
counterpart `POST /v2/sso/auth/myUserinfo` works normally and is the standard session check.

## Two Different "deviceId" Namespaces

The web surface exposes two unrelated device identifiers; do not treat them as the same value.

| Where | Example value | Shape | Meaning |
| --- | --- | --- | --- |
| `POST /v2/team/company/user/devices` -> `list[].deviceId` | `ec0f8fc23c8f9ff95ab5d509fe2c4c32` | 32-char **hex** | Registered **desktop client** device fingerprint, paired with `devName` (hostname) and `version` (client build). |
| `POST /v2/collector/track` -> `[] .deviceId` | `3rrd4gk6blk5iifkqzp2s41fyw7z20ih` | lowercase base32-style | Management-center **web** device id from `configStore.deviceId` (telemetry only). |
| `POST /v2/team/loginlogs` -> `clientId` | `ec0f8fc23c8f9ff95ab5d509fe2c4c32` | 32-char hex | **Same value as the device list `deviceId`** - joins a login to a device (9/10 login `clientId`s matched the device list). |
| `POST /v2/sso/getNewbieStep` -> parsed `data.selfDeviceId` | (empty on the tested user) | string | Self-hosted device id recorded during onboarding. |
| `POST /v2/sso/getNewbieStep` -> parsed `data.officialDeviceId` | (empty on the tested user) | string | Official/cloud device id recorded during onboarding. |
| `AppInfo` header -> `deviceId` | (sensitive) | string | Desktop client device fingerprint sent as request metadata. |

`POST /v2/sso/login` (`LoginReq`) carries **no** device id at all - only `username`, `code`, `uuid`,
`os`, `source`, `last_login_port`, `last_login_device` (a `"pc"`/`"mobile"` type string), and `cl`.
The web client adds no device header (the request interceptor sets only `Authorization` and `pay-lang`).
So the device list is not keyed off the login request; correlate rows by `devName` + `version` + `ip`.

Separately, LoginReq.cl is a **channel/clientType label** (AppInfo.channel), not a device: live probe of POST /v2/sso/login recognises cl as a string but has **no** deviceId/clientId field, and the device list has no cl/channel column. The real device id on the wire is AppInfo.deviceId.
## Non-JSON Responses (CSV Exports, Empty Bodies, Plain-Text 404)

Not every live route speaks JSON. Measured on the tested origin:

| Route | Method | Response |
| --- | --- | --- |
| `/v2/proxy/device/findRandDeviceList` | POST | `200` with a **zero-byte body** and no content type. The empty body is the success signal. |

Nine client routes answer `404` with an 18-byte `text/plain` body `404 page not found`, which means the
route is simply not registered on this origin (it is not an auth or parameter failure):

`/v2/check/checkproxy`, `/v2/proxy/device/list`, `/v2/newbrowser/getgeneraIPidealproxyinfo`,
`/v2/newbrowser/transfershopauthoritystocompanyid`, `/v2/newbrowser/getallmessage`,
`/v2/newbrowser/getreadmessage`, `/v2/newbrowser/world/getUserExpiredTime`,
`/v2/newbrowser/world/shareShop`, `/v2/newbrowser/world/closeShareShop`.

The `/api/*` legacy prefix is a separate case: it returns nginx `405 Not Allowed` HTML for POST and a
fixed 2053-byte SPA shell for GET. Twenty-five cataloged `/api/*` GET routes therefore all return the
identical document, so those routes are not JSON APIs at all.