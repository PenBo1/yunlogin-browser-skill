# Token Refresh

- Surface: server API
- Endpoint ID: `token-refresh`
- Method: `POST`
- Path: `/v2/sso/auth/tokenRefresh`
- Tested: 2026-09-27
- Test result: HTTP 200, business `code: 200`, `msg: ok`, explicit `expire` returned
- Verified: 2026-09-27 by a live call on the tested origin

## Purpose

Exchanges the current bearer token for a fresh one that carries an explicit
expiry. Call it after a token is supplied, and again whenever the cached token is
close to expiry, so a later call does not fail with `code: 1001`.

This route is also the only documented source of the token expiry. The issued
JWT does carry an `exp` claim, and on the tested origin `expire` matches `exp` to
the second, so either value can drive an expiry check. Read `expire` when you
need the value without decoding the token.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes | `application/json;charset=UTF-8` |
| `ApiSource` | No | `1`. The desktop client sends it. The tested origin returned an identical payload with and without it, so do not treat it as a hard requirement. |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

Send an empty JSON object.

```json
{}
```

### Helper Commands

```powershell
node scripts/yunlogin-auth.mjs refresh-server-token
node scripts/yunlogin-server-api.mjs token-refresh --dry-run
node scripts/yunlogin-server-api.mjs token-refresh
```

## Response

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | `200` means success. |
| `msg` | string | `ok` on success. |
| `data.token` | string | The replacement bearer token. Never print it or store it outside the user-level cache. |
| `data.expire` | string | RFC 3339 timestamp with an offset. Drives the expiry check. |
| `data.need` | number | `0` on the tested origin. |
| `data.openId` | string | Empty on the tested origin. |
| `data.source` | string | Empty on the tested origin. |

### Example Response

```json
{
  "code": 200,
  "msg": "ok",
  "data": {
    "token": "<replacement token>",
    "openId": "",
    "expire": "2026-10-04T11:41:39.477965756+08:00",
    "need": 0,
    "source": ""
  }
}
```

### Observed Properties

| Property | Value |
| --- | --- |
| Token length | 215 characters on the tested origin. |
| Lifetime | 168 hours (7 days) counted from the moment of the call. |
| `expire` versus the JWT `exp` claim | Identical to the second. |
| Refreshing an already valid token | Allowed. Each call returns a new token with a fresh window. |
| Repeating the call | Safe for the account. Only the token and its expiry move forward. |

## Error Handling

Failures arrive as HTTP 200 with a non-200 business code. Read [ERRORS.md](../ERRORS.md) for the full contract.

| Code | Meaning for this endpoint |
| --- | --- |
| `200` | Success. |
| `1001` | The bearer token was rejected, so it cannot be exchanged. Ask the user for a fresh token. |
| `400` | The payload was rejected before business validation. Send `{}`. |
| `500` | The server could not decode the request. Confirm the body is valid JSON. |
| HTTP 401 | No token was supplied. |

A rejected token cannot be replaced by this route: the route needs a usable token to issue a new one. Only a fresh value from the user can break that cycle.

## Notes

- `scripts/yunlogin-auth.mjs` calls this route from `save-server-token`, from `refresh-server-token`, and whenever a server call finds the cached token inside the refresh window.
- `scripts/yunlogin-server-api.mjs` and `scripts/yunlogin-env.mjs` refresh before a call when the cached token is due, and retry the call once when a response returns `code: 1001`.
- The refresh window defaults to 24 hours and can be changed with `YUNLOGIN_SERVER_REFRESH_SKEW_MS`. Setting it larger than the token lifetime forces a refresh before every call.
- The replacement token and its expiry are written to the user-level `server-token.json`. Never write them into the skill, a log, or a response. Storage rules are in [token-lifecycle.md](../../workflows/token-lifecycle.md).
