# Server API Code Legends

Some read routes return a numeric or symbolic code next to a human label, for example a
`pay_type` code plus its `pay_type_text` label. This document pairs those fields from the live
response, so the meaning of each observed code comes from the API itself rather than a guess.

Where a field has no sibling label the meaning is still unconfirmed - check
[FIELD_VALUES.md](FIELD_VALUES.md) for its observed values and this file for confirmed meanings.

- Probe time: 2026-10-12T03:40:05.936Z

- Routes with a legend: 4
- Code fields with a confirmed meaning: 8
- Code -> meaning pairs: 31

## GET /v2/cost/costmanagement/getOrderManagementNew

| Field | Code | Meaning |
| --- | --- | --- |
| `$.data.data[].pay_type` | `0` | 系统 |
| `$.data.data[].pay_status` | `1` | 已支付 |
| `$.data.data[].order_type` | `3` | 套餐订单 |
| `$.data.data[].order_status` | `3` | 已完成 |
| `$.data.data[].order_detail_all[].details_status` | `3` | 已完成 |

## GET /v2/plugin/getPluginCategoryGroupList

| Field | Code | Meaning |
| --- | --- | --- |
| `$.list[].type` | `1` | 功能分类 |
| `$.list[].type` | `2` | 电商分类 |

## POST /v2/team/right/list

| Field | Code | Meaning |
| --- | --- | --- |
| `$.data[].type` | `1` | 环境管理 |
| `$.data[].type` | `2` | 代理管理 |
| `$.data[].type` | `3` | 费用管理 |
| `$.data[].type` | `4` | 团队管理 |
| `$.data[].type` | `5` | 日志管理 |
| `$.data[].type` | `6` | 账号管理 |
| `$.data[].type` | `7` | 插件管理 |
| `$.data[].type` | `8` | 新建浏览器 |
| `$.data[].type` | `9` | 回收站 |
| `$.data[].type` | `10` | RPA |
| `$.data[].type` | `11` | 分享转移 |
| `$.data[].type` | `12` | 账号设置 |
| `$.data[].type` | `13` | 设置 |
| `$.data[].type` | `15` | API |
| `$.data[].type` | `16` | 窗口同步 |
| `$.data[].type` | `18` | 商城 |
| `$.data[].type` | `21` | 开票设置 |

## POST /v2/team/right/listTemplate

| Field | Code | Meaning |
| --- | --- | --- |
| `$.data[].templateType` | `1` | 管理员权限 |
| `$.data[].templateType` | `2` | 经理权限 |
| `$.data[].templateType` | `3` | 员工权限 |
| `$.data[].templateType` | `4` | RPA工程师 |
| `$.data[].templateType` | `5` | 自动化开发 |
| `$.data[].templateType` | `6` | 行政权限 |
| `$.data[].templateType` | `7` | 财务权限 |

## Traps

- `vcnplist` / `findVcnpList` report `auto_renew: 1` as `????` (auto-renew **off**). Do not read that
  code as "enabled" - it is the inverse of the usual flag convention.
- `pay_status` and `order_status` are different enums with overlapping numbers. On the tested account
  `pay_status: 1` is `???` while `order_status: 1` was never observed; always read the matching `*_text`.
- A code that only appears with one label is still a sample: the API can return values this account has
  never produced, so treat the tables as confirmed examples, not closed enums.
