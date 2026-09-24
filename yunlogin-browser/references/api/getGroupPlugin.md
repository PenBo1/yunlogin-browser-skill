# getGroupPlugin

Source: https://d126447d359e70c0.yunlogin.com/js/getGroupPlugin-1788343711349-9cb07afa-104.js

> Basic Information: POST /api/v2/userapi/plugin/groupPluginList

Request Parameters

| Parameter | Description | Type | Required | Allowed Values | Default |
| -------- | ------------ | ------ | ---- | ------ | ------ |
| page | Page number | int | Yes | | |
| pageSize | Page size (maximum 20 entries) | int | Yes | | |
| sort | Sort order | string | No | 1: Ascending; any value other than 1: Descending | Descending |

Request Example
```
http://localhost:50213/api/v2/userapi/plugin/groupPluginList?pageIndex=1&pageSize=10086
```

Response Data

| Parameter | Description | Type | Allowed Values | Default |
| ------------ | -------------------- | ------ | ------ | ------ |
| code | Status code | int | | |
| msg | Success or failure message | string | | |
| globalPlugin | Global plugins | object | | |
| userPlugin | Personal plugins | object | | |

`globalPlugin` array:

| Parameter | Description | Type | Allowed Values | Default |
| ----------- | ------------ | ------ | ------ | ------ |
| pluginGroup | Plugin group information | object | | |
| companies | Plugin information | object | | |

`pluginGroup` object:

| Parameter | Description | Type | Allowed Values | Default |
| --------- | -------------------------------- | ------ | ------ | :----- |
| CreatedAt | Creation time | string | | |
| UpdatedAt | Update time | string | | |
| groupId | Group ID | string | | |
| companyId | Team ID | string | | |
| userId | User ID | string | | |
| groupName | Group name | string | | |
| isGlobal | Whether global mode is enabled | int | 1: Global; 2: Not global | |
| groupType | Group type | int | 1: Team group; 2: Personal group | |
| remark | Notes | string | | |

`companies` object:

| Parameter | Description | Type | Allowed Values | Default |
| ------------------ | -------------------------------- | ------ | ------ | ------ |
| accountIds | Authorized accounts | []string | | |
| pluginId | Plugin ID | string | | |
| uids | UIDs | []string | | |
| companyId | Company ID | string | | |
| uuid | UUID | string | | |
| userName | Login username | string | | |
| nickName | User nickname | string | | |
| version | Version | string | | |
| pluginCompanyId | Identifier | string | | |
| permissions | Permission set | string | | |
| name | Name | string | | |
| icon | Icon | string | | |
| card | Card preview image | string | | |
| brief | Summary | string | | |
| author | Provider | string | | |
| catIds | Category ID set | string | | |
| CreatedAt | Creation time | string | | |
| lookNum | View count | int | | |
| installNum | Install count | int | | |
| sort | Sort order | int | | |
| installStatus | Installation status | int | | |
| kernel | Plugin kernel | int | 1: Chrome; 2: Firefox; 3: Universal | |
| firefoxVersion | Firefox plugin version | string | | |
| firefoxPermissions | Firefox permission set | string | | |
| firefoxUuid | Firefox extension ID | string | | |
| userId | Owner | string | | |
| uplinkId | Uploader | string | | |
| isGlobal | Whether global mode is enabled | int | 1: Global; 2: Not global | |
| isTeam | Whether visible to the team | int | 1: Visible; 2: Not visible | |
| groupId | Group IDs | []string | | |
| groupName | Group names | []string | | |
| pluginType | Plugin type | int | 1: Official plugin; 2: Customer plugin | |
| detail | Description | string | | |
| teamStatus | Team status | int | | |

Success

```json
{
    "code": 200,
    "data": {
        "globalPlugin": {
            "list": [
                {
                    "pluginGroup": {
                        "ID": 266,
                        "CreatedAt": "2025-03-31T10:46:23+08:00",
                        "UpdatedAt": "2025-03-31T10:46:23+08:00",
                        "groupId": "xxx",
                        "companyId": "xxx",
                        "userId": "xxx",
                        "groupName": "22222222",
                        "isGlobal": 2,
                        "groupType": 1,
                        "remark": ""
                    },
                    "companies": []
                }
            ],
            "count": 1,
            "pageIndex": 1,
            "pageSize": 10086
        },
        "userPlugin": {
            "list": [
                {
                    "pluginGroup": {
                        "ID": 265,
                        "CreatedAt": "2025-03-31T10:46:17+08:00",
                        "UpdatedAt": "2025-03-31T10:46:17+08:00",
                        "groupId": "xxx",
                        "companyId": "xxx",
                        "userId": "xxx",
                        "groupName": "1111111111",
                        "isGlobal": 2,
                        "groupType": 2,
                        "remark": ""
                    },
                    "companies": [
                        {
                            "accountIds": null,
                            "pluginId": "xxx",
                            "uids": null,
                            "companyId": "xxx",
                            "uuid": "xxx",
                            "userName": "",
                            "nickName": "",
                            "version": "3.5.0",
                            "pluginCompanyId": "xxx",
                            "permissions": null,
                            "name": "wxt-plugin",
                            "icon": "",
                            "card": "",
                            "brief": "",
                            "author": "user upload",
                            "catIds": "",
                            "CreatedAt": "2025-03-31T10:45:42+08:00",
                            "lookNum": 0,
                            "installNum": 0,
                            "sort": 99,
                            "installStatus": 1,
                            "kernel": 1,
                            "firefoxVersion": "",
                            "firefoxPermissions": null,
                            "firefoxUuid": "",
                            "userId": "xxx",
                            "uplinkId": "xxx",
                            "isGlobal": 2,
                            "isTeam": 2,
                            "groupId": [
                                "xxx"
                            ],
                            "groupName": [
                                "1111111111"
                            ],
                            "pluginType": 2,
                            "detail": "",
                            "teamStatus": 0
                        }
                    ]
                }
            ],
            "count": 1,
            "pageIndex": 1,
            "pageSize": 10086
        }
    },
    "msg": "ok",
    "requestId": ""
}
```