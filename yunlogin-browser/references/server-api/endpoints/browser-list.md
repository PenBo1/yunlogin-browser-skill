# Browser List

- Surface: server API
- Endpoint ID: `browser-list`
- Method: `POST`
- Path: `/v2/newbrowser/getconditionshops`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: Success`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns browser fingerprint environments that match the supplied filters. The response is paginated and includes the environment list plus the total environment count.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `groupid` | string | No | `""` | Filter by group ID. |
| `shopname` | string | No | `""` | Filter by environment name. |
| `serial` | number | No | `0` | Filter by environment serial number. |
| `sortorder` | number | No | `12` | Sort order. |
| `remark` | string | No | `""` | Filter by notes. |
| `label` | string | No | `""` | Filter by label. |
| `authoritiesUserid` | [] | No | `[]` | Filter by authorized user IDs. |
| `labelids` | [] | No | `[]` | Filter by label IDs. |
| `companyid` | string | Yes | `""` | Company ID. Can be injected from `YUNLOGIN_SERVER_COMPANY_ID`. |
| `userid` | string | Yes | `""` | User ID. Can be injected from `YUNLOGIN_SERVER_USER_ID`. |
| `enable` | number | No | `1` | Enable filter. |
| `offer` | number | No | `0` | Pagination offset. |
| `number` | number | No | `100` | Number of environments to return. |
| `browserid` | [] | No | `[]` | Filter by browser IDs. |
| `self` | boolean | No | `false` | Include or filter self-owned environments. |
| `transfers` | boolean | No | `false` | Transfer filter. |
| `share` | boolean | No | `false` | Share filter. |
| `authorities` | boolean | No | `false` | Authorization filter. |
| `open_by_others` | boolean | No | `false` | Filter by environments opened by others. |
| `create_by_others` | boolean | No | `false` | Filter by environments created by others. |

### Example Request

```json
{
  "groupid": "",
  "shopname": "",
  "serial": 0,
  "sortorder": 12,
  "remark": "",
  "label": "",
  "authoritiesUserid": [],
  "labelids": [],
  "companyid": "<companyid>",
  "userid": "<userid>",
  "enable": 1,
  "offer": 0,
  "number": 1,
  "browserid": [],
  "self": false,
  "transfers": false,
  "share": false,
  "authorities": false,
  "open_by_others": false,
  "create_by_others": false
}
```

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
$env:YUNLOGIN_SERVER_COMPANY_ID = "<companyid>"
$env:YUNLOGIN_SERVER_USER_ID = "<userid>"

node scripts/yunlogin-server-api.mjs browser-list --body-file request.json --dry-run
node scripts/yunlogin-server-api.mjs browser-list --body-file request.json
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `allshopnumb` | number | Total number of matching environments. |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. |
| `shop` | array | Browser environment list. |

### `shop[]` Fields

| Field | Type | Description |
| --- | --- | --- |
| `shopid` | string | Environment ID. |
| `cdk` | string | Environment CDK. Redacted by the helper by default. |
| `platformicon` | string | Platform icon. |
| `url` | string | Environment URL. |
| `platformid` | string | Platform ID. |
| `company_id` | string | Company ID. |
| `group` | object | Group information: `name`, `groupid`. |
| `name` | string | Environment name. |
| `accounts` | string | Account association value. |
| `proxyip` | string | Proxy IP. |
| `Country` | string | Proxy country. |
| `City` | string | Proxy city. |
| `dynamic` | number | Dynamic proxy indicator. |
| `notes` | string | Notes. |
| `isstartag` | number | Star/favorite state. |
| `topOrder` | number | Top ordering value. |
| `label` | null or object | Label value. |
| `createby` | string | Creator user ID. |
| `authorized` | null or value | Authorization state. |
| `serial` | number | Environment serial number. |
| `lastlogintime` | string | Last login time. |
| `lastloginUser` | string | Last login user ID. |
| `createtime` | string | Creation time. |
| `updatedtime` | string | Update time. |
| `deletetime` | string | Delete time. |
| `thisshare` | number | Share state. |
| `proxyTransfers` | number | Proxy transfer state. |
| `proxyDel` | number | Proxy deletion state. |
| `website` | string | Website value. |
| `system` | string | Operating system. |
| `proxyId` | string | Proxy ID. |
| `device_type` | string | Device or proxy type. |
| `flag` | number | Internal flag. |
| `originalIp` | string | Original IP. |
| `lastUrls` | string | Last URLs. |
| `share_num` | number | Share count. |
| `authorization` | number | Authorization state. |
| `expired_time` | string | Expiration time. |
| `isTransfer` | number | Transfer state. |
| `kernelVersion` | string | Browser kernel version. |
| `kernel` | string | Browser kernel. |
| `ipChannel` | string | IP detection channel. |
| `inspect` | number | Inspection state. |
| `proxy` | object | Proxy details. Contains `name`, `inlie`, `uuid`, `type`, `product`, `PublicIP`, `ipChannel`, `deviceType`, `randEnv`, `proxyaddrArr`, `region`, `dns`, `socks5`, `http`, `https`, `ssh`, `v2Ray`, `zhima`, and `dynamic` fields. |
| `userPasswordIds` | string | Associated account IDs. |
| `proxyEndTime` | string | Proxy expiration time. |
| `passwords` | array | Associated account/password records. |
| `authority` | array | Authority user IDs. |
| `storage` | number | Storage value. |
| `kernelId` | number | Kernel ID. |
| `shareRemark` | string | Share remark. |
| `shareUrl` | string | Share URL. |
| `enableClearStorage` | number | Clear-storage setting. |
| `clearStorage` | boolean | Clear-storage state. |

### Example Response

```json
{
  "allshopnumb": 1,
  "code": 200,
  "msg": "Success",
  "shop": [
    {
      "shopid": "<shopid>",
      "cdk": "[REDACTED]",
      "name": "<environment name>",
      "group": {
        "name": "<group name>",
        "groupid": "<groupid>"
      },
      "proxyip": "<proxy ip>",
      "Country": "<country>",
      "City": "<city>",
      "serial": 1,
      "kernel": "Chrome",
      "kernelVersion": "141",
      "proxy": {
        "name": "<proxy name>",
        "inlie": "self",
        "uuid": "<proxy uuid>",
        "type": "http",
        "PublicIP": "<proxy public ip>"
      },
      "userPasswordIds": "<account id>",
      "authority": [1]
    }
  ]
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

## Notes

The actual response can contain account, proxy, and environment identifiers. The helper redacts `cdk`, proxy usernames/passwords, and common credential fields by default. Use `--show-sensitive` only when the user explicitly requests raw values and the output destination is safe.