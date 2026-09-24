# Find Devices

- Surface: server API
- Endpoint ID: `find-devices`
- Method: `POST`
- Path: `/v2/proxy/device/findDevices`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: ok`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns cloud proxy device details for a list of device IDs. This endpoint is useful when a caller already knows the device IDs and needs the same cloud device information returned by the cloud proxy list endpoint.

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
| `device_ids` | array of strings | Yes | `[]` | Device IDs to retrieve. |
| `trademark` | string | Yes | `official` | Proxy category. The tested request used `official`. |

### Example Request

```json
{
  "device_ids": [
    "<device id>"
  ],
  "trademark": "official"
}
```

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs find-devices --body-file request.json --dry-run
node scripts/yunlogin-server-api.mjs find-devices --body-file request.json
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msgCode` | number | Message code. |
| `data` | array | Matching cloud proxy devices. |
| `msg` | string | Business message. The tested endpoint returned `ok` on success. |
| `traceId` | string | Request trace ID. |

### `data[]`

The returned device object uses the same cloud device schema as [proxy-cloud-list.md](proxy-cloud-list.md). Key fields include:

| Field | Type | Description |
| --- | --- | --- |
| `device_id` | string | Device ID. |
| `device_name` | string | Device name. |
| `cloud_id` | string | Cloud ID. |
| `cloud_type` | number | Cloud type. |
| `status` | string | Device status. |
| `company_id` | string | Company ID. |
| `from_company_id` | string | Source company ID. |
| `uid` | string | UID. |
| `oid` | string | Order or owner ID. |
| `proxyaddr` | string | Proxy address. |
| `proxyu` | string | Proxy username. Redacted by the helper by default. |
| `proxyp` | string | Proxy password. Redacted by the helper by default. |
| `Proxytype` | string | Proxy type. |
| `publicip` | string | Public IP. |
| `proxyId` | number | Proxy ID. |
| `instance_no` | string | Cloud instance number. |
| `details_no` | string | Cloud detail number. |
| `ip_place` | string | IP location. |
| `isbind` | number | Binding state. |
| `serial` | number | Serial number. |
| `cloud` | object | Cloud package details. Uses the same nested `cloud` schema as `proxy-cloud-list`. |

### Example Response

```json
{
  "code": 200,
  "msgCode": 0,
  "data": [
    {
      "device_id": "<device id>",
      "device_name": "<device name>",
      "cloud_id": "<cloud id>",
      "status": "1",
      "proxyaddr": "<proxy address>",
      "proxyu": "[REDACTED]",
      "proxyp": "[REDACTED]",
      "publicip": "<public ip>",
      "isbind": 0,
      "serial": 1,
      "cloud": {
        "country": "<country>",
        "city": "<city>",
        "name": "<package name>"
      }
    }
  ],
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

## Notes

The helper redacts proxy usernames and passwords by default. Use the cloud proxy list document for the full nested `cloud` field schema.