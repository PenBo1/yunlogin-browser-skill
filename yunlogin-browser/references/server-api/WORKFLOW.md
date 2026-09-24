# Server API Workflow

## 1. Choose the API Surface

Use the server API only for management-center operations and the 29 cataloged server endpoints. Use the local API documentation in `../api/` for the desktop client and loopback service. Never send a localhost path to the server origin or a server path to the localhost helper.

## 2. Configure the Bearer Token

Follow [TOKEN_SETUP.md](TOKEN_SETUP.md) for customer-facing storage and cleanup guidance. For a temporary session, set `YUNLOGIN_SERVER_TOKEN` in the current process before a live request:

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
```

The token is read from the environment only. It is never accepted as a command-line argument and is never written by the helper.

## 3. Inspect the Catalog and Endpoint Document

Use the endpoint ID from `endpoints.json` or the index in `README.md`. Read the endpoint document for its method, path, query parameters, body fields, response envelope, and endpoint-specific notes.

## 4. Validate Before Sending

Use `--dry-run` to validate the endpoint ID, query parameters, body, origin, and token presence without sending an HTTP request:

```powershell
node scripts/yunlogin-server-api.mjs browser-list --dry-run
node scripts/yunlogin-server-api.mjs account-list --body-file request.json --dry-run
```

## 5. Send and Verify

A live request is sent only when `--dry-run` is omitted. Treat HTTP success and business success separately. The tested server responses use HTTP 200 and a JSON envelope with `code: 200`; the success `msg` value varies by endpoint (`Success`, `ok`, or `OK`). The endpoint document remains authoritative for field shape.

## Common Request Rules

- POST endpoints accept JSON request bodies. Query parameters are named in the endpoint document.
- GET endpoints pass their filters through the query string.
- `page` and `per_page` or `pageSize` control pagination where documented.
- Company and user identifiers can be supplied explicitly or injected from `YUNLOGIN_SERVER_COMPANY_ID` and `YUNLOGIN_SERVER_USER_ID` when the cataloged field exists.
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
| Missing token | Stop before networking and ask the user to set `YUNLOGIN_SERVER_TOKEN`. |
| Unknown endpoint ID | Stop before networking; choose a documented endpoint ID. |
| Missing required query or body field | Stop before networking; fill the documented field. |
| HTTP 401 or 403 | Treat the token as missing, expired, or unauthorized; do not retry with a different origin. |
| HTTP 200 with an error business code | Report the HTTP status, `code`, `msg`, and `traceId` or `reqId` when present. |
| Timeout or network error | Report the failure and verify the server origin; do not fall back to localhost. |

## Test Record

The 29 cataloged endpoints were tested on 2026-09-24 against `https://d126447d359e70c0.yunlogin.com`. Twenty-seven returned HTTP 200 and business `code: 200`; two returned HTTP 404 and are marked unavailable in their endpoint documents. The tested headers included `Authorization`, `Accept`, `Lang`, and `Content-Type` for POST requests; `Origin` and `Referer` were not required by the tested requests.