# Server API Route Field Inventory (Full Surface)

Field paths observed live for the routes discovered from the management-center client bundle. Generated from `route-sweep.json`; values are never recorded. Meanings come from the shared field dictionary, the common-field table, and name inference.

- Probed routes: 370
- Routes with observed fields: 363
- Distinct field rows: 5269
- Rows with a known meaning: 5269 (100%)
- Re-probed with discovered parameters: 51 routes (reprobe-resolved-routes.mjs)

Collection uses a minimal request body, so a route returning an empty list shows only its envelope. Re-read the route with real identifiers to reveal row fields.

## POST /api/v1/client/base_info

- Client name: `baseInfo`
- HTTP 200, code `0`, 55 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.version` -- Client/kernel version.

## POST /api/v1/client/query_feature_support

- Client name: `queryFeatureSupport`
- HTTP 200, code `0`, 594 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /api/v1/ipify/fetchForwardProxyInfo

- Client name: `getProxyConf`
- HTTP 200, code `0`, 21 bytes

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.

## POST /api/v1/ipify/getVersion

- Client name: `getVersionQ7`
- HTTP 200, code `0`, 24 bytes

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.

## POST /api/v1/ipify/query

- Client name: `getProxyPubilcIp`
- HTTP 200, code `0`, 112 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.code` -- Business status code; 200 is success.
- `$.data.msg` -- Localized operator-facing result message.
- `$.data.data` -- Endpoint payload container.
- `$.data.detect_log` -- Output of the proxy or network detection step.

## POST /api/v1/ipify/queryV7

- Client name: `getProxyPublicIpV7`
- HTTP 200, code `0`, 112 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.code` -- Business status code; 200 is success.
- `$.data.msg` -- Localized operator-facing result message.
- `$.data.data` -- Endpoint payload container.
- `$.data.detect_log` -- Output of the proxy or network detection step.

## POST /api/v1/settings/download_snapshot

- Client name: `downloadSnapshot`
- HTTP 200, code `-1`, 163 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.errMsg` -- Localized operator-facing result message.

## POST /api/v1/settings/fetch_base_url

- Client name: `fetchBaseUrl`
- HTTP 200, code `0`, 77 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /api/v1/settings/fetch_caches_info

- Client name: `cacheInfo`
- HTTP 200, code `0`, 419 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].accountId` -- Identifier.
- `$.data[].isFirefox` -- Whether the kernel entry is Firefox rather than Chromium.
- `$.data[].fileName` -- Display name.
- `$.data[].size` -- File size.
- `$.data[].timestamp` -- Timestamp.
- `$.data[].path` -- Filesystem or install path for the entry.
- `$.data[].md5` -- File checksum (MD5).

## POST /api/v1/settings/fetch_snapshot_info

- Client name: `snapshotInfo`
- HTTP 200, code `0`, 40 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /api/v1/settings/remove_caches

- Client name: `removeCache`
- HTTP 200, code `0`, 51 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.errMsg` -- Localized operator-facing result message.

## POST /api/v1/settings/restore_snapshot

- Client name: `restoreSnapshot`
- HTTP 200, code `-1`, 52 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.errMsg` -- Localized operator-facing result message.

## POST /api/v1/settings/switch_base_url

- Client name: `switchBaseUrl`
- HTTP 200, code `0`, 29 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /api/v1/settings/upload_snapshot

- Client name: `uploadSnapshot`
- HTTP 200, code `-1`, 187 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.errMsg` -- Localized operator-facing result message.

## POST /v2/admin/device/third-proxy/get

- Client name: `thirdProxyHelp`
- HTTP 200, code `500`, 84 bytes, msg `record not found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/admin/device/third-proxy/page

- Client name: `thirdProxyList`
- HTTP 200, code `200`, 7181 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].proxyName` -- Display name.
- `$.data.list[].proxyType` -- Type discriminator.
- `$.data.list[].tags` -- Tag list.
- `$.data.list[].img` -- Image URL.
- `$.data.list[].link` -- Link URL.
- `$.data.list[].desc` -- Description.
- `$.data.list[].status` -- Status value.
- `$.data.list[].createdAt` -- Timestamp.
- `$.data.list[].updatedAt` -- Timestamp.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/check/checkproxy

- Client name: `checkProxy`
- HTTP 200, code ``, 18 bytes

- `$.proxyaddr` -- Proxy host and port.

## POST /v2/collector/track

- Client name: `collectorTrack`
- HTTP 400, code `400`, 124 bytes

- `$.code` -- Business status code; 200 is success.
- `$.message` -- Message text.
- `$.data` -- Endpoint payload container.

## POST /v2/cost/costmanagement/coupons_send

- Client name: `sendCoupons`
- HTTP 200, code `401`, 110 bytes, msg `record not found`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/costmanagement/findDevicesByOrderNo

- Client name: `deviceOrderScan`
- HTTP 200, code `200`, 127 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.orderNo` -- Order number.
- `$.data.status` -- Status value.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/get_user_set_meal

- Client name: `getUsermeal`
- HTTP 200, code `200`, 947 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.created_at` -- Creation timestamp.
- `$.data.updated_at` -- Last update timestamp.
- `$.data.original_discount` -- Count.
- `$.data.package_source` -- Package source.
- `$.data.gift_environment_number` -- Count.
- `$.data.gift_member_number` -- Count.
- `$.data.gift_end_time` -- Timestamp.
- `$.data.start_time` -- Start timestamp; client label `开始时间`.
- `$.data.end_time` -- Timestamp.
- `$.data.free_status` -- Status value.
- `$.data.environment_number` -- Count.
- `$.data.member_number` -- Count.
- `$.data.effective_day` -- Effective plan days.
- `$.data.auto_renew` -- Auto-renew flag for the plan.
- `$.data.final_amount` -- Final plan amount.
- `$.data.residue_amount` -- Remaining balance amount.
- `$.data.payable_amount` -- Amount payable before discount.
- `$.data.actual_amount` -- Amount actually charged.
- `$.data.company_id` -- Identifier.
- `$.data.user_id` -- Identifier.
- `$.data.user_packages_id` -- Identifier.
- `$.data.day` -- Plan day counter.
- `$.data.restrict` -- Whether the account is restricted.
- `$.data.expired` -- Whether the plan/subscription is expired.
- `$.data.has_package` -- Whether the account has an active package.
- `$.data.select_day` -- Selected plan days.
- `$.data.normal_environment_number` -- Count.
- `$.data.normal_member_number` -- Count.
- `$.data.purchased_environment_number` -- Count.
- `$.data.purchased_member_number` -- Count.
- `$.data.free_environment_number` -- Count.
- `$.data.free_member_number` -- Count.
- `$.data.total_environment_number` -- Count.
- `$.data.total_member_number` -- Count.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getCityAgent

- Client name: `getCityAgent`
- HTTP 200, code `200`, 146126 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].parentCode` -- Business status code; 200 is success.
- `$.data[].code` -- Business status code; 200 is success.
- `$.data[].name` -- Display name.
- `$.data[].count` -- Count.
- `$.data[].flag` -- Row flag value.
- `$.data[].sort` -- Sort order.
- `$.data[].children` -- Nested child rows (department tree).
- `$.data[].children[].id` -- Identifier.
- `$.data[].children[].parentCode` -- Business status code; 200 is success.
- `$.data[].children[].code` -- Business status code; 200 is success.
- `$.data[].children[].name` -- Display name.
- `$.data[].children[].count` -- Count.
- `$.data[].children[].flag` -- Row flag value.
- `$.data[].children[].sort` -- Sort order.
- `$.data[].children[].children` -- Nested child rows (department tree).
- `$.data[].children[].children[].id` -- Identifier.
- `$.data[].children[].children[].parentCode` -- Business status code; 200 is success.
- `$.data[].children[].children[].code` -- Business status code; 200 is success.
- `$.data[].children[].children[].name` -- Display name.
- `$.data[].children[].children[].count` -- Count.
- `$.data[].children[].children[].flag` -- Row flag value.
- `$.data[].children[].children[].sort` -- Sort order.
- `$.data[].children[].children[].children` -- Nested child rows (department tree).
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getcloudcoinsnumb

- Client name: `getcloudcoinsnumb`
- HTTP 200, code `200`, 107 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.balance` -- Account balance.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getcloudsupport

- Client name: `getcloudsupport`
- HTTP 200, code `200`, 126474 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].guojia` -- Country (pinyin key).
- `$.data[].country` -- Count.
- `$.data[].country[].chengshi` -- City (pinyin key).
- `$.data[].country[].city` -- Geolocated city.
- `$.data[].country[].city[].supplier` -- Supplier name or identifier.
- `$.data[].country[].city[].vtype` -- Type discriminator.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getcloudsupportnew

- Client name: `getcloudsupportnew`
- HTTP 200, code `200`, 750150 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].guojia` -- Country (pinyin key).
- `$.data[].country` -- Count.
- `$.data[].country[].chengshi` -- City (pinyin key).
- `$.data[].country[].city` -- Geolocated city.
- `$.data[].country[].city[].supplier` -- Supplier name or identifier.
- `$.data[].country[].city[].vtype` -- Type discriminator.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getcoupon

- Client name: `getcouponlist`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getDynamicAgent

- Client name: `querySupport`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getHotProxyProduct

- Client name: `getHotProxyProduct`
- HTTP 200, code `200`, 407957 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].country_code` -- Business status code; 200 is success.
- `$.data[].country` -- Count.
- `$.data[].sales_count` -- Count.
- `$.data[].cities` -- City list.
- `$.data[].cities[].city_code` -- Business status code; 200 is success.
- `$.data[].cities[].city` -- Geolocated city.
- `$.data[].cities[].sales_count` -- Count.
- `$.data[].cities[].hot` -- Hot flag.
- `$.data[].cities[].products` -- Product list.
- `$.data[].cities[].products[].new_cloud_instances` -- New cloud instances.
- `$.data[].cities[].products[].new_cloud_instances_cidr_blocks` -- CIDR blocks for new cloud instances.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getNewbieDevice

- Client name: `getNewbieDevice`
- HTTP 200, code `200`, 106065 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].new_cloud_instances` -- New cloud instances.
- `$.data[].new_cloud_instances.is_close` -- Closed flag.
- `$.data[].new_cloud_instances.created_at` -- Creation timestamp.
- `$.data[].new_cloud_instances.updated_at` -- Last update timestamp.
- `$.data[].new_cloud_instances.ext_num` -- Count.
- `$.data[].new_cloud_instances.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data[].new_cloud_instances.region_id` -- Identifier.
- `$.data[].new_cloud_instances.country` -- Count.
- `$.data[].new_cloud_instances.city` -- Geolocated city.
- `$.data[].new_cloud_instances.cpu` -- CPU core count preset.
- `$.data[].new_cloud_instances.memory` -- Memory size.
- `$.data[].new_cloud_instances.instance_id` -- Identifier.
- `$.data[].new_cloud_instances.bundle_id` -- Identifier.
- `$.data[].new_cloud_instances.display_area` -- Display area.
- `$.data[].new_cloud_instances.display_region` -- Display region.
- `$.data[].new_cloud_instances.ext_rul` -- Extension URL (API spelling).
- `$.data[].new_cloud_instances.vtype` -- Type discriminator.
- `$.data[].new_cloud_instances.price_json` -- Price JSON.
- `$.data[].new_cloud_instances.packages` -- Package options.
- `$.data[].new_cloud_instances.packages.day` -- Plan day counter.
- `$.data[].new_cloud_instances.packages.price` -- Price.
- `$.data[].new_cloud_instances.packages.price[].month` -- Month value.
- `$.data[].new_cloud_instances.packages.price[].discount` -- Count.
- `$.data[].new_cloud_instances.dynamic_packages` -- Dynamic package options.
- `$.data[].new_cloud_instances.line_price` -- Line price.
- `$.data[].new_cloud_instances.selling_price` -- Selling price.
- `$.data[].new_cloud_instances.origin_price` -- Original price.
- `$.data[].new_cloud_instances.floor_price` -- Floor price.
- `$.data[].new_cloud_instances.proxy_type` -- Type discriminator.
- `$.data[].new_cloud_instances.sell_pool` -- Sell pool.
- `$.data[].new_cloud_instances.is_new` -- New flag.
- `$.data[].new_cloud_instances.is_recommend` -- Recommend flag.
- `$.data[].new_cloud_instances.is_display` -- Display flag.
- `$.data[].new_cloud_instances.is_hot` -- Hot flag.
- `$.data[].new_cloud_instances.is_discount` -- Count.
- `$.data[].new_cloud_instances.remaining` -- Remaining amount.
- `$.data[].new_cloud_instances.ip_type` -- Type discriminator.
- `$.data[].new_cloud_instances.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data[].new_cloud_instances.net_type` -- Type discriminator.
- `$.data[].new_cloud_instances.band_width` -- Bandwidth value.
- `$.data[].new_cloud_instances.asn_type` -- Type discriminator.
- `$.data[].new_cloud_instances.band_width_type` -- Type discriminator.
- `$.data[].new_cloud_instances.cidr_status` -- Status value.
- `$.data[].new_cloud_instances.max_band_width` -- Maximum bandwidth.
- `$.data[].new_cloud_instances.unit` -- Unit.
- `$.data[].new_cloud_instances.duration` -- Duration.
- `$.data[].new_cloud_instances.band_width_cost` -- Bandwidth cost.
- `$.data[].new_cloud_instances.band_width_price` -- Bandwidth price.
- `$.data[].new_cloud_instances.id` -- Identifier.
- `$.data[].new_cloud_instances.area_code` -- Business status code; 200 is success.
- `$.data[].new_cloud_instances.country_code` -- Business status code; 200 is success.
- `$.data[].new_cloud_instances.city_code` -- Business status code; 200 is success.
- `$.data[].new_cloud_instances.detail` -- Log detail text.
- `$.data[].new_cloud_instances.parent_no` -- Parent number.
- `$.data[].new_cloud_instances.name` -- Display name.
- `$.data[].new_cloud_instances.sell_unit` -- Sell unit.
- `$.data[].new_cloud_instances.assign_ip` -- Assigned IP address.
- `$.data[].new_cloud_instances.discount` -- Count.
- `$.data[].new_cloud_instances.recommend_platform` -- Recommended platform.
- `$.data[].new_cloud_instances.un_recommend_platform` -- Un-recommended platform.
- `$.data[].new_cloud_instances.third_recommend_platform` -- Third recommended platform.
- `$.data[].new_cloud_instances.third_un_recommend_platform` -- Third un-recommended platform.
- `$.data[].new_cloud_instances.remark` -- Remark text.
- `$.data[].new_cloud_instances_cidr_blocks` -- CIDR blocks for new cloud instances.
- `$.data[].new_cloud_instances_cidr_blocks[].instance_id` -- Identifier.
- `$.data[].new_cloud_instances_cidr_blocks[].count` -- Count.
- `$.data[].new_cloud_instances_cidr_blocks[].cidr` -- CIDR block.
- `$.data[].new_cloud_instances_cidr_blocks[].asn` -- Autonomous system number (ASN).
- `$.data[].new_cloud_instances_cidr_blocks[].isp` -- ISP name.
- `$.data[].new_cloud_instances_cidr_blocks[].ID` -- Identifier.
- `$.data[].new_cloud_instances_cidr_blocks[].recommend_platform` -- Recommended platform.
- `$.data[].new_cloud_instances_cidr_blocks[].un_recommend_platform` -- Un-recommended platform.
- `$.data[].new_cloud_instances_cidr_blocks[].third_recommend_platform` -- Third recommended platform.
- `$.data[].new_cloud_instances_cidr_blocks[].third_un_recommend_platform` -- Third un-recommended platform.
- `$.data[].new_cloud_instances_cidr_blocks[].remark` -- Remark text.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getOrderDetailNew

- Client name: `getOrderDetailNew`
- HTTP 200, code `200`, 6030 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.created_at` -- Creation timestamp.
- `$.data.updated_at` -- Last update timestamp.
- `$.data.pay_type` -- Type discriminator.
- `$.data.accept_time` -- Timestamp.
- `$.data.pay_time` -- Timestamp.
- `$.data.start_time` -- Start timestamp; client label `开始时间`.
- `$.data.order_type` -- Type discriminator.
- `$.data.info` -- Info block.
- `$.data.info.pay` -- Payment entry.
- `$.data.order_amount` -- Order amount.
- `$.data.free_amount` -- Free amount.
- `$.data.coupons_free_amount` -- Free amount from coupons.
- `$.data.activity_free_amount` -- Free amount from an activity.
- `$.data.balance_amount` -- Balance amount.
- `$.data.final_amount` -- Final plan amount.
- `$.data.online_amount` -- Online amount.
- `$.data.give_amount` -- Gift amount.
- `$.data.refund_amount` -- Refund amount.
- `$.data.pay_status` -- Status value.
- `$.data.order_status` -- Status value.
- `$.data.pay_type_text` -- Payment-type display text.
- `$.data.out_tran_no` -- External transaction number.
- `$.data.bundle_id` -- Identifier.
- `$.data.app_id` -- Identifier.
- `$.data.mch_id` -- Identifier.
- `$.data.seller_id` -- Identifier.
- `$.data.buyer_id` -- Identifier.
- `$.data.pay_status_text` -- Payment-status display text.
- `$.data.dingding_id` -- Identifier.
- `$.data.company_id` -- Identifier.
- `$.data.user_id` -- Identifier.
- `$.data.device_id` -- Identifier.
- `$.data.order_no` -- Order number.
- `$.data.remark` -- Remark text.
- `$.data.order_type_text` -- Order-type display text.
- `$.data.order_status_text` -- Order-status display text.
- `$.data.oid` -- Identifier.
- `$.data.bundle_info` -- Plugin bundle information.
- `$.data.type` -- Type discriminator.
- `$.data.crm_type` -- Type discriminator.
- `$.data.pay_type_extra` -- Extra payment-type information.
- `$.data.refund_details_no` -- Refund detail number.
- `$.data.balance_transfer` -- Balance-transfer flag.
- `$.data.balance_transfer_id` -- Identifier.
- `$.data.device` -- Device telemetry entry.
- `$.data.order_detail` -- Order detail.
- `$.data.order_detail.created_at` -- Creation timestamp.
- `$.data.order_detail.updated_at` -- Last update timestamp.
- `$.data.order_detail.flow` -- Flow/transaction entry.
- `$.data.order_detail.time_num` -- Timestamp.
- `$.data.order_detail.auto_renew` -- Auto-renew flag for the plan.
- `$.data.order_detail.goods_num` -- Count.
- `$.data.order_detail.goods_price` -- Unit price of the ordered goods.
- `$.data.order_detail.is_remote` -- Whether the ordered device is remote/cloud.
- `$.data.order_detail.device_expired_at` -- Timestamp.
- `$.data.order_detail.cloud_accounts_expired` -- Count.
- `$.data.order_detail.v_type` -- Type discriminator.
- `$.data.order_detail.device_home` -- Device home region label.
- `$.data.order_detail.device_names` -- Device display names on the order line.
- `$.data.order_detail.device_id` -- Identifier.
- `$.data.order_detail.cloud_accounts_oid` -- Identifier.
- `$.data.order_detail.cloud_accounts_id` -- Identifier.
- `$.data.order_detail.goods_name` -- Display name.
- `$.data.order_detail.bundle_id` -- Identifier.
- `$.data.order_detail.device_type` -- Type discriminator.
- `$.data.order_detail.region` -- Proxy region selection.
- `$.data.order_detail.bundle_info` -- Plugin bundle information.
- `$.data.order_detail.user_id` -- Identifier.
- `$.data.order_detail.oid` -- Identifier.
- `$.data.order_detail.time_type` -- Timestamp.
- `$.data.order_detail.company_id` -- Identifier.
- `$.data.order_detail.device_ip` -- Device IP address.
- `$.data.order_detail.isp` -- ISP name.
- `$.data.order_detail.dynamic_packages_id` -- Identifier.
- `$.data.order_detail.order_amount` -- Order amount.
- `$.data.order_detail.free_amount` -- Free amount.
- `$.data.order_detail.coupons_free_amount` -- Free amount from coupons.
- `$.data.order_detail.activity_free_amount` -- Free amount from an activity.
- `$.data.order_detail.final_amount` -- Final plan amount.
- `$.data.order_detail.refund_amount` -- Refund amount.
- `$.data.order_detail.coupon_code` -- Business status code; 200 is success.
- `$.data.order_detail.details_status` -- Status value.
- `$.data.order_detail.refund_time` -- Timestamp.
- `$.data.order_detail.details_no` -- Order line number, shaped <order_no>-<n>.
- `$.data.order_detail.group_no` -- Group number.
- `$.data.order_detail.group_name` -- Group display name; client label `分组名称`.
- `$.data.order_detail.ip_type` -- Type discriminator.
- `$.data.order_detail.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.order_detail.net_type` -- Type discriminator.
- `$.data.order_detail.band_width` -- Bandwidth value.
- `$.data.order_detail.cidr_blocks` -- CIDR block list.
- `$.data.order_detail.auto_month` -- Auto-renew duration in months for the order line.
- `$.data.order_detail.device` -- Device telemetry entry.
- `$.data.order_detail.cloud` -- Cloud package block.
- `$.data.order_detail.cloud.is_close` -- Closed flag.
- `$.data.order_detail.cloud.created_at` -- Creation timestamp.
- `$.data.order_detail.cloud.updated_at` -- Last update timestamp.
- `$.data.order_detail.cloud.ext_num` -- Count.
- `$.data.order_detail.cloud.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data.order_detail.cloud.region_id` -- Identifier.
- `$.data.order_detail.cloud.country` -- Count.
- `$.data.order_detail.cloud.city` -- Geolocated city.
- `$.data.order_detail.cloud.cpu` -- CPU core count preset.
- `$.data.order_detail.cloud.memory` -- Memory size.
- `$.data.order_detail.cloud.instance_id` -- Identifier.
- `$.data.order_detail.cloud.bundle_id` -- Identifier.
- `$.data.order_detail.cloud.display_area` -- Display area.
- `$.data.order_detail.cloud.display_region` -- Display region.
- `$.data.order_detail.cloud.ext_rul` -- Extension URL (API spelling).
- `$.data.order_detail.cloud.vtype` -- Type discriminator.
- `$.data.order_detail.cloud.price_json` -- Price JSON.
- `$.data.order_detail.cloud.packages` -- Package options.
- `$.data.order_detail.cloud.dynamic_packages` -- Dynamic package options.
- `$.data.order_detail.cloud.line_price` -- Line price.
- `$.data.order_detail.cloud.selling_price` -- Selling price.
- `$.data.order_detail.cloud.origin_price` -- Original price.
- `$.data.order_detail.cloud.floor_price` -- Floor price.
- `$.data.order_detail.cloud.proxy_type` -- Type discriminator.
- `$.data.order_detail.cloud.sell_pool` -- Sell pool.
- `$.data.order_detail.cloud.is_new` -- New flag.
- `$.data.order_detail.cloud.is_recommend` -- Recommend flag.
- `$.data.order_detail.cloud.is_display` -- Display flag.
- `$.data.order_detail.cloud.is_hot` -- Hot flag.
- `$.data.order_detail.cloud.is_discount` -- Count.
- `$.data.order_detail.cloud.remaining` -- Remaining amount.
- `$.data.order_detail.cloud.ip_type` -- Type discriminator.
- `$.data.order_detail.cloud.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.order_detail.cloud.net_type` -- Type discriminator.
- `$.data.order_detail.cloud.band_width` -- Bandwidth value.
- `$.data.order_detail.cloud.asn_type` -- Type discriminator.
- `$.data.order_detail.cloud.band_width_type` -- Type discriminator.
- `$.data.order_detail.cloud.cidr_status` -- Status value.
- `$.data.order_detail.cloud.max_band_width` -- Maximum bandwidth.
- `$.data.order_detail.cloud.unit` -- Unit.
- `$.data.order_detail.cloud.duration` -- Duration.
- `$.data.order_detail.cloud.band_width_cost` -- Bandwidth cost.
- `$.data.order_detail.cloud.band_width_price` -- Bandwidth price.
- `$.data.order_detail.cloud.id` -- Identifier.
- `$.data.order_detail.cloud.area_code` -- Business status code; 200 is success.
- `$.data.order_detail.cloud.country_code` -- Business status code; 200 is success.
- `$.data.order_detail.cloud.city_code` -- Business status code; 200 is success.
- `$.data.order_detail.cloud.detail` -- Log detail text.
- `$.data.order_detail.cloud.parent_no` -- Parent number.
- `$.data.order_detail.cloud.name` -- Display name.
- `$.data.order_detail.cloud.sell_unit` -- Sell unit.
- `$.data.order_detail.cloud.assign_ip` -- Assigned IP address.
- `$.data.order_detail.cloud.discount` -- Count.
- `$.data.order_detail.cloud.recommend_platform` -- Recommended platform.
- `$.data.order_detail.cloud.un_recommend_platform` -- Un-recommended platform.
- `$.data.order_detail.cloud.third_recommend_platform` -- Third recommended platform.
- `$.data.order_detail.cloud.third_un_recommend_platform` -- Third un-recommended platform.
- `$.data.order_detail.cloud.remark` -- Remark text.
- `$.data.order_detail.cloud_browser_products` -- Cloud-browser products attached to the order line.
- `$.data.order_detail.cloud_browser_products.id` -- Identifier.
- `$.data.order_detail.cloud_browser_products.created_at` -- Creation timestamp.
- `$.data.order_detail.cloud_browser_products.updated_at` -- Last update timestamp.
- `$.data.order_detail.cloud_browser_products.product_id` -- Identifier.
- `$.data.order_detail.cloud_browser_products.product_name` -- Product display name; client label `产品名称`.
- `$.data.order_detail.cloud_browser_products.product_desc` -- Product description.
- `$.data.order_detail.cloud_browser_products.area_code` -- Business status code; 200 is success.
- `$.data.order_detail.cloud_browser_products.country_code` -- Business status code; 200 is success.
- `$.data.order_detail.cloud_browser_products.city_code` -- Business status code; 200 is success.
- `$.data.order_detail.cloud_browser_products.product_no` -- Product number.
- `$.data.order_detail.cloud_browser_products.status` -- Status value.
- `$.data.order_detail.cloud_browser_products.is_display` -- Display flag.
- `$.data.order_detail.cloud_browser_products.headless` -- Headless-mode flag.
- `$.data.order_detail.cloud_browser_products.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data.order_detail.cloud_browser_products.packages` -- Package options.
- `$.data.order_detail.cloud_browser_products.line_price` -- Line price.
- `$.data.order_detail.cloud_browser_products.selling_price` -- Selling price.
- `$.data.order_detail.cloud_browser_products.display_area` -- Display area.
- `$.data.order_detail.cloud_browser_products.display_region` -- Display region.
- `$.data.order_detail.details_status_text` -- Human-readable order-line status.
- `$.data.order_detail_all` -- Full order detail.
- `$.data.order_detail_all[].created_at` -- Creation timestamp.
- `$.data.order_detail_all[].updated_at` -- Last update timestamp.
- `$.data.order_detail_all[].flow` -- Flow/transaction entry.
- `$.data.order_detail_all[].time_num` -- Timestamp.
- `$.data.order_detail_all[].auto_renew` -- Auto-renew flag for the plan.
- `$.data.order_detail_all[].goods_num` -- Count.
- `$.data.order_detail_all[].goods_price` -- Unit price of the ordered goods.
- `$.data.order_detail_all[].is_remote` -- Whether the ordered device is remote/cloud.
- `$.data.order_detail_all[].device_expired_at` -- Timestamp.
- `$.data.order_detail_all[].cloud_accounts_expired` -- Count.
- `$.data.order_detail_all[].v_type` -- Type discriminator.
- `$.data.order_detail_all[].device_home` -- Device home region label.
- `$.data.order_detail_all[].device_names` -- Device display names on the order line.
- `$.data.order_detail_all[].device_id` -- Identifier.
- `$.data.order_detail_all[].cloud_accounts_oid` -- Identifier.
- `$.data.order_detail_all[].cloud_accounts_id` -- Identifier.
- `$.data.order_detail_all[].goods_name` -- Display name.
- `$.data.order_detail_all[].bundle_id` -- Identifier.
- `$.data.order_detail_all[].device_type` -- Type discriminator.
- `$.data.order_detail_all[].region` -- Proxy region selection.
- `$.data.order_detail_all[].bundle_info` -- Plugin bundle information.
- `$.data.order_detail_all[].bundle_info.day` -- Plan day counter.
- `$.data.order_detail_all[].bundle_info.expired` -- Whether the plan/subscription is expired.
- `$.data.order_detail_all[].bundle_info.user_id` -- Identifier.
- `$.data.order_detail_all[].bundle_info.end_time` -- Timestamp.
- `$.data.order_detail_all[].bundle_info.restrict` -- Whether the account is restricted.
- `$.data.order_detail_all[].bundle_info.auto_renew` -- Auto-renew flag for the plan.
- `$.data.order_detail_all[].bundle_info.company_id` -- Identifier.
- `$.data.order_detail_all[].bundle_info.created_at` -- Creation timestamp.
- `$.data.order_detail_all[].bundle_info.start_time` -- Start timestamp; client label `开始时间`.
- `$.data.order_detail_all[].bundle_info.updated_at` -- Last update timestamp.
- `$.data.order_detail_all[].bundle_info.free_status` -- Status value.
- `$.data.order_detail_all[].bundle_info.final_amount` -- Final plan amount.
- `$.data.order_detail_all[].bundle_info.actual_amount` -- Amount actually charged.
- `$.data.order_detail_all[].bundle_info.effective_day` -- Effective plan days.
- `$.data.order_detail_all[].bundle_info.member_number` -- Count.
- `$.data.order_detail_all[].bundle_info.payable_amount` -- Amount payable before discount.
- `$.data.order_detail_all[].bundle_info.residue_amount` -- Remaining balance amount.
- `$.data.order_detail_all[].bundle_info.user_packages_id` -- Identifier.
- `$.data.order_detail_all[].bundle_info.environment_number` -- Count.
- `$.data.order_detail_all[].user_id` -- Identifier.
- `$.data.order_detail_all[].oid` -- Identifier.
- `$.data.order_detail_all[].time_type` -- Timestamp.
- `$.data.order_detail_all[].company_id` -- Identifier.
- `$.data.order_detail_all[].device_ip` -- Device IP address.
- `$.data.order_detail_all[].isp` -- ISP name.
- `$.data.order_detail_all[].dynamic_packages_id` -- Identifier.
- `$.data.order_detail_all[].order_amount` -- Order amount.
- `$.data.order_detail_all[].free_amount` -- Free amount.
- `$.data.order_detail_all[].coupons_free_amount` -- Free amount from coupons.
- `$.data.order_detail_all[].activity_free_amount` -- Free amount from an activity.
- `$.data.order_detail_all[].final_amount` -- Final plan amount.
- `$.data.order_detail_all[].refund_amount` -- Refund amount.
- `$.data.order_detail_all[].coupon_code` -- Business status code; 200 is success.
- `$.data.order_detail_all[].details_status` -- Status value.
- `$.data.order_detail_all[].refund_time` -- Timestamp.
- `$.data.order_detail_all[].details_no` -- Order line number, shaped <order_no>-<n>.
- `$.data.order_detail_all[].group_no` -- Group number.
- `$.data.order_detail_all[].group_name` -- Group display name; client label `分组名称`.
- `$.data.order_detail_all[].ip_type` -- Type discriminator.
- `$.data.order_detail_all[].isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.order_detail_all[].net_type` -- Type discriminator.
- `$.data.order_detail_all[].band_width` -- Bandwidth value.
- `$.data.order_detail_all[].cidr_blocks` -- CIDR block list.
- `$.data.order_detail_all[].auto_month` -- Auto-renew duration in months for the order line.
- `$.data.order_detail_all[].device` -- Device telemetry entry.
- `$.data.order_detail_all[].cloud` -- Cloud package block.
- `$.data.order_detail_all[].cloud.is_close` -- Closed flag.
- `$.data.order_detail_all[].cloud.created_at` -- Creation timestamp.
- `$.data.order_detail_all[].cloud.updated_at` -- Last update timestamp.
- `$.data.order_detail_all[].cloud.ext_num` -- Count.
- `$.data.order_detail_all[].cloud.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data.order_detail_all[].cloud.region_id` -- Identifier.
- `$.data.order_detail_all[].cloud.country` -- Count.
- `$.data.order_detail_all[].cloud.city` -- Geolocated city.
- `$.data.order_detail_all[].cloud.cpu` -- CPU core count preset.
- `$.data.order_detail_all[].cloud.memory` -- Memory size.
- `$.data.order_detail_all[].cloud.instance_id` -- Identifier.
- `$.data.order_detail_all[].cloud.bundle_id` -- Identifier.
- `$.data.order_detail_all[].cloud.display_area` -- Display area.
- `$.data.order_detail_all[].cloud.display_region` -- Display region.
- `$.data.order_detail_all[].cloud.ext_rul` -- Extension URL (API spelling).
- `$.data.order_detail_all[].cloud.vtype` -- Type discriminator.
- `$.data.order_detail_all[].cloud.price_json` -- Price JSON.
- `$.data.order_detail_all[].cloud.packages` -- Package options.
- `$.data.order_detail_all[].cloud.dynamic_packages` -- Dynamic package options.
- `$.data.order_detail_all[].cloud.line_price` -- Line price.
- `$.data.order_detail_all[].cloud.selling_price` -- Selling price.
- `$.data.order_detail_all[].cloud.origin_price` -- Original price.
- `$.data.order_detail_all[].cloud.floor_price` -- Floor price.
- `$.data.order_detail_all[].cloud.proxy_type` -- Type discriminator.
- `$.data.order_detail_all[].cloud.sell_pool` -- Sell pool.
- `$.data.order_detail_all[].cloud.is_new` -- New flag.
- `$.data.order_detail_all[].cloud.is_recommend` -- Recommend flag.
- `$.data.order_detail_all[].cloud.is_display` -- Display flag.
- `$.data.order_detail_all[].cloud.is_hot` -- Hot flag.
- `$.data.order_detail_all[].cloud.is_discount` -- Count.
- `$.data.order_detail_all[].cloud.remaining` -- Remaining amount.
- `$.data.order_detail_all[].cloud.ip_type` -- Type discriminator.
- `$.data.order_detail_all[].cloud.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.order_detail_all[].cloud.net_type` -- Type discriminator.
- `$.data.order_detail_all[].cloud.band_width` -- Bandwidth value.
- `$.data.order_detail_all[].cloud.asn_type` -- Type discriminator.
- `$.data.order_detail_all[].cloud.band_width_type` -- Type discriminator.
- `$.data.order_detail_all[].cloud.cidr_status` -- Status value.
- `$.data.order_detail_all[].cloud.max_band_width` -- Maximum bandwidth.
- `$.data.order_detail_all[].cloud.unit` -- Unit.
- `$.data.order_detail_all[].cloud.duration` -- Duration.
- `$.data.order_detail_all[].cloud.band_width_cost` -- Bandwidth cost.
- `$.data.order_detail_all[].cloud.band_width_price` -- Bandwidth price.
- `$.data.order_detail_all[].cloud.id` -- Identifier.
- `$.data.order_detail_all[].cloud.area_code` -- Business status code; 200 is success.
- `$.data.order_detail_all[].cloud.country_code` -- Business status code; 200 is success.
- `$.data.order_detail_all[].cloud.city_code` -- Business status code; 200 is success.
- `$.data.order_detail_all[].cloud.detail` -- Log detail text.
- `$.data.order_detail_all[].cloud.parent_no` -- Parent number.
- `$.data.order_detail_all[].cloud.name` -- Display name.
- `$.data.order_detail_all[].cloud.sell_unit` -- Sell unit.
- `$.data.order_detail_all[].cloud.assign_ip` -- Assigned IP address.
- `$.data.order_detail_all[].cloud.discount` -- Count.
- `$.data.order_detail_all[].cloud.recommend_platform` -- Recommended platform.
- `$.data.order_detail_all[].cloud.un_recommend_platform` -- Un-recommended platform.
- `$.data.order_detail_all[].cloud.third_recommend_platform` -- Third recommended platform.

## POST /v2/cost/costmanagement/getOrderDetailNewByMultiple

- Client name: `getOrderDetailNewByMultiple`
- HTTP 200, code `200`, 6024 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].created_at` -- Creation timestamp.
- `$.data[].updated_at` -- Last update timestamp.
- `$.data[].pay_type` -- Type discriminator.
- `$.data[].accept_time` -- Timestamp.
- `$.data[].pay_time` -- Timestamp.
- `$.data[].start_time` -- Start timestamp; client label `开始时间`.
- `$.data[].order_type` -- Type discriminator.
- `$.data[].info` -- Info block.
- `$.data[].order_amount` -- Order amount.
- `$.data[].free_amount` -- Free amount.
- `$.data[].coupons_free_amount` -- Free amount from coupons.
- `$.data[].activity_free_amount` -- Free amount from an activity.
- `$.data[].balance_amount` -- Balance amount.
- `$.data[].final_amount` -- Final plan amount.
- `$.data[].online_amount` -- Online amount.
- `$.data[].give_amount` -- Gift amount.
- `$.data[].refund_amount` -- Refund amount.
- `$.data[].pay_status` -- Status value.
- `$.data[].order_status` -- Status value.
- `$.data[].pay_type_text` -- Payment-type display text.
- `$.data[].out_tran_no` -- External transaction number.
- `$.data[].bundle_id` -- Identifier.
- `$.data[].app_id` -- Identifier.
- `$.data[].mch_id` -- Identifier.
- `$.data[].seller_id` -- Identifier.
- `$.data[].buyer_id` -- Identifier.
- `$.data[].pay_status_text` -- Payment-status display text.
- `$.data[].dingding_id` -- Identifier.
- `$.data[].company_id` -- Identifier.
- `$.data[].user_id` -- Identifier.
- `$.data[].device_id` -- Identifier.
- `$.data[].order_no` -- Order number.
- `$.data[].remark` -- Remark text.
- `$.data[].order_type_text` -- Order-type display text.
- `$.data[].order_status_text` -- Order-status display text.
- `$.data[].oid` -- Identifier.
- `$.data[].bundle_info` -- Plugin bundle information.
- `$.data[].type` -- Type discriminator.
- `$.data[].crm_type` -- Type discriminator.
- `$.data[].pay_type_extra` -- Extra payment-type information.
- `$.data[].refund_details_no` -- Refund detail number.
- `$.data[].balance_transfer` -- Balance-transfer flag.
- `$.data[].balance_transfer_id` -- Identifier.
- `$.data[].device` -- Device telemetry entry.
- `$.data[].order_detail` -- Order detail.
- `$.data[].order_detail.created_at` -- Creation timestamp.
- `$.data[].order_detail.updated_at` -- Last update timestamp.
- `$.data[].order_detail.flow` -- Flow/transaction entry.
- `$.data[].order_detail.time_num` -- Timestamp.
- `$.data[].order_detail.auto_renew` -- Auto-renew flag for the plan.
- `$.data[].order_detail.goods_num` -- Count.
- `$.data[].order_detail.goods_price` -- Unit price of the ordered goods.
- `$.data[].order_detail.is_remote` -- Whether the ordered device is remote/cloud.
- `$.data[].order_detail.device_expired_at` -- Timestamp.
- `$.data[].order_detail.cloud_accounts_expired` -- Count.
- `$.data[].order_detail.v_type` -- Type discriminator.
- `$.data[].order_detail.device_home` -- Device home region label.
- `$.data[].order_detail.device_names` -- Device display names on the order line.
- `$.data[].order_detail.device_id` -- Identifier.
- `$.data[].order_detail.cloud_accounts_oid` -- Identifier.
- `$.data[].order_detail.cloud_accounts_id` -- Identifier.
- `$.data[].order_detail.goods_name` -- Display name.
- `$.data[].order_detail.bundle_id` -- Identifier.
- `$.data[].order_detail.device_type` -- Type discriminator.
- `$.data[].order_detail.region` -- Proxy region selection.
- `$.data[].order_detail.bundle_info` -- Plugin bundle information.
- `$.data[].order_detail.user_id` -- Identifier.
- `$.data[].order_detail.oid` -- Identifier.
- `$.data[].order_detail.time_type` -- Timestamp.
- `$.data[].order_detail.company_id` -- Identifier.
- `$.data[].order_detail.device_ip` -- Device IP address.
- `$.data[].order_detail.isp` -- ISP name.
- `$.data[].order_detail.dynamic_packages_id` -- Identifier.
- `$.data[].order_detail.order_amount` -- Order amount.
- `$.data[].order_detail.free_amount` -- Free amount.
- `$.data[].order_detail.coupons_free_amount` -- Free amount from coupons.
- `$.data[].order_detail.activity_free_amount` -- Free amount from an activity.
- `$.data[].order_detail.final_amount` -- Final plan amount.
- `$.data[].order_detail.refund_amount` -- Refund amount.
- `$.data[].order_detail.coupon_code` -- Business status code; 200 is success.
- `$.data[].order_detail.details_status` -- Status value.
- `$.data[].order_detail.refund_time` -- Timestamp.
- `$.data[].order_detail.details_no` -- Order line number, shaped <order_no>-<n>.
- `$.data[].order_detail.group_no` -- Group number.
- `$.data[].order_detail.group_name` -- Group display name; client label `分组名称`.
- `$.data[].order_detail.ip_type` -- Type discriminator.
- `$.data[].order_detail.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data[].order_detail.net_type` -- Type discriminator.
- `$.data[].order_detail.band_width` -- Bandwidth value.
- `$.data[].order_detail.cidr_blocks` -- CIDR block list.
- `$.data[].order_detail.auto_month` -- Auto-renew duration in months for the order line.
- `$.data[].order_detail.device` -- Device telemetry entry.
- `$.data[].order_detail.cloud` -- Cloud package block.
- `$.data[].order_detail.cloud.is_close` -- Closed flag.
- `$.data[].order_detail.cloud.created_at` -- Creation timestamp.
- `$.data[].order_detail.cloud.updated_at` -- Last update timestamp.
- `$.data[].order_detail.cloud.ext_num` -- Count.
- `$.data[].order_detail.cloud.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data[].order_detail.cloud.region_id` -- Identifier.
- `$.data[].order_detail.cloud.country` -- Count.
- `$.data[].order_detail.cloud.city` -- Geolocated city.
- `$.data[].order_detail.cloud.cpu` -- CPU core count preset.
- `$.data[].order_detail.cloud.memory` -- Memory size.
- `$.data[].order_detail.cloud.instance_id` -- Identifier.
- `$.data[].order_detail.cloud.bundle_id` -- Identifier.
- `$.data[].order_detail.cloud.display_area` -- Display area.
- `$.data[].order_detail.cloud.display_region` -- Display region.
- `$.data[].order_detail.cloud.ext_rul` -- Extension URL (API spelling).
- `$.data[].order_detail.cloud.vtype` -- Type discriminator.
- `$.data[].order_detail.cloud.price_json` -- Price JSON.
- `$.data[].order_detail.cloud.packages` -- Package options.
- `$.data[].order_detail.cloud.dynamic_packages` -- Dynamic package options.
- `$.data[].order_detail.cloud.line_price` -- Line price.
- `$.data[].order_detail.cloud.selling_price` -- Selling price.
- `$.data[].order_detail.cloud.origin_price` -- Original price.
- `$.data[].order_detail.cloud.floor_price` -- Floor price.
- `$.data[].order_detail.cloud.proxy_type` -- Type discriminator.
- `$.data[].order_detail.cloud.sell_pool` -- Sell pool.
- `$.data[].order_detail.cloud.is_new` -- New flag.
- `$.data[].order_detail.cloud.is_recommend` -- Recommend flag.
- `$.data[].order_detail.cloud.is_display` -- Display flag.
- `$.data[].order_detail.cloud.is_hot` -- Hot flag.
- `$.data[].order_detail.cloud.is_discount` -- Count.
- `$.data[].order_detail.cloud.remaining` -- Remaining amount.
- `$.data[].order_detail.cloud.ip_type` -- Type discriminator.
- `$.data[].order_detail.cloud.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data[].order_detail.cloud.net_type` -- Type discriminator.
- `$.data[].order_detail.cloud.band_width` -- Bandwidth value.
- `$.data[].order_detail.cloud.asn_type` -- Type discriminator.
- `$.data[].order_detail.cloud.band_width_type` -- Type discriminator.
- `$.data[].order_detail.cloud.cidr_status` -- Status value.
- `$.data[].order_detail.cloud.max_band_width` -- Maximum bandwidth.
- `$.data[].order_detail.cloud.unit` -- Unit.
- `$.data[].order_detail.cloud.duration` -- Duration.
- `$.data[].order_detail.cloud.band_width_cost` -- Bandwidth cost.
- `$.data[].order_detail.cloud.band_width_price` -- Bandwidth price.
- `$.data[].order_detail.cloud.id` -- Identifier.
- `$.data[].order_detail.cloud.area_code` -- Business status code; 200 is success.
- `$.data[].order_detail.cloud.country_code` -- Business status code; 200 is success.
- `$.data[].order_detail.cloud.city_code` -- Business status code; 200 is success.
- `$.data[].order_detail.cloud.detail` -- Log detail text.
- `$.data[].order_detail.cloud.parent_no` -- Parent number.
- `$.data[].order_detail.cloud.name` -- Display name.
- `$.data[].order_detail.cloud.sell_unit` -- Sell unit.
- `$.data[].order_detail.cloud.assign_ip` -- Assigned IP address.
- `$.data[].order_detail.cloud.discount` -- Count.
- `$.data[].order_detail.cloud.recommend_platform` -- Recommended platform.
- `$.data[].order_detail.cloud.un_recommend_platform` -- Un-recommended platform.
- `$.data[].order_detail.cloud.third_recommend_platform` -- Third recommended platform.
- `$.data[].order_detail.cloud.third_un_recommend_platform` -- Third un-recommended platform.
- `$.data[].order_detail.cloud.remark` -- Remark text.
- `$.data[].order_detail.cloud_browser_products` -- Cloud-browser products attached to the order line.
- `$.data[].order_detail.cloud_browser_products.id` -- Identifier.
- `$.data[].order_detail.cloud_browser_products.created_at` -- Creation timestamp.
- `$.data[].order_detail.cloud_browser_products.updated_at` -- Last update timestamp.
- `$.data[].order_detail.cloud_browser_products.product_id` -- Identifier.
- `$.data[].order_detail.cloud_browser_products.product_name` -- Product display name; client label `产品名称`.
- `$.data[].order_detail.cloud_browser_products.product_desc` -- Product description.
- `$.data[].order_detail.cloud_browser_products.area_code` -- Business status code; 200 is success.
- `$.data[].order_detail.cloud_browser_products.country_code` -- Business status code; 200 is success.
- `$.data[].order_detail.cloud_browser_products.city_code` -- Business status code; 200 is success.
- `$.data[].order_detail.cloud_browser_products.product_no` -- Product number.
- `$.data[].order_detail.cloud_browser_products.status` -- Status value.
- `$.data[].order_detail.cloud_browser_products.is_display` -- Display flag.
- `$.data[].order_detail.cloud_browser_products.headless` -- Headless-mode flag.
- `$.data[].order_detail.cloud_browser_products.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data[].order_detail.cloud_browser_products.packages` -- Package options.
- `$.data[].order_detail.cloud_browser_products.line_price` -- Line price.
- `$.data[].order_detail.cloud_browser_products.selling_price` -- Selling price.
- `$.data[].order_detail.cloud_browser_products.display_area` -- Display area.
- `$.data[].order_detail.cloud_browser_products.display_region` -- Display region.
- `$.data[].order_detail.details_status_text` -- Human-readable order-line status.
- `$.data[].order_detail_all` -- Full order detail.
- `$.data[].order_detail_all[].created_at` -- Creation timestamp.
- `$.data[].order_detail_all[].updated_at` -- Last update timestamp.
- `$.data[].order_detail_all[].flow` -- Flow/transaction entry.
- `$.data[].order_detail_all[].time_num` -- Timestamp.
- `$.data[].order_detail_all[].auto_renew` -- Auto-renew flag for the plan.
- `$.data[].order_detail_all[].goods_num` -- Count.
- `$.data[].order_detail_all[].goods_price` -- Unit price of the ordered goods.
- `$.data[].order_detail_all[].is_remote` -- Whether the ordered device is remote/cloud.
- `$.data[].order_detail_all[].device_expired_at` -- Timestamp.
- `$.data[].order_detail_all[].cloud_accounts_expired` -- Count.
- `$.data[].order_detail_all[].v_type` -- Type discriminator.
- `$.data[].order_detail_all[].device_home` -- Device home region label.
- `$.data[].order_detail_all[].device_names` -- Device display names on the order line.
- `$.data[].order_detail_all[].device_id` -- Identifier.
- `$.data[].order_detail_all[].cloud_accounts_oid` -- Identifier.
- `$.data[].order_detail_all[].cloud_accounts_id` -- Identifier.
- `$.data[].order_detail_all[].goods_name` -- Display name.
- `$.data[].order_detail_all[].bundle_id` -- Identifier.
- `$.data[].order_detail_all[].device_type` -- Type discriminator.
- `$.data[].order_detail_all[].region` -- Proxy region selection.
- `$.data[].order_detail_all[].bundle_info` -- Plugin bundle information.
- `$.data[].order_detail_all[].bundle_info.day` -- Plan day counter.
- `$.data[].order_detail_all[].bundle_info.expired` -- Whether the plan/subscription is expired.
- `$.data[].order_detail_all[].bundle_info.user_id` -- Identifier.
- `$.data[].order_detail_all[].bundle_info.end_time` -- Timestamp.
- `$.data[].order_detail_all[].bundle_info.restrict` -- Whether the account is restricted.
- `$.data[].order_detail_all[].bundle_info.auto_renew` -- Auto-renew flag for the plan.
- `$.data[].order_detail_all[].bundle_info.company_id` -- Identifier.
- `$.data[].order_detail_all[].bundle_info.created_at` -- Creation timestamp.
- `$.data[].order_detail_all[].bundle_info.start_time` -- Start timestamp; client label `开始时间`.
- `$.data[].order_detail_all[].bundle_info.updated_at` -- Last update timestamp.
- `$.data[].order_detail_all[].bundle_info.free_status` -- Status value.
- `$.data[].order_detail_all[].bundle_info.final_amount` -- Final plan amount.
- `$.data[].order_detail_all[].bundle_info.actual_amount` -- Amount actually charged.
- `$.data[].order_detail_all[].bundle_info.effective_day` -- Effective plan days.
- `$.data[].order_detail_all[].bundle_info.member_number` -- Count.
- `$.data[].order_detail_all[].bundle_info.payable_amount` -- Amount payable before discount.
- `$.data[].order_detail_all[].bundle_info.residue_amount` -- Remaining balance amount.
- `$.data[].order_detail_all[].bundle_info.user_packages_id` -- Identifier.
- `$.data[].order_detail_all[].bundle_info.environment_number` -- Count.
- `$.data[].order_detail_all[].user_id` -- Identifier.
- `$.data[].order_detail_all[].oid` -- Identifier.
- `$.data[].order_detail_all[].time_type` -- Timestamp.
- `$.data[].order_detail_all[].company_id` -- Identifier.
- `$.data[].order_detail_all[].device_ip` -- Device IP address.
- `$.data[].order_detail_all[].isp` -- ISP name.
- `$.data[].order_detail_all[].dynamic_packages_id` -- Identifier.
- `$.data[].order_detail_all[].order_amount` -- Order amount.
- `$.data[].order_detail_all[].free_amount` -- Free amount.
- `$.data[].order_detail_all[].coupons_free_amount` -- Free amount from coupons.
- `$.data[].order_detail_all[].activity_free_amount` -- Free amount from an activity.
- `$.data[].order_detail_all[].final_amount` -- Final plan amount.
- `$.data[].order_detail_all[].refund_amount` -- Refund amount.
- `$.data[].order_detail_all[].coupon_code` -- Business status code; 200 is success.
- `$.data[].order_detail_all[].details_status` -- Status value.
- `$.data[].order_detail_all[].refund_time` -- Timestamp.
- `$.data[].order_detail_all[].details_no` -- Order line number, shaped <order_no>-<n>.
- `$.data[].order_detail_all[].group_no` -- Group number.
- `$.data[].order_detail_all[].group_name` -- Group display name; client label `分组名称`.
- `$.data[].order_detail_all[].ip_type` -- Type discriminator.
- `$.data[].order_detail_all[].isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data[].order_detail_all[].net_type` -- Type discriminator.
- `$.data[].order_detail_all[].band_width` -- Bandwidth value.
- `$.data[].order_detail_all[].cidr_blocks` -- CIDR block list.
- `$.data[].order_detail_all[].auto_month` -- Auto-renew duration in months for the order line.
- `$.data[].order_detail_all[].device` -- Device telemetry entry.
- `$.data[].order_detail_all[].cloud` -- Cloud package block.
- `$.data[].order_detail_all[].cloud.is_close` -- Closed flag.
- `$.data[].order_detail_all[].cloud.created_at` -- Creation timestamp.
- `$.data[].order_detail_all[].cloud.updated_at` -- Last update timestamp.
- `$.data[].order_detail_all[].cloud.ext_num` -- Count.
- `$.data[].order_detail_all[].cloud.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data[].order_detail_all[].cloud.region_id` -- Identifier.
- `$.data[].order_detail_all[].cloud.country` -- Count.
- `$.data[].order_detail_all[].cloud.city` -- Geolocated city.
- `$.data[].order_detail_all[].cloud.cpu` -- CPU core count preset.
- `$.data[].order_detail_all[].cloud.memory` -- Memory size.
- `$.data[].order_detail_all[].cloud.instance_id` -- Identifier.
- `$.data[].order_detail_all[].cloud.bundle_id` -- Identifier.
- `$.data[].order_detail_all[].cloud.display_area` -- Display area.
- `$.data[].order_detail_all[].cloud.display_region` -- Display region.
- `$.data[].order_detail_all[].cloud.ext_rul` -- Extension URL (API spelling).
- `$.data[].order_detail_all[].cloud.vtype` -- Type discriminator.
- `$.data[].order_detail_all[].cloud.price_json` -- Price JSON.
- `$.data[].order_detail_all[].cloud.packages` -- Package options.
- `$.data[].order_detail_all[].cloud.dynamic_packages` -- Dynamic package options.
- `$.data[].order_detail_all[].cloud.line_price` -- Line price.
- `$.data[].order_detail_all[].cloud.selling_price` -- Selling price.
- `$.data[].order_detail_all[].cloud.origin_price` -- Original price.
- `$.data[].order_detail_all[].cloud.floor_price` -- Floor price.
- `$.data[].order_detail_all[].cloud.proxy_type` -- Type discriminator.
- `$.data[].order_detail_all[].cloud.sell_pool` -- Sell pool.
- `$.data[].order_detail_all[].cloud.is_new` -- New flag.
- `$.data[].order_detail_all[].cloud.is_recommend` -- Recommend flag.
- `$.data[].order_detail_all[].cloud.is_display` -- Display flag.
- `$.data[].order_detail_all[].cloud.is_hot` -- Hot flag.
- `$.data[].order_detail_all[].cloud.is_discount` -- Count.
- `$.data[].order_detail_all[].cloud.remaining` -- Remaining amount.
- `$.data[].order_detail_all[].cloud.ip_type` -- Type discriminator.
- `$.data[].order_detail_all[].cloud.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data[].order_detail_all[].cloud.net_type` -- Type discriminator.
- `$.data[].order_detail_all[].cloud.band_width` -- Bandwidth value.
- `$.data[].order_detail_all[].cloud.asn_type` -- Type discriminator.
- `$.data[].order_detail_all[].cloud.band_width_type` -- Type discriminator.
- `$.data[].order_detail_all[].cloud.cidr_status` -- Status value.
- `$.data[].order_detail_all[].cloud.max_band_width` -- Maximum bandwidth.
- `$.data[].order_detail_all[].cloud.unit` -- Unit.
- `$.data[].order_detail_all[].cloud.duration` -- Duration.
- `$.data[].order_detail_all[].cloud.band_width_cost` -- Bandwidth cost.
- `$.data[].order_detail_all[].cloud.band_width_price` -- Bandwidth price.
- `$.data[].order_detail_all[].cloud.id` -- Identifier.
- `$.data[].order_detail_all[].cloud.area_code` -- Business status code; 200 is success.
- `$.data[].order_detail_all[].cloud.country_code` -- Business status code; 200 is success.
- `$.data[].order_detail_all[].cloud.city_code` -- Business status code; 200 is success.
- `$.data[].order_detail_all[].cloud.detail` -- Log detail text.
- `$.data[].order_detail_all[].cloud.parent_no` -- Parent number.
- `$.data[].order_detail_all[].cloud.name` -- Display name.
- `$.data[].order_detail_all[].cloud.sell_unit` -- Sell unit.
- `$.data[].order_detail_all[].cloud.assign_ip` -- Assigned IP address.
- `$.data[].order_detail_all[].cloud.discount` -- Count.
- `$.data[].order_detail_all[].cloud.recommend_platform` -- Recommended platform.
- `$.data[].order_detail_all[].cloud.un_recommend_platform` -- Un-recommended platform.
- `$.data[].order_detail_all[].cloud.third_recommend_platform` -- Third recommended platform.
- `$.data[].order_detail_all[].cloud.third_un_recommend_platform` -- Third un-recommended platform.

## POST /v2/cost/costmanagement/getOrderDetailStatus

- Client name: `getOrderDetailStatus`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getorderinfo

- Client name: `getorderinfo`
- HTTP 200, code `200`, 513 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.order_status` -- Status value.
- `$.data.order_status.0` -- Array-indexed entry.
- `$.data.order_status.2` -- Array-indexed entry.
- `$.data.order_status.3` -- Array-indexed entry.
- `$.data.order_status.4` -- Array-indexed entry.
- `$.data.order_status.5` -- Array-indexed entry.
- `$.data.order_status.6` -- Array-indexed entry.
- `$.data.order_status.7` -- Array-indexed entry.
- `$.data.order_status.8` -- Array-indexed entry.
- `$.data.order_status.-1` -- Array-indexed entry.
- `$.data.order_type` -- Type discriminator.
- `$.data.order_type.0` -- Array-indexed entry.
- `$.data.order_type.1` -- Array-indexed entry.
- `$.data.order_type.2` -- Array-indexed entry.
- `$.data.order_type.3` -- Array-indexed entry.
- `$.data.order_type.4` -- Array-indexed entry.
- `$.data.order_type.5` -- Array-indexed entry.
- `$.data.order_type.6` -- Array-indexed entry.
- `$.data.order_type.7` -- Array-indexed entry.
- `$.data.order_type.8` -- Array-indexed entry.
- `$.data.pay_type` -- Type discriminator.
- `$.data.pay_type.1` -- Array-indexed entry.
- `$.data.pay_type.2` -- Array-indexed entry.
- `$.data.pay_type.3` -- Array-indexed entry.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getOrderManagementNew

- Client name: `getorderlist`
- HTTP 200, code `200`, 6073 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.data[].created_at` -- Creation timestamp.
- `$.data.data[].updated_at` -- Last update timestamp.
- `$.data.data[].pay_type` -- Type discriminator.
- `$.data.data[].accept_time` -- Timestamp.
- `$.data.data[].pay_time` -- Timestamp.
- `$.data.data[].start_time` -- Start timestamp; client label `开始时间`.
- `$.data.data[].order_type` -- Type discriminator.
- `$.data.data[].info` -- Info block.
- `$.data.data[].order_amount` -- Order amount.
- `$.data.data[].free_amount` -- Free amount.
- `$.data.data[].coupons_free_amount` -- Free amount from coupons.
- `$.data.data[].activity_free_amount` -- Free amount from an activity.
- `$.data.data[].balance_amount` -- Balance amount.
- `$.data.data[].final_amount` -- Final plan amount.
- `$.data.data[].online_amount` -- Online amount.
- `$.data.data[].give_amount` -- Gift amount.
- `$.data.data[].refund_amount` -- Refund amount.
- `$.data.data[].pay_status` -- Status value.
- `$.data.data[].order_status` -- Status value.
- `$.data.data[].pay_type_text` -- Payment-type display text.
- `$.data.data[].out_tran_no` -- External transaction number.
- `$.data.data[].bundle_id` -- Identifier.
- `$.data.data[].app_id` -- Identifier.
- `$.data.data[].mch_id` -- Identifier.
- `$.data.data[].seller_id` -- Identifier.
- `$.data.data[].buyer_id` -- Identifier.
- `$.data.data[].pay_status_text` -- Payment-status display text.
- `$.data.data[].dingding_id` -- Identifier.
- `$.data.data[].company_id` -- Identifier.
- `$.data.data[].user_id` -- Identifier.
- `$.data.data[].device_id` -- Identifier.
- `$.data.data[].order_no` -- Order number.
- `$.data.data[].remark` -- Remark text.
- `$.data.data[].order_type_text` -- Order-type display text.
- `$.data.data[].order_status_text` -- Order-status display text.
- `$.data.data[].oid` -- Identifier.
- `$.data.data[].bundle_info` -- Plugin bundle information.
- `$.data.data[].type` -- Type discriminator.
- `$.data.data[].crm_type` -- Type discriminator.
- `$.data.data[].pay_type_extra` -- Extra payment-type information.
- `$.data.data[].refund_details_no` -- Refund detail number.
- `$.data.data[].balance_transfer` -- Balance-transfer flag.
- `$.data.data[].balance_transfer_id` -- Identifier.
- `$.data.data[].device` -- Device telemetry entry.
- `$.data.data[].order_detail` -- Order detail.
- `$.data.data[].order_detail.created_at` -- Creation timestamp.
- `$.data.data[].order_detail.updated_at` -- Last update timestamp.
- `$.data.data[].order_detail.flow` -- Flow/transaction entry.
- `$.data.data[].order_detail.time_num` -- Timestamp.
- `$.data.data[].order_detail.auto_renew` -- Auto-renew flag for the plan.
- `$.data.data[].order_detail.goods_num` -- Count.
- `$.data.data[].order_detail.goods_price` -- Unit price of the ordered goods.
- `$.data.data[].order_detail.is_remote` -- Whether the ordered device is remote/cloud.
- `$.data.data[].order_detail.device_expired_at` -- Timestamp.
- `$.data.data[].order_detail.cloud_accounts_expired` -- Count.
- `$.data.data[].order_detail.v_type` -- Type discriminator.
- `$.data.data[].order_detail.device_home` -- Device home region label.
- `$.data.data[].order_detail.device_names` -- Device display names on the order line.
- `$.data.data[].order_detail.device_id` -- Identifier.
- `$.data.data[].order_detail.cloud_accounts_oid` -- Identifier.
- `$.data.data[].order_detail.cloud_accounts_id` -- Identifier.
- `$.data.data[].order_detail.goods_name` -- Display name.
- `$.data.data[].order_detail.bundle_id` -- Identifier.
- `$.data.data[].order_detail.device_type` -- Type discriminator.
- `$.data.data[].order_detail.region` -- Proxy region selection.
- `$.data.data[].order_detail.bundle_info` -- Plugin bundle information.
- `$.data.data[].order_detail.user_id` -- Identifier.
- `$.data.data[].order_detail.oid` -- Identifier.
- `$.data.data[].order_detail.time_type` -- Timestamp.
- `$.data.data[].order_detail.company_id` -- Identifier.
- `$.data.data[].order_detail.device_ip` -- Device IP address.
- `$.data.data[].order_detail.isp` -- ISP name.
- `$.data.data[].order_detail.dynamic_packages_id` -- Identifier.
- `$.data.data[].order_detail.order_amount` -- Order amount.
- `$.data.data[].order_detail.free_amount` -- Free amount.
- `$.data.data[].order_detail.coupons_free_amount` -- Free amount from coupons.
- `$.data.data[].order_detail.activity_free_amount` -- Free amount from an activity.
- `$.data.data[].order_detail.final_amount` -- Final plan amount.
- `$.data.data[].order_detail.refund_amount` -- Refund amount.
- `$.data.data[].order_detail.coupon_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail.details_status` -- Status value.
- `$.data.data[].order_detail.refund_time` -- Timestamp.
- `$.data.data[].order_detail.details_no` -- Order line number, shaped <order_no>-<n>.
- `$.data.data[].order_detail.group_no` -- Group number.
- `$.data.data[].order_detail.group_name` -- Group display name; client label `分组名称`.
- `$.data.data[].order_detail.ip_type` -- Type discriminator.
- `$.data.data[].order_detail.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.data[].order_detail.net_type` -- Type discriminator.
- `$.data.data[].order_detail.band_width` -- Bandwidth value.
- `$.data.data[].order_detail.cidr_blocks` -- CIDR block list.
- `$.data.data[].order_detail.auto_month` -- Auto-renew duration in months for the order line.
- `$.data.data[].order_detail.device` -- Device telemetry entry.
- `$.data.data[].order_detail.cloud` -- Cloud package block.
- `$.data.data[].order_detail.cloud.is_close` -- Closed flag.
- `$.data.data[].order_detail.cloud.created_at` -- Creation timestamp.
- `$.data.data[].order_detail.cloud.updated_at` -- Last update timestamp.
- `$.data.data[].order_detail.cloud.ext_num` -- Count.
- `$.data.data[].order_detail.cloud.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data.data[].order_detail.cloud.region_id` -- Identifier.
- `$.data.data[].order_detail.cloud.country` -- Count.
- `$.data.data[].order_detail.cloud.city` -- Geolocated city.
- `$.data.data[].order_detail.cloud.cpu` -- CPU core count preset.
- `$.data.data[].order_detail.cloud.memory` -- Memory size.
- `$.data.data[].order_detail.cloud.instance_id` -- Identifier.
- `$.data.data[].order_detail.cloud.bundle_id` -- Identifier.
- `$.data.data[].order_detail.cloud.display_area` -- Display area.
- `$.data.data[].order_detail.cloud.display_region` -- Display region.
- `$.data.data[].order_detail.cloud.ext_rul` -- Extension URL (API spelling).
- `$.data.data[].order_detail.cloud.vtype` -- Type discriminator.
- `$.data.data[].order_detail.cloud.price_json` -- Price JSON.
- `$.data.data[].order_detail.cloud.packages` -- Package options.
- `$.data.data[].order_detail.cloud.dynamic_packages` -- Dynamic package options.
- `$.data.data[].order_detail.cloud.line_price` -- Line price.
- `$.data.data[].order_detail.cloud.selling_price` -- Selling price.
- `$.data.data[].order_detail.cloud.origin_price` -- Original price.
- `$.data.data[].order_detail.cloud.floor_price` -- Floor price.
- `$.data.data[].order_detail.cloud.proxy_type` -- Type discriminator.
- `$.data.data[].order_detail.cloud.sell_pool` -- Sell pool.
- `$.data.data[].order_detail.cloud.is_new` -- New flag.
- `$.data.data[].order_detail.cloud.is_recommend` -- Recommend flag.
- `$.data.data[].order_detail.cloud.is_display` -- Display flag.
- `$.data.data[].order_detail.cloud.is_hot` -- Hot flag.
- `$.data.data[].order_detail.cloud.is_discount` -- Count.
- `$.data.data[].order_detail.cloud.remaining` -- Remaining amount.
- `$.data.data[].order_detail.cloud.ip_type` -- Type discriminator.
- `$.data.data[].order_detail.cloud.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.data[].order_detail.cloud.net_type` -- Type discriminator.
- `$.data.data[].order_detail.cloud.band_width` -- Bandwidth value.
- `$.data.data[].order_detail.cloud.asn_type` -- Type discriminator.
- `$.data.data[].order_detail.cloud.band_width_type` -- Type discriminator.
- `$.data.data[].order_detail.cloud.cidr_status` -- Status value.
- `$.data.data[].order_detail.cloud.max_band_width` -- Maximum bandwidth.
- `$.data.data[].order_detail.cloud.unit` -- Unit.
- `$.data.data[].order_detail.cloud.duration` -- Duration.
- `$.data.data[].order_detail.cloud.band_width_cost` -- Bandwidth cost.
- `$.data.data[].order_detail.cloud.band_width_price` -- Bandwidth price.
- `$.data.data[].order_detail.cloud.id` -- Identifier.
- `$.data.data[].order_detail.cloud.area_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail.cloud.country_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail.cloud.city_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail.cloud.detail` -- Log detail text.
- `$.data.data[].order_detail.cloud.parent_no` -- Parent number.
- `$.data.data[].order_detail.cloud.name` -- Display name.
- `$.data.data[].order_detail.cloud.sell_unit` -- Sell unit.
- `$.data.data[].order_detail.cloud.assign_ip` -- Assigned IP address.
- `$.data.data[].order_detail.cloud.discount` -- Count.
- `$.data.data[].order_detail.cloud.recommend_platform` -- Recommended platform.
- `$.data.data[].order_detail.cloud.un_recommend_platform` -- Un-recommended platform.
- `$.data.data[].order_detail.cloud.third_recommend_platform` -- Third recommended platform.
- `$.data.data[].order_detail.cloud.third_un_recommend_platform` -- Third un-recommended platform.
- `$.data.data[].order_detail.cloud.remark` -- Remark text.
- `$.data.data[].order_detail.cloud_browser_products` -- Cloud-browser products attached to the order line.
- `$.data.data[].order_detail.cloud_browser_products.id` -- Identifier.
- `$.data.data[].order_detail.cloud_browser_products.created_at` -- Creation timestamp.
- `$.data.data[].order_detail.cloud_browser_products.updated_at` -- Last update timestamp.
- `$.data.data[].order_detail.cloud_browser_products.product_id` -- Identifier.
- `$.data.data[].order_detail.cloud_browser_products.product_name` -- Product display name; client label `产品名称`.
- `$.data.data[].order_detail.cloud_browser_products.product_desc` -- Product description.
- `$.data.data[].order_detail.cloud_browser_products.area_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail.cloud_browser_products.country_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail.cloud_browser_products.city_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail.cloud_browser_products.product_no` -- Product number.
- `$.data.data[].order_detail.cloud_browser_products.status` -- Status value.
- `$.data.data[].order_detail.cloud_browser_products.is_display` -- Display flag.
- `$.data.data[].order_detail.cloud_browser_products.headless` -- Headless-mode flag.
- `$.data.data[].order_detail.cloud_browser_products.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data.data[].order_detail.cloud_browser_products.packages` -- Package options.
- `$.data.data[].order_detail.cloud_browser_products.line_price` -- Line price.
- `$.data.data[].order_detail.cloud_browser_products.selling_price` -- Selling price.
- `$.data.data[].order_detail.cloud_browser_products.display_area` -- Display area.
- `$.data.data[].order_detail.cloud_browser_products.display_region` -- Display region.
- `$.data.data[].order_detail.details_status_text` -- Human-readable order-line status.
- `$.data.data[].order_detail_all` -- Full order detail.
- `$.data.data[].order_detail_all[].created_at` -- Creation timestamp.
- `$.data.data[].order_detail_all[].updated_at` -- Last update timestamp.
- `$.data.data[].order_detail_all[].flow` -- Flow/transaction entry.
- `$.data.data[].order_detail_all[].time_num` -- Timestamp.
- `$.data.data[].order_detail_all[].auto_renew` -- Auto-renew flag for the plan.
- `$.data.data[].order_detail_all[].goods_num` -- Count.
- `$.data.data[].order_detail_all[].goods_price` -- Unit price of the ordered goods.
- `$.data.data[].order_detail_all[].is_remote` -- Whether the ordered device is remote/cloud.
- `$.data.data[].order_detail_all[].device_expired_at` -- Timestamp.
- `$.data.data[].order_detail_all[].cloud_accounts_expired` -- Count.
- `$.data.data[].order_detail_all[].v_type` -- Type discriminator.
- `$.data.data[].order_detail_all[].device_home` -- Device home region label.
- `$.data.data[].order_detail_all[].device_names` -- Device display names on the order line.
- `$.data.data[].order_detail_all[].device_id` -- Identifier.
- `$.data.data[].order_detail_all[].cloud_accounts_oid` -- Identifier.
- `$.data.data[].order_detail_all[].cloud_accounts_id` -- Identifier.
- `$.data.data[].order_detail_all[].goods_name` -- Display name.
- `$.data.data[].order_detail_all[].bundle_id` -- Identifier.
- `$.data.data[].order_detail_all[].device_type` -- Type discriminator.
- `$.data.data[].order_detail_all[].region` -- Proxy region selection.
- `$.data.data[].order_detail_all[].bundle_info` -- Plugin bundle information.
- `$.data.data[].order_detail_all[].bundle_info.day` -- Plan day counter.
- `$.data.data[].order_detail_all[].bundle_info.expired` -- Whether the plan/subscription is expired.
- `$.data.data[].order_detail_all[].bundle_info.user_id` -- Identifier.
- `$.data.data[].order_detail_all[].bundle_info.end_time` -- Timestamp.
- `$.data.data[].order_detail_all[].bundle_info.restrict` -- Whether the account is restricted.
- `$.data.data[].order_detail_all[].bundle_info.auto_renew` -- Auto-renew flag for the plan.
- `$.data.data[].order_detail_all[].bundle_info.company_id` -- Identifier.
- `$.data.data[].order_detail_all[].bundle_info.created_at` -- Creation timestamp.
- `$.data.data[].order_detail_all[].bundle_info.start_time` -- Start timestamp; client label `开始时间`.
- `$.data.data[].order_detail_all[].bundle_info.updated_at` -- Last update timestamp.
- `$.data.data[].order_detail_all[].bundle_info.free_status` -- Status value.
- `$.data.data[].order_detail_all[].bundle_info.final_amount` -- Final plan amount.
- `$.data.data[].order_detail_all[].bundle_info.actual_amount` -- Amount actually charged.
- `$.data.data[].order_detail_all[].bundle_info.effective_day` -- Effective plan days.
- `$.data.data[].order_detail_all[].bundle_info.member_number` -- Count.
- `$.data.data[].order_detail_all[].bundle_info.payable_amount` -- Amount payable before discount.
- `$.data.data[].order_detail_all[].bundle_info.residue_amount` -- Remaining balance amount.
- `$.data.data[].order_detail_all[].bundle_info.user_packages_id` -- Identifier.
- `$.data.data[].order_detail_all[].bundle_info.environment_number` -- Count.
- `$.data.data[].order_detail_all[].user_id` -- Identifier.
- `$.data.data[].order_detail_all[].oid` -- Identifier.
- `$.data.data[].order_detail_all[].time_type` -- Timestamp.
- `$.data.data[].order_detail_all[].company_id` -- Identifier.
- `$.data.data[].order_detail_all[].device_ip` -- Device IP address.
- `$.data.data[].order_detail_all[].isp` -- ISP name.
- `$.data.data[].order_detail_all[].dynamic_packages_id` -- Identifier.
- `$.data.data[].order_detail_all[].order_amount` -- Order amount.
- `$.data.data[].order_detail_all[].free_amount` -- Free amount.
- `$.data.data[].order_detail_all[].coupons_free_amount` -- Free amount from coupons.
- `$.data.data[].order_detail_all[].activity_free_amount` -- Free amount from an activity.
- `$.data.data[].order_detail_all[].final_amount` -- Final plan amount.
- `$.data.data[].order_detail_all[].refund_amount` -- Refund amount.
- `$.data.data[].order_detail_all[].coupon_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail_all[].details_status` -- Status value.
- `$.data.data[].order_detail_all[].refund_time` -- Timestamp.
- `$.data.data[].order_detail_all[].details_no` -- Order line number, shaped <order_no>-<n>.
- `$.data.data[].order_detail_all[].group_no` -- Group number.
- `$.data.data[].order_detail_all[].group_name` -- Group display name; client label `分组名称`.
- `$.data.data[].order_detail_all[].ip_type` -- Type discriminator.
- `$.data.data[].order_detail_all[].isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.data[].order_detail_all[].net_type` -- Type discriminator.
- `$.data.data[].order_detail_all[].band_width` -- Bandwidth value.
- `$.data.data[].order_detail_all[].cidr_blocks` -- CIDR block list.
- `$.data.data[].order_detail_all[].auto_month` -- Auto-renew duration in months for the order line.
- `$.data.data[].order_detail_all[].device` -- Device telemetry entry.
- `$.data.data[].order_detail_all[].cloud` -- Cloud package block.
- `$.data.data[].order_detail_all[].cloud.is_close` -- Closed flag.
- `$.data.data[].order_detail_all[].cloud.created_at` -- Creation timestamp.
- `$.data.data[].order_detail_all[].cloud.updated_at` -- Last update timestamp.
- `$.data.data[].order_detail_all[].cloud.ext_num` -- Count.
- `$.data.data[].order_detail_all[].cloud.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data.data[].order_detail_all[].cloud.region_id` -- Identifier.
- `$.data.data[].order_detail_all[].cloud.country` -- Count.
- `$.data.data[].order_detail_all[].cloud.city` -- Geolocated city.
- `$.data.data[].order_detail_all[].cloud.cpu` -- CPU core count preset.
- `$.data.data[].order_detail_all[].cloud.memory` -- Memory size.
- `$.data.data[].order_detail_all[].cloud.instance_id` -- Identifier.
- `$.data.data[].order_detail_all[].cloud.bundle_id` -- Identifier.
- `$.data.data[].order_detail_all[].cloud.display_area` -- Display area.
- `$.data.data[].order_detail_all[].cloud.display_region` -- Display region.
- `$.data.data[].order_detail_all[].cloud.ext_rul` -- Extension URL (API spelling).
- `$.data.data[].order_detail_all[].cloud.vtype` -- Type discriminator.
- `$.data.data[].order_detail_all[].cloud.price_json` -- Price JSON.
- `$.data.data[].order_detail_all[].cloud.packages` -- Package options.
- `$.data.data[].order_detail_all[].cloud.dynamic_packages` -- Dynamic package options.
- `$.data.data[].order_detail_all[].cloud.line_price` -- Line price.
- `$.data.data[].order_detail_all[].cloud.selling_price` -- Selling price.
- `$.data.data[].order_detail_all[].cloud.origin_price` -- Original price.
- `$.data.data[].order_detail_all[].cloud.floor_price` -- Floor price.
- `$.data.data[].order_detail_all[].cloud.proxy_type` -- Type discriminator.
- `$.data.data[].order_detail_all[].cloud.sell_pool` -- Sell pool.
- `$.data.data[].order_detail_all[].cloud.is_new` -- New flag.
- `$.data.data[].order_detail_all[].cloud.is_recommend` -- Recommend flag.
- `$.data.data[].order_detail_all[].cloud.is_display` -- Display flag.
- `$.data.data[].order_detail_all[].cloud.is_hot` -- Hot flag.
- `$.data.data[].order_detail_all[].cloud.is_discount` -- Count.
- `$.data.data[].order_detail_all[].cloud.remaining` -- Remaining amount.
- `$.data.data[].order_detail_all[].cloud.ip_type` -- Type discriminator.
- `$.data.data[].order_detail_all[].cloud.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.data[].order_detail_all[].cloud.net_type` -- Type discriminator.
- `$.data.data[].order_detail_all[].cloud.band_width` -- Bandwidth value.
- `$.data.data[].order_detail_all[].cloud.asn_type` -- Type discriminator.
- `$.data.data[].order_detail_all[].cloud.band_width_type` -- Type discriminator.
- `$.data.data[].order_detail_all[].cloud.cidr_status` -- Status value.
- `$.data.data[].order_detail_all[].cloud.max_band_width` -- Maximum bandwidth.
- `$.data.data[].order_detail_all[].cloud.unit` -- Unit.
- `$.data.data[].order_detail_all[].cloud.duration` -- Duration.
- `$.data.data[].order_detail_all[].cloud.band_width_cost` -- Bandwidth cost.
- `$.data.data[].order_detail_all[].cloud.band_width_price` -- Bandwidth price.
- `$.data.data[].order_detail_all[].cloud.id` -- Identifier.
- `$.data.data[].order_detail_all[].cloud.area_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail_all[].cloud.country_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail_all[].cloud.city_code` -- Business status code; 200 is success.
- `$.data.data[].order_detail_all[].cloud.detail` -- Log detail text.
- `$.data.data[].order_detail_all[].cloud.parent_no` -- Parent number.
- `$.data.data[].order_detail_all[].cloud.name` -- Display name.
- `$.data.data[].order_detail_all[].cloud.sell_unit` -- Sell unit.
- `$.data.data[].order_detail_all[].cloud.assign_ip` -- Assigned IP address.
- `$.data.data[].order_detail_all[].cloud.discount` -- Count.
- `$.data.data[].order_detail_all[].cloud.recommend_platform` -- Recommended platform.
- `$.data.data[].order_detail_all[].cloud.un_recommend_platform` -- Un-recommended platform.
- `$.data.data[].order_detail_all[].cloud.third_recommend_platform` -- Third recommended platform.

## GET /v2/cost/costmanagement/getProxyProduct

- Client name: `getProxyProduct`
- HTTP 200, code `200`, 129510 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].new_cloud_instances` -- New cloud instances.
- `$.data[].new_cloud_instances.is_close` -- Closed flag.
- `$.data[].new_cloud_instances.created_at` -- Creation timestamp.
- `$.data[].new_cloud_instances.updated_at` -- Last update timestamp.
- `$.data[].new_cloud_instances.ext_num` -- Count.
- `$.data[].new_cloud_instances.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data[].new_cloud_instances.region_id` -- Identifier.
- `$.data[].new_cloud_instances.country` -- Count.
- `$.data[].new_cloud_instances.city` -- Geolocated city.
- `$.data[].new_cloud_instances.cpu` -- CPU core count preset.
- `$.data[].new_cloud_instances.memory` -- Memory size.
- `$.data[].new_cloud_instances.instance_id` -- Identifier.
- `$.data[].new_cloud_instances.bundle_id` -- Identifier.
- `$.data[].new_cloud_instances.display_area` -- Display area.
- `$.data[].new_cloud_instances.display_region` -- Display region.
- `$.data[].new_cloud_instances.ext_rul` -- Extension URL (API spelling).
- `$.data[].new_cloud_instances.vtype` -- Type discriminator.
- `$.data[].new_cloud_instances.price_json` -- Price JSON.
- `$.data[].new_cloud_instances.packages` -- Package options.
- `$.data[].new_cloud_instances.packages.day` -- Plan day counter.
- `$.data[].new_cloud_instances.packages.price` -- Price.
- `$.data[].new_cloud_instances.packages.price[].month` -- Month value.
- `$.data[].new_cloud_instances.packages.price[].discount` -- Count.
- `$.data[].new_cloud_instances.dynamic_packages` -- Dynamic package options.
- `$.data[].new_cloud_instances.line_price` -- Line price.
- `$.data[].new_cloud_instances.selling_price` -- Selling price.
- `$.data[].new_cloud_instances.origin_price` -- Original price.
- `$.data[].new_cloud_instances.floor_price` -- Floor price.
- `$.data[].new_cloud_instances.proxy_type` -- Type discriminator.
- `$.data[].new_cloud_instances.sell_pool` -- Sell pool.
- `$.data[].new_cloud_instances.is_new` -- New flag.
- `$.data[].new_cloud_instances.is_recommend` -- Recommend flag.
- `$.data[].new_cloud_instances.is_display` -- Display flag.
- `$.data[].new_cloud_instances.is_hot` -- Hot flag.
- `$.data[].new_cloud_instances.is_discount` -- Count.
- `$.data[].new_cloud_instances.remaining` -- Remaining amount.
- `$.data[].new_cloud_instances.ip_type` -- Type discriminator.
- `$.data[].new_cloud_instances.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data[].new_cloud_instances.net_type` -- Type discriminator.
- `$.data[].new_cloud_instances.band_width` -- Bandwidth value.
- `$.data[].new_cloud_instances.asn_type` -- Type discriminator.
- `$.data[].new_cloud_instances.band_width_type` -- Type discriminator.
- `$.data[].new_cloud_instances.cidr_status` -- Status value.
- `$.data[].new_cloud_instances.max_band_width` -- Maximum bandwidth.
- `$.data[].new_cloud_instances.unit` -- Unit.
- `$.data[].new_cloud_instances.duration` -- Duration.
- `$.data[].new_cloud_instances.band_width_cost` -- Bandwidth cost.
- `$.data[].new_cloud_instances.band_width_price` -- Bandwidth price.
- `$.data[].new_cloud_instances.id` -- Identifier.
- `$.data[].new_cloud_instances.area_code` -- Business status code; 200 is success.
- `$.data[].new_cloud_instances.country_code` -- Business status code; 200 is success.
- `$.data[].new_cloud_instances.city_code` -- Business status code; 200 is success.
- `$.data[].new_cloud_instances.detail` -- Log detail text.
- `$.data[].new_cloud_instances.parent_no` -- Parent number.
- `$.data[].new_cloud_instances.name` -- Display name.
- `$.data[].new_cloud_instances.sell_unit` -- Sell unit.
- `$.data[].new_cloud_instances.assign_ip` -- Assigned IP address.
- `$.data[].new_cloud_instances.discount` -- Count.
- `$.data[].new_cloud_instances.recommend_platform` -- Recommended platform.
- `$.data[].new_cloud_instances.un_recommend_platform` -- Un-recommended platform.
- `$.data[].new_cloud_instances.third_recommend_platform` -- Third recommended platform.
- `$.data[].new_cloud_instances.third_un_recommend_platform` -- Third un-recommended platform.
- `$.data[].new_cloud_instances.remark` -- Remark text.
- `$.data[].new_cloud_instances_cidr_blocks` -- CIDR blocks for new cloud instances.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getProxyProductV2

- Client name: `getProxyProductV2`
- HTTP 200, code `200`, 549369 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.group_list` -- Group list.
- `$.data.group_list[].is_close` -- Closed flag.
- `$.data.group_list[].created_at` -- Creation timestamp.
- `$.data.group_list[].updated_at` -- Last update timestamp.
- `$.data.group_list[].ext_num` -- Count.
- `$.data.group_list[].package_type` -- Plan or package category; client label `套餐类别`.
- `$.data.group_list[].region_id` -- Identifier.
- `$.data.group_list[].country` -- Count.
- `$.data.group_list[].city` -- Geolocated city.
- `$.data.group_list[].cpu` -- CPU core count preset.
- `$.data.group_list[].memory` -- Memory size.
- `$.data.group_list[].instance_id` -- Identifier.
- `$.data.group_list[].bundle_id` -- Identifier.
- `$.data.group_list[].display_area` -- Display area.
- `$.data.group_list[].display_region` -- Display region.
- `$.data.group_list[].ext_rul` -- Extension URL (API spelling).
- `$.data.group_list[].vtype` -- Type discriminator.
- `$.data.group_list[].price_json` -- Price JSON.
- `$.data.group_list[].price_json.flow` -- Flow/transaction entry.
- `$.data.group_list[].price_json.multiple` -- Multiple flag or factor.
- `$.data.group_list[].packages` -- Package options.
- `$.data.group_list[].packages.day` -- Plan day counter.
- `$.data.group_list[].packages.price` -- Price.
- `$.data.group_list[].packages.price[].month` -- Month value.
- `$.data.group_list[].packages.price[].discount` -- Count.
- `$.data.group_list[].dynamic_packages` -- Dynamic package options.
- `$.data.group_list[].line_price` -- Line price.
- `$.data.group_list[].selling_price` -- Selling price.
- `$.data.group_list[].origin_price` -- Original price.
- `$.data.group_list[].floor_price` -- Floor price.
- `$.data.group_list[].proxy_type` -- Type discriminator.
- `$.data.group_list[].sell_pool` -- Sell pool.
- `$.data.group_list[].is_new` -- New flag.
- `$.data.group_list[].is_recommend` -- Recommend flag.
- `$.data.group_list[].is_display` -- Display flag.
- `$.data.group_list[].is_hot` -- Hot flag.
- `$.data.group_list[].is_discount` -- Count.
- `$.data.group_list[].remaining` -- Remaining amount.
- `$.data.group_list[].ip_type` -- Type discriminator.
- `$.data.group_list[].isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.group_list[].net_type` -- Type discriminator.
- `$.data.group_list[].band_width` -- Bandwidth value.
- `$.data.group_list[].asn_type` -- Type discriminator.
- `$.data.group_list[].band_width_type` -- Type discriminator.
- `$.data.group_list[].cidr_status` -- Status value.
- `$.data.group_list[].max_band_width` -- Maximum bandwidth.
- `$.data.group_list[].unit` -- Unit.
- `$.data.group_list[].duration` -- Duration.
- `$.data.group_list[].band_width_cost` -- Bandwidth cost.
- `$.data.group_list[].band_width_price` -- Bandwidth price.
- `$.data.group_list[].id` -- Identifier.
- `$.data.group_list[].area_code` -- Business status code; 200 is success.
- `$.data.group_list[].country_code` -- Business status code; 200 is success.
- `$.data.group_list[].city_code` -- Business status code; 200 is success.
- `$.data.group_list[].detail` -- Log detail text.
- `$.data.group_list[].parent_no` -- Parent number.
- `$.data.group_list[].name` -- Display name.
- `$.data.group_list[].sell_unit` -- Sell unit.
- `$.data.group_list[].assign_ip` -- Assigned IP address.
- `$.data.group_list[].discount` -- Count.
- `$.data.group_list[].recommend_platform` -- Recommended platform.
- `$.data.group_list[].un_recommend_platform` -- Un-recommended platform.
- `$.data.group_list[].third_recommend_platform` -- Third recommended platform.
- `$.data.group_list[].third_un_recommend_platform` -- Third un-recommended platform.
- `$.data.group_list[].remark` -- Remark text.
- `$.data.group_list[].group_no` -- Group number.
- `$.data.group_list[].group_name` -- Group display name; client label `分组名称`.
- `$.data.group_list[].group_price` -- Group price.
- `$.data.list` -- Record array.
- `$.data.list[].is_close` -- Closed flag.
- `$.data.list[].created_at` -- Creation timestamp.
- `$.data.list[].updated_at` -- Last update timestamp.
- `$.data.list[].ext_num` -- Count.
- `$.data.list[].package_type` -- Plan or package category; client label `套餐类别`.
- `$.data.list[].region_id` -- Identifier.
- `$.data.list[].country` -- Count.
- `$.data.list[].city` -- Geolocated city.
- `$.data.list[].cpu` -- CPU core count preset.
- `$.data.list[].memory` -- Memory size.
- `$.data.list[].instance_id` -- Identifier.
- `$.data.list[].bundle_id` -- Identifier.
- `$.data.list[].display_area` -- Display area.
- `$.data.list[].display_region` -- Display region.
- `$.data.list[].ext_rul` -- Extension URL (API spelling).
- `$.data.list[].vtype` -- Type discriminator.
- `$.data.list[].price_json` -- Price JSON.
- `$.data.list[].packages` -- Package options.
- `$.data.list[].packages.day` -- Plan day counter.
- `$.data.list[].packages.price` -- Price.
- `$.data.list[].packages.price[].month` -- Month value.
- `$.data.list[].packages.price[].discount` -- Count.
- `$.data.list[].dynamic_packages` -- Dynamic package options.
- `$.data.list[].line_price` -- Line price.
- `$.data.list[].selling_price` -- Selling price.
- `$.data.list[].origin_price` -- Original price.
- `$.data.list[].floor_price` -- Floor price.
- `$.data.list[].proxy_type` -- Type discriminator.
- `$.data.list[].sell_pool` -- Sell pool.
- `$.data.list[].is_new` -- New flag.
- `$.data.list[].is_recommend` -- Recommend flag.
- `$.data.list[].is_display` -- Display flag.
- `$.data.list[].is_hot` -- Hot flag.
- `$.data.list[].is_discount` -- Count.
- `$.data.list[].remaining` -- Remaining amount.
- `$.data.list[].ip_type` -- Type discriminator.
- `$.data.list[].isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data.list[].net_type` -- Type discriminator.
- `$.data.list[].band_width` -- Bandwidth value.
- `$.data.list[].asn_type` -- Type discriminator.
- `$.data.list[].band_width_type` -- Type discriminator.
- `$.data.list[].cidr_status` -- Status value.
- `$.data.list[].max_band_width` -- Maximum bandwidth.
- `$.data.list[].unit` -- Unit.
- `$.data.list[].duration` -- Duration.
- `$.data.list[].band_width_cost` -- Bandwidth cost.
- `$.data.list[].band_width_price` -- Bandwidth price.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].area_code` -- Business status code; 200 is success.
- `$.data.list[].country_code` -- Business status code; 200 is success.
- `$.data.list[].city_code` -- Business status code; 200 is success.
- `$.data.list[].detail` -- Log detail text.
- `$.data.list[].parent_no` -- Parent number.
- `$.data.list[].name` -- Display name.
- `$.data.list[].sell_unit` -- Sell unit.
- `$.data.list[].assign_ip` -- Assigned IP address.
- `$.data.list[].discount` -- Count.
- `$.data.list[].recommend_platform` -- Recommended platform.
- `$.data.list[].un_recommend_platform` -- Un-recommended platform.
- `$.data.list[].third_recommend_platform` -- Third recommended platform.
- `$.data.list[].third_un_recommend_platform` -- Third un-recommended platform.
- `$.data.list[].remark` -- Remark text.
- `$.data.list[].group_no` -- Group number.
- `$.data.list[].group_name` -- Group display name; client label `分组名称`.
- `$.data.list[].group_price` -- Group price.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getrechargecloudcoin

- Client name: `getrechargeamount`
- HTTP 200, code `200`, 1381 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].created_at` -- Creation timestamp.
- `$.data[].updated_at` -- Last update timestamp.
- `$.data[].amount` -- Amount value.
- `$.data[].cloud_coin` -- Cloud-coin amount.
- `$.data[].give_cloud_coin` -- Gifted cloud coins.
- `$.data[].give_coin_ratio` -- Gift-coin ratio.
- `$.data[].sort` -- Sort order.
- `$.data[].is_enable` -- Enabled flag.
- `$.data[].type` -- Type discriminator.
- `$.data[].product_id` -- Identifier.
- `$.data[].min_amount` -- Minimum amount.
- `$.data[].max_amount` -- Maximum amount.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getrechargehistory

- Client name: `getrechargehistory`
- HTTP 200, code `200`, 145 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getRegionSupport

- Client name: `getRegionSupport`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/getRegionSupportV2

- Client name: `getRegionSupportV2`
- HTTP 200, code `200`, 72862 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].parentCode` -- Business status code; 200 is success.
- `$.data[].code` -- Business status code; 200 is success.
- `$.data[].name` -- Display name.
- `$.data[].count` -- Count.
- `$.data[].flag` -- Row flag value.
- `$.data[].sort` -- Sort order.
- `$.data[].children` -- Nested child rows (department tree).
- `$.data[].children[].id` -- Identifier.
- `$.data[].children[].parentCode` -- Business status code; 200 is success.
- `$.data[].children[].code` -- Business status code; 200 is success.
- `$.data[].children[].name` -- Display name.
- `$.data[].children[].count` -- Count.
- `$.data[].children[].flag` -- Row flag value.
- `$.data[].children[].sort` -- Sort order.
- `$.data[].children[].children` -- Nested child rows (department tree).
- `$.data[].children[].children[].id` -- Identifier.
- `$.data[].children[].children[].parentCode` -- Business status code; 200 is success.
- `$.data[].children[].children[].code` -- Business status code; 200 is success.
- `$.data[].children[].children[].name` -- Display name.
- `$.data[].children[].children[].count` -- Count.
- `$.data[].children[].children[].flag` -- Row flag value.
- `$.data[].children[].children[].sort` -- Sort order.
- `$.data[].children[].children[].children` -- Nested child rows (department tree).
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/orderExportNew

- Client name: `orderexport`
- HTTP 200, code `200`, 232 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.message` -- Message text.
- `$.data.status` -- Status value.
- `$.data.url` -- URL.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/quick

- Client name: `quickMulSearch`
- HTTP 200, code `200`, 145 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/quickIndex

- Client name: `quickSearchBuy`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/quickRecommend

- Client name: `quickRecommend`
- HTTP 200, code `200`, 46946 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].instance_id` -- Identifier.
- `$.data[].count` -- Count.
- `$.data[].cidr` -- CIDR block.
- `$.data[].asn` -- Autonomous system number (ASN).
- `$.data[].isp` -- ISP name.
- `$.data[].ID` -- Identifier.
- `$.data[].buyStatus` -- Status value.
- `$.data[].cloud_instances` -- Cloud instances.
- `$.data[].cloud_instances.is_close` -- Closed flag.
- `$.data[].cloud_instances.created_at` -- Creation timestamp.
- `$.data[].cloud_instances.updated_at` -- Last update timestamp.
- `$.data[].cloud_instances.ext_num` -- Count.
- `$.data[].cloud_instances.package_type` -- Plan or package category; client label `套餐类别`.
- `$.data[].cloud_instances.region_id` -- Identifier.
- `$.data[].cloud_instances.country` -- Count.
- `$.data[].cloud_instances.city` -- Geolocated city.
- `$.data[].cloud_instances.cpu` -- CPU core count preset.
- `$.data[].cloud_instances.memory` -- Memory size.
- `$.data[].cloud_instances.instance_id` -- Identifier.
- `$.data[].cloud_instances.bundle_id` -- Identifier.
- `$.data[].cloud_instances.display_area` -- Display area.
- `$.data[].cloud_instances.display_region` -- Display region.
- `$.data[].cloud_instances.ext_rul` -- Extension URL (API spelling).
- `$.data[].cloud_instances.vtype` -- Type discriminator.
- `$.data[].cloud_instances.price_json` -- Price JSON.
- `$.data[].cloud_instances.packages` -- Package options.
- `$.data[].cloud_instances.packages.day` -- Plan day counter.
- `$.data[].cloud_instances.packages.price` -- Price.
- `$.data[].cloud_instances.packages.price[].month` -- Month value.
- `$.data[].cloud_instances.packages.price[].discount` -- Count.
- `$.data[].cloud_instances.dynamic_packages` -- Dynamic package options.
- `$.data[].cloud_instances.line_price` -- Line price.
- `$.data[].cloud_instances.selling_price` -- Selling price.
- `$.data[].cloud_instances.origin_price` -- Original price.
- `$.data[].cloud_instances.floor_price` -- Floor price.
- `$.data[].cloud_instances.proxy_type` -- Type discriminator.
- `$.data[].cloud_instances.sell_pool` -- Sell pool.
- `$.data[].cloud_instances.is_new` -- New flag.
- `$.data[].cloud_instances.is_recommend` -- Recommend flag.
- `$.data[].cloud_instances.is_display` -- Display flag.
- `$.data[].cloud_instances.is_hot` -- Hot flag.
- `$.data[].cloud_instances.is_discount` -- Count.
- `$.data[].cloud_instances.remaining` -- Remaining amount.
- `$.data[].cloud_instances.ip_type` -- Type discriminator.
- `$.data[].cloud_instances.isp_type` -- ISP type; client label `ISP类型` / `ISP Type`.
- `$.data[].cloud_instances.net_type` -- Type discriminator.
- `$.data[].cloud_instances.band_width` -- Bandwidth value.
- `$.data[].cloud_instances.asn_type` -- Type discriminator.
- `$.data[].cloud_instances.band_width_type` -- Type discriminator.
- `$.data[].cloud_instances.cidr_status` -- Status value.
- `$.data[].cloud_instances.max_band_width` -- Maximum bandwidth.
- `$.data[].cloud_instances.unit` -- Unit.
- `$.data[].cloud_instances.duration` -- Duration.
- `$.data[].cloud_instances.band_width_cost` -- Bandwidth cost.
- `$.data[].cloud_instances.band_width_price` -- Bandwidth price.
- `$.data[].cloud_instances.id` -- Identifier.
- `$.data[].cloud_instances.area_code` -- Business status code; 200 is success.
- `$.data[].cloud_instances.country_code` -- Business status code; 200 is success.
- `$.data[].cloud_instances.city_code` -- Business status code; 200 is success.
- `$.data[].cloud_instances.detail` -- Log detail text.
- `$.data[].cloud_instances.parent_no` -- Parent number.
- `$.data[].cloud_instances.name` -- Display name.
- `$.data[].cloud_instances.sell_unit` -- Sell unit.
- `$.data[].cloud_instances.assign_ip` -- Assigned IP address.
- `$.data[].cloud_instances.discount` -- Count.
- `$.data[].cloud_instances.recommend_platform` -- Recommended platform.
- `$.data[].cloud_instances.un_recommend_platform` -- Un-recommended platform.
- `$.data[].cloud_instances.third_recommend_platform` -- Third recommended platform.
- `$.data[].cloud_instances.third_un_recommend_platform` -- Third un-recommended platform.
- `$.data[].cloud_instances.remark` -- Remark text.
- `$.data[].recommend_platform` -- Recommended platform.
- `$.data[].un_recommend_platform` -- Un-recommended platform.
- `$.data[].third_recommend_platform` -- Third recommended platform.
- `$.data[].third_un_recommend_platform` -- Third un-recommended platform.
- `$.data[].remark` -- Remark text.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/costmanagement/redeemed

- Client name: `getcdkey`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/costmanagement/renew_meal_pay

- Client name: `renewMealPay`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/costmanagement/set_meal_auto_set

- Client name: `set_meal_auto_set`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/costmanagement/set_meal_pay

- Client name: `setmealPay`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/set_meal_set

- Client name: `getsetmeal`
- HTTP 200, code `200`, 750 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.day` -- Plan day counter.
- `$.data.day[].num` -- Count.
- `$.data.day[].discount` -- Count.
- `$.data.member` -- Member entry.
- `$.data.merber_max` -- Maximum members (API spelling).
- `$.data.environment` -- Environment value.
- `$.data.environment[].num` -- Count.
- `$.data.environment[].show` -- Show flag.
- `$.data.environment[].price` -- Price.
- `$.data.environment[].unit_price` -- Unit price.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/user_coupons_event_list

- Client name: `bindMobilePhoneCoupon`
- HTTP 200, code `200`, 145 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/costmanagement/user_coupons_list

- Client name: `userCouponsList`
- HTTP 200, code `200`, 146 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/balance_pay

- Client name: `balancePay`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/batch_create_order

- Client name: `createOrder`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/batch_create_renew

- Client name: `batchCreateRenew`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/cancel_order

- Client name: `cancelOrder`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/cart_delete

- Client name: `cartDelete`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/device/cart_find

- Client name: `cartFind`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/cart_update

- Client name: `cartUpdate`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/create_order

- Client name: `createDeviceOrder`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/create_renew

- Client name: `createRenewOrder`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/createNewbieDeviceOrder

- Client name: `createNewbieDeviceOrder`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/cost/device/findorder

- Client name: `findorder`
- HTTP 200, code `200`, 302 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.orderStatus` -- Status value.
- `$.data.payInfoData` -- Endpoint payload container.
- `$.data.payInfoData.amount` -- Amount value.
- `$.data.payInfoData.orderAmount` -- Order amount.
- `$.data.payInfoData.orderNumber` -- Count.
- `$.data.payInfoData.payTime` -- Timestamp.
- `$.data.payInfoData.payType` -- Type discriminator.
- `$.data.payInfoData.time` -- Timestamp.
- `$.data.status` -- Status value.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/pay_scan

- Client name: `devicePayScan`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/cost/device/scanrecharge

- Client name: `scanrecharge`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/logs/auth/options

- Client name: `optionslogs`
- HTTP 200, code `200`, 3053 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.
- `$.data.pageIndex` -- Current page index.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].userId` -- User identifier.
- `$.data.list[].username` -- Display name.
- `$.data.list[].Name` -- Display name.
- `$.data.list[].companyId` -- Company identifier.
- `$.data.list[].opType` -- Type discriminator.
- `$.data.list[].deptId` -- Identifier.
- `$.data.list[].departmentName` -- Department display name; client label `部门名称`.
- `$.data.list[].content` -- Log or notice body text.
- `$.data.list[].detail` -- Log detail text.
- `$.data.list[].dataId` -- Identifier.
- `$.data.list[].createdAt` -- Timestamp.

## POST /v2/logs/auth/perms

- Client name: `permslogs`
- HTTP 200, code `200`, 141 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.
- `$.data.pageIndex` -- Current page index.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.list` -- Record array.

## POST /v2/message/message-type/page

- Client name: `messageTypePage`
- HTTP 200, code `200`, 1759 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].title` -- Title text.
- `$.data.list[].tinyTitle` -- Short title.
- `$.data.list[].noticeExec` -- Notice execution entry.
- `$.data.list[].status` -- Status value.
- `$.data.list[].noticeType` -- Type discriminator.
- `$.data.list[].groupType` -- Type discriminator.
- `$.data.list[].sort` -- Sort order.
- `$.data.list[].createdAt` -- Timestamp.
- `$.data.list[].updatedAt` -- Timestamp.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/message/sms-setting/change

- Client name: `changeRenewSmsNotifySetting`
- HTTP 200, code `500`, 200 bytes, msg `Key: 'UserSmsSettingChangeReq.RenewSmsNotifyEnabled' Error:Field validation for 'RenewSmsNotifyEnabled' failed on the 'r`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/message/sms-setting/get

- Client name: `getRenewSmsNotifySetting`
- HTTP 200, code `200`, 105 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.renewSmsNotifyEnabled` -- Enabled flag.

## POST /v2/message/user-notice/getNotice

- Client name: `userNoticeGet`
- HTTP 200, code `200`, 447 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.title` -- Title text.
- `$.data.content` -- Log or notice body text.
- `$.data.type` -- Type discriminator.
- `$.data.noticeType` -- Type discriminator.
- `$.data.op` -- Notice operation/handler string.
- `$.data.opId` -- Identifier.
- `$.data.status` -- Status value.
- `$.data.createdAt` -- Timestamp.
- `$.data.reminderStatus` -- Status value.

## POST /v2/message/user-notice/my

- Client name: `getAllMessage_new`
- HTTP 200, code `200`, 1943 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.key` -- Setting key.
- `$.data.name` -- Display name.
- `$.data.count` -- Count.
- `$.data.total` -- Total number of records matching the query.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].title` -- Title text.
- `$.data.list[].content` -- Log or notice body text.
- `$.data.list[].type` -- Type discriminator.
- `$.data.list[].noticeType` -- Type discriminator.
- `$.data.list[].op` -- Notice operation/handler string.
- `$.data.list[].opId` -- Identifier.
- `$.data.list[].status` -- Status value.
- `$.data.list[].createdAt` -- Timestamp.
- `$.data.list[].reminderStatus` -- Status value.

## POST /v2/message/user-notice/noticeRed

- Client name: `userNoticeNoticeRed`
- HTTP 200, code `200`, 195 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].noticeType` -- Type discriminator.
- `$.data[].red` -- Red value.

## POST /v2/message/user-notice/readAll

- Client name: `userNoticeReadAll`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/message/user-notice/update

- Client name: `getReadMessage_new`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/account-users/get

- Client name: `accountUsers`
- HTTP 200, code `200`, 80 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/newbrowser/account-users/update

- Client name: `envUpdate`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/addusershopauthority

- Client name: `addusershopauthority`
- HTTP 200, code `500`, 85 bytes, msg `empty slice found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/batchCloneShop

- Client name: `batchCloneShop`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/batchCreateShop

- Client name: `batchCreateShop`
- HTTP 200, code `400`, 81 bytes, msg `unknown error`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/bindingUserPasswordList

- Client name: `bindingUserPasswordList`
- HTTP 200, code `200`, 82 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/newbrowser/clearCookie

- Client name: `clearCookie`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/cloud-accounts/auto-renew/enable

- Client name: `cloudAccountsAutoRenewEnable`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/cloud-accounts/browser-url/reset

- Client name: `cloudAccountsBrowserUrlReset`
- HTTP 200, code `500`, 84 bytes, msg `record not found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/cloud-accounts/client-num/get

- Client name: `cloudAccountsClientNumGet`
- HTTP 200, code `200`, 107 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.clientNum` -- Count.
- `$.data.keepalive` -- Whether the session is kept alive.

## POST /v2/newbrowser/cloud-accounts/create

- Client name: `yunBrowserCloudAccountsCreate`
- HTTP 200, code `500`, 86 bytes, msg `kernel is required`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/cloud-accounts/del

- Client name: `yunBrowserCloudAccountsDel`
- HTTP 200, code `500`, 84 bytes, msg `record not found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/cloud-accounts/finger/get

- Client name: `yunBrowserAccountsFingerGet`
- HTTP 200, code `200`, 1948 bytes

- `$.code` -- Business status code; 200 is success.
- `$.browseinfo` -- Environment template body returned by fingerprint-uri.
- `$.browseinfo.name` -- Display name.
- `$.browseinfo.notes` -- Free-text notes.
- `$.browseinfo.labelid` -- Tag identifier / tag display name.
- `$.browseinfo.user_password_ids` -- Bound account-record IDs.
- `$.browseinfo.is_star_tag` -- Star/favourite flag.
- `$.browseinfo.top_order` -- Top ordering value.
- `$.browseinfo.kernelId` -- Identifier.
- `$.browseinfo.categoryid` -- Identifier.
- `$.browseinfo.shopid` -- Environment or account identifier.
- `$.browseinfo.proxy` -- Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.
- `$.browseinfo.proxy.name` -- Display name.
- `$.browseinfo.proxy.inlie` -- Proxy source: local, self, or cloud.
- `$.browseinfo.proxy.uuid` -- Identifier.
- `$.browseinfo.proxy.type` -- Type discriminator.
- `$.browseinfo.proxy.product` -- Proxy product/type identifier.
- `$.browseinfo.proxy.PublicIP` -- Public IP address.
- `$.browseinfo.proxy.ipChannel` -- IP detection channel.
- `$.browseinfo.proxy.deviceType` -- Type discriminator.
- `$.browseinfo.proxy.randEnv` -- Random-environment flag.
- `$.browseinfo.proxy.proxyaddrArr` -- Random proxy address array.
- `$.browseinfo.proxy.region` -- Proxy region selection.
- `$.browseinfo.proxy.dns` -- DNS fingerprint/proxy block.
- `$.browseinfo.proxy.dns.mode` -- Mode flag.
- `$.browseinfo.proxy.dns.inside` -- Whether DNS resolution happens inside the tunnel.
- `$.browseinfo.proxy.socks5` -- SOCKS5 proxy protocol block.
- `$.browseinfo.proxy.socks5.Addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.socks5.User` -- Username (sensitive).
- `$.browseinfo.proxy.socks5.Passwd` -- Password (sensitive).
- `$.browseinfo.proxy.http` -- HTTP proxy protocol block.
- `$.browseinfo.proxy.http.Addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.http.User` -- Username (sensitive).
- `$.browseinfo.proxy.http.Passwd` -- Password (sensitive).
- `$.browseinfo.proxy.https` -- HTTPS proxy protocol block.
- `$.browseinfo.proxy.https.Addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.https.User` -- Username (sensitive).
- `$.browseinfo.proxy.https.Passwd` -- Password (sensitive).
- `$.browseinfo.proxy.ssh` -- SSH proxy protocol block.
- `$.browseinfo.proxy.ssh.Addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.ssh.User` -- Username (sensitive).
- `$.browseinfo.proxy.ssh.Passwd` -- Password (sensitive).
- `$.browseinfo.proxy.v2Ray` -- V2Ray proxy protocol block.
- `$.browseinfo.proxy.v2Ray.addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.v2Ray.uuid` -- Identifier.
- `$.browseinfo.proxy.zhima` -- Zhima proxy protocol block.
- `$.browseinfo.proxy.zhima.Url` -- URL.
- `$.browseinfo.proxy.zhima.Interval` -- Dynamic-proxy refresh interval.
- `$.browseinfo.proxy.dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.browseinfo.proxy.dynamic.Url` -- URL.
- `$.browseinfo.proxy.dynamic.Interval` -- Dynamic-proxy refresh interval.
- `$.browseinfo.proxy.dynamic.Type` -- Type discriminator.
- `$.browseinfo.number` -- Count.
- `$.browseinfo.userPasswordPlatforms` -- Platform metadata for the account record.
- `$.browseinfo.accounts` -- Count.
- `$.browseinfo.accounts.cookie` -- Stored cookie payload (sensitive).
- `$.browseinfo.accounts.url` -- URL.
- `$.browseinfo.accounts.name` -- Display name.
- `$.browseinfo.accounts.user` -- Username (sensitive).
- `$.browseinfo.accounts.passwd` -- Password (sensitive).
- `$.browseinfo.accounts.loginurl` -- URL.
- `$.browseinfo.accounts.platformicon` -- Icon URL or identifier.
- `$.browseinfo.accounts.lock` -- Record lock flag.
- `$.browseinfo.accounts.tfa` -- Two-factor authentication secret (sensitive).
- `$.defaultfingerprint` -- Default fingerprint block returned by fingerprint-uri.
- `$.defaultfingerprint.kernel` -- Browser kernel name.
- `$.defaultfingerprint.kernelversion` -- Kernel version preset.
- `$.defaultfingerprint.system` -- Operating system preset.
- `$.defaultfingerprint.nextsystem` -- Alternative operating-system presets.
- `$.defaultfingerprint.nextsystem.Android` -- Identifier.
- `$.defaultfingerprint.nextsystem.MacOS` -- macOS platform entry.
- `$.defaultfingerprint.nextsystem.IOS` -- iOS platform entry.
- `$.defaultfingerprint.nextsystem.Linux` -- Linux platform entry.
- `$.defaultfingerprint.UAversion` -- UA version preset.
- `$.defaultfingerprint.ua` -- User-Agent string.
- `$.defaultfingerprint.language` -- Language preset.
- `$.defaultfingerprint.uilanguage` -- UI language preset.
- `$.defaultfingerprint.zone` -- Timezone preset.
- `$.defaultfingerprint.geographic` -- Geolocation fingerprint block.
- `$.defaultfingerprint.geographic.enable` -- Enabled flag.
- `$.defaultfingerprint.geographic.user` -- Username (sensitive).
- `$.defaultfingerprint.geographic.longitude` -- Geolocation longitude.
- `$.defaultfingerprint.geographic.latitude` -- Geolocation latitude.
- `$.defaultfingerprint.geographic.accuracy` -- Geolocation accuracy value.
- `$.defaultfingerprint.dpi` -- Device pixel ratio preset.
- `$.defaultfingerprint.widowssize` -- Window-size preset.
- `$.defaultfingerprint.font` -- Font fingerprint block.
- `$.defaultfingerprint.font.enable` -- Enabled flag.
- `$.defaultfingerprint.font.list` -- Record array.
- `$.defaultfingerprint.fontfinger` -- Font fingerprint mode.
- `$.defaultfingerprint.WebRTC` -- WebRTC fingerprint mode.
- `$.defaultfingerprint.WebRTCIP` -- WebRTC local IP value.
- `$.defaultfingerprint.Canvas` -- Canvas fingerprint mode.
- `$.defaultfingerprint.WebGl` -- WebGL fingerprint mode.
- `$.defaultfingerprint.WebGlInfo` -- WebGL info mode.
- `$.defaultfingerprint.WebGLVendor` -- WebGL vendor string.
- `$.defaultfingerprint.WebGLRenderer` -- WebGL renderer string.
- `$.defaultfingerprint.AudioContext` -- AudioContext fingerprint mode.
- `$.defaultfingerprint.SpeechVoices` -- SpeechVoices fingerprint mode.
- `$.defaultfingerprint.clientRects` -- ClientRects fingerprint mode.
- `$.defaultfingerprint.mediadevice` -- Media-device fingerprint mode.
- `$.defaultfingerprint.cpu` -- CPU core count preset.
- `$.defaultfingerprint.mem` -- Memory preset (GB).
- `$.defaultfingerprint.devicename` -- Display name.
- `$.defaultfingerprint.mac` -- MAC address value.
- `$.defaultfingerprint.hardware` -- Hardware-concurrency fingerprint mode.
- `$.defaultfingerprint.Bluetooth` -- Bluetooth fingerprint mode.
- `$.defaultfingerprint.Donottrack` -- Do-Not-Track fingerprint mode.
- `$.defaultfingerprint.battery` -- Battery fingerprint mode.
- `$.defaultfingerprint.enablescanport` -- Enabled flag.
- `$.defaultfingerprint.scanport` -- Port-scan fingerprint value.
- `$.defaultfingerprint.enableCookie` -- Enabled flag.
- `$.defaultfingerprint.enableopen` -- Enabled flag.
- `$.defaultfingerprint.enableopenNumber` -- Count.
- `$.defaultfingerprint.riskControl` -- Risk-control mode.
- `$.defaultfingerprint.enablenotice` -- Enabled flag.
- `$.defaultfingerprint.enablepic` -- Enabled flag.
- `$.defaultfingerprint.picsize` -- Image size preference.
- `$.defaultfingerprint.Enablesound` -- Enabled flag.
- `$.defaultfingerprint.Enablevideo` -- Enabled flag.
- `$.defaultfingerprint.ignoreCookieErr` -- Whether cookie read errors are ignored.
- `$.defaultfingerprint.enableGc` -- Enabled flag.
- `$.defaultfingerprint.gcTime` -- Timestamp.
- `$.defaultfingerprint.enableClearStorage` -- Enabled flag.
- `$.defaultfingerprint.enableClearCookie` -- Enabled flag.
- `$.defaultfingerprint.randomFinger` -- Random-fingerprint mode.

## POST /v2/newbrowser/cloud-accounts/free/shop/get

- Client name: `cloudAccountsFreeShopGet`
- HTTP 200, code `200`, 167 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.accountId` -- Identifier.
- `$.data.oid` -- Identifier.

## POST /v2/newbrowser/cloud-accounts/free/shop/init

- Client name: `cloudAccountsFreeShopInit`
- HTTP 200, code `500`, 84 bytes, msg `record not found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/cloud-accounts/getauthshopbriefinfolist

- Client name: `getauthshopbriefinfolist_Yun`
- HTTP 200, code `200`, 922 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].shopid` -- Environment or account identifier.
- `$.data.list[].group` -- Group object or name.
- `$.data.list[].group.name` -- Display name.
- `$.data.list[].group.groupid` -- Identifier.
- `$.data.list[].name` -- Display name.
- `$.data.list[].notes` -- Free-text notes.
- `$.data.list[].serial` -- Serial number.
- `$.data.list[].is_star_tag` -- Star/favourite flag.
- `$.data.list[].kernel` -- Browser kernel name.
- `$.data.list[].kernelVersion` -- Kernel version preset.
- `$.data.list[].authorized` -- Authorization record when the row is shared/authorized.
- `$.data.list[].system` -- Operating system preset.
- `$.data.list[].userPasswordIds` -- Bound account-record IDs.
- `$.data.list[].label` -- Tag label object or tag IDs.
- `$.data.list[].proxy` -- Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.
- `$.data.list[].proxy.name` -- Display name.
- `$.data.list[].proxy.inlie` -- Proxy source: local, self, or cloud.
- `$.data.list[].proxy.uuid` -- Identifier.
- `$.data.list[].proxy.type` -- Type discriminator.
- `$.data.list[].proxy.product` -- Proxy product/type identifier.
- `$.data.list[].proxy.PublicIP` -- Public IP address.
- `$.data.list[].proxy.ipChannel` -- IP detection channel.
- `$.data.list[].proxy.deviceType` -- Type discriminator.
- `$.data.list[].proxy.randEnv` -- Random-environment flag.
- `$.data.list[].proxy.proxyaddrArr` -- Random proxy address array.
- `$.data.list[].proxy.region` -- Proxy region selection.
- `$.data.list[].proxy.dns` -- DNS fingerprint/proxy block.
- `$.data.list[].proxy.dns.mode` -- Mode flag.
- `$.data.list[].proxy.dns.inside` -- Whether DNS resolution happens inside the tunnel.
- `$.data.list[].proxy.socks5` -- SOCKS5 proxy protocol block.
- `$.data.list[].proxy.socks5.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.socks5.User` -- Username (sensitive).
- `$.data.list[].proxy.socks5.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.http` -- HTTP proxy protocol block.
- `$.data.list[].proxy.http.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.http.User` -- Username (sensitive).
- `$.data.list[].proxy.http.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.https` -- HTTPS proxy protocol block.
- `$.data.list[].proxy.https.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.https.User` -- Username (sensitive).
- `$.data.list[].proxy.https.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.ssh` -- SSH proxy protocol block.
- `$.data.list[].proxy.ssh.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.ssh.User` -- Username (sensitive).
- `$.data.list[].proxy.ssh.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.v2Ray` -- V2Ray proxy protocol block.
- `$.data.list[].proxy.v2Ray.addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.v2Ray.uuid` -- Identifier.
- `$.data.list[].proxy.zhima` -- Zhima proxy protocol block.
- `$.data.list[].proxy.zhima.Url` -- URL.
- `$.data.list[].proxy.zhima.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.data.list[].proxy.dynamic.Url` -- URL.
- `$.data.list[].proxy.dynamic.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic.Type` -- Type discriminator.
- `$.data.list[].createby` -- Creator user ID.
- `$.data.list[].cloud_id` -- Identifier.
- `$.data.list[].is_give` -- Whether the plan was gifted.
- `$.data.list[].status` -- Status value.
- `$.data.list[].expired_at` -- Timestamp.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/cloud-accounts/getiduserlist

- Client name: `getUseCountByProxyId_Yun`
- HTTP 200, code `200`, 90 bytes

- `$.code` -- Business status code; 200 is success.
- `$.device` -- Device telemetry entry.
- `$.self` -- Self-hosted proxy list or flag.
- `$.ipideaself` -- Self IP-ideal configuration.
- `$.shutiaoself` -- Self configuration (typo key).
- `$.general` -- General entry.

## POST /v2/newbrowser/cloud-accounts/getshopfromproxy

- Client name: `getshopfromproxy_Yun`
- HTTP 200, code `200`, 54 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.shopinfo` -- Bound environment rows.
- `$.total` -- Total number of records matching the query.

## POST /v2/newbrowser/cloud-accounts/num-vis

- Client name: `cloudAccountsNumVis`
- HTTP 200, code `200`, 118 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.running` -- Running flag.
- `$.data.expireInWeek` -- Expiring-within-a-week flag.

## POST /v2/newbrowser/cloud-accounts/open/token/get

- Client name: `cloudAccountsAutoOpenTokenGet`
- HTTP 200, code `200`, 414 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.token` -- Session token (sensitive).

## POST /v2/newbrowser/cloud-accounts/page

- Client name: `yunBrowserCloudAccountsPage`
- HTTP 200, code `200`, 3804 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].accountName` -- Display name.
- `$.data.list[].accountId` -- Identifier.
- `$.data.list[].companyId` -- Company identifier.
- `$.data.list[].categoryId` -- Identifier.
- `$.data.list[].deviceType` -- Type discriminator.
- `$.data.list[].proxyId` -- Identifier.
- `$.data.list[].cookies` -- Stored cookie string for the environment.
- `$.data.list[].tagIds` -- Tag identifiers attached to the row.
- `$.data.list[].lastLoginUser` -- User ID of the last environment login.
- `$.data.list[].remark` -- Remark text.
- `$.data.list[].lastLoginAt` -- Timestamp.
- `$.data.list[].isDeleted` -- Whether the row is soft-deleted.
- `$.data.list[].deleteBy` -- User ID that deleted the row.
- `$.data.list[].uiConfigJson` -- Icon URL or identifier.
- `$.data.list[].apiJson` -- Plugin API definition payload.
- `$.data.list[].serial` -- Serial number.
- `$.data.list[].publicIp` -- Public IP address.
- `$.data.list[].system` -- Operating system preset.
- `$.data.list[].kernelVersion` -- Kernel version preset.
- `$.data.list[].kernel` -- Browser kernel name.
- `$.data.list[].userPasswordIds` -- Bound account-record IDs.
- `$.data.list[].country` -- Count.
- `$.data.list[].city` -- Geolocated city.
- `$.data.list[].inspect` -- Proxy inspection/health-check flag.
- `$.data.list[].expiredAt` -- Timestamp.
- `$.data.list[].autoRenew` -- Auto-renew flag.
- `$.data.list[].status` -- Status value.
- `$.data.list[].browserUrl` -- URL.
- `$.data.list[].apiKey` -- Plugin API key.
- `$.data.list[].sessionId` -- Identifier.
- `$.data.list[].productId` -- Identifier.
- `$.data.list[].cloudId` -- Identifier.
- `$.data.list[].orderDetailsNo` -- Order detail number.
- `$.data.list[].orderOid` -- Identifier.
- `$.data.list[].oid` -- Identifier.
- `$.data.list[].isGive` -- Whether the row has been handed over.
- `$.data.list[].expired` -- Whether the plan/subscription is expired.
- `$.data.list[].proxy` -- Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.
- `$.data.list[].proxy.name` -- Display name.
- `$.data.list[].proxy.inlie` -- Proxy source: local, self, or cloud.
- `$.data.list[].proxy.uuid` -- Identifier.
- `$.data.list[].proxy.type` -- Type discriminator.
- `$.data.list[].proxy.product` -- Proxy product/type identifier.
- `$.data.list[].proxy.PublicIP` -- Public IP address.
- `$.data.list[].proxy.ipChannel` -- IP detection channel.
- `$.data.list[].proxy.deviceType` -- Type discriminator.
- `$.data.list[].proxy.randEnv` -- Random-environment flag.
- `$.data.list[].proxy.proxyaddrArr` -- Random proxy address array.
- `$.data.list[].proxy.region` -- Proxy region selection.
- `$.data.list[].proxy.dns` -- DNS fingerprint/proxy block.
- `$.data.list[].proxy.dns.mode` -- Mode flag.
- `$.data.list[].proxy.dns.inside` -- Whether DNS resolution happens inside the tunnel.
- `$.data.list[].proxy.socks5` -- SOCKS5 proxy protocol block.
- `$.data.list[].proxy.socks5.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.socks5.User` -- Username (sensitive).
- `$.data.list[].proxy.socks5.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.http` -- HTTP proxy protocol block.
- `$.data.list[].proxy.http.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.http.User` -- Username (sensitive).
- `$.data.list[].proxy.http.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.https` -- HTTPS proxy protocol block.
- `$.data.list[].proxy.https.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.https.User` -- Username (sensitive).
- `$.data.list[].proxy.https.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.ssh` -- SSH proxy protocol block.
- `$.data.list[].proxy.ssh.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.ssh.User` -- Username (sensitive).
- `$.data.list[].proxy.ssh.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.v2Ray` -- V2Ray proxy protocol block.
- `$.data.list[].proxy.v2Ray.addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.v2Ray.uuid` -- Identifier.
- `$.data.list[].proxy.zhima` -- Zhima proxy protocol block.
- `$.data.list[].proxy.zhima.Url` -- URL.
- `$.data.list[].proxy.zhima.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.data.list[].proxy.dynamic.Url` -- URL.
- `$.data.list[].proxy.dynamic.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic.Type` -- Type discriminator.
- `$.data.list[].createdAt` -- Timestamp.
- `$.data.list[].clientNum` -- Count.
- `$.data.list[].keepalive` -- Whether the session is kept alive.
- `$.data.list[].updatedtime` -- Timestamp.
- `$.data.list[].headless` -- Headless-mode flag.
- `$.data.list[].needRestart` -- Whether the client has to be restarted.
- `$.data.list[].visitNum` -- Count.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/cloud-accounts/popup/get

- Client name: `cloudAccountsPopupGet`
- HTTP 200, code `200`, 89 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.

## POST /v2/newbrowser/cloud-accounts/putPublicInfo

- Client name: `putPublicInfoYun`
- HTTP 200, code `200`, 128 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/cloud-accounts/restart

- Client name: `cloudAccountsRestart`
- HTTP 200, code `500`, 84 bytes, msg `record not found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/cloud-accounts/setproxytoshop

- Client name: `deviceBindAccount_Yun`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/cloud-accounts/update

- Client name: `yunBrowserCloudAccountsUpdate`
- HTTP 200, code `500`, 84 bytes, msg `record not found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/cloud-browser/visit

- Client name: `cloudBrowserVisit`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/configpersonalsettings

- Client name: `configPersonalSettings`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/configsettings

- Client name: `configSettings`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/creatbatchaddxlsxuuid

- Client name: `addxlsxuuid`
- HTTP 200, code `200`, 403 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.company_id` -- Identifier.
- `$.data.user_id` -- Identifier.
- `$.data.import_key` -- Key that identifies one spreadsheet import session.
- `$.data.ip` -- IP address value.
- `$.data.import_type` -- Type discriminator.
- `$.data.total` -- Total number of records matching the query.
- `$.data.success` -- Success flag.
- `$.data.fail` -- Number of rows that failed in the batch job.
- `$.data.finished` -- Batch job state code; 2 was observed for a freshly created session.
- `$.data.created_at` -- Creation timestamp.
- `$.data.updated_at` -- Last update timestamp.

## POST /v2/newbrowser/createUserPassword

- Client name: `createUserPassword`
- HTTP 200, code `200`, 82 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/newbrowser/deletegroups

- Client name: `delefenzu`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/deleteUserPassword

- Client name: `deleteUserPassword`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/deleteUserPasswordRecycle

- Client name: `deleteUserPasswordRecycle`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/getallfonts

- Client name: `getfontlist`
- HTTP 200, code `200`, 12943 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.fonts` -- Font list.
- `$.msg` -- Localized operator-facing result message.
- `$.randomFonts` -- Random font list.

## POST /v2/newbrowser/getalllanguage

- Client name: `getAccountlanguage`
- HTTP 200, code `200`, 18395 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.language` -- Language preset.
- `$.language[].country` -- Count.
- `$.language[].ab` -- A/B experiment bucket.
- `$.language[].ecountry` -- Count.
- `$.language[].name` -- Display name.
- `$.language[].code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/getalluri

- Client name: `getplatform`
- HTTP 200, code `200`, 154 bytes, msg `Success`

- `$.childclass` -- Second-level platform classification.
- `$.childicon` -- Icon URL or identifier.
- `$.code` -- Business status code; 200 is success.
- `$.fatherclass` -- Top-level platform classification.
- `$.grandsonclass` -- Third-level platform classification.
- `$.msg` -- Localized operator-facing result message.

## GET /v2/newbrowser/getallurilist

- Client name: `getallurilist`
- HTTP 200, code `200`, 148065 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].fatherclass` -- Top-level platform classification.
- `$.data[].childclass` -- Second-level platform classification.
- `$.data[].grandsonclass` -- Third-level platform classification.
- `$.data[].platformid` -- Identifier.
- `$.data[].platformname` -- Display name.
- `$.data[].platformicon` -- Icon URL or identifier.
- `$.data[].website` -- Website URL.
- `$.data[].loginurl` -- URL.
- `$.data[].shop_icon` -- Icon URL or identifier.
- `$.data[].father_label` -- Platform parent-class label code.
- `$.data[].child_label` -- Platform child-class label code.
- `$.data[].grandson_label` -- Platform grandson-class label code.

## POST /v2/newbrowser/getalluserselfuri

- Client name: `getalluserself`
- HTTP 200, code `200`, 38 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.self` -- Self-hosted proxy list or flag.

## POST /v2/newbrowser/getauthshopbriefinfolist

- Client name: `getauthshopbriefinfolist`
- HTTP 200, code `200`, 2883 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].shopid` -- Environment or account identifier.
- `$.data.list[].group` -- Group object or name.
- `$.data.list[].group.name` -- Display name.
- `$.data.list[].group.groupid` -- Identifier.
- `$.data.list[].name` -- Display name.
- `$.data.list[].notes` -- Free-text notes.
- `$.data.list[].serial` -- Serial number.
- `$.data.list[].is_star_tag` -- Star/favourite flag.
- `$.data.list[].kernel` -- Browser kernel name.
- `$.data.list[].kernelVersion` -- Kernel version preset.
- `$.data.list[].authorized` -- Authorization record when the row is shared/authorized.
- `$.data.list[].system` -- Operating system preset.
- `$.data.list[].userPasswordIds` -- Bound account-record IDs.
- `$.data.list[].label` -- Tag label object or tag IDs.
- `$.data.list[].proxy` -- Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.
- `$.data.list[].proxy.name` -- Display name.
- `$.data.list[].proxy.inlie` -- Proxy source: local, self, or cloud.
- `$.data.list[].proxy.uuid` -- Identifier.
- `$.data.list[].proxy.type` -- Type discriminator.
- `$.data.list[].proxy.product` -- Proxy product/type identifier.
- `$.data.list[].proxy.PublicIP` -- Public IP address.
- `$.data.list[].proxy.ipChannel` -- IP detection channel.
- `$.data.list[].proxy.deviceType` -- Type discriminator.
- `$.data.list[].proxy.randEnv` -- Random-environment flag.
- `$.data.list[].proxy.proxyaddrArr` -- Random proxy address array.
- `$.data.list[].proxy.region` -- Proxy region selection.
- `$.data.list[].proxy.dns` -- DNS fingerprint/proxy block.
- `$.data.list[].proxy.dns.mode` -- Mode flag.
- `$.data.list[].proxy.dns.inside` -- Whether DNS resolution happens inside the tunnel.
- `$.data.list[].proxy.socks5` -- SOCKS5 proxy protocol block.
- `$.data.list[].proxy.socks5.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.socks5.User` -- Username (sensitive).
- `$.data.list[].proxy.socks5.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.http` -- HTTP proxy protocol block.
- `$.data.list[].proxy.http.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.http.User` -- Username (sensitive).
- `$.data.list[].proxy.http.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.https` -- HTTPS proxy protocol block.
- `$.data.list[].proxy.https.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.https.User` -- Username (sensitive).
- `$.data.list[].proxy.https.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.ssh` -- SSH proxy protocol block.
- `$.data.list[].proxy.ssh.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.ssh.User` -- Username (sensitive).
- `$.data.list[].proxy.ssh.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.v2Ray` -- V2Ray proxy protocol block.
- `$.data.list[].proxy.v2Ray.addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.v2Ray.uuid` -- Identifier.
- `$.data.list[].proxy.zhima` -- Zhima proxy protocol block.
- `$.data.list[].proxy.zhima.Url` -- URL.
- `$.data.list[].proxy.zhima.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.data.list[].proxy.dynamic.Url` -- URL.
- `$.data.list[].proxy.dynamic.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic.Type` -- Type discriminator.
- `$.data.list[].createby` -- Creator user ID.
- `$.data.list[].cloud_id` -- Identifier.
- `$.data.list[].is_give` -- Whether the plan was gifted.
- `$.data.list[].status` -- Status value.
- `$.data.list[].expired_at` -- Timestamp.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/getautomac

- Client name: `getMac`
- HTTP 200, code `200`, 54 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.mac` -- MAC address value.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/getbatchaddxlsxlist

- Client name: `getxlsxlist`
- HTTP 200, code `404`, 83 bytes, msg `资源不存在`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/getbatchaddxlsxprocess

- Client name: `getxlsxprocess`
- HTTP 200, code `200`, 403 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.company_id` -- Identifier.
- `$.data.user_id` -- Identifier.
- `$.data.import_key` -- Key that identifies one spreadsheet import session.
- `$.data.ip` -- IP address value.
- `$.data.import_type` -- Type discriminator.
- `$.data.total` -- Total number of records matching the query.
- `$.data.success` -- Success flag.
- `$.data.fail` -- Number of rows that failed in the batch job.
- `$.data.finished` -- Batch job state code; 2 was observed for a freshly created session.
- `$.data.created_at` -- Creation timestamp.
- `$.data.updated_at` -- Last update timestamp.

## POST /v2/newbrowser/getBindUserPassword

- Client name: `getBindUserPassword`
- HTTP 200, code `200`, 493 bytes

- `$.code` -- Business status code; 200 is success.
- `$.shopinfo` -- Bound environment rows.
- `$.shopinfo[].last_login_at` -- Timestamp.
- `$.shopinfo[].serial` -- Serial number.
- `$.shopinfo[].name` -- Display name.
- `$.shopinfo[].last_login_user` -- User ID of the last login.
- `$.shopinfo[].shopid` -- Environment or account identifier.
- `$.total` -- Total number of records matching the query.

## POST /v2/newbrowser/getconditionshops

- Client name: `getaccountlist`
- HTTP 200, code `200`, 4949 bytes, msg `Success`

- `$.allshopnumb` -- Count.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.shop` -- Environment rows.
- `$.shop[].shopid` -- Environment or account identifier.
- `$.shop[].cdk` -- Redemption/trial code attached to the environment.
- `$.shop[].platformicon` -- Icon URL or identifier.
- `$.shop[].url` -- URL.
- `$.shop[].platformid` -- Identifier.
- `$.shop[].company_id` -- Identifier.
- `$.shop[].group` -- Group object or name.
- `$.shop[].group.name` -- Display name.
- `$.shop[].group.groupid` -- Identifier.
- `$.shop[].name` -- Display name.
- `$.shop[].accounts` -- Count.
- `$.shop[].proxyip` -- Detected egress IP for the environment.
- `$.shop[].Country` -- Count.
- `$.shop[].City` -- Geolocated city.
- `$.shop[].dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.shop[].notes` -- Free-text notes.
- `$.shop[].isstartag` -- Star-tag flag for the environment.
- `$.shop[].topOrder` -- Top ordering value.
- `$.shop[].label` -- Tag label object or tag IDs.
- `$.shop[].createby` -- Creator user ID.
- `$.shop[].authorized` -- Authorization record when the row is shared/authorized.
- `$.shop[].serial` -- Serial number.
- `$.shop[].lastlogintime` -- Timestamp.
- `$.shop[].lastloginUser` -- User ID of the last environment login.
- `$.shop[].createtime` -- Timestamp.
- `$.shop[].updatedtime` -- Timestamp.
- `$.shop[].deletetime` -- Timestamp.
- `$.shop[].thisshare` -- Whether the row is shared by this user.
- `$.shop[].proxyTransfers` -- Whether the proxy was transferred.
- `$.shop[].proxyDel` -- Whether the proxy was deleted.
- `$.shop[].website` -- Website URL.
- `$.shop[].system` -- Operating system preset.
- `$.shop[].proxyId` -- Identifier.
- `$.shop[].device_type` -- Type discriminator.
- `$.shop[].flag` -- Row flag value.
- `$.shop[].originalIp` -- Original IP value.
- `$.shop[].lastUrls` -- Last opened URLs.
- `$.shop[].share_num` -- Count.
- `$.shop[].authorization` -- Authorization state for the row.
- `$.shop[].expired_time` -- Timestamp.
- `$.shop[].isTransfer` -- Whether the environment was transferred.
- `$.shop[].kernelVersion` -- Kernel version preset.
- `$.shop[].kernel` -- Browser kernel name.
- `$.shop[].ipChannel` -- IP detection channel.
- `$.shop[].inspect` -- Proxy inspection/health-check flag.
- `$.shop[].proxy` -- Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.
- `$.shop[].proxy.name` -- Display name.
- `$.shop[].proxy.inlie` -- Proxy source: local, self, or cloud.
- `$.shop[].proxy.uuid` -- Identifier.
- `$.shop[].proxy.type` -- Type discriminator.
- `$.shop[].proxy.product` -- Proxy product/type identifier.
- `$.shop[].proxy.PublicIP` -- Public IP address.
- `$.shop[].proxy.ipChannel` -- IP detection channel.
- `$.shop[].proxy.deviceType` -- Type discriminator.
- `$.shop[].proxy.randEnv` -- Random-environment flag.
- `$.shop[].proxy.proxyaddrArr` -- Random proxy address array.
- `$.shop[].proxy.region` -- Proxy region selection.
- `$.shop[].proxy.dns` -- DNS fingerprint/proxy block.
- `$.shop[].proxy.dns.mode` -- Mode flag.
- `$.shop[].proxy.dns.inside` -- Whether DNS resolution happens inside the tunnel.
- `$.shop[].proxy.socks5` -- SOCKS5 proxy protocol block.
- `$.shop[].proxy.socks5.Addr` -- Proxy protocol host and port.
- `$.shop[].proxy.socks5.User` -- Username (sensitive).
- `$.shop[].proxy.socks5.Passwd` -- Password (sensitive).
- `$.shop[].proxy.http` -- HTTP proxy protocol block.
- `$.shop[].proxy.http.Addr` -- Proxy protocol host and port.
- `$.shop[].proxy.http.User` -- Username (sensitive).
- `$.shop[].proxy.http.Passwd` -- Password (sensitive).
- `$.shop[].proxy.https` -- HTTPS proxy protocol block.
- `$.shop[].proxy.https.Addr` -- Proxy protocol host and port.
- `$.shop[].proxy.https.User` -- Username (sensitive).
- `$.shop[].proxy.https.Passwd` -- Password (sensitive).
- `$.shop[].proxy.ssh` -- SSH proxy protocol block.
- `$.shop[].proxy.ssh.Addr` -- Proxy protocol host and port.
- `$.shop[].proxy.ssh.User` -- Username (sensitive).
- `$.shop[].proxy.ssh.Passwd` -- Password (sensitive).
- `$.shop[].proxy.v2Ray` -- V2Ray proxy protocol block.
- `$.shop[].proxy.v2Ray.addr` -- Proxy protocol host and port.
- `$.shop[].proxy.v2Ray.uuid` -- Identifier.
- `$.shop[].proxy.zhima` -- Zhima proxy protocol block.
- `$.shop[].proxy.zhima.Url` -- URL.
- `$.shop[].proxy.zhima.Interval` -- Dynamic-proxy refresh interval.
- `$.shop[].proxy.dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.shop[].proxy.dynamic.Url` -- URL.
- `$.shop[].proxy.dynamic.Interval` -- Dynamic-proxy refresh interval.
- `$.shop[].proxy.dynamic.Type` -- Type discriminator.
- `$.shop[].userPasswordIds` -- Bound account-record IDs.
- `$.shop[].proxyEndTime` -- Timestamp.
- `$.shop[].passwords` -- Bound account passwords.
- `$.shop[].authority` -- Permission/authority level for the row.
- `$.shop[].storage` -- Storage limit or preference.
- `$.shop[].kernelId` -- Identifier.
- `$.shop[].shareRemark` -- Sharing remark.
- `$.shop[].shareUrl` -- URL.
- `$.shop[].enableClearStorage` -- Enabled flag.
- `$.shop[].clearStorage` -- Whether storage is cleared on launch.

## GET /v2/newbrowser/getconditionshopscount

- Client name: `getconditionshopscount`
- HTTP 200, code `200`, 85 bytes, msg `Success`

- `$.all` -- Aggregate/all entry.
- `$.authorities` -- Authority/permission flags.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.self` -- Self-hosted proxy list or flag.
- `$.share` -- Share flag.
- `$.transfers` -- Transfer flag.

## POST /v2/newbrowser/getCookie

- Client name: `getCookie`
- HTTP 200, code `200`, 80 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/newbrowser/getdefaultfingerlist

- Client name: `getfingerlist`
- HTTP 200, code `200`, 53580 bytes

- `$.code` -- Business status code; 200 is success.
- `$.kernelversion` -- Kernel version preset.
- `$.kernelversion[].id` -- Identifier.
- `$.kernelversion[].version` -- Client/kernel version.
- `$.kernelversion[].beta` -- Kernel build channel (beta).
- `$.Firefoxkernelversion` -- Firefox kernel version preset.
- `$.Firefoxkernelversion[].id` -- Identifier.
- `$.Firefoxkernelversion[].version` -- Client/kernel version.
- `$.Firefoxkernelversion[].beta` -- Kernel build channel (beta).
- `$.system` -- Operating system preset.
- `$.system.Windows` -- Windows platform entry.
- `$.system.Windows[].name` -- Display name.
- `$.system.Windows[].system` -- Operating system preset.
- `$.system.Windows[].browser` -- Browser/kernel family.
- `$.system.Windows[].platformVersion` -- Platform version preset.
- `$.system.Android` -- Identifier.
- `$.system.Android[].name` -- Display name.
- `$.system.Android[].system` -- Operating system preset.
- `$.system.Android[].browser` -- Browser/kernel family.
- `$.system.Android[].platformVersion` -- Platform version preset.
- `$.system.MacOS` -- macOS platform entry.
- `$.system.MacOS[].name` -- Display name.
- `$.system.MacOS[].system` -- Operating system preset.
- `$.system.MacOS[].browser` -- Browser/kernel family.
- `$.system.MacOS[].platformVersion` -- Platform version preset.
- `$.system.IOS` -- iOS platform entry.
- `$.system.IOS[].name` -- Display name.
- `$.system.IOS[].system` -- Operating system preset.
- `$.system.IOS[].browser` -- Browser/kernel family.
- `$.system.IOS[].platformVersion` -- Platform version preset.
- `$.system.Linux` -- Linux platform entry.
- `$.system.Linux[].name` -- Display name.
- `$.system.Linux[].system` -- Operating system preset.
- `$.system.Linux[].browser` -- Browser/kernel family.
- `$.system.Linux[].platformVersion` -- Platform version preset.
- `$.UAversion` -- UA version preset.
- `$.FirefoxUAversion` -- Firefox UA version preset.
- `$.language` -- Language preset.
- `$.language[].country` -- Count.
- `$.language[].ab` -- A/B experiment bucket.
- `$.language[].ecountry` -- Count.
- `$.language[].name` -- Display name.
- `$.language[].code` -- Business status code; 200 is success.
- `$.zone` -- Timezone preset.
- `$.dpi` -- Device pixel ratio preset.
- `$.widowssize` -- Window-size preset.
- `$.webgl` -- WebGL fingerprint mode.
- `$.webgl.windows` -- Windows platform entry.
- `$.webgl.windows.manufacturer` -- Device manufacturer value.
- `$.webgl.windows.manufacturer[].vendor` -- Vendor fingerprint value.
- `$.webgl.windows.manufacturer[].renderer` -- Renderer fingerprint value.
- `$.cpu` -- CPU core count preset.
- `$.mem` -- Memory preset (GB).
- `$.platformKernelversion` -- Platform-specific kernel version preset.
- `$.platformKernelversion.cloudPC` -- Cloud-PC kernel entry.
- `$.platformKernelversion.cloudPC.chrome` -- Chrome kernel build entry.
- `$.platformKernelversion.cloudPC.chrome[].id` -- Identifier.
- `$.platformKernelversion.cloudPC.chrome[].version` -- Client/kernel version.
- `$.platformKernelversion.cloudPC.chrome[].beta` -- Kernel build channel (beta).
- `$.platformKernelversion.linuxPC` -- Linux-PC kernel entry.
- `$.platformKernelversion.linuxPC.chrome` -- Chrome kernel build entry.
- `$.platformKernelversion.linuxPC.chrome[].id` -- Identifier.
- `$.platformKernelversion.linuxPC.chrome[].version` -- Client/kernel version.
- `$.platformKernelversion.linuxPC.chrome[].beta` -- Kernel build channel (beta).
- `$.platformKernelversion.macosPC` -- macOS-PC kernel entry.
- `$.platformKernelversion.macosPC.chrome` -- Chrome kernel build entry.
- `$.platformKernelversion.macosPC.chrome[].id` -- Identifier.
- `$.platformKernelversion.macosPC.chrome[].version` -- Client/kernel version.
- `$.platformKernelversion.macosPC.chrome[].beta` -- Kernel build channel (beta).
- `$.platformKernelversion.windowsPC` -- Windows-PC kernel entry.
- `$.platformKernelversion.windowsPC.chrome` -- Chrome kernel build entry.
- `$.platformKernelversion.windowsPC.chrome[].id` -- Identifier.
- `$.platformKernelversion.windowsPC.chrome[].version` -- Client/kernel version.
- `$.platformKernelversion.windowsPC.chrome[].beta` -- Kernel build channel (beta).
- `$.platformKernelversion.windowsPC.firefox` -- Firefox kernel build entry.
- `$.platformKernelversion.windowsPC.firefox[].id` -- Identifier.
- `$.platformKernelversion.windowsPC.firefox[].version` -- Client/kernel version.
- `$.platformKernelversion.windowsPC.firefox[].beta` -- Kernel build channel (beta).

## POST /v2/newbrowser/getfingerprinturi

- Client name: `getfingerprin`
- HTTP 200, code `200`, 1961 bytes

- `$.code` -- Business status code; 200 is success.
- `$.browseinfo` -- Environment template body returned by fingerprint-uri.
- `$.browseinfo.name` -- Display name.
- `$.browseinfo.notes` -- Free-text notes.
- `$.browseinfo.labelid` -- Tag identifier / tag display name.
- `$.browseinfo.user_password_ids` -- Bound account-record IDs.
- `$.browseinfo.is_star_tag` -- Star/favourite flag.
- `$.browseinfo.top_order` -- Top ordering value.
- `$.browseinfo.kernelId` -- Identifier.
- `$.browseinfo.categoryid` -- Identifier.
- `$.browseinfo.shopid` -- Environment or account identifier.
- `$.browseinfo.proxy` -- Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.
- `$.browseinfo.proxy.name` -- Display name.
- `$.browseinfo.proxy.inlie` -- Proxy source: local, self, or cloud.
- `$.browseinfo.proxy.uuid` -- Identifier.
- `$.browseinfo.proxy.type` -- Type discriminator.
- `$.browseinfo.proxy.product` -- Proxy product/type identifier.
- `$.browseinfo.proxy.PublicIP` -- Public IP address.
- `$.browseinfo.proxy.ipChannel` -- IP detection channel.
- `$.browseinfo.proxy.deviceType` -- Type discriminator.
- `$.browseinfo.proxy.randEnv` -- Random-environment flag.
- `$.browseinfo.proxy.proxyaddrArr` -- Random proxy address array.
- `$.browseinfo.proxy.region` -- Proxy region selection.
- `$.browseinfo.proxy.dns` -- DNS fingerprint/proxy block.
- `$.browseinfo.proxy.dns.mode` -- Mode flag.
- `$.browseinfo.proxy.dns.inside` -- Whether DNS resolution happens inside the tunnel.
- `$.browseinfo.proxy.socks5` -- SOCKS5 proxy protocol block.
- `$.browseinfo.proxy.socks5.Addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.socks5.User` -- Username (sensitive).
- `$.browseinfo.proxy.socks5.Passwd` -- Password (sensitive).
- `$.browseinfo.proxy.http` -- HTTP proxy protocol block.
- `$.browseinfo.proxy.http.Addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.http.User` -- Username (sensitive).
- `$.browseinfo.proxy.http.Passwd` -- Password (sensitive).
- `$.browseinfo.proxy.https` -- HTTPS proxy protocol block.
- `$.browseinfo.proxy.https.Addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.https.User` -- Username (sensitive).
- `$.browseinfo.proxy.https.Passwd` -- Password (sensitive).
- `$.browseinfo.proxy.ssh` -- SSH proxy protocol block.
- `$.browseinfo.proxy.ssh.Addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.ssh.User` -- Username (sensitive).
- `$.browseinfo.proxy.ssh.Passwd` -- Password (sensitive).
- `$.browseinfo.proxy.v2Ray` -- V2Ray proxy protocol block.
- `$.browseinfo.proxy.v2Ray.addr` -- Proxy protocol host and port.
- `$.browseinfo.proxy.v2Ray.uuid` -- Identifier.
- `$.browseinfo.proxy.zhima` -- Zhima proxy protocol block.
- `$.browseinfo.proxy.zhima.Url` -- URL.
- `$.browseinfo.proxy.zhima.Interval` -- Dynamic-proxy refresh interval.
- `$.browseinfo.proxy.dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.browseinfo.proxy.dynamic.Url` -- URL.
- `$.browseinfo.proxy.dynamic.Interval` -- Dynamic-proxy refresh interval.
- `$.browseinfo.proxy.dynamic.Type` -- Type discriminator.
- `$.browseinfo.number` -- Count.
- `$.browseinfo.userPasswordPlatforms` -- Platform metadata for the account record.
- `$.browseinfo.accounts` -- Count.
- `$.browseinfo.accounts.cookie` -- Stored cookie payload (sensitive).
- `$.browseinfo.accounts.url` -- URL.
- `$.browseinfo.accounts.name` -- Display name.
- `$.browseinfo.accounts.user` -- Username (sensitive).
- `$.browseinfo.accounts.passwd` -- Password (sensitive).
- `$.browseinfo.accounts.loginurl` -- URL.
- `$.browseinfo.accounts.platformicon` -- Icon URL or identifier.
- `$.browseinfo.accounts.lock` -- Record lock flag.
- `$.browseinfo.accounts.tfa` -- Two-factor authentication secret (sensitive).
- `$.defaultfingerprint` -- Default fingerprint block returned by fingerprint-uri.
- `$.defaultfingerprint.kernel` -- Browser kernel name.
- `$.defaultfingerprint.kernelversion` -- Kernel version preset.
- `$.defaultfingerprint.system` -- Operating system preset.
- `$.defaultfingerprint.nextsystem` -- Alternative operating-system presets.
- `$.defaultfingerprint.nextsystem.Android` -- Identifier.
- `$.defaultfingerprint.nextsystem.MacOS` -- macOS platform entry.
- `$.defaultfingerprint.nextsystem.IOS` -- iOS platform entry.
- `$.defaultfingerprint.nextsystem.Linux` -- Linux platform entry.
- `$.defaultfingerprint.UAversion` -- UA version preset.
- `$.defaultfingerprint.ua` -- User-Agent string.
- `$.defaultfingerprint.language` -- Language preset.
- `$.defaultfingerprint.uilanguage` -- UI language preset.
- `$.defaultfingerprint.zone` -- Timezone preset.
- `$.defaultfingerprint.geographic` -- Geolocation fingerprint block.
- `$.defaultfingerprint.geographic.enable` -- Enabled flag.
- `$.defaultfingerprint.geographic.user` -- Username (sensitive).
- `$.defaultfingerprint.geographic.longitude` -- Geolocation longitude.
- `$.defaultfingerprint.geographic.latitude` -- Geolocation latitude.
- `$.defaultfingerprint.geographic.accuracy` -- Geolocation accuracy value.
- `$.defaultfingerprint.dpi` -- Device pixel ratio preset.
- `$.defaultfingerprint.widowssize` -- Window-size preset.
- `$.defaultfingerprint.font` -- Font fingerprint block.
- `$.defaultfingerprint.font.enable` -- Enabled flag.
- `$.defaultfingerprint.font.list` -- Record array.
- `$.defaultfingerprint.fontfinger` -- Font fingerprint mode.
- `$.defaultfingerprint.WebRTC` -- WebRTC fingerprint mode.
- `$.defaultfingerprint.WebRTCIP` -- WebRTC local IP value.
- `$.defaultfingerprint.Canvas` -- Canvas fingerprint mode.
- `$.defaultfingerprint.WebGl` -- WebGL fingerprint mode.
- `$.defaultfingerprint.WebGlInfo` -- WebGL info mode.
- `$.defaultfingerprint.WebGLVendor` -- WebGL vendor string.
- `$.defaultfingerprint.WebGLRenderer` -- WebGL renderer string.
- `$.defaultfingerprint.AudioContext` -- AudioContext fingerprint mode.
- `$.defaultfingerprint.SpeechVoices` -- SpeechVoices fingerprint mode.
- `$.defaultfingerprint.clientRects` -- ClientRects fingerprint mode.
- `$.defaultfingerprint.mediadevice` -- Media-device fingerprint mode.
- `$.defaultfingerprint.cpu` -- CPU core count preset.
- `$.defaultfingerprint.mem` -- Memory preset (GB).
- `$.defaultfingerprint.devicename` -- Display name.
- `$.defaultfingerprint.mac` -- MAC address value.
- `$.defaultfingerprint.hardware` -- Hardware-concurrency fingerprint mode.
- `$.defaultfingerprint.Bluetooth` -- Bluetooth fingerprint mode.
- `$.defaultfingerprint.Donottrack` -- Do-Not-Track fingerprint mode.
- `$.defaultfingerprint.battery` -- Battery fingerprint mode.
- `$.defaultfingerprint.enablescanport` -- Enabled flag.
- `$.defaultfingerprint.scanport` -- Port-scan fingerprint value.
- `$.defaultfingerprint.enableCookie` -- Enabled flag.
- `$.defaultfingerprint.enableopen` -- Enabled flag.
- `$.defaultfingerprint.enableopenNumber` -- Count.
- `$.defaultfingerprint.riskControl` -- Risk-control mode.
- `$.defaultfingerprint.enablenotice` -- Enabled flag.
- `$.defaultfingerprint.enablepic` -- Enabled flag.
- `$.defaultfingerprint.picsize` -- Image size preference.
- `$.defaultfingerprint.Enablesound` -- Enabled flag.
- `$.defaultfingerprint.Enablevideo` -- Enabled flag.
- `$.defaultfingerprint.ignoreCookieErr` -- Whether cookie read errors are ignored.
- `$.defaultfingerprint.enableGc` -- Enabled flag.
- `$.defaultfingerprint.gcTime` -- Timestamp.
- `$.defaultfingerprint.enableClearStorage` -- Enabled flag.
- `$.defaultfingerprint.enableClearCookie` -- Enabled flag.
- `$.defaultfingerprint.randomFinger` -- Random-fingerprint mode.

## POST /v2/newbrowser/getfingerprinturiua

- Client name: `getfingerua`
- HTTP 200, code `403`, 86 bytes, msg `暂无访问权限`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/getgroups

- Client name: `getgroups`
- HTTP 200, code `200`, 1113 bytes

- `$.code` -- Business status code; 200 is success.
- `$.group` -- Group object or name.
- `$.group[].name` -- Display name.
- `$.group[].gropid` -- Group identifier; the live API also uses the misspelled gropid.
- `$.group[].system_group` -- System-group flag (0 custom, 1 default, 2 transfer).

## POST /v2/newbrowser/getgroupusers

- Client name: `getgroupusers`
- HTTP 200, code `200`, 28 bytes

- `$.code` -- Business status code; 200 is success.
- `$.userlist` -- User list.

## POST /v2/newbrowser/getiduserlist

- Client name: `getUseCountByProxyId`
- HTTP 200, code `200`, 88 bytes

- `$.code` -- Business status code; 200 is success.
- `$.device` -- Device telemetry entry.
- `$.self` -- Self-hosted proxy list or flag.
- `$.ipideaself` -- Self IP-ideal configuration.
- `$.shutiaoself` -- Self configuration (typo key).
- `$.general` -- General entry.

## POST /v2/newbrowser/getLatestOpenAccountIdList

- Client name: `getLatestOpenAccountId`
- HTTP 200, code `200`, 199 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.accountIds` -- Count.

## POST /v2/newbrowser/getpackageinfo

- Client name: `getpackageinfo`
- HTTP 200, code `200`, 58 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.packagenumb` -- Count.
- `$.usednumb` -- Count.

## POST /v2/newbrowser/getrecycleshoplist

- Client name: `getrecycleshoplist`
- HTTP 200, code `200`, 129 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/getsettings

- Client name: `getSettings`
- HTTP 200, code `200`, 950 bytes

- `$.code` -- Business status code; 200 is success.
- `$.globalSettings` -- Team-wide browser preferences.
- `$.globalSettings.enableopen` -- Enabled flag.
- `$.globalSettings.enableopenNumber` -- Count.
- `$.globalSettings.risk_control` -- Risk-control preference.
- `$.globalSettings.load_image` -- Image-loading preference.
- `$.globalSettings.load_image_max_size` -- Maximum image-load size.
- `$.globalSettings.load_video` -- Video-loading preference.
- `$.globalSettings.play_sound` -- Sound-playback preference.
- `$.globalSettings.data_sync` -- Data-sync preference.
- `$.globalSettings.dns` -- DNS fingerprint/proxy block.
- `$.globalSettings.enable_gc` -- Enabled flag.
- `$.globalSettings.gc_time` -- Timestamp.
- `$.globalSettings.enable_clear_storage` -- Enabled flag.
- `$.globalSettings.enable_clear_cookie` -- Enabled flag.
- `$.globalSettings.random_finger` -- Random-fingerprint preference.
- `$.globalSettings.storage` -- Storage limit or preference.
- `$.globalSettings.monitoring` -- Monitoring preference.
- `$.globalSettings.bind_proxy` -- Whether a proxy is bound.
- `$.globalSettings.expired_display` -- Expiry display preference.
- `$.globalSettings.device_authorities` -- Device authority setting.
- `$.kernelWhiteList` -- Allowed kernel versions.
- `$.kernelversion` -- Kernel version preset.
- `$.personalSettings` -- Per-user browser preferences.
- `$.personalSettings.starting_env` -- Starting-environment preference.
- `$.personalSettings.search_engine` -- Default search engine.
- `$.personalSettings.dpi` -- Device pixel ratio preset.
- `$.personalSettings.icon_type` -- Icon URL or identifier.
- `$.personalSettings.language` -- Language preset.
- `$.personalSettings.storage` -- Storage limit or preference.
- `$.personalSettings.sub_search_engine` -- Secondary search engine.
- `$.personalSettings.hot_key` -- Hotkey preference.
- `$.personalSettings.sub_hot_key` -- Secondary hotkey preference.
- `$.personalSettings.batch_start` -- Batch-start preference.
- `$.searchEngineList` -- Available search engines.
- `$.searchEngineList[].site` -- Search-engine site code.
- `$.searchEngineList[].siteDesc` -- Search-engine display name.
- `$.searchEngineList[].url` -- URL.

## POST /v2/newbrowser/getShopAndAuthList

- Client name: `getShopAndAuthList`
- HTTP 200, code `200`, 129 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.accountIds` -- Count.

## POST /v2/newbrowser/getshopbriefinfolist

- Client name: `getshopbriefinfolist`
- HTTP 200, code `200`, 2567 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].shopid` -- Environment or account identifier.
- `$.data.list[].group` -- Group object or name.
- `$.data.list[].group.name` -- Display name.
- `$.data.list[].group.groupid` -- Identifier.
- `$.data.list[].name` -- Display name.
- `$.data.list[].notes` -- Free-text notes.
- `$.data.list[].serial` -- Serial number.
- `$.data.list[].is_star_tag` -- Star/favourite flag.
- `$.data.list[].kernel` -- Browser kernel name.
- `$.data.list[].kernelVersion` -- Kernel version preset.
- `$.data.list[].authorized` -- Authorization record when the row is shared/authorized.
- `$.data.list[].system` -- Operating system preset.
- `$.data.list[].userPasswordIds` -- Bound account-record IDs.
- `$.data.list[].label` -- Tag label object or tag IDs.
- `$.data.list[].proxy` -- Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.
- `$.data.list[].proxy.name` -- Display name.
- `$.data.list[].proxy.inlie` -- Proxy source: local, self, or cloud.
- `$.data.list[].proxy.uuid` -- Identifier.
- `$.data.list[].proxy.type` -- Type discriminator.
- `$.data.list[].proxy.product` -- Proxy product/type identifier.
- `$.data.list[].proxy.PublicIP` -- Public IP address.
- `$.data.list[].proxy.ipChannel` -- IP detection channel.
- `$.data.list[].proxy.deviceType` -- Type discriminator.
- `$.data.list[].proxy.randEnv` -- Random-environment flag.
- `$.data.list[].proxy.proxyaddrArr` -- Random proxy address array.
- `$.data.list[].proxy.region` -- Proxy region selection.
- `$.data.list[].proxy.dns` -- DNS fingerprint/proxy block.
- `$.data.list[].proxy.dns.mode` -- Mode flag.
- `$.data.list[].proxy.dns.inside` -- Whether DNS resolution happens inside the tunnel.
- `$.data.list[].proxy.socks5` -- SOCKS5 proxy protocol block.
- `$.data.list[].proxy.socks5.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.socks5.User` -- Username (sensitive).
- `$.data.list[].proxy.socks5.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.http` -- HTTP proxy protocol block.
- `$.data.list[].proxy.http.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.http.User` -- Username (sensitive).
- `$.data.list[].proxy.http.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.https` -- HTTPS proxy protocol block.
- `$.data.list[].proxy.https.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.https.User` -- Username (sensitive).
- `$.data.list[].proxy.https.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.ssh` -- SSH proxy protocol block.
- `$.data.list[].proxy.ssh.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.ssh.User` -- Username (sensitive).
- `$.data.list[].proxy.ssh.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.v2Ray` -- V2Ray proxy protocol block.
- `$.data.list[].proxy.v2Ray.addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.v2Ray.uuid` -- Identifier.
- `$.data.list[].proxy.zhima` -- Zhima proxy protocol block.
- `$.data.list[].proxy.zhima.Url` -- URL.
- `$.data.list[].proxy.zhima.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.data.list[].proxy.dynamic.Url` -- URL.
- `$.data.list[].proxy.dynamic.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic.Type` -- Type discriminator.
- `$.data.list[].createby` -- Creator user ID.
- `$.data.list[].cloud_id` -- Identifier.
- `$.data.list[].is_give` -- Whether the plan was gifted.
- `$.data.list[].status` -- Status value.
- `$.data.list[].expired_at` -- Timestamp.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/getshopconfigrpa

- Client name: `getaccountinfo`
- HTTP 200, code `200`, 275 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.shopconfig` -- Per-environment RPA/shop configuration list.
- `$.shopconfig[].shopid` -- Environment or account identifier.
- `$.shopconfig[].remark` -- Remark text.
- `$.shopconfig[].name` -- Display name.
- `$.shopconfig[].user` -- Username (sensitive).
- `$.shopconfig[].passwd` -- Password (sensitive).
- `$.shopconfig[].cookies` -- Stored cookie string for the environment.
- `$.shopconfig[].serial` -- Serial number.
- `$.shopconfig[].kernelVersion` -- Kernel version preset.
- `$.shopconfig[].kernel` -- Browser kernel name.
- `$.shopconfig[].kernelId` -- Identifier.
- `$.shopconfig[].system` -- Operating system preset.
- `$.shopconfig[].userPasswordPlatforms` -- Platform metadata for the account record.

## POST /v2/newbrowser/getshopfromproxy

- Client name: `getshopfromproxy`
- HTTP 200, code `200`, 54 bytes, msg `Success`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.shopinfo` -- Bound environment rows.
- `$.total` -- Total number of records matching the query.

## POST /v2/newbrowser/getshopkernelVersions

- Client name: `getshopkernelVersions`
- HTTP 200, code `200`, 152 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].account_id` -- Identifier.
- `$.data[].kernel_version` -- Browser kernel version string.

## POST /v2/newbrowser/getshopnameandproxylist

- Client name: `getShopNameAndProxyList`
- HTTP 200, code `200`, 649 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].shopid` -- Environment or account identifier.
- `$.data[].name` -- Display name.
- `$.data[].Country` -- Count.
- `$.data[].City` -- Geolocated city.
- `$.data[].serial` -- Serial number.
- `$.data[].proxy` -- Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.
- `$.data[].proxy.name` -- Display name.
- `$.data[].proxy.inlie` -- Proxy source: local, self, or cloud.
- `$.data[].proxy.uuid` -- Identifier.
- `$.data[].proxy.type` -- Type discriminator.
- `$.data[].proxy.product` -- Proxy product/type identifier.
- `$.data[].proxy.PublicIP` -- Public IP address.
- `$.data[].proxy.ipChannel` -- IP detection channel.
- `$.data[].proxy.deviceType` -- Type discriminator.
- `$.data[].proxy.randEnv` -- Random-environment flag.
- `$.data[].proxy.proxyaddrArr` -- Random proxy address array.
- `$.data[].proxy.region` -- Proxy region selection.
- `$.data[].proxy.dns` -- DNS fingerprint/proxy block.
- `$.data[].proxy.dns.mode` -- Mode flag.
- `$.data[].proxy.dns.inside` -- Whether DNS resolution happens inside the tunnel.
- `$.data[].proxy.socks5` -- SOCKS5 proxy protocol block.
- `$.data[].proxy.socks5.Addr` -- Proxy protocol host and port.
- `$.data[].proxy.socks5.User` -- Username (sensitive).
- `$.data[].proxy.socks5.Passwd` -- Password (sensitive).
- `$.data[].proxy.http` -- HTTP proxy protocol block.
- `$.data[].proxy.http.Addr` -- Proxy protocol host and port.
- `$.data[].proxy.http.User` -- Username (sensitive).
- `$.data[].proxy.http.Passwd` -- Password (sensitive).
- `$.data[].proxy.https` -- HTTPS proxy protocol block.
- `$.data[].proxy.https.Addr` -- Proxy protocol host and port.
- `$.data[].proxy.https.User` -- Username (sensitive).
- `$.data[].proxy.https.Passwd` -- Password (sensitive).
- `$.data[].proxy.ssh` -- SSH proxy protocol block.
- `$.data[].proxy.ssh.Addr` -- Proxy protocol host and port.
- `$.data[].proxy.ssh.User` -- Username (sensitive).
- `$.data[].proxy.ssh.Passwd` -- Password (sensitive).
- `$.data[].proxy.v2Ray` -- V2Ray proxy protocol block.
- `$.data[].proxy.v2Ray.addr` -- Proxy protocol host and port.
- `$.data[].proxy.v2Ray.uuid` -- Identifier.
- `$.data[].proxy.zhima` -- Zhima proxy protocol block.
- `$.data[].proxy.zhima.Url` -- URL.
- `$.data[].proxy.zhima.Interval` -- Dynamic-proxy refresh interval.
- `$.data[].proxy.dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.data[].proxy.dynamic.Url` -- URL.
- `$.data[].proxy.dynamic.Interval` -- Dynamic-proxy refresh interval.
- `$.data[].proxy.dynamic.Type` -- Type discriminator.

## POST /v2/newbrowser/getuserauthshops

- Client name: `getuserauthshops`
- HTTP 200, code `200`, 2567 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].shopid` -- Environment or account identifier.
- `$.data.list[].group` -- Group object or name.
- `$.data.list[].group.name` -- Display name.
- `$.data.list[].group.groupid` -- Identifier.
- `$.data.list[].name` -- Display name.
- `$.data.list[].notes` -- Free-text notes.
- `$.data.list[].serial` -- Serial number.
- `$.data.list[].is_star_tag` -- Star/favourite flag.
- `$.data.list[].kernel` -- Browser kernel name.
- `$.data.list[].kernelVersion` -- Kernel version preset.
- `$.data.list[].authorized` -- Authorization record when the row is shared/authorized.
- `$.data.list[].system` -- Operating system preset.
- `$.data.list[].userPasswordIds` -- Bound account-record IDs.
- `$.data.list[].label` -- Tag label object or tag IDs.
- `$.data.list[].proxy` -- Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.
- `$.data.list[].proxy.name` -- Display name.
- `$.data.list[].proxy.inlie` -- Proxy source: local, self, or cloud.
- `$.data.list[].proxy.uuid` -- Identifier.
- `$.data.list[].proxy.type` -- Type discriminator.
- `$.data.list[].proxy.product` -- Proxy product/type identifier.
- `$.data.list[].proxy.PublicIP` -- Public IP address.
- `$.data.list[].proxy.ipChannel` -- IP detection channel.
- `$.data.list[].proxy.deviceType` -- Type discriminator.
- `$.data.list[].proxy.randEnv` -- Random-environment flag.
- `$.data.list[].proxy.proxyaddrArr` -- Random proxy address array.
- `$.data.list[].proxy.region` -- Proxy region selection.
- `$.data.list[].proxy.dns` -- DNS fingerprint/proxy block.
- `$.data.list[].proxy.dns.mode` -- Mode flag.
- `$.data.list[].proxy.dns.inside` -- Whether DNS resolution happens inside the tunnel.
- `$.data.list[].proxy.socks5` -- SOCKS5 proxy protocol block.
- `$.data.list[].proxy.socks5.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.socks5.User` -- Username (sensitive).
- `$.data.list[].proxy.socks5.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.http` -- HTTP proxy protocol block.
- `$.data.list[].proxy.http.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.http.User` -- Username (sensitive).
- `$.data.list[].proxy.http.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.https` -- HTTPS proxy protocol block.
- `$.data.list[].proxy.https.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.https.User` -- Username (sensitive).
- `$.data.list[].proxy.https.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.ssh` -- SSH proxy protocol block.
- `$.data.list[].proxy.ssh.Addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.ssh.User` -- Username (sensitive).
- `$.data.list[].proxy.ssh.Passwd` -- Password (sensitive).
- `$.data.list[].proxy.v2Ray` -- V2Ray proxy protocol block.
- `$.data.list[].proxy.v2Ray.addr` -- Proxy protocol host and port.
- `$.data.list[].proxy.v2Ray.uuid` -- Identifier.
- `$.data.list[].proxy.zhima` -- Zhima proxy protocol block.
- `$.data.list[].proxy.zhima.Url` -- URL.
- `$.data.list[].proxy.zhima.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic` -- Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.
- `$.data.list[].proxy.dynamic.Url` -- URL.
- `$.data.list[].proxy.dynamic.Interval` -- Dynamic-proxy refresh interval.
- `$.data.list[].proxy.dynamic.Type` -- Type discriminator.
- `$.data.list[].createby` -- Creator user ID.
- `$.data.list[].cloud_id` -- Identifier.
- `$.data.list[].is_give` -- Whether the plan was gifted.
- `$.data.list[].status` -- Status value.
- `$.data.list[].expired_at` -- Timestamp.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/getUserPasswordList

- Client name: `getUserPasswordList`
- HTTP 200, code `200`, 131 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/getUserPasswordRecycleList

- Client name: `getUserPasswordRecycleList`
- HTTP 200, code `200`, 131 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/migrate/searchuuid

- Client name: `searchuuid`
- HTTP 200, code `200`, 2138 bytes

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].ID` -- Identifier.
- `$.data[].CreatedAt` -- Timestamp.
- `$.data[].UpdatedAt` -- Timestamp.
- `$.data[].DeletedAt` -- Timestamp.
- `$.data[].company_id` -- Identifier.
- `$.data[].user_id` -- Identifier.
- `$.data[].account_id` -- Identifier.
- `$.data[].accountName` -- Display name.
- `$.data[].platform_id` -- Identifier.
- `$.data[].custom_platform_id` -- Identifier.
- `$.data[].platformName` -- Display name.
- `$.data[].name` -- Display name.
- `$.data[].original_ip` -- IP address before the change.
- `$.data[].status` -- Status value.
- `$.data[].uuid` -- Identifier.
- `$.data[].batch` -- Batch identifier.
- `$.data[].max` -- Maximum allowed value.
- `$.data[].expir` -- Expiry value.
- `$.data[].remainder` -- Remaining quantity.
- `$.data[].cookie` -- Stored cookie payload (sensitive).
- `$.data[].finger` -- Fingerprint identifier.
- `$.data[].finger[].kernel` -- Browser kernel name.
- `$.data[].finger[].kernelversion` -- Kernel version preset.
- `$.data[].finger[].system` -- Operating system preset.
- `$.data[].finger[].nextsystem` -- Alternative operating-system presets.
- `$.data[].finger[].nextsystem.Android` -- Identifier.
- `$.data[].finger[].nextsystem.MacOS` -- macOS platform entry.
- `$.data[].finger[].nextsystem.IOS` -- iOS platform entry.
- `$.data[].finger[].nextsystem.Linux` -- Linux platform entry.
- `$.data[].finger[].UAversion` -- UA version preset.
- `$.data[].finger[].ua` -- User-Agent string.
- `$.data[].finger[].language` -- Language preset.
- `$.data[].finger[].uilanguage` -- UI language preset.
- `$.data[].finger[].zone` -- Timezone preset.
- `$.data[].finger[].geographic` -- Geolocation fingerprint block.
- `$.data[].finger[].geographic.enable` -- Enabled flag.
- `$.data[].finger[].geographic.user` -- Username (sensitive).
- `$.data[].finger[].geographic.longitude` -- Geolocation longitude.
- `$.data[].finger[].geographic.latitude` -- Geolocation latitude.
- `$.data[].finger[].geographic.accuracy` -- Geolocation accuracy value.
- `$.data[].finger[].dpi` -- Device pixel ratio preset.
- `$.data[].finger[].widowssize` -- Window-size preset.
- `$.data[].finger[].font` -- Font fingerprint block.
- `$.data[].finger[].font.enable` -- Enabled flag.
- `$.data[].finger[].font.list` -- Record array.
- `$.data[].finger[].fontfinger` -- Font fingerprint mode.
- `$.data[].finger[].WebRTC` -- WebRTC fingerprint mode.
- `$.data[].finger[].WebRTCIP` -- WebRTC local IP value.
- `$.data[].finger[].Canvas` -- Canvas fingerprint mode.
- `$.data[].finger[].WebGl` -- WebGL fingerprint mode.
- `$.data[].finger[].WebGlInfo` -- WebGL info mode.
- `$.data[].finger[].WebGLVendor` -- WebGL vendor string.
- `$.data[].finger[].WebGLRenderer` -- WebGL renderer string.
- `$.data[].finger[].AudioContext` -- AudioContext fingerprint mode.
- `$.data[].finger[].SpeechVoices` -- SpeechVoices fingerprint mode.
- `$.data[].finger[].clientRects` -- ClientRects fingerprint mode.
- `$.data[].finger[].mediadevice` -- Media-device fingerprint mode.
- `$.data[].finger[].cpu` -- CPU core count preset.
- `$.data[].finger[].mem` -- Memory preset (GB).
- `$.data[].finger[].devicename` -- Display name.
- `$.data[].finger[].mac` -- MAC address value.
- `$.data[].finger[].hardware` -- Hardware-concurrency fingerprint mode.
- `$.data[].finger[].Bluetooth` -- Bluetooth fingerprint mode.
- `$.data[].finger[].Donottrack` -- Do-Not-Track fingerprint mode.
- `$.data[].finger[].battery` -- Battery fingerprint mode.
- `$.data[].finger[].enablescanport` -- Enabled flag.
- `$.data[].finger[].scanport` -- Port-scan fingerprint value.
- `$.data[].finger[].enableCookie` -- Enabled flag.
- `$.data[].finger[].enableopen` -- Enabled flag.
- `$.data[].finger[].enableopenNumber` -- Count.
- `$.data[].finger[].riskControl` -- Risk-control mode.
- `$.data[].finger[].enablenotice` -- Enabled flag.
- `$.data[].finger[].enablepic` -- Enabled flag.
- `$.data[].finger[].picsize` -- Image size preference.
- `$.data[].finger[].Enablesound` -- Enabled flag.
- `$.data[].finger[].Enablevideo` -- Enabled flag.
- `$.data[].finger[].ignoreCookieErr` -- Whether cookie read errors are ignored.
- `$.data[].finger[].enableGc` -- Enabled flag.
- `$.data[].finger[].gcTime` -- Timestamp.
- `$.data[].finger[].enableClearStorage` -- Enabled flag.
- `$.data[].finger[].enableClearCookie` -- Enabled flag.
- `$.data[].finger[].randomFinger` -- Random-fingerprint mode.
- `$.total` -- Total number of records matching the query.

## POST /v2/newbrowser/newbieStepCreateShop

- Client name: `newbieStepCreateShop`
- HTTP 200, code `200`, 75 bytes, msg `Success`

- `$.accountId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/postBatchAddUserPassword

- Client name: `postBatchAccount`
- HTTP 200, code `404`, 83 bytes, msg `资源不存在`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/postbatchaddxlsx

- Client name: `addxlsxPost`
- HTTP 200, code `404`, 83 bytes, msg `资源不存在`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/proxy-batch-import

- Client name: `proxyBatchImport`
- HTTP 200, code `200`, 123 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.taskId` -- Identifier.

## POST /v2/newbrowser/proxy-batch-import-res

- Client name: `proxyBatchImportRes`
- HTTP 200, code `200`, 107 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.browsers` -- Environment rows or devices processed by the batch job.
- `$.data.done` -- Whether the asynchronous job has finished.

## POST /v2/newbrowser/putaddlabel

- Client name: `batchlabel`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putaddnotes

- Client name: `BatchRemarks`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putalluri

- Client name: `foundaccount`
- HTTP 200, code `400`, 81 bytes, msg `unknown error`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putchangegroup

- Client name: `changputchang`
- HTTP 200, code `403`, 86 bytes, msg `暂无访问权限`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putdeleteallauthority

- Client name: `putdeleteallauthority`
- HTTP 200, code `4009`, 82 bytes, msg `unknown error`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putdeleteauthority

- Client name: `putdeleteauthority`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putdeletegroupauthority

- Client name: `putdeletegroupauthority`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putdeleteuserselfuri

- Client name: `delealluserself`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putmoveauthority

- Client name: `putmoveauthority`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putnewgroup

- Client name: `addgroups`
- HTTP 200, code `200`, 81 bytes

- `$.categoryid` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.companyid` -- Company identifier.
- `$.createby` -- Creator user ID.
- `$.name` -- Display name.
- `$.updateby` -- Timestamp.

## POST /v2/newbrowser/putOpenUrl

- Client name: `putOpenUrl`
- HTTP 200, code `4011`, 82 bytes, msg `unknown error`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putPublicInfo

- Client name: `putPublicInfo`
- HTTP 200, code `200`, 130 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/putrestoreshop

- Client name: `getputrestoreshop`
- HTTP 200, code `500`, 85 bytes, msg `empty slice found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putsortgroup

- Client name: `groupSort`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putusergroupauthority

- Client name: `putusergroupauthority`
- HTTP 200, code `500`, 85 bytes, msg `empty slice found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putUserPassword

- Client name: `putUserPassword`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putuserselfuri

- Client name: `addalluserself`
- HTTP 200, code `500`, 85 bytes, msg `empty slice found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/putusershopauthority

- Client name: `putusershopauthority`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/quickCreateShop

- Client name: `quickCreate`
- HTTP 200, code `400`, 81 bytes, msg `unknown error`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/resetshopproxy

- Client name: `resetshopproxy`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/resetyunshopproxy

- Client name: `resetyunshopproxy`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/restoreUserPasswordRecycle

- Client name: `restoreUserPasswordRecycle`
- HTTP 200, code `500`, 85 bytes, msg `empty slice found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/retsetshopisstartag

- Client name: `getretsetshopisstartag`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/retsetshopistop

- Client name: `setEnvTop`
- HTTP 200, code `4009`, 82 bytes, msg `unknown error`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/retsetshopName

- Client name: `retsetshopName`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/setCookie

- Client name: `setCookie`
- HTTP 200, code `400`, 81 bytes, msg `unknown error`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/setproxytoshop

- Client name: `deviceBindAccount`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/setShopProxy

- Client name: `setShopProxy`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/shareCompanyIdList

- Client name: `shareCompanyIdList`
- HTTP 200, code `200`, 95 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.companyIds` -- Company IDs.

## POST /v2/newbrowser/sharerCompanyId

- Client name: `sharerCompanyId`
- HTTP 200, code `404`, 83 bytes, msg `资源不存在`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/shareShop

- Client name: `shareShop`
- HTTP 200, code `500`, 85 bytes, msg `empty slice found`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/shareShopClosed

- Client name: `shareShopClosed`
- HTTP 200, code `200`, 80 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/newbrowser/shareShopDel

- Client name: `shareShopDel`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/shareShopList

- Client name: `shareShopList`
- HTTP 200, code `200`, 129 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/shopProxyBound

- Client name: `shopProxyBound`
- HTTP 200, code `200`, 90 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.status` -- Status value.

## POST /v2/newbrowser/storage/del

- Client name: `deleteCloudCache`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/storage/page

- Client name: `getCloudCacheList`
- HTTP 200, code `200`, 129 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/storage/update

- Client name: `updateCloudCache`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/transferCompanyId

- Client name: `transferCompanyId`
- HTTP 200, code `404`, 83 bytes, msg `资源不存在`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/transferShop

- Client name: `transferShop`
- HTTP 200, code `400`, 81 bytes, msg `unknown error`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/transferShopList

- Client name: `transferShopList`
- HTTP 200, code `200`, 129 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/newbrowser/updateUserPassword

- Client name: `updateUserPassword`
- HTTP 200, code `200`, 82 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/newbrowser/updateUserPasswordRemark

- Client name: `updateUserPasswordRemark`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/newbrowser/userPasswordSetAccountId

- Client name: `userPasswordSetAccountId`
- HTTP 200, code `404`, 83 bytes, msg `资源不存在`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## GET /v2/news/settings/info

- Client name: `getNewsSettingsInfo`
- HTTP 200, code `500`, 83 bytes, msg `配置不存在`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/news/show/help/categories

- Client name: `getHelpCategories`
- HTTP 200, code `200`, 889 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].lang` -- Language.
- `$.data.list[].categoryName` -- Display name.
- `$.data.list[].apiurl` -- URL.
- `$.data.list[].status` -- Status value.
- `$.data.list[].uid` -- Identifier.
- `$.data.list[].pid` -- Identifier.
- `$.data.list[].categoryIcon` -- Icon URL or identifier.
- `$.data.list[].sort` -- Sort order.
- `$.data.list[].type` -- Type discriminator.
- `$.data.list[].langCategoryName` -- Display name.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/news/show/help/list

- Client name: `getHelpList`
- HTTP 200, code `200`, 75975 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].url` -- URL.
- `$.data.list[].lang` -- Language.
- `$.data.list[].title` -- Title text.
- `$.data.list[].subtitle` -- Subtitle.
- `$.data.list[].keyword` -- Keyword.
- `$.data.list[].tags` -- Tag list.
- `$.data.list[].categoryId` -- Identifier.
- `$.data.list[].subdomain` -- Subdomain.
- `$.data.list[].img` -- Image URL.
- `$.data.list[].content` -- Log or notice body text.
- `$.data.list[].status` -- Status value.
- `$.data.list[].uid` -- Identifier.
- `$.data.list[].author` -- Author name or identifier.
- `$.data.list[].publishAt` -- Timestamp.
- `$.data.list[].sort` -- Sort order.
- `$.data.list[].flag` -- Row flag value.
- `$.data.list[].flagSort` -- Sort flag.
- `$.data.list[].createdAt` -- Timestamp.
- `$.data.list[].updatedAt` -- Timestamp.
- `$.data.list[].hits` -- Hit count.
- `$.data.list[].likes` -- Like count.
- `$.data.list[].shares` -- Share count or list.
- `$.data.list[].hot` -- Hot flag.
- `$.data.list[].hasHelp` -- Whether help is available.
- `$.data.list[].noHelp` -- Whether help is unavailable.
- `$.data.list[].seoTitle` -- SEO title.
- `$.data.list[].downloadCount` -- Count.
- `$.data.list[].registerCount` -- Count.
- `$.data.list[].uvCount` -- Count.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## PUT /v2/plugin/bind

- Client name: `bindAccount`
- HTTP 200, code `200`, 80 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## POST /v2/plugin/bindGrouopPlugin

- Client name: `bindGrouopPlugin`
- HTTP 200, code `7`, 58 bytes, msg `empty slice found`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/plugin/createPluginCrx

- Client name: `uploadPlugin`
- HTTP 200, code `30009`, 63 bytes, msg `插件已存在`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/plugin/downloadFromWebStore

- Client name: `downloadFromWebStore`
- HTTP 200, code `7`, 65 bytes, msg `下载路径不能为空`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.

## GET /v2/plugin/findPluginCompanies

- Client name: `findPluginCompanies`
- HTTP 200, code `200`, 653 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.repluginCompanies` -- Plugin company list.
- `$.data.repluginCompanies.ID` -- Identifier.
- `$.data.repluginCompanies.CreatedAt` -- Timestamp.
- `$.data.repluginCompanies.UpdatedAt` -- Timestamp.
- `$.data.repluginCompanies.accountIds` -- Count.
- `$.data.repluginCompanies.companyId` -- Company identifier.
- `$.data.repluginCompanies.companyName` -- Display name.
- `$.data.repluginCompanies.pluginId` -- Identifier.
- `$.data.repluginCompanies.pluginName` -- Display name.
- `$.data.repluginCompanies.uids` -- UID list.
- `$.data.repluginCompanies.pluginCompanyId` -- Company identifier.
- `$.data.repluginCompanies.kernel` -- Browser kernel name.
- `$.data.repluginCompanies.userId` -- User identifier.
- `$.data.repluginCompanies.uplinkId` -- Identifier.
- `$.data.repluginCompanies.isGlobal` -- Global flag.
- `$.data.repluginCompanies.isTeam` -- Team flag.
- `$.data.repluginCompanies.groupId` -- Identifier.
- `$.data.repluginCompanies.groupName` -- Display name.
- `$.data.repluginCompanies.pluginType` -- Plugin category; client label `插件分类` / `Extension Categories`.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/plugin/findPluginCrx

- Client name: `pluginDetail`
- HTTP 200, code `200`, 5026 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.repluginCrx` -- Plugin CRX information.
- `$.data.repluginCrx.author` -- Author name or identifier.
- `$.data.repluginCrx.brief` -- Brief description.
- `$.data.repluginCrx.catIds` -- Category IDs.
- `$.data.repluginCrx.companyId` -- Company identifier.
- `$.data.repluginCrx.detail` -- Log detail text.
- `$.data.repluginCrx.ext` -- Extension value.
- `$.data.repluginCrx.ext.action` -- Available action identifier.
- `$.data.repluginCrx.ext.action.default_icon` -- Icon URL or identifier.
- `$.data.repluginCrx.ext.action.default_icon.16` -- Array-indexed entry.
- `$.data.repluginCrx.ext.action.default_icon.32` -- Array-indexed entry.
- `$.data.repluginCrx.ext.action.default_icon.48` -- Array-indexed entry.
- `$.data.repluginCrx.ext.action.default_icon.128` -- Array-indexed entry.
- `$.data.repluginCrx.ext.background` -- Background image URL.
- `$.data.repluginCrx.ext.background.service_worker` -- Plugin service worker.
- `$.data.repluginCrx.ext.content_scripts` -- Plugin content scripts.
- `$.data.repluginCrx.ext.content_scripts[].css` -- Plugin CSS resources.
- `$.data.repluginCrx.ext.content_scripts[].js` -- Plugin JS resources.
- `$.data.repluginCrx.ext.content_scripts[].matches` -- Match rules or results.
- `$.data.repluginCrx.ext.default_locale` -- Default locale.
- `$.data.repluginCrx.ext.description` -- Description.
- `$.data.repluginCrx.ext.icons` -- Icon URL or identifier.
- `$.data.repluginCrx.ext.icons.16` -- Array-indexed entry.
- `$.data.repluginCrx.ext.icons.32` -- Array-indexed entry.
- `$.data.repluginCrx.ext.icons.48` -- Array-indexed entry.
- `$.data.repluginCrx.ext.icons.128` -- Array-indexed entry.
- `$.data.repluginCrx.ext.manifest_version` -- Plugin manifest version.
- `$.data.repluginCrx.ext.name` -- Display name.
- `$.data.repluginCrx.ext.permissions` -- Permission list.
- `$.data.repluginCrx.ext.update_url` -- Timestamp.
- `$.data.repluginCrx.ext.version` -- Client/kernel version.
- `$.data.repluginCrx.ext.web_accessible_resources` -- Plugin web-accessible resources.
- `$.data.repluginCrx.ext.web_accessible_resources[].matches` -- Match rules or results.
- `$.data.repluginCrx.ext.web_accessible_resources[].resources` -- Resource list.
- `$.data.repluginCrx.file` -- File entry.
- `$.data.repluginCrx.hot` -- Hot flag.
- `$.data.repluginCrx.icon` -- Icon URL or identifier.
- `$.data.repluginCrx.imgs` -- Image list.
- `$.data.repluginCrx.imgs[].name` -- Display name.
- `$.data.repluginCrx.imgs[].uid` -- Identifier.
- `$.data.repluginCrx.imgs[].url` -- URL.
- `$.data.repluginCrx.card` -- Card/bank-card entry.
- `$.data.repluginCrx.installNum` -- Count.
- `$.data.repluginCrx.isDev` -- Development flag.
- `$.data.repluginCrx.isOpen` -- Open flag.
- `$.data.repluginCrx.lookNum` -- Count.
- `$.data.repluginCrx.name` -- Display name.
- `$.data.repluginCrx.permissions` -- Permission list.
- `$.data.repluginCrx.sort` -- Sort order.
- `$.data.repluginCrx.uuid` -- Identifier.
- `$.data.repluginCrx.version` -- Client/kernel version.
- `$.data.repluginCrx.pluginId` -- Identifier.
- `$.data.repluginCrx.accountIds` -- Count.
- `$.data.repluginCrx.category` -- Category.
- `$.data.repluginCrx.uids` -- UID list.
- `$.data.repluginCrx.CreatedAt` -- Timestamp.
- `$.data.repluginCrx.UpdatedAt` -- Timestamp.
- `$.data.repluginCrx.installStatus` -- Status value.
- `$.data.repluginCrx.kernel` -- Browser kernel name.
- `$.data.repluginCrx.firefoxFile` -- Firefox package file.
- `$.data.repluginCrx.firefoxPermissions` -- Firefox plugin permissions.
- `$.data.repluginCrx.firefoxExt` -- Firefox extension file.
- `$.data.repluginCrx.firefoxUuid` -- Identifier.
- `$.data.repluginCrx.firefoxVersion` -- Firefox version.
- `$.data.repluginCrx.plugin_type` -- Type discriminator.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/plugin/getAddedAndGlobalplugin

- Client name: `getAddedAndGlobalplugin`
- HTTP 200, code `200`, 913 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.distributionPlugin` -- Distribution (added) plugin list.
- `$.data.globalPlugin` -- Globally available plugin list.
- `$.data.globalPlugin[].accountIds` -- Count.
- `$.data.globalPlugin[].pluginId` -- Identifier.
- `$.data.globalPlugin[].uids` -- UID list.
- `$.data.globalPlugin[].companyId` -- Company identifier.
- `$.data.globalPlugin[].uuid` -- Identifier.
- `$.data.globalPlugin[].userName` -- Display name.
- `$.data.globalPlugin[].nickName` -- Display name.
- `$.data.globalPlugin[].version` -- Client/kernel version.
- `$.data.globalPlugin[].pluginCompanyId` -- Company identifier.
- `$.data.globalPlugin[].permissions` -- Permission list.
- `$.data.globalPlugin[].name` -- Display name.
- `$.data.globalPlugin[].icon` -- Icon URL or identifier.
- `$.data.globalPlugin[].card` -- Card/bank-card entry.
- `$.data.globalPlugin[].brief` -- Brief description.
- `$.data.globalPlugin[].author` -- Author name or identifier.
- `$.data.globalPlugin[].catIds` -- Category IDs.
- `$.data.globalPlugin[].CreatedAt` -- Timestamp.
- `$.data.globalPlugin[].lookNum` -- Count.
- `$.data.globalPlugin[].installNum` -- Count.
- `$.data.globalPlugin[].sort` -- Sort order.
- `$.data.globalPlugin[].installStatus` -- Status value.
- `$.data.globalPlugin[].kernel` -- Browser kernel name.
- `$.data.globalPlugin[].firefoxVersion` -- Firefox version.
- `$.data.globalPlugin[].firefoxPermissions` -- Firefox plugin permissions.
- `$.data.globalPlugin[].firefoxUuid` -- Identifier.
- `$.data.globalPlugin[].userId` -- User identifier.
- `$.data.globalPlugin[].uplinkId` -- Identifier.
- `$.data.globalPlugin[].isGlobal` -- Global flag.
- `$.data.globalPlugin[].isTeam` -- Team flag.
- `$.data.globalPlugin[].groupId` -- Identifier.
- `$.data.globalPlugin[].groupName` -- Display name.
- `$.data.globalPlugin[].pluginType` -- Plugin category; client label `插件分类` / `Extension Categories`.
- `$.data.globalPlugin[].detail` -- Log detail text.
- `$.data.globalPlugin[].teamStatus` -- Status value.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/plugin/getPluginCategoryGroupCrxList

- Client name: `getPluginCategoryGroupCrxList`
- HTTP 200, code ``, 87195 bytes

- `$.list` -- Record array.
- `$.list[].ID` -- Identifier.
- `$.list[].sort` -- Sort order.
- `$.list[].title` -- Title text.
- `$.list[].type` -- Type discriminator.
- `$.list[].crx` -- Plugin CRX package.
- `$.list[].crx[].uuid` -- Identifier.
- `$.list[].crx[].name` -- Display name.
- `$.list[].crx[].icon` -- Icon URL or identifier.
- `$.list[].crx[].card` -- Card/bank-card entry.
- `$.list[].crx[].brief` -- Brief description.
- `$.list[].crx[].author` -- Author name or identifier.
- `$.list[].crx[].permissions` -- Permission list.
- `$.list[].crx[].catIds` -- Category IDs.
- `$.list[].crx[].CreatedAt` -- Timestamp.
- `$.list[].crx[].lookNum` -- Count.
- `$.list[].crx[].installNum` -- Count.
- `$.list[].crx[].sort` -- Sort order.
- `$.list[].crx[].accountIds` -- Count.
- `$.list[].crx[].pluginId` -- Identifier.
- `$.list[].crx[].installStatus` -- Status value.
- `$.list[].crx[].kernel` -- Browser kernel name.
- `$.list[].crx[].firefoxPermissions` -- Firefox plugin permissions.
- `$.list[].crx[].firefoxUuid` -- Identifier.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/plugin/getPluginCategoryGroupList

- Client name: `getPluginCategoryGroupList`
- HTTP 200, code ``, 2033 bytes

- `$.list` -- Record array.
- `$.list[].type` -- Type discriminator.
- `$.list[].list` -- Record array.
- `$.list[].list[].ID` -- Identifier.
- `$.list[].list[].title` -- Title text.
- `$.list[].list[].sort` -- Sort order.
- `$.list[].list[].type` -- Type discriminator.
- `$.list[].typeText` -- Type display text.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/plugin/getPluginCompaniesPersonageList

- Client name: `getPluginCompaniesPersonageList`
- HTTP 200, code ``, 3325 bytes

- `$.list` -- Record array.
- `$.list[].accountIds` -- Count.
- `$.list[].pluginId` -- Identifier.
- `$.list[].uids` -- UID list.
- `$.list[].companyId` -- Company identifier.
- `$.list[].uuid` -- Identifier.
- `$.list[].userName` -- Display name.
- `$.list[].nickName` -- Display name.
- `$.list[].version` -- Client/kernel version.
- `$.list[].pluginCompanyId` -- Company identifier.
- `$.list[].permissions` -- Permission list.
- `$.list[].name` -- Display name.
- `$.list[].icon` -- Icon URL or identifier.
- `$.list[].card` -- Card/bank-card entry.
- `$.list[].brief` -- Brief description.
- `$.list[].author` -- Author name or identifier.
- `$.list[].catIds` -- Category IDs.
- `$.list[].CreatedAt` -- Timestamp.
- `$.list[].lookNum` -- Count.
- `$.list[].installNum` -- Count.
- `$.list[].sort` -- Sort order.
- `$.list[].installStatus` -- Status value.
- `$.list[].kernel` -- Browser kernel name.
- `$.list[].firefoxVersion` -- Firefox version.
- `$.list[].firefoxPermissions` -- Firefox plugin permissions.
- `$.list[].firefoxUuid` -- Identifier.
- `$.list[].userId` -- User identifier.
- `$.list[].uplinkId` -- Identifier.
- `$.list[].isGlobal` -- Global flag.
- `$.list[].isTeam` -- Team flag.
- `$.list[].groupId` -- Identifier.
- `$.list[].groupName` -- Display name.
- `$.list[].pluginType` -- Plugin category; client label `插件分类` / `Extension Categories`.
- `$.list[].detail` -- Log detail text.
- `$.list[].teamStatus` -- Status value.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/plugin/getPluginCrxLike

- Client name: `similarPluginList`
- HTTP 200, code ``, 52 bytes

- `$.list` -- Record array.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/plugin/getPluginCrxList

- Client name: `getPluginCrxList`
- HTTP 200, code ``, 26213 bytes

- `$.list` -- Record array.
- `$.list[].uuid` -- Identifier.
- `$.list[].name` -- Display name.
- `$.list[].permissions` -- Permission list.
- `$.list[].icon` -- Icon URL or identifier.
- `$.list[].card` -- Card/bank-card entry.
- `$.list[].brief` -- Brief description.
- `$.list[].author` -- Author name or identifier.
- `$.list[].catIds` -- Category IDs.
- `$.list[].CreatedAt` -- Timestamp.
- `$.list[].UpdatedAt` -- Timestamp.
- `$.list[].lookNum` -- Count.
- `$.list[].installNum` -- Count.
- `$.list[].sort` -- Sort order.
- `$.list[].accountIds` -- Count.
- `$.list[].pluginId` -- Identifier.
- `$.list[].installStatus` -- Status value.
- `$.list[].kernel` -- Browser kernel name.
- `$.list[].firefoxPermissions` -- Firefox plugin permissions.
- `$.list[].firefoxUuid` -- Identifier.
- `$.list[].pluginType` -- Plugin category; client label `插件分类` / `Extension Categories`.
- `$.list[].pluginCompanyId` -- Company identifier.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/plugin/getPluginCrxUserList

- Client name: `getPluginCrxUserList`
- HTTP 200, code ``, 1770 bytes

- `$.list` -- Record array.
- `$.list[].uuid` -- Identifier.
- `$.list[].name` -- Display name.
- `$.list[].permissions` -- Permission list.
- `$.list[].icon` -- Icon URL or identifier.
- `$.list[].card` -- Card/bank-card entry.
- `$.list[].brief` -- Brief description.
- `$.list[].author` -- Author name or identifier.
- `$.list[].catIds` -- Category IDs.
- `$.list[].CreatedAt` -- Timestamp.
- `$.list[].UpdatedAt` -- Timestamp.
- `$.list[].lookNum` -- Count.
- `$.list[].installNum` -- Count.
- `$.list[].sort` -- Sort order.
- `$.list[].accountIds` -- Count.
- `$.list[].pluginId` -- Identifier.
- `$.list[].installStatus` -- Status value.
- `$.list[].kernel` -- Browser kernel name.
- `$.list[].firefoxPermissions` -- Firefox plugin permissions.
- `$.list[].firefoxUuid` -- Identifier.
- `$.list[].pluginType` -- Plugin category; client label `插件分类` / `Extension Categories`.
- `$.list[].pluginCompanyId` -- Company identifier.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/plugin/getPluginHeatSearchesList

- Client name: `hotSearchWords`
- HTTP 200, code ``, 243 bytes

- `$.list` -- Record array.
- `$.list[].heatWord` -- Hot-search word.
- `$.list[].sort` -- Sort order.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/plugin/group/accountGroupList

- Client name: `accountGroupList`
- HTTP 200, code `7`, 59 bytes, msg `缺少必要参数`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/plugin/group/copyPluginGroup

- Client name: `copyPluginGroup`
- HTTP 200, code `200`, 55 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/plugin/group/getPluginGroupId

- Client name: `getPluginGroupId`
- HTTP 200, code `200`, 258 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.groupInfo` -- Plugin group detail object.
- `$.data.groupInfo.ID` -- Identifier.
- `$.data.groupInfo.CreatedAt` -- Timestamp.
- `$.data.groupInfo.UpdatedAt` -- Timestamp.
- `$.data.groupInfo.groupId` -- Identifier.
- `$.data.groupInfo.companyId` -- Company identifier.
- `$.data.groupInfo.userId` -- User identifier.
- `$.data.groupInfo.groupName` -- Display name.
- `$.data.groupInfo.isGlobal` -- Global flag.
- `$.data.groupInfo.groupType` -- Type discriminator.
- `$.data.groupInfo.remark` -- Remark text.
- `$.data.groupPlugin` -- Plugins attached to a plugin group.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/plugin/group/gitGroupPluginList

- Client name: `gitGroupPluginList`
- HTTP 200, code `200`, 2446 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.globalPlugin` -- Globally available plugin list.
- `$.data.globalPlugin.list` -- Record array.
- `$.data.globalPlugin.count` -- Count.
- `$.data.globalPlugin.pageIndex` -- Current page index.
- `$.data.globalPlugin.pageSize` -- Number of records requested per page.
- `$.data.userPlugin` -- User plugin list block.
- `$.data.userPlugin.list` -- Record array.
- `$.data.userPlugin.list[].pluginGroup` -- Plugin group the row belongs to.
- `$.data.userPlugin.list[].pluginGroup.ID` -- Identifier.
- `$.data.userPlugin.list[].pluginGroup.CreatedAt` -- Timestamp.
- `$.data.userPlugin.list[].pluginGroup.UpdatedAt` -- Timestamp.
- `$.data.userPlugin.list[].pluginGroup.groupId` -- Identifier.
- `$.data.userPlugin.list[].pluginGroup.companyId` -- Company identifier.
- `$.data.userPlugin.list[].pluginGroup.userId` -- User identifier.
- `$.data.userPlugin.list[].pluginGroup.groupName` -- Display name.
- `$.data.userPlugin.list[].pluginGroup.isGlobal` -- Global flag.
- `$.data.userPlugin.list[].pluginGroup.groupType` -- Type discriminator.
- `$.data.userPlugin.list[].pluginGroup.remark` -- Remark text.
- `$.data.userPlugin.list[].companies` -- Companies the plugin or row is shared with.
- `$.data.userPlugin.list[].companies[].accountIds` -- Count.
- `$.data.userPlugin.list[].companies[].pluginId` -- Identifier.
- `$.data.userPlugin.list[].companies[].uids` -- UID list.
- `$.data.userPlugin.list[].companies[].companyId` -- Company identifier.
- `$.data.userPlugin.list[].companies[].uuid` -- Identifier.
- `$.data.userPlugin.list[].companies[].userName` -- Display name.
- `$.data.userPlugin.list[].companies[].nickName` -- Display name.
- `$.data.userPlugin.list[].companies[].version` -- Client/kernel version.
- `$.data.userPlugin.list[].companies[].pluginCompanyId` -- Company identifier.
- `$.data.userPlugin.list[].companies[].permissions` -- Permission list.
- `$.data.userPlugin.list[].companies[].name` -- Display name.
- `$.data.userPlugin.list[].companies[].icon` -- Icon URL or identifier.
- `$.data.userPlugin.list[].companies[].card` -- Card/bank-card entry.
- `$.data.userPlugin.list[].companies[].brief` -- Brief description.
- `$.data.userPlugin.list[].companies[].author` -- Author name or identifier.
- `$.data.userPlugin.list[].companies[].catIds` -- Category IDs.
- `$.data.userPlugin.list[].companies[].CreatedAt` -- Timestamp.
- `$.data.userPlugin.list[].companies[].lookNum` -- Count.
- `$.data.userPlugin.list[].companies[].installNum` -- Count.
- `$.data.userPlugin.list[].companies[].sort` -- Sort order.
- `$.data.userPlugin.list[].companies[].installStatus` -- Status value.
- `$.data.userPlugin.list[].companies[].kernel` -- Browser kernel name.
- `$.data.userPlugin.list[].companies[].firefoxVersion` -- Firefox version.
- `$.data.userPlugin.list[].companies[].firefoxPermissions` -- Firefox plugin permissions.
- `$.data.userPlugin.list[].companies[].firefoxUuid` -- Identifier.
- `$.data.userPlugin.list[].companies[].userId` -- User identifier.
- `$.data.userPlugin.list[].companies[].uplinkId` -- Identifier.
- `$.data.userPlugin.list[].companies[].isGlobal` -- Global flag.
- `$.data.userPlugin.list[].companies[].isTeam` -- Team flag.
- `$.data.userPlugin.list[].companies[].groupId` -- Identifier.
- `$.data.userPlugin.list[].companies[].groupName` -- Display name.
- `$.data.userPlugin.list[].companies[].pluginType` -- Plugin category; client label `插件分类` / `Extension Categories`.
- `$.data.userPlugin.list[].companies[].detail` -- Log detail text.
- `$.data.userPlugin.list[].companies[].teamStatus` -- Status value.
- `$.data.userPlugin.count` -- Count.
- `$.data.userPlugin.pageIndex` -- Current page index.
- `$.data.userPlugin.pageSize` -- Number of records requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/plugin/group/gitPluginGroupList

- Client name: `gitPluginGroupList`
- HTTP 200, code ``, 663 bytes

- `$.list` -- Record array.
- `$.list[].pluginGroup` -- Plugin group the row belongs to.
- `$.list[].pluginGroup.ID` -- Identifier.
- `$.list[].pluginGroup.CreatedAt` -- Timestamp.
- `$.list[].pluginGroup.UpdatedAt` -- Timestamp.
- `$.list[].pluginGroup.groupId` -- Identifier.
- `$.list[].pluginGroup.companyId` -- Company identifier.
- `$.list[].pluginGroup.userId` -- User identifier.
- `$.list[].pluginGroup.groupName` -- Display name.
- `$.list[].pluginGroup.isGlobal` -- Global flag.
- `$.list[].pluginGroup.groupType` -- Type discriminator.
- `$.list[].pluginGroup.remark` -- Remark text.
- `$.list[].amount` -- Amount value.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## PUT /v2/plugin/group/updatePluginGroup

- Client name: `updatePluginGroup`
- HTTP 200, code `200`, 48 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## POST /v2/plugin/install

- Client name: `installPlugin`
- HTTP 200, code `200`, 80 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/plugin/myPlugin

- Client name: `myPlugin`
- HTTP 200, code ``, 3333 bytes

- `$.list` -- Record array.
- `$.list[].accountIds` -- Count.
- `$.list[].pluginId` -- Identifier.
- `$.list[].uids` -- UID list.
- `$.list[].companyId` -- Company identifier.
- `$.list[].uuid` -- Identifier.
- `$.list[].userName` -- Display name.
- `$.list[].nickName` -- Display name.
- `$.list[].version` -- Client/kernel version.
- `$.list[].pluginCompanyId` -- Company identifier.
- `$.list[].permissions` -- Permission list.
- `$.list[].name` -- Display name.
- `$.list[].icon` -- Icon URL or identifier.
- `$.list[].card` -- Card/bank-card entry.
- `$.list[].brief` -- Brief description.
- `$.list[].author` -- Author name or identifier.
- `$.list[].catIds` -- Category IDs.
- `$.list[].CreatedAt` -- Timestamp.
- `$.list[].lookNum` -- Count.
- `$.list[].installNum` -- Count.
- `$.list[].sort` -- Sort order.
- `$.list[].installStatus` -- Status value.
- `$.list[].kernel` -- Browser kernel name.
- `$.list[].firefoxVersion` -- Firefox version.
- `$.list[].firefoxPermissions` -- Firefox plugin permissions.
- `$.list[].firefoxUuid` -- Identifier.
- `$.list[].userId` -- User identifier.
- `$.list[].uplinkId` -- Identifier.
- `$.list[].isGlobal` -- Global flag.
- `$.list[].isTeam` -- Team flag.
- `$.list[].groupId` -- Identifier.
- `$.list[].groupName` -- Display name.
- `$.list[].pluginType` -- Plugin category; client label `插件分类` / `Extension Categories`.
- `$.list[].detail` -- Log detail text.
- `$.list[].teamStatus` -- Status value.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## POST /v2/plugin/updateGlobalVisibility

- Client name: `updateGlobalVisibility`
- HTTP 200, code `200`, 48 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## PUT /v2/plugin/updatePluginCrx

- Client name: `updatePluginCrx`
- HTTP 200, code `30009`, 63 bytes, msg `插件已存在`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## POST /v2/plugin/updateTeamVisibility

- Client name: `updateTeamVisibility`
- HTTP 200, code `200`, 48 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/plugin/updateTeamVisibilityJurisdiction

- Client name: `updateTeamVisibilityJurisdiction`
- HTTP 200, code `200`, 62 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.teamStatus` -- Status value.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## POST /v2/proxy/authority/deal

- Client name: `proxyAuthDeal`
- HTTP 200, code `401`, 116 bytes, msg `DealAuthority is empty`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/authority/get

- Client name: `proxyAuthList`
- HTTP 200, code `401`, 114 bytes, msg `代理类型错误: `

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/authority/syncNoAutoAuthority

- Client name: `syncNoAutoAuthority`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/autoRenewCloudBrowser

- Client name: `autoRenewCloudBrowser`
- HTTP 200, code `4019`, 124 bytes, msg `余额不足，请先充值~`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/batchautorenew

- Client name: `autoRenewProxy`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/batchcloserenew

- Client name: `closeAutoRenew`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/batchtag

- Client name: `batchTag`
- HTTP 200, code `4009`, 114 bytes, msg `请求参数错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/createDeviceUserSelves

- Client name: `createDeviceUserSelves`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/creatingDeviceLogs

- Client name: `createLog`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/delAllDeviceLogs

- Client name: `delAllDeviceLogs`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/delDeviceDynamicProxies

- Client name: `delDeviceDynamicProxies`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/delDeviceLogs

- Client name: `delDeviceLogs`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/delDeviceProxyUserSelves

- Client name: `delDeviceProxyUserSelves`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/delTag

- Client name: `delTag`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/dynamics/in/userPkg

- Client name: `dynamicsUserPkg`
- HTTP 200, code `200`, 263 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.order_id` -- Identifier.
- `$.data.package_name` -- Display name.
- `$.data.id` -- Identifier.
- `$.data.package_balance` -- Remaining balance of the purchased package.
- `$.data.package_all` -- Total allowance of the purchased package.
- `$.data.start_time` -- Start timestamp; client label `开始时间`.
- `$.data.expire_time` -- Timestamp.
- `$.data.min_time` -- Timestamp.
- `$.data.max_time` -- Timestamp.
- `$.data.create_time` -- Timestamp.
- `$.data.init_start_time` -- Timestamp.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/dynamics/proxy

- Client name: `postDynamicsProxy`
- HTTP 200, code `4011`, 108 bytes, msg `获取失败`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/dynamics/userinfo

- Client name: `dynamicsUserinfo`
- HTTP 200, code `200`, 293 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.msg` -- Localized operator-facing result message.
- `$.data.data` -- Endpoint payload container.
- `$.data.data.vtype` -- Type discriminator.
- `$.data.data.username` -- Display name.
- `$.data.data.password` -- Password (sensitive).
- `$.data.data.proxyaddr` -- Proxy host and port.
- `$.data.data.publicip` -- Public IP address.
- `$.data.data.ip_white` -- IP allow-list entries.
- `$.data.data.last_flow` -- Traffic consumed in the most recent billing period.
- `$.data.data.total_flow` -- Count.
- `$.data.data.use_flow` -- Traffic consumed so far.
- `$.data.data.proxytype` -- Type discriminator.
- `$.data.data.status` -- Status value.
- `$.data.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/findDesignateDevices

- Client name: `findDesignateDevices`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/device/findDeviceDynamicProxies

- Client name: `findDeviceDynamicProxies`
- HTTP 200, code `200`, 1066 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.data[].created_at` -- Creation timestamp.
- `$.data.data[].updated_at` -- Last update timestamp.
- `$.data.data[].deviceid` -- Identifier.
- `$.data.data[].companyid` -- Company identifier.
- `$.data.data[].userid` -- User identifier.
- `$.data.data[].name` -- Display name.
- `$.data.data[].trademark` -- Proxy category (self, official, general).
- `$.data.data[].type` -- Type discriminator.
- `$.data.data[].autoSwitch` -- Whether the dynamic proxy auto-switches endpoints.
- `$.data.data[].url` -- URL.
- `$.data.data[].notes` -- Free-text notes.
- `$.data.data[].status` -- Status value.
- `$.data.data[].deleteby` -- User ID that deleted the row.
- `$.data.data[].ip_type` -- Type discriminator.
- `$.data.data[].ip_query_channel` -- IP geolocation channel (for example ip2location).
- `$.data.data[].ip_place` -- IP geolocation place.
- `$.data.data[].inspect` -- Proxy inspection/health-check flag.
- `$.data.data[].serial` -- Serial number.
- `$.data.data[].publicip` -- Public IP address.
- `$.data.data[].isbind` -- Whether the device is bound to an environment.
- `$.data.data[].api` -- Whether the row is driven by an API.
- `$.data.data[].authority` -- Permission/authority level for the row.
- `$.data.data[].authority_userids` -- User IDs explicitly granted authority.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/device/findDeviceLogs

- Client name: `findDeviceLogs`
- HTTP 200, code `200`, 145 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/device/findDeviceLogsList

- Client name: `proxyLogs`
- HTTP 200, code `200`, 145 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/device/findDeviceProxyUserSelves

- Client name: `findDeviceProxyUserSelves`
- HTTP 200, code `200`, 145 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/findDevices

- Client name: `findDevices`
- HTTP 200, code `200`, 723 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].created_at` -- Creation timestamp.
- `$.data[].updated_at` -- Last update timestamp.
- `$.data[].deviceid` -- Identifier.
- `$.data[].companyid` -- Company identifier.
- `$.data[].userid` -- User identifier.
- `$.data[].name` -- Display name.
- `$.data[].proxyaddr` -- Proxy host and port.
- `$.data[].proxytype` -- Type discriminator.
- `$.data[].proxyu` -- Proxy username (sensitive).
- `$.data[].proxyp` -- Proxy password (sensitive).
- `$.data[].publicip` -- Public IP address.
- `$.data[].trademark` -- Proxy category (self, official, general).
- `$.data[].enable` -- Enabled flag.
- `$.data[].deleteby` -- User ID that deleted the row.
- `$.data[].notes` -- Free-text notes.
- `$.data[].login_at` -- Timestamp.
- `$.data[].api` -- Whether the row is driven by an API.
- `$.data[].ip_query_channel` -- IP geolocation channel (for example ip2location).
- `$.data[].ip_place` -- IP geolocation place.
- `$.data[].end_time` -- Timestamp.
- `$.data[].inspect` -- Proxy inspection/health-check flag.
- `$.data[].ip_type` -- Type discriminator.
- `$.data[].serial` -- Serial number.
- `$.data[].isbind` -- Whether the device is bound to an environment.
- `$.data[].target_url` -- URL.
- `$.data[].authority` -- Permission/authority level for the row.
- `$.data[].authority_userids` -- User IDs explicitly granted authority.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/findNotAuthDesignateDevices

- Client name: `findNotAuthDesignateDevices`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/device/findTags

- Client name: `findTags`
- HTTP 200, code `200`, 145 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/findVcnpList

- Client name: `findVcnpList`
- HTTP 200, code `200`, 145 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/device/getCloudBrowserProducts

- Client name: `getCloudBrowserProducts`
- HTTP 200, code `200`, 2360 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].created_at` -- Creation timestamp.
- `$.data[].updated_at` -- Last update timestamp.
- `$.data[].product_id` -- Identifier.
- `$.data[].product_name` -- Product display name; client label `产品名称`.
- `$.data[].product_desc` -- Product description.
- `$.data[].area_code` -- Business status code; 200 is success.
- `$.data[].country_code` -- Business status code; 200 is success.
- `$.data[].city_code` -- Business status code; 200 is success.
- `$.data[].product_no` -- Product number.
- `$.data[].status` -- Status value.
- `$.data[].is_display` -- Display flag.
- `$.data[].headless` -- Headless-mode flag.
- `$.data[].package_type` -- Plan or package category; client label `套餐类别`.
- `$.data[].packages` -- Package options.
- `$.data[].packages.day` -- Plan day counter.
- `$.data[].packages.price` -- Price.
- `$.data[].packages.price[].month` -- Month value.
- `$.data[].packages.price[].discount` -- Count.
- `$.data[].line_price` -- Line price.
- `$.data[].selling_price` -- Selling price.
- `$.data[].display_area` -- Display area.
- `$.data[].display_region` -- Display region.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/device/getCloudBrowserSupport

- Client name: `getCloudBrowserSupport`
- HTTP 200, code `200`, 499 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].parentCode` -- Business status code; 200 is success.
- `$.data[].code` -- Business status code; 200 is success.
- `$.data[].name` -- Display name.
- `$.data[].count` -- Count.
- `$.data[].flag` -- Row flag value.
- `$.data[].sort` -- Sort order.
- `$.data[].children` -- Nested child rows (department tree).
- `$.data[].children[].id` -- Identifier.
- `$.data[].children[].parentCode` -- Business status code; 200 is success.
- `$.data[].children[].code` -- Business status code; 200 is success.
- `$.data[].children[].name` -- Display name.
- `$.data[].children[].count` -- Count.
- `$.data[].children[].flag` -- Row flag value.
- `$.data[].children[].sort` -- Sort order.
- `$.data[].children[].children` -- Nested child rows (department tree).
- `$.data[].children[].children[].id` -- Identifier.
- `$.data[].children[].children[].parentCode` -- Business status code; 200 is success.
- `$.data[].children[].children[].code` -- Business status code; 200 is success.
- `$.data[].children[].children[].name` -- Display name.
- `$.data[].children[].children[].count` -- Count.
- `$.data[].children[].children[].flag` -- Row flag value.
- `$.data[].children[].children[].sort` -- Sort order.
- `$.data[].children[].children[].children` -- Nested child rows (department tree).
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/recycleDelAllDeviceDynamicProxies

- Client name: `recycleDelAllDeviceDynamicProxies`
- HTTP 200, code `401`, 115 bytes, msg `device id is required`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/recycleDelAllDeviceProxyUserSelves

- Client name: `recycleDelAllDeviceProxyUserSelves`
- HTTP 200, code `401`, 115 bytes, msg `device id is required`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/recycleDelDeviceDynamicProxies

- Client name: `recycleDelDeviceDynamicProxies`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/recycleDelDeviceProxyUserSelves

- Client name: `recycleDelDeviceProxyUserSelves`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/recycleRecoverAllDeviceProxyUserSelves

- Client name: `recycleRecoverAllDeviceProxyUserSelves`
- HTTP 200, code `401`, 115 bytes, msg `device id is required`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/recycleRecoveryAllDeviceDynamicProxies

- Client name: `recycleRecoveryAllDeviceDynamicProxies`
- HTTP 200, code `401`, 115 bytes, msg `device id is required`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/recycleRecoveryDeviceDynamicProxies

- Client name: `recycleRecoveryDeviceDynamicProxies`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/recycleRecoveryDeviceProxyUserSelves

- Client name: `recycleRecoveryDeviceProxyUserSelves`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/resetname

- Client name: `resetDeviceName`
- HTTP 200, code `200`, 96 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/updateDeviceDynamicProxies

- Client name: `updateDeviceDynamicProxies`
- HTTP 200, code `200`, 523 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.created_at` -- Creation timestamp.
- `$.data.updated_at` -- Last update timestamp.
- `$.data.deviceid` -- Identifier.
- `$.data.companyid` -- Company identifier.
- `$.data.userid` -- User identifier.
- `$.data.name` -- Display name.
- `$.data.trademark` -- Proxy category (self, official, general).
- `$.data.type` -- Type discriminator.
- `$.data.autoSwitch` -- Whether the dynamic proxy auto-switches endpoints.
- `$.data.url` -- URL.
- `$.data.notes` -- Free-text notes.
- `$.data.status` -- Status value.
- `$.data.deleteby` -- User ID that deleted the row.
- `$.data.ip_type` -- Type discriminator.
- `$.data.ip_query_channel` -- IP geolocation channel (for example ip2location).
- `$.data.ip_place` -- IP geolocation place.
- `$.data.inspect` -- Proxy inspection/health-check flag.
- `$.data.serial` -- Serial number.
- `$.data.publicip` -- Public IP address.
- `$.data.isbind` -- Whether the device is bound to an environment.
- `$.data.api` -- Whether the row is driven by an API.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/updateDeviceProxyUserSelves

- Client name: `updateDeviceProxyUserSelves`
- HTTP 200, code `200`, 143 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.proxies` -- Proxy list.
- `$.data.success` -- Success flag.
- `$.data.failure` -- Failure entry.
- `$.data.repeat` -- Timestamp.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/updateIPAddressSegment

- Client name: `ipDetect`
- HTTP 200, code `200`, 98 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## POST /v2/proxy/device/updateIPAddressSegmentBatch

- Client name: `updateIPAddressSegmentBatch`
- HTTP 200, code `401`, 128 bytes, msg `Parameter type error, please check`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/device/vcnplist

- Client name: `getPlatformProxyList`
- HTTP 200, code `200`, 147 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.data` -- Endpoint payload container.
- `$.data.total` -- Total number of records matching the query.
- `$.data.current_page` -- Current result page.
- `$.data.per_page` -- Rows requested per page.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/proxy/device/vcnpsummary

- Client name: `getPlatformProxySummary`
- HTTP 200, code `200`, 184 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.all` -- Aggregate/all entry.
- `$.data.auto_renew` -- Auto-renew flag for the plan.
- `$.data.due_soon` -- Whether payment is due soon.
- `$.data.expired` -- Whether the plan/subscription is expired.
- `$.data.no_auto_renew` -- No-auto-renew flag.
- `$.data.no_bind` -- Unbound count.
- `$.data.no_tag` -- Untagged count.
- `$.msg` -- Localized operator-facing result message.
- `$.traceId` -- Trace identifier used by newer proxy routes.

## GET /v2/retail/checkPromotionCode

- Client name: `checkPromotionCode`
- HTTP 200, code `200`, 76 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.available` -- Whether the code or resource is available.
- `$.data.reason` -- Free-text reason or explanation.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## POST /v2/retail/createPromotionLink

- Client name: `createPromotionLink`
- HTTP 200, code `7`, 159 bytes, msg `Key: 'RetailPromotionLinkCreate.CustomContent' Error:Field validation for 'CustomContent' failed on the 'required' tag`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/retail/createRetailWithdrawLog

- Client name: `applywithdrawals`
- HTTP 200, code `40014`, 66 bytes, msg `最低提现100元`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/retail/findRetailSettleConfig

- Client name: `commissionsConfigInfo`
- HTTP 200, code `200`, 394 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.reretailSettleConfig` -- Retail settlement configuration.
- `$.data.reretailSettleConfig.ID` -- Identifier.
- `$.data.reretailSettleConfig.CreatedAt` -- Timestamp.
- `$.data.reretailSettleConfig.UpdatedAt` -- Timestamp.
- `$.data.reretailSettleConfig.configId` -- Identifier.
- `$.data.reretailSettleConfig.type` -- Type discriminator.
- `$.data.reretailSettleConfig.settleType` -- Type discriminator.
- `$.data.reretailSettleConfig.settleRatio` -- Settlement ratio.
- `$.data.reretailSettleConfig.cycle` -- Billing cycle.
- `$.data.reretailSettleConfig.status` -- Status value.
- `$.data.reretailSettleConfig.minWithdrawalAmount` -- Minimum withdrawal amount.
- `$.data.reretailSettleConfig.maxWithdrawalAmount` -- Maximum withdrawal amount.
- `$.data.reretailSettleConfig.createBy` -- Creator user ID.
- `$.data.reretailSettleConfig.createByName` -- Display name.
- `$.data.reretailSettleConfig.updateBy` -- Timestamp.
- `$.data.reretailSettleConfig.updateByName` -- Display name.
- `$.data.reretailSettleConfig.source` -- Source channel.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/retail/findRetailUserInviteCode

- Client name: `promoInfo`
- HTTP 200, code `200`, 315 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.userInvite` -- User invite information.
- `$.data.userInvite.withdrawableAmount` -- Withdrawable amount.
- `$.data.userInvite.canWithdrawable` -- Whether withdrawal is allowed.
- `$.data.userInvite.invitedUserNumber` -- Count.
- `$.data.userInvite.accumulatedCommission` -- Cumulative commission amount.
- `$.data.userInvite.accumulatedWithdrawal` -- Cumulative withdrawn amount.
- `$.data.userInvite.invitationCode` -- Business status code; 200 is success.
- `$.data.userInvite.frozenCommission` -- Frozen commission.
- `$.data.userInvite.limitReservedCommission` -- Reserved-commission limit.
- `$.data.userInvite.refundedCommissionTotal` -- Total number of records matching the query.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/retail/frozenList

- Client name: `getPromoFrozenList`
- HTTP 200, code ``, 49 bytes

- `$.list` -- Record array.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/retail/getPromotionLinkList

- Client name: `getPromotionLinkList`
- HTTP 200, code `200`, 392 bytes, msg `ok`

- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].ID` -- Identifier.
- `$.data.list[].CreatedAt` -- Timestamp.
- `$.data.list[].UpdatedAt` -- Timestamp.
- `$.data.list[].promotionLinkId` -- Identifier.
- `$.data.list[].userId` -- User identifier.
- `$.data.list[].customContent` -- Custom content.
- `$.data.list[].invitationCode` -- Business status code; 200 is success.
- `$.data.list[].linkName` -- Display name.
- `$.data.list[].redirectType` -- Type discriminator.
- `$.data.list[].isDefault` -- Default flag.
- `$.data.list[].status` -- Status value.
- `$.data.maxCustomCount` -- Count.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/retail/getRetailWithdrawLogList

- Client name: `getPromoWithdrawals`
- HTTP 200, code ``, 48 bytes

- `$.list` -- Record array.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/retail/getUserCompanyInviteList

- Client name: `getPromoUser`
- HTTP 200, code ``, 49 bytes

- `$.list` -- Record array.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## POST /v2/rpa/copyRpaCarbonConfig

- Client name: `copyRpaCarbonConfig`
- HTTP 200, code `50004`, 74 bytes, msg `获取失败`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## POST /v2/rpa/createRpaPlanManagement

- Client name: `createRpaPlanManagement`
- HTTP 200, code `7`, 57 bytes, msg `Account 错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/rpa/createRpaShop

- Client name: `createRpaShop`
- HTTP 200, code `200`, 104 bytes, msg `操作成功`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/rpa/findRpaCarbonConfig

- Client name: `findRpaCarbonConfig`
- HTTP 200, code `200`, 832 bytes, msg `操作成功`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.rerpaCarbonConfig` -- RPA carbon-config template payload.
- `$.data.rerpaCarbonConfig.accountNotes` -- Count.
- `$.data.rerpaCarbonConfig.allowSavingPassword` -- Whether the flow may store a password.
- `$.data.rerpaCarbonConfig.browserStatus` -- Status value.
- `$.data.rerpaCarbonConfig.clearCacheShutdown` -- Whether the cache is cleared on shutdown.
- `$.data.rerpaCarbonConfig.companyId` -- Company identifier.
- `$.data.rerpaCarbonConfig.config` -- Configuration block.
- `$.data.rerpaCarbonConfig.config[].type` -- Type discriminator.
- `$.data.rerpaCarbonConfig.config[].config` -- Configuration block.
- `$.data.rerpaCarbonConfig.config[].config.type` -- Type discriminator.
- `$.data.rerpaCarbonConfig.config[].config.remark` -- Remark text.
- `$.data.rerpaCarbonConfig.config[].config.content` -- Log or notice body text.
- `$.data.rerpaCarbonConfig.config[].config.relation` -- Relation between the config entry and its target.
- `$.data.rerpaCarbonConfig.configId` -- Identifier.
- `$.data.rerpaCarbonConfig.exceptionHandle` -- Exception-handling mode for the flow.
- `$.data.rerpaCarbonConfig.groupId` -- Identifier.
- `$.data.rerpaCarbonConfig.headlessBrowser` -- Whether the browser runs headless.
- `$.data.rerpaCarbonConfig.fullscreen` -- Whether the browser runs in fullscreen.
- `$.data.rerpaCarbonConfig.labelStatus` -- Status value.
- `$.data.rerpaCarbonConfig.notFillPassword` -- Whether the flow skips filling the password.
- `$.data.rerpaCarbonConfig.rpaName` -- Display name.
- `$.data.rerpaCarbonConfig.startupParameter` -- Extra startup parameters passed to the browser.
- `$.data.rerpaCarbonConfig.taskTimeout` -- Timestamp.
- `$.data.rerpaCarbonConfig.userId` -- User identifier.
- `$.data.rerpaCarbonConfig.groupName` -- Display name.
- `$.data.rerpaCarbonConfig.top` -- Whether the row is pinned to the top of the list.
- `$.data.rerpaCarbonConfig.CreatedAt` -- Timestamp.
- `$.data.rerpaCarbonConfig.UpdatedAt` -- Timestamp.
- `$.data.rerpaCarbonConfig.opUserId` -- User identifier.
- `$.data.rerpaCarbonConfig.DeletedAt` -- Timestamp.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/rpa/findRpaGroup

- Client name: `findRpaGroup`
- HTTP 200, code `200`, 244 bytes, msg `操作成功`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.rerpaGroup` -- RPA group information.
- `$.data.rerpaGroup.companyId` -- Company identifier.
- `$.data.rerpaGroup.groupId` -- Identifier.
- `$.data.rerpaGroup.name` -- Display name.
- `$.data.rerpaGroup.userId` -- User identifier.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/rpa/findRpaPlanManagement

- Client name: `findRpaPlanManagement`
- HTTP 200, code `404`, 63 bytes, msg `record not found`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.

## GET /v2/rpa/findRpaShop

- Client name: `findRpaShop`
- HTTP 200, code `200`, 5745 bytes, msg `操作成功`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data.resRpaShop` -- RPA environment result.
- `$.data.resRpaShop.id` -- Identifier.
- `$.data.resRpaShop.author` -- Author name or identifier.
- `$.data.resRpaShop.brief` -- Brief description.
- `$.data.resRpaShop.coverImage` -- Cover image URL.
- `$.data.resRpaShop.desc` -- Description.
- `$.data.resRpaShop.rpaName` -- Display name.
- `$.data.resRpaShop.shopId` -- Environment or account identifier.
- `$.data.resRpaShop.version` -- Client/kernel version.
- `$.data.resRpaShop.config` -- Configuration block.
- `$.data.resRpaShop.config[].type` -- Type discriminator.
- `$.data.resRpaShop.config[].config` -- Configuration block.
- `$.data.resRpaShop.installNum` -- Count.
- `$.data.resRpaShop.group_id` -- Identifier.
- `$.data.resRpaShop.groupName` -- Display name.
- `$.data.resRpaShop.isDisplay` -- Display flag.
- `$.data.resRpaShop.CreatedAt` -- Timestamp.
- `$.data.resRpaShop.UpdatedAt` -- Timestamp.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/rpa/getRpaCarbonConfigList

- Client name: `getRpaCarbonConfigList`
- HTTP 200, code `0`, 5426 bytes

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.list` -- Record array.
- `$.list[].accountNotes` -- Count.
- `$.list[].allowSavingPassword` -- Whether the flow may store a password.
- `$.list[].browserStatus` -- Status value.
- `$.list[].clearCacheShutdown` -- Whether the cache is cleared on shutdown.
- `$.list[].companyId` -- Company identifier.
- `$.list[].config` -- Configuration block.
- `$.list[].config[].type` -- Type discriminator.
- `$.list[].config[].config` -- Configuration block.
- `$.list[].configId` -- Identifier.
- `$.list[].exceptionHandle` -- Exception-handling mode for the flow.
- `$.list[].groupId` -- Identifier.
- `$.list[].headlessBrowser` -- Whether the browser runs headless.
- `$.list[].fullscreen` -- Whether the browser runs in fullscreen.
- `$.list[].labelStatus` -- Status value.
- `$.list[].notFillPassword` -- Whether the flow skips filling the password.
- `$.list[].rpaName` -- Display name.
- `$.list[].startupParameter` -- Extra startup parameters passed to the browser.
- `$.list[].taskTimeout` -- Timestamp.
- `$.list[].userId` -- User identifier.
- `$.list[].groupName` -- Display name.
- `$.list[].top` -- Whether the row is pinned to the top of the list.
- `$.list[].CreatedAt` -- Timestamp.
- `$.list[].UpdatedAt` -- Timestamp.
- `$.list[].opUserId` -- User identifier.
- `$.list[].DeletedAt` -- Timestamp.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/rpa/getRpaGroupList

- Client name: `getRpaGroupList`
- HTTP 200, code `0`, 71 bytes

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.list` -- Record array.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/rpa/getRpaPlanManagementList

- Client name: `getRpaPlanManagementList`
- HTTP 200, code `200`, 100 bytes

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.list` -- Record array.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.
- `$.timestamp` -- Timestamp.

## POST /v2/rpa/getRpaPlanManagementList

- Client name: `getRpaPlansPost`
- HTTP 200, code `200`, 100 bytes

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.list` -- Record array.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.
- `$.timestamp` -- Timestamp.

## GET /v2/rpa/getRpaShopGroupList

- Client name: `getRpaShopGroupList`
- HTTP 200, code `0`, 1133 bytes

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.list` -- Record array.
- `$.list[].ID` -- Identifier.
- `$.list[].CreatedAt` -- Timestamp.
- `$.list[].UpdatedAt` -- Timestamp.
- `$.list[].name` -- Display name.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## GET /v2/rpa/getRpaShopList

- Client name: `getRpaShopList`
- HTTP 200, code `0`, 19581 bytes

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.list` -- Record array.
- `$.list[].id` -- Identifier.
- `$.list[].author` -- Author name or identifier.
- `$.list[].brief` -- Brief description.
- `$.list[].coverImage` -- Cover image URL.
- `$.list[].desc` -- Description.
- `$.list[].rpaName` -- Display name.
- `$.list[].shopId` -- Environment or account identifier.
- `$.list[].version` -- Client/kernel version.
- `$.list[].installNum` -- Count.
- `$.list[].group_id` -- Identifier.
- `$.list[].groupName` -- Display name.
- `$.list[].isDisplay` -- Display flag.
- `$.list[].CreatedAt` -- Timestamp.
- `$.list[].UpdatedAt` -- Timestamp.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.
- `$.timestamp` -- Timestamp.

## GET /v2/rpa/getRpaTaskLog

- Client name: `getRpaTaskLogDetail`
- HTTP 200, code `50004`, 74 bytes, msg `获取失败`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/rpa/getRpaTaskLogList

- Client name: `getRpaTaskLogList`
- HTTP 200, code `200`, 73 bytes

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.list` -- Record array.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## PUT /v2/rpa/recoverRpaCarbonConfigByAll

- Client name: `recoverRpaCarbonConfigByAll`
- HTTP 200, code `200`, 72 bytes, msg `操作成功`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## PUT /v2/rpa/recoverRpaCarbonConfigByConfigIds

- Client name: `recoverRpaCarbonConfigByConfigIds`
- HTTP 200, code `200`, 72 bytes, msg `操作成功`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## GET /v2/rpa/recycleRpaCarbonConfig

- Client name: `recycleRpaCarbonConfig`
- HTTP 200, code `0`, 71 bytes

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.list` -- Record array.
- `$.count` -- Count.
- `$.pageIndex` -- Current page index.
- `$.pageSize` -- Number of records requested per page.

## PUT /v2/rpa/topRpaCarbonConfig

- Client name: `topRpaCarbonConfig`
- HTTP 200, code `50004`, 74 bytes, msg `获取失败`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## PUT /v2/rpa/updateRpaCarbonConfigGroupId

- Client name: `updateRpaCarbonConfigGroupId`
- HTTP 200, code `200`, 72 bytes, msg `操作成功`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## PUT /v2/rpa/updateRpaGroup

- Client name: `updateRpaGroup`
- HTTP 200, code `50004`, 74 bytes, msg `获取失败`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## PUT /v2/rpa/updateRpaPlanManagement

- Client name: `updateRpaPlanManagement`
- HTTP 200, code `7`, 61 bytes, msg `executeType 错误`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.

## PUT /v2/rpa/updateRpaPlanManagementStatus

- Client name: `updateRpaPlanManagementStatus`
- HTTP 200, code `50002`, 74 bytes, msg `更新失败`

- `$.code` -- Business status code; 200 is success.
- `$.msgCode` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.msg` -- Localized operator-facing result message.
- `$.requestId` -- Identifier.

## POST /v2/sso/auth/bindThirdLogin

- Client name: `bindThirdAccount`
- HTTP 200, code `200`, 88 bytes, msg `成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/auth/changeUserinfo

- Client name: `editUserInfo`
- HTTP 200, code `200`, 94 bytes, msg `修改成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/auth/myUserinfo

- Client name: `getuserinfo`
- HTTP 200, code `200`, 707 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.userId` -- User identifier.
- `$.data.username` -- Display name.
- `$.data.mobile` -- Mobile phone number.
- `$.data.email` -- Email address.
- `$.data.firstName` -- Display name.
- `$.data.lastName` -- Display name.
- `$.data.nickname` -- Display name.
- `$.data.avatar` -- Avatar image URL.
- `$.data.bio` -- Profile biography text.
- `$.data.gender` -- Profile gender.
- `$.data.birthday` -- Profile birthday.
- `$.data.lockEnd` -- Account lock end time.
- `$.data.cancelStatus` -- Cancellation status.
- `$.data.cancelDeadline` -- Deadline before the account/subscription can be cancelled.
- `$.data.createdAt` -- Timestamp.
- `$.data.updateAt` -- Timestamp.
- `$.data.inviter` -- Inviter identifier.
- `$.data.inviteType` -- Type discriminator.
- `$.data.source` -- Source channel.
- `$.data.os` -- Operating system string.
- `$.data.lastLoginPort` -- Last login port.
- `$.data.lastLoginDevice` -- Last login device.
- `$.data.ip` -- IP address value.
- `$.data.ipLocation` -- IP geolocation text.
- `$.data.industryLabel` -- Industry label.
- `$.data.bind` -- Binding state or bound-account block.
- `$.data.bind.wechat` -- Timestamp.
- `$.data.bind.ding` -- DingTalk binding state.
- `$.data.bind.mp` -- WeChat official-account binding state.
- `$.data.bind.mini` -- WeChat mini-program binding state.
- `$.data.bind.google` -- Google binding state.
- `$.data.password` -- Password (sensitive).

## POST /v2/sso/auth/sendModifyCode

- Client name: `sendModifyCode`
- HTTP 200, code `10003`, 136 bytes, msg `必须手机号或者邮箱注册`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/auth/setIndustryInfo

- Client name: `setIndustryInfo`
- HTTP 200, code `200`, 90 bytes, msg `成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/auth/setInfo

- Client name: `authSetInfo`
- HTTP 200, code `200`, 90 bytes, msg `成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/auth/setNewbieStep

- Client name: `setNewbieStep`
- HTTP 200, code `200`, 84 bytes, msg `ok`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/auth/tokenRefresh

- Client name: `tokenRefresh`
- HTTP 200, code `200`, 389 bytes, msg `ok`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.token` -- Session token (sensitive).
- `$.data.openId` -- Identifier.
- `$.data.expire` -- Expiry value.
- `$.data.need` -- Whether an action is required.
- `$.data.source` -- Source channel.

## POST /v2/sso/auth/user/info/get

- Client name: `getUserIdinfo`
- HTTP 200, code `200`, 935 bytes, msg `ok`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.userId` -- User identifier.
- `$.data.username` -- Display name.
- `$.data.mobile` -- Mobile phone number.
- `$.data.email` -- Email address.
- `$.data.bind` -- Binding state or bound-account block.
- `$.data.bind.wechat` -- Timestamp.
- `$.data.bind.ding` -- DingTalk binding state.
- `$.data.bind.mp` -- WeChat official-account binding state.
- `$.data.bind.mini` -- WeChat mini-program binding state.
- `$.data.bind.google` -- Google binding state.
- `$.data.password` -- Password (sensitive).
- `$.data.firstName` -- Display name.
- `$.data.lastName` -- Display name.
- `$.data.nickname` -- Display name.
- `$.data.avatar` -- Avatar image URL.
- `$.data.bio` -- Profile biography text.
- `$.data.gender` -- Profile gender.
- `$.data.birthday` -- Profile birthday.
- `$.data.lockEnd` -- Account lock end time.
- `$.data.cancelStatus` -- Cancellation status.
- `$.data.cancelDeadline` -- Deadline before the account/subscription can be cancelled.
- `$.data.source` -- Source channel.
- `$.data.os` -- Operating system string.
- `$.data.lastLoginPort` -- Last login port.
- `$.data.lastLoginDevice` -- Last login device.
- `$.data.ip` -- IP address value.
- `$.data.ipLocation` -- IP geolocation text.
- `$.data.createdAt` -- Timestamp.
- `$.data.updateAt` -- Timestamp.
- `$.data.userType` -- Type discriminator.
- `$.data.inviter` -- Inviter identifier.
- `$.data.inviteType` -- Type discriminator.
- `$.data.cl` -- Client login flag or parameter.
- `$.data.contact` -- Contact information block.
- `$.data.industryLabel` -- Industry label.
- `$.data.openId` -- Identifier.
- `$.data.openType` -- Type discriminator.
- `$.data.openCreatedAt` -- Timestamp.
- `$.data.lastLoginIpv4` -- Last login IPv4 address.
- `$.data.lastLoginIpv6` -- Last login IPv6 address.
- `$.data.ipv6` -- IPv6 address.
- `$.data.pingC` -- Ping/check value.
- `$.data.fingerprintId` -- Identifier.
- `$.data.ipRisk` -- IP risk level.
- `$.data.ipRiskTags` -- IP risk tags.
- `$.data.updateBy` -- Timestamp.

## POST /v2/sso/auth/verifyModifyCode

- Client name: `verifyModifyCode`
- HTTP 200, code `10022`, 115 bytes, msg `无权修改`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/getDingCfg

- Client name: `getddinfo`
- HTTP 200, code `200`, 220 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.appid` -- Identifier.
- `$.data.redirectUrl` -- URL.
- `$.data.state` -- State.

## GET /v2/sso/getNewbieStep

- Client name: `getNewbieStep`
- HTTP 200, code `200`, 200 bytes, msg `ok`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.userId` -- User identifier.
- `$.data.data` -- Endpoint payload container.
- `$.data.step` -- Onboarding / wizard step number.
- `$.data.skip` -- Whether the step or onboarding was skipped.
- `$.data.createdAt` -- Timestamp.
- `$.data.updatedAt` -- Timestamp.

## GET /v2/sso/getUserPlatforms

- Client name: `getUserPlatforms`
- HTTP 200, code `200`, 3896 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.
- `$.data.pageIndex` -- Current page index.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].name` -- Display name.
- `$.data.list[].child` -- Child entry.
- `$.data.list[].child[].id` -- Identifier.
- `$.data.list[].child[].name` -- Display name.
- `$.data.list[].child[].child` -- Child entry.

## POST /v2/sso/login

- Client name: `getuserlogin`
- HTTP 200, code `10003`, 136 bytes, msg `必须手机号或者邮箱注册`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/loginDing

- Client name: `ddlogin`
- HTTP 200, code `500`, 137 bytes, msg `扫码登录失败，请稍后重试`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/mp/login

- Client name: `getwxlogin`
- HTTP 200, code `1055`, 123 bytes, msg `未收到扫描信息`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/sso/mp/qrCode

- Client name: `getwxinfo`
- HTTP 200, code `200`, 328 bytes, msg `获取二维码成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.ticket` -- Short-lived ticket value.
- `$.data.expire_seconds` -- Seconds until the credential or cache entry expires.
- `$.data.url` -- URL.
- `$.data.scene` -- Login scene identifier.

## POST /v2/sso/verify/code

- Client name: `verifyCode`
- HTTP 200, code `10003`, 136 bytes, msg `必须手机号或者邮箱注册`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/team/access/approvals

- Client name: `approvalsList`
- HTTP 200, code `200`, 141 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.
- `$.data.pageIndex` -- Current page index.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.list` -- Record array.

## POST /v2/team/auth/myRights

- Client name: `myRights`
- HTTP 200, code `200`, 35228 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].type` -- Type discriminator.
- `$.data[].rightSlug` -- Permission slug.
- `$.data[].rightName` -- Display name.
- `$.data[].rightRouter` -- Router permission list.
- `$.data[].isEnable` -- Enabled flag.
- `$.data[].sort` -- Sort order.
- `$.data[].flagId` -- Identifier.
- `$.data[].roleType` -- Type discriminator.
- `$.data[].rightApis` -- API permission list.
- `$.data[].label` -- Tag label object or tag IDs.
- `$.data[].createdAt` -- Timestamp.
- `$.data[].updatedAt` -- Timestamp.
- `$.data[].createBy` -- Creator user ID.
- `$.data[].updateBy` -- Timestamp.

## GET /v2/team/authentication/check

- Client name: `authenticationCheck`
- HTTP 200, code `200`, 392 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.userId` -- User identifier.
- `$.data.userCard` -- User ID-card number.
- `$.data.userStatus` -- Status value.
- `$.data.userAcceptAt` -- Timestamp.
- `$.data.companyId` -- Company identifier.
- `$.data.companyIdCard` -- Company ID-card number.
- `$.data.processInstanceId` -- Identifier.
- `$.data.name` -- Display name.
- `$.data.companyStatus` -- Status value.
- `$.data.failCount` -- Count.
- `$.data.companyAcceptAt` -- Timestamp.
- `$.data.failReason` -- Reason the verification failed.

## GET /v2/team/authentication/companyFourElementsFaceCheck

- Client name: `companyFourElementsFaceCheck`
- HTTP 200, code `200`, 360 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.userId` -- User identifier.
- `$.data.userCard` -- User ID-card number.
- `$.data.userStatus` -- Status value.
- `$.data.userAcceptAt` -- Timestamp.
- `$.data.companyId` -- Company identifier.
- `$.data.companyIdCard` -- Company ID-card number.
- `$.data.processInstanceId` -- Identifier.
- `$.data.name` -- Display name.
- `$.data.companyStatus` -- Status value.
- `$.data.failCount` -- Count.
- `$.data.companyAcceptAt` -- Timestamp.
- `$.data.failReason` -- Reason the verification failed.

## GET /v2/team/authentication/companyFourElementsQRCode

- Client name: `companyFourElementsQRCode`
- HTTP 200, code `500`, 140 bytes, msg `获取二维码失败，请稍后重试`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## GET /v2/team/authentication/get

- Client name: `authenticationGet`
- HTTP 200, code `200`, 392 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.userId` -- User identifier.
- `$.data.userCard` -- User ID-card number.
- `$.data.userStatus` -- Status value.
- `$.data.userAcceptAt` -- Timestamp.
- `$.data.companyId` -- Company identifier.
- `$.data.companyIdCard` -- Company ID-card number.
- `$.data.processInstanceId` -- Identifier.
- `$.data.name` -- Display name.
- `$.data.companyStatus` -- Status value.
- `$.data.failCount` -- Count.
- `$.data.companyAcceptAt` -- Timestamp.
- `$.data.failReason` -- Reason the verification failed.

## POST /v2/team/company/approvalJoin

- Client name: `approvalJoin`
- HTTP 200, code `10019`, 127 bytes, msg `您已在员工列表内`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/team/company/approveMember

- Client name: `approveMember`
- HTTP 200, code `500`, 137 bytes, msg `查看对象不存在或无权查看`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/team/company/getApprovals

- Client name: `getApprovals`
- HTTP 200, code `200`, 141 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.
- `$.data.pageIndex` -- Current page index.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.list` -- Record array.

## POST /v2/team/company/getRoleDepartmentMeal

- Client name: `getRoleDepartmentMeal`
- HTTP 200, code `200`, 581 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].userId` -- User identifier.
- `$.data[].companyId` -- Company identifier.
- `$.data[].deptName` -- Display name.
- `$.data[].deptId` -- Identifier.
- `$.data[].rolesId` -- Identifier.
- `$.data[].rolesName` -- Display name.
- `$.data[].end_time` -- Timestamp.
- `$.data[].day` -- Plan day counter.
- `$.data[].free_status` -- Status value.
- `$.data[].restrict` -- Whether the account is restricted.
- `$.data[].expired` -- Whether the plan/subscription is expired.

## POST /v2/team/company/ids

- Client name: `getCompanyByIds`
- HTTP 200, code `200`, 435 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].companyId` -- Company identifier.
- `$.data[].name` -- Display name.
- `$.data[].shortName` -- Display name.
- `$.data[].onwer` -- Company owner identifier.
- `$.data[].status` -- Status value.
- `$.data[].lockStatus` -- Status value.
- `$.data[].invite` -- Invite entry.
- `$.data[].avatar` -- Avatar image URL.
- `$.data[].lockAt` -- Timestamp.
- `$.data[].createdAt` -- Timestamp.
- `$.data[].updatedAt` -- Timestamp.
- `$.data[].updateBy` -- Timestamp.

## POST /v2/team/company/info

- Client name: `getcompany`
- HTTP 200, code `200`, 433 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.companyId` -- Company identifier.
- `$.data.name` -- Display name.
- `$.data.shortName` -- Display name.
- `$.data.onwer` -- Company owner identifier.
- `$.data.status` -- Status value.
- `$.data.lockStatus` -- Status value.
- `$.data.invite` -- Invite entry.
- `$.data.avatar` -- Avatar image URL.
- `$.data.lockAt` -- Timestamp.
- `$.data.createdAt` -- Timestamp.
- `$.data.updatedAt` -- Timestamp.
- `$.data.updateBy` -- Timestamp.

## POST /v2/team/company/user/devices

- Client name: `getUserDevices`
- HTTP 200, code `200`, 1632 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.
- `$.data.pageIndex` -- Current page index.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].userId` -- User identifier.
- `$.data.list[].userName` -- Display name.
- `$.data.list[].companyId` -- Company identifier.
- `$.data.list[].deviceId` -- Identifier.
- `$.data.list[].version` -- Client/kernel version.
- `$.data.list[].platformType` -- Type discriminator.
- `$.data.list[].devType` -- Type discriminator.
- `$.data.list[].online_status` -- Status value.
- `$.data.list[].devName` -- Display name.
- `$.data.list[].remark` -- Remark text.
- `$.data.list[].ip` -- IP address value.
- `$.data.list[].createdAt` -- Timestamp.
- `$.data.list[].updatedAt` -- Timestamp.

## POST /v2/team/company/user/updatePackageStatus

- Client name: `updatePackageStatus`
- HTTP 200, code `200`, 83 bytes, msg `ok`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/team/curCompanyInfo

- Client name: `curCompanyInfo`
- HTTP 200, code `200`, 433 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.companyId` -- Company identifier.
- `$.data.name` -- Display name.
- `$.data.shortName` -- Display name.
- `$.data.onwer` -- Company owner identifier.
- `$.data.status` -- Status value.
- `$.data.lockStatus` -- Status value.
- `$.data.invite` -- Invite entry.
- `$.data.avatar` -- Avatar image URL.
- `$.data.lockAt` -- Timestamp.
- `$.data.createdAt` -- Timestamp.
- `$.data.updatedAt` -- Timestamp.
- `$.data.updateBy` -- Timestamp.

## POST /v2/team/dept/change

- Client name: `updateDept`
- HTTP 200, code `10022`, 115 bytes, msg `无权修改`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/team/dept/del

- Client name: `deleteDept`
- HTTP 200, code `10017`, 115 bytes, msg `无权删除`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/team/env-settings/get

- Client name: `getEnvSettings`
- HTTP 200, code `200`, 80 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/team/env-settings/update

- Client name: `updateEnvSettings`
- HTTP 200, code `500`, 161 bytes, msg `Key: 'EnvSettingsUpdateReq.Tag' Error:Field validation for 'Tag' failed on the 'required' tag`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/team/getDepts

- Client name: `getDepts`
- HTTP 200, code `200`, 187 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.deptId` -- Identifier.
- `$.data.pid` -- Identifier.
- `$.data.departmentName` -- Department display name; client label `部门名称`.
- `$.data.count` -- Count.
- `$.data.manageName` -- Display name.
- `$.data.userId` -- User identifier.
- `$.data.members` -- Department member rows.

## POST /v2/team/getMembers

- Client name: `getMembers`
- HTTP 200, code `200`, 749 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.
- `$.data.pageIndex` -- Current page index.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].userId` -- User identifier.
- `$.data.list[].companyId` -- Company identifier.
- `$.data.list[].deptId` -- Identifier.
- `$.data.list[].username` -- Display name.
- `$.data.list[].name` -- Display name.
- `$.data.list[].mobile` -- Mobile phone number.
- `$.data.list[].email` -- Email address.
- `$.data.list[].roles` -- Role ID list (comma-wrapped string).
- `$.data.list[].avatar` -- Avatar image URL.
- `$.data.list[].leave_status` -- Status value.
- `$.data.list[].online` -- Online status.
- `$.data.list[].package_status` -- Status value.
- `$.data.list[].usetimeLimit` -- Timestamp.
- `$.data.list[].usetimeLimit.limit` -- Usage/day limit.
- `$.data.list[].usetimeLimit.beginDate` -- Timestamp.
- `$.data.list[].usetimeLimit.endDate` -- Timestamp.
- `$.data.list[].lastLoginAt` -- Timestamp.
- `$.data.list[].createdAt` -- Timestamp.
- `$.data.list[].updatedAt` -- Timestamp.
- `$.data.list[].pop` -- Pop-up/notification flag.
- `$.data.list[].openId` -- Identifier.
- `$.data.list[].deptName` -- Display name.
- `$.data.list[].rolesName` -- Display name.
- `$.data.list[].depPath` -- Department path.
- `$.data.list[].cancelStatus` -- Cancellation status.
- `$.data.list[].cancelDeadline` -- Deadline before the account/subscription can be cancelled.
- `$.data.list[].realName` -- Display name.

## POST /v2/team/loginlogs

- Client name: `loginlogs`
- HTTP 200, code `200`, 3748 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.
- `$.data.pageIndex` -- Current page index.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].companyId` -- Company identifier.
- `$.data.list[].userId` -- User identifier.
- `$.data.list[].username` -- Display name.
- `$.data.list[].optionType` -- Type discriminator.
- `$.data.list[].ip` -- IP address value.
- `$.data.list[].region` -- Proxy region selection.
- `$.data.list[].clientType` -- Type discriminator.
- `$.data.list[].device` -- Device telemetry entry.
- `$.data.list[].clientId` -- Identifier.
- `$.data.list[].os` -- Operating system string.
- `$.data.list[].clientMac` -- Client MAC address value.
- `$.data.list[].createdAt` -- Timestamp.

## POST /v2/team/member/accessApply

- Client name: `loginApply`
- HTTP 200, code `500`, 128 bytes, msg `已失效，请重新申请`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/team/member/accessApproval

- Client name: `accessApproval`
- HTTP 200, code `500`, 137 bytes, msg `查看对象不存在或无权查看`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/team/member/ids

- Client name: `getMembersByIds`
- HTTP 200, code `200`, 649 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].userId` -- User identifier.
- `$.data[].companyId` -- Company identifier.
- `$.data[].deptId` -- Identifier.
- `$.data[].username` -- Display name.
- `$.data[].name` -- Display name.
- `$.data[].mobile` -- Mobile phone number.
- `$.data[].email` -- Email address.
- `$.data[].roles` -- Role ID list (comma-wrapped string).
- `$.data[].avatar` -- Avatar image URL.
- `$.data[].leave_status` -- Status value.
- `$.data[].online` -- Online status.
- `$.data[].package_status` -- Status value.
- `$.data[].usetimeLimit` -- Timestamp.
- `$.data[].usetimeLimit.limit` -- Usage/day limit.
- `$.data[].usetimeLimit.beginDate` -- Timestamp.
- `$.data[].usetimeLimit.endDate` -- Timestamp.
- `$.data[].lastLoginAt` -- Timestamp.
- `$.data[].createdAt` -- Timestamp.
- `$.data[].updatedAt` -- Timestamp.
- `$.data[].pop` -- Pop-up/notification flag.
- `$.data[].openId` -- Identifier.
- `$.data[].deptName` -- Display name.
- `$.data[].rolesName` -- Display name.
- `$.data[].depPath` -- Department path.

## POST /v2/team/member/info

- Client name: `getMemberInfo`
- HTTP 200, code `200`, 637 bytes, msg `Ok`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.userId` -- User identifier.
- `$.data.companyId` -- Company identifier.
- `$.data.deptId` -- Identifier.
- `$.data.username` -- Display name.
- `$.data.name` -- Display name.
- `$.data.mobile` -- Mobile phone number.
- `$.data.email` -- Email address.
- `$.data.roles` -- Role ID list (comma-wrapped string).
- `$.data.avatar` -- Avatar image URL.
- `$.data.leave_status` -- Status value.
- `$.data.online` -- Online status.
- `$.data.package_status` -- Status value.
- `$.data.usetimeLimit` -- Timestamp.
- `$.data.usetimeLimit.limit` -- Usage/day limit.
- `$.data.usetimeLimit.beginDate` -- Timestamp.
- `$.data.usetimeLimit.endDate` -- Timestamp.
- `$.data.lastLoginAt` -- Timestamp.
- `$.data.createdAt` -- Timestamp.
- `$.data.updatedAt` -- Timestamp.
- `$.data.pop` -- Pop-up/notification flag.
- `$.data.openId` -- Identifier.
- `$.data.deptName` -- Display name.
- `$.data.rolesName` -- Display name.
- `$.data.depPath` -- Department path.

## POST /v2/team/member/move

- Client name: `moveDeptMember`
- HTTP 200, code `200`, 94 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/team/member/myInfo

- Client name: `userInfo`
- HTTP 200, code `200`, 646 bytes, msg `Ok`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.userId` -- User identifier.
- `$.data.companyId` -- Company identifier.
- `$.data.deptId` -- Identifier.
- `$.data.username` -- Display name.
- `$.data.name` -- Display name.
- `$.data.mobile` -- Mobile phone number.
- `$.data.email` -- Email address.
- `$.data.roles` -- Role ID list (comma-wrapped string).
- `$.data.avatar` -- Avatar image URL.
- `$.data.leave_status` -- Status value.
- `$.data.online` -- Online status.
- `$.data.package_status` -- Status value.
- `$.data.usetimeLimit` -- Timestamp.
- `$.data.usetimeLimit.limit` -- Usage/day limit.
- `$.data.usetimeLimit.beginDate` -- Timestamp.
- `$.data.usetimeLimit.endDate` -- Timestamp.
- `$.data.lastLoginAt` -- Timestamp.
- `$.data.createdAt` -- Timestamp.
- `$.data.updatedAt` -- Timestamp.
- `$.data.pop` -- Pop-up/notification flag.
- `$.data.openId` -- Identifier.
- `$.data.deptName` -- Display name.
- `$.data.rolesName` -- Display name.
- `$.data.depPath` -- Department path.

## POST /v2/team/member/myInfo/change

- Client name: `myInfoChange`
- HTTP 200, code `200`, 94 bytes, msg `修改成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/team/myCompanies

- Client name: `getCompanuIfo`
- HTTP 200, code `200`, 412 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].companyId` -- Company identifier.
- `$.data[].name` -- Display name.
- `$.data[].shortName` -- Display name.
- `$.data[].onwer` -- Company owner identifier.
- `$.data[].status` -- Status value.
- `$.data[].lockStatus` -- Status value.
- `$.data[].lockAt` -- Timestamp.
- `$.data[].createdAt` -- Timestamp.
- `$.data[].updateBy` -- Timestamp.
- `$.data[].token` -- Session token (sensitive).
- `$.data[].expire` -- Expiry value.
- `$.data[].code` -- Business status code; 200 is success.
- `$.data[].ip` -- IP address value.
- `$.data[].source` -- Source channel.
- `$.data[].avatar` -- Avatar image URL.

## POST /v2/team/ownerCompanies

- Client name: `getMyTeam`
- HTTP 200, code `200`, 435 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].companyId` -- Company identifier.
- `$.data[].name` -- Display name.
- `$.data[].shortName` -- Display name.
- `$.data[].onwer` -- Company owner identifier.
- `$.data[].status` -- Status value.
- `$.data[].lockStatus` -- Status value.
- `$.data[].invite` -- Invite entry.
- `$.data[].avatar` -- Avatar image URL.
- `$.data[].lockAt` -- Timestamp.
- `$.data[].createdAt` -- Timestamp.
- `$.data[].updatedAt` -- Timestamp.
- `$.data[].updateBy` -- Timestamp.

## GET /v2/team/plugin/newestPlugins

- Client name: `newestPlugins`
- HTTP 200, code `200`, 1763 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].name` -- Display name.
- `$.data[].version` -- Client/kernel version.
- `$.data[].title` -- Title text.
- `$.data[].description` -- Description.
- `$.data[].uuid` -- Identifier.
- `$.data[].md5` -- File checksum (MD5).
- `$.data[].downloadUrl` -- URL.
- `$.data[].platform` -- Client platform.
- `$.data[].status` -- Status value.
- `$.data[].manifestVersion` -- Plugin manifest version.

## POST /v2/team/right/list

- Client name: `getMenus`
- HTTP 200, code `200`, 35218 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].type` -- Type discriminator.
- `$.data[].rightSlug` -- Permission slug.
- `$.data[].rightName` -- Display name.
- `$.data[].rightRouter` -- Router permission list.
- `$.data[].isEnable` -- Enabled flag.
- `$.data[].sort` -- Sort order.
- `$.data[].flagId` -- Identifier.
- `$.data[].roleType` -- Type discriminator.
- `$.data[].rightApis` -- API permission list.
- `$.data[].label` -- Tag label object or tag IDs.
- `$.data[].createdAt` -- Timestamp.
- `$.data[].updatedAt` -- Timestamp.
- `$.data[].createBy` -- Creator user ID.
- `$.data[].updateBy` -- Timestamp.

## POST /v2/team/right/listTemplate

- Client name: `getMenusTemplate`
- HTTP 200, code `200`, 3537 bytes, msg `OK`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].name` -- Display name.
- `$.data[].remark` -- Remark text.
- `$.data[].templateName` -- Display name.
- `$.data[].templateType` -- Type discriminator.
- `$.data[].roleType` -- Type discriminator.
- `$.data[].templateIds` -- Template IDs.
- `$.data[].isEnable` -- Enabled flag.
- `$.data[].sort` -- Sort order.
- `$.data[].createdAt` -- Timestamp.
- `$.data[].updatedAt` -- Timestamp.
- `$.data[].createBy` -- Creator user ID.
- `$.data[].updateBy` -- Timestamp.

## POST /v2/team/role-group/del

- Client name: `deleteRoleGroup`
- HTTP 200, code `500`, 93 bytes, msg `WHERE conditions required`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/team/role-group/page

- Client name: `getRoleGroup`
- HTTP 200, code `200`, 354 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].companyId` -- Company identifier.
- `$.data.list[].name` -- Display name.
- `$.data.list[].intro` -- Introduction text.
- `$.data.list[].sort` -- Sort order.
- `$.data.list[].isDefault` -- Default flag.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.

## POST /v2/team/role-group/role/move

- Client name: `roleGroupMigrateRole`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/team/role-group/update

- Client name: `updateRoleGroup`
- HTTP 200, code `200`, 70 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/team/role/change

- Client name: `editRole`
- HTTP 200, code `10012`, 127 bytes, msg `至少选择一项权限`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/team/role/great

- Client name: `addRoleAccount`
- HTTP 200, code `200`, 94 bytes, msg `授权完成`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/team/role/members

- Client name: `getRoleMembers`
- HTTP 200, code `200`, 94 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/team/roles

- Client name: `getRolesList`
- HTTP 200, code `200`, 2289 bytes, msg `查询成功`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.count` -- Count.
- `$.data.pageIndex` -- Current page index.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.list` -- Record array.
- `$.data.list[].id` -- Identifier.
- `$.data.list[].companyId` -- Company identifier.
- `$.data.list[].roleSlug` -- Role slug/name.
- `$.data.list[].roleDesc` -- Role description.
- `$.data.list[].rightIds` -- Comma-separated permission IDs.
- `$.data.list[].roleType` -- Type discriminator.
- `$.data.list[].gid` -- Identifier.
- `$.data.list[].sort` -- Sort order.
- `$.data.list[].createdAt` -- Timestamp.
- `$.data.list[].updatedAt` -- Timestamp.
- `$.data.list[].updateBy` -- Timestamp.
- `$.data.list[].count` -- Count.

## POST /v2/team/select/company

- Client name: `toggleCompany`
- HTTP 200, code `500`, 51 bytes, msg `ReMsg code:{500} already exist`

- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/team/sidebar/get

- Client name: `getSidebar`
- HTTP 200, code `200`, 288 bytes, msg `ok`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.id` -- Identifier.
- `$.data.createdAt` -- Timestamp.
- `$.data.updatedAt` -- Timestamp.
- `$.data.userId` -- User identifier.
- `$.data.companyId` -- Company identifier.
- `$.data.version` -- Client/kernel version.
- `$.data.menus` -- Menu list.

## POST /v2/team/sidebar/update

- Client name: `updateSidebar`
- HTTP 200, code `200`, 84 bytes, msg `ok`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.

## POST /v2/team/version/get

- Client name: `getVersion`
- HTTP 200, code `200`, 73 bytes

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.

## POST /v2/team/version/getCore

- Client name: `getCoreVersion`
- HTTP 200, code `500`, 192 bytes, msg `json: cannot unmarshal string into Go struct field GetAppVersionReq.versionCode of type int`

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.status` -- Status value.
- `$.data` -- Endpoint payload container.

## POST /v2/team/version/last

- Client name: `versionLast`
- HTTP 200, code `200`, 1913 bytes

- `$.requestId` -- Identifier.
- `$.code` -- Business status code; 200 is success.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].appName` -- Display name.
- `$.data[].appId` -- Identifier.
- `$.data[].versionCode` -- Business status code; 200 is success.
- `$.data[].minVersionCode` -- Business status code; 200 is success.
- `$.data[].coreId` -- Identifier.
- `$.data[].minVersion` -- Minimum supported client version.
- `$.data[].updateType` -- Timestamp.
- `$.data[].title` -- Title text.
- `$.data[].tag` -- Tag value.
- `$.data[].content` -- Log or notice body text.
- `$.data[].version` -- Client/kernel version.
- `$.data[].bitness` -- Client/kernel bitness (for example 64).
- `$.data[].platform` -- Client platform.
- `$.data[].browser` -- Browser/kernel family.
- `$.data[].url` -- URL.
- `$.data[].size` -- File size.
- `$.data[].md5` -- File checksum (MD5).
- `$.data[].status` -- Status value.
- `$.data[].beginTime` -- Timestamp.
- `$.data[].allCompany` -- All-companies roll-up block returned with the account summary.
- `$.data[].companyWhiteList` -- Allowed-company whitelist.
- `$.data[].createdAt` -- Timestamp.
- `$.data[].updatedAt` -- Timestamp.
- `$.data[].createBy` -- Creator user ID.
- `$.data[].updateBy` -- Timestamp.

## POST /v2/tg/browser/store/ip

- Client name: `normalIp`
- HTTP 200, code `500`, 264 bytes, msg `Key: 'BrowserStoreIpDto.AppId' Error:Field validation for 'AppId' failed on the 'required' tag
Key: 'BrowserStoreIpDto.D`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.

## POST /v2/yun/ads-space/ad

- Client name: `adsSpaceInfo`
- HTTP 200, code `200`, 4993 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data[].id` -- Identifier.
- `$.data[].appid` -- Identifier.
- `$.data[].adpos` -- Ad placement identifier.
- `$.data[].status` -- Status value.
- `$.data[].lang` -- Language.
- `$.data[].title` -- Title text.
- `$.data[].img` -- Image URL.
- `$.data[].url` -- URL.
- `$.data[].optype` -- Type discriminator.
- `$.data[].opvalue` -- Operation value.
- `$.data[].opvalue.opid` -- Identifier.
- `$.data[].opvalue.method` -- Method name.
- `$.data[].opvalue.params` -- Parameter block.
- `$.data[].opvalue.params.promoter` -- Promoter name or identifier.
- `$.data[].opvalue.params.source` -- Source channel.
- `$.data[].opvalue.params.uuid` -- Identifier.
- `$.data[].opvalue.tag` -- Tag value.
- `$.data[].opvalue.backgroud` -- Background image URL (API spelling).
- `$.data[].opvalue.textcolor` -- Text colour.
- `$.data[].desc` -- Description.
- `$.data[].startTime` -- Timestamp.
- `$.data[].endTime` -- Timestamp.
- `$.data[].createdAt` -- Timestamp.
- `$.data[].updatedAt` -- Timestamp.

## POST /v2/yun/qrcode-setting/get

- Client name: `getQrCodeSetting`
- HTTP 200, code `200`, 129 bytes, msg `OK`

- `$.reqId` -- Request correlation identifier.
- `$.code` -- Business status code; 200 is success.
- `$.msg` -- Localized operator-facing result message.
- `$.data` -- Endpoint payload container.
- `$.data.list` -- Record array.
- `$.data.total` -- Total number of records matching the query.
- `$.data.pageSize` -- Number of records requested per page.
- `$.data.currentPage` -- Current result page.
