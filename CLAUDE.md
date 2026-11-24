# CLAUDE.md — Agent Instructions for resume-editor

Always-loaded. It tells you **what to do when, and what to read first**; match the request to a row
in the routing table below and follow that path. One skill: `polish-copy`, for every Polish text the
site shows.

## What this is

**A CV editor in the browser** (name open — [vision.md § Open questions](docs/vision.md#open-questions))
at **cv.jakub.page** (proposed): an A4 sheet you click and edit in place, sections and items added
under each list, very simple formatting, one stylish template; projects saved on the device, with
autosave, open, import and export; tips beside the page. **No account, no server: the CV never
leaves the device.** The data is a standard format — **JSON Resume** (proposed). The product
contract is [docs/vision.md](docs/vision.md).
Stack: **Astro (static) · TypeScript · React renders, Zustand decides (owner) · npm · Netlify** — no
server code ([architecture.md § Rendering](docs/standards/architecture.md#rendering)). Config, gate
and process come from `autioch/tinctures`; code and look go their own way. Production standard always.

**Status: setup and the starting vision.** Next: the [backlog](docs/backlog.md) — the owner's review
of the research, then the v1 spec. After a break → [workflow.md § Returning](docs/workflow.md#returning).

## Working style

- Short, concise, direct. Cut filler; don't sugar-coat.
- **Vet every request against industry standards, security, and common sense; push back hard when it
  fails.** The owner relies on this — it's the job, not a courtesy. When a request is wrong, unsafe, or has
  a clearly better option, **lead with the objection, the evidence, and the better option, then
  wait**. "Don't build this" is a valid outcome. Bluntness must be earned by evidence, not opinion.
  If it passes, proceed.
- **Decide vs. ask — by reversibility × blast radius.** Don't stop on every unknown. **Reversible,
  low-blast** (naming, layout, a local refactor): pick the sensible default, act, note it. **Always
  ask** when it's **irreversible or high-blast** — deleting or overwriting user data (a saved CV, the
  storage format), security, anything **leaving the machine** (push, deploy, send, publish), or money.
  A recurring ask becomes a codified default or an automated check, not a standing prompt.
  **Codified:** every change ends in a PR — push the branch, open it as a **draft** so the owner can
  look (diff, deploy preview); "merge" from the owner → mark it ready, CI merges on green
  ([workflow.md § Close-out](docs/workflow.md#close-out)). All of it runs without asking. Asked to
  merge right away → open it ready.
- **Trust these instructions.** When a detail is missing, search **narrowly** for that one thing —
  don't re-explore the repo. The "Read first" column is the whole reading list for a path.
- **Ask with options.** When you do stop, offer multiple choice with your recommendation first, and
  record the answer where the work lives — not only in chat.
- After git actions, report the result in **one line** — no summaries or next-step suggestions
  unless asked.
- **Durable rules live in the repo, not memory.** A convention that must hold across sessions belongs
  in tracked markdown, never only in agent memory.

## What to do when

Match the request to the **first row that fits**, then follow that path in
[workflow.md](docs/workflow.md). When two rows fit, **take the heavier one** — a change escalates
mid-flight, it doesn't balloon in place.

| The request is…                                                                                                     | Path                                                                                                                        | Read first                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **A question** — "how does X work", "where is Y"                                                                    | Answer it. No branch, no commit.                                                                                            | only the files in question                                                                                    |
| **An unproven idea** — "can we…", "would it work if…", anything with a real feasibility doubt                       | [**Investigate**](docs/workflow.md#investigate) — de-risk, give a verdict, **don't build**. "No" is a win.                  | whatever the question needs                                                                                   |
| **A trivial edit** — wording, a config value, a pointer fix; no code, no judgment                                   | [**Direct**](docs/workflow.md#direct) — edit → gate → branch → PR                                                           | just the file                                                                                                 |
| **A bug**                                                                                                           | [**Fix**](docs/workflow.md#fix) — reproduce it **observed broken** first, then fix                                          | [development.md § Testing](docs/standards/development.md#testing) + the code at fault                         |
| **A bounded change** — one behavior: a copy/style edit, a field, a config change                                    | [**Bounded**](docs/workflow.md#bounded) — pin the edges → branch → build → verify → close out                               | [development.md](docs/standards/development.md) + the source it touches                                       |
| **A real feature** — a new page, a section type, a template, the storage or the file format, open product questions | [**Feature**](docs/workflow.md#feature) — agree a spec → ordered plan → build step by step → review → reconcile → close out | [architecture.md](docs/standards/architecture.md) + [development.md](docs/standards/development.md)           |
| **"Review this" / "is this safe"**                                                                                  | [**Review pass**](docs/workflow.md#the-review-pass) — findings only; don't fix unless asked                                 | [security.md](docs/standards/security.md) + [development.md § Testing](docs/standards/development.md#testing) |
| **Docs drifted**, or you just changed code                                                                          | [**Sync**](docs/workflow.md#sync) — the doc-sync map decides which docs                                                     | [development.md § keeping docs in sync](docs/standards/development.md#keeping-docs-in-sync)                   |
| **Visitor-facing text** — a tip, a label, a help page, a sample CV                                                  | **Bounded** — tips trace to [sources.md](docs/sources.md) or the owner's notes                                              | [vision.md](docs/vision.md) + `.claude/skills/polish-copy/SKILL.md`                                           |
| **A cleanup** — "porządki w kodzie", "uprość kod", "clean up the code"                                              | [**Cleanup**](docs/workflow.md#cleanup) — run the on-demand checks, report findings, fix what the owner picks               | [development.md](docs/standards/development.md)                                                               |
| **Reusing something from `autioch/tinctures`, `card-game-almanac` or `personal`**                                   | **Bounded** or **Feature** by size — copy the file, adapt it to this site                                                   | that file + [architecture.md](docs/standards/architecture.md)                                                 |

**Two reads are conditional, on every path:** touch anything visual →
[styling.md](docs/standards/styling.md); touch headers, redirects, a third-party origin, client
storage, file import or secrets → [security.md](docs/standards/security.md).

**Before you verify anything, read [development.md § Testing](docs/standards/development.md#testing).** It is the testing source of
truth — what to check, how, and the traps that make a check pass without exercising anything.

**"What's next?"** → [backlog.md](docs/backlog.md), the agreed queue and the owner's steps; work
agreed in chat goes there, and leaves when its PR merges. Ideas not yet agreed, other editors
compared: [docs/research/](docs/research/) — input, not rules.

## Always, whatever the path

- **The gate is green before every commit** — `npm run ci`. CI re-runs
  it on every PR and push to `main`. Never leave the tree broken.
- **Docs ship with the change.** Code or config changes update the affected prose in the **same
  commit** — never a tree where docs contradict code. Which docs: the
  [doc-sync map](docs/standards/development.md#keeping-docs-in-sync).
- **Claims trace to evidence.** A green gate alone is not "verified". Say what you ran and what it
  showed; say plainly what is still owed. **Flag it owed, never fake it.**
- **Docs you author obey the doc bar** — short, blunt, **pointer-first**: state the **current**
  behavior and **why** — the argument, never the history (that's `git log`; an owner's decision is
  marked `(owner)`, never dated), never research notes,
  never a speculative future (future work lives only in [backlog.md](docs/backlog.md)) — and
  **link the doc that owns a rule instead of restating it**. Loaded docs are paid context: this file stays **≤ 175 lines** and stays a router; each
  standards doc stays **≤ 350**.
- **Production quality is the floor**, not "good enough for now". WCAG AA, keyboard-complete,
  responsive from 320 px ([styling.md § Ground rules](docs/standards/styling.md#ground-rules--the-floor)).
  **Light theme only** (owner). Visitor-facing text in Polish (proposed); docs and code stay English.
- **The user's CV is theirs and stays on their device.** Never lose it: every change autosaved,
  every stored file versioned and migrated, never overwritten without a way back. What a visitor
  types never leaves the device; an origin the page talks to, a new storage or a third-party script
  changes the [trust model](docs/standards/security.md#trust-model) — rewrite it first.
- **The format is the contract.** The CV is JSON Resume (proposed): what the editor saves, exports
  and imports, and what every template reads. Anything the standard lacks goes in its `meta` /
  extension fields, never a private fork of the schema ([vision.md](docs/vision.md)).
- **React renders, Zustand decides (owner).** Components take state and call actions — no logic,
  no `useState` for data. Every rule, edit, undo, save and migration is a store action or a plain
  module it calls, unit-tested without a DOM. Custom hooks only wrap events and browser APIs.
- **Static, no server.** Every page is built ahead. A Netlify Function eats the Free plan's hard
  quota — only as a last resort, **confirmed by the owner** first.
- **Native first:** no tool or dependency where a built-in (Node, npm, Astro, the platform) meets
  every requirement; React and Zustand are the owner's exceptions. Versions exact, each ≥ 2 weeks old:
  [development.md](docs/standards/development.md#conventions).
- **The current stable Chrome, Edge, Firefox and Safari (macOS, iOS)** — nothing older, no
  polyfills, no fallbacks ([architecture.md § Browsers](docs/standards/architecture.md#browsers)).

## Commands

| Command                              | Purpose                                                                                                                                                                                                     |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                             | Install exactly what `package-lock.json` pins                                                                                                                                                               |
| `npm run ci`                         | The gate: format → lint → knip (dead code) → `check:repo` (pinned actions, exact versions, secrets) → `check:types` → tests → build → `check:html`, `check:css`, `check:csp`, `check:links`, `check:weight` |
| `npm run fix`                        | ESLint autofix, then Prettier — run before the gate                                                                                                                                                         |
| `npm run dev`                        | Local preview :4321 (`.claude/launch.json` → `site`)                                                                                                                                                        |
| `npm run a11y`                       | Accessibility over the build (CI runs it too); `BROWSER=<path>` picks the browser                                                                                                                           |
| `npm run live:links`, `live:headers` | Against the network, weekly in CI: every external link; the live site's headers against `netlify.toml` (`-- <URL>` for a deploy preview)                                                                    |

## Git

One branch per unit of work, never a commit straight to `main`; push at close-out and open a draft
PR; "merge" → mark it ready, CI merges on green. **One rule for GitHub, every session:** plain
`git` for commits and push; for PRs and other GitHub calls, **`gh` where it's installed** (the
desktop app), **else the session's built-in GitHub tools** (claude.ai/code cloud, which has no
`gh`). No GitHub MCP server in `.mcp.json` and no GitHub token to keep (owner). Mechanics: [workflow.md § Committing](docs/workflow.md#committing).

## Hosting

Netlify project `qb-resume` runs `npm run build` and publishes `dist/` from `main` —
[netlify.toml](netlify.toml) holds the build, the redirect and the security headers. Production:
`https://cv.jakub.page` (proposed, canonical; `qb-resume.netlify.app` redirects). Site and domain: [architecture.md § Hosting](docs/standards/architecture.md#hosting);
owner to-dos: [backlog.md § Owner](docs/backlog.md#owner).

## MCP servers

`.mcp.json` defines `context7`, `chrome-devtools`, `netlify` — agent tooling only. Their
tokens and where they're set: [development.md § MCP servers](docs/standards/development.md#mcp-servers).

**A token fails → stop.** When a server fails to connect for auth reasons, or a call using a token
returns 401/403 or "bad credentials" (the MCP servers, `gh`, the Netlify CLI), **stop the work** —
no workarounds, no retries with another tool. End the turn with a standalone line in bold, first in
the message: **"Token `<NAME>` is invalid — regenerate it"** plus where it's set
([development.md § MCP servers](docs/standards/development.md#mcp-servers)). A 404 or "permission"
error from a token that otherwise works is a repo setting, not the token — check that first.

## Gotchas

- **Shell:** run git, npm and npx through **Bash**, not PowerShell 5.1 (it wraps native stderr as
  error records and reports false failures).
- **Permission prompts:** `.claude/settings.json` allowlists the routine commands. A compound
  command prompts if _any_ part is unlisted — so run from the repo root (never `cd … &&`), one
  allowlisted command per call, and read or search with the file tools, not shell pipes.
- **Only `dist/` is public** — what `src/` and `public/` build to. Docs and this file never ship.
- **No inline `<style>` or `<script>`** in the output — the CSP blocks them; `astro.config.mjs`
  sets `inlineStylesheets: 'never'` and `assetsInlineLimit: 0`. Astro's `client:*` islands inline
  a bootstrap script, so the editor is mounted by our own bundled module, not a `client:` directive
  ([architecture.md § Rendering](docs/standards/architecture.md#rendering)).
- **Trusted Types are on** — no `innerHTML`, no `dangerouslySetInnerHTML`, no `execCommand`
  formatting. Rich text is a tiny Markdown subset rendered as React elements.
- **The CSP blocks every `fetch`** — no `connect-src`, so it falls back to `default-src 'none'`
  (`check:csp` holds it). The local preview has no Netlify headers, CSP or redirects, so only the
  deploy preview shows a miss.
- **Netlify skips the deploy** when a commit changes nothing that builds the site (the `ignore`
  command in `netlify.toml`) — a docs-only PR has no deploy preview, by design.
- **`npm ci` fails with EPERM** while VS Code is open — its Astro extension locks
  `@astrojs/compiler-binding-*`. Close VS Code, or restore with `npm install` (same lockfile).
- Use the dedicated file tools, never shell `cat` / `Get-Content`.
