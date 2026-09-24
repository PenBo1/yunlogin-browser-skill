# deleteCreatedBrowserPrint

Source: https://d126447d359e70c0.yunlogin.com/js/deleteCreatedBrowserPrint-1788343711349-dda42add-104.js

### Basic Information

> POST /api/v2/userapi/user/delete

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| browserid | IDs of the browser fingerprint windows to delete. Each request can contain at most 10 entries. | []string | Yes | | |

### Request Example

```
http://localhost:50213/api/v2/userapi/user/delete
```

### Request Body

```json
{
    "browserid": [
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
    "code":0,
    "msg":"Success"
}
```

Failure

```json
{
    "code": -1,
    "msg": "failed"
}
```