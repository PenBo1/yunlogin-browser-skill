# Client Bundle Drift And Route-Universe Coverage

The route universe in [client-routes.json](client-routes.json) is extracted from the deployed
management-center client. The client renames its hashed bundles on every release, so the recorded
universe can go stale without any check failing. Re-check and re-extract it with:

```powershell
node scripts/dev/check-bundle-drift.mjs            # compare the deployed main bundle with the recorded source
node scripts/dev/check-bundle-drift.mjs --routes   # also re-extract and diff every route
node scripts/dev/extract-client-routes.mjs         # rewrite client-routes.json and client-callsites.json
```

`--strict` turns detected drift into exit code 1. The plain form is informational, because a bundle
change is fixed by re-extraction and a fresh sweep, not by editing a file.

## 2026-10-09: extraction gap corrected

The universe was re-extracted with a committed extractor (`scripts/dev/extract-client-routes.mjs`)
that parses the client's route table (`name:"METHOD,path"`) directly.

- Deployed bundle at final extraction: `main-1791445156113-077a9600-104.js` (same build the universe
  was originally recorded from)
- Recorded universe: 492 routes
- Re-extracted universe: **507** routes
- Delta: **15 added, 0 removed**

Every recorded route is still present, so the re-extraction is a strict superset.

### Cause: the recorded extractor never captured DELETE

| Method | Recorded | Re-extracted |
| --- | ---: | ---: |
| POST | 354 | 356 |
| GET | 125 | 125 |
| PUT | 13 | 13 |
| DELETE | **0** | **13** |

### The 15 routes that were missing from the recorded universe

| Method | Path | Sweep result | Treated as |
| --- | --- | --- | --- |
| DELETE | `/api/v1/users/customplatformedit` | `code: 405` | blocked |
| DELETE | `/api/v1/users/role/curd` | `code: 405` | blocked |
| DELETE | `/v2/plugin/deletePluginCrx` | `code: 200` | blocked |
| DELETE | `/v2/plugin/group/deletePluginGroup` | `code: 30007` | blocked |
| DELETE | `/v2/plugin/uninstall` | `code: 200` | blocked |
| DELETE | `/v2/plugin/uninstallNew` | `code: 200` | blocked |
| DELETE | `/v2/retail/deletePromotionLink` | `code: 7` | blocked |
| DELETE | `/v2/rpa/deleteRpaCarbonConfig` | `code: 200` | blocked |
| DELETE | `/v2/rpa/deleteRpaGroup` | `code: 200` | blocked |
| DELETE | `/v2/rpa/deleteRpaGroupByGroupIds` | `code: 200` | blocked |
| DELETE | `/v2/rpa/deleteRpaPlanManagementByPlanIds` | `code: 200` | blocked |
| DELETE | `/v2/rpa/destroyRpaCarbonConfigByAll` | `code: 50012` | blocked |
| DELETE | `/v2/rpa/destroyRpaCarbonConfigByConfigIds` | `code: 50012` | blocked |
| POST | `/v2/newbrowser/cloud-accounts/getiduserlist` | `code: 200` | readable |
| POST | `/v2/proxy/device/autoRenewCloudBrowser` | `code: 200` | write |

The first pass probed these before they were known to be destructive, so several returned success. None
produced probe residue, and the audit residue check passes clean. They are now on the catastrophic
blocklist in `scripts/lib/route-safety.mjs`, so no future sweep sends a generated body to them.

## Reverted canary observation

Two deployments were seen on the same day. Note (2026-10-12): the `/v2/cost/invoice_user/` family is excluded from the route universe by owner decision and is no longer tracked, whatever the deployed bundle contains. An earlier, newer build
(`main-1791537212809-7c28b52b-104.js`) had removed the invoice family and `getOrderDetailByDetailsNo`
(21 routes) and added a `cloud-accounts` variant; the invoice half of that set is no longer tracked. The deployment later
reverted to `main-1791445156113-077a9600-104.js`, so those 21 routes are present again and were swept
live. Treat the canary as a forward look, not as the current surface. Re-run
`check-bundle-drift.mjs --routes` before publishing any coverage claim.

## 2026-10-09: second rebuild, identical route set

The deployed entry document later moved from `main-1791445156113-077a9600-104.js` to
`main-1791544206643-c2859532-104.js`. Re-running `check-bundle-drift.mjs --routes` against the new build
reports **507 recorded / 507 deployed, 0 added, 0 removed**, so the hash changed but the server-route
surface did not. No re-extraction or re-baseline was needed; only the build name moved.
## Rebuilds are frequent and do not change the route set

Four different main bundles were served on 2026-10-09 - `main-1791445156113`, `main-1791537212809`,
`main-1791544206643`, and `main-1791547320227` in epoch-ms order. Each rebuild changes the hashed
name, so the fast bundle-name comparison reports a change every time even when nothing about the API moved.

All four were diffed with `check-bundle-drift.mjs --routes`: **507 recorded / 507 deployed, 0 added, 0 removed**
each time. The route set is stable while the build hash is not, so a name change alone is informational - only a
route-set change is a real finding. Re-run the route diff after a rebuild before publishing a coverage claim.
## Status

The universe now includes every route the deployed client references, including DELETE verbs, and the
destructive ones are blocklisted rather than probed. The remaining sweep errors are four routes that
time out: `updateProxyShop`, `updateYunShopProxy`, `sso/auth/setInfo`, and `sso/loginGoogle`.

## Unknown `/js/*` Paths Return HTTP 200 HTML (2026-10-10)

The origin serves the single-page-app shell for any `/js/...` path it does not have:

| Path | Response |
| --- | --- |
| a recorded desktop bundle, `/js/createBrowserPrint-1788343711349-293a52c8-104.js` | HTTP 200, **2053 bytes of HTML** |
| a made-up path, `/js/definitely-not-a-real-bundle-1234567890.js` | HTTP 200, **2053 bytes of HTML** |
| the current management bundle, `/js/main-1791537212809-7c28b52b-104.js` | HTTP 200, 3,047,572 bytes of JavaScript |

Consequences:

- A recorded bundle URL that no longer exists is **indistinguishable from a live one by status code**;
  check the body, because HTML means the chunk is gone.
- `scripts/dev/check-bundle-drift.mjs` now skips an HTML response during `--routes` extraction. Without that
  guard it would parse zero routes from the shell and report every recorded route as removed.
- The `Source:` URLs in [../api/INDEX.md](../api/INDEX.md) are from the `1788343711349` build and now return
  that shell, so they can no longer be used to re-verify the `userapi` documents.

## 2026-10-10: The Deployed Build Is Older Than The Recorded One

`node scripts/dev/check-bundle-drift.mjs --routes` reports the deployed client missing 21 of the 507
recorded routes, with none added:

| | Bundle | Routes |
| --- | --- | ---: |
| recorded by `client-routes.json` | `main-1791544206643-c2859532-104.js` | 507 |
| deployed right now | `main-1791537212809-7c28b52b-104.js` | 486 |

The recorded build's timestamp is **larger**, so the origin is currently serving an *older* client than
the one the universe was extracted from. That is a rolling/canary deployment state, not a client
regression and not a missing handler.

The `/v2/cost/invoice_user/` family is excluded from the route universe by owner decision (2026-10-12) and is not tracked regardless of what the server or the deployed bundle serves. The one non-invoice neighbour that build had removed, `getOrderDetailByDetailsNo`, is still tracked normally.

`node scripts/dev/extract-client-routes.mjs` once a build that contains the invoice routes is deployed, and
the diff should return to zero added / zero removed.
