# Playwright CLI Pairing

`yunlogin-browser` can hand a launched environment browser to the official Playwright CLI. The pairing is optional: the built-in `scripts/yunlogin-cdp.mjs` helper needs no installation, and every step below only adds richer page automation on top of it.

## When To Offer It

Offer the pairing when the task needs real browser automation rather than a single CDP call:

- Snapshot, click, fill, or assert on a page.
- Record a trace, video, or screenshot set.
- Run a Playwright test file against the YunLogin browser.
- Mock network requests or drive storage state.

For a one-off `document.title` check or a raw CDP call, stay with the built-in helper.

## Ask The User First

Do not install anything on your own initiative. Installation changes the machine, and the ask is part of the workflow:

1. Detect whether the CLI is already available.
2. Tell the user what the pairing adds and that it is optional.
3. Ask whether to install it.
4. Install only after the user agrees. If they decline, keep using `scripts/yunlogin-cdp.mjs`.

## Detect

```powershell
playwright-cli --version
```

- Prints a version, for example `0.1.13`: the CLI is ready. Skip the install.
- Prints "not recognized" or fails: the CLI is missing. Ask the user before installing.

## Install

The package is `@playwright/cli`. Installing it globally also installs the `playwright-cli` skill so this skill can follow its guidance:

```powershell
npm install -g @playwright/cli
playwright-cli install --skills agents
playwright-cli --version
```

`playwright-cli install --skills agents` writes the Playwright CLI skill into `.agents/skills/playwright-cli` in the current workspace. Use `--skills claude` only when the target is a Claude workspace.

### When The Command Is Not On PATH

A global npm install does not always land in the prefix npm reports later, because the active prefix can change between installs. Diagnose in this order:

```powershell
playwright-cli --version          # works when the bin directory is on PATH
Get-Command playwright-cli        # shows the resolved path when it exists
npm prefix -g                     # the prefix npm reports now
npm root -g                       # where npm would install packages now
```

- If `Get-Command` resolves a path, use that executable directly.
- If it does not resolve, look under the prefix directories this machine may use. A custom prefix is common:
  ```powershell
  & "<prefix>\playwright-cli.cmd" --version
  ```
- If the executable is genuinely absent, install it into the current prefix:
  ```powershell
  npm install -g @playwright/cli
  ```

Observed example: on one machine `npm prefix -g` reported `%APPDATA%\npm`, while the working executable lived under a custom prefix on another drive. Trust `Get-Command` over the reported prefix.

## Attach To The YunLogin Browser

Launch the environment with the local API and read the CDP URL from the response:

```powershell
node scripts/yunlogin-cdp.mjs start --account-id <account-id> --output session.json
$session = Get-Content session.json -Raw | ConvertFrom-Json
$cdp = $session.data.ws.puppeteer

playwright-cli -s=yunlogin attach --cdp=$cdp
playwright-cli -s=yunlogin snapshot
playwright-cli -s=yunlogin eval "document.title"
playwright-cli -s=yunlogin detach
```

`-s=yunlogin` names the session so later commands reuse the same connection.

## Lifecycle Rules

| Action | Effect |
| --- | --- |
| `attach --cdp=<url>` | Connects to the running environment browser. |
| `detach` | Leaves the YunLogin browser running. This is the normal way to finish. |
| `close` | Closes the browser. Use it only when the user wants the environment stopped. |

- Detaching does not revoke the CDP URL; the local environment keeps the debugging port alive.
- Do not expose the CDP port beyond loopback. It grants full control of the browser.
- Delete a stale session state directory only when a session is no longer needed.

## Fallback

When the CLI is absent, or the user declines the install, the built-in helper still covers the workflow:

```powershell
node scripts/yunlogin-cdp.mjs check --session-file session.json
node scripts/yunlogin-cdp.mjs targets --session-file session.json
node scripts/yunlogin-cdp.mjs open --session-file session.json --url https://example.com
node scripts/yunlogin-cdp.mjs eval --session-file session.json --expression "document.title"
```

Read [cdp-automation.md](cdp-automation.md) for the launch flow, the `append_cmd` policy, and the restricted flags.
