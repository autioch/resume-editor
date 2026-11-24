# Product vision

The starting contract: what the site is, for whom, and the rules every page keeps. It is the input
to the first spec ([workflow.md § Feature](workflow.md#feature)); an agreed spec's lasting rules
land here at its close-out. Marked **(owner)** — decided; the rest is proposed. Questions still
open are in § Open questions, each with a recommendation. Future work lives only in
[backlog.md](backlog.md). Research behind it: [research/](research/).

## What it is

**A CV editor that looks like a text editor** (owner): a sheet of A4 paper (or two) on a desk. You
click a line of the CV and type over it, in place — no form beside a preview. Under every list and
every section an "add" control adds an item to it or a new section after it. Formatting is
deliberately small: the goal is a **stylish, simple CV**, not a layout tool (owner).

- **No login** (owner). Projects are saved **on the device** (owner), with **autosave** (owner).
- **A project bar** (owner): new, open, rename, duplicate, delete; import and export.
- **A standard format** (owner): the CV is a JSON Resume document (proposed —
  [research/formats.md](research/formats.md)); every template reads the same document.
- **One template to start, more later** (owner); switching template never changes the content.
- **Tips on the page** (owner): short advice beside the section you are editing, from the owner's
  notes (`autioch/recruitment-notes` `cv.md`) and cited sources.
- **Print is the PDF**: the sheet prints alone, as the PDF the user sends.

What it does that the others don't ([research/comparison.md](research/comparison.md)): **edits on
the page itself**, keeps the CV **only on the device**, with **no paywall at the download**, and
reads and writes an **open format** the user can take elsewhere.

## Who it's for

Adults writing or updating a CV, in Poland first: a developer like the owner, someone after a long
break, a first-timer. On a laptop or a tablet for editing; on a phone to read and print. Many will
come back months later to update the same CV — so the project must still be there, and a file
exported then must still import.

## Principles

- **The sheet is the editor.** What you see is what prints. The interface sits around the sheet,
  never on it; editing marks disappear in print.
- **The CV stays on the device.** No account, no server, no analytics; export and import are local
  files ([security.md § Trust model](standards/security.md#trust-model)).
- **Nothing is ever lost.** Every change is saved without a button; undo covers every action;
  deleting a project asks first; a saved project from an older version of the site still opens.
  The site reminds the user that browser storage can be cleared, and offers the export as the
  backup.
- **The format is open.** Export is valid JSON Resume another tool can read; import takes any valid
  JSON Resume. What the standard lacks (section order, hidden sections, the template, a RODO
  clause) lives in its extension points — `meta`, and the `custom` namespace the current schema
  documents for tools — which other tools ignore.
- **Simple formatting only.** Bold, italic and links inside a text, bullet lists where the format
  has lists (`highlights`). No fonts, sizes or colours per word: the template decides the look.
- **Logic in the store, rendering in React (owner).** See
  [architecture.md § Rendering](standards/architecture.md#rendering).
- **Honest tips.** Each tip says what to do and traces to the owner's notes or a source; no
  invented statistics, no promises of a job, no fear.
- **Light theme only** (owner).

## In and out of scope

| In                                                                           | Out                                                                    |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Editing on the A4 sheet; adding, moving, hiding, deleting sections and items | A form-and-preview editor; drag-and-drop page layout; free positioning |
| Bold, italic, links, bullet lists                                            | Fonts, sizes or colours per word; tables; images inside text           |
| Projects in browser storage; autosave; undo                                  | Accounts, sync, cloud storage, share links that upload the CV          |
| Import and export of JSON Resume; print to PDF                               | Reading a PDF or a Word file (an Investigate later, if ever)           |
| One template; the data shaped so others can follow                           | A template marketplace, user CSS                                       |
| Tips from the owner's notes and cited sources                                | AI writing, scoring, "ATS score" numbers                               |
| The RODO consent clause as an optional block (Polish CVs)                    | Cover letters, job tracking, interview prep                            |

## The editor (proposed)

1. **The project bar**, top: the project's name (editable), its save state in words
   ("Zapisano"), **Nowy**, **Otwórz** (the list of projects on this device), **Importuj**,
   **Eksportuj** (JSON), **Drukuj / PDF**, and a menu for duplicate, rename, delete.
2. **The sheet**, centre: the template rendering the CV, every text editable in place. Hovering or
   focusing a section shows its controls: add an item, move up or down, hide, delete. Between
   sections: **Dodaj sekcję** with the sections the format knows (work, education, skills,
   languages, projects, interests, …) not yet on the CV.
3. **Tips**, beside the sheet on a wide screen, under it on a narrow one: the tips for the section
   with focus, dismissible; a general list when nothing has focus.
4. **First visit:** a sample CV to edit, or an empty one, or an import.
5. **Keyboard:** Tab moves through fields in reading order; Enter in a list adds the next item;
   Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z undo and redo; Ctrl/Cmd+B and I bold and italic.

## Site map (proposed)

| Page       | URL (proposed) | Holds                                                |
| ---------- | -------------- | ---------------------------------------------------- |
| The editor | `/`            | The project bar, the sheet, the tips                 |
| Porady     | `/porady/`     | Every tip in one place, readable without the editor  |
| Prywatność | `/prywatnosc/` | Where the data lives, how to back it up and clear it |
| O stronie  | `/o-stronie/`  | Whose site, the format, the source code              |

## Open questions

Each for the spec, with a recommendation first.

1. **The format.** JSON Resume, the version pinned in the spec, extensions in `meta`/`custom` (recommended: the only open format with a
   real ecosystem — 200+ themes, a CLI, importers in Reactive Resume and others; the schema moved
   to the `jsonresume/jsonresume.org` monorepo in June 2026 but is maintained) · Reactive Resume's
   own schema (design-centric, one app's) · Schema Resume (JSON-LD, one maintainer, little
   adoption). [research/formats.md](research/formats.md).
2. **Storage.** IndexedDB for projects, one record each, with a schema version (recommended:
   asynchronous, room for a photo, `navigator.storage.persist()` asks the browser not to evict it)
   · `localStorage` (simpler, ~5 MB, synchronous, blocks the page on every save of a big CV).
   Either way the store's persistence sits behind one module, so the choice can change.
3. **Interface language.** Polish interface, the CV's own section titles in the CV's language
   (`meta` holds it; Polish and English to start) (recommended: the owner's audience is Polish, and
   Polish CVs need the RODO clause; many still write in English) · Polish only · Polish and English
   interface.
4. **Two pages.** The sheet grows a second A4 page when the content overflows, shown as two sheets
   (recommended; the owner's notes say one page is the target, so the overflow is shown as a tip,
   not blocked) · one page, fixed · free length.
5. **Photo.** No photo in v1 (recommended: the owner's notes say "should not include" unless the
   industry requires it; a photo needs `img-src blob:` in the CSP and a size cap) · an optional
   photo, stored with the project.
6. **Rich text.** A Markdown subset inside the strings — `**bold**`, `*italic*`, `[link](url)` —
   rendered by the template as React elements (recommended: JSON Resume says summaries may carry
   inline Markdown, other tools read it; no `innerHTML`, so Trusted Types stay on) · plain text only
   · HTML strings (Reactive Resume's way; needs a sanitiser and breaks the CSP's Trusted Types).
7. **Inline editing mechanics.** `contenteditable="plaintext-only"` per field, formatting applied by
   the store to the Markdown source (recommended; to prove in an Investigate first — caret,
   selection, IME, paste, undo, screen readers) · a `<textarea>` that appears in place on focus ·
   a rich-text library (ProseMirror, Lexical — heavy, against "native first").
8. **PDF.** The browser's print to PDF from `@page` A4 CSS (recommended: real text, links work,
   no library, no server) · a PDF library in the browser (hundreds of KB, its own layout engine).
9. **Name and domain.** `cv.jakub.page` (recommended: the jakub.page family) · its own domain. The
   name: something plain ("Edytor CV", "Kartka CV") — the owner's pick.
10. **Tips — where they come from.** The owner's `cv.md` as the first set, each tip one or two
    sentences, more from cited sources later (recommended) · a larger set written up front.
11. **The template's look.** Decided on a rendered sample, two or three variants against the owner's
    2023 CV (`autioch/json-resume-template`) — one or two columns, one accent colour, which face.
12. **Fields the owner's CV needs that JSON Resume lacks.** A subheading inside work ("Experience
    in previous companies"), a "simple" variant that merges jobs, the RODO clause — `meta` fields or
    left out of v1.
