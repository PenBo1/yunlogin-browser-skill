# RPA Plan List

- Surface: server API
- Endpoint ID: `rpa-plan-list`
- Method: `POST`
- Path: `/v2/rpa/getRpaPlanManagementList`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, no `msg` field
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the RPA (robotic process automation) task plans that apply to a user and a set of environments. The management center uses it to show which automation plans are scheduled for the selected environments.

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
| `userId` | string | Yes | `""` | User whose plans are requested. Use the value from `my-user-info`. |
| `executeType` | number | No | `11` | Plan execution type filter. The tested client sent `11`. |
| `accountIds` | []string | Yes | `[]` | Environment IDs whose plans are requested. |

`userId` is an identifier, not a credential, but it is still account metadata. Do not copy it into the skill, logs, or reports.

### Example Request

```json
{
  "userId": "<userid>",
  "executeType": 11,
  "accountIds": ["<account id>"]
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs rpa-plan-list --body-file request.json --dry-run
node scripts/yunlogin-server-api.mjs rpa-plan-list --body-file request.json
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msgCode` | number | Secondary status code. |
| `list` | array | Plan rows. Empty when no plan targets the supplied environments. |
| `count` | number | Total plan count. |
| `pageIndex` | number | Current page. |
| `pageSize` | number | Page size. |
| `timestamp` | number | Server timestamp. |

The response has no `msg` field on this route. Plan rows are returned at the top level rather than under `data`.

### Example Response

```json
{
  "code": 200,
  "msgCode": 200,
  "list": [],
  "count": 0,
  "pageIndex": 1,
  "pageSize": 10,
  "timestamp": 1790241362
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

An empty `list` means the account has no RPA plan for those environments. It is not an error and does not indicate that RPA is unavailable.
