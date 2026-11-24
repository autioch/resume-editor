# Security

The project's security posture. How to test it: [development.md § Testing](development.md#testing).

## Trust model

Static files built by Astro. **No accounts, no server code, no third-party scripts, no request the
page makes** — the CSP has no `connect-src`, so it falls back to `default-src 'none'`. npm
dependencies run at build time (on the agent's machine, CI and Netlify), except React, React DOM
and Zustand, which ship in the editor's bundle — pinned exactly and installed from the lockfile.
Netlify serves the static site and may process routine request data; there is no app analytics,
cookie or account.

**A CV stays on the device** ([vision.md § Principles](../vision.md#principles)). Today the
placeholder stores nothing. The editor will keep its projects in the browser's own storage
(`localStorage` or IndexedDB — the spec decides), on this origin only, readable by no other site.
That storage holds personal data (a name, a phone, an address), so:

- **Nothing leaves the device.** Export is a file built in the browser and downloaded; import reads
  a file the user picked. No upload, no sync, no share link that carries the CV to a server.
- **Imported files are untrusted data.** Parsed as JSON only, validated against the schema, size
  capped, never run, never rendered as markup — text only (Trusted Types backs it). A URL from a
  file (a profile, a photo) is shown as a link only after its scheme is checked (`https:`,
  `mailto:`, `tel:`).
- **The user can wipe it.** Deleting a project removes it from storage; the privacy page says where
  the data lives and how to clear it.
- **Shared computers.** Storage stays after the tab closes; the privacy page and the project bar say
  so (proposed).

Outbound links in the help and tips are plain links: the visitor decides to follow them.

Any server code, token, fetched origin, third-party script or new kind of storage ends this model —
rewrite this doc first.

## Transport & headers

Netlify serves HTTPS with its own certificate. `.page` is on the browsers' HSTS preload list, so
plain HTTP never reaches the site. Headers, all in [`netlify.toml`](../../netlify.toml):

- `Content-Security-Policy` — `default-src 'none'`; scripts, styles, images and fonts from `'self'`
  only (no `'unsafe-inline'`); no `connect-src`; no base, no forms, no framing. **Trusted Types**
  (`require-trusted-types-for 'script'`, `trusted-types 'none'`): the browser refuses every markup
  and script sink (`innerHTML`, `eval` …) and no policy may unlock one. A photo the user picks
  (if the spec allows one) needs `img-src` to allow `blob:` or `data:` — a CSP change, decided
  here first.
- `Strict-Transport-Security` (2 years, subdomains, preload), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin`,
  `Permissions-Policy` denying camera, microphone, geolocation.
- `/_astro/*` only: `Cache-Control: public, max-age=31536000, immutable`.

On `*.netlify.app` Netlify replaces our HSTS with its own; ours applies on the custom domain.

## Abuse and cost

Nothing takes input that leaves the browser — no form, account, comment or upload — so spam has
no target; the contact is a link to `https://jakub.page`.

- **The real exposure is Netlify's bandwidth cap, and it fails closed.** The account is on the
  legacy Free plan: 100 GB of bandwidth and 300 build minutes a month, hard limits, shared by every
  site on the account. At 100 GB every site is paused until the plan is upgraded. A flood can take
  the site down; it can't send a bill. A visit's weight: `npm run check:weight`.
- **Build minutes only stop deploys.** Docs-only commits skip the build (`ignore` in
  `netlify.toml`).

## CI permissions

`ci.yml` runs read-only. Only the `Merge on green` job gets `contents` + `pull-requests` write, and
only for a non-draft PR opened by `autioch` from this repo, after the Gate passes; it merges the
exact commit the Gate checked (`--match-head-commit`). A fork or anyone else's PR is never merged —
Dependabot's included.

## Secrets

The site needs none. Agent tokens (`NETLIFY_PERSONAL_ACCESS_TOKEN`) live in the environment, never
in the repo; `.mcp.json` only references them.

## Enforced

| Rule                                                                                | Where                                                                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| CSP holds: bundled scripts only, nothing inline, no external loads, no connect-src  | `check:csp` (gate)                                                                         |
| `security.txt` expires in the future, at most a year ahead (RFC 9116)               | `check:csp` (gate)                                                                         |
| No markup from data, no string run as code (`innerHTML`, `eval`, `new Function` …)  | ESLint on `src/` (gate); the browser via Trusted Types, which `check:csp` keeps in the CSP |
| Workflow actions pinned to a commit SHA with its version in a comment               | `check:repo` (gate)                                                                        |
| Dependencies exact; the lockfile only from the npm registry, sha512 per package     | `check:repo` (gate); `npm ci` verifies the hashes                                          |
| No token or private key in a tracked file                                           | `check:repo` (gate)                                                                        |
| No critical advisory in production dependencies (owner: high ones don't block a PR) | `npm audit --omit=dev --audit-level=critical` in CI                                        |
| No high or critical advisory in production dependencies, while nothing changes      | `npm audit --omit=dev` weekly; Dependabot security updates open the fix                    |
| The live site sends `netlify.toml`'s headers                                        | `live:headers` weekly                                                                      |
| CI's token is read-only, not kept in `.git/config`; only the owner's PRs merge      | `ci.yml` (`persist-credentials: false`, the merge job's `if`)                              |

## Reviewing security

Run the **security lens** of the [review pass](../workflow.md#the-review-pass) whenever a change
touches `netlify.toml`, adds a resource type, an origin, a script, storage, an import or export, a
download or a form.
