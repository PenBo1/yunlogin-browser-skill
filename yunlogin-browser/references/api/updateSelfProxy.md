# updateSelfProxy

Source: https://d126447d359e70c0.yunlogin.com/js/updateSelfProxy-1788343711349-b85a507d-104.js

### Basic Information

> POST /api/v2/userapi/selfproxy/update

### Request Parameters

`proxy` is the proxy object to update.

`proxy` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| deviceid | Proxy ID | string | Yes | | |
| name | Proxy name | string | Yes | | |
| proxytype | Proxy type | int | No | 0: Do not modify. 1: SOCKS5 with username and password. 3: SOCKS5 without username and password. 4: HTTP. 5: HTTPS. 6: HTTP with username and password. 7: HTTPS with username and password. | |
| proxyaddr | Proxy address. An empty value means no change. | string | No | | |
| proxyu | Login username. An empty value means no change. | string | No | | |
| proxyp | Login password. An empty value means no change. | string | No | | |
| notes | Notes. An empty value means no change. | string | No | | |

### Request Example

```
http://localhost:50213/api/v2/userapi/selfproxy/update
```

### Request Body

```json
{
    "proxy": {
        "name": "updated proxy",
        "proxytype": 0,
        "proxyaddr": "1.1.1.1:2333",
        "deviceid": "xxx",
        "notes": "xxx",
        "proxyu": "xxx",
        "proxyp": "xxx"
    }
}
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -4: Account login error | |
| msg | Success or failure message | string | | |

Success

```json
{
    "code": 0,
    "msg": "Success"
}
```

Failure

```json
{
    "code": -1,
    "msg": "fail message"
}
```