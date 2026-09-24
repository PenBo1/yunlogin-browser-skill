# getAllUrlList

Source: https://d126447d359e70c0.yunlogin.com/js/getAllUrlList-1788343711349-51dd6ecc-104.js

### Basic Information

> POST /api/v2/userapi/getAllUrlList/list

### Request Example

```
http://localhost:50213/api/v2/userapi/getAllUrlList/list
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| code | Status code | int | 200: Success | |
| msg | Success or failure message | string | | |
| fatherclass | Primary category | string | | |
| childclass | Secondary category | string | | |
| grandsonclass | Tertiary category | string | | |
| platformid | Platform ID | string | | |
| platformname | Platform name | string | | |
| website | Website URL | string | | |
| loginurl | Login URL | string | | |
| fatherLabel | Primary label | string | | |
| childLabel | Secondary label | string | | |
| grandsonLabel | Tertiary label | string | | |

Success

```json
{
  "reqId": "c04b292e-1cc7-4ff7-8b8c-129a8f536f71",
  "code": 200,
  "msg": "OK",
  "data": [
    {
      "fatherclass": "e-commerce",
      "childclass": "TikTok Shop",
      "grandsonclass": "Global (cross-border)",
      "platformid": "D245B8A02E4DA255AE89AD11B1122720",
      "platformname": "TikTok Shop",
      "website": "https://seller.tiktokshopglobalselling.com/account/login",
      "loginurl": "https://seller.tiktokshopglobalselling.com/account/login",
      "fatherLabel": "DS",
      "childLabel": "TKS",
      "grandsonLabel": "GLc"
    }
  ]
}
```

Failure

```json
{
    "code": 500,
    "msg": "fail message"
}
```