# Server API Index

Navigation for the 54 cataloged management-center endpoints and the research artifacts that back them.
Coverage, depth, and the explicit not-tested list live in [COVERAGE.md](COVERAGE.md).
Keep this surface separate from the localhost API documentation in `../api/`.

## Authentication And Session

Read [TOKEN_SETUP.md](TOKEN_SETUP.md) for customer-facing storage, loading, cleanup, and rotation guidance.

Set the bearer token through the environment. Never place the token in source files, Markdown, command arguments, logs, or responses.

When authorized account credentials are available, `node scripts/yunlogin-auth.mjs login` calls `POST /v2/sso/login`, caches the returned token without printing it, and writes the normal user-level server session. Read [endpoints/sso-login.md](endpoints/sso-login.md) for the full field reference.

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
```

Optional environment variables:

| Variable | Purpose |
| --- | --- |
| `YUNLOGIN_SERVER_COOKIE` | Optional Cookie header for deployments that require it. |
| `YUNLOGIN_SERVER_LANG` | Optional `Lang` header. Default: `zh`. |
| `YUNLOGIN_SERVER_COMPANY_ID` | Optional default `companyid` injection for cataloged endpoints. |
| `YUNLOGIN_SERVER_USER_ID` | Optional default `userid` injection for cataloged endpoints. |
| `YUNLOGIN_TIMEOUT_MS` | Request timeout in milliseconds. Default: `30000`. |

The server origin is fixed by the catalog to `https://d126447d359e70c0.yunlogin.com` and cannot be changed at runtime. Use `scripts/yunlogin-server-api.mjs` with an endpoint ID from the catalog. The helper rejects unknown endpoints, requires a token for authenticated live requests, supports public endpoints marked `requires_auth: false`, supports `--dry-run`, and redacts common credential fields by default.

## Research Artifacts

- Start here - one-page research summary: [RESEARCH_SUMMARY.md](RESEARCH_SUMMARY.md)
- Machine-readable catalog: [endpoints.json](endpoints.json)
- Shared request and response rules: [WORKFLOW.md](WORKFLOW.md)
- Error contract: [ERRORS.md](ERRORS.md)
- Per-endpoint live results: [TEST_REPORT.md](TEST_REPORT.md)
- Per-parameter measured effects: [PARAMETER_MATRIX.md](PARAMETER_MATRIX.md)
- Live response field inventory: [FIELD_INVENTORY.md](FIELD_INVENTORY.md)
- Supplemental second-account field inventory (routes the reference session could not reach): [FIELD_INVENTORY_ACCOUNT_B.md](FIELD_INVENTORY_ACCOUNT_B.md)
- Cross-account verification (which unresolved routes a second account proved, and what stayed dead): [CROSS_ACCOUNT_VERIFICATION.md](CROSS_ACCOUNT_VERIFICATION.md)
- Per-route test status (exercised / dead / withheld / documented-only): [ROUTE_TEST_STATUS.md](ROUTE_TEST_STATUS.md)
- Boundary evidence for the last blocked routes, per account: [BOUNDARY_EVIDENCE.md](BOUNDARY_EVIDENCE.md)
- Observed value domains for enum-like fields: [FIELD_VALUES.md](FIELD_VALUES.md)
- Confirmed code meanings: [CODE_LEGENDS.md](CODE_LEGENDS.md)
- Browse by business family: [DOMAIN_INDEX.md](DOMAIN_INDEX.md)
- Request parameters and enum behaviour: [REQUEST_PARAMS.md](REQUEST_PARAMS.md)
- Behaviour drift between sweeps: [DRIFT.md](DRIFT.md)
- Machine-readable drift detail: [route-drift.json](route-drift.json)
- Write persistence round trips: [WRITE_EFFECTIVENESS.md](WRITE_EFFECTIVENESS.md)
- Hard vs soft deletes: [DELETE_SEMANTICS.md](DELETE_SEMANTICS.md)
- End-to-end audit: `node scripts/dev/run-api-audit.mjs`
- Separate server-side userapi surface: [USERAPI_SURFACE.md](USERAPI_SURFACE.md)
- Full extracted route catalog (507 routes): [ROUTE_CATALOG.md](ROUTE_CATALOG.md)
- Deployed-client drift and coverage gaps: [BUNDLE_DRIFT.md](BUNDLE_DRIFT.md)
- Routes the sweep refuses to probe, with reasons: [BLOCKLIST.md](BLOCKLIST.md)
- Parameter-validation messages captured by the sweep: [PARAM_ERRORS.md](PARAM_ERRORS.md)
- Response enum values that carry a confirmed meaning: [ENUM_MEANINGS.md](ENUM_MEANINGS.md)
- Full-surface response fields: [ROUTE_FIELDS.md](ROUTE_FIELDS.md)
- Write round trips and parameter discovery: [WRITE_ROUNDTRIPS.md](WRITE_ROUNDTRIPS.md)
- Write-route parameter/behaviour table: [WRITE_ROUTE_PARAMS.md](WRITE_ROUTE_PARAMS.md)
- Envelope / key-name / type traps: [RESPONSE_SHAPES.md](RESPONSE_SHAPES.md)
- Client call-site request-field evidence: [CLIENT_CALLSITES.md](CLIENT_CALLSITES.md)

## Find By Task

| I want to | Use |
| --- | --- |
| Check that my session works | `my-user-info` |
| Log in with a username and password | `sso-login` |
| See the environments on the account | `browser-list` |
| Read the preferences behind the environment list | `browser-settings` |
| Build a creation template | `fingerprint-uri` then `fingerprint-defaults` |
| Create one environment | `environment-create` |
| Duplicate an existing environment | `environment-clone` |
| Remove an environment | `environment-delete` |
| Reopen what I used recently | `latest-open-environments` |
| Read stored cookies for an environment | `browser-cookie` (sensitive) |
| Find saved account passwords | `account-list` (sensitive) |
| See which accounts are bound to an environment | `bound-account-detail` |
| See which account users belong to several environments at once | `account-users-get` |
| Pick a proxy | `proxy-cloud-list`, `proxy-self-list`, or `proxy-dynamic-list` |
| Inspect proxy devices and their usage | `find-devices`, `proxy-device-logs` |
| Organise environments | `server-group-list`, `proxy-tag-list` (definitions only; per-group member counts come from `browser-list`) |
| Add a new group or tag | `server-group-create`, `proxy-tag-upsert` |
| Add or remove people | `team-members`, `team-invite-code` |
| Understand who can do what | `team-roles`, `role-department-meal` |
| Audit activity | `team-login-logs`, `auth-log-permissions`, `auth-log-options` |
| Work with browser extensions | `plugin-list` |
| Check installed browser kernels | `version-core` |
| See automation plans | `rpa-plan-list` |
| Read notifications | `user-notices` |

## Flags

| Flag | Meaning |
| --- | --- |
| (blank) | Read-only. Safe to call with a valid session. |
| write | Creates, changes, or deletes data. Confirm with the user first and preflight with `--dry-run`. |
| sensitive | Returns credentials, cookies, account records, or identifiers. Handle the response as confidential. |
| unavailable | Not served by the tested origin. The document explains the alternatives. |

## Endpoints

### Environments

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `browser-list` | POST | `/v2/newbrowser/getconditionshops` | List and filter environments with pagination. |  | [doc](endpoints/browser-list.md) |
| `browser-settings` | POST | `/v2/newbrowser/getsettings` | Read team and personal browser preferences plus the search engine list. |  | [doc](endpoints/browser-settings.md) |
| `environment-create` | POST | `/v2/newbrowser/putalluri` | Create one or more environments from a fingerprint template. | write | [doc](endpoints/environment-create.md) |
| `environment-clone` | POST | `/v2/newbrowser/batchCloneShop` | Clone existing environments, copying fingerprint, proxy, group, tags, and remark. | write | [doc](endpoints/environment-clone.md) |
| `environment-delete` | POST | `/v2/newbrowser/putdeleteshop` | Delete environments by ID. | write | [doc](endpoints/environment-delete.md) |
| `latest-open-environments` | POST | `/v2/newbrowser/getLatestOpenAccountIdList` | Return the most recently opened environment IDs, newest first. |  | [doc](endpoints/latest-open-environments.md) |
| `fingerprint-uri` | POST | `/v2/newbrowser/getfingerprinturi` | Return the creation template skeleton for a system and kernel. |  | [doc](endpoints/fingerprint-uri.md) |
| `fingerprint-defaults` | POST | `/v2/newbrowser/getdefaultfingerlist` | Return kernel builds, UA versions, languages, zones, screen sizes, CPU and memory presets. |  | [doc](endpoints/fingerprint-defaults.md) |
| `platform-class-tree` | POST | `/v2/newbrowser/getalluri` | Return the platform classification tree used by the platform picker. |  | [doc](endpoints/platform-class-tree.md) |
| `platform-catalog` | GET | `/v2/newbrowser/getallurilist` | Return the flat platform and website catalogue. |  | [doc](endpoints/platform-catalog.md) |
| `custom-platform-list` | POST | `/v2/newbrowser/getalluserselfuri` | Return the account's own custom platforms. |  | [doc](endpoints/custom-platform-list.md) |
| `browser-cookie` | POST | `/v2/newbrowser/getCookie` | Return the stored cookie payload of one environment. | sensitive | [doc](endpoints/browser-cookie.md) |
| `auth-shop-brief-list` | POST | `/v2/newbrowser/getauthshopbriefinfolist` | Return brief environment rows used by authorization and sharing views. |  | [doc](endpoints/auth-shop-brief-list.md) |

### Accounts And Credentials

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `account-list` | POST | `/v2/newbrowser/getUserPasswordList` | List stored account and password records. | sensitive | [doc](endpoints/account-list.md) |
| `bound-account-detail` | POST | `/v2/newbrowser/getBindUserPassword` | Return the account records bound to an environment. | sensitive | [doc](endpoints/bound-account-detail.md) |
| `account-users-get` | POST | `/v2/newbrowser/account-users/get` | Return the account users bound to the supplied environments. | sensitive | [doc](endpoints/account-users-get.md) |
| `transfer-shop-list` | POST | `/v2/newbrowser/transferShopList` | List environments offered for transfer. |  | [doc](endpoints/transfer-shop-list.md) |

### Proxies

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `proxy-cloud-list` | GET | `/v2/proxy/device/vcnplist` | List cloud proxies. | sensitive | [doc](endpoints/proxy-cloud-list.md) |
| `proxy-self-list` | GET | `/v2/proxy/device/findDeviceProxyUserSelves` | List self-managed proxies. | sensitive | [doc](endpoints/proxy-self-list.md) |
| `proxy-dynamic-list` | GET | `/v2/proxy/device/findDeviceDynamicProxies` | List dynamic proxies. | sensitive | [doc](endpoints/proxy-dynamic-list.md) |
| `find-devices` | POST | `/v2/proxy/device/findDevices` | List proxy devices with their proxy bindings. | sensitive | [doc](endpoints/find-devices.md) |
| `proxy-device-logs` | GET | `/v2/proxy/device/findDeviceLogs` | Return proxy device audit logs. |  | [doc](endpoints/proxy-device-logs.md) |

### Groups And Tags

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `server-group-list` | POST | `/v2/newbrowser/getgroups` | List environment groups. |  | [doc](endpoints/server-group-list.md) |
| `server-group-create` | POST | `/v2/newbrowser/putnewgroup` | Create a group, or rename one when a group ID is supplied. | write | [doc](endpoints/server-group-create.md) |
| `server-group-delete` | POST | `/v2/newbrowser/deletegroups` | Delete groups. Environments inside are not deleted. | write | [doc](endpoints/server-group-delete.md) |
| `proxy-tag-list` | GET | `/v2/proxy/device/findTags` | List environment and proxy tags with their colours. |  | [doc](endpoints/proxy-tag-list.md) |
| `proxy-tag-upsert` | POST | `/v2/proxy/device/updateTag` | Create a tag, or rename and recolour an existing one. | write | [doc](endpoints/proxy-tag-upsert.md) |
| `proxy-tag-delete` | POST | `/v2/proxy/device/delTag` | Delete tags. The tag is removed from every environment that used it. | write | [doc](endpoints/proxy-tag-delete.md) |

### Team And Members

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `team-members` | POST | `/v2/team/getMembers` | List company members with roles, departments, and status. | sensitive | [doc](endpoints/team-members.md) |
| `team-roles` | POST | `/v2/team/roles` | List company roles and their permission identifiers. |  | [doc](endpoints/team-roles.md) |
| `team-departments` | POST | `/v2/team/getDepts` | Return the department tree with members. |  | [doc](endpoints/team-departments.md) |
| `team-invite-code` | POST | `/v2/team/invite/getCode` | Read or rotate the company invitation code. | sensitive | [doc](endpoints/team-invite-code.md) |
| `my-companies` | POST | `/v2/team/myCompanies` | List the companies the signed-in user belongs to. |  | [doc](endpoints/my-companies.md) |
| `member-profile` | POST | `/v2/team/member/myInfo` | Return the signed-in member profile. |  | [doc](endpoints/member-profile.md) |
| `current-company-info` | POST | `/v2/team/curCompanyInfo` | Return the profile of the company tied to the token. |  | [doc](endpoints/current-company-info.md) |
| `company-user-devices` | POST | `/v2/team/company/user/devices` | Return devices registered against company users. |  | [doc](endpoints/company-user-devices.md) |
| `team-login-logs` | POST | `/v2/team/loginlogs` | Return member login logs. |  | [doc](endpoints/team-login-logs.md) |
| `auth-log-permissions` | POST | `/v2/logs/auth/perms` | Return the permission list for authorization logs. |  | [doc](endpoints/auth-log-permissions.md) |
| `auth-log-options` | POST | `/v2/logs/auth/options` | Return the filter options for authorization logs. |  | [doc](endpoints/auth-log-options.md) |
| `role-department-meal` | POST | `/v2/team/company/getRoleDepartmentMeal` | Return the seat and plan assignment per role and department. |  | [doc](endpoints/role-department-meal.md) |

### Plugins

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `plugin-list` | GET | `/v2/plugin/getAddedAndGlobalplugin` | List installed and globally available browser plugins. |  | [doc](endpoints/plugin-list.md) |

### Automation And Notices

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `rpa-plan-list` | POST | `/v2/rpa/getRpaPlanManagementList` | Return the RPA automation plans for a user and environment set. |  | [doc](endpoints/rpa-plan-list.md) |
| `user-notices` | POST | `/v2/message/user-notice/my` | Return the in-app notification list and unread counter. |  | [doc](endpoints/user-notices.md) |

### Plans, Versions, And Settings

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `version-core` | POST | `/v2/team/version/getCore` | Return available browser core builds with download URL, size, and checksum. |  | [doc](endpoints/version-core.md) |
| `user-meal-settings` | GET | `/v2/cost/costmanagement/get_user_set_meal` | Return the account plan and seat settings. |  | [doc](endpoints/user-meal-settings.md) |
| `sms-settings` | POST | `/v2/message/sms-setting/get` | Return the SMS settings. |  | [doc](endpoints/sms-settings.md) |
| `settings-contact` | GET | `/v2/news/settings/info` | Return the contact configuration block. |  | [doc](endpoints/settings-contact.md) |
| `settings-qrcode` | GET | `/v2/news/settings/info` | Return the QR code configuration block. |  | [doc](endpoints/settings-qrcode.md) |

### Session And Authentication

| Endpoint ID | Method | Path | Purpose | Flag | Doc |
| --- | --- | --- | --- | --- | --- |
| `my-user-info` | POST | `/v2/sso/auth/myUserinfo` | Return the signed-in user profile; the standard token check. |  | [doc](endpoints/my-user-info.md) |
| `sso-login` | POST | `/v2/sso/login` | Authenticate with username/password and return a bearer token. | sensitive | [doc](endpoints/sso-login.md) |
| `token-refresh` | POST | `/v2/sso/auth/tokenRefresh` | Exchange the bearer token for a fresh one that carries an explicit expiry. |  | [doc](endpoints/token-refresh.md) |
| `authentication-check` | GET | `/v2/team/authentication/check` | Return the account-level authentication state. |  | [doc](endpoints/authentication-check.md) |
| `company-face-check` | GET | `/v2/team/authentication/companyFourElementsFaceCheck` | Return the company face verification state. |  | [doc](endpoints/company-face-check.md) |
| `team-authentication-get` | GET | `/v2/team/authentication/get` | Return the user/company real-name authentication detail. |  | [doc](endpoints/team-authentication-get.md) |

## Conventions

- Every route is a `POST` unless the table says `GET`.
- Send the bearer token from the cached session; see [../workflows/token-lifecycle.md](../workflows/token-lifecycle.md).
- Read the HTTP status and the business `code` separately. Most failures arrive as HTTP 200 with a non-200 code.
- The helper only accepts IDs from [endpoints.json](endpoints.json) and never sends an arbitrary URL.
- Write routes are lenient: several of them return `code: 200` even when they created nothing, so verify the result by re-reading the resource.









## Security Boundary

The server API uses an HTTPS management-center origin and a bearer token. The local API uses a loopback origin and does not use this token. Do not silently switch between the two surfaces.

Responses can contain cookies, proxy credentials, account credentials, and account identifiers. The helper redacts common sensitive fields by default. Use `--show-sensitive` only when the user explicitly requests raw values and the output destination is safe.
