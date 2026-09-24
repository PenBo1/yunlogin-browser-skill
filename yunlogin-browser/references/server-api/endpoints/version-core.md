# Browser Core Versions

- Surface: server API
- Endpoint ID: `version-core`
- Method: `POST`
- Path: `/v2/team/version/getCore`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, no `msg` field
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the browser core builds available to the account for a platform and browser pair. Each entry carries the version, bitness, download URL, size, and MD5, which is what the desktop client uses to install or update a kernel.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `appVersion` | string | No | `""` | Desktop client version, for example `4.0.3.7`. |
| `versionCode` | number | No | `0` | Numeric client version, for example `4000307`. |
| `bitness` | string | No | `"64"` | Client bitness. |
| `platform` | string | No | `"windows"` | Client platform. |
| `browser` | string | No | `"chrome"` | Kernel family: `chrome` or `firefox`. |
| `deviceId` | string | No | `""` | Device identifier reported by the client. |
| `mac` | string | No | `""` | Device MAC address reported by the client. |
| `computerName` | string | No | `""` | Device name reported by the client. |
| `channel` | string | No | `""` | Distribution channel string. |
| `appId` | string | No | `"yunlogin"` | Application identifier. |

The body is device telemetry. Use a stable device identifier rather than a new random value on every call, and never place a real MAC address or machine name in the skill or a report.

### Example Request

```json
{
  "appVersion": "4.0.3.7",
  "versionCode": 4000307,
  "bitness": "64",
  "platform": "windows",
  "browser": "chrome",
  "deviceId": "<device id>_v1",
  "mac": "<mac address>",
  "computerName": "<computer name>",
  "channel": "",
  "appId": "yunlogin"
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs version-core --body-file request.json --dry-run
node scripts/yunlogin-server-api.mjs version-core --body-file request.json
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `requestId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `data` | array | Core build entries. The tested request returned 17 entries. |

The response has no `msg` field on this route.

### `data[]` Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | Record ID. |
| `appName` | string | Application name. |
| `appId` | string | Application identifier. |
| `versionCode` | number | Numeric core version. |
| `minVersionCode` | number | Minimum client version that may use the build. |
| `coreId` | number | Core identifier. |
| `minVersion` | string | Minimum client version string. |
| `version` | string | Core version string, for example `141`. |
| `bitness` | string | Bitness. |
| `platform` | string | Platform. |
| `browser` | string | Kernel family. |
| `updateType` | string | Update policy. |
| `title` | string | Release title. |
| `tag` | string | Release tag. |
| `content` | string | Release notes. |
| `url` | string | Download URL. |
| `size` | number | Download size in bytes. |
| `md5` | string | Download checksum. |
| `status` | string | Publication status. |
| `beginTime` | string | Publication time. |
| `allCompany` | number | Whether every company receives the build. |
| `companyWhiteList` | object | Company allow list for a limited release. |

### Example Response

```json
{
  "requestId": "<request id>",
  "code": 200,
  "data": [
    {
      "id": 1,
      "appName": "YunLogin",
      "appId": "yunlogin",
      "coreId": 1,
      "version": "141",
      "versionCode": 1410000,
      "bitness": "64",
      "platform": "windows",
      "browser": "chrome",
      "url": "<download url>",
      "size": 123456789,
      "md5": "<md5>",
      "status": "1"
    }
  ]
}
```

## Error Handling

Failures arrive as HTTP 200 with a non-200 business code. Read [ERRORS.md](../ERRORS.md) for the full contract.

| Code | Meaning for this endpoint |
| --- | --- |
| `200` | Success. |
| `1001` | The bearer token was rejected. Run `node scripts/yunlogin-auth.mjs ensure-server`, then ask the user for a fresh token. |
| `400` | The payload was rejected before business validation. Check the field types and required fields above. |
| `500` | The server could not decode the request or find the target. Check field types and confirm the referenced IDs exist. |
| HTTP 401 | No token was supplied. |
| HTTP 404 | The route or HTTP method is not served by this deployment. Do not retry. |

## Notes

Use this route to check which kernel builds an account can install. It is read-only but carries device telemetry in the request, so keep the values generic when documenting or testing.
