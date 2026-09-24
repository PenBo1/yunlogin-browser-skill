# Server Group Create Or Update

- Surface: server API
- Endpoint ID: `server-group-create`
- Method: `POST`
- Path: `/v2/newbrowser/putnewgroup`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, no `msg` field (create then delete round trip)
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Creates a group when `groupid` is empty and renames an existing group when `groupid` is supplied. The group ID is returned in the `categoryid` field and is the value an environment template uses to join a group.

This is a mutation. Confirm the group name with the user before sending the request.

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
| `company` | string | No | `""` | Company display name. |
| `companyid` | string | Yes | `""` | Company ID. Can be injected from `YUNLOGIN_SERVER_COMPANY_ID`. |
| `userid` | string | Yes | `""` | User ID. Can be injected from `YUNLOGIN_SERVER_USER_ID`. |
| `group` | string | Yes | `""` | Group name. |
| `groupid` | string | No | `""` | Existing group ID. Leave empty to create a new group. |

### Example Request

```json
{
  "company": "<company name>",
  "companyid": "<companyid>",
  "userid": "<userid>",
  "group": "<group name>",
  "groupid": ""
}
```

### Helper Commands

```powershell
node scripts/yunlogin-env.mjs group-create --name <group name> --dry-run
node scripts/yunlogin-env.mjs group-create --name <group name>
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `categoryid` | string | Group ID. This is the value to place in an environment template `categoryid`. |
| `code` | number | Business status code. `200` means success. |
| `companyid` | string | Owning company ID. |
| `createby` | string | Creator user ID. |
| `updateby` | string | Last editor user ID. |
| `name` | string | Group name. |

The group ID is returned as `categoryid`, not `groupid`. The group list route returns the same value as `gropid`.

### Example Response

```json
{
  "categoryid": "<group id>",
  "code": 200,
  "companyid": "<companyid>",
  "createby": "<userid>",
  "updateby": "<userid>",
  "name": "<group name>"
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

Read the group list with `server-group-list`. Delete a group with `server-group-delete`, which removes the group but not the environments inside it.
