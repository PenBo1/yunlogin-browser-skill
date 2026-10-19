# Server API Full Route Catalog

This catalog is generated from the management-center client bundle, which is the authoritative list of server-side API calls. The earlier `endpoints.json` catalog was a curated subset.

- Source bundle: `https://d126447d359e70c0.yunlogin.com/js/main-1791774737861-10a8673a-104.js`
- Extracted at: 2026-10-12T03:29:08.430Z
- Route entries: 489 (distinct paths: 484)
- Surfaces probed: server=472, client=17 (each row records its `surface`)
- Machine-readable table: [client-routes.json](client-routes.json)
- Machine-readable sweep: [route-sweep.json](route-sweep.json)

## Summary

| Metric | Count |
| --- | ---: |
| Route entries | 489 |
| Routes with a client call site | 354 |
| Defined but never called by the client | 135 |
| Probed live | 426 |
| Skipped (write routes / blocklist) | 48 |
| Dead paths (SPA shell or HTTP 405) | 11 |
| Transport errors | 4 |

HTTP status distribution (live probes): 200×420, 400×1, 500×4, 502×1

Business `code` distribution (live probes): 0×16, 7×6, 200×249, 400×12, 401×19, 403×2, 404×6, 500×25, 1055×1, 4009×18, 4011×2, 4013×1, 4019×1, 10003×3, 10012×1, 10017×1, 10019×1, 10022×2, 30005×1, 30009×2, 30401×26, 40014×1, 50002×1, 50004×4, 80004×1, (none)×21, -1×3

Method distribution: POST×347, GET×116, DELETE×13, PUT×13

Prefix distribution: /v2×409, /api×80

## Surface Split

- `/v2/*`: 409 routes, served as JSON on this origin.
- `/api/*`: 80 routes. These are the legacy/local paths: GET returns the SPA HTML (2053 bytes) and POST/PUT returns HTTP 405, so they are not served as JSON API on this origin.

## Business Code Reference (Expanded)

| Code | Meaning observed |
| ---: | --- |
| `0` | userapi success |
| `7` | missing/invalid parameter |
| `200` | management-center success |
| `400` | validation/decoding error or record not found |
| `401` | missing required identifier / no access |
| `403` | no access permission |
| `404` | record/resource not found |
| `500` | business error |
| `1055` | no scan information received |
| `4009` | invalid request parameters |
| `4011` | retrieval failed |
| `10003` | username must be a registered phone or email |
| `10012` | at least one permission required |
| `10017` | no permission to delete |
| `10022` | no permission to modify |
| `30005` | creation failed |
| `30009` | plugin already exists |
| `50002` | update failed |
| `50004` | retrieval failed |

## Original Catalog Gap

The curated `endpoints.json` catalog contains 54 routes; 54 of them appear in the client bundle. These catalog routes do not appear in the client table (the three 404 routes):


Conversely, the client bundle references hundreds of routes the curated catalog never covered — notably `/v2/cost/*` (billing), `/v2/plugin/*`, `/v2/rpa/*`, and `/v2/team/*`.

## Routes Not Served (HTTP 404)


## Largest Served Responses (Field Research Targets)

| Bytes | Method | Path | Code | Fields |
| ---: | --- | --- | ---: | ---: |
| 747622 | `GET` | `/v2/cost/costmanagement/getcloudsupportnew` | 200 | 11 |
| 549361 | `GET` | `/v2/cost/costmanagement/getProxyProductV2` | 200 | 139 |
| 433087 | `GET` | `/api/v1/users/navigate/category` | 200 | 46 |
| 406541 | `GET` | `/v2/cost/costmanagement/getHotProxyProduct` | 200 | 16 |
| 148065 | `GET` | `/v2/newbrowser/getallurilist` | 200 | 16 |
| 146126 | `GET` | `/v2/cost/costmanagement/getCityAgent` | 200 | 29 |
| 129512 | `GET` | `/v2/cost/costmanagement/getProxyProduct` | 200 | 69 |
| 127708 | `GET` | `/v2/cost/costmanagement/getcloudsupport` | 200 | 11 |
| 106059 | `GET` | `/v2/cost/costmanagement/getNewbieDevice` | 200 | 80 |
| 87197 | `GET` | `/v2/plugin/getPluginCategoryGroupCrxList` |  | 27 |
| 75976 | `POST` | `/v2/news/show/help/list` | 200 | 38 |
| 72165 | `GET` | `/v2/cost/costmanagement/getRegionSupportV2` | 200 | 29 |
| 62085 | `GET` | `/api/v1/users/dingtalkcallback` |  | 0 |
| 53621 | `POST` | `/v2/newbrowser/getdefaultfingerlist` | 200 | 78 |
| 46765 | `GET` | `/v2/cost/costmanagement/quickRecommend` | 200 | 80 |
| 40221 | `POST` | `/v2/team/auth/myRights` | 200 | 19 |
| 40211 | `POST` | `/v2/team/right/list` | 200 | 19 |
| 36598 | `POST` | `/v2/newbrowser/cloud-accounts/page` | 200 | 94 |
| 31684 | `GET` | `/v2/news/serviceAgreement.html` |  | 0 |
| 26213 | `GET` | `/v2/plugin/getPluginCrxList` |  | 25 |

## Full Route Table

`skipped` means the route was cataloged but not executed (write route or blocklist). `live` means it was probed; see `route-sweep.json` for the field paths observed.

| Method | Path | Client name | Status | HTTP | Code | Bytes |
| --- | --- | --- | --- | ---: | ---: | ---: |
| `POST` | `/api/v1/client/base_info` | baseInfo | live | 200 | 0 | 55 |
| `POST` | `/api/v1/client/query_feature_support` | queryFeatureSupport | live | 200 | 0 | 594 |
| `POST` | `/api/v1/ipify/fetchForwardProxyInfo` | getProxyConf | live | 200 | 0 | 21 |
| `POST` | `/api/v1/ipify/getVersion` | getVersionQ7 | live | 200 | 0 | 24 |
| `POST` | `/api/v1/ipify/query` | getProxyPubilcIp | live | 200 | 0 | 111 |
| `POST` | `/api/v1/ipify/queryV7` | getProxyPublicIpV7 | live | 200 | 0 | 111 |
| `POST` | `/api/v1/sendemailcode` | emailyanzhen | live | 200 | 400 | 78 |
| `POST` | `/api/v1/settings/download_snapshot` | downloadSnapshot | live | 200 | -1 | 164 |
| `POST` | `/api/v1/settings/fetch_base_url` | fetchBaseUrl | live | 200 | 0 | 77 |
| `POST` | `/api/v1/settings/fetch_caches_info` | cacheInfo | live | 200 | 0 | 419 |
| `POST` | `/api/v1/settings/fetch_snapshot_download_progress` | fetchSnapshotDownloadProgress | dead | 404 |  | 0 |
| `POST` | `/api/v1/settings/fetch_snapshot_info` | snapshotInfo | live | 200 | 0 | 40 |
| `POST` | `/api/v1/settings/fetch_snapshot_upload_progress` | fetchSnapshotUploadProgress | dead | 404 |  | 0 |
| `POST` | `/api/v1/settings/remove_caches` | removeCache | live | 200 | 0 | 51 |
| `POST` | `/api/v1/settings/restart_yunlogin` | restartYunlogin | dead | 404 |  | 0 |
| `POST` | `/api/v1/settings/restore_snapshot` | restoreSnapshot | live | 200 | -1 | 52 |
| `POST` | `/api/v1/settings/switch_base_url` | switchBaseUrl | live | 200 | 0 | 29 |
| `POST` | `/api/v1/settings/upload_snapshot` | uploadSnapshot | live | 200 | -1 | 192 |
| `GET` | `/api/v1/users` | memberList | live | 200 | 30401 | 92 |
| `POST` | `/api/v1/users` | register | skipped |  |  |  |
| `POST` | `/api/v1/users/account/batchdelete` | deleaccount | skipped |  |  |  |
| `POST` | `/api/v1/users/account/batchstar` | CancelStartargets | live | 200 | 30401 | 92 |
| `POST` | `/api/v1/users/account/batchtag` | bindaccounttag | live | 200 | 30401 | 92 |
| `PUT` | `/api/v1/users/account/curd` | CancelStartarget | live | 200 | 30401 | 92 |
| `GET` | `/api/v1/users/account/getstartlogs` | opened | live | 200 | 30401 | 92 |
| `GET` | `/api/v1/users/account/list` | accountList | live | 200 | 30401 | 92 |
| `POST` | `/api/v1/users/account/startlogs` | openID | live | 200 | 30401 | 92 |
| `PUT` | `/api/v1/users/account/tagcurd` | edittaglist | live | 200 | 30401 | 92 |
| `GET` | `/api/v1/users/account/taglist` | gettaglist | live | 200 | 30401 | 92 |
| `GET` | `/api/v1/users/bind` | userwxmobile | live | 200 | 400 | 42 |
| `GET` | `/api/v1/users/bindmobile` | usersBindmobile | live | 200 | 400 | 194 |
| `POST` | `/api/v1/users/company/configureaccounts` | memberadds | live | 200 | 30401 | 92 |
| `GET` | `/api/v1/users/company/invitelist` | inviteList | live | 200 | 30401 | 92 |
| `POST` | `/api/v1/users/company/passedinvite` | inviteResolve | live | 200 | 30401 | 92 |
| `POST` | `/api/v1/users/company/refuseinvite` | inviteReject | live | 200 | 400 | 42 |
| `POST` | `/api/v1/users/companystore` | companyReg | live | 200 | 400 | 42 |
| `GET` | `/api/v1/users/customplatform` | getplaturl | live | 200 | 30401 | 92 |
| `POST` | `/api/v1/users/customplatformedit` | addplaturl | skipped |  |  |  |
| `DELETE` | `/api/v1/users/customplatformedit` | deleplaturl | skipped |  |  |  |
| `GET` | `/api/v1/users/department` | departList | live | 200 | 30401 | 92 |
| `GET` | `/api/v1/users/department/curd` | departListsearch | live | 200 | 30401 | 92 |
| `GET` | `/api/v1/users/dingtalkcallback` | userDingtalkcallback | live | 200 |  | 62085 |
| `GET` | `/api/v1/users/dingtalkparams` | userDingtalkparams | live | 200 | 200 | 173 |
| `POST` | `/api/v1/users/emailreg` | emailreg | live | 200 | 401 | 78 |
| `POST` | `/api/v1/users/findpwd` | forget | live | 200 | 401 | 78 |
| `GET` | `/api/v1/users/hotsearchword` | navigateHotsearchword | live | 200 | 200 | 886 |
| `POST` | `/api/v1/users/login` | login | live | 200 | 401 | 78 |
| `GET` | `/api/v1/users/logincallback` | wxuserinfo | live | 200 | 400 | 194 |
| `GET` | `/api/v1/users/nav/newslist` | navigateNewslist | live | 200 | 200 | 600 |
| `GET` | `/api/v1/users/navigate/category` | navigateCategory | live | 200 | 200 | 433087 |
| `GET` | `/api/v1/users/navigate/more` | navigateMore | live | 200 | 200 | 41 |
| `GET` | `/api/v1/users/navigate/timezonelist` | navigateTimezonelist | live | 200 | 200 | 1641 |
| `GET` | `/api/v1/users/platform` | platList | live | 200 | 30401 | 92 |
| `POST` | `/api/v1/users/role/curd` | roleAdd | live | 200 | 30401 | 92 |
| `PUT` | `/api/v1/users/role/curd` | roleUpdate | live | 200 | 30401 | 92 |
| `DELETE` | `/api/v1/users/role/curd` | roleRemove | skipped |  |  |  |
| `GET` | `/api/v1/users/role/list` | getRoles | live | 200 | 30401 | 92 |
| `POST` | `/api/v1/users/role/members` | bersrole | live | 200 | 30401 | 92 |
| `GET` | `/api/v1/users/role/right` | rolelist | live | 200 | 30401 | 92 |
| `GET` | `/api/v1/users/sendsms` | getCode | skipped |  |  |  |
| `POST` | `/api/v1/users/smslogin` | smsLogin | live | 200 | 401 | 84 |
| `POST` | `/api/v1/users/upnewuserpwd` | registerlogin | skipped |  |  |  |
| `GET` | `/api/v1/users/website/newscontent` | getNewscontent | live | 200 | 400 | 194 |
| `GET` | `/api/v1/users/website/newslist` | getNewslist | live | 200 | 200 | 12102 |
| `GET` | `/api/v1/users/wxinfo` | wxlogins | live | 200 | 200 | 118 |
| `GET` | `/api/v2/users/account_set_meal_restrict` | succestrict | live | 200 | 30401 | 92 |
| `POST` | `/api/v2/users/bind_user` | newwxbangding | live | 200 | 401 | 78 |
| `POST` | `/api/v2/users/change_user` | newchangeus | live | 200 | 30401 | 92 |
| `POST` | `/api/v2/users/codeLogin` | newcodeLogin | live | 200 | 401 | 84 |
| `POST` | `/api/v2/users/del_account_set_meal_restrict` | delerestrict | live | 200 | 30401 | 92 |
| `POST` | `/api/v2/users/ding_talk_callback` | nwedinglogin | live | 200 | 401 | 78 |
| `POST` | `/api/v2/users/ding_talk_config` | newdingding | live | 200 | 200 | 146 |
| `POST` | `/api/v2/users/login` | newlogin | live | 200 | 401 | 84 |
| `POST` | `/api/v2/users/register` | newregistr | skipped |  |  |  |
| `POST` | `/api/v2/users/reset_password` | newpassword | live | 200 | 401 | 78 |
| `POST` | `/api/v2/users/sendCode` | newCode | skipped |  |  |  |
| `POST` | `/api/v2/users/set_account_set_meal_restrict` | getrestrict | live | 200 | 30401 | 92 |
| `POST` | `/api/v2/users/set_new_pwd` | newrpapass | live | 200 | 30401 | 92 |
| `POST` | `/api/v2/users/wx_callback` | newwxinfo | live | 200 | 401 | 78 |
| `POST` | `/api/v2/users/wx_config` | newwxlogin | live | 200 | 200 | 120 |
| `POST` | `/v2/admin/device/third-proxy/get` | thirdProxyHelp | live | 200 | 500 | 84 |
| `POST` | `/v2/admin/device/third-proxy/page` | thirdProxyList | live | 200 | 200 | 7181 |
| `POST` | `/v2/check/checkproxy` | checkProxy | error |  |  |  |
| `POST` | `/v2/collector/track` | collectorTrack | live | 502 |  | 0 |
| `POST` | `/v2/cost/costmanagement/coupons_send` | sendCoupons | live | 200 | 401 | 110 |
| `POST` | `/v2/cost/costmanagement/findDevicesByOrderNo` | deviceOrderScan | live | 200 | 200 | 127 |
| `GET` | `/v2/cost/costmanagement/get_user_set_meal` | getUsermeal | live | 200 | 200 | 947 |
| `GET` | `/v2/cost/costmanagement/getCityAgent` | getCityAgent | live | 200 | 200 | 146126 |
| `GET` | `/v2/cost/costmanagement/getcloudcoinsnumb` | getcloudcoinsnumb | live | 200 | 200 | 107 |
| `GET` | `/v2/cost/costmanagement/getcloudsupport` | getcloudsupport | live | 200 | 200 | 127708 |
| `GET` | `/v2/cost/costmanagement/getcloudsupportnew` | getcloudsupportnew | live | 200 | 200 | 747622 |
| `GET` | `/v2/cost/costmanagement/getcoupon` | getcouponlist | live | 200 | 200 | 96 |
| `GET` | `/v2/cost/costmanagement/getDynamicAgent` | querySupport | live | 200 | 200 | 98 |
| `GET` | `/v2/cost/costmanagement/getHotProxyProduct` | getHotProxyProduct | live | 200 | 200 | 406541 |
| `GET` | `/v2/cost/costmanagement/getNewbieDevice` | getNewbieDevice | live | 200 | 200 | 106059 |
| `GET` | `/v2/cost/costmanagement/getOrderDetailByDetailsNo` | getOrderDetailByDetailsNo | live | 200 | 200 | 6030 |
| `GET` | `/v2/cost/costmanagement/getOrderDetailNew` | getOrderDetailNew | live | 200 | 200 | 6030 |
| `POST` | `/v2/cost/costmanagement/getOrderDetailNewByMultiple` | getOrderDetailNewByMultiple | live | 200 | 200 | 6024 |
| `POST` | `/v2/cost/costmanagement/getOrderDetailStatus` | getOrderDetailStatus | live | 200 | 4009 | 114 |
| `GET` | `/v2/cost/costmanagement/getorderinfo` | getorderinfo | live | 200 | 200 | 513 |
| `GET` | `/v2/cost/costmanagement/getOrderManagementNew` | getorderlist | live | 200 | 200 | 6073 |
| `GET` | `/v2/cost/costmanagement/getProxyProduct` | getProxyProduct | live | 200 | 200 | 129512 |
| `GET` | `/v2/cost/costmanagement/getProxyProductV2` | getProxyProductV2 | live | 200 | 200 | 549361 |
| `GET` | `/v2/cost/costmanagement/getrechargecloudcoin` | getrechargeamount | live | 200 | 200 | 1381 |
| `GET` | `/v2/cost/costmanagement/getrechargehistory` | getrechargehistory | live | 200 | 200 | 145 |
| `GET` | `/v2/cost/costmanagement/getRegionSupport` | getRegionSupport | live | 200 | 200 | 98 |
| `GET` | `/v2/cost/costmanagement/getRegionSupportV2` | getRegionSupportV2 | live | 200 | 200 | 72165 |
| `GET` | `/v2/cost/costmanagement/orderExportNew` | orderexport | live | 200 | 200 | 232 |
| `GET` | `/v2/cost/costmanagement/quick` | quickMulSearch | live | 200 | 200 | 145 |
| `GET` | `/v2/cost/costmanagement/quickIndex` | quickSearchBuy | live | 200 | 200 | 98 |
| `GET` | `/v2/cost/costmanagement/quickRecommend` | quickRecommend | live | 200 | 200 | 46765 |
| `POST` | `/v2/cost/costmanagement/redeemed` | getcdkey | live | 200 | 4009 | 114 |
| `POST` | `/v2/cost/costmanagement/renew_meal_pay` | renewMealPay | live | 200 | 4009 | 114 |
| `POST` | `/v2/cost/costmanagement/set_meal_auto_set` | set_meal_auto_set | live | 200 | 200 | 96 |
| `POST` | `/v2/cost/costmanagement/set_meal_pay` | setmealPay | live | 200 | 4009 | 114 |
| `GET` | `/v2/cost/costmanagement/set_meal_set` | getsetmeal | live | 200 | 200 | 750 |
| `GET` | `/v2/cost/costmanagement/user_coupons_event_list` | bindMobilePhoneCoupon | live | 200 | 200 | 145 |
| `GET` | `/v2/cost/costmanagement/user_coupons_list` | userCouponsList | live | 200 | 200 | 146 |
| `POST` | `/v2/cost/device/balance_pay` | balancePay | live | 200 | 4009 | 114 |
| `POST` | `/v2/cost/device/batch_cloud_browser` | batchCloudBrowser | live | 500 |  | 0 |
| `POST` | `/v2/cost/device/batch_cloud_browser_renew` | batchCloudBrowserRenew | live | 500 |  | 0 |
| `POST` | `/v2/cost/device/batch_create_order` | createOrder | live | 200 | 4009 | 114 |
| `POST` | `/v2/cost/device/batch_create_renew` | batchCreateRenew | live | 200 | 4009 | 114 |
| `POST` | `/v2/cost/device/cancel_order` | cancelOrder | live | 200 | 4009 | 114 |
| `POST` | `/v2/cost/device/cart_delete` | cartDelete | live | 200 | 200 | 96 |
| `GET` | `/v2/cost/device/cart_find` | cartFind | live | 200 | 200 | 96 |
| `POST` | `/v2/cost/device/cart_update` | cartUpdate | live | 200 | 200 | 96 |
| `POST` | `/v2/cost/device/create_order` | createDeviceOrder | live | 200 | 4009 | 114 |
| `POST` | `/v2/cost/device/create_renew` | createRenewOrder | live | 200 | 4009 | 114 |
| `POST` | `/v2/cost/device/createNewbieDeviceOrder` | createNewbieDeviceOrder | live | 200 | 4009 | 114 |
| `GET` | `/v2/cost/device/findorder` | findorder | live | 200 | 200 | 302 |
| `POST` | `/v2/cost/device/pay_scan` | devicePayScan | live | 200 | 4009 | 114 |
| `GET` | `/v2/cost/device/paypal` | notifyPaypal | skipped |  |  |  |
| `GET` | `/v2/cost/device/repayrecharge` | repayrecharge | skipped |  |  |  |
| `POST` | `/v2/cost/device/scanrecharge` | scanrecharge | live | 200 | 4009 | 114 |
| `POST` | `/v2/logs/auth/options` | optionslogs | live | 200 | 200 | 3482 |
| `POST` | `/v2/logs/auth/perms` | permslogs | live | 200 | 200 | 3321 |
| `POST` | `/v2/message/message-type/page` | messageTypePage | live | 200 | 200 | 1775 |
| `POST` | `/v2/message/sms-setting/change` | changeRenewSmsNotifySetting | live | 200 | 500 | 200 |
| `POST` | `/v2/message/sms-setting/get` | getRenewSmsNotifySetting | live | 200 | 200 | 105 |
| `POST` | `/v2/message/user-notice/getNotice` | userNoticeGet | live | 200 | 200 | 447 |
| `POST` | `/v2/message/user-notice/my` | getAllMessage_new | live | 200 | 200 | 1529 |
| `POST` | `/v2/message/user-notice/noticeRed` | userNoticeNoticeRed | live | 200 | 200 | 195 |
| `POST` | `/v2/message/user-notice/readAll` | userNoticeReadAll | live | 200 | 200 | 70 |
| `POST` | `/v2/message/user-notice/update` | getReadMessage_new | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/account-users/get` | accountUsers | live | 200 | 200 | 80 |
| `POST` | `/v2/newbrowser/account-users/update` | envUpdate | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/addusershopauthority` | addusershopauthority | live | 200 | 500 | 85 |
| `POST` | `/v2/newbrowser/batchCloneShop` | batchCloneShop | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/batchCreateShop` | batchCreateShop | live | 200 | 400 | 81 |
| `POST` | `/v2/newbrowser/bindingUserPasswordList` | bindingUserPasswordList | live | 200 | 200 | 82 |
| `POST` | `/v2/newbrowser/clearCookie` | clearCookie | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/cloud-accounts/auto-renew/enable` | cloudAccountsAutoRenewEnable | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/cloud-accounts/browser-url/reset` | cloudAccountsBrowserUrlReset | live | 200 | 500 | 84 |
| `POST` | `/v2/newbrowser/cloud-accounts/client-num/get` | cloudAccountsClientNumGet | live | 200 | 200 | 107 |
| `POST` | `/v2/newbrowser/cloud-accounts/create` | yunBrowserCloudAccountsCreate | live | 200 | 500 | 86 |
| `POST` | `/v2/newbrowser/cloud-accounts/del` | yunBrowserCloudAccountsDel | live | 200 | 500 | 84 |
| `POST` | `/v2/newbrowser/cloud-accounts/finger/get` | yunBrowserAccountsFingerGet | live | 200 | 200 | 1957 |
| `POST` | `/v2/newbrowser/cloud-accounts/free/shop/get` | cloudAccountsFreeShopGet | live | 200 | 200 | 167 |
| `POST` | `/v2/newbrowser/cloud-accounts/free/shop/init` | cloudAccountsFreeShopInit | live | 200 | 500 | 84 |
| `POST` | `/v2/newbrowser/cloud-accounts/getauthshopbriefinfolist` | getauthshopbriefinfolist_Yun | live | 200 | 200 | 16045 |
| `POST` | `/v2/newbrowser/cloud-accounts/getiduserlist` | getUseCountByProxyId_Yun | live | 200 | 200 | 90 |
| `POST` | `/v2/newbrowser/cloud-accounts/getshopfromproxy` | getshopfromproxy_Yun | live | 200 | 200 | 55 |
| `POST` | `/v2/newbrowser/cloud-accounts/num-vis` | cloudAccountsNumVis | live | 200 | 200 | 118 |
| `POST` | `/v2/newbrowser/cloud-accounts/open/token/get` | cloudAccountsAutoOpenTokenGet | live | 200 | 200 | 414 |
| `POST` | `/v2/newbrowser/cloud-accounts/page` | yunBrowserCloudAccountsPage | live | 200 | 200 | 36598 |
| `POST` | `/v2/newbrowser/cloud-accounts/popup/get` | cloudAccountsPopupGet | live | 200 | 200 | 90 |
| `POST` | `/v2/newbrowser/cloud-accounts/putPublicInfo` | putPublicInfoYun | live | 200 | 200 | 128 |
| `POST` | `/v2/newbrowser/cloud-accounts/restart` | cloudAccountsRestart | live | 200 | 500 | 84 |
| `POST` | `/v2/newbrowser/cloud-accounts/setproxytoshop` | deviceBindAccount_Yun | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/cloud-accounts/update` | yunBrowserCloudAccountsUpdate | live | 200 | 500 | 84 |
| `POST` | `/v2/newbrowser/cloud-browser/visit` | cloudBrowserVisit | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/configpersonalsettings` | configPersonalSettings | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/configsettings` | configSettings | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/creatbatchaddxlsxuuid` | addxlsxuuid | live | 200 | 200 | 403 |
| `POST` | `/v2/newbrowser/createUserPassword` | createUserPassword | live | 200 | 200 | 82 |
| `POST` | `/v2/newbrowser/deletegroups` | delefenzu | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/deleteUserPassword` | deleteUserPassword | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/deleteUserPasswordRecycle` | deleteUserPasswordRecycle | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/getallfonts` | getfontlist | live | 200 | 200 | 12943 |
| `POST` | `/v2/newbrowser/getalllanguage` | getAccountlanguage | live | 200 | 200 | 18395 |
| `POST` | `/v2/newbrowser/getallmessage` | getallmessage | dead | 404 |  | 18 |
| `POST` | `/v2/newbrowser/getalluri` | getplatform | live | 200 | 200 | 154 |
| `GET` | `/v2/newbrowser/getallurilist` | getallurilist | live | 200 | 200 | 148065 |
| `POST` | `/v2/newbrowser/getalluserselfuri` | getalluserself | live | 200 | 200 | 38 |
| `POST` | `/v2/newbrowser/getauthshopbriefinfolist` | getauthshopbriefinfolist | live | 200 | 200 | 4584 |
| `POST` | `/v2/newbrowser/getautomac` | getMac | live | 200 | 200 | 54 |
| `POST` | `/v2/newbrowser/getbatchaddxlsxlist` | getxlsxlist | live | 200 | 404 | 83 |
| `POST` | `/v2/newbrowser/getbatchaddxlsxprocess` | getxlsxprocess | live | 200 | 200 | 403 |
| `POST` | `/v2/newbrowser/getBindUserPassword` | getBindUserPassword | live | 200 | 200 | 779 |
| `POST` | `/v2/newbrowser/getconditionshops` | getaccountlist | live | 200 | 200 | 8055 |
| `GET` | `/v2/newbrowser/getconditionshopscount` | getconditionshopscount | live | 200 | 200 | 85 |
| `POST` | `/v2/newbrowser/getCookie` | getCookie | live | 200 | 200 | 80 |
| `POST` | `/v2/newbrowser/getdefaultfingerlist` | getfingerlist | live | 200 | 200 | 53621 |
| `POST` | `/v2/newbrowser/getfingerprinturi` | getfingerprin | live | 200 | 200 | 2042 |
| `POST` | `/v2/newbrowser/getfingerprinturiua` | getfingerua | live | 200 | 403 | 86 |
| `POST` | `/v2/newbrowser/getgeneraIPidealproxyinfo` | getgeneraIPidealproxyinfo | dead | 404 |  | 18 |
| `POST` | `/v2/newbrowser/getgroups` | getgroups | live | 200 | 200 | 1113 |
| `POST` | `/v2/newbrowser/getgroupusers` | getgroupusers | live | 200 | 200 | 28 |
| `POST` | `/v2/newbrowser/getiduserlist` | getUseCountByProxyId | live | 200 | 200 | 88 |
| `POST` | `/v2/newbrowser/getLatestOpenAccountIdList` | getLatestOpenAccountId | live | 200 | 200 | 269 |
| `POST` | `/v2/newbrowser/getpackageinfo` | getpackageinfo | live | 200 | 200 | 58 |
| `POST` | `/v2/newbrowser/getreadmessage` | getreadmessage | dead | 404 |  | 18 |
| `POST` | `/v2/newbrowser/getrecycleshoplist` | getrecycleshoplist | live | 200 | 200 | 129 |
| `POST` | `/v2/newbrowser/getsettings` | getSettings | live | 200 | 200 | 950 |
| `POST` | `/v2/newbrowser/getShopAndAuthList` | getShopAndAuthList | live | 200 | 200 | 129 |
| `POST` | `/v2/newbrowser/getshopbriefinfolist` | getshopbriefinfolist | live | 200 | 200 | 4195 |
| `POST` | `/v2/newbrowser/getshopconfigrpa` | getaccountinfo | live | 200 | 200 | 276 |
| `POST` | `/v2/newbrowser/getshopfromproxy` | getshopfromproxy | live | 200 | 200 | 54 |
| `POST` | `/v2/newbrowser/getshopkernelVersions` | getshopkernelVersions | live | 200 | 200 | 152 |
| `POST` | `/v2/newbrowser/getshopnameandproxylist` | getShopNameAndProxyList | live | 200 | 200 | 650 |
| `POST` | `/v2/newbrowser/getuserauthshops` | getuserauthshops | live | 200 | 200 | 4195 |
| `POST` | `/v2/newbrowser/getUserPasswordList` | getUserPasswordList | live | 200 | 200 | 131 |
| `POST` | `/v2/newbrowser/getUserPasswordRecycleList` | getUserPasswordRecycleList | live | 200 | 200 | 131 |
| `POST` | `/v2/newbrowser/migrate/apply` | migrateApply | skipped |  |  |  |
| `POST` | `/v2/newbrowser/migrate/generateuuid` | generateuuid | skipped |  |  |  |
| `POST` | `/v2/newbrowser/migrate/searchuuid` | searchuuid | live | 200 | 200 | 2138 |
| `POST` | `/v2/newbrowser/newbieStepCreateShop` | newbieStepCreateShop | live | 200 | 200 | 75 |
| `POST` | `/v2/newbrowser/postBatchAddUserPassword` | postBatchAccount | live | 200 | 4013 | 82 |
| `POST` | `/v2/newbrowser/postbatchaddxlsx` | addxlsxPost | live | 200 | 404 | 83 |
| `POST` | `/v2/newbrowser/proxy-batch-import` | proxyBatchImport | live | 200 | 200 | 123 |
| `POST` | `/v2/newbrowser/proxy-batch-import-res` | proxyBatchImportRes | live | 200 | 200 | 107 |
| `POST` | `/v2/newbrowser/putaddlabel` | batchlabel | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/putaddnotes` | BatchRemarks | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/putalluri` | foundaccount | live | 200 | 400 | 81 |
| `POST` | `/v2/newbrowser/putchangegroup` | changputchang | live | 200 | 403 | 86 |
| `POST` | `/v2/newbrowser/putdeleteallauthority` | putdeleteallauthority | live | 200 | 4009 | 82 |
| `POST` | `/v2/newbrowser/putdeleteauthority` | putdeleteauthority | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/putdeletegroupauthority` | putdeletegroupauthority | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/putdeleteshop` | deleaccountlist | skipped |  |  |  |
| `POST` | `/v2/newbrowser/putdeleteshopfromrecycle` | getdeleteshop | skipped |  |  |  |
| `POST` | `/v2/newbrowser/putdeleteuserselfuri` | delealluserself | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/putmoveauthority` | putmoveauthority | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/putnewgroup` | addgroups | live | 200 | 200 | 81 |
| `POST` | `/v2/newbrowser/putOpenUrl` | putOpenUrl | live | 200 | 4011 | 82 |
| `POST` | `/v2/newbrowser/putPublicInfo` | putPublicInfo | live | 200 | 200 | 130 |
| `POST` | `/v2/newbrowser/putrestoreshop` | getputrestoreshop | live | 200 | 500 | 85 |
| `POST` | `/v2/newbrowser/putsortgroup` | groupSort | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/putusergroupauthority` | putusergroupauthority | live | 200 | 500 | 85 |
| `POST` | `/v2/newbrowser/putUserPassword` | putUserPassword | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/putuserselfuri` | addalluserself | live | 200 | 500 | 85 |
| `POST` | `/v2/newbrowser/putusershopauthority` | putusershopauthority | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/quickCreateShop` | quickCreate | live | 200 | 400 | 81 |
| `POST` | `/v2/newbrowser/resetshopproxy` | resetshopproxy | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/resetyunshopproxy` | resetyunshopproxy | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/restoreUserPasswordRecycle` | restoreUserPasswordRecycle | live | 200 | 500 | 85 |
| `POST` | `/v2/newbrowser/retsetshopisstartag` | getretsetshopisstartag | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/retsetshopistop` | setEnvTop | live | 200 | 4009 | 82 |
| `POST` | `/v2/newbrowser/retsetshopName` | retsetshopName | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/setCookie` | setCookie | live | 200 | 400 | 81 |
| `POST` | `/v2/newbrowser/setproxytoshop` | deviceBindAccount | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/setShopProxy` | setShopProxy | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/shareCompanyIdList` | shareCompanyIdList | live | 200 | 200 | 95 |
| `POST` | `/v2/newbrowser/sharerCompanyId` | sharerCompanyId | live | 200 | 404 | 83 |
| `POST` | `/v2/newbrowser/shareShop` | shareShop | live | 200 | 500 | 85 |
| `POST` | `/v2/newbrowser/shareShopClosed` | shareShopClosed | live | 200 | 200 | 80 |
| `POST` | `/v2/newbrowser/shareShopDel` | shareShopDel | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/shareShopList` | shareShopList | live | 200 | 200 | 129 |
| `POST` | `/v2/newbrowser/shopProxyBound` | shopProxyBound | live | 200 | 200 | 90 |
| `POST` | `/v2/newbrowser/storage/del` | deleteCloudCache | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/storage/page` | getCloudCacheList | live | 200 | 200 | 129 |
| `POST` | `/v2/newbrowser/storage/update` | updateCloudCache | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/transferCompanyId` | transferCompanyId | live | 200 | 404 | 83 |
| `POST` | `/v2/newbrowser/transferShop` | transferShop | live | 200 | 400 | 81 |
| `POST` | `/v2/newbrowser/transfershopauthoritystocompanyid` | transfershopauthoritystocompanyid | dead | 404 |  | 18 |
| `POST` | `/v2/newbrowser/transferShopList` | transferShopList | live | 200 | 200 | 129 |
| `POST` | `/v2/newbrowser/updateProxyShop` | updateProxyShop | error |  |  |  |
| `POST` | `/v2/newbrowser/updateUserPassword` | updateUserPassword | live | 200 | 200 | 82 |
| `POST` | `/v2/newbrowser/updateUserPasswordRemark` | updateUserPasswordRemark | live | 200 | 200 | 70 |
| `POST` | `/v2/newbrowser/updateYunShopProxy` | updateYunShopProxy | error |  |  |  |
| `POST` | `/v2/newbrowser/userPasswordSetAccountId` | userPasswordSetAccountId | live | 200 | 404 | 83 |
| `POST` | `/v2/newbrowser/world/closeShareShop` | getCloseShareShop | dead | 404 |  | 18 |
| `POST` | `/v2/newbrowser/world/getUserExpiredTime` | getUserExpiredTime | dead | 404 |  | 18 |
| `POST` | `/v2/newbrowser/world/shareShop` | getShareShop | dead | 404 |  | 18 |
| `GET` | `/v2/news/serviceAgreement.html` | getServiceProtocol | live | 200 |  | 31684 |
| `GET` | `/v2/news/settings/info` | getNewsSettingsInfo | live | 200 | 500 | 83 |
| `POST` | `/v2/news/show/help/categories` | getHelpCategories | live | 200 | 200 | 889 |
| `POST` | `/v2/news/show/help/list` | getHelpList | live | 200 | 200 | 75976 |
| `GET` | `/v2/news/userAgreement.html` | getUserServiceProtocol | live | 200 |  | 9902 |
| `PUT` | `/v2/plugin/bind` | bindAccount | live | 200 | 200 | 80 |
| `POST` | `/v2/plugin/bindGrouopPlugin` | bindGrouopPlugin | live | 200 | 7 | 58 |
| `POST` | `/v2/plugin/createPluginCrx` | uploadPlugin | live | 200 | 30009 | 63 |
| `DELETE` | `/v2/plugin/deletePluginCrx` | deletePluginCrx | skipped |  |  |  |
| `GET` | `/v2/plugin/downloadFromWebStore` | downloadFromWebStore | live | 200 | 7 | 65 |
| `GET` | `/v2/plugin/findPluginCompanies` | findPluginCompanies | live | 200 | 200 | 617 |
| `GET` | `/v2/plugin/findPluginCrx` | pluginDetail | live | 200 | 200 | 674 |
| `GET` | `/v2/plugin/getAddedAndGlobalplugin` | getAddedAndGlobalplugin | live | 200 | 200 | 839 |
| `GET` | `/v2/plugin/getPluginCategoryGroupCrxList` | getPluginCategoryGroupCrxList | live | 200 |  | 87197 |
| `GET` | `/v2/plugin/getPluginCategoryGroupList` | getPluginCategoryGroupList | live | 200 |  | 2033 |
| `GET` | `/v2/plugin/getPluginCompaniesPersonageList` | getPluginCompaniesPersonageList | live | 200 |  | 3326 |
| `GET` | `/v2/plugin/getPluginCrxLike` | similarPluginList | live | 200 |  | 52 |
| `GET` | `/v2/plugin/getPluginCrxList` | getPluginCrxList | live | 200 |  | 26213 |
| `GET` | `/v2/plugin/getPluginCrxUserList` | getPluginCrxUserList | live | 200 |  | 1770 |
| `GET` | `/v2/plugin/getPluginHeatSearchesList` | hotSearchWords | live | 200 |  | 243 |
| `GET` | `/v2/plugin/group/accountGroupList` | accountGroupList | live | 200 | 7 | 59 |
| `POST` | `/v2/plugin/group/addPluginGroup` | addPluginGroup | live | 500 |  | 0 |
| `POST` | `/v2/plugin/group/copyPluginGroup` | copyPluginGroup | live | 200 | 30005 | 60 |
| `POST` | `/v2/plugin/group/createPluginGroup` | createPluginGroup | skipped |  |  |  |
| `DELETE` | `/v2/plugin/group/deletePluginGroup` | deletePluginGroup | skipped |  |  |  |
| `GET` | `/v2/plugin/group/getPluginGroupId` | getPluginGroupId | live | 200 | 200 | 258 |
| `GET` | `/v2/plugin/group/gitGroupPluginList` | gitGroupPluginList | live | 200 | 200 | 179 |
| `GET` | `/v2/plugin/group/gitPluginGroupList` | gitPluginGroupList | live | 200 |  | 50 |
| `PUT` | `/v2/plugin/group/updatePluginGroup` | updatePluginGroup | live | 500 |  | 0 |
| `POST` | `/v2/plugin/install` | installPlugin | live | 200 | 200 | 80 |
| `GET` | `/v2/plugin/myPlugin` | myPlugin | live | 200 |  | 3298 |
| `DELETE` | `/v2/plugin/uninstall` | uninstall | skipped |  |  |  |
| `DELETE` | `/v2/plugin/uninstallNew` | uninstallNew | skipped |  |  |  |
| `POST` | `/v2/plugin/updateGlobalVisibility` | updateGlobalVisibility | live | 200 | 200 | 48 |
| `PUT` | `/v2/plugin/updatePluginCrx` | updatePluginCrx | live | 200 | 30009 | 63 |
| `POST` | `/v2/plugin/updateTeamVisibility` | updateTeamVisibility | live | 200 | 200 | 48 |
| `GET` | `/v2/plugin/updateTeamVisibilityJurisdiction` | updateTeamVisibilityJurisdiction | live | 200 | 200 | 62 |
| `POST` | `/v2/proxy/authority/deal` | proxyAuthDeal | live | 200 | 401 | 116 |
| `GET` | `/v2/proxy/authority/get` | proxyAuthList | live | 200 | 401 | 114 |
| `POST` | `/v2/proxy/authority/syncNoAutoAuthority` | syncNoAutoAuthority | live | 200 | 200 | 96 |
| `POST` | `/v2/proxy/device/autoRenewCloudBrowser` | autoRenewCloudBrowser | live | 200 | 4019 | 124 |
| `POST` | `/v2/proxy/device/batchautorenew` | autoRenewProxy | live | 200 | 4009 | 114 |
| `POST` | `/v2/proxy/device/batchcloserenew` | closeAutoRenew | live | 200 | 4009 | 114 |
| `POST` | `/v2/proxy/device/batchdelete` | batchDelPlatformProxy | skipped |  |  |  |
| `POST` | `/v2/proxy/device/batchtag` | batchTag | live | 200 | 4009 | 114 |
| `POST` | `/v2/proxy/device/createDeviceUserSelves` | createDeviceUserSelves | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/creatingDeviceLogs` | createLog | live | 200 | 200 | 96 |
| `POST` | `/v2/proxy/device/delAllDeviceLogs` | delAllDeviceLogs | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/delDeviceDynamicProxies` | delDeviceDynamicProxies | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/delDeviceLogs` | delDeviceLogs | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/delDeviceProxyUserSelves` | delDeviceProxyUserSelves | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/delTag` | delTag | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/dynamics/in/userPkg` | dynamicsUserPkg | live | 200 | 200 | 263 |
| `POST` | `/v2/proxy/device/dynamics/proxy` | postDynamicsProxy | live | 200 | 4011 | 108 |
| `POST` | `/v2/proxy/device/dynamics/userinfo` | dynamicsUserinfo | live | 200 | 200 | 301 |
| `POST` | `/v2/proxy/device/findDesignateDevices` | findDesignateDevices | live | 200 | 200 | 96 |
| `GET` | `/v2/proxy/device/findDeviceDynamicProxies` | findDeviceDynamicProxies | live | 200 | 200 | 1992 |
| `GET` | `/v2/proxy/device/findDeviceLogs` | findDeviceLogs | live | 200 | 200 | 146 |
| `GET` | `/v2/proxy/device/findDeviceLogsList` | proxyLogs | live | 200 | 200 | 145 |
| `GET` | `/v2/proxy/device/findDeviceProxyUserSelves` | findDeviceProxyUserSelves | live | 200 | 200 | 146 |
| `POST` | `/v2/proxy/device/findDevices` | findDevices | live | 200 | 200 | 723 |
| `POST` | `/v2/proxy/device/findNotAuthDesignateDevices` | findNotAuthDesignateDevices | live | 200 | 200 | 96 |
| `POST` | `/v2/proxy/device/findRandDeviceList` | findRandDeviceList | live | 200 | 200 | 752 |
| `GET` | `/v2/proxy/device/findReplaceProxyLogs` | findReplaceProxyLogs | live | 200 | 80004 | 116 |
| `GET` | `/v2/proxy/device/findTags` | findTags | live | 200 | 200 | 146 |
| `POST` | `/v2/proxy/device/findVcnpList` | findVcnpList | live | 200 | 200 | 145 |
| `GET` | `/v2/proxy/device/getCloudBrowserProducts` | getCloudBrowserProducts | live | 200 | 200 | 2360 |
| `GET` | `/v2/proxy/device/getCloudBrowserSupport` | getCloudBrowserSupport | live | 200 | 200 | 499 |
| `GET` | `/v2/proxy/device/list` | getOwnProxyList | dead | 404 |  | 18 |
| `POST` | `/v2/proxy/device/recycleDelAllDeviceDynamicProxies` | recycleDelAllDeviceDynamicProxies | live | 200 | 401 | 115 |
| `POST` | `/v2/proxy/device/recycleDelAllDeviceProxyUserSelves` | recycleDelAllDeviceProxyUserSelves | live | 200 | 401 | 115 |
| `POST` | `/v2/proxy/device/recycleDelDeviceDynamicProxies` | recycleDelDeviceDynamicProxies | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/recycleDelDeviceProxyUserSelves` | recycleDelDeviceProxyUserSelves | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/recycleRecoverAllDeviceProxyUserSelves` | recycleRecoverAllDeviceProxyUserSelves | live | 200 | 401 | 115 |
| `POST` | `/v2/proxy/device/recycleRecoveryAllDeviceDynamicProxies` | recycleRecoveryAllDeviceDynamicProxies | live | 200 | 401 | 115 |
| `POST` | `/v2/proxy/device/recycleRecoveryDeviceDynamicProxies` | recycleRecoveryDeviceDynamicProxies | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/recycleRecoveryDeviceProxyUserSelves` | recycleRecoveryDeviceProxyUserSelves | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/replaceProxy` | replaceProxy | live | 200 | 401 | 118 |
| `POST` | `/v2/proxy/device/resetname` | resetDeviceName | live | 200 | 200 | 96 |
| `POST` | `/v2/proxy/device/updateDeviceDynamicProxies` | updateDeviceDynamicProxies | live | 200 | 200 | 525 |
| `POST` | `/v2/proxy/device/updateDeviceProxyUserSelves` | updateDeviceProxyUserSelves | live | 200 | 200 | 143 |
| `POST` | `/v2/proxy/device/updateIPAddressSegment` | ipDetect | live | 200 | 200 | 98 |
| `POST` | `/v2/proxy/device/updateIPAddressSegmentBatch` | updateIPAddressSegmentBatch | live | 200 | 401 | 128 |
| `POST` | `/v2/proxy/device/updateTag` | updateTag | skipped |  |  |  |
| `GET` | `/v2/proxy/device/vcnplist` | getPlatformProxyList | live | 200 | 200 | 148 |
| `GET` | `/v2/proxy/device/vcnpsummary` | getPlatformProxySummary | live | 200 | 200 | 184 |
| `GET` | `/v2/retail/checkPromotionCode` | checkPromotionCode | live | 200 | 200 | 76 |
| `POST` | `/v2/retail/createPromotionLink` | createPromotionLink | live | 200 | 7 | 159 |
| `POST` | `/v2/retail/createRetailWithdrawLog` | applywithdrawals | live | 200 | 40014 | 66 |
| `DELETE` | `/v2/retail/deletePromotionLink` | deletePromotionLink | skipped |  |  |  |
| `GET` | `/v2/retail/findRetailSettleConfig` | commissionsConfigInfo | live | 200 | 200 | 394 |
| `GET` | `/v2/retail/findRetailUserInviteCode` | promoInfo | live | 200 | 200 | 315 |
| `GET` | `/v2/retail/frozenList` | getPromoFrozenList | live | 200 |  | 49 |
| `GET` | `/v2/retail/getPromotionLinkList` | getPromotionLinkList | live | 200 | 200 | 392 |
| `GET` | `/v2/retail/getRetailWithdrawLogList` | getPromoWithdrawals | live | 200 |  | 48 |
| `GET` | `/v2/retail/getUserCompanyInviteList` | getPromoUser | live | 200 |  | 49 |
| `POST` | `/v2/rpa/copyRpaCarbonConfig` | copyRpaCarbonConfig | live | 200 | 50004 | 74 |
| `POST` | `/v2/rpa/createRpaGroup` | createRpaGroup | skipped |  |  |  |
| `POST` | `/v2/rpa/createRpaPlanManagement` | createRpaPlanManagement | live | 200 | 7 | 57 |
| `POST` | `/v2/rpa/createRpaShop` | createRpaShop | live | 200 | 200 | 104 |
| `DELETE` | `/v2/rpa/deleteRpaCarbonConfig` | deleteRpaCarbonConfig | skipped |  |  |  |
| `DELETE` | `/v2/rpa/deleteRpaGroup` | deleteRpaGroup | skipped |  |  |  |
| `DELETE` | `/v2/rpa/deleteRpaGroupByGroupIds` | deleteRpaGroupByGroupIds | skipped |  |  |  |
| `DELETE` | `/v2/rpa/deleteRpaPlanManagementByPlanIds` | deleteRpaPlanManagementByPlanIds | skipped |  |  |  |
| `DELETE` | `/v2/rpa/destroyRpaCarbonConfigByAll` | destroyRpaCarbonConfigByAll | skipped |  |  |  |
| `DELETE` | `/v2/rpa/destroyRpaCarbonConfigByConfigIds` | destroyRpaCarbonConfigByConfigIds | skipped |  |  |  |
| `GET` | `/v2/rpa/findRpaCarbonConfig` | findRpaCarbonConfig | live | 200 | 200 | 832 |
| `GET` | `/v2/rpa/findRpaGroup` | findRpaGroup | live | 200 | 200 | 244 |
| `GET` | `/v2/rpa/findRpaPlanManagement` | findRpaPlanManagement | live | 200 | 404 | 63 |
| `GET` | `/v2/rpa/findRpaShop` | findRpaShop | live | 200 | 200 | 5745 |
| `GET` | `/v2/rpa/getRpaCarbonConfigList` | getRpaCarbonConfigList | live | 200 | 0 | 16138 |
| `GET` | `/v2/rpa/getRpaGroupList` | getRpaGroupList | live | 200 | 0 | 73 |
| `GET` | `/v2/rpa/getRpaPlanManagementList` | getRpaPlanManagementList | live | 200 | 200 | 100 |
| `POST` | `/v2/rpa/getRpaPlanManagementList` | getRpaPlansPost | live | 200 | 200 | 100 |
| `GET` | `/v2/rpa/getRpaShopGroupList` | getRpaShopGroupList | live | 200 | 0 | 1133 |
| `GET` | `/v2/rpa/getRpaShopList` | getRpaShopList | live | 200 | 0 | 19581 |
| `GET` | `/v2/rpa/getRpaTaskLog` | getRpaTaskLogDetail | live | 200 | 50004 | 74 |
| `GET` | `/v2/rpa/getRpaTaskLogList` | getRpaTaskLogList | live | 200 | 200 | 74 |
| `PUT` | `/v2/rpa/recoverRpaCarbonConfigByAll` | recoverRpaCarbonConfigByAll | live | 200 | 200 | 72 |
| `PUT` | `/v2/rpa/recoverRpaCarbonConfigByConfigIds` | recoverRpaCarbonConfigByConfigIds | live | 200 | 200 | 72 |
| `GET` | `/v2/rpa/recycleRpaCarbonConfig` | recycleRpaCarbonConfig | live | 200 | 0 | 72 |
| `PUT` | `/v2/rpa/topRpaCarbonConfig` | topRpaCarbonConfig | live | 200 | 50004 | 74 |
| `PUT` | `/v2/rpa/updateRpaCarbonConfigGroupId` | updateRpaCarbonConfigGroupId | live | 200 | 200 | 72 |
| `PUT` | `/v2/rpa/updateRpaGroup` | updateRpaGroup | live | 200 | 50004 | 74 |
| `PUT` | `/v2/rpa/updateRpaPlanManagement` | updateRpaPlanManagement | live | 200 | 7 | 61 |
| `PUT` | `/v2/rpa/updateRpaPlanManagementStatus` | updateRpaPlanManagementStatus | live | 200 | 50002 | 74 |
| `POST` | `/v2/sso/auth/bind` | bindPhoneEmail | skipped |  |  |  |
| `POST` | `/v2/sso/auth/bindThirdLogin` | bindThirdAccount | live | 200 | 200 | 88 |
| `POST` | `/v2/sso/auth/changePwd` | changePwd | skipped |  |  |  |
| `POST` | `/v2/sso/auth/changeUserinfo` | editUserInfo | live | 200 | 200 | 94 |
| `POST` | `/v2/sso/auth/modifyMobileEmail` | modifyMobileEmail | skipped |  |  |  |
| `POST` | `/v2/sso/auth/myUserinfo` | getuserinfo | live | 200 | 200 | 707 |
| `POST` | `/v2/sso/auth/sendModifyCode` | sendModifyCode | live | 200 | 10003 | 136 |
| `POST` | `/v2/sso/auth/setIndustryInfo` | setIndustryInfo | live | 200 | 200 | 90 |
| `POST` | `/v2/sso/auth/setInfo` | authSetInfo | live | 200 | 200 | 90 |
| `POST` | `/v2/sso/auth/setNewbieStep` | setNewbieStep | live | 200 | 200 | 84 |
| `POST` | `/v2/sso/auth/tokenRefresh` | tokenRefresh | live | 200 | 200 | 388 |
| `POST` | `/v2/sso/auth/ubind` | unbindAuth | skipped |  |  |  |
| `POST` | `/v2/sso/auth/user/info/get` | getUserIdinfo | live | 200 | 200 | 935 |
| `POST` | `/v2/sso/auth/verifyModifyCode` | verifyModifyCode | live | 200 | 10022 | 115 |
| `POST` | `/v2/sso/forgetPwd` | getforgepwd | skipped |  |  |  |
| `POST` | `/v2/sso/getDingCfg` | getddinfo | live | 200 | 200 | 220 |
| `GET` | `/v2/sso/getNewbieStep` | getNewbieStep | live | 200 | 200 | 200 |
| `GET` | `/v2/sso/getUserPlatforms` | getUserPlatforms | live | 200 | 200 | 3896 |
| `POST` | `/v2/sso/login` | getuserlogin | live | 200 | 10003 | 136 |
| `POST` | `/v2/sso/loginDing` | ddlogin | live | 200 | 500 | 137 |
| `POST` | `/v2/sso/loginGoogle` | loginGoogle | error |  |  |  |
| `POST` | `/v2/sso/mp/login` | getwxlogin | live | 200 | 1055 | 123 |
| `POST` | `/v2/sso/mp/qrCode` | getwxinfo | live | 200 | 200 | 328 |
| `POST` | `/v2/sso/register` | getuserregister | skipped |  |  |  |
| `POST` | `/v2/sso/sendCode` | getusercaptcha | skipped |  |  |  |
| `POST` | `/v2/sso/verify/code` | verifyCode | live | 200 | 10003 | 136 |
| `POST` | `/v2/team/access/approvals` | approvalsList | live | 200 | 200 | 141 |
| `POST` | `/v2/team/auth/myRights` | myRights | live | 200 | 200 | 40221 |
| `GET` | `/v2/team/authentication/check` | authenticationCheck | live | 200 | 200 | 392 |
| `GET` | `/v2/team/authentication/companyFourElementsFaceCheck` | companyFourElementsFaceCheck | live | 200 | 200 | 360 |
| `GET` | `/v2/team/authentication/companyFourElementsQRCode` | companyFourElementsQRCode | live | 200 | 500 | 140 |
| `GET` | `/v2/team/authentication/get` | authenticationGet | live | 200 | 200 | 392 |
| `POST` | `/v2/team/authentication/insertAuthentication` | insertAuthentication | skipped |  |  |  |
| `POST` | `/v2/team/authentication/insertAuthenticationCompanyFourElementsVerification` | insertAuthenticationCompanyFourElementsVerification | skipped |  |  |  |
| `POST` | `/v2/team/authentication/resetAuthentication` | resetAuthentication | skipped |  |  |  |
| `POST` | `/v2/team/company/approvalJoin` | approvalJoin | live | 200 | 10019 | 127 |
| `POST` | `/v2/team/company/approveMember` | approveMember | live | 200 | 500 | 137 |
| `POST` | `/v2/team/company/change` | editCompanies | skipped |  |  |  |
| `POST` | `/v2/team/company/create` | createCompany | skipped |  |  |  |
| `POST` | `/v2/team/company/getApprovals` | getApprovals | live | 200 | 200 | 141 |
| `POST` | `/v2/team/company/getRoleDepartmentMeal` | getRoleDepartmentMeal | live | 200 | 200 | 581 |
| `POST` | `/v2/team/company/ids` | getCompanyByIds | live | 200 | 200 | 467 |
| `POST` | `/v2/team/company/info` | getcompany | live | 200 | 200 | 465 |
| `POST` | `/v2/team/company/user/devices` | getUserDevices | live | 200 | 200 | 1632 |
| `POST` | `/v2/team/company/user/updatePackageStatus` | updatePackageStatus | live | 200 | 200 | 83 |
| `POST` | `/v2/team/curCompanyInfo` | curCompanyInfo | live | 200 | 200 | 465 |
| `POST` | `/v2/team/dept/change` | updateDept | live | 200 | 10022 | 115 |
| `POST` | `/v2/team/dept/create` | createDept | skipped |  |  |  |
| `POST` | `/v2/team/dept/del` | deleteDept | live | 200 | 10017 | 115 |
| `POST` | `/v2/team/env-settings/get` | getEnvSettings | live | 200 | 200 | 80 |
| `POST` | `/v2/team/env-settings/update` | updateEnvSettings | live | 200 | 500 | 161 |
| `POST` | `/v2/team/getDepts` | getDepts | live | 200 | 200 | 187 |
| `POST` | `/v2/team/getMembers` | getMembers | live | 200 | 200 | 749 |
| `POST` | `/v2/team/invite/getCode` | getInviteCode | skipped |  |  |  |
| `POST` | `/v2/team/loginlogs` | loginlogs | live | 200 | 200 | 3695 |
| `POST` | `/v2/team/logout` | vloginout | skipped |  |  |  |
| `POST` | `/v2/team/member/accessApply` | loginApply | live | 200 | 500 | 128 |
| `POST` | `/v2/team/member/accessApproval` | accessApproval | live | 200 | 500 | 137 |
| `POST` | `/v2/team/member/change` | editMember | skipped |  |  |  |
| `POST` | `/v2/team/member/ids` | getMembersByIds | live | 200 | 200 | 649 |
| `POST` | `/v2/team/member/info` | getMemberInfo | live | 200 | 200 | 637 |
| `POST` | `/v2/team/member/move` | moveDeptMember | live | 200 | 200 | 94 |
| `POST` | `/v2/team/member/myInfo` | userInfo | live | 200 | 200 | 646 |
| `POST` | `/v2/team/member/myInfo/change` | myInfoChange | live | 200 | 200 | 94 |
| `POST` | `/v2/team/myCompanies` | getCompanuIfo | live | 200 | 200 | 444 |
| `POST` | `/v2/team/ownerCompanies` | getMyTeam | live | 200 | 200 | 467 |
| `GET` | `/v2/team/plugin/newestPlugins` | newestPlugins | live | 200 | 200 | 1751 |
| `POST` | `/v2/team/right/list` | getMenus | live | 200 | 200 | 40211 |
| `POST` | `/v2/team/right/listTemplate` | getMenusTemplate | live | 200 | 200 | 3537 |
| `POST` | `/v2/team/role-group/create` | createRoleGroup | skipped |  |  |  |
| `POST` | `/v2/team/role-group/del` | deleteRoleGroup | live | 200 | 500 | 93 |
| `POST` | `/v2/team/role-group/page` | getRoleGroup | live | 200 | 200 | 354 |
| `POST` | `/v2/team/role-group/role/move` | roleGroupMigrateRole | live | 200 | 200 | 70 |
| `POST` | `/v2/team/role-group/update` | updateRoleGroup | live | 200 | 200 | 70 |
| `POST` | `/v2/team/role/change` | editRole | live | 200 | 10012 | 127 |
| `POST` | `/v2/team/role/del` | deleteRole | skipped |  |  |  |
| `POST` | `/v2/team/role/great` | addRoleAccount | live | 200 | 200 | 94 |
| `POST` | `/v2/team/role/members` | getRoleMembers | live | 200 | 200 | 94 |
| `POST` | `/v2/team/roles` | getRolesList | live | 200 | 200 | 2289 |
| `POST` | `/v2/team/select/company` | toggleCompany | live | 200 | 500 | 51 |
| `POST` | `/v2/team/sidebar/get` | getSidebar | live | 200 | 200 | 288 |
| `POST` | `/v2/team/sidebar/update` | updateSidebar | live | 200 | 200 | 84 |
| `POST` | `/v2/team/version/get` | getVersion | live | 200 | 200 | 73 |
| `POST` | `/v2/team/version/getCore` | getCoreVersion | live | 200 | 500 | 192 |
| `POST` | `/v2/team/version/last` | versionLast | live | 200 | 200 | 1913 |
| `POST` | `/v2/tg/browser/store/ip` | normalIp | live | 200 | 500 | 264 |
| `POST` | `/v2/tg/r/error` | errReport | live | 400 |  | 13 |
| `POST` | `/v2/yun/ads-space/ad` | adsSpaceInfo | live | 200 | 200 | 3993 |
| `POST` | `/v2/yun/qrcode-setting/get` | getQrCodeSetting | live | 200 | 200 | 129 |

## Methodology And Side Effects

The route table was extracted by parsing `METHOD,path` string pairs from the management-center client bundle — the client's own definition of every server call it can make. Read routes are probed with a minimal body plus the session company/user identifiers.

Two cautions apply to anyone repeating this sweep:

1. **Minimal bodies can still mutate.** Routes such as `/v2/team/dept/create`, `/v2/plugin/group/createPluginGroup`, `/v2/message/user-notice/readAll`, and several `/v2/team/role-group/*` routes returned `code: 200` and applied an empty request. An empty-name department was created and could not be removed (`/v2/team/dept/del` returned `code: 10017 无权删除`). Notices were marked read.
2. **Use the guard.** `scripts/dev/sweep-all-routes.mjs` classifies write verbs before read verbs and skips any write-named route unless `--include-writes` is passed. Do not pass `--include-writes` on a non-test account.

Write routes that were not executed are marked `skipped` in the full table. To exercise them, use an explicit temporary resource and a create/verify/delete round trip.
