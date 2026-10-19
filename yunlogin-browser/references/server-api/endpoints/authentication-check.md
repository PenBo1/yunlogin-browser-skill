# Authentication Check

- Surface: server API
- Endpoint ID: `authentication-check`
- Method: `GET`
- Path: `/v2/team/authentication/check`
- Tested: 2026-10-09
- Test result: HTTP 200, business `code: 500`, message `获取授权失败，失败信息 认证失败`
- Verified: 2026-10-09 by re-probing the route three times; it returned `code: 200` on 2026-09-24

## Purpose

Returns the current authentication check result.

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
node scripts/yunlogin-server-api.mjs authentication-check --dry-run
node scripts/yunlogin-server-api.mjs authentication-check
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

## See Also

- [RESPONSE_SHAPES.md](../RESPONSE_SHAPES.md) - envelope, key-name, and type traps across the surface.
- [WRITE_ROUNDTRIPS.md](../WRITE_ROUNDTRIPS.md) - verified write round trips and silent-failure notes.
- [ERRORS.md](../ERRORS.md) - HTTP vs business code contract.


## Drift Note

The route answered `code: 200` with 16 response fields on 2026-09-24 and answers `code: 500` with a
5-field error envelope now. Treat "authentication check passed" as account-state dependent, not as a fixed
contract. See [../DRIFT.md](../DRIFT.md).
