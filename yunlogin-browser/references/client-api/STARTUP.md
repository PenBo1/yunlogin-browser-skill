# Client Availability, Installation And Startup

Use this flow before a task needs a local API. Server-only tasks do not require launching the desktop. Replies should use the customer's language; the examples below describe the information to convey.

## Detect and explain

```powershell
node scripts/yunlogin-client.mjs status
node scripts/yunlogin-client.mjs locate
node scripts/yunlogin-ports.mjs
```

These Node.js commands run on Windows, using built-in PowerShell/CIM internally. They do not start or stop YunLogin. `locate` checks the running executable, YunLogin's `Software\FbSoftware\YunLogin` / `Software\FbBrowser\YunLogin` `InstallDir` registry values, uninstall entries, common install directories, and desktop/Start Menu shortcut targets. `YUNLOGIN_EXE` or `--exe` supplies a custom absolute executable path. No full-disk scan is needed.

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

`--confirm-start` represents the user's approval, not automatic consent. The helper checks for an already-running client, launches one selected executable with its installation directory as the working directory, and checks fresh listener ownership and both API surfaces. It waits approximately 30 seconds (an in-flight OS query/probe can extend this). A spawned PID is not proof of readiness. A timeout reports the actual reachability of each surface; continue only operations whose required surface verified. Do not loop launches, kill the client, elevate privileges, enable auto-start, or alter API settings to force readiness.

The same `start` command then locates the `--browser-id=Workbench` main `fb.exe` process and enables loopback CDP. If the skill just launched YunLogin, it may reopen that newly created Workbench once with its existing arguments plus `--remote-debugging-address=127.0.0.1` and a free `--remote-debugging-port`. Tell the user this may happen as part of the startup question. A previously running Workbench is reused if its CDP verifies; otherwise return a restart plan and ask before using `--confirm-restart`. `--cdp-port PORT` selects an explicit port; the default is chosen at runtime. Process ownership and `Browser.getVersion` must pass before credentials are read.

```powershell
node scripts/yunlogin-client.mjs start --dry-run
node scripts/yunlogin-client.mjs start --confirm-restart
node scripts/yunlogin-auth.mjs sync-workbench
```

The startup result separately reports client service readiness, Workbench CDP readiness, and credential synchronization. `ready: true` requires all three. A running YunLogin process alone is insufficient.

For browser automation, `workbenchCdp.ready: true` is sufficient even when management credential synchronization fails. Run `node scripts/yunlogin-client.mjs status`, take `workbench.cdpUrl`, and attach Playwright CLI as shown in [playwright-cli.md](../workflows/playwright-cli.md). The management-center token is needed only for authenticated management API calls; no Workbench extension is read.

If the client needs login, ask the user to complete login, CAPTCHA/2FA, or first-run prompts in its own UI. Recheck ports afterward and resume the original task. Do not ask for a password merely to start the client. If the API still fails, report the failing surface and observations and ask whether the user wants manual troubleshooting/restart.

## Not installed or installed elsewhere

Provide exactly [Download YunLogin](https://www.yunlogin.com/?c=7fzh). Guide the user to download the appropriate official installer, install it, and open/login to YunLogin. Preserve this supplied URL including its query parameter. Do not silently download, execute an installer, or choose installation options.

Suggested prompt: "I could not locate YunLogin in the running processes, installation entries or shortcuts. Is it installed elsewhere? You can give me its executable path, or download and install it from <download link>. Tell me when installation is complete so I can verify the client and continue."

After installation, run `locate`/`status` again. Ask to start only if still stopped and startup has not already been authorized. After a successful check, tell the user which services are ready and resume their original operation. When the customer cannot install it, explain that dependent local operations remain unavailable.

## Fresh ports and config

Run `node scripts/yunlogin-ports.mjs` each time a current map is needed, especially after a restart. Use `clientApiOrigins` for `/api/v1/settings/get_config`; never assume the sample `54823`, another historical port, or the neighboring WebSocket port. See [PORTS.md](./PORTS.md) for the reverse-engineering evidence and boundaries.

`config --dry-run` plans only. `config` reads the endpoint in memory and prints a small allowlisted settings summary; unknown fields, credentials, cookie digests, network settings, and raw error messages are withheld. Do not use configuration as a health probe.
