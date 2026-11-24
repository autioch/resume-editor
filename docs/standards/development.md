# Development and testing

Conventions, tooling and testing. [CLAUDE.md](../../CLAUDE.md) holds the high-level rules;
[architecture.md](architecture.md) owns the layout; [security.md](security.md) the posture.

## Conventions

- **Plain, semantic HTML.** One `h1`; landmarks (`main`); every image has `alt` (empty when
  decorative); form controls have labels. Two-space indent. A list laid out by its class carries
  `role="list"` (VoiceOver drops list semantics with the markers).
- **Prettier formats, ESLint lints** — `prettier.config.mjs`, `eslint.config.js` (TS, Astro, CSS
  with `use-baseline` at "newly", markdown, JSON). `npm run fix`, then the gate. No git hooks: CI and
  the deploy-preview review are the checks.
- **Functions are declarations** — `function name() {}`, also nested helpers; an arrow only as an
  inline callback or an object property. **Every `if`/`else` and loop body takes braces.** ESLint
  enforces both (`func-style`, `curly`).
- **No dead code** — knip (`npm run knip`, in the gate) fails on an unused file, export or
  dependency. Export only what another module uses.
- **Checks on the build** — gate steps after it, plain Node in `scripts/`: `check:css` fails on a
  class in any stylesheet under `src/` with no markup in a built page, a template or a page script, and on a
  colour literal outside `src/shared/styles.css`; `check:csp` fails on what the CSP would block (a
  script that isn't a bundle in `_astro/`, inline style or script, an inline handler, anything
  loaded from another origin), on a `connect-src` (the site fetches nothing), on Trusted Types
  missing from the CSP and on an expired `security.txt`; `check:links` fails on an internal
  `href`/`src` that resolves to no file in `dist/`, or a `#id` missing on its page; `check:weight`
  fails over the page-weight budget in `scripts/check-weight.mjs` (HTML, CSS, JS, the preloaded
  fonts, the total).
- **Tests** — `npm run test` (in the gate): `node --test` over `src/**/*.test.ts`, Node running the
  TypeScript as is — no test framework. Code outside `.astro` files imports with explicit `.ts`
  extensions for that. Test what can break silently — above all the store and the format: every
  action, undo, import and export round-trips, migrations of older saved files, validation of a
  hostile file. Store actions are plain functions, so they test without a DOM.
- **Weekly** — `.github/workflows/weekly.yml`: `live:links` (every external link), `live:headers`
  (the live site against `netlify.toml`) and `npm audit` of the production dependencies (high and up)
  on Tuesdays; a failure turns the run red (GitHub mails the owner).
- **Script names say when they run:** `check:*` — offline, a step of the gate
  (`scripts/check-*.mjs`); `live:*` — against the network, weekly (`scripts/live-*.mjs`); on demand
  by plain name (`a11y`). The usual names stay as npm and their tools know them (`build`, `test`,
  `lint`, `format`).
- **CSS through tokens:** colours and sizes are custom properties on `:root` in
  `src/shared/styles.css`; component rules stay beside their markup. A rule never uses a colour
  literal (`check:css`).
- **One place per fact.** Interface text → the component that renders it; the site's name →
  `SITE_NAME`, the author → `AUTHOR` (`src/shared/consts.ts`); appearance → `styles.css` and each
  component's `.css`; the origin → `ORIGIN` in `scripts/dist.mjs` (`astro.config.mjs` `site` and
  the checks import it). Never a second copy of a string.
- **No inline styles or scripts** — the CSP blocks them ([security.md](security.md)).
- **Native first.** No tool or dependency where a built-in (the browser, Node, npm, Astro) meets
  every requirement — no CSS framework, no component library; React and Zustand are the owner's
  choice for the editor ([architecture.md § Rendering](architecture.md#rendering)). A dependency is pinned to an **exact
  version** at least two weeks old, installed with `npm install --save-exact`;
  `package-lock.json` is committed and CI installs with `npm ci`. Bump on purpose. **One
  exception:** a fix for an advisory `npm audit` reports takes the oldest patched version,
  however young, and says so in the PR. `overrides` in
  `package.json` pins a transitive dependency past an advisory its parent hasn't picked up — same
  rules; drop it once the parent does. Today: `katex` (via `@eslint/markdown`; math parsing is off,
  so katex never runs).
- **Derive a template from a real example, never ahead of one.**

## Code structure

- **One job per file.** Needing "and" between two unrelated things means two files.
- **Small components that compose.** Extract on repetition, not ahead of it; no wrapper around a
  single element.
- **CSS in layers (CUBE-light, no Tailwind)** — tokens, reset, base, compositions (`.page`,
  `.flow`), utilities (`.lede`, `.visually-hidden`), then each component's block styles in a
  `.css` beside it. States by attribute (`aria-*`, `[hidden]`). Sizes and sides are logical
  (`inline-size`, `margin-block-start`; lint: `css/prefer-logical-properties`).
- **Names and code say what; a comment says only why** — a constraint the code can't show (the
  CSP, a browser quirk, an owner's call). No comment that restates a name or records history.
- **A refactor keeps the build identical.** Compare `dist/` before and after.

## Testing

**How to test a change — read it before verifying anything.**

### Deciding what to test

| Change                      | What to prove                                                                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Content or text**         | The `polish-copy` skill's check (§ 6); every fact's source on the page; gate green; the drive shows the text, no overflow at 320 px.                                                     |
| **Layout, page or config**  | Gate green (`check:csp`, `check:links`); the drive.                                                                                                                                      |
| **CSS / visual**            | Gate green; drive at **320 px and desktop, light and dark OS preferences**, and at **200 % zoom**; light stays fixed; no sideways scroll; AA text contrast. Screenshot as proof.         |
| **The store, the format**   | Unit tests for every action and its undo; import → export round-trips a real JSON Resume file unchanged; an older saved file migrates; a hostile file is refused.                        |
| **Editing on the sheet**    | The drive with keyboard only and with a pointer: edit, add, move, delete, undo; reload keeps every change (autosave); print preview on A4 (Chromium `page.pdf`): the pages it should be. |
| **Headers / CSP**           | The rule in `netlify.toml`; the security lens; `npm run live:headers -- <deploy preview URL>` — the local preview has no headers.                                                        |
| **Docs / agent files only** | No runtime test. Links resolve; no doc contradicts the code.                                                                                                                             |

Effort scales with blast radius × irreversibility. Don't gold-plate a copy tweak.

### The stages

| Stage             | What                                                                                              | Runs where                                             | When it can't run                     |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------- |
| **The gate**      | format, lint, dead code, repo, types, tests, build, HTML validity, CSS, CSP output, links, weight | `npm run ci` locally + CI                              | n/a — runs everywhere                 |
| **Accessibility** | axe-core, reflow, text spacing — every page                                                       | `npm run a11y` in CI after the gate; locally on demand | needs Chrome or Edge                  |
| **Browser drive** | real layout and behaviour, 320 px → desktop under light and dark OS preferences                   | `.claude/launch.json` → `site` + a driven browser      | "drive owed — owner to verify"        |
| **Deploy check**  | headers, CSP, HTTPS on the real host                                                              | the deploy preview; `live:headers` weekly on prod      | "deploy check owed — owner to verify" |
| **Review pass**   | the [review lenses](../workflow.md#the-review-pass)                                               | a re-read of the whole diff                            | n/a                                   |

**No Playwright dependency.** The browser checks run on Chrome over the DevTools protocol
(`scripts/browser.mjs`). A one-off drive uses whatever the session has: the cloud has Playwright
installed (`BROWSER=/opt/pw-browsers/chromium` for `a11y`).

**The rendered-look drive is a close-out gate for anything visible.** Never close a visual change
as "drive later" without an explicit owed flag.

### Accessibility audit

- **Automated** — `npm run a11y` (`scripts/a11y.mjs`): axe-core, WCAG 2.2 A/AA plus best
  practices, every built page at 320 and 1280 px under light and dark OS preferences. At 320 px it
  also fails on sideways scroll, before and after forcing WCAG 1.4.12 text spacing.
- **Keyboard** — the skip link first, the order follows the page, every stop shows a ring.
- **Forced colours** — emulate `forced-colors: active`: states stay distinguishable.
- **Zoom** — 200 % and 400 %: nothing cut off, no sideways scroll.
- **Screen reader** — **owner**: NVDA or VoiceOver. "Screen reader pass owed" until done.

### Masking traps

- **A stale server answers on the port.** Confirm the port in the log before driving.
- **The local preview isn't Netlify.** No headers, no CSP, no redirects — check those on a deploy
  preview.
- **Netlify can inject into served HTML** (Drawer, badge) — fetch the deploy preview and grep for
  `/.netlify/scripts/`.
- **A desktop viewport is not a phone.** Drive 320 px too.
- **The site stays light in either OS theme.** Emulate both `prefers-color-scheme` values.
- **Storage survives the reload — and the test.** Clear `localStorage`/IndexedDB before a drive
  that checks a first visit, and check autosave in a fresh tab, not the one that wrote it.
- **A paste is not typing.** Paste formatted text (from Word, a web page) into an editable field:
  it must land as plain text.

### Recording QA

Say which stages ran and what they showed (cite concrete evidence: computed values, rendered text,
a header line), and what is **pending or unverifiable**. **A green gate alone is not "verified".**

## Keeping docs in sync

**Durable docs** — CLAUDE.md, README.md, everything under `docs/` but `docs/research/` — describe
the **current** state and why, and never contradict the code. No history (that's `git log`), no
research notes (those live in `docs/research/`, dated input, not rules); future work lives only in
`docs/backlog.md`. A commit that changes code or config updates the docs it affects in the same
commit.

| Change                                   | Sync these durable docs                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| New file or folder in `src/`, `public/`  | `architecture.md` (layout)                                                        |
| Headers, CSP, an origin fetched, storage | `security.md`; CLAUDE.md (Hosting, Gotchas) if it changes                         |
| A dependency, script or command          | CLAUDE.md (Commands), README.md, CI, `.claude/launch.json`, § Testing             |
| A product decision                       | `docs/vision.md` — the section it changes; the PR records why                     |
| Domain or hosting change                 | CLAUDE.md (What this is, Hosting); README.md; `architecture.md` § Hosting; og.png |
| Working method / process change          | CLAUDE.md (the routing table); `docs/workflow.md`                                 |
| QA / testing process change              | § Testing                                                                         |
| New / changed MCP server                 | `.mcp.json`; § MCP servers                                                        |
| A source cited, dropped or suggested     | `docs/sources.md` — what was taken from it                                        |
| A backlog item ships or is agreed        | `docs/backlog.md` — delete it in the PR that ships it; add new agreed work        |

## MCP servers

`.mcp.json` defines project-scoped servers — agent tooling only, never the site. No secrets in the
file: tokens come from environment variables.

| Variable                          | For             | Local                | Cloud                                    |
| --------------------------------- | --------------- | -------------------- | ---------------------------------------- |
| `NETLIFY_PERSONAL_ACCESS_TOKEN`   | netlify         | required             | required                                 |
| `CHROME_DEVTOOLS_EXECUTABLE_PATH` | chrome-devtools | path to `chrome.exe` | leave unset (uses the built-in Chromium) |

- **GitHub has no MCP server here** ([CLAUDE.md § Git](../../CLAUDE.md#git)). Desktop: `gh`, signed
  in once with `gh auth login`. Cloud: the built-in GitHub integration, no token to set.
- **`NETLIFY_PERSONAL_ACCESS_TOKEN`** — Netlify: User settings → Applications → New access token.
- **context7, chrome-devtools** — installed by `npx`, no token.
- **Versions pinned** in `.mcp.json`, by the dependency rules ([§ Conventions](#conventions)).

**Where a variable goes** (never in the repo): locally on Windows `setx NAME "value"`, then **fully
quit and reopen** the Claude app; in the cloud, claude.ai/code → the environment's settings →
environment variables — a new session picks it up. A token that fails stops the work:
[CLAUDE.md § MCP servers](../../CLAUDE.md#mcp-servers).
