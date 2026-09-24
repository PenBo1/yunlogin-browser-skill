# updateCookies

Source: https://d126447d359e70c0.yunlogin.com/js/updateCookies-1788343711349-1fac2f9c-104.js

### Basic Information

> POST /api/v2/userapi/cookie/upsert

### Request Parameters

WARNING: <span style="color:#ff0000">Close the current environment before calling this endpoint.</span>

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| shopid | Environment ID | string | Yes | | |
| cookies | Standard cookie format | `cookies` | Yes | | |

`cookies` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| name | Name | string | Yes | | |
| value | Value | string | Yes | | |
| domain | Valid domain | string | Yes | | |
| expirationDate | Expiration date | number | Yes | | |
| hostOnly | Whether the domain must match exactly | boolean | Yes | | |
| httpOnly | Prevent JavaScript from accessing the cookie | boolean | Yes | | |
| path | Path | string | Yes | | |
| sameSite | Third-party cookie restriction | string | Yes | Strict: Fully blocked. Lax: Allowed except for GET requests. None: Allow all; the Secure attribute must also be set. | |
| secure | Secure attribute | boolean | Yes | | |
| session | | boolean | Yes | | |
| storeId | | string | Yes | | |
| port | Port | int | Yes | | |

### Request Example

```
http://localhost:50213/api/v2/userapi/cookie/upsert
```

### Request Body

```json
{
    "shopid": "xxx",
    "cookies": [
        {
            "domain": ".XXX.cn",
            "hostOnly": false,
            "httpOnly": false,
            "name": "Hm_lpvt_a73626d29XXX",
            "path": "/",
            "sameSite": "",
            "secure": false,
            "session": false,
            "storeId": "",
            "value": "1711004434",
            "port": 443
        }
    ]
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