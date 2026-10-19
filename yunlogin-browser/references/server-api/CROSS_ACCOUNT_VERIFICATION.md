# Cross-Account Verification

The reference session captures one management-center account. Several routes only answer when the
account actually owns the data they read (credentials, orders, RPA configs, members). This page records
a second, data-rich account re-probing the route universe with `scripts/dev/probe-route-fields.mjs`,
so a route the reference session left unresolved still has a documented response shape.

The per-field detail is in [FIELD_INVENTORY_ACCOUNT_B.md](FIELD_INVENTORY_ACCOUNT_B.md). This page
records which routes that probe resolved and what it proves about the request contract.

- Second-account probe ran at: 2026-10-10T04:08:15.851Z
- Origin: `https://d126447d359e70c0.yunlogin.com`
- Routes probed: **117**
- Routes that returned fields: **72**

## Routes The Reference Session Had Not Resolved

These routes answered with fields on the second account while the reference sweep left them at a
missing-parameter or empty shape.

| Second-account fields | Reference fields | Code | Method | Route |
| ---: | ---: | ---: | --- | --- |
| 20 | 5 | 200 | GET | `/v2/rpa/getRpaTaskLog` |
| 6 | 5 | 200 | POST | `/v2/proxy/device/findDesignateDevices` |
| 6 | 5 | 200 | GET | `/v2/cost/costmanagement/getRegionSupport` |
| 6 | 5 | 200 | GET | `/v2/cost/device/cart_find` |
| 6 | 5 | 200 | POST | `/v2/newbrowser/cloud-accounts/popup/get` |
| 6 | 5 | 200 | POST | `/v2/newbrowser/cloud-accounts/open/token/get` |
| 5 | 4 | 200 | POST | `/v2/newbrowser/cloud-accounts/getshopfromproxy` |
| 5 | 4 | - | GET | `/v2/retail/getRetailWithdrawLogList` |
| 5 | 4 | - | GET | `/v2/retail/frozenList` |
| 5 | 4 | 200 | POST | `/v2/newbrowser/getpackageinfo` |
| 5 | 4 | 200 | POST | `/v2/newbrowser/account-users/get` |
| 2 | 1 | - | POST | `/v2/check/checkproxy` |

## Every Route The Second Account Resolved

| Second-account fields | Reference fields | Code | Method | Route |
| ---: | ---: | ---: | --- | --- |
| 146 | 139 | 200 | GET | `/v2/cost/costmanagement/getProxyProductV2` |
| 133 | 9 | 200 | GET | `/v2/proxy/device/findDeviceLogsList` |
| 127 | 126 | 200 | POST | `/v2/newbrowser/cloud-accounts/finger/get` |
| 96 | 94 | 200 | POST | `/v2/newbrowser/cloud-accounts/page` |
| 94 | 7 | 200 | POST | `/v2/rpa/getRpaPlanManagementList` |
| 91 | 31 | 0 | GET | `/v2/rpa/getRpaCarbonConfigList` |
| 86 | 80 | 200 | GET | `/v2/cost/costmanagement/getNewbieDevice` |
| 85 | 80 | 200 | GET | `/v2/cost/costmanagement/quickRecommend` |
| 79 | 16 | 200 | GET | `/v2/cost/costmanagement/getHotProxyProduct` |
| 74 | 69 | 200 | GET | `/v2/cost/costmanagement/getProxyProduct` |
| 46 | 38 | - | GET | `/v2/plugin/myPlugin` |
| 40 | 39 | 200 | GET | `/v2/cost/costmanagement/get_user_set_meal` |
| 40 | 36 | 200 | POST | `/v2/team/getMembers` |
| 40 | 38 | 200 | POST | `/v2/newbrowser/getsettings` |
| 40 | 38 | 200 | POST | `/v2/news/show/help/list` |
| 37 | 36 | 200 | POST | `/v2/sso/auth/myUserinfo` |
| 37 | 35 | 200 | GET | `/v2/rpa/findRpaCarbonConfig` |
| 34 | 32 | 200 | GET | `/v2/proxy/device/findDeviceDynamicProxies` |
| 34 | 29 | 200 | GET | `/v2/cost/costmanagement/getRegionSupportV2` |
| 34 | 29 | 200 | GET | `/v2/cost/costmanagement/getCityAgent` |
| 33 | 29 | 200 | GET | `/v2/proxy/device/getCloudBrowserSupport` |
| 31 | 29 | 200 | POST | `/v2/team/member/myInfo` |
| 31 | 27 | - | GET | `/v2/plugin/getPluginCategoryGroupCrxList` |
| 31 | 8 | 200 | POST | `/v2/newbrowser/getrecycleshoplist` |
| 30 | 29 | 200 | GET | `/v2/cost/costmanagement/getorderinfo` |
| 30 | 25 | - | GET | `/v2/plugin/getPluginCrxUserList` |
| 30 | 29 | 200 | POST | `/v2/team/member/info` |
| 29 | 25 | - | GET | `/v2/plugin/getPluginCrxList` |
| 26 | 85 | 200 | POST | `/v2/newbrowser/migrate/searchuuid` |
| 25 | 23 | 200 | GET | `/v2/plugin/findPluginCompanies` |
| 24 | 22 | 200 | POST | `/v2/team/company/user/devices` |
| 22 | 20 | 200 | POST | `/v2/logs/auth/options` |
| 21 | 19 | 200 | POST | `/v2/team/myCompanies` |
| 21 | 19 | 200 | POST | `/v2/team/right/list` |
| 21 | 19 | 200 | POST | `/v2/team/auth/myRights` |
| 20 | 5 | 200 | GET | `/v2/rpa/getRpaTaskLog` |
| 20 | 18 | 200 | POST | `/v2/admin/device/third-proxy/page` |
| 20 | 18 | 200 | POST | `/v2/message/message-type/page` |
| 19 | 17 | 200 | POST | `/v2/team/right/listTemplate` |
| 18 | 15 | 200 | POST | `/v2/team/company/getRoleDepartmentMeal` |
| 17 | 16 | 200 | GET | `/v2/team/authentication/check` |
| 17 | 16 | 200 | GET | `/v2/team/authentication/get` |
| 17 | 16 | 200 | GET | `/v2/team/authentication/companyFourElementsFaceCheck` |
| 17 | 14 | 200 | GET | `/v2/sso/getUserPlatforms` |
| 16 | 14 | 200 | GET | `/v2/team/plugin/newestPlugins` |
| 16 | 14 | 200 | POST | `/v2/team/role-group/page` |
| 14 | 11 | - | GET | `/v2/plugin/getPluginCategoryGroupList` |
| 12 | 10 | 0 | GET | `/v2/rpa/getRpaShopGroupList` |
| 12 | 11 | 200 | POST | `/v2/team/sidebar/get` |
| 11 | 10 | 200 | GET | `/v2/rpa/findRpaGroup` |
| 10 | 9 | 200 | GET | `/v2/cost/costmanagement/quick` |
| 10 | 9 | 200 | GET | `/v2/cost/costmanagement/user_coupons_event_list` |
| 9 | 8 | 200 | POST | `/v2/sso/mp/qrCode` |
| 9 | 8 | 200 | POST | `/v2/newbrowser/getUserPasswordRecycleList` |
| 8 | 6 | - | GET | `/v2/plugin/getPluginHeatSearchesList` |
| 8 | 7 | 200 | POST | `/v2/newbrowser/cloud-accounts/num-vis` |
| 8 | 6 | 200 | POST | `/v2/message/user-notice/noticeRed` |
| 7 | 6 | 200 | POST | `/v2/newbrowser/cloud-accounts/getiduserlist` |
| 7 | 6 | 200 | POST | `/v2/newbrowser/cloud-accounts/free/shop/get` |
| 7 | 6 | 200 | POST | `/v2/newbrowser/cloud-accounts/client-num/get` |
| 6 | 5 | 200 | POST | `/v2/proxy/device/findDesignateDevices` |
| 6 | 5 | 200 | GET | `/v2/cost/costmanagement/getRegionSupport` |
| 6 | 5 | 200 | GET | `/v2/cost/device/cart_find` |
| 6 | 5 | 200 | POST | `/v2/newbrowser/cloud-accounts/popup/get` |
| 6 | 5 | 200 | POST | `/v2/newbrowser/cloud-accounts/open/token/get` |
| 5 | 4 | 200 | POST | `/v2/newbrowser/cloud-accounts/getshopfromproxy` |
| 5 | 4 | - | GET | `/v2/retail/getRetailWithdrawLogList` |
| 5 | 4 | - | GET | `/v2/retail/frozenList` |
| 5 | 4 | 200 | POST | `/v2/newbrowser/getpackageinfo` |
| 5 | 4 | 200 | POST | `/v2/newbrowser/account-users/get` |
| 5 | 16 | - | GET | `/v2/plugin/group/gitPluginGroupList` |
| 2 | 1 | - | POST | `/v2/check/checkproxy` |

## Proven Request Contracts

## RPA Lookup Chains

Two RPA routes take a foreign key that is easy to confuse with an environment id. Both were proven
live against the second account and replayed against the reference account:

| Client read | Supply | Then call | Wrong id gives |
| --- | --- | --- | --- |
| `GET /v2/rpa/getRpaShopList` (GET; POST answers 404) | a row's `shopId` | `GET /v2/rpa/findRpaShop?shopId=...` | an environment `shopid` -> `404 record not found` |
| `GET /v2/rpa/getRpaPlanManagementList` | a row's `planId` | `GET /v2/rpa/findRpaPlanManagement?planId=...` | a missing plan -> `404`, but the route still answers 200 with an empty list |

`getRpaShopList` returns 23 rows while `findRpaShop` answered 49-56 field paths; both are verified on
the reference account as well, so the chain is reproducible without the second account.


Read from the deployed client call sites (`client-params.json`) and confirmed live on the second account:

| Route | Proven request fields |
| --- | --- |
| `POST /v2/newbrowser/cloud-accounts/finger/get` | `shopid` |
| `POST /v2/rpa/getRpaPlanManagementList` | `userId`, `executeType`, `accountIds`, `pageIndex`, `pageSize`, `executeFrequency`, `rdeviceId`, `executeTypes` |
| `GET /v2/rpa/getRpaCarbonConfigList` | `groupId`, `rpaName`, `pageIndex`, `pageSize` |
| `POST /v2/team/getMembers` | `pageSize`, `pageIndex`, `leave`, `name` |
| `POST /v2/news/show/help/list` | `categoryId`, `page`, `pageSize` |
| `GET /v2/rpa/findRpaCarbonConfig` | `configId` |
| `GET /v2/proxy/device/findDeviceDynamicProxies` | `trademark`, `proxy_type`, `page`, `per_page`, `serial`, `name`, `isBind`, `ip_place`, `userid`, `companyid`, `status`, `isCycle` |
| `POST /v2/newbrowser/getrecycleshoplist` | `categoryId`, `accountName`, `page`, `pageSize`, `transfers` |
| `GET /v2/plugin/getPluginCrxList` | `onlyInstall`, `catTypeId`, `catPlatformId`, `pageIndex`, `pageSize`, `orderBy`, `name`, `kernel` |
| `POST /v2/newbrowser/migrate/searchuuid` | `uuids`, `pageSize` |
| `GET /v2/plugin/findPluginCompanies` | `pluginId`, `pluginCompanyId` |
| `GET /v2/rpa/getRpaTaskLog` | `id` |
| `POST /v2/newbrowser/cloud-accounts/getiduserlist` | `deviceid`, `company`, `companyid`, `userid`, `selfid` |
| `POST /v2/newbrowser/cloud-accounts/getshopfromproxy` | `company`, `companyid`, `userid`, `deviceid`, `offer`, `number` |
| `POST /v2/newbrowser/account-users/get` | `accountIds` |
