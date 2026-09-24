# Fingerprint Defaults

- Surface: server API
- Endpoint ID: `fingerprint-defaults`
- Method: `POST`
- Path: `/v2/newbrowser/getdefaultfingerlist`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, no `msg` field
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the option lists that populate the environment-creation form for a given operating system and kernel version: available kernel builds, system presets, UA versions, languages, time zones, screen sizes, WebGL data, and CPU and memory presets.

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
| `system` | string | Yes | `""` | Target operating system, for example `Windows 10`. |
| `kernel` | string | Yes | `""` | Browser kernel, for example `Chrome`. |
| `kernelVersion` | string | Yes | `""` | Major kernel version, for example `141`. |

### Example Request

```json
{
  "system": "Windows 10",
  "kernel": "Chrome",
  "kernelVersion": "141"
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs fingerprint-defaults --body '{"system":"Windows 10","kernel":"Chrome","kernelVersion":"141"}' --dry-run
node scripts/yunlogin-server-api.mjs fingerprint-defaults --body '{"system":"Windows 10","kernel":"Chrome","kernelVersion":"141"}'
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `kernelversion` | array | Available Chrome kernel builds with `id`, `version`, and `beta`. |
| `Firefoxkernelversion` | array | Available Firefox kernel builds. |
| `system` | object | System presets grouped by `Windows`, `Android`, `MacOS`, `IOS`, and `Linux`. |
| `UAversion` | array | Selectable Chrome UA major versions. |
| `FirefoxUAversion` | array | Selectable Firefox UA major versions. |
| `language` | array | Language rows with `country`, `ab`, `ecountry`, `name`, and `code`. |
| `zone` | array | Time zone strings. |
| `dpi` | array | Screen resolution presets. |
| `widowssize` | array | Window size presets. |
| `webgl` | object | WebGL vendor and renderer presets grouped by operating system. |
| `cpu` | array | CPU core presets. |
| `mem` | array | Memory presets. |
| `platformKernelversion` | object | Kernel version mapping per platform. |

The kernel list is ordered newest first. Each entry maps a build `version` to the numeric `id` that a creation template needs. The tested slice returned versions 146 to 150 with IDs 10146 to 10149 and above; Chrome 141 maps to `10141`, so the ID follows `10000 + major version`.

### Example Response

```json
{
  "code": 200,
  "kernelversion": [
    { "id": 10149, "version": "149", "beta": false }
  ],
  "system": {
    "Windows": [
      { "name": "Windows", "system": "Windows 10", "browser": "Windows NT 10.0", "platformVersion": "10.0.0" }
    ]
  },
  "UAversion": ["149"],
  "language": [
    { "country": "<country>", "ab": "en", "ecountry": "English", "name": "<name>", "code": "US" }
  ],
  "zone": ["GMT+08:00 Asia/Shanghai"],
  "dpi": ["default", "1920x1080"],
  "widowssize": ["default", "1920x1080"],
  "cpu": [4, 8, 12, 16, 20, 24],
  "mem": [8, 16, 32]
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

This endpoint returns a response with no `msg` field. Do not treat a missing `msg` as an error; read `code` instead.
