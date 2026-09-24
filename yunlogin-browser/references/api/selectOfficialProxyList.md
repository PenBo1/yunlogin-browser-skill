# selectOfficialProxyList

Source: https://d126447d359e70c0.yunlogin.com/js/selectOfficialProxyList-1788343711349-4299148d-104.js

### Basic Information

> POST /api/v2/userapi/officialproxy/list

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| page | Page number | int | Yes | | |
| pageSize | Page size, maximum 20 entries | int | Yes | | |
| status | Status | int | No | 0: All; 1: Running; 2: Expired | 0 |
| name | Proxy name | string | No | | |
| publicip | Proxy address | string | No | | |
| ip_place | IP location | string | No | Format: country-city, for example, China-Hangzhou | |
| isbind | Whether bound | int | No | 1: Bound; 2: Not bound | 0 |

### Request Example

```
http://localhost:50213/api/v2/userapi/officialproxy/list
```

### Request Body

```json
{
    "page": 1,
    "pageSize": 10,
    "status": 0
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
| proxyaddr | Proxy address | string | | |
| publicip | Public IP | string | | |
| ip_place | IP location | string | | |
| proxytype | Proxy type | string | 1: Cloud platform; 2: Home broadband; 3: Domestic dynamic; 4: Overseas dynamic | |
| expiredTime | Expiration time | string | | |
| status | Status | string | 1: Running; 2: Expired | |

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
                "name": "",
                "proxyaddr": "",
                "publicip": "",
                "ip_place": "",
                "proxytype": 2,
                "expiredTime": "2025-02-01 18:00:51",
                "status": 2
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