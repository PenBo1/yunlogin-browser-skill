#!/usr/bin/env node
import { execFile, spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { clientServiceResponds, normalizeClientOrigin } from "./lib/client-origin.mjs";
import { discoverPorts } from "./yunlogin-ports.mjs";
import { ensureWorkbenchCdp, findWorkbench } from "./lib/workbench-cdp.mjs";
import { syncWorkbench } from "./lib/workbench-session.mjs";

const execFileAsync = promisify(execFile);
export const DOWNLOAD_URL = "https://www.yunlogin.com/?c=7fzh";
const USAGE = `Usage: node scripts/yunlogin-client.mjs status|locate|start|config [options]
  --exe PATH        Explicit absolute YunLogin.exe path (or YUNLOGIN_EXE)
  --confirm-start   Start only after user approval
  --cdp-port PORT   Explicit loopback CDP port; otherwise choose a free port
  --confirm-restart Allow closing and reopening an already-running Workbench
  --dry-run         Plan without starting a process or requesting configuration
status/locate inspect Windows installation metadata and process state.
config outputs only an allowlisted settings summary; credentials never leave memory.`;

// No user-controlled text is interpolated into this script.
const DISCOVER = String.raw`
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$running = @(Get-CimInstance Win32_Process -Filter "Name='YunLogin.exe'" | ForEach-Object { @{pid=$_.ProcessId; path=$_.ExecutablePath} })
$candidates = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()
foreach ($p in $running) { if ($p.path) {$candidates.Add($p.path)} }
foreach ($key in @('HKCU:\Software\FbSoftware\YunLogin','HKCU:\Software\FbBrowser\YunLogin','HKLM:\Software\FbSoftware\YunLogin','HKLM:\Software\FbBrowser\YunLogin')) {
  if (!(Test-Path -LiteralPath $key)) {continue}
  try { $entry = Get-ItemProperty -LiteralPath $key; if ($entry.InstallDir) {$candidates.Add((Join-Path $entry.InstallDir 'YunLogin.exe'))} }
  catch {$warnings.Add('A YunLogin installation registry entry could not be read.')}
}
$roots = @('HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall','HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall','HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall')
foreach ($root in $roots) {
  if (!(Test-Path -LiteralPath $root)) {continue}
  try {
    foreach ($key in Get-ChildItem -LiteralPath $root) {
      try {$entry = Get-ItemProperty -LiteralPath $key.PSPath} catch {$warnings.Add('An uninstall entry could not be read.'); continue}
      if ($entry.DisplayName -notmatch 'YunLogin') {continue}
      if ($entry.InstallLocation) {$candidates.Add((Join-Path $entry.InstallLocation 'YunLogin.exe'))}
      if ($entry.DisplayIcon -match '^"?(.+?\.exe)"?(?:,[-\d]+)?$') {$candidates.Add($Matches[1])}
    }
  } catch {$warnings.Add('Some uninstall registry entries could not be read.')}
}
foreach ($root in @($env:LOCALAPPDATA,$env:ProgramFiles,[Environment]::GetEnvironmentVariable('ProgramFiles(x86)'))) {
  if ($root) {$candidates.Add((Join-Path $root 'YunLogin\YunLogin.exe')); $candidates.Add((Join-Path $root 'Programs\YunLogin\YunLogin.exe'))}
}
$shortcutRoots = @([Environment]::GetFolderPath('Desktop'),[Environment]::GetFolderPath('CommonDesktopDirectory'),[Environment]::GetFolderPath('StartMenu'),[Environment]::GetFolderPath('CommonStartMenu'))
try {
  $shell = New-Object -ComObject WScript.Shell
  foreach ($root in $shortcutRoots) {
    if (!$root -or !(Test-Path -LiteralPath $root)) {continue}
    foreach ($link in Get-ChildItem -LiteralPath $root -Filter '*.lnk' -Recurse -ErrorAction SilentlyContinue) {
      $target = $shell.CreateShortcut($link.FullName).TargetPath
      if ([IO.Path]::GetFileName($target) -ieq 'YunLogin.exe') {$candidates.Add($target)}
    }
  }
} catch {$warnings.Add('Shortcut discovery was unavailable.')}
@{running=$running; candidates=@($candidates | Select-Object -Unique); warnings=@($warnings)} | ConvertTo-Json -Depth 4 -Compress
`;

export async function discover({ executable } = {}) {
  if (process.platform !== "win32") throw new Error("Automatic discovery/start currently supports Windows only. Ask for the platform-specific installation path.");
  let stdout;
  try {
    ({ stdout } = await execFileAsync("powershell.exe", ["-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(DISCOVER, "utf16le").toString("base64")], { windowsHide: true, timeout: 20000, maxBuffer: 1024 * 1024 }));
  } catch {
    throw new Error("Installation/process discovery failed; running state is UNKNOWN, not stopped or uninstalled. Ask the user to open YunLogin manually or resolve Windows process-query permissions, then retry. An explicit --exe does not bypass this check.");
  }
  const found = JSON.parse(stdout.replace(/^\uFEFF/, ""));
  const explicit = executable ?? process.env.YUNLOGIN_EXE;
  const candidates = explicit ? [explicit] : found.candidates;
  const installed = [];
  for (const file of candidates) {
    if (!path.isAbsolute(file) || path.basename(file).toLowerCase() !== "yunlogin.exe") {
      if (explicit) throw new Error("--exe must name an absolute YunLogin.exe path.");
      continue;
    }
    if (await stat(file).then(s => s.isFile()).catch(() => false)) installed.push(path.normalize(file));
  }
  if (explicit && !installed.length) throw new Error("The supplied YunLogin.exe does not exist or is not a file.");
  return { running: found.running, installed: [...new Map(installed.map(p => [p.toLowerCase(), p])).values()], warnings: found.warnings, discoveryComplete: found.warnings.length === 0 };
}

export async function services() {
  const snapshot = await discoverPorts({ timeoutMs: 500 });
  const explicitClient = process.env.YUNLOGIN_CLIENT_BASE_URL ?? process.env.YUNLOGIN_CLIENT_ORIGIN;
  const origin = explicitClient ? normalizeClientOrigin(explicitClient) : (snapshot.clientApiOrigins.length === 1 ? snapshot.clientApiOrigins[0] : null);
  const reachable = origin ? (explicitClient ? await clientServiceResponds(origin, 700) : true) : false;
  const explicitLocal = process.env.YUNLOGIN_LOCAL_BASE_URL ?? process.env.YUNLOGIN_BASE_URL;
  const localOrigin = explicitLocal ? normalizeClientOrigin(explicitLocal, "YUNLOGIN_LOCAL_BASE_URL") : (snapshot.localApiOrigins.length === 1 ? snapshot.localApiOrigins[0] : null);
  let localReachable = false;
  try {
    if (!localOrigin) throw new Error("No unique local API origin");
    const r = await fetch(`${localOrigin}/status`, { redirect: "error", signal: AbortSignal.timeout(1000) });
    localReachable = r.ok && (await r.json())?.code === 0;
  } catch { /* Availability is independent for the two surfaces. */ }
  return { clientApi: { origin, reachable, candidates: snapshot.clientApiOrigins }, localApi: { origin: localOrigin, reachable: localReachable, candidates: snapshot.localApiOrigins } };
}

// Deny unknown fields by default: future nested credentials or JSON-encoded secrets
// cannot bypass redaction. Do not echo raw error messages from this endpoint.
export function summarizeConfig(payload) {
  const settings = {};
  for (const key of ["remindCleanup", "remindCleanupSize", "rpaAutoCleanup", "autoRun"]) {
    if (["number", "boolean"].includes(typeof payload?.data?.[key])) settings[key] = payload.data[key];
  }
  return { code: typeof payload?.code === "number" ? payload.code : null, settings, otherFields: "[WITHHELD]" };
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.includes("--help") || argv.includes("-h")) { console.log(USAGE); return; }
  const [command, ...args] = argv;
  if (!["status", "locate", "start", "config"].includes(command)) { console.error(USAGE); process.exitCode = 2; return; }
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--exe") { options.executable = args[++i]; if (!options.executable || options.executable.startsWith("--")) throw new Error("--exe requires a path"); }
    else if (args[i] === "--confirm-start" && command === "start") options.confirm = true;
    else if (args[i] === "--confirm-restart" && command === "start") options.confirmRestart = true;
    else if (args[i] === "--cdp-port" && command === "start") { options.cdpPort = args[++i]; if (!options.cdpPort) throw new Error("--cdp-port requires a port"); }
    else if (args[i] === "--dry-run") options.dryRun = true;
    else throw new Error(`Unsupported option: ${args[i]}`);
  }
  const print = value => console.log(JSON.stringify(value, null, 2));
  if (command === "start" && options.dryRun) {
    const found = await discover(options);
    print({ dryRun: true, running: found.running.map(({ pid, path }) => ({ pid, path })), installed: found.installed,
      action: found.running.length ? "Inspect Workbench CDP and plan a restart when absent" : "Start the selected YunLogin installation, enable Workbench CDP and sync current credentials",
      restartRequiresConfirmation: Boolean(found.running.length) });
    return;
  }
  async function finishWorkbench({ started }) {
    const clientServices = await services().catch(() => ({ clientApi: { reachable: false }, localApi: { reachable: false } }));
    if (!clientServices.clientApi.reachable || !clientServices.localApi.reachable) {
      print({ started, ready: false, clientServices, workbenchCdp: { ready: false }, credentials: { synced: false }, message: "The YunLogin client services are not ready." });
      process.exitCode = 4;
      return;
    }
    let cdp;
    try {
      cdp = await ensureWorkbenchCdp({ port: options.cdpPort, confirmRestart: options.confirmRestart, startedThisRun: started, dryRun: options.dryRun });
    } catch {
      print({ started, ready: false, clientServices, workbenchCdp: { ready: false, reason: "CDP setup failed; inspect the Workbench process and port." }, credentials: { synced: false } });
      process.exitCode = 4;
      return;
    }
    if (!cdp.ready || options.dryRun) {
      print({ started, ready: false, clientServices, workbenchCdp: cdp, credentials: { synced: false },
        message: cdp.needsRestart ? "An existing Workbench must close and reopen to enable CDP. Ask before repeating with --confirm-restart." : "Complete Workbench startup before syncing." });
      process.exitCode = cdp.needsRestart && !options.dryRun ? 2 : 4;
      return;
    }
    try {
      const credentials = await syncWorkbench();
      print({ started, ready: true, clientServices, workbenchCdp: cdp, credentials });
    } catch {
      print({ started, ready: false, clientServices, workbenchCdp: cdp, credentials: { synced: false }, message: "Sign in or finish initialization in Workbench, then run yunlogin-auth.mjs sync-workbench." });
      process.exitCode = 4;
    }
  }
  if (command === "config") {
    if (options.dryRun) { print({ dryRun: true, surface: "local-client", method: "GET", path: "/api/v1/settings/get_config", origin: "resolved at execution" }); return; }
    const { clientApi } = await services();
    if (!clientApi.reachable) throw new Error("Client API unavailable; follow STARTUP.md before retrying.");
    const r = await fetch(`${clientApi.origin}/api/v1/settings/get_config`, { redirect: "error", signal: AbortSignal.timeout(5000), headers: { accept: "application/json" } });
    const payload = await r.json().catch(() => null);
    print({ origin: clientApi.origin, httpStatus: r.status, ...summarizeConfig(payload) });
    if (!r.ok || payload?.code !== 0) process.exitCode = 1;
    return;
  }
  const found = await discover(options);
  if (command === "locate") { print({ ...found, downloadUrl: DOWNLOAD_URL }); return; }
  if (command === "status") {
    const workbench = await findWorkbench().catch(() => null);
    const cdp = workbench ? await ensureWorkbenchCdp({ dryRun: true }).catch(() => ({ ready: false })) : { ready: false };
    print({ ...found, ...await services(), workbench: workbench ? { pid: workbench.pid, browserId: workbench.browserId, processStartedAt: workbench.creationDate,
      cdpReady: cdp.ready, cdpPort: cdp.ready ? cdp.port : null, cdpUrl: cdp.ready ? cdp.cdpUrl : null,
      needsRestart: cdp.needsRestart ?? false } : null, downloadUrl: DOWNLOAD_URL });
    return;
  }
  if (found.running.length) { await finishWorkbench({ started: false }); return; }
  if (!options.confirm && !options.dryRun) {
    print({ needsConfirmation: true, installed: found.installed, message: "Show the discovered path and ask before starting YunLogin. Workbench may reopen once to enable loopback CDP; then pass --confirm-start." }); process.exitCode = 2; return;
  }
  if (found.installed.length !== 1) {
    print({ started: false, ...found, needsPath: true, downloadUrl: DOWNLOAD_URL, message: found.installed.length ? "Multiple installations found; ask which path to start and pass --exe." : "No installation located. Ask whether it is installed elsewhere; request the path or guide the user to download and install." }); process.exitCode = 3; return;
  }
  const executable = found.installed[0];
  const child = spawn(executable, [], { cwd: path.dirname(executable), detached: true, stdio: "ignore", windowsHide: true });
  await new Promise((resolve, reject) => { child.once("spawn", resolve); child.once("error", reject); });
  child.unref();
  const deadline = Date.now() + 30000;
  let result;
  do {
    try { result = await services(); }
    catch {
      print({ started: true, verified: false, executable, readinessUnknown: true, message: "Process was launched, but readiness discovery failed. Inspect the client manually or resolve Windows query permissions; do not relaunch automatically." });
      process.exitCode = 4;
      return;
    }
    if (result.clientApi.reachable && result.localApi.reachable) {
      const workbenchDeadline = Date.now() + 30000;
      while (!(await findWorkbench()) && Date.now() < workbenchDeadline) await new Promise(resolve => setTimeout(resolve, 500));
      await finishWorkbench({ started: true }); return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  } while (Date.now() < deadline);
  print({ started: true, verified: false, executable, ...result, message: "Startup readiness was not confirmed within the wait budget. Inspect the client UI/login state; do not relaunch automatically." });
  process.exitCode = 4;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`Error: ${error.message}`); process.exitCode = 1; });
}
