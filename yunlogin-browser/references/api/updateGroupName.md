# updateGroupName

Source: https://d126447d359e70c0.yunlogin.com/js/updateGroupName-1788343711349-03781221-104.js

### Basic Information

> POST /api/v2/userapi/group/update

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :-- | :--- | :--- | :---- | :---- |
| groupid | Group ID | string | Yes | | |
| name | Group name | string | No | 2 to 40 characters | |

### Request Example
```
http://localhost:50213/api/v2/userapi/group/update
```

### Request Body
```json
{
    "groupid":"xxx",
    "name":"group test"
}
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Group name is too long or too short -4: Account login error | |
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
    "code": -2,
    "msg": "fail message"
}
```