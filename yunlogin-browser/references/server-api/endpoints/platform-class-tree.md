# Platform Class Tree

- Surface: server API
- Endpoint ID: `platform-class-tree`
- Method: `POST`
- Path: `/v2/newbrowser/getalluri`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: Success`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the platform classification tree used by the environment-creation dialog. It lists the top-level classes plus the child and grandchild mappings that feed the platform picker.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

Send an empty JSON object.

```json
{}
```

### Example Request

```powershell
node scripts/yunlogin-server-api.mjs platform-class-tree --dry-run
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `Success`. |
| `fatherclass` | array | Top-level class list. |
| `childclass` | object | Child classes keyed by parent class. |
| `childicon` | object | Child class icons. |
| `grandsonclass` | object | Grandchild classes keyed by child class. |

### Example Response

```json
{
  "code": 200,
  "msg": "Success",
  "fatherclass": ["<class>"],
  "childclass": { "<class>": ["<child class>"] },
  "childicon": { "<icon>": "<url>" },
  "grandsonclass": { "<child class>": ["<grandchild class>"] }
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

Use `platform-catalog` for the flat platform and website list. Use this endpoint when the UI needs the tree hierarchy.
