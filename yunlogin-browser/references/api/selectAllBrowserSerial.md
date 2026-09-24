# selectAllBrowserSerial

Source: https://d126447d359e70c0.yunlogin.com/js/selectAllBrowserSerial-1788343711349-cf61b3fc-104.js

### Basic Information

> POST /api/v2/userapi/user/shopseriallist

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| groupId | Group | string | No | | |
| accountName | Environment name | string | No | | |

### Request Example

```
http://localhost:50213/api/v2/userapi/user/shopseriallist
```

### Request Body

```json
{
  "groupId": "",
  "accountName": ""
}
```

### Response Data
| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -4: Account login error | |
| msg | Success or failure message | string | | |
| shopId | Returned environment ID | string | | |
| groupId | Group | string | | |
| serial | Returned environment serial number | int | | |
| accountName | Returned environment name | string | | |

Success

```json
{
    "code": 0,
    "msg": "Success",
    "data": {
        "list": [
            {
                "shopId": "xxx",
                "serial": 96,
                "groupId": "",
                "accountName": "environment name 1"
            }
        ]
    }
}
```

Failure

```json
{
    "code": -1,
    "msg": "fail message",
    "data": {}
}
```