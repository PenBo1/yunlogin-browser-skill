# Account Users For Environments

- Surface: server API
- Endpoint ID: `account-users-get`
- Method: `POST`
- Path: `/v2/newbrowser/account-users/get`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the account users bound to the supplied environments. Use it to answer "which saved account credentials belong to these environments" without reading the full account list.

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
| `accountIds` | []string | Yes | `[]` | Environment IDs whose bound account users are requested. |

### Example Request

```json
{
  "accountIds": ["<account id>", "<account id>"]
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs account-users-get --body '{\"accountIds\":[\"<account id>\"]}' --dry-run
node scripts/yunlogin-server-api.mjs account-users-get --body '{\"accountIds\":[\"<account id>\"]}'
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `reqId` | string | Request identifier. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `OK`. |
| `data` | array | Bound account-user rows. The tested account returned an empty array for every sampled environment. |

### Row Shape

The tested account has no account user bound to any sampled environment, so the row fields could not be confirmed against live data. Treat `data` as an array and confirm the field names on the target account before relying on them.

### Example Response

```json
{
  "reqId": "<request id>",
  "code": 200,
  "msg": "OK",
  "data": []
}
```

### Validation Behaviour

The route accepts an empty list and unknown IDs without error and returns an empty array, so an empty response means "nothing bound" rather than "the request was wrong".

| Request | Result |
| --- | --- |
| three real environment IDs | `code: 200`, `OK`, empty `data` |
| `{"accountIds":[]}` | `code: 200`, `OK`, empty `data` |
| an unknown environment ID | `code: 200`, `OK`, empty `data` |

## Error Handling

Failures arrive as HTTP 200 with a non-200 business code. Read [ERRORS.md](../ERRORS.md) for the full contract.

| Code | Meaning for this endpoint |
| --- | --- |
| `200` | Success. An empty `data` array is still a success. |
| `1001` | The bearer token was rejected. Run `node scripts/yunlogin-auth.mjs ensure-server`, then ask the user for a fresh token. |
| `400` | The payload was rejected before business validation. Check the field types and required fields above. |
| `500` | The server could not decode the request. Check that `accountIds` is an array of strings. |
| HTTP 401 | No token was supplied. |
| HTTP 404 | The route or HTTP method is not served by this deployment. Do not retry. |

## Notes

- Use `bound-account-detail` when you need the full account record for one environment; this route answers the reverse question for several environments at once.
- The response contains account identifiers. Treat it as sensitive metadata and do not copy it into the skill, logs, or reports.
