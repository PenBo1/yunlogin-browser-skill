import { mkdir, open, readFile, rename, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

let activeSession;
export function pinWorkbenchSession(value) { activeSession = value; }
export function clearPinnedWorkbenchSession() { activeSession = undefined; }

export function sessionPath() {
  const base = process.platform === "win32" ? process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local") : path.join(os.homedir(), ".local", "share");
  return path.join(base, "yunlogin-browser", "workbench-session.json");
}

export async function readWorkbenchSession() {
  if (activeSession) return activeSession;
  try {
    const value = JSON.parse(await readFile(sessionPath(), "utf8"));
    return value?.status === "valid" && value?.source?.browserId === "Workbench" ? value : undefined;
  } catch { return undefined; }
}

async function acquireLock(target) {
  const lockPath = `${target}.lock`;
  const deadline = Date.now() + 15000;
  for (;;) {
    try { return { handle: await open(lockPath, "wx", 0o600), lockPath }; }
    catch (error) {
      if (error.code !== "EEXIST") throw error;
      const details = await stat(lockPath).catch(() => null);
      if (details && Date.now() - details.mtimeMs > 30000) await rm(lockPath, { force: true });
      if (Date.now() >= deadline) throw new Error("Workbench session update is busy; retry after the other sync finishes.");
      await new Promise(resolve => setTimeout(resolve, 120));
    }
  }
}

export async function updateWorkbenchSession(value, { recheck } = {}) {
  const target = sessionPath();
  await mkdir(path.dirname(target), { recursive: true });
  const { handle, lockPath } = await acquireLock(target);
  const temporary = `${target}.${process.pid}.${randomUUID()}.tmp`;
  try {
    if (recheck) await recheck();
    const temporaryHandle = await open(temporary, "wx", 0o600);
    try {
      await temporaryHandle.writeFile(JSON.stringify(value));
      await temporaryHandle.sync();
    } finally { await temporaryHandle.close(); }
    await rename(temporary, target);
  } finally {
    await rm(temporary, { force: true }).catch(() => {});
    await handle.close();
    await rm(lockPath, { force: true });
  }
  return target;
}

export async function invalidateWorkbenchSession(reason = "workbench-unavailable") {
  return updateWorkbenchSession({ status: "invalid", reason, invalidatedAt: new Date().toISOString() });
}
