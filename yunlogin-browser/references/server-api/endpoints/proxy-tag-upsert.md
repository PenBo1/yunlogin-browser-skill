# Proxy Tag Create Or Update

- Surface: server API
- Endpoint ID: `proxy-tag-upsert`
- Method: `POST`
- Path: `/v2/proxy/device/updateTag`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: ok` (create then delete round trip)
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Creates a tag when `labelid` is empty and renames or recolours an existing tag when `labelid` is supplied. This is the route behind the tag picker used when an environment is created.

This is a mutation. Confirm the tag name and colour with the user before sending the request.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `company` | string | No | `""` | Company display name. |
| `companyid` | string | Yes | `""` | Company ID. Can be injected from `YUNLOGIN_SERVER_COMPANY_ID`. |
| `color` | number | No | `1` | Colour index. The panel renders `1-8`; the server stores any integer without validating it. See [tag-colors.md](../tag-colors.md). |
| `label` | string | Yes | `""` | Tag name. |
| `labelid` | string | No | `""` | Existing tag ID. Leave empty to create a new tag. |

### Example Request

```json
{
  "company": "<company name>",
  "companyid": "<companyid>",
  "color": 8,
  "label": "<tag name>",
  "labelid": ""
}
```

### Helper Commands

```powershell
node scripts/yunlogin-env.mjs tag-create --name <tag name> --dry-run
node scripts/yunlogin-env.mjs tag-create --name <tag name>
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `ok`. |
| `msgCode` | number | Secondary status code. |
| `data` | null | Present but null on success. |
| `traceId` | string | Trace identifier. |

The response does not return the new tag ID. Resolve it with `proxy-tag-list` filtered by name.

### Example Response

```json
{
  "code": 200,
  "msgCode": 200,
  "data": null,
  "msg": "ok",
  "traceId": "<trace id>"
}
```

## Colour Palette

Index `1` is pre-selected in the panel and is the value the server stores when the field is left at the zero value.

| Index | Name | Hex |
| ---: | --- | --- |
| 1 | Blue | `#3363FC` |
| 2 | Azure | `#1EA0FF` |
| 3 | Teal | `#11D9C1` |
| 4 | Lime | `#ACD746` |
| 5 | Amber | `#F1BE63` |
| 6 | Orange | `#FF820E` |
| 7 | Red | `#E70404` |
| 8 | Purple | `#B84DFF` |

The server does not validate the value. A round trip of `0, 1, 8, 9, -1, 99` stored `1, 1, 8, 9, -1, 99`; only `0` was normalised. Sending a value outside `1-8` therefore creates a tag the picker cannot render, with no error.

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

- Delete a tag with `proxy-tag-delete`. Deleting a tag removes it from any environment that used it.
- Creating a tag with an empty body returns `code: 200` and stores a tag with no name. Always send a label.
- A duplicate label returns `code: 4020` with a localized already-exists message.
