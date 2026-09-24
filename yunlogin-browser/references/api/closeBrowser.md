# closeBrowser

Source: https://d126447d359e70c0.yunlogin.com/js/closeBrowser-1788343711349-f3be54ff-104.js

### Basic Information

> GET /api/v2/browser/stop

Description: Closes the browser associated with an environment. An environment ID is required.

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| account_id | Environment ID; the unique ID generated after the environment is imported successfully | string | Yes | | |

### Request Example

```
http://localhost:50213/api/v2/browser/stop?account_id=d03ca5de08ec8e02c4b78558ee84d7fc
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
    "msg":"success"
}
```

Failure

```json
{
    "code":-1,
    "data":{},
    "msg":"failed"
}
```