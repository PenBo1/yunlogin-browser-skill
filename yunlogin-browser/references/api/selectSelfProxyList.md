# selectSelfProxyList

Source: https://d126447d359e70c0.yunlogin.com/js/selectSelfProxyList-1788343711349-266c7d96-104.js

### Basic Information

> POST /api/v2/userapi/selfproxy/list

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| page | Page number | int | Yes | | |
| pageSize | Page size, maximum 20 entries | int | Yes | | |
| name | Proxy name | string | No | | |
| publicip | Proxy address | string | No | | |
| ip_place | IP location | string | No | Format: country-city, for example, China-Hangzhou | |
| isbind | Whether bound | int | No | 1: Bound; 2: Not bound | 0 |

### Request Example

```
http://localhost:50213/api/v2/userapi/selfproxy/list
```

### Request Body

```json
{
    "page": 1,
    "pageSize": 10,
    "name": "",
    "isbind":0,
    "ip":"",
    "ip_place":""
}
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -4: Account login error | |
| msg | Success or failure message | string | | |
| deviceid | Proxy ID | string | | |
| companyid | Team ID | string | | |
| name | Proxy name | string | | |
| proxytype | Proxy type | int | 1: SOCKS5 with username and password. 3: SOCKS5 without username and password. 4: HTTP. 5: HTTPS. 6: HTTP with username and password. 7: HTTPS with username and password. | |
| proxyaddr | Proxy address | string | | |
| publicip | Public IP | string | | |
| ip_place | IP location | string | | |
| notes | Notes | string | | |
| createdat | Creation time | string | | |

Success

```json
{
    "code": 0,
    "msg": "Success",
    "data": {
        "list": [
            {
                "deviceid": "xxx",
                "companyid": "xxx",
                "name": "updated proxy",
                "proxyaddr": "1.1.1.1:2333",
                "proxytype": 1,
                "publicip": "",
                "ip_place": "",
                "notes": "updated 1",
                "createdat": "2024-04-12 15:58:06"
            }
        ],
        "total": 1,
        "pageSize": 10,
        "currentPage": 1
    }
}
```

Failure

```json
{
    "code": -1,
    "msg": "fail message"
}
```