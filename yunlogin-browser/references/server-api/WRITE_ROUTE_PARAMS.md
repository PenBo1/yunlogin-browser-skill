# Write-Route Parameter And Behaviour Evidence

Write-named routes from the management-center client, with candidate request-field keys extracted from the client call sites and the observed sweep result. `live` = executed; `skipped` = not executed.

Total write-named routes: 266

## Findings

| Finding | Evidence |
| --- | --- |
| Self-proxy batch delete field is `device_ids` | `{device_ids:[id]}` -> `code:200 ok`; `deviceid`/`deviceId` -> `code:401 device id is required`. Struct `DeviceBatchRequest`. |
| Self-proxy create is a silent no-op on the server | `createDeviceUserSelves` returned `code:200 ok` for 6 payload shapes with zero new rows. |
| Credential create is a no-op | `createUserPassword`/`putUserPassword` return `code:200 OK` without creating a record; `postBatchAddUserPassword` needs an unresolved shape (`404`/`4013`). |
| `account-users/update` is a lenient no-op | `code:200 OK` with no change. |
| Environment update works via `userapi/user/update` | `{browser:[{browserid,name,notes}]}` -> `{code:0, datas:[...]}`. |
| Group rename returns capitalised `Code` | `putnewgroup` with `groupid` -> `{"Code":200}`. |
| Department delete takes `{id}` | `{id}` -> `code:200 删除成功`; `{deptId}` -> `code:10017 无权删除`. |
| Role-group delete takes `{ids:[id]}` | `{ids}` -> `code:200 OK`; `{id}` -> `code:500 WHERE conditions required`. |
| Self-proxy create/update uses `proxy` as an array | `updateDeviceProxyUserSelves` with `proxy:[{...}]` -> `data:{proxies,success,failure,repeat}`; `proxy:{...}` returns ok but creates nothing. |
| Dynamic-proxy create/update returns the full row | `updateDeviceDynamicProxies` -> `data.deviceid` + full row; delete with `device_ids`. |
| Environment star/top take `shopid` as an array | `retsetshopisstartag`/`retsetshopistop` with `{shopid:[id],startag|top}`; a bare string returns `500 ... SetShop.shopid of type []string`. |
| `putchangegroup` needs permission | `{shopids:[id],groupid}` on this account returns `code: 403 暂无访问权限`. |
| Delete semantics differ | Environment and self-proxy deletes are **soft** (recycle bin): purge with `putdeleteshopfromrecycle {shopid:[id]}` / `recycleDelDeviceProxyUserSelves {device_ids:[id]}`. Group/tag/role-group/department deletes are hard. |
| Share create shape unresolved | `shareShop` returns `500 empty slice found` for `shopids`/`shopIds`/`shopId` x `accountCompanyId`/`accountCompanyIds` x `userIds` (8 variants); `shareShopList {accountid,page,pageSize,status}` and `shareShopDel {ids}`/`{shopids,accountCompanyId}` work. |
| `env-settings` is a tag key/value store | `update {tag,content}` inserts/updates; `get {tags:[...]}` reads; `tags: []` fails the `gt` validator. |
| SMS setting rejects 0 | `sms-setting/change {RenewSmsNotifyEnabled:0}` -> `500` (Go `required` treats zero as missing); `1` succeeds. |
| Authority grant/revoke verified | `addusershopauthority {userid,shopids}` then `putdeleteauthority {company,companyid,userid,shopids,touserid}`; observe with `browser-list {authoritiesUserid:[id]}` (0->1->0). The shop `authority` field is a level, not the user list. |
| Authority handover verified | `putmoveauthority {company,companyid,userid,shopids,usered:<source>,touserid:[targets]}` moves authority A->B; round-tripped B->A and revoked. |
| Group authority verified | `putusergroupauthority {company,companyid,myuserid,share:[{companyid,userid:[ids],groupid}]}` grants; `putdeletegroupauthority {groupid:[id]}` revokes. Environment placed in a group via `browser.categoryid`. |
| Per-env authority verified | `putusershopauthority {company,companyid,myuserid,share:[{companyid,userid:[ids],shopid,authority:2}]}` grants; revoke with `putdeleteauthority {shopids,touserid}`. |
| RPA read shapes captured | `getRpaGroupList`/`getRpaShopList`/`getRpaShopGroupList` use `code:0`; `findRpaGroup` returns a `rerpaGroup` key; RPA has no client delete route. |
| Some plugin routes omit `code` | `getPluginCrxList`/`myPlugin`/`getPluginCategoryGroupList`/`getPluginCompaniesPersonageList` return `{list,...}` with no `code` field; `findPluginCompanies` uses a `repluginCompanies` key. |
| Retail/admin/message/yun/news read shapes captured | `reretailSettleConfig` / `userInvite` keys; `third-proxy/page`, `message-type/page`, `qrcode-setting/get`, `help/categories|list` all `code:200`. |
| `createPluginGroup` writes with no cleanup path | `POST /v2/plugin/group/createPluginGroup {}` returned `code:200 ok`; `gitPluginGroupList` now reports `count:1` and returns two concatenated JSON objects; no client delete route exists. |
| SSO/cloud read shapes captured | `sso/auth/user/info/get {userId}` returns top-level profile with `bind`; `getCloudBrowserSupport`/`getCloudBrowserProducts` return arrays; `cloud-accounts/page` fails upstream. SSO profile writes left unexercised (no param mapping). |
| Custom-platform CRUD verified | `putuserselfuri {company,companyid,userid,self:[{login_url}]}` -> `putdeleteuserselfuri {company,companyid,userid,platformid:[id]}`; list via `getalluserselfuri`. |
| Env rename/notes keys | `retsetshopName {shopid:[id],accountName}` renames; wrong keys (`shopname`/`newName`) silently set the name to empty. `putaddnotes {shopid:[id],notes}`. |
| `putaddlabel` shape is `{info:[{shopid,label:[{id}]}]}` | Correct client shape; still no label visible via `browser-list` (`label` null, `labelids` filter empty) - effect unconfirmed. |
| Plugin writes mapped, not executed | `install {pluginId,IsTeam,pluginType}`, `updateTeamVisibility {pluginId}`, `updateGlobalVisibility {pluginCompanyId}`, `addPluginGroup {groupId,pluginCompanyId}`, `bindGrouopPlugin {groupId:[id],accountIds,kernel}`; no client delete route, so not run. |
| Batch credential import needs an xlsx upload key | `postBatchAddUserPassword {list,kernelVersion,key}`: fake/missing `key` -> `404 资源不存在` / `4013`; the `key` comes from the `postbatchaddxlsx` flow. |
| `plugin/bind` shape | `{accountIds,pluginId,isTeam,pluginCompanyId,accountIdsCompanyId}` (from call sites); not executed. `putaddlabel` is `{info:[{shopid,label:[{id}]}]}`. |

## /api/v1

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/api/v1/sendemailcode` | emailyanzhen | - | live | 400 |  |
| `POST` | `/api/v1/settings/download_snapshot` | downloadSnapshot | `fileName`, `accountId`, `isFirefox`, `token`, `fileUrl`, `companyId`, `cdk` | live | -1 | Success |
| `POST` | `/api/v1/settings/fetch_base_url` | fetchBaseUrl | - | live | 0 | Success |
| `POST` | `/api/v1/settings/fetch_caches_info` | cacheInfo | `accountId`, `isFirefox` | live | 0 | Success |
| `POST` | `/api/v1/settings/fetch_snapshot_download_progress` | fetchSnapshotDownloadProgress | - | dead (HTTP 404: the path has no handler) |  |  |
| `POST` | `/api/v1/settings/fetch_snapshot_info` | snapshotInfo | `accountId`, `isFirefox` | live | 0 | Success |
| `POST` | `/api/v1/settings/fetch_snapshot_upload_progress` | fetchSnapshotUploadProgress | - | dead (HTTP 404: the path has no handler) |  |  |
| `POST` | `/api/v1/settings/remove_caches` | removeCache | `accountId`, `fileName` | live | 0 | Success |
| `POST` | `/api/v1/settings/restart_yunlogin` | restartYunlogin | - | dead (HTTP 404: the path has no handler) |  |  |
| `POST` | `/api/v1/settings/restore_snapshot` | restoreSnapshot | `token` | live | -1 | Success |
| `POST` | `/api/v1/settings/switch_base_url` | switchBaseUrl | `url` | live | 0 | Success |
| `POST` | `/api/v1/settings/upload_snapshot` | uploadSnapshot | `remark`, `token`, `companyId`, `cdk` | live | -1 | Success |
| `POST` | `/api/v1/users` | register | `read`, `write`, `llseek` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/api/v1/users/account/batchdelete` | deleaccount | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/api/v1/users/account/batchstar` | CancelStartargets | - | live | 30401 |  |
| `POST` | `/api/v1/users/account/batchtag` | bindaccounttag | - | live | 30401 |  |
| `PUT` | `/api/v1/users/account/curd` | CancelStartarget | - | live | 30401 |  |
| `GET` | `/api/v1/users/account/getstartlogs` | opened | - | live | 30401 |  |
| `POST` | `/api/v1/users/account/startlogs` | openID | - | live | 30401 |  |
| `PUT` | `/api/v1/users/account/tagcurd` | edittaglist | - | live | 30401 |  |
| `GET` | `/api/v1/users/bind` | userwxmobile | - | live | 400 |  |
| `GET` | `/api/v1/users/bindmobile` | usersBindmobile | - | live | 400 |  |
| `POST` | `/api/v1/users/company/configureaccounts` | memberadds | - | live | 30401 |  |
| `GET` | `/api/v1/users/company/invitelist` | inviteList | - | live | 30401 |  |
| `POST` | `/api/v1/users/company/passedinvite` | inviteResolve | - | live | 30401 |  |
| `POST` | `/api/v1/users/company/refuseinvite` | inviteReject | - | live | 400 |  |
| `POST` | `/api/v1/users/customplatformedit` | addplaturl | - | skipped (catastrophic blocklist) |  |  |
| `DELETE` | `/api/v1/users/customplatformedit` | deleplaturl | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/api/v1/users/login` | login | - | live | 401 |  |
| `GET` | `/api/v1/users/logincallback` | wxuserinfo | - | live | 400 |  |
| `POST` | `/api/v1/users/role/curd` | roleAdd | - | live | 30401 |  |
| `PUT` | `/api/v1/users/role/curd` | roleUpdate | - | live | 30401 |  |
| `DELETE` | `/api/v1/users/role/curd` | roleRemove | - | skipped (catastrophic blocklist) |  |  |
| `GET` | `/api/v1/users/sendsms` | getCode | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/api/v1/users/smslogin` | smsLogin | - | live | 401 |  |
| `POST` | `/api/v1/users/upnewuserpwd` | registerlogin | - | skipped (catastrophic blocklist) |  |  |
| `GET` | `/api/v1/users/wxinfo` | wxlogins | - | live | 200 |  |

## /api/v2

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `GET` | `/api/v2/users/account_set_meal_restrict` | succestrict | - | live | 30401 |  |
| `POST` | `/api/v2/users/bind_user` | newwxbangding | - | live | 401 |  |
| `POST` | `/api/v2/users/change_user` | newchangeus | - | live | 30401 |  |
| `POST` | `/api/v2/users/codeLogin` | newcodeLogin | - | live | 401 |  |
| `POST` | `/api/v2/users/del_account_set_meal_restrict` | delerestrict | - | live | 30401 |  |
| `POST` | `/api/v2/users/ding_talk_callback` | nwedinglogin | - | live | 401 |  |
| `POST` | `/api/v2/users/ding_talk_config` | newdingding | - | live | 200 |  |
| `POST` | `/api/v2/users/login` | newlogin | - | live | 401 |  |
| `POST` | `/api/v2/users/register` | newregistr | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/api/v2/users/reset_password` | newpassword | - | live | 401 |  |
| `POST` | `/api/v2/users/sendCode` | newCode | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/api/v2/users/set_account_set_meal_restrict` | getrestrict | - | live | 30401 |  |
| `POST` | `/api/v2/users/set_new_pwd` | newrpapass | - | live | 30401 |  |
| `POST` | `/api/v2/users/wx_config` | newwxlogin | - | live | 200 |  |

## /v2/cost

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/v2/cost/costmanagement/coupons_send` | sendCoupons | `company_id`, `uid`, `coupon_id`, `promoter`, `source` | live | 401 | record not found |
| `POST` | `/v2/cost/costmanagement/findDevicesByOrderNo` | deviceOrderScan | `orderNo` | live | 200 | ok |
| `GET` | `/v2/cost/costmanagement/get_user_set_meal` | getUsermeal | - | live | 200 | ok |
| `GET` | `/v2/cost/costmanagement/getOrderDetailByDetailsNo` | getOrderDetailByDetailsNo | `details_no` | live | 200 | ok |
| `GET` | `/v2/cost/costmanagement/getOrderDetailNew` | getOrderDetailNew | `order_no`, `oid` | live | 200 | ok |
| `POST` | `/v2/cost/costmanagement/getOrderDetailNewByMultiple` | getOrderDetailNewByMultiple | `oids`, `details_nos` | live | 200 | ok |
| `POST` | `/v2/cost/costmanagement/getOrderDetailStatus` | getOrderDetailStatus | - | live | 4009 | 请求参数错误 |
| `GET` | `/v2/cost/costmanagement/getorderinfo` | getorderinfo | - | live | 200 | ok |
| `GET` | `/v2/cost/costmanagement/getOrderManagementNew` | getorderlist | - | live | 200 | ok |
| `GET` | `/v2/cost/costmanagement/getrechargecloudcoin` | getrechargeamount | - | live | 200 | ok |
| `GET` | `/v2/cost/costmanagement/getrechargehistory` | getrechargehistory | `uid`, `type` | live | 200 | ok |
| `GET` | `/v2/cost/costmanagement/orderExportNew` | orderexport | - | live | 200 | ok |
| `POST` | `/v2/cost/costmanagement/renew_meal_pay` | renewMealPay | - | live | 4009 | 请求参数错误 |
| `POST` | `/v2/cost/costmanagement/set_meal_auto_set` | set_meal_auto_set | `auto_renew` | live | 200 | ok |
| `POST` | `/v2/cost/costmanagement/set_meal_pay` | setmealPay | - | live | 4009 | 请求参数错误 |
| `GET` | `/v2/cost/costmanagement/set_meal_set` | getsetmeal | `id` | live | 200 | ok |
| `GET` | `/v2/cost/costmanagement/user_coupons_event_list` | bindMobilePhoneCoupon | - | live | 200 | ok |
| `POST` | `/v2/cost/device/balance_pay` | balancePay | `order_no`, `auto_renew` | live | 4009 | 请求参数错误 |
| `POST` | `/v2/cost/device/batch_cloud_browser` | batchCloudBrowser | - | live |  |  |
| `POST` | `/v2/cost/device/batch_cloud_browser_renew` | batchCloudBrowserRenew | `renew` | live |  |  |
| `POST` | `/v2/cost/device/batch_create_order` | createOrder | - | live | 4009 | 请求参数错误 |
| `POST` | `/v2/cost/device/batch_create_renew` | batchCreateRenew | `renew` | live | 4009 | 请求参数错误 |
| `POST` | `/v2/cost/device/cancel_order` | cancelOrder | `order_no` | live | 4009 | 请求参数错误 |
| `POST` | `/v2/cost/device/cart_delete` | cartDelete | `carts`, `oid` | live | 200 | ok |
| `POST` | `/v2/cost/device/cart_update` | cartUpdate | - | live | 200 | ok |
| `POST` | `/v2/cost/device/create_order` | createDeviceOrder | - | live | 4009 | 请求参数错误 |
| `POST` | `/v2/cost/device/create_renew` | createRenewOrder | - | live | 4009 | 请求参数错误 |
| `POST` | `/v2/cost/device/createNewbieDeviceOrder` | createNewbieDeviceOrder | - | live | 4009 | 请求参数错误 |
| `GET` | `/v2/cost/device/findorder` | findorder | `order_no` | live | 200 | ok |
| `POST` | `/v2/cost/device/pay_scan` | devicePayScan | `pay_type`, `pay_type_extra`, `auto_renew`, `amount`, `order_no` | live | 4009 | 请求参数错误 |
| `GET` | `/v2/cost/device/paypal` | notifyPaypal | `orderId` | skipped (catastrophic blocklist) |  |  |
| `GET` | `/v2/cost/device/repayrecharge` | repayrecharge | `pay_type`, `pay_type_extra`, `order_no` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/cost/device/scanrecharge` | scanrecharge | `amount`, `coupon_code`, `pay_type`, `pay_type_extra`, `source_type` | live | 4009 | 请求参数错误 |

## /v2/message

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/v2/message/sms-setting/change` | changeRenewSmsNotifySetting | `renewSmsNotifyEnabled` | live | 500 | Key: 'UserSmsSettingChangeReq.RenewSmsNotifyEnable |
| `POST` | `/v2/message/sms-setting/get` | getRenewSmsNotifySetting | - | live | 200 | OK |
| `POST` | `/v2/message/user-notice/noticeRed` | userNoticeNoticeRed | - | live | 200 | OK |
| `POST` | `/v2/message/user-notice/readAll` | userNoticeReadAll | - | live | 200 | OK |
| `POST` | `/v2/message/user-notice/update` | getReadMessage_new | `companyId`, `userId`, `status`, `id` | live | 200 | OK |

## /v2/newbrowser

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/v2/newbrowser/account-users/update` | envUpdate | `accountIds` | live | 200 | OK |
| `POST` | `/v2/newbrowser/addusershopauthority` | addusershopauthority | `userid`, `shopids` | live | 500 | empty slice found |
| `POST` | `/v2/newbrowser/batchCloneShop` | batchCloneShop | `number`, `accountIds` | live | 200 | OK |
| `POST` | `/v2/newbrowser/batchCreateShop` | batchCreateShop | - | live | 400 | unknown error |
| `POST` | `/v2/newbrowser/bindingUserPasswordList` | bindingUserPasswordList | `user_password_ids` | live | 200 | OK |
| `POST` | `/v2/newbrowser/clearCookie` | clearCookie | `account_id` | live | 200 | OK |
| `POST` | `/v2/newbrowser/cloud-accounts/auto-renew/enable` | cloudAccountsAutoRenewEnable | - | live | 200 | OK |
| `POST` | `/v2/newbrowser/cloud-accounts/browser-url/reset` | cloudAccountsBrowserUrlReset | - | live | 500 | record not found |
| `POST` | `/v2/newbrowser/cloud-accounts/create` | yunBrowserCloudAccountsCreate | `cloudId`, `productId`, `autoRenew`, `browser`, `headless` | live | 500 | kernel is required |
| `POST` | `/v2/newbrowser/cloud-accounts/del` | yunBrowserCloudAccountsDel | - | live | 500 | record not found |
| `POST` | `/v2/newbrowser/cloud-accounts/restart` | cloudAccountsRestart | - | live | 500 | record not found |
| `POST` | `/v2/newbrowser/cloud-accounts/setproxytoshop` | deviceBindAccount_Yun | `proxy`, `shopProxy` | live | 200 | OK |
| `POST` | `/v2/newbrowser/cloud-accounts/update` | yunBrowserCloudAccountsUpdate | `browser`, `restart` | live | 500 | record not found |
| `POST` | `/v2/newbrowser/configpersonalsettings` | configPersonalSettings | `batch_start`, `search_engine`, `language`, `starting_env` | live | 200 | OK |
| `POST` | `/v2/newbrowser/configsettings` | configSettings | `device_authorities`, `bind_proxy`, `expired_display`, `storage`, `risk_control`, `monitoring`, `env_multi_open`, `load_image`, `load_image_max_size`, `play_sound`, `enable_gc`, `gc_time`, `enable_clear_storage` | live | 200 | OK |
| `POST` | `/v2/newbrowser/creatbatchaddxlsxuuid` | addxlsxuuid | `import_type` | live | 200 | OK |
| `POST` | `/v2/newbrowser/createUserPassword` | createUserPassword | - | live | 200 | OK |
| `POST` | `/v2/newbrowser/deletegroups` | delefenzu | `groupid` | live | 200 | OK |
| `POST` | `/v2/newbrowser/deleteUserPassword` | deleteUserPassword | `user_password_ids`, `title`, `text` | live | 200 | OK |
| `POST` | `/v2/newbrowser/deleteUserPasswordRecycle` | deleteUserPasswordRecycle | - | live | 200 | OK |
| `POST` | `/v2/newbrowser/getbatchaddxlsxlist` | getxlsxlist | `import_key`, `import_status`, `import_type` | live | 404 | 资源不存在 |
| `POST` | `/v2/newbrowser/getbatchaddxlsxprocess` | getxlsxprocess | `import_key` | live | 200 | OK |
| `POST` | `/v2/newbrowser/getBindUserPassword` | getBindUserPassword | `user_password_id`, `pageSize` | live | 200 |  |
| `POST` | `/v2/newbrowser/getLatestOpenAccountIdList` | getLatestOpenAccountId | `num` | live | 200 | OK |
| `POST` | `/v2/newbrowser/getsettings` | getSettings | - | live | 200 |  |
| `POST` | `/v2/newbrowser/getshopconfigrpa` | getaccountinfo | `shopid` | live | 200 | Success |
| `POST` | `/v2/newbrowser/migrate/apply` | migrateApply | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/newbrowser/newbieStepCreateShop` | newbieStepCreateShop | - | live | 200 | Success |
| `POST` | `/v2/newbrowser/postBatchAddUserPassword` | postBatchAccount | `list`, `kernelVersion`, `key` | live | 4013 | unknown error |
| `POST` | `/v2/newbrowser/postbatchaddxlsx` | addxlsxPost | `list`, `kernelVersion`, `key` | live | 404 | 资源不存在 |
| `POST` | `/v2/newbrowser/proxy-batch-import` | proxyBatchImport | `browsers` | live | 200 | OK |
| `POST` | `/v2/newbrowser/proxy-batch-import-res` | proxyBatchImportRes | `taskId` | live | 200 | OK |
| `POST` | `/v2/newbrowser/putaddlabel` | batchlabel | `info`, `id`, `shopid`, `label` | live | 200 | OK |
| `POST` | `/v2/newbrowser/putaddnotes` | BatchRemarks | `notes`, `shopid` | live | 200 | OK |
| `POST` | `/v2/newbrowser/putchangegroup` | changputchang | `company`, `companyid`, `userid`, `groupid`, `shopid` | live | 403 | 暂无访问权限 |
| `POST` | `/v2/newbrowser/putdeleteallauthority` | putdeleteallauthority | `userid` | live | 4009 | unknown error |
| `POST` | `/v2/newbrowser/putdeleteauthority` | putdeleteauthority | `company`, `companyid`, `userid`, `shopids`, `touserid` | live | 200 | OK |
| `POST` | `/v2/newbrowser/putdeletegroupauthority` | putdeletegroupauthority | `groupid` | live | 200 | OK |
| `POST` | `/v2/newbrowser/putdeleteshop` | deleaccountlist | `company`, `companyid`, `userid`, `shopid` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/newbrowser/putdeleteshopfromrecycle` | getdeleteshop | `shopid` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/newbrowser/putdeleteuserselfuri` | delealluserself | `company`, `companyid`, `userid`, `platformid` | live | 200 | OK |
| `POST` | `/v2/newbrowser/putmoveauthority` | putmoveauthority | `company`, `companyid`, `userid`, `shopids`, `usered`, `touserid` | live | 200 | OK |
| `POST` | `/v2/newbrowser/putnewgroup` | addgroups | `group`, `company`, `companyid`, `userid`, `groupid` | live | 200 |  |
| `POST` | `/v2/newbrowser/putOpenUrl` | putOpenUrl | `shopid`, `url` | live | 4011 | unknown error |
| `POST` | `/v2/newbrowser/putuserselfuri` | addalluserself | `company`, `companyid`, `userid`, `self`, `login_url` | live | 500 | empty slice found |
| `POST` | `/v2/newbrowser/quickCreateShop` | quickCreate | - | live | 400 | unknown error |
| `POST` | `/v2/newbrowser/resetshopproxy` | resetshopproxy | `device_ids`, `remark` | live | 200 | OK |
| `POST` | `/v2/newbrowser/resetyunshopproxy` | resetyunshopproxy | `device_ids`, `remark` | live | 200 | OK |
| `POST` | `/v2/newbrowser/retsetshopisstartag` | getretsetshopisstartag | `shopid`, `startag` | live | 200 | OK |
| `POST` | `/v2/newbrowser/retsetshopistop` | setEnvTop | `shopid`, `top` | live | 4009 | unknown error |
| `POST` | `/v2/newbrowser/retsetshopName` | retsetshopName | `shopid`, `accountname` | live | 200 | OK |
| `POST` | `/v2/newbrowser/setCookie` | setCookie | `shopid`, `cookie` | live | 400 | unknown error |
| `POST` | `/v2/newbrowser/setproxytoshop` | deviceBindAccount | `proxy`, `shopProxy` | live | 200 | OK |
| `POST` | `/v2/newbrowser/setShopProxy` | setShopProxy | - | live | 200 | OK |
| `POST` | `/v2/newbrowser/shareShopClosed` | shareShopClosed | `shopids` | live | 200 | OK |
| `POST` | `/v2/newbrowser/shareShopDel` | shareShopDel | `shopids`, `accountCompanyId`, `ids` | live | 200 | OK |
| `POST` | `/v2/newbrowser/storage/del` | deleteCloudCache | `account_id`, `file_key` | live | 200 | OK |
| `POST` | `/v2/newbrowser/storage/update` | updateCloudCache | `account_id`, `file_key`, `filename`, `remark` | live | 200 | OK |
| `POST` | `/v2/newbrowser/updateProxyShop` | updateProxyShop | `proxy`, `name`, `uuid`, `inlie`, `type`, `zhima`, `Url`, `Interval`, `ipChannel`, `deviceType`, `dynamic`, `Type` | error |  | The operation was aborted due to timeout |
| `POST` | `/v2/newbrowser/updateUserPassword` | updateUserPassword | - | live | 200 | OK |
| `POST` | `/v2/newbrowser/updateUserPasswordRemark` | updateUserPasswordRemark | `user_password_ids`, `remark` | live | 200 | OK |
| `POST` | `/v2/newbrowser/updateYunShopProxy` | updateYunShopProxy | `proxy` | error |  | The operation was aborted due to timeout |
| `POST` | `/v2/newbrowser/userPasswordSetAccountId` | userPasswordSetAccountId | `shopid`, `user_password_id` | live | 404 | 资源不存在 |
| `POST` | `/v2/newbrowser/world/closeShareShop` | getCloseShareShop | `shopids` | dead (HTTP 404: the path has no handler) |  |  |

## /v2/news

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `GET` | `/v2/news/settings/info` | getNewsSettingsInfo | `key` | live | 500 | 配置不存在 |

## /v2/plugin

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `PUT` | `/v2/plugin/bind` | bindAccount | `accountIds`, `pluginId`, `isTeam`, `pluginCompanyId`, `accountIdsCompanyId` | live | 200 | ok |
| `POST` | `/v2/plugin/bindGrouopPlugin` | bindGrouopPlugin | `groupId`, `accountIds`, `kernel` | live | 7 | empty slice found |
| `POST` | `/v2/plugin/createPluginCrx` | uploadPlugin | - | live | 30009 | 插件已存在 |
| `DELETE` | `/v2/plugin/deletePluginCrx` | deletePluginCrx | - | skipped (catastrophic blocklist) |  |  |
| `GET` | `/v2/plugin/downloadFromWebStore` | downloadFromWebStore | `url` | live | 7 | 下载路径不能为空 |
| `GET` | `/v2/plugin/getAddedAndGlobalplugin` | getAddedAndGlobalplugin | `shopId`, `shopid` | live | 200 | ok |
| `POST` | `/v2/plugin/group/addPluginGroup` | addPluginGroup | `groupId`, `pluginCompanyId` | live |  |  |
| `POST` | `/v2/plugin/group/createPluginGroup` | createPluginGroup | - | skipped (catastrophic blocklist) |  |  |
| `DELETE` | `/v2/plugin/group/deletePluginGroup` | deletePluginGroup | `groupId` | skipped (catastrophic blocklist) |  |  |
| `PUT` | `/v2/plugin/group/updatePluginGroup` | updatePluginGroup | `groupId` | live |  |  |
| `POST` | `/v2/plugin/updateGlobalVisibility` | updateGlobalVisibility | `pluginCompanyId` | live | 200 | ok |
| `PUT` | `/v2/plugin/updatePluginCrx` | updatePluginCrx | - | live | 30009 | 插件已存在 |
| `POST` | `/v2/plugin/updateTeamVisibility` | updateTeamVisibility | - | live | 200 | ok |
| `GET` | `/v2/plugin/updateTeamVisibilityJurisdiction` | updateTeamVisibilityJurisdiction | `pluginId` | live | 200 | ok |

## /v2/proxy

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/v2/proxy/device/batchautorenew` | autoRenewProxy | - | live | 4009 | 请求参数错误 |
| `POST` | `/v2/proxy/device/batchcloserenew` | closeAutoRenew | - | live | 4009 | 请求参数错误 |
| `POST` | `/v2/proxy/device/batchdelete` | batchDelPlatformProxy | `status`, `device_ids`, `user_id` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/proxy/device/batchtag` | batchTag | `tags`, `device_ids` | live | 4009 | 请求参数错误 |
| `POST` | `/v2/proxy/device/createDeviceUserSelves` | createDeviceUserSelves | - | live | 200 | ok |
| `POST` | `/v2/proxy/device/creatingDeviceLogs` | createLog | `device_own_id`, `device_id`, `device_name`, `company_id`, `device_type`, `content`, `public_ip` | live | 200 | ok |
| `POST` | `/v2/proxy/device/delAllDeviceLogs` | delAllDeviceLogs | - | live | 200 | ok |
| `POST` | `/v2/proxy/device/delDeviceDynamicProxies` | delDeviceDynamicProxies | `device_ids` | live | 200 | ok |
| `POST` | `/v2/proxy/device/delDeviceLogs` | delDeviceLogs | `ids` | live | 200 | ok |
| `POST` | `/v2/proxy/device/delDeviceProxyUserSelves` | delDeviceProxyUserSelves | `company`, `company_id`, `user_id`, `device_ids` | live | 200 | ok |
| `POST` | `/v2/proxy/device/delTag` | delTag | `company`, `companyid`, `labelid` | live | 200 | ok |
| `POST` | `/v2/proxy/device/recycleDelAllDeviceDynamicProxies` | recycleDelAllDeviceDynamicProxies | `trademark` | live | 401 | device id is required |
| `POST` | `/v2/proxy/device/recycleDelAllDeviceProxyUserSelves` | recycleDelAllDeviceProxyUserSelves | - | live | 401 | device id is required |
| `POST` | `/v2/proxy/device/recycleDelDeviceDynamicProxies` | recycleDelDeviceDynamicProxies | - | live | 200 | ok |
| `POST` | `/v2/proxy/device/recycleDelDeviceProxyUserSelves` | recycleDelDeviceProxyUserSelves | `device_ids` | live | 200 | ok |
| `POST` | `/v2/proxy/device/recycleRecoverAllDeviceProxyUserSelves` | recycleRecoverAllDeviceProxyUserSelves | - | live | 401 | device id is required |
| `POST` | `/v2/proxy/device/recycleRecoveryAllDeviceDynamicProxies` | recycleRecoveryAllDeviceDynamicProxies | `trademark` | live | 401 | device id is required |
| `POST` | `/v2/proxy/device/recycleRecoveryDeviceDynamicProxies` | recycleRecoveryDeviceDynamicProxies | `device_ids` | live | 200 | ok |
| `POST` | `/v2/proxy/device/recycleRecoveryDeviceProxyUserSelves` | recycleRecoveryDeviceProxyUserSelves | `device_ids` | live | 200 | ok |
| `POST` | `/v2/proxy/device/resetname` | resetDeviceName | `device_type`, `device_id`, `name` | live | 200 | ok |
| `POST` | `/v2/proxy/device/updateDeviceDynamicProxies` | updateDeviceDynamicProxies | `deviceid`, `trademark`, `name`, `type`, `autoswitch`, `url`, `ip_query_channel` | live | 200 | ok |
| `POST` | `/v2/proxy/device/updateDeviceProxyUserSelves` | updateDeviceProxyUserSelves | `company`, `companyid`, `userid`, `non_repeat`, `proxy`, `notes`, `trademark` | live | 200 | ok |
| `POST` | `/v2/proxy/device/updateIPAddressSegment` | ipDetect | `ip`, `approach`, `deviceId`, `ip_channel`, `inspect` | live | 200 | ok |
| `POST` | `/v2/proxy/device/updateIPAddressSegmentBatch` | updateIPAddressSegmentBatch | `ip`, `approach`, `deviceId`, `inspect`, `ip_channel` | live | 401 | Parameter type error, please check |
| `POST` | `/v2/proxy/device/updateTag` | updateTag | `label`, `color`, `company`, `companyid`, `labelid` | skipped (catastrophic blocklist) |  |  |

## /v2/retail

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/v2/retail/createPromotionLink` | createPromotionLink | `customContent`, `linkName`, `idempotencyKey` | live | 7 | Key: 'RetailPromotionLinkCreate.CustomContent' Err |
| `POST` | `/v2/retail/createRetailWithdrawLog` | applywithdrawals | `amount` | live | 40014 | 最低提现100元 |
| `DELETE` | `/v2/retail/deletePromotionLink` | deletePromotionLink | `id` | skipped (catastrophic blocklist) |  |  |
| `GET` | `/v2/retail/findRetailSettleConfig` | commissionsConfigInfo | - | live | 200 | ok |
| `GET` | `/v2/retail/findRetailUserInviteCode` | promoInfo | - | live | 200 | ok |
| `GET` | `/v2/retail/getUserCompanyInviteList` | getPromoUser | `pageIndex`, `pageSize`, `companyName`, `status`, `startCreatedAt`, `endCreatedAt` | live |  |  |

## /v2/rpa

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/v2/rpa/copyRpaCarbonConfig` | copyRpaCarbonConfig | `configId` | live | 50004 | 获取失败 |
| `POST` | `/v2/rpa/createRpaGroup` | createRpaGroup | `name` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/rpa/createRpaPlanManagement` | createRpaPlanManagement | - | live | 7 | Account 错误 |
| `POST` | `/v2/rpa/createRpaShop` | createRpaShop | - | live | 200 | 操作成功 |
| `DELETE` | `/v2/rpa/deleteRpaCarbonConfig` | deleteRpaCarbonConfig | `configId` | skipped (catastrophic blocklist) |  |  |
| `DELETE` | `/v2/rpa/deleteRpaGroup` | deleteRpaGroup | `groupId` | skipped (catastrophic blocklist) |  |  |
| `DELETE` | `/v2/rpa/deleteRpaGroupByGroupIds` | deleteRpaGroupByGroupIds | `groupId` | skipped (catastrophic blocklist) |  |  |
| `DELETE` | `/v2/rpa/deleteRpaPlanManagementByPlanIds` | deleteRpaPlanManagementByPlanIds | `planId` | skipped (catastrophic blocklist) |  |  |
| `DELETE` | `/v2/rpa/destroyRpaCarbonConfigByAll` | destroyRpaCarbonConfigByAll | - | skipped (catastrophic blocklist) |  |  |
| `DELETE` | `/v2/rpa/destroyRpaCarbonConfigByConfigIds` | destroyRpaCarbonConfigByConfigIds | `configId` | skipped (catastrophic blocklist) |  |  |
| `GET` | `/v2/rpa/findRpaCarbonConfig` | findRpaCarbonConfig | `configId` | live | 200 | 操作成功 |
| `GET` | `/v2/rpa/getRpaCarbonConfigList` | getRpaCarbonConfigList | `groupId`, `rpaName`, `pageIndex`, `pageSize` | live | 0 |  |
| `PUT` | `/v2/rpa/recoverRpaCarbonConfigByAll` | recoverRpaCarbonConfigByAll | - | live | 200 | 操作成功 |
| `PUT` | `/v2/rpa/recoverRpaCarbonConfigByConfigIds` | recoverRpaCarbonConfigByConfigIds | `configId` | live | 200 | 操作成功 |
| `GET` | `/v2/rpa/recycleRpaCarbonConfig` | recycleRpaCarbonConfig | `rpaName`, `pageIndex`, `pageSize` | live | 0 |  |
| `PUT` | `/v2/rpa/topRpaCarbonConfig` | topRpaCarbonConfig | `configId` | live | 50004 | 获取失败 |
| `PUT` | `/v2/rpa/updateRpaCarbonConfigGroupId` | updateRpaCarbonConfigGroupId | `groupId`, `configId` | live | 200 | 操作成功 |
| `PUT` | `/v2/rpa/updateRpaGroup` | updateRpaGroup | `groupId`, `name` | live | 50004 | 获取失败 |
| `PUT` | `/v2/rpa/updateRpaPlanManagement` | updateRpaPlanManagement | - | live | 7 | executeType 错误 |
| `PUT` | `/v2/rpa/updateRpaPlanManagementStatus` | updateRpaPlanManagementStatus | `planId`, `status` | live | 50002 | 更新失败 |

## /v2/sso

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/v2/sso/auth/bind` | bindPhoneEmail | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/sso/auth/bindThirdLogin` | bindThirdAccount | `scene`, `types`, `code`, `state` | live | 200 | 成功 |
| `POST` | `/v2/sso/auth/changePwd` | changePwd | `newPassword` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/sso/auth/changeUserinfo` | editUserInfo | - | live | 200 | 修改成功 |
| `POST` | `/v2/sso/auth/modifyMobileEmail` | modifyMobileEmail | `username`, `modifyCode`, `code` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/sso/auth/sendModifyCode` | sendModifyCode | `checkExist`, `code`, `uuid`, `username`, `modifyCode`, `types` | live | 10003 | 必须手机号或者邮箱注册 |
| `POST` | `/v2/sso/auth/setIndustryInfo` | setIndustryInfo | `industry_label` | live | 200 | 成功 |
| `POST` | `/v2/sso/auth/setInfo` | authSetInfo | - | live | 200 | 成功 |
| `POST` | `/v2/sso/auth/setNewbieStep` | setNewbieStep | `data`, `skip`, `step`, `platformId`, `platformType`, `accountId`, `cloudId`, `couponNo`, `officialDeviceId`, `selfDeviceId`, `orderNo`, `auth`, `startBrowserTime` | live | 200 | ok |
| `POST` | `/v2/sso/auth/ubind` | unbindAuth | `ubind`, `userId`, `companyId` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/sso/auth/verifyModifyCode` | verifyModifyCode | `username`, `modifyCode`, `code` | live | 10022 | 无权修改 |
| `POST` | `/v2/sso/login` | getuserlogin | `os`, `source`, `last_login_port`, `last_login_device`, `cl`, `username`, `code`, `uuid` | live | 10003 | 必须手机号或者邮箱注册 |
| `POST` | `/v2/sso/loginDing` | ddlogin | `code`, `state` | live | 500 | 扫码登录失败，请稍后重试 |
| `POST` | `/v2/sso/loginGoogle` | loginGoogle | `credential`, `channel`, `os`, `source`, `last_login_port`, `last_login_device`, `cl`, `code`, `data`, `msg`, `email` | error |  | The operation was aborted due to timeout |
| `POST` | `/v2/sso/mp/login` | getwxlogin | `scene` | live | 1055 | 未收到扫描信息 |
| `POST` | `/v2/sso/register` | getuserregister | `username`, `inviter`, `code`, `password`, `rePassword`, `contact`, `type`, `source`, `last_login_port`, `last_login_device`, `os`, `cl` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/sso/sendCode` | getusercaptcha | `code`, `uuid`, `username`, `checkExist`, `type` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/sso/verify/code` | verifyCode | `username`, `code` | live | 10003 | 必须手机号或者邮箱注册 |

## /v2/team

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/v2/team/authentication/insertAuthentication` | insertAuthentication | `authenticationType`, `name`, `companyIdCard`, `userIdCard` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/authentication/insertAuthenticationCompanyFourElementsVerification` | insertAuthenticationCompanyFourElementsVerification | `epCertName`, `epCertNo`, `legalPersonCertName`, `legalPersonCertNo` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/authentication/resetAuthentication` | resetAuthentication | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/company/approvalJoin` | approvalJoin | - | live | 10019 | 您已在员工列表内 |
| `POST` | `/v2/team/company/approveMember` | approveMember | `approvalId`, `approvalStatus`, `refuseType` | live | 500 | 查看对象不存在或无权查看 |
| `POST` | `/v2/team/company/change` | editCompanies | `name` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/company/create` | createCompany | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/company/user/updatePackageStatus` | updatePackageStatus | `companyId`, `reset`, `userIds` | live | 200 | ok |
| `POST` | `/v2/team/dept/change` | updateDept | `pid`, `departmentName`, `deptId`, `uids` | live | 10022 | 无权修改 |
| `POST` | `/v2/team/dept/create` | createDept | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/dept/del` | deleteDept | `id` | live | 10017 | 无权删除 |
| `POST` | `/v2/team/env-settings/get` | getEnvSettings | `tags` | live | 200 | OK |
| `POST` | `/v2/team/env-settings/update` | updateEnvSettings | `tag`, `content`, `left`, `right` | live | 500 | Key: 'EnvSettingsUpdateReq.Tag' Error:Field valida |
| `POST` | `/v2/team/invite/getCode` | getInviteCode | `reset` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/loginlogs` | loginlogs | - | live | 200 | 查询成功 |
| `POST` | `/v2/team/logout` | vloginout | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/member/accessApply` | loginApply | - | live | 500 | 已失效，请重新申请 |
| `POST` | `/v2/team/member/change` | editMember | `deptId`, `userId`, `companyId`, `leave` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/member/move` | moveDeptMember | `srcDeptId`, `destDeptId` | live | 200 | 查询成功 |
| `POST` | `/v2/team/member/myInfo/change` | myInfoChange | - | live | 200 | 修改成功 |
| `POST` | `/v2/team/role-group/create` | createRoleGroup | - | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/role-group/del` | deleteRoleGroup | `ids` | live | 500 | WHERE conditions required |
| `POST` | `/v2/team/role-group/role/move` | roleGroupMigrateRole | `toId`, `fromId` | live | 200 | OK |
| `POST` | `/v2/team/role-group/update` | updateRoleGroup | - | live | 200 | OK |
| `POST` | `/v2/team/role/change` | editRole | `rightIds`, `gid`, `roleDesc`, `roleSlug` | live | 10012 | 至少选择一项权限 |
| `POST` | `/v2/team/role/del` | deleteRole | `id` | skipped (catastrophic blocklist) |  |  |
| `POST` | `/v2/team/role/great` | addRoleAccount | `userIds`, `RoleId` | live | 200 | 授权完成 |
| `POST` | `/v2/team/sidebar/update` | updateSidebar | - | live | 200 | ok |

## /v2/yun

| Method | Path | Client name | Candidate request keys | Status | Code | msg |
| --- | --- | --- | --- | --- | ---: | --- |
| `POST` | `/v2/yun/qrcode-setting/get` | getQrCodeSetting | - | live | 200 | OK |
