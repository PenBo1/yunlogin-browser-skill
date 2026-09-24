# Team Roles

- Surface: server API
- Endpoint ID: `team-roles`
- Method: `POST`
- Path: `/v2/team/roles`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, localized success message
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the roles defined for the company, including the permission identifier list each role carries. Use it to map a member's `roles` value to a readable role name and its rights.

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
| `pageIndex` | number | No | `1` | Page number. The tested client requests the whole list in one page. |
| `pageSize` | number | No | `999` | Page size. |

### Example Request

```json
{
  "pageIndex": 1,
  "pageSize": 999
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs team-roles --dry-run
node scripts/yunlogin-server-api.mjs team-roles
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `requestId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. The tested server returned a Chinese success message. |
| `data` | object | Paged role list. |

### `data` Object

| Field | Type | Description |
| --- | --- | --- |
| `count` | number | Total role count. The tested company returned 18 roles. |
| `pageIndex` | number | Current page. |
| `pageSize` | number | Page size. |
| `list` | array | Role rows. |

### `data.list[]` Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | Role ID. |
| `companyId` | string | Owning company ID. |
| `roleSlug` | string | Stable role identifier. |
| `roleDesc` | string | Role description. |
| `rightIds` | string | Permission identifiers carried by the role. |
| `roleType` | number | Role type. |
| `gid` | number | Group identifier. |
| `sort` | number | Sort order. |
| `count` | number | Number of members holding the role. |
| `createdAt` | string | Creation timestamp. |
| `updatedAt` | string | Update timestamp. |
| `updateBy` | string | Last editor. |

### Example Response

```json
{
  "requestId": "<request id>",
  "code": 200,
  "msg": "<success message>",
  "data": {
    "count": 18,
    "pageIndex": 1,
    "pageSize": 999,
    "list": [
      {
        "id": 1,
        "companyId": "<companyid>",
        "roleSlug": "admin",
        "roleDesc": "<role description>",
        "rightIds": "<permission ids>",
        "roleType": 1,
        "count": 2
      }
    ]
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

This is a read-only route. Pair it with `team-members`, whose rows expose a `roles` value and a `rolesName` object.
