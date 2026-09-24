# Local Client API (api/v1)

The YunLogin desktop application listens on two loopback ports. Keep them separate:

| Port | Prefix | Documented in |
| --- | --- | --- |
| 50213 | `/api/v2/...` | [api/README.md](../api/README.md) |
| 52446 | `/api/v1/client/...` | This document |

The `52446` service is the client-side helper surface. It serves machine facts that the fingerprint engine needs, so it answers without a bearer token on a local desktop. The origin is loopback-only; never expose it beyond the machine.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/v1/client/gpu_info` | Returns the local GPU adapters. |
| POST | `/api/v1/client/clean_env` | Clears the local data of one environment. |
| GET | `/api/v1/settings/get_config` | Returns client and cloud configuration, including credentials. Treat as highly sensitive. |

## POST /api/v1/client/gpu_info

### Purpose

Returns the graphics adapters that the desktop reports. The fingerprint creation flow uses this data to fill `WebGLVendor` and `WebGLRenderer` so a new environment matches the machine that runs it.

### Request

Send an empty JSON object. No bearer token is required on the tested build.

```powershell
node scripts/yunlogin-env.mjs list --transport local
```

The environment helper reads this route internally when it builds a creation template. To call it directly:

```powershell
curl.exe -s -X POST "http://127.0.0.1:52446/api/v1/client/gpu_info" -H "Content-Type: text/plain;charset=UTF-8" --data-raw "{}"
```

### Response

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Status code. `0` means success. |
| `msg` | string | Status message. Observed value: `Success`. |
| `data.adapters` | array | Graphics adapter list. |

### `data.adapters[]` Fields

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Adapter name, for example `AMD Radeon R5 220`. |
| `vendorName` | string | Adapter vendor, for example `AMD`. |
| `vendorId` | number | Vendor identifier. |
| `deviceId` | number | Device identifier. |
| `dedicatedVideoMemory` | number | Dedicated video memory in bytes. |
| `dedicatedSystemMemory` | number | Dedicated system memory in bytes. |
| `sharedSystemMemory` | number | Shared system memory in bytes. |
| `softwareAdapter` | boolean | Whether the adapter is software-emulated. |

### Example Response

```json
{
  "code": 0,
  "msg": "Success",
  "data": {
    "adapters": [
      {
        "name": "AMD Radeon R5 220",
        "vendorName": "AMD",
        "vendorId": 4098,
        "deviceId": 26873,
        "dedicatedVideoMemory": 2133659648,
        "dedicatedSystemMemory": 0,
        "sharedSystemMemory": 4026531840,
        "softwareAdapter": false
      }
    ]
  }
}
```

## POST /api/v1/client/clean_env

### Purpose

Clears the locally cached data of one environment: storage, cookies, and the cached profile that the desktop keeps for that environment ID. The server-side environment record is not deleted.

This is a destructive local operation. Confirm the environment with the user before running it.

### Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `env_id` | string | Yes | Environment ID. |
| `is_fireFox` | boolean | Yes | Set `true` only for a Firefox kernel environment. |

```powershell
node scripts/yunlogin-env.mjs clean-env --account-id <account id> --confirm-clean --dry-run
node scripts/yunlogin-env.mjs clean-env --account-id <account id> --confirm-clean
```

### Response

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Status code. `0` means success. |
| `msg` | string | Status message. Observed value: `Success`. |

```json
{
  "code": 0,
  "msg": "Success"
}
```

## GET /api/v1/settings/get_config

### Purpose

Returns the desktop client configuration. The payload mixes harmless settings with live cloud credentials, so treat the whole response as a secret.

### Request

No parameters and no bearer token on the tested build.

### Response

| Field | Type | Sensitivity |
| --- | --- | --- |
| `code` | number | `0` means success. |
| `msg` | string | Status message. |
| `data.userCacheDir` | string | Local cache directory. |
| `data.baseUrl` | string | Optional override base URL. |
| `data.ossToken` | string | **Credential.** A JSON string holding an STS `AccessKeyId`, `AccessKeySecret`, `SecurityToken`, bucket, endpoint, region, and expiry. |
| `data.cookieMd5` | object | **Sensitive.** Maps environment IDs to cookie MD5 digests for every environment on the machine. |
| `data.remindCleanup`, `data.remindCleanupSize`, `data.rpaAutoCleanup`, `data.autoRun` | mixed | Client cleanup and automation settings. |
| `data.networkConfigInfo` | string | Network and forward-proxy configuration. |

### Handling Rules

- Never print, log, cache, or copy this response. The STS credential can write to the account object storage, and the cookie digest table maps every environment on the machine.
- Do not call this route for routine work. `gpu_info` and `clean_env` cover the normal creation and cleanup flows.
- If the value is genuinely required, read it in memory, use it immediately, and let it go out of scope. Do not write it to disk.
- Redact `ossToken` and `cookieMd5` in any transcript that leaves the machine.

## Notes

- The response describes the machine that runs the desktop client. Do not copy adapter values into the skill; read them at runtime.
- A missing `52446` listener means the desktop helper service is unavailable. Creation still works without GPU data because the helper falls back to generic WebGL values.
