# Windows Client Ports: Discovery And Evidence

## Run the JavaScript helper

From the skill directory, with Node.js available:

```powershell
node scripts/yunlogin-ports.mjs
```

It is a Node.js ES module, with no npm dependencies and no separate PowerShell file to run. It internally queries Windows CIM and TCP listeners using built-in PowerShell. Every invocation takes a fresh snapshot of `YunLogin.exe` PIDs and their TCP listeners. It probes only loopback addresses (wildcard listeners are accessed through loopback), never every port on the machine. Permission/query failures produce an error rather than a false 'client stopped' result.

The JSON output includes:

| Field | Meaning |
| --- | --- |
| `processes` | Current PID and executable path; no command lines or login data. |
| `listeners` | Owner PID, bind address, port, verified purpose, and read-only probe status. |
| `clientApiOrigins` | GPU-route verified HTTP origins for client settings and machine APIs. |
| `localApiOrigins` | Status-route verified HTTP origins for the local environment API. |
| `websocketOrigins` | RFC 6455 opening handshake verified origins. No application messages are sent. |
| `publishedClientPort` | Decimal port read from the client's 64-byte `shm_fetch_proxy_info` mapping; null when absent/unreadable/malformed. This is only a hint. |
| `publishedClientPortVerified` | The published port also belongs to a current YunLogin listener and passes the GPU probe. Use verified `clientApiOrigins` for requests. |
| `running` | A YunLogin process was found. This is distinct from service readiness. |
| `complete` | All discovered listeners were classified by current checks; false preserves unknown listeners. |

An empty origin array means that surface was not verified. More than one means the caller must select the intended process/installation; never take the first silently. The snapshot can change if the process exits/restarts, so rediscover after connection failure. No cache, historical number, adjacent-port arithmetic, or fixed port range determines the current result.

For programmatic use:

```javascript
import { discoverPorts } from "./scripts/yunlogin-ports.mjs";
const ports = await discoverPorts();
if (ports.clientApiOrigins.length !== 1) {
  throw new Error("No unique verified client API; inspect processes/listeners.");
}
const configUrl = new URL("/api/v1/settings/get_config", ports.clientApiOrigins[0]);
// Prefer yunlogin-client.mjs config to avoid exposing the raw sensitive response.
```

The standalone local API CLI still has a historical 50213 default. If its verified port differs, set `YUNLOGIN_LOCAL_BASE_URL` to the selected `localApiOrigins` value before invoking that CLI. The client-origin resolver is integrated with fresh discovery and does not return a stale fallback when no GPU endpoint verifies.

## Runtime observation: 2026-10-19

Selected local artifact: YunLogin.exe product/file version 4.0.3.7, SHA-256 `12d1577fb02952ece2c7918ffd4be6fe7e3f838c185951af8f6d36785a058844`. Core DLL SHA-256 `9f74b02c570d57da17e38cd89ab72aa28e0119403a82643b60d93233a6682f70`. Version strings identify this artifact, not the newest released product.

| Observed port | Runtime evidence | Interpretation |
| --- | --- | --- |
| 50213 | YunLogin-owned loopback listener; `GET /status` HTTP 200, `code: 0`; GPU route 404. | Verified local API surface. |
| 54823 | YunLogin-owned loopback listener; GPU route HTTP 200, `code: 0`, adapter array; `GET /api/v1/settings/get_config` HTTP 200, `code: 0`. | Verified local client/App HTTP surface. The supplied curl port happens to match this run. |
| 54822 | YunLogin-owned loopback listener; HTTP 426 on ordinary requests; WebSocket opening handshake HTTP 101 with valid accept hash. | Verified WebSocket transport. This is not a CDP claim or an HTTP API origin. |
| 50313 | YunLogin-owned loopback listener; status and GPU routes return HTTP 404. Static CookieManager startup uses 50313 as its first candidate. | Consistent with the independent cookie service; the script retains `unknown` because no cookie mutation was executed to identify this runtime listener. |

Do not assume this ordering or these values after restart. Historical 52446/64992 observations elsewhere in the skill are examples only. No real client restart was performed for this investigation; changed-port behavior is also checked with independent offline snapshots.

## Static evidence and limits

REA `open_binary` identified both native PE x86-64 artifacts. REA Ghidra searched the launcher (`ev_d66d793da79df55ec10ffcb762657d744146c51fc43c305aa84d440d6faf9bce`); it contains host/core loading strings rather than enough service logic to explain the listeners. The Go build-information query (`ev_e7ccb9e2cd3a8600133da9e128b2f868369f0e6c37d0714d94c2cde4f543b2a4`) found no recognized metadata; this does not prove a language identity.

Supplemental offline byte-string inspection of the core DLL (file offsets, not virtual addresses) found:

- `0x69d930`: workbench URL format with distinct `wsPort`, `rpaPort`, `ipifyPort`, `cookiefyPort`, `appPort` parameters.
- `0x710a78`, `0x710be0`, `0x710c50`: AppHttpServer bound/ready logging and publishing the selected port to shared memory.
- `0x7133a8`: `/api/v1/settings/get_config`, near the settings HTTP handler route strings.
- `0x6bf670`: `/api/v2/cookie/update` near `CookieManager` and `m_port` strings. This suggests a separate cookie service but does not alone map it to 50313.
- `0x727dc8` onward: `ws_server.cpp` diagnostics and browser launch/auth/heartbeat message handlers. These describe an application WebSocket, not a browser debugging endpoint.
- UTF-16 strings at `0x67b170` and related offsets: `Software\FbSoftware\YunLogin`. Read-only registry inspection confirmed `InstallDir` for this installation. The lifecycle helper uses this source along with other discovery paths.

These string facts are ordinary static observations, not decompilation or runtime proof of the corresponding code paths. The TCP/protocol results above are separate live observations. A complete inventory of every optional browser, proxy, IP query subprocess, UDP socket, or future-version service is not claimed; the helper deliberately reports the selected desktop process's current TCP listeners.

## Instruction-level confirmation

REA/Ghidra 12.1.4 completed launcher analysis, but core-DLL startup exceeded the MCP 300-second call window; a CLI retry also returned `provider_timeout` (330000 ms). No successful core decompilation is claimed. The following core facts were confirmed with the already-installed LLVM 21.1.0 `llvm-objdump`, plus read-only runtime checks. These are supplemental disassembly evidence, not invented REA Evidence IDs.

All addresses below are static virtual addresses for the core SHA-256 above, ImageBase `0x180000000`; they are not ASLR runtime addresses. Generic objdump `<StopAll+offset>` labels are not recovered function names.

| Question | Static evidence | Conclusion |
| --- | --- | --- |
| Why does the client HTTP port change? | AppHttpServer Start `0x18041d2b0` references `127.0.0.1` at `0x18041d36f`, calls wrapper `0x180424a20`; wrapper `0x180424a38` zeros `r8d` (port), then calls `0x180310ae0`. Port-zero path at `0x180310bc6` calls imported `getsockname` at `0x180310c06`, then `ntohs` at `0x180310c2d`. | Port 0 is passed into socket creation and the assigned port is read back. Do not assume a fixed number, sequence, or WebSocket-port-plus-one. The bottom-most bind instruction was not expanded. |
| Where is the selected client port published? | Start `0x18041db04` reads the port WORD and calls `0x18041b030`. This function creates `shm_fetch_proxy_info` using `CreateFileMappingA` at `0x18041b18c`, size 64, maps at `0x18041b24c`, zeroes the buffer and copies the decimal port string from `0x18041b2f0`. | Read at most 64 bytes with read-only rights, parse a NUL-terminated decimal 1..65535, then verify ownership and protocol. The script did this live: 54823 matched the verified client API. |
| Is 50313 always the cookie port? | CookieManager Start `0x18030cd0c` loads `0xc489` (50313), stores at `this+0x18`, and calls `0x180462bb0`. That routine checks TCP table occupancy via `0x180462a00` (`GetExtendedTcpTable`, `ntohs`); `0x180462bd5` increments a conflicting candidate and writes it back at `0x180462bdc`, up to 65535. | 50313 is a starting candidate, not a guarantee. This build searches sequentially rather than choosing a random cookie port. |
| Does the cookie service share the client-config route? | Cookie constructor `0x180300a00..0x180300c84` registers `/api/v2/cookie/update` at `0x180300c33..0x180300c60` on `this+0x20`. Start packages that server and `this+0x18` into the listener closure at `0x18030ce06..0x18030ce2a`. Config route is in the separate AppHttpServer handler region. | Keep the cookie listener separate from client config and the local automation API. The final listener template chain was not expanded and the cookie route was not invoked. |

Example reproduction against the same binary (substitute the actual installation path; no target execution):

```powershell
& 'C:\Program Files\LLVM\bin\llvm-objdump.exe' -d --start-address=0x180424a20 --stop-address=0x180424a4f 'C:\install\version\YunLogin_Core.dll'
& 'C:\Program Files\LLVM\bin\llvm-objdump.exe' -d --start-address=0x180310ae0 --stop-address=0x180310c80 'C:\install\version\YunLogin_Core.dll'
& 'C:\Program Files\LLVM\bin\llvm-objdump.exe' -d --start-address=0x18041b030 --stop-address=0x18041b39a 'C:\install\version\YunLogin_Core.dll'
& 'C:\Program Files\LLVM\bin\llvm-objdump.exe' -d --start-address=0x18030cd00 --stop-address=0x18030ce70 'C:\install\version\YunLogin_Core.dll'
& 'C:\Program Files\LLVM\bin\llvm-objdump.exe' -d --start-address=0x180462a00 --stop-address=0x180462bfb 'C:\install\version\YunLogin_Core.dll'
```

The WebSocket allocation algorithm and local API candidate selection were not traced to initialization instructions. Their runtime endpoints are verified by the helper without relying on such an algorithm. Cookie-port identity remains a static attribution plus runtime consistency check; `complete: false` explicitly preserves that boundary.

Environment browser CDP endpoints belong to their browser process and are obtained from the launch result (`data.ws.puppeteer`/debugging port). Never use the desktop WebSocket as a CDP endpoint. The 443 management-center HTTPS service is remote and is outside local port discovery.
