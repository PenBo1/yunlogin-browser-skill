# Response Enum Meanings

Response-side enum fields whose values were mapped to a meaning. Request-parameter enums live in
[PARAMETER_MATRIX.md](PARAMETER_MATRIX.md); this page covers values that come back in a payload.

Each entry names the evidence: either a label in the management-center bundle, or a measured behaviour
that pins the value.

## Confirmed

| Field | Value | Meaning | Evidence |
| --- | ---: | --- | --- |
| `ip_state` (and `cloud.ip_state`) | `2` | Delisted (`已下架`) | The platform-agent table renders `{label:"是否下架", text: 2===n.ip_state ? "已下架" : "未下架"}`, so every other value - including the observed `1` - is "not delisted" |
| `ip_state` | anything else | Not delisted (`未下架`) | same expression |
| `status` on `findDeviceDynamicProxies` rows | `0` | The only state this account holds; the request filter matches it exactly | measured: `status:0` returns the 5 rows, `1`/`2`/`99` return none |
| `status` on `findDeviceProxyUserSelves` rows | absent | The rows carry no `status` field, so `status:0` matches nothing while a non-zero filter returns all | measured rows |
| `cloud_type` on `vcnplist` rows | `1` | CloudStatic | client constants `CloudStatic=1`, `GlobalStatic=2`, `OverseasDynamic=4` |
| `status` on `vcnplist` rows | `"Pending"` / `status_text:"创建中"` | Pending, still being created | direct read; the numeric filter `3` is the only one that passes these rows |
| `is_enable` on `vcnplist` rows | absent | Pending proxies are not flagged enabled, so `is_enable:1` returns nothing | measured |

## Correlation Attempts That Failed

The remaining enum fields were checked against their sibling values on the same row, which is the only
way to pin a code without a client label. The account's data does not vary enough to separate the values:

| Field | Where read | Values seen | Sibling on the same row | Why it is still open |
| --- | --- | --- | --- | --- |
| `cidr_status` | `vcnplist` rows and all 158 `getProxyProduct` rows | `-1` everywhere (a single `1` was seen once under `new_cloud_instances`) | `cidr_blocks: null` in every row | `-1` always pairs with no CIDR blocks, so \"no CIDR configured\" is a reasonable inference, but no row with a non-null `cidr_blocks` was available to confirm the counterpart |
| `band_width_type` | `vcnplist` (`3`, with `band_width: 5`) and `getProxyProduct` (`0`, with `band_width: 20`) | `0`, `3` | `band_width` differs (5 vs 20) but across different product families, so the code is not a simple Mbps scale |
| `isp_type` | `vcnplist` (`0`) and `getProxyProduct` (`3`) | `0`, `3` | no `isp_text` sibling | the key appears in the bundle only as a pass-through request value, so no label exists to compare |
| `net_type` | both surfaces | `0` only | no sibling | a single value cannot be mapped |

The block above already lists these four as `No Meaning Available`; this section records what was tried
so a later pass can either find account data that varies or re-check the bundle after a client rebuild.
## No Meaning Available

These fields were observed with real values, but the management-center bundle carries no label for them
and no measured behaviour distinguishes the values, so the meaning stays open:

| Field | Values seen | Note |
| --- | --- | --- |
| `isp_type` | `0` | Only used as a pass-through value in a purchase body; no label map in the bundle |
| `net_type` | `0` | same |
| `band_width_type` | `3` (and `0` under `new_cloud_instances`) | the key does not appear anywhere in the bundle |
| `cidr_status` | `-1`, `1` | the key does not appear anywhere in the bundle |

Re-check with `node scripts/dev/mine-bundle-enums.mjs <key>` after a client rebuild; if a label map is
added it will show up there.

## Confirmed From A Bundle Constant Map (2026-10-10)

A full traversal of all 321 deployed bundles found the client constant maps for two device fields. The
map is written in the main bundle as `const l7={...}` (plus the reverse map `s7`) beside the protobuf
writer that sends `devType`.

`devType`:

| Value | Constant |
| ---: | --- |
| 0 | DEV_TYPE_UNKNOW |
| 1 | DEV_TYPE_PC_WIN |
| 2 | DEV_TYPE_PC_MAC |
| 3 | DEV_TYPE_PC_LINUX |
| 4 | DEV_TYPE_PC_WEB |
| 10 | DEV_TYPE_IOS |
| 11 | DEV_TYPE_ANDROID |
| 12 | DEV_TYPE_H5 |
| 20 | DEV_TYPE_WX_MINI |
| 21 | DEV_TYPE_WX_MP |

`PlatformType` (`const r7={...}`):

| Value | Constant |
| ---: | --- |
| 0 | PLATFORM_UNKNOW |
| 1 | PLATFORM_PC |
| 2 | PLATFORM_MOBILE |
| 3 | PLATFORM_H5 |

### Fields That Were Listed As Unknown And Are Now Explained

| Field | Finding |
| --- | --- |
| `devType` | Full constant map above - resolved |
| `PlatformType` | Full constant map above - resolved |
| `pluginType` | The i18n bundle labels it "plugin category", so the value is a plugin category, not a free code |
| `templateType` | Groups menu templates: the role editor buckets rows by `templateType` and keeps one `templateName` per bucket |
| `isp_type`, `net_type` | **Request** fields of the proxy purchase cart (`cartUpdate`), not response enums - the client passes them through from the selected product |
| `installStatus` | Used as a truthy flag in the plugin UI (`installStatus ? distribute : add`), so non-zero means installed |
| `free_status` | A member of the purchase origin-order object that feeds the `isFreeOrExpired` getter |

Still without a label: `band_width_type`, `cidr_status`, `roleType`, and the `RegionSupportV2` route
flags. `roleType`, `band_width_type`, and `cidr_status` do not occur in any of the 321 deployed bundles,
so the client never reads them and no label can be recovered from the client at all.

## Server-Supplied Label Maps (2026-10-10)

Some routes return the label map itself, which is a stronger source than a client constant.

`GET /v2/cost/costmanagement/getorderinfo?oid=<order id>` answers `code: 200` and its `data` holds three
maps:

| Map | Values |
| --- | --- |
| `order_status` | `-1` 待支付, `0` 创建中, `2` 处理中, `3` 已完成, `4` 已关闭, `5` 已退款, `6` 部分退款, `7` 开通中, `8` 异常 |
| `order_type` | `0` 代理订单, `1` 续费代理, `2` 充值订单, `3` 套餐订单, `4` 续费套餐, `5` 兑换订单, `6` 代理商充值, `7` 云浏览器订单, `8` 云浏览器续费 |
| `pay_type` | `1` 余额, `2` 支付宝, `3` 微信 |

The same values appear beside each order row as `order_status_text`, `order_type_text`, and
`pay_type_text`, so a caller can read either the code or the label.

`GET /v2/cost/costmanagement/getRegionSupportV2` answers `code: 200` with a region tree rather than a
flat list. Each node carries `id`, `parentCode`, `code`, `name`, `count`, `flag`, `sort`, and `children`.

- Leaf `code` values encode the proxy type: `proxyType:1` - 云平台 (cloud platform) and `proxyType:2` -
  静态住宅 (static residential). 292 of the 604 nodes are such leaves.
- `flag` appears on every node with observed values `0`, `1`, `2`, `3`, and `9`. The values line up with
  examples (`9` - 北美洲 continent, `2` - 美国 country, `1` - 越南 country, `3` - 洛杉矶 city, `0` -
  `proxyType:*` leaves) but **not** with a single tree level: one city carries `flag 0` while another
  carries `flag 3`. Treat `flag` as an unconfirmed server-side support indicator, not a depth.

`GET /v2/cost/costmanagement/getOrderManagementNew?page=1&pageSize=10` returns the order rows under
`data.data[]` (note the doubled `data`), and each row carries both `oid` and `order_no`.

`POST /v2/cost/costmanagement/getOrderDetailStatus` still answers `code: 4009` for both the row `oid` and
the row `order_no`, so its success shape remains unconfirmed.

## Why Three Fields Stay Unlabeled (Checked 2026-10-10)

`band_width_type`, `cidr_status`, and `roleType` have observed values but no meaning. Each was re-checked
against every available label source, so the reasons are now concrete:

| Field | Where it is returned | Label sibling | Client reference |
| --- | --- | --- | --- |
| `band_width_type` | `getProxyProduct` rows (`new_cloud_instances.band_width_type`), region-tree `vtype` nodes, and order-detail `cloud` blocks | none - the row carries the code with no `*_text` or name field | the name does not occur in any of the 321 deployed bundles |
| `cidr_status` | the same cloud-proxy and order-detail blocks | none | the name does not occur in any bundle |
| `roleType` | `POST /v2/team/roles` rows | none - the row is `id, companyId, roleSlug, roleDesc, rightIds, roleType, gid, sort, createdAt, updatedAt, updateBy, count` | the name does not occur in any bundle |

For `roleType` there is also no variance to correlate against: all four roles on this account report
`roleType: 0`, so no pair of values can be separated.

### Measured Value Domain For The Cloud-Proxy Fields

`getProxyProduct` returns 104 rows, each with a `new_cloud_instances` object carrying 60+ fields
(`vtype`, `proxy_type`, `ip_type`, `isp_type`, `net_type`, `band_width`, `band_width_type`, `unit`,
`max_band_width`, `cidr_status`, `cpu`, `memory`, `price_json`, `packages`, `selling_price`, and more).
Grouping the rows collapses to 8 combinations, which pins the observed domain:

| `vtype` | `band_width` | `band_width_type` | `unit` | rows |
| --- | ---: | ---: | ---: | ---: |
| `ypk` | 3 | 3 | 3 | 25 |
| `ak` | 10 | 1 | 1 | 18 |
| `ali` | 5 | 3 | 3 | 16 |
| `awslight` | 5 | 3 | 3 | 14 |
| `cmc` | 5 | 0 | 3 | 14 |
| `tx` | 5 | 3 | 3 | 10 |
| `huawei` | 3 | 3 | 3 | 6 |
| `huawei_light` | 5 | 1 | 1 | 1 |

What this pins:

- `band_width_type` takes `0`, `1`, or `3` here, and `unit` is `1` exactly when `band_width_type` is `1`;
  types `0` and `3` both pair with `unit: 3`. So the field is not a plain unit mirror, and with only these
  rows the difference between `0` and `3` cannot be separated - it varies by provider (`vtype`).
- `cidr_status` is `-1` in **every** row of this route, so the route cannot separate its values.
- `max_band_width` is `0` in every row, so it carries no information on this account.

The purchase cart does not read `band_width_type` at all: it sends `band_width`, `isp_type`, and `net_type`
from the selected product. That is why searching the bundles for the name finds nothing.

The client never renders these three, so no label map can be recovered from the client, and the server
does not attach a label to the row. Treat the values as opaque identifiers unless a future build starts
reading them.
