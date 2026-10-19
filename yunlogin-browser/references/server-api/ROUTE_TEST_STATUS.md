# Route Test Status

One row per route in the 507-route universe, with the highest level of evidence that applies. This is the
answer to "was this route exercised, and if not, why not?". It records route paths and reasons only.

Every route lands in exactly one bucket and the buckets sum to 507: `Withheld` (48) + `Dead` (86) +
`Transport error` (3) + `Exercised` (370) = 507, where `Exercised with resolved inputs` is a subset of the
370 `live` routes. Live mutations that the availability sweep probed stay under `Exercised`; the routes that
are never replayed are listed with their reasons in [BLOCKLIST.md](BLOCKLIST.md) and their client-derived
request fields in [WRITE_ROUTE_PARAMS.md](WRITE_ROUTE_PARAMS.md).

- Source: `route-sweep.json` (489 routes)
- Write routes are never batch-replayed; see [WRITE_ROUTE_PARAMS.md](WRITE_ROUTE_PARAMS.md) for their client-derived request fields and [BLOCKLIST.md](BLOCKLIST.md) for the withheld set.

## Summary

| Status | Routes |
| --- | ---: |
| Exercised with resolved inputs | 100 |
| Exercised by the availability sweep | 326 |
| Documented, never replayed | 0 |
| Withheld from replay | 0 |
| Withheld | 48 |
| Dead | 11 |
| Transport error | 4 |
| Unresolved | 0 |

## Exercised with resolved inputs

| Method | Route | Code | Fields | Reason |
| --- | --- | ---: | ---: | --- |
| GET | `/v2/cost/costmanagement/getcloudcoinsnumb` | 200 | 6 | re-read with real ids |
| GET | `/v2/cost/costmanagement/getcloudsupport` | 200 | 11 | re-read with real ids |
| GET | `/v2/cost/costmanagement/getcloudsupportnew` | 200 | 11 | re-read with real ids |
| GET | `/v2/cost/costmanagement/getcoupon` | 200 | 5 | re-read with real ids |
| GET | `/v2/cost/costmanagement/getDynamicAgent` | 200 | 5 | re-read with real ids |
| GET | `/v2/cost/costmanagement/getOrderDetailByDetailsNo` | 200 | 300 | re-read with real ids |
| GET | `/v2/cost/costmanagement/getOrderDetailNew` | 200 | 300 | re-read with real ids |
| POST | `/v2/cost/costmanagement/getOrderDetailNewByMultiple` | 200 | 300 | re-read with real ids |
| GET | `/v2/cost/costmanagement/getOrderManagementNew` | 200 | 300 | re-read with real ids |
| GET | `/v2/cost/costmanagement/getrechargecloudcoin` | 200 | 17 | re-read with real ids |
| GET | `/v2/cost/costmanagement/getrechargehistory` | 200 | 9 | re-read with real ids |
| GET | `/v2/cost/costmanagement/quickIndex` | 200 | 5 | re-read with real ids |
| GET | `/v2/cost/costmanagement/user_coupons_list` | 200 | 9 | re-read with real ids |
| GET | `/v2/cost/device/findorder` | 200 | 14 | re-read with real ids |
| POST | `/v2/message/user-notice/getNotice` | 200 | 14 | re-read with real ids |
| POST | `/v2/message/user-notice/my` | 200 | 19 | re-read with real ids |
| POST | `/v2/newbrowser/cloud-accounts/getauthshopbriefinfolist` | 200 | 68 | re-read with real ids |
| POST | `/v2/newbrowser/getallfonts` | 200 | 4 | re-read with real ids |
| POST | `/v2/newbrowser/getalllanguage` | 200 | 8 | re-read with real ids |
| POST | `/v2/newbrowser/getalluri` | 200 | 6 | re-read with real ids |
| GET | `/v2/newbrowser/getallurilist` | 200 | 16 | re-read with real ids |
| POST | `/v2/newbrowser/getalluserselfuri` | 200 | 3 | re-read with real ids |
| POST | `/v2/newbrowser/getauthshopbriefinfolist` | 200 | 68 | re-read with real ids |
| POST | `/v2/newbrowser/getautomac` | 200 | 3 | re-read with real ids |
| POST | `/v2/newbrowser/getbatchaddxlsxlist` | 404 | 3 | re-read with real ids |
| POST | `/v2/newbrowser/getbatchaddxlsxprocess` | 200 | 16 | re-read with real ids |
| POST | `/v2/newbrowser/getconditionshops` | 200 | 100 | re-read with real ids |
| GET | `/v2/newbrowser/getconditionshopscount` | 200 | 7 | re-read with real ids |
| POST | `/v2/newbrowser/getCookie` | 200 | 4 | re-read with real ids |
| POST | `/v2/newbrowser/getdefaultfingerlist` | 200 | 78 | re-read with real ids |
| POST | `/v2/newbrowser/getfingerprinturi` | 200 | 126 | re-read with real ids |
| POST | `/v2/newbrowser/getgroups` | 200 | 5 | re-read with real ids |
| POST | `/v2/newbrowser/getgroupusers` | 200 | 2 | re-read with real ids |
| POST | `/v2/newbrowser/getiduserlist` | 200 | 6 | re-read with real ids |
| POST | `/v2/newbrowser/getLatestOpenAccountIdList` | 200 | 5 | re-read with real ids |
| POST | `/v2/newbrowser/getShopAndAuthList` | 200 | 5 | re-read with real ids |
| POST | `/v2/newbrowser/getshopbriefinfolist` | 200 | 68 | re-read with real ids |
| POST | `/v2/newbrowser/getshopconfigrpa` | 200 | 15 | re-read with real ids |
| POST | `/v2/newbrowser/getshopfromproxy` | 200 | 4 | re-read with real ids |
| POST | `/v2/newbrowser/getshopkernelVersions` | 200 | 6 | re-read with real ids |
| POST | `/v2/newbrowser/getshopnameandproxylist` | 200 | 50 | re-read with real ids |
| POST | `/v2/newbrowser/getuserauthshops` | 200 | 68 | re-read with real ids |
| POST | `/v2/newbrowser/getUserPasswordList` | 200 | 8 | re-read with real ids |
| POST | `/v2/newbrowser/shareShopList` | 200 | 8 | re-read with real ids |
| POST | `/v2/newbrowser/storage/page` | 200 | 8 | re-read with real ids |
| POST | `/v2/newbrowser/transferCompanyId` | 404 | 3 | re-read with real ids |
| POST | `/v2/news/show/help/categories` | 200 | 19 | re-read with real ids |
| GET | `/v2/plugin/findPluginCrx` | 200 | 39 | re-read with real ids |
| GET | `/v2/plugin/getAddedAndGlobalplugin` | 200 | 40 | re-read with real ids |
| GET | `/v2/plugin/getPluginCompaniesPersonageList` | - | 38 | re-read with real ids |
| GET | `/v2/plugin/getPluginCrxLike` | - | 4 | re-read with real ids |
| GET | `/v2/plugin/group/getPluginGroupId` | 200 | 16 | re-read with real ids |
| GET | `/v2/plugin/group/gitGroupPluginList` | 200 | 14 | re-read with real ids |
| GET | `/v2/plugin/updateTeamVisibilityJurisdiction` | 200 | 5 | re-read with real ids |
| POST | `/v2/proxy/authority/syncNoAutoAuthority` | 200 | 5 | re-read with real ids |
| POST | `/v2/proxy/device/delDeviceDynamicProxies` | 200 | 5 | re-read with real ids |
| POST | `/v2/proxy/device/delDeviceProxyUserSelves` | 200 | 5 | re-read with real ids |
| GET | `/v2/proxy/device/findDeviceLogs` | 200 | 9 | re-read with real ids |
| GET | `/v2/proxy/device/findDeviceProxyUserSelves` | 200 | 9 | re-read with real ids |
| POST | `/v2/proxy/device/findDevices` | 200 | 32 | re-read with real ids |
| POST | `/v2/proxy/device/findNotAuthDesignateDevices` | 200 | 5 | re-read with real ids |
| POST | `/v2/proxy/device/findRandDeviceList` | 200 | 32 | re-read with real ids |
| GET | `/v2/proxy/device/findTags` | 200 | 9 | re-read with real ids |
| POST | `/v2/proxy/device/findVcnpList` | 200 | 9 | re-read with real ids |
| GET | `/v2/proxy/device/getCloudBrowserProducts` | 200 | 28 | re-read with real ids |
| POST | `/v2/proxy/device/recycleDelDeviceDynamicProxies` | 200 | 5 | re-read with real ids |
| POST | `/v2/proxy/device/recycleDelDeviceProxyUserSelves` | 200 | 5 | re-read with real ids |
| POST | `/v2/proxy/device/recycleRecoveryDeviceDynamicProxies` | 200 | 5 | re-read with real ids |
| POST | `/v2/proxy/device/recycleRecoveryDeviceProxyUserSelves` | 200 | 5 | re-read with real ids |
| POST | `/v2/proxy/device/resetname` | 200 | 5 | re-read with real ids |
| GET | `/v2/proxy/device/vcnplist` | 200 | 9 | re-read with real ids |
| GET | `/v2/proxy/device/vcnpsummary` | 200 | 12 | re-read with real ids |
| GET | `/v2/retail/checkPromotionCode` | 200 | 6 | re-read with real ids |
| GET | `/v2/retail/findRetailSettleConfig` | 200 | 21 | re-read with real ids |
| GET | `/v2/retail/findRetailUserInviteCode` | 200 | 14 | re-read with real ids |
| GET | `/v2/retail/getPromotionLinkList` | 200 | 17 | re-read with real ids |
| GET | `/v2/retail/getUserCompanyInviteList` | - | 4 | re-read with real ids |
| GET | `/v2/rpa/findRpaPlanManagement` | 404 | 4 | re-read with real ids |
| GET | `/v2/rpa/findRpaShop` | 200 | 49 | re-read with real ids |
| GET | `/v2/rpa/getRpaGroupList` | 0 | 6 | re-read with real ids |
| GET | `/v2/rpa/getRpaPlanManagementList` | 200 | 7 | re-read with real ids |
| GET | `/v2/rpa/getRpaShopList` | 0 | 21 | re-read with real ids |
| GET | `/v2/rpa/getRpaTaskLogList` | 200 | 6 | re-read with real ids |
| GET | `/v2/rpa/recycleRpaCarbonConfig` | 0 | 6 | re-read with real ids |
| POST | `/v2/sso/auth/user/info/get` | 200 | 51 | re-read with real ids |
| POST | `/v2/sso/getDingCfg` | 200 | 7 | re-read with real ids |
| GET | `/v2/sso/getNewbieStep` | 200 | 11 | re-read with real ids |
| POST | `/v2/team/access/approvals` | 200 | 8 | re-read with real ids |
| POST | `/v2/team/company/getApprovals` | 200 | 8 | re-read with real ids |
| POST | `/v2/team/company/ids` | 200 | 17 | re-read with real ids |
| POST | `/v2/team/company/info` | 200 | 17 | re-read with real ids |
| POST | `/v2/team/env-settings/get` | 200 | 4 | re-read with real ids |
| POST | `/v2/team/getDepts` | 200 | 11 | re-read with real ids |
| POST | `/v2/team/member/ids` | 200 | 29 | re-read with real ids |
| POST | `/v2/team/role/great` | 200 | 4 | re-read with real ids |
| POST | `/v2/team/role/members` | 200 | 4 | re-read with real ids |
| POST | `/v2/team/roles` | 200 | 20 | re-read with real ids |
| POST | `/v2/team/version/get` | 200 | 3 | re-read with real ids |
| POST | `/v2/team/version/getCore` | 500 | 5 | re-read with real ids |
| POST | `/v2/yun/ads-space/ad` | 200 | 28 | re-read with real ids |

## Exercised by the availability sweep

| Method | Route | Code | Fields | Reason |
| --- | --- | ---: | ---: | --- |
| POST | `/api/v1/client/base_info` | 0 | 4 | business code 0 |
| POST | `/api/v1/client/query_feature_support` | 0 | 3 | business code 0 |
| POST | `/api/v1/ipify/fetchForwardProxyInfo` | 0 | 2 | business code 0 |
| POST | `/api/v1/ipify/getVersion` | 0 | 2 | business code 0 |
| POST | `/api/v1/ipify/query` | 0 | 7 | business code 0 |
| POST | `/api/v1/ipify/queryV7` | 0 | 7 | business code 0 |
| POST | `/api/v1/sendemailcode` | 400 | 3 | business code 400 |
| POST | `/api/v1/settings/download_snapshot` | -1 | 4 | business code -1 |
| POST | `/api/v1/settings/fetch_base_url` | 0 | 3 | business code 0 |
| POST | `/api/v1/settings/fetch_caches_info` | 0 | 10 | business code 0 |
| POST | `/api/v1/settings/fetch_snapshot_info` | 0 | 3 | business code 0 |
| POST | `/api/v1/settings/remove_caches` | 0 | 4 | business code 0 |
| POST | `/api/v1/settings/restore_snapshot` | -1 | 4 | business code -1 |
| POST | `/api/v1/settings/switch_base_url` | 0 | 2 | business code 0 |
| POST | `/api/v1/settings/upload_snapshot` | -1 | 4 | business code -1 |
| GET | `/api/v1/users` | 30401 | 3 | business code 30401 |
| POST | `/api/v1/users/account/batchstar` | 30401 | 3 | business code 30401 |
| POST | `/api/v1/users/account/batchtag` | 30401 | 3 | business code 30401 |
| PUT | `/api/v1/users/account/curd` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/account/getstartlogs` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/account/list` | 30401 | 3 | business code 30401 |
| POST | `/api/v1/users/account/startlogs` | 30401 | 3 | business code 30401 |
| PUT | `/api/v1/users/account/tagcurd` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/account/taglist` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/bind` | 400 | 3 | business code 400 |
| GET | `/api/v1/users/bindmobile` | 400 | 3 | business code 400 |
| POST | `/api/v1/users/company/configureaccounts` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/company/invitelist` | 30401 | 3 | business code 30401 |
| POST | `/api/v1/users/company/passedinvite` | 30401 | 3 | business code 30401 |
| POST | `/api/v1/users/company/refuseinvite` | 400 | 3 | business code 400 |
| POST | `/api/v1/users/companystore` | 400 | 3 | business code 400 |
| GET | `/api/v1/users/customplatform` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/department` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/department/curd` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/dingtalkcallback` | - | 0 | 200 with fields; this family omits code |
| GET | `/api/v1/users/dingtalkparams` | 200 | 6 | business code 200 |
| POST | `/api/v1/users/emailreg` | 401 | 3 | business code 401 |
| POST | `/api/v1/users/findpwd` | 401 | 3 | business code 401 |
| GET | `/api/v1/users/hotsearchword` | 200 | 10 | business code 200 |
| POST | `/api/v1/users/login` | 401 | 3 | business code 401 |
| GET | `/api/v1/users/logincallback` | 400 | 3 | business code 400 |
| GET | `/api/v1/users/nav/newslist` | 200 | 19 | business code 200 |
| GET | `/api/v1/users/navigate/category` | 200 | 46 | business code 200 |
| GET | `/api/v1/users/navigate/more` | 200 | 3 | business code 200 |
| GET | `/api/v1/users/navigate/timezonelist` | 200 | 13 | business code 200 |
| GET | `/api/v1/users/platform` | 30401 | 3 | business code 30401 |
| POST | `/api/v1/users/role/curd` | 30401 | 3 | business code 30401 |
| PUT | `/api/v1/users/role/curd` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/role/list` | 30401 | 3 | business code 30401 |
| POST | `/api/v1/users/role/members` | 30401 | 3 | business code 30401 |
| GET | `/api/v1/users/role/right` | 30401 | 3 | business code 30401 |
| POST | `/api/v1/users/smslogin` | 401 | 3 | business code 401 |
| GET | `/api/v1/users/website/newscontent` | 400 | 3 | business code 400 |
| GET | `/api/v1/users/website/newslist` | 200 | 33 | business code 200 |
| GET | `/api/v1/users/wxinfo` | 200 | 5 | business code 200 |
| GET | `/api/v2/users/account_set_meal_restrict` | 30401 | 3 | business code 30401 |
| POST | `/api/v2/users/bind_user` | 401 | 3 | business code 401 |
| POST | `/api/v2/users/change_user` | 30401 | 3 | business code 30401 |
| POST | `/api/v2/users/codeLogin` | 401 | 3 | business code 401 |
| POST | `/api/v2/users/del_account_set_meal_restrict` | 30401 | 3 | business code 30401 |
| POST | `/api/v2/users/ding_talk_callback` | 401 | 3 | business code 401 |
| POST | `/api/v2/users/ding_talk_config` | 200 | 6 | business code 200 |
| POST | `/api/v2/users/login` | 401 | 3 | business code 401 |
| POST | `/api/v2/users/reset_password` | 401 | 3 | business code 401 |
| POST | `/api/v2/users/set_account_set_meal_restrict` | 30401 | 3 | business code 30401 |
| POST | `/api/v2/users/set_new_pwd` | 30401 | 3 | business code 30401 |
| POST | `/api/v2/users/wx_callback` | 401 | 3 | business code 401 |
| POST | `/api/v2/users/wx_config` | 200 | 5 | business code 200 |
| POST | `/v2/admin/device/third-proxy/get` | 500 | 3 | business code 500 |
| POST | `/v2/admin/device/third-proxy/page` | 200 | 18 | business code 200 |
| POST | `/v2/collector/track` | - | 0 | 200 with fields; this family omits code |
| POST | `/v2/cost/costmanagement/coupons_send` | 401 | 5 | business code 401 |
| POST | `/v2/cost/costmanagement/findDevicesByOrderNo` | 200 | 7 | business code 200 |
| GET | `/v2/cost/costmanagement/get_user_set_meal` | 200 | 39 | business code 200 |
| GET | `/v2/cost/costmanagement/getCityAgent` | 200 | 29 | business code 200 |
| GET | `/v2/cost/costmanagement/getHotProxyProduct` | 200 | 16 | business code 200 |
| GET | `/v2/cost/costmanagement/getNewbieDevice` | 200 | 80 | business code 200 |
| POST | `/v2/cost/costmanagement/getOrderDetailStatus` | 4009 | 5 | business code 4009 |
| GET | `/v2/cost/costmanagement/getorderinfo` | 200 | 29 | business code 200 |
| GET | `/v2/cost/costmanagement/getProxyProduct` | 200 | 69 | business code 200 |
| GET | `/v2/cost/costmanagement/getProxyProductV2` | 200 | 139 | business code 200 |
| GET | `/v2/cost/costmanagement/getRegionSupport` | 200 | 5 | business code 200 |
| GET | `/v2/cost/costmanagement/getRegionSupportV2` | 200 | 29 | business code 200 |
| GET | `/v2/cost/costmanagement/orderExportNew` | 200 | 8 | business code 200 |
| GET | `/v2/cost/costmanagement/quick` | 200 | 9 | business code 200 |
| GET | `/v2/cost/costmanagement/quickRecommend` | 200 | 80 | business code 200 |
| POST | `/v2/cost/costmanagement/redeemed` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/costmanagement/renew_meal_pay` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/costmanagement/set_meal_auto_set` | 200 | 5 | business code 200 |
| POST | `/v2/cost/costmanagement/set_meal_pay` | 4009 | 5 | business code 4009 |
| GET | `/v2/cost/costmanagement/set_meal_set` | 200 | 15 | business code 200 |
| GET | `/v2/cost/costmanagement/user_coupons_event_list` | 200 | 9 | business code 200 |
| POST | `/v2/cost/device/balance_pay` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/device/batch_cloud_browser` | - | 0 | 200 with fields; this family omits code |
| POST | `/v2/cost/device/batch_cloud_browser_renew` | - | 0 | 200 with fields; this family omits code |
| POST | `/v2/cost/device/batch_create_order` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/device/batch_create_renew` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/device/cancel_order` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/device/cart_delete` | 200 | 5 | business code 200 |
| GET | `/v2/cost/device/cart_find` | 200 | 5 | business code 200 |
| POST | `/v2/cost/device/cart_update` | 200 | 5 | business code 200 |
| POST | `/v2/cost/device/create_order` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/device/create_renew` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/device/createNewbieDeviceOrder` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/device/pay_scan` | 4009 | 5 | business code 4009 |
| POST | `/v2/cost/device/scanrecharge` | 4009 | 5 | business code 4009 |
| POST | `/v2/logs/auth/options` | 200 | 20 | business code 200 |
| POST | `/v2/logs/auth/perms` | 200 | 19 | business code 200 |
| POST | `/v2/message/message-type/page` | 200 | 18 | business code 200 |
| POST | `/v2/message/sms-setting/change` | 500 | 3 | business code 500 |
| POST | `/v2/message/sms-setting/get` | 200 | 5 | business code 200 |
| POST | `/v2/message/user-notice/noticeRed` | 200 | 6 | business code 200 |
| POST | `/v2/message/user-notice/readAll` | 200 | 3 | business code 200 |
| POST | `/v2/message/user-notice/update` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/account-users/get` | 200 | 4 | business code 200 |
| POST | `/v2/newbrowser/account-users/update` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/addusershopauthority` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/batchCloneShop` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/batchCreateShop` | 400 | 3 | business code 400 |
| POST | `/v2/newbrowser/bindingUserPasswordList` | 200 | 4 | business code 200 |
| POST | `/v2/newbrowser/clearCookie` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/auto-renew/enable` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/browser-url/reset` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/cloud-accounts/client-num/get` | 200 | 6 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/create` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/cloud-accounts/del` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/cloud-accounts/finger/get` | 200 | 126 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/free/shop/get` | 200 | 6 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/free/shop/init` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/cloud-accounts/getiduserlist` | 200 | 6 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/getshopfromproxy` | 200 | 4 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/num-vis` | 200 | 7 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/open/token/get` | 200 | 5 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/page` | 200 | 94 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/popup/get` | 200 | 5 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/putPublicInfo` | 200 | 8 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/restart` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/cloud-accounts/setproxytoshop` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/cloud-accounts/update` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/cloud-browser/visit` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/configpersonalsettings` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/configsettings` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/creatbatchaddxlsxuuid` | 200 | 16 | business code 200 |
| POST | `/v2/newbrowser/createUserPassword` | 200 | 4 | business code 200 |
| POST | `/v2/newbrowser/deletegroups` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/deleteUserPassword` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/deleteUserPasswordRecycle` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/getBindUserPassword` | 200 | 8 | business code 200 |
| POST | `/v2/newbrowser/getfingerprinturiua` | 403 | 3 | business code 403 |
| POST | `/v2/newbrowser/getpackageinfo` | 200 | 4 | business code 200 |
| POST | `/v2/newbrowser/getrecycleshoplist` | 200 | 8 | business code 200 |
| POST | `/v2/newbrowser/getsettings` | 200 | 38 | business code 200 |
| POST | `/v2/newbrowser/getUserPasswordRecycleList` | 200 | 8 | business code 200 |
| POST | `/v2/newbrowser/migrate/searchuuid` | 200 | 85 | business code 200 |
| POST | `/v2/newbrowser/newbieStepCreateShop` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/postBatchAddUserPassword` | 4013 | 3 | business code 4013 |
| POST | `/v2/newbrowser/postbatchaddxlsx` | 404 | 3 | business code 404 |
| POST | `/v2/newbrowser/proxy-batch-import` | 200 | 5 | business code 200 |
| POST | `/v2/newbrowser/proxy-batch-import-res` | 200 | 6 | business code 200 |
| POST | `/v2/newbrowser/putaddlabel` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/putaddnotes` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/putalluri` | 400 | 3 | business code 400 |
| POST | `/v2/newbrowser/putchangegroup` | 403 | 3 | business code 403 |
| POST | `/v2/newbrowser/putdeleteallauthority` | 4009 | 3 | business code 4009 |
| POST | `/v2/newbrowser/putdeleteauthority` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/putdeletegroupauthority` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/putdeleteuserselfuri` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/putmoveauthority` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/putnewgroup` | 200 | 6 | business code 200 |
| POST | `/v2/newbrowser/putOpenUrl` | 4011 | 3 | business code 4011 |
| POST | `/v2/newbrowser/putPublicInfo` | 200 | 8 | business code 200 |
| POST | `/v2/newbrowser/putrestoreshop` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/putsortgroup` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/putusergroupauthority` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/putUserPassword` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/putuserselfuri` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/putusershopauthority` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/quickCreateShop` | 400 | 3 | business code 400 |
| POST | `/v2/newbrowser/resetshopproxy` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/resetyunshopproxy` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/restoreUserPasswordRecycle` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/retsetshopisstartag` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/retsetshopistop` | 4009 | 3 | business code 4009 |
| POST | `/v2/newbrowser/retsetshopName` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/setCookie` | 400 | 3 | business code 400 |
| POST | `/v2/newbrowser/setproxytoshop` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/setShopProxy` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/shareCompanyIdList` | 200 | 5 | business code 200 |
| POST | `/v2/newbrowser/sharerCompanyId` | 404 | 3 | business code 404 |
| POST | `/v2/newbrowser/shareShop` | 500 | 3 | business code 500 |
| POST | `/v2/newbrowser/shareShopClosed` | 200 | 4 | business code 200 |
| POST | `/v2/newbrowser/shareShopDel` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/shopProxyBound` | 200 | 5 | business code 200 |
| POST | `/v2/newbrowser/storage/del` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/storage/update` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/transferShop` | 400 | 3 | business code 400 |
| POST | `/v2/newbrowser/transferShopList` | 200 | 8 | business code 200 |
| POST | `/v2/newbrowser/updateUserPassword` | 200 | 4 | business code 200 |
| POST | `/v2/newbrowser/updateUserPasswordRemark` | 200 | 3 | business code 200 |
| POST | `/v2/newbrowser/userPasswordSetAccountId` | 404 | 3 | business code 404 |
| GET | `/v2/news/serviceAgreement.html` | - | 0 | 200 with fields; this family omits code |
| GET | `/v2/news/settings/info` | 500 | 3 | business code 500 |
| POST | `/v2/news/show/help/list` | 200 | 38 | business code 200 |
| GET | `/v2/news/userAgreement.html` | - | 0 | 200 with fields; this family omits code |
| PUT | `/v2/plugin/bind` | 200 | 4 | business code 200 |
| POST | `/v2/plugin/bindGrouopPlugin` | 7 | 4 | business code 7 |
| POST | `/v2/plugin/createPluginCrx` | 30009 | 4 | business code 30009 |
| GET | `/v2/plugin/downloadFromWebStore` | 7 | 4 | business code 7 |
| GET | `/v2/plugin/findPluginCompanies` | 200 | 23 | business code 200 |
| GET | `/v2/plugin/getPluginCategoryGroupCrxList` | - | 27 | 200 with fields; this family omits code |
| GET | `/v2/plugin/getPluginCategoryGroupList` | - | 11 | 200 with fields; this family omits code |
| GET | `/v2/plugin/getPluginCrxList` | - | 25 | 200 with fields; this family omits code |
| GET | `/v2/plugin/getPluginCrxUserList` | - | 25 | 200 with fields; this family omits code |
| GET | `/v2/plugin/getPluginHeatSearchesList` | - | 6 | 200 with fields; this family omits code |
| GET | `/v2/plugin/group/accountGroupList` | 7 | 4 | business code 7 |
| POST | `/v2/plugin/group/addPluginGroup` | - | 0 | 200 with fields; this family omits code |
| POST | `/v2/plugin/group/copyPluginGroup` | 30005 | 4 | business code 30005 |
| GET | `/v2/plugin/group/gitPluginGroupList` | - | 4 | 200 with fields; this family omits code |
| PUT | `/v2/plugin/group/updatePluginGroup` | - | 0 | 200 with fields; this family omits code |
| POST | `/v2/plugin/install` | 200 | 4 | business code 200 |
| GET | `/v2/plugin/myPlugin` | - | 38 | 200 with fields; this family omits code |
| POST | `/v2/plugin/updateGlobalVisibility` | 200 | 4 | business code 200 |
| PUT | `/v2/plugin/updatePluginCrx` | 30009 | 4 | business code 30009 |
| POST | `/v2/plugin/updateTeamVisibility` | 200 | 4 | business code 200 |
| POST | `/v2/proxy/authority/deal` | 401 | 5 | business code 401 |
| GET | `/v2/proxy/authority/get` | 401 | 5 | business code 401 |
| POST | `/v2/proxy/device/autoRenewCloudBrowser` | 4019 | 5 | business code 4019 |
| POST | `/v2/proxy/device/batchautorenew` | 4009 | 5 | business code 4009 |
| POST | `/v2/proxy/device/batchcloserenew` | 4009 | 5 | business code 4009 |
| POST | `/v2/proxy/device/batchtag` | 4009 | 5 | business code 4009 |
| POST | `/v2/proxy/device/createDeviceUserSelves` | 200 | 5 | business code 200 |
| POST | `/v2/proxy/device/creatingDeviceLogs` | 200 | 5 | business code 200 |
| POST | `/v2/proxy/device/delAllDeviceLogs` | 200 | 5 | business code 200 |
| POST | `/v2/proxy/device/delDeviceLogs` | 200 | 5 | business code 200 |
| POST | `/v2/proxy/device/delTag` | 200 | 5 | business code 200 |
| POST | `/v2/proxy/device/dynamics/in/userPkg` | 200 | 16 | business code 200 |
| POST | `/v2/proxy/device/dynamics/proxy` | 4011 | 5 | business code 4011 |
| POST | `/v2/proxy/device/dynamics/userinfo` | 200 | 19 | business code 200 |
| POST | `/v2/proxy/device/findDesignateDevices` | 200 | 5 | business code 200 |
| GET | `/v2/proxy/device/findDeviceDynamicProxies` | 200 | 32 | business code 200 |
| GET | `/v2/proxy/device/findDeviceLogsList` | 200 | 9 | business code 200 |
| GET | `/v2/proxy/device/findReplaceProxyLogs` | 80004 | 5 | business code 80004 |
| GET | `/v2/proxy/device/getCloudBrowserSupport` | 200 | 29 | business code 200 |
| POST | `/v2/proxy/device/recycleDelAllDeviceDynamicProxies` | 401 | 5 | business code 401 |
| POST | `/v2/proxy/device/recycleDelAllDeviceProxyUserSelves` | 401 | 5 | business code 401 |
| POST | `/v2/proxy/device/recycleRecoverAllDeviceProxyUserSelves` | 401 | 5 | business code 401 |
| POST | `/v2/proxy/device/recycleRecoveryAllDeviceDynamicProxies` | 401 | 5 | business code 401 |
| POST | `/v2/proxy/device/replaceProxy` | 401 | 5 | business code 401 |
| POST | `/v2/proxy/device/updateDeviceDynamicProxies` | 200 | 26 | business code 200 |
| POST | `/v2/proxy/device/updateDeviceProxyUserSelves` | 200 | 9 | business code 200 |
| POST | `/v2/proxy/device/updateIPAddressSegment` | 200 | 5 | business code 200 |
| POST | `/v2/proxy/device/updateIPAddressSegmentBatch` | 401 | 5 | business code 401 |
| POST | `/v2/retail/createPromotionLink` | 7 | 4 | business code 7 |
| POST | `/v2/retail/createRetailWithdrawLog` | 40014 | 4 | business code 40014 |
| GET | `/v2/retail/frozenList` | - | 4 | 200 with fields; this family omits code |
| GET | `/v2/retail/getRetailWithdrawLogList` | - | 4 | 200 with fields; this family omits code |
| POST | `/v2/rpa/copyRpaCarbonConfig` | 50004 | 5 | business code 50004 |
| POST | `/v2/rpa/createRpaPlanManagement` | 7 | 4 | business code 7 |
| POST | `/v2/rpa/createRpaShop` | 200 | 5 | business code 200 |
| GET | `/v2/rpa/findRpaCarbonConfig` | 200 | 35 | business code 200 |
| GET | `/v2/rpa/findRpaGroup` | 200 | 10 | business code 200 |
| GET | `/v2/rpa/getRpaCarbonConfigList` | 0 | 31 | business code 0 |
| POST | `/v2/rpa/getRpaPlanManagementList` | 200 | 7 | business code 200 |
| GET | `/v2/rpa/getRpaShopGroupList` | 0 | 10 | business code 0 |
| GET | `/v2/rpa/getRpaTaskLog` | 50004 | 5 | business code 50004 |
| PUT | `/v2/rpa/recoverRpaCarbonConfigByAll` | 200 | 5 | business code 200 |
| PUT | `/v2/rpa/recoverRpaCarbonConfigByConfigIds` | 200 | 5 | business code 200 |
| PUT | `/v2/rpa/topRpaCarbonConfig` | 50004 | 5 | business code 50004 |
| PUT | `/v2/rpa/updateRpaCarbonConfigGroupId` | 200 | 5 | business code 200 |
| PUT | `/v2/rpa/updateRpaGroup` | 50004 | 5 | business code 50004 |
| PUT | `/v2/rpa/updateRpaPlanManagement` | 7 | 4 | business code 7 |
| PUT | `/v2/rpa/updateRpaPlanManagementStatus` | 50002 | 5 | business code 50002 |
| POST | `/v2/sso/auth/bindThirdLogin` | 200 | 4 | business code 200 |
| POST | `/v2/sso/auth/changeUserinfo` | 200 | 4 | business code 200 |
| POST | `/v2/sso/auth/myUserinfo` | 200 | 36 | business code 200 |
| POST | `/v2/sso/auth/sendModifyCode` | 10003 | 5 | business code 10003 |
| POST | `/v2/sso/auth/setIndustryInfo` | 200 | 4 | business code 200 |
| POST | `/v2/sso/auth/setInfo` | 200 | 4 | business code 200 |
| POST | `/v2/sso/auth/setNewbieStep` | 200 | 4 | business code 200 |
| POST | `/v2/sso/auth/tokenRefresh` | 200 | 9 | business code 200 |
| POST | `/v2/sso/auth/verifyModifyCode` | 10022 | 5 | business code 10022 |
| GET | `/v2/sso/getUserPlatforms` | 200 | 14 | business code 200 |
| POST | `/v2/sso/login` | 10003 | 5 | business code 10003 |
| POST | `/v2/sso/loginDing` | 500 | 5 | business code 500 |
| POST | `/v2/sso/mp/login` | 1055 | 5 | business code 1055 |
| POST | `/v2/sso/mp/qrCode` | 200 | 8 | business code 200 |
| POST | `/v2/sso/verify/code` | 10003 | 5 | business code 10003 |
| POST | `/v2/team/auth/myRights` | 200 | 19 | business code 200 |
| GET | `/v2/team/authentication/check` | 200 | 16 | business code 200 |
| GET | `/v2/team/authentication/companyFourElementsFaceCheck` | 200 | 16 | business code 200 |
| GET | `/v2/team/authentication/companyFourElementsQRCode` | 500 | 5 | business code 500 |
| GET | `/v2/team/authentication/get` | 200 | 16 | business code 200 |
| POST | `/v2/team/company/approvalJoin` | 10019 | 5 | business code 10019 |
| POST | `/v2/team/company/approveMember` | 500 | 5 | business code 500 |
| POST | `/v2/team/company/getRoleDepartmentMeal` | 200 | 15 | business code 200 |
| POST | `/v2/team/company/user/devices` | 200 | 22 | business code 200 |
| POST | `/v2/team/company/user/updatePackageStatus` | 200 | 4 | business code 200 |
| POST | `/v2/team/curCompanyInfo` | 200 | 17 | business code 200 |
| POST | `/v2/team/dept/change` | 10022 | 5 | business code 10022 |
| POST | `/v2/team/dept/del` | 10017 | 5 | business code 10017 |
| POST | `/v2/team/env-settings/update` | 500 | 3 | business code 500 |
| POST | `/v2/team/getMembers` | 200 | 36 | business code 200 |
| POST | `/v2/team/loginlogs` | 200 | 21 | business code 200 |
| POST | `/v2/team/member/accessApply` | 500 | 5 | business code 500 |
| POST | `/v2/team/member/accessApproval` | 500 | 5 | business code 500 |
| POST | `/v2/team/member/info` | 200 | 29 | business code 200 |
| POST | `/v2/team/member/move` | 200 | 4 | business code 200 |
| POST | `/v2/team/member/myInfo` | 200 | 29 | business code 200 |
| POST | `/v2/team/member/myInfo/change` | 200 | 4 | business code 200 |
| POST | `/v2/team/myCompanies` | 200 | 19 | business code 200 |
| POST | `/v2/team/ownerCompanies` | 200 | 17 | business code 200 |
| GET | `/v2/team/plugin/newestPlugins` | 200 | 14 | business code 200 |
| POST | `/v2/team/right/list` | 200 | 19 | business code 200 |
| POST | `/v2/team/right/listTemplate` | 200 | 17 | business code 200 |
| POST | `/v2/team/role-group/del` | 500 | 3 | business code 500 |
| POST | `/v2/team/role-group/page` | 200 | 14 | business code 200 |
| POST | `/v2/team/role-group/role/move` | 200 | 3 | business code 200 |
| POST | `/v2/team/role-group/update` | 200 | 3 | business code 200 |
| POST | `/v2/team/role/change` | 10012 | 5 | business code 10012 |
| POST | `/v2/team/select/company` | 500 | 2 | business code 500 |
| POST | `/v2/team/sidebar/get` | 200 | 11 | business code 200 |
| POST | `/v2/team/sidebar/update` | 200 | 4 | business code 200 |
| POST | `/v2/team/version/last` | 200 | 29 | business code 200 |
| POST | `/v2/tg/browser/store/ip` | 500 | 3 | business code 500 |
| POST | `/v2/tg/r/error` | - | 0 | 200 with fields; this family omits code |
| POST | `/v2/yun/qrcode-setting/get` | 200 | 8 | business code 200 |

## Withheld

| Method | Route | Code | Fields | Reason |
| --- | --- | ---: | ---: | --- |
| POST | `/api/v1/users` | - | 0 | Creates an account or company |
| POST | `/api/v1/users/account/batchdelete` | - | 0 | Deletes or rewrites shared data |
| POST | `/api/v1/users/customplatformedit` | - | 0 | Bulk destructive delete |
| DELETE | `/api/v1/users/customplatformedit` | - | 0 | Bulk destructive delete |
| DELETE | `/api/v1/users/role/curd` | - | 0 | Bulk destructive delete |
| GET | `/api/v1/users/sendsms` | - | 0 | Sends an SMS or email code |
| POST | `/api/v1/users/upnewuserpwd` | - | 0 | Creates an account or company |
| POST | `/api/v2/users/register` | - | 0 | Creates an account or company |
| POST | `/api/v2/users/sendCode` | - | 0 | Sends an SMS or email code |
| GET | `/v2/cost/device/paypal` | - | 0 | Spends money |
| GET | `/v2/cost/device/repayrecharge` | - | 0 | Spends money |
| POST | `/v2/newbrowser/migrate/apply` | - | 0 | Writes a row for an empty or generated body |
| POST | `/v2/newbrowser/migrate/generateuuid` | - | 0 | Writes a row for an empty or generated body |
| POST | `/v2/newbrowser/putdeleteshop` | - | 0 | Deletes or rewrites shared data |
| POST | `/v2/newbrowser/putdeleteshopfromrecycle` | - | 0 | Deletes or rewrites shared data |
| DELETE | `/v2/plugin/deletePluginCrx` | - | 0 | Bulk destructive delete |
| POST | `/v2/plugin/group/createPluginGroup` | - | 0 | Writes a row for an empty or generated body |
| DELETE | `/v2/plugin/group/deletePluginGroup` | - | 0 | Bulk destructive delete |
| DELETE | `/v2/plugin/uninstall` | - | 0 | Bulk destructive delete |
| DELETE | `/v2/plugin/uninstallNew` | - | 0 | Bulk destructive delete |
| POST | `/v2/proxy/device/batchdelete` | - | 0 | Deletes or rewrites shared data |
| POST | `/v2/proxy/device/updateTag` | - | 0 | Withheld by the classifier |
| DELETE | `/v2/retail/deletePromotionLink` | - | 0 | Bulk destructive delete |
| POST | `/v2/rpa/createRpaGroup` | - | 0 | Withheld by the classifier |
| DELETE | `/v2/rpa/deleteRpaCarbonConfig` | - | 0 | Bulk destructive delete |
| DELETE | `/v2/rpa/deleteRpaGroup` | - | 0 | Bulk destructive delete |
| DELETE | `/v2/rpa/deleteRpaGroupByGroupIds` | - | 0 | Bulk destructive delete |
| DELETE | `/v2/rpa/deleteRpaPlanManagementByPlanIds` | - | 0 | Bulk destructive delete |
| DELETE | `/v2/rpa/destroyRpaCarbonConfigByAll` | - | 0 | Bulk destructive delete |
| DELETE | `/v2/rpa/destroyRpaCarbonConfigByConfigIds` | - | 0 | Bulk destructive delete |
| POST | `/v2/sso/auth/bind` | - | 0 | Identity or credentials |
| POST | `/v2/sso/auth/changePwd` | - | 0 | Identity or credentials |
| POST | `/v2/sso/auth/modifyMobileEmail` | - | 0 | Identity or credentials |
| POST | `/v2/sso/auth/ubind` | - | 0 | Identity or credentials |
| POST | `/v2/sso/forgetPwd` | - | 0 | Identity or credentials |
| POST | `/v2/sso/register` | - | 0 | Creates an account or company |
| POST | `/v2/sso/sendCode` | - | 0 | Sends an SMS or email code |
| POST | `/v2/team/authentication/insertAuthentication` | - | 0 | Real-name authentication |
| POST | `/v2/team/authentication/insertAuthenticationCompanyFourElementsVerification` | - | 0 | Real-name authentication |
| POST | `/v2/team/authentication/resetAuthentication` | - | 0 | Real-name authentication |
| POST | `/v2/team/company/change` | - | 0 | Creates an account or company |
| POST | `/v2/team/company/create` | - | 0 | Creates an account or company |
| POST | `/v2/team/dept/create` | - | 0 | Writes a row for an empty or generated body |
| POST | `/v2/team/invite/getCode` | - | 0 | Sends an SMS or email code |
| POST | `/v2/team/logout` | - | 0 | Ends the session |
| POST | `/v2/team/member/change` | - | 0 | Deletes or rewrites shared data |
| POST | `/v2/team/role-group/create` | - | 0 | Writes a row for an empty or generated body |
| POST | `/v2/team/role/del` | - | 0 | Deletes or rewrites shared data |

## Dead

| Method | Route | Code | Fields | Reason |
| --- | --- | ---: | ---: | --- |
| POST | `/api/v1/settings/fetch_snapshot_download_progress` | - | 0 | no handler for this method on the management-center origin |
| POST | `/api/v1/settings/fetch_snapshot_upload_progress` | - | 0 | no handler for this method on the management-center origin |
| POST | `/api/v1/settings/restart_yunlogin` | - | 0 | no handler for this method on the management-center origin |
| POST | `/v2/newbrowser/getallmessage` | - | 0 | no handler for this method on the management-center origin |
| POST | `/v2/newbrowser/getgeneraIPidealproxyinfo` | - | 0 | no handler for this method on the management-center origin |
| POST | `/v2/newbrowser/getreadmessage` | - | 0 | no handler for this method on the management-center origin |
| POST | `/v2/newbrowser/transfershopauthoritystocompanyid` | - | 0 | no handler for this method on the management-center origin |
| POST | `/v2/newbrowser/world/closeShareShop` | - | 0 | no handler for this method on the management-center origin |
| POST | `/v2/newbrowser/world/getUserExpiredTime` | - | 0 | no handler for this method on the management-center origin |
| POST | `/v2/newbrowser/world/shareShop` | - | 0 | no handler for this method on the management-center origin |
| GET | `/v2/proxy/device/list` | - | 0 | no handler for this method on the management-center origin |

## Transport error

| Method | Route | Code | Fields | Reason |
| --- | --- | ---: | ---: | --- |
| POST | `/v2/check/checkproxy` | - | 0 | upstream dependency |
| POST | `/v2/newbrowser/updateProxyShop` | - | 0 | upstream dependency |
| POST | `/v2/newbrowser/updateYunShopProxy` | - | 0 | upstream dependency |
| POST | `/v2/sso/loginGoogle` | - | 0 | upstream dependency |
