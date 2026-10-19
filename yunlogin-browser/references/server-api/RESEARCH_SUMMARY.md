# Server API Research Summary

One page for the whole management-center research effort: what was covered, how each layer was measured,
what was deliberately left unexecuted, and how to reproduce it. Every count is taken from the artifact
that owns it; [COVERAGE.md](COVERAGE.md) is the generated version of this page.

## Scope

- Surface: the management-center server API at `https://d126447d359e70c0.yunlogin.com`.
- Universe: every route the deployed client references, re-extracted from the live bundle by
  `scripts/dev/extract-client-routes.mjs` (507 routes, 13 of them DELETE). The recorded source tracks the
  deployed build, so `check-bundle-drift.mjs` reports no drift.
- Account: the supplied test account. Nothing outside it was touched.

## What Was Covered

| Layer | Result | Artifact |
| --- | --- | --- |
| Availability sweep | 370 live / 86 dead paths / 48 withheld / 3 upstream failures | [ROUTE_CATALOG.md](ROUTE_CATALOG.md) |
| Dead client strings | 86 routes answer a plain-text 404 (the server answers the SPA shell or 405 for the same paths earlier in the session): legacy `/api/v1/users/*`, `/api/v2/users/*`, and `/api/v1/sendemailcode`, plus a few never-implemented `/v2/...` paths | [ERRORS.md](ERRORS.md) |
| Response field paths | 363 routes, 5269 field rows, **100% described** | [ROUTE_FIELDS.md](ROUTE_FIELDS.md) |
| Field meanings | 1224 curated rows | [FIELD_INVENTORY.md](FIELD_INVENTORY.md) |
| Enum value domains | 861 fields across 162 routes | [FIELD_VALUES.md](FIELD_VALUES.md) |
| Enum meanings | request + response meanings | [PARAMETER_MATRIX.md](PARAMETER_MATRIX.md), [ENUM_MEANINGS.md](ENUM_MEANINGS.md) |
| Code meanings | 46 code -> label pairs | [CODE_LEGENDS.md](CODE_LEGENDS.md) |
| Business families | 18 families | [DOMAIN_INDEX.md](DOMAIN_INDEX.md) |
| Request contract | 54 endpoints + 116 measured parameter cases | [REQUEST_PARAMS.md](REQUEST_PARAMS.md) |
| Request field types | 30 fields across 13 routes, from decoder errors | [PARAMETER_MATRIX.md](PARAMETER_MATRIX.md) |
| Write persistence | 7 round trips, all persisted and restored | [WRITE_EFFECTIVENESS.md](WRITE_EFFECTIVENESS.md) |
| Delete semantics | 7 resources classified hard / soft-tombstone / soft-recycle | [DELETE_SEMANTICS.md](DELETE_SEMANTICS.md) |
| Write round trips | environment, department, role group, RPA group, promotion link, sidebar restore | [WRITE_ROUNDTRIPS.md](WRITE_ROUNDTRIPS.md) |
| Re-probe with real ids | 51 routes re-read after the generic sweep | [DRIFT.md](DRIFT.md) |

## How Each Layer Was Measured

- **Universe**: parse the client's own `name:"METHOD,path"` route table, then crawl every imported chunk.
- **Availability**: one generic body per route; a route that needs ids is re-probed with resolved inputs.
- **Field meanings**: a shared dictionary plus name inference; new leaves are added as they appear.
- **Request types**: send one deliberately wrong value per field and read Go's decoder error, which names
  the struct, the field, and the wanted type.
- **Request semantics**: sweep each enum-like parameter across a value range and compare rows/total/bytes.
- **Writes**: create a uniquely named throwaway resource, verify it, delete it, verify it is gone; for
  updates, read the original value back afterwards.
- **Safety**: `scripts/lib/route-safety.mjs` classifies every route; 40 regression fixtures assert the
  classification, and the audit fails if any probe artefact remains.

## What Was Not Executed, And Why

| Reason | Count | Why it is withheld |
| --- | ---: | --- |
| Bulk destructive delete | 14 | Would delete broadly with a generated body |
| Creates an account or company | 6 | Creates state outside the test account |
| Deletes or rewrites shared data | 6 | Rewrites records shared with other members |
| Writes a row for an empty or generated body | 5 | A generated body would create a row |
| Identity or credentials | 5 | Would destroy access (password change, unbind) |
| Sends an SMS or email code | 4 | Sends to a real phone or mailbox |
| Real-name authentication | 3 | Requires real identity documents |
| Spends money | 2 | Payment endpoints |
| Ends the session | 1 | Would end the token this research runs on |
| **Total withheld** | **46** | Every route is listed with its own reason in [BLOCKLIST.md](BLOCKLIST.md) |

Nine more fields were accepted by a route but proved **inert** (a real value and a garbage value return
identical bytes); they are recorded in [PARAMETER_MATRIX.md](PARAMETER_MATRIX.md) so they are not mistaken
for working parameters.

## Reproduce

```powershell
node scripts/dev/extract-client-routes.mjs          # re-derive the universe from the live bundle
node scripts/dev/sweep-all-routes.mjs --out references/server-api/route-sweep.json --include-writes
node scripts/dev/reprobe-resolved-routes.mjs       # required right after a sweep
node scripts/yunlogin-doctor.mjs --audit           # the full audit chain, live
node scripts/dev/check-bundle-drift.mjs --routes   # confirm the deployed build still matches
```

The audit fails when documentation drifts, when a parameterized route stops matching its baseline, when a
write stops persisting or restoring, when a delete stops behaving, or when any probe resource remains.
