# Browser Cookie

- Surface: server API
- Endpoint ID: `browser-cookie`
- Method: `POST`
- Path: `/v2/newbrowser/getCookie`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK` (with a real environment ID)
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the stored cookie payload for one browser environment. The response `data` field is a serialized JSON string and must be treated as sensitive session material.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `shopid` | string | Yes | Browser environment ID whose cookies are requested. |

### Example Request

```json
{
  "shopid": "<shopid>"
}
```

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs browser-cookie --body '{"shopid":"<shopid>"}' --dry-run
node scripts/yunlogin-server-api.mjs browser-cookie --body '{"shopid":"<shopid>"}'
```

## Response

| Field | Type | Description |
| --- | --- | --- |
| `reqId` | string | Request trace ID. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. The tested endpoint returned `OK` on success. |
| `data` | string | Serialized cookie data. The helper redacts this field by default. |

### Example Response

```json
{
  "reqId": "<request id>",
  "code": 200,
  "msg": "OK",
  "data": "[{\"name\":\"<cookie name>\",\"value\":\"[REDACTED]\",\"domain\":\"<domain>\"}]"
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

- The response can contain session cookies, tokens, and other authentication material.
- Do not place the raw `data` value in logs, Markdown, source files, command arguments, or chat.
- The helper redacts `data` by default. `--show-sensitive` is required to return it unchanged.