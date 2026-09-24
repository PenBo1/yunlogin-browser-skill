# selectGroup

Source: https://d126447d359e70c0.yunlogin.com/js/selectGroup-1788343711349-017dfe03-104.js

### Basic Information

> POST /api/v2/userapi/group/list

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| group | Fuzzy group-name filter | string | No | | |
| offer | Start from the specified offset | int | Yes | Minimum value is 0 | |
| number | Number of entries to retrieve | int | Yes | Maximum 20 entries | |

### Request Example

```
http://localhost:50213/api/v2/userapi/group/list
```

### Request Body

```json
{
    "group": "xxx",
    "offer": 0,
    "number": 20
}
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -4: Account login error | |
| msg | Success or failure message | string | | |
| name | Group name | string | | |
| gropid | Group ID | string | | |

Success

```json
{
    "code":0,
    "msg":"Success",
    "data":{
        "group":[
            {
                "name":"fingerprint browser test group 1",
                "gropid":"xxx"
            },
            {
                "name":"fingerprint browser test group 2",
                "gropid":"xxx"
            }
        ]
    }
}
```

Failure

```json
{
    "code": -2,
    "msg": "fail message",
    "data": {
        "group": null
    }
}
```