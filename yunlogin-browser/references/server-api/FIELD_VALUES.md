# Server API Observed Value Domains

Generated from read-only probes of the management-center API. Only enum-like scalar fields
(status, state, type, flag, code, role, channel, and similar) are recorded, and only when the
value is short and non-sensitive. Free-form text, identifiers, credentials, and account data are
never written here, so every set below is an **observed sample, not a closed enum**.

- Part 1 covers the curated catalog endpoints, called with their real defaults.
- Part 2 covers every route the full-surface sweep proved reachable, called with the generic body.

## Coverage

- Enum-like fields with observed values: 811
- Distinct observed values recorded: 1879
- Catalog endpoints with enum values: 45
- Full-surface routes with enum values: 187

## Part 1 - Cataloged Endpoints

These calls use each endpoint's documented defaults, so the values reflect realistic payloads.

## POST /v2/sso/auth/myUserinfo

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.birthday` | string | `0001-01-01T00:00:00Z` |
| `$.data.cancelStatus` | number | `1` |
| `$.data.gender` | string | `2` |
| `$.data.inviteType` | number | `0` |
| `$.data.source` | string | `112` |

## POST /v2/team/myCompanies

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].lockStatus` | number | `1` |
| `$.data[].status` | number | `1` |

## POST /v2/newbrowser/getsettings

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.personalSettings.icon_type` | number | `4` |

## POST /v2/newbrowser/getconditionshops

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.shop[].device_type` | string | `self` |
| `$.shop[].flag` | number | `0` |
| `$.shop[].ipChannel` | string | `ip2location` |
| `$.shop[].kernel` | string | `Chrome` |
| `$.shop[].proxy.deviceType` | string | `self` |
| `$.shop[].proxy.dns.mode` | boolean | `false` |
| `$.shop[].proxy.ipChannel` | string | `ip2location` |
| `$.shop[].proxy.type` | string | `socks5` |
| `$.shop[].system` | string | `Windows 10` |

## GET /v2/newbrowser/getallurilist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].childclass` | string | `tiktok小店`, `Facebook`, `TikTok`, `Twitter`, `Youtube`, `WhatsApp`, `Telegram`, `SKYpe`, `LinkedIn`, `ins`, `亚马逊后台`, `shopee后台`, `ebay后台` |
| `$.data[].fatherclass` | string | `电商`, `社交` |
| `$.data[].grandsonclass` | string | `全球跨境·自运营(新)`, `美国（本土）`, `菲律宾（本土）`, `马来西亚（本土）`, `全球`, `美国`, `英国`, `日本`, `德国`, `法国`, `加拿大`, `墨西哥`, `巴西`, `意大利`, `西班牙`, `印度`, `澳大利亚`, `荷兰`, `土耳其`, `泰国（国内）`, `新加坡（国内）`, `菲律宾（国内）`, `越南（国内）`, `巴西（国内）`, `中国台湾（本土）`, `印尼（本土）`, `新加坡（本土）`, `泰国（本土）`, `越南（本土）`, `巴西（本土）` |

## POST /v2/newbrowser/getalluri

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.fatherclass[]` | string | `电商`, `社交`, `支付`, `邮箱`, `问卷`, `广告` |

## POST /v2/newbrowser/getalluserselfuri

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getgroups

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/proxy/device/findTags

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/proxy/device/vcnplist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/proxy/device/findDeviceProxyUserSelves

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.data[].enable` | number | `1` |
| `$.data.data[].ip_query_channel` | string | `ip2location` |
| `$.data.data[].ip_type` | number | `1` |
| `$.data.data[].proxytype` | number | `1` |
| `$.msgCode` | number | `200` |

## GET /v2/proxy/device/findDeviceDynamicProxies

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/newbrowser/getLatestOpenAccountIdList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getdefaultfingerlist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.language[].code` | string | `AM`, `NI`, `ES`, `AZ`, `BG`, `BN`, `BS`, `CA`, `PH`, `CO`, `CZ`, `CY`, `DK`, `DE`, `AT`, `CH`, `LI`, `GR`, `GB`, `AU`, `IN`, `NZ`, `ZA`, `MX`, `AR`, `CL`, `CR`, `HN`, `PE`, `UY` |
| `$.system.Android[].system` | string | `All Android`, `Android 13`, `Android 12`, `Android 11`, `Android 10`, `Android 9` |
| `$.system.IOS[].system` | string | `All IOS`, `IOS 16`, `IOS 15`, `IOS 14` |
| `$.system.Linux[].system` | string | `Linux` |
| `$.system.MacOS[].system` | string | `All MacOS`, `MacOS 15`, `MacOS 14`, `MacOS 13`, `MacOS 12`, `MacOS 11`, `MacOS 10` |
| `$.system.Windows[].system` | string | `All Windows`, `Windows 11`, `Windows 10`, `Windows 8.1`, `Windows 8`, `Windows 7` |

## POST /v2/team/version/getCore

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].minVersionCode` | number | `0` |
| `$.data[].platform` | string | `windows` |
| `$.data[].status` | string | `3` |
| `$.data[].updateType` | string | `3` |
| `$.data[].versionCode` | number | `1000109`, `2000202`, `1000301`, `1000202`, `2000203`, `2000204`, `2000104` |

## POST /v2/newbrowser/getCookie

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getUserPasswordList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/proxy/device/findDevices

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/newbrowser/getfingerprinturi

| Field | Types | Observed values |
| --- | --- | --- |
| `$.browseinfo.proxy.dns.mode` | boolean | `false` |
| `$.code` | number | `200` |
| `$.defaultfingerprint.AudioContext` | number | `0` |
| `$.defaultfingerprint.font.enable` | number | `1` |
| `$.defaultfingerprint.geographic.enable` | number | `1` |
| `$.defaultfingerprint.kernel` | string | `Chrome` |
| `$.defaultfingerprint.system` | string | `Windows 10` |

## POST /v2/message/user-notice/my

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].noticeType` | number | `3`, `2` |
| `$.data.list[].reminderStatus` | number | `0` |
| `$.data.list[].status` | number | `2` |
| `$.data.list[].type` | number | `1` |

## POST /v2/rpa/getRpaPlanManagementList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/plugin/getAddedAndGlobalplugin

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.globalPlugin[].installStatus` | number | `1` |
| `$.data.globalPlugin[].kernel` | number | `1` |
| `$.data.globalPlugin[].pluginType` | number | `2` |
| `$.data.globalPlugin[].teamStatus` | number | `0` |

## POST /v2/newbrowser/getauthshopbriefinfolist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].kernel` | string | `Chrome` |
| `$.data.list[].proxy.deviceType` | string | `self` |
| `$.data.list[].proxy.dns.mode` | boolean | `false` |
| `$.data.list[].proxy.ipChannel` | string | `ip2location` |
| `$.data.list[].proxy.type` | string | `socks5` |
| `$.data.list[].status` | number | `0` |
| `$.data.list[].system` | string | `Windows 10` |

## POST /v2/newbrowser/account-users/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/proxy/device/findDeviceLogs

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/newbrowser/transferShopList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/logs/auth/perms

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].opType` | string | `role_great` |

## POST /v2/logs/auth/options

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].opType` | string | `reseller_assignment`, `order_reset_name`, `account_update_password`, `account_delete_password`, `create_plugin_companies`, `member_edit` |

## POST /v2/team/loginlogs

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].clientType` | string | `1`, `client` |
| `$.data.list[].optionType` | number | `1` |

## POST /v2/team/curCompanyInfo

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.lockStatus` | number | `1` |
| `$.data.status` | number | `1` |

## GET /v2/cost/costmanagement/get_user_set_meal

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.day` | number | `0` |
| `$.data.effective_day` | number | `3` |
| `$.data.free_status` | number | `1` |
| `$.data.package_source` | number | `1` |
| `$.data.select_day` | number | `0` |
| `$.msgCode` | number | `200` |

## POST /v2/team/getMembers

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].cancelStatus` | number | `1` |
| `$.data.list[].leave_status` | number | `2` |
| `$.data.list[].package_status` | number | `1` |

## POST /v2/team/roles

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].roleType` | number | `0` |

## POST /v2/team/getDepts

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/team/invite/getCode

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/team/authentication/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.companyStatus` | number | `1` |
| `$.data.userStatus` | number | `1` |

## POST /v2/message/sms-setting/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.renewSmsNotifyEnabled` | number | `1` |

## POST /v2/team/member/myInfo

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.leave_status` | number | `2` |
| `$.data.package_status` | number | `1` |

## POST /v2/team/company/user/devices

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].devType` | number | `1` |
| `$.data.list[].online_status` | number | `2` |
| `$.data.list[].platformType` | number | `1` |

## GET /v2/news/settings/info

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.status` | number | `2` |

## GET /v2/news/settings/info

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.status` | number | `2` |

## GET /v2/team/authentication/companyFourElementsFaceCheck

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.companyStatus` | number | `0` |
| `$.data.userStatus` | number | `0` |

## POST /v2/team/company/getRoleDepartmentMeal

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].day` | number | `0`, `84` |
| `$.data[].free_status` | number | `1`, `0` |

## GET /v2/team/authentication/check

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.companyStatus` | number | `0` |
| `$.data.userStatus` | number | `0` |

## POST /v2/sso/auth/tokenRefresh

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## Part 2 - Full Extracted Route Surface

These calls reuse the full-surface sweep request (a generic company/user body), so a route that
needs real parameters returns only its error envelope and contributes few values.

## POST /v2/newbrowser/getalluri

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.fatherclass[]` | string | `电商`, `社交`, `支付`, `邮箱`, `问卷`, `广告` |

## GET /v2/newbrowser/getallurilist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].childclass` | string | `tiktok小店`, `Facebook`, `TikTok`, `Twitter`, `Youtube`, `WhatsApp`, `Telegram`, `SKYpe`, `LinkedIn`, `ins`, `亚马逊后台`, `shopee后台`, `ebay后台` |
| `$.data[].fatherclass` | string | `电商`, `社交` |
| `$.data[].grandsonclass` | string | `全球跨境·自运营(新)`, `美国（本土）`, `菲律宾（本土）`, `马来西亚（本土）`, `全球`, `美国`, `英国`, `日本`, `德国`, `法国`, `加拿大`, `墨西哥`, `巴西`, `意大利`, `西班牙`, `印度`, `澳大利亚`, `荷兰`, `土耳其`, `泰国（国内）`, `新加坡（国内）`, `菲律宾（国内）`, `越南（国内）`, `巴西（国内）`, `中国台湾（本土）`, `印尼（本土）`, `新加坡（本土）`, `泰国（本土）`, `越南（本土）`, `巴西（本土）` |

## GET /api/v1/users

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## POST /api/v1/users/role/members

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /api/v1/users/department

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /api/v1/users/department/curd

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /api/v1/users/account/list

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /api/v1/users/customplatform

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /v2/sso/getNewbieStep

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `10006` |
| `$.status` | string | `error` |

## GET /v2/cost/costmanagement/getNewbieDevice

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].new_cloud_instances.area_code` | string | `1`, `7`, `6`, `2`, `4`, `3` |
| `$.data[].new_cloud_instances.asn_type` | number | `0` |
| `$.data[].new_cloud_instances.band_width_type` | number | `0` |
| `$.data[].new_cloud_instances.cidr_status` | number | `1` |
| `$.data[].new_cloud_instances.city_code` | string | `CHN081000`, `BRA0000SP`, `THA000010`, `USA0MOCOV`, `NLD000000`, `SGPSGPSGP`, `PHL000MNL`, `UKR000000`, `JPN000027`, `CAN000000`, `TUR000000`, `MYS0KLKUL`, `LUX0000LL`, `DEU0000BE`, `AUSNSWHBS`, `VNM0000HI`, `KOR011SEO`, `GBRENGLND`, `IDN0000JK`, `ARE0000DU`, `ZAF000JNB`, `FRA000PAR`, `SWZ000001`, `IND000ICD`, `LAO0000VI`, `MLI0000CD`, `MMR0000YG`, `KAZ000ALA`, `JOR0000AM`, `KWT000000` |
| `$.data[].new_cloud_instances.country_code` | string | `CHN`, `BRA`, `THA`, `USA`, `NLD`, `SGP`, `PHL`, `UKR`, `JPN`, `CAN`, `TUR`, `MYS`, `LUX`, `DEU`, `AUS`, `VNM`, `KOR`, `GBR`, `IDN`, `ARE`, `ZAF`, `FRA`, `SWZ`, `IND`, `LAO`, `MLI`, `MMR`, `KAZ`, `JOR`, `KWT` |
| `$.data[].new_cloud_instances.ip_type` | number | `1` |
| `$.data[].new_cloud_instances.isp_type` | number | `0` |
| `$.data[].new_cloud_instances.net_type` | number | `0` |
| `$.data[].new_cloud_instances.package_type` | string | `price` |
| `$.data[].new_cloud_instances.packages.price[].month` | number | `1`, `3`, `6`, `12` |
| `$.data[].new_cloud_instances.proxy_type` | number | `2` |
| `$.data[].new_cloud_instances.sell_unit` | number | `3` |
| `$.data[].new_cloud_instances.unit` | number | `3` |
| `$.data[].new_cloud_instances.vtype` | string | `ipideash2` |
| `$.msgCode` | number | `200` |

## POST /v2/newbrowser/getconditionshops

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getShopAndAuthList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getgroups

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getuserauthshops

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].proxy.dns.mode` | boolean | `false` |
| `$.data.list[].status` | number | `0` |

## GET /api/v1/users/account/taglist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## POST /v2/newbrowser/getshopbriefinfolist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].proxy.dns.mode` | boolean | `false` |
| `$.data.list[].status` | number | `0` |

## POST /v2/newbrowser/getauthshopbriefinfolist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].kernel` | string | `Chrome` |
| `$.data.list[].proxy.deviceType` | string | `self` |
| `$.data.list[].proxy.dns.mode` | boolean | `false` |
| `$.data.list[].proxy.ipChannel` | string | `ip2location` |
| `$.data.list[].proxy.type` | string | `socks5` |
| `$.data.list[].status` | number | `0` |
| `$.data.list[].system` | string | `Windows 10` |

## POST /v2/newbrowser/cloud-accounts/getauthshopbriefinfolist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].proxy.dns.mode` | boolean | `false` |
| `$.data.list[].status` | number | `0` |
| `$.data.list[].system` | string | `Windows 8`, `Windows 7`, `Windows 10`, `Windows 11`, `Windows 8.1` |

## GET /v2/proxy/device/vcnpsummary

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/proxy/device/vcnplist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/proxy/device/findVcnpList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/proxy/device/dynamics/proxy

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `4011` |
| `$.msgCode` | number | `4011` |

## POST /v2/newbrowser/getshopfromproxy

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/cloud-accounts/getshopfromproxy

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/proxy/device/findReplaceProxyLogs

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `80004` |
| `$.msgCode` | number | `80004` |

## POST /v2/newbrowser/getiduserlist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/cloud-accounts/getiduserlist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /api/v1/users/role/list

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /api/v1/users/role/right

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /v2/proxy/device/findDeviceProxyUserSelves

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/proxy/device/findTags

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/proxy/device/findDeviceDynamicProxies

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.data[].ip_type` | number | `1` |
| `$.data.data[].status` | number | `0` |
| `$.msgCode` | number | `200` |

## POST /v2/proxy/device/findDevices

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/proxy/device/findDesignateDevices

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/proxy/device/findNotAuthDesignateDevices

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/retail/findRetailUserInviteCode

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.userInvite.invitationCode` | string | `7ykq` |

## POST /v2/team/ownerCompanies

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].lockStatus` | number | `1` |
| `$.data[].status` | number | `1` |

## GET /v2/retail/findRetailSettleConfig

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.reretailSettleConfig.settleType` | number | `1` |
| `$.data.reretailSettleConfig.status` | number | `1` |
| `$.data.reretailSettleConfig.type` | number | `1` |

## GET /v2/retail/getPromotionLinkList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].invitationCode` | string | `7ykq` |
| `$.data.list[].redirectType` | number | `1` |
| `$.data.list[].status` | number | `1` |

## GET /v2/retail/checkPromotionCode

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `7` |
| `$.msgCode` | number | `7` |

## GET /api/v1/users/website/newslist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.data[].status` | number | `0` |
| `$.status` | string | `success` |

## GET /api/v1/users/website/newscontent

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `400` |
| `$.status` | string | `error` |

## GET /v2/cost/costmanagement/getcloudcoinsnumb

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/getrechargehistory

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/getrechargecloudcoin

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].is_enable` | number | `1` |
| `$.data[].type` | number | `1` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/device/findorder

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `4009` |
| `$.msgCode` | number | `4009` |

## GET /v2/cost/costmanagement/getorderinfo

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/team/member/ids

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/cost/costmanagement/getcloudsupport

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].country[].city[].vtype.area_code` | string | `1`, `6`, `3`, `7`, `2`, `4` |
| `$.data[].country[].city[].vtype.asn_type` | number | `0` |
| `$.data[].country[].city[].vtype.band_width_type` | number | `3`, `0`, `1` |
| `$.data[].country[].city[].vtype.cidr_status` | number | `-1` |
| `$.data[].country[].city[].vtype.city_code` | string | `CHN037002`, `CHN032001`, `CHN011000`, `CHN044001`, `CHN031000`, `CHN033001`, `CHN051001`, `CHN044003`, `CHN081000`, `CHN015001`, `CHN015009`, `CHN035001`, `CHN071001`, `CHN052001`, `CHN037001`, `CHN032005`, `CHN043001`, `CHN061001`, `CHN050000`, `CHN035002`, `CHN041001`, `CAN000MTR`, `IND000MUB`, `IND000MAA`, `IDN0000JK`, `TUR000000`, `EGY000CAI`, `MEX000000`, `BGD000DAC`, `BHR000000` |
| `$.data[].country[].city[].vtype.country_code` | string | `CHN`, `CAN`, `IND`, `IDN`, `TUR`, `EGY`, `MEX`, `BGD`, `BHR`, `BRA`, `DEU`, `ITA`, `SGP`, `JPN`, `KHM`, `FRA`, `THA`, `AUS`, `SWE`, `USA`, `GBR`, `NLD`, `PHL`, `ESP`, `VNM`, `ARE`, `KOR`, `MYS` |
| `$.data[].country[].city[].vtype.ip_type` | number | `1` |
| `$.data[].country[].city[].vtype.isp_type` | number | `0`, `2` |
| `$.data[].country[].city[].vtype.net_type` | number | `0`, `1` |
| `$.data[].country[].city[].vtype.package_type` | string | `price` |
| `$.data[].country[].city[].vtype.proxy_type` | number | `1` |
| `$.data[].country[].city[].vtype.sell_unit` | number | `3` |
| `$.data[].country[].city[].vtype.unit` | number | `3`, `1` |
| `$.data[].country[].city[].vtype.vtype` | string | `ali`, `tx`, `cmc`, `huawei`, `ypk`, `awslight`, `ak`, `huawei_light` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/getcoupon

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/set_meal_set

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/get_user_set_meal

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.day` | number | `0` |
| `$.data.effective_day` | number | `3` |
| `$.data.free_status` | number | `1` |
| `$.data.package_source` | number | `1` |
| `$.data.select_day` | number | `0` |
| `$.msgCode` | number | `200` |

## POST /v2/team/getDepts

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/team/myCompanies

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].lockStatus` | number | `1` |
| `$.data[].status` | number | `1` |

## POST /v2/team/company/getRoleDepartmentMeal

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].day` | number | `0`, `84` |
| `$.data[].free_status` | number | `1`, `0` |

## POST /v2/team/select/company

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `500` |

## POST /v2/team/getMembers

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].cancelStatus` | number | `1` |
| `$.data.list[].leave_status` | number | `2` |
| `$.data.list[].package_status` | number | `1` |

## POST /v2/team/company/getApprovals

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getgroupusers

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/team/roles

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].roleType` | number | `0` |

## POST /v2/team/role/members

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/team/right/list

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].isEnable` | string | `1` |
| `$.data[].roleType` | string | `1` |
| `$.data[].type` | string | `8`, `1`, `2`, `7`, `3`, `18`, `9`, `16`, `15`, `10`, `4`, `6`, `11`, `5`, `12`, `13`, `21` |

## POST /v2/team/right/listTemplate

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].isEnable` | number | `1` |
| `$.data[].roleType` | number | `1`, `2` |
| `$.data[].templateType` | number | `1`, `2`, `3`, `4`, `5`, `6`, `7` |

## POST /v2/logs/auth/options

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].opType` | string | `reseller_assignment`, `order_reset_name`, `account_update_password` |

## POST /v2/message/user-notice/my

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].noticeType` | number | `3`, `2` |
| `$.data.list[].reminderStatus` | number | `0` |
| `$.data.list[].status` | number | `2` |
| `$.data.list[].type` | number | `1` |

## POST /v2/team/member/myInfo

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.leave_status` | number | `2` |
| `$.data.package_status` | number | `1` |

## POST /v2/sso/auth/myUserinfo

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.birthday` | string | `0001-01-01T00:00:00Z` |
| `$.data.cancelStatus` | number | `1` |
| `$.data.gender` | string | `2` |
| `$.data.inviteType` | number | `0` |
| `$.data.source` | string | `112` |

## POST /v2/sso/auth/user/info/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.birthday` | string | `0001-01-01T00:00:00Z` |
| `$.data.cancelStatus` | number | `1` |
| `$.data.gender` | string | `2` |
| `$.data.inviteType` | number | `0` |
| `$.data.openType` | number | `0` |
| `$.data.source` | string | `112` |
| `$.data.userType` | number | `0` |

## GET /v2/plugin/getPluginCrxList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.list[].installStatus` | number | `0` |
| `$.list[].kernel` | number | `1` |

## GET /v2/plugin/getPluginCategoryGroupCrxList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.list[].crx[].installStatus` | number | `0` |
| `$.list[].crx[].kernel` | number | `1` |
| `$.list[].type` | number | `1` |

## GET /v2/plugin/getPluginCategoryGroupList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.list[].list[].type` | number | `1`, `2` |
| `$.list[].type` | number | `1`, `2` |
| `$.list[].typeText` | string | `功能分类`, `电商分类` |

## GET /v2/plugin/findPluginCrx

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.repluginCrx.category` | string | `运营工具` |
| `$.data.repluginCrx.installStatus` | number | `0` |
| `$.data.repluginCrx.kernel` | number | `1` |

## GET /v2/plugin/myPlugin

| Field | Types | Observed values |
| --- | --- | --- |
| `$.list[].installStatus` | number | `1` |
| `$.list[].kernel` | number | `0`, `1` |
| `$.list[].pluginType` | number | `0`, `2` |
| `$.list[].teamStatus` | number | `0` |

## GET /v2/plugin/findPluginCompanies

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.repluginCompanies.kernel` | number | `1` |
| `$.data.repluginCompanies.pluginType` | number | `2` |

## POST /v2/newbrowser/getalllanguage

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.language[].code` | string | `AM`, `NI`, `ES`, `AZ`, `BG`, `BN`, `BS`, `CA`, `PH`, `CO`, `CZ`, `CY`, `DK`, `DE`, `AT`, `CH`, `LI`, `GR`, `GB`, `AU`, `IN`, `NZ`, `ZA`, `MX`, `AR`, `CL`, `CR`, `HN`, `PE`, `UY` |

## POST /v2/newbrowser/getdefaultfingerlist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.language[].code` | string | `AM`, `NI`, `ES`, `AZ`, `BG`, `BN`, `BS`, `CA`, `PH`, `CO`, `CZ`, `CY`, `DK`, `DE`, `AT`, `CH`, `LI`, `GR`, `GB`, `AU`, `IN`, `NZ`, `ZA`, `MX`, `AR`, `CL`, `CR`, `HN`, `PE`, `UY` |
| `$.system.Android[].system` | string | `All Android`, `Android 13`, `Android 12`, `Android 11`, `Android 10`, `Android 9` |
| `$.system.IOS[].system` | string | `All IOS`, `IOS 16`, `IOS 15`, `IOS 14` |
| `$.system.Linux[].system` | string | `Linux` |
| `$.system.MacOS[].system` | string | `All MacOS`, `MacOS 15`, `MacOS 14`, `MacOS 13`, `MacOS 12`, `MacOS 11`, `MacOS 10` |
| `$.system.Windows[].system` | string | `All Windows`, `Windows 11`, `Windows 10`, `Windows 8.1`, `Windows 8`, `Windows 7` |

## POST /v2/newbrowser/getfingerprinturi

| Field | Types | Observed values |
| --- | --- | --- |
| `$.browseinfo.proxy.dns.mode` | boolean | `false` |
| `$.code` | number | `200` |
| `$.defaultfingerprint.AudioContext` | number | `0` |
| `$.defaultfingerprint.font.enable` | number | `1` |
| `$.defaultfingerprint.geographic.enable` | number | `1` |
| `$.defaultfingerprint.kernel` | string | `Chrome` |
| `$.defaultfingerprint.system` | string | `Windows 10` |

## POST /v2/newbrowser/getCookie

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `400` |

## GET /v2/plugin/getPluginCrxUserList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.list[].installStatus` | number | `1` |
| `$.list[].kernel` | number | `1` |
| `$.list[].pluginType` | number | `2` |

## POST /v2/newbrowser/getfingerprinturiua

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `403` |

## POST /v2/newbrowser/getpackageinfo

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getallfonts

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getalluserselfuri

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/team/company/info

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `500` |
| `$.status` | string | `error` |

## POST /v2/team/company/ids

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getautomac

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/getrecycleshoplist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/rpa/getRpaGroupList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `0` |
| `$.msgCode` | number | `200` |

## GET /v2/rpa/findRpaGroup

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/rpa/getRpaCarbonConfigList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `0` |
| `$.list[].browserStatus` | number | `1` |
| `$.list[].config[].config.children[].type` | string | `waitTime`, `click`, `ifElse`, `getElement`, `inputContent`, `keyboard` |
| `$.list[].config[].config.scrollType` | string | `position` |
| `$.list[].config[].config.selectorType` | string | `page`, `selector` |
| `$.list[].config[].config.timeoutType` | string | `randomInterval` |
| `$.list[].config[].config.type` | string | `smooth`, `object` |
| `$.list[].config[].type` | string | `newPage`, `gotoUrl`, `waitTime`, `scrollPage`, `forElements`, `screenshotPage` |
| `$.list[].labelStatus` | number | `1` |
| `$.msgCode` | number | `200` |

## GET /v2/rpa/getRpaShopList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `0` |
| `$.msgCode` | number | `200` |

## GET /v2/rpa/findRpaShop

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.resRpaShop.config[].config.children[].type` | string | `waitTime`, `click`, `ifElse`, `getElement`, `inputContent`, `keyboard` |
| `$.data.resRpaShop.config[].config.scrollType` | string | `position` |
| `$.data.resRpaShop.config[].config.selectorType` | string | `page`, `selector` |
| `$.data.resRpaShop.config[].config.timeoutType` | string | `randomInterval` |
| `$.data.resRpaShop.config[].config.type` | string | `smooth`, `object` |
| `$.data.resRpaShop.config[].type` | string | `newPage`, `gotoUrl`, `waitTime`, `scrollPage`, `forElements`, `screenshotPage` |
| `$.msgCode` | number | `200` |

## GET /v2/rpa/getRpaShopGroupList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `0` |
| `$.msgCode` | number | `200` |

## GET /v2/rpa/getRpaPlanManagementList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/rpa/findRpaPlanManagement

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `404` |
| `$.msgCode` | number | `404` |

## GET /v2/rpa/findRpaCarbonConfig

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.rerpaCarbonConfig.browserStatus` | number | `1` |
| `$.data.rerpaCarbonConfig.config[].config.type` | string | `url` |
| `$.data.rerpaCarbonConfig.config[].type` | string | `switchPage` |
| `$.data.rerpaCarbonConfig.labelStatus` | number | `1` |
| `$.msgCode` | number | `200` |

## GET /v2/rpa/getRpaTaskLogList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/rpa/getRpaTaskLog

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `50004` |
| `$.msgCode` | number | `500` |

## POST /v2/newbrowser/getbatchaddxlsxprocess

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `404` |

## POST /v2/newbrowser/getbatchaddxlsxlist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `404` |

## POST /v2/team/auth/myRights

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].isEnable` | string | `1` |
| `$.data[].roleType` | string | `1` |
| `$.data[].type` | string | `8`, `1`, `2`, `7`, `3`, `18`, `9`, `16`, `15`, `10`, `4`, `6`, `11`, `5`, `12`, `13`, `21` |

## POST /v2/team/version/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/team/version/getCore

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/team/version/last

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].minVersionCode` | number | `0` |
| `$.data[].platform` | string | `macosx` |
| `$.data[].status` | string | `3` |
| `$.data[].updateType` | string | `1` |
| `$.data[].versionCode` | number | `4000305` |

## POST /api/v1/ipify/query

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `400` |
| `$.status` | string | `error` |

## POST /api/v1/ipify/queryV7

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `400` |
| `$.status` | string | `error` |

## POST /api/v1/ipify/fetchForwardProxyInfo

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `400` |
| `$.status` | string | `error` |

## POST /api/v1/ipify/getVersion

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `400` |
| `$.status` | string | `error` |

## GET /v2/team/authentication/check

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.companyStatus` | number | `0` |
| `$.data.userStatus` | number | `0` |

## GET /v2/team/authentication/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.companyStatus` | number | `1` |
| `$.data.userStatus` | number | `1` |

## GET /v2/team/authentication/companyFourElementsQRCode

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `500` |
| `$.status` | string | `error` |

## GET /v2/team/authentication/companyFourElementsFaceCheck

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.companyStatus` | number | `0` |
| `$.data.userStatus` | number | `0` |

## GET /v2/cost/costmanagement/getcloudsupportnew

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].country[].city[].vtype.area_code` | string | `1`, `2`, `3`, `6`, `4`, `7` |
| `$.data[].country[].city[].vtype.asn_type` | number | `0` |
| `$.data[].country[].city[].vtype.band_width_type` | number | `3`, `0`, `1`, `2` |
| `$.data[].country[].city[].vtype.cidr_status` | number | `-1`, `1` |
| `$.data[].country[].city[].vtype.city_code` | string | `CHN037002`, `CHN032001`, `CHN011000`, `CHN044001`, `CHN031000`, `CHN033001`, `CHN051001`, `CHN044003`, `CHN081000`, `CHN015001`, `CHN082000`, `CHN037001`, `CHN062010`, `CHN032005`, `CHN041001`, `CHN064005`, `CHN044012`, `CHN053001`, `CHN012000`, `CHN034002`, `CHN032004`, `CHN043008`, `CHN046001`, `CHN062002`, `CHN034001`, `CHN014007`, `CHN035005`, `CHN042005`, `CHN045001`, `CHN044002` |
| `$.data[].country[].city[].vtype.country_code` | string | `CHN`, `DNK`, `UKR`, `UGA`, `RUS`, `COG`, `CAN`, `GHA`, `ZAF`, `LUX`, `IND`, `IDN`, `KAZ`, `TUR`, `EGY`, `MEX`, `AUT`, `BGD`, `KWT`, `AGO`, `NGA`, `PAK`, `PNG`, `BHR`, `BRA`, `DEU`, `ITA`, `MAR`, `SWZ`, `SGP` |
| `$.data[].country[].city[].vtype.ip_type` | number | `1` |
| `$.data[].country[].city[].vtype.isp_type` | number | `0`, `1`, `2` |
| `$.data[].country[].city[].vtype.net_type` | number | `0`, `2`, `1` |
| `$.data[].country[].city[].vtype.package_type` | string | `price` |
| `$.data[].country[].city[].vtype.proxy_type` | number | `1`, `2` |
| `$.data[].country[].city[].vtype.sell_unit` | number | `3` |
| `$.data[].country[].city[].vtype.unit` | number | `3`, `1` |
| `$.data[].country[].city[].vtype.vtype` | string | `ali`, `tianyi`, `tx`, `cmc`, `huawei`, `ipideash`, `mb`, `ypk`, `crown`, `ipideash2`, `awslight`, `ak`, `ipv`, `huawei_light` |
| `$.msgCode` | number | `200` |

## POST /v2/newbrowser/getsettings

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.personalSettings.icon_type` | number | `4` |

## POST /v2/newbrowser/migrate/searchuuid

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].finger[].AudioContext` | number | `0` |
| `$.data[].finger[].font.enable` | number | `0` |
| `$.data[].finger[].geographic.enable` | number | `0` |
| `$.data[].finger[].kernel` | string | `Chrome` |
| `$.data[].finger[].system` | string | `Windows 10` |
| `$.data[].status` | number | `3` |

## POST /v2/news/show/help/categories

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].status` | number | `2` |
| `$.data.list[].type` | number | `2` |

## GET /v2/news/settings/info

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `500` |

## POST /v2/news/show/help/list

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].flag` | number | `1`, `0` |
| `$.data.list[].status` | number | `2` |

## GET /v2/proxy/device/findDeviceLogs

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/admin/device/third-proxy/page

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].proxyType` | string | `全球动态·静态`, `海外动态、静态` |
| `$.data.list[].status` | number | `2`, `1` |

## POST /v2/admin/device/third-proxy/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `500` |

## POST /v2/newbrowser/getshopkernelVersions

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/sso/getUserPlatforms

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/yun/ads-space/ad

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].optype` | number | `1`, `3` |
| `$.data[].status` | number | `1` |

## POST /v2/newbrowser/getshopnameandproxylist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/team/plugin/newestPlugins

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].platform` | string | `windows` |
| `$.data[].status` | number | `2` |

## POST /v2/newbrowser/getUserPasswordList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /api/v1/users/findpwd

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `401` |
| `$.status` | string | `error` |

## POST /api/v1/users/companystore

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `400` |
| `$.status` | string | `error` |

## GET /api/v1/users/platform

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /api/v1/users/navigate/category

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].children[].navigate[].status` | number | `0` |
| `$.data[].children[].status` | number | `0` |
| `$.data[].children[].type` | number | `0` |
| `$.data[].navigate[].status` | number | `0` |
| `$.data[].status` | number | `0` |
| `$.data[].type` | number | `0` |
| `$.status` | string | `success` |

## GET /api/v1/users/navigate/more

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.status` | string | `success` |

## GET /api/v1/users/navigate/timezonelist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.status` | string | `success` |

## GET /api/v1/users/hotsearchword

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].is_enable` | number | `1` |
| `$.status` | string | `success` |

## GET /api/v1/users/nav/newslist

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.status` | string | `success` |

## GET /api/v1/users/account/getstartlogs

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /api/v1/users/dingtalkparams

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.state` | string | `6acc56b5f091d` |
| `$.status` | string | `success` |

## POST /api/v2/users/set_account_set_meal_restrict

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## GET /api/v2/users/account_set_meal_restrict

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `30401` |
| `$.status` | string | `error` |

## POST /v2/sso/getDingCfg

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/sso/mp/qrCode

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/team/sidebar/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/cost/costmanagement/getRegionSupport

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/getRegionSupportV2

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].children[].children[].code` | string | `USA0CALAX`, `USA0AZPHX`, `USA0CASJC`, `USA0CASVY`, `USA0CODEN`, `USA0DEILG`, `USA0FLMIA`, `USA0HI000`, `USA0ILCHI`, `USA0KSKCK`, `USA0MABZD`, `USA0MOCOV`, `USA0NJ000`, `USA0NVLAS`, `USA0OH0OH`, `USA0OR0OR`, `USA0ORPDX`, `USA0TXDAL`, `USA0TXHOU`, `USA0UT000`, `USA0VA000`, `USA0WASEA`, `USA0WV0WV`, `USA0SCCOV`, `USA0CASFO`, `USA0NYQEE`, `USA0WA000`, `CAN000000`, `CAN000MTR`, `CAN000TOR` |
| `$.data[].children[].children[].flag` | number | `3`, `0`, `2`, `9`, `1` |
| `$.data[].children[].children[].parentCode` | string | `USA`, `CAN`, `MEX`, `CHN`, `THA`, `MYS`, `IDN`, `PHL`, `JPN`, `KOR`, `VNM`, `SGP`, `ARE`, `BGD`, `BHR`, `IND`, `JOR`, `KAZ`, `KHM`, `KWT`, `LAO`, `MMR`, `PAK`, `SAU`, `TUR`, `GBR`, `FRA`, `DEU`, `AUT`, `DNK` |
| `$.data[].children[].code` | string | `USA`, `CAN`, `MEX`, `CHN`, `THA`, `MYS`, `IDN`, `PHL`, `JPN`, `KOR`, `VNM`, `SGP`, `ARE`, `BGD`, `BHR`, `IND`, `JOR`, `KAZ`, `KHM`, `KWT`, `LAO`, `MMR`, `PAK`, `SAU`, `TUR`, `GBR`, `FRA`, `DEU`, `AUT`, `DNK` |
| `$.data[].children[].flag` | number | `2`, `9`, `0`, `3`, `1` |
| `$.data[].children[].parentCode` | string | `6`, `1`, `2`, `7`, `4`, `3` |
| `$.data[].code` | string | `6`, `1`, `2`, `7`, `4`, `3` |
| `$.data[].flag` | number | `9`, `0` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/getDynamicAgent

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `401` |
| `$.msgCode` | number | `401` |

## GET /v2/cost/costmanagement/getCityAgent

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].children[].children[].code` | string | `AFG000`, `ARE000`, `BGD000`, `BHR000`, `CHN013`, `CHN014`, `CHN015`, `CHN021`, `CHN022`, `CHN023`, `CHN032`, `CHN033`, `CHN034`, `CHN035`, `CHN036`, `CHN037`, `CHN041`, `CHN042`, `CHN043`, `CHN044`, `CHN045`, `CHN046`, `CHN051`, `CHN052`, `CHN053`, `CHN054`, `CHN061`, `CHN062`, `CHN063`, `CHN064` |
| `$.data[].children[].children[].flag` | number | `0` |
| `$.data[].children[].children[].parentCode` | string | `AFG`, `ARE`, `BGD`, `BHR`, `CHN`, `IDN`, `IND`, `ISR`, `JOR`, `JPN`, `KAZ`, `KGZ`, `KHM`, `KOR`, `LAO`, `LBN`, `LKA`, `MDV`, `MMR`, `MNG`, `MYS`, `NPL`, `OMN`, `PAK`, `PHL`, `PRK`, `PSE`, `QAT`, `SAU`, `SYR` |
| `$.data[].children[].code` | string | `AFG`, `ARE`, `BGD`, `BHR`, `CHN`, `IDN`, `IND`, `ISR`, `JOR`, `JPN`, `KAZ`, `KGZ`, `KHM`, `KOR`, `LAO`, `LBN`, `LKA`, `MDV`, `MMR`, `MNG`, `MYS`, `NPL`, `OMN`, `PAK`, `PHL`, `PRK`, `PSE`, `QAT`, `SAU`, `SYR` |
| `$.data[].children[].flag` | number | `0` |
| `$.data[].children[].parentCode` | string | `1`, `3`, `2`, `7`, `4`, `6` |
| `$.data[].code` | string | `1`, `3`, `2`, `7`, `4`, `6` |
| `$.data[].flag` | number | `0` |
| `$.data[].parentCode` | string | `0` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/getProxyProduct

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].new_cloud_instances.area_code` | string | `2`, `6`, `1`, `4` |
| `$.data[].new_cloud_instances.asn_type` | number | `0` |
| `$.data[].new_cloud_instances.band_width_type` | number | `1`, `3`, `0` |
| `$.data[].new_cloud_instances.cidr_status` | number | `-1` |
| `$.data[].new_cloud_instances.city_code` | string | `SWE0000AB`, `USA0CALAX`, `CHN033001`, `CHN037001`, `CHN037002`, `CHN044001`, `KHM000PNH`, `GBRNIRNIR`, `USA0CASVY`, `CHN015009`, `IDN0000JK`, `GBRENGLND`, `CHN035002`, `IND000MAA`, `KOR011SEO`, `MYS0KLKUL`, `VNM0000HC`, `CHN031000`, `CHN052001`, `IND000MUB`, `SGPSGPSGP`, `FRA000PAR`, `ITA000MIL`, `AUSVICMEL`, `MEX000000`, `JPN000013`, `CHN011000`, `CHN032001`, `CHN051001`, `ARE0000DU` |
| `$.data[].new_cloud_instances.country_code` | string | `SWE`, `USA`, `CHN`, `KHM`, `GBR`, `IDN`, `IND`, `KOR`, `MYS`, `VNM`, `SGP`, `FRA`, `ITA`, `AUS`, `MEX`, `JPN`, `ARE`, `DEU` |
| `$.data[].new_cloud_instances.ip_type` | number | `1` |
| `$.data[].new_cloud_instances.isp_type` | number | `2`, `0` |
| `$.data[].new_cloud_instances.net_type` | number | `1`, `0` |
| `$.data[].new_cloud_instances.package_type` | string | `price` |
| `$.data[].new_cloud_instances.packages.price[].month` | number | `1`, `3`, `6`, `12` |
| `$.data[].new_cloud_instances.proxy_type` | number | `1` |
| `$.data[].new_cloud_instances.sell_unit` | number | `3` |
| `$.data[].new_cloud_instances.unit` | number | `1`, `3` |
| `$.data[].new_cloud_instances.vtype` | string | `ak`, `ali`, `cmc`, `tx`, `ypk`, `awslight`, `huawei`, `huawei_light` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/getProxyProductV2

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.group_list[].area_code` | string | `4`, `7`, `6`, `1`, `2` |
| `$.data.group_list[].asn_type` | number | `0` |
| `$.data.group_list[].band_width_type` | number | `1`, `0` |
| `$.data.group_list[].cidr_status` | number | `1` |
| `$.data.group_list[].city_code` | string | `AUS000000`, `BRA000000`, `BRA0000RJ`, `CAN000TOR`, `CHN071000`, `CHN081000`, `DEU000000`, `DEU000FFO`, `ESP000000`, `ESP000MAD`, `FRA000000`, `FRA000PAR`, `GBR000000`, `GBRENGLND`, `IDN0000JK`, `IND000ICD`, `IRQ000001`, `ITA000000`, `JPN000013`, `KOR000000`, `KOR011SEO`, `MEX000CHH`, `MYS000000`, `MYS0KLKUL`, `NLD000000`, `PHL000000`, `PHL000MNL`, `RUS000000`, `SAU000000`, `SGPSGPSGP` |
| `$.data.group_list[].country_code` | string | `AUS`, `BRA`, `CAN`, `CHN`, `DEU`, `ESP`, `FRA`, `GBR`, `IDN`, `IND`, `IRQ`, `ITA`, `JPN`, `KOR`, `MEX`, `MYS`, `NLD`, `PHL`, `RUS`, `SAU`, `SGP`, `THA`, `USA` |
| `$.data.group_list[].ip_type` | number | `1` |
| `$.data.group_list[].isp_type` | number | `2`, `1`, `0` |
| `$.data.group_list[].net_type` | number | `1`, `0` |
| `$.data.group_list[].package_type` | string | `price` |
| `$.data.group_list[].packages.price[].month` | number | `1`, `3`, `6`, `12` |
| `$.data.group_list[].proxy_type` | number | `2` |
| `$.data.group_list[].sell_unit` | number | `3` |
| `$.data.group_list[].unit` | number | `3`, `1` |
| `$.data.group_list[].vtype` | string | `mb`, `crown`, `ipv`, `ipideash2` |
| `$.data.list[].area_code` | string | `1` |
| `$.data.list[].asn_type` | number | `0` |
| `$.data.list[].band_width_type` | number | `3`, `0`, `1` |
| `$.data.list[].cidr_status` | number | `-1` |
| `$.data.list[].city_code` | string | `ARE0000DU`, `BGD000DAC`, `BHR000000`, `CHN011000`, `CHN015001`, `CHN015009`, `CHN031000`, `CHN032001`, `CHN032005`, `CHN033001`, `CHN035001`, `CHN035002`, `CHN037001`, `CHN037002`, `CHN041001`, `CHN043001`, `CHN044001`, `CHN044003`, `CHN050000`, `CHN051001`, `CHN052001`, `CHN061001`, `CHN071001`, `CHN081000`, `IDN0000JK`, `IND000MAA`, `IND000MUB`, `JPN000013` |
| `$.data.list[].country_code` | string | `ARE`, `BGD`, `BHR`, `CHN`, `IDN`, `IND`, `JPN` |
| `$.data.list[].ip_type` | number | `1` |
| `$.data.list[].isp_type` | number | `0`, `2` |
| `$.data.list[].net_type` | number | `0`, `1` |
| `$.data.list[].package_type` | string | `price` |
| `$.data.list[].packages.price[].month` | number | `1`, `3`, `6`, `12` |
| `$.data.list[].proxy_type` | number | `1` |
| `$.data.list[].sell_unit` | number | `3` |
| `$.data.list[].unit` | number | `3`, `1` |
| `$.data.list[].vtype` | string | `ypk`, `tx`, `cmc`, `ali`, `huawei`, `ak`, `awslight` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/getHotProxyProduct

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].cities[].city_code` | string | `USA0CALAX`, `USA0NYQEE`, `USA0WA000`, `USA0AZPHX`, `USA0TXHOU`, `USA0VA000`, `USA0NJ000`, `USA0CODEN`, `USA0CASJC`, `USA0MABZD`, `CHN031000`, `CHN011000`, `CHN081000`, `CHN044001`, `CHN032001`, `CHN033001`, `CHN042001`, `CHN044006`, `CHN034001`, `CHN051001`, `THA000010`, `IDN0000JK`, `JPN000013`, `JPN000001`, `JPN000027`, `JPN000023`, `BRA0000RJ`, `BRA0000SP`, `BRA000000`, `MYS0KLKUL` |
| `$.data[].cities[].products[].new_cloud_instances.area_code` | string | `6`, `1`, `7`, `2` |
| `$.data[].cities[].products[].new_cloud_instances.asn_type` | number | `0` |
| `$.data[].cities[].products[].new_cloud_instances.band_width_type` | number | `0`, `2`, `1` |
| `$.data[].cities[].products[].new_cloud_instances.cidr_status` | number | `1`, `-1` |
| `$.data[].cities[].products[].new_cloud_instances.city_code` | string | `USA0CALAX`, `USA0NYQEE`, `USA0WA000`, `USA0AZPHX`, `USA0TXHOU`, `USA0VA000`, `USA0NJ000`, `USA0CODEN`, `USA0CASJC`, `USA0MABZD`, `CHN031000`, `CHN011000`, `CHN081000`, `CHN044001`, `CHN032001`, `CHN033001`, `CHN042001`, `CHN044006`, `CHN034001`, `CHN051001`, `THA000010`, `IDN0000JK`, `JPN000013`, `JPN000001`, `JPN000027`, `JPN000023`, `BRA0000RJ`, `BRA0000SP`, `BRA000000`, `MYS0KLKUL` |
| `$.data[].cities[].products[].new_cloud_instances.country_code` | string | `USA`, `CHN`, `THA`, `IDN`, `JPN`, `BRA`, `MYS`, `GBR` |
| `$.data[].cities[].products[].new_cloud_instances.ip_type` | number | `1` |
| `$.data[].cities[].products[].new_cloud_instances.isp_type` | number | `0`, `2`, `1` |
| `$.data[].cities[].products[].new_cloud_instances.net_type` | number | `0`, `1`, `2` |
| `$.data[].cities[].products[].new_cloud_instances.package_type` | string | `price` |
| `$.data[].cities[].products[].new_cloud_instances.proxy_type` | number | `2` |
| `$.data[].cities[].products[].new_cloud_instances.sell_unit` | number | `3` |
| `$.data[].cities[].products[].new_cloud_instances.unit` | number | `3`, `1` |
| `$.data[].cities[].products[].new_cloud_instances.vtype` | string | `ipideash`, `ipv`, `mb`, `crown`, `ipideash2`, `tianyi` |
| `$.data[].country_code` | string | `USA`, `CHN`, `THA`, `IDN`, `JPN`, `BRA`, `MYS`, `GBR` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/getOrderDetailNew

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `4009` |
| `$.msgCode` | number | `4009` |

## GET /v2/cost/costmanagement/getOrderManagementNew

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.data[].crm_type` | number | `0` |
| `$.data.data[].order_detail_all[].auto_month` | number | `0` |
| `$.data.data[].order_detail_all[].bundle_info.day` | number | `0` |
| `$.data.data[].order_detail_all[].bundle_info.effective_day` | number | `3` |
| `$.data.data[].order_detail_all[].bundle_info.free_status` | number | `1` |
| `$.data.data[].order_detail_all[].cloud_browser_products.status` | number | `0` |
| `$.data.data[].order_detail_all[].cloud.asn_type` | number | `0` |
| `$.data.data[].order_detail_all[].cloud.band_width_type` | number | `0` |
| `$.data.data[].order_detail_all[].cloud.cidr_status` | number | `0` |
| `$.data.data[].order_detail_all[].cloud.ip_type` | number | `0` |
| `$.data.data[].order_detail_all[].cloud.isp_type` | number | `0` |
| `$.data.data[].order_detail_all[].cloud.net_type` | number | `0` |
| `$.data.data[].order_detail_all[].cloud.proxy_type` | number | `0` |
| `$.data.data[].order_detail_all[].cloud.sell_unit` | number | `0` |
| `$.data.data[].order_detail_all[].cloud.unit` | number | `0` |
| `$.data.data[].order_detail_all[].details_status` | number | `3` |
| `$.data.data[].order_detail_all[].details_status_text` | string | `已完成` |
| `$.data.data[].order_detail_all[].ip_type` | number | `0` |
| `$.data.data[].order_detail_all[].isp_type` | number | `0` |
| `$.data.data[].order_detail_all[].net_type` | number | `0` |
| `$.data.data[].order_detail.auto_month` | number | `0` |
| `$.data.data[].order_detail.cloud_browser_products.status` | number | `0` |
| `$.data.data[].order_detail.cloud.asn_type` | number | `0` |
| `$.data.data[].order_detail.cloud.band_width_type` | number | `0` |
| `$.data.data[].order_detail.cloud.cidr_status` | number | `0` |
| `$.data.data[].order_detail.cloud.ip_type` | number | `0` |
| `$.data.data[].order_detail.cloud.isp_type` | number | `0` |
| `$.data.data[].order_detail.cloud.net_type` | number | `0` |
| `$.data.data[].order_detail.cloud.proxy_type` | number | `0` |
| `$.data.data[].order_detail.cloud.sell_unit` | number | `0` |
| `$.data.data[].order_detail.cloud.unit` | number | `0` |
| `$.data.data[].order_detail.ip_type` | number | `0` |
| `$.data.data[].order_detail.isp_type` | number | `0` |
| `$.data.data[].order_detail.net_type` | number | `0` |
| `$.data.data[].order_status` | number | `3` |
| `$.data.data[].order_status_text` | string | `已完成` |
| `$.data.data[].order_type` | number | `3` |
| `$.data.data[].order_type_text` | string | `套餐订单` |
| `$.data.data[].pay_status` | number | `1` |
| `$.data.data[].pay_status_text` | string | `已支付` |
| `$.data.data[].pay_type` | number | `0` |
| `$.data.data[].pay_type_text` | string | `系统` |
| `$.data.data[].type` | number | `2` |
| `$.msgCode` | number | `200` |

## GET /v2/newbrowser/getconditionshopscount

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/cost/device/cart_find

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/quickIndex

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/quick

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## GET /v2/cost/costmanagement/quickRecommend

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].buyStatus` | boolean | `true` |
| `$.data[].cloud_instances.area_code` | string | `6`, `1`, `2` |
| `$.data[].cloud_instances.asn_type` | number | `0` |
| `$.data[].cloud_instances.band_width_type` | number | `0`, `1` |
| `$.data[].cloud_instances.cidr_status` | number | `1` |
| `$.data[].cloud_instances.city_code` | string | `USA0NYQEE`, `KOR011SEO`, `USA0WV0WV`, `RUS000MOW`, `GBRENGLND`, `USA0CASJC`, `IRL000000`, `SWE0000AB`, `CHN071000`, `USA0TXHOU`, `CHN081000`, `VNM0000HI`, `IDN0000JK`, `USA0KSKCK`, `PHL000MNL`, `USA0TXDAL`, `JPN000013`, `SGPSGPSGP` |
| `$.data[].cloud_instances.country_code` | string | `USA`, `KOR`, `RUS`, `GBR`, `IRL`, `SWE`, `CHN`, `VNM`, `IDN`, `PHL`, `JPN`, `SGP` |
| `$.data[].cloud_instances.ip_type` | number | `1` |
| `$.data[].cloud_instances.isp_type` | number | `0`, `2`, `1` |
| `$.data[].cloud_instances.net_type` | number | `0`, `1`, `2` |
| `$.data[].cloud_instances.package_type` | string | `price` |
| `$.data[].cloud_instances.packages.price[].month` | number | `1`, `3`, `6`, `12` |
| `$.data[].cloud_instances.proxy_type` | number | `2` |
| `$.data[].cloud_instances.sell_unit` | number | `3` |
| `$.data[].cloud_instances.unit` | number | `3`, `1` |
| `$.data[].cloud_instances.vtype` | string | `ipideash2`, `mb`, `ipideash`, `ipv` |
| `$.msgCode` | number | `200` |

## GET /v2/proxy/device/findDeviceLogsList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.data[].desc_json_ob.asnType` | number | `0` |
| `$.data.data[].desc_json_ob.auto_month` | number | `0` |
| `$.data.data[].desc_json_ob.cloud_type` | number | `0` |
| `$.data.data[].desc_json_ob.cloud.asn_type` | number | `0` |
| `$.data.data[].desc_json_ob.cloud.band_width_type` | number | `0` |
| `$.data.data[].desc_json_ob.cloud.cidr_status` | number | `0` |
| `$.data.data[].desc_json_ob.cloud.ip_type` | number | `0` |
| `$.data.data[].desc_json_ob.cloud.isp_type` | number | `0` |
| `$.data.data[].desc_json_ob.cloud.net_type` | number | `0` |
| `$.data.data[].desc_json_ob.cloud.proxy_type` | number | `0` |
| `$.data.data[].desc_json_ob.cloud.sell_unit` | number | `0` |
| `$.data.data[].desc_json_ob.cloud.unit` | number | `0` |
| `$.data.data[].desc_json_ob.ip_state` | number | `0` |
| `$.data.data[].desc_json_ob.ip_type` | number | `0` |
| `$.data.data[].desc_json_ob.isp_type` | number | `0` |
| `$.data.data[].desc_json_ob.net_type` | number | `0` |
| `$.data.data[].device_type` | number | `5` |
| `$.msgCode` | number | `200` |

## POST /v2/cost/costmanagement/getOrderDetailNewByMultiple

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `4009` |
| `$.msgCode` | number | `4009` |

## POST /v2/newbrowser/account-users/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/team/company/user/devices

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].devType` | number | `1` |
| `$.data.list[].online_status` | number | `2` |
| `$.data.list[].platformType` | number | `1` |

## POST /v2/rpa/getRpaPlanManagementList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.msgCode` | number | `200` |

## POST /v2/team/role-group/page

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/storage/page

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/plugin/getPluginCompaniesPersonageList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.list[].installStatus` | number | `1` |
| `$.list[].kernel` | number | `0`, `1` |
| `$.list[].pluginType` | number | `0`, `2` |
| `$.list[].teamStatus` | number | `0` |

## GET /v2/plugin/group/getPluginGroupId

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `7` |
| `$.msgCode` | number | `7` |

## GET /v2/plugin/getAddedAndGlobalplugin

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.globalPlugin[].installStatus` | number | `1` |
| `$.data.globalPlugin[].kernel` | number | `1` |
| `$.data.globalPlugin[].pluginType` | number | `2` |
| `$.data.globalPlugin[].teamStatus` | number | `0` |

## POST /v2/team/member/info

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.leave_status` | number | `2` |
| `$.data.package_status` | number | `1` |

## GET /v2/plugin/group/gitGroupPluginList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## GET /v2/plugin/group/accountGroupList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `7` |
| `$.msgCode` | number | `7` |

## POST /v2/newbrowser/getUserPasswordRecycleList

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/cloud-accounts/page

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].proxy.dns.mode` | boolean | `false` |
| `$.data.list[].status` | number | `0` |
| `$.data.list[].system` | string | `Windows 8`, `Windows 7`, `Windows 10`, `Windows 11`, `Windows 8.1` |

## POST /v2/newbrowser/cloud-accounts/finger/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.browseinfo.proxy.dns.mode` | boolean | `false` |
| `$.code` | number | `200` |
| `$.defaultfingerprint.AudioContext` | number | `0` |
| `$.defaultfingerprint.font.enable` | number | `1` |
| `$.defaultfingerprint.geographic.enable` | number | `1` |
| `$.defaultfingerprint.kernel` | string | `Chrome` |
| `$.defaultfingerprint.system` | string | `Windows 11` |

## GET /v2/proxy/device/getCloudBrowserSupport

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].children[].children[].code` | string | `CHN031000`, `CHN081000` |
| `$.data[].children[].children[].flag` | number | `0` |
| `$.data[].children[].children[].parentCode` | string | `CHN` |
| `$.data[].children[].code` | string | `CHN` |
| `$.data[].children[].flag` | number | `0` |
| `$.data[].children[].parentCode` | string | `1` |
| `$.data[].code` | string | `1` |
| `$.data[].flag` | number | `0` |
| `$.data[].parentCode` | string | `0` |
| `$.msgCode` | number | `200` |

## GET /v2/proxy/device/getCloudBrowserProducts

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].area_code` | string | `1` |
| `$.data[].city_code` | string | `CHN081000`, `CHN031000` |
| `$.data[].country_code` | string | `CHN` |
| `$.data[].package_type` | string | `price` |
| `$.data[].packages.price[].month` | number | `1`, `3`, `6`, `12` |
| `$.data[].status` | number | `1` |
| `$.msgCode` | number | `200` |

## POST /v2/newbrowser/cloud-accounts/popup/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/cloud-accounts/free/shop/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/cloud-accounts/open/token/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/cost/costmanagement/getOrderDetailStatus

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `4009` |
| `$.msgCode` | number | `4009` |

## POST /v2/newbrowser/cloud-accounts/client-num/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |

## POST /v2/newbrowser/cloud-accounts/num-vis

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.expireInWeek` | number | `0` |

## POST /v2/proxy/authority/deal

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `401` |
| `$.msgCode` | number | `401` |

## GET /v2/proxy/authority/get

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `401` |
| `$.msgCode` | number | `401` |

## POST /v2/message/message-type/page

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data.list[].groupType` | number | `1`, `2` |
| `$.data.list[].noticeType` | number | `3`, `1`, `2`, `4` |
| `$.data.list[].status` | number | `1` |

## POST /v2/message/user-notice/noticeRed

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `200` |
| `$.data[].noticeType` | number | `3`, `1`, `2`, `4` |

## POST /v2/message/user-notice/getNotice

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `500` |

## GET /v2/cost/costmanagement/getOrderDetailByDetailsNo

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `4009` |
| `$.msgCode` | number | `4009` |

## POST /api/v1/client/query_feature_support

| Field | Types | Observed values |
| --- | --- | --- |
| `$.code` | number | `400` |
| `$.status` | string | `error` |

## Where Value Meanings Come From

| Source | What it gives | Where it lands |
| --- | --- | --- |
| Paired label fields | The API returns `X` next to `X_text`, so the code meaning is authoritative | [CODE_LEGENDS.md](CODE_LEGENDS.md) |
| Client i18n bundle | The management-center client's own label for a field name | The field descriptions in [ROUTE_FIELDS.md](ROUTE_FIELDS.md) |
| Client code maps | None found for the numeric codes below | - |

The bundles were searched for a code-to-label map and do not contain one for these fields, so their
values stay "observed only": `isp_type`, `net_type`, `band_width_type`, `cidr_status`,
`pluginType`, `roleType`, `templateType`, `installStatus`, `devType`, `free_status`, and the
`RegionSupportV2` flags. The i18n bundle does carry the field-name labels for some of them
(`ispType` -> ISP类型, `pluginType` -> 插件分类), which is why the field meaning is
documented even though the codes are not. Re-run
`node scripts/dev/mine-bundle-enums.mjs <key>` to re-check after a client update.

## How To Read This

- A field absent here either never carried a sampled enum value or is free-form.
- `Types` lists every JSON type observed at that path, so `string, null` means the value is optional.
- Values are illustrative for the tested account. Treat them as observed examples, not a closed set.
