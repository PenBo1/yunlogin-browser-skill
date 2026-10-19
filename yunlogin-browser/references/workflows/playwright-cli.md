# Playwright CLI With YunLogin CDP

Use Playwright CLI when the user wants to inspect or operate pages in the existing YunLogin Workbench or a launched environment browser. The command attaches to an existing CDP endpoint; it does not need a separate extension in the browser. Keep Workbench CDP and environment-browser CDP distinct.

## Detect and install

First check the command and the agents skill:

```powershell
Get-Command playwright-cli -ErrorAction SilentlyContinue
playwright-cli --version
playwright-cli attach --help
Test-Path (Join-Path $env:USERPROFILE '.agents\skills\playwright-cli\SKILL.md')
```

When both the CLI and its skill are available, skip installation. On the machine tested 2026-10-19, `playwright-cli` is version `0.1.13` and the user-level skill is already installed. These are observations, not required versions.

If the command is missing, explain that installation changes the user's machine and ask whether to install it. After approval:

```powershell
npm install -g @playwright/cli@latest
playwright-cli --version
```

If the skill is also missing, ask before writing it. With the installed CLI's `install --help` as the source of truth, install into the user's `.agents/skills` rather than creating generated files in this repository:

```powershell
Push-Location $env:USERPROFILE
try { playwright-cli install --skills agents } finally { Pop-Location }
Test-Path (Join-Path $env:USERPROFILE '.agents\skills\playwright-cli\SKILL.md')
```

Newer CLI builds may support `playwright-cli install --skills=agents -g`; use it only when the installed `install --help` lists `-g`. Do not install Chromium or another browser just to attach to a YunLogin browser. If `Get-Command` fails after npm installation, inspect `npm prefix -g` and the `playwright-cli.cmd` executable in that prefix before reinstalling. If the user declines installation, use the built-in `yunlogin-fb-cdp.mjs` or `yunlogin-cdp.mjs` for CDP checks.

## Attach to Workbench

Run the first two lines from the `yunlogin-browser` skill directory. `status` is read-only and reports the current verified Workbench CDP URL. Run Playwright CLI in a user-level working directory so its snapshots and console logs do not enter the skill folder:

```powershell
$state = node scripts/yunlogin-client.mjs status | ConvertFrom-Json
if (-not $state.workbench.cdpReady) { throw 'Workbench CDP is not ready; follow STARTUP.md' }
$cdp = $state.workbench.cdpUrl
$runDir = Join-Path $env:LOCALAPPDATA 'yunlogin-browser\playwright-cli'
New-Item -ItemType Directory -Force -Path $runDir | Out-Null
Push-Location $runDir
try {
  playwright-cli -s=yunlogin-workbench attach --cdp=$cdp
  playwright-cli -s=yunlogin-workbench tab-list
  # Replace 0 with the management-center index reported by tab-list.
  playwright-cli -s=yunlogin-workbench tab-select 0
  playwright-cli -s=yunlogin-workbench snapshot
} finally {
  playwright-cli -s=yunlogin-workbench detach
  Pop-Location
}
```

Select the management-center tab from `tab-list`; the `0` above is a placeholder and must be replaced when another tab has that index. Use `snapshot` to obtain element references before clicking or filling. `detach` ends the CLI connection while leaving Workbench open. Do not use `close` when the user merely wants to stop automation.

If `cdpReady` is false, run `node scripts/yunlogin-client.mjs start --dry-run` and inspect the plan. An already-running Workbench without CDP must close and reopen to add the debugging flag. Explain the disruption and request approval before `node scripts/yunlogin-client.mjs start --confirm-restart`. A fresh client launch through the skill can enable CDP as part of its authorized startup. The port is selected dynamically, bound to `127.0.0.1`, and verified against the Workbench PID. Never use the YunLogin application WebSocket or an old recorded port as the CDP address.

If attach fails, rerun `status` for the new URL, then `node scripts/yunlogin-fb-cdp.mjs list --main-only` and `node scripts/yunlogin-fb-cdp.mjs check --port <current-port>`. A Workbench restart changes the PID and may change the port. Do not restart repeatedly or attach to another browser just because its `/json/version` answers.

## Attach to an environment browser

An environment launched by the local API has its own CDP URL in the launch response. It is separate from Workbench and normally needs no Workbench restart:

```powershell
node scripts/yunlogin-cdp.mjs start --account-id <account-id> --output session.json
$session = Get-Content session.json -Raw | ConvertFrom-Json
$cdp = $session.data.ws.puppeteer
Push-Location (Join-Path $env:LOCALAPPDATA 'yunlogin-browser\playwright-cli')
playwright-cli -s=yunlogin-environment attach --cdp=$cdp
playwright-cli -s=yunlogin-environment tab-list
playwright-cli -s=yunlogin-environment snapshot
playwright-cli -s=yunlogin-environment detach
Pop-Location
```

The launch response and session file can include sensitive environment details; keep generated files outside the skill and do not print or commit them. The built-in `yunlogin-cdp.mjs` can check targets when Playwright CLI is unavailable.

## Session handling

- Use distinct `-s=` names for Workbench and environment browsers to avoid mixing tabs.
- `attach --cdp=<url>` connects to the existing browser. `detach` leaves it running; `close` is a separate command that may stop a browser controlled by the CLI.
- CDP grants browser control. Keep it on loopback, do not paste the full URL into public logs, and avoid `state-save`, `cookie-list`, `localstorage-list`, or `localstorage-get` unless the user's task explicitly needs those sensitive values.
- The CLI's own session state and snapshots may be written outside the skill folder. Use a chosen working directory and clean only artifacts created for the current task when they are no longer needed.

See [cdp-automation.md](cdp-automation.md) for environment launch behavior and [../client-api/STARTUP.md](../client-api/STARTUP.md) for Workbench startup and restart guidance.
