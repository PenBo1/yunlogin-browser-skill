# Delete Semantics

Each case creates a uniquely named throwaway resource, confirms it exists, deletes it, and re-reads
the list. The delete response is kept as evidence: a payload carrying `deleted` / `deletedAt` is a
tombstone (the row survives in storage), while a null payload plus a row that left the list and no
recycle route indicates the row was removed outright.

- Probe time: 2026-10-12T03:40:34.542Z

## Measured Cases

| Resource | Create | Delete | Delete response | Gone from active list | In recycle list | Purge | Classification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| proxy-tag | `POST /v2/proxy/device/updateTag` | `POST /v2/proxy/device/delTag` | `null` | yes | not checked | - | **hard (observed)** - the row left the list and the response carried no tombstone |
| environment-group | `POST /v2/newbrowser/putnewgroup` | `POST /v2/newbrowser/deletegroups` | `null` | yes | not checked | - | **hard (observed)** - the row left the list and the response carried no tombstone |
| custom-platform | `POST /v2/newbrowser/putuserselfuri` | `POST /v2/newbrowser/putdeleteuserselfuri` | `null` | yes | not checked | - | **hard (observed)** - the row left the list and the response carried no tombstone |
| role-group | `POST /v2/team/role-group/create` | `POST /v2/team/role-group/del` | `null` | yes | not checked | - | **hard (observed)** - the row left the list and the response carried no tombstone |
| dynamic-proxy | `POST /v2/proxy/device/updateDeviceDynamicProxies` | `POST /v2/proxy/device/delDeviceDynamicProxies` | `null` | yes | **yes** | `POST /v2/proxy/device/recycleDelDeviceDynamicProxies` -> removed | **soft (recycle list)** - the row left the active list but still appears in the recycle list |
| environment | `POST /v2/newbrowser/putalluri` | `POST /v2/newbrowser/putdeleteshop` | `null` | yes | **yes** | `POST /v2/newbrowser/putdeleteshopfromrecycle` -> removed | **soft (recycle list)** - the row left the active list but still appears in the recycle list |

## Leftover Check

| Resource | Create code | Existed after create | Delete code | Leftover after delete |
| --- | ---: | --- | ---: | --- |
| proxy-tag | 200 | yes | 200 | no |
| environment-group | 200 | yes | 200 | no |
| custom-platform | 200 | yes | 200 | no |
| role-group | 200 | yes | 200 | no |
| dynamic-proxy | 200 | yes | 200 | no |
| environment | 200 | yes | 200 | no |

## Resources With A Separate Recycle List

The cases above have no recycle route, so "hard (observed)" means no second list exposes the row.
Two resource types do keep one, and their delete route is therefore soft by design:

| Resource | Delete route | Recycle list | Purge route |
| --- | --- | --- | --- |
| Environment | `POST /v2/newbrowser/putdeleteshop` | `POST /v2/newbrowser/getrecycleshoplist` | `POST /v2/newbrowser/putdeleteshopfromrecycle { shopid: [id] }` |
| Self proxy | `POST /v2/proxy/device/delDeviceProxyUserSelves` | `findDeviceProxyUserSelves` with `enable: 0` | `POST /v2/proxy/device/recycleDelDeviceProxyUserSelves { device_ids: [id] }` |

## Rule

A delete that returns `code: 200` and empties the row from the primary list can still be a soft delete.
Check the delete response for a `deletedAt` tombstone and check whether a recycle list exposes the row
before treating a resource as permanently removed.
