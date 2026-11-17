# Client Availability, Installation And Startup

Use this flow before a task needs a local API. Server-only tasks do not require launching the desktop. Replies should use the customer's language; the examples below describe the information to convey.

## Detect and explain

Check `node --version`: CDP and Workbench synchronization require Node.js 22+ or Node.js 20 invoked with `--experimental-websocket`. Plain Node.js 20 supports discovery and HTTP probes, but an approved browser restart is refused before stopping the browser if WebSocket is missing. No npm install is needed.

```powershell
node scripts/yunlogin-client.mjs status
node scripts/yunlogin-client.mjs locate
node scripts/yunlogin-ports.mjs
```

These Node.js commands support Windows and macOS. They do not start or stop YunLogin. Windows uses built-in PowerShell/CIM: `locate` checks the running executable, YunLogin registry install entries, uninstall entries, common install directories, and desktop/Start Menu shortcut targets.

On macOS, `locate` checks the running desktop process and application bundles directly inside `/Applications` and `~/Applications`, validates `CFBundleIdentifier: com.yunlogin.fbmain`, and resolves `CFBundleExecutable` from `Contents/Info.plist`. Renamed app bundles work. `YUNLOGIN_EXE` or `--exe` accepts an absolute `.app` path or its main `Contents/MacOS` executable, including custom installation locations and paths with spaces. Discovery uses built-in `ps`, `plutil` and `lsof`; exact browser arguments use JavaScript for Automation and `sysctl(KERN_PROCARGS2)`. No Python, npm package, compiler or full-disk scan is needed. A denied process query remains an unknown state.

## Platform routing

| Platform | Primary Workbench path | If CDP is unavailable |
| --- | --- | --- |
| Windows | Native Workbench `fb.exe`; a confirmed restart can append loopback CDP flags and verify PID ownership plus `Browser.getVersion`. | Report the restart plan and ask before closing/reopening native Workbench. |
| macOS | Inspect native Workbench and reuse it only when its CDP already verifies. | Stop native restart attempts and use [macOS Web Workbench](../workflows/web-workbench.md): a separate Playwright CLI Chrome profile with its own loopback CDP, verified bridge ports and environment-sourced Authorization. |

Do not attach the macOS Web Workbench to the native Workbench profile. Do not call the macOS browser native Workbench. The web path is a separate management-center session and can operate page controls even when native Chrome 107 Workbench cannot expose CDP.

### Windows native Workbench

1. Run `node scripts/yunlogin-client.mjs status` and confirm `workbench.cdpReady`.
2. If false, run `node scripts/yunlogin-client.mjs start --dry-run` and show the PID/port plan.
3. Ask before `node scripts/yunlogin-client.mjs start --confirm-restart` when the existing Workbench must close.
4. Recheck the new PID, owned port, `/json/version` and `Browser.getVersion` before Playwright or credential sync.

### macOS native Workbench

1. Run `node scripts/yunlogin-client.mjs status` and report the native state.
2. If `workbenchCdp.ready` is false, treat native Workbench page control and native session sync as blocked. Do not keep changing ports or directly relaunch `FbBrowser`.
3. Offer the web path and ask whether to open a separate browser profile. Read [web-workbench.md](../workflows/web-workbench.md) before launching it.
4. Use `yunlogin-workbench-web.mjs` to prepare bridge ports, then `yunlogin-workbench-web-login.mjs` to obtain and validate Authorization from the explicitly selected environment. If that source fails, ask the user to sign in in the new browser.
5. Verify the new browser CDP owner, `Browser.getVersion`, origin-scoped storage, user/company identity and requested page action separately.

Distinguish the states:

| Observation | Action and information for the user |
| --- | --- |
| Running and required API verified | Continue the requested task with that verified origin. |
| Running but API unavailable | Explain that the process is present but the requested service is not ready. Check initialization, UI/login state, explicit stale overrides, and permissions. Do not launch another copy or automatically restart. |
| Not running; one installation located | Show the executable path and ask whether to start this YunLogin installation. |
| Multiple installations | Show candidate paths and ask which one to use; pass the selected `--exe`. |
| No installation located | Say discovery found no installation, not that absence is proven. Ask if it is installed in a custom location; request that path or offer the download link. |
| Discovery failed or access denied | Say process/install state is unknown. Ask the user to open the client manually or resolve query permissions. Never convert a query error into 'not installed'. |

Suggested startup question: "YunLogin is not running. I found it at <path>. May I start this client to continue <requested task>?" If the user already explicitly requested startup of that installation, do not ask again. If they decline, stop dependent local operations and explain the manual alternative.

## Start after authorization

```powershell
node scripts/yunlogin-client.mjs start --exe 'C:\path\YunLogin.exe' --dry-run
node scripts/yunlogin-client.mjs start --exe 'C:\path\YunLogin.exe' --confirm-start
```

macOS example (use the path returned by `locate`):

```sh
node scripts/yunlogin-client.mjs start --exe '/Applications/Yunlogin Browser.app' --dry-run
node scripts/yunlogin-client.mjs start --exe '/Applications/Yunlogin Browser.app' --confirm-start
```

`--confirm-start` represents the user's approval, not automatic consent. The helper checks for an already-running client, launches one selected executable with its installation directory as the working directory, and checks fresh listener ownership and both API surfaces. It waits approximately 30 seconds (an in-flight OS query/probe can extend this). A spawned PID is not proof of readiness. A timeout reports the actual reachability of each surface; continue only operations whose required surface verified. Do not loop launches, kill the client, elevate privileges, enable auto-start, or alter API settings to force readiness.

The same `start` command then locates the `--browser-id=Workbench` main browser (`fb.exe` on Windows; nested `FbBrowser.app/Contents/MacOS/FbBrowser` on macOS). Windows can reopen it once with loopback CDP flags after confirmation. In macOS YunLogin 4.0.3.5, the tested direct Workbench relaunches did not produce a verified CDP endpoint, and a host-owned Workbench subsequently appeared without the requested flags. This does not prove the exact internal cause or that all macOS versions lack CDP. The helper reports `automaticSetupUnavailable` for this automatic relaunch method, skips another direct Workbench restart, and still reuses an existing verified CDP connection. See the failure reporting guidance below. No upgrade with a confirmed fix is known from these checks. On macOS, exact NUL-delimited argv still preserves profile paths with spaces for inspection and safe diagnostics. Process ownership and `Browser.getVersion` must pass before credentials are read.

```powershell
node scripts/yunlogin-client.mjs start --dry-run
node scripts/yunlogin-client.mjs start --confirm-restart # Windows restart path only
node scripts/yunlogin-auth.mjs sync-workbench
```

The startup result separately reports both API surfaces, Workbench CDP readiness, and credential synchronization. `ready: true` requires the local API, Workbench CDP, and verified credential synchronization. An unavailable client settings API does not block Workbench CDP. A running YunLogin process alone is insufficient.

For browser automation, `workbenchCdp.ready: true` is sufficient even when management credential synchronization fails. Run `node scripts/yunlogin-client.mjs status`, take `workbench.cdpUrl`, and attach Playwright CLI as shown in [playwright-cli.md](../workflows/playwright-cli.md). The management-center token is needed only for authenticated management API calls; no Workbench extension is read.

If the client needs login, ask the user to complete login, CAPTCHA/2FA, or first-run prompts in its own UI. Recheck ports afterward and resume the original task. Do not ask for a password merely to start the client. If the API still fails, report the failing surface and observations and ask whether the user wants manual troubleshooting/restart.

## Workbench failure reporting

Use [interaction.md](../interaction.md) for user-facing wording and stage reporting. Native Workbench CDP failure blocks native page control and native session sync; on macOS offer [web Workbench](../workflows/web-workbench.md). Report the reason code, blocked capability and recovery step. Do not expose tokens or `--base-data`, repeat failed restarts, or infer logout from missing CDP.

The machine-readable result keeps `workbenchCdp.reasonCode`, `message`, `action`, and `alternative` separate so callers can show a short friendly message without leaking diagnostics.

## Not installed or installed elsewhere

Provide exactly [Download YunLogin](https://www.yunlogin.com/?c=7fzh). Guide the user to download the appropriate official installer, install it, and open/login to YunLogin. Preserve this supplied URL including its query parameter. Do not silently download, execute an installer, or choose installation options.

Suggested prompt: "I could not locate YunLogin in the running processes, installation entries or shortcuts. Is it installed elsewhere? You can give me its executable path, or download and install it from <download link>. Tell me when installation is complete so I can verify the client and continue."

After installation, run `locate`/`status` again. Ask to start only if still stopped and startup has not already been authorized. After a successful check, tell the user which services are ready and resume their original operation. When the customer cannot install it, explain that dependent local operations remain unavailable.

## Fresh ports and config

Run `node scripts/yunlogin-ports.mjs` each time a current map is needed, especially after a restart. Use `clientApiOrigins` for `/api/v1/settings/get_config`; never assume the sample `54823`, another historical port, or the neighboring WebSocket port. See [PORTS.md](./PORTS.md) for the reverse-engineering evidence and boundaries.

`config --dry-run` plans only. `config` reads the endpoint in memory and prints a small allowlisted settings summary; unknown fields, credentials, cookie digests, network settings, and raw error messages are withheld. Do not use configuration as a health probe.
