# Proxy Tag Delete

- Surface: server API
- Endpoint ID: `proxy-tag-delete`
- Method: `POST`
- Path: `/v2/proxy/device/delTag`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: ok` (create then delete round trip)
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Deletes one or more tags. The tag is removed from every environment that referenced it.

This is a destructive mutation. Confirm the exact tag IDs with the user before sending the request.

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
| `labelid` | []string | Yes | `[]` | Tag IDs to delete. |

### Example Request

```json
{
  "company": "<company name>",
  "companyid": "<companyid>",
  "labelid": ["<tag id>"]
}
```

### Helper Commands

```powershell
node scripts/yunlogin-env.mjs tag-delete --label-id <tag id> --confirm-delete --dry-run
node scripts/yunlogin-env.mjs tag-delete --label-id <tag id> --confirm-delete
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `ok`. |
| `msgCode` | number | Secondary status code. |
| `traceId` | string | Trace identifier. |

### Example Response

```json
{
  "code": 200,
  "msgCode": 200,
  "data": null,
  "msg": "ok",
  "traceId": "<trace id>"
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

Verify the removal with `proxy-tag-list` after the call.
