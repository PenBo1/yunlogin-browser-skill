# envBindGroupPlugin

Source: https://d126447d359e70c0.yunlogin.com/js/envBindGroupPlugin-1788343711349-3c41bb75-104.js

Basic Information
> POST /api/v2/userapi/plugin/bindGroupPlugin

Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| ---------- | ------------------------------ | ----- | ---- | ------ | ------ |
| groupId | Group IDs | []string | Yes | | |
| accountIds | Environment IDs | []string | Yes | | |


Request Example
```
http://localhost:50213/api/v2/userapi/plugin/bindGroupPlugin
```


Request Body

```json
{
    "groupId":[
        ""
    ],
    "accountIds":[
        ""
    ]
}
```


Response Data

| Parameter | Description | Type | Allowed Values | Default |
| --------- | -------------------- | ------ | ------ | ------ |
| code | Status code | int | | |
| data | | | | |
| msg | Success or failure message | string | | |
| requestId | | | | |

Success

```json
{
    "code": 200,
    "data": {},
    "msg": "ok",
    "requestId":""
}
```