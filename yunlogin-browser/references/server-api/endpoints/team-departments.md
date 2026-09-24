# Team Departments

- Surface: server API
- Endpoint ID: `team-departments`
- Method: `POST`
- Path: `/v2/team/getDepts`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the department tree for the company, with the members attached to each department. Use it to resolve a member `deptId` to a department name, or to build a department picker.

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

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs team-departments --dry-run
node scripts/yunlogin-server-api.mjs team-departments
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `requestId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `OK`. |
| `data` | object | Root department node. |

### Department Node Fields

| Field | Type | Description |
| --- | --- | --- |
| `deptId` | string | Department ID. |
| `pid` | string | Parent department ID. |
| `departmentName` | string | Department name. |
| `count` | number | Member count. |
| `manageName` | string | Manager name. |
| `userId` | string | Manager user ID. |
| `members` | array | Members with `userId`, `name`, and `realName`. |
| `children` | array | Nested departments using the same shape. |

The tested company returned a tree three levels deep, with five members on the root node.

### Example Response

```json
{
  "requestId": "<request id>",
  "code": 200,
  "msg": "OK",
  "data": {
    "deptId": "<dept id>",
    "pid": "",
    "departmentName": "<department name>",
    "count": 5,
    "manageName": "<manager>",
    "members": [
      { "userId": "<userid>", "name": "<name>", "realName": "<real name>" }
    ],
    "children": [
      { "deptId": "<child dept id>", "pid": "<dept id>", "departmentName": "<child name>", "children": [] }
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

Member names and user IDs are personal data. Read them only when the user asks for team structure, and do not copy them into the skill, logs, or reports.
