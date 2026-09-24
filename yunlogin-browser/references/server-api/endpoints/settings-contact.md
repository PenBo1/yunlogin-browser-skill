# Contact Settings

- Surface: server API
- Endpoint ID: `settings-contact`
- Method: `GET`
- Path: `/v2/news/settings/info`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: OK`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the contact settings document.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | No | Not used |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Query Parameters

| Parameter | Type | Required | Default |
| --- | --- | --- | --- |
| `key` | str | Yes | `"setting.contact"` |

### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs settings-contact --dry-run
node scripts/yunlogin-server-api.mjs settings-contact
```

## Response

Observed response shape:

```json
{
  "reqId": "string",
  "code": "number",
  "msg": "string",
  "data": {
    "id": "number",
    "key": "string",
    "value": {
      "email": "string",
      "mobile": "string",
      "wechat": "string",
      "telegram": "string",
      "ae-mobile": "string",
      "home-right-qq": "string",
      "home-right-mobile": "string",
      "home-right-weixin": "string",
      "land-right-mobile": "string",
      "proxy-custom-phone": "string",
      "home-footer-contact": "string",
      "nav-solution-mobile": "string",
      "recharge-customer-tg": "string",
      "company-support-email": "string",
      "land-help-bottom-email": "string",
      "account-right-top-phone": "string",
      "customer-bubble-contact": "string",
      "land-help-bottom-mobile": "string",
      "recharge-customer-email": "string",
      "land-right-custom-mobile": "string",
      "recharge-customer-weixin": "string",
      "company-introduction-mobile": "string"
    },
    "status": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

## Error Handling

Failures arrive as HTTP 200 with a non-200 business code. Read [ERRORS.md](../ERRORS.md) for the full contract.

| Code | Meaning for this endpoint |
| --- | --- |
| `200` | Success. |
| `1001` | The bearer token was rejected. Run `node scripts/yunlogin-auth.mjs ensure-server`, then ask the user for a fresh token. |
| `400` | The payload was rejected before business validation. Check the field types and required fields above. |
| `500` | The server could not decode the request or find the target. Check field types and confirm the referenced IDs exist. |
| HTTP 401 | No token was supplied. |
| HTTP 404 | The route or HTTP method is not served by this deployment. Do not retry. |

## Notes

Sensitive response fields such as credentials, cookies, proxy credentials, and 2FA secrets are redacted by the helper by default. Use `--show-sensitive` only when explicitly required and the output destination is safe.
