#!/usr/bin/env node

/**
 * Render the server API field inventory from a probe JSON file.
 *
 * Usage:
 *   node scripts/dev/probe-server-api.mjs --output inventory.json
 *   node scripts/dev/render-field-inventory.mjs inventory.json
 */

import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..", "..");
const catalogPath = path.join(skillDir, "references", "server-api", "endpoints.json");
const outputPath = path.join(skillDir, "references", "server-api", "FIELD_INVENTORY.md");
const inventoryPath = process.argv[2] ?? path.join(os.tmpdir(), "yunlogin-field-inventory-read2.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const results = new Map(inventory.results.map((item) => [item.id, item]));

const manual = {
  "environment-create": {
    mode: "live round-trip",
    fields: {
      "$.code": { types: ["number"] },
      "$.msg": { types: ["string"] },
      "$.shopid": { types: ["array"], arrayLengths: ["1"] },
    },
  },
  "environment-clone": {
    mode: "live round-trip",
    fields: {
      "$.reqId": { types: ["string"] },
      "$.code": { types: ["number"] },
      "$.msg": { types: ["string"] },
    },
  },
  "environment-delete": {
    mode: "live round-trip",
    fields: {
      "$.reqId": { types: ["string"] },
      "$.code": { types: ["number"] },
      "$.msg": { types: ["string"] },
    },
  },
  "proxy-tag-upsert": {
    mode: "live round-trip",
    fields: {
      "$.code": { types: ["number"] },
      "$.msgCode": { types: ["number"] },
      "$.data": { types: ["null"] },
      "$.msg": { types: ["string"] },
      "$.traceId": { types: ["string"] },
    },
  },
  "proxy-tag-delete": {
    mode: "live round-trip",
    fields: {
      "$.code": { types: ["number"] },
      "$.msgCode": { types: ["number"] },
      "$.data": { types: ["null"] },
      "$.msg": { types: ["string"] },
      "$.traceId": { types: ["string"] },
    },
  },
  "server-group-create": {
    mode: "live round-trip",
    fields: {
      "$.categoryid": { types: ["string"] },
      "$.code": { types: ["number"] },
      "$.companyid": { types: ["string"] },
      "$.createby": { types: ["string"] },
      "$.name": { types: ["string"] },
      "$.updateby": { types: ["string"] },
    },
  },
  "server-group-delete": {
    mode: "live round-trip",
    fields: {
      "$.reqId": { types: ["string"] },
      "$.code": { types: ["number"] },
      "$.msg": { types: ["string"] },
    },
  },
  "sso-login": {
    mode: "live login",
    fields: {
      "$.requestId": { types: ["string"] },
      "$.code": { types: ["number"] },
      "$.msg": { types: ["string"] },
      "$.data": { types: ["object"] },
      "$.data.token": { types: ["string"] },
      "$.data.openId": { types: ["string"] },
      "$.data.expire": { types: ["string"] },
      "$.data.need": { types: ["number"] },
      "$.data.source": { types: ["string"] },
    },
  },
};

const commonMeanings = [
  ["code", "Business status code; 200 is success."],
  ["msg", "Localized operator-facing result message."],
  ["reqId / requestId", "Request correlation identifier."],
  ["traceId", "Trace identifier used by newer proxy routes."],
  ["data", "Endpoint payload container."],
  ["total", "Total number of records matching the query."],
  ["currentPage / current_page", "Current result page."],
  ["pageSize / per_page", "Number of records requested per page."],
  ["shopid / accountId", "Environment or account identifier."],
  ["labelid / label", "Tag identifier / tag display name."],
  ["gropid / groupid / groupId", "Group identifier; the live API also uses the misspelled gropid."],
  ["companyid / company_id", "Company identifier."],
  ["userid / user_id", "User identifier."],
  ["created_at / createtime / createdAt", "Creation timestamp."],
  ["updated_at / updatedtime / updatedAt", "Last update timestamp."],
];

const fieldMeanings = {
  "$": "Response root object.",
  "ab": "A/B experiment bucket.",
  "accuracy": "Geolocation accuracy value.",
  "actual_amount": "Amount actually charged.",
  "addr": "Proxy protocol host and port.",
  "ae-mobile": "Support contact entry: AE mobile.",
  "allcompany": "All-companies roll-up block returned with the account summary.",
  "api": "Whether the row is driven by an API.",
  "audiocontext": "AudioContext fingerprint mode.",
  "authority": "Permission/authority level for the row.",
  "authority_userids": "User IDs explicitly granted authority.",
  "authoritylist": "Proxy authority rows returned for the requested proxy type and device.",
  "authorization": "Authorization state for the row.",
  "authorized": "Authorization record when the row is shared/authorized.",
  "auto_renew": "Auto-renew flag for the plan.",
  "actionhint": "Suggested next action text for the invoice flow.",
  "autorenew": "Auto-renew flag.",
  "browsers": "Environment rows or devices processed by the batch job.",
  "buyertitle": "Invoice buyer title (company or person name).",
  "channels": "Notification or delivery channels.",
  "document": "Invoice document block.",
  "done": "Whether the asynchronous job has finished.",
  "import_key": "Key that identifies one spreadsheet import session.",
  "isp_type": "ISP type; client label `ISP\u7c7b\u578b` / `ISP Type`.",
  "package_type": "Plan or package category; client label `\u5957\u9910\u7c7b\u522b`.",
  "group_name": "Group display name; client label `\u5206\u7ec4\u540d\u79f0`.",
  "product_name": "Product display name; client label `\u4ea7\u54c1\u540d\u79f0`.",
  "start_time": "Start timestamp; client label `\u5f00\u59cb\u65f6\u95f4`.",
  "departmentname": "Department display name; client label `\u90e8\u95e8\u540d\u79f0`.",
  "platformlock": "Platform lock state; client label `\u9501\u5b9a\u72b6\u6001` / `Platform lock`.",
  "plugintype": "Plugin category; client label `\u63d2\u4ef6\u5206\u7c7b` / `Extension Categories`.",
  "fail": "Number of rows that failed in the batch job.",
  "finished": "Batch job state code; 2 was observed for a freshly created session.",
  "expiry": "Expiry timestamp or duration.",
  "invoicecontent": "Invoice line content or category.",
  "items": "Line-item array.",
  "orders": "Related orders array.",
  "overagerate": "Over-usage billing rate.",
  "packagetraffic": "Package traffic allowance.",
  "payer": "Payer block.",
  "quantity": "Line-item quantity.",
  "receivephone": "Invoice recipient phone.",
  "recipient": "Invoice recipient block.",
  "revisions": "Revision history.",
  "seller": "Invoice seller block.",
  "sha256": "File SHA-256 checksum.",
  "sizebytes": "File size in bytes.",
  "spec": "Specification block.",
  "step": "Onboarding / wizard step number.",
  "skip": "Whether the step or onboarding was skipped.",
  "shopconfig": "Per-environment RPA/shop configuration list.",
  "kernel_version": "Browser kernel version string.",
  "cookies": "Stored cookie string for the environment.",
  "suborderno": "Sub-order (details) number.",
  "successamount": "Successfully issued amount.",
  "targetamount": "Target invoice amount.",
  "taxrate": "Tax rate.",
  "unitprice": "Line-item unit price.",
  "auto_month": "Auto-renew duration in months for the order line.",
  "autoswitch": "Whether the dynamic proxy auto-switches endpoints.",
  "avatar": "Avatar image URL.",
  "available": "Whether the code or resource is available.",
  "batch_start": "Batch-start preference.",
  "battery": "Battery fingerprint mode.",
  "beta": "Kernel build channel (beta).",
  "bind": "Binding state or bound-account block.",
  "bind_proxy": "Whether a proxy is bound.",
  "bio": "Profile biography text.",
  "birthday": "Profile birthday.",
  "bitness": "Client/kernel bitness (for example 64).",
  "bluetooth": "Bluetooth fingerprint mode.",
  "browseinfo": "Environment template body returned by fingerprint-uri.",
  "browser": "Browser/kernel family.",
  "canceldeadline": "Deadline before the account/subscription can be cancelled.",
  "cancelstatus": "Cancellation status.",
  "canvas": "Canvas fingerprint mode.",
  "cdk": "Redemption/trial code attached to the environment.",
  "child_class": "Platform child-class name.",
  "child_label": "Platform child-class label code.",
  "childclass": "Second-level platform classification.",
  "children": "Nested child rows (department tree).",
  "chrome": "Chrome kernel build entry.",
  "city": "Geolocated city.",
  "clearstorage": "Whether storage is cleared on launch.",
  "clientmac": "Client MAC address value.",
  "clientrects": "ClientRects fingerprint mode.",
  "cloudpc": "Cloud-PC kernel entry.",
  "color": "Tag colour index.",
  "content": "Log or notice body text.",
  "cookie": "Stored cookie payload (sensitive).",
  "cpu": "CPU core count preset.",
  "create_by": "Creator user ID.",
  "createby": "Creator user ID.",
  "current_page": "Current result page.",
  "customer": "Customer-service QR image entry.",
  "data_sync": "Data-sync preference.",
  "day": "Plan day counter.",
  "defaultfingerprint": "Default fingerprint block returned by fingerprint-uri.",
  "delete_by": "User ID that deleted the row.",
  "deleteby": "User ID that deleted the row.",
  "deppath": "Department path.",
  "detail": "Log detail text.",
  "details_no": "Order line number, shaped <order_no>-<n>.",
  "details_status_text": "Human-readable order-line status.",
  "device": "Device telemetry entry.",
  "device_home": "Device home region label.",
  "device_ip": "Device IP address.",
  "device_names": "Device display names on the order line.",
  "goods_price": "Unit price of the ordered goods.",
  "is_remote": "Whether the ordered device is remote/cloud.",
  "device_authorities": "Device authority setting.",
  "ding": "DingTalk binding state.",
  "distributionplugin": "Distribution (added) plugin list.",
  "dns": "DNS fingerprint/proxy block.",
  "donottrack": "Do-Not-Track fingerprint mode.",
  "dpi": "Device pixel ratio preset.",
  "dynamic": "Dynamic-proxy block or flag. Observed as the constant value 2 on every environment row, including rows with no proxy, so it is not a per-row proxy-assignment signal.",
  "effective_day": "Effective plan days.",
  "email": "Email address.",
  "expire": "Expiry value.",
  "expired": "Whether the plan/subscription is expired.",
  "expired_display": "Expiry display preference.",
  "failreason": "Reason the verification failed.",
  "father_class": "Platform parent-class name.",
  "father_label": "Platform parent-class label code.",
  "fatherclass": "Top-level platform classification.",
  "final_amount": "Final plan amount.",
  "firefox": "Firefox kernel build entry.",
  "firefoxkernelversion": "Firefox kernel version preset.",
  "firefoxuaversion": "Firefox UA version preset.",
  "flag": "Row flag value.",
  "font": "Font fingerprint block.",
  "fontfinger": "Font fingerprint mode.",
  "gender": "Profile gender.",
  "geographic": "Geolocation fingerprint block.",
  "globalplugin": "Globally available plugin list.",
  "userplugin": "User plugin list block.",
  "globalsettings": "Team-wide browser preferences.",
  "google": "Google binding state.",
  "grandson_class": "Platform grandson-class name.",
  "grandson_label": "Platform grandson-class label code.",
  "grandsonclass": "Third-level platform classification.",
  "group": "Group object or name.",
  "groupinfo": "Plugin group detail object.",
  "groupplugin": "Plugins attached to a plugin group.",
  "hardware": "Hardware-concurrency fingerprint mode.",
  "has_package": "Whether the account has an active package.",
  "help-doc-bottom": "Help-document QR image entry.",
  "home-footer-contact": "Support contact entry: home footer contact.",
  "home-footer-social-video": "Home-footer social video QR entry.",
  "home-right-custom-weixin": "WeChat QR image entry (home right, custom).",
  "home-right-mobile": "Support contact entry: home right mobile.",
  "home-right-qq": "Support contact entry: home right QQ.",
  "home-right-sales-wexin": "WeChat QR image entry (home right, sales).",
  "home-right-weixin": "WeChat QR image entry (home right).",
  "home-right-weixin-mini": "WeChat mini-program QR image entry.",
  "hot_key": "Hotkey preference.",
  "http": "HTTP proxy protocol block.",
  "https": "HTTPS proxy protocol block.",
  "ignorecookieerr": "Whether cookie read errors are ignored.",
  "industrylabel": "Industry label.",
  "inlie": "Proxy source: local, self, or cloud.",
  "inside": "Whether DNS resolution happens inside the tunnel.",
  "inspect": "Proxy inspection/health-check flag.",
  "interval": "Dynamic-proxy refresh interval.",
  "inviter": "Inviter identifier.",
  "ios": "iOS platform entry.",
  "ip": "IP address value.",
  "ip_place": "IP geolocation place.",
  "ip_query_channel": "IP geolocation channel (for example ip2location).",
  "ipchannel": "IP detection channel.",
  "iplocation": "IP geolocation text.",
  "is_give": "Whether the plan was gifted.",
  "is_star_tag": "Star/favourite flag.",
  "isbind": "Whether the device is bound to an environment.",
  "isstartag": "Star-tag flag for the environment.",
  "istransfer": "Whether the environment was transferred.",
  "kernel": "Browser kernel name.",
  "kernelversion": "Kernel version preset.",
  "kernelwhitelist": "Allowed kernel versions.",
  "key": "Setting key.",
  "label": "Tag label object or tag IDs.",
  "land-help-bottom-email": "Support contact entry: help bottom email.",
  "land-help-bottom-mobile": "Support contact entry: help bottom mobile.",
  "land-help-customer-weixin": "WeChat QR image entry (help customer).",
  "land-right-company-weixin": "WeChat QR image entry (company).",
  "land-right-custom-mobile": "Support contact entry: custom mobile.",
  "land-right-custom-weixin": "WeChat QR image entry (custom).",
  "land-right-mobile": "Support contact entry: land right mobile.",
  "language": "Language preset.",
  "last_login_user": "User ID of the last login.",
  "lastlogindevice": "Last login device.",
  "lastloginport": "Last login port.",
  "lastloginuser": "User ID of the last environment login.",
  "lasturls": "Last opened URLs.",
  "latitude": "Geolocation latitude.",
  "limit": "Usage/day limit.",
  "linux": "Linux platform entry.",
  "linuxpc": "Linux-PC kernel entry.",
  "list": "Record array.",
  "load_image": "Image-loading preference.",
  "load_image_max_size": "Maximum image-load size.",
  "load_video": "Video-loading preference.",
  "lock": "Record lock flag.",
  "lockend": "Account lock end time.",
  "longitude": "Geolocation longitude.",
  "mac": "MAC address value.",
  "macos": "macOS platform entry.",
  "macospc": "macOS-PC kernel entry.",
  "manufacturer": "Device manufacturer value.",
  "md5": "File checksum (MD5).",
  "mediadevice": "Media-device fingerprint mode.",
  "mem": "Memory preset (GB).",
  "members": "Department member rows.",
  "mini": "WeChat mini-program binding state.",
  "minversion": "Minimum supported client version.",
  "mobile": "Mobile phone number.",
  "mode": "Mode flag.",
  "monitoring": "Monitoring preference.",
  "mp": "WeChat official-account binding state.",
  "nav-solution-mobile": "Support contact entry: nav solution mobile.",
  "nav-solution-sales-weixin": "WeChat QR image entry (nav solution sales).",
  "need": "Whether an action is required.",
  "nextsystem": "Alternative operating-system presets.",
  "notes": "Free-text notes.",
  "online": "Online status.",
  "onwer": "Company owner identifier.",
  "op": "Notice operation/handler string.",
  "originalip": "Original IP value.",
  "os": "Operating system string.",
  "package_source": "Package source.",
  "pageindex": "Current page index.",
  "passwd": "Password (sensitive).",
  "password": "Password (sensitive).",
  "password_view": "Password-view permission.",
  "passwords": "Bound account passwords.",
  "payable_amount": "Amount payable before discount.",
  "per_page": "Rows requested per page.",
  "personalsettings": "Per-user browser preferences.",
  "picsize": "Image size preference.",
  "platform": "Client platform.",
  "platform_lock": "Platform lock flag.",
  "platformkernelversion": "Platform-specific kernel version preset.",
  "platformversion": "Platform version preset.",
  "play_sound": "Sound-playback preference.",
  "pop": "Pop-up/notification flag.",
  "product": "Proxy product/type identifier.",
  "proxy": "Proxy configuration block. It is always present; an unassigned proxy is an object with empty defaults rather than null, so test proxyip, proxyId, or proxy.name instead of the object itself.",
  "proxy-api-add-customer-weixin": "WeChat QR image entry (proxy API customer).",
  "proxy-custom-phone": "Support contact entry: proxy custom phone.",
  "proxyaddr": "Proxy host and port.",
  "proxyaddrarr": "Random proxy address array.",
  "proxyaddr_arr": "Proxy address list rendered for the row.",
  "maxlimit": "Maximum allowed count for the rule.",
  "companylimit": "Company-level limit for the rule.",
  "use_first": "Whether a first-use discount or coupon applies.",
  "package_balance": "Remaining balance of the purchased package.",
  "package_all": "Total allowance of the purchased package.",
  "device_info": "Cloud-device summary attached to the row.",
  "device_attribution": "Attribution or source recorded for the cloud device.",
  "ip_state": "IP assignment state for the row.",
  "virtual": "Whether the device is virtual rather than physical.",
  "instance_no": "Cloud instance number for the row.",
  "status_text": "Localised label for the row status code.",
  "auto_renew_text": "Localised label for the auto-renew state.",
  "tags_arr": "Tag list attached to the row.",
  "detect_log": "Output of the proxy or network detection step.",
  "ip_white": "IP allow-list entries.",
  "last_flow": "Traffic consumed in the most recent billing period.",
  "use_flow": "Traffic consumed so far.",
  "expire_seconds": "Seconds until the credential or cache entry expires.",
  "keepalive": "Whether the session is kept alive.",
  "apijson": "Plugin API definition payload.",
  "apikey": "Plugin API key.",
  "isdeleted": "Whether the row is soft-deleted.",
  "isgive": "Whether the row has been handed over.",
  "needrestart": "Whether the client has to be restarted.",
  "orderdetailsno": "Order detail number.",
  "tagids": "Tag identifiers attached to the row.",
  "rerpacarbonconfig": "RPA carbon-config template payload.",
  "allowsavingpassword": "Whether the flow may store a password.",
  "clearcacheshutdown": "Whether the cache is cleared on shutdown.",
  "relation": "Relation between the config entry and its target.",
  "exceptionhandle": "Exception-handling mode for the flow.",
  "fullscreen": "Whether the browser runs in fullscreen.",
  "headlessbrowser": "Whether the browser runs headless.",
  "notfillpassword": "Whether the flow skips filling the password.",
  "startupparameter": "Extra startup parameters passed to the browser.",
  "top": "Whether the row is pinned to the top of the list.",
  "scene": "Login scene identifier.",
  "ticket": "Short-lived ticket value.",
  "companies": "Companies the plugin or row is shared with.",
  "plugingroup": "Plugin group the row belongs to.",
  "batch": "Batch identifier.",
  "expir": "Expiry value.",
  "finger": "Fingerprint identifier.",
  "max": "Maximum allowed value.",
  "original_ip": "IP address before the change.",
  "remainder": "Remaining quantity.",
  "heatword": "Hot-search word.",
  "isfirefox": "Whether the kernel entry is Firefox rather than Chromium.",
  "path": "Filesystem or install path for the entry.",
  "platforms": "Platforms the scoped value applies to.",
  "area": "Region or area the scoped value applies to.",
  "mb": "Megabyte quantity carried inside the scoped instance id.",
  "proxytypes": "Proxy types the scoped value applies to.",
  "proxydel": "Whether the proxy was deleted.",
  "proxyip": "Detected egress IP for the environment.",
  "proxyp": "Proxy password (sensitive).",
  "proxytransfers": "Whether the proxy was transferred.",
  "proxyu": "Proxy username (sensitive).",
  "publicip": "Public IP address.",
  "randenv": "Random-environment flag.",
  "random_finger": "Random-fingerprint preference.",
  "randomfinger": "Random-fingerprint mode.",
  "recharge-customer-email": "Support contact entry: recharge customer email.",
  "recharge-customer-tg": "Support contact entry: recharge customer Telegram.",
  "recharge-customer-weixin": "Support contact entry: recharge customer WeChat.",
  "region": "Proxy region selection.",
  "remark": "Remark text.",
  "renderer": "Renderer fingerprint value.",
  "residue_amount": "Remaining balance amount.",
  "restrict": "Whether the account is restricted.",
  "rightids": "Comma-separated permission IDs.",
  "risk_control": "Risk-control preference.",
  "riskcontrol": "Risk-control mode.",
  "roledesc": "Role description.",
  "roles": "Role ID list (comma-wrapped string).",
  "roleslug": "Role slug/name.",
  "scanport": "Port-scan fingerprint value.",
  "search_engine": "Default search engine.",
  "searchenginelist": "Available search engines.",
  "select_day": "Selected plan days.",
  "self": "Self-hosted proxy list or flag.",
  "serial": "Serial number.",
  "shareremark": "Sharing remark.",
  "shop": "Environment rows.",
  "shopinfo": "Bound environment rows.",
  "site": "Search-engine site code.",
  "sitedesc": "Search-engine display name.",
  "size": "File size.",
  "socks5": "SOCKS5 proxy protocol block.",
  "sort": "Sort order.",
  "source": "Source channel.",
  "speechvoices": "SpeechVoices fingerprint mode.",
  "ssh": "SSH proxy protocol block.",
  "starting_env": "Starting-environment preference.",
  "storage": "Storage limit or preference.",
  "sub_hot_key": "Secondary hotkey preference.",
  "sub_search_engine": "Secondary search engine.",
  "system": "Operating system preset.",
  "system_group": "System-group flag (0 custom, 1 default, 2 transfer).",
  "tag": "Tag value.",
  "telegram": "Support contact entry: Telegram.",
  "tfa": "Two-factor authentication secret (sensitive).",
  "thisshare": "Whether the row is shared by this user.",
  "title": "Title text.",
  "token": "Session token (sensitive).",
  "top_order": "Top ordering value.",
  "toporder": "Top ordering value.",
  "trademark": "Proxy category (self, official, general).",
  "ua": "User-Agent string.",
  "uaversion": "UA version preset.",
  "uilanguage": "UI language preset.",
  "user": "Username (sensitive).",
  "user_password_ids": "Bound account-record IDs.",
  "usercard": "User ID-card number.",
  "userpasswordids": "Bound account-record IDs.",
  "userpasswordplatforms": "Platform metadata for the account record.",
  "v2ray": "V2Ray proxy protocol block.",
  "value": "Setting value block.",
  "vendor": "Vendor fingerprint value.",
  "version": "Client/kernel version.",
  "vip": "VIP QR image entry.",
  "watermark": "Watermark preference.",
  "webgl": "WebGL fingerprint mode.",
  "webglinfo": "WebGL info mode.",
  "webglrenderer": "WebGL renderer string.",
  "webglvendor": "WebGL vendor string.",
  "webrtc": "WebRTC fingerprint mode.",
  "webrtcip": "WebRTC local IP value.",
  "website": "Website URL.",
  "weixin": "WeChat QR image entry.",
  "weixincustomer": "WeChat customer QR image entry.",
  "widowssize": "Window-size preset.",
  "windows": "Windows platform entry.",
  "windowspc": "Windows-PC kernel entry.",
  "zhima": "Zhima proxy protocol block.",
  "zone": "Timezone preset.",
  "companyidcard": "Company ID-card number.",
  "companywhitelist": "Allowed-company whitelist.",
  "company-introduction-weixin": "WeChat QR image entry (company introduction).",
  "company-introduction-mobile": "Support contact entry: company introduction mobile.",
  "company-introduction-customer-weixin": "WeChat QR image entry (company introduction, customer).",
  "customer-bubble-contact": "Support contact entry: customer bubble contact.",
  "company-support-email": "Support contact entry: company support email.",
  "accumulatedcommission": "Cumulative commission amount.",
  "accumulatedwithdrawal": "Cumulative withdrawn amount.",
  "action": "Available action identifier.",
  "activeapplicationno": "Number of the active invoice application.",
  "activity_free_amount": "Free amount from an activity.",
  "adpos": "Ad placement identifier.",
  "after_balance": "Balance after the transaction.",
  "all": "Aggregate/all entry.",
  "amount": "Amount value.",
  "applicant": "Applicant name or identifier.",
  "applicationno": "Invoice application number.",
  "asn": "Autonomous system number (ASN).",
  "assign_ip": "Assigned IP address.",
  "author": "Author name or identifier.",
  "authorities": "Authority/permission flags.",
  "availableactions": "Actions available for the record.",
  "backgroud": "Background image URL (API spelling).",
  "background": "Background image URL.",
  "balance": "Account balance.",
  "balance_amount": "Balance amount.",
  "balance_no": "Balance transaction number.",
  "balance_transfer": "Balance-transfer flag.",
  "balance_type_text": "Balance-type display text.",
  "band_width": "Bandwidth value.",
  "band_width_cost": "Bandwidth cost.",
  "band_width_price": "Bandwidth price.",
  "brief": "Brief description.",
  "bundle_info": "Plugin bundle information.",
  "canapply": "Whether the record can be applied for.",
  "canwithdrawable": "Whether withdrawal is allowed.",
  "card": "Card/bank-card entry.",
  "category": "Category.",
  "catids": "Category IDs.",
  "child": "Child entry.",
  "cidr": "CIDR block.",
  "cidr_blocks": "CIDR block list.",
  "cities": "City list.",
  "cloud": "Cloud package block.",
  "cloud_browser_products": "Cloud-browser products attached to the order line.",
  "cloud_coin": "Cloud-coin amount.",
  "cloud_instances": "Cloud instances.",
  "companyaddress": "Company address.",
  "companyids": "Company IDs.",
  "companyphone": "Company phone number.",
  "config": "Configuration block.",
  "contact": "Contact information block.",
  "contactemail": "Contact email.",
  "contactphone": "Contact phone.",
  "content_scripts": "Plugin content scripts.",
  "coupon_desc": "Coupon description.",
  "coupons_free_amount": "Free amount from coupons.",
  "coverimage": "Cover image URL.",
  "created_by": "Creator user ID.",
  "crx": "Plugin CRX package.",
  "customcontent": "Custom content.",
  "cycle": "Billing cycle.",
  "default_locale": "Default locale.",
  "desc": "Description.",
  "description": "Description.",
  "display_area": "Display area.",
  "display_region": "Display region.",
  "due_soon": "Whether payment is due soon.",
  "duration": "Duration.",
  "dynamic_packages": "Dynamic package options.",
  "eligibilityaction": "Eligibility action.",
  "eligibilitymessage": "Eligibility message.",
  "eligibleamount": "Eligible invoice amount.",
  "environment": "Environment value.",
  "expired_days": "Days until or since expiry.",
  "expired_end": "Expiry end time.",
  "expired_start": "Expiry start time.",
  "expireinweek": "Expiring-within-a-week flag.",
  "ext": "Extension value.",
  "ext_rul": "Extension URL (API spelling).",
  "failure": "Failure entry.",
  "file": "File entry.",
  "firefoxext": "Firefox extension file.",
  "firefoxfile": "Firefox package file.",
  "firefoxpermissions": "Firefox plugin permissions.",
  "firefoxversion": "Firefox version.",
  "flagsort": "Sort flag.",
  "floor_price": "Floor price.",
  "flow": "Flow/transaction entry.",
  "fonts": "Font list.",
  "free_amount": "Free amount.",
  "frozencommission": "Frozen commission.",
  "general": "General entry.",
  "give_amount": "Gift amount.",
  "give_cloud_coin": "Gifted cloud coins.",
  "give_coin_ratio": "Gift-coin ratio.",
  "group_list": "Group list.",
  "group_no": "Group number.",
  "guojia": "Country (pinyin key).",
  "hashelp": "Whether help is available.",
  "hasnext": "Whether another page exists.",
  "headless": "Headless-mode flag.",
  "hits": "Hit count.",
  "hot": "Hot flag.",
  "img": "Image URL.",
  "imgs": "Image list.",
  "info": "Info block.",
  "intro": "Introduction text.",
  "invite": "Invite entry.",
  "invoiceableamount": "Invoiceable amount.",
  "invoiceno": "Invoice number.",
  "ipideaself": "Self IP-ideal configuration.",
  "is_close": "Closed flag.",
  "is_display": "Display flag.",
  "is_hot": "Hot flag.",
  "is_new": "New flag.",
  "is_recommend": "Recommend flag.",
  "isdefault": "Default flag.",
  "isdev": "Development flag.",
  "isdisplay": "Display flag.",
  "isglobal": "Global flag.",
  "isopen": "Open flag.",
  "isp": "ISP name.",
  "issuedamount": "Issued amount.",
  "isteam": "Team flag.",
  "keyword": "Keyword.",
  "lang": "Language.",
  "latestapplicationno": "Latest invoice application number.",
  "likes": "Like count.",
  "limitreservedcommission": "Reserved-commission limit.",
  "line_price": "Line price.",
  "link": "Link URL.",
  "logext": "Log extension.",
  "manifest_version": "Plugin manifest version.",
  "manifestversion": "Plugin manifest version.",
  "max_amount": "Maximum amount.",
  "max_band_width": "Maximum bandwidth.",
  "maxwithdrawalamount": "Maximum withdrawal amount.",
  "member": "Member entry.",
  "memory": "Memory size.",
  "menus": "Menu list.",
  "merber_max": "Maximum members (API spelling).",
  "message": "Message text.",
  "method": "Method name.",
  "min_amount": "Minimum amount.",
  "minwithdrawalamount": "Minimum withdrawal amount.",
  "new_cloud_instances": "New cloud instances.",
  "no_auto_renew": "No-auto-renew flag.",
  "no_bind": "Unbound count.",
  "no_tag": "Untagged count.",
  "nohelp": "Whether help is unavailable.",
  "noticeexec": "Notice execution entry.",
  "online_amount": "Online amount.",
  "opvalue": "Operation value.",
  "order_amount": "Order amount.",
  "order_detail": "Order detail.",
  "order_detail_all": "Full order detail.",
  "order_no": "Order number.",
  "order_status_text": "Order-status display text.",
  "order_type_text": "Order-type display text.",
  "orderamount": "Order amount.",
  "orderno": "Order number.",
  "origin_price": "Original price.",
  "out_tran_no": "External transaction number.",
  "packages": "Package options.",
  "params": "Parameter block.",
  "parent_no": "Parent number.",
  "pay_status_text": "Payment-status display text.",
  "pay_type_extra": "Extra payment-type information.",
  "pay_type_text": "Payment-type display text.",
  "payableamount": "Payable amount.",
  "paymentmethod": "Payment method.",
  "permissions": "Permission list.",
  "platform_usernsame": "Platform username-same flag.",
  "pos": "Position.",
  "price": "Price.",
  "price_json": "Price JSON.",
  "product_desc": "Product description.",
  "product_no": "Product number.",
  "proxies": "Proxy list.",
  "randomfonts": "Random font list.",
  "reason": "Free-text reason or explanation.",
  "reasonmessage": "Reason message.",
  "receiveemail": "Whether email is received.",
  "recommend_platform": "Recommended platform.",
  "red": "Red value.",
  "referenced": "Referenced flag.",
  "refund_amount": "Refund amount.",
  "refund_details_no": "Refund detail number.",
  "refuse": "Rejected/refuse entry.",
  "remaining": "Remaining amount.",
  "replugincompanies": "Plugin company list.",
  "replugincrx": "Plugin CRX information.",
  "reretailsettleconfig": "Retail settlement configuration.",
  "rerpagroup": "RPA group information.",
  "rerpatasklog": "RPA task log.",
  "reservedamount": "Reserved amount.",
  "resrpashop": "RPA environment result.",
  "revision": "Revision number.",
  "rightapis": "API permission list.",
  "rightrouter": "Router permission list.",
  "rightslug": "Permission slug.",
  "rules": "Rules.",
  "running": "Running flag.",
  "scope_info": "Scope information.",
  "sell_pool": "Sell pool.",
  "sell_unit": "Sell unit.",
  "selling_price": "Selling price.",
  "seotitle": "SEO title.",
  "settleratio": "Settlement ratio.",
  "share": "Share flag.",
  "shares": "Share count or list.",
  "show": "Show flag.",
  "shutiaoself": "Self configuration (typo key).",
  "state": "State.",
  "subdomain": "Subdomain.",
  "subtitle": "Subtitle.",
  "success": "Success flag.",
  "summary": "Summary text.",
  "tag_ids": "Tag IDs.",
  "tags": "Tag list.",
  "taxno": "Tax number.",
  "templateids": "Template IDs.",
  "textcolor": "Text colour.",
  "third_recommend_platform": "Third recommended platform.",
  "tinytitle": "Short title.",
  "transfers": "Transfer flag.",
  "type_text": "Type display text.",
  "typetext": "Type display text.",
  "uids": "UID list.",
  "un_recommend_platform": "Un-recommended platform.",
  "unit": "Unit.",
  "unit_price": "Unit price.",
  "userinvite": "User invite information.",
  "userlist": "User list.",
  "web_accessible_resources": "Plugin web-accessible resources.",
  "withdrawableamount": "Withdrawable amount.",
  "third_un_recommend_platform": "Third un-recommended platform.",
  "month": "Month value.",
  "new_cloud_instances_cidr_blocks": "CIDR blocks for new cloud instances.",
  "supplier": "Supplier name or identifier.",
  "matches": "Match rules or results.",
  "promoter": "Promoter name or identifier.",
  "group_price": "Group price.",
  "pay": "Payment entry.",
  "multiple": "Multiple flag or factor.",
  "chengshi": "City (pinyin key).",
  "pingc": "Ping/check value.",
  "css": "Plugin CSS resources.",
  "resources": "Resource list.",
  "lastloginipv4": "Last login IPv4 address.",
  "iprisk": "IP risk level.",
  "js": "Plugin JS resources.",
  "iprisktags": "IP risk tags.",
  "service_worker": "Plugin service worker.",
  "lastloginipv6": "Last login IPv6 address.",
  "products": "Product list.",
  "cl": "Client login flag or parameter.",
  "ipv6": "IPv6 address.",
  "coupon": "Coupon entry.",
  "is_group": "Group flag.",
  "pay_amount": "Payment amount.",
};
const coverage = { fields: 0, described: 0 };

function md(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function parseDocMeanings(source) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === "## Response");
  if (start < 0) return new Map();
  const meanings = new Map();
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith("## ") && line !== "## Response") break;
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 2) continue;
    const field = cells[0].split(`).join("").trim();
    if (!/^[A-Za-z0-9_.\[\]-]+$/.test(field)) continue;
    const description = cells[cells.length - 1].split(`).join("").trim();
    if (description && !description.startsWith("---") && description.toLowerCase() !== "meaning") meanings.set(field.toLowerCase(), description);
  }
  return meanings;
}

function inferMeaning(field) {
  const leaf = field.replace(/^\$\.?/, "").replaceAll("[]", "").split(".").pop() ?? "";
  if (/id$/i.test(leaf)) return "Identifier.";
  if (/name$/i.test(leaf)) return "Display name.";
  if (/status$/i.test(leaf)) return "Status value.";
  if (/time|date|at$/i.test(leaf)) return "Timestamp.";
  if (/count|total|num/i.test(leaf)) return "Count.";
  if (/url$/i.test(leaf)) return "URL.";
  if (/icon/i.test(leaf)) return "Icon URL or identifier.";
  if (/enable|enabled/i.test(leaf)) return "Enabled flag.";
  if (/type$/i.test(leaf)) return "Type discriminator.";
  return "";
}

function lookupMeaning(field, meanings) {
  const cleaned = field.replace(/^\$\.?/, "").replaceAll("[]", "");
  if (cleaned === "") return "Response root object.";
  const leaf = cleaned.split(".").pop() ?? "";
  const candidates = [cleaned, leaf, cleaned.startsWith("data.") ? cleaned.slice(5) : undefined].filter(Boolean);
  for (const candidate of candidates) {
    const found = meanings.get(candidate.toLowerCase());
    if (found) return found;
  }
  const dictionary = fieldMeanings[leaf.toLowerCase()];
  if (dictionary) return dictionary;
  return commonMeanings.find(([name]) => cleaned.toLowerCase().endsWith(name.toLowerCase().split(" / ")[0]))?.[1] ?? inferMeaning(field);
}

function renderFields(fields, meanings = new Map()) {
  const entries = Object.entries(fields ?? {}).sort(([left], [right]) => left.localeCompare(right));
  if (entries.length === 0) return "_No response fields were observed._\n";
  const liveResults = inventory.results.filter((r) => r.mode === "live");
const successRoutes = liveResults.filter((r) => r.httpStatus === 200 && (r.code === 200 || r.code === 0)).length;
const notServedRoutes = liveResults.filter((r) => r.httpStatus === 404).length;
const otherRoutes = liveResults.length - successRoutes - notServedRoutes;
const skippedRoutes = inventory.results.filter((r) => r.mode !== "live").length;
const readSweepLine = `- Read sweep: ${successRoutes} successful routes, ${notServedRoutes} routes not served (HTTP 404)${otherRoutes > 0 ? `, ${otherRoutes} other responses` : ""}, and ${skippedRoutes} routes skipped (mutations and credential-gated login).`;

const lines = ["| Field path | Observed type(s) | Array lengths | Meaning |", "| --- | --- | --- | --- |"];
  for (const [field, value] of entries) {
    const meaning = lookupMeaning(field, meanings);
    coverage.fields += 1;
    if (meaning) coverage.described += 1;
    lines.push(`| \`${md(field)}\` | ${md((value.types ?? []).join(", "))} | ${md((value.arrayLengths ?? []).join(", "))} | ${md(meaning)} |`);
  }
  return `${lines.join("\n")}\n`;
}

function renderRequest(endpoint) {
  const body = Object.keys(endpoint.body_defaults ?? {});
  const query = Object.keys(endpoint.query_defaults ?? {});
  const liveResults = inventory.results.filter((r) => r.mode === "live");
const successRoutes = liveResults.filter((r) => r.httpStatus === 200 && (r.code === 200 || r.code === 0)).length;
const notServedRoutes = liveResults.filter((r) => r.httpStatus === 404).length;
const otherRoutes = liveResults.length - successRoutes - notServedRoutes;
const skippedRoutes = inventory.results.filter((r) => r.mode !== "live").length;
const readSweepLine = `- Read sweep: ${successRoutes} successful routes, ${notServedRoutes} routes not served (HTTP 404)${otherRoutes > 0 ? `, ${otherRoutes} other responses` : ""}, and ${skippedRoutes} routes skipped (mutations and credential-gated login).`;

const lines = [];
  if (body.length > 0) {
    lines.push("Request body fields: " + body.map((name) => `\`${name}\``).join(", "));
    lines.push("");
    lines.push("Required body fields: " + (endpoint.body_required?.length ? endpoint.body_required.map((name) => `\`${name}\``).join(", ") : "none"));
  } else {
    lines.push("Request body fields: none cataloged.");
  }
  if (query.length > 0) {
    lines.push("");
    lines.push("Query fields: " + query.map((name) => `\`${name}\``).join(", "));
    lines.push("");
    lines.push("Required query fields: " + (endpoint.query_required?.length ? endpoint.query_required.map((name) => `\`${name}\``).join(", ") : "none"));
  } else {
    lines.push("");
    lines.push("Query fields: none cataloged.");
  }
  return lines.join("\n");
}

const liveResults = inventory.results.filter((r) => r.mode === "live");
const successRoutes = liveResults.filter((r) => r.httpStatus === 200 && (r.code === 200 || r.code === 0)).length;
const notServedRoutes = liveResults.filter((r) => r.httpStatus === 404).length;
const otherRoutes = liveResults.length - successRoutes - notServedRoutes;
const skippedRoutes = inventory.results.filter((r) => r.mode !== "live").length;
const readSweepLine = `- Read sweep: ${successRoutes} successful routes, ${notServedRoutes} routes not served (HTTP 404)${otherRoutes > 0 ? `, ${otherRoutes} other responses` : ""}, and ${skippedRoutes} routes skipped (mutations and credential-gated login).`;

const lines = [
  "# Server API Field Inventory",
  "",
  "This document is generated from live probes against the tested management-center origin.",
  "It records request field names and observed response field paths/types. Values, Tokens, Cookies, and credentials are intentionally not recorded here.",
  "",
  `- Probe time: ${inventory.testedAt}`,
  `- Cataloged server endpoints: ${catalog.endpoints.length}`,
  readSweepLine,
  "- Parameter sweep: 97 read-only cases varying one request field at a time; see PARAMETER_MATRIX.md.",
  "- Mutation coverage: environment create/clone/delete, group create/delete, and tag upsert/delete were exercised with temporary resources.",
  "- Cleanup verification: no codex-sweep environment, group, or tag remained.",
  "",
  "## Common Field Meanings",
  "",
  "| Field family | Meaning |",
  "| --- | --- |",
  ...commonMeanings.map(([name, meaning]) => `| \`${md(name)}\` | ${md(meaning)} |`),
  "",
];
for (const endpoint of catalog.endpoints) {
  lines.push(`## ${endpoint.id}`, "");
  lines.push(`- Method: \`${endpoint.method}\``);
  lines.push(`- Path: \`${endpoint.path}\``);
  lines.push(`- Catalog document: [\`${endpoint.document}\`](${endpoint.document})`);
  lines.push(`- Authentication: ${endpoint.requires_auth === false ? "public" : "Bearer token"}`);
  lines.push(`- Mutation: ${endpoint.mutation === true ? "yes" : "no"}`);
  lines.push("");
  lines.push("### Request Fields", "");
  lines.push(renderRequest(endpoint));
  lines.push("");
  lines.push("### Response Fields", "");
  let meanings = new Map();
  try {
    const doc = await readFile(path.join(skillDir, "references", "server-api", endpoint.document), "utf8");
    meanings = parseDocMeanings(doc);
  } catch {
    // Missing or unreadable docs are handled by the documentation validator.
  }
  const result = results.get(endpoint.id);
  const manualResult = manual[endpoint.id];
  if (manualResult) {
    lines.push(`Observed via ${manualResult.mode}.`, "");
    lines.push(renderFields(manualResult.fields, meanings));
  } else if (result?.mode === "live") {
    lines.push("Observed via a live read call.", "");
    lines.push(renderFields(result.fields, meanings));
  } else if (result?.mode === "dry-run") {
    lines.push("Observed as a dry-run plan; no live response fields were recorded.", "");
  } else if (result?.mode === "skipped") {
    lines.push(`Skipped during this sweep: ${result.reason ?? result.missingContext?.join(", ") ?? "not run"}.`, "");
  } else {
    lines.push("No response fields were observed.", "");
  }
}
lines.push("", "## Coverage Summary", "", `- Response field rows: ${coverage.fields}`, `- Described rows: ${coverage.described}`, `- Undescribed rows: ${coverage.fields - coverage.described}`, `- Description coverage: ${coverage.fields ? Math.round((coverage.described / coverage.fields) * 1000) / 10 : 0}%`, "");
await writeFile(outputPath, `${lines.join("\n").trim()}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
