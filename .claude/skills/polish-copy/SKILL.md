---
name: polish-copy
description: Write or edit visitor-facing Polish text for the CV editor (a tip, a label, a button, an empty state, a help or privacy page, a meta description, the sample CV) so it reads like a person wrote it, not a language model. Use before writing any text that ships in src/, and to review a draft.
---

# Polish copy that doesn't read as AI

The site is a tool for adults writing their CV, often under some stress: a job lost, a first job,
a change of field. Text that reads like a chatbot — or like a career-coaching ad — loses their
trust, and a CV tool that writes like a chatbot invites its users to do the same. This skill is
built on Wikipedia's field guide [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
(WikiProject AI Cleanup), carried over to Polish. Its own warning applies here too: **the signs are
symptoms, not the problem.** Scrubbing words from a hollow text leaves a hollow text. Start from
facts, then write; check the signs last.

## 1. Before writing

- **Know what you are saying.** A tip says what to do and why, in a sentence or two ("Daty
  w jednym formacie: 2021.05 – 2023.12"). A sentence with no fact in it ("Twoje CV to Twoja
  wizytówka") is cut, not reworded.
- **Every tip traces to the owner's notes** (`autioch/recruitment-notes`) **or a source you have
  read** ([sources.md](../../../docs/sources.md)). No source → no tip. Never invent a statistic
  ("rekruter patrzy na CV 6 sekund"), a study or an "expert". Never write around a gap.
- **Who reads this part?** Someone with their CV half-written. Say what to do on the sheet, now.
  No promises of a job, no "wyróżnij się z tłumu", no fear ("90 % CV trafia do kosza").
- **Labels are short and the same everywhere** ([styling.md § Words](../../../docs/standards/styling.md#words)):
  a button is a verb ("Dodaj pozycję", "Eksportuj"), a section is a noun ("Doświadczenie").
- **The user's own text is theirs.** Placeholders and the sample CV show the shape of an entry,
  never put words in the user's mouth as if they were good ones.

## 2. Words that give a model away

Avoid these, above all when two or more land close together. One alone is not a crime; a cluster
is the tell.

| Avoid                                                                                                                         | Write instead                                      |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| kluczowy, istotny, ważny, niezwykle ważny, odgrywa kluczową rolę                                                              | say what it does: "rekruter szuka dat i nazw firm" |
| stanowi, pełni funkcję, służy jako, jawi się jako, reprezentuje                                                               | jest, ma                                           |
| bogaty, barwny, fascynujący, niezwykły, wyjątkowy, magiczny, niezapomniany, ponadczasowy, aromatyczny, wyborny, rozgrzewający | a concrete detail instead of the adjective         |
| świadectwo, dziedzictwo, trwały ślad, głęboko zakorzeniony, wpisał się na stałe                                               | the fact: who, when, where                         |
| ponadto, dodatkowo, co więcej, warto zauważyć, warto podkreślić, należy pamiętać, nie bez powodu                              | nothing — or "i", "też", a new sentence            |
| podkreślając, odzwierciedlając, przyczyniając się do, sprawiając, że… (trailing "-ąc" clauses)                                | a separate sentence, or cut                        |
| w dzisiejszych czasach, w erze, w świecie, gdzie…, na przestrzeni wieków                                                      | a date or nothing                                  |
| związany z, w związku z, powiązany z (vague link between two things)                                                          | the actual relation: "pracodawca wymaga…"          |
| eksperci uważają, wielu twierdzi, mówi się, źródła podają                                                                     | name the source, or drop the claim                 |
| idealny, doskonały, perfekcyjny, gwarantuje sukces, wymarzona praca, wyróżnij się                                             | what the reader gets: "jedna strona A4"            |
| praktyczny, jasny, przejrzysty, solidny, niezawodny, po cichu (the newest models' favourites)                                 | show it                                            |

## 3. Shapes that give a model away

- **Negative parallelism**: "To nie tylko CV, to Twoja historia", "nie chodzi o X, lecz o Y". Say
  the thing once.
- **Rule of three**: three adjectives, three parallel clauses, "profesjonalne, nowoczesne i przejrzyste"
  on every template. Use a list of three only when there are exactly three things.
- **Inflated significance**: telling the reader something matters instead of showing it
  ("dobre CV odgrywa kluczową rolę w rekrutacji"). Drop it or give the fact.
- **Tidy endings**: a paragraph or a page that ends by restating itself — "Podsumowując…",
  "Jak widać…", "Powodzenia!". End on the last fact or step.
- **Challenges-and-future sections**: "Mimo wyzwań…", "Przyszłość rekrutacji". Not here.
- **Elegant variation**: cycling synonyms for one thing (CV → życiorys → resume → dokument).
  Repeat the right word. The site's words are fixed in
  [styling.md § Words](../../../docs/standards/styling.md#words).
- **Uniform rhythm**: every sentence 10–15 words, same shape, full stop after full stop. Real text
  mixes a short sentence with a longer one that carries a clause.
- **Hedging and chat leftovers**: "Mam nadzieję, że to pomoże", "Oczywiście!", "Warto wiedzieć,
  że…", "Pamiętaj, że…" at the start of a tip.
- **Promises about the future**: "wkrótce", "już niedługo", "będzie tu", "W budowie", "pracujemy
  nad". The site reads as finished.
- **A heading per two sentences**, or a heading that names a category ("Znaczenie kulturowe",
  "Ciekawostki i wyróżnienia"). A heading says what the reader will find.
- **Advertising tone**: "Stwórz CV, które zachwyci", "w 5 minut", "zdobądź pracę marzeń". The
  site is a tool, it doesn't sell a job.

## 4. Typography and markup

- **Dashes**: Polish uses the spaced en dash ( – ) as myślnik — and sparingly; a comma, a colon or
  brackets usually do better. More than one dash per paragraph is a smell. Never the em dash in
  visitor text. Ranges: "2–3 tygodnie" (en dash, no spaces).
- **Quotes**: Polish „…” outside, «…» inside. Never "…" or straight quotes in visitor text.
- **No bold for emphasis** in running text; bold only for a term being defined, once. No bold
  run-in labels at the start of every list item unless the list is a glossary.
- **No emoji**, no decorative bullets, no Title Case (Polish headings are sentence case anyway).
- **A one-letter word (a, i, o, u, w, z) never ends a line** in a heading or a short line:
  `&nbsp;` after it.
- Numbers: digits, a no-break space before a unit ("1 strona", "A4"); a date range with an en dash
  and spaces when the ends have more than one part ("2021.05 – 2023.12").

## 5. What human text has

- Plain verbs: dodaj, usuń, przenieś, zapisz, wpisz, skróć.
- Concrete nouns and numbers: "jedna strona A4", "3–5 punktów pod stanowiskiem".
- Ordinary connectives used normally: "bo", "więc", "ale", "a", "potem".
- An opinion only when it's the owner's and marked so — never an invented personal story.
- Variation: a short sentence after a long one; a list only where the content is a list.
- For a tip: the imperative, one action ("Zacznij od ostatniej pracy"), the reason after it if it
  isn't obvious. Respectful, never patronising; no exclamation marks.

## 6. Check before committing

Read the draft against this list. Fix, then reread once aloud (in your head) as the reader:

1. Every sentence carries a fact or an action. Any that don't → cut.
2. Every tip → the owner's notes or a source you read, listed in sources.md.
3. Search the draft for the table in § 2 and the shapes in § 3; more than one hit per paragraph →
   rewrite the paragraph, don't swap words.
4. Dashes: count them. Quotes: „…”. Bold: none in running text.
5. Last sentence of each section: is it a summary of the section? → delete it.
6. Same noun for the same thing throughout (styling.md § Words).
7. Could someone writing their first CV act on it, the sheet in front of them?

No check makes a text human by itself. If after the checks the text still reads like a brochure,
the problem is in step 1: there were no facts to tell.
