# Styling & responsive conventions

**Scope — the visual _how_.** The platform floor is in [CLAUDE.md](../../CLAUDE.md); verification
in [development.md § Testing](development.md#testing); the CSS layers in
[development.md § Code structure](development.md#code-structure).

## Direction

**A text editor's sheet of paper** (owner): the CV is an A4 page (or two) on a quiet desk, edited
in place; the tools — the project bar, the tips — sit around the sheet and never on it. The CV
itself is **stylish and simple** (owner): white paper, near-black text, one accent colour for
headings at most, one or two typefaces, few bolds and italics, no borders, space between sections
doing the grouping (the owner's notes: `autioch/recruitment-notes` `cv.md` § Design). The
template's look is settled with the owner on a rendered sample, not a description
([backlog.md](../backlog.md)).

## Ground rules — the floor

- **Size.** The interface at the browser's own size (`--fs-body` 1 rem), small text no smaller
  than 0.875 rem; every size, space and breakpoint in `rem` or `em`, never `px` for text, so zoom
  and text size enlarge the interface. **The sheet is the exception**: it is laid out in print
  units (`mm`, `pt`) so the screen shows what prints; it scales as a whole with zoom.
- **Line-height.** Multi-line interface text ≥ **1.5**; a line ≤ `--measure`.
- **Contrast.** AA at least (4.5 : 1 text, 3 : 1 for control edges, focus rings and icons); the
  CV's own text near-black on white. **Never colour alone** — a state also has a word or a shape.
- **Targets & focus.** Pointer targets ≥ **24×24 px** (WCAG 2.5.8), 44 px for the project bar's
  buttons. Every interactive element keyboard reachable with a **visible focus ring** (3 px
  `--accent`, offset 3 px). An editable field on the sheet shows it is editable on hover and focus,
  never only on hover.
- **Words over icons.** Every button says what it does in words, or carries a visible label beside
  its icon; no tooltip as the only explanation.
- **Forms.** A visible label for every field outside the sheet. On the sheet the field's place is
  its label; each still has an accessible name ("Stanowisko", "Firma").
- **Motion.** Small and quick, only where something moves anyway; none at all with reduced motion.
- **Zoom.** 200 % keeps the interface readable and reachable with no sideways scroll beyond the
  sheet itself.

## Palette

Tokens in `src/shared/styles.css`; contrasts in its comments. A starting set until the template's
look is agreed.

### Theme

Light only, regardless of the operating-system preference (owner). Keep `color-scheme: light` in the
document metadata and root CSS in sync.

### Type

The system face for the interface until the spec picks one; the template's face is part of the
template. A web font is self-hosted from npm, never a font CDN, and covers every Polish letter.

### Print

The sheet prints alone: A4, the template's margins, no interface, no tips, no editing marks. Page
breaks fall between items, never inside one.

## Bands

One column that widens; a media query only where a layout must change shape. Name a band here
when a query adds one; keep them few; reflow with CSS only.

| Band  | Width         | What changes                              |
| ----- | ------------- | ----------------------------------------- |
| phone | 320 px and up | One column; the sheet scaled to the width |

## Words

- The product's name (`SITE_NAME`) in every visitor-facing text, once chosen;
  `resume-editor` only as an identifier (the repo).
- One word for one thing in the interface: **CV** (never "resume", "życiorys"), **projekt** (a
  saved CV), **sekcja**, **pozycja** (an item in a section), **szablon**.
