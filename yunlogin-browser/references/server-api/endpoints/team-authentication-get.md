# Team Authentication Detail

- Surface: server API
- Endpoint ID: `team-authentication-get`
- Method: `POST`
- Path: `/v2/team/authentication/get`
- Tested: 2026-09-24
- Test result: HTTP 404 on the tested origin; marked unavailable
- Verified: 2026-09-24 by a live sweep of every cataloged server route

## Purpose

The management-center client calls this route to read the current company authentication detail.

## Request

### Headers

| Header | Required | Value |
| --- | --- | --- |
| `Authorization` | Yes | `Bearer <YUNLOGIN_SERVER_TOKEN>` |
| `Accept` | Yes | `application/json, text/plain, */*` |
| `Content-Type` | Yes for POST | `application/json` |
| `Lang` | No | Defaults to `zh`. Override with `YUNLOGIN_SERVER_LANG`. |

### Body

The tested client sends no body.

## Response

### Result

The tested origin returned HTTP 404 with a plain-text body:

```text
404 page not found
```

The route is not served on `https://d126447d359e70c0.yunlogin.com`. Do not send a live request from this skill until the route becomes available and is re-tested.

### Related Endpoints

Use the cataloged alternatives instead:

| Need | Endpoint |
| --- | --- |
| Company profile | `current-company-info` |
| Company face verification status | `company-face-check` |
| Account-level authentication check | `authentication-check` |

## Error Handling

The tested origin returns HTTP 404 with a plain-text body for this route, so no live request should be sent from this skill. Read [ERRORS.md](../ERRORS.md) for the shared contract and use the related endpoints listed above.

## Notes

The catalog records `code: null` for this entry so the helper can report the tested state without pretending the route works.
