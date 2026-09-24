# User Meal Settings

- Surface: server API
- Endpoint ID: `user-meal-settings`
- Method: `GET`
- Path: `/v2/cost/costmanagement/get_user_set_meal`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: ok`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the current user meal or plan settings.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | No | Not used |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Query Parameters

No query parameters are documented for this route.


### Helper Commands

```powershell
$env:YUNLOGIN_SERVER_TOKEN = "<current bearer token>"
node scripts/yunlogin-server-api.mjs user-meal-settings --dry-run
node scripts/yunlogin-server-api.mjs user-meal-settings
```

## Response

Observed response shape:

```json
{
  "code": "number",
  "msgCode": "number",
  "data": {
    "created_at": "string",
    "updated_at": "string",
    "original_discount": "number",
    "package_source": "number",
    "gift_environment_number": "number",
    "gift_member_number": "number",
    "gift_end_time": null,
    "start_time": "string",
    "end_time": "string",
    "free_status": "number",
    "environment_number": "number",
    "member_number": "number",
    "effective_day": "number",
    "auto_renew": "number",
    "final_amount": "number",
    "residue_amount": "number",
    "payable_amount": "number",
    "actual_amount": "number",
    "company_id": "string",
    "user_id": "string",
    "user_packages_id": "number",
    "day": "number",
    "restrict": "boolean",
    "expired": "boolean",
    "has_package": "boolean",
    "select_day": "number",
    "normal_environment_number": "number",
    "normal_member_number": "number",
    "purchased_environment_number": "number",
    "purchased_member_number": "number",
    "free_environment_number": "number",
    "free_member_number": "number",
    "total_environment_number": "number",
    "total_member_number": "number"
  },
  "msg": "string",
  "traceId": "string"
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
