# Custom Platform List

- Surface: server API
- Endpoint ID: `custom-platform-list`
- Method: `POST`
- Path: `/v2/newbrowser/getalluserselfuri`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: Success`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the custom and self-owned platforms that the account has defined on top of the shared catalogue. Each row is a platform the account created, with its website and login URL.

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
| `company` | string | Yes | `""` | Company display name. |
| `companyid` | string | Yes | `""` | Company ID. Can be injected from `YUNLOGIN_SERVER_COMPANY_ID`. |
| `userid` | string | Yes | `""` | User ID. Can be injected from `YUNLOGIN_SERVER_USER_ID`. |

### Example Request

```json
{
  "company": "<company name>",
  "companyid": "<companyid>",
  "userid": "<userid>"
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs custom-platform-list --body-file request.json --dry-run
node scripts/yunlogin-server-api.mjs custom-platform-list --body-file request.json
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `Success`. |
| `self` | array | Custom platform rows. |

### `self[]` Fields

| Field | Type | Description |
| --- | --- | --- |
| `platform_id` | string | Custom platform ID. |
| `company_id` | string | Owning company ID. |
| `user_id` | string | Owning user ID. This is an identifier, not a credential. |
| `platform_name` | string | Platform name. |
| `platform_icon` | string | Platform icon URL. |
| `website` | string | Platform website. |
| `login_url` | string | Login URL. |
| `created_at` | string | Creation timestamp. |
| `updated_at` | string | Update timestamp. |

### Example Response

```json
{
  "code": 200,
  "msg": "Success",
  "self": [
    {
      "platform_id": "<custom platform id>",
      "platform_name": "<platform name>",
      "website": "<website>",
      "login_url": "<login url>",
      "created_at": "<timestamp>"
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

Treat the returned account identifiers as sensitive metadata. Do not copy platform rows into the skill, logs, or support tickets.
