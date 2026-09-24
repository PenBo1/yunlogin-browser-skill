# User Notices

- Surface: server API
- Endpoint ID: `user-notices`
- Method: `POST`
- Path: `/v2/message/user-notice/my`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the in-app notification list for the signed-in user, grouped by notice type, together with the unread counter shown on the bell icon.

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
| `noticeType` | number | No | `0` | Notice category. `0` requests the default category. |
| `page` | number | No | `1` | Page number. |
| `pageSize` | number | No | `10` | Page size. |

### Example Request

```json
{
  "noticeType": 0,
  "page": 1,
  "pageSize": 10
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs user-notices --body '{\"noticeType\":0,\"page\":1,\"pageSize\":10}' --dry-run
node scripts/yunlogin-server-api.mjs user-notices --body '{\"noticeType\":0,\"page\":1,\"pageSize\":10}'
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `reqId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `OK`. |
| `data` | object | Notice payload. |

### `data` Object

| Field | Type | Description |
| --- | --- | --- |
| `key` | string | Notice category key. |
| `name` | string | Localised category name. The tested server returned the category label for notifications. |
| `count` | number | Unread count. |
| `total` | number | Total count in the category. |
| `list` | array or null | Notice rows. The tested account had no notices, so the server returned `null`. |

A `null` list with `count: 0` means "no notices", not an error.

### Example Response

```json
{
  "reqId": "<request id>",
  "code": 200,
  "msg": "OK",
  "data": {
    "key": "1",
    "name": "<localized category name>",
    "count": 0,
    "total": 0,
    "list": null
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

This is a read-only route and it carries no credentials. It is a convenient way to confirm that a server session works when the token cannot be verified another way.
