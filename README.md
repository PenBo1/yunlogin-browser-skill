# YunLogin Browser Skill

A Codex skill for operating YunLogin through its documented APIs: the local  
desktop loopback service, the local client helper service, and the  
management-center server API.

## What It Covers

- **76 documented endpoints**: 23 local API routes on port 50213 and 53  
  management-center routes, each with its own reference document.
- **Environment lifecycle**: create, clone, delete, group, and tag  
  environments, with confirmation gates on every mutation.
- **Token lifecycle**: automatic capture of the local API token from the  
  bundled browser extension, plus a cached server session stored in the user  
  profile.
- **CDP automation**: launch an environment, connect over Chrome DevTools  
  Protocol, and optionally hand the browser to the official Playwright CLI.

## Layout

```text
yunlogin-browser/
  SKILL.md           entry point and routing rules
  agents/            UI metadata (icons, short description, invocation policy)
  assets/            icon set
  references/        endpoint documents and guides
  scripts/           five zero-dependency Node.js commands plus lib/ and dev/
  LICENSE            MIT
```

## Installation

Install with the Codex skill installer, pointing at the skill folder:

```text
scripts/install-skill-from-github.py --repo PenBo1/yunlogin-browser-skill --path yunlogin-browser
```

Or copy the `yunlogin-browser` folder into your skills directory.

## Requirements

- Node.js 18 or newer. The commands rely on the built-in `fetch` and `WebSocket`  
  globals and need no npm packages.
- A running YunLogin desktop client for the local API surface.
- A YunLogin management-center bearer token for the server API surface. The  
  skill caches it with `node scripts/yunlogin-auth.mjs save-server-token`.

## Quick Start

```powershell
# Check which credentials are usable
node scripts/yunlogin-auth.mjs status

# Launch an environment and print its CDP URL
node scripts/yunlogin-cdp.mjs start --account-id <account-id> --output session.json

# Read a management-center route
node scripts/yunlogin-server-api.mjs browser-settings

# Validate the documentation after editing it
node scripts/dev/validate-api-docs.mjs
```

## Credentials

Tokens are never stored in this repository. The skill caches them in the user  
profile instead:

| Platform | Location                           |
| -------- | ---------------------------------- |
| Windows  | `%LOCALAPPDATA%\yunlogin-browser\` |
| Other    | `~/.local/share/yunlogin-browser/` |

## License

MIT. See [LICENSE](LICENSE) at the repository root. The skill folder keeps an identical copy at [yunlogin-browser/LICENSE](yunlogin-browser/LICENSE) so an installed skill stays self-contained.
