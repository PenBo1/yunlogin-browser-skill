# CDP Automation

For Workbench browser automation, use `yunlogin-client.mjs status` to obtain the verified CDP URL, then attach Playwright CLI directly. Management API credentials are a separate concern; see [token-lifecycle.md](token-lifecycle.md). Environment-browser launch below has its own CDP endpoint.

This guide covers local YunLogin browser launch, the returned CDP WebSocket URL, external CDP endpoints, and safe `append_cmd` usage.

## Launch and CDP Flow

1. Launch an environment through the local API:

```powershell
node scripts/yunlogin-cdp.mjs start --account-id <account-id> --output session.json
```

2. The local API returns the browser session. The CDP WebSocket URL is:

```text
data.ws.puppeteer
```

3. Use that URL with an automation library or the built-in CDP helper:

```powershell
node scripts/yunlogin-cdp.mjs check --session-file session.json
node scripts/yunlogin-cdp.mjs targets --session-file session.json
node scripts/yunlogin-cdp.mjs open --session-file session.json --url https://example.com
node scripts/yunlogin-cdp.mjs eval --session-file session.json --expression "document.title"
```

The `start` command prints `cdpUrl`, `selenium`, `debuggingPort`, and `webdriver`. It saves the complete launch response when `--output` is provided.

## Local API Authentication

The local API availability check is separate from Workbench management authentication. If a local endpoint requires its own token, report that requirement; do not inspect Workbench extensions as part of this workflow. To synchronize management-center credentials:

```powershell
node scripts/yunlogin-auth.mjs sync-workbench
```

Before management API operations, run `node scripts/yunlogin-auth.mjs sync-workbench`. For browser automation, attach directly to the verified CDP URL; no credential synchronization is needed. Read [token-lifecycle.md](token-lifecycle.md) for the management session rules.

### Token Resolution And Privacy

The management-center page supplies the only credential synchronized by this skill. Legacy token environment variables and cache files do not override its current bearer. Browser CDP attachment does not require management token synchronization; see [playwright-cli.md](playwright-cli.md).
## External CDP URL

The helper also accepts a CDP URL returned by another tool:

```powershell
node scripts/yunlogin-cdp.mjs check --cdp-url ws://127.0.0.1:9222/devtools/browser/<id>
node scripts/yunlogin-cdp.mjs targets --cdp-url http://127.0.0.1:9222
```

- `ws://` and `wss://` URLs are used directly.
- `http://` and `https://` URLs are resolved through `/json/version`.
- External CDP endpoints are not restricted by the YunLogin local launch helper, but they must be supplied explicitly.

## Existing `fb.exe` Relaunch

A running Chromium process cannot receive a new command-line argument. If an
already-running `fb.exe` has no `--remote-debugging-port` and no other CDP
transport, `yunlogin-fb-cdp.mjs` can inspect it and, after confirmation,
restart it with a loopback debugging port.

Start read-only:

```powershell
node scripts/yunlogin-fb-cdp.mjs list --main-only
node scripts/yunlogin-fb-cdp.mjs inspect --pid <pid>
```

Plan the restart without changing the process:

```powershell
node scripts/yunlogin-fb-cdp.mjs restart --pid <pid> --port 9222 --dry-run
```

Apply it only after the user confirms the browser may close and reopen:

```powershell
node scripts/yunlogin-fb-cdp.mjs restart --pid <pid> --port 9222 --confirm-restart --output fb-session.json
```

The helper preserves the existing arguments, removes any previous
remote-debugging flags, and appends:

```text
--remote-debugging-address=127.0.0.1
--remote-debugging-port=<port>
```

It then waits for `/json/version`, connects to the returned WebSocket, and
verifies the endpoint with `Browser.getVersion`. Use the session file for
follow-up control:

```powershell
node scripts/yunlogin-fb-cdp.mjs check --session-file fb-session.json
node scripts/yunlogin-fb-cdp.mjs targets --session-file fb-session.json
node scripts/yunlogin-fb-cdp.mjs eval --session-file fb-session.json --expression "document.title"
node scripts/yunlogin-fb-cdp.mjs close --session-file fb-session.json
```

Process command lines are redacted by default. `--show-sensitive` prints the raw
command line and is only for an explicit request with a safe output destination.
The session file never contains the raw command line or the environment data
embedded in it. The helper rejects non-loopback CDP URLs. Prefer the managed
`POST /api/v2/browser/start` flow whenever the target is a normal YunLogin
environment, because that flow returns its own CDP endpoint without restarting
the Workbench process.

## `append_cmd` Purpose

`append_cmd` is the local API's POST body field for additional Chrome command-line arguments:

```json
{
  "account_id": "<account-id>",
  "append_cmd": "--disable-popup-blocking --disable-notifications",
  "headless": "0"
}
```

Use a single string. Separate distinct flags with spaces. For a single flag that accepts multiple values, follow that flag's own syntax, such as `--load-extension=path1,path2`.

## Common Safe Flags

These flags are commonly safe to add when the automation use case requires the behavior. Test them in the target environment because browser flags can affect fingerprint consistency.

| Flag | Purpose |
| --- | --- |
| `--disable-popup-blocking` | Allow automation to open popups without the popup blocker blocking them. |
| `--disable-notifications` | Disable browser notification prompts. |
| `--start-maximized` | Start the browser window maximized. |
| `--window-size=1920,1080` | Set the initial window size. |
| `--lang=en-US` | Set the Chrome UI language when compatible with the environment. |
| `--disable-background-networking` | Reduce background network activity in automation-only sessions. |
| `--disable-sync` | Disable browser profile sync. |
| `--disable-default-apps` | Prevent default apps from being installed. |
| `--disable-component-update` | Prevent component updates during the automation session. |
| `--disable-background-timer-throttling` | Reduce background timer throttling. |
| `--disable-renderer-backgrounding` | Reduce renderer background throttling. |
| `--disable-backgrounding-occluded-windows` | Reduce throttling for occluded windows. |
| `--disable-dev-shm-usage` | Use `/tmp` instead of `/dev/shm` in constrained Linux containers. |
| `--disable-client-side-phishing-detection` | Disable client-side phishing detection during automation. |
| `--disable-component-extensions-with-background-pages` | Disable component extensions that use background pages. |
| `--disable-hang-monitor` | Disable the browser hang monitor. |
| `--disable-ipc-flooding-protection` | Reduce IPC flooding protection; use only for controlled automation. |
| `--disable-prompt-on-repost` | Avoid repost confirmation prompts. |
| `--mute-audio` | Mute browser audio. |
| `--no-first-run` | Skip first-run setup. |
| `--password-store=basic` | Use the basic password store in automation profiles. |
| `--use-mock-keychain` | Use a mock keychain where supported. |
| `--hide-scrollbars` | Hide browser scrollbars. |
| `--force-color-profile=srgb` | Use the sRGB color profile. |
| `--disable-extensions-except=path1,path2` | Load only the listed unpacked extensions. |
| `--load-extension=path1,path2` | Load one or more local unpacked extensions. Use absolute paths when possible. |

## Restricted or High-Risk Flags

The CDP helper rejects flags that conflict with environment-managed behavior:

- `--user-data-dir`
- `--profile-directory`
- `--remote-debugging-port`
- `--remote-debugging-address`

The helper requires `--allow-risky-cmd` before accepting these high-risk flags:

- `--no-sandbox`
- `--proxy-server`
- `--proxy-bypass-list`
- `--disable-web-security`
- `--ignore-certificate-errors`
- `--disable-features=IsolateOrigins`
- `--disable-features=SitePerProcess`
- `--disable-blink-features=AutomationControlled`
- `--remote-allow-origins`
- `--unsafely-treat-insecure-origin-as-secure`

Do not add environment-managed proxy, user-data-directory, profile, fingerprint, or debugging-port flags to `append_cmd`. Use the documented YunLogin fields instead.

`--headless` is not an `append_cmd` recommendation; use the API `headless` field.

## Automation Libraries

The `launchBrowser` document contains examples for:

- Playwright with `chromium.connectOverCDP`
- Puppeteer with `browserWSEndpoint`
- Selenium with the returned `webdriver` path

Read [api/launchBrowser.md](../api/launchBrowser.md) for the complete examples.

The built-in `yunlogin-cdp.mjs` helper requires no npm packages. For richer page automation, install the selected automation library in the caller's environment and use the returned CDP URL.

## Playwright CLI Integration

The official Playwright CLI project is `@playwright/cli`. Pair it with this skill when the task needs real page automation: snapshots, clicks, fills, assertions, traces, videos, or test runs.

**Ask the user before installing anything.** The pairing is optional, and the built-in `scripts/yunlogin-cdp.mjs` helper covers raw CDP work without any install.

Read [playwright-cli.md](playwright-cli.md) for the detection command, the install steps, the PATH troubleshooting, and the session lifecycle rules.

### Attach Playwright CLI to a YunLogin Browser

```powershell
node scripts/yunlogin-cdp.mjs start --account-id <account-id> --output session.json

$session = Get-Content session.json -Raw | ConvertFrom-Json
$cdp = $session.data.ws.puppeteer

playwright-cli -s=yunlogin attach --cdp=$cdp
playwright-cli -s=yunlogin goto https://example.com
playwright-cli -s=yunlogin snapshot
playwright-cli -s=yunlogin eval "document.title"
playwright-cli -s=yunlogin detach
```

`detach` leaves the external YunLogin browser running. Use `close` only when the browser should be closed.

The built-in `yunlogin-cdp.mjs` remains the zero-dependency fallback. Do not declare another skill as a dependency in `agents/openai.yaml`; the supported dependency section is currently for MCP tools, not skill-to-skill dependencies.
## Session Lifecycle

- If the environment must remain open, use the automation library only for its supported disconnect behavior and verify that the browser remains running.
- `Browser.close()` or `driver.quit()` can close the environment browser.
- Closing or disconnecting the automation client does not revoke the CDP URL; the local environment controls the lifetime of the debugging port.
- Do not expose CDP ports beyond loopback. The returned CDP endpoint provides full browser control.

## Verified YunLogin CDP Tests

The following tests were executed against a YunLogin environment in a dedicated YunLogin test environment, not against a standalone local Chrome:

- Local `launchBrowser` returned `code: 0` and a `ws://127.0.0.1:<port>/devtools/browser/<id>` CDP URL.
- Raw CDP `Browser.getVersion` returned `Chrome/108.0.5308.1`, protocol `1.3`.
- Raw CDP `open` and `eval` returned page title `Example Domain`.
- Playwright CLI attached with `playwright-cli -s=yunlogin attach --cdp=<url>` and navigated the YunLogin browser.
- Playwright CLI detach and reattach preserved `localStorage` value `ok`.
- A separate launch with `append_cmd` set to `--disable-popup-blocking --disable-notifications` returned `code: 0` and a valid CDP URL.
- `closeBrowser` returned `code: 0`, and `checkStartStatus` reported `Inactive` afterward.
- `capture-local-token` launched a headless environment, read the cached `Authorization` value through the CDP `DOMStorage` domain, verified it with `code: 0`, stored it outside the skill, and closed the environment.

These tests validate launch, CDP connection, page operation, persistence across detach/reattach, append_cmd launch, and browser close.
