# Backlog

The one place for future work: the agent's agreed queue, then the steps only the owner can take.
Delete an item when its PR merges or the owner has done it.

## Next

In order:

1. **The owner's review of the research** — [research/comparison.md](research/comparison.md)
   (each row's **Take?**) and [research/formats.md](research/formats.md); the picks go into
   [vision.md](vision.md) and this queue.
2. **Investigate: editing on the sheet** — React mounted by our own module under this CSP and
   Trusted Types (no `client:` island); a field as `contenteditable="plaintext-only"` driven by the
   Zustand store: caret and selection kept across re-renders, IME (Polish diacritics on macOS and
   Windows), paste of formatted text lands plain, undo through the store, bold/italic on the
   Markdown source, Tab order, a screen reader reading the field's name. Against a `<textarea>` in
   place. A throwaway prototype, verdict only ([vision.md § Open questions](vision.md#open-questions)
   6, 7).
3. **Investigate: storage** — IndexedDB against `localStorage` for projects: size, eviction,
   `navigator.storage.persist()` in each of the four browsers (Safari's seven-day rule for script
   storage), a second tab editing the same project, the schema version and a migration
   ([vision.md § Open questions](vision.md#open-questions) 2).
4. **The template sample** — two or three variants of the first template rendered from the owner's
   2023 CV (`autioch/json-resume-template` `src/resume.json`), printed to A4; the owner picks
   ([vision.md § Open questions](vision.md#open-questions) 11).
5. **The v1 spec** — [Feature](workflow.md#feature) step 1 over [vision.md](vision.md): settle
   § Open questions, the store's shape and actions, the smallest slice (proposed: one project with
   autosave, editing every JSON Resume section the template shows, add/move/hide/delete, undo,
   import and export JSON, print to PDF, tips from `cv.md`) and testable acceptance criteria, into
   `docs/plan.md`. With it: React, React DOM and Zustand installed (exact, ≥ 2 weeks old), the
   React lint rules (`eslint-plugin-react-hooks`), `.tsx` in the tests, and the JS budget in
   `scripts/check-weight.mjs` raised on purpose for React.
6. **The icon and the share image** — the jakub.page family tile
   (`autioch/personal` styling.md § Family icon recipe): `favicon.svg`, `apple-touch-icon.png`,
   `og.png`.

## Owner

Steps only the owner can take — an account, DNS, a setting in a host's UI.

- **Netlify project** `qb-resume`: link it to `autioch/resume-editor` (Import from Git or Site
  configuration → Build & deploy → Link repository; build settings come from `netlify.toml`), then
  the domain `cv.jakub.page` as primary (Netlify DNS zone `jakub.page`) — or another domain:
  `scripts/dist.mjs` `ORIGIN` and `netlify.toml` change with it. Turn off form detection and the
  badge; leave the Drawer on deploy previews.
- **Repo settings** as on `tinctures`: Dependabot security updates on; the npm auto-triage preset
  for development alerts.
- **Answers to [vision.md § Open questions](vision.md#open-questions)** — in the spec session.
