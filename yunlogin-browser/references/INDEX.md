# API Navigation

Pick the surface first, then the route. This page is the map for the whole skill.

- **Local API** - `http://localhost:50213/api/v2/...` - [api/README.md](api/README.md)
- **Local client API** - `http://127.0.0.1:52446/api/v1/...` - [client-api/README.md](./client-api/README.md)
- **Server API** - `https://d126447d359e70c0.yunlogin.com/v2/...` - [server-api/INDEX.md](server-api/INDEX.md)

## Layout

```text
references/
  INDEX.md          this map
  api/              local desktop API, port 50213 (23 endpoint documents)
  client-api/       local client helper service, port 52446
  server-api/       management center: catalog, indexes, error contract, endpoint documents
  workflows/        task guides: environments, environment inputs, tokens, CDP, Playwright CLI
  testing.md        what was verified and how
```

## Rule Of Thumb

| Task | Surface | Why |
| --- | --- | --- |
| Read or search account data: environments, proxies, accounts, team, plans, notices | **Server API** | The management center owns the data. Prefer the server route for every query and for every create, clone, or delete. |
| Launch, stop, or inspect a running environment browser | **Local API** | Only the desktop service can start a browser. The server API has no launch route. |
| Read machine facts such as GPU adapters, or clear local environment data | **Local client API** | The helper service on port 52446 serves local machine state. |
| Inject or clear local environment Cookies | **Local API** | Cookies are written into the local profile before launch. |
| Drive the launched browser | **CDP** | Connect to `data.ws.puppeteer` from the local launch response. |

The split matters: use the server API to decide **what** to operate, and the local API to **start and control** it.

## Find By Task

| I want to | Surface | Use |
| --- | --- | --- |
| Check that my server session works | Server | `my-user-info` |
| See or filter environments | Server | `browser-list` |
| Read the preferences behind the environment list | Server | `browser-settings` |
| Build a creation template | Server | `fingerprint-uri` then `fingerprint-defaults` |
| Resolve every input for a create or modify | Server | [environment-inputs.md](./workflows/environment-inputs.md) |
| Create, clone, or delete an environment | Server | `environment-create`, `environment-clone`, `environment-delete` |
| Read stored Cookies of an environment | Server | `browser-cookie` |
| See which account users belong to environments | Server | `account-users-get` |
| Pick or inspect a proxy | Server | `proxy-cloud-list`, `proxy-self-list`, `proxy-dynamic-list`, `find-devices` |
| Organise environments into groups and tags | Server | `server-group-list`, `proxy-tag-list` and their write routes |
| Manage people, roles, and invitations | Server | `team-members`, `team-roles`, `team-invite-code` |
| Audit activity | Server | `team-login-logs`, `auth-log-permissions`, `auth-log-options` |
| Check browser kernel builds | Server | `version-core` |
| Read notifications or automation plans | Server | `user-notices`, `rpa-plan-list` |
| **Start an environment** | **Local** | `POST /api/v2/browser/start` |
| Check whether an environment is running | Local | `GET /api/v2/browser/status` |
| Stop an environment | Local | `GET /api/v2/browser/stop` |
| Inject or clear environment Cookies | Local | `cookie/upsert`, `cookie/clear` |
| Read GPU adapters | Local client | `POST /api/v1/client/gpu_info` |
| Clear an environment's local data | Local client | `POST /api/v1/client/clean_env` |
| Capture the local API token | Local plus CDP | `scripts/yunlogin-cdp.mjs capture-local-token` |
| Automate the launched browser | CDP | [cdp-automation.md](./workflows/cdp-automation.md) |

## Local API

23 documented loopback routes on port 50213. Read the full index in [api/README.md](api/README.md).

| Document | Endpoint |
| --- | --- |
| [clearCookie](api/clearCookie.md) | `POST /api/v2/userapi/cookie/clear` |
| [updateCookies](api/updateCookies.md) | `POST /api/v2/userapi/cookie/upsert` |
| [envBindGroupPlugin](api/envBindGroupPlugin.md) | `POST /api/v2/userapi/plugin/bindGroupPlugin` |
| [getGroupPlugin](api/getGroupPlugin.md) | `POST /api/v2/userapi/plugin/groupPluginList` |
| [selectOfficialProxyList](api/selectOfficialProxyList.md) | `POST /api/v2/userapi/officialproxy/list` |
| [updateSelfProxy](api/updateSelfProxy.md) | `POST /api/v2/userapi/selfproxy/update` |
| [selectSelfProxyList](api/selectSelfProxyList.md) | `POST /api/v2/userapi/selfproxy/list` |
| [deleteSelfProxy](api/deleteSelfProxy.md) | `POST /api/v2/userapi/selfproxy/delete` |
| [createSelfProxy](api/createSelfProxy.md) | `POST /api/v2/userapi/selfproxy/create` |
| [getAllUrlList](api/getAllUrlList.md) | `POST /api/v2/userapi/getAllUrlList/list` |
| [updateAccountGroup](api/updateAccountGroup.md) | `POST /api/v2/userapi/user/regroup` |
| [deleteCreatedBrowserPrint](api/deleteCreatedBrowserPrint.md) | `POST /api/v2/userapi/user/delete` |
| [selectAllBrowserSerial](api/selectAllBrowserSerial.md) | `POST /api/v2/userapi/user/shopseriallist` |
| [selectBrowserDetail](api/selectBrowserDetail.md) | `POST /api/v2/userapi/user/shopdetaillist` |
| [updateBrowserPrint](api/updateBrowserPrint.md) | `POST /api/v2/userapi/user/update` |
| [createBrowserPrint](api/createBrowserPrint.md) | `POST /api/v2/userapi/user/create` |
| [selectGroup](api/selectGroup.md) | `POST /api/v2/userapi/group/list` |
| [updateGroupName](api/updateGroupName.md) | `POST /api/v2/userapi/group/update` |
| [createGroup](api/createGroup.md) | `POST /api/v2/userapi/group/create` |
| [checkStartStatus](api/checkStartStatus.md) | `GET /api/v2/browser/status` |
| [closeBrowser](api/closeBrowser.md) | `GET /api/v2/browser/stop` |
| [launchBrowser](api/launchBrowser.md) | `GET /api/v2/browser/start` |
| [apiStatus](api/apiStatus.md) | `GET /status` |

Key routes for launching: `POST /api/v2/browser/start` returns the CDP URL, `GET /api/v2/browser/status` reports `Active` or `Inactive`, and `GET /api/v2/browser/stop` closes the browser.

## Local Client API

3 routes on port 52446. Full detail in [client-api/README.md](./client-api/README.md).

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/v1/client/gpu_info` | Returns the local GPU adapters. |
| POST | `/api/v1/client/clean_env` | Clears the local data of one environment. |
| GET | `/api/v1/settings/get_config` | Returns client and cloud configuration, including credentials. Treat as highly sensitive. |

## Server API

52 cataloged management-center routes: 7 create or change data, 10 return credentials or account metadata, and 3 are not served by the tested origin.

| Flag | Meaning |
| --- | --- |
| (blank) | Read-only. |
| write | Creates, changes, or deletes data. Confirm with the user and preflight with `--dry-run`. |
| sensitive | Returns credentials, Cookies, or account records. |
| unavailable | Not served by the tested origin; see the endpoint document. |

### Environments

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `browser-list` | POST | `/v2/newbrowser/getconditionshops` | List and filter environments with pagination. |  | [doc](server-api/endpoints/browser-list.md) |
| `browser-settings` | POST | `/v2/newbrowser/getsettings` | Read team and personal browser preferences plus the search engine list. |  | [doc](server-api/endpoints/browser-settings.md) |
| `environment-create` | POST | `/v2/newbrowser/putalluri` | Create one or more environments from a fingerprint template. | write | [doc](server-api/endpoints/environment-create.md) |
| `environment-clone` | POST | `/v2/newbrowser/batchCloneShop` | Clone existing environments, copying fingerprint, proxy, group, tags, and remark. | write | [doc](server-api/endpoints/environment-clone.md) |
| `environment-delete` | POST | `/v2/newbrowser/putdeleteshop` | Delete environments by ID. | write | [doc](server-api/endpoints/environment-delete.md) |
| `latest-open-environments` | POST | `/v2/newbrowser/getLatestOpenAccountIdList` | Return the most recently opened environment IDs, newest first. |  | [doc](server-api/endpoints/latest-open-environments.md) |
| `fingerprint-uri` | POST | `/v2/newbrowser/getfingerprinturi` | Return the creation template skeleton for a system and kernel. |  | [doc](server-api/endpoints/fingerprint-uri.md) |
| `fingerprint-defaults` | POST | `/v2/newbrowser/getdefaultfingerlist` | Return kernel builds, UA versions, languages, zones, screen sizes, CPU and memory presets. |  | [doc](server-api/endpoints/fingerprint-defaults.md) |
| `platform-class-tree` | POST | `/v2/newbrowser/getalluri` | Return the platform classification tree used by the platform picker. |  | [doc](server-api/endpoints/platform-class-tree.md) |
| `platform-catalog` | GET | `/v2/newbrowser/getallurilist` | Return the flat platform and website catalogue. |  | [doc](server-api/endpoints/platform-catalog.md) |
| `custom-platform-list` | POST | `/v2/newbrowser/getalluserselfuri` | Return the account's own custom platforms. |  | [doc](server-api/endpoints/custom-platform-list.md) |
| `browser-cookie` | POST | `/v2/newbrowser/getCookie` | Return the stored cookie payload of one environment. | sensitive | [doc](server-api/endpoints/browser-cookie.md) |
| `auth-shop-brief-list` | POST | `/v2/newbrowser/getauthshopbriefinfolist` | Return brief environment rows used by authorization and sharing views. |  | [doc](server-api/endpoints/auth-shop-brief-list.md) |

### Accounts And Credentials

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `account-list` | POST | `/v2/newbrowser/getUserPasswordList` | List stored account and password records. | sensitive | [doc](server-api/endpoints/account-list.md) |
| `bound-account-detail` | POST | `/v2/newbrowser/getBindUserPassword` | Return the account records bound to an environment. | sensitive | [doc](server-api/endpoints/bound-account-detail.md) |
| `account-users-get` | POST | `/v2/newbrowser/account-users/get` | Return the account users bound to the supplied environments. | sensitive | [doc](server-api/endpoints/account-users-get.md) |
| `transfer-shop-list` | POST | `/v2/newbrowser/transferShopList` | List environments offered for transfer. |  | [doc](server-api/endpoints/transfer-shop-list.md) |

### Proxies

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `proxy-cloud-list` | GET | `/v2/proxy/device/vcnplist` | List cloud proxies. | sensitive | [doc](server-api/endpoints/proxy-cloud-list.md) |
| `proxy-self-list` | GET | `/v2/proxy/device/findDeviceProxyUserSelves` | List self-managed proxies. | sensitive | [doc](server-api/endpoints/proxy-self-list.md) |
| `proxy-dynamic-list` | GET | `/v2/proxy/device/findDeviceDynamicProxies` | List dynamic proxies. | sensitive | [doc](server-api/endpoints/proxy-dynamic-list.md) |
| `find-devices` | POST | `/v2/proxy/device/findDevices` | List proxy devices with their proxy bindings. | sensitive | [doc](server-api/endpoints/find-devices.md) |
| `proxy-device-logs` | GET | `/v2/proxy/device/findDeviceLogs` | Return proxy device audit logs. |  | [doc](server-api/endpoints/proxy-device-logs.md) |

### Groups And Tags

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `server-group-list` | POST | `/v2/newbrowser/getgroups` | List environment groups. |  | [doc](server-api/endpoints/server-group-list.md) |
| `server-group-create` | POST | `/v2/newbrowser/putnewgroup` | Create a group, or rename one when a group ID is supplied. | write | [doc](server-api/endpoints/server-group-create.md) |
| `server-group-delete` | POST | `/v2/newbrowser/deletegroups` | Delete groups. Environments inside are not deleted. | write | [doc](server-api/endpoints/server-group-delete.md) |
| `proxy-tag-list` | GET | `/v2/proxy/device/findTags` | List environment and proxy tags with their colours. |  | [doc](server-api/endpoints/proxy-tag-list.md) |
| `proxy-tag-upsert` | POST | `/v2/proxy/device/updateTag` | Create a tag, or rename and recolour an existing one. | write | [doc](server-api/endpoints/proxy-tag-upsert.md) |
| `proxy-tag-delete` | POST | `/v2/proxy/device/delTag` | Delete tags. The tag is removed from every environment that used it. | write | [doc](server-api/endpoints/proxy-tag-delete.md) |

### Team And Members

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `team-members` | POST | `/v2/team/getMembers` | List company members with roles, departments, and status. | sensitive | [doc](server-api/endpoints/team-members.md) |
| `team-roles` | POST | `/v2/team/roles` | List company roles and their permission identifiers. |  | [doc](server-api/endpoints/team-roles.md) |
| `team-departments` | POST | `/v2/team/getDepts` | Return the department tree with members. |  | [doc](server-api/endpoints/team-departments.md) |
| `team-invite-code` | POST | `/v2/team/invite/getCode` | Read or rotate the company invitation code. | sensitive | [doc](server-api/endpoints/team-invite-code.md) |
| `my-companies` | POST | `/v2/team/myCompanies` | List the companies the signed-in user belongs to. |  | [doc](server-api/endpoints/my-companies.md) |
| `member-profile` | POST | `/v2/team/member/myInfo` | Return the signed-in member profile. |  | [doc](server-api/endpoints/member-profile.md) |
| `current-company-info` | GET | `/v2/team/curCompanyInfo` | Company profile route; not served by the tested origin. | unavailable | [doc](server-api/endpoints/current-company-info.md) |
| `company-user-devices` | GET | `/v2/team/company/user/devices` | Company device list route; not served by the tested origin. | unavailable | [doc](server-api/endpoints/company-user-devices.md) |
| `team-login-logs` | POST | `/v2/team/loginlogs` | Return member login logs. |  | [doc](server-api/endpoints/team-login-logs.md) |
| `auth-log-permissions` | POST | `/v2/logs/auth/perms` | Return the permission list for authorization logs. |  | [doc](server-api/endpoints/auth-log-permissions.md) |
| `auth-log-options` | POST | `/v2/logs/auth/options` | Return the filter options for authorization logs. |  | [doc](server-api/endpoints/auth-log-options.md) |
| `role-department-meal` | POST | `/v2/team/company/getRoleDepartmentMeal` | Return the seat and plan assignment per role and department. |  | [doc](server-api/endpoints/role-department-meal.md) |

### Plugins

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `plugin-list` | GET | `/v2/plugin/getAddedAndGlobalplugin` | List installed and globally available browser plugins. |  | [doc](server-api/endpoints/plugin-list.md) |

### Automation And Notices

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `rpa-plan-list` | POST | `/v2/rpa/getRpaPlanManagementList` | Return the RPA automation plans for a user and environment set. |  | [doc](server-api/endpoints/rpa-plan-list.md) |
| `user-notices` | POST | `/v2/message/user-notice/my` | Return the in-app notification list and unread counter. |  | [doc](server-api/endpoints/user-notices.md) |

### Plans, Versions, And Settings

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `version-core` | POST | `/v2/team/version/getCore` | Return available browser core builds with download URL, size, and checksum. |  | [doc](server-api/endpoints/version-core.md) |
| `user-meal-settings` | GET | `/v2/cost/costmanagement/get_user_set_meal` | Return the account plan and seat settings. |  | [doc](server-api/endpoints/user-meal-settings.md) |
| `sms-settings` | POST | `/v2/message/sms-setting/get` | Return the SMS settings. |  | [doc](server-api/endpoints/sms-settings.md) |
| `settings-contact` | GET | `/v2/news/settings/info` | Return the contact configuration block. |  | [doc](server-api/endpoints/settings-contact.md) |
| `settings-qrcode` | GET | `/v2/news/settings/info` | Return the QR code configuration block. |  | [doc](server-api/endpoints/settings-qrcode.md) |

### Session And Authentication

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `my-user-info` | POST | `/v2/sso/auth/myUserinfo` | Return the signed-in user profile; the standard token check. |  | [doc](server-api/endpoints/my-user-info.md) |
| `authentication-check` | GET | `/v2/team/authentication/check` | Return the account-level authentication state. |  | [doc](server-api/endpoints/authentication-check.md) |
| `company-face-check` | GET | `/v2/team/authentication/companyFourElementsFaceCheck` | Return the company face verification state. |  | [doc](server-api/endpoints/company-face-check.md) |
| `team-authentication-get` | POST | `/v2/team/authentication/get` | Company authentication detail route; not served by the tested origin. | unavailable | [doc](server-api/endpoints/team-authentication-get.md) |

The same tables, with the task-based navigation, live in [server-api/INDEX.md](server-api/INDEX.md).

## Conventions

- Read the endpoint document before the first live call, and preflight write routes with `--dry-run`.
- Read the HTTP status and the business `code` separately; most server failures arrive as HTTP 200 with a non-200 code. See [server-api/ERRORS.md](server-api/ERRORS.md).
- Confirm mutations with the user, and verify a write by re-reading the resource: several create routes report success without creating anything.
- Keep credentials out of files, logs, and responses. See [token-lifecycle.md](./workflows/token-lifecycle.md).
