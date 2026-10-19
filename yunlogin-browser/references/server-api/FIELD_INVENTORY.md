# Server API Field Inventory

This document is generated from live probes against the tested management-center origin.
It records request field names and observed response field paths/types. Values, Tokens, Cookies, and credentials are intentionally not recorded here.

- Probe time: 2026-10-09T03:01:34.394Z
- Cataloged server endpoints: 54
- Read sweep: 43 successful routes, 3 routes not served (HTTP 404), and 8 routes skipped (mutations and credential-gated login).
- Parameter sweep: 97 read-only cases varying one request field at a time; see PARAMETER_MATRIX.md.
- Mutation coverage: environment create/clone/delete, group create/delete, and tag upsert/delete were exercised with temporary resources.
- Cleanup verification: no codex-sweep environment, group, or tag remained.

## Common Field Meanings

| Field family | Meaning |
| --- | --- |
| `code` | Business status code; 200 is success. |
| `msg` | Localized operator-facing result message. |
| `reqId / requestId` | Request correlation identifier. |
| `traceId` | Trace identifier used by newer proxy routes. |
| `data` | Endpoint payload container. |
| `total` | Total number of records matching the query. |
| `currentPage / current_page` | Current result page. |
| `pageSize / per_page` | Number of records requested per page. |
| `shopid / accountId` | Environment or account identifier. |
| `labelid / label` | Tag identifier / tag display name. |
| `gropid / groupid / groupId` | Group identifier; the live API also uses the misspelled gropid. |
| `companyid / company_id` | Company identifier. |
| `userid / user_id` | User identifier. |
| `created_at / createtime / createdAt` | Creation timestamp. |
| `updated_at / updatedtime / updatedAt` | Last update timestamp. |

## browser-list

- Method: `POST`
- Path: `/v2/newbrowser/getconditionshops`
- Catalog document: [`endpoints/browser-list.md`](endpoints/browser-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `groupid`, `shopname`, `serial`, `sortorder`, `remark`, `label`, `authoritiesUserid`, `labelids`, `companyid`, `userid`, `enable`, `offer`, `number`, `browserid`, `self`, `transfers`, `share`, `authorities`, `open_by_others`, `create_by_others`

Required body fields: `companyid`, `userid`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.allshopnumb` | number |  | Count. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.shop` | array | 100 | Environment rows. |
| `$.shop[]` | object |  | Environment rows. |
| `$.shop[].accounts` | string |  | Count. |
| `$.shop[].authority` | array | 1 | Permission/authority level for the row. |
| `$.shop[].authority[]` | number |  | Permission/authority level for the row. |
| `$.shop[].authorization` | number |  | Authorization state for the row. |
| `$.shop[].authorized` | null |  | Authorization record when the row is shared/authorized. |
| `$.shop[].cdk` | string |  | Redemption/trial code attached to the environment. |
| `$.shop[].City` | string |  | Geolocated city. |
| `$.shop[].clearStorage` | boolean |  | Whether storage is cleared on launch. |
| `$.shop[].company_id` | string |  | Identifier. |
| `$.shop[].Country` | string |  | Count. |
| `$.shop[].createby` | string |  | Creator user ID. |
| `$.shop[].createtime` | string |  | Timestamp. |
| `$.shop[].deletetime` | string |  | Timestamp. |
| `$.shop[].device_type` | string |  | Type discriminator. |
| `$.shop[].dynamic` | number |  | Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal. |
| `$.shop[].enableClearStorage` | number |  | Enabled flag. |
| `$.shop[].expired_time` | string |  | Timestamp. |
| `$.shop[].flag` | number |  | Row flag value. |
| `$.shop[].group` | object |  | Group object or name. |
| `$.shop[].group.groupid` | string |  | Identifier. |
| `$.shop[].group.name` | string |  | Display name. |
| `$.shop[].inspect` | number |  | Proxy inspection/health-check flag. |
| `$.shop[].ipChannel` | string |  | IP detection channel. |
| `$.shop[].isstartag` | number |  | Star-tag flag for the environment. |
| `$.shop[].isTransfer` | number |  | Whether the environment was transferred. |
| `$.shop[].kernel` | string |  | Browser kernel name. |
| `$.shop[].kernelId` | number |  | Identifier. |
| `$.shop[].kernelVersion` | string |  | Kernel version preset. |
| `$.shop[].label` | null |  | Tag label object or tag IDs. |
| `$.shop[].lastlogintime` | string |  | Timestamp. |
| `$.shop[].lastloginUser` | string |  | User ID of the last environment login. |
| `$.shop[].lastUrls` | string |  | Last opened URLs. |
| `$.shop[].name` | string |  | Display name. |
| `$.shop[].notes` | string |  | Free-text notes. |
| `$.shop[].originalIp` | string |  | Original IP value. |
| `$.shop[].passwords` | array | 0 | Bound account passwords. |
| `$.shop[].platformicon` | string |  | Icon URL or identifier. |
| `$.shop[].platformid` | string |  | Identifier. |
| `$.shop[].proxy` | object |  | Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself. |
| `$.shop[].proxy.deviceType` | string |  | Type discriminator. |
| `$.shop[].proxy.dns` | object |  | DNS fingerprint/proxy block. |
| `$.shop[].proxy.dns.inside` | boolean |  | Whether DNS resolution happens inside the tunnel. |
| `$.shop[].proxy.dns.mode` | boolean |  | Mode flag. |
| `$.shop[].proxy.dynamic` | object |  | Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal. |
| `$.shop[].proxy.dynamic.Interval` | number |  | Dynamic-proxy refresh interval. |
| `$.shop[].proxy.dynamic.Type` | string |  | Type discriminator. |
| `$.shop[].proxy.dynamic.Url` | string |  | URL. |
| `$.shop[].proxy.http` | object |  | HTTP proxy protocol block. |
| `$.shop[].proxy.http.Addr` | string |  | Proxy protocol host and port. |
| `$.shop[].proxy.http.Passwd` | string |  | Password (sensitive). |
| `$.shop[].proxy.http.User` | string |  | Username (sensitive). |
| `$.shop[].proxy.https` | object |  | HTTPS proxy protocol block. |
| `$.shop[].proxy.https.Addr` | string |  | Proxy protocol host and port. |
| `$.shop[].proxy.https.Passwd` | string |  | Password (sensitive). |
| `$.shop[].proxy.https.User` | string |  | Username (sensitive). |
| `$.shop[].proxy.inlie` | string |  | Proxy source: local, self, or cloud. |
| `$.shop[].proxy.ipChannel` | string |  | IP detection channel. |
| `$.shop[].proxy.name` | string |  | Display name. |
| `$.shop[].proxy.product` | number |  | Proxy product/type identifier. |
| `$.shop[].proxy.proxyaddrArr` | null |  | Random proxy address array. |
| `$.shop[].proxy.PublicIP` | string |  | Public IP address. |
| `$.shop[].proxy.randEnv` | boolean |  | Random-environment flag. |
| `$.shop[].proxy.region` | string |  | Proxy region selection. |
| `$.shop[].proxy.socks5` | object |  | SOCKS5 proxy protocol block. |
| `$.shop[].proxy.socks5.Addr` | string |  | Proxy protocol host and port. |
| `$.shop[].proxy.socks5.Passwd` | string |  | Password (sensitive). |
| `$.shop[].proxy.socks5.User` | string |  | Username (sensitive). |
| `$.shop[].proxy.ssh` | object |  | SSH proxy protocol block. |
| `$.shop[].proxy.ssh.Addr` | string |  | Proxy protocol host and port. |
| `$.shop[].proxy.ssh.Passwd` | string |  | Password (sensitive). |
| `$.shop[].proxy.ssh.User` | string |  | Username (sensitive). |
| `$.shop[].proxy.type` | string |  | Type discriminator. |
| `$.shop[].proxy.uuid` | string |  | Identifier. |
| `$.shop[].proxy.v2Ray` | object |  | V2Ray proxy protocol block. |
| `$.shop[].proxy.v2Ray.addr` | string |  | Proxy protocol host and port. |
| `$.shop[].proxy.v2Ray.uuid` | string |  | Identifier. |
| `$.shop[].proxy.zhima` | object |  | Zhima proxy protocol block. |
| `$.shop[].proxy.zhima.Interval` | number |  | Dynamic-proxy refresh interval. |
| `$.shop[].proxy.zhima.Url` | string |  | URL. |
| `$.shop[].proxyDel` | number |  | Whether the proxy was deleted. |
| `$.shop[].proxyEndTime` | string |  | Timestamp. |
| `$.shop[].proxyId` | string |  | Identifier. |
| `$.shop[].proxyip` | string |  | Detected egress IP for the environment. |
| `$.shop[].proxyTransfers` | number |  | Whether the proxy was transferred. |
| `$.shop[].serial` | number |  | Serial number. |
| `$.shop[].share_num` | number |  | Count. |
| `$.shop[].shareRemark` | string |  | Sharing remark. |
| `$.shop[].shareUrl` | string |  | URL. |
| `$.shop[].shopid` | string |  | Environment or account identifier. |
| `$.shop[].storage` | number |  | Storage limit or preference. |
| `$.shop[].system` | string |  | Operating system preset. |
| `$.shop[].thisshare` | number |  | Whether the row is shared by this user. |
| `$.shop[].topOrder` | number |  | Top ordering value. |
| `$.shop[].updatedtime` | string |  | Timestamp. |
| `$.shop[].url` | string |  | URL. |
| `$.shop[].userPasswordIds` | string |  | Bound account-record IDs. |
| `$.shop[].website` | string |  | Website URL. |

## browser-settings

- Method: `POST`
- Path: `/v2/newbrowser/getsettings`
- Catalog document: [`endpoints/browser-settings.md`](endpoints/browser-settings.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.globalSettings` | object |  | Team-wide browser preferences. |
| `$.globalSettings.bind_proxy` | number |  | Whether a proxy is bound. |
| `$.globalSettings.data_sync` | string |  | Data-sync preference. |
| `$.globalSettings.device_authorities` | number |  | Device authority setting. |
| `$.globalSettings.dns` | string |  | DNS fingerprint/proxy block. |
| `$.globalSettings.enable_clear_cookie` | string |  | Enabled flag. |
| `$.globalSettings.enable_clear_storage` | string |  | Enabled flag. |
| `$.globalSettings.enable_gc` | string |  | Enabled flag. |
| `$.globalSettings.enableopen` | string |  | Enabled flag. |
| `$.globalSettings.enableopenNumber` | string |  | Count. |
| `$.globalSettings.expired_display` | number |  | Expiry display preference. |
| `$.globalSettings.gc_time` | string |  | Timestamp. |
| `$.globalSettings.load_image` | string |  | Image-loading preference. |
| `$.globalSettings.load_image_max_size` | string |  | Maximum image-load size. |
| `$.globalSettings.load_video` | string |  | Video-loading preference. |
| `$.globalSettings.monitoring` | number |  | Monitoring preference. |
| `$.globalSettings.password_view` | number |  | Password-view permission. |
| `$.globalSettings.play_sound` | string |  | Sound-playback preference. |
| `$.globalSettings.random_finger` | string |  | Random-fingerprint preference. |
| `$.globalSettings.risk_control` | number |  | Risk-control preference. |
| `$.globalSettings.storage` | number |  | Storage limit or preference. |
| `$.globalSettings.watermark` | number |  | Watermark preference. |
| `$.kernelversion` | string |  | Kernel version preset. |
| `$.kernelWhiteList` | array | 0 | Allowed kernel versions. |
| `$.personalSettings` | object |  | Per-user browser preferences. |
| `$.personalSettings.batch_start` | string |  | Batch-start preference. |
| `$.personalSettings.dpi` | string |  | Device pixel ratio preset. |
| `$.personalSettings.hot_key` | string |  | Hotkey preference. |
| `$.personalSettings.icon_type` | number |  | Icon URL or identifier. |
| `$.personalSettings.language` | number |  | Language preset. |
| `$.personalSettings.search_engine` | string |  | Default search engine. |
| `$.personalSettings.starting_env` | string |  | Starting-environment preference. |
| `$.personalSettings.storage` | number |  | Storage limit or preference. |
| `$.personalSettings.sub_hot_key` | string |  | Secondary hotkey preference. |
| `$.personalSettings.sub_search_engine` | string |  | Secondary search engine. |
| `$.searchEngineList` | array | 3 | Available search engines. |
| `$.searchEngineList[]` | object |  | Available search engines. |
| `$.searchEngineList[].site` | string |  | Search-engine site code. |
| `$.searchEngineList[].siteDesc` | string |  | Search-engine display name. |
| `$.searchEngineList[].url` | string |  | URL. |

## browser-cookie

- Method: `POST`
- Path: `/v2/newbrowser/getCookie`
- Catalog document: [`endpoints/browser-cookie.md`](endpoints/browser-cookie.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `shopid`

Required body fields: `shopid`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | string |  | Endpoint payload container. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## proxy-cloud-list

- Method: `GET`
- Path: `/v2/proxy/device/vcnplist`
- Catalog document: [`endpoints/proxy-cloud-list.md`](endpoints/proxy-cloud-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: `page`, `per_page`, `device_name`, `publicip`, `status`, `userid`, `companyid`

Required query fields: `page`, `per_page`, `status`, `userid`, `companyid`

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.current_page` | number |  | Current result page. |
| `$.data.data` | null |  | Endpoint payload container. |
| `$.data.per_page` | number |  | Rows requested per page. |
| `$.data.total` | number |  | Total number of records matching the query. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.traceId` | string |  | Trace identifier used by newer proxy routes. |

## proxy-self-list

- Method: `GET`
- Path: `/v2/proxy/device/findDeviceProxyUserSelves`
- Catalog document: [`endpoints/proxy-self-list.md`](endpoints/proxy-self-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: `status`, `trademark`, `page`, `per_page`, `company`, `companyid`, `userid`, `proxy_type`, `ip_type`, `detect_result`, `name`, `ip`, `serial`

Required query fields: `status`, `trademark`, `page`, `per_page`, `companyid`, `userid`

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.current_page` | number |  | Current result page. |
| `$.data.data` | array | 20 | Endpoint payload container. |
| `$.data.data[]` | object |  | Endpoint payload container. |
| `$.data.data[].api` | number |  | Whether the row is driven by an API. |
| `$.data.data[].authority` | number |  | Permission/authority level for the row. |
| `$.data.data[].authority_userids` | null |  | User IDs explicitly granted authority. |
| `$.data.data[].companyid` | string |  | Company identifier. |
| `$.data.data[].created_at` | string |  | Creation timestamp. |
| `$.data.data[].deleteby` | string |  | User ID that deleted the row. |
| `$.data.data[].deviceid` | string |  | Identifier. |
| `$.data.data[].enable` | number |  | Enabled flag. |
| `$.data.data[].end_time` | null |  | Timestamp. |
| `$.data.data[].inspect` | number |  | Proxy inspection/health-check flag. |
| `$.data.data[].ip_place` | string |  | IP geolocation place. |
| `$.data.data[].ip_query_channel` | string |  | IP geolocation channel (for example ip2location). |
| `$.data.data[].ip_type` | number |  | Type discriminator. |
| `$.data.data[].isbind` | number |  | Whether the device is bound to an environment. |
| `$.data.data[].login_at` | string |  | Timestamp. |
| `$.data.data[].name` | string |  | Display name. |
| `$.data.data[].notes` | string |  | Free-text notes. |
| `$.data.data[].proxyaddr` | string |  | Proxy host and port. |
| `$.data.data[].proxyp` | string |  | Proxy password (sensitive). |
| `$.data.data[].proxytype` | number |  | Type discriminator. |
| `$.data.data[].proxyu` | string |  | Proxy username (sensitive). |
| `$.data.data[].publicip` | string |  | Public IP address. |
| `$.data.data[].serial` | number |  | Serial number. |
| `$.data.data[].target_url` | array | 1 | URL. |
| `$.data.data[].target_url[]` | string |  | URL. |
| `$.data.data[].trademark` | string |  | Proxy category (self, official, general). |
| `$.data.data[].updated_at` | string |  | Last update timestamp. |
| `$.data.data[].userid` | string |  | User identifier. |
| `$.data.per_page` | number |  | Rows requested per page. |
| `$.data.total` | number |  | Total number of records matching the query. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.traceId` | string |  | Trace identifier used by newer proxy routes. |

## proxy-dynamic-list

- Method: `GET`
- Path: `/v2/proxy/device/findDeviceDynamicProxies`
- Catalog document: [`endpoints/proxy-dynamic-list.md`](endpoints/proxy-dynamic-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: `status`, `trademark`, `page`, `per_page`, `userid`, `companyid`, `ip_type`, `inspect`, `serial`, `name`

Required query fields: `status`, `trademark`, `page`, `per_page`, `userid`, `companyid`

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.current_page` | number |  | Current result page. |
| `$.data.data` | array | 5 | Endpoint payload container. |
| `$.data.data[]` | object |  | Endpoint payload container. |
| `$.data.data[].api` | number |  | Whether the row is driven by an API. |
| `$.data.data[].authority` | number |  | Permission/authority level for the row. |
| `$.data.data[].authority_userids` | null |  | User IDs explicitly granted authority. |
| `$.data.data[].autoSwitch` | number |  | Whether the dynamic proxy auto-switches endpoints. |
| `$.data.data[].companyid` | string |  | Company identifier. |
| `$.data.data[].created_at` | string |  | Creation timestamp. |
| `$.data.data[].deleteby` | string |  | User ID that deleted the row. |
| `$.data.data[].deviceid` | string |  | Identifier. |
| `$.data.data[].inspect` | number |  | Proxy inspection/health-check flag. |
| `$.data.data[].ip_place` | string |  | IP geolocation place. |
| `$.data.data[].ip_query_channel` | string |  | IP geolocation channel (for example ip2location). |
| `$.data.data[].ip_type` | number |  | Type discriminator. |
| `$.data.data[].isbind` | number |  | Whether the device is bound to an environment. |
| `$.data.data[].name` | string |  | Display name. |
| `$.data.data[].notes` | null |  | Free-text notes. |
| `$.data.data[].publicip` | string |  | Public IP address. |
| `$.data.data[].serial` | number |  | Serial number. |
| `$.data.data[].status` | number |  | Status value. |
| `$.data.data[].trademark` | string |  | Proxy category (self, official, general). |
| `$.data.data[].type` | string |  | Type discriminator. |
| `$.data.data[].updated_at` | string |  | Last update timestamp. |
| `$.data.data[].url` | string |  | URL. |
| `$.data.data[].userid` | string |  | User identifier. |
| `$.data.per_page` | number |  | Rows requested per page. |
| `$.data.total` | number |  | Total number of records matching the query. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.traceId` | string |  | Trace identifier used by newer proxy routes. |

## account-list

- Method: `POST`
- Path: `/v2/newbrowser/getUserPasswordList`
- Catalog document: [`endpoints/account-list.md`](endpoints/account-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `name`, `user_name`, `remark`, `platform_name`, `page`, `pageSize`, `platformLock`, `bind`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.currentPage` | number |  | Current result page. |
| `$.data.list` | array | 17 | Record array. |
| `$.data.list[]` | object |  | Record array. |
| `$.data.list[].authority` | number |  | Permission/authority level for the row. |
| `$.data.list[].bind` | number |  | Binding state or bound-account block. |
| `$.data.list[].company_id` | string |  | Identifier. |
| `$.data.list[].created_at` | string |  | Creation timestamp. |
| `$.data.list[].custom_platform_id` | string |  | Identifier. |
| `$.data.list[].delete_by` | string |  | User ID that deleted the row. |
| `$.data.list[].deleted_at` | null |  | Timestamp. |
| `$.data.list[].name` | string |  | Display name. |
| `$.data.list[].password` | string |  | Password (sensitive). |
| `$.data.list[].platform_id` | string |  | Identifier. |
| `$.data.list[].platform_lock` | number |  | Platform lock flag. |
| `$.data.list[].remark` | string |  | Remark text. |
| `$.data.list[].tfa` | string |  | Two-factor authentication secret (sensitive). |
| `$.data.list[].updated_at` | string |  | Last update timestamp. |
| `$.data.list[].user_id` | string |  | Identifier. |
| `$.data.list[].user_name` | string |  | Display name. |
| `$.data.list[].user_password_id` | string |  | Identifier. |
| `$.data.list[].userPasswordPlatforms` | object |  | Platform metadata for the account record. |
| `$.data.list[].userPasswordPlatforms.authority` | number |  | Permission/authority level for the row. |
| `$.data.list[].userPasswordPlatforms.child_class` | string |  | Platform child-class name. |
| `$.data.list[].userPasswordPlatforms.custom_platform_id` | string |  | Identifier. |
| `$.data.list[].userPasswordPlatforms.father_class` | string |  | Platform parent-class name. |
| `$.data.list[].userPasswordPlatforms.grandson_class` | string |  | Platform grandson-class name. |
| `$.data.list[].userPasswordPlatforms.login_url` | string |  | URL. |
| `$.data.list[].userPasswordPlatforms.name` | string |  | Display name. |
| `$.data.list[].userPasswordPlatforms.password` | string |  | Password (sensitive). |
| `$.data.list[].userPasswordPlatforms.platform_icon` | string |  | Icon URL or identifier. |
| `$.data.list[].userPasswordPlatforms.platform_id` | string |  | Identifier. |
| `$.data.list[].userPasswordPlatforms.platform_lock` | number |  | Platform lock flag. |
| `$.data.list[].userPasswordPlatforms.platform_name` | string |  | Display name. |
| `$.data.list[].userPasswordPlatforms.remark` | string |  | Remark text. |
| `$.data.list[].userPasswordPlatforms.shop_icon` | string |  | Icon URL or identifier. |
| `$.data.list[].userPasswordPlatforms.tfa` | string |  | Two-factor authentication secret (sensitive). |
| `$.data.list[].userPasswordPlatforms.user_id` | string |  | Identifier. |
| `$.data.list[].userPasswordPlatforms.user_name` | string |  | Display name. |
| `$.data.list[].userPasswordPlatforms.user_password_id` | string |  | Identifier. |
| `$.data.list[].userPasswordPlatforms.website` | string |  | Website URL. |
| `$.data.pageSize` | number |  | Number of records requested per page. |
| `$.data.total` | number |  | Total number of records matching the query. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## find-devices

- Method: `POST`
- Path: `/v2/proxy/device/findDevices`
- Catalog document: [`endpoints/find-devices.md`](endpoints/find-devices.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `device_ids`, `trademark`

Required body fields: `device_ids`, `trademark`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | null |  | Endpoint payload container. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.traceId` | string |  | Trace identifier used by newer proxy routes. |

## fingerprint-uri

- Method: `POST`
- Path: `/v2/newbrowser/getfingerprinturi`
- Catalog document: [`endpoints/fingerprint-uri.md`](endpoints/fingerprint-uri.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `shopid`

Required body fields: `shopid`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.browseinfo` | object |  | Environment template body returned by fingerprint-uri. |
| `$.browseinfo.accounts` | object |  | Count. |
| `$.browseinfo.accounts.cookie` | string |  | Stored cookie payload (sensitive). |
| `$.browseinfo.accounts.lock` | number |  | Record lock flag. |
| `$.browseinfo.accounts.loginurl` | string |  | URL. |
| `$.browseinfo.accounts.name` | string |  | Display name. |
| `$.browseinfo.accounts.passwd` | string |  | Password (sensitive). |
| `$.browseinfo.accounts.platformicon` | string |  | Icon URL or identifier. |
| `$.browseinfo.accounts.tfa` | string |  | Two-factor authentication secret (sensitive). |
| `$.browseinfo.accounts.url` | array | 0 | URL. |
| `$.browseinfo.accounts.user` | string |  | Username (sensitive). |
| `$.browseinfo.categoryid` | string |  | Identifier. |
| `$.browseinfo.is_star_tag` | number |  | Star/favourite flag. |
| `$.browseinfo.kernelId` | number |  | Identifier. |
| `$.browseinfo.labelid` | array | 0 | Tag identifier / tag display name. |
| `$.browseinfo.name` | string |  | Display name. |
| `$.browseinfo.notes` | string |  | Free-text notes. |
| `$.browseinfo.number` | number |  | Count. |
| `$.browseinfo.proxy` | object |  | Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself. |
| `$.browseinfo.proxy.deviceType` | string |  | Type discriminator. |
| `$.browseinfo.proxy.dns` | object |  | DNS fingerprint/proxy block. |
| `$.browseinfo.proxy.dns.inside` | boolean |  | Whether DNS resolution happens inside the tunnel. |
| `$.browseinfo.proxy.dns.mode` | boolean |  | Mode flag. |
| `$.browseinfo.proxy.dynamic` | object |  | Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal. |
| `$.browseinfo.proxy.dynamic.Interval` | number |  | Dynamic-proxy refresh interval. |
| `$.browseinfo.proxy.dynamic.Type` | string |  | Type discriminator. |
| `$.browseinfo.proxy.dynamic.Url` | string |  | URL. |
| `$.browseinfo.proxy.http` | object |  | HTTP proxy protocol block. |
| `$.browseinfo.proxy.http.Addr` | string |  | Proxy protocol host and port. |
| `$.browseinfo.proxy.http.Passwd` | string |  | Password (sensitive). |
| `$.browseinfo.proxy.http.User` | string |  | Username (sensitive). |
| `$.browseinfo.proxy.https` | object |  | HTTPS proxy protocol block. |
| `$.browseinfo.proxy.https.Addr` | string |  | Proxy protocol host and port. |
| `$.browseinfo.proxy.https.Passwd` | string |  | Password (sensitive). |
| `$.browseinfo.proxy.https.User` | string |  | Username (sensitive). |
| `$.browseinfo.proxy.inlie` | string |  | Proxy source: local, self, or cloud. |
| `$.browseinfo.proxy.ipChannel` | string |  | IP detection channel. |
| `$.browseinfo.proxy.name` | string |  | Display name. |
| `$.browseinfo.proxy.product` | number |  | Proxy product/type identifier. |
| `$.browseinfo.proxy.proxyaddrArr` | null |  | Random proxy address array. |
| `$.browseinfo.proxy.PublicIP` | string |  | Public IP address. |
| `$.browseinfo.proxy.randEnv` | boolean |  | Random-environment flag. |
| `$.browseinfo.proxy.region` | string |  | Proxy region selection. |
| `$.browseinfo.proxy.socks5` | object |  | SOCKS5 proxy protocol block. |
| `$.browseinfo.proxy.socks5.Addr` | string |  | Proxy protocol host and port. |
| `$.browseinfo.proxy.socks5.Passwd` | string |  | Password (sensitive). |
| `$.browseinfo.proxy.socks5.User` | string |  | Username (sensitive). |
| `$.browseinfo.proxy.ssh` | object |  | SSH proxy protocol block. |
| `$.browseinfo.proxy.ssh.Addr` | string |  | Proxy protocol host and port. |
| `$.browseinfo.proxy.ssh.Passwd` | string |  | Password (sensitive). |
| `$.browseinfo.proxy.ssh.User` | string |  | Username (sensitive). |
| `$.browseinfo.proxy.type` | string |  | Type discriminator. |
| `$.browseinfo.proxy.uuid` | string |  | Identifier. |
| `$.browseinfo.proxy.v2Ray` | object |  | V2Ray proxy protocol block. |
| `$.browseinfo.proxy.v2Ray.addr` | string |  | Proxy protocol host and port. |
| `$.browseinfo.proxy.v2Ray.uuid` | string |  | Identifier. |
| `$.browseinfo.proxy.zhima` | object |  | Zhima proxy protocol block. |
| `$.browseinfo.proxy.zhima.Interval` | number |  | Dynamic-proxy refresh interval. |
| `$.browseinfo.proxy.zhima.Url` | string |  | URL. |
| `$.browseinfo.shopid` | string |  | Environment or account identifier. |
| `$.browseinfo.top_order` | number |  | Top ordering value. |
| `$.browseinfo.user_password_ids` | null |  | Bound account-record IDs. |
| `$.browseinfo.userPasswordPlatforms` | null |  | Platform metadata for the account record. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.defaultfingerprint` | object |  | Default fingerprint block returned by fingerprint-uri. |
| `$.defaultfingerprint.AudioContext` | number |  | AudioContext fingerprint mode. |
| `$.defaultfingerprint.battery` | number |  | Battery fingerprint mode. |
| `$.defaultfingerprint.Bluetooth` | number |  | Bluetooth fingerprint mode. |
| `$.defaultfingerprint.Canvas` | number |  | Canvas fingerprint mode. |
| `$.defaultfingerprint.clientRects` | number |  | ClientRects fingerprint mode. |
| `$.defaultfingerprint.cpu` | number |  | CPU core count preset. |
| `$.defaultfingerprint.devicename` | string |  | Display name. |
| `$.defaultfingerprint.Donottrack` | number |  | Do-Not-Track fingerprint mode. |
| `$.defaultfingerprint.dpi` | string |  | Device pixel ratio preset. |
| `$.defaultfingerprint.enableClearCookie` | number |  | Enabled flag. |
| `$.defaultfingerprint.enableClearStorage` | number |  | Enabled flag. |
| `$.defaultfingerprint.enableCookie` | number |  | Enabled flag. |
| `$.defaultfingerprint.enableGc` | number |  | Enabled flag. |
| `$.defaultfingerprint.enablenotice` | number |  | Enabled flag. |
| `$.defaultfingerprint.enableopen` | number |  | Enabled flag. |
| `$.defaultfingerprint.enableopenNumber` | number |  | Count. |
| `$.defaultfingerprint.enablepic` | number |  | Enabled flag. |
| `$.defaultfingerprint.enablescanport` | number |  | Enabled flag. |
| `$.defaultfingerprint.Enablesound` | number |  | Enabled flag. |
| `$.defaultfingerprint.Enablevideo` | number |  | Enabled flag. |
| `$.defaultfingerprint.font` | object |  | Font fingerprint block. |
| `$.defaultfingerprint.font.enable` | number |  | Enabled flag. |
| `$.defaultfingerprint.font.list` | array | 0 | Record array. |
| `$.defaultfingerprint.fontfinger` | number |  | Font fingerprint mode. |
| `$.defaultfingerprint.gcTime` | number |  | Timestamp. |
| `$.defaultfingerprint.geographic` | object |  | Geolocation fingerprint block. |
| `$.defaultfingerprint.geographic.accuracy` | string |  | Geolocation accuracy value. |
| `$.defaultfingerprint.geographic.enable` | number |  | Enabled flag. |
| `$.defaultfingerprint.geographic.latitude` | string |  | Geolocation latitude. |
| `$.defaultfingerprint.geographic.longitude` | string |  | Geolocation longitude. |
| `$.defaultfingerprint.geographic.user` | number |  | Username (sensitive). |
| `$.defaultfingerprint.hardware` | number |  | Hardware-concurrency fingerprint mode. |
| `$.defaultfingerprint.ignoreCookieErr` | number |  | Whether cookie read errors are ignored. |
| `$.defaultfingerprint.kernel` | string |  | Browser kernel name. |
| `$.defaultfingerprint.kernelversion` | string |  | Kernel version preset. |
| `$.defaultfingerprint.language` | array | 0 | Language preset. |
| `$.defaultfingerprint.mac` | string |  | MAC address value. |
| `$.defaultfingerprint.mediadevice` | number |  | Media-device fingerprint mode. |
| `$.defaultfingerprint.mem` | number |  | Memory preset (GB). |
| `$.defaultfingerprint.nextsystem` | object |  | Alternative operating-system presets. |
| `$.defaultfingerprint.nextsystem.Android` | string |  | Identifier. |
| `$.defaultfingerprint.nextsystem.IOS` | string |  | iOS platform entry. |
| `$.defaultfingerprint.nextsystem.Linux` | string |  | Linux platform entry. |
| `$.defaultfingerprint.nextsystem.MacOS` | string |  | macOS platform entry. |
| `$.defaultfingerprint.picsize` | string |  | Image size preference. |
| `$.defaultfingerprint.randomFinger` | number |  | Random-fingerprint mode. |
| `$.defaultfingerprint.riskControl` | number |  | Risk-control mode. |
| `$.defaultfingerprint.scanport` | string |  | Port-scan fingerprint value. |
| `$.defaultfingerprint.SpeechVoices` | number |  | SpeechVoices fingerprint mode. |
| `$.defaultfingerprint.system` | string |  | Operating system preset. |
| `$.defaultfingerprint.ua` | string |  | User-Agent string. |
| `$.defaultfingerprint.UAversion` | string |  | UA version preset. |
| `$.defaultfingerprint.uilanguage` | null |  | UI language preset. |
| `$.defaultfingerprint.WebGl` | number |  | WebGL fingerprint mode. |
| `$.defaultfingerprint.WebGlInfo` | number |  | WebGL info mode. |
| `$.defaultfingerprint.WebGLRenderer` | string |  | WebGL renderer string. |
| `$.defaultfingerprint.WebGLVendor` | string |  | WebGL vendor string. |
| `$.defaultfingerprint.WebRTC` | number |  | WebRTC fingerprint mode. |
| `$.defaultfingerprint.WebRTCIP` | string |  | WebRTC local IP value. |
| `$.defaultfingerprint.widowssize` | string |  | Window-size preset. |
| `$.defaultfingerprint.zone` | string |  | Timezone preset. |

## environment-create

- Method: `POST`
- Path: `/v2/newbrowser/putalluri`
- Catalog document: [`endpoints/environment-create.md`](endpoints/environment-create.md)
- Authentication: Bearer token
- Mutation: yes

### Request Fields

Request body fields: `number`, `randProxy`, `batch_platform_id`, `batch_custom_id`, `batchProxy`, `browser`

Required body fields: `browser`

Query fields: none cataloged.

### Response Fields

Observed via live round-trip.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.shopid` | array | 1 | Environment or account identifier. |

## user-notices

- Method: `POST`
- Path: `/v2/message/user-notice/my`
- Catalog document: [`endpoints/user-notices.md`](endpoints/user-notices.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `noticeType`, `page`, `pageSize`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.count` | number |  | Count. |
| `$.data.key` | string |  | Setting key. |
| `$.data.list` | array | 10 | Record array. |
| `$.data.list[]` | object |  | Record array. |
| `$.data.list[].content` | string |  | Log or notice body text. |
| `$.data.list[].createdAt` | number |  | Timestamp. |
| `$.data.list[].id` | number |  | Identifier. |
| `$.data.list[].noticeType` | number |  | Type discriminator. |
| `$.data.list[].op` | string |  | Notice operation/handler string. |
| `$.data.list[].opId` | string |  | Identifier. |
| `$.data.list[].reminderStatus` | number |  | Status value. |
| `$.data.list[].status` | number |  | Status value. |
| `$.data.list[].title` | string |  | Title text. |
| `$.data.list[].type` | number |  | Type discriminator. |
| `$.data.name` | string |  | Display name. |
| `$.data.total` | number |  | Total number of records matching the query. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## environment-clone

- Method: `POST`
- Path: `/v2/newbrowser/batchCloneShop`
- Catalog document: [`endpoints/environment-clone.md`](endpoints/environment-clone.md)
- Authentication: Bearer token
- Mutation: yes

### Request Fields

Request body fields: `number`, `accountIds`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via live round-trip.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## rpa-plan-list

- Method: `POST`
- Path: `/v2/rpa/getRpaPlanManagementList`
- Catalog document: [`endpoints/rpa-plan-list.md`](endpoints/rpa-plan-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `userId`, `executeType`, `accountIds`

Required body fields: `userId`, `accountIds`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.count` | number |  | Count. |
| `$.list` | array | 0 | Record array. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.pageIndex` | number |  | Current page index. |
| `$.pageSize` | number |  | Number of records requested per page. |
| `$.timestamp` | number |  | Timestamp. |

## latest-open-environments

- Method: `POST`
- Path: `/v2/newbrowser/getLatestOpenAccountIdList`
- Catalog document: [`endpoints/latest-open-environments.md`](endpoints/latest-open-environments.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `num`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.accountIds` | array | 20 | Count. |
| `$.data.accountIds[]` | string |  | Count. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## fingerprint-defaults

- Method: `POST`
- Path: `/v2/newbrowser/getdefaultfingerlist`
- Catalog document: [`endpoints/fingerprint-defaults.md`](endpoints/fingerprint-defaults.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `system`, `kernel`, `kernelVersion`

Required body fields: `system`, `kernel`, `kernelVersion`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.cpu` | array | 6 | CPU core count preset. |
| `$.cpu[]` | number |  | CPU core count preset. |
| `$.dpi` | array | 29 | Device pixel ratio preset. |
| `$.dpi[]` | string |  | Device pixel ratio preset. |
| `$.Firefoxkernelversion` | array | 1 | Firefox kernel version preset. |
| `$.Firefoxkernelversion[]` | object |  | Firefox kernel version preset. |
| `$.Firefoxkernelversion[].beta` | boolean |  | Kernel build channel (beta). |
| `$.Firefoxkernelversion[].id` | number |  | Identifier. |
| `$.Firefoxkernelversion[].version` | string |  | Client/kernel version. |
| `$.FirefoxUAversion` | array | 1 | Firefox UA version preset. |
| `$.FirefoxUAversion[]` | string |  | Firefox UA version preset. |
| `$.kernelversion` | array | 21 | Kernel version preset. |
| `$.kernelversion[]` | object |  | Kernel version preset. |
| `$.kernelversion[].beta` | boolean |  | Kernel build channel (beta). |
| `$.kernelversion[].id` | number |  | Identifier. |
| `$.kernelversion[].version` | string |  | Client/kernel version. |
| `$.language` | array | 192 | Language preset. |
| `$.language[]` | object |  | Language preset. |
| `$.language[].ab` | string |  | A/B experiment bucket. |
| `$.language[].code` | string |  | Business status code; 200 is success. |
| `$.language[].country` | string |  | Count. |
| `$.language[].ecountry` | string |  | Count. |
| `$.language[].name` | string |  | Display name. |
| `$.mem` | array | 3 | Memory preset (GB). |
| `$.mem[]` | number |  | Memory preset (GB). |
| `$.platformKernelversion` | object |  | Platform-specific kernel version preset. |
| `$.platformKernelversion.cloudPC` | object |  | Cloud-PC kernel entry. |
| `$.platformKernelversion.cloudPC.chrome` | array | 1 | Chrome kernel build entry. |
| `$.platformKernelversion.cloudPC.chrome[]` | object |  | Chrome kernel build entry. |
| `$.platformKernelversion.cloudPC.chrome[].beta` | boolean |  | Kernel build channel (beta). |
| `$.platformKernelversion.cloudPC.chrome[].id` | number |  | Identifier. |
| `$.platformKernelversion.cloudPC.chrome[].version` | string |  | Client/kernel version. |
| `$.platformKernelversion.linuxPC` | object |  | Linux-PC kernel entry. |
| `$.platformKernelversion.linuxPC.chrome` | array | 1 | Chrome kernel build entry. |
| `$.platformKernelversion.linuxPC.chrome[]` | object |  | Chrome kernel build entry. |
| `$.platformKernelversion.linuxPC.chrome[].beta` | boolean |  | Kernel build channel (beta). |
| `$.platformKernelversion.linuxPC.chrome[].id` | number |  | Identifier. |
| `$.platformKernelversion.linuxPC.chrome[].version` | string |  | Client/kernel version. |
| `$.platformKernelversion.macosPC` | object |  | macOS-PC kernel entry. |
| `$.platformKernelversion.macosPC.chrome` | array | 13 | Chrome kernel build entry. |
| `$.platformKernelversion.macosPC.chrome[]` | object |  | Chrome kernel build entry. |
| `$.platformKernelversion.macosPC.chrome[].beta` | boolean |  | Kernel build channel (beta). |
| `$.platformKernelversion.macosPC.chrome[].id` | number |  | Identifier. |
| `$.platformKernelversion.macosPC.chrome[].version` | string |  | Client/kernel version. |
| `$.platformKernelversion.windowsPC` | object |  | Windows-PC kernel entry. |
| `$.platformKernelversion.windowsPC.chrome` | array | 21 | Chrome kernel build entry. |
| `$.platformKernelversion.windowsPC.chrome[]` | object |  | Chrome kernel build entry. |
| `$.platformKernelversion.windowsPC.chrome[].beta` | boolean |  | Kernel build channel (beta). |
| `$.platformKernelversion.windowsPC.chrome[].id` | number |  | Identifier. |
| `$.platformKernelversion.windowsPC.chrome[].version` | string |  | Client/kernel version. |
| `$.platformKernelversion.windowsPC.firefox` | array | 1 | Firefox kernel build entry. |
| `$.platformKernelversion.windowsPC.firefox[]` | object |  | Firefox kernel build entry. |
| `$.platformKernelversion.windowsPC.firefox[].beta` | boolean |  | Kernel build channel (beta). |
| `$.platformKernelversion.windowsPC.firefox[].id` | number |  | Identifier. |
| `$.platformKernelversion.windowsPC.firefox[].version` | string |  | Client/kernel version. |
| `$.system` | object |  | Operating system preset. |
| `$.system.Android` | array | 6 | Identifier. |
| `$.system.Android[]` | object |  | Identifier. |
| `$.system.Android[].browser` | string |  | Browser/kernel family. |
| `$.system.Android[].name` | string |  | Display name. |
| `$.system.Android[].platformVersion` | string |  | Platform version preset. |
| `$.system.Android[].system` | string |  | Operating system preset. |
| `$.system.IOS` | array | 4 | iOS platform entry. |
| `$.system.IOS[]` | object |  | iOS platform entry. |
| `$.system.IOS[].browser` | string |  | Browser/kernel family. |
| `$.system.IOS[].name` | string |  | Display name. |
| `$.system.IOS[].platformVersion` | string |  | Platform version preset. |
| `$.system.IOS[].system` | string |  | Operating system preset. |
| `$.system.Linux` | array | 1 | Linux platform entry. |
| `$.system.Linux[]` | object |  | Linux platform entry. |
| `$.system.Linux[].browser` | string |  | Browser/kernel family. |
| `$.system.Linux[].name` | string |  | Display name. |
| `$.system.Linux[].platformVersion` | string |  | Platform version preset. |
| `$.system.Linux[].system` | string |  | Operating system preset. |
| `$.system.MacOS` | array | 7 | macOS platform entry. |
| `$.system.MacOS[]` | object |  | macOS platform entry. |
| `$.system.MacOS[].browser` | string |  | Browser/kernel family. |
| `$.system.MacOS[].name` | string |  | Display name. |
| `$.system.MacOS[].platformVersion` | string |  | Platform version preset. |
| `$.system.MacOS[].system` | string |  | Operating system preset. |
| `$.system.Windows` | array | 6 | Windows platform entry. |
| `$.system.Windows[]` | object |  | Windows platform entry. |
| `$.system.Windows[].browser` | string |  | Browser/kernel family. |
| `$.system.Windows[].name` | string |  | Display name. |
| `$.system.Windows[].platformVersion` | string |  | Platform version preset. |
| `$.system.Windows[].system` | string |  | Operating system preset. |
| `$.UAversion` | array | 54 | UA version preset. |
| `$.UAversion[]` | string |  | UA version preset. |
| `$.webgl` | object |  | WebGL fingerprint mode. |
| `$.webgl.windows` | object |  | Windows platform entry. |
| `$.webgl.windows.manufacturer` | array | 3 | Device manufacturer value. |
| `$.webgl.windows.manufacturer[]` | object |  | Device manufacturer value. |
| `$.webgl.windows.manufacturer[].renderer` | array | 10 | Renderer fingerprint value. |
| `$.webgl.windows.manufacturer[].renderer[]` | string |  | Renderer fingerprint value. |
| `$.webgl.windows.manufacturer[].vendor` | string |  | Vendor fingerprint value. |
| `$.widowssize` | array | 29 | Window-size preset. |
| `$.widowssize[]` | string |  | Window-size preset. |
| `$.zone` | array | 478 | Timezone preset. |
| `$.zone[]` | string |  | Timezone preset. |

## platform-class-tree

- Method: `POST`
- Path: `/v2/newbrowser/getalluri`
- Catalog document: [`endpoints/platform-class-tree.md`](endpoints/platform-class-tree.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.childclass` | null |  | Second-level platform classification. |
| `$.childicon` | null |  | Icon URL or identifier. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.fatherclass` | array | 6 | Top-level platform classification. |
| `$.fatherclass[]` | string |  | Top-level platform classification. |
| `$.grandsonclass` | null |  | Third-level platform classification. |
| `$.msg` | string |  | Localized operator-facing result message. |

## platform-catalog

- Method: `GET`
- Path: `/v2/newbrowser/getallurilist`
- Catalog document: [`endpoints/platform-catalog.md`](endpoints/platform-catalog.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | array | 266 | Endpoint payload container. |
| `$.data[]` | object |  | Endpoint payload container. |
| `$.data[].child_label` | string |  | Platform child-class label code. |
| `$.data[].childclass` | string |  | Second-level platform classification. |
| `$.data[].father_label` | string |  | Platform parent-class label code. |
| `$.data[].fatherclass` | string |  | Top-level platform classification. |
| `$.data[].grandson_label` | string |  | Platform grandson-class label code. |
| `$.data[].grandsonclass` | string |  | Third-level platform classification. |
| `$.data[].loginurl` | string |  | URL. |
| `$.data[].platformicon` | string |  | Icon URL or identifier. |
| `$.data[].platformid` | string |  | Identifier. |
| `$.data[].platformname` | string |  | Display name. |
| `$.data[].shop_icon` | string |  | Icon URL or identifier. |
| `$.data[].website` | string |  | Website URL. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## custom-platform-list

- Method: `POST`
- Path: `/v2/newbrowser/getalluserselfuri`
- Catalog document: [`endpoints/custom-platform-list.md`](endpoints/custom-platform-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `company`, `companyid`, `userid`

Required body fields: `companyid`, `userid`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.self` | array | 6 | Self-hosted proxy list or flag. |
| `$.self[]` | object |  | Self-hosted proxy list or flag. |
| `$.self[].company_id` | string |  | Identifier. |
| `$.self[].created_at` | string |  | Creation timestamp. |
| `$.self[].login_url` | string |  | URL. |
| `$.self[].platform_icon` | string |  | Icon URL or identifier. |
| `$.self[].platform_id` | string |  | Identifier. |
| `$.self[].platform_name` | string |  | Display name. |
| `$.self[].updated_at` | string |  | Last update timestamp. |
| `$.self[].user_id` | string |  | Identifier. |
| `$.self[].website` | string |  | Website URL. |

## plugin-list

- Method: `GET`
- Path: `/v2/plugin/getAddedAndGlobalplugin`
- Catalog document: [`endpoints/plugin-list.md`](endpoints/plugin-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.distributionPlugin` | array | 0 | Distribution (added) plugin list. |
| `$.data.globalPlugin` | array | 0 | Globally available plugin list. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## auth-shop-brief-list

- Method: `POST`
- Path: `/v2/newbrowser/getauthshopbriefinfolist`
- Catalog document: [`endpoints/auth-shop-brief-list.md`](endpoints/auth-shop-brief-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `page`, `pageSize`, `name`, `groupid`, `browserid`, `userid`, `number`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.currentPage` | number |  | Current result page. |
| `$.data.list` | array | 10 | Record array. |
| `$.data.list[]` | object |  | Record array. |
| `$.data.list[].authorized` | null |  | Authorization record when the row is shared/authorized. |
| `$.data.list[].cloud_id` | string |  | Identifier. |
| `$.data.list[].createby` | string |  | Creator user ID. |
| `$.data.list[].expired_at` | string |  | Timestamp. |
| `$.data.list[].group` | object |  | Group object or name. |
| `$.data.list[].group.groupid` | string |  | Identifier. |
| `$.data.list[].group.name` | string |  | Display name. |
| `$.data.list[].is_give` | number |  | Whether the plan was gifted. |
| `$.data.list[].is_star_tag` | number |  | Star/favourite flag. |
| `$.data.list[].kernel` | string |  | Browser kernel name. |
| `$.data.list[].kernelVersion` | string |  | Kernel version preset. |
| `$.data.list[].label` | null |  | Tag label object or tag IDs. |
| `$.data.list[].name` | string |  | Display name. |
| `$.data.list[].notes` | string |  | Free-text notes. |
| `$.data.list[].proxy` | object |  | Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself. |
| `$.data.list[].proxy.deviceType` | string |  | Type discriminator. |
| `$.data.list[].proxy.dns` | object |  | DNS fingerprint/proxy block. |
| `$.data.list[].proxy.dns.inside` | boolean |  | Whether DNS resolution happens inside the tunnel. |
| `$.data.list[].proxy.dns.mode` | boolean |  | Mode flag. |
| `$.data.list[].proxy.dynamic` | object |  | Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal. |
| `$.data.list[].proxy.dynamic.Interval` | number |  | Dynamic-proxy refresh interval. |
| `$.data.list[].proxy.dynamic.Type` | string |  | Type discriminator. |
| `$.data.list[].proxy.dynamic.Url` | string |  | URL. |
| `$.data.list[].proxy.http` | object |  | HTTP proxy protocol block. |
| `$.data.list[].proxy.http.Addr` | string |  | Proxy protocol host and port. |
| `$.data.list[].proxy.http.Passwd` | string |  | Password (sensitive). |
| `$.data.list[].proxy.http.User` | string |  | Username (sensitive). |
| `$.data.list[].proxy.https` | object |  | HTTPS proxy protocol block. |
| `$.data.list[].proxy.https.Addr` | string |  | Proxy protocol host and port. |
| `$.data.list[].proxy.https.Passwd` | string |  | Password (sensitive). |
| `$.data.list[].proxy.https.User` | string |  | Username (sensitive). |
| `$.data.list[].proxy.inlie` | string |  | Proxy source: local, self, or cloud. |
| `$.data.list[].proxy.ipChannel` | string |  | IP detection channel. |
| `$.data.list[].proxy.name` | string |  | Display name. |
| `$.data.list[].proxy.product` | number |  | Proxy product/type identifier. |
| `$.data.list[].proxy.proxyaddrArr` | null |  | Random proxy address array. |
| `$.data.list[].proxy.PublicIP` | string |  | Public IP address. |
| `$.data.list[].proxy.randEnv` | boolean |  | Random-environment flag. |
| `$.data.list[].proxy.region` | string |  | Proxy region selection. |
| `$.data.list[].proxy.socks5` | object |  | SOCKS5 proxy protocol block. |
| `$.data.list[].proxy.socks5.Addr` | string |  | Proxy protocol host and port. |
| `$.data.list[].proxy.socks5.Passwd` | string |  | Password (sensitive). |
| `$.data.list[].proxy.socks5.User` | string |  | Username (sensitive). |
| `$.data.list[].proxy.ssh` | object |  | SSH proxy protocol block. |
| `$.data.list[].proxy.ssh.Addr` | string |  | Proxy protocol host and port. |
| `$.data.list[].proxy.ssh.Passwd` | string |  | Password (sensitive). |
| `$.data.list[].proxy.ssh.User` | string |  | Username (sensitive). |
| `$.data.list[].proxy.type` | string |  | Type discriminator. |
| `$.data.list[].proxy.uuid` | string |  | Identifier. |
| `$.data.list[].proxy.v2Ray` | object |  | V2Ray proxy protocol block. |
| `$.data.list[].proxy.v2Ray.addr` | string |  | Proxy protocol host and port. |
| `$.data.list[].proxy.v2Ray.uuid` | string |  | Identifier. |
| `$.data.list[].proxy.zhima` | object |  | Zhima proxy protocol block. |
| `$.data.list[].proxy.zhima.Interval` | number |  | Dynamic-proxy refresh interval. |
| `$.data.list[].proxy.zhima.Url` | string |  | URL. |
| `$.data.list[].serial` | number |  | Serial number. |
| `$.data.list[].shopid` | string |  | Environment or account identifier. |
| `$.data.list[].status` | number |  | Status value. |
| `$.data.list[].system` | string |  | Operating system preset. |
| `$.data.list[].userPasswordIds` | string |  | Bound account-record IDs. |
| `$.data.pageSize` | number |  | Number of records requested per page. |
| `$.data.total` | number |  | Total number of records matching the query. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## bound-account-detail

- Method: `POST`
- Path: `/v2/newbrowser/getBindUserPassword`
- Catalog document: [`endpoints/bound-account-detail.md`](endpoints/bound-account-detail.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `user_password_id`, `pageSize`

Required body fields: `user_password_id`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.shopinfo` | array | 1 | Bound environment rows. |
| `$.shopinfo[]` | object |  | Bound environment rows. |
| `$.shopinfo[].last_login_at` | string |  | Timestamp. |
| `$.shopinfo[].last_login_user` | string |  | User ID of the last login. |
| `$.shopinfo[].name` | string |  | Display name. |
| `$.shopinfo[].serial` | number |  | Serial number. |
| `$.shopinfo[].shopid` | string |  | Environment or account identifier. |
| `$.total` | number |  | Total number of records matching the query. |

## account-users-get

- Method: `POST`
- Path: `/v2/newbrowser/account-users/get`
- Catalog document: [`endpoints/account-users-get.md`](endpoints/account-users-get.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `accountIds`

Required body fields: `accountIds`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | array | 0 | Endpoint payload container. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## server-group-list

- Method: `POST`
- Path: `/v2/newbrowser/getgroups`
- Catalog document: [`endpoints/server-group-list.md`](endpoints/server-group-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `company`, `companyid`, `userid`, `name`

Required body fields: `companyid`, `userid`

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.group` | array | 32 | Group object or name. |
| `$.group[]` | object |  | Group object or name. |
| `$.group[].gropid` | string |  | Group identifier; the live API also uses the misspelled gropid. |
| `$.group[].name` | string |  | Display name. |
| `$.group[].system_group` | number |  | System-group flag (0 custom, 1 default, 2 transfer). |

## proxy-tag-list

- Method: `GET`
- Path: `/v2/proxy/device/findTags`
- Catalog document: [`endpoints/proxy-tag-list.md`](endpoints/proxy-tag-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: `company`, `companyid`, `keyword`, `page`, `per_page`

Required query fields: `companyid`

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.current_page` | number |  | Current result page. |
| `$.data.data` | array | 15 | Endpoint payload container. |
| `$.data.data[]` | object |  | Endpoint payload container. |
| `$.data.data[].color` | number |  | Tag colour index. |
| `$.data.data[].company_id` | string |  | Identifier. |
| `$.data.data[].create_by` | string |  | Creator user ID. |
| `$.data.data[].created_at` | string |  | Creation timestamp. |
| `$.data.data[].labelid` | string |  | Tag identifier / tag display name. |
| `$.data.data[].name` | string |  | Display name. |
| `$.data.data[].update_by` | string |  | Timestamp. |
| `$.data.data[].updated_at` | string |  | Last update timestamp. |
| `$.data.per_page` | number |  | Rows requested per page. |
| `$.data.total` | number |  | Total number of records matching the query. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.traceId` | string |  | Trace identifier used by newer proxy routes. |

## proxy-tag-upsert

- Method: `POST`
- Path: `/v2/proxy/device/updateTag`
- Catalog document: [`endpoints/proxy-tag-upsert.md`](endpoints/proxy-tag-upsert.md)
- Authentication: Bearer token
- Mutation: yes

### Request Fields

Request body fields: `company`, `companyid`, `color`, `label`, `labelid`

Required body fields: `companyid`, `label`

Query fields: none cataloged.

### Response Fields

Observed via live round-trip.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | null |  | Endpoint payload container. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.traceId` | string |  | Trace identifier used by newer proxy routes. |

## proxy-tag-delete

- Method: `POST`
- Path: `/v2/proxy/device/delTag`
- Catalog document: [`endpoints/proxy-tag-delete.md`](endpoints/proxy-tag-delete.md)
- Authentication: Bearer token
- Mutation: yes

### Request Fields

Request body fields: `company`, `companyid`, `labelid`

Required body fields: `companyid`, `labelid`

Query fields: none cataloged.

### Response Fields

Observed via live round-trip.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | null |  | Endpoint payload container. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.traceId` | string |  | Trace identifier used by newer proxy routes. |

## server-group-create

- Method: `POST`
- Path: `/v2/newbrowser/putnewgroup`
- Catalog document: [`endpoints/server-group-create.md`](endpoints/server-group-create.md)
- Authentication: Bearer token
- Mutation: yes

### Request Fields

Request body fields: `company`, `companyid`, `userid`, `group`, `groupid`

Required body fields: `companyid`, `userid`, `group`

Query fields: none cataloged.

### Response Fields

Observed via live round-trip.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$.categoryid` | string |  | Identifier. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.companyid` | string |  | Company identifier. |
| `$.createby` | string |  | Creator user ID. |
| `$.name` | string |  | Display name. |
| `$.updateby` | string |  | Timestamp. |

## server-group-delete

- Method: `POST`
- Path: `/v2/newbrowser/deletegroups`
- Catalog document: [`endpoints/server-group-delete.md`](endpoints/server-group-delete.md)
- Authentication: Bearer token
- Mutation: yes

### Request Fields

Request body fields: `groupid`

Required body fields: `groupid`

Query fields: none cataloged.

### Response Fields

Observed via live round-trip.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## environment-delete

- Method: `POST`
- Path: `/v2/newbrowser/putdeleteshop`
- Catalog document: [`endpoints/environment-delete.md`](endpoints/environment-delete.md)
- Authentication: Bearer token
- Mutation: yes

### Request Fields

Request body fields: `company`, `companyid`, `userid`, `shopid`

Required body fields: `companyid`, `userid`, `shopid`

Query fields: none cataloged.

### Response Fields

Observed via live round-trip.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## proxy-device-logs

- Method: `GET`
- Path: `/v2/proxy/device/findDeviceLogs`
- Catalog document: [`endpoints/proxy-device-logs.md`](endpoints/proxy-device-logs.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: `page`, `per_page`, `name`, `ip`, `to_company_id`

Required query fields: `page`, `per_page`

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.current_page` | number |  | Current result page. |
| `$.data.data` | array | 0 | Endpoint payload container. |
| `$.data.per_page` | number |  | Rows requested per page. |
| `$.data.total` | number |  | Total number of records matching the query. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.traceId` | string |  | Trace identifier used by newer proxy routes. |

## transfer-shop-list

- Method: `POST`
- Path: `/v2/newbrowser/transferShopList`
- Catalog document: [`endpoints/transfer-shop-list.md`](endpoints/transfer-shop-list.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `page`, `pageSize`, `name`, `ip`, `companyid`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.currentPage` | number |  | Current result page. |
| `$.data.list` | array | 0 | Record array. |
| `$.data.pageSize` | number |  | Number of records requested per page. |
| `$.data.total` | number |  | Total number of records matching the query. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## auth-log-permissions

- Method: `POST`
- Path: `/v2/logs/auth/perms`
- Catalog document: [`endpoints/auth-log-permissions.md`](endpoints/auth-log-permissions.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `pageIndex`, `total`, `pageSize`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.count` | number |  | Count. |
| `$.data.list` | array | 13 | Record array. |
| `$.data.list[]` | object |  | Record array. |
| `$.data.list[].companyId` | string |  | Company identifier. |
| `$.data.list[].content` | string |  | Log or notice body text. |
| `$.data.list[].createdAt` | string |  | Timestamp. |
| `$.data.list[].departmentName` | string |  | Department display name; client label `部门名称`. |
| `$.data.list[].deptId` | string |  | Identifier. |
| `$.data.list[].detail` | string |  | Log detail text. |
| `$.data.list[].id` | number |  | Identifier. |
| `$.data.list[].Name` | string |  | Display name. |
| `$.data.list[].opType` | string |  | Type discriminator. |
| `$.data.list[].userId` | string |  | User identifier. |
| `$.data.list[].username` | string |  | Display name. |
| `$.data.pageIndex` | number |  | Current page index. |
| `$.data.pageSize` | number |  | Number of records requested per page. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## auth-log-options

- Method: `POST`
- Path: `/v2/logs/auth/options`
- Catalog document: [`endpoints/auth-log-options.md`](endpoints/auth-log-options.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `pageIndex`, `total`, `pageSize`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.count` | number |  | Count. |
| `$.data.list` | array | 20 | Record array. |
| `$.data.list[]` | object |  | Record array. |
| `$.data.list[].companyId` | string |  | Company identifier. |
| `$.data.list[].content` | string |  | Log or notice body text. |
| `$.data.list[].createdAt` | string |  | Timestamp. |
| `$.data.list[].dataId` | string |  | Identifier. |
| `$.data.list[].departmentName` | string |  | Department display name; client label `部门名称`. |
| `$.data.list[].deptId` | string |  | Identifier. |
| `$.data.list[].detail` | string |  | Log detail text. |
| `$.data.list[].id` | number |  | Identifier. |
| `$.data.list[].Name` | string |  | Display name. |
| `$.data.list[].opType` | string |  | Type discriminator. |
| `$.data.list[].userId` | string |  | User identifier. |
| `$.data.list[].username` | string |  | Display name. |
| `$.data.pageIndex` | number |  | Current page index. |
| `$.data.pageSize` | number |  | Number of records requested per page. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## team-login-logs

- Method: `POST`
- Path: `/v2/team/loginlogs`
- Catalog document: [`endpoints/team-login-logs.md`](endpoints/team-login-logs.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `pageIndex`, `total`, `pageSize`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.count` | number |  | Count. |
| `$.data.list` | array | 20 | Record array. |
| `$.data.list[]` | object |  | Record array. |
| `$.data.list[].clientId` | string |  | Identifier. |
| `$.data.list[].clientMac` | string |  | Client MAC address value. |
| `$.data.list[].clientType` | string |  | Type discriminator. |
| `$.data.list[].companyId` | string |  | Company identifier. |
| `$.data.list[].createdAt` | string |  | Timestamp. |
| `$.data.list[].device` | string |  | Device telemetry entry. |
| `$.data.list[].id` | number |  | Identifier. |
| `$.data.list[].ip` | string |  | IP address value. |
| `$.data.list[].optionType` | number |  | Type discriminator. |
| `$.data.list[].os` | string |  | Operating system string. |
| `$.data.list[].region` | string |  | Proxy region selection. |
| `$.data.list[].userId` | string |  | User identifier. |
| `$.data.list[].username` | string |  | Display name. |
| `$.data.pageIndex` | number |  | Current page index. |
| `$.data.pageSize` | number |  | Number of records requested per page. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## current-company-info

- Method: `POST`
- Path: `/v2/team/curCompanyInfo`
- Catalog document: [`endpoints/current-company-info.md`](endpoints/current-company-info.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

_No response fields were observed._

## user-meal-settings

- Method: `GET`
- Path: `/v2/cost/costmanagement/get_user_set_meal`
- Catalog document: [`endpoints/user-meal-settings.md`](endpoints/user-meal-settings.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.actual_amount` | number |  | Amount actually charged. |
| `$.data.auto_renew` | number |  | Auto-renew flag for the plan. |
| `$.data.company_id` | string |  | Identifier. |
| `$.data.created_at` | string |  | Creation timestamp. |
| `$.data.day` | number |  | Plan day counter. |
| `$.data.effective_day` | number |  | Effective plan days. |
| `$.data.end_time` | string |  | Timestamp. |
| `$.data.environment_number` | number |  | Count. |
| `$.data.expired` | boolean |  | Whether the plan/subscription is expired. |
| `$.data.final_amount` | number |  | Final plan amount. |
| `$.data.free_environment_number` | number |  | Count. |
| `$.data.free_member_number` | number |  | Count. |
| `$.data.free_status` | number |  | Status value. |
| `$.data.gift_end_time` | null |  | Timestamp. |
| `$.data.gift_environment_number` | number |  | Count. |
| `$.data.gift_member_number` | number |  | Count. |
| `$.data.has_package` | boolean |  | Whether the account has an active package. |
| `$.data.member_number` | number |  | Count. |
| `$.data.normal_environment_number` | number |  | Count. |
| `$.data.normal_member_number` | number |  | Count. |
| `$.data.original_discount` | number |  | Count. |
| `$.data.package_source` | number |  | Package source. |
| `$.data.payable_amount` | number |  | Amount payable before discount. |
| `$.data.purchased_environment_number` | number |  | Count. |
| `$.data.purchased_member_number` | number |  | Count. |
| `$.data.residue_amount` | number |  | Remaining balance amount. |
| `$.data.restrict` | boolean |  | Whether the account is restricted. |
| `$.data.select_day` | number |  | Selected plan days. |
| `$.data.start_time` | string |  | Start timestamp; client label `开始时间`. |
| `$.data.total_environment_number` | number |  | Count. |
| `$.data.total_member_number` | number |  | Count. |
| `$.data.updated_at` | string |  | Last update timestamp. |
| `$.data.user_id` | string |  | Identifier. |
| `$.data.user_packages_id` | number |  | Identifier. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.msgCode` | number |  | Business status code; 200 is success. |
| `$.traceId` | string |  | Trace identifier used by newer proxy routes. |

## team-members

- Method: `POST`
- Path: `/v2/team/getMembers`
- Catalog document: [`endpoints/team-members.md`](endpoints/team-members.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `pageSize`, `pageIndex`, `deptId`, `true_name`, `leave`, `name`, `username`, `contact`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.count` | number |  | Count. |
| `$.data.list` | array | 3 | Record array. |
| `$.data.list[]` | object |  | Record array. |
| `$.data.list[].avatar` | string |  | Avatar image URL. |
| `$.data.list[].cancelDeadline` | null |  | Deadline before the account/subscription can be cancelled. |
| `$.data.list[].cancelStatus` | number |  | Cancellation status. |
| `$.data.list[].companyId` | string |  | Company identifier. |
| `$.data.list[].createdAt` | string |  | Timestamp. |
| `$.data.list[].depPath` | string |  | Department path. |
| `$.data.list[].deptId` | string |  | Identifier. |
| `$.data.list[].deptName` | string |  | Display name. |
| `$.data.list[].email` | string |  | Email address. |
| `$.data.list[].id` | number |  | Identifier. |
| `$.data.list[].lastLoginAt` | string |  | Timestamp. |
| `$.data.list[].leave_status` | number |  | Status value. |
| `$.data.list[].mobile` | string |  | Mobile phone number. |
| `$.data.list[].name` | string |  | Display name. |
| `$.data.list[].online` | number |  | Online status. |
| `$.data.list[].openId` | string |  | Identifier. |
| `$.data.list[].package_status` | number |  | Status value. |
| `$.data.list[].pop` | boolean |  | Pop-up/notification flag. |
| `$.data.list[].realName` | string |  | Display name. |
| `$.data.list[].roles` | string |  | Role ID list (comma-wrapped string). |
| `$.data.list[].rolesName` | null |  | Display name. |
| `$.data.list[].updatedAt` | string |  | Timestamp. |
| `$.data.list[].userId` | string |  | User identifier. |
| `$.data.list[].username` | string |  | Display name. |
| `$.data.list[].usetimeLimit` | object |  | Timestamp. |
| `$.data.list[].usetimeLimit.beginDate` | string |  | Timestamp. |
| `$.data.list[].usetimeLimit.endDate` | string |  | Timestamp. |
| `$.data.list[].usetimeLimit.limit` | number |  | Usage/day limit. |
| `$.data.pageIndex` | number |  | Current page index. |
| `$.data.pageSize` | number |  | Number of records requested per page. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## team-roles

- Method: `POST`
- Path: `/v2/team/roles`
- Catalog document: [`endpoints/team-roles.md`](endpoints/team-roles.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `pageIndex`, `pageSize`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.count` | number |  | Count. |
| `$.data.list` | array | 9 | Record array. |
| `$.data.list[]` | object |  | Record array. |
| `$.data.list[].companyId` | string |  | Company identifier. |
| `$.data.list[].count` | number |  | Count. |
| `$.data.list[].createdAt` | string |  | Timestamp. |
| `$.data.list[].gid` | number |  | Identifier. |
| `$.data.list[].id` | number |  | Identifier. |
| `$.data.list[].rightIds` | string |  | Comma-separated permission IDs. |
| `$.data.list[].roleDesc` | string |  | Role description. |
| `$.data.list[].roleSlug` | string |  | Role slug/name. |
| `$.data.list[].roleType` | number |  | Type discriminator. |
| `$.data.list[].sort` | number |  | Sort order. |
| `$.data.list[].updateBy` | string |  | Timestamp. |
| `$.data.list[].updatedAt` | string |  | Timestamp. |
| `$.data.pageIndex` | number |  | Current page index. |
| `$.data.pageSize` | number |  | Number of records requested per page. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## team-departments

- Method: `POST`
- Path: `/v2/team/getDepts`
- Catalog document: [`endpoints/team-departments.md`](endpoints/team-departments.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.children` | array | 2 | Nested child rows (department tree). |
| `$.data.children[]` | object |  | Nested child rows (department tree). |
| `$.data.children[].children` | array | 1 | Nested child rows (department tree). |
| `$.data.children[].children[]` | object |  | Nested child rows (department tree). |
| `$.data.children[].children[].children` | array | 1 | Nested child rows (department tree). |
| `$.data.children[].children[].children[]` | object |  | Nested child rows (department tree). |
| `$.data.children[].children[].children[].children` | array | 1 | Nested child rows (department tree). |
| `$.data.children[].children[].children[].count` | number |  | Count. |
| `$.data.children[].children[].children[].departmentName` | string |  | Department display name; client label `部门名称`. |
| `$.data.children[].children[].children[].deptId` | string |  | Identifier. |
| `$.data.children[].children[].children[].manageName` | string |  | Display name. |
| `$.data.children[].children[].children[].members` | array | 0 | Department member rows. |
| `$.data.children[].children[].children[].pid` | string |  | Identifier. |
| `$.data.children[].children[].children[].userId` | string |  | User identifier. |
| `$.data.children[].children[].count` | number |  | Count. |
| `$.data.children[].children[].departmentName` | string |  | Department display name; client label `部门名称`. |
| `$.data.children[].children[].deptId` | string |  | Identifier. |
| `$.data.children[].children[].manageName` | string |  | Display name. |
| `$.data.children[].children[].members` | array | 0 | Department member rows. |
| `$.data.children[].children[].pid` | string |  | Identifier. |
| `$.data.children[].children[].userId` | string |  | User identifier. |
| `$.data.children[].count` | number |  | Count. |
| `$.data.children[].departmentName` | string |  | Department display name; client label `部门名称`. |
| `$.data.children[].deptId` | string |  | Identifier. |
| `$.data.children[].manageName` | string |  | Display name. |
| `$.data.children[].members` | array | 0 | Department member rows. |
| `$.data.children[].pid` | string |  | Identifier. |
| `$.data.children[].userId` | string |  | User identifier. |
| `$.data.count` | number |  | Count. |
| `$.data.departmentName` | string |  | Department display name; client label `部门名称`. |
| `$.data.deptId` | string |  | Identifier. |
| `$.data.manageName` | string |  | Display name. |
| `$.data.members` | array | 0 | Department member rows. |
| `$.data.pid` | string |  | Identifier. |
| `$.data.userId` | string |  | User identifier. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## team-invite-code

- Method: `POST`
- Path: `/v2/team/invite/getCode`
- Catalog document: [`endpoints/team-invite-code.md`](endpoints/team-invite-code.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `reset`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | string |  | Endpoint payload container. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## version-core

- Method: `POST`
- Path: `/v2/team/version/getCore`
- Catalog document: [`endpoints/version-core.md`](endpoints/version-core.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: `appVersion`, `versionCode`, `bitness`, `platform`, `browser`, `deviceId`, `mac`, `computerName`, `channel`, `appId`

Required body fields: none

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | array | 16 | Endpoint payload container. |
| `$.data[]` | object |  | Endpoint payload container. |
| `$.data[].allCompany` | number |  | All-companies roll-up block returned with the account summary. |
| `$.data[].appId` | string |  | Identifier. |
| `$.data[].appName` | string |  | Display name. |
| `$.data[].beginTime` | string |  | Timestamp. |
| `$.data[].bitness` | string |  | Client/kernel bitness (for example 64). |
| `$.data[].browser` | string |  | Browser/kernel family. |
| `$.data[].companyWhiteList` | null |  | Allowed-company whitelist. |
| `$.data[].content` | string |  | Log or notice body text. |
| `$.data[].coreId` | number |  | Identifier. |
| `$.data[].createBy` | number |  | Creator user ID. |
| `$.data[].createdAt` | string |  | Timestamp. |
| `$.data[].id` | number |  | Identifier. |
| `$.data[].md5` | string |  | File checksum (MD5). |
| `$.data[].minVersion` | string |  | Minimum supported client version. |
| `$.data[].minVersionCode` | number |  | Business status code; 200 is success. |
| `$.data[].platform` | string |  | Client platform. |
| `$.data[].size` | number |  | File size. |
| `$.data[].status` | string |  | Status value. |
| `$.data[].tag` | string |  | Tag value. |
| `$.data[].title` | string |  | Title text. |
| `$.data[].updateBy` | number |  | Timestamp. |
| `$.data[].updatedAt` | string |  | Timestamp. |
| `$.data[].updateType` | string |  | Timestamp. |
| `$.data[].url` | string |  | URL. |
| `$.data[].version` | string |  | Client/kernel version. |
| `$.data[].versionCode` | number |  | Business status code; 200 is success. |
| `$.requestId` | string |  | Identifier. |

## team-authentication-get

- Method: `GET`
- Path: `/v2/team/authentication/get`
- Catalog document: [`endpoints/team-authentication-get.md`](endpoints/team-authentication-get.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

_No response fields were observed._

## my-companies

- Method: `POST`
- Path: `/v2/team/myCompanies`
- Catalog document: [`endpoints/my-companies.md`](endpoints/my-companies.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | array | 2 | Endpoint payload container. |
| `$.data[]` | object |  | Endpoint payload container. |
| `$.data[].avatar` | string |  | Avatar image URL. |
| `$.data[].code` | string |  | Business status code; 200 is success. |
| `$.data[].companyId` | string |  | Company identifier. |
| `$.data[].createdAt` | string |  | Timestamp. |
| `$.data[].expire` | string |  | Expiry value. |
| `$.data[].ip` | string |  | IP address value. |
| `$.data[].lockAt` | string |  | Timestamp. |
| `$.data[].lockStatus` | number |  | Status value. |
| `$.data[].name` | string |  | Display name. |
| `$.data[].onwer` | string |  | Company owner identifier. |
| `$.data[].shortName` | string |  | Display name. |
| `$.data[].source` | string |  | Source channel. |
| `$.data[].status` | number |  | Status value. |
| `$.data[].token` | string |  | Session token (sensitive). |
| `$.data[].updateBy` | string |  | Timestamp. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## sms-settings

- Method: `POST`
- Path: `/v2/message/sms-setting/get`
- Catalog document: [`endpoints/sms-settings.md`](endpoints/sms-settings.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.renewSmsNotifyEnabled` | number |  | Enabled flag. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## member-profile

- Method: `POST`
- Path: `/v2/team/member/myInfo`
- Catalog document: [`endpoints/member-profile.md`](endpoints/member-profile.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.avatar` | string |  | Avatar image URL. |
| `$.data.companyId` | string |  | Company identifier. |
| `$.data.createdAt` | string |  | Timestamp. |
| `$.data.depPath` | string |  | Department path. |
| `$.data.deptId` | string |  | Identifier. |
| `$.data.deptName` | string |  | Display name. |
| `$.data.email` | string |  | Email address. |
| `$.data.id` | number |  | Identifier. |
| `$.data.lastLoginAt` | string |  | Timestamp. |
| `$.data.leave_status` | number |  | Status value. |
| `$.data.mobile` | string |  | Mobile phone number. |
| `$.data.name` | string |  | Display name. |
| `$.data.online` | number |  | Online status. |
| `$.data.openId` | string |  | Identifier. |
| `$.data.package_status` | number |  | Status value. |
| `$.data.pop` | boolean |  | Pop-up/notification flag. |
| `$.data.roles` | string |  | Role ID list (comma-wrapped string). |
| `$.data.rolesName` | array | 1 | Display name. |
| `$.data.rolesName[]` | string |  | Display name. |
| `$.data.updatedAt` | string |  | Timestamp. |
| `$.data.userId` | string |  | User identifier. |
| `$.data.username` | string |  | Display name. |
| `$.data.usetimeLimit` | object |  | Timestamp. |
| `$.data.usetimeLimit.beginDate` | string |  | Timestamp. |
| `$.data.usetimeLimit.endDate` | string |  | Timestamp. |
| `$.data.usetimeLimit.limit` | number |  | Usage/day limit. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## company-user-devices

- Method: `POST`
- Path: `/v2/team/company/user/devices`
- Catalog document: [`endpoints/company-user-devices.md`](endpoints/company-user-devices.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

_No response fields were observed._

## settings-contact

- Method: `GET`
- Path: `/v2/news/settings/info`
- Catalog document: [`endpoints/settings-contact.md`](endpoints/settings-contact.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: `key`

Required query fields: `key`

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.createdAt` | string |  | Timestamp. |
| `$.data.id` | number |  | Identifier. |
| `$.data.key` | string |  | Setting key. |
| `$.data.status` | number |  | Status value. |
| `$.data.updatedAt` | string |  | Timestamp. |
| `$.data.value` | object |  | Setting value block. |
| `$.data.value.account-right-top-phone` | string |  | Count. |
| `$.data.value.ae-mobile` | string |  | Support contact entry: AE mobile. |
| `$.data.value.company-introduction-mobile` | string |  | Support contact entry: company introduction mobile. |
| `$.data.value.company-support-email` | string |  | Support contact entry: company support email. |
| `$.data.value.customer-bubble-contact` | string |  | Support contact entry: customer bubble contact. |
| `$.data.value.email` | string |  | Email address. |
| `$.data.value.home-footer-contact` | string |  | Support contact entry: home footer contact. |
| `$.data.value.home-right-mobile` | string |  | Support contact entry: home right mobile. |
| `$.data.value.home-right-qq` | string |  | Support contact entry: home right QQ. |
| `$.data.value.home-right-weixin` | string |  | WeChat QR image entry (home right). |
| `$.data.value.land-help-bottom-email` | string |  | Support contact entry: help bottom email. |
| `$.data.value.land-help-bottom-mobile` | string |  | Support contact entry: help bottom mobile. |
| `$.data.value.land-right-custom-mobile` | string |  | Support contact entry: custom mobile. |
| `$.data.value.land-right-mobile` | string |  | Support contact entry: land right mobile. |
| `$.data.value.mobile` | string |  | Mobile phone number. |
| `$.data.value.nav-solution-mobile` | string |  | Support contact entry: nav solution mobile. |
| `$.data.value.proxy-custom-phone` | string |  | Support contact entry: proxy custom phone. |
| `$.data.value.recharge-customer-email` | string |  | Support contact entry: recharge customer email. |
| `$.data.value.recharge-customer-tg` | string |  | Support contact entry: recharge customer Telegram. |
| `$.data.value.recharge-customer-weixin` | string |  | Support contact entry: recharge customer WeChat. |
| `$.data.value.telegram` | string |  | Support contact entry: Telegram. |
| `$.data.value.wechat` | string |  | Timestamp. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## settings-qrcode

- Method: `GET`
- Path: `/v2/news/settings/info`
- Catalog document: [`endpoints/settings-qrcode.md`](endpoints/settings-qrcode.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: `key`

Required query fields: `key`

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.createdAt` | string |  | Timestamp. |
| `$.data.id` | number |  | Identifier. |
| `$.data.key` | string |  | Setting key. |
| `$.data.status` | number |  | Status value. |
| `$.data.updatedAt` | string |  | Timestamp. |
| `$.data.value` | object |  | Setting value block. |
| `$.data.value.company-introduction-customer-weixin` | string |  | WeChat QR image entry (company introduction, customer). |
| `$.data.value.company-introduction-weixin` | string |  | WeChat QR image entry (company introduction). |
| `$.data.value.customer` | string |  | Customer-service QR image entry. |
| `$.data.value.help-doc-bottom` | string |  | Help-document QR image entry. |
| `$.data.value.home-footer-social-video` | string |  | Home-footer social video QR entry. |
| `$.data.value.home-right-custom-weixin` | string |  | WeChat QR image entry (home right, custom). |
| `$.data.value.home-right-sales-wexin` | string |  | WeChat QR image entry (home right, sales). |
| `$.data.value.home-right-weixin` | string |  | WeChat QR image entry (home right). |
| `$.data.value.home-right-weixin-mini` | string |  | WeChat mini-program QR image entry. |
| `$.data.value.land-help-customer-weixin` | string |  | WeChat QR image entry (help customer). |
| `$.data.value.land-right-company-weixin` | string |  | WeChat QR image entry (company). |
| `$.data.value.land-right-custom-weixin` | string |  | WeChat QR image entry (custom). |
| `$.data.value.nav-solution-sales-weixin` | string |  | WeChat QR image entry (nav solution sales). |
| `$.data.value.proxy-api-add-customer-weixin` | string |  | WeChat QR image entry (proxy API customer). |
| `$.data.value.vip` | string |  | VIP QR image entry. |
| `$.data.value.weixin` | string |  | WeChat QR image entry. |
| `$.data.value.weixincustomer` | string |  | WeChat customer QR image entry. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.reqId` | string |  | Request correlation identifier. |

## company-face-check

- Method: `GET`
- Path: `/v2/team/authentication/companyFourElementsFaceCheck`
- Catalog document: [`endpoints/company-face-check.md`](endpoints/company-face-check.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.companyAcceptAt` | string |  | Timestamp. |
| `$.data.companyId` | string |  | Company identifier. |
| `$.data.companyIdCard` | string |  | Company ID-card number. |
| `$.data.companyStatus` | number |  | Status value. |
| `$.data.failCount` | number |  | Count. |
| `$.data.failReason` | string |  | Reason the verification failed. |
| `$.data.name` | string |  | Display name. |
| `$.data.processInstanceId` | string |  | Identifier. |
| `$.data.userAcceptAt` | string |  | Timestamp. |
| `$.data.userCard` | string |  | User ID-card number. |
| `$.data.userId` | string |  | User identifier. |
| `$.data.userStatus` | number |  | Status value. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## role-department-meal

- Method: `POST`
- Path: `/v2/team/company/getRoleDepartmentMeal`
- Catalog document: [`endpoints/role-department-meal.md`](endpoints/role-department-meal.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | array | 2 | Endpoint payload container. |
| `$.data[]` | object |  | Endpoint payload container. |
| `$.data[].companyId` | string |  | Company identifier. |
| `$.data[].day` | number |  | Plan day counter. |
| `$.data[].deptId` | string |  | Identifier. |
| `$.data[].deptName` | string |  | Display name. |
| `$.data[].end_time` | string |  | Timestamp. |
| `$.data[].expired` | boolean |  | Whether the plan/subscription is expired. |
| `$.data[].free_status` | number |  | Status value. |
| `$.data[].restrict` | boolean |  | Whether the account is restricted. |
| `$.data[].rolesId` | string |  | Identifier. |
| `$.data[].rolesName` | array | 1 | Display name. |
| `$.data[].rolesName[]` | string |  | Display name. |
| `$.data[].userId` | string |  | User identifier. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## authentication-check

- Method: `GET`
- Path: `/v2/team/authentication/check`
- Catalog document: [`endpoints/authentication-check.md`](endpoints/authentication-check.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.companyAcceptAt` | string |  | Timestamp. |
| `$.data.companyId` | string |  | Company identifier. |
| `$.data.companyIdCard` | string |  | Company ID-card number. |
| `$.data.companyStatus` | number |  | Status value. |
| `$.data.failCount` | number |  | Count. |
| `$.data.failReason` | string |  | Reason the verification failed. |
| `$.data.name` | string |  | Display name. |
| `$.data.processInstanceId` | string |  | Identifier. |
| `$.data.userAcceptAt` | string |  | Timestamp. |
| `$.data.userCard` | string |  | User ID-card number. |
| `$.data.userId` | string |  | User identifier. |
| `$.data.userStatus` | number |  | Status value. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## my-user-info

- Method: `POST`
- Path: `/v2/sso/auth/myUserinfo`
- Catalog document: [`endpoints/my-user-info.md`](endpoints/my-user-info.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.avatar` | string |  | Avatar image URL. |
| `$.data.bind` | object |  | Binding state or bound-account block. |
| `$.data.bind.ding` | number |  | DingTalk binding state. |
| `$.data.bind.google` | number |  | Google binding state. |
| `$.data.bind.mini` | number |  | WeChat mini-program binding state. |
| `$.data.bind.mp` | number |  | WeChat official-account binding state. |
| `$.data.bind.wechat` | number |  | Timestamp. |
| `$.data.bio` | string |  | Profile biography text. |
| `$.data.birthday` | string |  | Profile birthday. |
| `$.data.cancelDeadline` | null |  | Deadline before the account/subscription can be cancelled. |
| `$.data.cancelStatus` | number |  | Cancellation status. |
| `$.data.createdAt` | string |  | Timestamp. |
| `$.data.email` | string |  | Email address. |
| `$.data.firstName` | string |  | Display name. |
| `$.data.gender` | string |  | Profile gender. |
| `$.data.industryLabel` | string |  | Industry label. |
| `$.data.inviter` | string |  | Inviter identifier. |
| `$.data.inviteType` | number |  | Type discriminator. |
| `$.data.ip` | string |  | IP address value. |
| `$.data.ipLocation` | string |  | IP geolocation text. |
| `$.data.lastLoginDevice` | string |  | Last login device. |
| `$.data.lastLoginPort` | string |  | Last login port. |
| `$.data.lastName` | string |  | Display name. |
| `$.data.lockEnd` | string |  | Account lock end time. |
| `$.data.mobile` | string |  | Mobile phone number. |
| `$.data.nickname` | string |  | Display name. |
| `$.data.os` | string |  | Operating system string. |
| `$.data.password` | string |  | Password (sensitive). |
| `$.data.source` | string |  | Source channel. |
| `$.data.updateAt` | string |  | Timestamp. |
| `$.data.userId` | string |  | User identifier. |
| `$.data.username` | string |  | Display name. |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## token-refresh

- Method: `POST`
- Path: `/v2/sso/auth/tokenRefresh`
- Catalog document: [`endpoints/token-refresh.md`](endpoints/token-refresh.md)
- Authentication: Bearer token
- Mutation: no

### Request Fields

Request body fields: none cataloged.

Query fields: none cataloged.

### Response Fields

Observed via a live read call.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$` | object |  | Response root object. |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.expire` | string |  | Expiry value. |
| `$.data.need` | number |  | Whether an action is required. |
| `$.data.openId` | string |  | Identifier. |
| `$.data.source` | string |  | Source channel. |
| `$.data.token` | string |  | Session token (sensitive). |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |

## sso-login

- Method: `POST`
- Path: `/v2/sso/login`
- Catalog document: [`endpoints/sso-login.md`](endpoints/sso-login.md)
- Authentication: public
- Mutation: no

### Request Fields

Request body fields: `username`, `password`, `code`, `os`, `source`, `last_login_port`, `last_login_device`, `cl`

Required body fields: `username`, `password`

Query fields: none cataloged.

### Response Fields

Observed via live login.

| Field path | Observed type(s) | Array lengths | Meaning |
| --- | --- | --- | --- |
| `$.code` | number |  | Business status code; 200 is success. |
| `$.data` | object |  | Endpoint payload container. |
| `$.data.expire` | string |  | Expiry value. |
| `$.data.need` | number |  | Whether an action is required. |
| `$.data.openId` | string |  | Identifier. |
| `$.data.source` | string |  | Source channel. |
| `$.data.token` | string |  | Session token (sensitive). |
| `$.msg` | string |  | Localized operator-facing result message. |
| `$.requestId` | string |  | Identifier. |


## Coverage Summary

- Response field rows: 1224
- Described rows: 1224
- Undescribed rows: 0
- Description coverage: 100%
