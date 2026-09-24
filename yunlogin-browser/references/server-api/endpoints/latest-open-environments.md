# Latest Open Environments

- Surface: server API
- Endpoint ID: `latest-open-environments`
- Method: `POST`
- Path: `/v2/newbrowser/getLatestOpenAccountIdList`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the environment IDs that were opened most recently, newest first. The management center uses it to restore the "recently opened" list.

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
| `num` | number | Yes | `20` | Maximum number of environment IDs to return. |

### Example Request

```json
{
  "num": 20
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs latest-open-environments --body '{\"num\":20}' --dry-run
node scripts/yunlogin-server-api.mjs latest-open-environments --body '{\"num\":20}'
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `reqId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `OK`. |
| `data.accountIds` | []string | Recently opened environment IDs, newest first. The tested request returned 20 IDs. |

### Example Response

```json
{
  "reqId": "<request id>",
  "code": 200,
  "msg": "OK",
  "data": {
    "accountIds": ["<account id>", "<account id>"]
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

The response contains environment identifiers only, so resolve names with `browser-list` when the user needs readable output. Treat the ordering as the recency signal.
