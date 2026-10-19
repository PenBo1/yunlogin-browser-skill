# Server API Workflow

## 1. Choose the API Surface

Use the server API only for management-center operations and the 54 cataloged server endpoints. Use the local API documentation in `../api/` for the desktop client and loopback service. Never send a localhost path to the server origin or a server path to the localhost helper.

The client bundle mixes three surfaces, so a path alone does not prove the target. Paths under `/api/v1/client/`, `/api/v1/settings/`, `/api/v1/cores/`, and `/api/v1/ipify/` belong to the **local client API** on its discovered loopback port; everything else in the extracted route table is a management-center path. `sweep-all-routes.mjs` routes on that rule and records a `surface` field per result. Testing a client-surface path against the server origin returns HTTP 405, which once looked like a dead route and was really a wrong-port call.

The session-scoped identifiers `companyid` and `userid` are injected from the synchronized Workbench session. Do not supply conflicting IDs for an account-changing request.
## 2. Authenticate Or Use A Public Endpoint

Follow [TOKEN_SETUP.md](TOKEN_SETUP.md) for current setup. Authenticated routes synchronize the Workbench session before business requests. `sso-login` is public and does not require a cached bearer. Sign in through Workbench when authentication is needed.

## 3. Inspect the Catalog and Endpoint Document

Use the endpoint ID from `endpoints.json` or the index in `README.md`. Read the endpoint document for its method, path, query parameters, body fields, response envelope, and endpoint-specific notes.

## 4. Validate Before Sending

Use `--dry-run` to validate the endpoint ID, query parameters, body, origin, authentication requirement, and redaction without sending an HTTP request:

```powershell
node scripts/yunlogin-server-api.mjs browser-list --dry-run
node scripts/yunlogin-server-api.mjs account-list --body-file request.json --dry-run
node scripts/yunlogin-server-api.mjs sso-login --body-file login.json --dry-run
```

## 5. Send and Verify

A live request is sent only when `--dry-run` is omitted. Treat HTTP success and business success separately. The tested server responses use HTTP 200 and a JSON envelope with `code: 200`; the success `msg` value varies by endpoint (`Success`, `ok`, or `OK`). The endpoint document remains authoritative for field shape.

## Common Request Rules

- POST endpoints accept JSON request bodies. Query parameters are named in the endpoint document.
- GET endpoints pass their filters through the query string.
- `page` and `per_page` or `pageSize` control pagination where documented.
- Company and user identifiers are injected from the current Workbench session when the cataloged field exists. Explicit values must match that session.
- Empty filter values are valid for optional list filters.
- Unknown endpoint IDs are rejected; the helper does not send arbitrary URLs.

## Common Response Rules

- Read `code` and `msg` from the response envelope before using the data.
- `traceId` or `reqId` identifies a request when present.
- List endpoints commonly return `data.data[]`, `data.total`, `data.current_page`, and `data.per_page`. Read the endpoint document for the exact shape.
- Data fields can contain cookie, proxy credential, account credential, or identifier values. Do not copy sensitive response values into skill files or logs.

## Error Handling

| Condition | Behavior |
| --- | --- |
| Workbench CDP, login, or current credential missing | Stop before the authenticated business request; guide the user to Workbench login/CDP recovery and `sync-workbench`. Public endpoints such as `sso-login` do not require a cached token. |
| Unknown endpoint ID | Stop before networking; choose a documented endpoint ID. |
| Missing required query or body field | Stop before networking; fill the documented field. |
| HTTP 401 or 403 | Treat the token as missing, expired, or unauthorized; do not retry with a different origin. |
| HTTP 200 with an error business code | Report the HTTP status, `code`, `msg`, and `traceId` or `reqId` when present. |
| Timeout or network error | Report the failure and verify the server origin; do not fall back to localhost. |

## Test Record

The catalog was expanded to 54 endpoints. The original sweep ran on 2026-09-24; `token-refresh` was added on 2026-09-27 and `sso-login` was added on 2026-10-09. Fifty-one routes returned HTTP 200 with business `code: 200`; three returned HTTP 404 and are marked unavailable. The tested authenticated headers included `Authorization`, `Accept`, `Lang`, and `Content-Type`; `sso-login` was tested without Authorization and with a minimal `{username,password}` body.

## 6. Real-Time Channel (WebSocket)

The management-center origin also exposes a WebSocket channel at `wss://<origin>/ws` (captured from a live session on 2026-10-09). It is not a JSON route and is not part of `endpoints.json`.

- Handshake: `GET /ws` with `Upgrade: websocket` / `Connection: Upgrade` / `Sec-WebSocket-Key`.
- Auth: the captured handshake carried the management-center **session cookies** (no `Authorization` header). A plain HTTP `GET /ws` without upgrade headers just hangs while the server waits for the upgrade, and a non-WebSocket HTTP client cannot complete the handshake - use a real WebSocket client.
- Scope: treat `/ws` as the push channel for the management center, separate from the request/response API. The bearer token used by the REST routes is not shown to authenticate the socket, so do not assume `YUNLOGIN_SERVER_TOKEN` is accepted there.
