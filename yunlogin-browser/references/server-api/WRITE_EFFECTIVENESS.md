# Write Effectiveness

A write route answering `code: 200` does not prove that anything changed. Every case below was run as a
full round trip on one existing environment: read the current value, write a temporary value, re-read to
see whether it stuck, write the original back, and re-read again. The environment name, notes, star flag,
and top order were all restored to their original values.

- Probe time: 2026-10-12T03:40:32.290Z
- Claimed success: 7 of 7
- Actually persisted: 7 of 7
- Restored to the original value: 7 of 7

## Measured Round Trips

| Case | Route | Field | Original | After write | Persisted | Restored |
| --- | --- | --- | --- | --- | --- | --- |
| environment-name | `/v2/newbrowser/retsetshopName` | `name` | `\u4e91\u767b\u6d4f\u89c8\u5668` | `codex-write-probe` | yes | yes |
| environment-notes | `/v2/newbrowser/putaddnotes` | `notes` | `` | `codex-write-probe` | yes | yes |
| environment-star | `/v2/newbrowser/retsetshopisstartag` | `isstartag` | `0` | `1` | yes | yes |
| environment-top | `/v2/newbrowser/retsetshopistop` | `topOrder` | `0` | `3` | yes | yes |
| group-rename | `POST /v2/newbrowser/putnewgroup` | `name` | `codex-wr-mv4pfaul` | `codex-wr-mv4pfaul-r` | yes | yes |
| tag-rename | `POST /v2/proxy/device/updateTag` | `name` | `codex-wr-mv4pfaul` | `codex-wr-mv4pfaul-r` | yes | yes |
| dynamic-proxy-rename | `POST /v2/proxy/device/updateDeviceDynamicProxies` | `name` | `codex-wr-mv4pfaul` | `codex-wr-mv4pfaul-r` | yes | yes |

## Writes That Report Success Without Persisting

These routes were measured earlier and are listed here so the contrast is explicit. Verify them by
re-reading the resource, never by the response alone.

| Route | Claimed | Reality | Verify with |
| --- | --- | --- | --- |
| `POST /v2/newbrowser/createUserPassword` | `code: 200`, `msg: OK`, `data: null` | No credential row is created | `getUserPasswordList` count |
| `POST /v2/newbrowser/putUserPassword` | `code: 200`, `msg: OK` | No credential row is created | `getUserPasswordList` count |
| `POST /v2/newbrowser/account-users/update` | `code: 200`, `msg: OK` | No change is applied | re-read the binding |
| `POST /v2/proxy/device/updateDeviceProxyUserSelves` | `code: 200`, `data.success: 1`, full `data.proxies[0]` | The row never appears in `findDeviceProxyUserSelves` (520 rows before and after) | re-read the proxy list |

## Rule

Treat a write as successful only when a follow-up read shows the new value. The four environment writes
above do persist, but the four routes in the second table show that a success envelope alone is not proof.
