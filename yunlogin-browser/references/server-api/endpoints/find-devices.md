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
| `msgCode` | number | Message code. `200` on success. |
| `data` | array \| null | Matching devices, or `null` when nothing matches. |
| `msg` | string | Business message. The tested endpoint returned `ok` on success. |
| `traceId` | string | Request trace ID. |

### Row Schema Depends On `trademark`

`trademark` selects which device schema is returned. Do not reuse one table for both values.

**`trademark: "official"`** returns cloud-device rows (the `proxy-cloud-list` schema). Key fields: `device_id`, `device_name`, `cloud_id`, `cloud_type`, `status`, `company_id`, `from_company_id`, `uid`, `oid`, `proxyaddr`, `proxyu`, `proxyp`, `Proxytype`, `publicip`, `proxyId`, `instance_no`, `details_no`, `ip_place`, `isbind`, `serial`, and a nested `cloud` object.

**`trademark: "self"`** returns self-proxy rows. Observed fields:

| Field | Type | Description |
| --- | --- | --- |
| `created_at` | string | Creation timestamp. |
| `updated_at` | string | Last update timestamp. |
| `deviceid` | string | Device ID. |
| `companyid` | string | Owning company ID. |
| `userid` | string | Owning user ID. |
| `name` | string | Device name. |
| `proxyaddr` | string | Proxy host and port. |
| `proxytype` | number | Proxy protocol/type. |
| `proxyu` | string | Proxy username. Redacted by the helper by default. |
| `proxyp` | string | Proxy password. Redacted by the helper by default. |
| `publicip` | string | Public IP/host. |
| `trademark` | string | Echoes `self`. |
| `enable` | number | Enabled flag. |
| `deleteby` | string | Deleting user ID, empty when active. |
| `notes` | string | Notes. |
| `login_at` | string | Last login time. |
| `api` | number | API-driven flag. |
| `ip_query_channel` | string | IP geolocation channel. |
| `ip_place` | string | IP geolocation place. |
| `end_time` | null | Proxy end time when applicable. |
| `inspect` | number | Inspection flag. |
| `ip_type` | number | IP type. |
| `serial` | number | Serial number. |
| `isbind` | number | Bound-to-environment flag. |
| `target_url` | array | Target URLs. |
| `authority` | number | Authority level. |
| `authority_userids` | null | Explicitly authorized user IDs. |

### Example Response (`trademark: "self"`)

```json
{
  "code": 200,
  "msgCode": 200,
  "data": [
    {
      "deviceid": "<device id>",
      "name": "<device name>",
      "proxyaddr": "<proxy host:port>",
      "proxytype": 1,
      "proxyu": "[REDACTED]",
      "proxyp": "[REDACTED]",
      "publicip": "<public ip>",
      "trademark": "self",
      "enable": 1,
      "serial": 1122,
      "isbind": 1,
      "ip_place": "<country-city>"
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
| `200` | Success. `data: null` means no device matched. |
| `1001` | The bearer token was rejected. Run `node scripts/yunlogin-auth.mjs ensure-server`, then ask the user for a fresh token. |
| `400` | The payload was rejected before business validation. Check the field types and required fields above. |
| `500` | The server could not decode the request or find the target. Check field types and confirm the referenced IDs exist. |
| HTTP 401 | No token was supplied. |
| HTTP 404 | The route or HTTP method is not served by this deployment. Do not retry. |

## Notes

- The helper redacts proxy usernames and passwords by default.
- Use `proxy-cloud-list` for the full cloud `cloud` sub-schema, and `proxy-self-list` for the full self-proxy row.
- `device_ids: []` returns `data: null` even though `code` stays `200`.

## See Also

- [RESPONSE_SHAPES.md](../RESPONSE_SHAPES.md) - envelope, key-name, and type traps across the surface.
- [WRITE_ROUNDTRIPS.md](../WRITE_ROUNDTRIPS.md) - verified write round trips and silent-failure notes.
- [ERRORS.md](../ERRORS.md) - HTTP vs business code contract.
