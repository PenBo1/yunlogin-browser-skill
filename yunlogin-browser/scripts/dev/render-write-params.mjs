#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "references", "server-api");
const sweep = JSON.parse(await readFile(path.join(dir, "route-sweep.json"), "utf8"));
const params = JSON.parse(await readFile(path.join(dir, "client-params.json"), "utf8")).params;
const WRITE = /(create|add|update|edit|change|set|delete|del|remove|batch|bind|unbind|upload|download|insert|reset|approve|reject|move|logout|login|register|pay|paypal|recharge|order|refund|apply|recover|top|complete|cancel|submit|verify|confirm|regroup|clone|clear|close|stop|start|send|save|import|export|merge|assign|grant|revoke|modify|enable|disable|freeze|unfreeze|kick|invite|join|quit|readall|noticered|config)/i;
const writes = sweep.results.filter((x) => WRITE.test(x.name) || WRITE.test(x.path));
const byPrefix = {};
for (const x of writes) { const p = "/" + x.path.split("/").slice(1, 3).join("/"); (byPrefix[p] ??= []).push(x); }
const lines = ["# Write-Route Parameter And Behaviour Evidence", ""];
lines.push("Write-named routes from the management-center client, with candidate request-field keys extracted from the client call sites and the observed sweep result. `live` = executed; `skipped` = not executed.", "");
lines.push(`Total write-named routes: ${writes.length}`, "");
lines.push("## Findings", "");
lines.push("| Finding | Evidence |");
lines.push("| --- | --- |");
lines.push("| Self-proxy batch delete field is `device_ids` | `{device_ids:[id]}` -> `code:200 ok`; `deviceid`/`deviceId` -> `code:401 device id is required`. Struct `DeviceBatchRequest`. |");
lines.push("| Self-proxy create is a silent no-op on the server | `createDeviceUserSelves` returned `code:200 ok` for 6 payload shapes with zero new rows. |");
lines.push("| Credential create is a no-op | `createUserPassword`/`putUserPassword` return `code:200 OK` without creating a record; `postBatchAddUserPassword` needs an unresolved shape (`404`/`4013`). |");
lines.push("| `account-users/update` is a lenient no-op | `code:200 OK` with no change. |");
lines.push("| Environment update works via `userapi/user/update` | `{browser:[{browserid,name,notes}]}` -> `{code:0, datas:[...]}`. |");
lines.push("| Group rename returns capitalised `Code` | `putnewgroup` with `groupid` -> `{\"Code\":200}`. |");
lines.push("| Department delete takes `{id}` | `{id}` -> `code:200 删除成功`; `{deptId}` -> `code:10017 无权删除`. |");
lines.push("| Role-group delete takes `{ids:[id]}` | `{ids}` -> `code:200 OK`; `{id}` -> `code:500 WHERE conditions required`. |");
lines.push("| Self-proxy create/update uses `proxy` as an array | `updateDeviceProxyUserSelves` with `proxy:[{...}]` -> `data:{proxies,success,failure,repeat}`; `proxy:{...}` returns ok but creates nothing. |");
lines.push("| Dynamic-proxy create/update returns the full row | `updateDeviceDynamicProxies` -> `data.deviceid` + full row; delete with `device_ids`. |");
lines.push("| Environment star/top take `shopid` as an array | `retsetshopisstartag`/`retsetshopistop` with `{shopid:[id],startag|top}`; a bare string returns `500 ... SetShop.shopid of type []string`. |");
lines.push("| `putchangegroup` needs permission | `{shopids:[id],groupid}` on this account returns `code: 403 暂无访问权限`. |");
lines.push("| Delete semantics differ | Environment and self-proxy deletes are **soft** (recycle bin): purge with `putdeleteshopfromrecycle {shopid:[id]}` / `recycleDelDeviceProxyUserSelves {device_ids:[id]}`. Group/tag/role-group/department deletes are hard. |");
lines.push("| Share create shape unresolved | `shareShop` returns `500 empty slice found` for `shopids`/`shopIds`/`shopId` x `accountCompanyId`/`accountCompanyIds` x `userIds` (8 variants); `shareShopList {accountid,page,pageSize,status}` and `shareShopDel {ids}`/`{shopids,accountCompanyId}` work. |");
lines.push("| `env-settings` is a tag key/value store | `update {tag,content}` inserts/updates; `get {tags:[...]}` reads; `tags: []` fails the `gt` validator. |");
lines.push("| SMS setting rejects 0 | `sms-setting/change {RenewSmsNotifyEnabled:0}` -> `500` (Go `required` treats zero as missing); `1` succeeds. |");
lines.push("| Authority grant/revoke verified | `addusershopauthority {userid,shopids}` then `putdeleteauthority {company,companyid,userid,shopids,touserid}`; observe with `browser-list {authoritiesUserid:[id]}` (0->1->0). The shop `authority` field is a level, not the user list. |");
lines.push("| Authority handover verified | `putmoveauthority {company,companyid,userid,shopids,usered:<source>,touserid:[targets]}` moves authority A->B; round-tripped B->A and revoked. |");
lines.push("| Group authority verified | `putusergroupauthority {company,companyid,myuserid,share:[{companyid,userid:[ids],groupid}]}` grants; `putdeletegroupauthority {groupid:[id]}` revokes. Environment placed in a group via `browser.categoryid`. |");
lines.push("| Per-env authority verified | `putusershopauthority {company,companyid,myuserid,share:[{companyid,userid:[ids],shopid,authority:2}]}` grants; revoke with `putdeleteauthority {shopids,touserid}`. |");
lines.push("| RPA read shapes captured | `getRpaGroupList`/`getRpaShopList`/`getRpaShopGroupList` use `code:0`; `findRpaGroup` returns a `rerpaGroup` key; RPA has no client delete route. |");
lines.push("| Some plugin routes omit `code` | `getPluginCrxList`/`myPlugin`/`getPluginCategoryGroupList`/`getPluginCompaniesPersonageList` return `{list,...}` with no `code` field; `findPluginCompanies` uses a `repluginCompanies` key. |");
lines.push("| Retail/admin/message/yun/news read shapes captured | `reretailSettleConfig` / `userInvite` keys; `third-proxy/page`, `message-type/page`, `qrcode-setting/get`, `help/categories|list` all `code:200`. |");
lines.push("| `createPluginGroup` writes with no cleanup path | `POST /v2/plugin/group/createPluginGroup {}` returned `code:200 ok`; `gitPluginGroupList` now reports `count:1` and returns two concatenated JSON objects; no client delete route exists. |");
lines.push("| SSO/cloud read shapes captured | `sso/auth/user/info/get {userId}` returns top-level profile with `bind`; `getCloudBrowserSupport`/`getCloudBrowserProducts` return arrays; `cloud-accounts/page` fails upstream. SSO profile writes left unexercised (no param mapping). |");
lines.push("| Custom-platform CRUD verified | `putuserselfuri {company,companyid,userid,self:[{login_url}]}` -> `putdeleteuserselfuri {company,companyid,userid,platformid:[id]}`; list via `getalluserselfuri`. |");
lines.push("| Env rename/notes keys | `retsetshopName {shopid:[id],accountName}` renames; wrong keys (`shopname`/`newName`) silently set the name to empty. `putaddnotes {shopid:[id],notes}`. |");
lines.push("| `putaddlabel` shape is `{info:[{shopid,label:[{id}]}]}` | Correct client shape; still no label visible via `browser-list` (`label` null, `labelids` filter empty) - effect unconfirmed. |");
lines.push("| Plugin writes mapped, not executed | `install {pluginId,IsTeam,pluginType}`, `updateTeamVisibility {pluginId}`, `updateGlobalVisibility {pluginCompanyId}`, `addPluginGroup {groupId,pluginCompanyId}`, `bindGrouopPlugin {groupId:[id],accountIds,kernel}`; no client delete route, so not run. |");
lines.push("| Batch credential import needs an xlsx upload key | `postBatchAddUserPassword {list,kernelVersion,key}`: fake/missing `key` -> `404 资源不存在` / `4013`; the `key` comes from the `postbatchaddxlsx` flow. |");
lines.push("| `plugin/bind` shape | `{accountIds,pluginId,isTeam,pluginCompanyId,accountIdsCompanyId}` (from call sites); not executed. `putaddlabel` is `{info:[{shopid,label:[{id}]}]}`. |");
lines.push("");
for (const prefix of Object.keys(byPrefix).sort()) {
  lines.push(`## ${prefix}`, "");
  lines.push("| Method | Path | Client name | Candidate request keys | Status | Code | msg |");
  lines.push("| --- | --- | --- | --- | --- | ---: | --- |");
  for (const x of byPrefix[prefix].sort((a, b) => a.path.localeCompare(b.path))) {
    const keys = params[x.name]?.keys || [];
    lines.push(`| \`${x.method}\` | \`${x.path}\` | ${x.name} | ${keys.length ? keys.map((k) => `\`${k}\``).join(", ") : "-"} | ${x.status}${x.reason ? ` (${x.reason})` : ""} | ${x.code ?? ""} | ${String(x.msg ?? x.error ?? "").replace(/\|/g, "\\|").slice(0, 50)} |`);
  }
  lines.push("");
}
await writeFile(path.join(dir, "WRITE_ROUTE_PARAMS.md"), lines.join("\n"), "utf8");
console.log(`Wrote WRITE_ROUTE_PARAMS.md: ${writes.length} write routes`);
