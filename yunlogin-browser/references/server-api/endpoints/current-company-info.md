# Current Company Info

- Surface: server API
- Endpoint ID: `current-company-info`
- Method: `GET`
- Path: `/v2/team/curCompanyInfo`
- Tested: 2026-09-24
- Test result: HTTP 404 on the tested origin; marked unavailable
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns current company information when the endpoint is available on the target origin.

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
node scripts/yunlogin-server-api.mjs current-company-info --dry-run
node scripts/yunlogin-server-api.mjs current-company-info
```

## Response

The tested request returned HTTP 404 and no JSON response envelope.

## Error Handling

The tested origin returns HTTP 404 with a plain-text body for this route, so no live request should be sent from this skill. Read [ERRORS.md](../ERRORS.md) for the shared contract and use the related endpoints listed above.

## Notes

Sensitive response fields such as credentials, cookies, proxy credentials, and 2FA secrets are redacted by the helper by default. Use `--show-sensitive` only when explicitly required and the output destination is safe.
