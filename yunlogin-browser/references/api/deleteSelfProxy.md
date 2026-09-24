# deleteSelfProxy

Source: https://d126447d359e70c0.yunlogin.com/js/deleteSelfProxy-1788343711349-860f1e8e-104.js

### Basic Information

> POST /api/v2/userapi/selfproxy/delete

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| deviceid | Proxy IDs. Each request can contain at most 10 entries. | []string | Yes | | |

### Request Example

```
http://localhost:50213/api/v2/userapi/selfproxy/delete
```

### Request Body

```json
{
    "deviceid": [
        "xxx",
        "xxx"
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