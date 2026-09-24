# Tag Colours

The management center renders a tag with one of eight colours. The server stores an integer index, and this page defines what each index means.

## Palette

The order below matches the colour picker. Index `1` is the pre-selected colour and the value the panel uses for a tag that was created without an explicit choice.

| Index | Name | RGB | Hex |
| --- | --- | --- | --- |
| 1 | Blue | `rgb(51, 99, 252)` | `#3363FC` |
| 2 | Azure | `rgb(30, 160, 255)` | `#1EA0FF` |
| 3 | Teal | `rgb(17, 217, 193)` | `#11D9C1` |
| 4 | Lime | `rgb(172, 215, 70)` | `#ACD746` |
| 5 | Amber | `rgb(241, 190, 99)` | `#F1BE63` |
| 6 | Orange | `rgb(255, 130, 14)` | `#FF820E` |
| 7 | Red | `rgb(231, 4, 4)` | `#E70404` |
| 8 | Purple | `rgb(184, 77, 255)` | `#B84DFF` |

## Server Behaviour

The tag routes accept the colour as an integer and do not validate it against the palette. The tested round trip produced these results:

| Sent `color` | Stored `color` |
| --- | ---: |
| `0` | `1` |
| `1` | `1` |
| `8` | `8` |
| `9` | `9` |
| `-1` | `-1` |
| `99` | `99` |

Only `0` is normalised, because it is the Go zero value and the server treats it as "unset". Every other integer is stored as sent, including values outside 1-8.

Consequences:

- Validation is the caller's responsibility. Sending `9` or `-1` produces a tag the colour picker cannot render, and no error is raised.
- `scripts/yunlogin-env.mjs tag-create` validates the colour itself, accepts `1-8` or a palette name, and defaults to `1`.
- When a caller chooses a colour, prefer a distinct one so tags stay visually separable in the environment list.

## Choosing A Colour

| Situation | Suggested index |
| --- | --- |
| Default, no preference stated by the user | `1` Blue |
| Temporary or disposable data | `5` Amber |
| Something that needs attention | `7` Red |
| Verified or production data | `3` Teal |
| Grouping by product line | Pick distinct values from 2, 4, 6, 8 |

Do not invent a colour the user did not ask for when the tag already exists; rename or recolour only with explicit confirmation.

## Commands

```powershell
node scripts/yunlogin-env.mjs tag-create --name <tag name> --color 3
node scripts/yunlogin-env.mjs tag-create --name <tag name> --color teal
node scripts/yunlogin-env.mjs tag-list
```

`tag-list` reports the index and its palette name so a caller can reuse an existing colour.
