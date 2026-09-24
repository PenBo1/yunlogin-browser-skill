# Team Members

- Surface: server API
- Endpoint ID: `team-members`
- Method: `POST`
- Path: `/v2/team/getMembers`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, localized success message
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns team members and pagination metadata.

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
| `pageSize` | int | No | `5` |
| `pageIndex` | int | No | `1` |
| `leave` | int | No | `3` |

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs team-members --dry-run
node scripts/yunlogin-server-api.mjs team-members
```

## Response

Example response captured live on 2026-09-27 with placeholder values. Arrays keep one element so the shape stays readable.

```json
{
  "requestId": "<request id>",
  "code": 200,
  "msg": "<localized string>",
  "data": {
    "count": 34,
    "pageIndex": 1,
    "pageSize": 5,
    "list": [
      {
        "id": 17039,
        "userId": "<id>",
        "companyId": "<id>",
        "deptId": "<string>",
        "username": "<account>",
        "name": "<localized string>",
        "mobile": "[REDACTED]",
        "email": "[REDACTED]",
        "roles": "<string>",
        "avatar": "[REDACTED]",
        "leave_status": 2,
        "online": 1,
        "package_status": 1,
        "usetimeLimit": {
          "limit": 0,
          "beginDate": "<string>",
          "endDate": "<string>"
        },
        "lastLoginAt": "<string>",
        "createdAt": "<string>",
        "updatedAt": "<string>",
        "pop": false,
        "openId": "<string>",
        "deptName": "<string>",
        "rolesName": null,
        "depPath": "<string>",
        "cancelStatus": 1,
        "cancelDeadline": null,
        "realName": "<localized string>"
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
