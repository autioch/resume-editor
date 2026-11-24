# Formats — which standard for the CV's data

Research input, November 2026, for the owner's review: not rules. The question: which data format
the editor saves, imports and exports, and every template reads
([vision.md § Open questions](../vision.md#open-questions) 1). Each format was read from its own
site or repository; what couldn't be verified says so.

## The verdict (proposed)

**JSON Resume**, with the editor's own data in the schema's extension points. It is the only open
CV format with a living ecosystem — hundreds of themes, a CLI, importers in other editors — and its
shape is what the owner's 2023 template already reads (`autioch/json-resume-template`). Nothing
newer has replaced it: the candidates since are one app's own schema (Reactive Resume), a JSON-LD
variant with one known user (Schema Resume), a PDF generator's input (RenderCV), or HR-system
standards not aimed at a person's own CV (HR Open, Europass).

The one change to know: the schema's repository `jsonresume/resume-schema` was **archived on
12 June 2026** and moved into the `jsonresume/jsonresume.org` monorepo (`packages/schema`). The
project is alive (MIT, volunteers since 2014); the spec pins the schema by its version and keeps a
copy in this repo for validation, so a move upstream can't break the editor.

## The formats

| Code | Format                                                              | Maintainer, status                                                                               | Shape                                                                                         | For this editor                                                                                         |
| ---- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| JR   | [JSON Resume](https://jsonresume.org/schema)                        | Community, MIT; schema page reads "version 1.11.0"; repo moved June 2026                         | JSON Schema draft-07; 14 sections, every one optional; `additionalProperties` true throughout | **Recommended.** Open, validatable, themes and tools read it; extensions in `meta` and `custom`         |
| RR   | [Reactive Resume](https://docs.rxresu.me/guides/json-resume-schema) | One app (MIT); its docs say "Reactive Resume's own format, not the community JSON Resume format" | JSON Schema 2020-12; `basics`, `sections`, `customSections`, `metadata`; rich text as HTML    | Design-centric, tied to one app's templates; HTML strings need a sanitiser. Import from it later, maybe |
| SR   | [Schema Resume](https://schema-resume.org/)                         | One maintainer (GitHub `tradik`), MIT; v1.3.3, versioned URLs                                    | JSON-LD (`@context`) and XML/XSD; converts from JSON Resume                                   | One known user (JobTailor); whether it's a strict superset of JR is unverified                          |
| RC   | [RenderCV](https://github.com/rendercv/rendercv)                    | Active project, MIT, ~18k stars                                                                  | YAML: `cv`, `design`, `locale`; to PDF via Typst                                              | A PDF generator's input with its design in it, not an interchange format. An export target later, maybe |
| HO   | [HR Open Standards](https://hropenstandards.org/)                   | Industry body; Trusted Career Profile (ex LER-Resume) announced January 2026, labelled 4.5 RC    | HR-JSON/HR-XML libraries, downloads under an IP agreement                                     | For ATS and HR systems; licence and format unread. No                                                   |
| EU   | [Europass](https://europass.europa.eu/)                             | European Commission                                                                              | An online profile and CV editor; no open CV schema found on the site                          | No public interchange format verified. No                                                               |
| FR   | FRESH / FRESCA                                                      | The domain (fluentdesk.com) is parked                                                            | —                                                                                             | Dead, as far as could be seen. No                                                                       |

## JSON Resume, in the detail the spec needs

From the [schema page](https://jsonresume.org/schema) and the
[schema file](https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/schema.json):

- **Sections:** `basics` (with `location` and `profiles`), `work`, `volunteer`, `education`,
  `awards`, `certificates`, `publications`, `skills`, `languages`, `interests`, `references`,
  `projects`, plus `meta` and `custom`. The page also lists `objective`.
- **Lists inside items:** `work[].highlights`, `education[].courses`, `skills[].keywords` — string
  arrays, the bullet lists of the template.
- **Dates:** ISO 8601, partial allowed — `YYYY`, `YYYY-MM`, `YYYY-MM-DD`. An open end is no
  `endDate`. The owner's 2023 file writes `"endDate": "present"`, which the pattern rejects: the
  import tolerates it, the export never writes it.
- **Rich text:** the page says `summary` fields may carry inline Markdown (no headings, lists or
  tables) — which fits the proposed bold/italic/link subset.
- **`meta`:** `canonical`, `version`, `lastModified`, and per the page `language` (BCP 47, one
  document per language) and `translations`. The CV's language goes here.
- **`custom`:** a namespace for tools, which themes aren't expected to render — the place for the
  editor's own state (section order, hidden sections, the template, the RODO clause).
- **Not in the format:** section order, a section's own title, a subheading inside a section,
  hidden items, a photo as a file (only `basics.image`, a URL).

## What the owner's 2023 file does differently

`autioch/json-resume-template` `src/resume.json` is JSON Resume with three departures the import
must handle: `work[].summary` as an array of strings (the standard has `summary` as a string and
`highlights` as the array), `"endDate": "present"`, and `null` for missing values. The template
also prints a RODO consent clause (`components/consent`) that has no field in the format.

## Not verified

- The npm package `@jsonresume/schema`'s latest version and date (npm answered 403); the search
  results also show 1.7.x on other pages. The spec pins a version from the source.
- Whether `objective` and `custom` are in the published schema file or only on the page.
- Reactive Resume's JSON Resume export (its import is documented).
- Europass's developer and interoperability pages; HR Open's format and licence.
