# Fingerprint URI

- Surface: server API
- Endpoint ID: `fingerprint-uri`
- Method: `POST`
- Path: `/v2/newbrowser/getfingerprinturi`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, no `msg` field
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the browser environment's account, proxy, and fingerprint configuration, including the default fingerprint values used by the management center.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `shopid` | string | Yes | Browser environment ID. |

### Example Request

```json
{
  "shopid": "<shopid>"
}
```

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs fingerprint-uri --body '{"shopid":"<shopid>"}' --dry-run
node scripts/yunlogin-server-api.mjs fingerprint-uri --body '{"shopid":"<shopid>"}'
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `browseinfo` | object | Current browser environment configuration. |
| `defaultfingerprint` | object | Default fingerprint configuration and supported fields. |

The tested response does not include `msg`.

### `browseinfo`

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Browser environment name. |
| `notes` | string | Notes. |
| `labelid` | array | Label IDs. |
| `user_password_ids` | array of strings | Associated account record IDs. |
| `is_star_tag` | number | Star/favorite state. |
| `top_order` | number | Top ordering value. |
| `kernelId` | number | Kernel ID. |
| `categoryid` | string | Category ID. |
| `shopid` | string | Environment ID. |
| `proxy` | object | Proxy configuration. |
| `number` | number | Numeric value associated with the environment. |
| `userPasswordPlatforms` | array | Associated account platform records. |
| `accounts` | object | Current account/cookie association. |

### `browseinfo.proxy`

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Proxy name. |
| `inlie` | string | Proxy ownership or source type. |
| `uuid` | string | Proxy ID. |
| `type` | string | Proxy protocol. |
| `product` | number | Proxy product type. |
| `PublicIP` | string | Public IP. |
| `ipChannel` | string | IP detection channel. |
| `deviceType` | string | Device or proxy type. |
| `randEnv` | boolean | Randomize fingerprint fields when the IP changes. |
| `proxyaddrArr` | array of strings | Proxy address list. |
| `region` | string | Region. |
| `dns` | object | DNS settings with `mode` and `inside`. |
| `socks5` | object | SOCKS5 settings with `Addr`, `User`, and `Passwd`. |
| `http` | object | HTTP settings with `Addr`, `User`, and `Passwd`. |
| `https` | object | HTTPS settings with `Addr`, `User`, and `Passwd`. |
| `ssh` | object | SSH settings with `Addr`, `User`, and `Passwd`. |
| `v2Ray` | object | V2Ray settings with `addr` and `uuid`. |
| `zhima` | object | Zhima proxy settings with `Url` and `Interval`. |
| `dynamic` | object | Dynamic proxy settings with `Url`, `Interval`, and `Type`. |

### `browseinfo.userPasswordPlatforms[]`

| Field | Type | Description |
| --- | --- | --- |
| `login_url` | string | Login URL. |
| `website` | string | Website. |
| `platform_icon` | string | Platform icon. |
| `platform_name` | string | Platform name. |
| `platform_id` | string | Platform ID. |
| `shop_icon` | string | Shop icon. |
| `user_id` | string | User ID. |
| `user_password_id` | string | Account record ID. |
| `custom_platform_id` | string | Custom platform ID. |
| `father_class` | string | Primary category. |
| `child_class` | string | Secondary category. |
| `grandson_class` | string | Tertiary category. |
| `user_name` | string | Login username. Redacted by the helper by default. |
| `password` | string | Password. Redacted by the helper by default. |
| `name` | string | Account record name. |
| `remark` | string | Notes. |
| `platform_lock` | number | Platform lock state. |
| `tfa` | string | 2FA secret. Redacted by the helper by default. |
| `authority` | number | Authority state. |

### `browseinfo.accounts`

| Field | Type | Description |
| --- | --- | --- |
| `cookie` | string | Serialized cookie data. Redacted by the helper by default. |
| `url` | array | URL values. |
| `name` | string | Account name. |
| `user` | string | Account username. |
| `passwd` | string | Account password. Redacted by the helper by default. |
| `loginurl` | string | Login URL. |
| `platformicon` | string | Platform icon. |
| `lock` | number | Lock state. |
| `tfa` | string | 2FA secret. Redacted by the helper by default. |

### `defaultfingerprint`

| Field | Type | Description |
| --- | --- | --- |
| `kernel` | string | Browser kernel. |
| `kernelversion` | string | Browser kernel version. |
| `system` | string | Operating system. |
| `nextsystem` | object | System values by category: `Android`, `MacOS`, `IOS`, `Linux`. |
| `UAversion` | string | User-Agent major version. |
| `ua` | string | User-Agent. |
| `language` | array | Browser language values. |
| `uilanguage` | null or value | UI language value. |
| `zone` | string | Time zone. |
| `geographic` | object | Geolocation settings: `enable`, `user`, `longitude`, `latitude`, `accuracy`. |
| `dpi` | string | Screen resolution. |
| `widowssize` | string | Window size. |
| `font` | object | Font settings: `enable` and `list`. |
| `fontfinger` | number | Font fingerprint setting. |
| `WebRTC` | number | WebRTC setting. |
| `WebRTCIP` | string | WebRTC private IP. |
| `Canvas` | number | Canvas fingerprint setting. |
| `WebGl` | number | WebGL fingerprint setting. |
| `WebGlInfo` | number | WebGL info setting. |
| `WebGLVendor` | string | WebGL vendor. |
| `WebGLRenderer` | string | WebGL renderer. |
| `AudioContext` | number | Audio context setting. |
| `SpeechVoices` | number | SpeechVoices setting. |
| `clientRects` | number | ClientRects setting. |
| `mediadevice` | number | Media device setting. |
| `cpu` | number | CPU core count. |
| `mem` | number | Memory value. |
| `devicename` | string | Device name. |
| `mac` | string | MAC address. |
| `hardware` | number | Hardware acceleration setting. |
| `Bluetooth` | number | Bluetooth setting. |
| `Donottrack` | number | Do Not Track setting. |
| `battery` | number | Battery setting. |
| `enablescanport` | number | Port scanning protection setting. |
| `scanport` | string | Port scan values. |
| `enableCookie` | number | Cookie setting. |
| `enableopen` | number | Open behavior setting. |
| `enableopenNumber` | number | Open count setting. |
| `riskControl` | number | Risk control setting. |
| `enablenotice` | number | Notification setting. |
| `enablepic` | number | Image loading setting. |
| `picsize` | string | Image size value. |
| `Enablesound` | number | Audio playback setting. |
| `Enablevideo` | number | Video loading setting. |
| `ignoreCookieErr` | number | Cookie error handling setting. |
| `enableGc` | number | Garbage collection setting. |
| `gcTime` | number | Garbage collection time. |
| `enableClearStorage` | number | Clear-storage setting. |
| `enableClearCookie` | number | Clear-cookie setting. |
| `randomFinger` | number | Random fingerprint setting. |

### Example Response

```json
{
  "code": 200,
  "browseinfo": {
    "name": "<environment name>",
    "notes": "",
    "labelid": [],
    "user_password_ids": ["<account id>"],
    "shopid": "<shopid>",
    "proxy": {
      "name": "<proxy name>",
      "inlie": "self",
      "uuid": "<proxy uuid>",
      "type": "http",
      "PublicIP": "<public ip>",
      "socks5": {
        "Addr": "<address>",
        "User": "[REDACTED]",
        "Passwd": "[REDACTED]"
      }
    },
    "userPasswordPlatforms": [
      {
        "platform_name": "<platform name>",
        "user_name": "[REDACTED]",
        "password": "[REDACTED]",
        "tfa": "[REDACTED]"
      }
    ],
    "accounts": {
      "cookie": "[REDACTED]",
      "user": "[REDACTED]",
      "passwd": "[REDACTED]",
      "lock": 0,
      "tfa": "[REDACTED]"
    }
  },
  "defaultfingerprint": {
    "kernel": "Chrome",
    "kernelversion": "141",
    "system": "Windows 10",
    "WebRTC": 0,
    "Canvas": 0,
    "WebGl": 1,
    "AudioContext": 1,
    "cpu": 4,
    "mem": 8,
    "hardware": 1,
    "randomFinger": 3
  }
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

