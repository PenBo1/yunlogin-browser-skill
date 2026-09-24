# Plugin List

- Surface: server API
- Endpoint ID: `plugin-list`
- Method: `GET`
- Path: `/v2/plugin/getAddedAndGlobalplugin`
- Tested: 2026-09-24
- Test result: HTTP 200, business `code: 200`, `msg: ok`
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

Returns the browser plugins available to the account: the plugins the account added plus the global plugin catalogue. Each entry carries the plugin identity, version, permissions, and install state used by the environment plugin binding.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Query

No query parameters are documented. Send the request without a body.

### Example Request

```powershell
node scripts/yunlogin-server-api.mjs plugin-list --dry-run
node scripts/yunlogin-server-api.mjs plugin-list
```

## Response

### Envelope

| Field | Type | Description |
| --- | --- | --- |
| `code` | number | Business status code. `200` means success. |
| `msg` | string | Business message. Observed value: `ok`. |
| `requestId` | string | Request identifier. |
| `data` | object | Plugin payload. |

### `data` Object

| Field | Type | Description |
| --- | --- | --- |
| `distributionPlugin` | array | Plugins distributed to the account by the team. Empty on the tested account. |
| `globalPlugin` | array | Global plugin catalogue entries. |

### `data.globalPlugin[]` Fields

| Field | Type | Description |
| --- | --- | --- |
| `pluginId` | string | Plugin ID. |
| `uuid` | string | Plugin UUID used when binding a plugin to an environment. |
| `name` | string | Plugin name. |
| `version` | string | Plugin version. |
| `kernel` | number | Target kernel family. |
| `firefoxVersion` | string | Firefox-specific version. |
| `permissions` | array | Declared permissions. |
| `catIds` | string | Category IDs. |
| `installStatus` | number | Install state for the account. |
| `isGlobal` | number | Global visibility flag. |
| `isTeam` | number | Team visibility flag. |
| `pluginType` | number | Plugin type. |
| `accountIds` | array | Bound environment IDs. |
| `companyId` | string | Owning company ID. |
| `userId` | string | Owning user ID. |
| `brief` | string | Short description. |
| `detail` | string | Detail payload. |
| `icon` | string | Icon URL. |
| `card` | string | Card image URL. |
| `installNum` | number | Install count. |
| `lookNum` | number | View count. |

### Example Response

```json
{
  "code": 200,
  "msg": "ok",
  "requestId": "<request id>",
  "data": {
    "distributionPlugin": [],
    "globalPlugin": [
      {
        "pluginId": "<plugin id>",
        "uuid": "<plugin uuid>",
        "name": "<plugin name>",
        "version": "<version>",
        "kernel": 1,
        "installStatus": 1,
        "permissions": ["<permission>"]
      }
    ]
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

Binding a plugin to an environment is a separate mutation. Read `references/api/envBindGroupPlugin.md` for the local binding route.
