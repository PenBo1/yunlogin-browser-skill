# Server API Parameter Matrix

This document records the observed effect of each documented request parameter, measured with a live bearer token against `https://d126447d359e70c0.yunlogin.com` on 2026-10-09. It complements the per-endpoint field reference in `endpoints/`.

Values below are observed behaviour, not a specification. Treat `code: 200` as "accepted", not as "the parameter did
what the name suggests"; several filters are silently ignored.

**Two test accounts were used during this research**, so row counts differ between sections - an earlier snapshot held
thousands of environments and the later one holds a handful. The behaviour (which values filter, which are ignored,
which only type-check) is the contract; every count and serial number is an illustration from one snapshot.

## How The Matrix Was Built

`scripts/dev/sweep-params.mjs` ran 97 read-only parameter cases (a baseline plus per-field variations) and wrote every raw response to a temp directory. Counts were compared case-by-case. Mutation endpoints were exercised separately as create/verify/delete round trips.

## Environments

### `browser-list` (`POST /v2/newbrowser/getconditionshops`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `companyid` | live company | Required. Injected identity is accepted. |
| `userid` | live user | Required. Injected identity is accepted. |
| `groupid` | real group, `""` | Filters to the group (19 KB vs 165 KB). Empty returns everything. |
| `shopname` | `"148"`, `"zzz-no-such-xyz"` | Substring name filter. `"148"` matched most rows; a no-match value returned an empty `shop`. |
| `serial` | `1`, `0` | Exact serial filter. `1` returned empty; `0` returned all. |
| `sortorder` | `12` | Sort order; `12` is the catalog default. |
| `remark` | `""` | Notes filter; not triggered in this sweep. |
| `label` | `""` | Tag display filter. |
| `authoritiesUserid` | `[]` | Authorization-user filter. |
| `labelids` | `[real tag]`, `[]` | Tag filter. A shop with no tags returns an empty `shop`. |
| `enable` | `0`, `1` | **Ignored on this account.** Both returned the full 165 KB set. |
| `offer` | `1` | Accepted; response grew by 6 bytes versus baseline. |
| `number` | `1`, `100`, `0` | Page size. `1` returns one row; `0` returns an empty `shop` while `allshopnumb` still reports 3512. |
| `browserid` | `[real shop]` | ID filter; returns exactly that environment. |
| `self` | `true` | Accepted; same result as baseline. |
| `transfers` | `true` | Empty `shop` (no transferred rows). |
| `share` | `true` | Empty `shop` (no shared rows). |
| `authorities` | `true` | Empty `shop` (no authorized rows). |
| `open_by_others` | `false` | Accepted. |
| `create_by_others` | `false` | Accepted. |

### `fingerprint-uri` (`POST /v2/newbrowser/getfingerprinturi`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `shopid` | real environment | Returns `browseinfo` (the environment template body) plus `defaultfingerprint` (the fingerprint block). An unknown ID returns an empty template. |

### `fingerprint-defaults` (`POST /v2/newbrowser/getdefaultfingerlist`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `system` | `Windows`, `MacOS`, `Linux` | Selects the OS preset family. |
| `kernel` | `chrome`, `firefox` | Selects the kernel preset family. |
| `kernelVersion` | `121`, `120` | Selects the version family. |

Observed response keys: `system`, `kernelversion`, `Firefoxkernelversion`, `UAversion`, `FirefoxUAversion`, `language`, `zone`, `dpi`, `widowssize`, `webgl`, `cpu`, `mem`, `platformKernelversion`. Response size depends on the combination: Windows/chrome 37 KB, MacOS/chrome 37 KB, Linux/firefox 54 KB.

### `version-core` (`POST /v2/team/version/getCore`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `appVersion` | `4.0.3.7` | Client version telemetry. |
| `versionCode` | `4000307` | Numeric version telemetry. |
| `bitness` | `64` | Client bitness. |
| `platform` | `windows` | Client platform. |
| `browser` | `chrome`, `firefox` | **Selects the kernel family.** `chrome` returned 9.6 KB of builds; `firefox` returned 663 bytes. |
| `deviceId` | test value | Telemetry; stored, not echoed. |
| `mac` | `""` | Telemetry; never send a real MAC. |
| `computerName` | `""` | Telemetry; never send a real host name. |
| `channel` | `""` | Distribution channel. |
| `appId` | `yunlogin` | Application identifier. |

### `latest-open-environments` (`POST /v2/newbrowser/getLatestOpenAccountIdList`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `num` | default, `3` | Limits the returned `data.accountIds` length (`3` returned three IDs). |

## Accounts And Credentials

### `account-list` (`POST /v2/newbrowser/getUserPasswordList`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `name` | real `"yyy"`, no-match | Exact record-name filter. No-match returns `total: 0`, `list: null`. |
| `user_name` | `""` | Username filter. |
| `remark` | `""` | Notes filter. |
| `platform_name` | `"tiktok"` | Platform filter; returned 8 rows. |
| `page` | `1`, `2` | Page number. |
| `pageSize` | `1`, `100` | Page size. `1` returns one row. |
| `platformLock` | `1`, `-1` | `1` returned a locked-only subset (2.4 KB vs 18 KB). |
| `bind` | `0`, `1`, `-1` | `1` bound-only (5.7 KB), `0` unbound-only (12.4 KB); the two partition the baseline. |

### `bound-account-detail` (`POST /v2/newbrowser/getBindUserPassword`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `user_password_id` | real record, unknown record | Real record returns `shopinfo` rows and `total`; unknown returns `shopinfo: null`, `total: 0`. |
| `pageSize` | `20` | Page size for the bound environments. |

### `account-users-get` (`POST /v2/newbrowser/account-users/get`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `accountIds` | two real shops, `[]`, unknown | Always `code: 200` with `data: []` on this account. Empty is not an error. |

## Proxies

### `proxy-self-list` (`GET /v2/proxy/device/findDeviceProxyUserSelves`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `status` | `1`, `0` | `1` returns rows; `0` returns an empty list. |
| `trademark` | `self` | Required category marker. |
| `page` / `per_page` | `1`/`1`, `2`/`1` | Pagination works; each page returned one row. |
| `company` | `""` | Company display filter. |
| `companyid` / `userid` | live identity | Required. |
| `proxy_type` | `""` | Proxy-type filter. |
| `ip_type` | `""` | IP-type filter. |
| `detect_result` | `""` | Detection-result filter. |
| `name` | no-match | Name filter; no-match returns an empty list. |
| `ip` | `""` | IP filter. |
| `serial` | `1` | Exact serial filter; `1` returned empty. |

### `proxy-dynamic-list` (`GET /v2/proxy/device/findDeviceDynamicProxies`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `status` | `0`, `1` | Default `0` returns rows; `1` returned an empty list. |
| `trademark` | `general` | Required category marker. |
| `page` / `per_page` | default, `1` | Pagination works. |
| `userid` / `companyid` | live identity | Required. |
| `ip_type` | `""` | IP-type filter. |
| `inspect` | `""` | Inspection filter. |
| `serial` | `""` | Serial filter (string here, number on the self route). |
| `name` | `""` | Name filter. |

### `proxy-cloud-list` (`GET /v2/proxy/device/vcnplist`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `page` / `per_page` | `1`/`20`, `1` | Pagination accepted. |
| `device_name` | `""` | Name filter. |
| `publicip` | `""` | Public-IP filter. |
| `status` | `0`, `1` | Accepted; this account owns no cloud devices, so both returned an empty list. |
| `userid` / `companyid` | live identity | Required. |

### `find-devices` (`POST /v2/proxy/device/findDevices`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `device_ids` | `[]`, `[real self device]` | Device filter. Empty returns `data: null`. |
| `trademark` | `official`, `self` | **Selects the row schema.** `official` returns cloud-device rows; `self` returns self-proxy rows. |

### `proxy-tag-list` (`GET /v2/proxy/device/findTags`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `page` / `per_page` | `1`/`10000`, `1` | Pagination works. Default `per_page` is 10000. |
| `companyid` / `userid` | live identity | Required. |

### `proxy-device-logs` (`GET /v2/proxy/device/findDeviceLogs`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `device_id` | real device | Accepted; this account has no device logs, so the list stayed empty. |

## Team, Logs, Notices

### `team-members` (`POST /v2/team/getMembers`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `pageSize` / `pageIndex` | `1`/`1` | Pagination works. |
| `leave` | `0`, `1` | `0` returns active members; `1` returned empty (no left members). |

### `team-roles` (`POST /v2/team/roles`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `pageIndex` / `pageSize` | `1`/`1`, default | Pagination works; default page size is 999. |

### `team-login-logs` (`POST /v2/team/loginlogs`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `pageIndex` / `total` / `pageSize` | `1`/`0`/`1` | Pagination works. |

### `auth-log-permissions` (`POST /v2/logs/auth/perms`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `pageIndex` / `total` / `pageSize` | `1`/`0`/`1`, default | Pagination works. |

### `auth-log-options` (`POST /v2/logs/auth/options`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `pageIndex` / `total` / `pageSize` | `1`/`0`/`1`, default | Pagination works. The account reported `count: 145674` unfiltered rows. |

### `user-notices` (`POST /v2/message/user-notice/my`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `noticeType` | `0`, `1` | Category filter. `0` returned the default notice list; `1` returned a smaller set. |
| `page` / `pageSize` | `1`/`1` | Pagination works. |

### `rpa-plan-list` (`POST /v2/rpa/getRpaPlanManagementList`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `userId` | live user | Owner filter. |
| `executeType` | `0` | Execution-type filter. |
| `accountIds` | `[real shop]` | Environment filter. Returned an empty list on this account. |

### `transfer-shop-list` (`POST /v2/newbrowser/transferShopList`)

| Field | Tested | Observed effect |
| --- | --- | --- |
| `page` / `pageSize` | default | Pagination. |
| `name` | no-match | Name filter. |
| `ip` | `""` | IP filter. |
| `companyid` | `""` | Company filter. |

## Settings And Miscellaneous

| Endpoint | Field | Observed effect |
| --- | --- | --- |
| `auth-shop-brief-list` | `page`, `pageSize`, `name`, `groupid` | Pagination and name filter; a no-match name returns an empty row set (`data` only). |
| `server-group-list` | `name` | Name filter; no-match returns a minimal body with no `group` array. |
| `custom-platform-list` | `company`, `companyid`, `userid` | Required identity; returns the account's own custom platforms. |
| `settings-contact` | `key=setting.contact` | Returns the contact entries under `data.value`. |
| `settings-qrcode` | `key=setting.qrcode` | Returns the QR-image entries under `data.value`. |
| `team-invite-code` | `reset` | `reset` rotates the invitation code (mutation). Read-only without it. |
| `plugin-list` | none | Returns `distributionPlugin` and `globalPlugin` arrays (both empty on this account). |
| `platform-class-tree` | none | Returns `fatherclass[]`; `childclass`/`grandsonclass` were null until a platform is selected. |
| `platform-catalog` | none | Returns the flat platform catalogue (135 KB). |


## Full-Surface Query-Parameter Discoveries (2026-10-09)

Beyond the curated 54 endpoints, the full 507-route sweep surfaced routes that answer only when a
**query parameter** is supplied. Getting `code: 7` (`msgCode: 7`, `data: {}`) from these routes means
"missing parameter"; the `msg` names the missing field.

| Route | Method | Required query | Success shape |
| --- | --- | --- | --- |
| `/v2/retail/checkPromotionCode` | GET | `code` | `{ code: 200, data: { available: bool, reason: string }, msg: "ok", requestId: "" }`. An unknown code returned `available: true`. Empty `code` returns `{ code: 7, msg: "code不能为空" }`. |
| `/v2/plugin/group/getPluginGroupId` | GET | `groupId` | `{ code: 200, data: { groupInfo: {...}, groupPlugin: null }, msg: "ok", requestId: "1" }`. |
| `/v2/plugin/updateTeamVisibilityJurisdiction` | GET | `pluginId` | `{ code: 200, data: { teamStatus: 0 }, msg: "ok", requestId: "" }`. |

`getPluginGroupId.groupInfo` is a mixed-case Go struct: capital `ID`, `CreatedAt`, `UpdatedAt`, then
lowerCamel `groupId`, `companyId`, `userId`, `groupName`, `isGlobal`, `groupType`, `remark`. An
unknown `groupId` returns the zero value (`ID: 0`, empty strings), not an error.

### Cloud-accounts reads (`/v2/newbrowser/cloud-accounts/*`)

These back the cloud-browser feature. Several answer without extra parameters:

| Route | Result |
| --- | --- |
| `POST .../popup/get` | `{ reqId, code: 200, msg: "OK", data: { count } }` - number of cloud popups. |
| `POST .../free/shop/get` | `{ ..., data: { accountId, oid } }` - the free cloud shop identifiers. |
| `POST .../num-vis` | `{ ..., data: { total, running, expireInWeek } }` - instance counters. |
| `POST .../finger/get` | `{ code: 200, browseinfo: {...}, defaultfingerprint: {...} }` - a cloud creation template (126 field paths). Same `browseinfo`/`defaultfingerprint` shape as `fingerprint-uri`. |

The list/token routes proxy to an upstream cloud-browser service that is not reachable from this
origin: `page` and `client-num/get` return `{ code: 500, msg: "请求云浏览器实例列表接口失败" }`, and
`open/token/get` returns `{ code: 500, msg: "请求云浏览器换取token接口失败" }`. These are upstream
failures, not parameter problems.

### Plugin / retail `code: 7` family

`code: 7` with `data: {}` is this surface's generic "missing parameter" code (distinct from `4009`).
`downloadFromWebStore` needs `url` and then actually attempts a download (the probe timed out);
`accountGroupList` and `bindGrouopPlugin` return `缺少必要参数` / `empty slice found`.

## Additional Route Findings (2026-10-09, batch 2)

| Route | Required input | Observed |
| --- | --- | --- |
| `POST /v2/message/user-notice/getNotice` | `id` (from `user-notice/my`) | `{ reqId, code: 200, msg: "OK", data: { id, title, content, type, noticeType, op, opId, status, createdAt, reminderStatus } }`. `createdAt` is a Unix second timestamp (for example `1790240123`); `op` names the deep-link action (for example `DeviceFailIdv2`). An unknown `id` returns `{ code: 500, msg: "record not found" }`. |
| `GET /v2/cost/costmanagement/getDynamicAgent` | `vtype_type` | `{ code: 200, msgCode: 200, data: null, msg: "ok", traceId }`. `data` is `null` on the tested account (no dynamic agents); omit `vtype_type` and the server returns `{ code: 401, msg: "缺少主要参数" }`. |

### RPA carbon-config family (unavailable on this account)

`GET /v2/rpa/getRpaCarbonConfigList`, `GET /v2/rpa/findRpaCarbonConfig?configId=`,
`GET /v2/rpa/recycleRpaCarbonConfig`, `POST /v2/rpa/copyRpaCarbonConfig`, and
`PUT /v2/rpa/topRpaCarbonConfig` all return `{ code: 50004, msgCode: 500, data: {}, msg: "获取失败" }`
regardless of the parameters supplied. This is a feature-availability failure for the tested
account, not a wrong-parameter error. `GET /v2/rpa/getRpaGroupList` works and uses the `code: 0`
envelope: `{ code: 0, msgCode: 200, list: [], count: 0, pageIndex, pageSize }`.

## Additional Route Findings (2026-10-09, batch 3)

| Route | Method | Required input | Observed |
| --- | --- | --- | --- |
| `/v2/proxy/authority/get` | GET | `proxyType` (`1`/`2`); optional `deviceId` | `{ code: 200, msgCode: 200, data: { proxyType, deviceId, authorityList }, msg: "ok" }`. Without `proxyType` it returns `{ code: 401, msg: "代理类型错误" }`. `authorityList` is `null` when the device has no explicit grants. |
| `/v2/proxy/authority/syncNoAutoAuthority` | POST | `companyId` | `{ code: 200, msgCode: 200, data: {}, msg: "ok" }`; idempotent and also accepts `{}`. |
| `/v2/proxy/authority/deal` | POST | `{ proxyType, companyId, deviceIds, userIds, content }` (from the client call site) | An empty grant list returns `{ code: 401, msg: "DealAuthority is empty" }`; a real grant needs existing `deviceIds`. Not round-tripped (no self-proxy device exists to grant). |
| `/v2/newbrowser/transfershopauthoritystocompanyid` | POST | - | HTTP 404 `page not found` on this origin (not served). |

`/v2/proxy/authority/get` and `/v2/proxy/authority/deal` are the **proxy** authority pair; the
environment authority pair is `/v2/newbrowser/putusershopauthority` + `/v2/newbrowser/putdeleteauthority`
(see WRITE_ROUNDTRIPS.md). Do not confuse the two families.

## Additional Route Findings (2026-10-09, batch 4)

| Route | Method | Required input | Observed |
| --- | --- | --- | --- |
| `/v2/admin/device/third-proxy/page` | POST | `{}` | `{ code: 200, msg: "OK", data: { list: [ { id, proxyName, proxyType, tags, img, link, desc, status, createdAt, updatedAt } ], total, pageSize, currentPage } }`. `desc` is HTML (`<p><br></p>`), `status: 2` is active. |
| `/v2/admin/device/third-proxy/get` | POST | `id` (the numeric row id) | `{ code: 200, msg: "OK", data: { id, proxyName, proxyType, tags, img, link, desc, status, createdAt, updatedAt } }`. Sending `uuid`/`proxyId`/`ids` returns `{ code: 500, msg: "record not found" }`. |
| `/v2/team/sidebar/update` | POST | `{ menus }` where `menus` is a JSON **string** | `{ requestId, code: 200, msg: "ok", data: "" }`; the stored value is visible in `sidebar/get`. Round-tripped. |
| `/v2/plugin/group/accountGroupList` | GET | `accountId` | With a plain environment id it returns `{ code: 7, msg: "record not found" }`, so the id is not the environment `shopid`; the shape is `{ code: 200, data: { globalPlugin: { list }, userPlugin: {...} } }` per the client call site. |

## Cost / Order Reads (2026-10-09, batch 5)

The order reads were stuck on `4009 请求参数错误` because no order id was supplied. Listing the orders first provides the required `order_no` / `oid` / `details_no`.

| Route | Method | Required input | Observed |
| --- | --- | --- | --- |
| `/v2/cost/costmanagement/getOrderManagementNew` | GET | `pageIndex`, `pageSize` | `{ code: 200, msgCode: 200, data: { data: [ ...orders ], ... } }`. **Rows are under `data.data`, not `data.list`.** Each order row has 46 keys including `order_no`, `oid`, `order_type`, `order_status`, `pay_status`, `final_amount`, `bundle_id`, `device`, `order_detail`, `order_detail_all`. |
| `/v2/cost/costmanagement/getOrderDetailNew` | GET | `order_no` **or** `oid` | `{ code: 200, msg: "ok", data: {...} }` with the same 46 order keys; `order_detail_all[]` adds 48 keys (`details_no`, `bundle_info`, `device_type`, `region`, `cidr_blocks`, `cloud_browser_products`, ...). |
| `/v2/cost/costmanagement/getOrderDetailByDetailsNo` | GET | `details_no` (`<order_no>-1`) | Same full order detail payload. |
| `/v2/cost/costmanagement/getOrderDetailNewByMultiple` | POST | `{ oids: [], details_nos: [] }` | `{ code: 200, msgCode: 200, data: [ {...}, ... ] }` - one detail per input id. |
| `/v2/cost/device/findorder` | GET | `order_no` | `{ code: 200, data: { orderStatus, payInfoData: { amount, orderAmount, orderNumber, payTime, payType, time }, status: "TRADE_SUCCESS" } }`. |
| `/v2/cost/costmanagement/getOrderDetailStatus` | POST | unknown | Still `4009 请求参数错误` for `order_no`, `oid`, `oid`+`details_no`, `details_nos[]`, `orderNos[]`, `status`, `type`, `ids[]`. Not derivable from the client bundle (no call site). |

Key shapes: `order_detail_all[].details_no` is `"<order_no>-<n>"` (for example `YLTC0015-1`). Status strings seen: `TRADE_SUCCESS`; numeric `order_status`/`pay_status`/`orderStatus` accompany the text fields.

## Additional Route Findings (2026-10-09, batch 6)

| Route | Method | Required input | Observed |
| --- | --- | --- | --- |
| `/v2/proxy/device/dynamics/userinfo` | POST | `vtype` (string) | `{ code: 200, msgCode: 200, data: null, msg: "ok", traceId }` when the user has no active dynamics package. A numeric `vtype` returns `401 RequestDynamics.vtype Parameter type error`. |
| `/v2/proxy/device/dynamics/in/userPkg` | POST | `vtype` (string, `"socks5"`/`"http"`) | `{ code: 200, msgCode: 200, data: { order_id, package_name, id, package_balance, package_all, start_time, expire_time, min_time, max_time, create_time, init_start_time }, msg: "ok" }`. Reads the customer's dynamics package; all zero values mean no package. |
| `/v2/proxy/device/dynamics/proxy` | POST | `{ city, username, instance_id, num }` (from the client call site) | `{ code: 4011, msg: "获取失败" }` - depends on a live dynamics provider that is not reachable for this account. |
| `/v2/newbrowser/getfingerprinturiua` | POST | - | `{ code: 403, msg: "暂无访问权限" }` - feature/permission gated on this account. |
| `/v2/newbrowser/putOpenUrl` | POST | - | `{ code: 4011, msg: "unknown error" }` - needs a live environment/session. |

`userPkg` and `userinfo` both take `vtype` as a **string**; both reject a numeric `vtype` with a `Parameter type error`.

## Additional Route Findings (2026-10-09, batch 7)

These routes returned only an envelope with the generic probe body; supplying the real id reveals row data.

| Route | Method | Required input | Observed |
| --- | --- | --- | --- |
| `/v2/team/member/ids` | POST | `userIds` (string array) | `{ requestId, code: 200, msg: "查询成功", data: [ { id, userId, companyId, deptId, username, name, ... } ] }` - one row per requested member. |
| `/v2/team/company/ids` | POST | `ids` (string array) | `{ ..., data: [...] }` - company rows; an unknown id returns an empty `data` array (not an error). |
| `/v2/team/role/members` | POST | `id` (**string**, not number) | `{ ..., data: [ ...members ] }`. A numeric `id` returns `500 json: cannot unmarshal number into Go struct field IdReq.id of type string`; a role with no members returns `data: []`. |
| `/v2/newbrowser/getShopAndAuthList` | POST | `shopid` (**string array**) | `{ code: 200, accountIds: [ ... ] }` (top-level `accountIds`, no `data` wrapper). A string `shopid` returns `500 ... GetRPA.shopid of type []string`. |
| `/v2/newbrowser/getiduserlist` | POST | `deviceid` (**string array**) | `{ code: 200, device: [], self, ipideaself, shutiaoself, general }`. A string `deviceid` returns `500 ... GetProxyNumb.deviceid of type []string`. |
| `/v2/newbrowser/getgroupusers` | POST | `groupid` (string) | `{ code: 200, userlist: null }` when the group has no members. |

Type summary for this batch: `role/members.id` is a **string**, while `getShopAndAuthList.shopid` and `getiduserlist.deviceid` must be **arrays** even for a single value.

## Additional Route Findings (2026-10-09, batch 8)

| Route | Method | Request struct (from Go errors) | Observed with `{}` |
| --- | --- | --- | --- |
| `/v2/team/role/change` | POST | `ChangeRoleReq`: `id` is **int**, `rightIds` is **string** (comma-separated permission ids) | `{ code: 10012, msg: "至少选择一项权限" }` - needs `rightIds` |
| `/v2/team/role/great` | POST | `GrantRoleMemberReq`: `RoleId` is **string**, `userIds` is `[]string` | `{ code: 500, msg: "参数错误" }` |
| `/v2/team/dept/create` | POST | - | `{ code: 200, msg: "创建成功" }` - **creates an empty-name department even for `{}`** |
| `/v2/team/dept/del` | POST | `{ id }` | `{ code: 200, msg: "删除成功" }`; `{ deptId }` returns `10017 无权删除` |
| `/v2/team/member/move` | POST | - | `{ code: 200, msg: "查询成功" }` for `{}` (no move applied) |

`getDepts` returns a tree keyed by `deptId` / `departmentName` / `pid` / `children` (not `id` / `name`).

Warning: `role/change.id` is an **int** while `role/great.RoleId` is a **string** - two similar role routes use different id casing and types.

## Additional Route Findings (2026-10-09, batch 9)

### `POST /v2/collector/track` (web telemetry)

Captured live from a management-center session (2026-10-09). The body is a **JSON array of event objects**, not a single object:

| Field | Type | Meaning |
| --- | --- | --- |
| `eventType` | string | `Click`, `PageView`, ... |
| `eventId` | string | Action id (for example `home_menu_pluginManage`); empty for page views. |
| `elementId` | string | Clicked element id; empty for page views. |
| `sessionId` | string | Session id; empty in the captured events. |
| `eventTime` | number | Event time in ms epoch. |
| `closeTime` | number | Page-view end time in ms epoch; `0` for clicks. |
| `pageId` | string | Current page (for example `home_header`, `/setup`). |
| `lastPageId` | string | Previous page. |
| `appId` | number | `1`. |
| `appType` | string | `web`. |
| `deviceId` | string | Web device id from `configStore.deviceId` (see RESPONSE_SHAPES.md - a different id space from the device list). |
| `appVersion` | string | Management-center version (for example `3.0.0.9`). |
| `os` / `osVersion` | string | For example `Windows` / `WIN10_22H2`. |
| `userId` / `companyId` | string | Actor ids. |

This is a fire-and-forget telemetry write; the read-only sweep skips it. The same payload shape is reused for error reports (`/v2/tg/r/error`) and the client-side `sendManualClickTrackData` helper.

## Additional Route Findings (2026-10-09, batch 10)

| Route | Method | Request struct | Observed |
| --- | --- | --- | --- |
| `/v2/team/company/user/updatePackageStatus` | POST | Shares `GrantRoleMemberReq`: `companyId` (string), `userIds` (`[]string`), `RoleId` (string) | `{}` -> `{ code: 500, msg: "GetPackage fail" }`. The same struct backs `/v2/team/role/great`, so the two routes are the "assign role/package to members" pair. Both need a real `RoleId` + `userIds`; not exercised because that would change seat/package assignment. |

## Additional Route Findings (2026-10-09, batch 12)

| Route | Method | Input | Observed |
| --- | --- | --- | --- |
| `/v2/newbrowser/getshopconfigrpa` | POST | `shopid` (**string array**) | `{ code: 200, msg: "Success", shopconfig: [ { shopid, remark, name, user, passwd, cookies, serial, kernelVersion, kernel, kernelId, system, userPasswordPlatforms } ] }`. Uses the shared `GetRPA` struct (`shopid []string`), same as `getShopAndAuthList`. A string `shopid` returns `500 ... GetRPA.shopid of type []string`. |
| `/v2/newbrowser/getCookie` | POST | `shopid` (**string**) | `{ reqId, code: 200, msg: "OK", data: "<cookie json string>" }`. An array `shopid` returns `500 SerialInfo.shopId of type string`. |
| `/v2/newbrowser/setCookie` | POST | `shopid` (**string array**), `cookies` as a **JSON string** | A string `shopid` returns `500 SetShop.shopid of type []string`; an array `cookies` returns `500 unexpected end of JSON input`. |

Type trap: `getCookie` and `setCookie` use **opposite** `shopid` shapes - string for the read, string-array for the write - even though they are a read/write pair on the same field name.

## Additional Route Findings (2026-10-09, batch 13)

| Route | Method | Required input | Observed |
| --- | --- | --- | --- |
| `/v2/sso/getNewbieStep` | GET | `userId` (query) | `{ requestId, code: 200, msg: "ok", data: { id, userId, data, step, skip, createdAt, updatedAt } }`. Without `userId` it returns `{ code: 10006, msg: "未登录" }`. The tested user had `step: 2`, `skip: 1`. |

`data` is a **JSON string** (parse it again) mapping the onboarding/attribution state:
`{ auth, cloudId, orderNo, activity, couponNo, accountId, platformId, platformType, selfDeviceId, officialDeviceId, startBrowserTime }`.

Note the extra device-id namespaces here: `selfDeviceId` (self-hosted device) and `officialDeviceId`
(official/cloud device) are distinct from the desktop `deviceId` (device list) and the web
`deviceId` (telemetry). See RESPONSE_SHAPES.md.

## Additional Route Findings (2026-10-09, batch 14)

| Route | Method | Required input | Observed |
| --- | --- | --- | --- |
| `/v2/team/company/info` | POST | **`id`** = the company id (NOT `companyId`/`companyid`) | Returns the same company profile as `curCompanyInfo`: `{ id, companyId, name, shortName, onwer, status, lockStatus, invite, avatar, lockAt, createdAt, updatedAt, updateBy }`. `{ companyId }` returns `{ code: 500, msg: "团队不存在" }`. |

The tested user owns two companies; both resolve through `{ id }`:

| company id | name |
| --- | --- |
| `e7de49052df74494bbdb8ed545950b7f` | 测试环境-123456团队 |
| `9653750579574ab0ae9e9a9623ccc978` | 测试环境-123456团队-002 |

Note the param-key trap: `team/company/info` wants `id`, while most other team routes want `companyid`/`companyId`.

## Additional Route Findings (2026-10-09, batch 15)

| Route | Method | Input | Observed |
| --- | --- | --- | --- |
| `/v2/team/company/getApprovals` | POST | `{ pageSize, pageIndex }` | `{ count, pageIndex, pageSize, list: [ ... ] }`. Row: `id, approvalId, userId, companyId, deptId, departmentName, roleSlug, inviteCode, contact, username, email, name, avatar, approvalStatus, inviteUid, inviteName, refuseType, refuse, adminId, adminName, createdAt, updatedAt`. Tested company returned 10 rows (all `approvalStatus: 2`). |
| `/v2/team/access/approvals` | POST | `{ pageSize, pageIndex }` | Same envelope; returned 0 rows. |
| `/v2/team/company/approveMember` | POST | `ApproveUserReq`: `approvalId` (string), `approvalStatus` (int), `refuseType` (int), `deptId` (string) | `{}` -> `{ code: 500, msg: "查看对象不存在或无权查看" }`. Not exercised (it approves/rejects a real pending join request). |

`approveMember` is the write side of the `getApprovals` list: pass a row's `approvalId` with `approvalStatus` (and `refuseType`/`deptId`). Because it changes company membership, it was left unexecuted; the request struct was confirmed by field-type probing (`ApproveUserReq`).

## Where To Get `companyId` (2026-10-09)

`POST /v2/sso/auth/myUserinfo` returns **no** `companyId` field - only `userId`, `username`,
`mobile`, `email`, `firstName`, ... `. `data.companyId` is therefore `undefined`; feeding it into
another request silently sends an empty `companyid`.

Get the company id from one of:

- the bearer token's JWT `iss` claim (the server identity helper uses this),
- `POST /v2/team/curCompanyInfo` -> `data.companyId`,
- a row of `POST /v2/team/myCompanies` -> `companyId`.

The tested user owns two companies (`e7de49052df74494bbdb8ed545950b7f` and
`9653750579574ab0ae9e9a9623ccc978`).

## Environment Recycle Bin (2026-10-09, batch 16)

| Route | Method | Input | Observed |
| --- | --- | --- | --- |
| `/v2/newbrowser/getrecycleshoplist` | POST | `{ categoryId, accountName, page, pageSize, transfers, companyid, userid }` | `{ reqId, code: 200, msg: "OK", data: { list, total, pageSize, currentPage } }`. Row: `account_id, account_name, category_id, platform_id, nick_name, tag_ids, remark, delete_by, deleted_at, ...` (note the `account_*` names, not `shopid`/`name`). |
| `/v2/newbrowser/putrestoreshop` | POST | `{ shopid: []string }` | Restores a deleted environment back to the active list. `shopid` must be a **string array** (an object returns `500 SetShop.shopid of type []string`). |
| `/v2/newbrowser/putdeleteshopfromrecycle` | POST | `{ shopid: []string }` | Permanently purges the recycle rows. Verified `code: 200 OK` and the list went 2 -> 0. |

Cleanup note: two recycle-bin environments remained from earlier clone round trips
(`4334-148-克隆-1`, `148_19`, both `delete_by` the tested user, deleted 2026-10-09 11:34-11:42).
They were purged this run. A recycle row uses `account_id` (not `shopid`) as its identifier.

## Additional Route Findings (2026-10-09, batch 17)

| Route | Method | Request struct (from Go errors) | Observed with `{}` |
| --- | --- | --- | --- |
| `/v2/team/select/company` | POST | `SelectCompanyReq.id` (**string**) | `{ code: 500, msg: "ReMsg code:{500} already exist" }` |
| `/v2/team/role-group/del` | POST | `ReqIds.ids` (**[]int**) | `{ code: 500, msg: "WHERE conditions required" }`. Note the id array is **ints**, unlike most other id arrays which are strings; the working shape is `{ ids: [1,2] }`, not `{ id }`. |
| `/v2/team/role-group/update` | POST | `RoleGroupDto.id` (**int64**), `name` (**string**) | `{}` returns `200 OK` (zero id = no-op) |

Type summary: this cluster mixes id types - `select/company.id` is a string, `role-group/del.ids` is `[]int`, and `role-group/update.id` is an int64.

## Plugin Write Structs (2026-10-09, batch 18)

Field types read from Go decode errors; the plugin routes were **not** executed because the plugin
surface has no delete route (see WRITE_ROUNDTRIPS.md "Known Unremovable Residue").

| Route | Method | Go struct | Fields (name : type) |
| --- | --- | --- | --- |
| `/v2/plugin/group/addPluginGroup` | POST | `PluginGroupARequest` | `groupId : string`, `pluginCompanyId : string` |
| `/v2/plugin/group/copyPluginGroup` | POST | `PluginGroupCopyRequest` | `groupId : string` |
| `/v2/plugin/group/updatePluginGroup` | PUT | `PluginGroupRequest` | `groupId : string`, `remark : string`, `pluginCompanyId : []string` |
| `/v2/plugin/bindGrouopPlugin` | POST | `PluginCompaniesBathRequest` | `groupId : []string`, `accountIds : []string`, `kernel : int` |
| `/v2/plugin/updateTeamVisibility` | POST | `PluginCompaniesDeleteRequest` | `isTeam : int` |
| `/v2/plugin/updateGlobalVisibility` | POST | `PluginCompaniesDeleteRequest` | `pluginCompanyId : string` |
| `/v2/plugin/bind` | PUT | `PluginCompaniesCreateRequest` | `accountIds : []string`, `pluginId : string`, `isTeam : int`, `pluginCompanyId : string`, `accountIdsCompanyId : []string` |

Empty-body results: `addPluginGroup` -> empty (no-op), `copyPluginGroup` -> `30005 创建失败`,
`updatePluginGroup` -> `code: 7 Error 3144 ... CHARACTER SET 'binary'`, `bindGrouopPlugin` -> `code: 7 empty slice found`,
`updateTeamVisibility`/`updateGlobalVisibility`/`bind` -> `ok` (lenient no-ops with `{}`).

`pluginCompanyId` is a **string** on `bind`/`updateGlobalVisibility` but a **[]string** on `updatePluginGroup` - the same field name has different types across the plugin routes.

## Order / Device Write Structs (2026-10-09, batch 19)

These routes report `4009 请求参数错误` with a custom `... Parameter type error` message, so types were
resolved by sending a string / number / array for each field.

| Route | Go struct | Fields (name : type) |
| --- | --- | --- |
| `/v2/proxy/device/resetname` | `DeviceBatchRequest` | `device_type : number`, `device_id : string`, `name : string` |
| `/v2/cost/device/pay_scan` | `OrderPayRequest` | `pay_type : string`, `pay_type_extra : number`, `amount : number`, `order_no : string` |

`resetname` (rename a proxy device) and `pay_scan` (create a payment QR) were **not executed** - renaming
would touch the account's proxy rows and `pay_scan` starts a paid order. Other order routes
(`create_order`, `create_renew`, `cancel_order`, `batch_create_order`, `batchautorenew`, `redeemed`)
return `4009` with no field recognised for the common candidate names, so their bodies use map/interface
values that do not surface in decode errors; they were left unexecuted (billing).

## Environment Labels Resolved (2026-10-09, batch 20)

`putaddlabel` **does work** - the earlier "no visible effect" was a wrong verification field.

Full round trip (tag `9a282607...` / `codex-label2-*`, colour `5`):

| Step | Call | Observation |
| --- | --- | --- |
| create tag | `POST /v2/proxy/device/updateTag { companyid, userid, label, color: <number> }` | row appears in `findTags` under `data.data` with `name` = `label`, `color` = number |
| baseline | `POST /v2/newbrowser/getconditionshops { labelids: [<labelid>] }` | `0` rows |
| assign | `POST /v2/newbrowser/putaddlabel { info: [ { shopid, label: [ { id: <labelid> } ] } ] }` | `{ reqId, code: 200, msg: "OK" }` |
| verify | same `labelids: [<labelid>]` filter | **`1` row** - the environment now matches the label filter |
| clear | `POST /v2/newbrowser/putaddlabel { info: [ { shopid, label: [] } ] }` | `code: 200 OK` |
| verify cleared | `labelids: [<labelid>]` | `0` rows |
| delete tag | `POST /v2/proxy/device/delTag { companyid, labelid: [<labelid>] }` | `code: 200 ok`; list returned to its original count |

Key: the environment's own `label` **field stays `null`** even when the label is applied. Verify label assignment
with the `labelids` **filter**, not by reading `row.label`. `color` must be a **number** (a string returns
`401 Label.color Parameter type error`), and `findTags` rows live under `data.data` with the name in `name`.

## `userapi/user/update` Round Trip + Rate Limit (2026-10-09, batch 21)

| Step | Call | Observed |
| --- | --- | --- |
| update | `POST /v2/userapi/user/update { browser: [ { browserid, name, notes } ] }` | `{ code: 0, datas: [ { id, name, code: 0 } ], msg: "Success" }` - note the **`datas`** wrapper, not `data`; `browser-list` then shows the new `name` + `notes` |
| rapid second call | same route within ~1s | `{ code: -99, msg: "请求过于频繁，请1秒后再试", retry_after: <seconds> }` |
| clear notes | `PUT...` with `notes: ""` | **ignored** - the previous notes value stays |
| clear notes (correct) | `POST /v2/newbrowser/putaddnotes { shopid: [id], notes: "" }` | `code: 200 OK`; `notes` becomes `""` |

Traps: (1) this route is **rate limited** (`-99` + `retry_after`) so space calls out; (2) an empty string is treated as "no value" for `notes`, so it cannot clear notes - use `putaddnotes` for that; (3) the success envelope uses `datas`.

## `userapi` Group Round Trip (2026-10-09, batch 22)

| Step | Call | Observed |
| --- | --- | --- |
| create | `POST /v2/userapi/group/create { name }` | `{ code: 0, data: { group: "<name>", groupid: "<id>" }, msg: "Success" }` - returns the new `groupid` directly (name must be 2-40 chars) |
| list | `POST /v2/userapi/group/list { group, offer, number }` | `{ code: 0, data: { group: [ { name, gropid } ] } }` - rows under **`data.group`** (not `data.list`) and the id field is `gropid`; `offer`/`number` are required (max 20) |
| verify | `POST /v2/newbrowser/getgroups { companyid, userid }` | the new group is present in the management list (`gropid`) |
| delete | `POST /v2/newbrowser/deletegroups { groupid: ["<id>"] }` | `code: 200 OK`; the group is gone from both lists |

The `userapi` group surface has `create`/`update`/`list` but **no delete** - delete through the management
`deletegroups` route. Re-verified 2026-10-09: create added 1 group (management list 32 -> 33), delete returned it to 32.

## Platform Catalog: userapi vs management (2026-10-09, batch 23)

The platform catalogue is served twice with the **same 266 platform ids** but **different field naming**:

| Route | Envelope | Row fields |
| --- | --- | --- |
| `POST /v2/userapi/getAllUrlList/list` | `{ reqId, code: 200, msg, data }` (83861 bytes) | `fatherclass, childclass, grandsonclass, platformid, platformname, website, loginurl, fatherLabel, childLabel, grandsonLabel` - **camelCase** labels, no icons |
| `GET /v2/newbrowser/getallurilist` | `{ reqId, code: 200, msg, data }` (134892 bytes) | `fatherclass, childclass, grandsonclass, platformid, platformname, platformicon, website, loginurl, shop_icon, father_label, child_label, grandson_label` - **snake_case** labels plus `platformicon`/`shop_icon` |

Cross-check: `platformid` sets are identical (`0` ids only in userapi, `0` only in management). Only the
field names / extra icon columns differ. Pick the casing that matches the surface you are on.

## Environment List: userapi vs management (2026-10-09, batch 24)

| Route | Count | Row fields |
| --- | --- | --- |
| `POST /v2/newbrowser/getconditionshops` | `allshopnumb: 3511` | 54 fields per row (name, serial, proxy, accounts, tag, kernel, etc.) |
| `POST /v2/userapi/user/shopseriallist { groupId, accountName }` | `data.list` with **3511** rows | 6 fields only: `shopId, serial, accountName, groupId, publicIp, companyid` |

Both surfaces agree on the environment count (3511). Use the userapi `shopseriallist` for a lightweight
id/serial/name list and the management `getconditionshops` when you need the full row.

## Environment Detail: three shapes (2026-10-09, batch 25)

The same environment (`93d847cb041745c4b8dc5dc238136f13`) is returned by three routes with **different row shapes**:

| Route | Wrapper | Row fields |
| --- | --- | --- |
| `POST /v2/userapi/user/shopdetaillist { browserid: [id] }` | `data.browser[]` | `browserid, name, notes, label, is_star_tag, serial, proxy, accounts, accountsv2` (9) |
| `POST /v2/newbrowser/getfingerprinturi { shopid }` | `browseinfo` + `defaultfingerprint` | `name, notes, labelid, user_password_ids, is_star_tag, top_order, kernelId, categoryid, shopid, proxy, number, userPasswordPlatforms, accounts` (13) |
| `POST /v2/newbrowser/getshopconfigrpa { shopid: [id] }` | `shopconfig[]` | `shopid, remark, name, user, passwd, cookies, serial, kernelVersion, kernel, kernelId, system, userPasswordPlatforms` (12) |

Naming differs across the three: `browserid` (userapi) vs `shopid` (management); `label` (userapi) vs `labelid`
(fingerprint-uri); `is_star_tag` is shared. `getshopconfigrpa` is the only one that returns `user`/`passwd`/`cookies`,
so treat its output as **sensitive**.

## Font / MAC Helpers (2026-10-09, batch 26)

| Route | Method | Input | Observed |
| --- | --- | --- | --- |
| `/v2/newbrowser/getallfonts` | POST | `{}` | `{ code: 200, msg, fonts: [ ...62 font names ], randomFonts: [ ...681 ] }` (12943 bytes). `fonts` is the host font list; `randomFonts` is the pool used for randomised fingerprints. |
| `/v2/newbrowser/getautomac` | POST | `{}` | `{ code: 200, msg, mac: "20-7C-8F-A7-61-56" }` - **a fresh random MAC on every call** (3 calls returned 3 different MACs). Despite the name it does not read the machine MAC; it generates a virtual NIC MAC for the fingerprint. |

`getautomac` is the fingerprint helper for the MAC field; `getallfonts` feeds the font/spoofing options.

## Credentials: row schema + binding route (2026-10-09, batch 27)

`POST /v2/newbrowser/getUserPasswordList { page, pageSize }` row (18 fields):
`company_id, user_id, name, user_name, password, user_password_id, remark, platform_id, custom_platform_id, platform_lock, tfa, created_at, updated_at, deleted_at, delete_by, bind, userPasswordPlatforms, authority`.

| Route | Input | Observed |
| --- | --- | --- |
| `/v2/newbrowser/bindingUserPasswordList` | `{ user_password_id: "<id>" }` | `{ reqId, code: 200, msg, data: null }` for a credential with no bindings |
| `/v2/newbrowser/bindingUserPasswordList` | `{ ids: ["<id>"] }` | also `code: 200`, `data: null` |
| `/v2/newbrowser/bindingUserPasswordList` | `{ user_password_ids: ["<id>"] }` | `code: 500` - wrong key (singular `user_password_id`, or `ids`) |

The credential id field is `user_password_id` (singular) on the row.

## `getshopfromproxy` Filter Trap (2026-10-09, batch 28)

`POST /v2/newbrowser/getshopfromproxy` returns `{ code, msg, shopinfo, total }` where `total` is the number of
environments bound to a proxy.

| Body | Result |
| --- | --- |
| `{ deviceid: "<proxyId>" }` | correct filter - self-proxy `自有代理-q3h` returned `total: 2`; a dynamic proxy with no bindings returned `total: 0` |
| `{ device_ids: [...] }`, `{ id }`, `{ proxyid }`, `{ proxy_id }` | **filter ignored** - returns `total: 3284` (all environments) instead of an error |

So an **unrecognised filter key silently widens the result to everything**. Use the exact singular
`deviceid`; if you see `total` equal to the whole account (3284) you have almost certainly passed the wrong key.
`shopinfo` was `null` in every tested response.

## Filter Honoured vs Silently Ignored (2026-10-09, batch 29)

Checked with a deliberately no-match value (`zzz-no-match-xyz`):

| Route | Filter | Baseline | With no-match filter | Verdict |
| --- | --- | ---: | ---: | --- |
| `POST /v2/team/getMembers` | `name` | 3 | 0 | honoured |
| `POST /v2/newbrowser/getUserPasswordList` | `name` | 10 | 0 | honoured |
| `GET /v2/proxy/device/findTags` | `keyword` | 15 | 0 | honoured |
| `POST /v2/newbrowser/getconditionshops` | `shopname` | 100 rows | 0 rows | honoured |
| `POST /v2/newbrowser/getshopfromproxy` | wrong key (`id`/`proxyid`/`device_ids`) | - | returns ALL (3284) | **silently ignored** |

Most list filters narrow correctly; `getshopfromproxy` is the exception - a misspelled key there
widens the result to the whole account instead of returning an error. Always sanity-check a filter
that returns suspiciously high counts.

## `getuserauthshops` - environments a user is authorised on (2026-10-09, batch 30)

`POST /v2/newbrowser/getuserauthshops { userid: "<userId>" }` -> `{ list, total, pageSize, currentPage }`.
`userid` is required (singular). Results:

| user | result |
| --- | --- |
| the tested user | 1 row |
| another member with no grants | `{ list: null, total: 0, pageSize: 10, currentPage: 1 }` |

Row (18 fields): `shopid, group { name, groupid }, name, notes, serial, is_star_tag, kernel, kernelVersion, authorized, system, userPasswordIds, label, proxy, createby, cloud_id, is_give, status, expired_at`.

This is the per-user view of environment authority; the management `browser-list { authoritiesUserid: [id] }`
filter is the equivalent per-environment view (see WRITE_ROUNDTRIPS.md Environment Authority).

## Shop Brief List routes share `AccountsGetPageReq` (2026-10-09, batch 31)

`getshopbriefinfolist`, `getauthshopbriefinfolist`, and `cloud-accounts/getauthshopbriefinfolist` all decode
the same struct `AccountsGetPageReq`:

| Field | Type |
| --- | --- |
| `browserid` | `[]string` |
| `userid` | string |
| `page` | int (embedded `ReqPage.page`) |
| `pageSize` | int (embedded `ReqPage.pageSize`) |
| `number` | int |
| `name` | string |

Observed envelope: `{ list, total, pageSize, currentPage }`; rows have 18 fields.

| Route | `total` with `{ browserid: [one id] }` |
| --- | ---: |
| `newbrowser/getshopbriefinfolist` | 3511 (all environments - the `browserid` filter did **not** narrow) |
| `newbrowser/getauthshopbriefinfolist` | 3511 (same) |
| `cloud-accounts/getauthshopbriefinfolist` | 6 (its own cloud-shop set) |

The generic `shopids` key is ignored (it still returns the default page). For the two management routes the
`browserid` filter returned the whole account, so treat their narrowing as unconfirmed; the cloud-accounts
variant is the one that returns a distinct 6-row set.

## Curated Endpoints: undeclared-but-recognised request fields (2026-10-09, batch 32)

Probed every non-mutation curated POST endpoint: sent each candidate key as a wrong-typed object and
recorded which keys the Go decoder still recognises but the catalog's `body_defaults` does not list.
The extra keys are optional; the helper does not send them unless you pass `--body-file`.

| Endpoint | Extra recognised fields (beyond `body_defaults`) |
| --- | --- |
| `browser-list` | `page`, `pageSize`, `name` |
| `browser-cookie` | `companyid`, `companyId`, `groupid`, `serial` |
| `account-list` | `shopid`, `sortorder` |
| `fingerprint-uri` | `name`, `serial`, `remark`, `kernel`, `kernelVersion`, `system` |
| `user-notices` | `userid`, `companyid`, `companyId`, `status` |
| `rpa-plan-list` | `userid`, `accountId`, `pageIndex`, `pageSize` |
| `latest-open-environments` | `shopid`, `shopids`, `offer` |
| `auth-shop-brief-list` | `sortorder`, `serial`, `remark`, `labelids`, `authoritiesUserid`, `self`, `transfers`, `share`, `authorities`, `enable`, `offer`, `open_by_others`, `create_by_others` |
| `bound-account-detail` | `shopid`, `page`, `name`, `sortorder`, `remark` |
| `server-group-list` | `browserid`, `groupid`, `shopid` |
| `transfer-shop-list` | `companyId` |
| `auth-log-permissions` | `userid`, `companyid`, `companyId`, `name`, `username` |
| `auth-log-options` | `userid`, `companyid`, `companyId`, `name`, `username` |
| `team-login-logs` | `name`, `username` |
| `team-members` | `roleId` |
| `team-roles` | `name`, `roleId` |
| `team-departments` | `name` |
| `company-user-devices` | `userid`, `companyid`, `companyId`, `pageIndex`, `pageSize` |

Note `auth-shop-brief-list` accepts the whole browser-list-style filter set (`labelids`, `authoritiesUserid`,
`transfers`, `share`, ...), which is why its `browserid` filter behaved like the full browser list.
The catalog `body_defaults` remain the tested-minimal bodies; use these extra keys when you need to filter.

### Recognised is not the same as effective (2026-10-09, batch 33)

The extra keys from batch 32 are decoded into the Go struct but several are **not used by the handler**:
they neither narrow nor change the page. Tested:

| Call | Result |
| --- | --- |
| `browser-list { name: "zzz-no-match-xyz" }` | 10 rows (same as baseline - `name` ignored; use `shopname` instead) |
| `browser-list { page: 2, pageSize: 5 }` | 10 rows (unchanged - `page`/`pageSize` ignored; page size is `number`) |
| `account-list { shopid: "<env>" }` | 10 rows (unchanged) |
| `team-members { roleId: "1" }` | 3 rows (unchanged) |

So "the decoder accepts the key" only proves the field exists on the struct. Verify that a filter
actually changes the result before relying on it - the effective `browser-list` filters are `shopname`,
`groupid`, `serial`, `labelids`, `authoritiesUserid`, `browserid`, plus `number` for page size.

### `browser-list` pagination is `number` + `offer` (2026-10-09, batch 34)

`POST /v2/newbrowser/getconditionshops` paginates with **`number`** (limit) and **`offer`** (offset), not
`page`/`pageIndex`/`pageSize`.

| Body | rows | first `serial` |
| --- | ---: | ---: |
| `number: 10, offer: 0` | 10 | 4334 |
| `number: 5, offer: 0` | 5 | 4334 |
| `number: 5, offer: 5` | 5 | 4329 |
| `number: 5, offer: 10` | 5 | 4324 |
| `number: 0, offer: 0` | 0 (but `allshopnumb: 3511`) | - |

So page N (0-based) is `offer = N * number`, and `allshopnumb` is the whole-account count independent of the window.
The catalog's default `number: 100` therefore acts as a page size, not a total.

## Pagination conventions differ per route (2026-10-09, batch 35)

| Route | Limit key | Offset/page key | Evidence |
| --- | --- | --- | --- |
| `POST /v2/newbrowser/getconditionshops` | `number` | `offer` (offset) | `number:5` returns 5; `offer:5` shifts the first `serial` |
| `POST /v2/newbrowser/getUserPasswordList` | `pageSize` | `page` (1-based) | `pageSize:3` -> 3 rows; `page:2` changes the first row |
| `POST /v2/team/getMembers` | `pageSize` | `pageIndex` (1-based) | `pageSize:1` -> 1 row; `pageIndex:2` changes the first row |
| `POST /v2/message/user-notice/my` | `pageSize` | `pageIndex` | `pageSize:3` -> 3 rows, `pageSize:5` -> 5 |

So there is no single pagination contract: `browser-list` uses `number`+`offer`, credential/notice lists
use `page`+`pageSize`, and team lists use `pageIndex`+`pageSize`. Read each endpoint document before paging.

## `browser-list` `sortorder` values (2026-10-09, batch 36)

`sortorder` selects the ordering of `getconditionshops`. Sent with `number:3`, the first three `serial`
values differed per value (UI labels were not recoverable from the bundle):

| `sortorder` | first serials | reading |
| ---: | --- | --- |
| 0 | 4334, 4333, 4332 | serial descending (newest first) |
| 1 / 2 / 3 / 5 / 7 | 19, 20, 21 | serial ascending |
| 4 / 12 / 13 | 4334, 4333, 4332 | serial descending |
| 6 | 3956, 3951, 3954 | custom ordering |
| 8 | 740, 2737, 432 | custom ordering |
| 9 | 2810, 2819, 2820 | custom ordering |
| 10 / 11 | 3514, 3533, 3543 | custom ordering |

The catalog default is `12` (descending). Because several values share an order and others look
hand-tuned, treat `sortorder` as an opaque UI enum: keep 12 for the default and change it only if you
have a specific ordering to reproduce.

## Login log binds the login to the device (2026-10-09, batch 37)

`POST /v2/team/loginlogs` returns one row per login with (13 fields):
`id, companyId, userId, username, optionType, ip, region, clientType, device, clientId, clientMac, os, createdAt`.

Sample and cross-check:

| field | value | source |
| --- | --- | --- |
| `clientType` | `client` | login body `last_login_port: "client"` |
| `device` | `pc` | login body `last_login_device: "pc"` |
| `clientId` | `ec0f8fc23c8f9ff95ab5d509fe2c4c32`, `a9710a7ae8a6840f9586b2bba6fdd3e8`, ... | the **device fingerprint** - identical to `deviceId` in `/v2/team/company/user/devices` |
| `clientMac` | `30-56-0F-53-2A-7D` | machine MAC |
| `os` | `windows` | login body `os` |

Cross-check: of the 10 distinct `clientId` values in a page of login logs, **9 are present verbatim in the
device list's `deviceId`** (the 10th is simply a newer device not on the first device page). So the login
log's `clientId` and the device list's `deviceId` are the **same identifier**.

Conclusion for the earlier `cl` question:
- `cl` in the login body is the channel label (not a device), and `clientType` in the log comes from `last_login_port`.
- The **device identity** that links a login to a device is `clientId` = the device `deviceId`; the desktop
  client supplies it (the web `LoginReq` still has no `deviceId` body field). Use `loginlogs.clientId` and
  `user/devices.deviceId` to join a login to a device.

`name`/`username` narrow this list; `userId` is ignored.

Login-log enums on the tested account (sampled 200 of 411 rows): `optionType` is always `1`,
`clientType` always `client`, `device` always `pc`, `os` always `windows`. The account only records
desktop-client logins, so the other enum branches (web, mobile, other option types) are not exercised here;
treat `optionType` as an opaque code until a non-1 value is observed.

## Authentication status routes are externally dependent (2026-10-09, batch 38)

| Route | Result |
| --- | --- |
| `GET /v2/team/authentication/check` | returned `code:200` with 16 fields during the earlier sweep, but now `code:500, msg:"获取授权失败，\r\n失败信息 认证失败"` on every call (3 in a row, with/without `userId`/`companyId` params) |
| `GET /v2/team/authentication/get` | `code:200` , 12 fields (`userId, userCard, userStatus, userAcceptAt, companyId, companyIdCard, processInstanceId, name, companyStatus, failCount, companyAcceptAt, failReason`); tested account `userStatus:1`, `companyStatus:1` |
| `GET /v2/team/authentication/companyFourElementsFaceCheck` | `code:200`, same field set; `userStatus:0`, `companyStatus:0` (no submitted 4-element data) |
| `GET /v2/team/authentication/companyFourElementsQRCode` | `code:500, msg:"获取二维码失败，请稍后重试"` |

`authentication/check` and `companyFourElementsQRCode` call an external face/authorisation service; their success
is not guaranteed even with a valid token, so treat a `500 认证失败` here as an upstream state, not a bug.
`authentication/get` is the reliable read for the stored status.

## Plans and seat assignment (2026-10-09, batch 39)

### `POST /v2/team/company/getRoleDepartmentMeal`

Returns a **top-level array** (no `data` wrapper), one object per user:
`userId, companyId, deptName, deptId, rolesId, rolesName[] (e.g. ["管理员"]), end_time, day, free_status, restrict, expired`.

### `GET /v2/cost/costmanagement/get_user_set_meal`

Returns the plan/seat object with 34 fields:
`created_at, updated_at, original_discount, package_source, gift_environment_number, gift_member_number, gift_end_time, start_time, end_time, free_status, environment_number, member_number, effective_day, auto_renew, final_amount, residue_amount, payable_amount, actual_amount, company_id, user_id, user_packages_id, day, restrict, expired, has_package, select_day, normal_environment_number, normal_member_number, purchased_environment_number, purchased_member_number, free_environment_number, free_member_number, total_environment_number, total_member_number`.

The quotas are split by source: `normal_*` (base), `purchased_*`, `free_*`, `gift_*`, summed into `total_*`.
Tested account: `environment_number: 99999`, `member_number: 501`, `end_time: 2037-02-23`, `free_status: 0`, `has_package` present.
The plan is per `company_id`/`user_id`; `user_packages_id` identifies the package row.

## `browser-settings` payload (2026-10-09, batch 40)

`POST /v2/newbrowser/getsettings {}` -> `{ code, globalSettings, personalSettings, kernelversion, kernelWhiteList, searchEngineList }`.

`globalSettings` (team-level, 21 keys; values are strings like `"0"`/`"1"`/`"2"` unless noted):
`enableopen, enableopenNumber, risk_control (number), load_image, load_image_max_size, load_video, play_sound, data_sync, dns, enable_gc, gc_time, enable_clear_storage, enable_clear_cookie, random_finger, storage (number), monitoring (number), bind_proxy, expired_display, device_authorities, password_view, watermark`.

`personalSettings` (per-user, 10 keys):
`starting_env, search_engine (a JSON string, e.g. {"site":"21","siteDesc":"百度","url":"https://www.baidu.com/s?ie=UTF-8&wd="}), dpi, icon_type, language, storage, sub_search_engine, hot_key, sub_hot_key, batch_start`.

Other top-level keys: `kernelversion` (string), `kernelWhiteList` (array, empty on the tested account),
`searchEngineList` (array of 3).

Note `search_engine` is a **JSON string**, not an object - parse it again. Settings values are mostly
strings; `risk_control`, `storage`, `monitoring` were numbers.

## Plugin catalog / installed rows (2026-10-09, batch 41)

| Route | Envelope | Row |
| --- | --- | --- |
| `GET /v2/plugin/myPlugin` | `{ list, count, pageIndex, pageSize }` (no `code`) | count 39; 34 fields: `accountIds, pluginId, uids, companyId, uuid, userName, nickName, version, pluginCompanyId, permissions, name, icon, card, brief, author, catIds, CreatedAt, lookNum, installNum, sort, installStatus, kernel, firefoxVersion, firefoxPermissions, firefoxUuid, userId, uplinkId, isGlobal, isTeam, groupId, groupName, pluginType, detail, teamStatus` |
| `GET /v2/plugin/getPluginCrxList` | `{ list, count, pageIndex, pageSize }` (no `code`) | count 233; 21 fields: `uuid, name, permissions, icon, card, brief, author, catIds, CreatedAt, UpdatedAt, lookNum, installNum, sort, accountIds, pluginId, installStatus, kernel, firefoxPermissions, firefoxUuid, pluginType, pluginCompanyId` |
| `GET /v2/plugin/findPluginCrx` | `{ code, data, msg, requestId }` | detail under **`data.repluginCrx`** (note the `repluginCrx` spelling) |
| `GET /v2/plugin/getAddedAndGlobalplugin` | `{ code, data, msg, requestId }` | `data: { distributionPlugin: [], globalPlugin: [] }` - both empty for the tested account |

`myPlugin` lists the plugins the account has (installed/available), `getPluginCrxList` is the market catalogue
(233 entries), and `findPluginCrx` returns one catalogue entry.

## Help centre routes (2026-10-09, batch 42)

| Route | Input | Observed |
| --- | --- | --- |
| `POST /v2/news/show/help/categories` | `{}` | `{ reqId, code: 200, msg, data: { list: [...] } }` - 10 categories. Row: `id, lang, categoryName, apiurl, status, uid, pid, categoryIcon, sort, type, langCategoryName`. Category names were returned **localised in Russian** (`Начать`, `Управление оплатой`, `Расширения`, ...). |
| `POST /v2/news/show/help/list` | `{ categoryId, page, pageSize }` (keys from the client call site) | `{ reqId, code: 200, data: { list: [], total: 0, pageSize: 10, currentPage: 1 } }` - no help articles for these categories on the tested origin, for `categoryId` 1 and the other key spellings |

The help list is empty for every tested category, so the category list is the useful read; the article
payload could not be observed.

## Notification taxonomy (2026-10-09, batch 43)

### `POST /v2/message/user-notice/my`

`{ key, name, count, total, list }`, notice row (10 fields): `id, title, content (HTML), type, noticeType, op, opId, status, createdAt (unix seconds), reminderStatus`.

### `POST /v2/message/message-type/page`

`{ list, total, pageSize, currentPage }`; 4 message-type rows, each: `id, title, tinyTitle, noticeExec, status, noticeType, groupType, sort, createdAt, updatedAt`.

| id | title / tinyTitle | `noticeType` | `groupType` | `noticeExec` (event codes) |
| ---: | --- | ---: | ---: | --- |
| 1 | 通知 / 系统事件 | 3 | 1 | 33 codes (SetMealExpiringId, ShareShopDelNotice, ImportExcelNotice, DeviceFailId, DeviceExpiringSoonId, DeviceExpiredId, CompanyUserAuthenticationPass/Refuse, ApiStatisticsNotice, `hahhaha`, NewsPromotion, Activity, Device*Idv2, Renew*Idv2, DeviceDisabledId(v2), ...) |
| 2 | 账单 / 系统事件 | 1 | 1 | RetailWithdrawLogPass, RenewSetMealSuccessId, RenewSuccessId |
| 3 | 服务 / 系统事件 | 2 | 1 | RenewBalanceLackId, RenewFailId, RenewSetMealFailId, SetMealExpiredId |
| 4 | 咨询 / 后台 | 4 | 2 | article |

So a notice row's `noticeType` names its category (1 = billing, 2 = service, 3 = notification, 4 =
inquiry), `groupType` names the origin (1 = system event, 2 = backend), and `op` is one of the
`noticeExec` event codes (for example `ImportExcelNotice`, `DeviceFailIdv2`). A duplicate/test code
`hahhaha` exists in the list.

## Retail / distribution reads (2026-10-09, batch 44)

| Route | Data |
| --- | --- |
| `GET /v2/retail/findRetailUserInviteCode` | `data.userInvite`: `withdrawableAmount, canWithdrawable, invitedUserNumber, accumulatedCommission, accumulatedWithdrawal, invitationCode, frozenCommission, limitReservedCommission, refundedCommissionTotal`. Tested account: invitation code `8t66`, all amounts 0. |
| `GET /v2/retail/findRetailSettleConfig` | `data.reretailSettleConfig` (**note the `reretail` spelling**), 16 fields: `ID, CreatedAt, UpdatedAt, configId, type, settleType, settleRatio, cycle, status, minWithdrawalAmount, maxWithdrawalAmount, createBy, createByName, updateBy, updateByName, source`. Tested: `settleType:1`, `settleRatio:15`, `minWithdrawalAmount:100`, `maxWithdrawalAmount:680`, `status:1`. |
| `GET /v2/retail/getPromotionLinkList` | `data { list, maxCustomCount }` (`maxCustomCount: 10`). Row: `ID, CreatedAt, UpdatedAt, promotionLinkId, userId, customContent, invitationCode, linkName, redirectType, isDefault, status`. The account has one `默认推广链接` (`isDefault: true`, `invitationCode: 8t66`). |

`findRetailSettleConfig` returns the **`reretailSettleConfig`** key (double `re`), consistent with other
`rerpa*` spellings on this surface.

## `yun/*` content routes (2026-10-09, batch 45)

| Route | Data | Row |
| --- | --- | --- |
| `POST /v2/yun/ads-space/ad` | `data` is a **top-level 10-element array** of ad rows | 15 fields: `id, appid, adpos, status, lang, title, img, url, optype, opvalue, desc, startTime, endTime, createdAt, updatedAt` |
| `POST /v2/yun/qrcode-setting/get` | `data { list, total, pageSize, currentPage }` (2 rows) | 11 fields: `id, appid, pos, title, img, data (object), status, startTime, endTime, createdAt, updatedAt` |

These serve the client's in-app ad slots / QR-code banners (`img` points at OSS/file URLs, `data` on a
qrcode row is an embedded object). Both are read-only content feeds.

## `news/settings/info` accepts only two keys (2026-10-09, batch 46)

The route takes a `key` query parameter; only two keys exist, and they map to the two cataloged endpoints:

| `key` | Result |
| --- | --- |
| `setting.contact` | `code:200`, 956 bytes (email / mobile / wechat / telegram / ae-mobile / home-right-... support contacts) |
| `setting.qrcode` | `code:200`, 2032 bytes (vip / weixin / ... QR image URLs) |
| any other (`setting.agreement`, `setting.service`, `setting.about`, `setting.help`, ...) | `code:500, msg:"配置不存在"` (83 bytes) |

The client bundle only calls this route with `setting.contact` and `setting.qrcode`, so there are no other
settings blocks to discover.

## `gitGroupPluginList` is three concatenated JSON objects (2026-10-09, batch 47)

`GET /v2/plugin/group/gitGroupPluginList` returns **three** JSON objects in one body (437 bytes), not one:

1. `{"code":7,"msgCode":7,"data":{},"msg":"Error 3144 (22032): Cannot create a JSON value from a string with CHARACTER SET 'binary'."}`
2. the same error object again
3. `{"code":200,"data":{"globalPlugin":{"list":null,"count":0,"pageIndex":0,"pageSize":0},"userPlugin":{"list":null,"count":2,"pageIndex":0,"pageSize":0}},"msg":"ok","requestId":""}`

The real data is in the **third** object: `data.globalPlugin` and `data.userPlugin`, each with
`{list,count,pageIndex,pageSize}`. On the tested account `globalPlugin.count` is 0 and `userPlugin.count` is 2.
A single `JSON.parse` fails; split the body into balanced `{...}` chunks and parse each.

## Access-application / approval-join structs (2026-10-09, batch 48)

| Route | Go struct | Recognised field | `{}` result |
| --- | --- | --- | --- |
| `/v2/team/member/accessApproval` | `AccessApprovalReq` | `status` (int) | `{ code: 500, msg: "查看对象不存在或无权查看" }` |
| `/v2/team/company/approvalJoin` | `ApprovalJoinReq` | `companyId` (string; `companyid` also decodes to it) | `{ code: 500, msg: "参数错误" }` |
| `/v2/team/member/accessApply` | - | none of `shopid(s)/userid/approvalId/status/type` recognised | `{ code: 500, msg: "已失效，请重新申请" }` |

These are the member join/access-approval write paths. `accessApproval` uses an **`AccessApprovalReq`** with a
numeric `status`; `approvalJoin` uses **`ApprovalJoinReq`** with a string `companyId`. Neither was executed
(they change company membership).

## Proxy product catalogue `getProxyProductV2` (2026-10-09, batch 49)

`GET /v2/cost/costmanagement/getProxyProductV2` -> `{ code, msgCode, data: { group_list, list }, msg, traceId }`.

- `group_list`: 6 rows, `list`: 158 rows; both rows use **61 fields**.
- Field groups: geo (`region_id, country, city, display_area, display_region, area_code, country_code, city_code`),
  hardware (`cpu, memory`), product (`instance_id, bundle_id, parent_no, name, group_no, group_name, vtype, proxy_type, ip_type, isp_type, net_type, asn_type`),
  bandwidth (`band_width, max_band_width, band_width_type, band_width_cost, band_width_price, unit, sell_unit, duration`),
  pricing (`price_json, packages, dynamic_packages, line_price, selling_price, origin_price, floor_price, discount, group_price`),
  flags (`is_close, is_new, is_recommend, is_display, is_hot, is_discount, cidr_status, assign_ip, remaining, sell_pool, package_type`)
  and targeting (`recommend_platform, un_recommend_platform, third_recommend_platform, third_un_recommend_platform, remark, detail, ext_num, ext_rul, created_at, updated_at, id`).

`packages` example: `{ "day": null, "price": [ { "month": 1, "discount": 100 }, { "month": 3, "discount": 80 }, { "month": 6, "discount": 60 }, { "month": 12, "discount": 40 } ] }`
- `discount` is a percentage: `100` = list price, `80` = 20% off, `40` = 60% off.
- `price_json` = `{ flow, multiple }`.

`getProxyProduct` (V1) is the smaller sibling (69 fields). Use `packages.price[month].discount` for term pricing.

## `getshopnameandproxylist` / `getshopkernelVersions` use plural `shopids` (2026-10-09, batch 50)

Both decode the shared `GetShop` struct with `shopid` **and** `shopids` (`[]string`), but only **`shopids`**
returns rows:

| Route | Body | Result |
| --- | --- | --- |
| `POST /v2/newbrowser/getshopnameandproxylist` | `{ shopid: [id] }` | `{ reqId, code: 200, msg: "OK", data: null }` (empty) |
| `POST /v2/newbrowser/getshopnameandproxylist` | `{ shopids: [id] }` | `data: [ { shopid, name, Country, City, serial, proxy { name, inlie, uuid, type, product, PublicIP, ipChannel, deviceType, randEnv, region, ... } } ]` |
| `POST /v2/newbrowser/getshopkernelVersions` | `{ shopid: [id] }` | `data: []` (empty) |
| `POST /v2/newbrowser/getshopkernelVersions` | `{ shopids: [id] }` | `data: [ { account_id, kernel_version } ]` |

Trap: the singular `shopid` is accepted but yields an empty result - always send `shopids`. `account_id`
is the environment id in the kernel-versions row (not `shopid`).

## `account-users/get` (2026-10-09, batch 51)

`POST /v2/newbrowser/account-users/get { accountIds: [ ... ] }` -> `{ reqId, code: 200, msg, data: [...] }`.

- `accountIds` are **environment shopids** (the client maps `accountlist.map(e => e.shopid)`), not credential ids.
- Response rows (from the client code) carry `accountId` and `userId`; the client groups them by `accountId`.
- Tested: the singular `shopid`, `browserid`, `shopids` keys are ignored (still `data: []`), and passing the
  shopid or credential ids via the correct `accountIds` key also returned `data: []` - this account has no
  account-user bindings to return, so the row shape could not be observed live.

Send `accountIds: [<shopid>...]`; an empty/mismatched list yields `data: []` rather than an error.

## Roles list (2026-10-09, batch 52)

`POST /v2/team/roles {}` -> `{ requestId, code: 200, msg, data: [ ... ] }` (9 roles on the tested company).

Row (12 fields): `id, companyId, roleSlug, roleDesc, rightIds, roleType, gid, sort, createdAt, updatedAt, updateBy, count`.

- The role **name is `roleSlug`** (not `name`); values seen: `sss`, `经理`, `财务`, `环境配置员`, `环境操作员`, `test-del-001..003`, `发票管理权限测试角色`.
- `rightIds` is the permission-id list (comma-separated; matches the `id`s from `team/right/list`).
- `roleType: 0` for these custom roles; `count` is the number of members on the role.

Note the `test-del-*` and `发票管理权限测试角色` names - test data present on this account.

## Department write structs (2026-10-09, batch 53)

| Route | Go struct / keys | Notes |
| --- | --- | --- |
| `/v2/team/dept/change` | `ChangeDeptReq`: `deptId` (string), `pid` (string) | `{}` -> `500 无权修改`; not executed (renames/moves a department) |
| `/v2/team/dept/create` | `CreateDeptReq`: `pid` (string) recognised; name key not surfaced | `{}` -> `200 创建成功` and **creates an empty-name department** (see the junk-trap note) |
| `/v2/team/dept/del` | `{ id }` | `{ deptId }` returns `10017 无权删除` |
| `/v2/team/member/move` | `{ srcDeptId, destDeptId }` (client keys) | `{}` -> `200 查询成功`; not executed (moves members) |

`dept/change` uses `deptId` + `pid`; the create route's parent key is `pid` too. The member-move route uses
`srcDeptId`/`destDeptId`, not `userId`/`deptId`.
## Order detail, proxy, plugin and billing contracts (2026-10-09, batch 54)

Fifteen routes that were previously unresolved (4009 parameter errors, timeouts, or `fetch failed`)
were re-probed. Four Go request structs leaked their names and field types through the typed error
channel, which pinned down keys that the minified client bundle does not expose.

### `POST /v2/cost/costmanagement/getOrderDetailStatus`

Request struct (leaked by the type error): `OrderDetailRequest{ oid string, oids []string }`.

| Body | Result |
| --- | --- |
| `{}` | `4009 请求参数错误` |
| `{ "oids": "x" }` | `401 OrderDetailRequest.oids Parameter type error, please check` |
| `{ "oid": [1] }` | `401 OrderDetailRequest.oid Parameter type error, please check` |
| `{ "oid": 123 }` and `{ "oid": 0 }` | `401 OrderDetailRequest.oid Parameter type error` - so `oid` is a **string**, not an int |
| `{ "oid": "<28-char oid>" }` / `{ "oids": ["<28-char oid>"] }` | `4009 请求参数错误` |

Every one of the 20 orders this account can list was tried with both keys and all still returned
`4009`, so the route needs an identifier this account cannot produce (an order-*detail* level id).
Two traps for anyone re-probing:

- The real `oid` on an order row is a 28-character hex string such as
  `33592537c3b211f1a04f2cf05de7`. A naive `"oid":(\d+)` extraction silently truncates it to the
  numeric prefix `33592537`, which then fails with `4009` and looks like a wrong key.
- `getOrderDetailNew` and `getOrderDetailByDetailsNo` return `70004 订单获取失败` even with the real
  `order_no` / `oid` / `details_no` of these orders, while `getOrderDetailNewByMultiple` accepts
  `{ oids, details_nos }` and returns `200` with an empty array. This account holds cloud-instance
  renewal orders, which the detail endpoints do not resolve.

### `GET /v2/proxy/authority/get`

Query parameters: `proxyType` (required) and `deviceId` (optional, echo-only).

| Query | Result |
| --- | --- |
| `?proxyType=1` / `2` / `3` | `200 ok` |
| `?proxyType=0`, `4`, `5`, `10`+ | `401 代理类型错误: <value>` |
| `?type=1`, `?proxy_type=1`, `?proxyType="1"` | `401 代理类型错误: <value>` - only the camelCase numeric key is read |

Response: `{ code: 200, msg: "ok", data: { proxyType, deviceId, authorityList } }`.
`deviceId` is echoed back and `authorityList` is `null` when it is empty.

### `POST /v2/cost/device/cancel_order`

Request struct (leaked): `OrderPayRequest{ order_no string, pay_type string }` - **both fields are strings**.

| Body | Result |
| --- | --- |
| `{ "pay_type": 1 }` (number) | `401 OrderPayRequest.pay_type Parameter type error` |
| `{ "order_no": "X", "pay_type": "1" }` | `70004 订单获取失败` - key and type accepted |
| `{ "order_no": "X", "pay_type": "zfb" / "wx" }` | `70004 订单获取失败` - any string is accepted at the binding layer |

Not executed against a real order (it cancels a paid order).

### `POST /v2/proxy/device/batchautorenew`

Request struct (leaked): `DeviceBatchRequest{ device_ids []string }` plus an accepted `auto_renew` int.

| Body | Result |
| --- | --- |
| `{ "ids": ["x"] }` | `401 DeviceBatchRequest.ids Parameter type error` - `ids` is not a field |
| `{ "ids": [1] }` | `4009 请求参数错误` |
| `{ "device_ids": [1] }` | `401 DeviceBatchRequest.device_ids Parameter type error` - needs strings |
| `{ "device_ids": ["1"] }` | `80004 设备获取失败` - key and type accepted |
| `{ "device_ids": ["x"], "auto_renew": 1 }` | `80004 设备获取失败` |

Send `device_ids` as `[]string`. Not executed with real device ids (it toggles proxy auto-renew).

### `GET /v2/plugin/downloadFromWebStore`

Query parameter `url` (matches the client call `downloadFromWebStore({ url })`).

| Query | Result |
| --- | --- |
| none, `?url=`, `?path=/tmp/x.crx` | `code 7 下载路径不能为空` |
| `?url=not-a-url` | no response until the client timeout - the server starts fetching |
| `?url=<unreachable host>` | `code 7 请求下载插件接口失败` |

`path` is not a parameter. Not executed with a real store URL (it writes a crx into the client cache).

### `POST /v2/newbrowser/proxy-batch-import-res`

Read-only poll of the proxy batch-import job; the body is ignored.

`{}` -> `{ reqId, code: 200, msg: "OK", data: { browsers: null, done: true } }`.
`{ "proxies": [] }` and `{ "res": [] }` return the same payload.

### `POST /v2/cost/costmanagement/redeemed`

Client name `getcdkey`. Only `card_no` is read.

| Body | Result |
| --- | --- |
| `{ "card_no": "<fresh value>" }` | `401 请求获取兑换接口失败` - shape accepted, downstream redeem call failed |
| `{ "code": ... }`, `{ "cdkey": ... }`, `{ "cd_key": ... }`, `{ "key": ... }`, `{ "password": ... }`, `{ "cardNo": ... }`, `{ "no": ... }` | `4009 请求参数错误` - key not read |
| the same `card_no` sent twice inside the window | `4013 重复请求` |

Use a fresh `card_no` per probe or the duplicate-request guard masks the real error.
Not executed with a real card (it redeems value).

### Paid routes: contract read from the client bundle, never executed

| Route | Client request keys |
| --- | --- |
| `/v2/cost/device/create_order` | `auto_renew`, `auto_month`, `cloud_id`, `group_no`, `coupon_code`, `num`, `pay_type`, `pay_type_extra`, `period`, plus the selected product instance fields |
| `/v2/cost/costmanagement/set_meal_pay` | `member_number`, `effective_day`, `cost`, `pay_type`, `pay_type_extra`, `source_type`, `user_packages_id`, `coupon_code`, `validityPeriod` or `old_update` + `select_day` |
| `/v2/cost/costmanagement/renew_meal_pay` | same shape as `set_meal_pay` (the client picks the route by renewal vs update) |
| `/v2/cost/device/pay_scan` | `pay_type`, `pay_type_extra`, `order_no` |
| `/v2/cost/device/create_renew`, `/v2/cost/device/createNewbieDeviceOrder`, `/v2/cost/device/batch_create_order` | `4009` with `{}`; no call site exposes the keys, not executed |

These create or pay an order, so the goals note about paid routes applies: document the contract, do not spend.

### Two write routes and one hanging route

| Route | Finding |
| --- | --- |
| `POST /v2/newbrowser/updateProxyShop` | Client sends `{ proxy: { ...selfProxyFields, name } }`. Sweep with `{}` timed out. Not executed (pushes a proxy change to shops). |
| `POST /v2/newbrowser/updateYunShopProxy` | Same `{ proxy: {...} }` body. Not executed. |
| `POST /v2/sso/auth/setInfo` | `{}` never returns inside a 15s client timeout. Not executed (rewrites the signed-in profile). |
## Two long-unresolved write shapes (2026-10-09, batch 72)

Both routes had been returning a bare parameter error for several passes because the guessed keys were
wrong. The client call sites carried the real names.

### `POST /v2/proxy/device/resetname`

Client name `resetDeviceName`; candidate keys `device_type`, `device_id`, `name`. The request decodes
into `DeviceBatchRequest` - the same struct the recycle family uses, but with **singular** id fields.

| Body | Result |
| --- | --- |
| `{ device_id, device_type: "self", name }` | `401 DeviceBatchRequest.device_type Parameter type error` - `device_type` must be a number |
| `{ device_id, name }` | `200 ok` - `device_type` is optional |
| `{ device_id, device_type: 1, name }` | `200 ok` |

An unknown `device_id` still returns `200 ok`, so the response does not confirm that anything was
renamed. The earlier guesses `device_ids` (plural) and `deviceid` both return `4009 请求参数错误`,
which is why this route stayed unresolved while its siblings were mapped.

### `POST /v2/team/role/great`

Client name `addRoleAccount`; body `{ userIds: []string, RoleId: string }`.

| Body | Result |
| --- | --- |
| `{ userIds: ["x"], RoleId: "1" }` | `200 授权完成` - `RoleId` is a numeric **string** |
| `{ userIds: ["x"], RoleId: 1 }` | `500 json: cannot unmarshal number into Go struct field ...` |
| `{ userIds: ["x"], RoleId: "codex-probe-none" }` | `500 strconv.Atoi: parsing "codex-probe-none": invalid syntax` |
| `{ userids: ["x"], roleId: 1 }` | `500` - the keys are case-sensitive: `userIds` and `RoleId` |

The route grants a role and reports success even for a user id that does not exist, so it is lenient in
the same way as the other team writes. The probe used a non-existent user id and verified afterwards
that the role member counts and the three-member list were unchanged, so nothing was granted.
## Last Undocumented Routes (2026-10-09, batch 73)

Cross-checking every live route whose sweep result was a parameter or validation failure against the
parameter and behaviour documents left only four routes with no write-up. Probing them closed one and
characterised the other three as blocked rather than unknown.

### `POST /v2/newbrowser/transferCompanyId`

Client name `transferCompanyId`; candidate key `shopid`, and it must be a **string**.

| Body | Result |
| --- | --- |
| `{ "shopid": "codex-probe-none" }` | `404 资源不存在` - key and type accepted, the environment does not exist |
| `{ "shopid": ["codex-probe-none"] }` | `500 json: cannot unmarshal array into Go struct ...` - an array is the wrong type |

Adding `companyid` does not change the result. Not executed against a real environment, because the
route transfers one to another company.

### Three routes blocked by an upstream dependency, not by a missing parameter

| Route | Every body tried returns | Meaning |
| --- | --- | --- |
| `POST /v2/newbrowser/cloud-accounts/free/shop/init` | `500 record not found` | Needs an existing free cloud-account record; the handler fails before it validates the body, so no key can be distinguished |
| `POST /v2/newbrowser/cloud-accounts/open/token/get` | `500 请求云浏览器换取token接口失败` | The cloud-browser token exchange is unreachable for this account |
| `POST /v2/sso/mp/qrCode` | `500 获取accessToken出错` | WeChat MP QR login needs app credentials the account does not hold |

`{}` plus `oid`, `accountId`, `device_id`, and `scene` variants were all tried; neither the response
body nor the message changes, so these three cannot be parameter-mapped until the upstream dependency
is configured. They are blocked, not undocumented.

### Self and dynamic proxy filters (2026-10-09)

Both routes page over 20 rows; the self list holds 520 and the dynamic list 5. The measured behaviour
only makes sense together with the row fields, which were read for the same call:

| Route | Parameter | Values -> rows | Row evidence | Reading |
| --- | --- | --- | --- | --- |
| `findDeviceProxyUserSelves` | `status` | `0` -> 0; `1`, `2`, `99` -> 520 | rows carry **no `status` field** | `0` filters to rows whose status is 0 and matches none; a non-zero value returns the whole set |
| `findDeviceProxyUserSelves` | `ip_type` | `""`, `"1"` -> 520; `"2"`, `"9"` -> 0 | every row has `ip_type: 1` | exact-match filter |
| `findDeviceProxyUserSelves` | `proxy_type` | all values -> 520 | rows have `trademark: "self"`, no `proxy_type` field | ignored |
| `findDeviceDynamicProxies` | `status` | `0` -> 5; `1`, `2`, `99` -> 0 | every row has `status: 0` | exact-match filter; `0` is this account's only state |
| `findDeviceDynamicProxies` | `ip_type` | all values -> 5 | every row has `ip_type: 1` | ignored, unlike the self list |

So the two lists share parameter names but not behaviour: `status` is exact-match on the dynamic list and
effectively "0 means none, anything else means all" on the self list, and `ip_type` filters only the self
list. Neither list exposes a `status_text` sibling, so the numeric states have no client-side label here.
### `vcnplist` (cloud proxies) filters (2026-10-09)

The client page does **not** send `status` on this route; it sends `cloud_type`, `is_enable`, and paging.
The route table and the page call site both confirm the real filters, and measurement lines up:

| Parameter | Values tried | Measured | Meaning |
| --- | --- | --- | --- |
| `cloud_type` | `1`, `2`, `4`, `0`, `99` | 4 rows / 0 / 0 / 4 / 0 | `1` = CloudStatic, `2` = GlobalStatic, `4` = OverseasDynamic (client constants); `0`/absent = no filter |
| `is_enable` | `1`/`"1"`, `0`/`"0"`, `""`, `true` | 0 / 4 / 4 / `code: 401` | real filter: only entries flagged enabled; `true` is the wrong type |
| `status` | `0`, `1`, `2`, `3`, `4`, `99` | 4 / 0 / 0 / 4 / 0 / 4 | numeric state filter; `0` and unknown values do not filter |

Cross-check that explains the numbers: the account's four cloud proxies all carry `status: "Pending"` with
`status_text: "创建中"` and have no `is_enable` flag at all. So `is_enable: 1` correctly returns nothing, and
numeric `status: 3` is the only state value that passes them - i.e. `3` is the pending/creating state while
`1`, `2`, and `4` are other states this account holds none of.
### `noticeType` meanings, from the client icon map (2026-10-09)

The message page maps each `noticeType` to an icon, which names the category. The measured response
sizes line up with it: this account's 108 notices are all type `3`, so `0` (all) and `3` (notice) return
the same total while `1` (bill) and `2` (service) return none.

| Value | Client icon | Category | Measured on this account |
| ---: | --- | --- | --- |
| `0` | `allMessage` | All notices (title `全部`) | 5 rows, `total: 108` |
| `1` | `bill` | Billing | 0 rows |
| `2` | `service` | Service | 0 rows |
| `3` | `notice` | Notice | 5 rows, `total: 108` |
| `4+` | `message2` | Other messages | not sent by this account |
| `-99` | `more` | Client-side "more" bucket only; never sent to the server | n/a |

Values the client never sends (`-1`, `99`) return 0 rows but `code: 200`, so the server treats an unknown
type as an empty filter rather than an error.
### `executeType` on the RPA plan list (2026-10-09)

The parameter sweep reports `ignored (every value returns the same rows)`, but that verdict is
**degenerate**: this account has no RPA plans, and the list also needs `accountIds`, so every value returns
`total: 0`. The measurement cannot separate the values.

The client shows two concrete uses, which is the usable meaning so far:

| Value | Source in the client | Meaning |
| ---: | --- | --- |
| `11` | account page `getRpaPlansPost({userId, executeType:11, accountIds})` | find the cookie-robot plan bound to the selected accounts |
| `1` | RPA plan form default (`executeType: 1`) | the default type when a plan is created in the management page |

No complete enum map exists in the bundle, so other values stay unconfirmed.
### Request-field types inferred from decoder errors (2026-10-09)

Go's JSON decoder names the struct, the field, and the wanted type when a value has the wrong shape.
Sending one deliberately wrong value per field (`{"__type_probe__":1}`) recovers the real type, and the
wrong value is rejected before anything is written. `node scripts/dev/probe-field-types.mjs` runs this
across every route whose baseline body already succeeds, and writes the raw rows. **30 fields across 13
routes** are type-confirmed.

| Route | Field -> type |
| --- | --- |
| `POST /v2/newbrowser/getconditionshops` (struct `AccountsGetPageReq`) | `number` int, `offer` int, `enable` int, `sortorder` int, `userid` string, `shopname` string, `browserid` []string, `self` bool, `transfers` bool, `share` bool, `authorities` bool |
| `POST /v2/message/user-notice/my` | `noticeType` int, `page` int, `pageSize` int, `companyid` string, `userid` string |
| `POST /v2/newbrowser/getShopAndAuthList` | `shopid` []string |
| `POST /v2/newbrowser/getshopnameandproxylist` | `shopids` []string |
| `POST /v2/newbrowser/getgroupusers` | `groupid` string |
| `POST /v2/team/company/ids` | `ids` []string |
| `POST /v2/team/company/info` | `id` string |
| `POST /v2/team/company/getApprovals` | `pageSize` int, `pageIndex` int |
| `POST /v2/team/member/ids` | `userIds` []string |
| `POST /v2/rpa/getRpaPlanManagementList` | `userId` string, `accountIds` []string, `executeType` int |
| `POST /v2/newbrowser/getuserauthshops` | `userid` string |
| `POST /v2/newbrowser/getshopkernelVersions` | `shopids` []string |
| `POST /v2/team/role/members` | `id` string |

`POST /v2/cost/costmanagement/getOrderDetailNewByMultiple` cannot be probed: every baseline body tried
answers `code: 4009`, so the route rejects the call before any field is type-checked.

`POST /v2/proxy/device/findDevices` names its struct in the error (`DeviceTransferRequest.device_ids
Parameter type error`) without naming the Go type, which still confirms the field exists.

#### Weak-evidence fields, resolved by effect tests (2026-10-09)

A `code: 200` response to a wrong-typed value is weaker than a decoder error: the field was either coerced
or is absent from the struct (Go ignores unknown JSON fields). Each such field was re-tested by sending a
real value and a garbage value and comparing the response:

| Field | Real vs garbage | Verdict |
| --- | --- | --- |
| `getconditionshops.companyid` | 7896 vs 7896 bytes | **ignored** |
| `getconditionshops.company` | 7896 vs 7896 bytes | **ignored** |
| `getconditionshops.currentPage` (`1` vs `99`) | 7896 vs 7896 bytes | **ignored** |
| `getconditionshops.o` (`0` vs `1`) | 7896 vs 7896 bytes | **ignored** |
| `getgroups.company` | 2678 vs 2678 bytes | **ignored** |
| `getgroups.companyid` | 2678 vs 2678 bytes | **ignored** |
| `getgroups.userid` | 2678 vs 2678 bytes | **ignored** |
| `findDevices.device_type` (`0`/`1`/`2`) | 9371 bytes for all | **ignored** |
| `findDevices.status` (`0`/`1`/`2`) | 9371 bytes for all | **ignored** |

So nine fields are accepted-but-inert, not real request fields. One field is real despite the weak
type signal: `findDevices.trademark` returns 98 bytes for `self`, **9371 bytes / 4 rows** for `official`,
and 98 bytes for `garbage`, so it is a genuine enum filter (only `official` matches on this account).
`findDevices.device_ids` does not decode as an object at all (`code: 401 DeviceTransferRequest.device_ids
Parameter type error`), so it is type-checked too..