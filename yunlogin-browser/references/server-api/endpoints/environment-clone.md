# Environment Clone

- Surface: server API
- Endpoint ID: `environment-clone`
- Method: `POST`
- Path: `/v2/newbrowser/batchCloneShop`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Clones one or more existing environments. The clone copies the fingerprint, proxy binding, group, tags, and remark of the source environment and receives a new environment ID.

Only those fields are documented as copied. Account bindings, stored Cookies, and the login state are not covered by this document, so do not assume a clone inherits them. Read the clone back with `fingerprint-uri` or `browser-cookie` when the workflow depends on them.

The response carries no clone ID. Resolve the new environment with `browser-list` filtered by the source name, and confirm the exact row by ID before using it.

This is a mutation that creates real environments. Confirm the source environment and the clone count with the user before sending the request.

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
| `number` | number | Yes | `1` | Number of clones per source environment. |
| `accountIds` | []string | Yes | `[]` | Source environment IDs. The tested call used one ID. |

### Example Request

```json
{
  "number": 1,
  "accountIds": ["<source account id>"]
}
```

### Helper Commands

```powershell
node scripts/yunlogin-server-api.mjs environment-clone --body '{\"number\":1,\"accountIds\":[\"<account id>\"]}' --dry-run
node scripts/yunlogin-server-api.mjs environment-clone --body '{\"number\":1,\"accountIds\":[\"<account id>\"]}'
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `OK`. |

The response carries no clone ID. Resolve the new environment with `browser-list` filtered by the source name.

### Clone Naming

The tested clone was named with the source serial number, the source name, a clone marker, and an index:

```text
<source serial>-<source name>-<clone marker>-<index>
```

The server inserts a localised clone marker between the source name and the index. Match on the source name and the numeric prefix rather than on the marker text.

### Example Response

```json
{
  "code": 200,
  "msg": "OK"
}
```

### Validation Behaviour

The route accepts almost anything and reports success even when nothing is cloned.

| Request | Result |
| --- | --- |
| `{}` | `code: 200`, `OK`, and no environment is created |
| `{"number":1}` | `code: 200`, `OK`, and no environment is created |
| `{"number":1,"accountIds":[]}` | `code: 200`, `OK`, and no environment is created |
| `{"number":1,"accountIds":["<unknown id>"]}` | `code: 200`, `OK`, and no environment is created |
| `{"number":1,"accountIds":["<real id>"]}` | `code: 200`, `OK`, and the clone exists |

Because a success response does not prove that a clone was created, always confirm the result with `browser-list` before reporting success.

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

- Delete a clone that is no longer needed with `environment-delete`.
- Cloning consumes an account slot just like creating an environment.
