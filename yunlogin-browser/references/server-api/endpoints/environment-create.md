# Environment Create

- Surface: server API
- Endpoint ID: `environment-create`
- Method: `POST`
- Path: `/v2/newbrowser/putalluri`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: Success` (create then delete round trip)
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Creates one or more browser fingerprint environments for the account. This is the server-side creation route described by the management-center client. The local desktop API can create environments too; prefer this endpoint first and fall back to `POST /api/v2/userapi/user/create` only when it fails.

This is a mutation. Require explicit user authorization before sending it, and confirm the environment name, count, company, and user before the request leaves the machine.

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
| `number` | number | Yes | `1` | Number of environments to create. The tested range is 1-10. |
| `randProxy` | number | No | `0` | Random-proxy mode. `0` keeps the proxy from the supplied browser template. |
| `batch_platform_id` | string | No | `""` | Optional platform applied to every created environment. |
| `batch_custom_id` | string | No | `""` | Optional custom platform applied to every created environment. |
| `batchProxy` | array | No | `[]` | Optional batch proxy list used when creating several environments. |
| `browser` | object | Yes | - | Environment template. Build it from `getfingerprinturi` and add a `fingerprint` object. |

### `browser` Object

| Field | Type | Description |
| --- | --- | --- |
| `name` | string | Environment name. Use a unique value so the new environment can be found again. |
| `notes` | string | Notes. |
| `labelid` | array | Label IDs. |
| `is_star_tag` | number | Star/favorite flag. |
| `top_order` | number | Top ordering value. |
| `kernelId` | number | Kernel identifier. Chrome 141 uses `10141`; the pattern is `10000 + major version`. |
| `categoryid` | string | Platform category ID. |
| `shopid` | string | Leave empty when creating. |
| `proxy` | object | Proxy template. `type` selects `local`, `self`, `official`, or an explicit protocol. |
| `accounts` | object | Account association template with `url` and `cookie`. |
| `fingerprint` | object | Fingerprint block. Copy the shape returned by the local environment detail or build it from `fingerprint-defaults`. |

### Validation Behaviour

The route validates loosely and reports every rejected request as a generic error:

| Request | Result |
| --- | --- |
| `{}` | HTTP 200, `code: 400`, `msg: unknown error` |
| `{"number":0}` | HTTP 200, `code: 400`, `msg: unknown error` |
| `{"number":1}` | HTTP 200, `code: 400`, `msg: unknown error` |
| `{"number":1,"browser":{"name":"x"}}` | HTTP 200, `code: 200`, `msg: Success` and the environment is created |

A payload without `browser` never creates anything, but a payload with any `browser` object is accepted. Always send a complete template so the created environment has a usable kernel.

### Example Request

```json
{
  "number": 1,
  "randProxy": 0,
  "batch_platform_id": "",
  "batch_custom_id": "",
  "batchProxy": [],
  "browser": {
    "name": "<environment name>",
    "notes": "",
    "labelid": [],
    "is_star_tag": 0,
    "top_order": 0,
    "kernelId": 10141,
    "categoryid": "<platform id>",
    "shopid": "",
    "proxy": { "type": "local" },
    "accounts": { "url": [], "cookie": "[]" },
    "fingerprint": { "kernel": "Chrome", "kernelversion": "141", "system": "Windows 10" }
  }
}
```

### Helper Commands

```powershell
node scripts/yunlogin-env.mjs create --name <environment name> --dry-run
node scripts/yunlogin-env.mjs create --name <environment name>
node scripts/yunlogin-server-api.mjs environment-create --body-file request.json --dry-run
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success and `400` means the template was rejected. |
| `msg` | string | Business message. Success returns `Success`. |
| `shopid` | []string | Newly created environment IDs. | |

The success response returns the new environment IDs in `shopid`. Use them directly; only fall back to a `browser-list` lookup filtered by `shopname` when the field is absent.

### Example Response

```json
{
  "code": 200,
  "msg": "Success",
  "shopid": ["<new account id>"]
}
```

### Presentation Attributes

| Field | Effect |
| --- | --- |
| `browser.notes` | Remark shown in the environment list. |
| `browser.categoryid` | Group ID. The environment joins that group. |
| `browser.labelid` | Array of tag IDs. The environment shows those tags. |

Ask the user before applying a remark, tags, or a group, and resolve the group ID from `putnewgroup` or `getgroups` and the tag IDs from `findTags` first.

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

- Delete the environment with `POST /v2/newbrowser/putdeleteshop`, or with `POST /api/v2/userapi/user/delete` on the local API as a fallback.
- Creating an environment consumes an account slot. Delete temporary environments after the workflow finishes.
