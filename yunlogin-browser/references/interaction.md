# User Interaction And Workbench Modes

Use this guide for every YunLogin task. Present one consistent user-facing concept: **Workbench session**. Native Workbench, web Workbench and the environment source are internal session owners; explain that distinction only when it changes the next action, the safety boundary or the capability that is blocked. Do not make the user learn cache filenames or implementation names to continue a task.

## Conversation shape

Start with the observed state in one sentence:

> YunLogin is running and the local API is available, but Workbench page control is not ready.

Then state the blocked capability and the next useful option:

> I can check native Workbench again, or open a separate web Workbench for management-center page control.

Ask one choice at a time. Use the user's prior authorization and choices; do not ask again for the same approval. Ask before a restart, installation, environment creation/deletion, Cookie/proxy change, or credential transfer. A read-only inspection, dry-run, page snapshot, or already-authorized web fallback can proceed without a new permission question.

Use friendly labels in progress and final messages:

1. Client located / not located
2. Workbench running / not running
3. CDP verified / not verified
4. Bridge ports injected / missing keys listed
5. Login verified / pending / unknown
6. Requested page action completed / not executed with reason

Do not use a successful HTTP request, a running process, a token-shaped string, or a page title as proof of the next stage. Each stage needs its own evidence.

## One login-state story

Tell the user: "the Workbench session is saved" or "the Workbench session is not verified yet." Keep the native and web storage owners separate internally so a web session cannot silently become the native API helper's session. Reveal the separate source only when it affects recovery: native CDP, selected environment Authorization, web cache, or manual sign-in.

When Authorization is captured from a selected environment:

- Identify the exact environment by ID/name; never choose the first matching record silently.
- Read its extension localStorage only through its verified environment CDP.
- Validate the value against the management user and company endpoints.
- Cache it atomically with mode `0600`, outside the project and skill.
- Inject only the management origin's `Authorization`, `userinfo` and `CompanyInfo` values.
- Report keys and verification flags, never values.

If the source is missing, expired, rejected, changed during the transfer, or ambiguous, say what failed and offer manual sign-in in the dedicated web Workbench. Do not describe the user as logged out merely because native Workbench CDP is unavailable.

## Friendly failure messages

Use this order: **what was observed -> what it blocks -> what the user can do next**.

Examples:

- "Native Workbench is running, but CDP did not verify, so I cannot control its pages. On macOS I can use a separate web Workbench with loopback CDP without restarting native Workbench."
- "YunLogin and the local API are ready, but Workbench is not open. Open Workbench from YunLogin and I will check again."
- "The web Workbench is open and CDP is connected, but no verified Authorization is available. I can obtain it from the selected environment, or you can sign in in the new page."
- "Authorization is verified and the user/company match; the requested page action has not run yet."

Do not expose raw `--base-data`, token text, Cookies, proxy credentials, full storage dumps, or internal stack traces. Do not promise that an upgrade will fix a vendor limitation unless it has been verified. Do not repeat a failed restart or rotate ports without new evidence.

## Completion wording

Say exactly which mode completed the task:

> The web Workbench is open and CDP is verified. Authorization was validated from the selected environment and injected; user/company match, and the environment search is complete. Native Workbench was not restarted.

When a stage is incomplete, say so directly:

> The web Workbench is open and controllable, but login still needs the user. No environment data was changed.
