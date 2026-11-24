# Comparison — what other CV editors have

Research input, November 2026, for the owner's review: not rules and not agreed work. What other
editors do, set against what [vision.md](../vision.md) plans. Rows are numbered (A1, B5…) so a
review can point at them. Each tool was read from its home page and, where it loaded, its builder,
pricing or FAQ; most builders render only with scripts, so their editors themselves were mostly
**not** read — the "?" marks say so.

Key: ✓ has it · ~ partly · – no · ? not read or couldn't tell. **Take?** is the agent's proposal,
for the owner to pick: **yes**, **maybe**, **no**, **later** (agreed for after v1), or **planned**
(the vision already has it).

## The gap

**Nobody edits on the page.** Every editor read is a form (or a Markdown source) beside a live
preview; a4cv shows the A4 page live, but still from a form. Clicking the line on the sheet and
typing over it — the owner's idea — wasn't found anywhere.

**Local-only, free and no-account is rare, and nobody pairs it with an open format.** Of 15 tools,
four keep the CV in the browser without an account (OpenResume, Oh My CV, a4cv, the JSON Resume
CLI as files). None of them reads or writes JSON Resume; Reactive Resume imports it but needs an
account on its server.

**The paywall sits at the download.** InterviewMe (5,95 zł for a trial that renews), GenerujCV
(PDF paid), Novoresume (branded free PDF, one page, downloads gated on Pro features), Kickresume
(subscription with a countdown "57 % off"), FlowCV (one CV free). The free and honest ones (cvmake,
MojCV) pay with ads and keep the CV on their server.

**Losing the CV is the local tools' weak spot.** a4cv's and Oh My CV's own FAQs warn that clearing
the browser deletes the CV. None found prompts a backup.

## The tools

| Code | Tool                                                         | Kind                                                                            | Read                                                                                                     |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| RR   | [Reactive Resume](https://rxresu.me)                         | Open source (MIT), free, donation-funded; hosted with an account or self-hosted | home, [docs](https://docs.rxresu.me/)                                                                    |
| OR   | [OpenResume](https://www.open-resume.com)                    | Open source, free, local storage                                                | home, [builder](https://www.open-resume.com/resume-builder) (labels only)                                |
| OM   | [Oh My CV](https://ohmycv.app)                               | Open source (GPL-3.0), Markdown, local                                          | home, [GitHub](https://github.com/Renovamen/oh-my-cv)                                                    |
| A4   | [a4cv](https://a4cv.app/pl/)                                 | Polish, free, closed source, local                                              | home, [FAQ](https://a4cv.app/pl/faq/), [szablony](https://a4cv.app/pl/templates/); builder didn't render |
| FC   | [FlowCV](https://flowcv.com)                                 | Freemium, account                                                               | home, [pricing](https://flowcv.com/pricing)                                                              |
| JR   | [JSON Resume](https://jsonresume.org)                        | The format's own site: Gist hosting, CLI, themes                                | home, getting started, apps                                                                              |
| CM   | [cvmake.pl](https://cvmake.pl/)                              | Polish, free, ad-funded; account optional                                       | home, [kreator](https://cvmake.pl/kreator)                                                               |
| MC   | [MojCV](https://mojcv.com)                                   | Free, ad-funded, 34 languages, private link instead of an account               | home, [pricing](https://mojcv.com/en/pricing)                                                            |
| NR   | [Novoresume](https://novoresume.com)                         | Freemium, account                                                               | home, [pricing](https://novoresume.com/pricing)                                                          |
| KR   | [Kickresume](https://www.kickresume.com)                     | Freemium, account                                                               | home (truncated)                                                                                         |
| EP   | [Europass](https://europass.europa.eu/en/create-europass-cv) | EU, free, profile account                                                       | the CV page                                                                                              |
| IM   | [InterviewMe](https://interviewme.pl)                        | Polish, paid download                                                           | not read (503); price from [its own article](https://interviewme.pl/blog/darmowe-kreatory-cv)            |
| GC   | [GenerujCV](https://generujcv.com/)                          | Polish, paid PDF from 19,99 zł                                                  | search result only                                                                                       |

**Not read** — tried, and the reason: Pracuj.pl kreator (403), Canva resumes (403), Zety (503
twice), InterviewMe (503 twice), the Europass editor (another host), every builder that renders
only with scripts (a4cv, Oh My CV's dashboard, FlowCV's app, RR's editor).

## A — the whole tool

| #   | What                                       | RR  | OR  | OM  | A4  | FC   | CM  | MC  | NR  | KR  | EP  | Plan / take?                                                                                   |
| --- | ------------------------------------------ | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | ---------------------------------------------------------------------------------------------- |
| A1  | Edit inline on the page                    | –   | –   | –   | –   | –    | –   | –   | –   | ?   | ?   | **planned** — the point of the site                                                            |
| A2  | Live preview of the real page              | ✓   | ~   | ✓   | ✓   | ✓    | ✓   | ✓   | ?   | ?   | ?   | **planned** (the sheet is the preview)                                                         |
| A3  | No account needed to edit and download     | –   | ✓   | ✓   | ✓   | –    | ✓   | ✓   | –   | –   | –   | **planned**                                                                                    |
| A4  | Data only in the browser                   | –   | ✓   | ✓   | ✓   | –    | ?   | –   | –   | –   | –   | **planned**                                                                                    |
| A5  | Autosave                                   | ✓   | ?   | ?   | ?   | ✓    | ✓   | ?   | ✓   | ?   | ?   | **planned**; and say it in words ("Zapisano"), as cvmake does                                  |
| A6  | Version history                            | ✓   | –   | –   | –   | –    | –   | –   | –   | –   | –   | **maybe** — undo in v1; snapshots per project later                                            |
| A7  | Several CVs, duplicate one for another job | ✓   | –   | ✓   | ?   | ~    | ✓   | ✓   | ~   | ?   | ?   | **planned** (the project bar); duplicate — **yes**                                             |
| A8  | Export JSON                                | ✓   | ?   | –   | ✓   | –    | –   | –   | –   | –   | ?   | **planned** — JSON Resume                                                                      |
| A9  | Import JSON Resume                         | ✓   | –   | –   | –   | –    | –   | –   | –   | –   | –   | **planned**                                                                                    |
| A10 | Import PDF / DOCX                          | ✓   | ✓   | –   | –   | ✓    | ✓   | –   | –   | ?   | ?   | **no** for v1 — parsing a PDF in the browser is a project of its own; **later** to investigate |
| A11 | Export DOCX                                | ✓   | –   | –   | –   | –    | ✓   | ~   | –   | ?   | ?   | **later** — a Polish recruiter sometimes asks for Word                                         |
| A12 | PDF with real text, links working          | ✓   | ✓   | ✓   | ✓   | ✓    | ✓   | ✓   | ✓   | ✓   | ?   | **planned** — print to PDF                                                                     |
| A13 | Templates                                  | 18  | 1   | ?   | 5   | 100+ | 15  | 33  | 16  | 40+ | ?   | **planned**: 1 at start (owner), switching keeps content (A4, MC do so)                        |
| A14 | A4 and US Letter                           | ✓   | ✓   | ✓   | A4  | ?    | ?   | ?   | ?   | ?   | ?   | **A4 only** — the audience is in Europe; Letter later, maybe                                   |
| A15 | Paywall, watermark or trial at download    | –   | –   | –   | –   | ~    | –   | –   | ✓   | ✓   | –   | **no**, ever — say so on the page                                                              |
| A16 | Ads                                        | –   | –   | –   | –   | –    | ✓   | ✓   | –   | –   | –   | **no**                                                                                         |
| A17 | AI writing or rewriting                    | ~   | –   | –   | –   | ✓    | ✓   | ~   | ✓   | ✓   | –   | **no** — needs a server and sends the CV away                                                  |
| A18 | "ATS score" or checker                     | ✓   | –   | –   | –   | –    | ~   | –   | ✓   | –   | –   | **maybe** — a local checklist (dates, length, empty fields), no score                          |
| A19 | Polish interface                           | ?   | –   | ?   | ✓   | ?    | ✓   | ✓   | ?   | ?   | ✓   | **planned** (proposed)                                                                         |
| A20 | Open source                                | ✓   | ✓   | ✓   | –   | –    | –   | –   | –   | –   | –   | **maybe** — the repo is the owner's call; MIT is already in it                                 |
| A21 | Backup prompt (export, `persist()`)        | –   | –   | –   | –   | –    | –   | –   | –   | –   | –   | **yes** — the local tools' weak spot (the gap above)                                           |
| A22 | Works offline once loaded                  | ✓   | ?   | ✓   | ?   | –    | –   | –   | –   | –   | –   | **later** — a service worker is a decision of its own (architecture.md § Hosting)              |

## B — while editing

| #   | What                                         | Seen at                 | Take?                                                                                                  |
| --- | -------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| B1  | Tips per section, short, beside the field    | CM, OR                  | **planned** — cvmake's "Wybierz 4–8 umiejętności", "Zacznij od ostatniego miejsca pracy" are the model |
| B2  | Click-to-insert drafts and phrase libraries  | CM, KR (20 000 phrases) | **no** — the user's words are theirs (polish-copy § 1); a sample CV shows the shape instead            |
| B3  | Opinions on what to leave out (photo, age)   | OR                      | **planned** — the owner's `cv.md` § Should not include                                                 |
| B4  | Sections: move, hide, delete; custom section | RR, OR                  | **planned**: move, hide, delete; custom section — **maybe** (JSON Resume has none built in)            |
| B5  | Font-size presets (compact, standard, large) | OR                      | **maybe** — one control that keeps the CV to one page                                                  |
| B6  | Page fill or overflow shown                  | OM (auto-pagination)    | **yes** — "druga strona" shown as a second sheet, with the one-page tip                                |
| B7  | Line-level checker                           | RR                      | **maybe** — see A18                                                                                    |
| B8  | Sample CVs by profession                     | MC, KR                  | **maybe** — one sample CV in v1                                                                        |
| B9  | Photo, cropped to the template's shape       | CM, EP                  | **no** for v1 (vision.md § Open questions 5)                                                           |

## C — Polish specifics

| #   | What                                                                  | Seen at   | Take?                                                                           |
| --- | --------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------- |
| C1  | RODO consent clause, added at the foot, editable, can be switched off | CM        | **yes** — the owner's 2023 template prints one; the wording from a cited source |
| C2  | Separate guidance for a Polish and an English CV                      | CM        | **yes** — the CV's language switches the section titles and the clause          |
| C3  | Dates as `2021.05 – 2023.12`                                          | the owner | **planned** — the owner's `cv.md` § Experience                                  |

## Ideas from the owner's earlier work

- **`autioch/recruitment-cv-editor` (2018, React + Redux):** a reducer per section, rankings for
  skills ("Enable rankings"), and the same plan — export to JSON and Word, projects in
  `localStorage` — left unfinished. Take: the section list, skill levels as dots or a scale (the
  owner's notes: "a common points/bullets/star system"), not the code.
- **`autioch/json-resume-template` (2023, React):** JSON Resume read by components (`Headline`,
  `Contact`, `ItemList`, `Work`, `Skill`…), two columns, a `simpleWork` switch that merges jobs, a
  subheading inside work, the RODO clause. Take: the component split and the look as the first
  template's starting point, against the owner's review notes in its history.
- **`autioch/recruitment-notes` `cv.md`:** the tips' first source — one page, the same date
  format, most recent first, what to include and leave out, design (white, near-black, one accent,
  one or two fonts, no borders, space between sections), CEFR for languages.
