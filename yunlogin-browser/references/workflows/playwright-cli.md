# Playwright CLI With YunLogin CDP

For the complete multi-skill installation and handoff process, read [playwright-pairing.md](playwright-pairing.md) first. This file contains the detailed command reference and mode-specific attach examples.

Use Playwright CLI when the user wants to inspect or operate pages in a verified native Workbench, a selected web Workbench, or a launched environment browser. The command can attach to an existing CDP endpoint. When native macOS Workbench CDP is unavailable, offer the explicit [web Workbench fallback](web-workbench.md): launch a separate Chromium profile with loopback CDP, inject fresh bridge ports before site scripts, and obtain/cache Authorization from a selected YunLogin environment using the explicit web login adapter, or let the user sign in if that source/cache does not verify. Keep native Workbench, web Workbench and environment-browser CDP distinct internally, while reporting one user-facing Workbench session.

## Detect And Guide Installation

Explain the three separate prerequisites in the user's language: Node.js/npm runs the tool, `@playwright/cli` provides the command, and a Chromium browser is needed only when launching a new browser. A CLI installation is not a browser installation, an agent-skill installation, or a working Workbench CDP connection.

### Inspect Before Offering Installation

Run read-only checks appropriate to the user's shell. macOS/zsh:

```sh
command -v node
command -v npm
command -v playwright-cli
node --version
npm --version
```

Windows/PowerShell:

```powershell
Get-Command node,npm,playwright-cli -ErrorAction SilentlyContinue
node --version
npm --version
```

If CLI resolves, check its actual version and supported options before using it:

```sh
playwright-cli --version
playwright-cli open --help
playwright-cli attach --help
playwright-cli run-code --help
```

The official CLI package inspected on 2026-11-16 declares Node.js >=18. For this skill prefer Node.js 22+ because its built-in CDP/Workbench helpers need global WebSocket; Node.js 20 can invoke those helpers with `--experimental-websocket`. Do not force-upgrade a working CLI because its version differs from the tested 0.1.24. Verify required options such as `--cdp`, `--config` and `--filename` in installed help.

### Explain The Missing Component

If Node/npm is missing or too old, guide the user to install a supported Node.js LTS from `https://nodejs.org/en/download`, using their existing version manager if present. On macOS choose the build for the actual machine architecture (`uname -m`: arm64 or x86_64); on Windows select the matching architecture in the installer. Reopen Terminal/PowerShell and repeat the checks. Do not assume Homebrew, nvm, winget or administrator access is available, or replace an existing Node installation without checking it.

If the CLI is missing, explain that installation adds a global npm command and ask whether to install it, unless the user already explicitly requested that installation. A request to improve this guide is not authorization to install software. Suggested message, translated into the user's language:

"Playwright CLI is not installed. Node.js/npm <available/missing> and the selected browser <available/missing>. I can install the official @playwright/cli command for the separate web Workbench. It will not restart YunLogin or copy login data. Shall I install it?"

Offer **install the CLI**, **show manual steps**, and **continue without installing**. If authorized already, say what will be installed and proceed; do not ask again. After a manual-install choice, provide the applicable commands and ask the user to say when finished, then recheck. If declined, explain which requested page-automation workflow cannot run; existing verified CDP can still use the built-in helpers, and manual Workbench remains available. Do not silently switch to MCP or another package with a similar name.

### Install The CLI And Verify

The official package is `@playwright/cli` (not `@playwright/mcp`). The command is the same in macOS Terminal and Windows PowerShell; after authorization:

```sh
npm install -g @playwright/cli@latest
playwright-cli --version
playwright-cli open --help
playwright-cli attach --help
playwright-cli run-code --help
```

Run each dependent verification only after installation succeeds. Record the actual version and summarize pass/fail; do not declare installation complete merely because npm returned output. No project package.json or lockfile is needed for global installation. Do not install into the YunLogin skill folder.

If an existing local CLI is selected, `npx --no-install playwright --version` can check availability; use `npx --no-install playwright cli --help` before choosing that alternative. Do not drop `--no-install` as an unapproved download workaround.

### Command Not Found Or Installation Fails

If npm succeeded but the command is not found, inspect the same shell's global prefix before reinstalling. macOS/zsh:

```sh
npm prefix -g
command -v node
command -v npm
cli_prefix="$(npm prefix -g)"
ls -l "$cli_prefix/bin/playwright-cli"
"$cli_prefix/bin/playwright-cli" --version
```

When the executable exists and runs by absolute path, add its directory to this shell only, then retry:

```sh
export PATH="$cli_prefix/bin:$PATH"
rehash
playwright-cli --version
```

Use the installed Node version's matching npm prefix when nvm or another version manager is in use. Do not hardcode this machine's versioned nvm path for another user. Explain any proposed persistent shell-profile edit and obtain the user's choice before making it; current-shell PATH repair or an absolute path is sufficient for the task.

Windows/PowerShell:

```powershell
$cliPrefix = (npm prefix -g).Trim()
Get-Command node,npm,playwright-cli -ErrorAction SilentlyContinue
Get-Item (Join-Path $cliPrefix 'playwright-cli.cmd') -ErrorAction SilentlyContinue
& (Join-Path $cliPrefix 'playwright-cli.cmd') --version
```

When that executable works, use its absolute path or append `$cliPrefix` to the current `$env:Path`. Reopen PowerShell after an installer changes PATH. If script execution policy blocks `npm.ps1` or `playwright-cli.ps1`, use the installed `npm.cmd` / `playwright-cli.cmd`; do not weaken execution policy globally.

For EACCES/EPERM, a proxy error, TLS failure, or timeout, report the actual failure and stage; inspect the npm prefix, its ownership or configured network route as relevant. Do not automatically use `sudo`, recursive ownership changes, disable TLS verification, switch to an untrusted registry, or loop reinstalls. Do not print credential-bearing proxy/registry configuration. Prefer the user's version manager or an agreed user-writable npm prefix for permission problems. Recheck `--version` after the specific fix.

### Optional Agent Skill

The Playwright CLI agent skill is optional; its absence does not prevent the CLI from running. If the user wants it installed, ask before writing it unless already authorized. Inspect the installed command first:

```sh
playwright-cli install --help
```

On CLI 0.1.24, help lists `--skills` and `--global`/`-g`. Install to the home directory only when those options are supported:

```sh
playwright-cli install --skills agents --global
```

For older versions without `--global`, run `playwright-cli install --skills agents` from the user's home directory, then verify `.agents/skills/playwright-cli/SKILL.md` there. On macOS use `test -f "$HOME/.agents/skills/playwright-cli/SKILL.md"`; on Windows use `Test-Path (Join-Path $env:USERPROFILE '.agents\skills\playwright-cli\SKILL.md')`. Avoid overwriting an existing skill or initializing the current project accidentally. Do not make the optional skill a hard dependency of web Workbench setup.

### Browser Availability And Handoff

**Attach to existing YunLogin CDP:** no new browser download is needed. CLI availability still does not enable CDP in native macOS Workbench; follow its status and fallback guidance.

**Launch web Workbench:** the generated config selects `channel: chrome`. On macOS check the actual Google Chrome executable, for example `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` or the user's Applications directory. On Windows check the standard per-user/Program Files Chrome installation paths. Reuse a working installed browser. If Chrome is missing, explain the browser download separately and ask whether to install Chrome or use an agreed supported Chromium configuration. Inspect `playwright-cli install-browser --help`; CLI 0.1.24 supports the read-only plan `playwright-cli install-browser chrome --dry-run`. Run the real `playwright-cli install-browser chrome` only with browser-install authorization; if privileges or download policy block it, guide manual Chrome installation rather than escalating automatically. Installing bundled Chromium does not satisfy `channel: chrome`: a Chromium choice requires adjusting the dedicated config to that installed executable or supported browser selection and retesting.

After the dependencies pass, resume [web-workbench.md](web-workbench.md) or the selected attach workflow. Suggested result: "Playwright CLI <actual-version> is ready; browser <available/not needed/pending>. I have not transferred login data. Next I will <authorized launch/attach plan>." Report browser-launched, CDP-verified, ports-injected and login-verified as separate later stages. For an installation-only task stop after dependency verification; do not launch a browser or read storage unnecessarily.

## Attach to Workbench

This section is for verified native Workbench CDP, primarily the Windows path. On macOS, if `workbenchCdp.ready` is false, skip native attach and follow [web-workbench.md](web-workbench.md).

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

If `cdpReady` is false, inspect `workbenchCdp.reasonCode` and follow [STARTUP.md](../client-api/STARTUP.md). On macOS, offer the explicit [web Workbench](web-workbench.md) alternative; do not keep restarting native Workbench. On a supported Windows path, inspect `start --dry-run` and reuse explicit user authorization or ask before a disruptive restart. Never use an old port or the YunLogin application WebSocket as the CDP endpoint.

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
