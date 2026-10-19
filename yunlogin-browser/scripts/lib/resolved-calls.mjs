/**
 * Shared list of full-surface routes that need real parameters to answer.
 *
 * sweep-all-routes.mjs probes every route with a generic body, so a route that needs a specific
 * query or body field only ever shows its "missing parameter" shape. This module gathers the ids
 * those routes need (from live reads) and returns the reproducible call list used by both
 * reprobe-resolved-routes.mjs (to refresh route-sweep.json) and detect-route-drift.mjs (to verify
 * the parameterized routes instead of treating them as expected differences).
 */

import { readServerIdentity } from "./local-token-store.mjs";

export function collectFields(payload) {
  const fields = new Set();
  (function walk(v, p, d) {
    if (v === null || typeof v !== "object" || d > 6) return;
    if (Array.isArray(v)) { for (const item of v.slice(0, 50)) walk(item, `${p}[]`, d + 1); return; }
    for (const [k, c] of Object.entries(v)) { fields.add(`${p}.${k}`); walk(c, `${p}.${k}`, d + 1); }
  })(payload, "$", 0);
  return [...fields].slice(0, 300);
}

export async function buildResolvedCalls({ origin, token }) {
  const aHdr = { authorization: `Bearer ${token}`, accept: "application/json", "content-type": "application/json" };
  const read = async (method, routePath, body) => {
    const res = await fetch(origin + routePath, { method, headers: aHdr, body: body === undefined ? undefined : JSON.stringify(body) });
    try { return await res.json(); } catch { return {}; }
  };

  // myUserinfo does not carry companyId and curCompanyInfo is not always populated, so take the
  // identity from the cached session - the same source the helpers use.
  const identity = await readServerIdentity();
  const me = await read("POST", "/v2/sso/auth/myUserinfo", {});
  const companyInfo = await read("POST", "/v2/team/curCompanyInfo", {});
  const companyId = identity.companyId ?? me?.data?.companyId ?? companyInfo?.data?.companyId ?? "";
  const userId = identity.userId ?? me?.data?.userId ?? "";

  const notices = await read("POST", "/v2/message/user-notice/my", { companyid: companyId, userid: userId });
  const noticeId = (notices?.data?.list ?? notices?.list ?? [])[0]?.id ?? 0;

  const orderResp = await read("GET", "/v2/cost/costmanagement/getOrderManagementNew?pageIndex=1&pageSize=200");
  // Pick an order whose detail actually fetches. The list is newest-first, and a freshly created order
  // answers code 70004 (order fetch failed) until it settles, so "has details" is not enough - it has to
  const orderRows = (orderResp?.data?.data ?? []).filter((row) => (row.order_detail_all ?? []).length > 0);
  let orderRow = {};
  for (const row of orderRows) {
    const probe = await read("GET", `/v2/cost/costmanagement/getOrderDetailNew?order_no=${encodeURIComponent(row.order_no)}`);
    if (probe?.code === 200) { orderRow = row; break; }
  }
  if (!orderRow.order_no) orderRow = orderRows[0] ?? (orderResp?.data?.data ?? [])[0] ?? {};
  const orderNo = orderRow.order_no ?? "";
  const orderOid = orderRow.oid ?? "";
  const detailsNo = (orderRow.order_detail_all ?? [])[0]?.details_no ?? "";


  const membersResp = await read("POST", "/v2/team/getMembers", { pageSize: 50, pageIndex: 1, deptId: "", true_name: "", leave: 3, name: "", username: "", contact: "" });
  const memberIds = (membersResp?.data?.list ?? []).map((m) => m.userId);
  const rolesResp = await read("POST", "/v2/team/roles", {});
  const roleId = String((rolesResp?.data?.list ?? [])[0]?.id ?? rolesResp?.data?.list?.[0]?.roleId ?? "");
  const proxyResp = await read("GET", "/v2/proxy/device/findDeviceProxyUserSelves?status=1&page=1&per_page=1");
  const proxyDeviceId = proxyResp?.data?.data?.[0]?.deviceid ?? "";
  const importKeyRes = await read("POST", "/v2/newbrowser/creatbatchaddxlsxuuid", { import_type: 1 });
  const importKey = importKeyRes?.data?.import_key ?? "";
  const company = identity.company ?? "";
  // Read one real environment so env-scoped routes use a live id instead of a hardcoded one.
  const envsResp = await read("POST", "/v2/newbrowser/getconditionshops", { number: 1, offer: 0, companyid: companyId, userid: userId });
  const shopid = (envsResp?.shop ?? [])[0]?.shopid ?? "";
  const pluginList = await read("GET", "/v2/plugin/myPlugin");
  const pluginId = (pluginList?.list ?? [])[0]?.pluginId ?? "";
  const companyList = await read("POST", "/v2/team/myCompanies", {});
  const companyIds = (companyList?.data ?? []).map((row) => row.companyId).filter(Boolean);
  const groupsResp = await read("POST", "/v2/newbrowser/getgroups", { company, companyid: companyId, userid: userId });
  // The group rows spell the id `gropid` (sic), while the member route wants `groupid`.
  const groupId = (groupsResp?.group ?? [])[0]?.gropid ?? "";

  // findRpaShop wants an RPA shop id from the RPA shop list, NOT an environment shopid. The list is a
  // GET; posting to it answers 404.
  const rpaShopList = await read("GET", "/v2/rpa/getRpaShopList");
  const rpaShopId = (rpaShopList?.list ?? [])[0]?.shopId ?? "";

  // findRpaPlanManagement takes a planId taken from the plan list, not the RPA shop id.
  const rpaPlanList = await read("GET", "/v2/rpa/getRpaPlanManagementList");
  const rpaPlanId = (rpaPlanList?.list ?? [])[0]?.planId ?? "";

  // Second wave: additional read contracts recovered from the deployed client bundle. Each was probed
  // live before being added; the ids below are the ones the routes actually need to answer with data
  // instead of an empty envelope.
  const noticeTypeId = (notices?.data?.list ?? notices?.list ?? [])[0]?.noticeType ?? 0;
  const deptName = "";

  const calls = [
    { key: "GET /v2/plugin/getPluginCrxLike", query: { pluginId } },
    { key: "POST /v2/team/company/ids", body: { ids: companyIds } },
    { key: "POST /v2/newbrowser/getCookie", body: { shopid } },
    { key: "POST /v2/newbrowser/getLatestOpenAccountIdList", body: { num: 5 } },
    { key: "POST /v2/newbrowser/getallfonts", body: { system: "Windows 10" } },
    { key: "POST /v2/plugin/group/accountGroupList", body: { accountId: shopid } },
    { key: "GET /v2/cost/costmanagement/user_coupons_list", query: { type: 1, page: 1, per_page: 10 } },
    { key: "POST /v2/team/version/getCore", body: { appId: "1", versionCode: "141", bitness: 64 } },
    { key: "POST /v2/team/env-settings/get", body: { tags: ["codex-probe"] } },
    // Reads that only answer with real ids; each stays inside the test account.
    { key: "POST /v2/newbrowser/getconditionshops", body: { number: 5, offer: 0, companyid: companyId, userid: userId } },
    { key: "POST /v2/newbrowser/getgroups", body: { company, companyid: companyId, userid: userId } },
    { key: "POST /v2/newbrowser/getgroupusers", body: { groupid: groupId } },
    { key: "POST /v2/proxy/device/findDevices", body: { device_ids: [proxyDeviceId], trademark: "self" } },
    { key: "GET /v2/retail/getUserCompanyInviteList", query: { pageIndex: 1, pageSize: 20 } },
    { key: "GET /v2/retail/checkPromotionCode", query: { code: "TESTCODE" } },
    { key: "GET /v2/plugin/group/getPluginGroupId", query: { groupId: "1" } },
    { key: "GET /v2/plugin/updateTeamVisibilityJurisdiction", query: { pluginId } },
    { key: "POST /v2/message/user-notice/getNotice", body: { id: noticeId } },
    { key: "GET /v2/cost/costmanagement/getDynamicAgent", query: { vtype_type: "virtual" } },
    { key: "GET /v2/cost/costmanagement/getOrderManagementNew", query: { pageIndex: 1, pageSize: 200 } },
    { key: "GET /v2/cost/costmanagement/getOrderDetailNew", query: { order_no: orderNo } },
    { key: "GET /v2/cost/costmanagement/getOrderDetailByDetailsNo", query: { details_no: detailsNo } },
    { key: "POST /v2/cost/costmanagement/getOrderDetailNewByMultiple", body: { oids: [orderOid], details_nos: [detailsNo] } },
    { key: "GET /v2/cost/device/findorder", query: { order_no: orderNo } },
    { key: "POST /v2/team/member/ids", body: { userIds: memberIds } },
    { key: "POST /v2/team/role/members", body: { id: roleId } },
    { key: "POST /v2/newbrowser/getShopAndAuthList", body: { shopid: [shopid] } },
    { key: "POST /v2/newbrowser/getiduserlist", body: { deviceid: [proxyDeviceId] } },
    { key: "POST /v2/newbrowser/getshopconfigrpa", body: { shopid: [shopid] } },
    { key: "POST /v2/newbrowser/getshopfromproxy", body: { deviceid: proxyDeviceId } },
    { key: "POST /v2/newbrowser/getuserauthshops", body: { userid: userId } },
    { key: "POST /v2/newbrowser/getshopnameandproxylist", body: { shopids: [shopid] } },
    { key: "POST /v2/newbrowser/getshopkernelVersions", body: { shopids: [shopid] } },
    { key: "GET /v2/sso/getNewbieStep", query: { userId } },
    { key: "POST /v2/team/company/info", body: { id: companyId } },
    { key: "POST /v2/team/company/getApprovals", body: { pageSize: 20, pageIndex: 1 } },
    { key: "POST /v2/proxy/device/delDeviceProxyUserSelves", body: { device_ids: ["codex-probe-none"] } },
    { key: "POST /v2/proxy/device/recycleDelDeviceProxyUserSelves", body: { device_ids: ["codex-probe-none"] } },
    { key: "POST /v2/proxy/device/recycleRecoveryDeviceProxyUserSelves", body: { device_ids: ["codex-probe-none"] } },
    { key: "POST /v2/proxy/device/delDeviceDynamicProxies", body: { device_ids: ["codex-probe-none"] } },
    { key: "POST /v2/proxy/device/recycleDelDeviceDynamicProxies", body: { device_ids: ["codex-probe-none"] } },
    { key: "POST /v2/proxy/device/recycleRecoveryDeviceDynamicProxies", body: { device_ids: ["codex-probe-none"] } },
    { key: "POST /v2/newbrowser/getbatchaddxlsxprocess", body: { import_key: importKey } },
    { key: "POST /v2/newbrowser/getbatchaddxlsxlist", body: { key: importKey } },
    // resetname wants singular device_id plus a numeric device_type; a string device_type is a type error.
    { key: "POST /v2/proxy/device/resetname", body: { device_id: "codex-probe-none", name: "codex-probe" } },
    // role/great wants userIds plus a numeric-string RoleId. The id below never exists, so nothing is granted.
    { key: "POST /v2/team/role/great", body: { userIds: ["codex-probe-none"], RoleId: "1" } },
    // transferCompanyId wants a plain string shopid; an unknown id answers 404 without transferring anything.
    { key: "POST /v2/newbrowser/transferCompanyId", body: { shopid: "codex-probe-none" } },
    // --- read contracts derived from the deployed client bundle (all verified live) ---
    { key: "POST /v2/proxy/device/findRandDeviceList", body: { num: 1, trademark: "self", isBind: 0, inspect: 0, ip_place: "" } },
    { key: "POST /v2/newbrowser/getalluri", body: { fatherclass: "" } },
    { key: "GET /v2/newbrowser/getconditionshopscount", query: { companyid: companyId, userid: userId } },
    { key: "GET /v2/cost/costmanagement/quickIndex", query: { companyid: companyId, userid: userId } },
    { key: "GET /v2/cost/costmanagement/getcloudcoinsnumb", query: { company_id: companyId } },
    // team/version/get wants a numeric versionCode and a *string* bitness.
    { key: "POST /v2/team/version/get", body: { appId: "yunlogin", versionCode: 4000307, bitness: "64" } },
    { key: "POST /v2/newbrowser/getautomac", body: {} },
    { key: "POST /v2/newbrowser/getalllanguage", body: {} },
    { key: "POST /v2/sso/getDingCfg", body: {} },
    // device_ids must be an empty array; a populated array changes the predicate to an IN filter.
    { key: "POST /v2/proxy/device/findNotAuthDesignateDevices", body: { device_ids: [], device_id: proxyDeviceId, trademark: "self" } },
    { key: "POST /v2/newbrowser/storage/page", body: { account_id: "", page: 1, pageSize: 10, md5: "", companyId } },
    { key: "GET /v2/rpa/getRpaTaskLogList", query: { status: 0, pageIndex: 1, pageSize: 10 } },
    { key: "GET /v2/cost/costmanagement/getcoupon", query: {} },
    { key: "GET /v2/rpa/getRpaGroupList", query: { pageIndex: 1, pageSize: 500, name: "" } },
    // --- second wave: read contracts verified live (2026-10-10) ---
    { key: "POST /v2/newbrowser/getalluserselfuri", body: { company, companyid: companyId, userid: userId } },
    { key: "POST /v2/newbrowser/getfingerprinturi", body: { shopid, company, companyid: companyId, userid: userId } },
    { key: "POST /v2/newbrowser/getdefaultfingerlist", body: { company, companyid: companyId, kernel: "", kernelVersion: "", system: "", userid: userId } },
    { key: "GET /v2/proxy/device/vcnplist", query: { page: 1, per_page: 10, cloud_type: 0, is_enable: 1, serial: "", device_name: "", publicip: "", isBind: "", ip_place: "", userid: userId, companyid: companyId, status: "" } },
    { key: "GET /v2/proxy/device/findDeviceProxyUserSelves", query: { status: "", trademark: "self", page: 1, per_page: 10, sortorder: "", company, companyid: companyId, userid: userId, isCycle: "" } },
    { key: "GET /v2/proxy/device/findTags", query: { company, companyid: companyId, userid: userId, page: 1, per_page: 10, keyword: "" } },
    { key: "GET /v2/cost/costmanagement/getrechargehistory", query: { uid: userId, type: "" } },
    { key: "POST /v2/team/getDepts", body: { name: deptName } },
    // noticeType and roleId are ints server-side: a string answers code 500 with a json unmarshal error.
    { key: "POST /v2/message/user-notice/my", body: { companyId, userId, status: 0, noticeType: noticeTypeId, page: 1, pageSize: 20 } },
    { key: "POST /v2/team/roles", body: { name: "", pageIndex: 1, pageSize: 20, roleId: 0 } },
    { key: "GET /v2/proxy/device/findDeviceLogs", query: { device_type: "3", page: 1, per_page: 10 } },
    { key: "POST /v2/newbrowser/getshopbriefinfolist", body: { page: 1, pageSize: 20 } },
    // sortorder is an int server-side: a string answers code 500 with a json unmarshal error.
    { key: "POST /v2/newbrowser/getauthshopbriefinfolist", body: { groupid: "", name: "", page: 1, pageSize: 20, sortorder: 0 } },
    { key: "POST /v2/newbrowser/cloud-accounts/getauthshopbriefinfolist", body: { name: "", page: 1, pageSize: 20 } },
    // --- third wave: read contracts verified live (2026-10-10) ---
    // getUserPasswordList: bind and platformLock are ints; strings answer code 500.
    { key: "POST /v2/newbrowser/getUserPasswordList", body: { bind: 0, name: "", page: 1, pageSize: 20, platformLock: 0, platform_id: "", platform_name: "", remark: "", user_name: "" } },
    { key: "POST /v2/newbrowser/shareShopList", body: { created_at: "", page: 1, pageSize: 20, showText: "" } },
    { key: "POST /v2/team/access/approvals", body: { pageIndex: 1, pageSize: 20, status: 0 } },
    { key: "POST /v2/news/show/help/categories", body: { page: 1, pageSize: 20 } },
    // ads-space/ad: appid and adpos are both ints; the client sends appid 3 for the mall list.
    { key: "POST /v2/yun/ads-space/ad", body: { appid: 3, page: 1, pageSize: 100 } },
    { key: "POST /v2/sso/auth/user/info/get", body: { userId } },
    { key: "GET /v2/plugin/group/gitGroupPluginList", query: { groupType: 0, pageIndex: 1, pageSize: 20 } },
    { key: "GET /v2/plugin/getPluginCompaniesPersonageList", query: { group_id: "", name: "", pageIndex: 1, pageSize: 20, pluginTeam: 0 } },
    // headless is an int (0/1): a string or boolean answers code 401 with a ParseInt error.
    { key: "GET /v2/proxy/device/getCloudBrowserProducts", query: { cityCode: "", headless: 0 } },
    { key: "GET /v2/rpa/recycleRpaCarbonConfig", query: { pageIndex: 1, pageSize: 20, rpaName: "" } },
    { key: "POST /v2/proxy/authority/syncNoAutoAuthority", body: { companyId } },
    // --- fourth wave: id-resolved read contracts verified live (2026-10-10) ---
    { key: "GET /v2/plugin/findPluginCrx", query: { pluginId } },
    { key: "GET /v2/plugin/getAddedAndGlobalplugin", query: { shopId: shopid, shopid } },
    // --- fifth wave: RPA shop lookup chain verified live (2026-10-10) ---
    { key: "GET /v2/rpa/getRpaShopList", query: {} },
    // shopId comes from getRpaShopList rows; an environment shopid answers 404 here.
    { key: "GET /v2/rpa/findRpaShop", query: { shopId: rpaShopId } },
    // --- sixth wave: RPA plan chain verified live on the second account (2026-10-10) ---
    { key: "GET /v2/rpa/getRpaPlanManagementList", query: {} },
    // planId comes from the plan list; the route answers 200 even when the list is empty.
    { key: "GET /v2/rpa/findRpaPlanManagement", query: { planId: rpaPlanId } },
    // --- seventh wave: GET routes whose sweep entry used the wrong method or an empty shape (2026-10-10) ---
    { key: "GET /v2/newbrowser/getallurilist", query: {} },
    { key: "GET /v2/proxy/device/vcnpsummary", query: {} },
    { key: "POST /v2/proxy/device/findVcnpList", body: { device_ids: [] } },
    { key: "GET /v2/retail/findRetailUserInviteCode", query: {} },
    { key: "GET /v2/retail/findRetailSettleConfig", query: {} },
    { key: "GET /v2/retail/getPromotionLinkList", query: {} },
    { key: "GET /v2/cost/costmanagement/getrechargecloudcoin", query: {} },
    { key: "GET /v2/cost/costmanagement/getcloudsupport", query: {} },
    { key: "GET /v2/cost/costmanagement/getcloudsupportnew", query: {} },
  ];
  return { calls, context: { companyId, userId } };
}
