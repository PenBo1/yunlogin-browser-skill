# Server API Write Round Trips

Every write route below was exercised as a controlled round trip on the test account: create a uniquely named temporary resource, verify it by re-reading, then delete it and verify it is gone. No test resource was left behind. This is the safe-write evidence behind the mutation rows in the catalog.

## Environment

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| create | `POST /v2/newbrowser/putalluri` | `{ number, browser: { ...browseinfo, name, notes, labelid, is_star_tag, top_order, kernelId, categoryid, shopid:"", proxy:{...}, accounts:{url:[],cookie:"[]"}, fingerprint:{...} } }` | `{ code: 200, msg: "Success", shopid: ["<id>"] }` |
| create verify | `POST /v2/newbrowser/getconditionshops` | `{ number, companyid, userid }` | new row present with `device_type: local`, `system: Windows 11` |
| update | `POST /v2/userapi/user/update` | `{ browser: [ { browserid, name, notes } ] }` | `{ code: 0, datas: [ { id, name, code: 0 } ], msg: "Success" }` — note the `datas` wrapper, not `data` |
| update verify | `POST /v2/newbrowser/getconditionshops` / `POST /v2/userapi/user/shopdetaillist` | `{ shopname }` / `{ browserid:[id] }` | name and notes both changed |
| update (management) | `POST /v2/newbrowser/account-users/update` | `{ companyid, userid, shopid, name, notes }` | `{ code: 200, msg: "OK" }` but **no change applied** — lenient no-op |
| delete | `POST /v2/newbrowser/putdeleteshop` | `{ companyid, userid, shopid: ["<id>"] }` | `{ reqId, code: 200, msg: "OK" }` |
| delete verify | `POST /v2/newbrowser/getconditionshops` | `{ shopname }` | row gone |

Clone: `POST /v2/newbrowser/batchCloneShop` with `{ number, accountIds: ["<id>"] }` returns `{ reqId, code: 200, msg: "OK" }`; the clone is named `<source serial>-<source name>-克隆-<n>` and appears in `browser-list`.

## Group

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| create | `POST /v2/newbrowser/putnewgroup` | `{ companyid, userid, group, groupid: "" }` | `{ categoryid, code: 200, companyid, createby, name, updateby }` |
| rename | `POST /v2/newbrowser/putnewgroup` | `{ companyid, userid, group: "<new name>", groupid: "<categoryid>" }` | `{ "Code": 200 }` — capitalised `Code`, unlike every other response |
| verify | `POST /v2/newbrowser/getgroups` | `{ companyid, userid }` | row `gropid` carries the new name |
| delete | `POST /v2/newbrowser/deletegroups` | `{ groupid: ["<id>"] }` | `{ reqId, code: 200, msg: "OK" }` |
| delete verify | `POST /v2/newbrowser/getgroups` | - | row gone |

`server-group-list` reports `system_group`: `1` default group, `2` transfer group, `0` custom group.

Group sort: `POST /v2/newbrowser/putsortgroup` decodes `ChangeSortGroup.groups` as `[]string` (the ordered group ids). Sending a rotated order returns `code: 200 OK`, but `getgroups` returns the same order as before -- an observed **silent no-op** on this account. Do not rely on it to reorder groups.

## Proxy Tag

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| upsert | `POST /v2/proxy/device/updateTag` | `{ companyid, userid, label, color }` | `{ code: 200, msgCode: 200, data: null, msg: "ok", traceId }` |
| verify | `GET /v2/proxy/device/findTags` | `{ companyid, userid, page, per_page }` | rows live under **`data.data`**; the created row has `name` = the request `label`, `color` = the request colour |
| delete | `POST /v2/proxy/device/delTag` | `{ companyid, labelid: ["<id>"] }` | `{ code: 200, msgCode: 200, data: null, msg: "ok", traceId }` |
| delete verify | `GET /v2/proxy/device/findTags` | - | row gone |

A duplicate label returns `code: 4020` (`数据已存在`). Deleting an unknown tag still returns `code: 200`. `color` must be a **number**: a string colour returns `401 Label.color Parameter type error`. The create body calls the name `label`, but the row returns it as `name` (re-verified 2026-10-09: create added 1 row, `delTag { labelid }` removed it, list 16 -> 15). Tag colours are documented in [tag-colors.md](tag-colors.md).

## Cookies (on a temporary environment)

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| upsert | `POST /v2/userapi/cookie/upsert` | `{ shopid, cookies: [ { name, value, domain, expirationDate, hostOnly, httpOnly, path, sameSite, secure, session, storeId, port } ] }` | `{ code: 0, msg: "Success" }` |
| read | `POST /v2/newbrowser/getCookie` | `{ shopid }` | `code: 200`, `data` is a JSON **string** containing the cookie (231 bytes, our cookie present) |
| clear | `POST /v2/userapi/cookie/clear` | `{ shopid }` | `{ code: 0, msg: "Success" }` |
| clear verify | `POST /v2/newbrowser/getCookie` | `{ shopid }` | `code: 200`, `data` is an empty string |

The environment was deleted afterwards.

## `userapi` Self-Proxy (server origin)

The document-guided self-proxy calls did **not** function on the management-center origin:

| Route | Request | Observed |
| --- | --- | --- |
| `POST /v2/userapi/selfproxy/create` | `{ proxy: { name, proxytype: 3, proxyaddr, notes } }` | `{ code: -2, msg: "failed add" }` |
| `POST /v2/userapi/selfproxy/list` | `{ page, pageSize, name }` | `{ code: -2, msg: "failed find" }` |

These handlers are served but reject the server-side session (`-2`). They are intended for the local desktop service (`http://localhost:50213/api/v2/userapi/...`). Use the management routes (`/v2/proxy/device/*`) for self-proxy work against the server.

## Management Self-Proxy Parameter Discovery

`POST /v2/proxy/device/delDeviceProxyUserSelves` reports a Go struct name in its validation error. Measured responses:

| Request | Response |
| --- | --- |
| `{}` / `{deviceid:[...]}` / `{deviceId:[...]}` / `{deviceIds:[...]}` | `{ code: 401, msg: "device id is required" }` |
| `{ device_id: [id] }` / `{ device_id: {..} }` | `{ code: 401, msg: " DeviceBatchRequest.device_id Parameter type error, please check" }` |
| `{ ids: [id] }` / `{ ids: "id" }` | `{ code: 401, msg: " DeviceBatchRequest.ids Parameter type error, please check" }` |

The request struct is `DeviceBatchRequest` with fields `device_id` and `ids`, but the accepted types/combination were not resolved. `POST /v2/proxy/device/createDeviceUserSelves` returns `code: 200, msg: "ok"` even for `{}` **without creating** a device, so a success code is not proof of a write.

## Lessons

- **Success is not proof.** `account-users/update`, `createDeviceUserSelves`, `deletegroups` for unknown ids, and `delTag` for unknown ids all return success without an observable change. Always re-read.
- **Response shapes vary.** `userapi/user/update` uses `datas`; `putnewgroup` rename uses capital `Code`; `getCookie` returns a JSON string in `data`.
- **Permission gates exist.** `POST /v2/team/dept/del` returns `code: 10017 无权删除` on this account.
- **Use unique names and verify cleanup.** Every temporary resource above was re-read before and after deletion.

## Role Group

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| create | `POST /v2/team/role-group/create` | `{ companyId, id: 0, intro, name }` — `id` must be an **int64**, `id:""` fails with `json: cannot unmarshal string into Go struct field RoleGroupDto.id of type int64` | `{ reqId, code: 200, msg: "OK", data: { id, companyId, name, intro, sort, isDefault } }` |
| list | `POST /v2/team/role-group/page` | `{ pageIndex, pageSize, total }` | rows with `id, companyId, name, intro, sort, isDefault` |
| update | `POST /v2/team/role-group/update` | `{ companyId, id, intro, name }` | `{ reqId, code: 200, msg: "OK" }`; rename verified |
| delete | `POST /v2/team/role-group/del` | `{ ids: [id] }` | `{ reqId, code: 200, msg: "OK" }`; verified gone |
| delete (wrong shape) | `POST /v2/team/role-group/del` | `{ id }` | `{ code: 500, msg: "WHERE conditions required" }` |

## Department Cleanup

`POST /v2/team/dept/create` **creates a row even for an empty body**: `{}` returned `{ code: 200, msg: "创建成功" }` and added an empty-name department. The generic live sweep probed this route, so empty-name departments accumulated (20 were found and removed on 2026-10-09). This is a junk-creating trap: the route is classified as a "read" by the sweep heuristic because its path contains no write verb, so it must be explicitly excluded from read-only sweeps.

`POST /v2/team/dept/del` takes `{ id }` (not `{ deptId }`); `{id}` returned `code: 200 删除成功` and removed each stray empty-name department. `{deptId}` returns `code: 10017 无权删除`. The department tree (`getDepts`) uses `deptId` / `departmentName` / `children` (not `id` / `name`), which is why name-based cleanup must walk those keys. After cleanup: 15 departments, 0 with an empty name.

## Account Credential

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| create (tried) | `POST /v2/newbrowser/createUserPassword` | `{company_id,user_id,name,user_name,password,remark,platform_id,platform_lock,tfa}` and `{}` | `{ code: 200, msg: "OK", data: null }` with **no record created** (verified by re-listing) — lenient no-op |
| create (tried) | `POST /v2/newbrowser/putUserPassword` | same credential body | `{ code: 200, msg: "OK" }`, no record created |
| batch create (tried) | `POST /v2/newbrowser/postBatchAddUserPassword` | `{ list:[...], kernel_version:"" }` | `code: 404 资源不存在`; with `kernel_version:"141"` or extra keys -> `code: 4013 unknown error` (shape not resolved) |
| list | `POST /v2/newbrowser/getUserPasswordList` | `{ page, pageSize }` | row fields include `company_id,user_id,name,user_name,password,user_password_id,remark,platform_id,custom_platform_id,platform_lock,tfa,created_at,updated_at,deleted_at,delete_by,bind,authority,userPasswordPlatforms{...}` |
| delete | `POST /v2/newbrowser/deleteUserPassword` | `{ user_password_ids: ["<id>"] }` | candidate key from call sites; not exercised because no record could be created |

The credential create routes accept almost any body and report success without writing, so they must be verified by re-reading the list.

### Batch import flow (spreadsheet)

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| start | `POST /v2/newbrowser/creatbatchaddxlsxuuid` | `{ import_type: 1 }` | `{ code: 200, msg: "OK", data: { id, company_id, user_id, import_key, ip, import_type, total, success, fail, finished, created_at, updated_at } }` |
| submit | `POST /v2/newbrowser/postbatchaddxlsx` | `{ list: [ <row> ], kernelVersion: "<n>", key: "<import_key>" }` | `{ code: 200, msg: "Success" }`; the per-row result is read from the process route, not from this response |
| progress | `POST /v2/newbrowser/getbatchaddxlsxprocess` | `{ import_key }` | `{ code: 200, data: { ..., total, success, fail, finished } }` - `finished: 1` means the run is done; `fail: 1` means the row was rejected |
| rows | `POST /v2/newbrowser/getbatchaddxlsxlist` | `{ import_key, import_type, import_status: <int> }` | rows keyed by spreadsheet columns `A..P`. `import_status` must be an **int**; a string returns `500 AccountImportDto.import_status of type int` |

Spreadsheet column map (the `A..P` keys): `A`=name, `B`=group, `C`=remark, `D`=Cookies, `E`=kernel version, `F`=platform (by **name**), `G`=custom URL, `H`=login account, `I`=login password, `J`=2FA secret, `K`=open URL, `L`=proxy type, `M`=proxy device info, `N`=tags, `O`=lock credential, `P`=import status.

Column `P` carries the per-row result: a rejected row shows `[失败] <reason>` (for example `[失败] 代理类型和代理设备信息不能为空；`, i.e. proxy type and proxy device info are required). Supplying `L` (proxy type, e.g. `http`/`socks5`) without a resolvable `M` (proxy device info) still fails, so a real import needs a working proxy row. `postBatchAddUserPassword` shares the `{ list, kernelVersion, key }` shape but expects the parsed rows; reusing a consumed `import_key` returns `4013 unknown error`. The client parses the `.xlsx` in the browser, so the `key` from `creatbatchaddxlsxuuid` is the only server-side handle. No credential row was created by the probe rows (the account has 10 credentials before and after), so a full import was not completed. Re-verified 2026-10-09: `createUserPassword` and `putUserPassword` both returned `{code:200, msg:"OK", data:null}` and the `getUserPasswordList` count stayed at 10 (delta 0), so the only working credential-import path is the spreadsheet batch flow (`creatbatchaddxlsxuuid` + `postbatchaddxlsx` -> `key` -> `postBatchAddUserPassword`).

## Dynamic Proxy

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| create/update | `POST /v2/proxy/device/updateDeviceDynamicProxies` | `{ deviceid: "", trademark: "general", name, type, autoswitch, url, ip_query_channel }` | `{ code: 200, msgCode: 200, data: { ...full row... }, msg: "ok", traceId }`; `data.deviceid` is the new id |
| verify | `GET /v2/proxy/device/findDeviceDynamicProxies` | `{ status:0, trademark:"general", page, per_page, companyid, userid }` | row present with `type`, `url`, `autoSwitch`, `ip_query_channel`, `serial` |
| delete | `POST /v2/proxy/device/delDeviceDynamicProxies` | `{ device_ids: ["<id>"] }` | `{ code: 200, msgCode: 200, data: null, msg: "ok", traceId }`; verified gone |
| purge | `POST /v2/proxy/device/recycleDelDeviceDynamicProxies` | `{ device_ids: ["<id>"] }` | `code: 200 ok`; the row leaves the recycle list entirely |

Re-tested 2026-10-09 with a before/after id-set diff: create added exactly one row (`2b639ce5...`) to the active list, delete moved it to the recycle list, purge removed it. `type` must be a **string** (`"http"`/`"socks5"`); a numeric `type` returns `401 DeviceDynamicProxies.type Parameter type error` and creates nothing.

### Proxy list status semantics are inverted between the two families

| List route | `status:0` | `status:1` |
| --- | --- | --- |
| `GET /v2/proxy/device/findDeviceDynamicProxies` | **active** rows | recycle/deleted rows |
| `GET /v2/proxy/device/findDeviceProxyUserSelves` | recycle/empty | **active** rows |

Do not copy the `status` value from one list route to the other. `findDeviceProxyUserSelves` also returns its rows under `data.data` with the id field `deviceid`.

## Self Proxy (management routes)

The working create/update route is `updateDeviceProxyUserSelves`, and `proxy` is an **array** of proxy objects (not an object). Earlier attempts with `proxy: {...}` and `proxies: [...]` reported `code: 200 ok` but created nothing.

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| create/update | `POST /v2/proxy/device/updateDeviceProxyUserSelves` | `{ company, companyid, userid, non_repeat: 0|1, proxy: [ { name, proxytype, proxyaddr, proxyu, proxyp, notes, inlie:"self", inspect, ipChannel, target_url } ] }` | `{ code: 200, msgCode: 200, data: { proxies: [...], success: 1, failure: 0, repeat: 0 }, msg: "ok", traceId }` |
| verify | `GET /v2/proxy/device/findDeviceProxyUserSelves` | `{ status:1, trademark:"self", page, per_page, companyid, userid }` | row present with `trademark: "self"`, `proxytype`, `ip_place`, `serial` |
| delete | `POST /v2/proxy/device/delDeviceProxyUserSelves` | `{ device_ids: ["<id>"] }` | `{ code: 200, msgCode: 200, data: null, msg: "ok", traceId }`; verified gone |

Response detail of `updateDeviceProxyUserSelves`: `data.success` is the number created, `data.failure` the number failed, `data.repeat` the number rejected as duplicates when `non_repeat: 1`.

Correction (re-tested 2026-10-09): on this deployment the create **does not persist a visible row**. `updateDeviceProxyUserSelves` returns `code: 200, data.success: 1` with a full `data.proxies[0]` (including a fresh `deviceid`), but `findDeviceProxyUserSelves` returns the same id set before and after (520 rows, diff = 0) for every status (0-3). The stored row also shows `companyid: ""` even though `companyid` is sent at the top level. Treat `success: 1` here as unverified until a re-read shows the row; the request field `proxy` must be an array and `target_url` must be an array (`[]` accepted), and `ipChannel` must be omitted or a string. Two further traps were observed: `proxytype` must be a **number** (`"http"` -> `401 DeviceProxy.proxy.proxytype Parameter type error`) and a numeric `ipChannel` -> `401 ... ipchannel Parameter type error`.

## Environment Flags (Star / Top)

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| star on | `POST /v2/newbrowser/retsetshopisstartag` | `{ shopid: ["<id>"], startag: 1 }` | `{ reqId, code: 200, msg: "OK" }`; `browser-list` shows `isstartag: 1` |
| star off | same | `{ shopid: ["<id>"], startag: 0 }` | `isstartag` back to `0` |
| top on | `POST /v2/newbrowser/retsetshopistop` | `{ shopid: ["<id>"], top: 3 }` | `code: 200 OK`; `topOrder` becomes `3` |
| top off | same | `{ shopid: ["<id>"], top: 0 }` | `topOrder` back to `0` |

`shopid` is an **array**. A bare string returns `500 json: cannot unmarshal string into Go struct field SetShop.shopid of type []string`.

## Environment Group Change

`POST /v2/newbrowser/putchangegroup` with `{ shopids: ["<id>"], groupid: "<id>" }` returned `code: 403 暂无访问权限` on this account. `{shopid:"<id>", groupid:"<id>"}` returns `500 json: cannot unmarshal string` (again the id is an array). The route exists but the tested user cannot move environments this way.

## Delete Semantics (Important)

Deleting a row is not uniform across the API. Measured on this account:

| Resource | Delete route | Semantics | Observed |
| --- | --- | --- | --- |
| Environment | `POST /v2/newbrowser/putdeleteshop` | Soft delete | Leaves the active `browser-list` but stays in `getrecycleshoplist` (field `account_id`/`account_name`). Purge with `POST /v2/newbrowser/putdeleteshopfromrecycle` `{ shopid: [id] }`. Nine `codex` test environments created earlier were purged this way. |
| Self proxy | `POST /v2/proxy/device/delDeviceProxyUserSelves` | Soft delete | The row leaves the `status:1` active list but remains in `findDeviceProxyUserSelves` with `enable: 0` and a `deleteby` value. Purge with `POST /v2/proxy/device/recycleDelDeviceProxyUserSelves` `{ device_ids: ["<id>"] }`. |
| Group | `POST /v2/newbrowser/deletegroups` | Hard delete | Group is gone from `getgroups`. |
| Proxy tag | `POST /v2/proxy/device/delTag` | Hard delete | Tag is gone from `findTags`. |
| Role group | `POST /v2/team/role-group/del` | Hard delete | Row is gone from `role-group/page`. |
| Department | `POST /v2/team/dept/del` | Hard delete | Node is gone from `getDepts`. |

Environment recycle helpers exist for other flows: `POST /v2/newbrowser/getrecycleshoplist` (`{categoryId,accountName,page,pageSize,transfers}`) and `POST /v2/newbrowser/putdeleteshopfromrecycle` / `POST /v2/newbrowser/putrestoreshop` (both `{shopid}`). Recycle rows use different field names from the active list: `account_id`, `account_name`, `category_id`, `deleted_at` (not `shopid`/`name`).


## Environment Sharing (`shareShop`)

Resolved on 2026-10-09 by combining a Go struct-error probe with a live create/list/delete round trip. The concrete Go struct names are `ShareShop`, `ShareShop.share[]`, and `ShareShopDel`, so field-type errors name the exact JSON tags.

### `POST /v2/newbrowser/shareShop` (create)

Request body fields (all confirmed via `cannot unmarshal ... into Go struct field`):

| Field | Type | Notes |
| --- | --- | --- |
| `shopids` | `[]string` | Environments to share. Required; an empty list is what produced the old `500 empty slice found`. |
| `share` | `[]object` | Recipients. Each element has `companyid` (string) and `userid` (string). An empty element (`{}`) still creates a status-1 row. |
| `day` | number | Duration in days, copied into the `share.day` column. |
| `remark` | string | Free text. |
| `url` | string | Shared landing URL. |
| `help` | **bool** | Must be a JSON boolean. A number here returns `json: cannot unmarshal number into Go struct field ShareShop.help of type bool`. |
| `storage` | number | Storage mode flag (int). |
| `user_password_ids` | `[]string` | Credential ids to include. |

Example that created a row:

```
POST /v2/newbrowser/shareShop
{ "shopids": ["<shopId>"], "share": [{ "companyid": "<target company id>", "userid": "<target user id>" }] }
=> { "code": 200, "msg": "OK" }
```

Sharing to the same `companyid`+`userid` twice in a row returns `{ "code": 409, "msg": "unknown error" }`.

### `POST /v2/newbrowser/shareShopList` (read)

Body `{}` returns `{ reqId, code, msg, data: { list: [...], total, pageSize, currentPage } }`. Each `list` element is `{ share: {...}, shop: {...} }`:

| Field (`share`) | Meaning |
| --- | --- |
| `id` | Share row id (uint64). |
| `account_id` | Shared environment's account id. |
| `account_company_id` | Owning company id (the sharer). |
| `user_id` | Recipient user id. |
| `company_id` | Recipient company id. |
| `day` | Duration in days. |
| `status` | `1` = pending, `2` = accepted/active, `3` = deleted (soft). |
| `create_by`, `update_by` | Actor user ids. |
| `user_password_ids`, `remark`, `url`, `help`, `storage` | Copied from the create request. |
| `expired_time`, `created_at`, `updated_at` | Timestamps (`YYYY-MM-DD HH:MM:SS`). |

The `shop` object is the shared environment snapshot; when the share is stale it is returned all-empty (`account_id: ""`, `serial: 0`, ...).

### `POST /v2/newbrowser/shareShopDel` (delete)

Request fields: `ids` (`[]uint64`) and `shopids` (`[]string`). Either deletes matching rows.

```
POST /v2/newbrowser/shareShopDel
{ "ids": [<shareId>] }   => { "code": 200, "msg": "OK" }
```

Caveat: this is a **soft delete**. The row stays in `shareShopList` but its `status` flips to `3`. It is not removed from the list response, so "gone" must be checked as `status === 3`, not absence.

### Related routes

| Route | Method | Observed |
| --- | --- | --- |
| `/v2/newbrowser/shareCompanyIdList` | POST | `{ companyIds: [] }` for the tested account - it lists the companies that may still be shared to. |
| `/v2/newbrowser/sharerCompanyId` | POST | `{ code: 404, msg: "资源不存在" }` with an empty body. |
| `/v2/newbrowser/world/shareShop` | POST | HTTP 404 `page not found` on this origin (different deployment surface). |
| `/v2/newbrowser/world/closeShareShop` | POST | HTTP 404 `page not found` on this origin. |
| `/v2/newbrowser/shareShopClosed` | POST | `{ shopids: [<id>] }` returns the subset of `shopids` whose environments are marked closed. |

Transfer routes `POST /v2/newbrowser/transferShop` and `POST /v2/newbrowser/transferShopList` were not exercised (moving an environment between companies is destructive and has no direct inverse).

Cleanup: every share row created during this study (`status` set to `3`) was left as a soft-deleted row because the soft delete does not remove it. No environment was created, renamed, or deleted for this test - only sharing links on an existing throwaway environment.

## Team / User Settings

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| env settings read | `POST /v2/team/env-settings/get` | `{ tags: ["EnvHeaderBtnKey"] }` | `code: 200`; `data[]` rows carry `id, createdAt, updatedAt, userId, companyId, tag, content, uicontent`. `tags: []` fails with `500 ... 'Tags' failed on the 'gt' tag`. |
| env settings write | `POST /v2/team/env-settings/update` | `{ tag, content }` where `content` is a JSON string such as `{"left":[],"right":[]}` | `code: 200 OK`; re-reading the tag returns the stored row |
| sidebar read | `POST /v2/team/sidebar/get` | `{}` | `{ id, createdAt, updatedAt, userId, companyId, version, menus }` |
| sidebar write | `POST /v2/team/sidebar/update` | `{ menus: "<json string>" }` (`menus` is a string, not an object) | `code: 200 OK`; the next `sidebar/get` returns the stored `menus` value. Round-tripped back to the original `""`. |
| SMS setting read | `POST /v2/message/sms-setting/get` | `{}` | `{ renewSmsNotifyEnabled }` |
| SMS setting write | `POST /v2/message/sms-setting/change` | `{ RenewSmsNotifyEnabled: 1 }` | `code: 200 OK` |
| SMS setting write (zero) | `POST /v2/message/sms-setting/change` | `{ RenewSmsNotifyEnabled: 0 }` | `code: 500 ... 'RenewSmsNotifyEnabled' failed on the 'required' tag` — a zero value is rejected as missing, so the flag cannot be set to 0 through this route |

`env-settings/update` inserts a row when the tag does not exist; there is no delete route, so the row persists (empty `left`/`right` is the default behaviour). `team/sidebar/update` was exercised as a safe round trip: it takes `{ menus }` as a JSON *string*, and the original `""` was restored afterwards.

## Environment Authority (Grant / Revoke)

Verified with a temporary environment and a second team member (`26a4b748...`).

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| grant | `POST /v2/newbrowser/addusershopauthority` | `{ userid: "<memberId>", shopids: ["<shopId>"] }` | `{ reqId, code: 200, msg: "OK" }`; `browser-list` filtered by `authoritiesUserid:["<memberId>"]` went 0 -> 1 |
| verify | `POST /v2/newbrowser/getconditionshops` | `{ number, authoritiesUserid: [memberId], companyid, userid }` | the environment appears only after the grant |
| revoke | `POST /v2/newbrowser/putdeleteauthority` | `{ company, companyid, userid, shopids: ["<shopId>"], touserid: "<memberId>" }` | `{ reqId, code: 200, msg: "OK" }`; the filtered list returned to 0 |

Notes:
- The shop row's own `authority` field stayed `[3]` throughout; it is the authority *level* on the environment, not the list of authorized users. Use the `authoritiesUserid` filter to observe grant/revoke.
- Related routes not exercised: `putusershopauthority` (grant via `share:[{companyid,userid:[ids],shopid,authority:2}]`), `putmoveauthority` (`{company,companyid,userid,shopids,usered,touserid}`), `putusergroupauthority`, `putdeletegroupauthority` `{groupid}`, `putdeleteallauthority` `{userid}`.
- Type trap (re-verified 2026-10-09): `putdeleteauthority.touserid` is a **string**; sending an array returns `500 json: cannot unmarshal array into Go struct field DeleteAuthority.touserid of type string`. By contrast `putmoveauthority.touserid` IS an array. The same field name has different types on the two routes, and `shopids` stays an array on both.
- Re-verified 2026-10-09 with member 26a4b748...: grant made the environment appear under AuthoritiesUserid, string-form revoke removed it (0 -> 1 -> 0).
- The temporary environment was deleted and purged from the recycle bin.

## Authority Handover (`putmoveauthority`)

Verified with two team members (A = `26a4b748...`, B = `c4e3bae6...`) on a temporary environment.

| Step | Route | Request shape | Observed (`authoritiesUserid` filter) |
| --- | --- | --- | --- |
| grant A | `POST /v2/newbrowser/addusershopauthority` | `{ userid: A, shopids: [sid] }` | `code: 200`; A=true, B=false |
| move A -> B | `POST /v2/newbrowser/putmoveauthority` | `{ company, companyid, userid, shopids: [sid], usered: A, touserid: [B] }` | `code: 200`; A=false, B=true |
| move B -> A | same | `{ ..., usered: B, touserid: [A] }` | `code: 200`; A=true, B=false |
| revoke A | `POST /v2/newbrowser/putdeleteauthority` | `{ company, companyid, userid, shopids: [sid], touserid: A }` | `code: 200`; A=false |

`usered` is the **source** member (the one handing over), `touserid` is an **array** of target members. This is the member-removal "handover" flow. The temporary environment was deleted and purged.

## Group Authority (`putusergroupauthority` / `putdeletegroupauthority`)

Verified with a temporary group containing a temporary environment, and a member (`26a4b748...`).

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| grant | `POST /v2/newbrowser/putusergroupauthority` | `{ company, companyid, myuserid, share: [ { companyid: "", userid: ["<memberId>"], groupid: "<groupId>" } ] }` | `code: 200 OK`; the member then saw the environment inside the group (`authoritiesUserid` filter true) |
| revoke | `POST /v2/newbrowser/putdeletegroupauthority` | `{ groupid: ["<groupId>"] }` | `code: 200 OK`; the member no longer saw it |
| cleanup | `putalluri` created the env with `browser.categoryid` = group id; then `putdeleteshop` + `putdeleteshopfromrecycle` + `deletegroups` | - | all `code: 200` |

Creating an environment directly in a group is done by setting `browser.categoryid` to the group id returned by `putnewgroup` (field `categoryid`).

## Per-Environment Authority (`putusershopauthority`)

| Step | Route | Request shape | Observed (`authoritiesUserid` filter) |
| --- | --- | --- | --- |
| grant | `POST /v2/newbrowser/putusershopauthority` | `{ company, companyid, myuserid, share: [ { companyid: "", userid: ["<memberId>"], shopid: "<shopId>", authority: 2 } ] }` | `code: 200 OK`; member visibility false -> true |
| revoke | `POST /v2/newbrowser/putdeleteauthority` | `{ company, companyid, userid, shopids: ["<shopId>"], touserid: "<memberId>" }` | `code: 200 OK`; member visibility true -> false |
| cleanup | `putdeleteshop` + `putdeleteshopfromrecycle` | - | both `code: 200` |

`putusershopauthority` is the "share grant" API used by the authorization dialog; `authority: 2` is the granted level. `share` is an array, so several environments can be granted in one call.

## RPA Read Notes

RPA has no client-defined delete route, so only the read surface was exercised.

| Route | Method | Request | Observed |
| --- | --- | --- | --- |
| `/v2/rpa/getRpaGroupList` | GET | `{ pageIndex, pageSize }` | `{ code: 0, msgCode: 200, list: [], count, pageIndex, pageSize }` — uses `code: 0`; a POST to it is not served |
| `/v2/rpa/getRpaShopList` | GET | `{}` | `{ code: 0, msgCode: 200, list: [ { id, author, brief, coverImage, desc, rpaName, shopId, version } ], ... }` (20 rows) |
| `/v2/rpa/getRpaShopGroupList` | GET | `{}` | `{ code: 0, msgCode: 200, list: [ { ID, CreatedAt, UpdatedAt, name } ], count }` (11 groups) — note the capitalised `ID`/`CreatedAt` on this route |
| `/v2/rpa/getRpaTaskLogList` | GET | `{ status, pageIndex, pageSize }` | `{ code: 200, msgCode: 200, list: [ { id, operationId, configId, rpaName, executeType, executionTime, taskId, serialNumber } ] }` |
| `/v2/rpa/findRpaGroup` | GET | `{}` | `{ code: 200, msg: "操作成功", rerpaGroup: { companyId, groupId, name, userId } }` — note the `rerpaGroup` key spelling |
| `/v2/rpa/getRpaCarbonConfigList` | GET | `{}` | `code: 50004 获取失败` |
| `/v2/rpa/recycleRpaCarbonConfig` | GET | `{ rpaName, pageIndex, pageSize }` | `code: 50004 获取失败` |

The `rerpa*` prefix appears on several RPA response keys (`rerpaGroup`, `rerpaTaskLog`, `resRpaShop`) — treat the spelling as part of the contract.

## Plugin Read Notes

| Route | Method | Request | Observed |
| --- | --- | --- | --- |
| `/v2/plugin/getPluginCrxList` | GET | `{ orderBy, name, onlyInstall, catTypeId, catPlatformId, kernel, pageIndex, pageSize }` | **no `code` field**; `{ list: [ { uuid, name, permissions, icon, card, brief, author, catIds, ... } ] }` |
| `/v2/plugin/myPlugin` | GET | `{}` | **no `code` field**; `{ list: [ { accountIds, pluginId, uids, companyId, uuid, userName, nickName, version, ... } ] }` |
| `/v2/plugin/getPluginCategoryGroupList` | GET | `{}` | **no `code` field**; `{ list: [ { type, list, typeText } ], count, pageIndex, pageSize }` |
| `/v2/plugin/getPluginCompaniesPersonageList` | GET | `{}` | **no `code` field**; same row shape as `myPlugin`, with `nickName` populated |
| `/v2/plugin/findPluginCompanies` | GET | `{}` | `{ code: 200, msg: "ok", repluginCompanies: { ID, CreatedAt, UpdatedAt, accountIds, companyId, companyName, pluginId, pluginName, ... } }` — note the `repluginCompanies` key |
| `/v2/plugin/getAddedAndGlobalplugin` | GET | `{}` | `{ code: 200, distributionPlugin: [], globalPlugin: [] }` |
| `/v2/plugin/group/gitPluginGroupList` · `gitGroupPluginList` | GET | `{}` | response carried no `code` field |

Several plugin GET routes return their payload **without any `code`/`msg` envelope**, so a missing `code` is not an error — check for the expected data key instead.

## Retail / Admin / Message / Yun / News Read Notes

| Route | Method | Observed |
| --- | --- | --- |
| `/v2/retail/findRetailSettleConfig` | GET | `{ code: 200, msg: "ok", reretailSettleConfig: { ID, CreatedAt, UpdatedAt, configId, type, settleType, settleRatio, ... } }` |
| `/v2/retail/findRetailUserInviteCode` | GET | `{ code: 200, userInvite: { withdrawableAmount, canWithdrawable, invitedUserNumber, accumulatedCommission, accumulatedWithdrawal, invitationCode, frozenCommission, ... } }` |
| `/v2/retail/getPromotionLinkList` | GET | `{ code: 200, list: [ { ID, CreatedAt, UpdatedAt, promotionLinkId, userId, customContent, ... } ] }` |
| `/v2/retail/getUserCompanyInviteList` · `frozenList` · `getRetailWithdrawLogList` | GET | no `code`; `{ list: [], count, pageIndex, pageSize }` |
| `/v2/admin/device/third-proxy/page` | POST | `{ code: 200, msg: "OK", list: [ { id, proxyName, proxyType, tags, img, link, ... } ] }` |
| `/v2/admin/device/third-proxy/get` | POST | `{ code: 500, msg: "record not found" }` with an empty body — needs an id |
| `/v2/message/message-type/page` | POST | `{ code: 200, msg: "OK", list: [ { id, title, tinyTitle, noticeExec, status, noticeType } ] }` |
| `/v2/yun/qrcode-setting/get` | POST | `{ code: 200, msg: "OK", list: [ { id, appid, pos, title, img, data } ] }` |
| `/v2/yun/ads-space/ad` | GET | no JSON body returned for an empty query |
| `/v2/news/show/help/categories` | POST | `{ code: 200, msg: "OK", list: [ { id, lang, categoryName, apiurl, status, uid } ] }` |
| `/v2/news/show/help/list` | POST | `{ code: 200, msg: "OK", list: [ { id, url, lang, title, subtitle, keyword } ] }` |

## Plugin-Group Residue (Resolved 2026-10-10)

`POST /v2/plugin/group/createPluginGroup` writes a row even for an empty or name-less body, and it stores
`groupName` verbatim, so a probe with a generated body leaves an empty-name row. `gitPluginGroupList`
returns those rows as `{ pluginGroup: { ID, CreatedAt, UpdatedAt, groupId, companyId, userId, groupName,
isGlobal, groupType, remark }, amount }`.

The earlier claim that "there is no client-defined delete route for plugin groups" was wrong: the client
route table maps `deletePluginGroup` to `DELETE /v2/plugin/group/deletePluginGroup`, and it removes the row
on `{ groupId }` with `code: 200 ok`. Three empty-name rows were deleted with it on 2026-10-10 (IDs 506,
507, 508).

The audit's residue gate had been reporting `plugin groups scanned=0` and passing, because it called
`gitPluginGroupList` with no query parameters. The route needs `pageIndex`, `sort`, `pageSize`, and
`groupType`, and it answers `{ list: null, count: 0 }` for an empty group type. The gate now reads both
`groupType` 1 and 2, counts empty-name rows, and fails with "could not be scanned" rather than reporting
clean when the list is missing. Verified by fault injection: creating one empty-name group makes the gate
fail with `plugin groups scanned=1 probe rows=1`; deleting it returns the gate to green.

## Cloud Accounts (`/v2/newbrowser/cloud-accounts/*`)

| Route | Method | Input | Observed |
| --- | --- | --- | --- |
| `.../popup/get` | POST | `{}` | `{ reqId, code: 200, msg: "OK", data: { count } }` |
| `.../free/shop/get` | POST | `{}` | `{ ..., data: { accountId, oid } }` |
| `.../num-vis` | POST | `{}` | `{ ..., data: { total, running, expireInWeek } }` |
| `.../finger/get` | POST | `{}` | `{ code: 200, browseinfo: {...}, defaultfingerprint: {...} }` - a cloud creation template |
| `.../page`, `.../client-num/get` | POST | `{}` | `{ code: 500, msg: "请求云浏览器实例列表接口失败" }` - upstream cloud-browser service unreachable from this origin |
| `.../open/token/get` | POST | `{}` | `{ code: 500, msg: "请求云浏览器换取token接口失败" }` |
| `.../update`, `.../del`, `.../restart`, `.../browser-url/reset`, `.../free/shop/init` | POST | `{}` | `{ code: 500, msg: "record not found" }` - need a cloud instance id |
| `.../create` | POST | `{ cloudId, productId, autoRenew: 0|1, browser: <browseinfo template>, headless: bool }` (from the client call site) | Not executed: it is a paid order flow (`cloudId`/`productId` come from the purchase dialog) and needs a full `browser` fingerprint template. `{}` returns `{ code: 500, msg: "kernel is required" }` because `browser.kernel` is absent. |

The read routes answer without parameters, but every mutating cloud route either needs a paid cloud instance or proxies to an upstream service that is not reachable from the public origin.

## SSO / Cloud-Account Read Notes

| Route | Method | Request | Observed |
| --- | --- | --- | --- |
| `/v2/sso/auth/user/info/get` | POST | `{ userId }` | top-level `{ id, userId, username, mobile, email, bind: { wechat, ding, mp, mini, google } }` (no `data` wrapper) |
| `/v2/newbrowser/cloud-accounts/popup/get` | POST | `{}` | `{ count: 3 }` |
| `/v2/newbrowser/cloud-accounts/free/shop/get` | POST | `{}` | `{ accountId, oid, ... }` |
| `/v2/newbrowser/cloud-accounts/num-vis` | POST | `{}` | `{ total, running, expireInWeek }` |
| `/v2/newbrowser/cloud-accounts/page` · `client-num/get` | POST | `{page,pageSize}` | `code: 500 请求云浏览器实例列表接口失败` (upstream dependency) |
| `/v2/proxy/device/getCloudBrowserSupport` | GET | `{}` | array of region trees `{ id, parentCode, code, name, count, flag, sort, children }` |
| `/v2/proxy/device/getCloudBrowserProducts` | GET | `{}` | array of products `{ id, created_at, updated_at, product_id, product_name, product_desc, area_code, country_code, ... }` |

The SSO profile-update routes (`authSetInfo`, `changeUserinfo`, `setNewbieStep`, `setIndustryInfo`) could not be mapped to request fields from the cached chunks and were not exercised (profile mutation).

## Custom Platforms (`putuserselfuri` / `putdeleteuserselfuri`)

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| create | `POST /v2/newbrowser/putuserselfuri` | `{ company, companyid, userid, self: [ { login_url: "<url>" } ] }` | `{ reqId, code: 200, msg: "OK" }`; the row appears in `custom-platform-list` (`getalluserselfuri`) with a generated `platform_id` |
| list | `POST /v2/newbrowser/getalluserselfuri` | `{ company, companyid, userid }` | `{ code, msg, self: [ { platform_id, company_id, user_id, platform_name, platform_icon, website, login_url, created_at, updated_at } ] }` |
| delete | `POST /v2/newbrowser/putdeleteuserselfuri` | `{ company, companyid, userid, platformid: ["<platform_id>"] }` | `{ reqId, code: 200, msg: "OK" }`; verified gone, list count back to 6 |

`self` is an array of `{ login_url }` entries on create; delete takes `platformid` as an array. The list rows live under the top-level `self` key (not `data.list`). The created row always shows `platform_name: ""` - the client sends no name and the display name is derived elsewhere. Re-verified 2026-10-09: create added a row with a fresh `platform_id`, the two rows created during this study were deleted, and the list returned to its original 6 rows.

## Environment Notes / Rename (single-field writes)

| Step | Route | Request shape | Observed |
| --- | --- | --- | --- |
| rename | `POST /v2/newbrowser/retsetshopName` | `{ shopid: ["<id>"], accountName: "<new name>" }` | `{ reqId, code: 200, msg: "OK" }`; `browser-list` shows the new `name` |
| notes set | `POST /v2/newbrowser/putaddnotes` | `{ shopid: ["<id>"], notes: "<text>" }` | `code: 200 OK`; the environment's `notes` updates |
| notes clear | same | `{ shopid: ["<id>"], notes: "" }` | clears the notes |
| cleanup | `putdeleteshop` + `putdeleteshopfromrecycle` | - | both `code: 200` |

Warning: for `retsetshopName` the name key is `accountName`, and `shopid` must be an array. Sending `{ shopid:[id], shopname: ... }` or `{ ... newName: ... }` still returns `code: 200 OK` but sets the environment name to an empty string — a silent data-loss trap. `putaddnotes` uses `notes` (not `remark`), also with `shopid` as an array.

## Environment Label (`putaddlabel`)

Resolved 2026-10-09. The real shape is `{ info: [ { shopid: "<id>", label: [ { id: "<labelId>" } ] } ] }` (a per-environment `info` array whose `label` is a list of `{ id }` objects).

| Step | Call | Observation |
| --- | --- | --- |
| create tag | `POST /v2/proxy/device/updateTag { companyid, userid, label, color: <number> }` | row in `findTags` under `data.data`, `name` = `label` |
| baseline | `browser-list { labelids: [<labelId>] }` | `0` rows |
| assign | `POST /v2/newbrowser/putaddlabel { info: [ { shopid, label: [ { id } ] } ] }` | `{ reqId, code: 200, msg: "OK" }` |
| verify | `browser-list { labelids: [<labelId>] }` | **`1` row** (the tagged environment) |
| clear | `POST /v2/newbrowser/putaddlabel { info: [ { shopid, label: [] } ] }` | `code: 200 OK`; filter back to `0` rows |
| delete tag | `POST /v2/proxy/device/delTag { companyid, labelid: [<labelId>] }` | `code: 200 ok` |

**The earlier "no effect" was a wrong verification field**: the environment row's own `label` stays `null` even when the tag is applied. Verify label assignment with the `labelids` **filter**, not by reading `row.label`. Flat `labelids`/`labelid`/`label` bodies still do nothing.

## Environment Create Trap

In `putalluri`, `browser.accounts.cookie` must be the string `"[]"` (or a cookie object). Passing an array `[]` makes the create return without a usable `shopid` (the environment is not created as expected). The working template used throughout the round trips is:

```json
{
  "number": 1,
  "browser": {
    "...browseinfo": "...",
    "name": "<unique>",
    "shopid": "",
    "labelid": [],
    "proxy": { "dns": {"mode": false, "inside": true}, "deviceType": "local", "inlie": "local", "region": "random-random-random", "ipChannel": "ipinfo", "randEnv": false, "proxyaddrArr": null },
    "accounts": { "url": [], "cookie": "[]" },
    "fingerprint": { "...defaultfingerprint": "..." }
  }
}
```

## Plugin Writes (mapped from call sites, not executed)

These plugin write routes were mapped from the client call sites but not executed, because the account already has plugin state and no matching uninstall route could be identified (`uninstallNew` did not resolve to a cataloged route).

| Route | Method | Request shape |
| --- | --- | --- |
| `/v2/plugin/install` | POST | `{ pluginId, IsTeam: 1|2, pluginType: 3 }` (authorize/install a market or team plugin) |
| `/v2/plugin/bind` | PUT | `{ accountIds: ["<shopId>"], pluginId: "<id>", isTeam: <bool>, pluginCompanyId: "<id>", accountIdsCompanyId: [...] }` (from `distributeAccountDialog` and the RPA taskflow) |
| `/v2/plugin/updateTeamVisibility` | POST | `{ pluginId }` (toggle team visibility) |
| `/v2/plugin/updateGlobalVisibility` | POST | `{ pluginCompanyId }` (toggle global visibility) |
| `/v2/plugin/group/createPluginGroup` | POST | `{}` writes a record (measured); no delete route exists |
| `/v2/plugin/group/addPluginGroup` | POST | `{ groupId, pluginCompanyId }` |
| `/v2/plugin/group/copyPluginGroup` | POST | `{ groupId }` |
| `/v2/plugin/group/updatePluginGroup` | PUT | `{ groupId }` |
| `/v2/plugin/bindGrouopPlugin` | POST | `{ groupId: ["<id>"], accountIds: "<shopId>", kernel: 1|2 }` (note the `bindGrouopPlugin` spelling) |

The plugin surface is asymmetric: there are create/add/copy/bind routes but no client-defined delete route, so most plugin writes cannot be cleaned up through the cataloged API.

## Batch Credential Import (`postBatchAddUserPassword`)

Mapped from the call site (`views_accountManage_index`): the body is `{ list, kernelVersion, key }`.

| Request | Observed |
| --- | --- |
| `{ list:[{name,user_name,password,remark,platform_name,...}], kernelVersion:"" }` | `404 资源不存在` |
| `{ list:[...], kernelVersion:"141" }` | `4013 unknown error` |
| `{ list:[...], kernelVersion:"141", key:"" }` | `4013 unknown error` |
| `{ list:[...], kernelVersion:"141", key:"codex-key" }` (not a real upload key) | `404 资源不存在` |

`key` is an upload key produced by the xlsx import flow (`postbatchaddxlsx` / `creatbatchaddxlsxuuid`): the client uploads a spreadsheet, gets a `key`, then calls this route to import the parsed rows. A made-up `key` returns `404 资源不存在` and a missing one returns `4013`, so this route cannot be exercised without first uploading a valid spreadsheet. The row field names come from the spreadsheet column mapping, not from the account-record field names.



## Late Write Routes (2026-10-09, batch 55)

The last thirteen write-named routes that had no parameter evidence were probed. Four more Go request
structs leaked their names and field types through the typed error channel.

| Route | Method | Request shape | Observed |
| --- | --- | --- | --- |
| `/v2/team/member/accessApproval` | POST | `{ id:int, status:int, grantType:int, usetimeLimit:string }` | Struct `AccessApprovalReq`. `id` must be an **int** - a string returns `500 json: cannot unmarshal string into Go struct field AccessApprovalReq.id`. `usetimeLimit` must be a **string** - a number returns a type error. A non-existent `id` returns `500 查看对象不存在或无权查看`. Not executed against a real request. |
| `/v2/proxy/device/dynamics/in/userPkg` | POST | `{ vtype:string, password, orderId }` | Struct `DynamicsUserPkgReq`; `vtype` must be a string. `{}` and every string value return `200 ok` - a lenient no-op on this account. |
| `/v2/proxy/authority/syncNoAutoAuthority` | POST | `{ companyId }` | `{}` and a fake `companyId` both return `200 ok`; lenient. |
| `/v2/newbrowser/restoreUserPasswordRecycle` | POST | `{ user_password_ids: ["<id>"] }` | Key confirmed from the call site. A non-existent id returns `500 empty slice found`. |
| `/v2/tg/browser/store/ip` | POST | `{ appId, deviceId }` | Struct `BrowserStoreIpDto`; both fields are required (`{}` names `AppId`, then `DeviceId`). `{appId,deviceId}` returns `200 OK`. Camel-case keys only. |
| `/v2/tg/r/error` | POST | telemetry | `{}` returns HTTP 400. Needs a different content type or payload. |
| `/v2/collector/track` | POST | telemetry | `{}` returns HTTP 400 with `{code:400}`. |
| `/v2/newbrowser/cloud-browser/visit` | POST | `{}` | `200 OK`. |
| `/v2/newbrowser/migrate/generateuuid` | POST | `{ platform_id, custom_platform_id, name, num }` | Keys from the call site. Not executed (it writes import rows). |
| `/v2/newbrowser/creatbatchaddxlsxuuid` | POST | `{ import_type: 0|1|2 }` | `{code:200, data:{ id, company_id, user_id, import_key, ip, import_type, total, success, fail, finished, created_at, updated_at }}`. Every call writes one import-session row. |
| `/v2/newbrowser/postbatchaddxlsx` | POST | `{ list:[{...}], kernelVersion, key }` | `{ code:200, key:"<new uuid>", msg:"Success" }`. It registers the upload session and returns a fresh key; no credential row is created, which is why `postBatchAccount` looks like a no-op without a real spreadsheet upload. |

Residue from this batch: import-session rows with `id` 3049-3053 in the spreadsheet import log
(`company_id` = the test company). They are upload-session metadata, not credentials, and the
credential list stayed at its original 10 rows.

`POST /v2/sso/auth/tokenRefresh` is cataloged as a write only because it rotates the session; the
skill refresh path already exercises it and it is documented in `endpoints/token-refresh.md`.
## Blocklisted Writes Re-Probed (2026-10-09, batch 56)

The catastrophic blocklist holds 27 routes. Six of them can be probed with non-existent ids without
touching real state; they were re-probed. The rest stay unexecuted and the reason is recorded below.

| Route | Probe | Observed |
| --- | --- | --- |
| `/v2/proxy/device/batchdelete` | `{ device_ids: ["codex-probe-none"] }`, plus company/user context keys | Struct `DeviceBatchRequest`; `device_ids` must be `[]string` (`[1]` -> `401 ... device_ids Parameter type error`). Every probe returns `4007 用户信息获取失败`, including with the real company and user id in the body - the route needs an internal context the management center does not send, so it is unusable from this surface. |
| `/v2/team/role/del` | `{ id: 999999999 }`, `{ ids: [999999999] }` | Struct `IdIntReq`; `id` must be an **int** (a string returns `500 json: cannot unmarshal string into Go struct field IdIntReq.id`). Both shapes return `10022 无权修改` - this account has no permission, so the delete never runs. |
| `/v2/newbrowser/putdeleteshop` | `{ shopid: [...] }`, `{ shopids: [...] }`, `{ accountIds: [...] }`, `{ ids: [...] }`, `{ serials: [...] }` | Every key returns `500 empty slice found`. The handler filters the submitted ids against the live environment list, so a non-existent id leaves an empty slice and fails validation. Confirming the key would require deleting a real environment, so this stays unexecuted. |
| `/v2/newbrowser/putdeleteshopfromrecycle` | `{}`, `{ shopid: ["codex-probe-none"] }` | `200 OK` for both - the purge is lenient when nothing matches. |
| `/v2/team/member/change` | `{ userId, usetimeLimit, roles, deptId, id }`, then the exact current values of a real member | Struct `MemberChangeReq`: `userId` is a string (an array returns `cannot unmarshal array into Go struct field MemberChangeReq.userId of type string`) and `usetimeLimit` is an **object** (`{limit, beginDate, endDate}`), not a number. Echoing a real member's current `userId`/`roles`/`deptId`/`usetimeLimit` still returns `500 参数错误`, and a before/after snapshot of all three members proved nothing changed - an extra required field exists that no call site exposes. |
| `/v2/team/company/change` | `{ name: "<current team name>" }` | `200 修改成功`. This route **renames the company**. It was exercised only as a no-op round trip: the current name is read first, sent back unchanged, and re-read afterwards (`测试环境-123456团队`, unchanged). Never send this route an empty body or a partial name. |

### Blocklist routes that must stay unexecuted

| Reason | Routes |
| --- | --- |
| Identity and credentials | `/v2/sso/auth/bind`, `/v2/sso/auth/ubind`, `/v2/sso/auth/changePwd`, `/v2/sso/auth/modifyMobileEmail`, `/v2/sso/auth/setInfo`, `/v2/sso/forgetPwd` |
| Sends an SMS (costs money) | `/v2/sso/sendCode`, `/api/v1/users/sendsms`, `/api/v2/users/sendCode` |
| Creates an account or company | `/v2/sso/register`, `/api/v1/users`, `/api/v2/users/register`, `/api/v1/users/upnewuserpwd`, `/v2/team/company/create` |
| Real-name authentication | `/v2/team/authentication/insertAuthentication`, `/v2/team/authentication/insertAuthenticationCompanyFourElementsVerification`, `/v2/team/authentication/resetAuthentication` |
| Payment | `/v2/cost/device/repayrecharge`, `/v2/cost/device/paypal` |
| Ends the session | `/v2/team/logout` |
| Legacy `/api/*` prefix (405 HTML) | `/api/v1/users/account/batchdelete` |

The two remaining blocklist routes, `/v2/team/invite/getCode` and `/v2/newbrowser/putdeleteshop`, are
already covered: the invite code is a cataloged endpoint that the skill exercises, and the environment
delete round trip is documented under Delete Semantics.
## Proxy Recycle Family And Batch-Import Status (2026-10-09, batch 62)

### Proxy delete / recycle routes

Six routes take the same field and answer with a data-null success envelope:

| Route | Request | Observed |
| --- | --- | --- |
| `POST /v2/proxy/device/delDeviceProxyUserSelves` | `{ device_ids: ["<id>"] }` | `{ code: 200, msgCode: 200, data: null, msg: "ok", traceId: "<uuid>" }` |
| `POST /v2/proxy/device/recycleDelDeviceProxyUserSelves` | same | same |
| `POST /v2/proxy/device/recycleRecoveryDeviceProxyUserSelves` | same | same |
| `POST /v2/proxy/device/delDeviceDynamicProxies` | same | same |
| `POST /v2/proxy/device/recycleDelDeviceDynamicProxies` | same | same |
| `POST /v2/proxy/device/recycleRecoveryDeviceDynamicProxies` | same | same |

A **non-existent** id returns the same success envelope and deletes nothing, so the response cannot
distinguish "deleted" from "matched nothing". Re-read the list after any call in this family.

The four bulk variants operate on the whole recycle bin, so they were not executed:

| Route | Client call site | Effect |
| --- | --- | --- |
| `POST /v2/proxy/device/recycleDelAllDeviceProxyUserSelves` | called with no body | clears the self-proxy recycle bin |
| `POST /v2/proxy/device/recycleRecoverAllDeviceProxyUserSelves` | called with no arguments | restores every recycled self proxy |
| `POST /v2/proxy/device/recycleDelAllDeviceDynamicProxies` | `{ trademark: "general" }` | clears the dynamic-proxy recycle bin |
| `POST /v2/proxy/device/recycleRecoveryAllDeviceDynamicProxies` | `{ trademark }` | restores every recycled dynamic proxy |

All four answer `401 device id is required` to an empty body, so the binding layer wants `device_ids`
even though the client calls them without one.

### Batch-import status routes use different key names

| Route | Key | Observed |
| --- | --- | --- |
| `POST /v2/newbrowser/getbatchaddxlsxlist` | **`key`** | `404 资源不存在` for a freshly issued key (the list is empty until the import runs) |
| `POST /v2/newbrowser/getbatchaddxlsxprocess` | **`import_key`** | `200 OK` with the import-session row: `{ id, company_id, user_id, import_key, ip, import_type, total, success, fail, finished, created_at, updated_at }` |

Cross the keys and both fail: `key` on the process route returns `404 资源不存在`, and `import_key` on
the list route returns an empty body. Use `key` for the list and `import_key` for the process.

### Still unresolved after this batch

| Route | Result |
| --- | --- |
| `POST /v2/proxy/device/resetname` | `4009 请求参数错误` for `{}`, `{ device_ids: [] }`, `{ deviceid }`, and `{ device_ids, name }`; the accepted key set is still unknown |
| `POST /v2/proxy/device/dynamics/proxy` | `4011 获取失败` for every shape tried (upstream dependency) |
| `GET /v2/rpa/findRpaPlanManagement` | `404 record not found`; needs an existing plan id |
## Junk-Creating Trap: `role-group/create` And The Probe That Triggered It (2026-10-09, batch 74)

`POST /v2/team/role-group/create` writes a row even when the body carries no `name`, exactly like
`dept/create` with `{}`. Seven empty-name role groups accumulated on the account before this was
found (ids 461, 462, 463, 464, 474, 476, 478); all were removed with
`POST /v2/team/role-group/del { ids: [...] }`.

Root cause was **our own tooling**, not a stray manual call: `probe-route-values.mjs` replayed every
route whose sweep result was `live`, and the sweep had run with `--include-writes`, so write routes
were "live" too. The value probe therefore called `role-group/create` with the generic
`{companyid,userid,company}` body on every run and left one empty-name group behind each time.

Three fixes, all verified:

| Fix | Change | Evidence |
| --- | --- | --- |
| Value probe skips mutations | `probe-route-values.mjs` now classifies each route and only replays read-shaped ones (a GET is always read; otherwise the leaf must not match a write verb and must match a read verb) | The probe now reports `211 routes, 141 mutation routes skipped` |
| Sweep blocklist | `sweep-all-routes.mjs`'s CATASTROPHIC list now includes `role-group/create`, so no full sweep can call it again | The regex is checked before the write-flag logic |
| Residue guard | The audit's residue check counts empty-name, non-default role groups, not just `codex-del-` names | The audit fails with `role groups ... probe rows=1` when such a row exists |

Cleanup and re-verification: the seven empty-name groups were deleted (`7` real groups remain), then
the fixed value probe was run again and the role-group list stayed at `7` with `0` empty names.

Consequence for `FIELD_VALUES.md`: the value-domain document no longer covers replayed write routes.
Its coverage moved from 1051 to 861 enum-like fields because those write-route "values" had been
collected by invoking the writes, which is not safe. The readings that remain come from read routes
only.
### Classifier Follow-Up (2026-10-09)

Three guardrails were added after the role-group incident:

1. `scripts/lib/route-safety.mjs` is now the single classifier; the sweep, the value probe, and the
   request-parameter probe all import it, and the parameter probe throws if a case targets a write.
2. `scripts/dev/fixtures/route-safety-cases.json` holds 39 safety-correct expectations (25 must be
   blocked, 14 must stay readable) which the documentation validator asserts. The first run found
   four real bugs: `order` and `add` in the write-verb list were blocking genuine order and
   batch-import **reads**, and two read-shaped POSTs failed the read check because only the client
   name, not the last path segment, was tested.
3. Short verbs are now gated: `add`, `batch`, `order`, `set`, and `top` only count as writes when no
   read prefix (`get`, `list`, `find`, `query`, `search`, `check`, `count`, `my`, `all`, `num`,
   `fetch`) sits immediately before them. That keeps `getbatchaddxlsxprocess` readable while
   `addRoleAccount` and `retsetshopName` stay blocked.

Effect on coverage: the read-only sweep now probes **198** routes instead of 167, and the classifier
still agrees with the sweep's skip decisions on all 507 routes (`0` inconsistencies).

## Blocklisted Routes Proved Safe By Round Trip

The sweep refuses these routes because a generated body can create a row or delete broadly, so they
stay on the catastrophic blocklist. They are still testable as deliberate round trips: create a
uniquely named temporary resource, read it back, delete it, and read again. All three below were
exercised on 2026-10-09 and left no residue.

| Family | Create | Verified | Delete | Result |
| --- | --- | --- | --- | --- |
| RPA group | `POST /v2/rpa/createRpaGroup` `{name}` | `GET /v2/rpa/getRpaGroupList` shows the new `groupId` | `DELETE /v2/rpa/deleteRpaGroup` `{groupId}` | `code: 200` -> `code: 200` `操作成功` -> gone |
| Department | `POST /v2/team/dept/create` `{pid:"",departmentName,deptId:"",uids:[]}` | `POST /v2/team/getDepts` returns the new `deptId` | `POST /v2/team/dept/del` `{id}` | `code: 200` `创建成功` -> `code: 200` `删除成功` -> gone |
| Promotion link | `POST /v2/retail/createPromotionLink` `{customContent,linkName,idempotencyKey}` | `GET /v2/retail/getPromotionLinkList` returns the row | `DELETE /v2/retail/deletePromotionLink` `{id}` | `code: 200` -> `code: 200` `ok` -> gone |
| Role group | `POST /v2/team/role-group/create` `{name}` | the create response already carries the new `data.id` | `POST /v2/team/role-group/del` `{ids:[id]}` | `code: 200` `OK` -> `code: 200` `OK` -> gone |

Measured request rules:

- `createRpaGroup` answers `code: 50005` when the group name already exists.
- `createPromotionLink` rejects a `customContent` that is not 6-15 alphanumeric characters with `code: 7` `自定义内容必须为数字或字母，6-15位`.
- `dept/create` answers `code: 200` `创建成功` and the new department appears under `data.children` in `getDepts`, not at the top level.
- `deletePromotionLink` accepts `{id}`, which matches the list row's `ID` field; the row is removed from `getPromotionLinkList` afterwards.
- `role-group/create` returns the created row (including `data.id`) in its own response, so the delete does not need a list read; `role-group/del` takes `{ids:[id]}` with a numeric id.
- `createRpaPlanManagement` decodes into a `RpaPlanManagementCreate` struct. Field types were measured by feeding one wrong type at a time:
  `configId` must be a **string** (`json: cannot unmarshal number into ... configId of type string`) and `account` must be an array of objects (`account of type rpa.RpaPlanManagementAccount`), not an array of ids.
- `configId` is neither the RPA template `id` (22) nor its `shopId`; both answer `code: 50008` `RPA不存在`. An RPA carbon config has to exist first, and `getRpaCarbonConfigList` returns `code: 50004` `获取失败` for this account, so the plan round trip is blocked behind installing/configuring a template.
- `cdeviceId`/`rdeviceId` are client-generated device ids (`getDeviceId` in the bundle), not server resource ids; `getshopconfigrpa` returns `shopid`/`serial`/kernel but no device id.
- The client only ever submits `status: 1` (enabled) or `2` (disabled); a round trip must use `2` and a `startTime` at least 10 minutes in the future.

`createDept` and `createRpaGroup` write a row even for an empty body, which is why the sweep must
never probe them with a generated body. Round-tripping them is safe because the created name is
unique and the matching delete is issued before the run ends.

## Restore-In-Place Round Trip

Some writes update an existing row instead of creating one, so the safe pattern is read, write a
recognisable value, re-read to prove it stuck, then write the original value back.

| Route | Request | Measured |
| --- | --- | --- |
| `POST /v2/team/sidebar/get` (read) | `{}` | `data.menus` is a serialized string (`""` by default) and `data.version` is an optimistic counter |
| `POST /v2/team/sidebar/update` (write) | `{menus, version}` | `code: 200` `ok`; a re-read returns the new `menus`, so the write persists |
| `POST /v2/team/sidebar/update` (restore) | `{menus:"", version:<new>}` | `code: 200` `ok`; the re-read returns the original `menus` |

Verified 2026-10-09: `""` -> `["codex-sidebar-probe"]` (persisted) -> `""` (restored). `menus` is a
string that carries serialized JSON, and `version` has to be the value most recently read.

## Second-Account Re-Verification (2026-10-10)

The withheld-route round trips above were re-run against a second test account (company
`3b375e3a28ad4c3f94f13b45af683c53`, 3 environments) to confirm the behaviour is not account-specific and
to close routes the generic sweep refuses to probe.

| Family | Create | Verified by | Delete | Result |
| --- | --- | --- | --- | --- |
| RPA group | `POST /v2/rpa/createRpaGroup {name}` | `GET /v2/rpa/getRpaGroupList?pageIndex&pageSize` -> `list[].groupId` | `DELETE /v2/rpa/deleteRpaGroup {groupId}` | `code: 200` -> row present -> `code: 200` -> gone |
| RPA group (bulk) | as above | as above | `DELETE /v2/rpa/deleteRpaGroupByGroupIds {groupId:["<id>"]}` | `code: 200` -> gone |
| Department | `POST /v2/team/dept/create {pid:"", departmentName}` | `POST /v2/team/getDepts {}` -> `data.children[].deptId` | `POST /v2/team/dept/del {id}` | `code: 200` -> present under `children` -> `code: 200` -> gone |
| Promotion link | `POST /v2/retail/createPromotionLink {customContent, linkName, idempotencyKey}` | `GET /v2/retail/getPromotionLinkList` -> new `ID` | `DELETE /v2/retail/deletePromotionLink {id:<ID>}` | `code: 200` -> row present -> `code: 200 ok` -> gone |
| Role group | `POST /v2/team/role-group/create {name, companyid}` | `POST /v2/team/role-group/page` -> new `id` | `POST /v2/team/role-group/del {ids:[id]}` | total 2 -> 3 -> `code: 200` -> total 3 -> 2 |
| Plugin group | `POST /v2/plugin/group/createPluginGroup {name, pluginCompanyId:[], groupType}` | `GET /v2/plugin/group/gitPluginGroupList` | `DELETE /v2/plugin/group/deletePluginGroup {groupId}` | creates an **empty-name** row (name ignored) -> deleted |

Field-level findings from this pass:

- `getRpaGroupList` answers `code: 0` (userapi convention) with `{ list: [{ companyId, groupId, name, userId }], count }`. `createRpaGroup` answers `code: 200` with `data: {}` and does **not** echo the new id, so a list read is required before the delete.
- `deleteRpaGroup` and `deleteRpaGroupByGroupIds` share the key name `groupId` but not the type. The first takes a **string**; the second takes a **string array** (`RpaGroupAllDelete.groupId`). Passing a string to the array form answers `code: 7` `json: cannot unmarshal string into Go struct field RpaGroupAllDelete.groupId of type []string`, and the row survives the failed delete.
- `getDepts` returns the root department as `data`, with `members` for users and `children` for sub-departments. `children` is absent rather than empty when there are none.
- `getPromotionLinkList` rows use PascalCase `ID` / `CreatedAt` / `UpdatedAt` next to lower-case `promotionLinkId`, `customContent`, `invitationCode`, `linkName`, `redirectType`, `isDefault`, and `status`. `invitationCode` mirrors `customContent`. `createPromotionLink` echoes the full row, so the delete can reuse `data.ID`.
- `createPromotionLink` rejects a `customContent` that is not 6-15 alphanumeric characters with `code: 7`; re-confirmed on this account.
- `role-group/create` only attaches the row to the company when the body carries `companyid` (lowercase, no underscore). Without it the row is stored with `companyId: ""`, never appears in `role-group/page` at any page size, and no other cataloged route exposes it. One such orphan was produced by this pass before the field was identified; it is not enumerable through any listing route and was therefore left in place.
- `createPluginGroup` ignores `name`: the stored row always carries `groupName: ""`. The call answers `code: 200 ok` either way.

## RPA Carbon Config: Soft Delete And Recover (2026-10-10)

The RPA carbon-config family was recorded as blocked because `getRpaCarbonConfigList` answered
`code: 50004`. Re-checked on 2026-10-10, the list answers `code: 0` with real rows (2 configs, 10.6 KB),
so the delete side is testable as a recoverable round trip instead of a permanent delete.

| Step | Route | Request | Observed |
| --- | --- | --- | --- |
| baseline | `GET /v2/rpa/getRpaCarbonConfigList` | `?pageIndex=1&pageSize=200` | `code: 0`, 2 configs, recycle list `[]` |
| soft delete | `DELETE /v2/rpa/deleteRpaCarbonConfig` | `{configId: "<string>"}` | `code: 200` `operator success`; the row leaves the active list and appears in `recycleRpaCarbonConfig` |
| verify | `GET /v2/rpa/recycleRpaCarbonConfig` | `?pageIndex=1&pageSize=200` | `code: 0`, the deleted `configId` is now listed |
| recover | `PUT /v2/rpa/recoverRpaCarbonConfigByConfigIds` | `{configId: ["<string>"]}` | `code: 200` `operator success` |
| verify | `GET /v2/rpa/getRpaCarbonConfigList` | `?pageIndex=1&pageSize=200` | 2 configs again, recycle list back to `[]` |

Measured field traps:

- `deleteRpaCarbonConfig` takes `configId` as a **string**; `recoverRpaCarbonConfigByConfigIds` and
  `destroyRpaCarbonConfigByConfigIds` take the **same key name as a string array**. This is the third
  `groupId`/`configId` case in this family where one key name carries two different types, so the value
  shape must come from the route, never from the key name.
- `deleteRpaCarbonConfig` is a **soft delete**: the row is recoverable from the recycle list until
  `destroyRpaCarbonConfigByConfigIds` (or `...ByAll`) runs. Confirmed by the restore above.
- `config` inside each row is an array of `{type, config[]}` step objects, not a scalar.
- Rows carry `configId`, `rpaName`, `groupId`, `groupName`, `userId`, `companyId`, `top`, `CreatedAt`,
  `UpdatedAt`, `opUserId`, and `DeletedAt`; `DeletedAt` is the soft-delete marker.

`copyRpaCarbonConfig` takes `{configId: "<string>"}` and duplicates a template; it was read from the
call site rather than executed, because a copy is a new row with no matching delete pair.

## RPA Plan Management: Contract By Decode Probe (2026-10-10)

`createRpaPlanManagement` decodes into `RpaPlanManagementCreate`, and `account` is a
`datatypes.JSONSlice[rpa.RpaPlanManagementAccount]`. A wrong-typed value is rejected by the decoder
before any write, so the whole request contract can be measured without creating a plan:

| Key | Type | How it was measured |
| --- | --- | --- |
| `configId` | string | `json: cannot unmarshal object into Go struct field RpaPlanManagementCreate.configId of type string` |
| `status` | int | `... status of type int` |
| `startTime` | int64 | `... startTime of type int64` |
| `executeType`, `executeFrequency`, `intervalTime`, `priorityExecute` | int | decoder errors name each type |
| `group`, `planName`, `cdeviceId` | string | decoder errors name each type |
| `account` | array of `{shopid string, serial int}` | `... account of type datatypes.JSONSlice[...rpa.RpaPlanManagementAccount]`; element errors name `RpaPlanManagementAccount.account.shopid` (string) and `.serial` (int) |

Keys that are **not** struct fields: `accountId`, `id`, `userId` and `rdeviceId` inside an account
element. Passing an object for them is ignored by the decoder, so the request falls through to business
validation instead of failing on the type.

The client builds the body as
`{account: e.account.map(a => ({shopid: a.shopid, serial: a.serial})), configId, group, endTime,
executeFrequency, executeType, executionMonth, executionTime, executionWeek, intervalTime,
priorityExecute, runNum, startTime, status: 1, cdeviceId, rdeviceId, planName}`, with `cdeviceId` and
`rdeviceId` both set to `getDeviceId()`.

### The create is blocked by account state, not by the request

A full create with a real `configId`, a real environment (`shopid`, `serial`), `status: 2` and a
`startTime` 30 days out answers `code: 7` `Account 错误` / `accountId invalid`. The cause is measurable:
every environment on this account carries `accounts: ""`, `userPasswordIds: ""`, `passwords: []`, and
`getUserPasswordList` returns 0 rows, so no environment has a bound account for the plan to drive.
Binding a real platform credential is outside the test account, so the create stays unexecuted.

### Delete semantics, measured with synthetic ids

| Request | Result |
| --- | --- |
| `DELETE /v2/rpa/deleteRpaPlanManagementByPlanIds {planId: ["<unknown id>"]}` | `code: 200` `operator success` |
| `DELETE ... {planId: []}` | `code: 200` `operator success` |
| `DELETE ... {planId: "<string>"}` | `code: 7` `json: cannot unmarshal string into Go struct field RpaPlanManagementAllDelete.planId of type []string` |

`planId` is a **string array**, and the route reports success even when nothing matched, so the delete
response cannot prove that a plan existed.

## Request DTOs For Withheld Routes, By Decode Probe (2026-10-10)

A withheld route cannot be called with a plausible body, but its request type can still be measured
safely. The Go decoders on this origin are strict and run **before** the handler, so a body that cannot
be decoded never reaches business logic.

Two probes were used, both of which leave no row behind:

- **Array probe**: send `[]` as the whole body. A handler bound to a struct answers
  `json: cannot unmarshal array into Go value of type <pkg.Type>`, which names the request DTO.
- **Field probe**: send `{"<field>": {}}`. A scalar field answers
  `json: cannot unmarshal object into Go struct field <Type>.<field> of type <type>`, which names both
  the field and its Go type.

The technique was validated first on a read route: `POST /v2/newbrowser/getconditionshops` with `[]`
answers `cannot unmarshal array into Go value of type dto.AccountsGetPageReq` instead of returning data,
proving the decode error precedes the handler.

| Route | Request DTO |
| --- | --- |
| `POST /v2/sso/auth/changePwd` | `dto.ChangePwdReq` |
| `POST /v2/sso/forgetPwd` | `dto.ForgetPwdReq` |
| `POST /v2/sso/register` | `dto.RegisterReq` |
| `POST /v2/sso/sendCode` | `dto.CodeSendReq` |
| `POST /v2/sso/auth/bind` | `dto.BindReq` |
| `POST /v2/sso/auth/modifyMobileEmail` | `dto.ModifyVerifyCodeReq` |
| `POST /v2/team/company/create` and `POST /v2/team/company/change` | `dto.ChangeCompanyReq` (one DTO backs both) |
| `POST /v2/team/role/del` | `dto.IdIntReq` |
| `POST /v2/team/member/change` | `dto.MemberChangeReq` |

Measured field types:

| DTO | Field | Type |
| --- | --- | --- |
| `ChangePwdReq` | `newPassword` | string |
| `ForgetPwdReq` | `username`, `code`, `password` | string |
| `ModifyVerifyCodeReq` | `username`, `modifyCode`, `code` | string |
| `CodeSendReq` | `code`, `uuid`, `username` | string |
| `CodeSendReq` | `checkExist` | bool |
| `RegisterReq` | `username`, `inviter`, `code`, `password`, `rePassword`, `contact`, `source`, `last_login_port` | string |

Two keys the client sends are **not** string fields: an object for `CodeSendReq.type` and for
`RegisterReq.type` produces no decode error, so the request falls through to business validation
(`code: 10003`, "must be a registered phone or email"). The client sends `type: "findpwd"` and
`type: "reg"` on those routes, and the server does not type those values as strings.

### Safety findings from the same pass

- `POST /v2/proxy/device/batchdelete` does **not** decode-fail on an array body: it answers
  `code: 401 Parameter type error, please check`, so the request reached the handler. It is therefore
  **not** safe to send it an arbitrary or generated body, and it stays on the blocklist.
- Rapid probing of the SSO login/register family triggers a rate limit: `code: 429`, "too many login
  attempts, try again later". It appeared after roughly two dozen requests across `register`,
  `sendCode`, and the neighbouring routes. Space these probes out.
- Every probe above returned a decode or validation error, and a follow-up `POST /v2/sso/auth/myUserinfo`
  still answered `code: 200`, so the session and the account were unchanged.

### Additional DTOs And Field Types (2026-10-10, second pass)

| DTO | Field | Type | Source |
| --- | --- | --- | --- |
| `RegisterReq` | `last_login_device`, `os`, `cl` | string | field probe (these three were blocked by the rate limit in the first pass) |
| `dto.UserLockReq` (`POST /v2/sso/auth/ubind`) | `ubind` | **int** | array probe named the DTO, field probe named the type |
| `dto.UserLockReq` | `userId`, `companyId` | string | field probe |
| `dto.BindReq` (`POST /v2/sso/auth/bind`) | `username`, `code` | string | the bind dialog builds `{username, code}`; both confirmed by field probe |
| `dto.ChangeCompanyReq` (`company/change`, `company/create`) | `name` | string | field probe |

`RegisterReq` is now complete: all twelve client keys have a measured type.

The bind dialog also pins the send-code recipe: it builds
`{checkExist: true, code: hashAsciiStr(ts + "Adf3d31d" + username), uuid: ts.toString(), username}` and
posts it to `POST /v2/sso/sendCode`. `hashAsciiStr` is a client-side hash with the literal salt
`Adf3d31d`, and `uuid` is the request timestamp in milliseconds.

### `company/change` Reports Success Without Changing Anything

`dto.ChangeCompanyReq` has a single known field, `name`. A body that omits it, or that carries keys the
struct does not define (`companyName`, `id`, `companyId`), decodes into an empty struct and the route
answers `code: 200 modify success` - **without changing the company name**. Re-reading
`POST /v2/team/myCompanies` shows the original name, and the account still lists exactly one company.

The same trick against `POST /v2/team/company/create` returns `code: 10005` (verification code error) and
creates nothing, so the create path is guarded by a code that the change path is not.

Two consequences:

- `company/change` is the clearest example on this surface of "accepting a request is not proof the
  payload was understood". Always verify a change by re-reading `myCompanies`.
- A caller cannot use the `company/change` response to detect a no-op. Treat `code: 200` as accepted,
  not as applied.

### More Request DTOs, And The Last Legacy Paths (2026-10-10, third pass)

| Route | Request DTO |
| --- | --- |
| `DELETE /v2/plugin/deletePluginCrx` | `request.PluginCrxDetailApiRequest` |
| `DELETE /v2/plugin/uninstall` | `request.PluginCompaniesDeleteRequest` |
| `DELETE /v2/plugin/uninstallNew` | `request.PluginCompaniesDeleteRequest` (same DTO as uninstall) |
| `POST /v2/newbrowser/migrate/apply` | `dto.ApplyUUID` |

All four are struct-bound, so the array body failed decoding before any handler ran. The environment
count and both plugin-group lists were re-read afterwards and were unchanged.

Field-level probing is deliberately **refused** for these routes. Their field names are unknown, and a
body that names a field the struct does not define decodes into an empty struct and reaches the handler -
that is the `company/change` trap. Only the array probe, which always fails decoding for a struct-bound
handler, is safe on a route like this.

The last legacy paths answer HTTP 404 `File not found.` on the management origin as well:
`POST /api/v2/users/register`, `POST /api/v2/users/sendCode`, `POST /api/v1/users`, and
`GET /api/v1/users/sendsms`. Together with the loopback results this confirms the whole `/api/*` family
is dead on all three surfaces.

### Cloud And QR Routes Re-Checked (2026-10-10)

The earlier cloud-accounts table recorded these as upstream failures. Three of them answer cleanly now:

| Route | Request | Response shape |
| --- | --- | --- |
| `POST /v2/newbrowser/cloud-accounts/open/token/get` | `{}` | `{ reqId, code, msg, data: { token } }` - the token is sensitive, treat it as a credential |
| `POST /v2/newbrowser/cloud-accounts/client-num/get` | `{}` | `{ reqId, code, msg, data: { clientNum, keepalive } }` |
| `POST /v2/sso/mp/qrCode` | `{}` | `{ requestId, code, msg, data: { ticket, expire_seconds, url, scene } }` |

`POST /v2/newbrowser/cloud-accounts/free/shop/init` is the one that stays blocked: an array body names its
decoder (`dto.CloudBrowserOrderReq`), and an empty body answers `code: 500` `record not found`, so it
needs an existing order and was not exercised.

## Envelope-Only Read Routes, Re-Probed With Client Keys (2026-10-10)

The full-surface sweep sends one generic body per route. Many routes answer with only an envelope, so their
row fields are never observed. Counting the gap: of the 370 live routes, **259 returned at most 8 fields**,
and **231 of those were never re-probed with real parameters**. Restricting to routes the shared classifier
calls read-only leaves **57** candidates, **26** of which have request keys recovered from the client
bundle. Re-probing those is safe - a read cannot mutate - and it is where the remaining row fields live.

What the first batch produced:

| Route | Keys used | Before | After |
| --- | --- | --- | --- |
| `POST /v2/proxy/device/findRandDeviceList` | `{num:1, trademark:"self", isBind:0, inspect:0, ip_place:""}` | 0 fields, no data | `code: 200`, **1 row with 27 fields**: `created_at`, `updated_at`, `deviceid`, `companyid`, `userid`, `name`, `proxyaddr`, `proxytype`, `proxyu`, `proxyp`, `publicip`, `trademark`, `enable`, `deleteby`, `notes`, `login_at`, `api`, `ip_query_channel`, `ip_place`, `end_time`, `inspect`, `ip_type`, `serial`, `isbind`, `target_url`, `authority`, `authority_userids` |
| `POST /v2/newbrowser/getalluri` | `{fatherclass:""}` then `{fatherclass:"电商"}` | 154 bytes, 6 fields | `fatherclass` is the top-level category list (`电商`, `社交`, `支付`, `邮箱`, `问卷`, `广告`); sending one back fills `childclass`, which reaches **6.2 KB** of values (`亚马逊后台`, `亚马逊前台`, `tiktok小店`, `抖音小店后台`, `shopee后台`, `拼多多后台`, `ozon后台`, `TEMU后台`, `希音后台`, `lazada后台`, ...) |
| `POST /v2/newbrowser/cloud-accounts/getiduserlist` | `{deviceid:[], selfid:[], company:"", companyid, userid}` | 90 bytes, 6 fields | `code: 200` with five top-level collections: `{ device, self, ipideaself, shutiaoself, general }` - all `null` here because the account holds none |
| `POST /v2/team/select/company` | `{clientType:"1", id:<companyId>, device:"pc", source:"web", os:"windows"}` | `code: 500` unmarshal error | `code: 200 Ok` with the selected company record (`companyId`, `name`, `shortName`, `onwer`, `status`, `lockStatus`, `lockAt`, `createdAt`, `updateBy`, ...) |
| `POST /v2/newbrowser/storage/page` | `{account_id:"", page:1, pageSize:10, md5:"", companyId}` | 8 fields | `code: 200`; `data` is `{list:[], total:0, pageSize, currentPage}` - this account has no cached storage entries |
| `GET /v2/rpa/getRpaTaskLogList` | `{status:0, pageIndex:1, pageSize:10}` | 6 fields | `code: 200`; top-level `{list:[], count:0, pageIndex, pageSize}` - no task logs on this account |

Field types recovered from the decode errors while doing this:

| DTO | Field | Type |
| --- | --- | --- |
| `GetProxyNumb` (`cloud-accounts/getiduserlist`) | `deviceid` | **[]string**, not a string |
| `GetProxyNumb` | `selfid` | **[]string** |
| `SelectCompanyReq` (`team/select/company`) | `clientType` | **string**, not a number |

One route is blocked by permission rather than shape: `POST /v2/newbrowser/getfingerprinturiua` answers
`code: 403` for every body tried, so its fields stay unobserved on this account.

The remaining 31 envelope-only read routes have no client-derived keys, and the 205 envelope-only write
routes are not safe to replay generically - their row fields need the same real-parameter treatment, one
route at a time, before they can be documented.

### Second Batch Of Envelope-Only Reads (2026-10-10)

| Route | Keys that worked | Result |
| --- | --- | --- |
| `POST /v2/proxy/device/findNotAuthDesignateDevices` | `{device_ids:[], device_id:"<real id>", trademark:"self"}` | `code: 200` with a top-level `data` **array** (empty for that device). `device_ids` must be an **empty** array: a non-empty array of id strings, a bare string, and an object all answer `code: 401` `FindDesignateDevicesReq.device_ids Parameter type error`, while `device_id` carries the single id as a string |
| `GET /v2/cost/costmanagement/getcloudcoinsnumb` | `?company_id=<companyId>` | `code: 200`; `data` is `{ "balance": 0 }` - previously only the envelope was known |
| `POST /v2/team/version/get` | `{appId:"yunlogin", versionCode:4000307, bitness:"64"}` | `code: 200`; `data` is an **array** (empty for these values). `GetAppVersionReq.bitness` is a **string**, not a number - sending `64` answers a `cannot unmarshal number` error |
| `POST /v2/newbrowser/cloud-accounts/getshopfromproxy` | `{company:"", companyid, userid, deviceid:"<real id>", offer:0, number:10}` | `code: 200` `Success` with `{ "shopinfo": null, "total": 0 }` - the payload is **not** wrapped in `data`; that device has no bound shops |

A defect worth recording: `getshopfromproxy` with an **empty** `deviceid` answers `code: 500`
`runtime error: invalid memory address or nil pointer dereference`. The handler dereferences the device
before validating it, so a caller must always send a real id, and a client that omits it sees a server panic
rather than a validation error.

The real id used above came from the `findRandDeviceList` row discovered in the same pass, which is the
pattern for the rest of this list: read a real identifier from one route, then feed it to the route that
needs it.

### Third Batch Of Envelope-Only Reads (2026-10-10)

| Route | Method | Result |
| --- | --- | --- |
| `/v2/newbrowser/getconditionshopscount` | **GET** | `code: 200` with **top-level** counts and no `data` wrapper: `{ all: 3, authorities: 0, self: 3, share: 0, transfers: 0, code, msg }` |
| `/v2/cost/costmanagement/quickIndex` | **GET** | `code: 200`, `data: null` |
| `/v2/newbrowser/getautomac` | POST `{}` | `code: 200` with **top-level** `{ code, mac, msg }` - the machine MAC address, so treat the value as sensitive |
| `/v2/newbrowser/getalllanguage` | POST `{}` | `code: 200` with **top-level** `language` array: **192 rows**, each `{ country, ab, ecountry, name, code }`. 15,345 bytes; previously only the envelope was observed |
| `/v2/sso/getDingCfg` | POST `{}` | `code: 200`, `data` is `{ appid, redirectUrl, state }`, all strings |
| `/v2/cost/costmanagement/getcoupon` | GET | `code: 200`, `data: []` (no coupons on this account) |

Two of these are **GET** routes. Probing them with POST answers `404 page not found`, which is the same shape
as a dead path - so the method has to come from the sweep or the client route table, never from the name.
Both are recorded as GET in `route-sweep.json` and `client-routes.json`.

Correction to an earlier caution: `POST /v2/message/user-notice/noticeRed` was flagged as a suspected
write because the name reads like "mark a notice read". Probing it settles the question the other way - it is
a **read**:

- it takes no arguments (the client calls `userNoticeNoticeRed()`);
- it returns `data` as an array of per-type flags, for example
  `[{ noticeType: 4, red: false }, { noticeType: 3, red: false }, { noticeType: 1, red: false }, { noticeType: 2, red: false }]`,
  and the client uses those values to set each notice's red-dot badge;
- two calls a second apart returned the same values (only the array order varied), and re-reading
  `/v2/message/user-notice/my` before and after showed the three notice rows unchanged (`status: 2`,
  `reminderStatus: 0`).

The shared classifier was right: `noticeRed` is a read, while its sibling `readAll` is correctly classified
as a write. The unread state for this account is all four types at `red: false`.
