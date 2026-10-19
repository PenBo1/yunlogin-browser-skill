# Route Field Inventory (Second Account)

Supplemental, read-only evidence collected by `scripts/dev/probe-route-fields.mjs`. The primary
inventory (`FIELD_INVENTORY.md`) comes from the reference session. This page records what a second,
data-rich account returned, so routes the reference session could not reach still have a documented
response shape. Field values are bounded samples; identifiers, secrets, and free-form strings are not stored.

- Ran at: 2026-10-10T04:08:15.851Z
- Origin: `https://d126447d359e70c0.yunlogin.com`
- Scope: route-sweep rows without reprobedAt
- Routes probed: **117**
- Routes that returned fields: **81**
- Distinct field paths recorded: **2233** (167 carry bounded enum-like values)

## Routes With Fields

| Fields | Code | Method | Route |
| ---: | ---: | --- | --- |
| 146 | 200 | GET | `/v2/cost/costmanagement/getProxyProductV2` |
| 133 | 200 | GET | `/v2/proxy/device/findDeviceLogsList` |
| 127 | 200 | POST | `/v2/newbrowser/cloud-accounts/finger/get` |
| 96 | 200 | POST | `/v2/newbrowser/cloud-accounts/page` |
| 94 | 200 | POST | `/v2/rpa/getRpaPlanManagementList` |
| 91 | 0 | GET | `/v2/rpa/getRpaCarbonConfigList` |
| 86 | 200 | GET | `/v2/cost/costmanagement/getNewbieDevice` |
| 85 | 200 | GET | `/v2/cost/costmanagement/quickRecommend` |
| 79 | 200 | GET | `/v2/cost/costmanagement/getHotProxyProduct` |
| 74 | 200 | GET | `/v2/cost/costmanagement/getProxyProduct` |
| 46 | - | GET | `/v2/plugin/myPlugin` |
| 40 | 200 | GET | `/v2/cost/costmanagement/get_user_set_meal` |
| 40 | 200 | POST | `/v2/team/getMembers` |
| 40 | 200 | POST | `/v2/newbrowser/getsettings` |
| 40 | 200 | POST | `/v2/news/show/help/list` |
| 37 | 200 | POST | `/v2/sso/auth/myUserinfo` |
| 37 | 200 | GET | `/v2/rpa/findRpaCarbonConfig` |
| 34 | 200 | GET | `/v2/proxy/device/findDeviceDynamicProxies` |
| 34 | 200 | GET | `/v2/cost/costmanagement/getRegionSupportV2` |
| 34 | 200 | GET | `/v2/cost/costmanagement/getCityAgent` |
| 33 | 200 | GET | `/v2/proxy/device/getCloudBrowserSupport` |
| 31 | 200 | POST | `/v2/team/member/myInfo` |
| 31 | - | GET | `/v2/plugin/getPluginCategoryGroupCrxList` |
| 31 | 200 | POST | `/v2/newbrowser/getrecycleshoplist` |
| 30 | 200 | GET | `/v2/cost/costmanagement/getorderinfo` |
| 30 | - | GET | `/v2/plugin/getPluginCrxUserList` |
| 30 | 200 | POST | `/v2/team/member/info` |
| 29 | - | GET | `/v2/plugin/getPluginCrxList` |
| 26 | 200 | POST | `/v2/newbrowser/migrate/searchuuid` |
| 25 | 200 | GET | `/v2/plugin/findPluginCompanies` |
| 24 | 200 | POST | `/v2/team/company/user/devices` |
| 22 | 200 | POST | `/v2/logs/auth/options` |
| 21 | 200 | POST | `/v2/team/myCompanies` |
| 21 | 200 | POST | `/v2/team/right/list` |
| 21 | 200 | POST | `/v2/team/auth/myRights` |
| 20 | 200 | GET | `/v2/rpa/getRpaTaskLog` |
| 20 | 200 | POST | `/v2/admin/device/third-proxy/page` |
| 20 | 200 | POST | `/v2/message/message-type/page` |
| 19 | 200 | POST | `/v2/team/right/listTemplate` |
| 18 | 200 | POST | `/v2/team/company/getRoleDepartmentMeal` |
| 17 | 200 | GET | `/v2/team/authentication/check` |
| 17 | 200 | GET | `/v2/team/authentication/get` |
| 17 | 200 | GET | `/v2/team/authentication/companyFourElementsFaceCheck` |
| 17 | 200 | GET | `/v2/sso/getUserPlatforms` |
| 16 | 200 | GET | `/v2/team/plugin/newestPlugins` |
| 16 | 200 | POST | `/v2/team/role-group/page` |
| 14 | - | GET | `/v2/plugin/getPluginCategoryGroupList` |
| 12 | 0 | GET | `/v2/rpa/getRpaShopGroupList` |
| 12 | 200 | POST | `/v2/team/sidebar/get` |
| 11 | 200 | GET | `/v2/rpa/findRpaGroup` |
| 10 | 200 | GET | `/v2/cost/costmanagement/quick` |
| 10 | 200 | GET | `/v2/cost/costmanagement/user_coupons_event_list` |
| 9 | 200 | POST | `/v2/sso/mp/qrCode` |
| 9 | 200 | POST | `/v2/newbrowser/getUserPasswordRecycleList` |
| 8 | - | GET | `/v2/plugin/getPluginHeatSearchesList` |
| 8 | 200 | POST | `/v2/newbrowser/cloud-accounts/num-vis` |
| 8 | 200 | POST | `/v2/message/user-notice/noticeRed` |
| 7 | 200 | POST | `/v2/newbrowser/cloud-accounts/getiduserlist` |
| 7 | 200 | POST | `/v2/newbrowser/cloud-accounts/free/shop/get` |
| 7 | 200 | POST | `/v2/newbrowser/cloud-accounts/client-num/get` |
| 6 | 4011 | POST | `/v2/proxy/device/dynamics/proxy` |
| 6 | 200 | POST | `/v2/proxy/device/findDesignateDevices` |
| 6 | 500 | GET | `/v2/team/authentication/companyFourElementsQRCode` |
| 6 | 200 | GET | `/v2/cost/costmanagement/getRegionSupport` |
| 6 | 200 | GET | `/v2/cost/device/cart_find` |
| 6 | 200 | POST | `/v2/newbrowser/cloud-accounts/popup/get` |
| 6 | 200 | POST | `/v2/newbrowser/cloud-accounts/open/token/get` |
| 6 | 4009 | POST | `/v2/cost/costmanagement/getOrderDetailStatus` |
| 6 | 401 | GET | `/v2/proxy/authority/get` |
| 5 | 200 | POST | `/v2/newbrowser/cloud-accounts/getshopfromproxy` |
| 5 | - | GET | `/v2/retail/getRetailWithdrawLogList` |
| 5 | - | GET | `/v2/retail/frozenList` |
| 5 | 200 | POST | `/v2/newbrowser/getpackageinfo` |
| 5 | 200 | POST | `/v2/newbrowser/account-users/get` |
| 5 | - | GET | `/v2/plugin/group/gitPluginGroupList` |
| 5 | 7 | GET | `/v2/plugin/group/accountGroupList` |
| 4 | 403 | POST | `/v2/newbrowser/getfingerprinturiua` |
| 4 | 500 | GET | `/v2/news/settings/info` |
| 4 | 500 | POST | `/v2/admin/device/third-proxy/get` |
| 3 | 500 | POST | `/v2/team/select/company` |
| 2 | - | POST | `/v2/check/checkproxy` |

## Field Paths By Route

### `POST /v2/admin/device/third-proxy/get`

Business code `500`, HTTP `200`, 4 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |

### `POST /v2/admin/device/third-proxy/page`

Business code `200`, HTTP `200`, 20 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].proxyName` | string |  |
| `$.data.list[].proxyType` | string |  |
| `$.data.list[].tags` | string |  |
| `$.data.list[].img` | string |  |
| `$.data.list[].link` | string |  |
| `$.data.list[].desc` | string |  |
| `$.data.list[].status` | number | 2, 1 |
| `$.data.list[].createdAt` | string |  |
| `$.data.list[].updatedAt` | string |  |
| `$.data.total` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.currentPage` | number |  |

### `POST /v2/check/checkproxy`

Business code `-`, HTTP `200`, 2 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.proxyaddr` | null |  |

### `GET /v2/cost/costmanagement/get_user_set_meal`

Business code `200`, HTTP `200`, 40 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.created_at` | string |  |
| `$.data.updated_at` | string |  |
| `$.data.original_discount` | number |  |
| `$.data.package_source` | number | 1 |
| `$.data.gift_environment_number` | number |  |
| `$.data.gift_member_number` | number |  |
| `$.data.gift_end_time` | string |  |
| `$.data.start_time` | string |  |
| `$.data.end_time` | string |  |
| `$.data.free_status` | number | 0 |
| `$.data.environment_number` | number |  |
| `$.data.member_number` | number |  |
| `$.data.effective_day` | number |  |
| `$.data.auto_renew` | number |  |
| `$.data.final_amount` | number |  |
| `$.data.residue_amount` | number |  |
| `$.data.payable_amount` | number |  |
| `$.data.actual_amount` | number |  |
| `$.data.company_id` | string |  |
| `$.data.user_id` | string |  |
| `$.data.user_packages_id` | number |  |
| `$.data.day` | number |  |
| `$.data.restrict` | boolean |  |
| `$.data.expired` | boolean |  |
| `$.data.has_package` | boolean |  |
| `$.data.select_day` | number |  |
| `$.data.normal_environment_number` | number |  |
| `$.data.normal_member_number` | number |  |
| `$.data.purchased_environment_number` | number |  |
| `$.data.purchased_member_number` | number |  |
| `$.data.free_environment_number` | number |  |
| `$.data.free_member_number` | number |  |
| `$.data.total_environment_number` | number |  |
| `$.data.total_member_number` | number |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/getCityAgent`

Business code `200`, HTTP `200`, 34 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].id` | number |  |
| `$.data[].parentCode` | string |  |
| `$.data[].code` | string |  |
| `$.data[].name` | string |  |
| `$.data[].count` | number |  |
| `$.data[].flag` | number | 0 |
| `$.data[].sort` | number |  |
| `$.data[].children` | array |  |
| `$.data[].children[]` | object |  |
| `$.data[].children[].id` | number |  |
| `$.data[].children[].parentCode` | string |  |
| `$.data[].children[].code` | string |  |
| `$.data[].children[].name` | string |  |
| `$.data[].children[].count` | number |  |
| `$.data[].children[].flag` | number | 0 |
| `$.data[].children[].sort` | number |  |
| `$.data[].children[].children` | array |  |
| `$.data[].children[].children[]` | object |  |
| `$.data[].children[].children[].id` | number |  |
| `$.data[].children[].children[].parentCode` | string |  |
| `$.data[].children[].children[].code` | string |  |
| `$.data[].children[].children[].name` | string |  |
| `$.data[].children[].children[].count` | number |  |
| `$.data[].children[].children[].flag` | number | 0 |
| `$.data[].children[].children[].sort` | number |  |
| `$.data[].children[].children[].children` | array |  |
| `$.data[].children[].children[].children[]` | object |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/getHotProxyProduct`

Business code `200`, HTTP `200`, 79 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].country_code` | string |  |
| `$.data[].country` | string |  |
| `$.data[].sales_count` | number |  |
| `$.data[].cities` | array |  |
| `$.data[].cities[]` | object |  |
| `$.data[].cities[].city_code` | string |  |
| `$.data[].cities[].city` | string |  |
| `$.data[].cities[].sales_count` | number |  |
| `$.data[].cities[].hot` | boolean |  |
| `$.data[].cities[].products` | array |  |
| `$.data[].cities[].products[]` | object |  |
| `$.data[].cities[].products[].new_cloud_instances` | object |  |
| `$.data[].cities[].products[].new_cloud_instances.is_close` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.created_at` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.updated_at` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.ext_num` | null |  |
| `$.data[].cities[].products[].new_cloud_instances.package_type` | string | price |
| `$.data[].cities[].products[].new_cloud_instances.region_id` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.country` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.city` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.cpu` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.memory` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.instance_id` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.bundle_id` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.display_area` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.display_region` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.ext_rul` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.vtype` | string | ipideash, ipv, mb, crown, ipideash2, tianyi |
| `$.data[].cities[].products[].new_cloud_instances.price_json` | null, object |  |
| `$.data[].cities[].products[].new_cloud_instances.packages` | object |  |
| `$.data[].cities[].products[].new_cloud_instances.dynamic_packages` | null |  |
| `$.data[].cities[].products[].new_cloud_instances.line_price` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.selling_price` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.origin_price` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.floor_price` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.proxy_type` | number | 2 |
| `$.data[].cities[].products[].new_cloud_instances.sell_pool` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.is_new` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.is_recommend` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.is_display` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.is_hot` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.is_discount` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.remaining` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.ip_type` | number | 1 |
| `$.data[].cities[].products[].new_cloud_instances.isp_type` | number | 0, 2, 1 |
| `$.data[].cities[].products[].new_cloud_instances.net_type` | number | 0, 1, 2 |
| `$.data[].cities[].products[].new_cloud_instances.band_width` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.asn_type` | number | 0 |
| `$.data[].cities[].products[].new_cloud_instances.band_width_type` | number | 0, 2, 1 |
| `$.data[].cities[].products[].new_cloud_instances.cidr_status` | number | 1, -1 |
| `$.data[].cities[].products[].new_cloud_instances.max_band_width` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.unit` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.duration` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.band_width_cost` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.band_width_price` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.id` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.area_code` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.country_code` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.city_code` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.detail` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.parent_no` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.name` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.sell_unit` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.assign_ip` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.discount` | number |  |
| `$.data[].cities[].products[].new_cloud_instances.recommend_platform` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.un_recommend_platform` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.third_recommend_platform` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.third_un_recommend_platform` | string |  |
| `$.data[].cities[].products[].new_cloud_instances.remark` | string |  |
| `$.data[].cities[].products[].new_cloud_instances_cidr_blocks` | array |  |
| `$.data[].cities[].products[].new_cloud_instances_cidr_blocks[]` | object |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/getNewbieDevice`

Business code `200`, HTTP `200`, 86 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].new_cloud_instances` | object |  |
| `$.data[].new_cloud_instances.is_close` | number |  |
| `$.data[].new_cloud_instances.created_at` | string |  |
| `$.data[].new_cloud_instances.updated_at` | string |  |
| `$.data[].new_cloud_instances.ext_num` | null |  |
| `$.data[].new_cloud_instances.package_type` | string | price |
| `$.data[].new_cloud_instances.region_id` | string |  |
| `$.data[].new_cloud_instances.country` | string |  |
| `$.data[].new_cloud_instances.city` | string |  |
| `$.data[].new_cloud_instances.cpu` | string |  |
| `$.data[].new_cloud_instances.memory` | string |  |
| `$.data[].new_cloud_instances.instance_id` | string |  |
| `$.data[].new_cloud_instances.bundle_id` | string |  |
| `$.data[].new_cloud_instances.display_area` | string |  |
| `$.data[].new_cloud_instances.display_region` | string |  |
| `$.data[].new_cloud_instances.ext_rul` | string |  |
| `$.data[].new_cloud_instances.vtype` | string | ipideash2 |
| `$.data[].new_cloud_instances.price_json` | null, object |  |
| `$.data[].new_cloud_instances.packages` | object |  |
| `$.data[].new_cloud_instances.packages.day` | null |  |
| `$.data[].new_cloud_instances.packages.price` | array |  |
| `$.data[].new_cloud_instances.packages.price[]` | object |  |
| `$.data[].new_cloud_instances.packages.price[].month` | number |  |
| `$.data[].new_cloud_instances.packages.price[].discount` | number |  |
| `$.data[].new_cloud_instances.dynamic_packages` | null |  |
| `$.data[].new_cloud_instances.line_price` | number |  |
| `$.data[].new_cloud_instances.selling_price` | number |  |
| `$.data[].new_cloud_instances.origin_price` | number |  |
| `$.data[].new_cloud_instances.floor_price` | number |  |
| `$.data[].new_cloud_instances.proxy_type` | number | 2 |
| `$.data[].new_cloud_instances.sell_pool` | number |  |
| `$.data[].new_cloud_instances.is_new` | number |  |
| `$.data[].new_cloud_instances.is_recommend` | number |  |
| `$.data[].new_cloud_instances.is_display` | number |  |
| `$.data[].new_cloud_instances.is_hot` | number |  |
| `$.data[].new_cloud_instances.is_discount` | number |  |
| `$.data[].new_cloud_instances.remaining` | number |  |
| `$.data[].new_cloud_instances.ip_type` | number | 1 |
| `$.data[].new_cloud_instances.isp_type` | number | 0 |
| `$.data[].new_cloud_instances.net_type` | number | 0 |
| `$.data[].new_cloud_instances.band_width` | number |  |
| `$.data[].new_cloud_instances.asn_type` | number | 0 |
| `$.data[].new_cloud_instances.band_width_type` | number | 0 |
| `$.data[].new_cloud_instances.cidr_status` | number | 1 |
| `$.data[].new_cloud_instances.max_band_width` | number |  |
| `$.data[].new_cloud_instances.unit` | number |  |
| `$.data[].new_cloud_instances.duration` | number |  |
| `$.data[].new_cloud_instances.band_width_cost` | number |  |
| `$.data[].new_cloud_instances.band_width_price` | number |  |
| `$.data[].new_cloud_instances.id` | number |  |
| `$.data[].new_cloud_instances.area_code` | string |  |
| `$.data[].new_cloud_instances.country_code` | string |  |
| `$.data[].new_cloud_instances.city_code` | string |  |
| `$.data[].new_cloud_instances.detail` | string |  |
| `$.data[].new_cloud_instances.parent_no` | string |  |
| `$.data[].new_cloud_instances.name` | string |  |
| `$.data[].new_cloud_instances.sell_unit` | number |  |
| `$.data[].new_cloud_instances.assign_ip` | number |  |
| `$.data[].new_cloud_instances.discount` | number |  |
| `$.data[].new_cloud_instances.recommend_platform` | string |  |
| `$.data[].new_cloud_instances.un_recommend_platform` | string |  |
| `$.data[].new_cloud_instances.third_recommend_platform` | string |  |
| `$.data[].new_cloud_instances.third_un_recommend_platform` | string |  |
| `$.data[].new_cloud_instances.remark` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks` | array |  |
| `$.data[].new_cloud_instances_cidr_blocks[]` | object |  |
| `$.data[].new_cloud_instances_cidr_blocks[].instance_id` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks[].count` | number |  |
| `$.data[].new_cloud_instances_cidr_blocks[].cidr` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks[].asn` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks[].isp` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks[].ID` | number |  |
| `$.data[].new_cloud_instances_cidr_blocks[].recommend_platform` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks[].un_recommend_platform` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks[].third_recommend_platform` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks[].third_un_recommend_platform` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks[].remark` | string |  |
| `$.data[].new_cloud_instances.price_json.flow` | null |  |
| `$.data[].new_cloud_instances.price_json.multiple` | null |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `POST /v2/cost/costmanagement/getOrderDetailStatus`

Business code `4009`, HTTP `200`, 6 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/getorderinfo`

Business code `200`, HTTP `200`, 30 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.order_status` | object |  |
| `$.data.order_status.0` | string |  |
| `$.data.order_status.2` | string |  |
| `$.data.order_status.3` | string |  |
| `$.data.order_status.4` | string |  |
| `$.data.order_status.5` | string |  |
| `$.data.order_status.6` | string |  |
| `$.data.order_status.7` | string |  |
| `$.data.order_status.8` | string |  |
| `$.data.order_status.-1` | string |  |
| `$.data.order_type` | object |  |
| `$.data.order_type.0` | string |  |
| `$.data.order_type.1` | string |  |
| `$.data.order_type.2` | string |  |
| `$.data.order_type.3` | string |  |
| `$.data.order_type.4` | string |  |
| `$.data.order_type.5` | string |  |
| `$.data.order_type.6` | string |  |
| `$.data.order_type.7` | string |  |
| `$.data.order_type.8` | string |  |
| `$.data.pay_type` | object |  |
| `$.data.pay_type.1` | string |  |
| `$.data.pay_type.2` | string |  |
| `$.data.pay_type.3` | string |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/getProxyProduct`

Business code `200`, HTTP `200`, 74 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].new_cloud_instances` | object |  |
| `$.data[].new_cloud_instances.is_close` | number |  |
| `$.data[].new_cloud_instances.created_at` | string |  |
| `$.data[].new_cloud_instances.updated_at` | string |  |
| `$.data[].new_cloud_instances.ext_num` | null |  |
| `$.data[].new_cloud_instances.package_type` | string | price |
| `$.data[].new_cloud_instances.region_id` | string |  |
| `$.data[].new_cloud_instances.country` | string |  |
| `$.data[].new_cloud_instances.city` | string |  |
| `$.data[].new_cloud_instances.cpu` | string |  |
| `$.data[].new_cloud_instances.memory` | string |  |
| `$.data[].new_cloud_instances.instance_id` | string |  |
| `$.data[].new_cloud_instances.bundle_id` | string |  |
| `$.data[].new_cloud_instances.display_area` | string |  |
| `$.data[].new_cloud_instances.display_region` | string |  |
| `$.data[].new_cloud_instances.ext_rul` | string |  |
| `$.data[].new_cloud_instances.vtype` | string | ak, awslight, ypk, ali, huawei, tx, cmc |
| `$.data[].new_cloud_instances.price_json` | null, object |  |
| `$.data[].new_cloud_instances.packages` | object |  |
| `$.data[].new_cloud_instances.packages.day` | null |  |
| `$.data[].new_cloud_instances.packages.price` | array |  |
| `$.data[].new_cloud_instances.packages.price[]` | object |  |
| `$.data[].new_cloud_instances.packages.price[].month` | number |  |
| `$.data[].new_cloud_instances.packages.price[].discount` | number |  |
| `$.data[].new_cloud_instances.dynamic_packages` | null |  |
| `$.data[].new_cloud_instances.line_price` | number |  |
| `$.data[].new_cloud_instances.selling_price` | number |  |
| `$.data[].new_cloud_instances.origin_price` | number |  |
| `$.data[].new_cloud_instances.floor_price` | number |  |
| `$.data[].new_cloud_instances.proxy_type` | number | 1 |
| `$.data[].new_cloud_instances.sell_pool` | number |  |
| `$.data[].new_cloud_instances.is_new` | number |  |
| `$.data[].new_cloud_instances.is_recommend` | number |  |
| `$.data[].new_cloud_instances.is_display` | number |  |
| `$.data[].new_cloud_instances.is_hot` | number |  |
| `$.data[].new_cloud_instances.is_discount` | number |  |
| `$.data[].new_cloud_instances.remaining` | number |  |
| `$.data[].new_cloud_instances.ip_type` | number | 1 |
| `$.data[].new_cloud_instances.isp_type` | number | 2, 0 |
| `$.data[].new_cloud_instances.net_type` | number | 1, 0 |
| `$.data[].new_cloud_instances.band_width` | number |  |
| `$.data[].new_cloud_instances.asn_type` | number | 0 |
| `$.data[].new_cloud_instances.band_width_type` | number | 1, 3, 0 |
| `$.data[].new_cloud_instances.cidr_status` | number | -1 |
| `$.data[].new_cloud_instances.max_band_width` | number |  |
| `$.data[].new_cloud_instances.unit` | number |  |
| `$.data[].new_cloud_instances.duration` | number |  |
| `$.data[].new_cloud_instances.band_width_cost` | number |  |
| `$.data[].new_cloud_instances.band_width_price` | number |  |
| `$.data[].new_cloud_instances.id` | number |  |
| `$.data[].new_cloud_instances.area_code` | string |  |
| `$.data[].new_cloud_instances.country_code` | string |  |
| `$.data[].new_cloud_instances.city_code` | string |  |
| `$.data[].new_cloud_instances.detail` | string |  |
| `$.data[].new_cloud_instances.parent_no` | string |  |
| `$.data[].new_cloud_instances.name` | string |  |
| `$.data[].new_cloud_instances.sell_unit` | number |  |
| `$.data[].new_cloud_instances.assign_ip` | number |  |
| `$.data[].new_cloud_instances.discount` | number |  |
| `$.data[].new_cloud_instances.recommend_platform` | string |  |
| `$.data[].new_cloud_instances.un_recommend_platform` | string |  |
| `$.data[].new_cloud_instances.third_recommend_platform` | string |  |
| `$.data[].new_cloud_instances.third_un_recommend_platform` | string |  |
| `$.data[].new_cloud_instances.remark` | string |  |
| `$.data[].new_cloud_instances_cidr_blocks` | array |  |
| `$.data[].new_cloud_instances.price_json.flow` | null |  |
| `$.data[].new_cloud_instances.price_json.multiple` | null |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/getProxyProductV2`

Business code `200`, HTTP `200`, 146 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.group_list` | array |  |
| `$.data.group_list[]` | object |  |
| `$.data.group_list[].is_close` | number |  |
| `$.data.group_list[].created_at` | string |  |
| `$.data.group_list[].updated_at` | string |  |
| `$.data.group_list[].ext_num` | null |  |
| `$.data.group_list[].package_type` | string | price |
| `$.data.group_list[].region_id` | string |  |
| `$.data.group_list[].country` | string |  |
| `$.data.group_list[].city` | string |  |
| `$.data.group_list[].cpu` | string |  |
| `$.data.group_list[].memory` | string |  |
| `$.data.group_list[].instance_id` | string |  |
| `$.data.group_list[].bundle_id` | string |  |
| `$.data.group_list[].display_area` | string |  |
| `$.data.group_list[].display_region` | string |  |
| `$.data.group_list[].ext_rul` | string |  |
| `$.data.group_list[].vtype` | string | mb, crown, ipv, ipideash2 |
| `$.data.group_list[].price_json` | null, object |  |
| `$.data.group_list[].price_json.flow` | null |  |
| `$.data.group_list[].price_json.multiple` | null |  |
| `$.data.group_list[].packages` | object |  |
| `$.data.group_list[].packages.day` | null |  |
| `$.data.group_list[].packages.price` | array |  |
| `$.data.group_list[].packages.price[]` | object |  |
| `$.data.group_list[].packages.price[].month` | number |  |
| `$.data.group_list[].packages.price[].discount` | number |  |
| `$.data.group_list[].dynamic_packages` | null |  |
| `$.data.group_list[].line_price` | number |  |
| `$.data.group_list[].selling_price` | number |  |
| `$.data.group_list[].origin_price` | number |  |
| `$.data.group_list[].floor_price` | number |  |
| `$.data.group_list[].proxy_type` | number | 2 |
| `$.data.group_list[].sell_pool` | number |  |
| `$.data.group_list[].is_new` | number |  |
| `$.data.group_list[].is_recommend` | number |  |
| `$.data.group_list[].is_display` | number |  |
| `$.data.group_list[].is_hot` | number |  |
| `$.data.group_list[].is_discount` | number |  |
| `$.data.group_list[].remaining` | number |  |
| `$.data.group_list[].ip_type` | number | 1 |
| `$.data.group_list[].isp_type` | number | 2, 1, 0 |
| `$.data.group_list[].net_type` | number | 1, 0 |
| `$.data.group_list[].band_width` | number |  |
| `$.data.group_list[].asn_type` | number | 0 |
| `$.data.group_list[].band_width_type` | number | 1, 0 |
| `$.data.group_list[].cidr_status` | number | 1 |
| `$.data.group_list[].max_band_width` | number |  |
| `$.data.group_list[].unit` | number |  |
| `$.data.group_list[].duration` | number |  |
| `$.data.group_list[].band_width_cost` | number |  |
| `$.data.group_list[].band_width_price` | number |  |
| `$.data.group_list[].id` | number |  |
| `$.data.group_list[].area_code` | string |  |
| `$.data.group_list[].country_code` | string |  |
| `$.data.group_list[].city_code` | string |  |
| `$.data.group_list[].detail` | string |  |
| `$.data.group_list[].parent_no` | string |  |
| `$.data.group_list[].name` | string |  |
| `$.data.group_list[].sell_unit` | number |  |
| `$.data.group_list[].assign_ip` | number |  |
| `$.data.group_list[].discount` | number |  |
| `$.data.group_list[].recommend_platform` | string |  |
| `$.data.group_list[].un_recommend_platform` | string |  |
| `$.data.group_list[].third_recommend_platform` | string |  |
| `$.data.group_list[].third_un_recommend_platform` | string |  |
| `$.data.group_list[].remark` | string |  |
| `$.data.group_list[].group_no` | string |  |
| `$.data.group_list[].group_name` | string |  |
| `$.data.group_list[].group_price` | number |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].is_close` | number |  |
| `$.data.list[].created_at` | string |  |
| `$.data.list[].updated_at` | string |  |
| `$.data.list[].ext_num` | null |  |
| `$.data.list[].package_type` | string | price |
| `$.data.list[].region_id` | string |  |
| `$.data.list[].country` | string |  |
| `$.data.list[].city` | string |  |
| `$.data.list[].cpu` | string |  |
| `$.data.list[].memory` | string |  |
| `$.data.list[].instance_id` | string |  |
| `$.data.list[].bundle_id` | string |  |
| `$.data.list[].display_area` | string |  |
| `$.data.list[].display_region` | string |  |
| `$.data.list[].ext_rul` | string |  |
| `$.data.list[].vtype` | string | ypk, tx, cmc, ali, huawei, ak, awslight |
| `$.data.list[].price_json` | null, object |  |
| `$.data.list[].packages` | object |  |
| `$.data.list[].packages.day` | null |  |
| `$.data.list[].packages.price` | array |  |
| `$.data.list[].packages.price[]` | object |  |
| `$.data.list[].packages.price[].month` | number |  |
| `$.data.list[].packages.price[].discount` | number |  |
| `$.data.list[].dynamic_packages` | null |  |
| `$.data.list[].line_price` | number |  |
| `$.data.list[].selling_price` | number |  |
| `$.data.list[].origin_price` | number |  |
| `$.data.list[].floor_price` | number |  |
| `$.data.list[].proxy_type` | number | 1 |
| `$.data.list[].sell_pool` | number |  |
| `$.data.list[].is_new` | number |  |
| `$.data.list[].is_recommend` | number |  |
| `$.data.list[].is_display` | number |  |
| `$.data.list[].is_hot` | number |  |
| `$.data.list[].is_discount` | number |  |
| `$.data.list[].remaining` | number |  |
| `$.data.list[].ip_type` | number | 1 |
| `$.data.list[].isp_type` | number | 0, 2 |
| `$.data.list[].net_type` | number | 0, 1 |
| `$.data.list[].band_width` | number |  |
| `$.data.list[].asn_type` | number | 0 |
| `$.data.list[].band_width_type` | number | 3, 0, 1 |
| `$.data.list[].cidr_status` | number | -1 |
| `$.data.list[].max_band_width` | number |  |
| `$.data.list[].unit` | number |  |
| `$.data.list[].duration` | number |  |
| `$.data.list[].band_width_cost` | number |  |
| `$.data.list[].band_width_price` | number |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].area_code` | string |  |
| `$.data.list[].country_code` | string |  |
| `$.data.list[].city_code` | string |  |
| `$.data.list[].detail` | string |  |
| `$.data.list[].parent_no` | string |  |
| `$.data.list[].name` | string |  |
| `$.data.list[].sell_unit` | number |  |
| `$.data.list[].assign_ip` | number |  |
| `$.data.list[].discount` | number |  |
| `$.data.list[].recommend_platform` | string |  |
| `$.data.list[].un_recommend_platform` | string |  |
| `$.data.list[].third_recommend_platform` | string |  |
| `$.data.list[].third_un_recommend_platform` | string |  |
| `$.data.list[].remark` | string |  |
| `$.data.list[].group_no` | string |  |
| `$.data.list[].group_name` | string |  |
| `$.data.list[].group_price` | number |  |
| `$.data.list[].price_json.flow` | null |  |
| `$.data.list[].price_json.multiple` | null |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/getRegionSupport`

Business code `200`, HTTP `200`, 6 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | null |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/getRegionSupportV2`

Business code `200`, HTTP `200`, 34 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].id` | number |  |
| `$.data[].parentCode` | string |  |
| `$.data[].code` | string |  |
| `$.data[].name` | string |  |
| `$.data[].count` | number |  |
| `$.data[].flag` | number | 9, 0 |
| `$.data[].sort` | number |  |
| `$.data[].children` | array |  |
| `$.data[].children[]` | object |  |
| `$.data[].children[].id` | number |  |
| `$.data[].children[].parentCode` | string |  |
| `$.data[].children[].code` | string |  |
| `$.data[].children[].name` | string |  |
| `$.data[].children[].count` | number |  |
| `$.data[].children[].flag` | number | 2, 9, 0, 3, 1 |
| `$.data[].children[].sort` | number |  |
| `$.data[].children[].children` | array |  |
| `$.data[].children[].children[]` | object |  |
| `$.data[].children[].children[].id` | number |  |
| `$.data[].children[].children[].parentCode` | string |  |
| `$.data[].children[].children[].code` | string |  |
| `$.data[].children[].children[].name` | string |  |
| `$.data[].children[].children[].count` | number |  |
| `$.data[].children[].children[].flag` | number | 3, 0, 2, 9, 1 |
| `$.data[].children[].children[].sort` | number |  |
| `$.data[].children[].children[].children` | array |  |
| `$.data[].children[].children[].children[]` | object |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/quick`

Business code `200`, HTTP `200`, 10 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.data` | array |  |
| `$.data.total` | number |  |
| `$.data.current_page` | number |  |
| `$.data.per_page` | number |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/quickRecommend`

Business code `200`, HTTP `200`, 85 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].instance_id` | string |  |
| `$.data[].count` | number |  |
| `$.data[].cidr` | string |  |
| `$.data[].asn` | string |  |
| `$.data[].isp` | string |  |
| `$.data[].ID` | number |  |
| `$.data[].buyStatus` | boolean | true |
| `$.data[].cloud_instances` | object |  |
| `$.data[].cloud_instances.is_close` | number |  |
| `$.data[].cloud_instances.created_at` | string |  |
| `$.data[].cloud_instances.updated_at` | string |  |
| `$.data[].cloud_instances.ext_num` | null |  |
| `$.data[].cloud_instances.package_type` | string | price |
| `$.data[].cloud_instances.region_id` | string |  |
| `$.data[].cloud_instances.country` | string |  |
| `$.data[].cloud_instances.city` | string |  |
| `$.data[].cloud_instances.cpu` | string |  |
| `$.data[].cloud_instances.memory` | string |  |
| `$.data[].cloud_instances.instance_id` | string |  |
| `$.data[].cloud_instances.bundle_id` | string |  |
| `$.data[].cloud_instances.display_area` | string |  |
| `$.data[].cloud_instances.display_region` | string |  |
| `$.data[].cloud_instances.ext_rul` | string |  |
| `$.data[].cloud_instances.vtype` | string | ipideash, ipideash2, mb, ipv |
| `$.data[].cloud_instances.price_json` | null, object |  |
| `$.data[].cloud_instances.packages` | object |  |
| `$.data[].cloud_instances.packages.day` | null |  |
| `$.data[].cloud_instances.packages.price` | array |  |
| `$.data[].cloud_instances.packages.price[]` | object |  |
| `$.data[].cloud_instances.packages.price[].month` | number |  |
| `$.data[].cloud_instances.packages.price[].discount` | number |  |
| `$.data[].cloud_instances.dynamic_packages` | null |  |
| `$.data[].cloud_instances.line_price` | number |  |
| `$.data[].cloud_instances.selling_price` | number |  |
| `$.data[].cloud_instances.origin_price` | number |  |
| `$.data[].cloud_instances.floor_price` | number |  |
| `$.data[].cloud_instances.proxy_type` | number | 2 |
| `$.data[].cloud_instances.sell_pool` | number |  |
| `$.data[].cloud_instances.is_new` | number |  |
| `$.data[].cloud_instances.is_recommend` | number |  |
| `$.data[].cloud_instances.is_display` | number |  |
| `$.data[].cloud_instances.is_hot` | number |  |
| `$.data[].cloud_instances.is_discount` | number |  |
| `$.data[].cloud_instances.remaining` | number |  |
| `$.data[].cloud_instances.ip_type` | number | 1 |
| `$.data[].cloud_instances.isp_type` | number | 0, 2 |
| `$.data[].cloud_instances.net_type` | number | 0, 1, 2 |
| `$.data[].cloud_instances.band_width` | number |  |
| `$.data[].cloud_instances.asn_type` | number | 0 |
| `$.data[].cloud_instances.band_width_type` | number | 0, 1 |
| `$.data[].cloud_instances.cidr_status` | number | 1 |
| `$.data[].cloud_instances.max_band_width` | number |  |
| `$.data[].cloud_instances.unit` | number |  |
| `$.data[].cloud_instances.duration` | number |  |
| `$.data[].cloud_instances.band_width_cost` | number |  |
| `$.data[].cloud_instances.band_width_price` | number |  |
| `$.data[].cloud_instances.id` | number |  |
| `$.data[].cloud_instances.area_code` | string |  |
| `$.data[].cloud_instances.country_code` | string |  |
| `$.data[].cloud_instances.city_code` | string |  |
| `$.data[].cloud_instances.detail` | string |  |
| `$.data[].cloud_instances.parent_no` | string |  |
| `$.data[].cloud_instances.name` | string |  |
| `$.data[].cloud_instances.sell_unit` | number |  |
| `$.data[].cloud_instances.assign_ip` | number |  |
| `$.data[].cloud_instances.discount` | number |  |
| `$.data[].cloud_instances.recommend_platform` | string |  |
| `$.data[].cloud_instances.un_recommend_platform` | string |  |
| `$.data[].cloud_instances.third_recommend_platform` | string |  |
| `$.data[].cloud_instances.third_un_recommend_platform` | string |  |
| `$.data[].cloud_instances.remark` | string |  |
| `$.data[].recommend_platform` | string |  |
| `$.data[].un_recommend_platform` | string |  |
| `$.data[].third_recommend_platform` | string |  |
| `$.data[].third_un_recommend_platform` | string |  |
| `$.data[].remark` | string |  |
| `$.data[].cloud_instances.price_json.flow` | null |  |
| `$.data[].cloud_instances.price_json.multiple` | null |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/costmanagement/user_coupons_event_list`

Business code `200`, HTTP `200`, 10 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.data` | array |  |
| `$.data.total` | number |  |
| `$.data.current_page` | number |  |
| `$.data.per_page` | number |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/cost/device/cart_find`

Business code `200`, HTTP `200`, 6 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | array |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `POST /v2/logs/auth/options`

Business code `200`, HTTP `200`, 22 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.count` | number |  |
| `$.data.pageIndex` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].userId` | string |  |
| `$.data.list[].username` | string |  |
| `$.data.list[].Name` | string |  |
| `$.data.list[].companyId` | string |  |
| `$.data.list[].opType` | string | reseller_assignment, edit_reseller, account_close |
| `$.data.list[].deptId` | string |  |
| `$.data.list[].departmentName` | string |  |
| `$.data.list[].content` | string |  |
| `$.data.list[].detail` | string |  |
| `$.data.list[].dataId` | string |  |
| `$.data.list[].createdAt` | string |  |

### `POST /v2/message/message-type/page`

Business code `200`, HTTP `200`, 20 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].title` | string |  |
| `$.data.list[].tinyTitle` | string |  |
| `$.data.list[].noticeExec` | string |  |
| `$.data.list[].status` | number | 1 |
| `$.data.list[].noticeType` | number | 3, 1, 2, 4 |
| `$.data.list[].groupType` | number | 1, 2 |
| `$.data.list[].sort` | number |  |
| `$.data.list[].createdAt` | string |  |
| `$.data.list[].updatedAt` | string |  |
| `$.data.total` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.currentPage` | number |  |

### `POST /v2/message/user-notice/noticeRed`

Business code `200`, HTTP `200`, 8 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].noticeType` | number | 4, 3, 1, 2 |
| `$.data[].red` | boolean |  |

### `POST /v2/newbrowser/account-users/get`

Business code `200`, HTTP `200`, 5 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | array |  |

### `POST /v2/newbrowser/cloud-accounts/client-num/get`

Business code `200`, HTTP `200`, 7 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.clientNum` | number |  |
| `$.data.keepalive` | number |  |

### `POST /v2/newbrowser/cloud-accounts/finger/get`

Business code `200`, HTTP `200`, 127 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.browseinfo` | object |  |
| `$.browseinfo.name` | string |  |
| `$.browseinfo.notes` | string |  |
| `$.browseinfo.labelid` | null |  |
| `$.browseinfo.user_password_ids` | null |  |
| `$.browseinfo.is_star_tag` | number |  |
| `$.browseinfo.top_order` | number |  |
| `$.browseinfo.kernelId` | number |  |
| `$.browseinfo.categoryid` | string |  |
| `$.browseinfo.shopid` | string |  |
| `$.browseinfo.proxy` | object |  |
| `$.browseinfo.proxy.name` | string |  |
| `$.browseinfo.proxy.inlie` | string |  |
| `$.browseinfo.proxy.uuid` | string |  |
| `$.browseinfo.proxy.type` | string |  |
| `$.browseinfo.proxy.product` | number |  |
| `$.browseinfo.proxy.PublicIP` | string |  |
| `$.browseinfo.proxy.ipChannel` | string |  |
| `$.browseinfo.proxy.deviceType` | string |  |
| `$.browseinfo.proxy.randEnv` | boolean |  |
| `$.browseinfo.proxy.proxyaddrArr` | null |  |
| `$.browseinfo.proxy.region` | string |  |
| `$.browseinfo.proxy.dns` | object |  |
| `$.browseinfo.proxy.dns.mode` | boolean | false |
| `$.browseinfo.proxy.dns.inside` | boolean |  |
| `$.browseinfo.proxy.socks5` | object |  |
| `$.browseinfo.proxy.socks5.Addr` | string |  |
| `$.browseinfo.proxy.socks5.User` | string |  |
| `$.browseinfo.proxy.socks5.Passwd` | string |  |
| `$.browseinfo.proxy.http` | object |  |
| `$.browseinfo.proxy.http.Addr` | string |  |
| `$.browseinfo.proxy.http.User` | string |  |
| `$.browseinfo.proxy.http.Passwd` | string |  |
| `$.browseinfo.proxy.https` | object |  |
| `$.browseinfo.proxy.https.Addr` | string |  |
| `$.browseinfo.proxy.https.User` | string |  |
| `$.browseinfo.proxy.https.Passwd` | string |  |
| `$.browseinfo.proxy.ssh` | object |  |
| `$.browseinfo.proxy.ssh.Addr` | string |  |
| `$.browseinfo.proxy.ssh.User` | string |  |
| `$.browseinfo.proxy.ssh.Passwd` | string |  |
| `$.browseinfo.proxy.v2Ray` | object |  |
| `$.browseinfo.proxy.v2Ray.addr` | string |  |
| `$.browseinfo.proxy.v2Ray.uuid` | string |  |
| `$.browseinfo.proxy.zhima` | object |  |
| `$.browseinfo.proxy.zhima.Url` | string |  |
| `$.browseinfo.proxy.zhima.Interval` | number |  |
| `$.browseinfo.proxy.dynamic` | object |  |
| `$.browseinfo.proxy.dynamic.Url` | string |  |
| `$.browseinfo.proxy.dynamic.Interval` | number |  |
| `$.browseinfo.proxy.dynamic.Type` | string |  |
| `$.browseinfo.number` | number |  |
| `$.browseinfo.userPasswordPlatforms` | null |  |
| `$.browseinfo.accounts` | object |  |
| `$.browseinfo.accounts.cookie` | string |  |
| `$.browseinfo.accounts.url` | null |  |
| `$.browseinfo.accounts.name` | string |  |
| `$.browseinfo.accounts.user` | string |  |
| `$.browseinfo.accounts.passwd` | string |  |
| `$.browseinfo.accounts.loginurl` | string |  |
| `$.browseinfo.accounts.platformicon` | string |  |
| `$.browseinfo.accounts.lock` | number |  |
| `$.browseinfo.accounts.tfa` | string |  |
| `$.defaultfingerprint` | object |  |
| `$.defaultfingerprint.kernel` | string |  |
| `$.defaultfingerprint.kernelversion` | string |  |
| `$.defaultfingerprint.system` | string |  |
| `$.defaultfingerprint.nextsystem` | object |  |
| `$.defaultfingerprint.nextsystem.Android` | string |  |
| `$.defaultfingerprint.nextsystem.MacOS` | string |  |
| `$.defaultfingerprint.nextsystem.IOS` | string |  |
| `$.defaultfingerprint.nextsystem.Linux` | string |  |
| `$.defaultfingerprint.UAversion` | string |  |
| `$.defaultfingerprint.ua` | string |  |
| `$.defaultfingerprint.language` | array |  |
| `$.defaultfingerprint.uilanguage` | null |  |
| `$.defaultfingerprint.zone` | string |  |
| `$.defaultfingerprint.geographic` | object |  |
| `$.defaultfingerprint.geographic.enable` | number |  |
| `$.defaultfingerprint.geographic.user` | number |  |
| `$.defaultfingerprint.geographic.longitude` | string |  |
| `$.defaultfingerprint.geographic.latitude` | string |  |
| `$.defaultfingerprint.geographic.accuracy` | string |  |
| `$.defaultfingerprint.dpi` | string |  |
| `$.defaultfingerprint.widowssize` | string |  |
| `$.defaultfingerprint.font` | object |  |
| `$.defaultfingerprint.font.enable` | number |  |
| `$.defaultfingerprint.font.list` | array |  |
| `$.defaultfingerprint.fontfinger` | number |  |
| `$.defaultfingerprint.WebRTC` | number |  |
| `$.defaultfingerprint.WebRTCIP` | string |  |
| `$.defaultfingerprint.Canvas` | number |  |
| `$.defaultfingerprint.WebGl` | number |  |
| `$.defaultfingerprint.WebGlInfo` | number |  |
| `$.defaultfingerprint.WebGLVendor` | string |  |
| `$.defaultfingerprint.WebGLRenderer` | string |  |
| `$.defaultfingerprint.AudioContext` | number |  |
| `$.defaultfingerprint.SpeechVoices` | number |  |
| `$.defaultfingerprint.clientRects` | number |  |
| `$.defaultfingerprint.mediadevice` | number |  |
| `$.defaultfingerprint.cpu` | number |  |
| `$.defaultfingerprint.mem` | number |  |
| `$.defaultfingerprint.devicename` | string |  |
| `$.defaultfingerprint.mac` | string |  |
| `$.defaultfingerprint.hardware` | number |  |
| `$.defaultfingerprint.Bluetooth` | number |  |
| `$.defaultfingerprint.Donottrack` | number |  |
| `$.defaultfingerprint.battery` | number |  |
| `$.defaultfingerprint.enablescanport` | number |  |
| `$.defaultfingerprint.scanport` | string |  |
| `$.defaultfingerprint.enableCookie` | number |  |
| `$.defaultfingerprint.enableopen` | number |  |
| `$.defaultfingerprint.enableopenNumber` | number |  |
| `$.defaultfingerprint.riskControl` | number |  |
| `$.defaultfingerprint.enablenotice` | number |  |
| `$.defaultfingerprint.enablepic` | number |  |
| `$.defaultfingerprint.picsize` | string |  |
| `$.defaultfingerprint.Enablesound` | number |  |
| `$.defaultfingerprint.Enablevideo` | number |  |
| `$.defaultfingerprint.ignoreCookieErr` | number |  |
| `$.defaultfingerprint.enableGc` | number |  |
| `$.defaultfingerprint.gcTime` | number |  |
| `$.defaultfingerprint.enableClearStorage` | number |  |
| `$.defaultfingerprint.enableClearCookie` | number |  |
| `$.defaultfingerprint.randomFinger` | number |  |

### `POST /v2/newbrowser/cloud-accounts/free/shop/get`

Business code `200`, HTTP `200`, 7 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.accountId` | string |  |
| `$.data.oid` | string |  |

### `POST /v2/newbrowser/cloud-accounts/getiduserlist`

Business code `200`, HTTP `200`, 7 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.device` | null |  |
| `$.self` | null |  |
| `$.ipideaself` | null |  |
| `$.shutiaoself` | null |  |
| `$.general` | null |  |

### `POST /v2/newbrowser/cloud-accounts/getshopfromproxy`

Business code `200`, HTTP `200`, 5 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.shopinfo` | null |  |
| `$.total` | number |  |

### `POST /v2/newbrowser/cloud-accounts/num-vis`

Business code `200`, HTTP `200`, 8 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.total` | number |  |
| `$.data.running` | number |  |
| `$.data.expireInWeek` | number |  |

### `POST /v2/newbrowser/cloud-accounts/open/token/get`

Business code `200`, HTTP `200`, 6 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.token` | string |  |

### `POST /v2/newbrowser/cloud-accounts/page`

Business code `200`, HTTP `200`, 96 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].accountName` | string |  |
| `$.data.list[].accountId` | string |  |
| `$.data.list[].companyId` | string |  |
| `$.data.list[].categoryId` | string |  |
| `$.data.list[].deviceType` | string | local |
| `$.data.list[].proxyId` | string |  |
| `$.data.list[].cookies` | string |  |
| `$.data.list[].tagIds` | string |  |
| `$.data.list[].lastLoginUser` | string |  |
| `$.data.list[].remark` | string |  |
| `$.data.list[].lastLoginAt` | string |  |
| `$.data.list[].isDeleted` | number |  |
| `$.data.list[].deleteBy` | string |  |
| `$.data.list[].uiConfigJson` | string |  |
| `$.data.list[].apiJson` | string |  |
| `$.data.list[].serial` | number |  |
| `$.data.list[].publicIp` | string |  |
| `$.data.list[].system` | string |  |
| `$.data.list[].kernelVersion` | string |  |
| `$.data.list[].kernel` | string |  |
| `$.data.list[].userPasswordIds` | string |  |
| `$.data.list[].country` | string |  |
| `$.data.list[].city` | string |  |
| `$.data.list[].inspect` | number |  |
| `$.data.list[].expiredAt` | string |  |
| `$.data.list[].autoRenew` | number |  |
| `$.data.list[].status` | number | 0, 8 |
| `$.data.list[].browserUrl` | string |  |
| `$.data.list[].apiKey` | string |  |
| `$.data.list[].sessionId` | string |  |
| `$.data.list[].productId` | string |  |
| `$.data.list[].cloudId` | string |  |
| `$.data.list[].orderDetailsNo` | string |  |
| `$.data.list[].orderOid` | string |  |
| `$.data.list[].oid` | string |  |
| `$.data.list[].isGive` | number |  |
| `$.data.list[].expired` | number |  |
| `$.data.list[].proxy` | object |  |
| `$.data.list[].proxy.name` | string |  |
| `$.data.list[].proxy.inlie` | string |  |
| `$.data.list[].proxy.uuid` | string |  |
| `$.data.list[].proxy.type` | string |  |
| `$.data.list[].proxy.product` | number |  |
| `$.data.list[].proxy.PublicIP` | string |  |
| `$.data.list[].proxy.ipChannel` | string |  |
| `$.data.list[].proxy.deviceType` | string | local |
| `$.data.list[].proxy.randEnv` | boolean |  |
| `$.data.list[].proxy.proxyaddrArr` | null |  |
| `$.data.list[].proxy.region` | string |  |
| `$.data.list[].proxy.dns` | object |  |
| `$.data.list[].proxy.dns.mode` | boolean | false |
| `$.data.list[].proxy.dns.inside` | boolean |  |
| `$.data.list[].proxy.socks5` | object |  |
| `$.data.list[].proxy.socks5.Addr` | string |  |
| `$.data.list[].proxy.socks5.User` | string |  |
| `$.data.list[].proxy.socks5.Passwd` | string |  |
| `$.data.list[].proxy.http` | object |  |
| `$.data.list[].proxy.http.Addr` | string |  |
| `$.data.list[].proxy.http.User` | string |  |
| `$.data.list[].proxy.http.Passwd` | string |  |
| `$.data.list[].proxy.https` | object |  |
| `$.data.list[].proxy.https.Addr` | string |  |
| `$.data.list[].proxy.https.User` | string |  |
| `$.data.list[].proxy.https.Passwd` | string |  |
| `$.data.list[].proxy.ssh` | object |  |
| `$.data.list[].proxy.ssh.Addr` | string |  |
| `$.data.list[].proxy.ssh.User` | string |  |
| `$.data.list[].proxy.ssh.Passwd` | string |  |
| `$.data.list[].proxy.v2Ray` | object |  |
| `$.data.list[].proxy.v2Ray.addr` | string |  |
| `$.data.list[].proxy.v2Ray.uuid` | string |  |
| `$.data.list[].proxy.zhima` | object |  |
| `$.data.list[].proxy.zhima.Url` | string |  |
| `$.data.list[].proxy.zhima.Interval` | number |  |
| `$.data.list[].proxy.dynamic` | object |  |
| `$.data.list[].proxy.dynamic.Url` | string |  |
| `$.data.list[].proxy.dynamic.Interval` | number |  |
| `$.data.list[].proxy.dynamic.Type` | string |  |
| `$.data.list[].createdAt` | string |  |
| `$.data.list[].clientNum` | number |  |
| `$.data.list[].keepalive` | number |  |
| `$.data.list[].updatedtime` | string |  |
| `$.data.list[].headless` | number |  |
| `$.data.list[].needRestart` | number |  |
| `$.data.list[].visitNum` | number |  |
| `$.data.total` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.currentPage` | number |  |

### `POST /v2/newbrowser/cloud-accounts/popup/get`

Business code `200`, HTTP `200`, 6 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.count` | number |  |

### `POST /v2/newbrowser/getfingerprinturiua`

Business code `403`, HTTP `200`, 4 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |

### `POST /v2/newbrowser/getpackageinfo`

Business code `200`, HTTP `200`, 5 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.packagenumb` | number |  |
| `$.usednumb` | number |  |

### `POST /v2/newbrowser/getrecycleshoplist`

Business code `200`, HTTP `200`, 31 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].account_name` | string |  |
| `$.data.list[].account_id` | string |  |
| `$.data.list[].category_id` | string |  |
| `$.data.list[].platform_id` | string |  |
| `$.data.list[].nick_name` | string |  |
| `$.data.list[].platform_usernsame` | string |  |
| `$.data.list[].tag_ids` | string |  |
| `$.data.list[].remark` | string |  |
| `$.data.list[].delete_by` | string |  |
| `$.data.list[].serial` | number |  |
| `$.data.list[].user_password_ids` | string |  |
| `$.data.list[].deleted_at` | string |  |
| `$.data.list[].platformicon` | string |  |
| `$.data.list[].website` | string |  |
| `$.data.list[].category_name` | string |  |
| `$.data.list[].accounts` | string |  |
| `$.data.list[].url` | string |  |
| `$.data.list[].group` | object |  |
| `$.data.list[].group.name` | string |  |
| `$.data.list[].group.groupid` | string |  |
| `$.data.list[].label` | null |  |
| `$.data.total` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.currentPage` | number |  |

### `POST /v2/newbrowser/getsettings`

Business code `200`, HTTP `200`, 40 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.globalSettings` | object |  |
| `$.globalSettings.enableopen` | string |  |
| `$.globalSettings.enableopenNumber` | string |  |
| `$.globalSettings.risk_control` | number |  |
| `$.globalSettings.load_image` | string |  |
| `$.globalSettings.load_image_max_size` | string |  |
| `$.globalSettings.load_video` | string |  |
| `$.globalSettings.play_sound` | string |  |
| `$.globalSettings.data_sync` | string |  |
| `$.globalSettings.dns` | string |  |
| `$.globalSettings.enable_gc` | string |  |
| `$.globalSettings.gc_time` | string |  |
| `$.globalSettings.enable_clear_storage` | string |  |
| `$.globalSettings.enable_clear_cookie` | string |  |
| `$.globalSettings.random_finger` | string |  |
| `$.globalSettings.storage` | number |  |
| `$.globalSettings.monitoring` | number |  |
| `$.globalSettings.bind_proxy` | number |  |
| `$.globalSettings.expired_display` | number |  |
| `$.globalSettings.device_authorities` | number |  |
| `$.kernelWhiteList` | array |  |
| `$.kernelversion` | string |  |
| `$.personalSettings` | object |  |
| `$.personalSettings.starting_env` | string |  |
| `$.personalSettings.search_engine` | string |  |
| `$.personalSettings.dpi` | string |  |
| `$.personalSettings.icon_type` | number | 4 |
| `$.personalSettings.language` | number |  |
| `$.personalSettings.storage` | number |  |
| `$.personalSettings.sub_search_engine` | string |  |
| `$.personalSettings.hot_key` | string |  |
| `$.personalSettings.sub_hot_key` | string |  |
| `$.personalSettings.batch_start` | string |  |
| `$.searchEngineList` | array |  |
| `$.searchEngineList[]` | object |  |
| `$.searchEngineList[].site` | string |  |
| `$.searchEngineList[].siteDesc` | string |  |
| `$.searchEngineList[].url` | string |  |

### `POST /v2/newbrowser/getUserPasswordRecycleList`

Business code `200`, HTTP `200`, 9 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.list` | null |  |
| `$.data.total` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.currentPage` | number |  |

### `POST /v2/newbrowser/migrate/searchuuid`

Business code `200`, HTTP `200`, 26 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].ID` | number |  |
| `$.data[].CreatedAt` | string |  |
| `$.data[].UpdatedAt` | string |  |
| `$.data[].DeletedAt` | null |  |
| `$.data[].company_id` | string |  |
| `$.data[].user_id` | string |  |
| `$.data[].account_id` | string |  |
| `$.data[].accountName` | string |  |
| `$.data[].platform_id` | string |  |
| `$.data[].custom_platform_id` | string |  |
| `$.data[].platformName` | string |  |
| `$.data[].name` | string |  |
| `$.data[].original_ip` | string |  |
| `$.data[].status` | number | 4 |
| `$.data[].uuid` | string |  |
| `$.data[].batch` | number |  |
| `$.data[].max` | number |  |
| `$.data[].expir` | number |  |
| `$.data[].remainder` | number |  |
| `$.data[].cookie` | string |  |
| `$.data[].finger` | null |  |
| `$.total` | number |  |

### `GET /v2/news/settings/info`

Business code `500`, HTTP `200`, 4 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |

### `POST /v2/news/show/help/list`

Business code `200`, HTTP `200`, 40 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].url` | string |  |
| `$.data.list[].lang` | string |  |
| `$.data.list[].title` | string |  |
| `$.data.list[].subtitle` | string |  |
| `$.data.list[].keyword` | string |  |
| `$.data.list[].tags` | string |  |
| `$.data.list[].categoryId` | number |  |
| `$.data.list[].subdomain` | string |  |
| `$.data.list[].img` | string |  |
| `$.data.list[].content` | string |  |
| `$.data.list[].status` | number | 2 |
| `$.data.list[].uid` | number |  |
| `$.data.list[].author` | string |  |
| `$.data.list[].publishAt` | null |  |
| `$.data.list[].sort` | number |  |
| `$.data.list[].flag` | number | 1, 0 |
| `$.data.list[].flagSort` | number |  |
| `$.data.list[].createdAt` | string |  |
| `$.data.list[].updatedAt` | string |  |
| `$.data.list[].hits` | number |  |
| `$.data.list[].likes` | number |  |
| `$.data.list[].shares` | number |  |
| `$.data.list[].hot` | number |  |
| `$.data.list[].hasHelp` | number |  |
| `$.data.list[].noHelp` | number |  |
| `$.data.list[].seoTitle` | string |  |
| `$.data.list[].downloadCount` | number |  |
| `$.data.list[].registerCount` | number |  |
| `$.data.list[].uvCount` | number |  |
| `$.data.total` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.currentPage` | number |  |

### `GET /v2/plugin/findPluginCompanies`

Business code `200`, HTTP `200`, 25 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.data` | object |  |
| `$.data.repluginCompanies` | object |  |
| `$.data.repluginCompanies.ID` | number |  |
| `$.data.repluginCompanies.CreatedAt` | string |  |
| `$.data.repluginCompanies.UpdatedAt` | string |  |
| `$.data.repluginCompanies.accountIds` | array |  |
| `$.data.repluginCompanies.accountIds[]` | string |  |
| `$.data.repluginCompanies.companyId` | string |  |
| `$.data.repluginCompanies.companyName` | string |  |
| `$.data.repluginCompanies.pluginId` | string |  |
| `$.data.repluginCompanies.pluginName` | string |  |
| `$.data.repluginCompanies.uids` | array |  |
| `$.data.repluginCompanies.pluginCompanyId` | string |  |
| `$.data.repluginCompanies.kernel` | number |  |
| `$.data.repluginCompanies.userId` | string |  |
| `$.data.repluginCompanies.uplinkId` | string |  |
| `$.data.repluginCompanies.isGlobal` | number |  |
| `$.data.repluginCompanies.isTeam` | number |  |
| `$.data.repluginCompanies.groupId` | null |  |
| `$.data.repluginCompanies.groupName` | null |  |
| `$.data.repluginCompanies.pluginType` | number | 2 |
| `$.msg` | string |  |
| `$.requestId` | string |  |

### `GET /v2/plugin/getPluginCategoryGroupCrxList`

Business code `-`, HTTP `200`, 31 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.list` | array |  |
| `$.list[]` | object |  |
| `$.list[].ID` | number |  |
| `$.list[].sort` | number |  |
| `$.list[].title` | string |  |
| `$.list[].type` | number | 1 |
| `$.list[].crx` | array |  |
| `$.list[].crx[]` | object |  |
| `$.list[].crx[].uuid` | string |  |
| `$.list[].crx[].name` | string |  |
| `$.list[].crx[].icon` | string |  |
| `$.list[].crx[].card` | string |  |
| `$.list[].crx[].brief` | string |  |
| `$.list[].crx[].author` | string |  |
| `$.list[].crx[].permissions` | array, null |  |
| `$.list[].crx[].permissions[]` | string |  |
| `$.list[].crx[].catIds` | string |  |
| `$.list[].crx[].CreatedAt` | string |  |
| `$.list[].crx[].lookNum` | number |  |
| `$.list[].crx[].installNum` | number |  |
| `$.list[].crx[].sort` | number |  |
| `$.list[].crx[].accountIds` | null |  |
| `$.list[].crx[].pluginId` | string |  |
| `$.list[].crx[].installStatus` | number | 0 |
| `$.list[].crx[].kernel` | number |  |
| `$.list[].crx[].firefoxPermissions` | null |  |
| `$.list[].crx[].firefoxUuid` | string |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/plugin/getPluginCategoryGroupList`

Business code `-`, HTTP `200`, 14 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.list` | array |  |
| `$.list[]` | object |  |
| `$.list[].type` | number | 1, 2 |
| `$.list[].list` | array |  |
| `$.list[].list[]` | object |  |
| `$.list[].list[].ID` | number |  |
| `$.list[].list[].title` | string |  |
| `$.list[].list[].sort` | number |  |
| `$.list[].list[].type` | number | 1, 2 |
| `$.list[].typeText` | string |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/plugin/getPluginCrxList`

Business code `-`, HTTP `200`, 29 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.list` | array |  |
| `$.list[]` | object |  |
| `$.list[].uuid` | string |  |
| `$.list[].name` | string |  |
| `$.list[].permissions` | array |  |
| `$.list[].permissions[]` | string |  |
| `$.list[].icon` | string |  |
| `$.list[].card` | string |  |
| `$.list[].brief` | string |  |
| `$.list[].author` | string |  |
| `$.list[].catIds` | string |  |
| `$.list[].CreatedAt` | string |  |
| `$.list[].UpdatedAt` | string |  |
| `$.list[].lookNum` | number |  |
| `$.list[].installNum` | number |  |
| `$.list[].sort` | number |  |
| `$.list[].accountIds` | array, null |  |
| `$.list[].pluginId` | string |  |
| `$.list[].installStatus` | number | 0, 1 |
| `$.list[].kernel` | number |  |
| `$.list[].firefoxPermissions` | null |  |
| `$.list[].firefoxUuid` | string |  |
| `$.list[].pluginType` | null |  |
| `$.list[].pluginCompanyId` | string |  |
| `$.list[].accountIds[]` | string |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/plugin/getPluginCrxUserList`

Business code `-`, HTTP `200`, 30 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.list` | array |  |
| `$.list[]` | object |  |
| `$.list[].uuid` | string |  |
| `$.list[].name` | string |  |
| `$.list[].permissions` | array, null |  |
| `$.list[].permissions[]` | string |  |
| `$.list[].icon` | string |  |
| `$.list[].card` | string |  |
| `$.list[].brief` | string |  |
| `$.list[].author` | string |  |
| `$.list[].catIds` | string |  |
| `$.list[].CreatedAt` | string |  |
| `$.list[].UpdatedAt` | string |  |
| `$.list[].lookNum` | number |  |
| `$.list[].installNum` | number |  |
| `$.list[].sort` | number |  |
| `$.list[].accountIds` | array, null |  |
| `$.list[].pluginId` | string |  |
| `$.list[].installStatus` | number | 1, 0 |
| `$.list[].kernel` | number |  |
| `$.list[].firefoxPermissions` | array, null |  |
| `$.list[].firefoxUuid` | string |  |
| `$.list[].pluginType` | number | 2 |
| `$.list[].pluginCompanyId` | string |  |
| `$.list[].firefoxPermissions[]` | string |  |
| `$.list[].accountIds[]` | string |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/plugin/getPluginHeatSearchesList`

Business code `-`, HTTP `200`, 8 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.list` | array |  |
| `$.list[]` | object |  |
| `$.list[].heatWord` | string |  |
| `$.list[].sort` | string |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/plugin/group/accountGroupList`

Business code `7`, HTTP `200`, 5 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.msg` | string |  |

### `GET /v2/plugin/group/gitPluginGroupList`

Business code `-`, HTTP `200`, 5 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.list` | null |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/plugin/myPlugin`

Business code `-`, HTTP `200`, 46 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.list` | array |  |
| `$.list[]` | object |  |
| `$.list[].accountIds` | array, null |  |
| `$.list[].pluginId` | string |  |
| `$.list[].uids` | array, null |  |
| `$.list[].uids[]` | string |  |
| `$.list[].companyId` | string |  |
| `$.list[].uuid` | string |  |
| `$.list[].userName` | string |  |
| `$.list[].nickName` | string |  |
| `$.list[].version` | string |  |
| `$.list[].pluginCompanyId` | string |  |
| `$.list[].permissions` | array, null |  |
| `$.list[].permissions[]` | string |  |
| `$.list[].name` | string |  |
| `$.list[].icon` | string |  |
| `$.list[].card` | string |  |
| `$.list[].brief` | string |  |
| `$.list[].author` | string |  |
| `$.list[].catIds` | string |  |
| `$.list[].CreatedAt` | string |  |
| `$.list[].lookNum` | number |  |
| `$.list[].installNum` | number |  |
| `$.list[].sort` | number |  |
| `$.list[].installStatus` | number | 1 |
| `$.list[].kernel` | number |  |
| `$.list[].firefoxVersion` | string |  |
| `$.list[].firefoxPermissions` | array, null |  |
| `$.list[].firefoxUuid` | string |  |
| `$.list[].userId` | string |  |
| `$.list[].uplinkId` | string |  |
| `$.list[].isGlobal` | number |  |
| `$.list[].isTeam` | number |  |
| `$.list[].groupId` | array, null |  |
| `$.list[].groupName` | array, null |  |
| `$.list[].pluginType` | number | 2, 4, 1 |
| `$.list[].detail` | string |  |
| `$.list[].teamStatus` | number | 0 |
| `$.list[].accountIds[]` | string |  |
| `$.list[].groupId[]` | string |  |
| `$.list[].groupName[]` | string |  |
| `$.list[].firefoxPermissions[]` | string |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/proxy/authority/get`

Business code `401`, HTTP `200`, 6 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `POST /v2/proxy/device/dynamics/proxy`

Business code `4011`, HTTP `200`, 6 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `POST /v2/proxy/device/findDesignateDevices`

Business code `200`, HTTP `200`, 6 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | array |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/proxy/device/findDeviceDynamicProxies`

Business code `200`, HTTP `200`, 34 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.data` | array |  |
| `$.data.data[]` | object |  |
| `$.data.data[].created_at` | string |  |
| `$.data.data[].updated_at` | string |  |
| `$.data.data[].deviceid` | string |  |
| `$.data.data[].companyid` | string |  |
| `$.data.data[].userid` | string |  |
| `$.data.data[].name` | string |  |
| `$.data.data[].trademark` | string |  |
| `$.data.data[].type` | string | http, socks5 |
| `$.data.data[].autoSwitch` | number |  |
| `$.data.data[].url` | string |  |
| `$.data.data[].notes` | null |  |
| `$.data.data[].status` | number | 0 |
| `$.data.data[].deleteby` | string |  |
| `$.data.data[].ip_type` | number | 1 |
| `$.data.data[].ip_query_channel` | string |  |
| `$.data.data[].ip_place` | string |  |
| `$.data.data[].inspect` | number |  |
| `$.data.data[].serial` | number |  |
| `$.data.data[].publicip` | string |  |
| `$.data.data[].isbind` | number |  |
| `$.data.data[].api` | number |  |
| `$.data.data[].authority` | number |  |
| `$.data.data[].authority_userids` | null |  |
| `$.data.total` | number |  |
| `$.data.current_page` | number |  |
| `$.data.per_page` | number |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/proxy/device/findDeviceLogsList`

Business code `200`, HTTP `200`, 133 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.data` | array |  |
| `$.data.data[]` | object |  |
| `$.data.data[].id` | number |  |
| `$.data.data[].created_at` | string |  |
| `$.data.data[].updated_at` | string |  |
| `$.data.data[].DeviceOwnId` | string |  |
| `$.data.data[].UserId` | string |  |
| `$.data.data[].company_id` | string |  |
| `$.data.data[].to_company_id` | string |  |
| `$.data.data[].TypeName` | string |  |
| `$.data.data[].device_type` | number | 5, 8, 12, 7, 6 |
| `$.data.data[].DescJson` | string |  |
| `$.data.data[].desc_json_ob` | object |  |
| `$.data.data[].desc_json_ob.created_at` | null |  |
| `$.data.data[].desc_json_ob.updated_at` | null |  |
| `$.data.data[].desc_json_ob.auto_renew` | null |  |
| `$.data.data[].desc_json_ob.start_time` | null |  |
| `$.data.data[].desc_json_ob.expired_time` | null |  |
| `$.data.data[].desc_json_ob.last_login_at` | null |  |
| `$.data.data[].desc_json_ob.device_name` | string |  |
| `$.data.data[].desc_json_ob.cloud_id` | string |  |
| `$.data.data[].desc_json_ob.cloud_type` | number | 0 |
| `$.data.data[].desc_json_ob.device_id` | string |  |
| `$.data.data[].desc_json_ob.device_info` | string |  |
| `$.data.data[].desc_json_ob.device_attribution` | string |  |
| `$.data.data[].desc_json_ob.tags` | string |  |
| `$.data.data[].desc_json_ob.status` | string |  |
| `$.data.data[].desc_json_ob.ip_state` | number | 0 |
| `$.data.data[].desc_json_ob.company_id` | string |  |
| `$.data.data[].desc_json_ob.from_company_id` | string |  |
| `$.data.data[].desc_json_ob.uid` | string |  |
| `$.data.data[].desc_json_ob.oid` | string |  |
| `$.data.data[].desc_json_ob.virtual` | string |  |
| `$.data.data[].desc_json_ob.proxyaddr` | string |  |
| `$.data.data[].desc_json_ob.proxyaddr_arr` | string |  |
| `$.data.data[].desc_json_ob.proxyu` | string |  |
| `$.data.data[].desc_json_ob.proxyp` | string |  |
| `$.data.data[].desc_json_ob.Proxytype` | string |  |
| `$.data.data[].desc_json_ob.publicip` | string |  |
| `$.data.data[].desc_json_ob.proxyId` | number |  |
| `$.data.data[].desc_json_ob.band_width` | number |  |
| `$.data.data[].desc_json_ob.instance_no` | string |  |
| `$.data.data[].desc_json_ob.details_no` | string |  |
| `$.data.data[].desc_json_ob.cidr_blocks` | null |  |
| `$.data.data[].desc_json_ob.ip_type` | number | 0 |
| `$.data.data[].desc_json_ob.isp_type` | number | 0 |
| `$.data.data[].desc_json_ob.net_type` | number | 0 |
| `$.data.data[].desc_json_ob.ip_query_channel` | string |  |
| `$.data.data[].desc_json_ob.ip_place` | string |  |
| `$.data.data[].desc_json_ob.inspect` | number |  |
| `$.data.data[].desc_json_ob.asnType` | number | 0 |
| `$.data.data[].desc_json_ob.status_text` | string |  |
| `$.data.data[].desc_json_ob.auto_renew_text` | string |  |
| `$.data.data[].desc_json_ob.tags_arr` | null |  |
| `$.data.data[].desc_json_ob.time_day_num` | number |  |
| `$.data.data[].desc_json_ob.flow_num` | string |  |
| `$.data.data[].desc_json_ob.serial` | number |  |
| `$.data.data[].desc_json_ob.isbind` | number |  |
| `$.data.data[].desc_json_ob.replace_num` | number |  |
| `$.data.data[].desc_json_ob.replace_status` | string |  |
| `$.data.data[].desc_json_ob.auto_month` | number |  |
| `$.data.data[].desc_json_ob.cloud` | object |  |
| `$.data.data[].desc_json_ob.cloud.is_close` | null |  |
| `$.data.data[].desc_json_ob.cloud.created_at` | null |  |
| `$.data.data[].desc_json_ob.cloud.updated_at` | null |  |
| `$.data.data[].desc_json_ob.cloud.ext_num` | null |  |
| `$.data.data[].desc_json_ob.cloud.package_type` | string |  |
| `$.data.data[].desc_json_ob.cloud.region_id` | string |  |
| `$.data.data[].desc_json_ob.cloud.country` | string |  |
| `$.data.data[].desc_json_ob.cloud.city` | string |  |
| `$.data.data[].desc_json_ob.cloud.cpu` | string |  |
| `$.data.data[].desc_json_ob.cloud.memory` | string |  |
| `$.data.data[].desc_json_ob.cloud.instance_id` | string |  |
| `$.data.data[].desc_json_ob.cloud.bundle_id` | string |  |
| `$.data.data[].desc_json_ob.cloud.display_area` | string |  |
| `$.data.data[].desc_json_ob.cloud.display_region` | string |  |
| `$.data.data[].desc_json_ob.cloud.ext_rul` | string |  |
| `$.data.data[].desc_json_ob.cloud.vtype` | string |  |
| `$.data.data[].desc_json_ob.cloud.price_json` | null |  |
| `$.data.data[].desc_json_ob.cloud.packages` | null |  |
| `$.data.data[].desc_json_ob.cloud.dynamic_packages` | null |  |
| `$.data.data[].desc_json_ob.cloud.line_price` | number |  |
| `$.data.data[].desc_json_ob.cloud.selling_price` | number |  |
| `$.data.data[].desc_json_ob.cloud.origin_price` | number |  |
| `$.data.data[].desc_json_ob.cloud.floor_price` | number |  |
| `$.data.data[].desc_json_ob.cloud.proxy_type` | number | 0 |
| `$.data.data[].desc_json_ob.cloud.sell_pool` | number |  |
| `$.data.data[].desc_json_ob.cloud.is_new` | number |  |
| `$.data.data[].desc_json_ob.cloud.is_recommend` | number |  |
| `$.data.data[].desc_json_ob.cloud.is_display` | number |  |
| `$.data.data[].desc_json_ob.cloud.is_hot` | number |  |
| `$.data.data[].desc_json_ob.cloud.is_discount` | number |  |
| `$.data.data[].desc_json_ob.cloud.remaining` | number |  |
| `$.data.data[].desc_json_ob.cloud.ip_type` | number | 0 |
| `$.data.data[].desc_json_ob.cloud.isp_type` | number | 0 |
| `$.data.data[].desc_json_ob.cloud.net_type` | number | 0 |
| `$.data.data[].desc_json_ob.cloud.band_width` | number |  |
| `$.data.data[].desc_json_ob.cloud.asn_type` | number | 0 |
| `$.data.data[].desc_json_ob.cloud.band_width_type` | number | 0 |
| `$.data.data[].desc_json_ob.cloud.cidr_status` | number | 0 |
| `$.data.data[].desc_json_ob.cloud.max_band_width` | number |  |
| `$.data.data[].desc_json_ob.cloud.unit` | number |  |
| `$.data.data[].desc_json_ob.cloud.duration` | number |  |
| `$.data.data[].desc_json_ob.cloud.band_width_cost` | number |  |
| `$.data.data[].desc_json_ob.cloud.band_width_price` | number |  |
| `$.data.data[].desc_json_ob.cloud.id` | number |  |
| `$.data.data[].desc_json_ob.cloud.area_code` | string |  |
| `$.data.data[].desc_json_ob.cloud.country_code` | string |  |
| `$.data.data[].desc_json_ob.cloud.city_code` | string |  |
| `$.data.data[].desc_json_ob.cloud.detail` | null |  |
| `$.data.data[].desc_json_ob.cloud.parent_no` | string |  |
| `$.data.data[].desc_json_ob.cloud.name` | string |  |
| `$.data.data[].desc_json_ob.cloud.sell_unit` | number |  |
| `$.data.data[].desc_json_ob.cloud.assign_ip` | number |  |
| `$.data.data[].desc_json_ob.cloud.discount` | number |  |
| `$.data.data[].desc_json_ob.cloud.recommend_platform` | string |  |
| `$.data.data[].desc_json_ob.cloud.un_recommend_platform` | string |  |
| `$.data.data[].desc_json_ob.cloud.third_recommend_platform` | string |  |
| `$.data.data[].desc_json_ob.cloud.third_un_recommend_platform` | string |  |
| `$.data.data[].desc_json_ob.cloud.remark` | string |  |
| `$.data.data[].DeviceId` | string |  |
| `$.data.data[].publicip` | string |  |
| `$.data.data[].device_name` | string |  |
| `$.data.data[].environment` | string |  |
| `$.data.total` | number |  |
| `$.data.current_page` | number |  |
| `$.data.per_page` | number |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/proxy/device/getCloudBrowserSupport`

Business code `200`, HTTP `200`, 33 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].id` | number |  |
| `$.data[].parentCode` | string |  |
| `$.data[].code` | string |  |
| `$.data[].name` | string |  |
| `$.data[].count` | number |  |
| `$.data[].flag` | number | 0 |
| `$.data[].sort` | number |  |
| `$.data[].children` | array |  |
| `$.data[].children[]` | object |  |
| `$.data[].children[].id` | number |  |
| `$.data[].children[].parentCode` | string |  |
| `$.data[].children[].code` | string |  |
| `$.data[].children[].name` | string |  |
| `$.data[].children[].count` | number |  |
| `$.data[].children[].flag` | number | 0 |
| `$.data[].children[].sort` | number |  |
| `$.data[].children[].children` | array |  |
| `$.data[].children[].children[]` | object |  |
| `$.data[].children[].children[].id` | number |  |
| `$.data[].children[].children[].parentCode` | string |  |
| `$.data[].children[].children[].code` | string |  |
| `$.data[].children[].children[].name` | string |  |
| `$.data[].children[].children[].count` | number |  |
| `$.data[].children[].children[].flag` | number | 0 |
| `$.data[].children[].children[].sort` | number |  |
| `$.data[].children[].children[].children` | null |  |
| `$.msg` | string |  |
| `$.traceId` | string |  |

### `GET /v2/retail/frozenList`

Business code `-`, HTTP `200`, 5 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.list` | array |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/retail/getRetailWithdrawLogList`

Business code `-`, HTTP `200`, 5 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.list` | array |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/rpa/findRpaCarbonConfig`

Business code `200`, HTTP `200`, 37 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.rerpaCarbonConfig` | object |  |
| `$.data.rerpaCarbonConfig.accountNotes` | string |  |
| `$.data.rerpaCarbonConfig.allowSavingPassword` | number |  |
| `$.data.rerpaCarbonConfig.browserStatus` | number | 1 |
| `$.data.rerpaCarbonConfig.clearCacheShutdown` | number |  |
| `$.data.rerpaCarbonConfig.companyId` | string |  |
| `$.data.rerpaCarbonConfig.config` | array |  |
| `$.data.rerpaCarbonConfig.config[]` | object |  |
| `$.data.rerpaCarbonConfig.config[].type` | string | switchPage |
| `$.data.rerpaCarbonConfig.config[].config` | object |  |
| `$.data.rerpaCarbonConfig.config[].config.type` | string | url |
| `$.data.rerpaCarbonConfig.config[].config.remark` | string |  |
| `$.data.rerpaCarbonConfig.config[].config.content` | string |  |
| `$.data.rerpaCarbonConfig.config[].config.relation` | string |  |
| `$.data.rerpaCarbonConfig.configId` | string |  |
| `$.data.rerpaCarbonConfig.exceptionHandle` | number |  |
| `$.data.rerpaCarbonConfig.groupId` | string |  |
| `$.data.rerpaCarbonConfig.headlessBrowser` | number |  |
| `$.data.rerpaCarbonConfig.fullscreen` | number |  |
| `$.data.rerpaCarbonConfig.labelStatus` | number | 1 |
| `$.data.rerpaCarbonConfig.notFillPassword` | number |  |
| `$.data.rerpaCarbonConfig.rpaName` | string |  |
| `$.data.rerpaCarbonConfig.startupParameter` | string |  |
| `$.data.rerpaCarbonConfig.taskTimeout` | number |  |
| `$.data.rerpaCarbonConfig.userId` | string |  |
| `$.data.rerpaCarbonConfig.groupName` | string |  |
| `$.data.rerpaCarbonConfig.top` | null |  |
| `$.data.rerpaCarbonConfig.CreatedAt` | string |  |
| `$.data.rerpaCarbonConfig.UpdatedAt` | string |  |
| `$.data.rerpaCarbonConfig.opUserId` | string |  |
| `$.data.rerpaCarbonConfig.DeletedAt` | string |  |
| `$.msg` | string |  |
| `$.requestId` | string |  |

### `GET /v2/rpa/findRpaGroup`

Business code `200`, HTTP `200`, 11 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.rerpaGroup` | object |  |
| `$.data.rerpaGroup.companyId` | string |  |
| `$.data.rerpaGroup.groupId` | string |  |
| `$.data.rerpaGroup.name` | string |  |
| `$.data.rerpaGroup.userId` | string |  |
| `$.msg` | string |  |
| `$.requestId` | string |  |

### `GET /v2/rpa/getRpaCarbonConfigList`

Business code `0`, HTTP `200`, 91 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.list` | array |  |
| `$.list[]` | object |  |
| `$.list[].accountNotes` | string |  |
| `$.list[].allowSavingPassword` | number |  |
| `$.list[].browserStatus` | number | 1, 2 |
| `$.list[].clearCacheShutdown` | number |  |
| `$.list[].companyId` | string |  |
| `$.list[].config` | array |  |
| `$.list[].config[]` | object |  |
| `$.list[].config[].type` | string | newPage, gotoUrl, waitTime, closeBrowser, closeOtherPage, click, inputContent, javaScript, whileData, useExcel, ifElse, scrollPage, forElements, screenshotPage, downloadFile, switchPage, uploadAttachment, waitForSelector, waitForResponse, getResponse, toJson, forLists, saveRemark, saveTag, getElement |
| `$.list[].config[].config` | array, object |  |
| `$.list[].config[].config.url` | string |  |
| `$.list[].config[].config.remark` | string |  |
| `$.list[].config[].config.timeout` | number |  |
| `$.list[].config[].config.timeoutMax` | number |  |
| `$.list[].config[].config.timeoutMin` | number |  |
| `$.list[].config[].config.timeoutType` | string | fixedValue, randomInterval |
| `$.list[].configId` | string |  |
| `$.list[].exceptionHandle` | number |  |
| `$.list[].groupId` | string |  |
| `$.list[].headlessBrowser` | number |  |
| `$.list[].fullscreen` | number |  |
| `$.list[].labelStatus` | number | 1, 2 |
| `$.list[].notFillPassword` | number |  |
| `$.list[].rpaName` | string |  |
| `$.list[].startupParameter` | string |  |
| `$.list[].taskTimeout` | number |  |
| `$.list[].userId` | string |  |
| `$.list[].groupName` | string |  |
| `$.list[].top` | number |  |
| `$.list[].CreatedAt` | string |  |
| `$.list[].UpdatedAt` | string |  |
| `$.list[].opUserId` | string |  |
| `$.list[].DeletedAt` | string |  |
| `$.list[].config[].config.type` | string | click, smooth, object, url, local, 1, 2 |
| `$.list[].config[].config.button` | string |  |
| `$.list[].config[].config.serial` | number |  |
| `$.list[].config[].config.element` | string |  |
| `$.list[].config[].config.selector` | string |  |
| `$.list[].config[].config.serialMax` | number |  |
| `$.list[].config[].config.serialMin` | number |  |
| `$.list[].config[].config.serialType` | string | fixedValue |
| `$.list[].config[].config.selectorType` | string | selector, element, page |
| `$.list[].config[].config.content` | string |  |
| `$.list[].config[].config.isRandom` | string |  |
| `$.list[].config[].config.intervals` | number |  |
| `$.list[].config[].config.randomContent` | string |  |
| `$.list[].config[].config.params` | array |  |
| `$.list[].config[].config.variable` | string |  |
| `$.list[].config[].config.result` | string |  |
| `$.list[].config[].config.children` | array |  |
| `$.list[].config[].config.children[]` | object |  |
| `$.list[].config[].config.children[].type` | string | javaScript, waitTime, gotoUrl, waitForSelector, getElement, toJson, forLists, click, ifElse, inputContent, keyboard, scrollPage, saveRemark, closeBrowser, passingElement |
| `$.list[].config[].config.children[].config` | array, object |  |
| `$.list[].config[].config.relation` | string |  |
| `$.list[].config[].config.condition` | string |  |
| `$.list[].config[].config.path` | string |  |
| `$.list[].config[].config.variableList` | array |  |
| `$.list[].config[].config.variableList[]` | string |  |
| `$.list[].config[].config.params[]` | string |  |
| `$.list[].config[].config.other` | array |  |
| `$.list[].config[].config.other[]` | object |  |
| `$.list[].config[].config.other[].type` | string | javaScript |
| `$.list[].config[].config.other[].config` | object |  |
| `$.list[].config[].config.distance` | number |  |
| `$.list[].config[].config.position` | string |  |
| `$.list[].config[].config.scrollType` | string | position, pixel |
| `$.list[].config[].config.randomWheelDistance` | array |  |
| `$.list[].config[].config.randomWheelDistance[]` | number |  |
| `$.list[].config[].config.randomWheelSleepTime` | array |  |
| `$.list[].config[].config.randomWheelSleepTime[]` | number |  |
| `$.list[].config[].config.key` | string |  |
| `$.list[].config[].config.variableIndex` | string |  |
| `$.list[].config[].config.name` | string |  |
| `$.list[].config[].config.format` | string |  |
| `$.list[].config[].config.quality` | number |  |
| `$.list[].config[].config.fullPage` | string |  |
| `$.list[].config[].config.isShow` | string |  |
| `$.list[].config[].config.tags` | array |  |
| `$.list[].config[].config.tags[]` | object |  |
| `$.list[].config[].config.tags[].name` | string |  |
| `$.list[].config[].config.tags[].type` | number | 4, 3 |
| `$.list[].config[].config.tags[].labelid` | string |  |
| `$.list[].config[].config.selectorRadio` | string |  |
| `$.list[].config[].config.hiddenChildren` | boolean |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `POST /v2/rpa/getRpaPlanManagementList`

Business code `200`, HTTP `200`, 94 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.list` | array |  |
| `$.list[]` | object |  |
| `$.list[].planId` | string |  |
| `$.list[].planName` | string |  |
| `$.list[].rpaName` | string |  |
| `$.list[].configId` | string |  |
| `$.list[].executeType` | number | 2 |
| `$.list[].executionMonth` | number |  |
| `$.list[].executionWeek` | number |  |
| `$.list[].intervalTime` | number |  |
| `$.list[].priorityExecute` | number |  |
| `$.list[].companyId` | string |  |
| `$.list[].userId` | string |  |
| `$.list[].account` | array |  |
| `$.list[].account[]` | object |  |
| `$.list[].account[].shopid` | string |  |
| `$.list[].account[].serial` | number |  |
| `$.list[].rerpaCarbonConfig` | null, object |  |
| `$.list[].executeFrequency` | number |  |
| `$.list[].startTime` | number |  |
| `$.list[].endTime` | number |  |
| `$.list[].executionTime` | string |  |
| `$.list[].runNum` | number |  |
| `$.list[].status` | number | 2 |
| `$.list[].CreatedAt` | string |  |
| `$.list[].updatedAt` | string |  |
| `$.list[].group` | string |  |
| `$.list[].cdeviceId` | string |  |
| `$.list[].rdeviceId` | string |  |
| `$.list[].opUserId` | string |  |
| `$.list[].DeletedAt` | string |  |
| `$.list[].rerpaCarbonConfig.top` | number |  |
| `$.list[].rerpaCarbonConfig.config` | array |  |
| `$.list[].rerpaCarbonConfig.config[]` | object |  |
| `$.list[].rerpaCarbonConfig.config[].type` | string | newPage, gotoUrl, waitTime, closeBrowser, scrollPage, forElements, screenshotPage |
| `$.list[].rerpaCarbonConfig.config[].config` | array, object |  |
| `$.list[].rerpaCarbonConfig.config[].config.url` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.remark` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.timeout` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.timeoutMax` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.timeoutMin` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.timeoutType` | string | fixedValue, randomInterval |
| `$.list[].rerpaCarbonConfig.userId` | string |  |
| `$.list[].rerpaCarbonConfig.checked` | boolean |  |
| `$.list[].rerpaCarbonConfig.groupId` | string |  |
| `$.list[].rerpaCarbonConfig.rpaName` | string |  |
| `$.list[].rerpaCarbonConfig.configId` | string |  |
| `$.list[].rerpaCarbonConfig.opUserId` | string |  |
| `$.list[].rerpaCarbonConfig.CreatedAt` | string |  |
| `$.list[].rerpaCarbonConfig.DeletedAt` | string |  |
| `$.list[].rerpaCarbonConfig.UpdatedAt` | string |  |
| `$.list[].rerpaCarbonConfig.companyId` | string |  |
| `$.list[].rerpaCarbonConfig.groupName` | string |  |
| `$.list[].rerpaCarbonConfig.fullscreen` | number |  |
| `$.list[].rerpaCarbonConfig.labelStatus` | number | 1 |
| `$.list[].rerpaCarbonConfig.taskTimeout` | number |  |
| `$.list[].rerpaCarbonConfig.accountNotes` | string |  |
| `$.list[].rerpaCarbonConfig.browserStatus` | number | 1 |
| `$.list[].rerpaCarbonConfig.exceptionHandle` | number |  |
| `$.list[].rerpaCarbonConfig.headlessBrowser` | number |  |
| `$.list[].rerpaCarbonConfig.notFillPassword` | number |  |
| `$.list[].rerpaCarbonConfig.startupParameter` | string |  |
| `$.list[].rerpaCarbonConfig.clearCacheShutdown` | number |  |
| `$.list[].rerpaCarbonConfig.allowSavingPassword` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.type` | string | smooth, object |
| `$.list[].rerpaCarbonConfig.config[].config.serial` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.distance` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.position` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.selector` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.serialMax` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.serialMin` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.scrollType` | string | position |
| `$.list[].rerpaCarbonConfig.config[].config.selectorType` | string | page, selector |
| `$.list[].rerpaCarbonConfig.config[].config.randomWheelDistance` | array |  |
| `$.list[].rerpaCarbonConfig.config[].config.randomWheelDistance[]` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.randomWheelSleepTime` | array |  |
| `$.list[].rerpaCarbonConfig.config[].config.randomWheelSleepTime[]` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.key` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.children` | array |  |
| `$.list[].rerpaCarbonConfig.config[].config.children[]` | object |  |
| `$.list[].rerpaCarbonConfig.config[].config.variable` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.variableIndex` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.name` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.path` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.format` | string |  |
| `$.list[].rerpaCarbonConfig.config[].config.quality` | number |  |
| `$.list[].rerpaCarbonConfig.config[].config.fullPage` | string |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |
| `$.timestamp` | number |  |

### `GET /v2/rpa/getRpaShopGroupList`

Business code `0`, HTTP `200`, 12 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.list` | array |  |
| `$.list[]` | object |  |
| `$.list[].ID` | number |  |
| `$.list[].CreatedAt` | string |  |
| `$.list[].UpdatedAt` | string |  |
| `$.list[].name` | string |  |
| `$.count` | number |  |
| `$.pageIndex` | number |  |
| `$.pageSize` | number |  |

### `GET /v2/rpa/getRpaTaskLog`

Business code `200`, HTTP `200`, 20 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msgCode` | number |  |
| `$.data` | object |  |
| `$.data.rerpaTaskLog` | object |  |
| `$.data.rerpaTaskLog.id` | string |  |
| `$.data.rerpaTaskLog.operationId` | string |  |
| `$.data.rerpaTaskLog.configId` | string |  |
| `$.data.rerpaTaskLog.rpaName` | string |  |
| `$.data.rerpaTaskLog.executeType` | number | 1 |
| `$.data.rerpaTaskLog.executionTime` | number |  |
| `$.data.rerpaTaskLog.taskId` | string |  |
| `$.data.rerpaTaskLog.serialNumber` | number |  |
| `$.data.rerpaTaskLog.accId` | string |  |
| `$.data.rerpaTaskLog.status` | number | 9 |
| `$.data.rerpaTaskLog.logExt` | array |  |
| `$.data.rerpaTaskLog.completionTime` | number |  |
| `$.data.rerpaTaskLog.rdeviceId` | string |  |
| `$.msg` | string |  |
| `$.requestId` | string |  |

### `POST /v2/sso/auth/myUserinfo`

Business code `200`, HTTP `200`, 37 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.userId` | string |  |
| `$.data.username` | string |  |
| `$.data.mobile` | string |  |
| `$.data.email` | string |  |
| `$.data.firstName` | string |  |
| `$.data.lastName` | string |  |
| `$.data.nickname` | string |  |
| `$.data.avatar` | string |  |
| `$.data.bio` | string |  |
| `$.data.gender` | string |  |
| `$.data.birthday` | string |  |
| `$.data.lockEnd` | string |  |
| `$.data.cancelStatus` | number | 1 |
| `$.data.cancelDeadline` | null |  |
| `$.data.createdAt` | string |  |
| `$.data.updateAt` | string |  |
| `$.data.inviter` | string |  |
| `$.data.inviteType` | number | 0 |
| `$.data.source` | string | 112 |
| `$.data.os` | string |  |
| `$.data.lastLoginPort` | string |  |
| `$.data.lastLoginDevice` | string |  |
| `$.data.ip` | string |  |
| `$.data.ipLocation` | string |  |
| `$.data.industryLabel` | string |  |
| `$.data.bind` | object |  |
| `$.data.bind.wechat` | number |  |
| `$.data.bind.ding` | number |  |
| `$.data.bind.mp` | number |  |
| `$.data.bind.mini` | number |  |
| `$.data.bind.google` | number |  |
| `$.data.password` | string |  |

### `GET /v2/sso/getUserPlatforms`

Business code `200`, HTTP `200`, 17 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.count` | number |  |
| `$.data.pageIndex` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].name` | string |  |
| `$.data.list[].child` | array, null |  |
| `$.data.list[].child[]` | object |  |
| `$.data.list[].child[].id` | number |  |
| `$.data.list[].child[].name` | string |  |
| `$.data.list[].child[].child` | null |  |

### `POST /v2/sso/mp/qrCode`

Business code `200`, HTTP `200`, 9 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.ticket` | string |  |
| `$.data.expire_seconds` | number |  |
| `$.data.url` | string |  |
| `$.data.scene` | string |  |

### `POST /v2/team/auth/myRights`

Business code `200`, HTTP `200`, 21 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].id` | number |  |
| `$.data[].type` | string | 1, 2, 3, 4, 5, 6, 7, 8 |
| `$.data[].rightSlug` | string |  |
| `$.data[].rightName` | string |  |
| `$.data[].rightRouter` | string |  |
| `$.data[].isEnable` | string |  |
| `$.data[].sort` | string |  |
| `$.data[].flagId` | string |  |
| `$.data[].roleType` | string | 1 |
| `$.data[].rightApis` | string |  |
| `$.data[].label` | string |  |
| `$.data[].createdAt` | string |  |
| `$.data[].updatedAt` | string |  |
| `$.data[].createBy` | number |  |
| `$.data[].updateBy` | number |  |

### `GET /v2/team/authentication/check`

Business code `200`, HTTP `200`, 17 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.userId` | string |  |
| `$.data.userCard` | string |  |
| `$.data.userStatus` | number | 3 |
| `$.data.userAcceptAt` | string |  |
| `$.data.companyId` | string |  |
| `$.data.companyIdCard` | string |  |
| `$.data.processInstanceId` | string |  |
| `$.data.name` | string |  |
| `$.data.companyStatus` | number | 0 |
| `$.data.failCount` | number |  |
| `$.data.companyAcceptAt` | string |  |
| `$.data.failReason` | string |  |

### `GET /v2/team/authentication/companyFourElementsFaceCheck`

Business code `200`, HTTP `200`, 17 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.userId` | string |  |
| `$.data.userCard` | string |  |
| `$.data.userStatus` | number | 0 |
| `$.data.userAcceptAt` | string |  |
| `$.data.companyId` | string |  |
| `$.data.companyIdCard` | string |  |
| `$.data.processInstanceId` | string |  |
| `$.data.name` | string |  |
| `$.data.companyStatus` | number | 0 |
| `$.data.failCount` | number |  |
| `$.data.companyAcceptAt` | string |  |
| `$.data.failReason` | string |  |

### `GET /v2/team/authentication/companyFourElementsQRCode`

Business code `500`, HTTP `200`, 6 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.status` | string | error |
| `$.data` | null |  |

### `GET /v2/team/authentication/get`

Business code `200`, HTTP `200`, 17 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.userId` | string |  |
| `$.data.userCard` | string |  |
| `$.data.userStatus` | number | 3 |
| `$.data.userAcceptAt` | string |  |
| `$.data.companyId` | string |  |
| `$.data.companyIdCard` | string |  |
| `$.data.processInstanceId` | string |  |
| `$.data.name` | string |  |
| `$.data.companyStatus` | number | 1 |
| `$.data.failCount` | number |  |
| `$.data.companyAcceptAt` | string |  |
| `$.data.failReason` | string |  |

### `POST /v2/team/company/getRoleDepartmentMeal`

Business code `200`, HTTP `200`, 18 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].userId` | string |  |
| `$.data[].companyId` | string |  |
| `$.data[].deptName` | string |  |
| `$.data[].deptId` | string |  |
| `$.data[].rolesId` | string |  |
| `$.data[].rolesName` | array |  |
| `$.data[].rolesName[]` | string |  |
| `$.data[].end_time` | string |  |
| `$.data[].day` | number |  |
| `$.data[].free_status` | number | 1, 0 |
| `$.data[].restrict` | boolean |  |
| `$.data[].expired` | boolean |  |

### `POST /v2/team/company/user/devices`

Business code `200`, HTTP `200`, 24 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.count` | number |  |
| `$.data.pageIndex` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].userId` | string |  |
| `$.data.list[].userName` | string |  |
| `$.data.list[].companyId` | string |  |
| `$.data.list[].deviceId` | string |  |
| `$.data.list[].version` | string |  |
| `$.data.list[].platformType` | number | 1 |
| `$.data.list[].devType` | number | 1, 2 |
| `$.data.list[].online_status` | number | 1, 2 |
| `$.data.list[].devName` | string |  |
| `$.data.list[].remark` | string |  |
| `$.data.list[].ip` | string |  |
| `$.data.list[].createdAt` | string |  |
| `$.data.list[].updatedAt` | string |  |

### `POST /v2/team/getMembers`

Business code `200`, HTTP `200`, 40 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.count` | number |  |
| `$.data.pageIndex` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].userId` | string |  |
| `$.data.list[].companyId` | string |  |
| `$.data.list[].deptId` | string |  |
| `$.data.list[].username` | string |  |
| `$.data.list[].name` | string |  |
| `$.data.list[].mobile` | string |  |
| `$.data.list[].email` | string |  |
| `$.data.list[].roles` | string |  |
| `$.data.list[].avatar` | string |  |
| `$.data.list[].leave_status` | number | 2 |
| `$.data.list[].online` | number |  |
| `$.data.list[].package_status` | number | 1 |
| `$.data.list[].usetimeLimit` | object |  |
| `$.data.list[].usetimeLimit.limit` | number |  |
| `$.data.list[].usetimeLimit.beginDate` | string |  |
| `$.data.list[].usetimeLimit.endDate` | string |  |
| `$.data.list[].lastLoginAt` | string |  |
| `$.data.list[].createdAt` | string |  |
| `$.data.list[].updatedAt` | string |  |
| `$.data.list[].pop` | boolean |  |
| `$.data.list[].openId` | string |  |
| `$.data.list[].deptName` | string |  |
| `$.data.list[].rolesName` | null |  |
| `$.data.list[].depPath` | string |  |
| `$.data.list[].cancelStatus` | number | 1 |
| `$.data.list[].cancelDeadline` | null |  |
| `$.data.list[].realName` | string |  |
| `$.data.list[].usetimeLimit.beginTime` | string |  |
| `$.data.list[].usetimeLimit.endTime` | string |  |

### `POST /v2/team/member/info`

Business code `200`, HTTP `200`, 30 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.id` | number |  |
| `$.data.userId` | string |  |
| `$.data.companyId` | string |  |
| `$.data.deptId` | string |  |
| `$.data.username` | string |  |
| `$.data.name` | string |  |
| `$.data.mobile` | string |  |
| `$.data.email` | string |  |
| `$.data.roles` | string |  |
| `$.data.avatar` | string |  |
| `$.data.leave_status` | number | 0 |
| `$.data.online` | number |  |
| `$.data.package_status` | number | 0 |
| `$.data.usetimeLimit` | object |  |
| `$.data.usetimeLimit.limit` | number |  |
| `$.data.usetimeLimit.beginDate` | string |  |
| `$.data.usetimeLimit.endDate` | string |  |
| `$.data.lastLoginAt` | string |  |
| `$.data.createdAt` | string |  |
| `$.data.updatedAt` | string |  |
| `$.data.pop` | boolean |  |
| `$.data.openId` | string |  |
| `$.data.deptName` | string |  |
| `$.data.rolesName` | null |  |
| `$.data.depPath` | string |  |

### `POST /v2/team/member/myInfo`

Business code `200`, HTTP `200`, 31 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.id` | number |  |
| `$.data.userId` | string |  |
| `$.data.companyId` | string |  |
| `$.data.deptId` | string |  |
| `$.data.username` | string |  |
| `$.data.name` | string |  |
| `$.data.mobile` | string |  |
| `$.data.email` | string |  |
| `$.data.roles` | string |  |
| `$.data.avatar` | string |  |
| `$.data.leave_status` | number | 2 |
| `$.data.online` | number |  |
| `$.data.package_status` | number | 1 |
| `$.data.usetimeLimit` | object |  |
| `$.data.usetimeLimit.limit` | number |  |
| `$.data.usetimeLimit.beginDate` | string |  |
| `$.data.usetimeLimit.endDate` | string |  |
| `$.data.lastLoginAt` | string |  |
| `$.data.createdAt` | string |  |
| `$.data.updatedAt` | string |  |
| `$.data.pop` | boolean |  |
| `$.data.openId` | string |  |
| `$.data.deptName` | string |  |
| `$.data.rolesName` | array |  |
| `$.data.rolesName[]` | string |  |
| `$.data.depPath` | string |  |

### `POST /v2/team/myCompanies`

Business code `200`, HTTP `200`, 21 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].companyId` | string |  |
| `$.data[].name` | string |  |
| `$.data[].shortName` | string |  |
| `$.data[].onwer` | string |  |
| `$.data[].status` | number | 2, 1 |
| `$.data[].lockStatus` | number | 1 |
| `$.data[].lockAt` | string |  |
| `$.data[].createdAt` | string |  |
| `$.data[].updateBy` | string |  |
| `$.data[].token` | string |  |
| `$.data[].expire` | string |  |
| `$.data[].code` | string |  |
| `$.data[].ip` | string |  |
| `$.data[].source` | string |  |
| `$.data[].avatar` | string |  |

### `GET /v2/team/plugin/newestPlugins`

Business code `200`, HTTP `200`, 16 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].name` | string |  |
| `$.data[].version` | string |  |
| `$.data[].title` | string |  |
| `$.data[].description` | string |  |
| `$.data[].uuid` | string |  |
| `$.data[].md5` | string |  |
| `$.data[].downloadUrl` | string |  |
| `$.data[].platform` | string | windows |
| `$.data[].status` | number | 2 |
| `$.data[].manifestVersion` | string |  |

### `POST /v2/team/right/list`

Business code `200`, HTTP `200`, 21 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].id` | number |  |
| `$.data[].type` | string | 8, 1, 2, 7, 3, 18, 9, 16, 15, 10, 4, 6, 11, 5, 12, 13 |
| `$.data[].rightSlug` | string |  |
| `$.data[].rightName` | string |  |
| `$.data[].rightRouter` | string |  |
| `$.data[].isEnable` | string |  |
| `$.data[].sort` | string |  |
| `$.data[].flagId` | string |  |
| `$.data[].roleType` | string | 1 |
| `$.data[].rightApis` | string |  |
| `$.data[].label` | string |  |
| `$.data[].createdAt` | string |  |
| `$.data[].updatedAt` | string |  |
| `$.data[].createBy` | number |  |
| `$.data[].updateBy` | number |  |

### `POST /v2/team/right/listTemplate`

Business code `200`, HTTP `200`, 19 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | array |  |
| `$.data[]` | object |  |
| `$.data[].id` | number |  |
| `$.data[].name` | string |  |
| `$.data[].remark` | string |  |
| `$.data[].templateName` | string |  |
| `$.data[].templateType` | number | 1, 2, 3, 4, 5, 6, 7 |
| `$.data[].roleType` | number | 1, 2 |
| `$.data[].templateIds` | string |  |
| `$.data[].isEnable` | number |  |
| `$.data[].sort` | number |  |
| `$.data[].createdAt` | string |  |
| `$.data[].updatedAt` | string |  |
| `$.data[].createBy` | number |  |
| `$.data[].updateBy` | number |  |

### `POST /v2/team/role-group/page`

Business code `200`, HTTP `200`, 16 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.reqId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.list` | array |  |
| `$.data.list[]` | object |  |
| `$.data.list[].id` | number |  |
| `$.data.list[].companyId` | string |  |
| `$.data.list[].name` | string |  |
| `$.data.list[].intro` | string |  |
| `$.data.list[].sort` | number |  |
| `$.data.list[].isDefault` | number |  |
| `$.data.total` | number |  |
| `$.data.pageSize` | number |  |
| `$.data.currentPage` | number |  |

### `POST /v2/team/select/company`

Business code `500`, HTTP `200`, 3 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.code` | number |  |
| `$.msg` | string |  |

### `POST /v2/team/sidebar/get`

Business code `200`, HTTP `200`, 12 field paths.

| Field path | Types | Sample values |
| --- | --- | --- |
| `$` | object |  |
| `$.requestId` | string |  |
| `$.code` | number |  |
| `$.msg` | string |  |
| `$.data` | object |  |
| `$.data.id` | number |  |
| `$.data.createdAt` | string |  |
| `$.data.updatedAt` | string |  |
| `$.data.userId` | string |  |
| `$.data.companyId` | string |  |
| `$.data.version` | number |  |
| `$.data.menus` | string |  |
