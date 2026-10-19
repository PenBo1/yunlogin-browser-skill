# Workbench Server Session

Authenticated management-center calls use the bearer token currently held by the Workbench management page. The server API helper runs Workbench synchronization before each authenticated operation; it does not refresh an independent copy of the token. The active user's ID and selected company come from Workbench and are checked against the server's `myUserinfo` and `curCompanyInfo` responses.

```powershell
node scripts/yunlogin-client.mjs start --dry-run
node scripts/yunlogin-auth.mjs status
node scripts/yunlogin-auth.mjs sync-workbench --dry-run
node scripts/yunlogin-auth.mjs sync-workbench
node scripts/yunlogin-server-api.mjs browser-list --dry-run
node scripts/yunlogin-server-api.mjs browser-list
```

The only active cache is `%LOCALAPPDATA%\yunlogin-browser\workbench-session.json`. It is atomically replaced after both Workbench credentials and current identity are validated. The former `server-token.json` and `local-token.json` are not used as fallbacks. Do not copy the cache, token, Cookies, or browser storage values into the skill, source files, logs, or this conversation.

When CDP is unavailable, start Workbench through the skill or approve its controlled restart with `yunlogin-client.mjs start --confirm-restart`. Sign in and choose the intended company in Workbench, then run `sync-workbench` again. A rejected token is not refreshed by this helper. Workbench may renew its own session; the next operation re-reads it. If Workbench is logged out or the user/company differs, the operation stops before its authenticated business request.

`YUNLOGIN_SERVER_TOKEN`, token file overrides, independently supplied credentials, and identity overrides cannot replace the current Workbench session. Remove legacy overrides before running the skill. `save-server-token`, `login`, and `refresh-server-token` are disabled in Workbench mode. A dry-run validates the request shape without starting or restarting Workbench, requesting a new token, or writing the cache.
