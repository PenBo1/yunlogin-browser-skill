# Proxy Cloud List

- Surface: server API
- Endpoint ID: `proxy-cloud-list`
- Method: `GET`
- Path: `/v2/proxy/device/vcnplist`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: ok`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Lists cloud proxy devices and their cloud package information.

## Request

### Query Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `page` | number | Yes | `1` | Page number. |
| `per_page` | number | Yes | `20` | Page size. |
| `device_name` | string | No | `""` | Filter by device name. |
| `publicip` | string | No | `""` | Filter by public IP. |
| `status` | number | Yes | `0` | Status filter. |
| `userid` | string | Yes | `""` | User ID. Can be injected from `YUNLOGIN_SERVER_USER_ID`. |
| `companyid` | string | Yes | `""` | Company ID. Can be injected from `YUNLOGIN_SERVER_COMPANY_ID`. |

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
$env:YUNLOGIN_SERVER_COMPANY_ID = "<companyid>"
$env:YUNLOGIN_SERVER_USER_ID = "<userid>"

node scripts/yunlogin-server-api.mjs proxy-cloud-list --query page=1 --query per_page=20 --dry-run
node scripts/yunlogin-server-api.mjs proxy-cloud-list --query page=1 --query per_page=20
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msgCode` | number | Message code. |
| `data` | object | Pagination and result data. |
| `msg` | string | Business message. |
| `traceId` | string | Request trace ID. |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `data` | array | Cloud proxy rows. |
| `total` | number | Total matching rows. |
| `current_page` | number | Current page. |
| `per_page` | number | Page size. |

### `data.data[]`

| Field | Type | Description |
| --- | --- | --- |
| `created_at` | string | Creation time. |
| `updated_at` | string | Update time. |
| `auto_renew` | number | Auto-renew setting. |
| `start_time` | string | Start time. |
| `expired_time` | string | Expiration time. |
| `last_login_at` | null or string | Last login time. |
| `device_name` | string | Device name. |
| `cloud_id` | string | Cloud ID. |
| `cloud_type` | number | Cloud type. |
| `device_id` | string | Device ID. |
| `device_info` | string | Device information. |
| `device_attribution` | string | Device attribution. |
| `tags` | string | Tags. |
| `status` | string | Status. |
| `ip_state` | number | IP state. |
| `company_id` | string | Company ID. |
| `from_company_id` | string | Source company ID. |
| `uid` | string | UID. |
| `oid` | string | Order or owner ID. |
| `virtual` | string | Virtualization value. |
| `proxyaddr` | string | Proxy address. |
| `proxyaddr_arr` | string | Proxy address array or serialized value. |
| `proxyu` | string | Proxy username. Redacted by the helper by default. |
| `proxyp` | string | Proxy password. Redacted by the helper by default. |
| `Proxytype` | string | Proxy type. |
| `publicip` | string | Public IP. |
| `proxyId` | number | Proxy ID. |
| `band_width` | number | Bandwidth value. |
| `instance_no` | string | Cloud instance number. |
| `details_no` | string | Cloud detail number. |
| `cidr_blocks` | null or value | CIDR block value. |
| `ip_type` | number | IP type. |
| `isp_type` | number | ISP type. |
| `net_type` | number | Network type. |
| `ip_query_channel` | string | IP query channel. |
| `ip_place` | string | IP location. |
| `inspect` | number | Inspection state. |
| `asnType` | number | ASN type. |
| `status_text` | string | Status text. |
| `auto_renew_text` | string | Auto-renew text. |
| `tags_arr` | null or value | Tags array. |
| `time_day_num` | number | Remaining day count. |
| `flow_num` | string | Flow value. |
| `serial` | number | Serial number. |
| `isbind` | number | Binding state. |
| `replace_num` | number | Replacement count. |
| `replace_status` | string | Replacement status. |
| `auto_month` | number | Auto-renew month count. |
| `cloud` | object | Cloud package details. |

### `data.data[].cloud`

| Field | Type | Description |
| --- | --- | --- |
| `is_close` | number | Closed state. |
| `created_at` | string | Creation time. |
| `updated_at` | string | Update time. |
| `ext_num` | null or value | Extension number. |
| `package_type` | string | Package type. |
| `region_id` | string | Region ID. |
| `country` | string | Country. |
| `city` | string | City. |
| `cpu` | string | CPU value. |
| `memory` | string | Memory value. |
| `instance_id` | string | Instance ID. |
| `bundle_id` | string | Bundle ID. |
| `display_area` | string | Display area. |
| `display_region` | string | Display region. |
| `ext_rul` | string | Extension URL. |
| `vtype` | string | Virtualization type. |
| `price_json` | object | Price object with `flow` and `multiple`. |
| `packages` | object | Package pricing. `day` and `price` are present; `price` is an array with `month` and `discount`. |
| `dynamic_packages` | null or value | Dynamic package value. |
| `line_price` | number | Line price. |
| `selling_price` | number | Selling price. |
| `origin_price` | number | Original price. |
| `floor_price` | number | Floor price. |
| `proxy_type` | number | Proxy type. |
| `sell_pool` | number | Sell pool. |
| `is_new` | number | New flag. |
| `is_recommend` | number | Recommendation flag. |
| `is_display` | number | Display flag. |
| `is_hot` | number | Hot flag. |
| `is_discount` | number | Discount flag. |
| `remaining` | number | Remaining value. |
| `ip_type` | number | IP type. |
| `isp_type` | number | ISP type. |
| `net_type` | number | Network type. |
| `band_width` | number | Bandwidth value. |
| `asn_type` | number | ASN type. |
| `band_width_type` | number | Bandwidth type. |
| `cidr_status` | number | CIDR status. |
| `max_band_width` | number | Maximum bandwidth. |
| `unit` | number | Unit. |
| `duration` | number | Duration. |
| `band_width_cost` | number | Bandwidth cost. |
| `band_width_price` | number | Bandwidth price. |
| `id` | number | Cloud record ID. |
| `area_code` | string | Area code. |
| `country_code` | string | Country code. |
| `city_code` | string | City code. |
| `detail` | string | Details. |
| `parent_no` | string | Parent number. |
| `name` | string | Cloud package name. |
| `sell_unit` | number | Sell unit. |
| `assign_ip` | number | Assigned IP count. |
| `discount` | number | Discount. |
| `recommend_platform` | string | Recommended platforms. |
| `un_recommend_platform` | string | Unrecommended platforms. |
| `third_recommend_platform` | string | Third-party recommended platforms. |
| `third_un_recommend_platform` | string | Third-party unrecommended platforms. |
| `remark` | string | Notes. |
| `authority` | number | Authority state. |
| `authority_userids` | null or value | Authorized user IDs. |

### Example Response

```json
{
  "code": 200,
  "msgCode": 0,
  "data": {
    "data": [
      {
        "device_name": "<device name>",
        "device_id": "<device id>",
        "proxyaddr": "<proxy address>",
        "proxyu": "[REDACTED]",
        "proxyp": "[REDACTED]",
        "publicip": "<public ip>",
        "status": "1",
        "isbind": 0,
        "cloud": {
          "country": "<country>",
          "city": "<city>",
          "name": "<package name>"
        }
      }
    ],
    "total": 1,
    "current_page": 1,
    "per_page": 20
  },
  "msg": "ok",
  "traceId": "<trace id>"
}
```

## Error Handling

Failures arrive as HTTP 200 with a non-200 business code. Read [ERRORS.md](../ERRORS.md) for the full contract.

| Code | Meaning for this endpoint |
| --- | --- |
| `200` | Success. |
| `1001` | The bearer token was rejected. Run `node scripts/yunlogin-auth.mjs ensure-server`, then ask the user for a fresh token. |
| `400` | The payload was rejected before business validation. Check the field types and required fields above. |
| `500` | The server could not decode the request or find the target. Check field types and confirm the referenced IDs exist. |
| HTTP 401 | No token was supplied. |
| HTTP 404 | The route or HTTP method is not served by this deployment. Do not retry. |

