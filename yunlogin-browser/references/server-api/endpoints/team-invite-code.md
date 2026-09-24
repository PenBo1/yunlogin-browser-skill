# Team Invite Code

- Surface: server API
- Endpoint ID: `team-invite-code`
- Method: `POST`
- Path: `/v2/team/invite/getCode`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the company invitation code. Anyone holding the code can request to join the company, so treat it as a secret.

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
| `reset` | number | No | `0` | `0` reads the current code. `1` regenerates it, which invalidates the previous code for everyone. |

Use `reset: 0` unless the user explicitly asks to rotate the invitation code.

### Example Request

```json
{
  "reset": 0
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs team-invite-code --body '{"reset":0}' --dry-run
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `requestId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `OK`. |
| `data` | string | The invitation code. The helper redacts this field by default. |

### Example Response

```json
{
  "requestId": "<request id>",
  "code": 200,
  "msg": "OK",
  "data": "[REDACTED]"
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

- The helper lists `data` in `redact_keys`, so the code is replaced with `[REDACTED]` unless `--show-sensitive` is passed.
- Only read the code when the user asks for it, and never paste it into the skill, a report, or a ticket.
- `reset: 1` is a mutation that breaks every previously shared invitation link. Require explicit user authorization.
