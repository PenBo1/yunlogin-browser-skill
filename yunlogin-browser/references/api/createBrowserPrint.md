# createBrowserPrint

Source: https://d126447d359e70c0.yunlogin.com/js/createBrowserPrint-1788343711349-293a52c8-104.js

### Basic Information

> POST /api/v2/userapi/user/create

### Request Parameters

`browser` is an array of request objects. Each request can contain at most 10 entries. The fields are described below.

| Parameter | Description | Type | Required | Allowed Values | Default |
|:-----------|:-------------------------|:---------|:---|:----|:----|
| name | Browser name | string | Yes | | |
| notes | Browser notes | string | No | | |
| proxy | Proxy information (see the `proxy` object) | object | Yes | | |
| showBindProxy | Whether the environment list requires a proxy binding. When true, the environment must be bound to a proxy before it can be launched. | bool | No | Yes: true, No: false | |
| accounts | Account association information (see the `accounts` object) | object | No | | |
| accountsv2 | Account management information (see the `accountsv2` object). On the same platform (platform ID or custom account platform URL), only one entry is created per account. | []object | No | | |
| finger | Browser fingerprint information (see the `finger` object) | object | No | | |

`proxy` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
|:----------|:------------------------------------------------------|:-------|:---|:------------------------------------------------------|:----|
| type | Proxy type | string | Yes | official (platform proxy), self (user proxy), general (proxy API), socks5, http, https, local | |
| uuid | Proxy ID. Required when `type` is `official`, `self`, or `general`. The value is available in the User Proxies and Proxy API lists in the UI. | string | No | | |
| region | Country code. Required when `type` is `general` (see the `region` object). | string | No | | |
| publicIP | Public egress IP of the proxy, used for IP-based geolocation. If empty, IP-based optimization cannot configure browser fingerprint information. | string | No | | |
| socks5 | Proxy information used when `type` is `socks5` (see the `socks5` object) | object | No | | |
| http | Proxy information used when `type` is `http` (see the `http` object) | object | No | | |
| https | Proxy information used when `type` is `https` (see the `https` object) | object | No | | |
| ipChannel | Proxy detection channel. Default: ipdata. | string | No | Overseas proxies: ip2location; domestic proxies: ipdata | |

`socks5` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
|:-------|:------|:-------|:---|:----|:----|
| addr | Proxy address | string | Yes | | |
| user | Username | string | No | | |
| passwd | Password | string | No | | |

`http` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
|:-------|:------|:-------|:---|:----|:----|
| addr | Proxy address | string | Yes | | |
| user | Username | string | No | | |
| passwd | Password | string | No | | |

`https` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
|:-------|:------|:-------|:---|:----|:----|
| addr | Proxy address | string | Yes | | |
| user | Username | string | No | | |
| passwd | Password | string | No | | |

`accounts` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
|:---------|:-----------------------------------------------------------------------------------------------------------------------|:---------|:---|:----|:----|
| openurls | URLs to open when the browser starts | []string | No | | |
| groupid | Group ID. Places the new browser profile in the specified group. | string | No | | |
| cookie | <span style="color:#ff0000">Cookies to load into the environment. Do not provide this together with an account. An empty value means no cookie data is stored. To synchronize cookies, this field is required and must be a cookie object or `"[]"`.</span> | string | No | | |

`accountsv2` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
|:---------|:---------|:-------|:---|:----|:----|
| platformid | Platform ID (choose either this field or `url`) | string | No | | |
| url | Custom account platform URL (choose either this field or `platformid`) | string | No | | |
| user | Account | string | No | | |
| password | Password | string | No | | |
| remark | Notes | string | No | | |
| tfa | 2FA secret | string | No | | |
| platformLock | Lock account credentials | int | No | | |
`finger` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :--- | :-- | :--- | :---- | :----- |
| kernel | Browser kernel type | string | Yes | Chrome, Firefox | Chrome |
| kernelversion | Major browser kernel version | string | Yes | 107, 119, 122, 127, 131, 134, 138, 140, 141, 142, 143, 144, 145, 146; 130 (Firefox supports version 130; Chrome supports the other kernel versions) | 141 |
| system | Operating system version | string | Yes | Supported values: Windows 7, Windows 8, Windows 8.1, Windows 10, Windows 11, iOS 14, iOS 15, iOS 16, Android 9, Android 10, Android 11, Android 12, Android 13, macOS 10, macOS 11, macOS 12, macOS 13, macOS 14, macOS 15. If omitted, a value is generated automatically. `All Windows` selects randomly from all supported Windows versions; `All IOS` selects from all supported iOS versions; `All Android` selects from all supported Android versions; `All MacOS` selects from all supported macOS versions. | | |
| uaVersion | Major browser version | int | No | Currently supports 100-138 and 140-147. If omitted, a value is generated automatically. | | |
| userAgent | User-Agent value. If omitted, it is generated from the operating system and browser version. | string | No | | |
| language | Browser languages. If omitted, they are generated from the proxy IP address. See the supported language list. If a dynamic IP is used, Chinese is generated automatically. | []string | No | | |
| zone | Time zone. If omitted, it is generated from the proxy IP address. See the supported time zone list. If a dynamic IP is used, Beijing time is generated automatically. | string | No | | |
| dPI | Screen resolution | string | No | Use `x` as the separator (for example, `1920x1080`). Empty generates a value automatically. `auto` selects randomly. `default` uses the quick-select value. | default |
| fontList | Font list. If omitted, the system generates it automatically. | []string | No | | |
| webRTC | Chrome WebRTC component | int | No | 0: Disabled; websites cannot obtain the IP. 1: Real; websites obtain the real IP. 2: Replace; the proxy IP replaces the real IP. | 0 |
| webRTCIP | Private IP address. Configure this field when WebRTC is set to 2. | string | No | | |
| canvas | Browser canvas fingerprint switch | int | No | 0: Prefer consistency. 1: Disabled. 2: Prefer randomness. | 0 |
| webGl | Browser WebGL metadata fingerprint switch | int | No | 1: Stealth. 2: Real. | 1 |
| webGlInfo | Browser WebGL info | int | No | 1: Real. 2: Custom. | 2 |
| webGLVendor | Browser WebGL vendor. On Windows, supported values are Google Inc. (NVIDIA), Google Inc. (AMD), and Google Inc. (Intel). On macOS, supported values are Google Inc. (ATI Technologies Inc.), Google Inc. (NVIDIA), and Google Inc. (Apple). On Android, the supported value is Qualcomm. On iOS, the supported value is Apple Inc. | string | No | Provide a value for custom mode. If empty, it is generated automatically. | |
| webGLRenderer | Browser WebGL renderer | string | No | Provide a value for custom mode. If empty, it is generated automatically. When this field is not empty, `webGLVendor` is required. | |
| audioContext | Audio stream | int | No | 1: Stealth. 2: Real. | 1 |
| speechVoices | SpeechVoices fingerprint | int | No | 1: Each browser uses the default SpeechVoices of the current computer. 2: Adds noise and generates a different SpeechVoices value for each browser on the same computer. | 2 |
| mediaDevice | Media device switch | int | No | 1: Disabled; each browser uses the default media device ID of the current computer. 2: Enabled; uses a matching value instead of the real media device ID and adds noise. | 1 |
| cpu | Number of CPU cores. If omitted, a value is generated automatically. Allowed values are 4, 8, 12, 16, 20, and 24. | int | No | | |
| mem | Memory size. If omitted, a value is generated automatically. Allowed values are 4 and 8. | int | No | | |
| deviceName | Computer name | string | No | Up to 15 characters. If omitted, a value is generated automatically. | |
| mac | MAC address. If omitted, a value is generated automatically. | string | No | | |
| hardware | Hardware acceleration | int | No | 2: Disabled. 1: Enabled. | 1 |
| bluetooth | Bluetooth | int | No | 2: Disabled. 1: Enabled. | 2 |
| doNotTrack | Browser Do Not Track setting | int | No | 1: Disabled. 2: Enabled. | 2 |
| enablenotice | Web notifications | int | No | 1: Enabled. 2: Disabled. | 1 |
| enablesound | Block audio playback | int | No | 1: Enabled. 2: Disabled. 3: Follow team settings. | 3 |
| enablevideo | Block video loading | int | No | 1: Enabled. 2: Disabled. 3: Follow team settings. | 3 |
| enableGc | Enable garbage collection | int | No | 1: Enabled. 2: Disabled. 3: Follow team settings. | 3 |
| gcTime | Garbage collection time. Required when `enableGc` is 1. | int | No | 1-5 | 1 |
| enableClearStorage | Enable cache clearing | int | No | 1: Enabled. 2: Disabled. 3: Follow team settings. | 3 |
| enableClearCookie | Enable cookie clearing | int | No | 1: Enabled. 2: Disabled. 3: Follow team settings. | 3 |
| enablepic | Block image loading | int | No | 1: Enabled. 2: Disabled. 3: Follow team settings. | 3 |
| picsize | Image size. Required when `enablepic` is 1. | string | No | | |
| enableScanPort | Port scanning protection | int | No | 1: Enabled. 2: Disabled. | 1 |
| randomFinger | Generate a random fingerprint when the environment starts | int | No | 1: Enabled. 2: Disabled. 3: Follow team settings. | 3 |
| scanPort | Allowlist from 0 to 65535. Do not include this field when the feature is disabled. When `enableScanPort` is 1, an empty value automatically generates local ports. | []int | No | | |
| geographic | Geolocation. IP-based geolocation is used by default. This option is disabled for dynamic proxy IP addresses. | object | No | | |

`geographic` object:

| Parameter | Description | Type | Required | Allowed Values | Default |
|:----------|:------------------------------|:-------|:---|:---------------|:----|
| enable | Geolocation setting | int | No | 1: Enabled. 2: Ask. 3: Disabled. | 1 |
| useip | Location method | int | No | 1: Use IP-based geolocation. 2: Custom. | 1 |
| longitude | Longitude. Used when `enable` is 2 and `useip` is 0. | string | No | -180 to 180 | |
| latitude | Latitude. Used when `enable` is 2 and `useip` is 0. | string | No | -90 to 90 | |
| accuracy | Accuracy in meters. Used when `enable` is 2 and `useip` is 0. | string | No | 10 to 5000 | |
`region` object:

| Continent | Countries and Codes |
| :----- | :------ |
| Asia | China (CN), Taiwan (TW), Hong Kong (HK), Macao (MO), Japan (JP), South Korea (KR), India (IN), Iran (IR), Iraq (IQ), Saudi Arabia (SA), United Arab Emirates (AE), Israel (IL), Qatar (QA), Oman (OM), Yemen (YE), Syria (SY), Lebanon (LB), Jordan (JO), Palestine (PS), Turkey (TR), Cyprus (CY), Georgia (GE), Armenia (AM), Azerbaijan (AZ), Afghanistan (AF), Pakistan (PK), Bangladesh (BD), Bhutan (BT), Nepal (NP), Sri Lanka (LK), Maldives (MV), Myanmar (MM), Thailand (TH), Laos (LA), Cambodia (KH), Vietnam (VN), Malaysia (MY), Singapore (SG), Indonesia (ID), Brunei (BN), Philippines (PH), Timor-Leste (TL) |
| Europe | United Kingdom (GB), France (FR), Germany (DE), Italy (IT), Spain (ES), Portugal (PT), Netherlands (NL), Belgium (BE), Luxembourg (LU), Switzerland (CH), Austria (AT), Hungary (HU), Czechia (CZ), Slovakia (SK), Poland (PL), Romania (RO), Bulgaria (BG), Greece (GR), Serbia (RS), Montenegro (ME), Croatia (HR), Slovenia (SI), North Macedonia (MK), Bosnia and Herzegovina (BA), Albania (AL), Iceland (IS), Denmark (DK), Norway (NO), Sweden (SE), Finland (FI), Ireland (IE), Monaco (MC), Liechtenstein (LI), San Marino (SM), Vatican City (VA), Estonia (EE), Latvia (LV), Lithuania (LT), Moldova (MD) |
| Africa | Egypt (EG), Libya (LY), Tunisia (TN), Algeria (DZ), Morocco (MA), Mauritania (MR), Senegal (SN), Gambia (GM), Guinea (GN), Guinea-Bissau (GW), Sierra Leone (SL), Liberia (LR), Cote d'Ivoire (CI), Ghana (GH), Togo (TG), Benin (BJ), Niger (NE), Nigeria (NG), Cameroon (CM), Equatorial Guinea (GQ), Chad (TD), Central African Republic (CF), Sudan (SD), South Sudan (SS), Ethiopia (ET), Eritrea (ER), Somalia (SO), Djibouti (DJ), Kenya (KE), Tanzania (TZ), Uganda (UG), Rwanda (RW), Burundi (BI), Seychelles (SC), Mauritius (MU), Madagascar (MG), Comoros (KM), Mozambique (MZ), Malawi (MW), Zambia (ZM), Zimbabwe (ZW), Botswana (BW), Namibia (NA), South Africa (ZA), Eswatini (SZ), Lesotho (LS), Sao Tome and Principe (ST), Cabo Verde (CV) |
| Americas | Canada (CA), United States (US), Mexico (MX), Guatemala (GT), Belize (BZ), El Salvador (SV), Honduras (HN), Nicaragua (NI), Costa Rica (CR), Panama (PA), Bahamas (BS), Cuba (CU), Jamaica (JM), Haiti (HT), Dominican Republic (DO), Saint Kitts and Nevis (KN), Antigua and Barbuda (AG), Dominica (DM), Saint Lucia (LC), Saint Vincent and the Grenadines (VC), Grenada (GD), Barbados (BB), Trinidad and Tobago (TT), Colombia (CO), Venezuela (VE), Guyana (GY), Suriname (SR), French Guiana (GF), Ecuador (EC), Peru (PE), Brazil (BR), Bolivia (BO), Chile (CL), Argentina (AR), Uruguay (UY), Paraguay (PY) |
| Oceania | Australia (AU), New Zealand (NZ), Papua New Guinea (PG), Solomon Islands (SB), Vanuatu (VU), Fiji (FJ), Kiribati (KI), Micronesia (FM), Marshall Islands (MH), Palau (PW), Tuvalu (TV), Samoa (WS), Tonga (TO), French Polynesia (PF), New Caledonia (NC), Wallis and Futuna (WF), American Samoa (AS), Guam (GU), Northern Mariana Islands (MP), Caribbean Netherlands (BQ), Curacao (CW), Aruba (AW), Sint Maarten (SX), Saint Martin (MF), Aland Islands (AX), Guernsey (GG), Jersey (JE), Isle of Man (IM), Gibraltar (GI), Greenland (GL), Faroe Islands (FO), Anguilla (AI), Bermuda (BM), Cayman Islands (KY), Turks and Caicos Islands (TC) |

### Request Example

```
http://localhost:50213/api/v2/userapi/user/create
```

### Request Body

> Note: If cookies need to be synchronized, this field is required. Provide a cookie object or `"[]"`.

```json
{
    "browser": [
        {
            "name": "fingerprint browser",
            "notes": "",
            "showBindProxy": false,
            "proxy": {
                "uuid": "",
                "publicIP": "",
                "type": "local",
                "region": "",
                "ipChannel": "",
                "socks5": {
                    "addr": "",
                    "user": "",
                    "passwd": ""
                },
                "http": {
                    "addr": "",
                    "user": "",
                    "passwd": ""
                },
                "https": {
                    "addr": "",
                    "user": "",
                    "passwd": ""
                }
            },
            "accounts": {
                "openurls": [
                    ""
                ],
                "groupid": "",
                "cookie": ""
            },
            "accountsv2": [
                {
                    "platformid": "",
                    "url": "",
                    "remark": "",
                    "tfa": "",
                    "platformLock": 0,
                    "password": "",
                    "user": ""
                }
            ],
            "finger": {
                "kernel": "Chrome",
                "kernelversion": "134",
                "uAversion": 134,
                "system": "Windows 10",
                "userAgent": "",
                "language": [],
                "zone": "",
                "dPI": "default",
                "fontList": [],
                "webRTCIP": "",
                "canvas": 0,
                "webGl": 1,
                "webGlInfo": 2,
                "webGLVendor": "Google Inc. (NVIDIA)",
                "audioContext": 1,
                "speechVoices": 2,
                "mediaDevice": 2,
                "cpu": 4,
                "mem": 8,
                "deviceName": "",
                "mac": "",
                "hardware": 1,
                "bluetooth": 2,
                "doNotTrack": 2,
                "enablenotice": 1,
                "enablesound": 3,
                "enablevideo": 3,
                "enableGc": 3,
                "gcTime": 1,
                "enableClearStorage": 3,
                "enableClearCookie": 3,
                "enablepic": 3,
                "picsize": "",
                "enableScanPort": 1,
                "randomFinger": 3,
                "scanPort": [],
                "geographic": {
                    "enable": 1,
                    "useip": 1,
                    "longitude": "",
                    "latitude": "",
                    "accuracy": ""
                }
            }
        }
    ]
}
```

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
|:-----|:-----------|:-------|:--------------------------------------------------------|:----|
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -3: Insufficient windows -4: Account login error -5: Failed to create the user proxy, so the environment could not be created -6: Daily call limit exceeded (free plan: 100 per day; paid plan: number of windows times 10 per day) -7: Missing permission | |
| msg | Success or failure message | string | | |
| name | Window name supplied in the request | string | | |
| id | ID of the new fingerprint window | string | | |

Success

```json
{
  "code": 0,
  "msg": "Success",
  "data": {
    "browse": [
      {
        "id": "xxx",
        "name": "fingerprint browser"
      }
    ]
  }
}
```

Failure

```json
{
  "code": -1,
  "msg": "fail message",
  "data": {
    "browse": null
  }
}
```