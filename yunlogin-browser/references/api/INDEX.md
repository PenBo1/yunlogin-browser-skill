# YunLogin Local API Document Index

This directory contains 23 localhost API documents extracted from the supplied YunLogin documentation modules.
These endpoints target the desktop loopback service.

For CDP automation, browser launch sessions, and append_cmd guidance, read [CDP Automation](../workflows/cdp-automation.md).

| Document | Endpoint |
| --- | --- |
| [clearCookie](./clearCookie.md) | `POST /api/v2/userapi/cookie/clear` |
| [updateCookies](./updateCookies.md) | `POST /api/v2/userapi/cookie/upsert` |
| [envBindGroupPlugin](./envBindGroupPlugin.md) | `POST /api/v2/userapi/plugin/bindGroupPlugin` |
| [getGroupPlugin](./getGroupPlugin.md) | `POST /api/v2/userapi/plugin/groupPluginList` |
| [selectOfficialProxyList](./selectOfficialProxyList.md) | `POST /api/v2/userapi/officialproxy/list` |
| [updateSelfProxy](./updateSelfProxy.md) | `POST /api/v2/userapi/selfproxy/update` |
| [selectSelfProxyList](./selectSelfProxyList.md) | `POST /api/v2/userapi/selfproxy/list` |
| [deleteSelfProxy](./deleteSelfProxy.md) | `POST /api/v2/userapi/selfproxy/delete` |
| [createSelfProxy](./createSelfProxy.md) | `POST /api/v2/userapi/selfproxy/create` |
| [getAllUrlList](./getAllUrlList.md) | `POST /api/v2/userapi/getAllUrlList/list` |
| [updateAccountGroup](./updateAccountGroup.md) | `POST /api/v2/userapi/user/regroup` |
| [deleteCreatedBrowserPrint](./deleteCreatedBrowserPrint.md) | `POST /api/v2/userapi/user/delete` |
| [selectAllBrowserSerial](./selectAllBrowserSerial.md) | `POST /api/v2/userapi/user/shopseriallist` |
| [selectBrowserDetail](./selectBrowserDetail.md) | `POST /api/v2/userapi/user/shopdetaillist` |
| [updateBrowserPrint](./updateBrowserPrint.md) | `POST /api/v2/userapi/user/update` |
| [createBrowserPrint](./createBrowserPrint.md) | `POST /api/v2/userapi/user/create` |
| [selectGroup](./selectGroup.md) | `POST /api/v2/userapi/group/list` |
| [updateGroupName](./updateGroupName.md) | `POST /api/v2/userapi/group/update` |
| [createGroup](./createGroup.md) | `POST /api/v2/userapi/group/create` |
| [checkStartStatus](./checkStartStatus.md) | `GET /api/v2/browser/status` |
| [closeBrowser](./closeBrowser.md) | `GET /api/v2/browser/stop` |
| [launchBrowser](./launchBrowser.md) | `GET /api/v2/browser/start` |
| [apiStatus](./apiStatus.md) | `GET /status` |

## Provenance Of These Documents

Each endpoint page carries a `Source:` URL pointing at the desktop build that served it. Those URLs are
from the `1788343711349` build and **no longer serve JavaScript**: every `/js/...` path the origin does not
have answers HTTP 200 with the 2053-byte single-page-app shell. A recorded bundle that is gone therefore
looks like a successful fetch unless the body is checked.

What this means in practice:

- The parameter and response tables on these pages remain the recorded authority for the local desktop
  mirror, taken from that build.
- The `Source:` URLs can no longer be used to re-verify them. Re-derive a page from the desktop client in
  use, or confirm the route live, instead of trusting the URL.
- The server-side mirror of these routes was re-tested live on 2026-10-10; see
  [../server-api/USERAPI_SURFACE.md](../server-api/USERAPI_SURFACE.md) for the round trips and the
  corrections that live testing produced.
