# Proxy Self List

- Surface: server API
- Endpoint ID: `proxy-self-list`
- Method: `GET`
- Path: `/v2/proxy/device/findDeviceProxyUserSelves`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: ok`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Lists self-managed proxy devices for the current company and user.

## Request

### Query Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `status` | number | Yes | `1` | Status filter. |
| `trademark` | string | Yes | `self` | Proxy category. |
| `page` | number | Yes | `1` | Page number. |
| `per_page` | number | Yes | `20` | Page size. |
| `company` | string | No | `""` | Company name filter. |
| `companyid` | string | Yes | `""` | Company ID. Can be injected from `YUNLOGIN_SERVER_COMPANY_ID`. |
| `userid` | string | Yes | `""` | User ID. Can be injected from `YUNLOGIN_SERVER_USER_ID`. |
| `proxy_type` | string | No | `""` | Proxy protocol filter. |
| `ip_type` | string | No | `""` | IP type filter. |
| `detect_result` | string | No | `""` | Detection result filter. |
| `name` | string | No | `""` | Proxy name filter. |
| `ip` | string | No | `""` | IP filter. |
| `serial` | number | No | `0` | Serial filter. |

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
$env:YUNLOGIN_SERVER_COMPANY_ID = "<companyid>"
$env:YUNLOGIN_SERVER_USER_ID = "<userid>"

node scripts/yunlogin-server-api.mjs proxy-self-list --query page=1 --query per_page=20 --dry-run
node scripts/yunlogin-server-api.mjs proxy-self-list --query page=1 --query per_page=20
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msgCode` | number | Message code. |
| `data` | object | Pagination and result data. |
| `msg` | string | Business message. |
| `traceId` | string | Request trace ID. |

### `data.data[]`

| Field | Type | Description |
| --- | --- | --- |
| `created_at` | string | Creation time. |
| `updated_at` | string | Update time. |
| `deviceid` | string | Proxy device ID. |
| `companyid` | string | Company ID. |
| `userid` | string | User ID. |
| `name` | string | Proxy name. |
| `proxyaddr` | string | Proxy address. |
| `proxytype` | number | Proxy type. |
| `proxyu` | string | Proxy username. Redacted by the helper by default. |
| `proxyp` | string | Proxy password. Redacted by the helper by default. |
| `publicip` | string | Public IP. |
| `trademark` | string | Proxy category. |
| `enable` | number | Enabled state. |
| `deleteby` | string | Deleter user ID. |
| `notes` | string | Notes. |
| `login_at` | string | Last login time. |
| `api` | number | API proxy indicator. |
| `ip_query_channel` | string | IP query channel. |
| `ip_place` | string | IP location. |
| `end_time` | null or string | Expiration time. |
| `inspect` | number | Inspection state. |
| `ip_type` | number | IP type. |
| `serial` | number | Serial number. |
| `isbind` | number | Binding state. |
| `target_url` | array | Target URL list. |
| `authority` | number | Authority state. |
| `authority_userids` | null or value | Authorized user IDs. |

### Example Response

```json
{
  "code": 200,
  "msgCode": 0,
  "data": {
    "data": [
      {
        "deviceid": "<device id>",
        "name": "<proxy name>",
        "proxyaddr": "<proxy address>",
        "proxytype": 1,
        "proxyu": "[REDACTED]",
        "proxyp": "[REDACTED]",
        "publicip": "<public ip>",
        "trademark": "self",
        "enable": 1,
        "serial": 1,
        "isbind": 0,
        "target_url": ["<target url>"],
        "authority": 0
      }
    ],
    "total": 1,
    "current_page": 1,
    "per_page": 20
  },
  "msg": "ok",
  "traceId": "<trace id>"
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

