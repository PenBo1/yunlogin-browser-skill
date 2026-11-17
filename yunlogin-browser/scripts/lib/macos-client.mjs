import { execFile } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const BUNDLE_ID = "com.yunlogin.fbmain";
const QUERY_OPTIONS = { timeout: 15000, maxBuffer: 8 * 1024 * 1024, env: { ...process.env, LC_ALL: "C" } };

export function parseMacProcesses(text) {
  return text.split("\n").filter(line => line.trim()).map(line => {
    const match = line.match(/^\s*(\d+)\s+(\d+)\s+(.+)$/);
    if (!match) throw new Error("Could not parse the macOS process inventory; running state is unknown.");
    return { pid: Number(match[1]), parentPid: Number(match[2]), path: match[3] };
  });
}

export async function macProcesses({ run = execFileAsync } = {}) {
  const { stdout } = await run("/bin/ps", ["-ww", "-axo", "pid=,ppid=,comm="], QUERY_OPTIONS);
  return parseMacProcesses(stdout);
}

function appForExecutable(executable) {
  const match = executable.match(/^(.*\.app)\/Contents\/MacOS\/[^/]+$/i);
  return match?.[1];
}

export async function macBundleExecutable(candidate, { run = execFileAsync } = {}) {
  if (!path.isAbsolute(candidate)) throw new Error("--exe must be an absolute .app or YunLogin executable path.");
  const normalized = path.normalize(candidate).replace(/\/$/, "");
  const app = normalized.endsWith(".app") ? normalized : appForExecutable(normalized);
  if (!app) throw new Error("The selected path must be a YunLogin .app or its Contents/MacOS executable.");
  const plist = path.join(app, "Contents", "Info.plist");
  let identifier, name;
  try {
    ({ stdout: identifier } = await run("/usr/bin/plutil", ["-extract", "CFBundleIdentifier", "raw", "-o", "-", plist], QUERY_OPTIONS));
    ({ stdout: name } = await run("/usr/bin/plutil", ["-extract", "CFBundleExecutable", "raw", "-o", "-", plist], QUERY_OPTIONS));
  } catch {
    throw new Error("Could not read the selected application's Info.plist.");
  }
  name = name.trim();
  if (identifier.trim().toLowerCase() !== BUNDLE_ID || !name || name.includes("/") || name === "." || name === "..") {
    throw new Error("The selected application is not an identified YunLogin desktop bundle.");
  }
  const executable = path.join(app, "Contents", "MacOS", name);
  if (normalized !== app && normalized !== executable) throw new Error("The supplied path is not the bundle's main executable.");
  if (!(await stat(executable)).isFile()) throw new Error("The YunLogin bundle's executable is missing.");
  return executable;
}

export async function macDesktopProcesses({ processes, run = execFileAsync } = {}) {
  const snapshot = processes ?? await macProcesses({ run });
  // Match main desktop binaries only, never helpers or the nested FbBrowser.
  const possible = snapshot.filter(p => /\/Contents\/MacOS\/(?:Yunlogin Browser|YunLogin|\u4e91\u767b\u6d4f\u89c8\u5668)$/i.test(p.path));
  const verified = [];
  for (const item of possible) {
    let executable;
    try { executable = await macBundleExecutable(item.path, { run }); }
    catch (error) {
      // A process can outlive a removed temporary/test bundle. Ignore that
      // stale executable, but preserve errors for a live bundle or denied query.
      if (!(await stat(item.path).then(s => s.isFile()).catch(() => false))) continue;
      throw error;
    }
    verified.push({ ...item, path: executable });
  }
  return verified;
}

export async function discoverMac({ executable, run = execFileAsync, applicationDirs = ["/Applications", path.join(os.homedir(), "Applications")] } = {}) {
  const running = await macDesktopProcesses({ run });
  const warnings = [];
  const explicit = executable ?? process.env.YUNLOGIN_EXE;
  if (explicit) return { running, installed: [await macBundleExecutable(explicit, { run })], warnings, discoveryComplete: true };
  const candidates = new Set(running.map(p => p.path));
  for (const root of applicationDirs) {
    let entries;
    try { entries = await readdir(root, { withFileTypes: true }); }
    catch (error) {
      if (error.code !== "ENOENT") warnings.push(`Could not inspect applications in ${root}.`);
      continue;
    }
    for (const entry of entries) {
      if (!entry.name.toLowerCase().endsWith(".app")) continue;
      // Check bundle identity so renamed apps and same-name unrelated apps work.
      try { candidates.add(await macBundleExecutable(path.join(root, entry.name), { run })); }
      catch (error) {
        if (/yunlogin/i.test(entry.name)) warnings.push(`Could not validate ${path.join(root, entry.name)}.`);
      }
    }
  }
  return { running, installed: [...candidates], warnings, discoveryComplete: warnings.length === 0 };
}

export function parseMacListeners(text) {
  const listeners = [];
  let pid, family;
  for (const line of text.split("\n")) {
    if (line.startsWith("p")) { pid = Number(line.slice(1)); family = undefined; }
    else if (line.startsWith("t")) family = line.slice(1);
    else if (line.startsWith("n")) {
      const endpoint = line.slice(1).match(/^(.*):(\d+)$/);
      if (!endpoint || !Number.isSafeInteger(pid) || pid < 1) throw new Error("Could not parse macOS listener ownership.");
      let address = endpoint[1].replace(/^\[|\]$/g, "");
      if (address === "*") address = family === "IPv6" ? "::" : "0.0.0.0";
      const port = Number(endpoint[2]);
      if (port < 1 || port > 65535) throw new Error("Invalid macOS TCP listener port.");
      listeners.push({ pid, address, port });
    }
  }
  return listeners;
}

export async function macListeners({ pids, port, run = execFileAsync } = {}) {
  if (pids && !pids.length) return [];
  const args = ["-nP", "-a"];
  if (pids) {
    if (!pids.every(pid => Number.isSafeInteger(pid) && pid > 0)) throw new Error("Invalid process ID.");
    args.push("-p", pids.join(","));
  }
  if (port !== undefined && (!Number.isInteger(port) || port < 1 || port > 65535)) throw new Error("Invalid TCP port.");
  args.push(port === undefined ? "-iTCP" : `-iTCP:${port}`, "-sTCP:LISTEN", "-Fptn");
  let stdout;
  try { ({ stdout } = await run("/usr/sbin/lsof", args, QUERY_OPTIONS)); }
  catch (error) {
    // lsof returns 1 with no output for an empty, successful selection.
    if (error.code === 1 && !error.stdout?.trim() && !error.stderr?.trim()) return [];
    throw new Error("macOS listener query failed; service ownership is unknown.");
  }
  const listeners = parseMacListeners(stdout);
  return listeners.filter(item => (!pids || pids.includes(item.pid)) && (port === undefined || item.port === port));
}

export async function macDesktopListeners() {
  const processes = await macDesktopProcesses();
  return { processes, listeners: await macListeners({ pids: processes.map(p => p.pid) }), publishedClientPort: null };
}

// KERN_PROCARGS2 supplies argc and NUL-delimited argv. ps prints a flattened
// string and cannot safely preserve spaces/quotes for a browser relaunch.
// JXA/JavaScriptCore is bundled with macOS; no Python, npm or compiler needed.
const PROCARGS = String.raw`
ObjC.import('Foundation');
ObjC.bindFunction('sysctl', ['int', ['void *', 'unsigned int', 'void *', 'void *', 'void *', 'unsigned long']]);
ObjC.bindFunction('proc_pidinfo', ['int', ['int', 'int', 'unsigned long long', 'void *', 'int']]);
function run(argv) {
  var pid = Number(argv[1]);
  var before = $.NSMutableData.dataWithLength(136);
  if ($.proc_pidinfo(pid, 3, 0, before.mutableBytes, 136) !== 136) throw Error('Process identity is unavailable.');
  var mib = $.NSData.alloc.initWithBase64EncodedStringOptions(argv[0], 0);
  var length = $.NSMutableData.alloc.initWithBase64EncodedStringOptions('AAAQAAAAAAA=', 0);
  var data = $.NSMutableData.dataWithLength(1048576);
  if ($.sysctl(mib.bytes, 3, data.mutableBytes, length.mutableBytes, null, 0) !== 0) throw Error('Process arguments are unavailable.');
  var after = $.NSMutableData.dataWithLength(136);
  if ($.proc_pidinfo(pid, 3, 0, after.mutableBytes, 136) !== 136) throw Error('Process identity is unavailable.');
  return JSON.stringify({length: ObjC.unwrap(length.base64EncodedStringWithOptions(0)), data: ObjC.unwrap(data.base64EncodedStringWithOptions(0)), before: ObjC.unwrap(before.base64EncodedStringWithOptions(0)), after: ObjC.unwrap(after.base64EncodedStringWithOptions(0))});
}
`;

export function parseMacArgv(buffer) {
  if (buffer.length < 5) throw new Error("Incomplete macOS process arguments.");
  const argc = buffer.readInt32LE(0);
  if (argc < 1 || argc > 65536) throw new Error("Invalid macOS process argc.");
  let offset = buffer.indexOf(0, 4);
  if (offset < 0) throw new Error("Incomplete macOS executable path.");
  const executablePath = buffer.subarray(4, offset).toString("utf8");
  while (buffer[offset] === 0 && offset < buffer.length) offset++;
  const argv = [];
  for (let index = 0; index < argc; index++) {
    const end = buffer.indexOf(0, offset);
    if (end < 0) throw new Error("Incomplete macOS argv; refusing a lossy relaunch.");
    argv.push(buffer.subarray(offset, end).toString("utf8"));
    offset = end + 1;
  }
  return { executablePath, argv };
}

export async function macProcessArguments(pid, { run = execFileAsync } = {}) {
  if (!Number.isSafeInteger(pid) || pid < 1) throw new Error("Invalid process ID.");
  const mib = Buffer.alloc(12);
  [1, 49, pid].forEach((value, index) => mib.writeInt32LE(value, index * 4));
  let payload;
  try {
    const { stdout } = await run("/usr/bin/osascript", ["-l", "JavaScript", "-e", PROCARGS, mib.toString("base64"), String(pid)], QUERY_OPTIONS);
    payload = JSON.parse(stdout);
  } catch { throw new Error("Could not read exact macOS browser arguments; process state is unknown. Check process-query permissions."); }
  const size = Number(Buffer.from(payload.length, "base64").readBigUInt64LE());
  const data = Buffer.from(payload.data, "base64");
  if (size > data.length || size < 5) throw new Error("Invalid macOS process argument buffer.");
  // proc_bsdinfo from Apple's sys/proc_info.h: PID at 12; start timeval at
  // 120/128. Microsecond precision distinguishes rapid browser relaunches.
  const before = Buffer.from(payload.before, "base64"), after = Buffer.from(payload.after, "base64");
  if (before.length !== 136 || after.length !== 136 || before.readUInt32LE(12) !== pid || after.readUInt32LE(12) !== pid || !before.subarray(120).equals(after.subarray(120))) {
    throw new Error("macOS process identity changed during argument discovery.");
  }
  const seconds = Number(after.readBigUInt64LE(120)), micros = Number(after.readBigUInt64LE(128));
  if (micros >= 1000000) throw new Error("Invalid macOS process start time.");
  const creationDate = new Date(seconds * 1000).toISOString().replace(".000Z", `.${String(micros).padStart(6, "0")}Z`);
  return { ...parseMacArgv(data.subarray(0, size)), creationDate };
}

export async function macFbProcesses({ run = execFileAsync } = {}) {
  const processes = await macProcesses({ run });
  const browsers = processes.filter(p => /\/FbBrowser\.app\/Contents\/MacOS\/FbBrowser$/.test(p.path));
  const found = [];
  for (const item of browsers) {
    let captured;
    try { captured = await macProcessArguments(item.pid, { run }); }
    catch (error) {
      // Exits during a process snapshot are ordinary. Permission errors on a
      // still-live process must remain errors rather than false stopped states.
      if (!(await macProcesses({ run })).some(p => p.pid === item.pid && p.path === item.path)) continue;
      throw error;
    }
    const { executablePath, argv, creationDate } = captured;
    if (executablePath !== item.path) throw new Error("Browser identity changed during macOS discovery; retry the read.");
    found.push({ ...item, executablePath, args: argv.slice(1), commandLine: JSON.stringify(argv), creationDate });
  }
  return found;
}
