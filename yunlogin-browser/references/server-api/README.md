# YunLogin Server API

This directory documents the tested YunLogin management-center server API surface. Keep it separate from the localhost API documentation in `../api/`.

## Authentication

Read [TOKEN_SETUP.md](TOKEN_SETUP.md) for customer-facing storage, loading, cleanup, and rotation guidance.

Set the bearer token through the environment. Never place the token in source files, Markdown, command arguments, logs, or responses.

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

The server origin is fixed by the catalog to `https://d126447d359e70c0.yunlogin.com` and cannot be changed at runtime. Use `scripts/yunlogin-server-api.mjs` with an endpoint ID from the catalog. The helper rejects unknown endpoints, requires a token for live requests, supports `--dry-run`, and redacts common credential fields by default.

## Tested Endpoints

All 53 endpoints were tested. Fifty returned HTTP 200 with business `code: 200`; three returned HTTP 404 on the tested origin and are marked unavailable in their endpoint documents. The original sweep ran on 2026-09-24 and `token-refresh` was added on 2026-09-27 from a live call.

| Endpoint ID | Method | Path | Documentation |
| --- | --- | --- | --- |
| `browser-list` | POST | `/v2/newbrowser/getconditionshops` | [browser-list.md](endpoints/browser-list.md) |
| `browser-settings` | POST | `/v2/newbrowser/getsettings` | [browser-settings.md](endpoints/browser-settings.md) |
| `browser-cookie` | POST | `/v2/newbrowser/getCookie` | [browser-cookie.md](endpoints/browser-cookie.md) |
| `proxy-cloud-list` | GET | `/v2/proxy/device/vcnplist` | [proxy-cloud-list.md](endpoints/proxy-cloud-list.md) |
| `proxy-self-list` | GET | `/v2/proxy/device/findDeviceProxyUserSelves` | [proxy-self-list.md](endpoints/proxy-self-list.md) |
| `proxy-dynamic-list` | GET | `/v2/proxy/device/findDeviceDynamicProxies` | [proxy-dynamic-list.md](endpoints/proxy-dynamic-list.md) |
| `account-list` | POST | `/v2/newbrowser/getUserPasswordList` | [account-list.md](endpoints/account-list.md) |
| `find-devices` | POST | `/v2/proxy/device/findDevices` | [find-devices.md](endpoints/find-devices.md) |
| `fingerprint-uri` | POST | `/v2/newbrowser/getfingerprinturi` | [fingerprint-uri.md](endpoints/fingerprint-uri.md) |
| `environment-create` | POST | `/v2/newbrowser/putalluri` | [environment-create.md](endpoints/environment-create.md) |
| `user-notices` | POST | `/v2/message/user-notice/my` | [user-notices.md](endpoints/user-notices.md) |
| `environment-clone` | POST | `/v2/newbrowser/batchCloneShop` | [environment-clone.md](endpoints/environment-clone.md) |
| `rpa-plan-list` | POST | `/v2/rpa/getRpaPlanManagementList` | [rpa-plan-list.md](endpoints/rpa-plan-list.md) |
| `latest-open-environments` | POST | `/v2/newbrowser/getLatestOpenAccountIdList` | [latest-open-environments.md](endpoints/latest-open-environments.md) |
| `fingerprint-defaults` | POST | `/v2/newbrowser/getdefaultfingerlist` | [fingerprint-defaults.md](endpoints/fingerprint-defaults.md) |
| `platform-class-tree` | POST | `/v2/newbrowser/getalluri` | [platform-class-tree.md](endpoints/platform-class-tree.md) |
| `platform-catalog` | GET | `/v2/newbrowser/getallurilist` | [platform-catalog.md](endpoints/platform-catalog.md) |
| `custom-platform-list` | POST | `/v2/newbrowser/getalluserselfuri` | [custom-platform-list.md](endpoints/custom-platform-list.md) |
| `plugin-list` | GET | `/v2/plugin/getAddedAndGlobalplugin` | [plugin-list.md](endpoints/plugin-list.md) |
| `auth-shop-brief-list` | POST | `/v2/newbrowser/getauthshopbriefinfolist` | [auth-shop-brief-list.md](endpoints/auth-shop-brief-list.md) |
| `bound-account-detail` | POST | `/v2/newbrowser/getBindUserPassword` | [bound-account-detail.md](endpoints/bound-account-detail.md) |
| `account-users-get` | POST | `/v2/newbrowser/account-users/get` | [account-users-get.md](endpoints/account-users-get.md) |
| `server-group-list` | POST | `/v2/newbrowser/getgroups` | [server-group-list.md](endpoints/server-group-list.md) |
| `proxy-tag-list` | GET | `/v2/proxy/device/findTags` | [proxy-tag-list.md](endpoints/proxy-tag-list.md) |
| `proxy-tag-upsert` | POST | `/v2/proxy/device/updateTag` | [proxy-tag-upsert.md](endpoints/proxy-tag-upsert.md) |
| `proxy-tag-delete` | POST | `/v2/proxy/device/delTag` | [proxy-tag-delete.md](endpoints/proxy-tag-delete.md) |
| `server-group-create` | POST | `/v2/newbrowser/putnewgroup` | [server-group-create.md](endpoints/server-group-create.md) |
| `server-group-delete` | POST | `/v2/newbrowser/deletegroups` | [server-group-delete.md](endpoints/server-group-delete.md) |
| `environment-delete` | POST | `/v2/newbrowser/putdeleteshop` | [environment-delete.md](endpoints/environment-delete.md) |
| `proxy-device-logs` | GET | `/v2/proxy/device/findDeviceLogs` | [proxy-device-logs.md](endpoints/proxy-device-logs.md) |
| `transfer-shop-list` | POST | `/v2/newbrowser/transferShopList` | [transfer-shop-list.md](endpoints/transfer-shop-list.md) |
| `auth-log-permissions` | POST | `/v2/logs/auth/perms` | [auth-log-permissions.md](endpoints/auth-log-permissions.md) |
| `auth-log-options` | POST | `/v2/logs/auth/options` | [auth-log-options.md](endpoints/auth-log-options.md) |
| `team-login-logs` | POST | `/v2/team/loginlogs` | [team-login-logs.md](endpoints/team-login-logs.md) |
| `current-company-info` | GET | `/v2/team/curCompanyInfo` | [current-company-info.md](endpoints/current-company-info.md) |
| `user-meal-settings` | GET | `/v2/cost/costmanagement/get_user_set_meal` | [user-meal-settings.md](endpoints/user-meal-settings.md) |
| `team-members` | POST | `/v2/team/getMembers` | [team-members.md](endpoints/team-members.md) |
| `team-roles` | POST | `/v2/team/roles` | [team-roles.md](endpoints/team-roles.md) |
| `team-departments` | POST | `/v2/team/getDepts` | [team-departments.md](endpoints/team-departments.md) |
| `team-invite-code` | POST | `/v2/team/invite/getCode` | [team-invite-code.md](endpoints/team-invite-code.md) |
| `version-core` | POST | `/v2/team/version/getCore` | [version-core.md](endpoints/version-core.md) |
| `team-authentication-get` | POST | `/v2/team/authentication/get` | [team-authentication-get.md](endpoints/team-authentication-get.md) |
| `my-companies` | POST | `/v2/team/myCompanies` | [my-companies.md](endpoints/my-companies.md) |
| `sms-settings` | POST | `/v2/message/sms-setting/get` | [sms-settings.md](endpoints/sms-settings.md) |
| `member-profile` | POST | `/v2/team/member/myInfo` | [member-profile.md](endpoints/member-profile.md) |
| `company-user-devices` | GET | `/v2/team/company/user/devices` | [company-user-devices.md](endpoints/company-user-devices.md) |
| `settings-contact` | GET | `/v2/news/settings/info` | [settings-contact.md](endpoints/settings-contact.md) |
| `settings-qrcode` | GET | `/v2/news/settings/info` | [settings-qrcode.md](endpoints/settings-qrcode.md) |
| `company-face-check` | GET | `/v2/team/authentication/companyFourElementsFaceCheck` | [company-face-check.md](endpoints/company-face-check.md) |
| `role-department-meal` | POST | `/v2/team/company/getRoleDepartmentMeal` | [role-department-meal.md](endpoints/role-department-meal.md) |
| `authentication-check` | GET | `/v2/team/authentication/check` | [authentication-check.md](endpoints/authentication-check.md) |
| `my-user-info` | POST | `/v2/sso/auth/myUserinfo` | [my-user-info.md](endpoints/my-user-info.md) |
| `token-refresh` | POST | `/v2/sso/auth/tokenRefresh` | [token-refresh.md](endpoints/token-refresh.md) |

## Discovery

Start with [INDEX.md](INDEX.md) to find the right endpoint by task, then read `endpoints.json` for the machine-readable catalog, `WORKFLOW.md` for shared request and response rules, and [ERRORS.md](ERRORS.md) for the measured error contract. Tag colours are defined in [tag-colors.md](tag-colors.md). Read the endpoint document before sending a live request.

## Security Boundary

The server API uses an HTTPS management-center origin and a bearer token. The local API uses a loopback origin and does not use this token. Do not silently switch between the two surfaces.

Responses can contain cookies, proxy credentials, account credentials, and account identifiers. The helper redacts common sensitive fields by default. Use `--show-sensitive` only when the user explicitly requests raw values and the output destination is safe.