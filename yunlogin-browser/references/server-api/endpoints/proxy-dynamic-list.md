# Proxy Dynamic List

- Surface: server API
- Endpoint ID: `proxy-dynamic-list`
- Method: `GET`
- Path: `/v2/proxy/device/findDeviceDynamicProxies`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: ok`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Lists dynamic proxy API configurations for the current company and user.

## Request

### Query Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `status` | number | Yes | `0` | Status filter. |
| `trademark` | string | Yes | `general` | Proxy category. |
| `page` | number | Yes | `1` | Page number. |
| `per_page` | number | Yes | `20` | Page size. |
| `userid` | string | Yes | `""` | User ID. Can be injected from `YUNLOGIN_SERVER_USER_ID`. |
| `companyid` | string | Yes | `""` | Company ID. Can be injected from `YUNLOGIN_SERVER_COMPANY_ID`. |
| `ip_type` | string | No | `""` | IP type filter. |
| `inspect` | string | No | `""` | Inspection filter. |
| `serial` | string | No | `""` | Serial filter. |
| `name` | string | No | `""` | Name filter. |

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
$env:YUNLOGIN_SERVER_COMPANY_ID = "<companyid>"
$env:YUNLOGIN_SERVER_USER_ID = "<userid>"

node scripts/yunlogin-server-api.mjs proxy-dynamic-list --query page=1 --query per_page=20 --dry-run
node scripts/yunlogin-server-api.mjs proxy-dynamic-list --query page=1 --query per_page=20
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
| `trademark` | string | Proxy category. |
| `type` | string | Proxy API type. |
| `autoSwitch` | number | Auto-switch state. |
| `url` | string | Proxy API URL. The helper redacts this value by default. |
| `notes` | null or string | Notes. |
| `status` | number | Status. |
| `deleteby` | string | Deleter user ID. |
| `ip_type` | number | IP type. |
| `ip_query_channel` | string | IP query channel. |
| `ip_place` | string | IP location. |
| `inspect` | number | Inspection state. |
| `serial` | number | Serial number. |
| `publicip` | string | Public IP. |
| `isbind` | number | Binding state. |
| `api` | number | API indicator. |
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
        "trademark": "general",
        "type": "<proxy api type>",
        "autoSwitch": 0,
        "url": "[REDACTED]",
        "status": 1,
        "ip_type": 0,
        "ip_place": "<ip location>",
        "inspect": 0,
        "serial": 1,
        "publicip": "<public ip>",
        "isbind": 0,
        "api": 1,
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

