# createGroup

Source: https://d126447d359e70c0.yunlogin.com/js/createGroup-1788343711349-2d75a2d0-104.js

### Basic Information

> POST /api/v2/userapi/group/create

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| name | Group name | string | Yes | 2 to 40 characters | |

### Request Example

```
http://localhost:50213/api/v2/userapi/group/create
```
### Request Body

```json
{
    "name": "xxx"
}
```

### Response Data

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Group name is too long or too short -3: A group with this name already exists -4: Account login error -5: Group limit exceeded (maximum 200 groups) | | |
| msg | Success or failure message | string | | |
| data | Response data | object | | |

`data` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| groupid | ID of the new group | string | | |
| group | Name of the new group | string | | |

Success

```json
{
    "code":0,
    "msg":"Success",
    "data":{
        "groupid":"xxx",
        "group":"fingerprint browser test group"
    }
}
```

Failure

```json
{
    "code": -1,
    "msg": "fail message",
    "data": {
        "groupid": "",
        "group": ""
    }
}
```