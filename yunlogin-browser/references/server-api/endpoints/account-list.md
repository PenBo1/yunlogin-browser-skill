# Account List

- Surface: server API
- Endpoint ID: `account-list`
- Method: `POST`
- Path: `/v2/newbrowser/getUserPasswordList`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Lists stored account and password records for the current company and user.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `name` | string | No | `""` | Account record name filter. |
| `user_name` | string | No | `""` | Account username filter. |
| `remark` | string | No | `""` | Notes filter. |
| `platform_name` | string | No | `""` | Platform name filter. |
| `page` | number | No | `1` | Page number. |
| `pageSize` | number | No | `100` | Page size. |
| `platformLock` | number | No | `-1` | Platform lock filter. |
| `bind` | number | No | `-1` | Binding filter. |

### Example Request

```json
{
  "name": "",
  "user_name": "",
  "remark": "",
  "platform_name": "",
  "page": 1,
  "pageSize": 20,
  "platformLock": -1,
  "bind": -1
}
```

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs account-list --body-file request.json --dry-run
node scripts/yunlogin-server-api.mjs account-list --body-file request.json
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `reqId` | string | Request trace ID. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. The tested endpoint returned `OK` on success. |
| `data` | object | Pagination and account list. |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `list` | array | Account records. |
| `total` | number | Total matching records. |
| `pageSize` | number | Page size. |
| `currentPage` | number | Current page. |

### `data.list[]`

| Field | Type | Description |
| --- | --- | --- |
| `company_id` | string | Company ID. |
| `user_id` | string | User ID. |
| `name` | string | Account record name. |
| `user_name` | string | Login username. Redacted by the helper by default. |
| `password` | string | Password. Redacted by the helper by default. |
| `user_password_id` | string | Account record ID. |
| `remark` | string | Notes. |
| `platform_id` | string | Platform ID. |
| `custom_platform_id` | string | Custom platform ID. |
| `platform_lock` | number | Platform lock state. |
| `tfa` | string | 2FA secret. Redacted by the helper by default. |
| `created_at` | string | Creation time. |
| `updated_at` | string | Update time. |
| `deleted_at` | null or string | Delete time. |
| `delete_by` | string | Deleter user ID. |
| `bind` | number | Binding state. |
| `userPasswordPlatforms` | object | Platform metadata. |
| `authority` | number | Authority state. |

### `data.list[].userPasswordPlatforms`

| Field | Type | Description |
| --- | --- | --- |
| `login_url` | string | Platform login URL. |
| `website` | string | Platform website. |
| `platform_icon` | string | Platform icon. |
| `platform_name` | string | Platform name. |
| `platform_id` | string | Platform ID. |
| `shop_icon` | string | Shop icon. |
| `user_id` | string | User ID. |
| `user_password_id` | string | Account record ID. |
| `custom_platform_id` | string | Custom platform ID. |
| `father_class` | string | Primary category. |
| `child_class` | string | Secondary category. |
| `grandson_class` | string | Tertiary category. |
| `user_name` | string | Login username. Redacted by the helper by default. |
| `password` | string | Password. Redacted by the helper by default. |
| `name` | string | Account record name. |
| `remark` | string | Notes. |
| `platform_lock` | number | Platform lock state. |
| `tfa` | string | 2FA secret. Redacted by the helper by default. |
| `authority` | number | Authority state. |

### Example Response

```json
{
  "reqId": "<request id>",
  "code": 200,
  "msg": "OK",
  "data": {
    "list": [
      {
        "company_id": "<companyid>",
        "user_id": "<userid>",
        "name": "<account name>",
        "user_name": "[REDACTED]",
        "password": "[REDACTED]",
        "user_password_id": "<account id>",
        "remark": "<remark>",
        "platform_id": "<platform id>",
        "custom_platform_id": "",
        "platform_lock": 0,
        "tfa": "[REDACTED]",
        "created_at": "<created at>",
        "updated_at": "<updated at>",
        "deleted_at": null,
        "delete_by": "",
        "bind": 0,
        "userPasswordPlatforms": {
          "login_url": "<login url>",
          "website": "<website>",
          "platform_name": "<platform name>",
          "platform_id": "<platform id>"
        },
        "authority": 0
      }
    ],
    "total": 1,
    "pageSize": 20,
    "currentPage": 1
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

This endpoint returns account credentials and 2FA secrets. The helper redacts `user_name`, `password`, and `tfa` by default. Use `--show-sensitive` only when the user explicitly requests the raw data and the output destination is appropriately controlled.