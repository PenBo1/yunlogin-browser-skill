# Browser Settings

- Surface: server API
- Endpoint ID: `browser-settings`
- Method: `POST`
- Path: `/v2/newbrowser/getsettings`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, no `msg` field
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the team browser preferences that the management center shows on the team preference page, together with the personal startup preferences and the search engine list. Use it to read the effective defaults before creating or launching an environment.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

Send an empty JSON object. The tested route ignores the body, so a malformed body still returns the settings payload.

```json
{}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs browser-settings --dry-run
node scripts/yunlogin-server-api.mjs browser-settings
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `globalSettings` | object | Team-wide defaults. |
| `kernelWhiteList` | array | Kernel allow list. Empty on the tested account. |
| `kernelversion` | string | Kernel version selection mode. |
| `personalSettings` | object | Preferences for the signed-in user. |
| `searchEngineList` | array | Search engines with `site`, `siteDesc`, and `url`. |

The response has no `msg` field on this route.

### `globalSettings` Fields

| Field | Type | Description |
| --- | --- | --- |
| `enableopen` | string | Startup mode, as a string flag. |
| `enableopenNumber` | string | Number of environments opened at startup. |
| `risk_control` | number | Risk-control switch. |
| `load_image` | string | Image loading policy. |
| `load_image_max_size` | string | Image size limit. |
| `load_video` | string | Video loading policy. |
| `play_sound` | string | Sound policy. |
| `data_sync` | string | Data sync policy. |
| `dns` | string | DNS mode. |
| `enable_gc` | string | Garbage collection switch. |
| `gc_time` | string | Garbage collection interval. |
| `enable_clear_storage` | string | Clear-storage policy. |
| `enable_clear_cookie` | string | Clear-cookie policy. |
| `random_finger` | string | Random fingerprint policy. |
| `storage` | number | Storage quota mode. |
| `monitoring` | number | Monitoring switch. |
| `bind_proxy` | number | Proxy binding requirement. |
| `expired_display` | number | Expiry display mode. |
| `device_authorities` | number | Device authorization requirement. |

Almost every value is a string flag such as `"0"` or `"1"`, not a number or boolean. Compare them as strings.

### `personalSettings` Fields

| Field | Type | Description |
| --- | --- | --- |
| `starting_env` | string | Startup environment mode. |
| `search_engine` | string | Primary search engine. |
| `dpi` | string | Default screen resolution. |
| `icon_type` | number | Icon style. |
| `language` | number | Language index. |
| `storage` | number | Personal storage mode. |
| `sub_search_engine` | string | Secondary search engine. |
| `hot_key` | string | Primary hot key. |
| `sub_hot_key` | string | Secondary hot key. |
| `batch_start` | string | Batch startup mode. |

### Example Response

```json
{
  "code": 200,
  "globalSettings": {
    "enableopen": "0",
    "enableopenNumber": "0",
    "risk_control": 1,
    "load_image": "0",
    "enable_clear_cookie": "0",
    "random_finger": "0",
    "bind_proxy": 0,
    "device_authorities": 0
  },
  "kernelWhiteList": [],
  "kernelversion": "0",
  "personalSettings": {
    "starting_env": "0",
    "search_engine": "0",
    "dpi": "0",
    "icon_type": 0,
    "language": 0,
    "batch_start": "0"
  },
  "searchEngineList": [
    { "site": "<site>", "siteDesc": "<description>", "url": "<url>" }
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

This is a read-only route and the response contains no credentials. It is the fastest way to confirm that a server session is working, although `my-user-info` reports an explicit status message.
