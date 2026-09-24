# Server Group List

- Surface: server API
- Endpoint ID: `server-group-list`
- Method: `POST`
- Path: `/v2/newbrowser/getgroups`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, no `msg` field
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns groups for the specified company and user context.

## Request

### Body

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `company` | string | No | `""` | Company display name. |
| `companyid` | string | Yes | `""` | Company ID. |
| `userid` | string | Yes | `""` | User ID. |
| `name` | string | No | `""` | Group name filter. |

The group ID is returned as `gropid`. Group creation returns the same value as `categoryid`; both name the value used in a creation template `categoryid`.

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
| `company` | str | No | `""` |
| `companyid` | str | Yes | `""` |
| `userid` | str | Yes | `""` |

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs server-group-list --dry-run
node scripts/yunlogin-server-api.mjs server-group-list
```

## Response

Example response captured live on 2026-09-27 with placeholder values. Arrays keep one element so the shape stays readable.

```json
{
  "code": 200,
  "group": [
    {
      "name": "<localized string>",
      "gropid": "<id>",
      "system_group": 2
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
| `400` | The payload was rejected before business validation. Check the field types and required fields above. |
| `500` | The server could not decode the request or find the target. Check field types and confirm the referenced IDs exist. |
| HTTP 401 | No token was supplied. |
| HTTP 404 | The route or HTTP method is not served by this deployment. Do not retry. |

## Notes

Sensitive response fields such as credentials, cookies, proxy credentials, and 2FA secrets are redacted by the helper by default. Use `--show-sensitive` only when explicitly required and the output destination is safe.
