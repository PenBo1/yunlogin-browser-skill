# Workbench Management Session

The skill only synchronizes the management-center session in the Workbench page. It does not read or control Workbench extensions. Browser automation uses the Workbench CDP URL directly with Playwright CLI; see [playwright-cli.md](playwright-cli.md).

The deployed management-center page reads its bearer from localStorage `Authorization` and stores the current user and selected company in `userinfo` and `CompanyInfo`. The skill reads exactly these three keys from the verified management-center page through Workbench CDP. `userinfo.userId` and `CompanyInfo.companyId` identify the selected context. No storage dump, Cookie list, or extension page is needed.

## Commands

```powershell
node scripts/yunlogin-client.mjs status
node scripts/yunlogin-auth.mjs status
node scripts/yunlogin-auth.mjs sync-workbench --dry-run
node scripts/yunlogin-auth.mjs sync-workbench
```

`status` is a read-only comparison. `sync-workbench` validates the page token and account context before writing one user-level cache: `%LOCALAPPDATA%\yunlogin-browser\workbench-session.json` on Windows, or `~/.local/share/yunlogin-browser/workbench-session.json` elsewhere. It records the server bearer, user, selected company, optional JWT expiry, source Workbench PID/start time/CDP port, and capture time. It is atomically replaced under an exclusive update lock. Raw values are not printed.

Each authenticated API operation re-reads this page first. The skill checks `POST /v2/sso/auth/myUserinfo` and `POST /v2/team/curCompanyInfo` against the page's user/company, then reads the page again. If the token or selected account changes, it retries once; a continuing change stops the operation. Mutations also recheck the current identity before sending. The current local API origin is discovered separately using a read-only status route. Local API token handling is outside this Workbench session workflow; an endpoint that rejects an unauthenticated local request is reported as unavailable, not repaired by opening an extension.

The old `server-token.json` and `local-token.json` files are not active sources or fallbacks and are not deleted automatically. Server token, Cookie, and company/user environment overrides cannot replace the Workbench session. `save-server-token`, independent `login`, `refresh-server-token`, legacy cache clearing, extension token capture, and temporary-environment token bootstrap are disabled in this mode. The helper does not call `tokenRefresh` independently; let Workbench renew or sign in again and run `sync-workbench`.

If Workbench CDP is unavailable, the page is logged out, server identity rejects the bearer, or the company differs, synchronization invalidates the cached session and stops before an authenticated business request. `--dry-run` does not start/restart a process, issue an API request, or write the cache. To use browser automation while management authentication is unavailable, attach Playwright CLI to the verified Workbench CDP URL without running a management API command.
