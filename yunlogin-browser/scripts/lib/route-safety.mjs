/**
 * Shared route-safety rules.
 *
 * Every probe in this repository must agree on what counts as a read. The earlier value-domain probe
 * replayed write routes because it had its own definition, and `role-group/create` left an
 * empty-name row behind on every run. Keeping one classifier prevents that class of bug: import
 * `isReadOnlyRoute` instead of writing a new regex.
 */

// A strict write check runs FIRST so a write route can never be probed just because its name happens
// to contain a read-ish word ("changeUserinfo" contains "info", "configsettings" contains "config").
export const WRITE_VERB = /(create|update|edit|change|delete|del|remove|put|insert|reset|approve|reject|move|logout|login|register|pay|paypal|recharge|redeem|refund|apply|recover|complete|cancel|submit|verify|confirm|regroup|clone|clear|close|stop|start|send|save|import|export|merge|assign|grant|revoke|modify|enable|disable|freeze|unfreeze|kick|invite|join|quit|config|bind|unbind|upload|download)/i;

// Short verbs that appear inside innocent read names ("getbatchAddXlsx", "getOrderManagementNew").
// They only count as writes when no read prefix sits immediately before them.
export const AMBIGUOUS_WRITE = /(add|batch|order|set|top)/i;
export const READ_PREFIX = /(get|list|find|query|search|check|count|my|all|num|fetch)[-_]?(add|batch|order|set|top)/i;

export function looksLikeWrite(haystack) {
  if (WRITE_VERB.test(haystack)) return true;
  return AMBIGUOUS_WRITE.test(haystack) && !READ_PREFIX.test(haystack);
}
export const READ_VERB = /^(get|list|find|info|page|detail|count|summary|options|check|query|search|my|latest|history|logs|record|stat|status|right|role|member|dept|company|invite|version|core|news|notice|meal|proxy|cookie|platform|plugin|url|ads|qrcode|device|num-vis|popup|frozen|recycle)/i;

// Routes that must never be probed with a generated body. Each one either destroys state, spends
// money, writes a row even for an empty body, or sends an SMS.
export const CATASTROPHIC = /(logout|changePwd|modifyMobileEmail|bindPhoneEmail|unbindAuth|forgetPwd|register|sendCode|sendSms|sendsms|getCode|company\/create|company\/change|member\/change|role\/del|paypal|repayrecharge|resetAuthentication|insertAuthentication|user\/delete|putdeleteshop|batchDel|batchdelete|cookie\/clear|dept\/create|role-group\/create|createPluginGroup|generateuuid|migrate\/apply|uninstall|deletePluginCrx|deletePluginGroup|rpa\/deleteRpa|rpa\/destroyRpaCarbonConfig|deleteRpaGroupByGroupIds|deleteRpaPlanManagement|deleteRpaCarbonConfig|deletePromotionLink|customplatformedit|roleRemove|createRpaGroup|updateTag)/i;

export function isCatastrophic(nameOrPath) {
  return CATASTROPHIC.test(String(nameOrPath ?? ""));
}

/**
 * True only when the route is safe to call with a synthetic body.
 * A GET is still refused when its name or path carries a write verb.
 */
// A GET that begins with one of these is a query, even if a later word looks like a write verb
// ("getUserCompanyInviteList" contains "invite"). A GET without the prefix can still write
// ("repayrecharge" spends money), so only the prefix list earns the shortcut.
export const READ_START = /^(get|list|find|query|search|check|count|my|all|num|fetch|page|detail|info|summary|options|latest|history|logs|record|stat|status)/i;

export function isReadOnlyRoute({ method, path: routePath, name = "" }) {
  const leaf = String(routePath ?? "").split("/").filter(Boolean).pop() ?? "";
  if (isCatastrophic(name) || isCatastrophic(routePath)) return false;
  if (String(method).toUpperCase() === "GET" && (READ_START.test(name) || READ_START.test(leaf))) return true;
  if (looksLikeWrite(`${name} ${routePath ?? ""}`)) return false;
  if (String(method).toUpperCase() === "GET") return true;
  // A read-shaped POST may put the verb in the client name or in the last path segment
  // (cloudAccountPopup -> /popup/get).
  return READ_VERB.test(name) || READ_VERB.test(leaf);
}

export function routeSafetyReason({ method, path: routePath, name = "" }) {
  if (isCatastrophic(name) || isCatastrophic(routePath)) return "catastrophic blocklist";
  if (isReadOnlyRoute({ method, path: routePath, name })) return "read";
  return "write route";
}
