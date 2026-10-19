# Team Authentication Detail

- Surface: server API
- Endpoint ID: `team-authentication-get`
- Method: `GET`
- Path: `/v2/team/authentication/get`
- Tested: 2026-10-09
- Test result: HTTP 200, business `code: 200`, message `查询成功`, after the HTTP method was corrected from `POST` to `GET`
- Verified: 2026-10-09 by a live call with the cached server token

## Purpose

Returns the current team-authentication status: whether the user and the company have
completed real-name authentication, plus any failure reason.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | No | Not used for GET. |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Query

No query parameters are required. The user and company are derived from the token.

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs team-authentication-get --dry-run
node scripts/yunlogin-server-api.mjs team-authentication-get
```

## Response

Example response captured live on 2026-10-09 with placeholder values.

```json
{
  "requestId": "<uuid>",
  "code": 200,
  "msg": "查询成功",
  "data": {
    "userId": "<user id>",
    "userCard": "",
    "userStatus": 1,
    "userAcceptAt": "0001-01-01T00:00:00Z",
    "companyId": "<company id>",
    "companyIdCard": "",
    "processInstanceId": "",
    "name": "",
    "companyStatus": 1,
    "failCount": 0,
    "companyAcceptAt": "0001-01-01T00:00:00Z",
    "failReason": ""
  }
}
```

| Field | Type | Meaning |
| --- | --- | --- |
| `userId` | string | Authenticated user id. |
| `userCard` | string | Masked id-card value for the user. Empty when not submitted. |
| `userStatus` | number | User authentication status. `1` in the tested account. |
| `userAcceptAt` | string (RFC3339) | When the user was accepted; zero value if not yet. |
| `companyId` | string | Company id. |
| `companyIdCard` | string | Company credit-code / id-card value. Empty when not submitted. |
| `processInstanceId` | string | External workflow instance id when a submission is in flight. |
| `name` | string | Submitted real name. Empty when not submitted. |
| `companyStatus` | number | Company authentication status. `1` in the tested company. |
| `failCount` | number | Number of failed attempts. |
| `companyAcceptAt` | string (RFC3339) | When the company was accepted; zero value if not yet. |
| `failReason` | string | Reason for the last failure, when any. |

## Error Handling

| Code | Meaning for this endpoint |
| --- | --- |
| `200` | Success. |
| HTTP 404 | The route is served on `GET` only. A `POST` returns HTTP 404. |
| HTTP 401 | No token was supplied. |

## See Also

- [team-authentication-get.md](./team-authentication-get.md) sibling routes `authentication-check`, `company-face-check`.
- [RESPONSE_SHAPES.md](../RESPONSE_SHAPES.md)
- [ERRORS.md](../ERRORS.md)
