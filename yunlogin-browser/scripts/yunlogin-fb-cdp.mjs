#!/usr/bin/env node

/**
 * Inspect or relaunch a Windows fb.exe process with an explicit CDP port.
 *
 * Windows cannot change the command line of a live process. This helper first
 * enumerates fb.exe, selects the main browser process, and can relaunch it with
 * the same arguments plus loopback remote-debugging flags. A relaunch always
 * requires --confirm-restart. Once the endpoint is ready, the helper verifies
 * it through Browser.getVersion and can list targets or evaluate JavaScript.
 */

import { execFile, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { CdpClient } from "./yunlogin-cdp.mjs";

const execFileAsync = promisify(execFile);
const PROCESS_NAME = "fb.exe";
const DEFAULT_CDP_ADDRESS = "127.0.0.1";
const DEFAULT_CDP_PORT = 9222;
const DEFAULT_TIMEOUT_MS = 30000;
const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
const SENSITIVE_FLAGS = new Set([
  "authorization",
  "base-data",
  "cookie",
  "http-proxy",
  "https-proxy",
  "password",
  "proxy-auth",
  "proxy-server",
  "remote-debugging-pipe",
  "secret",
  "token",
]);

function usage() {
  console.error(`Usage:
  node scripts/yunlogin-fb-cdp.mjs list [options]
  node scripts/yunlogin-fb-cdp.mjs inspect --pid ID [options]
  node scripts/yunlogin-fb-cdp.mjs restart --pid ID [--port PORT] --confirm-restart [options]
  node scripts/yunlogin-fb-cdp.mjs check [--port PORT | --cdp-url URL | --session-file FILE]
  node scripts/yunlogin-fb-cdp.mjs targets [--port PORT | --cdp-url URL | --session-file FILE]
  node scripts/yunlogin-fb-cdp.mjs eval [--port PORT | --session-file FILE] --expression JS
  node scripts/yunlogin-fb-cdp.mjs close [--port PORT | --session-file FILE]

Commands:
  list       List all fb.exe processes and show whether each is the main browser.
  inspect    Show one selected process and its redacted command line.
  restart    Stop the selected main process and relaunch it with a CDP port.
  check      Connect to CDP and call Browser.getVersion.
  targets    List CDP targets.
  eval       Evaluate JavaScript in a page target.
  close      Close the connected browser through CDP.

Options:
  --pid ID             Select one fb.exe process for inspect or restart.
  --browser-id ID      Select the main fb.exe process by --browser-id value.
  --port PORT          CDP port (default: ${DEFAULT_CDP_PORT}).
  --cdp-url URL        Explicit loopback CDP WebSocket or HTTP endpoint.
  --session-file FILE  Read a session created by this helper or a CDP URL from JSON.
  --target-id ID       Page target ID for eval (default: first page target).
  --expression JS      JavaScript expression for eval.
  --output FILE        Save the verified session JSON after restart.
  --timeout-ms MS      Connection and startup timeout (default: ${DEFAULT_TIMEOUT_MS}).
  --show-sensitive     Print raw command-line values instead of redacting them.
  --dry-run            Show the planned restart without stopping or starting anything.
  --confirm-restart    Confirm the process stop and relaunch.
  --main-only          List only main browser processes.
  --json               Print machine-readable JSON (default for all commands).
  -h, --help           Show this help.

Safety:
  The helper never changes a running process in place. A restart kills the
  selected process and starts it again with the same arguments plus:
    --remote-debugging-address=127.0.0.1
    --remote-debugging-port=<port>
  It refuses non-loopback CDP addresses and does not write raw command lines
  to session files.

Examples:
  node scripts/yunlogin-fb-cdp.mjs list --main-only
  node scripts/yunlogin-fb-cdp.mjs inspect --pid 1234
  node scripts/yunlogin-fb-cdp.mjs restart --pid 1234 --port 9222 --dry-run
  node scripts/yunlogin-fb-cdp.mjs restart --pid 1234 --port 9222 --confirm-restart --output session.json
  node scripts/yunlogin-fb-cdp.mjs check --session-file session.json
  node scripts/yunlogin-fb-cdp.mjs targets --session-file session.json
  node scripts/yunlogin-fb-cdp.mjs eval --session-file session.json --expression "document.title"`);
}

function takeValue(args, index, option, allowFlagLike = false) {
  const value = args[index + 1];
  if (value === undefined || (!allowFlagLike && value.startsWith("--"))) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function parseArguments(argv) {
  const args = [...argv];
  if (args.includes("--help") || args.includes("-h")) {
    usage();
    process.exit(0);
  }
  const command = args.shift();
  if (!command || command.startsWith("--")) {
    usage();
    throw new Error("COMMAND is required");
  }
  const options = {
    dryRun: false,
    confirmRestart: false,
    showSensitive: false,
    mainOnly: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--pid") {
      options.pid = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--browser-id") {
      options.browserId = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--port") {
      options.port = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--cdp-url") {
      options.cdpUrl = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--session-file") {
      options.sessionFile = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--target-id") {
      options.targetId = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--expression") {
      options.expression = takeValue(args, index, argument, true);
      index += 1;
    } else if (argument === "--output") {
      options.output = takeValue(args, index, argument);
      index += 1;
    } else if (argument === "--timeout-ms") {
      options.timeoutMs = Number.parseInt(takeValue(args, index, argument), 10);
      index += 1;
    } else if (argument === "--show-sensitive") {
      options.showSensitive = true;
    } else if (argument === "--dry-run") {
      options.dryRun = true;
    } else if (argument === "--confirm-restart") {
      options.confirmRestart = true;
    } else if (argument === "--main-only") {
      options.mainOnly = true;
    } else if (argument === "--json") {
      options.json = true;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }
  return { command, options };
}

function normalizePositiveInteger(value, label) {
  const raw = String(value).trim();
  if (!/^[0-9]+$/.test(raw)) throw new Error(`${label} must be a positive integer`);
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error(`${label} must be a positive integer`);
  return parsed;
}

function normalizePort(value) {
  const port = normalizePositiveInteger(value, "--port");
  if (port > 65535) throw new Error("--port must be between 1 and 65535");
  return port;
}

function normalizeTimeout(value) {
  if (value === undefined) {
    const parsed = Number.parseInt(process.env.YUNLOGIN_CDP_TIMEOUT_MS ?? String(DEFAULT_TIMEOUT_MS), 10);
    if (!Number.isInteger(parsed) || parsed <= 0) throw new Error("--timeout-ms must be a positive integer");
    return parsed;
  }
  return normalizePositiveInteger(value, "--timeout-ms");
}

function hashText(value) {
  return createHash("sha256").update(value, "utf8").digest("hex").toUpperCase();
}

function isWhitespace(character) {
  return character === " " || character === "\t" || character === "\r" || character === "\n";
}

/**
 * Parse a Windows command line into arguments using the CommandLineToArgvW
 * rules needed by Chromium launch strings.
 */
export function parseWindowsCommandLine(commandLine) {
  const args = [];
  let index = 0;
  while (index < commandLine.length) {
    while (index < commandLine.length && isWhitespace(commandLine[index])) index += 1;
    if (index >= commandLine.length) break;

    let argument = "";
    let inQuotes = false;
    while (index < commandLine.length) {
      const character = commandLine[index];
      if (!inQuotes && isWhitespace(character)) break;

      if (character === "\\") {
        let slashCount = 0;
        while (index < commandLine.length && commandLine[index] === "\\") {
          slashCount += 1;
          index += 1;
        }
        if (index < commandLine.length && commandLine[index] === '"') {
          argument += "\\".repeat(Math.floor(slashCount / 2));
          if (slashCount % 2 === 1) {
            argument += '"';
            index += 1;
          } else {
            inQuotes = !inQuotes;
            index += 1;
          }
        } else {
          argument += "\\".repeat(slashCount);
        }
      } else if (character === '"') {
        inQuotes = !inQuotes;
        index += 1;
      } else {
        argument += character;
        index += 1;
      }
    }
    args.push(argument);
  }
  return args;
}

function extractProcessArguments(commandLine) {
  const parsed = parseWindowsCommandLine(commandLine);
  return parsed.length > 0 ? parsed.slice(1) : [];
}


function flagValue(args, flag) {
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag) {
      return args[index + 1];
    }
    if (args[index].startsWith(`${flag}=`)) {
      return args[index].slice(flag.length + 1);
    }
  }
  return undefined;
}

function hasFlag(args, flag) {
  return args.some((argument) => argument === flag || argument.startsWith(`${flag}=`));
}

function removeFlag(args, flag, expectsValue) {
  const result = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag) {
      if (expectsValue && index + 1 < args.length && !args[index + 1].startsWith("--")) index += 1;
      continue;
    }
    if (args[index].startsWith(`${flag}=`)) continue;
    result.push(args[index]);
  }
  return result;
}

function redactArguments(args) {
  const result = [];
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    const assignment = argument.match(/^--([^=]+)=(.*)$/s);
    if (assignment) {
      const name = assignment[1].toLowerCase();
      result.push(SENSITIVE_FLAGS.has(name) ? `--${assignment[1]}=[REDACTED]` : argument);
      continue;
    }
    if (argument.startsWith("--") && SENSITIVE_FLAGS.has(argument.slice(2).toLowerCase())) {
      result.push(argument);
      if (index + 1 < args.length) {
        result.push("[REDACTED]");
        index += 1;
      }
      continue;
    }
    result.push(argument);
  }
  return result;
}

function quoteArgument(value) {
  if (value === "") return '""';
  if (!/[\s"]/u.test(value)) return value;
  const escaped = value.replace(/(\\*)"/g, "$1$1\\\"");
  return `"${escaped.replace(/(\\+)$/u, "$1$1")}"`;
}

function renderCommandLine(executablePath, args, showSensitive = false) {
  const displayArgs = showSensitive ? args : redactArguments(args);
  return [executablePath, ...displayArgs].map(quoteArgument).join(" ");
}

function buildPlannedArgs(args, port) {
  const withoutPort = removeFlag(args, "--remote-debugging-port", true);
  const withoutAddress = removeFlag(withoutPort, "--remote-debugging-address", true);
  const withoutDebugTransport = removeFlag(withoutAddress, "--remote-debugging-pipe", false);
  return [
    ...withoutDebugTransport,
    `--remote-debugging-address=${DEFAULT_CDP_ADDRESS}`,
    `--remote-debugging-port=${port}`,
  ];
}

async function runPowerShell(script, timeoutMs) {
  const { stdout } = await execFileAsync(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script],
    {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      timeout: timeoutMs + 5000,
      windowsHide: true,
    },
  );
  return stdout.trim();
}

export async function listFbProcesses() {
  if (process.platform !== "win32") {
    throw new Error("fb.exe process inspection is only supported on Windows");
  }
  const script = `
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$items = @(
  Get-CimInstance Win32_Process -Filter "Name = '${PROCESS_NAME}'" |
    ForEach-Object {
      [pscustomobject]@{
        ProcessId = [int]$_.ProcessId
        ParentProcessId = [int]$_.ParentProcessId
        ExecutablePath = [string]$_.ExecutablePath
        CommandLine = [string]$_.CommandLine
        CreationDate = if ($_.CreationDate) { $_.CreationDate.ToString('o') } else { $null }
      }
    }
)
ConvertTo-Json -InputObject $items -Compress -Depth 4`;
  const output = await runPowerShell(script, 15000);
  if (!output) return [];
  const parsed = JSON.parse(output);
  const items = Array.isArray(parsed) ? parsed : [parsed];
  return items.map((item) => {
    const commandLine = String(item.CommandLine ?? "");
    const executablePath = String(item.ExecutablePath ?? "");
    const args = extractProcessArguments(commandLine);
    return {
      pid: Number(item.ProcessId),
      parentPid: Number(item.ParentProcessId),
      executablePath,
      commandLine,
      creationDate: item.CreationDate ?? null,
      args,
      main: Boolean(commandLine) && !args.some((argument) => argument.startsWith("--type=")),
      browserId: flagValue(args, "--browser-id"),
      remoteDebuggingPort: flagValue(args, "--remote-debugging-port"),
      hasRemoteDebuggingPipe: hasFlag(args, "--remote-debugging-pipe"),
    };
  });
}

function processView(processInfo, showSensitive) {
  const commandLine = showSensitive
    ? processInfo.commandLine
    : renderCommandLine(processInfo.executablePath, processInfo.args, false);
  return {
    pid: processInfo.pid,
    parentPid: processInfo.parentPid,
    executablePath: processInfo.executablePath,
    creationDate: processInfo.creationDate,
    main: processInfo.main,
    browserId: processInfo.browserId ?? null,
    hasRemoteDebuggingPort: Boolean(processInfo.remoteDebuggingPort),
    hasRemoteDebuggingPipe: processInfo.hasRemoteDebuggingPipe,
    commandLineLength: processInfo.commandLine.length,
    commandLineSha256: hashText(processInfo.commandLine),
    commandLine,
  };
}

async function selectProcess(options) {
  const processes = await listFbProcesses();
  const mainProcesses = processes.filter((processInfo) => processInfo.main);
  if (options.pid !== undefined) {
    const pid = normalizePositiveInteger(options.pid, "--pid");
    const selected = processes.find((processInfo) => processInfo.pid === pid);
    if (!selected) throw new Error(`No ${PROCESS_NAME} process found with PID ${pid}`);
    if (!selected.main) throw new Error(`PID ${pid} is not a main ${PROCESS_NAME} browser process; select the process without --type=`);
    return selected;
  }
  if (options.browserId) {
    const selected = mainProcesses.filter((processInfo) => processInfo.browserId === options.browserId);
    if (selected.length === 0) throw new Error(`No main ${PROCESS_NAME} process with --browser-id=${options.browserId}`);
    if (selected.length > 1) throw new Error(`Multiple main ${PROCESS_NAME} processes match --browser-id=${options.browserId}; use --pid`);
    return selected[0];
  }
  if (mainProcesses.length === 0) throw new Error(`No main ${PROCESS_NAME} process found`);
  if (mainProcesses.length > 1) {
    throw new Error(`Multiple main ${PROCESS_NAME} processes found (${mainProcesses.map((item) => item.pid).join(", ")}); use --pid or --browser-id`);
  }
  return mainProcesses[0];
}

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") resolve(false);
      else reject(error);
    });
    server.listen({ host: DEFAULT_CDP_ADDRESS, port, exclusive: true }, () => {
      server.close(() => resolve(true));
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchCdpVersion(port, timeoutMs) {
  const url = `http://${DEFAULT_CDP_ADDRESS}:${port}/json/version`;
  const response = await fetch(url, { signal: AbortSignal.timeout(Math.max(250, timeoutMs)) });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`CDP endpoint returned non-JSON data at ${url}`);
  }
  if (!response.ok) throw new Error(`CDP endpoint returned HTTP ${response.status} at ${url}`);
  if (!payload.webSocketDebuggerUrl) throw new Error(`CDP /json/version did not include webSocketDebuggerUrl at ${url}`);
  return { httpUrl: url, ...payload };
}

async function waitForCdpVersion(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      return await fetchCdpVersion(port, Math.min(2000, Math.max(250, deadline - Date.now())));
    } catch (error) {
      lastError = error;
      await sleep(250);
    }
  }
  throw new Error(`CDP endpoint on 127.0.0.1:${port} did not become ready: ${lastError?.message ?? "timeout"}`);
}

function assertLoopbackCdpUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid CDP URL: ${value}`);
  }
  if (!["ws:", "wss:", "http:", "https:"].includes(parsed.protocol)) {
    throw new Error("CDP URL must use ws, wss, http, or https");
  }
  if (!LOOPBACK_HOSTS.has(parsed.hostname.toLowerCase())) {
    throw new Error("CDP URL must target loopback only");
  }
  return parsed;
}

async function normalizeCdpUrl(value, timeoutMs) {
  const parsed = assertLoopbackCdpUrl(value);
  if (parsed.protocol === "ws:" || parsed.protocol === "wss:") return parsed.toString();
  const versionUrl = new URL("/json/version", parsed.origin);
  const response = await fetch(versionUrl, { signal: AbortSignal.timeout(timeoutMs) });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`CDP endpoint returned non-JSON data at ${versionUrl.href}`);
  }
  if (!response.ok) throw new Error(`CDP endpoint returned HTTP ${response.status} at ${versionUrl.href}`);
  if (!payload.webSocketDebuggerUrl) throw new Error(`CDP /json/version did not include webSocketDebuggerUrl at ${versionUrl.href}`);
  return payload.webSocketDebuggerUrl;
}

async function resolveCdpTarget(options) {
  const timeoutMs = normalizeTimeout(options.timeoutMs);
  if (options.cdpUrl) {
    const cdpUrl = await normalizeCdpUrl(options.cdpUrl, timeoutMs);
    const parsed = new URL(cdpUrl);
    return { cdpUrl, port: parsed.port ? Number.parseInt(parsed.port, 10) : null, version: null };
  }
  if (options.sessionFile) {
    const source = await readFile(path.resolve(options.sessionFile), "utf8");
    const session = JSON.parse(source);
    const candidate = session.cdpUrl ?? session.webSocketDebuggerUrl ?? session.data?.ws?.puppeteer;
    if (!candidate) throw new Error("--session-file does not contain cdpUrl, webSocketDebuggerUrl, or data.ws.puppeteer");
    const cdpUrl = await normalizeCdpUrl(candidate, timeoutMs);
    const parsed = new URL(cdpUrl);
    return { cdpUrl, port: session.port ?? (parsed.port ? Number.parseInt(parsed.port, 10) : null), version: session.browserVersion ?? null };
  }
  const port = normalizePort(options.port ?? DEFAULT_CDP_PORT);
  const version = await waitForCdpVersion(port, timeoutMs);
  return { cdpUrl: version.webSocketDebuggerUrl, port, version };
}

export async function browserVersion(cdpUrl, timeoutMs) {
  const client = new CdpClient(cdpUrl, timeoutMs);
  try {
    await client.connect();
    return await client.send("Browser.getVersion");
  } finally {
    client.close();
  }
}

async function stopProcess(pid, timeoutMs) {
  const waitMs = Math.min(Math.max(timeoutMs, 1000), 10000);
  const script = `
$ErrorActionPreference = 'Stop'
$processId = ${pid}
$p = Get-Process -Id $processId -ErrorAction SilentlyContinue
if ($null -eq $p) { 'already-exited'; exit 0 }
$closed = $false
try { $closed = $p.CloseMainWindow() } catch { }
if ($closed) {
  $deadline = (Get-Date).AddMilliseconds(${waitMs})
  while ((Get-Process -Id $processId -ErrorAction SilentlyContinue) -and ((Get-Date) -lt $deadline)) {
    Start-Sleep -Milliseconds 200
  }
}
if (Get-Process -Id $processId -ErrorAction SilentlyContinue) {
  Stop-Process -Id $processId -Force
}
if (Get-Process -Id $processId -ErrorAction SilentlyContinue) {
  throw "Process $processId is still running"
}
'stopped'`;
  return runPowerShell(script, timeoutMs + 5000);
}

function planPayload(processInfo, options, port) {
  const args = processInfo.args;
  const plannedArgs = buildPlannedArgs(args, port);
  return {
    command: "restart",
    dryRun: options.dryRun === true,
    needsConfirmation: options.dryRun !== true && options.confirmRestart !== true,
    pid: processInfo.pid,
    browserId: processInfo.browserId ?? null,
    executablePath: processInfo.executablePath,
    port,
    cdpAddress: DEFAULT_CDP_ADDRESS,
    existingRemoteDebuggingPort: processInfo.remoteDebuggingPort ?? null,
    portAvailable: null,
    plannedArguments: options.showSensitive ? plannedArgs : redactArguments(plannedArgs),
    plannedCommandLine: renderCommandLine(processInfo.executablePath, plannedArgs, options.showSensitive),
    originalCommandLine: options.showSensitive
      ? processInfo.commandLine
      : renderCommandLine(processInfo.executablePath, args, false),
    originalCommandLineLength: processInfo.commandLine.length,
    originalCommandLineSha256: hashText(processInfo.commandLine),
    browserVersion: null,
  };
}

export async function restartFbProcess(options) {
  const timeoutMs = normalizeTimeout(options.timeoutMs);
  const port = normalizePort(options.port ?? DEFAULT_CDP_PORT);
  const processInfo = await selectProcess(options);
  const existingPort = processInfo.remoteDebuggingPort;
  if (existingPort && Number.parseInt(existingPort, 10) === port) {
    try {
      const version = await fetchCdpVersion(port, Math.min(timeoutMs, 2000));
      const browser = await browserVersion(version.webSocketDebuggerUrl, timeoutMs);
      return {
        command: "restart",
        alreadyConnected: true,
        pid: processInfo.pid,
        port,
        cdpAddress: DEFAULT_CDP_ADDRESS,
        cdpUrl: version.webSocketDebuggerUrl,
        browserVersion: browser,
      };
    } catch {
      // The flag exists but the endpoint is not reachable; continue with a clean relaunch.
    }
  }

  const summary = planPayload(processInfo, options, port);
  summary.portAvailable = await isPortAvailable(port);
  if (options.dryRun) return summary;
  if (!options.confirmRestart) return summary;
  if (!summary.portAvailable) throw new Error(`CDP port ${port} is already in use; choose another --port`);
  const current = await selectProcess({ pid: String(processInfo.pid) });
  if (hashText(current.commandLine) !== hashText(processInfo.commandLine)) {
    throw new Error("The selected fb.exe command line changed before restart; inspect it again");
  }

  await stopProcess(processInfo.pid, timeoutMs);
  const child = spawn(processInfo.executablePath, buildPlannedArgs(processInfo.args, port), {
    cwd: path.dirname(processInfo.executablePath),
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  await new Promise((resolve, reject) => {
    child.once("spawn", resolve);
    child.once("error", reject);
  });
  child.unref();

  const version = await waitForCdpVersion(port, timeoutMs);
  const browser = await browserVersion(version.webSocketDebuggerUrl, timeoutMs);
  const relaunched = (await listFbProcesses()).find(
    (item) => item.main && String(item.remoteDebuggingPort) === String(port),
  );
  const session = {
    command: "restart",
    pid: relaunched?.pid ?? child.pid,
    executablePath: processInfo.executablePath,
    browserId: processInfo.browserId ?? null,
    port,
    cdpAddress: DEFAULT_CDP_ADDRESS,
    cdpUrl: version.webSocketDebuggerUrl,
    browserVersion: browser,
    createdAt: new Date().toISOString(),
  };
  if (options.output) await writeFile(path.resolve(options.output), JSON.stringify(session, null, 2), "utf8");
  return session;
}

async function runList(options) {
  const processes = await listFbProcesses();
  const selected = options.mainOnly ? processes.filter((processInfo) => processInfo.main) : processes;
  return {
    command: "list",
    processName: PROCESS_NAME,
    count: selected.length,
    processes: selected.map((processInfo) => processView(processInfo, options.showSensitive)),
  };
}

async function runInspect(options) {
  const processInfo = await selectProcess(options);
  return { command: "inspect", process: processView(processInfo, options.showSensitive) };
}

async function runCheck(options) {
  const timeoutMs = normalizeTimeout(options.timeoutMs);
  const target = await resolveCdpTarget(options);
  const version = await browserVersion(target.cdpUrl, timeoutMs);
  return { command: "check", cdpUrl: target.cdpUrl, port: target.port, version };
}

async function runClose(options) {
  const timeoutMs = normalizeTimeout(options.timeoutMs);
  const target = await resolveCdpTarget(options);
  const client = new CdpClient(target.cdpUrl, timeoutMs);
  try {
    await client.connect();
    client.sendNoWait("Browser.close");
    await sleep(250);
    return { command: "close", cdpUrl: target.cdpUrl, closed: true };
  } finally {
    client.close();
  }
}
async function runTargets(options) {
  const timeoutMs = normalizeTimeout(options.timeoutMs);
  const target = await resolveCdpTarget(options);
  const client = new CdpClient(target.cdpUrl, timeoutMs);
  try {
    await client.connect();
    const result = await client.send("Target.getTargets");
    return {
      command: "targets",
      cdpUrl: target.cdpUrl,
      targets: (result.targetInfos ?? []).map((item) => ({
        targetId: item.targetId,
        type: item.type,
        title: item.title,
        url: item.url,
        attached: item.attached,
      })),
    };
  } finally {
    client.close();
  }
}

async function runEval(options) {
  if (!options.expression) throw new Error("--expression is required for eval");
  const timeoutMs = normalizeTimeout(options.timeoutMs);
  const target = await resolveCdpTarget(options);
  const client = new CdpClient(target.cdpUrl, timeoutMs);
  try {
    await client.connect();
    const result = await client.send("Target.getTargets");
    const pages = (result.targetInfos ?? []).filter((item) => item.type === "page");
    const page = options.targetId ? pages.find((item) => item.targetId === options.targetId) : pages[0];
    if (!page) throw new Error("No matching page target found for eval");
    const attached = await client.send("Target.attachToTarget", { targetId: page.targetId, flatten: true });
    try {
      const evaluated = await client.send(
        "Runtime.evaluate",
        { expression: options.expression, returnByValue: true, awaitPromise: true },
        attached.sessionId,
      );
      return {
        command: "eval",
        cdpUrl: target.cdpUrl,
        targetId: page.targetId,
        result: evaluated.result,
      };
    } finally {
      await client.send("Target.detachFromTarget", { sessionId: attached.sessionId }).catch(() => {});
    }
  } finally {
    client.close();
  }
}

async function main(argv = process.argv.slice(2)) {
  const { command, options } = parseArguments(argv);
  if (command === "list") return runList(options);
  if (command === "inspect") return runInspect(options);
  if (command === "restart") return restartFbProcess(options);
  if (command === "check") return runCheck(options);
  if (command === "targets") return runTargets(options);
  if (command === "close") return runClose(options);
  if (command === "eval") return runEval(options);
  throw new Error(`Unknown command: ${command}`);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === path.resolve(fileURLToPath(import.meta.url))) {
  main()
    .then((result) => {
      if (result?.needsConfirmation) process.exitCode = 2;
      if (result && process.env.YUNLOGIN_FB_CDP_QUIET !== "1") console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exitCode = 1;
    });
}
