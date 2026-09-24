# Server API Error Contract

The management-center API reports most failures inside the response body while the HTTP status stays `200`. Read the HTTP status and the business `code` separately, and never treat HTTP 200 as proof of success.

## Two Layers

| Layer | Meaning |
| --- | --- |
| HTTP status | Transport result. `200` for a handled request, `401` for a missing token, `404` for a route that the deployment does not serve. |
| Business `code` | Application result. `200` means success; everything else is a failure. |

## Business Codes

| Code | Observed message | Meaning | Example trigger |
| --- | --- | --- | --- |
| `200` | `Success`, `OK`, `ok`, or a localised success text | Success | A well-formed request. |
| `400` | `unknown error` | The payload was rejected before business validation | `POST /v2/newbrowser/putalluri` with an empty body or without a `browser` object. |
| `500` | `json: cannot unmarshal ...` or `empty slice found` | Server-side decoding or lookup failure | A wrong field type in `getconditionshops`, or a `putdeleteshop` call for an unknown environment ID. |
| `1001` | a localized token-error message | The bearer token is wrong, expired, or missing | Any authenticated route with an invalid or absent token. |
| `4020` | a localized already-exists message | The record already exists | Creating a tag whose label or ID collides with an existing tag. |

Codes arrive as numbers. A localised message is not a stable contract; branch on the code, and use the message only for the operator-facing explanation.

## HTTP Status Values

| Status | Body | Meaning |
| --- | --- | --- |
| `200` | JSON with a business code | The request was handled. The code decides success. |
| `401` | `{"code":1001,"msg":"<localized token message>"}` | No bearer token was supplied. |
| `404` | `404 page not found` | The route is not served by this deployment, or the HTTP method is wrong for the route. |

## Request Validation Is Inconsistent

Endpoints do not share one validation model. Measured behaviour:

| Endpoint | Request | Result |
| --- | --- | --- |
| `POST /v2/newbrowser/getconditionshops` | `{}` | `code: 200` and a default page of environments |
| `POST /v2/newbrowser/getconditionshops` | `{"companyid":1,"userid":[],"number":"many"}` | `code: 500` with a Go unmarshal error |
| `POST /v2/newbrowser/putalluri` | `{}` | `code: 400`, `unknown error` |
| `POST /v2/proxy/device/updateTag` | `{}` | `code: 200`, and an empty-name tag is created |
| `POST /v2/proxy/device/delTag` | unknown `labelid` | `code: 200`; deleting a missing tag is idempotent |
| `POST /v2/newbrowser/putnewgroup` | `{}` | `code: 200` |
| `POST /v2/newbrowser/deletegroups` | unknown `groupid` | `code: 200`, `OK`; deleting a missing group is idempotent |
| `POST /v2/newbrowser/putdeleteshop` | unknown `shopid` | `code: 500`, `empty slice found` |
| `POST /v2/newbrowser/getsettings` | malformed JSON | `code: 200`; the route ignores the body |

Two consequences matter in practice:

1. **Probing a create route can create real data.** `updateTag` with an empty body returned `200` and created a tag with no name. Never send a probe payload to a route that writes records; use `--dry-run` instead.
2. **Accepting a request is not the same as understanding it.** Several routes ignore unknown fields and defaults, so a typo in a field name can silently produce a record with default values.

## Handling Failures

| Situation | Action |
| --- | --- |
| `code: 200` | Read the payload. |
| `code: 1001` | Stop, run `node scripts/yunlogin-auth.mjs ensure-server`, and tell the user a fresh server token is required. Do not retry with the same token. |
| `code: 400` | Fix the request body. For `putalluri`, confirm a `browser` object is present. |
| `code: 500` | Treat it as a rejected or unhandled request. Check field types against the endpoint document and verify the target ID exists. |
| `code: 4020` | The record already exists. Re-read the resource instead of creating it again. |
| HTTP 404 | Do not retry. The route or method is wrong for this deployment; check `endpoints.json` and the endpoint document. |

## Helper Behaviour

`scripts/yunlogin-server-api.mjs` exits non-zero when the HTTP request fails or the business code is not listed in `business_success_codes`. It redacts sensitive response fields before printing, and `--dry-run` validates the request without sending it. Prefer `--dry-run` first for any route that writes data.
