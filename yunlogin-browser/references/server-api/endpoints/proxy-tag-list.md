# Proxy Tag List

- Surface: server API
- Endpoint ID: `proxy-tag-list`
- Method: `GET`
- Path: `/v2/proxy/device/findTags`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: ok`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the environment and proxy tags (labels) defined for a company. The returned `labelid` values are the tag IDs used by an environment template and by the tag update and delete routes.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Query

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `company` | string | No | `""` | Company display name. |
| `companyid` | string | Yes | `""` | Company ID. Can be injected from `YUNLOGIN_SERVER_COMPANY_ID`. |
| `keyword` | string | No | `""` | Name filter. |
| `page` | number | No | `1` | Page number. |
| `per_page` | number | No | `10000` | Page size. The default returns the whole tag list in one call. |

### Example Request

```powershell
node scripts/yunlogin-env.mjs tag-list
node scripts/yunlogin-server-api.mjs proxy-tag-list --query companyid=<companyid>
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `ok`. |
| `msgCode` | number | Secondary status code. |
| `traceId` | string | Trace identifier. |
| `data` | object | Paged result. |

### `data` Object

| Field | Type | Description |
| --- | --- | --- |
| `data` | array | Tag rows. |
| `total` | number | Total tag count. |
| `current_page` | number | Current page. |
| `per_page` | number | Page size. |

### `data.data[]` Fields

| Field | Type | Description |
| --- | --- | --- |
| `labelid` | string | Tag ID. Use this value in `labelid` arrays. |
| `name` | string | Tag name. |
| `color` | number | Tag colour index. |
| `company_id` | string | Owning company ID. |
| `create_by` | string | Creator user ID. |
| `update_by` | string | Last editor user ID. |
| `created_at` | string | Creation timestamp. |
| `updated_at` | string | Update timestamp. |

### Example Response

```json
{
  "code": 200,
  "msg": "ok",
  "data": {
    "data": [
      {
        "labelid": "<tag id>",
        "name": "<tag name>",
        "color": 8,
        "company_id": "<companyid>",
        "created_at": "2026-09-24T16:47:02+08:00"
      }
    ],
    "total": 70,
    "current_page": 1,
    "per_page": 10000
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

Tag names are not unique across companies, so match on `name` and keep the resolved `labelid` for later calls.
