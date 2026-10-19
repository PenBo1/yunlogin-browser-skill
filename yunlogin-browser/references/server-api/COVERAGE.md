# Server API Research Coverage And Limits

This is the summary page for the management-center API research. Every count is read from the
artifact that owns it, so the numbers cannot drift away from the evidence. The prose states what was
exercised, how deep each level goes, and what was deliberately not executed and why.

- Origin: `https://d126447d359e70c0.yunlogin.com`
- Account: the test company supplied with the task
- Route universe: **489** client routes extracted from the management-center bundle
- Curated catalog: 54 endpoints
- The universe comes from one recorded client build; the deployed bundle is re-checked with `node scripts/dev/check-bundle-drift.mjs`. See [BUNDLE_DRIFT.md](BUNDLE_DRIFT.md).
- This universe covers the management-center API only. The origin also serves the `userapi` surface (`/v2/userapi/...`, success code `0`), which comes from a different bundle set and is tracked separately in [USERAPI_SURFACE.md](USERAPI_SURFACE.md) - it is **not** part of the 507.

## Depth Ladder

Every level below is machine-checked by `node scripts/dev/run-api-audit.mjs`.

| Level | Coverage | Artifact |
| --- | --- | --- |
| Availability sweep | 426 live / 48 skipped / 11 dead paths / 4 transport errors | [ROUTE_CATALOG.md](ROUTE_CATALOG.md), [route-sweep.json](route-sweep.json) |
| Dead paths | **11** routes answer the SPA shell or HTTP 405, so the client string no longer maps to a handler | [ERRORS.md](ERRORS.md) |
| Response field paths | 363 routes, **5269** field rows, 100% described | [ROUTE_FIELDS.md](ROUTE_FIELDS.md) |
| Field meanings | 1224 curated field rows, all described | [FIELD_INVENTORY.md](FIELD_INVENTORY.md) |
| Enum value domains | **811** enum-like fields across 187 routes | [FIELD_VALUES.md](FIELD_VALUES.md) |
| Code meanings | 4 routes / 8 code fields / **31** code -> label pairs | [CODE_LEGENDS.md](CODE_LEGENDS.md) |
| Business families | **18** families with fields, values, and traps | [DOMAIN_INDEX.md](DOMAIN_INDEX.md) |
| Request contract | 54 endpoints' required fields + 116 measured parameter cases | [REQUEST_PARAMS.md](REQUEST_PARAMS.md), [PARAMETER_MATRIX.md](PARAMETER_MATRIX.md) |
| Write persistence | **7** round trips, 7 persisted, 7 restored | [WRITE_EFFECTIVENESS.md](WRITE_EFFECTIVENESS.md) |
| Delete semantics | **6** resources classified hard / soft-tombstone / soft-recycle | [DELETE_SEMANTICS.md](DELETE_SEMANTICS.md) |
| Re-probed with resolved inputs | **100** routes re-read with real ids after the generic sweep | [DRIFT.md](DRIFT.md), [route-sweep.json](route-sweep.json) |
| Supplemental second-account field inventory | **81** routes / **2233** field paths observed on a data-rich account | [FIELD_INVENTORY_ACCOUNT_B.md](FIELD_INVENTORY_ACCOUNT_B.md) |

## What Was Not Executed, And Why

Of the 489 routes, 426 answered as JSON APIs. The remainder splits three ways: 11 dead paths that were probed but have no handler, 48 routes withheld by the classifier, and 4 transport errors.

| Category | Count | Reason |
| --- | ---: | --- |
| Dead paths | 11 | Probed, but the server answered the single-page-app shell (the path has no handler) or HTTP 405 (the client's method is not allowed). The client string is stale, not the request. See [ERRORS.md](ERRORS.md). |
| Catastrophic blocklist | 48 | Ends the session, changes credentials or identity, sends an SMS, creates an account or company, spends money, writes a row for an empty body, or bulk-deletes resources |
| Transport errors | 4 | These routes fail inside an upstream dependency, not in the client. See [ERRORS.md](ERRORS.md). |
| Write routes withheld by the classifier | 0 | The live sweep runs with writes included, so this is 0 unless a later run drops --include-writes |

Inside the blocklist, each route is parked for a specific reason:

| Reason | Count | For example |
| --- | ---: | --- |
| Bulk destructive delete | 14 | `POST /api/v1/users/customplatformedit`, `DELETE /api/v1/users/customplatformedit`, `DELETE /api/v1/users/role/curd`, `DELETE /v2/plugin/deletePluginCrx` and 10 more |
| Creates an account or company | 6 | `POST /api/v1/users`, `POST /api/v1/users/upnewuserpwd`, `POST /api/v2/users/register`, `POST /v2/sso/register` and 2 more |
| Deletes or rewrites shared data | 6 | `POST /api/v1/users/account/batchdelete`, `POST /v2/newbrowser/putdeleteshop`, `POST /v2/newbrowser/putdeleteshopfromrecycle`, `POST /v2/proxy/device/batchdelete` and 2 more |
| Identity or credentials | 5 | `POST /v2/sso/auth/bind`, `POST /v2/sso/auth/changePwd`, `POST /v2/sso/auth/modifyMobileEmail`, `POST /v2/sso/auth/ubind` and 1 more |
| Writes a row for an empty or generated body | 5 | `POST /v2/newbrowser/migrate/apply`, `POST /v2/newbrowser/migrate/generateuuid`, `POST /v2/plugin/group/createPluginGroup`, `POST /v2/team/dept/create` and 1 more |
| Sends an SMS or email code | 4 | `GET /api/v1/users/sendsms`, `POST /api/v2/users/sendCode`, `POST /v2/sso/sendCode`, `POST /v2/team/invite/getCode` |
| Real-name authentication | 3 | `POST /v2/team/authentication/insertAuthentication`, `POST /v2/team/authentication/insertAuthenticationCompanyFourElementsVerification`, `POST /v2/team/authentication/resetAuthentication` |
| Spends money | 2 | `GET /v2/cost/device/paypal`, `GET /v2/cost/device/repayrecharge` |
| Withheld by the classifier | 2 | `POST /v2/proxy/device/updateTag`, `POST /v2/rpa/createRpaGroup` |
| Ends the session | 1 | `POST /v2/team/logout` |

Paid routes (`cost/device/create_order`, `cost/device/create_renew`, `cost/device/createNewbieDeviceOrder`,
`cost/device/batch_create_order`, `cost/costmanagement/set_meal_pay`, `renew_meal_pay`,
`cost/device/pay_scan`) have their request keys read from the client bundle and recorded in
[PARAMETER_MATRIX.md](PARAMETER_MATRIX.md); they were never called.

## Known Unknowns

Three classes of question remain open, each with the reason recorded. The second account narrowed two of them and the findings are folded in below.

The per-account prerequisite for each of these, and the exact response the server returned, is in [BOUNDARY_EVIDENCE.md](BOUNDARY_EVIDENCE.md).

1. **Numeric codes with no label in the client.** `band_width_type`, `cidr_status`, and `roleType`
   have observed values but no confirmed meaning, and the three names do not occur in any of the 321
   deployed bundles, so the client never reads them. Re-checked
   2026-10-10, several fields that used to be listed here are resolved: `devType` and `PlatformType`
   have full constant maps, `pluginType` is the plugin category, `templateType` groups menu
   templates, `installStatus` is a truthy installed flag, `free_status` belongs to the purchase
   origin-order object, `isp_type`/`net_type` are request fields of the purchase cart rather than
   response enums, and `getorderinfo` supplies the `order_status`, `order_type`, and `pay_type` label
   maps while `getRegionSupportV2` labels `proxyType`. See [ENUM_MEANINGS.md](ENUM_MEANINGS.md).
2. **Cloud and QR routes.** Re-checked 2026-10-10: `cloud-accounts/open/token/get` answers
   `code: 200` with `data.token`, `cloud-accounts/client-num/get` answers `code: 200` with
   `data.clientNum` and `data.keepalive`, and `sso/mp/qrCode` answers `code: 200` with `data.ticket`,
   `data.expire_seconds`, `data.url`, and `data.scene`. The earlier upstream-error note no longer
   holds. `cloud-accounts/free/shop/init` is still blocked: its decoder is
   `dto.CloudBrowserOrderReq`, and an empty body answers `code: 500 record not found`, so it needs an
   existing order and was not exercised. The second account then confirmed the shape of
   `cloud-accounts/finger/get` (127 field paths) and pinned its failure mode: whenever the target
   shop has zero cloud accounts, the handler panics with `index out of range [0] with length 0`
   instead of returning an empty result. See [CROSS_ACCOUNT_VERIFICATION.md](CROSS_ACCOUNT_VERIFICATION.md).
3. **Order-detail status.** `cost/costmanagement/getOrderDetailStatus` decodes
   `OrderDetailRequest{ oid string, oids []string }`. A real order `oid` and its `order_no`, both read
   from `getOrderManagementNew`, still answer `4009`, and the call site `getOrderDetailStatus(` does
   not occur in any of the 321 deployed bundles, so the client never calls it either. Neither the
   request nor the response can be confirmed from a source that exists. The second account re-checked
   it with real orders, order ids, and array forms of every identifier, and every shape still answers
   `4009`; with two accounts and no client call site, the route is treated as unusable rather than
   merely undocumented.

## How To Reproduce


```powershell
node scripts/yunlogin-doctor.mjs --audit              # the full audit chain, live
node scripts/yunlogin-doctor.mjs --audit --skip-heavy # documentation plus residue only
node scripts/dev/render-route-catalog.mjs             # after a sweep
node scripts/dev/reprobe-resolved-routes.mjs          # refresh the parameterized routes
node scripts/dev/render-coverage.mjs                  # refresh this page
```

Every gate is proven to block: `node scripts/dev/verify-audit-gates.mjs` injects a fault into the
validator, the drift check, the write-persistence check, the write-restore check, the delete
check, and the residue check, asserts a non-zero exit for each, then runs all six clean. The
residue fault is injected in-process, so proving it blocks writes nothing to the account. It
reports eleven checks.

The gate was verified by fault injection: changing one recorded business code in
`route-baseline.json` makes the audit exit 1 with `FAIL route drift and parameterized replay`, and
restoring the baseline returns it to 0.

The audit fails when documentation drifts, when a parameterized route stops matching its baseline,
when a write stops persisting or restoring, when a delete stops behaving, or when any probe resource
is still on the account.

## Residue And Safety


The probes create only throwaway resources, and every case cleans up after itself. The audit's residue
check scans **13** resource types (environments and their recycle list, proxy tags, environment groups, custom platforms, credentials, self proxies, role groups, dynamic proxies, departments, RPA groups, plugin groups, promotion links) and fails if
a `codex-` row, an empty-name role group, or another probe artefact remains. Every row also has to
prove it actually read a collection: an envelope whose list is missing and whose `count`/`total`
is not numeric is recorded as unscanned, and the stage fails on that instead of reporting a clean
zero. That rule is what caught the plugin-group and invoice-title rows that used to pass vacuously.
