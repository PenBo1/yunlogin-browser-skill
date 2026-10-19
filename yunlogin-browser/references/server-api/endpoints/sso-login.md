# SSO Login

- Surface: server API
- Endpoint ID: `sso-login`
- Method: `POST`
- Path: `/v2/sso/login`
- Tested: 2026-10-09
- Test result: HTTP 200, business `code: 200`, localized success message
- Verified: 2026-10-09 by a live login call with a test account

## Purpose

Authenticates a YunLogin account with a username and password and returns a
bearer token for the management-center API. This route is not a substitute for
`token-refresh`: login establishes a session from credentials, while
`token-refresh` exchanges an existing valid bearer token for a fresh one.

This endpoint does not require an `Authorization` header. A minimal tested
request containing only `username` and `password` succeeded.

## Request

### Headers

| Header | Required | Observed value | Meaning |
| --- | --- | --- | --- |
| `Authorization` | No | Not sent | This route authenticates with the request body, not a bearer token. |
| `Accept` | Yes | `application/json, text/plain, */*` | Requests a JSON-compatible response. |
| `Content-Type` | Yes | `application/json;charset=UTF-8` | Declares the JSON request body. |
| `ApiSource` | No | `1` | Identifies the client API source. |
| `AppInfo` | No | `appVersion=...&versionCode=...&bitness=...` | Client, device, and build metadata. It contains device identifiers, so treat it as sensitive. |
| `Origin` | No | `chrome-extension://iginhnpfilcejkhoifnjlhmcgoifmkao` | Browser-extension origin that made the request. |
| `Cookie` | No | Browser cookie string | Optional existing session and analytics state. The minimal verified request succeeded without a Cookie header. Never print or commit it. |
| `Accept-Language` | No | `zh-CN,zh;q=0.9` | Preferred response language metadata. |
| `Dnt` | No | `1` | Browser do-not-track hint. |
| `Sec-Ch-Ua` | No | `"Google Chrome";v="107", ...` | Browser client hints. |
| `Sec-Ch-Ua-Mobile` | No | `?0` | Browser client hint for desktop mode. |
| `Sec-Ch-Ua-Platform` | No | `"Windows"` | Browser client hint for the operating system. |
| `Sec-Fetch-Dest` | No | `empty` | Browser fetch metadata. |
| `Sec-Fetch-Mode` | No | `cors` | Browser fetch metadata. |
| `Sec-Fetch-Site` | No | `none` | Browser fetch metadata. |
| `User-Agent` | No | `Mozilla/5.0 ... Chrome/107.0.0.0 ...` | Client identification. |
| compressed | No | curl transport option | Requests a compressed transport response; it is not an HTTP header. |

`appinfo` is a single `&`-separated metadata string. The observed keys are:

| AppInfo field | Type | Meaning |
| --- | --- | --- |
| `appVersion` | string | YunLogin desktop application version, observed as `4.0.3.7`. |
| `versionCode` | string | Numeric application build code, observed as `4000307`. |
| `bitness` | string | Client process architecture, observed as `64`. |
| `platform` | string | Operating system platform, observed as `windows`. |
| `browser` | string | Embedded browser family, observed as `chrome`. |
| `deviceId` | string | Stable device fingerprint identifier. Sensitive. |
| `mac` | string | Machine MAC address. Sensitive. |
| `computerName` | string | Windows computer name. Sensitive. |
| `channel` | string | Distribution or client channel label. |

### Body

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `username` | string | Yes | Empty | Login account, such as an email address, phone number, or YunLogin account identifier. Treat it as sensitive. |
| `password` | string | Yes | Empty | Account password. Never log, store in the repository, or pass on a persistent command line. |
| `code` | string | No | Empty | Verification code used by deployments or accounts that require an additional challenge. |
| `os` | string | No | `windows` | Client operating-system descriptor. |
| `source` | string | No | `112` | Client or integration source code observed in the desktop login flow. |
| `last_login_port` | string | No | `client` | Prior login entry point, observed as `client`. |
| `last_login_device` | string | No | `pc` | Prior login device class, observed as `pc`. |
| `cl` | string | No | Empty | Client/channel label, observed as `8V-fVcqy6vfvFh (1)`. |

`cl` is **not** a device id. It is the client/channel label: the web login derives it from
`appInfo.channel`, and the client maps `channel` to `clientType` (while `platform` is the device and
`deviceId` is split into `clientId`). Verified live on 2026-10-09 by field-type probing of `LoginReq`:

| Body key | Result |
| --- | --- |
| `cl` | Recognised: `json: cannot unmarshal object into Go struct field LoginReq.cl of type string` |
| `uuid` | Recognised string |
| `last_login_device` | Recognised string |
| `deviceId` / `device_id` / `clientId` | **Not fields** - sent as an object they pass the decoder and the request fails on credentials (`10003`), so the login body has no device-id field at all |

The real device fingerprint lives in the `AppInfo` header (`deviceId=...`) and in the separate
device list (`POST /v2/team/company/user/devices`, whose `deviceId` is a 32-char hex value). Use the
`AppInfo.deviceId`, not `cl`, when you need the device.

### Minimal Request

The minimal verified JSON body is:

```json
{
  "username": "<account>",
  "password": "<password>"
}
```

### Full Observed Request

The desktop client sends all optional fields in the observed request:

```json
{
  "username": "<account>",
  "password": "<password>",
  "code": "",
  "os": "windows",
  "source": "112",
  "last_login_port": "client",
  "last_login_device": "pc",
  "cl": "<channel label>"
}
```

### Helper Commands

Store credentials in environment variables rather than a persistent command
line when possible:

```powershell
$env:YUNLOGIN_LOGIN_USERNAME = "<account>"
$env:YUNLOGIN_LOGIN_PASSWORD = "<password>"
node scripts/yunlogin-auth.mjs login --dry-run
node scripts/yunlogin-auth.mjs login

# Generic catalog helper, using a temporary body file outside the repository
node scripts/yunlogin-server-api.mjs sso-login --body-file login.json --dry-run
```

`yunlogin-auth.mjs login` caches the returned token through the normal
user-level server session store. The generic helper is useful when the caller
needs to inspect or forward the raw response without caching it.

## Response

| Field | Type | Description |
| --- | --- | --- |
| `requestId` | string | Server-generated request correlation identifier. |
| `code` | number | Business result. `200` means success. |
| `msg` | string | Localized operator-facing result message. The tested success response returned a Chinese success message. |
| `data` | object | Login result object. |
| `data.token` | string | Bearer token for subsequent management-center requests. Sensitive; never print it. Observed length: 160 characters. |
| `data.openId` | string | Open identifier returned by the identity service. It was empty on the tested account. |
| `data.expire` | string | Timestamp with an offset describing when the returned token expires. |
| `data.need` | number | Additional-step flag. Observed as `0` when no additional login step was requested. Treat other values as client-flow flags. |
| `data.source` | string | Login source echoed by the server. Observed as `112`. |

### Example Response

```json
{
  "requestId": "25c905a3-1df7-4c66-99d1-89de893d577a",
  "code": 200,
  "msg": "<localized success message>",
  "data": {
    "token": "<bearer token>",
    "openId": "",
    "expire": "2027-02-10T17:57:02.17072749+08:00",
    "need": 0,
    "source": "112"
  }
}
```

## Error Handling

Failures arrive as HTTP 200 with a non-200 business code. Read [ERRORS.md](../ERRORS.md) for the shared contract.

| Code or status | Meaning for this endpoint |
| --- | --- |
| `200` | Login succeeded. Read `data.token` and `data.expire`. |
| Any other business code | Login failed. Surface `msg` to the operator and do not treat HTTP 200 as success. |
| `400` | The request body was rejected before business validation. Confirm the JSON and field types. |
| `500` | The server could not decode the request or complete the account lookup. |
| HTTP 401 | Unexpected for this route because it does not request a bearer token; treat it as a deployment or gateway policy change. |
| HTTP 404 | The route or HTTP method is not served by this deployment. Do not retry. |

Invalid credentials were not probed repeatedly because that can lock an account. Use the returned `code` and `msg` for diagnosis rather than deliberately repeating failed logins.

## Notes

- `yunlogin-auth.mjs login` sends the optional client fields with defaults and stores the returned token in the user-level session cache.
- When the account belongs to multiple companies, login succeeds but the cache step returns `needsCompany: true`; re-run with `--company-id` for the intended company.
- `yunlogin-server-api.mjs sso-login` recognizes `requires_auth: false`, so `--dry-run` works without a bearer token and live calls do not add an Authorization header.
- The tested deployment accepted the minimal `{username,password}` body without Cookie, AppInfo, or ApiSource headers. Keep the optional fields when reproducing the desktop client flow.
- Treat `username`, `password`, `Cookie`, `AppInfo`, `token`, device IDs, and the authenticated response as sensitive.
- Use the returned token only after verifying it through `my-user-info` or `token-refresh`; never write it into this skill.

## See Also

- [RESPONSE_SHAPES.md](../RESPONSE_SHAPES.md) - envelope, key-name, and type traps across the surface.
- [WRITE_ROUNDTRIPS.md](../WRITE_ROUNDTRIPS.md) - verified write round trips and silent-failure notes.
- [ERRORS.md](../ERRORS.md) - HTTP vs business code contract.
