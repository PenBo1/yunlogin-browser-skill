# Company Face Check

- Surface: server API
- Endpoint ID: `company-face-check`
- Method: `GET`
- Path: `/v2/team/authentication/companyFourElementsFaceCheck`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, localized success message
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the company four-elements face-check status.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | No | Not used |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Query Parameters

No query parameters are documented for this route.


### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs company-face-check --dry-run
node scripts/yunlogin-server-api.mjs company-face-check
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
    "userCard": "string",
    "userStatus": "number",
    "userAcceptAt": "string",
    "companyId": "string",
    "companyIdCard": "string",
    "processInstanceId": "string",
    "name": "string",
    "companyStatus": "number",
    "failCount": "number",
    "companyAcceptAt": "string",
    "failReason": "string"
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
