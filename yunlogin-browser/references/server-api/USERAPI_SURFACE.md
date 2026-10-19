# Server-Side `userapi` Surface

The management-center origin also serves the open/user API that the desktop loopback service mirrors. This document records what was discovered and measured on 2026-10-09, so the two server-side surfaces are not confused.

## Two Server Precursors, One Origin

| Surface | Server path | Local mirror | Success code | Field reference |
| --- | --- | --- | --- | --- |
| Management-center API | `/v2/...` | not exposed locally | `200` | `endpoints/` in this directory |
| User/open API | `/v2/userapi/...` | `/api/v2/userapi/...` on `http://localhost:50213` | `0` (some routes `200`) | `../api/` in this directory |

The user API routes are served directly by `https://d126447d359e70c0.yunlogin.com` at `/v2/userapi/...` -- **without** the `/api` prefix. The local desktop service exposes the same handlers at `/api/v2/userapi/...`. The source JS bundles named in `../api/` are hosted on the same origin, which is why the same shapes appear on both.

The browser-control routes (`/v2/browser/start|status|stop`) are local-only; on the server origin they return HTTP 404.

## Success-Code Convention

The user API does not use the management-center `code: 200` success rule.

| Code | Meaning |
| ---: | --- |
| `0` | Success (most userapi CRUD routes). |
| `200` | Success for `getAllUrlList/list` only. |
| `-1` | Invalid input format / validation failure. |
| `-2` | Failed to retrieve the requested quantity, not found, or no permission. |
| `-4` | Account login error. |
| `-7` | Missing permission. |

Branch on the route's documented success code, never on a global rule.

## Availability (Measured With `{}`)

| Route | Served | Observed with `{}` |
| --- | --- | --- |
| `/v2/userapi/cookie/clear` | yes | `code: 0`, `Success` (write; requires `shopid`, but returns Success without it) |
| `/v2/userapi/cookie/upsert` | yes | `code: -1`, `shopid and cookies cannot be empty` |
| `/v2/userapi/plugin/bindGroupPlugin` | no | HTTP 404 |
| `/v2/userapi/plugin/groupPluginList` | no | HTTP 404 |
| `/v2/userapi/officialproxy/list` | yes | `code: -2`, `failed find` |
| `/v2/userapi/selfproxy/update` | yes | `code: -1`, `deviceId cannot be empty` |
| `/v2/userapi/selfproxy/list` | yes | `code: -2`, `failed find` |
| `/v2/userapi/selfproxy/delete` | yes | `code: -1`, `deviceId cannot be empty` |
| `/v2/userapi/selfproxy/create` | yes | `code: -1`, `name or address cannot be empty` |
| `/v2/userapi/selfproxy/create` (valid proxy body) | yes | `code: -2`, `failed add` - the same create does not persist as the management `updateDeviceProxyUserSelves` route (see WRITE_ROUNDTRIPS.md) |
| `/v2/userapi/getAllUrlList/list` | yes | `code: 200`, `OK` |
| `/v2/userapi/user/regroup` | yes | `code: -2`, `fail message` |
| `/v2/userapi/user/delete` | yes | `code: -2`, `You do not have permission to delete` |
| `/v2/userapi/user/shopseriallist` | yes | `code: 0`, `Success` |
| `/v2/userapi/user/shopdetaillist` | yes | `code: 0`, `Success` |
| `/v2/userapi/user/update` | yes | `code: 0`, `Success` |
| `/v2/userapi/user/create` | yes | `code: 0`, `Success` (no environment was created by the empty body) |
| `/v2/userapi/group/list` | yes | `code: -2`, `Abnormal number of acquisitions` |
| `/v2/userapi/group/update` | yes | `code: -2`, group-name length error |
| `/v2/userapi/group/create` | yes | `code: -2`, group-name length error |

## Group Create / Update (exercised 2026-10-09)

With a valid body the `userapi` group routes succeed:

- `POST /v2/userapi/group/create { name }` -> `{ code: 0, data: { group: name, groupid: "<id>" }, msg: "Success" }` (name 2-40 chars).
- `POST /v2/userapi/group/list { group, offer, number }` -> `{ code: 0, data: { group: [ { name, gropid } ] } }` - rows under `data.group`, id field `gropid`, `offer`/`number` required (max 20).
- `POST /v2/userapi/group/update { groupid, name }` renames the group.

There is no `userapi` group delete; delete through the management route
`POST /v2/newbrowser/deletegroups { groupid: ["<id>"] }`. Round trip verified (create 32 -> 33 groups, delete -> 32).

## Read Routes Exercised Live

### `POST /v2/userapi/user/shopseriallist`

Request: `{ "groupId": "", "accountName": "" }`. Returns every environment in one unpaginated list (591 KB on the tested account).

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | `0` on success. |
| `msg` | string | Result message. |
| `data.list[]` | array | Environment summaries. |
| `data.list[].shopId` | string | Environment ID. |
| `data.list[].serial` | number | Environment serial number. |
| `data.list[].accountName` | string | Environment name. |
| `data.list[].groupId` | string | Group ID. |
| `data.list[].publicIp` | string | Public IP. |
| `data.list[].companyid` | string | Company ID. |

### `POST /v2/userapi/user/shopdetaillist`

Request: `{ "browserid": ["<id>"] }` (maximum 10 ids per request). Returns the full environment detail.

| Field | Type | Description |
| --- | --- | --- |
| `data.browser[]` | array | Environment detail rows. |
| `data.browser[].browserid` | string | Environment ID. |
| `data.browser[].name` | string | Environment name. |
| `data.browser[].notes` | string | Notes. |
| `data.browser[].label` | object \| null | Tag object (`id`, `name`). |
| `data.browser[].is_star_tag` | number | Starred flag. |
| `data.browser[].serial` | number | Serial number. |
| `data.browser[].proxy` | object | Proxy block (`name`, `inlie`, `uuid`, `type`, `product`, `PublicIP`, `ipChannel`, `deviceType`, `randEnv`, `region`). |
| `data.browser[].accounts` | object | Account block (`openurls`, `groupid`, `groupName`). |
| `data.browser[].accountsv2` | array \| null | Bound account records (`userPasswordId`, `name`, `platformid`, `platformName`, `url`, `user`, `remark`, `platformLock`). |

### `POST /v2/userapi/getAllUrlList/list`

No request fields. Returns the platform catalogue with `code: 200`. Rows: `fatherclass, childclass, grandsonclass, platformid, platformname, website, loginurl, fatherLabel, childLabel, grandsonLabel` (camelCase labels, no icons). It serves the **same 266 platform ids** as the management `platform-catalog`, but the management route uses **snake_case** labels and adds `platformicon`/`shop_icon` - so the two "twins" are NOT field-identical.

## Write Routes And Safety

These userapi routes write data and were not exercised destructively:

| Route | Effect | Safety |
| --- | --- | --- |
| `/v2/userapi/cookie/clear` | Clears stored cookies for one environment. | Close the environment first. Pass an explicit `shopid`. |
| `/v2/userapi/cookie/upsert` | Replaces stored cookies for one environment. | Requires `shopid` and a cookie payload. |
| `/v2/userapi/selfproxy/create|update|delete` | Manages self-hosted proxies. | Target one device by `deviceId`. |
| `/v2/userapi/user/create|update|delete|regroup` | Creates, edits, deletes, or regroups environments. | `user/delete` currently reports no permission on the tested account. |
| `/v2/userapi/group/create|update` | Creates or renames groups. | Group names have a length limit. |

## Notes

- The full request/response field tables live in the local API documents under `../api/`; the shapes were confirmed to match the server-served routes for the routes exercised here.
- `user/shopseriallist` returns every environment with no pagination -- filter client-side.
- `user/create` returned `code: 0` for an empty body without creating anything, so a success code is not proof of a write.

## `POST /v2/userapi/user/regroup` Round Trip (2026-10-10)

This is the first `userapi` write route exercised as a full round trip on the server origin.

| Step | Request | Observed |
| --- | --- | --- |
| baseline | `POST /v2/userapi/user/shopseriallist {groupId:"",accountName:""}` | one environment in group `75fb...ad76` |
| move out | `POST /v2/userapi/user/regroup {browserid:["<shopId>"],groupid:"bd8f...9431"}` | `{ code: 0, msg: "Success" }` |
| verify | re-read `shopseriallist` after a short delay | the environment reports `bd8f...9431` |
| move back | `POST /v2/userapi/user/regroup {browserid:["<shopId>"],groupid:"75fb...ad76"}` | `{ code: 0, msg: "Success" }` |
| verify | re-read `shopseriallist` after a short delay | back to `75fb...ad76`; all three environments unchanged and the group count still 12 |

Two behaviours matter when verifying this route:

- **`shopseriallist` is eventually consistent.** An immediate re-read after `regroup` still reports the
  old `groupId`; the new value appears after a short delay. A round trip that verifies with the first
  read looks like a no-op. Re-read after a delay.
- **The route is rate limited.** Two calls in quick succession return `code: -99`
  `request too frequent, retry in 1 second`. Space successive moves by more than a second.

Request shape confirmed against [../api/updateAccountGroup.md](../api/updateAccountGroup.md):
`browserid` is a []string of environment ids (at most 10 per call) and `groupid` is the destination
group id.

## `POST /v2/userapi/user/create` And `user/delete` Round Trip (2026-10-10)

| Step | Request | Observed |
| --- | --- | --- |
| baseline | `POST /v2/userapi/user/shopseriallist {groupId:"",accountName:""}` | 3 environments |
| create | `POST /v2/userapi/user/create {browser:[{name:"<unique>",notes:"",proxy:{type:"local"},showBindProxy:false,finger:{}}]}` | `{ code: 0, msg: "Success", data: { browse: [ { id, name } ] } }` |
| verify | re-read `shopseriallist` | 4 environments; the new row carries the requested name and the default group |
| delete | `POST /v2/userapi/user/delete {browserid:["<id>"]}` | `{ code: 0, msg: "Success" }` |
| verify | re-read `shopseriallist` | back to 3 environments; the row is gone |

Field notes:

- The create request wraps the payload in `browser` (an array, at most 10 entries) and needs only `name`
  and `proxy`. `proxy: {type: "local"}` is accepted without a `uuid`, so no real proxy is required to
  create an environment.
- The create **response** echoes the new row under `data.browse[]`, **not** `data.browser[]`, even though
  the request key is `browser`. The echoed `id` is the new environment id.
- The new environment lands in the default group.
- `user/delete` answered `code: 0` `Success` on this account. The earlier note that it "reports no
  permission" no longer holds. The delete was verified by re-reading the environment list.
- **`user/delete` is a SOFT delete.** It moves the environment to the recycle bin instead of removing
  it: `POST /v2/newbrowser/getrecycleshoplist` then returns the row with `account_id` (the environment
  id), `account_name`, `deleted_at`, and `group`. The audit's residue check caught exactly this, so treat
  `user/delete` alone as incomplete cleanup.
- To purge the row permanently use the management route
  `POST /v2/newbrowser/putdeleteshopfromrecycle {shopid:["<id>"]}` (note the array, and the
  management-center `code: 200` convention). It answered `code: 200 OK` and the recycle list returned to
  empty.

## `selfproxy/create|update|delete` Round Trip (2026-10-10)

The old note that the server-side create "does not persist" no longer holds. All three routes now work
on this account, verified by re-reading the list.

| Step | Request | Observed |
| --- | --- | --- |
| baseline | `POST /v2/userapi/selfproxy/list {page:1,pageSize:20,name:"",isbind:0}` | `total: 64` |
| create | `POST /v2/userapi/selfproxy/create {proxy:{name,proxytype:3,proxyaddr:"127.0.0.1:1080",notes}}` | `code: 0 Success`; the row appears in the list with `deviceid`, `companyid`, `name`, `proxyaddr`, `proxytype`, `notes`, `ip_place`, `publicip`, `createdat` |
| update (full) | `POST /v2/userapi/selfproxy/update {proxy:{deviceid,name,proxytype,proxyaddr,proxyu,proxyp,notes}}` | `code: 0 Success`; re-read shows the new `name` and the new `notes` |
| update (partial) | the same route with only `{deviceid,name,proxytype,proxyaddr}` | `code: 0 Success`, the name changes, and `notes` becomes empty |
| delete | `POST /v2/userapi/selfproxy/delete {deviceid:["<id>"]}` | `code: 0 Success`; the row is gone and the list is back to `total: 64` |

Two corrections to [../api/updateSelfProxy.md](../api/updateSelfProxy.md):

- The doc marks `proxytype` and `proxyaddr` optional and says an empty value means "no change". In
  practice a body with only `deviceid`, `name` and `notes` answers `code: -2 failed update`. Send
  `proxytype` and `proxyaddr` too.
- Omitting an optional field **clears** it rather than leaving it unchanged: dropping `notes` from the
  body emptied the stored note. Treat a missing optional field as "set to empty", and always send the
  values you want to keep.

## `cookie/upsert` And `cookie/clear` Round Trip (2026-10-10)

| Step | Request | Observed |
| --- | --- | --- |
| baseline | `POST /v2/newbrowser/getCookie {shopid}` | `code: 200 OK`; `data` is an empty **string** (0 bytes) |
| upsert | `POST /v2/userapi/cookie/upsert {shopid,cookies:[{name,value,domain,expirationDate,hostOnly,httpOnly,path,sameSite,secure,session}]}` | `{ code: 0, msg: "Success" }` |
| verify | re-read `getCookie` | `data` is a 231-byte JSON string holding one cookie, `name: codex_probe_cookie` |
| clear | `POST /v2/userapi/cookie/clear {shopid}` | `{ code: 0, msg: "Success" }` |
| verify | re-read `getCookie` | `data` is an empty string again - the environment is back to its baseline |

Notes:

- `getCookie` returns the cookie jar as a **string** in `data`, not as an array. Parse it; an empty jar is
  the empty string, not `[]`.
- An upsert **replaces** the stored jar for that environment, so read the current value first when the
  cookies matter.
- Both routes carry the "close the environment before calling this endpoint" warning in
  [../api/updateCookies.md](../api/updateCookies.md) and [../api/clearCookie.md](../api/clearCookie.md);
  these calls were made against a closed environment.

## `officialproxy/list` (2026-10-10)

The route needs paging; `{}` answers `code: -2 failed find`, which reads like a failure but is really a
missing-parameter result.

| Request | Result |
| --- | --- |
| `{page:1,pageSize:20,status:0}` | `{code: 0, msg: "Success", data: {currentPage: 1, list: [], pageSize: 20, total: 0}}` |
| the same call repeated within a second | `{code: -99, msg: "...", retry_after: <seconds>}` |

The account holds **no official proxies**, so the list is empty and the row fields could not be observed
even though they are documented in [../api/selectOfficialProxyList.md](../api/selectOfficialProxyList.md)
(`deviceid`, `companyid`, `name`, `proxyaddr`, `publicip`, `ip_place`, `proxytype` 1 cloud platform /
2 home broadband / 3 domestic dynamic / 4 overseas dynamic, plus an expiry field).

The envelope is confirmed; the row shape stays documented-but-unobserved until the account owns an
official proxy.
