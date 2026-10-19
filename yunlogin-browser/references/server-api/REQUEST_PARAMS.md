# Server API Request Parameters

Part 1 is the request contract for every cataloged endpoint: method, path, required fields, and
the defaults the skill sends. Part 2 is measured behaviour for the enum-like request parameters -
which values actually filter, which are ignored, and which only fail a type check.

- Per-parameter measured effects: [PARAMETER_MATRIX.md](PARAMETER_MATRIX.md)
- Write-route parameters: [WRITE_ROUTE_PARAMS.md](WRITE_ROUTE_PARAMS.md)

## Part 1 - Cataloged Request Contract

| Endpoint | Method | Path | Required | Notable defaults |
| --- | --- | --- | --- | --- |
| `browser-list` | POST | `/v2/newbrowser/getconditionshops` | `companyid`, `userid` | serial=0, sortorder=12, enable=1, offer=0, number=100, self=false, transfers=false, share=false |
| `browser-settings` | POST | `/v2/newbrowser/getsettings` | - | - |
| `browser-cookie` | POST | `/v2/newbrowser/getCookie` | `shopid` | - |
| `proxy-cloud-list` | GET | `/v2/proxy/device/vcnplist` | `page`, `per_page`, `status`, `userid`, `companyid` | page=1, per_page=20, status=0 |
| `proxy-self-list` | GET | `/v2/proxy/device/findDeviceProxyUserSelves` | `status`, `trademark`, `page`, `per_page`, `companyid`, `userid` | status=1, trademark="self", page=1, per_page=20, serial=0 |
| `proxy-dynamic-list` | GET | `/v2/proxy/device/findDeviceDynamicProxies` | `status`, `trademark`, `page`, `per_page`, `userid`, `companyid` | status=0, trademark="general", page=1, per_page=20 |
| `account-list` | POST | `/v2/newbrowser/getUserPasswordList` | - | page=1, pageSize=100, platformLock=-1, bind=-1 |
| `find-devices` | POST | `/v2/proxy/device/findDevices` | `device_ids`, `trademark` | trademark="official" |
| `fingerprint-uri` | POST | `/v2/newbrowser/getfingerprinturi` | `shopid` | - |
| `environment-create` | POST | `/v2/newbrowser/putalluri` | `browser` | number=1, randProxy=0, browser={} |
| `user-notices` | POST | `/v2/message/user-notice/my` | - | noticeType=0, page=1, pageSize=10 |
| `environment-clone` | POST | `/v2/newbrowser/batchCloneShop` | - | number=1 |
| `rpa-plan-list` | POST | `/v2/rpa/getRpaPlanManagementList` | `userId`, `accountIds` | executeType=11 |
| `latest-open-environments` | POST | `/v2/newbrowser/getLatestOpenAccountIdList` | - | num=20 |
| `fingerprint-defaults` | POST | `/v2/newbrowser/getdefaultfingerlist` | `system`, `kernel`, `kernelVersion` | - |
| `platform-class-tree` | POST | `/v2/newbrowser/getalluri` | - | - |
| `platform-catalog` | GET | `/v2/newbrowser/getallurilist` | - | - |
| `custom-platform-list` | POST | `/v2/newbrowser/getalluserselfuri` | `companyid`, `userid` | - |
| `plugin-list` | GET | `/v2/plugin/getAddedAndGlobalplugin` | - | - |
| `auth-shop-brief-list` | POST | `/v2/newbrowser/getauthshopbriefinfolist` | - | page=1, pageSize=10, number=0 |
| `bound-account-detail` | POST | `/v2/newbrowser/getBindUserPassword` | `user_password_id` | pageSize=10086 |
| `account-users-get` | POST | `/v2/newbrowser/account-users/get` | `accountIds` | - |
| `server-group-list` | POST | `/v2/newbrowser/getgroups` | `companyid`, `userid` | - |
| `proxy-tag-list` | GET | `/v2/proxy/device/findTags` | `companyid` | page=1, per_page=10000 |
| `proxy-tag-upsert` | POST | `/v2/proxy/device/updateTag` | `companyid`, `label` | color=8 |
| `proxy-tag-delete` | POST | `/v2/proxy/device/delTag` | `companyid`, `labelid` | - |
| `server-group-create` | POST | `/v2/newbrowser/putnewgroup` | `companyid`, `userid`, `group` | - |
| `server-group-delete` | POST | `/v2/newbrowser/deletegroups` | `groupid` | - |
| `environment-delete` | POST | `/v2/newbrowser/putdeleteshop` | `companyid`, `userid`, `shopid` | - |
| `proxy-device-logs` | GET | `/v2/proxy/device/findDeviceLogs` | `page`, `per_page` | page="1", per_page="20" |
| `transfer-shop-list` | POST | `/v2/newbrowser/transferShopList` | - | page=1, pageSize=20 |
| `auth-log-permissions` | POST | `/v2/logs/auth/perms` | - | pageIndex=1, total=0, pageSize=20 |
| `auth-log-options` | POST | `/v2/logs/auth/options` | - | pageIndex=1, total=0, pageSize=20 |
| `team-login-logs` | POST | `/v2/team/loginlogs` | - | pageIndex=1, total=0, pageSize=20 |
| `current-company-info` | POST | `/v2/team/curCompanyInfo` | - | - |
| `user-meal-settings` | GET | `/v2/cost/costmanagement/get_user_set_meal` | - | - |
| `team-members` | POST | `/v2/team/getMembers` | - | pageSize=5, pageIndex=1, leave=3 |
| `team-roles` | POST | `/v2/team/roles` | - | pageIndex=1, pageSize=999 |
| `team-departments` | POST | `/v2/team/getDepts` | - | - |
| `team-invite-code` | POST | `/v2/team/invite/getCode` | - | reset=0 |
| `version-core` | POST | `/v2/team/version/getCore` | - | versionCode=0, bitness="64", platform="windows", browser="chrome", appId="yunlogin" |
| `team-authentication-get` | GET | `/v2/team/authentication/get` | - | - |
| `my-companies` | POST | `/v2/team/myCompanies` | - | - |
| `sms-settings` | POST | `/v2/message/sms-setting/get` | - | - |
| `member-profile` | POST | `/v2/team/member/myInfo` | - | - |
| `company-user-devices` | POST | `/v2/team/company/user/devices` | - | - |
| `settings-contact` | GET | `/v2/news/settings/info` | `key` | key="setting.contact" |
| `settings-qrcode` | GET | `/v2/news/settings/info` | `key` | key="setting.qrcode" |
| `company-face-check` | GET | `/v2/team/authentication/companyFourElementsFaceCheck` | - | - |
| `role-department-meal` | POST | `/v2/team/company/getRoleDepartmentMeal` | - | - |
| `authentication-check` | GET | `/v2/team/authentication/check` | - | - |
| `my-user-info` | POST | `/v2/sso/auth/myUserinfo` | - | - |
| `token-refresh` | POST | `/v2/sso/auth/tokenRefresh` | - | - |
| `sso-login` | POST | `/v2/sso/login` | `username`, `password` | os="windows", source="112", last_login_port="client", last_login_device="pc" |

## Part 2 - Measured Enum Parameter Behaviour

`rows`/`total` come from the live response; they are what reveal whether a filter ran.

### `proxy-cloud-list` - `status`

- Route: `/v2/proxy/device/vcnplist`
- Verdict: **filtered** (some out-of-range values fall through to the baseline result)

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | 4 | 4 | ok |
| `1` | 200 | - | 0 | ok |
| `2` | 200 | - | 0 | ok |
| `3` | 200 | 4 | 4 | ok |
| `4` | 200 | - | 0 | ok |
| `99` | 200 | 4 | 4 | ok |
| `"abc"` | 401 | - | - | strconv.ParseInt: parsing "abc": invalid syntax |

### `proxy-self-list` - `status`

- Route: `/v2/proxy/device/findDeviceProxyUserSelves`
- Verdict: **filtered**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | 0 | 0 | ok |
| `1` | 200 | 20 | 520 | ok |
| `2` | 200 | 20 | 520 | ok |
| `99` | 200 | 20 | 520 | ok |

### `proxy-self-list` - `proxy_type`

- Route: `/v2/proxy/device/findDeviceProxyUserSelves`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `""` | 200 | 20 | 520 | ok |
| `"1"` | 200 | 20 | 520 | ok |
| `"2"` | 200 | 20 | 520 | ok |
| `"self"` | 200 | 20 | 520 | ok |
| `"official"` | 200 | 20 | 520 | ok |

### `proxy-self-list` - `ip_type`

- Route: `/v2/proxy/device/findDeviceProxyUserSelves`
- Verdict: **filtered** (some out-of-range values fall through to the baseline result)

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `""` | 200 | 20 | 520 | ok |
| `"1"` | 200 | 20 | 520 | ok |
| `"2"` | 200 | 0 | 0 | ok |
| `"9"` | 200 | 0 | 0 | ok |

### `proxy-dynamic-list` - `status`

- Route: `/v2/proxy/device/findDeviceDynamicProxies`
- Verdict: **filtered**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | 5 | 5 | ok |
| `1` | 200 | - | 0 | ok |
| `2` | 200 | - | 0 | ok |
| `99` | 200 | - | 0 | ok |

### `proxy-dynamic-list` - `ip_type`

- Route: `/v2/proxy/device/findDeviceDynamicProxies`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `""` | 200 | 5 | 5 | ok |
| `"1"` | 200 | 5 | 5 | ok |
| `"2"` | 200 | 5 | 5 | ok |
| `"9"` | 200 | 5 | 5 | ok |

### `user-notices` - `noticeType`

- Route: `/v2/message/user-notice/my`
- Verdict: **filtered** (some out-of-range values fall through to the baseline result)

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | 5 | 108 | OK |
| `1` | 200 | - | 0 | OK |
| `2` | 200 | - | 0 | OK |
| `3` | 200 | 5 | 108 | OK |
| `-1` | 200 | - | 0 | OK |
| `99` | 200 | - | 0 | OK |

### `rpa-plan-list` - `executeType`

- Route: `/v2/rpa/getRpaPlanManagementList`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `11` | 200 | 0 | 0 |  |
| `0` | 200 | 0 | 0 |  |
| `1` | 200 | 0 | 0 |  |
| `2` | 200 | 0 | 0 |  |
| `10` | 200 | 0 | 0 |  |
| `12` | 200 | 0 | 0 |  |
| `99` | 200 | 0 | 0 |  |

### `browser-list` - `number`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `1` | 200 | - | - | Success |
| `5` | 200 | - | - | Success |
| `0` | 200 | - | - | Success |

### `browser-list` - `enable`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | - | - | Success |
| `1` | 200 | - | - | Success |
| `2` | 200 | - | - | Success |

### `getgroups` - `company`

- Route: `/v2/newbrowser/getgroups`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `"\u6d4b\u8bd5\u73af\u5883-123456\u56e2\u961f"` | 200 | - | - |  |
| `"garbage-team-name"` | 200 | - | - |  |

### `getgroups` - `companyid`

- Route: `/v2/newbrowser/getgroups`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `"e7de49052df74494bbdb8ed545950b7f"` | 200 | - | - |  |
| `"deadbeefdeadbeefdeadbeefdeadbeef"` | 200 | - | - |  |

### `getgroups` - `userid`

- Route: `/v2/newbrowser/getgroups`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `"b49c3631c92446049fd5db4e246d1ae7"` | 200 | - | - |  |
| `"deadbeefdeadbeefdeadbeefdeadbeef"` | 200 | - | - |  |

### `find-devices` - `trademark`

- Route: `/v2/proxy/device/findDevices`
- Verdict: **filtered** (some out-of-range values fall through to the baseline result)

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `"self"` | 200 | - | - | ok |
| `"official"` | 200 | 4 | - | ok |
| `"garbage"` | 200 | - | - | ok |

### `find-devices` - `device_type`

- Route: `/v2/proxy/device/findDevices`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | 4 | - | ok |
| `1` | 200 | 4 | - | ok |
| `2` | 200 | 4 | - | ok |

### `find-devices` - `status`

- Route: `/v2/proxy/device/findDevices`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | 4 | - | ok |
| `1` | 200 | 4 | - | ok |
| `2` | 200 | 4 | - | ok |

### `browser-list` - `companyid`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `"e7de49052df74494bbdb8ed545950b7f"` | 200 | - | - | Success |
| `"deadbeefdeadbeefdeadbeefdeadbeef"` | 200 | - | - | Success |

### `browser-list` - `company`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `"\u6d4b\u8bd5\u73af\u5883-123456\u56e2\u961f"` | 200 | - | - | Success |
| `"garbage-team-name"` | 200 | - | - | Success |

### `browser-list` - `currentPage`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `1` | 200 | - | - | Success |
| `99` | 200 | - | - | Success |

### `browser-list` - `o`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | - | - | Success |
| `1` | 200 | - | - | Success |

### `browser-list` - `self`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `false` | 200 | - | - | Success |
| `true` | 200 | - | - | Success |

### `browser-list` - `transfers`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `false` | 200 | - | - | Success |
| `true` | 200 | - | - | Success |

### `browser-list` - `share`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `false` | 200 | - | - | Success |
| `true` | 200 | - | - | Success |

### `browser-list` - `sortorder`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | - | - | Success |
| `1` | 200 | - | - | Success |
| `12` | 200 | - | - | Success |
| `99` | 200 | - | - | Success |

### `browser-list` - `offer`

- Route: `/v2/newbrowser/getconditionshops`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `0` | 200 | - | - | Success |
| `5` | 200 | - | - | Success |
| `999999` | 200 | - | - | Success |
| `-1` | 200 | - | - | Success |

### `proxy-cloud-list` - `cloud_type`

- Route: `/v2/proxy/device/vcnplist`
- Verdict: **filtered** (some out-of-range values fall through to the baseline result)

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `1` | 200 | 4 | 4 | ok |
| `2` | 200 | - | 0 | ok |
| `4` | 200 | - | 0 | ok |
| `0` | 200 | 4 | 4 | ok |
| `99` | 200 | - | 0 | ok |

### `proxy-cloud-list` - `is_enable`

- Route: `/v2/proxy/device/vcnplist`
- Verdict: **filtered**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `1` | 200 | - | 0 | ok |
| `0` | 200 | 4 | 4 | ok |
| `2` | 200 | 4 | 4 | ok |

### `proxy-cloud-list` - `page`

- Route: `/v2/proxy/device/vcnplist`
- Verdict: **filtered** (some out-of-range values fall through to the baseline result)

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `1` | 200 | 2 | 4 | ok |
| `2` | 200 | 2 | 4 | ok |
| `0` | 200 | 2 | 4 | ok |
| `-1` | 200 | 2 | 4 | ok |
| `999999` | 200 | - | 4 | ok |

### `user-coupons` - `per_page`

- Route: `/v2/cost/costmanagement/user_coupons_list`
- Verdict: **filtered**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `1` | 200 | 1 | 12 | ok |
| `5` | 200 | 5 | 12 | ok |
| `100` | 200 | 12 | 12 | ok |
| `0` | 200 | 12 | 12 | ok |
| `-1` | 200 | 12 | 12 | ok |

### `invite-list` - `status`

- Route: `/v2/retail/getUserCompanyInviteList`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `1` | - | 0 | 0 |  |
| `2` | - | 0 | 0 |  |
| `3` | - | 0 | 0 |  |
| `0` | - | 0 | 0 |  |
| `99` | - | 0 | 0 |  |

### `user-coupons` - `type`

- Route: `/v2/cost/costmanagement/user_coupons_list`
- Verdict: **filtered**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `1` | 200 | 10 | 12 | ok |
| `2` | 200 | 1 | 1 | ok |
| `0` | 200 | 10 | 13 | ok |
| `99` | 200 | 10 | 13 | ok |

### `version-core` - `channel`

- Route: `/v2/team/version/getCore`
- Verdict: **ignored (every value returns the same rows)**

| Value | Code | Rows | Total | Message |
| --- | --- | ---: | ---: | --- |
| `""` | 200 | 16 | - |  |
| `"stable"` | 200 | 16 | - |  |
| `"beta"` | 200 | 16 | - |  |
| `"dev"` | 200 | 16 | - |  |
| `"x"` | 200 | 16 | - |  |

## Cross-Cutting Rules

| Rule | Evidence |
| --- | --- |
| Types are enforced, ranges usually are not | A string where an int is expected fails with `strconv.ParseInt: parsing \"abc\": invalid syntax` (`code: 401`). |
| Out-of-range values often fall through | `vcnplist status=99` returns the same 4 rows as `status=0`. |
| Unmatched values return an empty list, not an error | `findDeviceDynamicProxies status=1/2/99` all return `total: 0`. |
| Some filters are dead on this surface | `findDeviceProxyUserSelves proxy_type` and `findDeviceDynamicProxies ip_type` return identical rows for every value, including bogus strings. |
| `noticeType` collapses | `0` and `3` both return the full 108 notices; `1`, `2`, `-1`, `99` all return an empty list. |

Probe time: 2026-10-09T11:37:55.500Z. Values are from the tested account; a filter that returns zero rows here may
return rows on an account that owns matching resources.
