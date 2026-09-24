# Server Group Delete

- Surface: server API
- Endpoint ID: `server-group-delete`
- Method: `POST`
- Path: `/v2/newbrowser/deletegroups`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK` (create then delete round trip)
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Deletes one or more environment groups. Environments that belonged to a deleted group are not deleted; they become ungrouped.

This is a destructive mutation. Confirm the exact group IDs with the user before sending the request.

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
| `groupid` | []string | Yes | `[]` | Group IDs to delete. |

### Example Request

```json
{
  "groupid": ["<group id>"]
}
```

### Helper Commands

```powershell
node scripts/yunlogin-env.mjs group-delete --group-id <group id> --confirm-delete --dry-run
node scripts/yunlogin-env.mjs group-delete --group-id <group id> --confirm-delete
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

Verify the removal with `server-group-list` after the call.
