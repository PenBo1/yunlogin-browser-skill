# My User Info

- Surface: server API
- Endpoint ID: `my-user-info`
- Method: `POST`
- Path: `/v2/sso/auth/myUserinfo`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, localized success message
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the current user information.

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


### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs my-user-info --dry-run
node scripts/yunlogin-server-api.mjs my-user-info
```

## Response

Observed response shape:

```json
{
  "requestId": "string",
  "code": "number",
  "msg": "string",
  "data": {
    "userId": "string",
    "username": "string",
    "mobile": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "nickname": "string",
    "avatar": "string",
    "bio": "string",
    "gender": "string",
    "birthday": "string",
    "lockEnd": "string",
    "cancelStatus": "number",
    "cancelDeadline": null,
    "createdAt": "string",
    "updateAt": "string",
    "inviter": "string",
    "inviteType": "number",
    "source": "string",
    "os": "string",
    "lastLoginPort": "string",
    "lastLoginDevice": "string",
    "ip": "string",
    "ipLocation": "string",
    "industryLabel": "string",
    "bind": {
      "wechat": "number",
      "ding": "number",
      "mp": "number",
      "mini": "number",
      "google": "number"
    },
    "password": "string"
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
