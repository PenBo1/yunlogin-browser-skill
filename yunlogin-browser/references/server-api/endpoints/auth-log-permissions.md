# Authorization Log Permissions

- Surface: server API
- Endpoint ID: `auth-log-permissions`
- Method: `POST`
- Path: `/v2/logs/auth/perms`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, localized success message
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns authorization log permission options.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

| Field | Type | Required | Default |
| --- | --- | --- | --- |
| `pageIndex` | int | No | `1` |
| `total` | int | No | `0` |
| `pageSize` | int | No | `20` |

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs auth-log-permissions --dry-run
node scripts/yunlogin-server-api.mjs auth-log-permissions
```

## Response

Example response captured live on 2026-09-27 with placeholder values. Arrays keep one element so the shape stays readable.

```json
{
  "requestId": "<request id>",
  "code": 200,
  "msg": "<localized string>",
  "data": {
    "count": 252,
    "pageIndex": 1,
    "pageSize": 20,
    "list": [
      {
        "id": 11402,
        "userId": "<id>",
        "username": "<string>",
        "Name": "<localized string>",
        "companyId": "<id>",
        "deptId": "<string>",
        "departmentName": "<string>",
        "opType": "<string>",
        "content": "<localized string>",
        "detail": "<localized string>",
        "createdAt": "<string>"
      }
    ]
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

## Notes

Sensitive response fields such as credentials, cookies, proxy credentials, and 2FA secrets are redacted by the helper by default. Use `--show-sensitive` only when explicitly required and the output destination is safe.
