# apiStatus

Source: https://d126447d359e70c0.yunlogin.com/js/apiStatus-1788343711349-b0ea0a81-104.js

### Basic Information

> GET /status

Description: Checks whether the API is available.

### Request Example
```
http://localhost:50213/status
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :--| :-- | :--- | :--- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -4: Account login error | | |
| msg | Success or failure message | string | | |


Success

```json
{
  "code": 0,
  "msg": "success"
}
```