#!/usr/bin/env node
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import { randomBytes, createHash } from "node:crypto";

const execFileAsync = promisify(execFile);
const INVENTORY = String.raw`
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$processes = @(Get-CimInstance Win32_Process -Filter "Name='YunLogin.exe'" | ForEach-Object { @{pid=[int]$_.ProcessId; path=$_.ExecutablePath} })
$ids = @($processes | ForEach-Object {$_.pid})
$listeners = @()
$publishedClientPort = $null
if ($ids.Count -gt 0) {
  $listeners = @(Get-NetTCPConnection -State Listen -ErrorAction Stop | Where-Object {$_.OwningProcess -in $ids} | ForEach-Object { @{pid=[int]$_.OwningProcess; address=$_.LocalAddress; port=[int]$_.LocalPort} })
  $mapping = $null
  $view = $null
  try {
    $mapping = [IO.MemoryMappedFiles.MemoryMappedFile]::OpenExisting('shm_fetch_proxy_info',[IO.MemoryMappedFiles.MemoryMappedFileRights]::Read)
    $view = $mapping.CreateViewAccessor(0,64,[IO.MemoryMappedFiles.MemoryMappedFileAccess]::Read)
    $bytes = New-Object byte[] 64
    [void]$view.ReadArray(0,$bytes,0,64)
    $portText = [Text.Encoding]::ASCII.GetString($bytes).Split([char]0)[0]
    if ($portText -match '^\d{1,5}$' -and [int]$portText -gt 0 -and [int]$portText -le 65535) {$publishedClientPort = [int]$portText}
  } catch { } finally { if ($view) {$view.Dispose()}; if ($mapping) {$mapping.Dispose()} }
}
@{processes=$processes; listeners=$listeners; publishedClientPort=$publishedClientPort} | ConvertTo-Json -Depth 4 -Compress
`;

export async function desktopListeners() {
  if (process.platform !== "win32") throw new Error("Automatic listener discovery currently supports Windows only.");
  const { stdout } = await execFileAsync("powershell.exe", ["-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(INVENTORY, "utf16le").toString("base64")], { windowsHide: true, timeout: 15000, maxBuffer: 1024 * 1024 });
  return JSON.parse(stdout.replace(/^\uFEFF/, ""));
}

export function probeOrigin(address, port) {
  if (["127.0.0.1", "0.0.0.0"].includes(address)) return `http://127.0.0.1:${port}`;
  if (["::1", "::"].includes(address)) return `http://[::1]:${port}`;
  return null;
}

async function probe(origin, route, timeoutMs) {
  try {
    const response = await fetch(`${origin}${route}`, {
      method: route === "/api/v1/client/gpu_info" ? "POST" : "GET",
      headers: { "content-type": "text/plain;charset=UTF-8", accept: "application/json" },
      body: route === "/api/v1/client/gpu_info" ? "{}" : undefined,
      redirect: "error", signal: AbortSignal.timeout(timeoutMs),
    });
    const payload = await response.json().catch(() => null);
    return { route, httpStatus: response.status, code: typeof payload?.code === "number" ? payload.code : null,
      gpuShape: Array.isArray(payload?.data?.adapters), statusShape: payload?.code === 0 && typeof payload?.msg === "string" };
  } catch { return { route, unavailable: true }; }
}

export function classify(probes) {
  const gpu = probes.find(p => p.route === "/api/v1/client/gpu_info");
  const status = probes.find(p => p.route === "/status");
  if (gpu?.httpStatus === 200 && gpu.code === 0 && gpu.gpuShape) return "client-api";
  if (status?.httpStatus === 200 && status.code === 0 && status.statusShape) return "local-api";
  if (probes.some(p => p.httpStatus === 426)) return "upgrade-required";
  return "unknown";
}

export function verifyWebSocket(origin, timeoutMs) {
  // Verify only the opening handshake, close immediately, and send no commands.
  return new Promise(resolve => {
    const key = randomBytes(16).toString("base64");
    const expected = createHash("sha1").update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest("base64");
    let settled = false;
    let timer;
    const finish = result => { if (!settled) { settled = true; clearTimeout(timer); resolve(result); } };
    const request = http.request(`${origin}/`, { headers: { Connection: "Upgrade", Upgrade: "websocket", "Sec-WebSocket-Version": "13", "Sec-WebSocket-Key": key } });
    timer = setTimeout(() => { request.destroy(); finish(false); }, timeoutMs);
    request.once("upgrade", (response, socket) => { socket.destroy(); finish(response.statusCode === 101 && response.headers["sec-websocket-accept"] === expected); });
    request.once("response", response => { response.destroy(); finish(false); });
    request.once("error", () => finish(false));
    request.end();
  });
}

export async function discoverPorts({ timeoutMs = 1000, inventory = desktopListeners, probeRequest = probe, websocketProbe = verifyWebSocket } = {}) {
  // Refresh ownership each invocation. Never use previous ports, a guessed range,
  // an environment override, or an unrelated local listener as a scan target.
  const snapshot = await inventory();
  const listeners = [];
  for (const listener of snapshot.listeners) {
    const origin = probeOrigin(listener.address, listener.port);
    const probes = origin ? await Promise.all(["/status", "/api/v1/client/gpu_info"].map(route => probeRequest(origin, route, timeoutMs))) : [];
    let purpose = classify(probes);
    if (purpose === "upgrade-required" && await websocketProbe(origin, timeoutMs)) purpose = "websocket";
    listeners.push({ ...listener, origin, purpose, probes });
  }
  const originsFor = purpose => [...new Set(listeners.filter(p => p.purpose === purpose).map(p => p.origin))];
  return { observedAt: new Date().toISOString(), processes: snapshot.processes, listeners,
    publishedClientPort: snapshot.publishedClientPort ?? null,
    publishedClientPortVerified: listeners.some(p => p.port === snapshot.publishedClientPort && p.purpose === "client-api"),
    localApiOrigins: originsFor("local-api"), clientApiOrigins: originsFor("client-api"),
    websocketOrigins: originsFor("websocket").map(p => p.replace(/^http:/, "ws:")),
    running: snapshot.processes.length > 0, complete: listeners.every(p => !["unknown", "upgrade-required"].includes(p.purpose)),
    note: "Fresh process-owned TCP listeners only. WebSocket classification verifies a handshake, not application messages. Unknown is not an API. No configuration or credentials are read." };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) { console.log("Usage: node scripts/yunlogin-ports.mjs [--json]\nDiscover current YunLogin-owned TCP ports and verify local/client API routes. Read-only; no startup."); return; }
  if (args.some(a => a !== "--json")) throw new Error("Only --json or --help is supported.");
  console.log(JSON.stringify(await discoverPorts(), null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`Error: ${error.message}`); process.exitCode = 1; });
}
