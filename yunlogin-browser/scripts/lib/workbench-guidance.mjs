// Public diagnostics contain only stable codes and recovery guidance, never
// raw process arguments, launch errors, session values or localStorage.
const ISSUES = {
  "client-not-running": ["client-not-running", "YunLogin is not running; Workbench is unavailable.", "Start the located YunLogin installation with existing user authorization, or ask the user to open YunLogin and its Workbench, then recheck status."],
  "workbench-not-running": ["workbench-not-running", "The YunLogin client is running, but its Workbench browser was not found.", "Open Workbench from the YunLogin client, then recheck status. Do not start a standalone FbBrowser or restart the main client to force it."],
  "inspection-failed": ["unknown", "Workbench process or CDP inspection failed; its state is unknown.", "Check process-query permissions and the Workbench window, then retry the read-only status check. Do not interpret this as stopped, uninstalled or logged out."],
  "client-launch-failed": ["launch-failed", "The selected YunLogin client could not be launched; Workbench readiness was not verified.", "Open the located application manually and check macOS application permissions or startup prompts, then recheck status. Do not automatically launch another copy."],
  "workbench-startup-timeout": ["startup-timeout", "The client was launched, but Workbench or its required local API did not become ready within the wait budget.", "Check the YunLogin window for login or first-run prompts and open its Workbench manually, then recheck status. Do not repeat the launch automatically."],
  "cdp-runtime-unavailable": ["runtime-unavailable", "Workbench declares a debugging port, but this Node.js runtime has no WebSocket support to verify it.", "Use Node.js 22+ or Node.js 20 with --experimental-websocket, then recheck status before any restart."],
  "macos-workbench-cdp-unavailable": ["cdp-unavailable", "Native Workbench is running, but its CDP connection did not verify. Automatic Workbench CDP setup has not succeeded with the tested macOS launch method.", "Offer references/workflows/web-workbench.md: launch a dedicated Playwright CLI browser with loopback CDP and verified bridge ports. Bootstrap Authorization from the selected YunLogin environment's localStorage with yunlogin-workbench-web-login.mjs, or revalidate its private web-session cache. If neither verifies, ask the user to sign in there. Do not retry native Workbench restarts automatically."],
  "cdp-verification-failed": ["cdp-unavailable", "Workbench CDP setup or verification failed; AI control is unavailable.", "Recheck the current Workbench process, its owned listeners, /json/version and Browser.getVersion. Do not retry a restart automatically or attach to an unrelated process's port."],
};

export function workbenchIssue(reasonCode, { pid, port } = {}) {
  const issue = ISSUES[reasonCode];
  if (!issue) throw new Error("Unknown Workbench diagnostic code.");
  return { ready: false, state: issue[0], reasonCode, reason: issue[1], message: issue[1], action: issue[2],
    ...(pid ? { pid } : {}), ...(port ? { port } : {}),
    automaticRetry: false,
    blockedCapabilities: ["workbench-page-control", "workbench-session-sync"],
    ...(["workbench-not-running", "workbench-startup-timeout", "macos-workbench-cdp-unavailable", "cdp-verification-failed"].includes(reasonCode) ? {
      alternative: { mode: "web-workbench", workflow: "references/workflows/web-workbench.md", availableWhen: "The user chooses web management-center control with a separate browser.",
        automaticLaunch: false, automaticCredentialTransfer: false,
        action: "Explain the separate browser/profile and login source. Reuse an explicit choice; otherwise offer this fallback. Prepare loopback CDP and verified bridge ports, then verify login and the requested page operation." },
    } : {}),
  };
}

export function workbenchRestartNotice(processInfo, platform = process.platform) {
  if (platform !== "darwin" || processInfo?.browserId !== "Workbench") return null;
  return { ...workbenchIssue("macos-workbench-cdp-unavailable", { pid: processInfo.pid }),
    automaticSetupUnavailable: true,
    supportScope: "tested-automatic-relaunch-method",
  };
}
