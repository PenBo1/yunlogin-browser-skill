# YunLogin Browser + Playwright CLI Pairing

Use this guide when a user wants YunLogin discovery/API behavior together with Playwright CLI page control. `yunlogin-browser` owns surface selection, environment launch, Workbench state, bridge ports and login-source validation. The Playwright CLI and its optional agent skill own browser tabs, snapshots, clicks, fills and page assertions. Keep the two roles explicit so a successful page connection is not mistaken for a verified native Workbench session.

## User-facing offer

Use one short question at a time. Translate this into the user's language:

> I can pair the YunLogin Browser skill with Playwright CLI. I will first check Node/npm, the CLI and the optional Playwright agent skill. If either is missing, I will show the install step and ask before changing your machine. Which do you want: install the missing tools, see manual commands, or continue with built-in CDP only?

If the user already explicitly requested installation, that is authorization for the named installation. Do not ask again. Installing the CLI, installing the agent skill and installing a browser are separate changes; state which one is being performed. Do not install all three because one is missing.

Report these stages separately:

1. `yunlogin-browser` loaded
2. Node/npm ready
3. Playwright CLI ready
4. optional Playwright agent skill ready
5. selected browser available
6. CDP verified and owned by the intended browser
7. login/bridge state verified
8. requested page action completed

## Read-only prerequisite check

macOS/zsh:

```sh
command -v node
command -v npm
command -v playwright-cli
node --version
npm --version
playwright-cli --version
playwright-cli open --help
playwright-cli attach --help
playwright-cli run-code --help
test -f "$HOME/.agents/skills/playwright-cli/SKILL.md" && echo agent-skill=present || echo agent-skill=missing
```

Windows/PowerShell:

```powershell
Get-Command node,npm,playwright-cli -ErrorAction SilentlyContinue
node --version
npm --version
playwright-cli --version
playwright-cli open --help
playwright-cli attach --help
playwright-cli run-code --help
Test-Path (Join-Path $env:USERPROFILE '.agents\skills\playwright-cli\SKILL.md')
```

Use the installed help as the source of truth. The CLI package checked on 2026-11-16 requires Node.js 18 or newer; this skill prefers Node.js 22+ for its CDP helpers, or Node.js 20 with `--experimental-websocket`. Do not replace a working version solely because it differs from the checked version.

## Install the CLI

The official package is `@playwright/cli`. After authorization, run:

```sh
npm install -g @playwright/cli@latest
playwright-cli --version
playwright-cli open --help
playwright-cli attach --help
playwright-cli run-code --help
```

Use the same commands in PowerShell. If npm succeeds but the command is missing, inspect `npm prefix -g` and use the absolute executable in that prefix before changing PATH. On macOS use `rehash` after a current-shell PATH update. On Windows use `playwright-cli.cmd` when PowerShell script policy blocks a `.ps1` shim. Do not use `sudo`, disable TLS verification, change registries or loop reinstall without explaining the specific failure.

If Node/npm is missing, guide the user to install a supported Node.js LTS and reopen the shell. Do not assume Homebrew, nvm, winget or administrator access. If the user declines, keep using the built-in YunLogin CDP helpers where possible and report that Playwright page control is unavailable.

## Install the optional Playwright agent skill

The agent skill improves Playwright CLI discovery and page-control guidance. It is optional and does not provide YunLogin credentials. Ask separately before writing it unless the user already authorized installing both tools.

First inspect the installed command:

```sh
playwright-cli install --help
```

When help lists `--skills` and `--global`/`-g`:

```sh
playwright-cli install --skills agents --global
test -f "$HOME/.agents/skills/playwright-cli/SKILL.md"
```

For older builds without `--global`, run from the user's home directory:

```sh
cd "$HOME"
playwright-cli install --skills agents
test -f "$HOME/.agents/skills/playwright-cli/SKILL.md"
```

PowerShell equivalents use `Set-Location $env:USERPROFILE` and `Test-Path (Join-Path $env:USERPROFILE '.agents\skills\playwright-cli\SKILL.md')`. Never initialize this optional skill inside the YunLogin repository or overwrite an existing skill without telling the user. If installation is declined, continue with the CLI and the YunLogin references.

## Browser prerequisite

Attaching to an existing YunLogin environment CDP does not need a new browser. The macOS web Workbench fallback launches the installed Chrome channel; check the actual executable before starting it. On Windows check the user's Chrome installation as well. If no suitable browser exists, present browser installation as a separate choice.

Inspect the installed command before using a bundled browser:

```sh
playwright-cli install-browser --help
playwright-cli install-browser chrome --dry-run
```

Only run `playwright-cli install-browser chrome` after browser-install authorization. A bundled Chromium install is not automatically the same as the `channel: chrome` configuration; adjust and verify the dedicated config if the user chooses a different browser.

## Pairing workflows

### Windows native Workbench

1. Run `node scripts/yunlogin-client.mjs status`.
2. Confirm `workbench.cdpReady`; if false, inspect `start --dry-run` and ask before a disruptive native restart.
3. Use a user-level run directory and a distinct session name:

```powershell
$runDir = Join-Path $env:LOCALAPPDATA 'yunlogin-browser\playwright-cli'
New-Item -ItemType Directory -Force $runDir | Out-Null
Push-Location $runDir
try {
  playwright-cli -s=yunlogin-windows-workbench attach --cdp=<verified-cdp-url>
  playwright-cli -s=yunlogin-windows-workbench tab-list
  playwright-cli -s=yunlogin-windows-workbench snapshot
} finally {
  playwright-cli -s=yunlogin-windows-workbench detach
  Pop-Location
}
```

4. Run `yunlogin-auth.mjs sync-workbench` only when native Workbench CDP and the management page identity have verified. The agent skill controls page actions; YunLogin owns credential synchronization.

### macOS web Workbench

1. Run native `status`; if native CDP is unavailable, explain the fallback and get the user's choice to open a separate web Workbench.
2. Run `yunlogin-workbench-web.mjs` in a new output directory. It generates a CDP config and verified bridge-port init script without reading login data.
3. Open the generated config with a distinct Playwright session. Verify the owned Chromium PID, `/json/version`, `Browser.getVersion`, and management origin.
4. Choose an existing YunLogin environment as the source. Run `yunlogin-workbench-web-login.mjs --dry-run`, then repeat with `--confirm-transfer` after the user authorizes the token read/cache/injection. The helper validates Authorization against the management user/company endpoints and stores a 0600 web session cache.
5. Reload the selected management page, verify `Authorization`, `userinfo`, `CompanyInfo`, current identity and the requested read-only page operation. A bridge port or token alone is not page readiness.
6. Keep native API helpers and web page control separate. Do not call `sync-workbench` and silently replace the web session owner.

### YunLogin environment browser

1. Resolve the environment ID through the documented local/server list flow.
2. Launch with `scripts/yunlogin-cdp.mjs start`; use the returned `data.ws.puppeteer`. Do not guess a port or add environment-managed debug/profile flags.
3. Attach with a distinct session name such as `yunlogin-environment`, then `tab-list`, `snapshot`, page actions and `detach`.
4. Close only the environment the user asked to close. Do not close Workbench or use `close-all`/`kill-all` for cleanup.

## Handoff and failure handling

Use a short handoff between skills:

> YunLogin resolved the target and verified CDP. Playwright CLI can now operate the selected page. The current stage is <login pending / bridge verified / page action ready>.

If a stage fails, report **observed state -> blocked capability -> next action**. Do not attach to another browser merely because its `/json/version` answers. Keep sessions distinct: `yunlogin-windows-workbench`, `yunlogin-web-workbench`, and `yunlogin-environment` are examples, not interchangeable targets. Detach when page control ends; leave the browser open unless the user asked to close it. Never print token, Cookie, `--base-data`, full storage, or private profile values.
