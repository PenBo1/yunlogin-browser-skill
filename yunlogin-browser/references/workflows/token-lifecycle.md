# Token Lifecycle

YunLogin uses two separate credentials. They are not interchangeable, and they are stored in different places.

| Credential | Grants | Where it comes from | Stored in |
| --- | --- | --- | --- |
| Local token | The loopback desktop API on port 50213 | Captured from the bundled browser extension through CDP | User-level cache |
| Server token | The management-center HTTPS API | Supplied by the user once | User-level cache |

Neither token is written into the skill, the package, Markdown, logs, or responses.

## Storage

Both files live in the user profile, outside the repository:

| Platform | Location |
| --- | --- |
| Windows | `%LOCALAPPDATA%\yunlogin-browser\` |
| Other | `~/.local/share/yunlogin-browser/` |

| File | Contents |
| --- | --- |
| `local-token.json` | Local token plus its capture time |
| `server-token.json` | Server token, its expiry, the last refresh time, and the company and user context that management-center routes require |

The server session file keeps the company and user next to the token, so a saved session removes the need to export `YUNLOGIN_SERVER_COMPANY_ID` and `YUNLOGIN_SERVER_USER_ID` on every call. It also records the expiry returned by `tokenRefresh`, which lets a helper refresh before a call instead of failing on it.

### Why A Local Token Exists

The desktop keeps a bearer value for the bundled extension, and the skill captures the same value so the loopback routes can be called with the header the desktop itself uses. On the tested build the local API does not enforce that header: a missing or deliberately wrong local token still answers `code: 0`. The capture is kept because other builds and the identity fields do use it. Treat `local-token.json` as a credential even where the current build ignores it.

## Resolution Order

Environment variables always win, so a script or CI job can override a saved session:

1. `YUNLOGIN_LOCAL_TOKEN` for the local token, then `YUNLOGIN_LOCAL_TOKEN_FILE`, then the default cache file.
2. `YUNLOGIN_SERVER_TOKEN` for the server token, then `YUNLOGIN_SERVER_TOKEN_FILE`, then the default cache file.
3. `YUNLOGIN_SERVER_COMPANY_ID`, `YUNLOGIN_SERVER_USER_ID`, and `YUNLOGIN_SERVER_COMPANY` for the identity, then the cached server session.

## Commands

```powershell
node scripts/yunlogin-auth.mjs status
node scripts/yunlogin-auth.mjs save-server-token
node scripts/yunlogin-auth.mjs ensure-server
node scripts/yunlogin-auth.mjs refresh-server-token
node scripts/yunlogin-auth.mjs ensure-local --confirm-create
node scripts/yunlogin-auth.mjs clear-server-token
node scripts/yunlogin-auth.mjs clear-local-token --confirm-clear
```

| Command | Behaviour |
| --- | --- |
| `status` | Verifies both credentials and prints their storage paths. Never prints a token. |
| `save-server-token` | Verifies a token, resolves the account identity, and stores the session. |
| `ensure-server` | Verifies the stored server token, refreshes it when it is due, and deletes it when the server rejects it. |
| `refresh-server-token` | Forces a `tokenRefresh` call and stores the replacement token with its expiry. |
| `ensure-local` | Verifies the stored local token and captures a new one when the local API rejects it. |
| `clear-server-token` | Deletes the cached server session. |
| `clear-local-token` | Deletes the cached local token. Requires `--confirm-clear`. |

## Saving The Server Token

Read the value from `YUNLOGIN_SERVER_TOKEN` or from a file, never from a command-line argument:

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-auth.mjs save-server-token

# or
node scripts/yunlogin-auth.mjs save-server-token --token-file .\token.txt
```

`save-server-token` performs these steps:

1. Verifies the token with `POST /v2/sso/auth/myUserinfo`.
2. Reads the user ID from the response.
3. Lists companies with `POST /v2/team/myCompanies`.
4. Uses the only company automatically, or requires `--company-id` when the account belongs to several companies. It never guesses which company to use.
5. Writes the token and identity to `server-token.json`.

## Refresh Rules

A credential is refreshed only when it stops working. A working token is left untouched.

| Situation | Result |
| --- | --- |
| Local token accepted by the local API | Kept as is |
| Local token rejected, or no local token stored | Captured again from the browser extension and the cache is overwritten |
| No environment exists during a local refresh | Asks first, then creates a temporary environment when `--confirm-create` is passed, and deletes it again |
| Server token accepted and outside the refresh window | Kept as is |
| Server token accepted but inside the refresh window | Exchanged at `tokenRefresh` for a token with a fresh expiry; the cache is rewritten |
| Server token rejected | The stale cache file is deleted and the command reports that a fresh token is required |
| `YUNLOGIN_SERVER_TOKEN` set and valid while the cache is empty or stale | The cache is rewritten from the environment value |

The server token cannot be captured automatically. It comes from the management-center web session, so a rejected server token always needs a fresh value from the user. The helper deletes the stale file so the next call cannot silently reuse a credential the server already rejected.

The local probe uses `POST /api/v2/userapi/user/shopseriallist`. Some desktop builds do not enforce the token on that route; on those builds a stored token always probes as usable and no refresh is attempted.

## Server Token Refresh

`POST /v2/sso/auth/tokenRefresh` exchanges the current bearer token for a new one
and reports when the new token expires. The skill calls it so the cached session
carries an explicit expiry instead of an unknown lifetime. The route itself is
documented in [token-refresh.md](../server-api/endpoints/token-refresh.md).

| Step | Detail |
| --- | --- |
| Source of the expiry | `data.expire` from the `tokenRefresh` response. The issued JWT carries a matching `exp` claim, so either value can drive the check. |
| When a refresh happens | `save-server-token` refreshes right after it verifies the token, `refresh-server-token` forces a call, and every server request refreshes first when the remaining lifetime is inside the skew window. |
| Default skew | 24 hours. Override with `YUNLOGIN_SERVER_REFRESH_SKEW_MS`. Setting it larger than the token lifetime forces a refresh before every call. |
| Observed lifetime | 168 hours (7 days) counted from the call. |
| On `code: 1001` | The helper refreshes once and retries the request once. If the refresh fails too, the original business error is reported and the command exits non-zero. |
| On refresh failure | The existing cached token is left in place, because it may still be valid for the call being made. |

A rejected token cannot repair itself: `tokenRefresh` needs a usable token to
issue a new one. Only a fresh value from the user breaks that cycle.

## Token Bootstrap

`ensure-local` and `node scripts/yunlogin-env.mjs bootstrap-token` share the same capture routine:

1. List environments, server API first and local API second.
2. Reuse the first environment, or create a temporary one after the user confirms.
3. Start it headless, read `Authorization` from the extension origin through CDP.
4. Verify the value with a local user API read.
5. Store it in `local-token.json` and delete a temporary environment through the server delete route.

Temporary environments use a short readable name, such as `skill-temp-141-0924-1705`, and the creation details go into the remark instead of the name.

## Privacy Rules

- Treat both cache files as credentials. They live outside the repository so a skill update never ships a token.
- Never print a token, even when reporting a failure. The helpers report lengths, status codes, and storage paths only.
- Prefer `--token-file` or the environment variable over pasting a token into a command line.
- Delete a cached session when a machine is handed over: `clear-server-token` and `clear-local-token --confirm-clear`.

## Verified Results

| Check | Result |
| --- | --- |
| `save-server-token` with an account holding 5 companies and no `--company-id` | Refused with `needsCompany: true` and listed the count; nothing written |
| `save-server-token --company-id <id>` | Saved; user ID and company name resolved automatically |
| `status` with no environment variables | Local usable from cache, server usable from cache, identity resolved |
| `ensure-server` with a valid cached token | Reported usable and kept the cache |
| `ensure-server` with a deliberately stale token | Deleted the cache, returned `needsNewToken: true` with the server reason |
| `ensure-local` on a build that does not enforce the token | Reported usable and did not refresh |
| Environment helpers with no environment variables set | Server transport used the cached session for list, group-list, tag-list, delete, and bootstrap-token |
| `refresh-server-token` | `refreshed: true`, token length 215, and the expiry moved from 101 hours to 168 hours |
| `POST /v2/sso/auth/tokenRefresh` probed directly | HTTP 200, `code: 200`, `msg: ok`; `data.expire` matched the JWT `exp` claim to the second |
| `tokenRefresh` with and without `ApiSource: 1` | Identical payload both ways, so the header is sent but not enforced on the tested origin |
| A server read with the skew set above the token lifetime | Refreshed before the call, printed the new expiry, then returned `code: 200` |
| A server read with a deliberately invalid token | Reported `code: 1001`, attempted no doomed retry, and exited 1 |
| `server-token.json` after a refresh | Holds `token`, `captured_at`, `expires_at`, `expires_at_ms`, `refreshed_at`, `company_id`, `user_id`, and `company` |
