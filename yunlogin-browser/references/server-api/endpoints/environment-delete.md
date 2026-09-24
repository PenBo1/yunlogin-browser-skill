# Environment Delete

- Surface: server API
- Endpoint ID: `environment-delete`
- Method: `POST`
- Path: `/v2/newbrowser/putdeleteshop`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK` (create then delete round trip)
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Deletes one or more browser environments from the server. This is the server-side delete route; the local API route `POST /api/v2/userapi/user/delete` remains available as a fallback.

This is a destructive mutation. Confirm the exact environment IDs and names with the user before sending the request, and delete only environments that the workflow created or that the user named explicitly.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `company` | string | No | `""` | Company display name. |
| `companyid` | string | Yes | `""` | Company ID. Can be injected from `YUNLOGIN_SERVER_COMPANY_ID`. |
| `userid` | string | Yes | `""` | User ID. Can be injected from `YUNLOGIN_SERVER_USER_ID`. |
| `shopid` | []string | Yes | `[]` | Environment IDs to delete. |

### Example Request

```json
{
  "company": "<company name>",
  "companyid": "<companyid>",
  "userid": "<userid>",
  "shopid": ["<account id>"]
}
```

### Helper Commands

```powershell
node scripts/yunlogin-env.mjs delete --account-id <account id> --confirm-delete --dry-run
node scripts/yunlogin-env.mjs delete --account-id <account id> --confirm-delete
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `reqId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `OK`. |

### Example Response

```json
{
  "reqId": "<request id>",
  "code": 200,
  "msg": "OK"
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

The parameter is named `shopid` and the value is the environment ID returned as `shopid` by `browser-list` or by `environment-create`. Verify the removal with `browser-list` after the call.
