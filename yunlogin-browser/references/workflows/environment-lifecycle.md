# Environment Lifecycle

This guide covers listing, creating, tagging, grouping, cleaning, and deleting YunLogin environments, plus capturing the local API token from a temporary environment.

## Transport Preference

Creation and deletion prefer the server API and fall back to the local API. Listing does the same for environments.

| Step | Preferred transport | Route | Fallback |
| --- | --- | --- | --- |
| Create environment | server | `POST /v2/newbrowser/putalluri` | `POST /api/v2/userapi/user/create` |
| List environments | server | `POST /v2/newbrowser/getconditionshops` | `POST /api/v2/userapi/user/shopseriallist` |
| Clone environment | server | `POST /v2/newbrowser/batchCloneShop` | none |
| Delete environment | server | `POST /v2/newbrowser/putdeleteshop` | `POST /api/v2/userapi/user/delete` |
| List groups | server | `POST /v2/newbrowser/getgroups` | none |
| Create or rename group | server | `POST /v2/newbrowser/putnewgroup` | none |
| Delete group | server | `POST /v2/newbrowser/deletegroups` | none |
| List tags | server | `GET /v2/proxy/device/findTags` | none |
| Create or rename tag | server | `POST /v2/proxy/device/updateTag` | none |
| Delete tag | server | `POST /v2/proxy/device/delTag` | none |
| Clear local environment data | local client | `POST /api/v1/client/clean_env` on port 52446 | none |

`--transport auto` (default) tries the server route first. `--transport server` fails instead of falling back. `--transport local` skips the server attempt.

## Commands

```powershell
node scripts/yunlogin-env.mjs list --name <optional name filter>
node scripts/yunlogin-env.mjs create --name <environment name> --dry-run
node scripts/yunlogin-env.mjs create --name <environment name> --group <group> --label <tag> --notes "<remark>" --confirm-attributes
node scripts/yunlogin-env.mjs delete --account-id <account id> --confirm-delete
node scripts/yunlogin-env.mjs group-list
node scripts/yunlogin-env.mjs group-create --name <group name>
node scripts/yunlogin-env.mjs group-delete --group-id <group id> --confirm-delete
node scripts/yunlogin-env.mjs tag-list
node scripts/yunlogin-env.mjs tag-create --name <tag name> --color 8
node scripts/yunlogin-env.mjs tag-delete --label-id <tag id> --confirm-delete
node scripts/yunlogin-env.mjs clean-env --account-id <account id> --confirm-clean
node scripts/yunlogin-env.mjs bootstrap-token --create-if-missing
```

## Environment Name Rules

`create` normalizes every environment name before it reaches the API, so names stay readable and safe in the API, the file system, and log output:

| Input | Result |
| --- | --- |
| A Chinese environment name with surrounding spaces | Spaces trimmed, characters preserved |
| `"My Env // 01"` | `My-Env-01` |
| `"a  b___c"` | `a-b-c` |
| `"***"` | rejected: no usable characters |
| 40-character name | truncated to 32 characters |

Rules: control characters become spaces, unsupported characters become a dash, runs of spaces, underscores, and dashes collapse to a single dash, leading and trailing dashes and dots are removed, and the result is capped at 32 characters. Keep names short and readable, and put detail in the remark. Letters and digits from any script are preserved, so Chinese, Japanese, and Korean names survive unchanged. Group and tag names use the same rules.

## Proxy Configuration

`create` builds the environment from the server template, but that template's proxy block is an empty skeleton. Submitting it verbatim produces an environment the management center lists as **proxy deleted**, even though the create call returned `code: 200`.

The helper now sends the direct-connection template, so a new environment runs without a proxy and reports `device_type: local`:

```json
{
  "dns": { "mode": false, "inside": true },
  "deviceType": "local",
  "inlie": "local",
  "region": "random-random-random",
  "ipChannel": "ipinfo",
  "randEnv": false,
  "proxyaddrArr": null
}
```

Confirm the result with `browser-list`:

| Symptom | Meaning |
| --- | --- |
| `device_type`, `inlie`, `region`, and `ipChannel` are empty strings | The proxy block was stored blank; the list shows "proxy deleted". |
| `device_type: local`, `inlie: local`, `region: random-random-random`, `ipChannel: ipinfo` | Healthy direct connection. |
| `proxyip` empty right after creation | Normal for the first seconds; the server detects the egress IP asynchronously. |

To attach a stored proxy later, resolve it with `proxy-self-list` or `proxy-cloud-list` and set `type` and `uuid` in the proxy block. Pass a complete `browser` object with `--template-file` when you need a proxy binding the helper does not build itself.

### Repairing An Environment With A Blank Proxy

An environment created before this fix still carries the blank proxy block. Repair it instead of deleting it, using the local update route:

1. Resolve the environment ID with `browser-list`.
2. Send a local update that sets the proxy to the direct type. Write the body to a file so the environment name survives the shell.

```json
{
  "browser": [
    {
      "browserid": "<account id>",
      "name": "<environment name>",
      "notes": "",
      "proxy": { "type": "local", "ipChannel": "ipinfo" }
    }
  ]
}
```

```powershell
node scripts/yunlogin-api.mjs local POST /api/v2/userapi/user/update --body-file repair.json
```

3. Re-read the environment and confirm the repair:

| Field | Expected after repair |
| --- | --- |
| `device_type` | `local` |
| `proxy.inlie` | `local` |
| `proxy.ipChannel` | `ipinfo` |
| `proxyip` | The detected egress IP |

The route returns `code: 0` per updated entry. Verified on a live environment: `device_type` and `inlie` moved from empty strings to `local`, `ipChannel` became `ipinfo`, and the server filled `proxyip` with the detected egress IP. The `region` field stays empty for a direct connection on this route; that is expected.


## Notes, Tags, And Groups

An environment template carries three presentation attributes:

| Attribute | Template field | Resolved from |
| --- | --- | --- |
| Remark | `browser.notes` | `--notes` |
| Group | `browser.categoryid` | group ID from `putnewgroup` or `getgroups` |
| Tags | `browser.labelid` | tag IDs from `findTags` |

Ask the user first. Create is the step where a bare environment is easiest to
produce by accident, so `create` with no attribute flag stops before it sends
anything, exits with code 2, and prints the real choices:

```text
$ node scripts/yunlogin-env.mjs create --name demo
{
  "command": "create",
  "needsAttributes": true,
  "name": "demo",
  "availableGroups": ["<group name>", "<group name>"],
  "availableTags": ["<tag name>", "<tag name>"],
  "message": "Ask the user which group, remark, and tags to apply, then re-run with --group, --notes, and --label plus --confirm-attributes. Pass --accept-defaults to create in the default group with no remark and no tags."
}
```

Ask with those names, then re-run with the answer. `--accept-defaults` is the
only way to create in the default group with nothing else attached, and it means
the user chose that on purpose.

After the attributes are chosen, the helper still refuses to send them until `--confirm-attributes` is passed:

```text
$ node scripts/yunlogin-env.mjs create --name demo --group Sales --label prod --notes "handover"
{
  "command": "create",
  "needsConfirmation": true,
  "requested": { "name": "demo", "notes": "handover", "labels": ["prod"], "group": "Sales" },
  "message": "Ask the user to confirm, then re-run with the documented confirmation flag."
}
```

Pass `--create-missing` to create a group or tag that does not exist yet. Without it, an unknown group or tag is an error so a typo cannot silently create new data.

The group list returns the group ID as `gropid`, and group creation returns the same value as `categoryid`. Tags carry their ID as `labelid`.

### Where Each Transport Puts The Attributes

The two create routes do not use the same fields:

| Attribute | Server route `putalluri` | Local route `user/create` |
| --- | --- | --- |
| Remark | `browser.notes` | `browser[].notes` |
| Group | `browser.categoryid` | `browser[].accounts.groupid` |
| Tags | `browser.labelid` | No field. Tags cannot be set through this route. |

The local route accepts a top-level `groupid` without complaining and then stores
the environment in the default group, so the helper sends the group inside
`accounts` instead. When a create falls back to the local route and tags were
requested, the result carries `skippedAttributes` naming the tags and the reason,
and `appliedAttributes` leaves the tags out rather than reporting them as done.
Create with `--transport server` when tags matter.

### Remarks

The remark is a field on the environment, not a resource of its own, so it has no
create or delete route.

| Operation | Route | Behaviour |
| --- | --- | --- |
| Read | `POST /v2/newbrowser/getconditionshops` (`notes`) or `getfingerprinturi` (`browseinfo.notes`) | Returns the stored remark. |
| Set on create | `putalluri` or the local `user/create` | Stored and read back. |
| Change to a new value | local `POST /api/v2/userapi/user/update` with `browser[].notes` | Applied. This route patches only the fields it receives, so the fingerprint, proxy, and account bindings are preserved. |
| Clear to empty | none | Not supported non-destructively. |

Clearing needs its own explanation, because both routes fail in a way that is
easy to misread as success:

- The local update route ignores an empty value. `notes: ""`, `notes: null`, and
  an omitted `notes` all return `code: 0` and leave the previous remark in place.
  A single space is applied, which is the only non-destructive way to make the
  remark look empty.
- The server route does store an empty remark, but it replaces the whole
  configuration with the body you send. A body that carries only the name, the
  id, and the remark was accepted with `code: 200` and then reported
  `kernelId: 0` with an empty proxy block on the next read.

Choose deliberately:

| Goal | Do this |
| --- | --- |
| A different remark | Local `user/update` with `browser[].notes`, or re-run `create` for a new environment. |
| A visually blank remark | Local `user/update` with `browser[].notes` set to a single space. |
| A genuinely empty remark | Use the server `putalluri` with the complete configuration, and accept that the fingerprint block is rewritten. Deleting the environment also removes the remark. |

## Deletion Requires Confirmation

Every destructive command stops with exit code 2 and a `needsConfirmation` payload unless the matching confirmation flag is present:

| Command | Flag |
| --- | --- |
| `delete` | `--confirm-delete` |
| `group-delete` | `--confirm-delete` |
| `tag-delete` | `--confirm-delete` |
| `clean-env` | `--confirm-clean` |

Show the user the exact environment name, ID, group, or tag before confirming. Deleting a group does not delete the environments inside it, and deleting a tag removes it from every environment that used it.

## Creation Template

`create` builds the `browser` object from documented server routes instead of hardcoding values:

1. `POST /v2/newbrowser/getfingerprinturi` returns the base `browseinfo` template for the requested system and kernel.
2. `POST /v2/newbrowser/getdefaultfingerlist` returns the kernel ID, UA version, screen sizes, CPU and memory presets, and WebGL data.
3. `POST /api/v1/client/gpu_info` on port 52446 returns the local adapters used for `WebGLVendor` and `WebGLRenderer` when the service is available.
4. The helper assembles `{ number, randProxy, batch_platform_id, batch_custom_id, batchProxy, browser }` and posts it to `putalluri`.

Every field of that body has a documented source. A modify uses the same schema with `browser.shopid` set to the target, because `putalluri` is an upsert. Read [environment-inputs.md](./environment-inputs.md) for the input map, both sequences, and the field type rules that apply when a read response is reused.

Pass `--template-file <file.json>` to supply a known-good browser template instead. The file may contain either the full request body or only the `browser` object.

The two creation routes use different fingerprint schemas. The server route takes `browser.fingerprint` with a string `UAversion`. The local route takes `browser[].finger` with an integer `uaVersion` plus `userAgent`, and rejects the server shape with `cannot unmarshal string into Go struct field .browser.finger.UaVersion of type int`. The helper builds the matching schema for each transport.

A successful server create returns the new environment IDs, so the helper uses them directly and only falls back to polling `getconditionshops` when the response omits them.

## Token Bootstrap

`bootstrap-token` captures the local API token without asking the customer to configure anything:

1. List environments through the server API, then the local API.
2. Reuse the first environment, or ask the user and then create a temporary one when `--confirm-create` is passed.
3. Start it headless and read `Authorization` from the bundled extension origin through CDP.
4. Verify the value against a local user API read and store it in the user-level cache.
5. Delete the temporary environment through the server delete route, unless `--keep-environment` is passed.

An environment the helper did not create is never deleted.

```json
{
  "command": "bootstrap-token",
  "environment": { "accountId": "<account id>", "name": "<environment name>" },
  "created": true,
  "capture": { "tokenLength": 234, "verified": true, "verificationCode": 0 },
  "deleted": { "transport": "server", "ok": true, "code": 200 }
}
```

## Authorization And Cleanup

- Creating, deleting, grouping, and tagging are mutations. Require explicit user authorization before running `create`, `delete`, `group-create`, `group-delete`, `tag-create`, `tag-delete`, `clean-env`, or `bootstrap-token --create-if-missing`.
- Confirm the target company, user, environment name, and attributes before creating. A create call with any `browser` object succeeds even when the payload is otherwise incomplete, so a careless probe can create a real environment.
- Always delete temporary environments, groups, and tags after the workflow and verify the removal with a follow-up list.
- Prefer a unique name such as `yunlogin-token-bootstrap-<timestamp>` so temporary data is easy to find and remove.
- The server `shopname` filter matches as a substring, so `--name 140_1` can also match `140_10`. Confirm the exact environment by name and ID before deleting.
- Never print or store the captured token in the skill, logs, or responses.

## Verified Results

| Check | Result |
| --- | --- |
| `POST /v2/newbrowser/putalluri` with a generated template | HTTP 200, `code: 200`, and `shopid` returned |
| Created environment visible through `getconditionshops` | Success; group, tags, and remark all present |
| Server unavailable, `--transport auto` create | Fell back to `POST /api/v2/userapi/user/create` and created the environment |
| Headless start and token capture on a server-created environment | Success; `verified: true`, `code: 0` |
| Headless start and token capture on a locally created environment | Success; `verified: true`, `code: 0` |
| `POST /v2/newbrowser/putdeleteshop` for the created environment | HTTP 200, `code: 200`, `msg: OK`; a follow-up list returned zero matches |
| `create` with `--group --label --notes --confirm-attributes` | Group, tags, and remark written and read back correctly |
| `create` with attributes but without `--confirm-attributes` | Exit code 2 with a `needsConfirmation` payload; nothing created |
| `delete` without `--confirm-delete` | Exit code 2 with a `needsConfirmation` payload |
| `putnewgroup` then `deletegroups` | `code: 200` both ways; the group disappeared from `getgroups` |
| `updateTag` then `delTag` | `code: 200` both ways; the tag disappeared from `findTags` |
| `POST /api/v1/client/clean_env` on port 52446 | `code: 0`, `msg: Success` |
| `bootstrap-token` against an existing environment | Reused the environment and deleted nothing |
| Create with the direct-connection proxy block | `device_type: local`, `inlie: local`, `region: random-random-random`, `ipChannel: ipinfo`, and a detected `proxyip` |
| Create with the empty template proxy block | Proxy fields are stored blank and the list shows "proxy deleted" |
| `bootstrap-token` with no matching environment and no confirmation | Exit code 2 with a `needsConfirmation` payload and the planned name and remark |
| `bootstrap-token --confirm-create` | Created `skill-temp-<kernel>-<MMDD>-<HHmm>`, captured a verified token, deleted it through the server route, and left zero environments behind |
| `bootstrap-token --reuse-only` | Failed with a clear message instead of creating anything |
| Environment helpers with no environment variables set | Used the cached server session for list, group-list, tag-list, delete, and bootstrap-token |
