import { execFile } from "node:child_process";
import { createServer } from "node:net";
import { promisify } from "node:util";
import { browserVersion, fetchCdpVersion, listFbProcesses, restartFbProcess } from "../yunlogin-fb-cdp.mjs";

const execFileAsync = promisify(execFile);
const WORKBENCH_ID = "Workbench";

export async function findWorkbench() {
  const matches = (await listFbProcesses()).filter(p => p.main && p.browserId === WORKBENCH_ID);
  if (matches.length > 1) throw new Error("Multiple Workbench browser processes found; select or close the duplicate before syncing.");
  return matches[0] ?? null;
}

async function listenerOwner(port) {
  const script = `[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false)
@(Get-NetTCPConnection -State Listen -LocalAddress 127.0.0.1 -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object {[int]$_.OwningProcess}) | ConvertTo-Json -Compress`;
  const { stdout } = await execFileAsync("powershell.exe", ["-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(script, "utf16le").toString("base64")], { windowsHide: true, timeout: 10000 });
  const parsed = JSON.parse(stdout.trim() || "[]");
  return Array.isArray(parsed) ? parsed : [parsed];
}

async function reserveCandidatePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen({ host: "127.0.0.1", port: 0, exclusive: true }, () => {
      const port = server.address().port;
      server.close(error => error ? reject(error) : resolve(port));
    });
  });
}

export function validateCdpPort(value) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("CDP port must be an integer between 1 and 65535.");
  return port;
}

export async function verifyWorkbenchCdp(workbench, { owner = listenerOwner, fetchVersion = fetchCdpVersion, checkBrowser = browserVersion } = {}) {
  if (!workbench?.remoteDebuggingPort) return null;
  if (!workbench.args?.some(arg => arg === "--remote-debugging-address=127.0.0.1") && workbench.args) return null;
  const port = validateCdpPort(workbench.remoteDebuggingPort);
  if (!(await owner(port)).includes(workbench.pid)) return null;
  const version = await fetchVersion(port, 2000).catch(() => null);
  const url = version?.webSocketDebuggerUrl;
  if (!url) return null;
  const parsed = new URL(url);
  if (parsed.protocol !== "ws:" || parsed.hostname !== "127.0.0.1" || Number(parsed.port) !== port || !parsed.pathname.startsWith("/devtools/browser/")) return null;
  const result = await checkBrowser(url, 2000).catch(() => null);
  if (!result?.product) return null;
  if (!(await owner(port)).includes(workbench.pid)) return null;
  return { pid: workbench.pid, browserId: WORKBENCH_ID, processStartedAt: workbench.creationDate, port, cdpUrl: url, browserVersion: result.product };
}

export async function ensureWorkbenchCdp({ port, confirmRestart = false, startedThisRun = false, dryRun = false, find = findWorkbench, verify = verifyWorkbenchCdp, restart = restartFbProcess, choosePort = reserveCandidatePort, owner = listenerOwner } = {}) {
  const workbench = await find();
  if (!workbench) return { ready: false, reason: "Workbench browser is not running; open or start YunLogin first." };
  const connected = await verify(workbench);
  if (connected) return { ready: true, reused: true, ...connected };
  if (workbench.remoteDebuggingPort) throw new Error("Workbench already declares a CDP port but it failed process/endpoint verification. Inspect it before any restart.");
  const selectedPort = port === undefined ? await choosePort() : validateCdpPort(port);
  if ((await owner(selectedPort)).length) throw new Error(`CDP port ${selectedPort} is in use; choose another loopback port.`);
  const plan = { ready: false, needsRestart: true, pid: workbench.pid, browserId: WORKBENCH_ID, selectedPort, reason: "Workbench must close and reopen once to enable loopback CDP." };
  if (dryRun || !(confirmRestart || startedThisRun)) return plan;
  const restarted = await restart({ pid: String(workbench.pid), port: selectedPort, confirmRestart: true });
  if (restarted?.needsConfirmation || !restarted?.cdpUrl) throw new Error("Workbench restart did not return a verified CDP session; do not retry automatically.");
  const after = await find();
  const verified = await verify(after);
  if (!verified || verified.pid !== restarted.pid || after.pid === workbench.pid ||
      !after.creationDate || after.creationDate === workbench.creationDate ||
      after.browserId !== WORKBENCH_ID || Number(after.remoteDebuggingPort) !== selectedPort || verified.port !== selectedPort) {
    throw new Error("Workbench was relaunched, but process ownership and CDP verification did not complete; do not restart again automatically.");
  }
  return { ready: true, reused: false, ...verified };
}
