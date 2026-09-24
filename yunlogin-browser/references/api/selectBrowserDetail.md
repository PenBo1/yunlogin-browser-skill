# selectBrowserDetail

Source: https://d126447d359e70c0.yunlogin.com/js/selectBrowserDetail-1788343711349-b87202e0-104.js

### Basic Information

> POST /api/v2/userapi/user/shopdetaillist

### Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| browserid | Browser fingerprint window IDs. Each request can contain at most 10 entries. | []string | Yes | | |

### Request Example

```
http://localhost:50213/api/v2/userapi/user/shopdetaillist
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
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -4: Account login error -7: Missing permission | |
| msg | Success or failure message | string | | |
| data | Response data | object | | |
| browser | Browser fingerprint window list | []object | | |

`browser` array:

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| name | Fingerprint browser name | string | | |
| browserid | ID of the browser window (maximum 10 per request) | string | | |
| notes | Notes | string | | |
| is_star_tag | Whether starred | int | 1: Starred; 0: Not starred | 0 |
| serial | Serial number | int | | |
| label | Labels (see the `label` object) | object | | |
| proxy | Proxy information (see the `proxy` object) | object | | |
| accounts | See the `accounts` object | object | | |
| accountsv2 | Account management information (see the `accountsv2` object) | []object | No | |

`label` object:

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| name | Label name | string | | |
| id | Label ID | string | | |

`proxy` object:

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| name | Proxy name | string | | SOCKS5 |
| type | Proxy protocol. Available values include `socks5`, `http`, `https`, `local`, `v2ray`, and `dynamic`. | string | | SOCKS5 |
| inlie | Proxy type | string | official (platform proxy), self (user proxy), general (proxy API), socks5, http, https, local | local |
| PublicIP | IP address | string | | |
| ipChannel | IP detection channel | string | | |
| deviceType | Platform type: direct local, platform official, user self, general | string | | |
| randEnv | Automatically generate fingerprint fields when the IP changes | bool | | |
| region | Region-country-city | string | | |
| product | Platform proxy type | int | 1: Cloud platform; 2: Home broadband; 3: Domestic dynamic; 4: Overseas dynamic | |
| uuid | Proxy device ID | string | | |

`accounts` object:

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| openurls | Additional URLs to open when the browser starts | []string | | |
| groupid | Group ID | string | | |
| groupName | Group name | string | | |

`accountsv2` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
|:---------|:---------|:-------|:---|:----|:----|
| userPasswordId | Unique account ID | string | No | | |
| name | Account name | string | No | | |
| platformid | Platform ID | string | No | | |
| platformName | Platform name | string | No | | |
| url | Custom account platform URL | string | No | | |
| user | Account | string | No | | |
| remark | Notes | string | No | | |
| platformLock | Lock account credentials | int | No | | |

Success

```json
{
    "code": 0,
    "data": {
        "browser": [
            {
                "browserid": "xxx",
                "name": "fingerprint browser",
                "notes": "",
                "label": [
                    {
                        "id": "",
                        "name": ""
                    }
                ],
                "is_star_tag": 0,
                "serial": 10,
                "proxy": {
                    "name": "",
                    "inlie": "local",
                    "uuid": "",
                    "type": "",
                    "product": 0,
                    "PublicIP": "192.168.0.74",
                    "ipChannel": "",
                    "deviceType": "",
                    "randEnv": false,
                    "region": ""
                },
                "accounts": {
                    "openurls": [],
                    "groupid": "",
                    "groupName": ""
                },
                "accountsv2": [
                    {
                        "url": "",
                        "platformid": "",
                        "user": "",
                        "remark": "",
                        "platformLock": 0,
                        "userPasswordId": "",
                        "platformName": "",
                        "name": ""
                    }
                ]
            }
        ]
    },
    "msg": "Success"
}
```

Failure

```json
{
    "code": -1,
    "msg": "fail message",
    "data": {
        "browser": null
    }
}
```