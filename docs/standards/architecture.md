# Architecture

What the repo is and where things live. [development.md](development.md) owns conventions and
commands; [security.md](security.md) the posture; [docs/vision.md](../vision.md) the product;
[styling.md](styling.md) the look.

## Layout

Today a placeholder site from the setup; the editor's folders are the v1 spec's to settle
([backlog.md](../backlog.md)). The shape below is the starting proposal.

```text
src/
├─ pages/                # routes only: index (the editor), 404; endpoints robots.txt.ts,
│                        # sitemap.xml.ts, .well-known/security.txt.ts
└─ shared/               # the site shell: styles.css (tokens, reset, base), consts.ts
                         # (AUTHOR, SITE_NAME), PageLayout (metadata)
public/                  # static files served as is
scripts/                 # never published: check-repo; on dist/ the gate's check-* (shared helpers and
                         # ORIGIN in dist.mjs); a11y (CI; browser.mjs drives the browser); live-* (weekly)
astro.config.mjs         # site (ORIGIN from dist.mjs), trailing slashes, build options
netlify.toml             # build, the Netlify host's redirect, security headers
docs/                    # agent docs, the vision, research — never published
```

Proposed for the editor (the spec confirms): `src/resume/` — the format (types from the JSON
Resume schema, validation, migrations, the sample CV), pure and tested; `src/store/` — the Zustand
store and its actions (edits, undo, projects, autosave), each action a plain function under test;
`src/editor/` — React components, one folder each with its `.tsx` and `.css`; `src/hooks/` — the
custom hooks (keyboard, `beforeunload`, storage events, file pickers); `src/templates/<name>/` — a
template: components that render a CV read-only, for the page and for print.

## Rendering

- **Astro, static output.** `npm run build` writes `dist/`; no adapter, no on-demand rendering, no
  server code — a Netlify Function is a last resort, agreed with the owner first. Astro builds the
  shell, the static pages (help, privacy) and bundles the editor.
- **The editor: React renders, Zustand decides (owner).** Components are functions of the store's
  state: they read with selectors and call actions, nothing else — no `useState`/`useReducer` for
  data, no effects that change data. All logic — editing, adding and moving sections, undo,
  validation, import, export, autosave, migrations — lives in the store and the plain modules it
  calls. Custom hooks only adapt events and browser APIs (keys, `beforeunload`, `storage` events,
  `matchMedia`, file pickers) to store actions.
- **Mounting under the CSP (proposed, to verify):** Astro's `client:*` islands inline a bootstrap
  script, which the CSP blocks. The editor is mounted instead by our own module in an Astro
  `<script>` (`createRoot` on a placeholder element), bundled to `_astro/*.js` like every script.
  The page without scripts says the editor needs them.
- **Styles:** tokens, reset and base rules in `src/shared/styles.css`; component styles beside
  their markup. No inline `<style>` — `inlineStylesheets: 'never'` keeps CSS in a file the CSP
  allows; one bundled stylesheet (`cssCodeSplit: false`). No `style` props either (the CSP has no
  `'unsafe-inline'` for styles): state shows by attribute or class.
- **Print is the PDF.** The sheet prints with `@page` A4 rules; the browser's "Save as PDF" makes
  the file — no PDF library (proposed: [vision.md § Open questions](../vision.md#open-questions)).
- **URLs:** every page a folder with a trailing slash (`trailingSlash: 'always'`).
- **Language:** the interface in Polish (proposed; `lang="pl"`). A CV's own language is its data.
  Docs, code and comments stay English.
- **Theme:** light only, regardless of the OS scheme (`color-scheme: light`; owner).

## Browsers

**The current stable Chrome, Edge, Firefox and Safari (macOS and iOS)**. Astro's default build
target; nothing lowered, polyfilled or given a fallback. A CSS or JS feature is fine once all four
ship it (Baseline "newly available" — ESLint's `css/use-baseline` enforces it for CSS). Editing is
for a desktop or a tablet; a phone opens, reads and prints a CV (proposed).

## State ownership

| State                   | Owner                                                  |
| ----------------------- | ------------------------------------------------------ |
| Product scope and rules | `docs/vision.md`                                       |
| A user's CVs            | the user's browser storage (security.md § Trust model) |
| Site origin             | `scripts/dist.mjs` `ORIGIN`                            |
| Headers, CSP, build     | `netlify.toml`                                         |
| Dependency versions     | `package.json` + `package-lock.json`; Node in `.nvmrc` |
| DNS record `cv`         | Netlify DNS zone `jakub.page` (proposed)               |

## Hosting

- **Netlify project** `qb-resume` (id `e62538fb-0324-4e41-8471-a01cdfb1dce9`), to deploy `main` from
  `autioch/resume-editor`; every PR gets a deploy preview
  (`deploy-preview-N--qb-resume.netlify.app`). Build settings come from `netlify.toml`; the UI
  holds none.
- **Domain** `cv.jakub.page` (proposed), the primary domain; `qb-resume.netlify.app` 301s to it
  (`netlify.toml`). `jakub.page` uses Netlify DNS, so the record lives in that zone — never at the
  registrar. HTTPS: Let's Encrypt via Netlify, forced.
- **Caching, no service worker.** `/_astro/` is content-hashed and cached a year (`immutable`); a
  page revalidates.
- **Nothing injected into production HTML** — no badge, no snippets, form detection off.

## Design goals

Little to maintain: few dependencies, built-ins first, one place per fact. React, React DOM and
Zustand are the only code from `node_modules` that reaches the browser (owner); everything else
runs at build time.
