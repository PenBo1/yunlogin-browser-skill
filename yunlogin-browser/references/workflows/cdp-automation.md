# CDP Automation

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

Some YunLogin desktop builds require authentication for local user API calls. If `/status` works but other local endpoints return `invalid token`, capture the token from the bundled browser extension instead of asking the customer for it:

```powershell
node scripts/yunlogin-cdp.mjs capture-local-token --account-id <account-id>
```

### Automatic Token Capture

`capture-local-token` performs the whole bootstrap:

1. Reuse a running environment through `GET /api/v2/browser/status`, otherwise start one headless through `POST /api/v2/browser/start`.
2. Connect to `data.ws.puppeteer` and attach a CDP session.
3. Read the `Authorization` key from the extension origin `localStorage` with `DOMStorage.getDOMStorageItems`. A normal `Runtime.evaluate` call cannot read another extension origin and fails with a security error, so the storage domain is required.
4. Verify the value with a local user API read (`POST /api/v2/userapi/user/shopseriallist`).
5. Write the verified token to the user-level cache and print only the cache path, the token length, and `verified: true`.

Useful options:

| Option | Purpose |
| --- | --- |
| `--account-id` | Environment used for the capture. Required. |
| `--extension-id` | Override the bundled extension ID when the build ships a different extension. |
| `--headless 0` | Run the capture environment headed, which older kernels need for extension storage. |
| `--cache-file` | Write the token somewhere other than the default cache path. |
| `--keep-open` | Leave the capture environment running. |

The capture finishes with the environment closed, unless it reused an already running environment or `--keep-open` was passed.

To confirm the stored local token still works before automating, run `node scripts/yunlogin-auth.mjs ensure-local`. It reuses the cached value when the local API accepts it and captures a new one when the API rejects it. When the account has no environment at all, the same flow can create a short-lived `skill-temp-<kernel>-<MMDD>-<HHmm>` environment after the user confirms, capture the token, and delete it again. Read [token-lifecycle.md](token-lifecycle.md) and [environment-lifecycle.md](environment-lifecycle.md) for the refresh rules, transport fallback, and authorization requirements.

### Token Resolution And Privacy

`YUNLOGIN_LOCAL_TOKEN` is sent as `Authorization: Bearer <token>`. `YUNLOGIN_LOCAL_COOKIE` is an optional extra Cookie header, and the local helper masks both headers in dry-run output.

Local helpers resolve the token in this order:

1. `YUNLOGIN_LOCAL_TOKEN`
2. `YUNLOGIN_LOCAL_TOKEN_FILE`
3. `%LOCALAPPDATA%\yunlogin-browser\local-token.json` on Windows, `~/.local/share/yunlogin-browser/local-token.json` on other platforms

The captured extension token is a local desktop credential. It authenticates the loopback API only; it is rejected by the management-center server API, which needs `YUNLOGIN_SERVER_TOKEN`. Keep the token out of the skill, source files, Markdown, logs, and responses. The cache lives in the user profile so an updated skill package never carries a credential.
## External CDP URL

The helper also accepts a CDP URL returned by another tool:

```powershell
node scripts/yunlogin-cdp.mjs check --cdp-url ws://127.0.0.1:9222/devtools/browser/<id>
node scripts/yunlogin-cdp.mjs targets --cdp-url http://127.0.0.1:9222
```

- `ws://` and `wss://` URLs are used directly.
- `http://` and `https://` URLs are resolved through `/json/version`.
- External CDP endpoints are not restricted by the YunLogin local launch helper, but they must be supplied explicitly.

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
