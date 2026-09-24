# Server API Token Setup

This guide is for the customer or operator who runs `yunlogin-server-api.mjs`.

The helper reads the bearer token from `YUNLOGIN_SERVER_TOKEN` first, and from the user-level cache next:

```text
%LOCALAPPDATA%\yunlogin-browser\server-token.json
```

Cache the session once instead of exporting variables on every call:

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-auth.mjs save-server-token
Remove-Item Env:YUNLOGIN_SERVER_TOKEN
```

The cached file also stores the company and user, so `YUNLOGIN_SERVER_COMPANY_ID` and `YUNLOGIN_SERVER_USER_ID` are no longer needed. `save-server-token` verifies the token before writing it and requires `--company-id` when the account belongs to several companies.

The token is never stored in this skill, `endpoints.json`, Markdown, command arguments, or the ZIP package. It lives only in the user profile.

## Recommended Setup

Use an operating-system secret store when one is available. Load the token into the current process only when a request is needed, then remove it from the process environment.

Example with PowerShell SecretManagement:

```powershell
$env:YUNLOGIN_SERVER_TOKEN = Get-Secret -Name "yunlogin-server-token" -AsPlainText

try {
  node scripts/yunlogin-server-api.mjs browser-list --dry-run
  node scripts/yunlogin-server-api.mjs browser-list --body-file request.json
}
finally {
  Remove-Item Env:YUNLOGIN_SERVER_TOKEN -ErrorAction SilentlyContinue
}
```

The secret store keeps the durable copy outside the repository. The environment variable exists only for the helper process and is removed in `finally`.

## Temporary Interactive Setup

If a secret store is not available, enter the token interactively instead of typing it into a command line that will be saved in shell history:

```powershell
$secureToken = Read-Host "YunLogin server token" -AsSecureString
$env:YUNLOGIN_SERVER_TOKEN = [System.Net.NetworkCredential]::new("", $secureToken).Password
Remove-Variable secureToken

node scripts/yunlogin-server-api.mjs browser-list --dry-run
```

Remove the token when finished:

```powershell
Remove-Item Env:YUNLOGIN_SERVER_TOKEN -ErrorAction SilentlyContinue
```

## Customer Checklist

1. Obtain a current YunLogin management-center bearer token through the customer's authorized process.
2. Store the durable copy in an operating-system secret store or another approved secret manager.
3. Load it into `YUNLOGIN_SERVER_TOKEN` only for the process that runs the helper.
4. Run `--dry-run` first to verify the endpoint, request shape, and token presence.
5. Send the live request only after the dry-run matches the intended operation.
6. Remove `YUNLOGIN_SERVER_TOKEN` from the process after the request.
7. Rotate the token immediately if it is exposed.

## Do Not

Do not put the token in:

- `SKILL.md`
- `endpoints.json`
- endpoint Markdown files
- source code or JavaScript files
- `.env` files inside the skill or repository
- command-line arguments such as `--token`
- screenshots, chat messages, issue reports, logs, or ZIP packages

Do not commit a token, paste it into PowerShell history, or set it as a machine-wide environment variable unless an approved deployment process explicitly requires that configuration.

## Privacy Boundary

The environment-variable design prevents accidental repository and package leakage, but it is not a secure vault. A same-user process can inspect process environments, and child processes can inherit the variable.

For the strongest practical privacy:

- keep the durable token in an OS secret store;
- inject it into the smallest possible process scope;
- run `--dry-run` before live requests;
- keep response redaction enabled;
- clear the environment variable after use;
- rotate exposed or expired tokens.

The helper masks `Authorization` and `Cookie` headers in dry-run output as `[SET]` and redacts common sensitive response fields by default. `--show-sensitive` is never required for normal operation and should be used only with explicit user authorization and a safe output destination.