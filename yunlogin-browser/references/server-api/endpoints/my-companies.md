# My Companies

- Surface: server API
- Endpoint ID: `my-companies`
- Method: `POST`
- Path: `/v2/team/myCompanies`
- Tested: 2026-09-27
- Test result: HTTP 200, business `code: 200`, `msg: OK`, 5 companies returned
- Verified: 2026-09-27 against the live management center

## Purpose

Returns every company the signed-in user belongs to, together with the per-company metadata the client needs. Use the returned `companyId` as the `companyid` value that most other management-center routes require.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

Send an empty JSON object. The route ignores the body, so an empty payload is the documented form.

```json
{}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs my-companies --dry-run
node scripts/yunlogin-server-api.mjs my-companies
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `requestId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `OK`. |
| `data` | array | Company rows. The tested account returned 5 companies. |

`data` is a plain array, not an object with a `count` and `item` wrapper.

### `data[]` Fields

| Field | Type | Description |
| --- | --- | --- |
| `companyId` | string | Company ID. Use this as `companyid` in other routes. |
| `name` | string | Company display name. |
| `shortName` | string | Short name, often empty. |
| `onwer` | string | Owner user ID. **The server spells this field `onwer`**, not `owner`. |
| `status` | number | Company status flag. |
| `lockStatus` | number | Lock state. |
| `lockAt` | string | Lock timestamp; zero time when never locked. |
| `createdAt` | string | Creation timestamp. |
| `updateBy` | string | Last editor user ID. |
| `token` | string | **Per-company credential.** Redacted by the helper by default. |
| `expire` | string | Token expiry; zero time when unset. |
| `code` | string | Internal code, usually empty. |
| `ip` | string | Last known IP. Redacted by the helper by default. |
| `source` | string | Source marker, usually empty. |
| `avatar` | string | Avatar URL hosted on the account object storage. |

### Example Response

```json
{
  "requestId": "<request id>",
  "code": 200,
  "msg": "OK",
  "data": [
    {
      "companyId": "<companyid>",
      "name": "<company name>",
      "shortName": "",
      "onwer": "<owner user id>",
      "status": 2,
      "lockStatus": 1,
      "lockAt": "0001-01-01T00:00:00Z",
      "createdAt": "2023-12-25T11:17:44+08:00",
      "updateBy": "<editor user id>",
      "token": "[REDACTED]",
      "expire": "0001-01-01T00:00:00Z",
      "code": "",
      "ip": "[REDACTED]",
      "source": "",
      "avatar": "<avatar url>"
    }
  ]
}
```

## Error Handling

Failures arrive as HTTP 200 with a non-200 business code. Read [ERRORS.md](../ERRORS.md) for the full contract.

| Code | Meaning for this endpoint |
| --- | --- |
| `200` | Success. |
| `1001` | The bearer token was rejected. Run `node scripts/yunlogin-auth.mjs ensure-server`, then ask the user for a fresh token. |
| HTTP 401 | No token was supplied. |
| HTTP 404 | The route or HTTP method is not served by this deployment. Do not retry. |

## Notes

- Each row carries its own `token`. The helper redacts `token` and `ip` by default; never print the raw values.
- The `avatar` URL points at the account object storage. Treat it as account metadata rather than a public asset.
- Use this route to discover the `companyid` before calling `browser-list`, `team-members`, or the proxy routes.
