# Workflow — the paths

The paths the [routing table](../CLAUDE.md#what-to-do-when) sends you down. Nothing here is invoked;
it's what you do. Each path names its steps, its stopping points, and what it leaves behind.

**One rule spans all of them: when two paths fit, take the heavier one.** A change escalates
mid-flight; it doesn't balloon in place. Escalating is cheap — you keep the work and add the missing
steps. Discovering at close-out that a "small fix" reshaped a data model is not.

## Investigate

For an unproven idea, before any spec. **No app code.** The output is a **verdict**, delivered in
chat.

1. **Name the uncertainty** in one or two lines — the single question this answers. If you can't
   state it, the idea doesn't need investigating; it needs a spec.
2. **Check three axes, and stop as soon as one is decisive:**
   - **Product sense** — is this worth building? Comparable products, real user value, simpler
     alternatives that get most of the benefit.
   - **Experience** — how it must behave on the product's real surface and input modes.
   - **Technical viability** — does it work on this stack **and** the platform floor? Name specific
     support gaps; cite what you consulted.
3. **Lay out the options with trade-offs** and mark your recommendation.
4. **Give the verdict**: viable · viable with changes · not viable · needs more investigation.

**A recorded "no" is the point, not a failure.** Say why plainly and stop. Don't investigate your way
to a yes, and don't over-investigate — name what's still uncertain as an open question for the spec.

## Direct

A trivial durable-doc, rule, or config edit — a handful of lines carrying **no real judgment**.

1. Confirm it's genuinely trivial. **The moment it touches app code, adds behavior, or carries a
   judgment worth recording, switch to [Bounded](#bounded).** When in doubt, it's Bounded.
2. Make the edit, honoring the doc bar. If it changes a rule, sync any doc that restates it.
3. Gate green → branch → commit → [Close-out](#close-out) (draft PR).

No plan, no record beyond the PR.

## Fix

A bug. **Reproduce first, and the failing check is the point.**

1. **See it fail** — in the browser drive, the gate, or a header check against the deploy
   ([development.md § Testing](standards/development.md#testing)). Confirm it fails _for the right
   reason_; a fix for a bug you never saw proves nothing.
2. Fix until the same check passes.
3. Then the [Bounded](#bounded) close-out, or the [Feature](#feature) one if the fix turned out to be
   structural.

## Bounded

One well-bounded change touching a layer or two. **Default small visual work here.**

1. **Ground narrowly** — only the docs and source this change touches. Don't re-explore the repo.
2. **Pin the edges.** Ask only the blocking questions: exact behavior, placement, scope edges.
   Propose defaults grounded in the docs; skip what the request already answers. **If the answers
   reveal a new data model, several modules, or open product questions, stop and switch to
   [Feature](#feature).**
3. **Branch, state the approach, build.** Cut a branch from `main`. Tell the user the
   approach + the files you'll touch in a couple of lines — no plan document. Then make the change
   exactly as scoped, to the coding conventions and the platform floor. Verify any uncertain
   HTML/CSS/Netlify behaviour against its real docs rather than guessing. Commit freely with plain git.
4. **Verify** per [development.md § Testing](standards/development.md#testing): the gate; the rendered-look drive **with proof** for
   anything user-visible; the deploy check for headers and redirects. Flag anything the environment
   can't run.
5. **Close out** — see [Close-out](#close-out).

## Feature

A real feature: a new data model or contract, several modules, or open product questions.

### 1 · Agree the spec

The contract — _what_ and _why_, settled **before any code**. Elicit it: target user and problem,
exact behavior, in and out of scope, data-model changes, UI placement, platform constraints, i18n,
and **testable acceptance criteria**. Batch related questions; propose defaults grounded in the docs.

**Smallest coherent slice that delivers value** — enhancements go to the
[backlog](backlog.md), explicitly; the contract states only what gets built.
**Converge before recording**: play the spec back and iterate until you agree, then write it down.
This is the one artifact worth a file — `docs/plan.md` — because the build reads it back across
sessions.

### 2 · Plan it

Turn the agreed spec into **ordered, independently committable steps**, appended to the same file.
Default **bottom-up** so the tree is never broken: data/types → data layer → state → UI → wiring →
validation. Each step carries a **Goal**, a **Read** list (name files, not "the docs"), a **Change**
(paths + concrete edits), and a **Done-check** (the exact gate from [development.md § Testing](standards/development.md#testing)).

If anything blocks an unambiguous step, ask now and **record the resolution back into the spec** —
never silently assume. When the spec adds anything server-side or a third-party origin, threat-model
the spec's _own_ guarantees here, before sequencing: a design flaw is a blocking gap, not something to
plan around.

### 3 · Build

Cut the branch and **record the base ref** — the review pass reads the whole feature diff from there.
Then per step: read → change exactly what the step names, nothing extra → satisfy its Done-check →
sync the docs it touches → commit (plain git, no push). **The commit is the step's done-record** — no
tick marks in the plan file; `git log` is the source of truth for what's done.

Stop and ask rather than invent a product decision. Record the resolution, then continue.

### 4 · Review, then reconcile

The [review pass](#the-review-pass) over the feature diff, then:

**Reconcile the diff against the spec, both ways.** Spec → code: every acceptance criterion is built;
name where each lives. Code → spec: nothing in the diff is outside scope — no silently-added
behavior, option, or file the contract doesn't call for. On any divergence, **do not close out**:
fix to match the spec, or if the spec is what's wrong, ask, record, reconcile again.

### 5 · Close out

See [Close-out](#close-out), plus: run a **repo-wide doc reconcile** (the backstop for whatever the
per-commit syncs missed), move the spec's lasting product rules into
[vision.md](vision.md) (the product contract), and **delete `docs/plan.md`** — the durable record
is the PR and the git history.

## The review pass

Not a persona exercise — a set of **lenses you re-read the diff through**, one at a time, because a
single read finds one class of problem. Where the session has dedicated review tooling, use it here;
where it doesn't, do the passes by hand.

Run it over the whole diff since the base ref, as a bounded **review → fix → re-review loop**, capped
at **two loops** — file residual findings rather than chasing them.

| Lens               | Looks for                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scope**          | What shipped vs. what was agreed; unmet acceptance criteria; user actions with a missing outcome (dead-end, stale selection, no-op)            |
| **Security**       | Secrets, third-party origins, headers, client storage — **mandatory when the diff touches any of them** ([security.md](standards/security.md)) |
| **Correctness**    | Logic errors, edge cases, error paths, the round-trip actually round-tripping                                                                  |
| **Simplification** | Duplication, an abstraction earlier than its second use, mechanism more elaborate than the contract needs                                      |
| **Experience**     | The real surface and input modes; focus order; reachable targets; no dead ends                                                                 |
| **Coverage**       | Tests for what can silently break; which checks are still owed                                                                                 |
| **Operations**     | Cleanup, cascade deletes, anything unbounded; cost and quotas; production guards holding                                                       |

Rules that make it useful: **problems only** — a clean lens gets one "none", never a credit note.
**Every finding traces to a `file:line`.** And when asked to review, **flag; don't fix** unless the
user asked for fixes.

## Sync

Docs drifted, or code just changed.

1. **The code is the authority.** Audit each durable doc in scope against the actual current code,
   using the [doc-sync map](standards/development.md#keeping-docs-in-sync) to pick which. List every
   contradiction.
2. **Fix the drift and enforce the doc bar** — pointer-first, the current state and why, short.
   History, research notes and plans come out (a plan that's still agreed moves to the
   [backlog](backlog.md)). Fix what's wrong or stale, not what's merely arrangeable. Check each doc against its context budget; compress or
   flag overruns.
3. **If the doc is right and the code is the bug, flag it** — don't rewrite the doc to match a bug,
   and don't invent a product change to "fix" a doc. That's a [Bounded](#bounded) change.
4. Branch, commit, [Close-out](#close-out). If nothing drifted, say so and commit nothing.

## Cleanup

The owner asks for a cleanup ("porządki w kodzie", "clean up the code"). The gate, CI (axe-core)
and the weekly workflow already hold what a script can decide
([development.md](standards/development.md#conventions)); this pass is the rest. **Findings first,
fixes after the owner's OK.**

1. The last `Weekly` run in Actions — red is a finding. `npm run a11y`'s "needs review" items and
   the by-hand part of [development.md § Accessibility audit](standards/development.md#accessibility-audit).
2. `npm run check:weight -- --all` — every page against the budget; the heaviest is a finding when
   it nears one.
3. **Read the code** against [development.md § Code structure](standards/development.md#code-structure):
   one job per file, repetition, dead weight (unused props, single-use helpers, pass-through
   wrappers, comments that say what instead of why, docs that drifted — [Sync](#sync)). A
   structural fix keeps the build identical (compare `dist/`).
4. Report the findings ranked, each with its evidence and the fix you'd make. Fix only what the
   owner picks — [Bounded](#bounded), one PR.

## Close-out

The same ending for every path that changes the tree:

1. **Gate green.** Stage the change **and every durable doc it affects**.
2. **The PR description is the durable record** — what and why in a line or two, the headline
   decision (took X over Y) when one was made, and any owed-check note. Never link a working note —
   those are deleted.
3. **Owner-owed manual steps** — an account or setting in the Netlify UI, DNS, a live check only
   they can run — go in `docs/backlog.md` § Owner. It's their queue, not yours.
4. **Push, open a lean draft PR** for the owner to look at; on their "merge", mark it ready and CI
   merges it on green. See [Committing](#committing).
5. **One line back**: the PR or commit, the gate result, and anything still owed. No summary.

## Committing

- **Branch per unit of work**, cut from `main` before the first commit, on every path. Nothing is
  committed straight to `main`.
- **During work, plain git, no push.** Commit freely; never leave the tree broken — run the gate
  before each commit (there are no git hooks: the gate already runs before every commit, and CI
  backs it).
- **Close-out: push once** — every push runs CI (2–3 billed minutes of the private repo's monthly
  quota); follow-ups on an open PR (review fixes, the owner's next asks) go up together, once the
  batch is done, not commit by commit. Then open a **lean draft PR** (the diff-scoped
  review surface + audit trail, not a report). CI checks drafts and Netlify builds a deploy preview
  for site changes, so the owner can look. The owner says "merge" → mark it ready; the
  `Merge on green` job in `ci.yml` squash-merges it once the Gate passes and deletes the remote
  branch (`--delete-branch`: GitHub's own auto-delete doesn't fire for the Actions token). Asked to
  merge right away → open it ready (no `--draft`). Don't merge by hand (that skips the Gate); GitHub's own auto-merge needs Pro on a private repo, hence the job. Tool by session
  ([CLAUDE.md § Git](../CLAUDE.md#git)): desktop `gh pr create --draft` / `gh pr ready`; cloud the
  built-in `create_pull_request` (`draft: true`) / `update_pull_request` (`draft: false`).
- **Before cutting a branch, clear the merged ones:** `git switch main`, `git pull --prune`, then
  `git branch -D` each local branch whose upstream shows `[gone]` in `git branch -vv` — a squash
  merge isn't an ancestor of `main`, so `-d` refuses. Never a branch with no upstream (unpushed
  work).
- **Dependency PRs** — security fixes for production dependencies only (owner):
  Dependabot's version updates are off (`.github/dependabot.yml`); its security updates open a PR
  when an advisory lands on `dependencies`. CI checks it but the merge job doesn't merge it — a
  Dependabot-triggered run gets a read-only token: merge by hand once green. Development tools and
  actions are bumped on purpose, when a change needs it. `npm audit --omit=dev` (weekly) is the
  check that production is clean.
- **Red CI → fix-forward on the same branch.** A flake → re-run it; a real failure → fix the cause
  and re-push. The work isn't closed until the green merge, so a CI failure never reopens anything.
- **CI is the authority** — it re-runs the gate on every PR and push to `main`.
- Conventional Commits subjects.

## Returning

The first session after a break re-establishes a green baseline before touching anything else —
a **Bounded** change of its own, one PR, ahead of the work that brought you back:

1. `npm ci`, then `npm run ci` — does the gate still pass on today's tools and registries?
2. Check the last Weekly runs and any open Dependabot alerts — what broke while nobody watched.
3. Bump Node (`.nvmrc`; stay on an LTS line), the dependencies and the pinned action SHAs, per the
   [version rules](standards/development.md#conventions); re-run the gate after each.

## Handing off

Long sessions fill the context window and degrade. At a **clean boundary** — a close-out, or between
steps — when context is saturating or the user asks, **stop there rather than pushing on degraded**.
Durable state is already persisted (git + the PRs + `docs/plan.md`), so a handoff loses nothing.

Emit a **ready-to-paste next-session prompt** — the prompt itself, not advice to restart. Three
pointer blocks: **Mandate** (the task + the rules it resumes under), **State** (branch, last commit
or open PR, the plan file, what's mid-flight), **Next** (1–3 candidates, each with a one-line why).
Pointers, not prose — and **don't save it to a file**; state changes every handoff, so a saved copy
only rots.
