# createSelfProxy

Source: https://d126447d359e70c0.yunlogin.com/js/createSelfProxy-1788343711349-b193243a-104.js

### Basic Information

> POST /api/v2/userapi/selfproxy/create

### Request Parameters

`proxy` is the proxy object to create.

`proxy` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
| :-------- | :------ | :----- | :-- | :---- | :----- |
| name | Proxy name | string | Yes | | |
| proxytype | Proxy type | int | Yes | 1: SOCKS5 with username and password. 3: SOCKS5 without username and password. 4: HTTP. 5: HTTPS. 6: HTTP with username and password. 7: HTTPS with username and password. | |
| proxyaddr | Proxy address | string | Yes | | |
| proxyu | Login username | string | No | | |
| proxyp | Login password | string | No | | |
| notes | Notes | string | No | | |

### Request Example

```
http://localhost:50213/api/v2/userapi/selfproxy/create
```

### Request Body

```json
{
    "proxy": {
        "name": "proxy1",
        "proxytype": 1,
        "proxyaddr": "1.1.1.1:2333",
        "proxyp": "xxx",
        "proxyu": "xxx",
        "notes": "xxx"
    }
}
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -4: Account login error -6: Daily call limit exceeded (free plan: 100 per day; paid plan: number of windows times 10 per day) -7: Missing permission | |
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