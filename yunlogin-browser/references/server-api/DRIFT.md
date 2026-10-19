# Route Sweep Drift

Compares the latest full-surface sweep with the stored baseline. Only routes that are live in BOTH
sweeps are compared; a sweep run with different skip flags or a different collector version is not
server-side drift, so re-baseline after changing the sweep script. A changed HTTP status, business
code, or field count is listed here so a real change is noticed.

- Baseline: `route-baseline.json` created 2026-10-12T03:31:28.142Z
- Compared sweep: 2026-10-12T03:31:05.738Z
- Routes: 489 current, 489 in baseline

## Summary

| Category | Count |
| --- | ---: |
| Drift (needs review) | 0 |
| Expected difference (parameterized route) | 0 |
| Verified parameterized route | 100 |
| Coverage change (different skip flags) | 0 |
| Added routes | 0 |
| Removed routes | 0 |

No drift detected: every route matches the baseline.
