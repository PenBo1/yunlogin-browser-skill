# checkStartStatus

Source: https://d126447d359e70c0.yunlogin.com/js/checkStartStatus-1788343711349-625b3362-104.js

### Basic Information

> GET /api/v2/browser/status

Description: Returns the launch status of an environment browser. An environment ID is required.

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| account_id | Environment ID; the unique ID generated after the environment is imported successfully | string | Yes | | |

### Request Example

```
http://localhost:50213/api/v2/browser/status?account_id=d03ca5de08ec8e02c4b78558ee84d7fc
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -4: Account login error | |
| msg | Success or failure message | string | | |
| data | Response data | object | | |

`data` object:

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| status | Browser status | string | "Active": The browser is open and running. "Inactive": The browser is not open. | |
| ws | WebSocket information | object | | |

`ws` object:

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| selenium | Browser debug endpoint that can be used for Selenium automation | string | | |
| puppeteer | Browser debug endpoint that can be used for Puppeteer automation | string | | |

Success

```json
{
    "code":0,
    "data":{
        "status":"Active",
        "ws":{
            "selenium":"127.0.0.1:xxxx",
            "puppeteer":"ws://127.0.0.1:xxxx/devtools/browser/xxxxxx"
        }
    }
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