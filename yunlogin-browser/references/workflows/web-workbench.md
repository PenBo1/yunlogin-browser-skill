# macOS Web Workbench Fallback

For installation, user confirmation and handoff between `yunlogin-browser`, Playwright CLI and the optional Playwright agent skill, read [playwright-pairing.md](playwright-pairing.md) first.

Use this workflow when the user wants AI to operate management-center pages and the native Workbench has no verified CDP. Offer a separate Playwright CLI Chromium browser visiting `https://d126447d359e70c0.yunlogin.com`. Call it the **web Workbench**. It is a web management-center session, not the native Chrome 107 Workbench process or a newly created YunLogin account environment. Native extension and desktop bridge features are not guaranteed in this browser.

This is the default macOS route when `workbenchCdp.ready` is false. Windows keeps its native Workbench route: use the confirmed `fb.exe` restart path in [cdp-automation.md](cdp-automation.md). Do not present the macOS browser as native Workbench.

## Interaction And Authorization

Use [../interaction.md](../interaction.md) for friendly prompts and stage reporting. Tell the user this is a separate web Workbench, ask whether to open it, and ask which existing environment should provide Authorization. Report `browser launched`, `CDP verified`, `bridge ports injected`, `login verified` and `page action verified` separately. Never call web readiness native Workbench readiness. No native Workbench restart is needed.

## Prepare Verified Ports And CDP Configuration

Check the installed commands and schema before using their flags:

```sh
command -v playwright-cli
playwright-cli --version
playwright-cli open --help
playwright-cli run-code --help
node scripts/yunlogin-client.mjs status
```

If Node/npm, CLI or Chrome is missing, follow the platform-specific [installation guidance](playwright-cli.md#detect-and-guide-installation), offer install/manual/decline, and resume here after verification. Use an already-installed Chrome; if the selected CLI/browser is missing, explain that before installing. `open` does not accept arbitrary Chromium flags as top-level CLI options: put them in `browser.launchOptions.args` in its JSON config.

The zero-dependency preparation helper uses fresh YunLogin-owned listeners and rechecks the addresses the page consumes (`127.0.0.1`). Run it from the skill directory; generated files belong in a new dedicated run directory outside the skill:

```sh
run_dir="$(mktemp -d "${TMPDIR:-/tmp/}yunlogin-web-workbench.XXXXXX")"
node scripts/yunlogin-workbench-web.mjs --output-dir "$run_dir" --dry-run
node scripts/yunlogin-workbench-web.mjs --output-dir "$run_dir"
```

The first call probes current listeners without writing. The second writes `cli.config.json` and `bridge-init.js`; it does not launch a browser, read a token, or copy storage. Choose a dedicated user-level folder instead if the user wants the profile retained between tasks. Existing setup files/profiles are not overwritten. Do not reuse the native Workbench user-data directory. Read the second result for the actual `cdpOrigin` and config paths; default ports are selected dynamically. `--cdp-port PORT` can select an explicitly requested free port. A port can be occupied after preparation: verify again after launch rather than attaching to the first endpoint that answers.

The config uses this supported structure (paths and port are generated at execution):

```json
{
  "browser": {
    "browserName": "chromium",
    "userDataDir": "<run-directory>/profile",
    "launchOptions": {
      "channel": "chrome",
      "headless": false,
      "args": [
        "--remote-debugging-address=127.0.0.1",
        "--remote-debugging-port=<selected-free-port>"
      ]
    },
    "initScript": ["<run-directory>/bridge-init.js"]
  }
}
```

This illustrates the schema; execute the generated config, not these placeholders. Run CLI commands from the run directory so its snapshots/logs remain outside the skill. Session names are labels; choose a fresh name when another task uses the suggested name:

```sh
cd "$run_dir"
playwright-cli -s=yunlogin-web-workbench open about:blank --config "$run_dir/cli.config.json"
```

Verify the configured port's owner against the newly launched Chromium process and dedicated `--user-data-dir`, not just the CLI's own PID. Call `/json/version` on the generated `cdpOrigin`, then `Browser.getVersion` using the returned browser WebSocket URL. The built-in `yunlogin-fb-cdp.mjs check --cdp-url <generated-cdp-origin> --timeout-ms 3000` can check the protocol; process ownership is a separate requirement. CDP binds only to loopback. Do not add `--disable-web-security`, bypass local-network protections, or broadly allow remote origins to fix a bridge error.

After verification, use the existing named CLI session, or a distinct session with `attach --cdp=<verified-url>` when another agent needs CDP attachment. Do not open the same profile twice. Navigate to the management origin before running the explicit login bootstrap adapter, which checks the destination origin before injection:

```sh
playwright-cli -s=yunlogin-web-workbench goto https://d126447d359e70c0.yunlogin.com
```

## Storage Fields And Their Sources

The current page bundle was inspected on 2026-11-16. It reads the following keys; recheck the deployed bundle or a readable page if behavior changes. Never assume all historical Workbench query parameters are current localStorage keys. In particular, the application WebSocket's storage key is `port`, not `wsPort`.

| Key | Source and validation | Injection behavior |
| --- | --- | --- |
| `appPort` | Fresh client PID-owned port whose `POST /api/v1/client/gpu_info` returns HTTP 200, code 0 and an adapters array; reverify at `127.0.0.1`. | Helper writes a decimal string. This is the client API port, not local `/api/v2` or CDP. |
| `port` | Fresh client-owned application WebSocket listener with a valid opening handshake at `127.0.0.1`. | Helper writes a decimal string. Transport success does not prove application authentication. |
| `rpaPort`, `ipifyPort`, `cookiefyPort` | A readable authorized source's current value plus independently verified listener ownership, service purpose and matching host. | Helper leaves them unmapped and removes stale values in its dedicated destination. Add only those the requested feature actually needs after verification; never use an unknown listener or neighboring port. |
| `Authorization`, `userinfo`, `CompanyInfo` | The selected environment Authorization or revalidated web cache; derive user/company from verified management identity reads. See bootstrap below. | The login adapter preserves/normalizes Authorization as documented below, validates identity and injects page-compatible objects. Preparation alone never reads or writes these keys. |
| Other storage | Inspect the current page code and document the feature's actual need before copying. | No blanket localStorage, Cookie or browser-profile clone. |

The generated init script is scoped to the exact management origin and runs before page scripts. It touches only bridge-port keys and preserves login storage. After a YunLogin client restart, stop bridge operations and rediscover ports. The preparation helper intentionally refuses to overwrite an existing setup/profile. For an agreed retained profile, edit only its generated bridge-init.js with freshly verified values, then reopen the dedicated fallback browser with that config after applicable restart authorization; the running CLI may have loaded its init script already. Preserve the profile/login data. Do not let an old init script reset fresh ports on navigation. For additional verified port keys, update this dedicated init script after validation, rather than setting them once while a stale init script removes them on reload. Recheck from the page that the intended services are reachable; shell-side HTTP success is insufficient to prove browser permission/CORS access.

## Environment Authorization Bootstrap And Private Cache

Port injection is only preparation; do not say the web Workbench is logged in until Authorization is injected and verified. When the user asks to obtain the token from a YunLogin environment, use `scripts/yunlogin-workbench-web-login.mjs`. This explicit web fallback can read the selected environment's existing extension localStorage.Authorization, verify that value against management-center identity reads, cache it privately, and inject the destination. It does not use native Workbench CDP or the disabled legacy `capture-local-token` / `bootstrap-token` commands.

Choose the actual source environment by exact ID/name from documented local reads. If several candidates fit, ask which one; never use the first account silently. Creating an environment needs separate scope/attributes, so prefer the identified existing test environment for a test. The helper accepts `--start-environment` only to start that selected environment when stopped. It reuses an active environment, does not create/delete environments or change fingerprints/proxies, and leaves the source environment running. If the local read/control route rejects authentication, stop and report the prerequisite; do not loop back into native `sync-workbench` or claim token capture happened.

### Discover The Source And Its CDP

Read [launchBrowser](../api/launchBrowser.md), [checkStartStatus](../api/checkStartStatus.md), and the local environment list contract before calling them. The local launch/status response's `data.ws.puppeteer` identifies the selected environment CDP. The managed launcher supplies its own debugging flags/port: do not override them through `append_cmd`. The separately launched web Workbench still needs its explicit loopback CDP flags from the preparation config.

Inspect this returned CDP's target metadata to identify the **actual** bundled environment extension ID and its existing page, for example `chrome-extension://<observed-id>/fingerprint.html`, with its matching environment service worker. Do not hardcode a Windows extension ID, reuse a historical CDP port, navigate a popup/login extension to trigger behavior, or dump all storage. Source ownership must match `--browser-id=Shop-<selected-account-id>` and the target must match the dedicated destination profile. The macOS adapter verifies both through current listener ownership and process argv before credential access. It is verified on macOS; do not advertise this ownership adapter as Windows-tested.

When the selected environment is stopped, either launch it once with the documented local route to discover target metadata before invoking the helper, or use `--start-environment` with an extension ID verified for the installed environment extension. The initial dry-run never starts a browser or reads storage. Reuse existing user authorization for the chosen source launch, token transfer and cache; clarify only missing targets/scope.

### Capture, Validate, Cache And Inject

Run from the skill directory with Node.js 22+, or Node.js 20 plus `--experimental-websocket`. All placeholders below must come from current observations:

```sh
node scripts/yunlogin-workbench-web-login.mjs \
  --account-id '<selected-environment-id>' \
  --extension-id '<observed-environment-extension-id>' \
  --target-cdp 'http://127.0.0.1:<web-cdp-port>' \
  --target-profile '<absolute-dedicated-web-profile>' \
  --dry-run
```

After the plan matches the user's instruction, run the same arguments with `--confirm-transfer` instead of `--dry-run`. Add `--start-environment` only when starting the selected source is in scope. Use `--target-id` if multiple management-center tabs are open. The destination must already have exactly the intended `https://d126447d359e70c0.yunlogin.com` page open. The helper never accepts token text on the command line and never prints credential values. Its private in-process CDP adapter performs the source read and target injection directly, without using Playwright CLI `localstorage-get/set` to carry a token through command output/argv.

The steps are:

1. Read only the existing selected environment extension's localStorage `Authorization` through its own verified CDP. Decode a `{value, expire}` wrapper in memory. A value captured from an environment is not automatically a management token: verify `POST /v2/sso/auth/myUserinfo` and `POST /v2/team/curCompanyInfo` with that exact authorization, HTTP/business statuses and non-empty user/company IDs. A local API code 0 alone is insufficient. Reject expiry; do not refresh or log response bodies.
2. Re-read the source value and PID/start-time ownership before writing and immediately before atomically committing the cache. Pin the initially selected target ID so a replacement same-origin tab is not selected silently. If a check changes, stop without committing the new cache. If a later destination injection fails after a valid cache was committed, the error reports `cacheUpdated: true` separately. The helper never reads the native Workbench extension, decrypts `--base-data`, or unlocks browser databases.
3. Store the verified login in a distinct user-level `web-workbench-session.json`, beside the native session cache (`~/.local/share/yunlogin-browser/` on macOS). Use atomic replacement and file mode `0600`; refuse unsafe permissions when reading it. It contains sensitive login and identity data, so no source-control/project/skill copy. This explicitly authorized web cache does not replace `workbench-session.json`, revive legacy token overrides, or become an API-helper fallback.
4. Inject `Authorization`, `userinfo`, and `CompanyInfo` only into the selected management-origin page. Preserve a valid source Authorization wrapper; if raw, wrap it with the verified expiry. Current page code reads Authorization via `{value, expire}` but parses `userinfo` and `CompanyInfo` as plain JSON objects. Populate missing identity context from the verified management responses, strip credential/password fields, and derive companyName/status as the current page does. Do not put all three values into identical wrappers. Leave bridge keys unchanged.
5. Reload **only this destination page** after success, then verify the logged-in UI, matching user/company identity responses, and a read-only page action. The helper does not install a persistent token init script that would overwrite logout, company switching or a renewed token on each navigation. Return only key names/flags, not the token or profile contents.

Expected success fields are `authenticationTransferred: true`, `cacheUpdated: true`, and `identityVerified: true`. They prove verified injection, not full page readiness. Complete the reload/page checks before reporting success. If rejected, report `reasonCode` and the failed stage; do not silently replace an invalid source with a different account.

### Reuse Cached Authorization

A later task may use the authorized web session cache after checking current server validity and identity again:

```sh
node scripts/yunlogin-workbench-web-login.mjs \
  --from-cache \
  --target-cdp 'http://127.0.0.1:<web-cdp-port>' \
  --target-profile '<absolute-dedicated-web-profile>' \
  --dry-run
```

Use `--confirm-transfer` for the live cache validation/injection. Expired, rejected or user/company-mismatched caches are not usable; recapture from the explicitly selected environment or let the user sign in. There is no independent tokenRefresh. Native `yunlogin-auth.mjs sync-workbench` and server/environment helpers still resolve native Workbench and do not automatically consume this web cache. Use the explicit web mode's page automation; a shared API session-owner integration is separate work.

If the source has no readable Authorization or its token is not accepted by management APIs, explain that precisely and offer login in the new browser. Do not make manual login the only route before checking the user's requested environment source. Existing login in the source does not establish the destination is signed in; report `ports injected` and `Authorization injected` independently.

### Logs And Recovery

Use no console/network dumps, state-save or raw storage-list during login migration. Site scripts can themselves log account/token data; avoid tracing/recording this transfer, keep CLI artifacts in the private run directory, inspect generated text in memory for exact transferred secrets and redact those values before retaining/sharing artifacts. Do not echo a failed page evaluation expression containing credentials. User-agent/extension-only behavior, optional ports and browser local-network permissions still need separate verification.

On the first real test (2026-11-17), a selected existing environment launched through the local API with Chrome 141; its observed extension Authorization passed both management identity routes. The private helper cached with mode 0600 and injected into the dedicated CLI web Workbench. Reload entered the logged-in environment manager; user/company readbacks matched and a browser-side GPU bridge probe returned HTTP 200/code 0. Playwright dismissed a non-transactional announcement and searched the test environment, producing one result. No environment record or client configuration was edited. This verifies that selected source and current versions, not every environment/extension build.

## Failure And Completion Messages

| Observed problem | User-facing next step |
| --- | --- |
| CLI/browser missing or config rejected | Name the missing dependency/unsupported option; inspect installed help/schema before changing flags. Do not claim a browser was opened. |
| Browser opens but CDP does not verify | Report the launched profile and failing stage; inspect its command line/owned listener. Stop before storage transfer. |
| Required bridge service missing or ambiguous | List missing key names and affected feature, not guessed values. Login-only web pages may work; desktop controls depending on that bridge remain unverified. |
| No readable source login | Check the selected YunLogin environment with the explicit bootstrap adapter or revalidate its web cache. If neither works, offer sign-in in the new browser; do not claim token injection succeeded. |
| Login expires or company differs | Stop business actions and ask for sign-in/company selection in this browser. |
| Local-network permission, CORS, HTTPS policy or app-WebSocket auth fails | Report that web page control is available but the relevant native bridge feature failed. Let the user handle a real permission prompt; use the native UI for extension-only functions. Do not weaken browser security or impersonate privileged extensions. |
| User stops automation | Detach attached sessions to keep the browser running. Close only the specific CLI-owned fallback session when the user wants it closed; never `close-all` or `kill-all`. Retain a login-bearing profile only as agreed. |

Suggested completion: "The separate web Workbench is open and CDP verified. Bridge ports <key names> are injected; <missing keys/features> remain unavailable. Login is <verified/pending>. I can now perform <the verified requested page action>. Native Workbench was not restarted."

Verification for this workflow: CLI 0.1.24 accepted the generated config, exposed a Chromium-owned `127.0.0.1` CDP endpoint, and passed `Browser.getVersion`. An intercepted management-origin HTML fixture observed the port values before its scripts ran, with no Authorization value present. This proves launch/config/injection mechanics, not real management login, native bridge authorization, or every Workbench feature. Primary CLI schema: `https://github.com/microsoft/playwright-cli` and the installed CLI help/README.
