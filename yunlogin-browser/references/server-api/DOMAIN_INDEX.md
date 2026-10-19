# Server API Domain Index

Browse the management-center API by business area. Each family aggregates the enum-like fields that
were observed live, the values they carried, and the codes whose meaning the API itself confirmed
through a paired `*_text` label. Route counts come from the full 507-route sweep.

- Field paths and types per endpoint: [ROUTE_FIELDS.md](ROUTE_FIELDS.md)
- Observed value domains: [FIELD_VALUES.md](FIELD_VALUES.md)
- Confirmed code meanings: [CODE_LEGENDS.md](CODE_LEGENDS.md)
- Envelope and key-name traps: [RESPONSE_SHAPES.md](RESPONSE_SHAPES.md)

## Family Overview

| Family | Title | Routes | Live | Skipped | Errors | Not served |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `/v2/newbrowser` | Environments | 129 | 116 | 4 | 9 | 0 |
| `/v2/proxy` | Proxies | 49 | 46 | 2 | 1 | 0 |
| `/v2/cost` | Billing, Orders And Invoices | 51 | 49 | 2 | 0 | 0 |
| `/v2/team` | Team, Members And Permissions | 59 | 48 | 11 | 0 | 0 |
| `/v2/plugin` | Plugins | 32 | 27 | 5 | 0 | 0 |
| `/v2/rpa` | RPA Automation | 30 | 23 | 7 | 0 | 0 |
| `/v2/retail` | Retail And Distribution | 10 | 9 | 1 | 0 | 0 |
| `/v2/sso` | Session And Authentication | 26 | 18 | 7 | 1 | 0 |
| `/v2/message` | Notifications And SMS | 8 | 8 | 0 | 0 | 0 |
| `/v2/news` | Help And Legal Content | 5 | 5 | 0 | 0 | 0 |
| `/v2/logs` | Audit Logs | 2 | 2 | 0 | 0 | 0 |
| `/v2/admin` | Administration | 2 | 2 | 0 | 0 | 0 |
| `/v2/tg` | Telemetry | 2 | 2 | 0 | 0 | 0 |
| `/v2/yun` | Yun Services | 2 | 2 | 0 | 0 | 0 |
| `/v2/check` | Checks | 1 | 0 | 0 | 1 | 0 |
| `/v2/collector` | Collector | 1 | 1 | 0 | 0 | 0 |
| `/api/v1` | Legacy v1 Prefix | 65 | 55 | 7 | 3 | 0 |
| `/api/v2` | Legacy v2 Prefix | 15 | 13 | 2 | 0 | 0 |

## Environments - `/v2/newbrowser`

Environment (browser profile) lifecycle, fingerprint, storage, sharing, credentials, recycle bin.

Routes: 129 total, 116 probed, 4 skipped (writes/blocklist), 9 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `data[].childclass` | string | 1 | `tiktok小店`, `Facebook`, `TikTok`, `Twitter`, `Youtube`, `WhatsApp`, `Telegram`, `SKYpe` (+5 more) |
| `MacOS[].system` | string | 1 | `All MacOS`, `MacOS 15`, `MacOS 14`, `MacOS 13`, `MacOS 12`, `MacOS 11`, `MacOS 10` |
| `Android[].system` | string | 1 | `All Android`, `Android 13`, `Android 12`, `Android 11`, `Android 10`, `Android 9` |
| `fatherclass` | string | 1 | `电商`, `社交`, `支付`, `邮箱`, `问卷`, `广告` |
| `Windows[].system` | string | 1 | `All Windows`, `Windows 11`, `Windows 10`, `Windows 8.1`, `Windows 8`, `Windows 7` |
| `list[].system` | string | 3 | `Windows 10`, `Windows 8`, `Windows 7`, `Windows 11`, `Windows 8.1` |
| `IOS[].system` | string | 1 | `All IOS`, `IOS 16`, `IOS 15`, `IOS 14` |
| `data[].fatherclass` | string | 1 | `电商`, `社交` |
| `defaultfingerprint.system` | string | 2 | `Windows 10`, `Windows 11` |
| `font.enable` | number | 3 | `1`, `0` |
| `geographic.enable` | number | 3 | `1`, `0` |
| `data.expireInWeek` | number | 1 | `0` |
| `data[].status` | number | 1 | `3` |
| `defaultfingerprint.AudioContext` | number | 2 | `0` |
| `defaultfingerprint.kernel` | string | 2 | `Chrome` |
| `dns.mode` | boolean | 8 | `false` |
| `finger[].AudioContext` | number | 1 | `0` |
| `finger[].kernel` | string | 1 | `Chrome` |

## Proxies - `/v2/proxy`

Self, dynamic, cloud and VCNP proxies, proxy tags, authority and IP segments.

Routes: 49 total, 46 probed, 2 skipped (writes/blocklist), 1 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `price[].month` | number | 1 | `1`, `3`, `6`, `12` |
| `children[].parentCode` | string | 1 | `CHN`, `1` |
| `data[].city_code` | string | 1 | `CHN081000`, `CHN031000` |
| `data[].status` | number | 2 | `0`, `1` |
| `children[].flag` | number | 1 | `0` |
| `cloud.asn_type` | number | 1 | `0` |
| `cloud.band_width_type` | number | 1 | `0` |
| `cloud.cidr_status` | number | 1 | `0` |
| `cloud.ip_type` | number | 1 | `0` |
| `cloud.isp_type` | number | 1 | `0` |
| `cloud.net_type` | number | 1 | `0` |
| `cloud.proxy_type` | number | 1 | `0` |
| `cloud.sell_unit` | number | 1 | `0` |
| `cloud.unit` | number | 1 | `0` |
| `data[].area_code` | string | 1 | `1` |
| `data[].country_code` | string | 1 | `CHN` |
| `data[].device_type` | number | 1 | `5` |
| `data[].enable` | number | 1 | `1` |

## Billing, Orders And Invoices - `/v2/cost`

Plans, orders, balance, coupons, recharge, invoice titles and applications.

Routes: 51 total, 49 probed, 2 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `cloud_instances.city_code` | string | 1 | `USA0NYQEE`, `KOR011SEO`, `USA0WV0WV`, `RUS000MOW`, `GBRENGLND`, `USA0CASJC`, `IRL000000`, `SWE0000AB` (+10 more) |
| `new_cloud_instances.vtype` | string | 3 | `ipideash2`, `ak`, `ali`, `cmc`, `tx`, `ypk`, `awslight`, `huawei` (+6 more) |
| `vtype.vtype` | string | 2 | `ali`, `tx`, `cmc`, `huawei`, `ypk`, `awslight`, `ak`, `huawei_light` (+6 more) |
| `cloud_instances.country_code` | string | 1 | `USA`, `KOR`, `RUS`, `GBR`, `IRL`, `SWE`, `CHN`, `VNM` (+4 more) |
| `data[].country_code` | string | 1 | `USA`, `CHN`, `THA`, `IDN`, `JPN`, `BRA`, `MYS`, `GBR` |
| `list[].country_code` | string | 1 | `ARE`, `BGD`, `BHR`, `CHN`, `IDN`, `IND`, `JPN` |
| `list[].vtype` | string | 1 | `ypk`, `tx`, `cmc`, `ali`, `huawei`, `ak`, `awslight` |
| `new_cloud_instances.area_code` | string | 3 | `1`, `7`, `6`, `2`, `4`, `3` |
| `vtype.area_code` | string | 2 | `1`, `6`, `3`, `7`, `2`, `4` |
| `children[].flag` | number | 2 | `3`, `0`, `2`, `9`, `1` |
| `group_list[].area_code` | string | 1 | `4`, `7`, `6`, `1`, `2` |
| `cloud_instances.vtype` | string | 1 | `ipideash2`, `mb`, `ipideash`, `ipv` |
| `group_list[].vtype` | string | 1 | `mb`, `crown`, `ipv`, `ipideash2` |
| `new_cloud_instances.band_width_type` | number | 3 | `0`, `1`, `3`, `2` |
| `price[].month` | number | 4 | `1`, `3`, `6`, `12` |
| `vtype.band_width_type` | number | 2 | `3`, `0`, `1`, `2` |
| `cloud_instances.area_code` | string | 1 | `6`, `1`, `2` |
| `cloud_instances.isp_type` | number | 1 | `0`, `2`, `1` |

Confirmed code meanings:

| Route | Field | Code | Meaning |
| --- | --- | --- | --- |
| `/v2/cost/costmanagement/getOrderManagementNew` | `$.data.data[].pay_type` | `0` | 系统 |
| `/v2/cost/costmanagement/getOrderManagementNew` | `$.data.data[].pay_status` | `1` | 已支付 |
| `/v2/cost/costmanagement/getOrderManagementNew` | `$.data.data[].order_type` | `3` | 套餐订单 |
| `/v2/cost/costmanagement/getOrderManagementNew` | `$.data.data[].order_status` | `3` | 已完成 |
| `/v2/cost/costmanagement/getOrderManagementNew` | `$.data.data[].order_detail_all[].details_status` | `3` | 已完成 |

## Team, Members And Permissions - `/v2/team`

Company, departments, members, roles, invitations, authentication and plans.

Routes: 59 total, 48 probed, 11 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `data[].type` | string | 2 | `8`, `1`, `2`, `7`, `3`, `18`, `9`, `16` (+9 more) |
| `data[].versionCode` | number | 2 | `1000109`, `2000202`, `1000301`, `1000202`, `2000203`, `2000204`, `2000104`, `4000305` |
| `data[].templateType` | number | 1 | `1`, `2`, `3`, `4`, `5`, `6`, `7` |
| `data[].status` | number, string | 5 | `1`, `3`, `2` |
| `data.companyStatus` | number | 3 | `1`, `0` |
| `data.userStatus` | number | 3 | `1`, `0` |
| `data[].day` | number | 1 | `0`, `84` |
| `data[].free_status` | number | 1 | `1`, `0` |
| `data[].platform` | string | 3 | `windows`, `macosx` |
| `data[].roleType` | string, number | 3 | `1`, `2` |
| `data[].updateType` | string | 2 | `3`, `1` |
| `list[].clientType` | string | 1 | `1`, `client` |
| `data.leave_status` | number | 2 | `2` |
| `data.lockStatus` | number | 1 | `1` |
| `data.package_status` | number | 2 | `1` |
| `data.status` | number | 1 | `1` |
| `data[].isEnable` | string, number | 3 | `1` |
| `data[].lockStatus` | number | 2 | `1` |

Confirmed code meanings:

| Route | Field | Code | Meaning |
| --- | --- | --- | --- |
| `/v2/team/right/list` | `$.data[].type` | `1` | 环境管理 |
| `/v2/team/right/list` | `$.data[].type` | `2` | 代理管理 |
| `/v2/team/right/list` | `$.data[].type` | `3` | 费用管理 |
| `/v2/team/right/list` | `$.data[].type` | `4` | 团队管理 |
| `/v2/team/right/list` | `$.data[].type` | `5` | 日志管理 |
| `/v2/team/right/list` | `$.data[].type` | `6` | 账号管理 |
| `/v2/team/right/list` | `$.data[].type` | `7` | 插件管理 |
| `/v2/team/right/list` | `$.data[].type` | `8` | 新建浏览器 |
| `/v2/team/right/list` | `$.data[].type` | `9` | 回收站 |
| `/v2/team/right/list` | `$.data[].type` | `10` | RPA |
| `/v2/team/right/list` | `$.data[].type` | `11` | 分享转移 |
| `/v2/team/right/list` | `$.data[].type` | `12` | 账号设置 |
| `/v2/team/right/list` | `$.data[].type` | `13` | 设置 |
| `/v2/team/right/list` | `$.data[].type` | `15` | API |
| `/v2/team/right/list` | `$.data[].type` | `16` | 窗口同步 |
| `/v2/team/right/list` | `$.data[].type` | `18` | 商城 |
| `/v2/team/right/list` | `$.data[].type` | `21` | 开票设置 |
| `/v2/team/right/listTemplate` | `$.data[].templateType` | `1` | 管理员权限 |
| `/v2/team/right/listTemplate` | `$.data[].templateType` | `2` | 经理权限 |
| `/v2/team/right/listTemplate` | `$.data[].templateType` | `3` | 员工权限 |
| `/v2/team/right/listTemplate` | `$.data[].templateType` | `4` | RPA工程师 |
| `/v2/team/right/listTemplate` | `$.data[].templateType` | `5` | 自动化开发 |
| `/v2/team/right/listTemplate` | `$.data[].templateType` | `6` | 行政权限 |
| `/v2/team/right/listTemplate` | `$.data[].templateType` | `7` | 财务权限 |

## Plugins - `/v2/plugin`

Plugin market, installed plugins, plugin groups and visibility.

Routes: 32 total, 27 probed, 5 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `list[].installStatus` | number | 4 | `0`, `1` |
| `list[].kernel` | number | 4 | `1`, `0` |
| `list[].pluginType` | number | 3 | `0`, `2` |
| `list[].type` | number | 2 | `1`, `2` |
| `list[].typeText` | string | 1 | `功能分类`, `电商分类` |
| `crx[].installStatus` | number | 1 | `0` |
| `crx[].kernel` | number | 1 | `1` |
| `globalPlugin[].installStatus` | number | 1 | `1` |
| `globalPlugin[].kernel` | number | 1 | `1` |
| `globalPlugin[].pluginType` | number | 1 | `2` |
| `globalPlugin[].teamStatus` | number | 1 | `0` |
| `list[].teamStatus` | number | 2 | `0` |
| `repluginCompanies.kernel` | number | 1 | `1` |
| `repluginCompanies.pluginType` | number | 1 | `2` |
| `repluginCrx.category` | string | 1 | `运营工具` |
| `repluginCrx.installStatus` | number | 1 | `0` |
| `repluginCrx.kernel` | number | 1 | `1` |

Confirmed code meanings:

| Route | Field | Code | Meaning |
| --- | --- | --- | --- |
| `/v2/plugin/getPluginCategoryGroupList` | `$.list[].type` | `1` | 功能分类 |
| `/v2/plugin/getPluginCategoryGroupList` | `$.list[].type` | `2` | 电商分类 |

## RPA Automation - `/v2/rpa`

RPA groups, shops, plan management and task logs.

Routes: 30 total, 23 probed, 7 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `config[].type` | string | 3 | `newPage`, `gotoUrl`, `waitTime`, `scrollPage`, `forElements`, `screenshotPage`, `switchPage` |
| `children[].type` | string | 2 | `waitTime`, `click`, `ifElse`, `getElement`, `inputContent`, `keyboard` |
| `config.type` | string | 3 | `smooth`, `object`, `url` |
| `config.selectorType` | string | 2 | `page`, `selector` |
| `config.scrollType` | string | 2 | `position` |
| `config.timeoutType` | string | 2 | `randomInterval` |
| `list[].browserStatus` | number | 1 | `1` |
| `list[].labelStatus` | number | 1 | `1` |
| `rerpaCarbonConfig.browserStatus` | number | 1 | `1` |
| `rerpaCarbonConfig.labelStatus` | number | 1 | `1` |

## Retail And Distribution - `/v2/retail`

Retailer settlement, promotion links, withdrawals and invite lists.

Routes: 10 total, 9 probed, 1 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `list[].invitationCode` | string | 1 | `7ykq` |
| `list[].redirectType` | number | 1 | `1` |
| `list[].status` | number | 1 | `1` |
| `reretailSettleConfig.settleType` | number | 1 | `1` |
| `reretailSettleConfig.status` | number | 1 | `1` |
| `reretailSettleConfig.type` | number | 1 | `1` |
| `userInvite.invitationCode` | string | 1 | `7ykq` |

## Session And Authentication - `/v2/sso`

Login, token refresh, profile, binding, password and onboarding steps.

Routes: 26 total, 18 probed, 7 skipped (writes/blocklist), 1 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `data.birthday` | string | 2 | `0001-01-01T00:00:00Z` |
| `data.cancelStatus` | number | 2 | `1` |
| `data.gender` | string | 2 | `2` |
| `data.inviteType` | number | 2 | `0` |
| `data.openType` | number | 1 | `0` |
| `data.source` | string | 2 | `112` |
| `data.userType` | number | 1 | `0` |
| `status` | string | 1 | `error` |

## Notifications And SMS - `/v2/message`

In-app notices and SMS settings.

Routes: 8 total, 8 probed, 0 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `data[].noticeType` | number | 1 | `3`, `1`, `2`, `4` |
| `list[].noticeType` | number | 2 | `3`, `2`, `1`, `4` |
| `list[].groupType` | number | 1 | `1`, `2` |
| `list[].status` | number | 2 | `2`, `1` |
| `data.renewSmsNotifyEnabled` | number | 1 | `1` |
| `list[].reminderStatus` | number | 1 | `0` |
| `list[].type` | number | 1 | `1` |

## Help And Legal Content - `/v2/news`

Help centre, contact/QR settings and the legal agreement pages.

Routes: 5 total, 5 probed, 0 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `list[].flag` | number | 1 | `1`, `0` |
| `data.status` | number | 1 | `2` |
| `list[].status` | number | 2 | `2` |
| `list[].type` | number | 1 | `2` |

## Audit Logs - `/v2/logs`

Authorization log permissions, options and member login logs.

Routes: 2 total, 2 probed, 0 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `list[].opType` | string | 2 | `role_great`, `reseller_assignment`, `order_reset_name`, `account_update_password`, `account_delete_password`, `create_plugin_companies`, `member_edit` |

## Administration - `/v2/admin`

Internal admin surfaces such as third-party proxy pages.

Routes: 2 total, 2 probed, 0 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `list[].proxyType` | string | 1 | `全球动态·静态`, `海外动态、静态` |
| `list[].status` | number | 1 | `2`, `1` |

## Telemetry - `/v2/tg`

Client error reporting and browser IP telemetry.

Routes: 2 total, 2 probed, 0 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

## Yun Services - `/v2/yun`

Yun-hosted share and expiry surfaces.

Routes: 2 total, 2 probed, 0 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `data[].optype` | number | 1 | `1`, `3` |
| `data[].status` | number | 1 | `1` |

## Checks - `/v2/check`

Proxy check helper.

Routes: 1 total, 0 probed, 0 skipped (writes/blocklist), 1 transport errors, 0 not served (HTTP 404).

## Collector - `/v2/collector`

Management-center web telemetry.

Routes: 1 total, 1 probed, 0 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

## Legacy v1 Prefix - `/api/v1`

Historical `/api/v1/*` client calls; the origin answers 405 HTML, not JSON.

Routes: 65 total, 55 probed, 7 skipped (writes/blocklist), 3 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `status` | string | 26 | `error`, `success` |
| `children[].status` | number | 1 | `0` |
| `children[].type` | number | 1 | `0` |
| `data.state` | string | 1 | `6acc56b5f091d` |
| `data[].is_enable` | number | 1 | `1` |
| `data[].status` | number | 2 | `0` |
| `data[].type` | number | 1 | `0` |
| `navigate[].status` | number | 1 | `0` |

## Legacy v2 Prefix - `/api/v2`

Historical `/api/v2/*` client calls; the origin answers 405 HTML, not JSON.

Routes: 15 total, 13 probed, 2 skipped (writes/blocklist), 0 transport errors, 0 not served (HTTP 404).

Notable fields and observed values:

| Field | Types | Routes | Observed values |
| --- | --- | ---: | --- |
| `status` | string | 2 | `error` |

## Cross-Domain Traps

| Trap | Detail |
| --- | --- |
| Two success codes | `/v2/*` mostly uses `code: 200`; `/v2/userapi/*` and the RPA lists use `code: 0`. |
| `auto_renew: 1` | Means auto-renew **off** (`????`) on the VCNP lists - the inverse of the usual flag. |
| `pay_status` vs `order_status` | Different enums with overlapping numbers; always read the paired `*_text`. |
| Singular vs plural keys | `shopids`, `device_ids`, `ids` differ per route; the wrong key often returns an empty result instead of an error. |
| Silent success | Several create routes answer `200` without creating anything. Always re-read after a write. |
| Legacy prefix | `/api/*` returns 405 HTML for POST and a fixed SPA shell for GET. |

See [RESPONSE_SHAPES.md](RESPONSE_SHAPES.md) for the full trap list and [ERRORS.md](ERRORS.md) for the code table.
