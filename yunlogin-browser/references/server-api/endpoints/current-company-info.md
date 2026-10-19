# Current Company Info

- Surface: server API
- Endpoint ID: `current-company-info`
- Method: `POST`
- Path: `/v2/team/curCompanyInfo`
- Tested: 2026-10-09
- Test result: HTTP 200, business `code: 200` after the HTTP method was corrected from `GET` to `POST`
- Verified: 2026-10-09 by a live call with the cached server token

## Purpose

Returns the profile of the current company tied to the bearer token. Also used by the
client to read the company name and owner before changing package status.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

No body fields are required. Send `{}`. The company is derived from the token, so the
`companyid`/`userid` pair used by other management routes is not needed here.

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs current-company-info --dry-run
node scripts/yunlogin-server-api.mjs current-company-info
```

## Response

Example response captured live on 2026-10-09 with placeholder values.

```json
{
  "requestId": "<uuid>",
  "code": 200,
  "msg": "OK",
  "data": {
    "id": 136453,
    "companyId": "<company id>",
    "name": "<company name>",
    "shortName": "",
    "onwer": "<owner user id>",
    "status": 1,
    "lockStatus": 1,
    "invite": "<invite code>",
    "avatar": "<url>",
    "lockAt": "0001-01-01T00:00:00Z",
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>",
    "updateBy": "<user id>"
  }
}
```

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | number | Internal numeric company row id. |
| `companyId` | string | Company id (the `iss` claim of the bearer token). |
| `name` | string | Company display name. |
| `shortName` | string | Company short name. Empty in the tested company. |
| `onwer` | string | Owner user id. Note the misspelling `onwer`. |
| `status` | number | Company status. `1` in the tested company. |
| `lockStatus` | number | Lock status. `1` means unlocked. |
| `invite` | string | Invite code. Equal to `companyId` in the tested company. |
| `avatar` | string | Company avatar URL. |
| `lockAt` | string (RFC3339) | Lock timestamp; zero value when never locked. |
| `createdAt` | string (RFC3339) | Creation timestamp. |
| `updatedAt` | string (RFC3339) | Last update timestamp. |
| `updateBy` | string | User id of the last updater. |

## Error Handling

| Code | Meaning for this endpoint |
| --- | --- |
| `200` | Success. |
| HTTP 404 | The route is served on `POST` only. A `GET` returns HTTP 404 with an empty JSON body. |
| HTTP 401 | No token was supplied. |

## See Also

- [RESPONSE_SHAPES.md](../RESPONSE_SHAPES.md)
- [ERRORS.md](../ERRORS.md)
