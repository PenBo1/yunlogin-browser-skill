# Platform Catalog

- Surface: server API
- Endpoint ID: `platform-catalog`
- Method: `GET`
- Path: `/v2/newbrowser/getallurilist`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the flat catalogue of supported platforms and their websites. Each row carries the platform ID, names, icon, website, and login URL that an environment template can reference through `categoryid`.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Query

No query parameters are documented. Send the request without a body.

### Example Request

```powershell
node scripts/yunlogin-server-api.mjs platform-catalog --dry-run
node scripts/yunlogin-server-api.mjs platform-catalog
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `reqId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `OK`. |
| `data` | array | Platform rows. |

### `data[]` Fields

| Field | Type | Description |
| --- | --- | --- |
| `fatherclass` | string | Top-level class. |
| `childclass` | string | Child class. |
| `grandsonclass` | string | Grandchild class. |
| `platformid` | string | Platform ID used as `categoryid` in a creation template. |
| `platformname` | string | Platform name. |
| `platformicon` | string | Platform icon URL. |
| `website` | string | Platform website. |
| `loginurl` | string | Login URL. |
| `shop_icon` | string | Environment icon. |
| `father_label` | string | Top-level class label. |
| `child_label` | string | Child class label. |
| `grandson_label` | string | Grandchild class label. |

### Example Response

```json
{
  "reqId": "<request id>",
  "code": 200,
  "msg": "OK",
  "data": [
    {
      "platformid": "<platform id>",
      "platformname": "<platform name>",
      "website": "<website>",
      "loginurl": "<login url>",
      "platformicon": "<icon url>"
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

This endpoint returns a long list. Filter locally after the response instead of requesting it repeatedly.
