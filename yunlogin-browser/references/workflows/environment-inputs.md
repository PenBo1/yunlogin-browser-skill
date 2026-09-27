# Environment Input Sources

Environment writes are upserts. `POST /v2/newbrowser/putalluri` creates an
environment when `browser.shopid` is empty and updates the environment named by
`browser.shopid` when it is set. One route therefore covers create and modify,
and both use the same input rules.

Every field in the write body has a documented source. Resolve those sources
with reads before the write. Do not invent IDs, and do not send a response from
another route back unchanged without applying the type rules below.

## Write Routes

| Intent | Transport | Route | Notes |
| --- | --- | --- | --- |
| Create | server | `POST /v2/newbrowser/putalluri` | `browser.shopid` empty. |
| Modify | server | `POST /v2/newbrowser/putalluri` | `browser.shopid` set to the target. |
| Modify (partial) | local | `POST /api/v2/userapi/user/update` | Send only the changed fields, keyed by `browserid`. |
| Create (fallback) | local | `POST /api/v2/userapi/user/create` | Uses a different fingerprint schema. |

The server route replaces the stored configuration with the body it receives, so
a partial `browser` object drops the fields it omits. The local update route
patches only the fields it receives, which makes it the safer choice for a small
change on an environment that already carries accounts, cookies, or a proxy.

The two create routes read the presentation attributes from different places,
and the local route silently ignores a wrong one:

| Attribute | Server route | Local route |
| --- | --- | --- |
| Remark | `browser.notes` | `browser[].notes` |
| Group | `browser.categoryid` | `browser[].accounts.groupid` |
| Tags | `browser.labelid` | Not supported. Tags cannot be set on this route. |

A top-level `groupid` on the local route is accepted and then ignored, which is
how an environment ends up in the default group. Ask the user which group,
remark, and tags to apply before creating; `scripts/yunlogin-env.mjs create`
stops with `needsAttributes` when none were given.

## Input Sources

| Write field | Read it from | Notes |
| --- | --- | --- |
| `browser.name` | the user | Normalize before sending. See the name rules in [environment-lifecycle.md](./environment-lifecycle.md). |
| `browser.notes` | the user, or `browseinfo.notes` | |
| `browser.labelid` | `POST /v2/proxy/device/findTags` | Array of `labelid` values. |
| `browser.categoryid` | `POST /v2/newbrowser/getgroups` | The group ID is returned as `gropid`, not `categoryid`. |
| `browser.kernelId` | `POST /v2/newbrowser/getdefaultfingerlist` | `10000 + major version`. Chrome 141 is `10141`. |
| `browser.fingerprint` | `POST /v2/newbrowser/getdefaultfingerlist`, then the top-level `defaultfingerprint` object returned by `getfingerprinturi` | Start from `defaultfingerprint` and apply the type rules below. It is a sibling of `browseinfo`, not a field inside it. |
| `browser.proxy` (direct) | none | Send the direct-connection block from [environment-create.md](../server-api/endpoints/environment-create.md). |
| `browser.proxy` (stored) | `POST /v2/proxy/device/findDeviceProxyUserSelves` or `POST /v2/proxy/device/vcnplist` | Build the block from the selected row. See the official-proxy shape below. |
| `browser.accounts` | `POST /v2/newbrowser/getUserPasswordList` | Send `{"url":[],"cookie":"[]"}` when no account is bound. |
| `companyid`, `userid` | `POST /v2/team/myCompanies` | The read response spells the field `companyId`; the write body spells it `companyid`. The helper fills both from the cached session. |
| current values for a modify | `POST /v2/newbrowser/getfingerprinturi` with `{"shopid":"<id>"}` | Returns `browseinfo` (current values) and `defaultfingerprint` (defaults). |
| target identifier | `POST /v2/newbrowser/getconditionshops` | Returns `shopid` for each row. |

`getfingerprinturi` also answers without a `shopid`. In that form it returns the
base template for the requested kernel and is the template source used by
`create`.

### Official Proxy Block

A stored official proxy needs its own block. The management center sends the
shape below; the credential fields are placeholders here and must never be
written into the skill, a log, or a response.

```json
{
  "dns": { "mode": false, "inside": true },
  "deviceType": "official",
  "inlie": "official",
  "name": "<proxy name>",
  "uuid": "<proxy uuid>",
  "PublicIP": "<public ip>",
  "product": 2,
  "type": "socks5",
  "socks5": { "Addr": "<host:port>", "User": "<proxy user>", "Passwd": "<proxy password>" },
  "region": "random-random-random",
  "ipChannel": "ipinfo",
  "randEnv": false,
  "proxyaddrArr": null
}
```

| Field | Comes from |
| --- | --- |
| `uuid` | The proxy row `uuid`; it becomes `proxyId` on the environment. |
| `name` | The proxy row `name`. |
| `PublicIP` | The proxy row `PublicIP`. |
| `product` | The proxy row `product`. |
| `type` and the matching sub-object | The proxy protocol. `socks5` uses `Addr`, `User`, and `Passwd`; the same pattern applies to `http`, `https`, and `ssh`. |

Read the environment back after the write and confirm `device_type` and
`proxyDel`. A block that the server stores blank shows up as "proxy deleted".

## Create Sequence

1. Confirm the target company and user. `my-companies` returns `data[].companyId`; the cached session already carries the selected company and user.
2. Resolve the kernel. Call `getdefaultfingerlist` with `{system, kernel, kernelVersion}` and take `id` for `browser.kernelId`.
3. Resolve the optional presentation attributes: group from `getgroups`, tags from `findTags`. Ask the user before applying either.
4. Resolve the proxy. Omit it for a direct connection, or copy a stored proxy row.
5. Load the base template with `getfingerprinturi`.
6. Assemble `{number, randProxy, batch_platform_id, batch_custom_id, batchProxy, browser}`.
7. Send `putalluri` and read the returned `shopid`.

`scripts/yunlogin-env.mjs create` performs steps 2, 5, and 6, and fills
`companyid` and `userid` from the cached session.

## Modify Sequence

A modify is the create write plus the target `shopid`. Reusing the create schema
is what keeps the field types correct.

1. Resolve the target with `getconditionshops`, then confirm the id and the name with the user.
2. Build a create-schema body and set `browser.shopid` to the target id.
3. Send `putalluri`.
4. Re-read the environment and compare the field you changed.

For a small change on an environment that already carries account bindings, use
the local partial update instead. It sends only the changed fields, so it cannot
drop data the body omits:

```json
{
  "browser": [
    { "browserid": "<account id>", "name": "<environment name>", "notes": "<new remark>" }
  ]
}
```

```powershell
node scripts/yunlogin-api.mjs local POST /api/v2/userapi/user/update --body-file update.json
```

Do not send `browseinfo` back verbatim. It is a read projection, and its field
types do not match the write struct.

## Field Type Rules

Sending a read response unchanged fails with a Go unmarshal error. Observed live
on 2026-09-27 while testing the modify path:

| Field | Read type in `browseinfo` | Write type required | Failure when sent unchanged |
| --- | --- | --- | --- |
| `user_password_ids` | string | array of strings | `cannot unmarshal string into Go struct field UiConfig.browser.BrowserInfo.user_password_ids of type []string` |
| `userPasswordPlatforms` | string | array of objects | Rejected with the same message shape. |
| `labelid` | null or array | array | Send `[]` when the value is null. |
| `accounts.url` | null or array | array | Send `[]`. |
| `accounts.cookie` | string | JSON string or object | Send `"[]"` when nothing is bound. |
| `fingerprint.enableCookie` | string | number | `cannot unmarshal string into Go struct field UiConfig.browser.fingerprint.enableCookie of type int` |
| `fingerprint.enableClearCookie` | string | number | Same message shape. |
| `fingerprint.ignoreCookieErr` | string | number | Same message shape. |
| `fingerprint` | returned as a top-level `defaultfingerprint` object | required inside `browser` | Rejected when `browser.fingerprint` is absent. |

The helper redacts `user_password_ids`, `userPasswordPlatforms`,
`accounts.cookie`, `accounts.user`, `accounts.passwd`, and `accounts.tfa` before
printing a response. A redacted value cannot be written back. Rebuild those
fields from `getUserPasswordList` instead of copying them from a printed
response.

## Verified Results

Exercised live on 2026-09-27 against the tested account. Every temporary
environment was deleted afterwards, and a follow-up `getconditionshops`
returned zero matches.

| Check | Result |
| --- | --- |
| `getdefaultfingerlist` for Windows 10 / Chrome / 141 | `code: 200`; 17 kernel builds, the `UAversion` list, and the `cpu` and `mem` presets returned. |
| `getfingerprinturi` without `shopid` | Returned the base template used by `create`. |
| `getfingerprinturi` with `shopid` | Returned `browseinfo` plus a 50-field `defaultfingerprint` object. |
| `putalluri` with `browser.shopid` set to an existing environment | `code: 200`; the same `shopid` was returned, no duplicate row appeared, and the changed `notes` read back. The existing `device_type` was preserved. |
| `putalluri` with `browseinfo` sent unchanged | `code: 500` with the unmarshal errors listed above; nothing was written. |
| `my-companies` | `code: 200`; five companies, each with a `companyId` field. |
| `putalluri` with the official-proxy block and `browser.shopid` set | `code: 200`; the same `shopid` came back, and the read-back showed `device_type: official`, `ipChannel: ipinfo`, the supplied `proxyId`, and `proxyDel: 0` |

## Common Failures

| Symptom | Cause |
| --- | --- |
| `code: 500`, `unknown error` | A required sub-object is missing, usually `browser.fingerprint`. |
| `cannot unmarshal string into Go struct field` | A read value was reused as a write value without coercion. |
| `[REDACTED]` appears in a value you need | The helper redacted a sensitive field. Re-read the source route instead of using the redacted copy. |
| The environment keeps its old values | The body omitted the field, or `browser.shopid` was not set, so a second environment was created. |
| The list shows "proxy deleted" | The proxy block was empty. Send the direct-connection block or a resolved stored proxy. |
| The environment landed in the default group | The local route was given a top-level `groupid`, which it ignores. Send `accounts.groupid`. |
| Tags are missing after a create | The create fell back to the local route, which has no tag field. Create with `--transport server` when tags matter. |
