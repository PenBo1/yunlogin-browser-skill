# Boundary Evidence

The routes that could not be fully exercised, with the prerequisite each account actually has and the
exact response the server returned. This turns "could not test" into "this specific prerequisite was
missing". Generated from two runs of `scripts/dev/probe-boundary-evidence.mjs`, one per account; the
probe inspects and reports, it never creates the missing prerequisite.

- Reference account: `3b375e3a28ad4c3f94f13b45af683c53` (probe at 2026-10-10T04:26:20.960Z)
- Second account: `fe7f6650419d47adb5dbc68f58793bd4` (probe at 2026-10-10T04:26:22.739Z)
- Origin: `https://d126447d359e70c0.yunlogin.com`

## Per-Question Evidence

| Question | Route | Prerequisite | Reference account | Second account |
| --- | --- | --- | --- | --- |
| credentials | `POST /v2/newbrowser/getUserPasswordList` | at least one credential record | prerequisite absent; code 200 (no credential rows) | prerequisite present; code 200 (5 rows on this page) |
| cloud account | `POST /v2/newbrowser/cloud-accounts/page` | a purchased cloud account | prerequisite present; code 200 (5 cloud rows) | prerequisite present; code 200 (5 cloud rows) |
| orders | `GET /v2/cost/costmanagement/getOrderManagementNew` | an order | prerequisite present; code 200 (1 order rows) | prerequisite present; code 200 (20 order rows) |
| cloud init | `POST /v2/newbrowser/cloud-accounts/free/shop/init` | an order eligible for a free cloud environment | prerequisite absent; code 500 (record not found) | prerequisite absent; code 500 (record not found) |
| order status | `POST /v2/cost/costmanagement/getOrderDetailStatus` | an accepted request shape | prerequisite present; code 4009 | prerequisite present; code 4009 |
| rpa shop | `GET /v2/rpa/getRpaShopList` | at least one RPA shop | prerequisite present; code 0 (20 rows) | prerequisite present; code 0 (20 rows) |
| rpa shop | `GET /v2/rpa/findRpaShop` | an RPA shopId from the list | prerequisite present; code 200 | prerequisite present; code 200 |
| shared-in environment | `POST /v2/newbrowser/sharerCompanyId` | an environment shared in from another company (authorization=1 and share_num>0) | prerequisite absent; - (0 of 3 sampled environments) | prerequisite absent; - (0 of 5 sampled environments) |
| fingerprint ua | `POST /v2/newbrowser/getfingerprinturiua` | permission to read the UA map | prerequisite absent; code 403 | prerequisite absent; code 403 |
| unlabelled enum | `band_width_type` | a client-side label map | prerequisite absent; - (response field only; no label map in the deployed client) | prerequisite absent; - (response field only; no label map in the deployed client) |
| unlabelled enum | `cidr_status` | a client-side label map | prerequisite absent; - (response field only; no label map in the deployed client) | prerequisite absent; - (response field only; no label map in the deployed client) |
| unlabelled enum | `roleType` | a client-side label map | prerequisite absent; - (response field only; no label map in the deployed client) | prerequisite absent; - (response field only; no label map in the deployed client) |
| credentials | `POST /v2/newbrowser/getBindUserPassword` | a user_password_id | not applicable | prerequisite present; code 200 |
| credentials | `GET /v2/plugin/group/accountGroupList` | an accountId owned by this company | not applicable | prerequisite present; code 7 |

## Findings

| Question | Two-account conclusion |
| --- | --- |
| Credentials | The reference account owns no credential rows, so the credential-scoped routes have nothing to read; the second account owns 1000+ and both `getUserPasswordList` and `getBindUserPassword` answered `code: 200`. `accountGroupList` takes an environment `shopid` as its `accountId` (from the client call site). Even environments that already have a bound credential (5 credentials with one bound environment each on the second account) answered `code: 7 record not found`, and a 120-environment scan on the second account returned `code: 7` for every one. Both accounts have zero plugin groups (`gitPluginGroupList` reports `count: 0` for global and user), so the route needs plugin-group records that neither test account has, not a credential binding. |
| Cloud environment init | Both accounts have cloud-account and order rows, but scanning every order detail shows no cloud-browser purchase (the reference account has one 2025 activity-package order, the second account only proxy purchases), and `cloud-accounts/free/shop/init` answers `code: 500 record not found` for each candidate order. The account needs an actual cloud-browser order. |
| Order detail status | Two accounts, real `oid`/`order_no` and every identifier shape still answer `4009`; the deployed client never calls the route, so it is treated as unusable rather than missing a parameter. |
| RPA shop | The route itself is resolved: `getRpaShopList` returns a `shopId` and `findRpaShop` answers `code: 200`. The earlier 404 came from passing an environment `shopid` instead. |
| Shared-in environment | Both accounts returned zero environments with `authorization=1` and `share_num>0`, so `sharerCompanyId` has no input; the condition is reproduced from the client call site. |
| Fingerprint UA | Both accounts answer `code: 403` for every tested shape, including a string `kernel`; it is a permission gate, not a data gate. |
| Unlabelled numeric enums | `band_width_type`, `cidr_status`, and `roleType` appear only in response payloads; no deployed-client label map references them, so no meaning can be derived from the client. |

## How To Reproduce

```powershell
# reference account (default cached session)
node scripts/dev/probe-boundary-evidence.mjs

# second account, no writes to the real cache
$env:YUNLOGIN_SERVER_TOKEN_FILE = "$env:TEMP\yunlogin-second-account.json"
$env:YUNLOGIN_SERVER_REFRESH_SKEW_MS = "0"
node scripts/dev/probe-boundary-evidence.mjs
```

The probe never creates the missing prerequisite, so it is safe to re-run against any account.
