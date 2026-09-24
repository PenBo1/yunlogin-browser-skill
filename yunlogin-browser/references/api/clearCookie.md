# clearCookie

Source: https://d126447d359e70c0.yunlogin.com/js/clearCookie-1788343711349-2ef33afb-104.js

### Basic Information

> POST /api/v2/userapi/cookie/clear

### Request Parameters

WARNING: <span style="color:#ff0000">Close the current environment before calling this endpoint.</span>

| Parameter | Description | Type | Required | Allowed Values | Default |
|:-------|:-----|:-------|:---|:----|:----|
| shopid | Environment ID | string | Yes | | |

### Request Example

```
http://localhost:50213/api/v2/userapi/cookie/clear
```

### Request Body

```json
{
  "shopid": "xxx"
}
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
|:-----|:-----------|:-------|:-------------|:----|
| code | Status code | int | 0: Success -1: Cleanup error | |
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