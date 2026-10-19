# Company User Devices

- Surface: server API
- Endpoint ID: `company-user-devices`
- Method: `POST`
- Path: `/v2/team/company/user/devices`
- Tested: 2026-10-09
- Test result: HTTP 200, business `code: 200`, message `查询成功`, after the HTTP method was corrected from `GET` to `POST`
- Verified: 2026-10-09 by a live call with the cached server token

## Purpose

Returns the devices registered against company users. Backs the "device management"
view in the management center.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `pageIndex` | number | No | `1` | One-based page index. |
| `pageSize` | number | No | `10` | Page size. |

Send `{}` for the defaults. The company and user scope come from the token.

Note: candidate filter keys (`userId`, `userName`, `deviceId`, `keyword`, `online_status`,
`platformType`) were sent and did not change the result set or `count`, so their effect is
unconfirmed. Only pagination was observed to work.

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs company-user-devices --dry-run
node scripts/yunlogin-server-api.mjs company-user-devices
```

## Response

Example response captured live on 2026-10-09 with placeholder values. `count` reflects the
tested company and is not a fixed value.

```json
{
  "requestId": "<uuid>",
  "code": 200,
  "msg": "查询成功",
  "data": {
    "count": 3244,
    "pageIndex": 1,
    "pageSize": 10,
    "list": [
      {
        "id": 47877,
        "userId": "<user id>",
        "userName": "<user display name>",
        "companyId": "<company id>",
        "deviceId": "<device hash>",
        "version": "4.0.3.7",
        "platformType": 1,
        "devType": 1,
        "online_status": 2,
        "devName": "DESKTOP-SUI83HB",
        "remark": "",
        "ip": "<ip>",
        "createdAt": "<timestamp>",
        "updatedAt": "<timestamp>"
      }
    ]
  }
}
```

| Field | Type | Meaning |
| --- | --- | --- |
| `count` | number | Reported aggregate (3244 in the tested company). **It is not the pageable row total**: the list returns at most 33 rows and `pageIndex > 1` returns an empty `list`, so treat `count` as a denormalised counter, not `list.length * pages`. |
| `pageIndex` | number | Echoed page index. |
| `pageSize` | number | Echoed page size. |
| `list[].id` | number | Internal device-record id. |
| `list[].userId` | string | Owning user id. |
| `list[].userName` | string | Owning user display name. |
| `list[].companyId` | string | Company id. |
| `list[].deviceId` | string | Device fingerprint hash. |
| `list[].version` | string | Client version that registered the device. |
| `list[].platformType` | number | Platform family. `1` = Windows desktop. |
| `list[].devType` | number | Device type. `1` = PC. |
| `list[].online_status` | number | Online state. `2` in the tested rows. |
| `list[].devName` | string | Machine name. |
| `list[].remark` | string | Free-text remark. |
| `list[].ip` | string | Last seen IP. |
| `list[].createdAt` | string (RFC3339) | First-seen timestamp. |
| `list[].updatedAt` | string (RFC3339) | Last-seen timestamp. |

## Device Identity (does the login request carry this `deviceId`?)

Researched live on 2026-10-09 against the same origin and the client bundle:

- **No.** The management-center login `POST /v2/sso/login` (`LoginReq`) has **no device-id field**.
  Its recognised fields are `username`, `code`, `uuid`, `os`, `source`, `last_login_port`,
  `last_login_device`, and `cl`. `last_login_device` is a *type* string (`"pc"` / `"mobile"`),
  not an id. The request interceptor only adds `Authorization` and `pay-lang` headers - no device header.
- The `deviceId` returned here is a 32-character **hex** fingerprint (for example
  `ec0f8fc23c8f9ff95ab5d509fe2c4c32`) belonging to a registered **desktop client device**, paired with
  `devName` (machine hostname, e.g. `DESKTOP-SUI83HB`), `version` (client build, e.g. `4.0.3.7`),
  `platformType` / `devType`, `ip`, and `online_status`.
- The only `deviceId` that appears in the web request stream is inside
  `POST /v2/collector/track` (telemetry). That value is a **different id space** - a lowercase
  base32-style id (for example `3rrd4gk6blk5iifkqzp2s41fyw7z20ih`) sourced from the client's
  `configStore.deviceId`. It did **not** match any `deviceId` in this endpoint's list.

`cl` in the login body is **not** a device either - it is the client channel label (`appInfo.channel`, mapped to `clientType`). The login `LoginReq` has no `deviceId`/`clientId` field at all, and this device list has no `cl`/`channel` column. See the sso-login endpoint document for the live field-probe evidence.

The device list `deviceId` is the same identifier as `clientId` in `POST /v2/team/loginlogs` - a per-login row carries the fingerprint of the device used, so you can join a login to a device by `loginlogs.clientId == user/devices.deviceId` (verified 9/10 in a sample).

So this endpoint lists devices registered by the desktop client, and it is **not** driven by a
device id in the login request (the login request has none). If you need to correlate a row here
with a specific machine, match on `devName` + `version` + `ip`, not on the login payload.

Paging caveat (re-tested 2026-10-09): `pageIndex=1, pageSize=10` returns 10 rows; `pageSize=50` or `100` returns 33; `pageIndex=2/3/5` returns 0 rows. The `count` field stays at 3244 throughout. So the endpoint exposes a single page of up to 33 user devices and `count` is a separate aggregate.

## Error Handling

| Code | Meaning for this endpoint |
| --- | --- |
| `200` | Success. |
| HTTP 404 | The route is served on `POST` only. A `GET` returns HTTP 404. |
| HTTP 401 | No token was supplied. |


**Additional accepted request fields** (recognised by the decoder but not in the minimal tested body; see PARAMETER_MATRIX.md batch 32): `userid, companyid, companyId, pageIndex, pageSize`.

## See Also

- [RESPONSE_SHAPES.md](../RESPONSE_SHAPES.md)
- [ERRORS.md](../ERRORS.md)
