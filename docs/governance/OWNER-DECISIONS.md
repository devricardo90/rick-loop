# Owner Decision Record — CANONICAL

> **This file is the single source of truth for owner decisions in Rick Loop v2.**
>
> No other document may state, restate, summarise or re-decide OD-1 … OD-5.
> Every other artifact — the foundation plan, the milestone criteria, the
> governance exception, `STATE.md` when it is seeded at M1 — **points here** and
> does not carry a copy.
>
> This rule is not tidiness. The defect class this project exists to correct is
> *a pointer advancing while its explanation stays behind* (FINDING-001,
> 18 occurrences). A decision recorded in two places is that defect waiting to
> happen, and a decision recorded in two places that disagree is that defect
> having happened.

Decisions the loop could not make for itself. Each records the decision, when it
was taken, what it blocks, and the alternatives that were rejected — so that a
later reader can tell a decision from a default.

Recorded at M0, 2026-09-20.

| # | Subject | Status | Blocks |
| --- | --- | --- | --- |
| OD-1 | Source register disposition | `RESOLVED` | M4 |
| OD-2 | Independent reviewer identity | `RESOLVED` | AC-10, M9 |
| OD-3 | Review budget | `RESOLVED` | AC-10; constrains M1–M5 |
| OD-4 | Distribution shape | `RESOLVED` | M3 |
| OD-5 | RecompraCRM read-only scope | `RESOLVED` — future OD-6 named | Standing constraint |

**Roadmap authority:** the milestone sequence M0–M9 lives in
`docs/foundation/RICK-LOOP-V2-FOUNDATION-PLAN.md` §7 and nowhere else. This file
records decisions; it does not define milestones, and no roadmap is created
alongside it.

---

## OD-1 — Source register disposition

**Decision: import the 170 source lines as a read-only historical fixture.**
v2's own register starts empty under the new schema.

| Field | Value |
| --- | --- |
| Status | `RESOLVED` |
| Decided | 2026-09-20, M0 |
| Blocks | M4 (register schema) |
| Matched recommendation | Yes |

**Rejected:** starting empty with no import — the 282-key / 1-severity evidence
base would then live only in the source repository, forcing C3's regression
fixtures to be synthesised rather than real. **Rejected:** normalising the 170
lines into the v2 schema — 120 findings carry no severity, so migration would
manufacture severities that were never assigned, rewriting history to fit a
schema that postdates it.

**Binding consequence:** the fixture is **read-only**. No process may append to
it, rewrite it, or backfill severity into it. It is evidence, not a register.

---

## OD-2 — Independent reviewer identity

**Decision: Claude review workflow as primary, the existing Codex connector as
secondary.** Two distinct identities, both independent of the PR author.

| Field | Value |
| --- | --- |
| Status | `RESOLVED` |
| Decided | 2026-09-20, M0 |
| Blocks | AC-10 (self-hosting), M9 |
| Matched recommendation | Yes |

**Rejected:** a single reviewer, in either direction. Source PR #40 is the
evidence: the secondary reviewer published a clean verdict on the exact HEAD
while a second independent reviewer held an unresolved P1 against that same
HEAD, and the gate correctly refused. A single reviewer cannot reproduce that.

**Already demonstrated in this repository:** the Codex connector reviewed PR #1
independently and filed a P1 that would otherwise have shipped — a
configuration surface capable of disabling the author-independence rule. The
two-reviewer pattern earned its place here before it was formally decided.

---

## OD-3 — Review budget

**Decision: $40 cap, revisited at M5.**

| Field | Value |
| --- | --- |
| Status | `RESOLVED` |
| Decided | 2026-09-20, M0 |
| Blocks | AC-10; constrains M1–M5 |
| Matched recommendation | **No** — the recommendation was $75 through M9 |

The owner chose the tightest of the three options. This is recorded as a
deliberate constraint, not an oversight, and the consequences are stated rather
than absorbed silently:

**What $40 buys.** At the source's measured mean of $0.97 per review, $40 is
**roughly 41 reviews**. The source's range was $0.58–$1.14, so the real figure
is 35–69.

**Where it is likely to bind.** M2 is the risk. It makes two independently
reviewable claims — byte-identity against `2b1e2f7`, and the M2-AC-7 mutation
demonstration — and the source's comparable PRs ran 5–10 rounds. M1 and M2
together could plausibly consume half the cap.

**Operating rules adopted in response**, so the cap constrains spend rather than
quality:

1. **No dispatch on a head that has not passed local gates.** Preflight already
   enforces this once it exists; before then it is a manual precondition. The
   source measured 16 of 81 pre-cutover runs cancelled mid-execution — spend
   with no verdict — and that waste is unaffordable at this cap.
2. **One review per HEAD, never per push.** Batch corrections; do not dispatch
   after each fix.
3. **Cost is recorded at dispatch from M1**, manually in the register until C9
   automates it at M8. A cap that is not measured is not a cap.
4. **At M5, report actual spend against the cap** and re-authorise or stop. The
   revisit is a gate, not a formality.

**Escalation:** if the cap is reached before M5, work stops and the owner is
told what remains. It is not silently exceeded, and review is not skipped to
stay under it — skipping review to save budget would trade the one gate the
experiment proved for the one resource it never measured.

---

## OD-4 — Distribution shape

**Decision: copied `core/` plus a per-repository config file.**

| Field | Value |
| --- | --- |
| Status | `RESOLVED` |
| Decided | 2026-09-20, M0 |
| Blocks | M3 (structure) |
| Matched recommendation | Yes |

**Rejected:** an npm package — a dependency bump could change gate behaviour
without a reviewed diff in the consuming repository, which contradicts the
premise of M2 and of the golden vectors. **Rejected:** a git submodule — it
pins the gate immutably, which is attractive, but adds submodule friction to
every clone and CI job for a project that has exactly one consumer today.

**Consequence:** updates propagate manually per repository. Acceptable while
there is one consumer; revisit if a third repository adopts v2.

---

## OD-5 — RecompraCRM read-only scope

**Decision: RecompraCRM is strictly read-only for the duration of Rick Loop v2
extraction, development and LoopLab testing. The restriction is _temporary_,
not permanent.** After v2 is validated, the owner may authorise installing it
in RecompraCRM through a **separate, reviewed migration**.

| Field | Value |
| --- | --- |
| Status | `RESOLVED` — with a named future decision point |
| Decided | 2026-09-20, M0 |
| Clarified | 2026-09-20, M0 — owner clarification on scope and duration |
| Blocks | Nothing now; it is a standing constraint through LoopLab |
| Matched recommendation | Partially — the recommendation said "stay frozen" without qualification, which was **wrong**; see below |

### Correction to the M0 recommendation

The foundation plan's §12 recommended *"stay frozen"* and this record initially
read *"never migrated onto v2."* **That overstated the owner's position.** The
instruction was that RecompraCRM must not be modified *now*, not that it must
never adopt v2. The difference is material: "never" would have removed a future
option the owner explicitly retains, and would have quietly converted a
temporary safety constraint into a permanent architectural one.

Corrected before merge, and recorded rather than silently edited — it is the
same class this project exists to prevent, an assertion running ahead of the
decision it describes.

### What is binding now

During extraction, development and LoopLab testing:

- RecompraCRM is a **source of evidence only**. Files are copied out; nothing is written in.
- No branch, commit, config, database, environment or Git-history change.
- Asserted mechanically by **AC-13** and **M2-AC-9** on every milestone.

### What is explicitly not decided

Whether, when and how RecompraCRM adopts Rick Loop v2. That is a **future owner
decision**, and it is out of scope for M0–M9 and for LoopLab.

When it is taken it becomes **OD-6**, recorded here, and it requires:

1. v2 validated — AC-1 through AC-14, including AC-10 self-hosting.
2. A separate migration plan, reviewed on its own merits.
3. Its own reviewed PRs against RecompraCRM under that repository's governance.

Nothing in the foundation plan, the milestone sequence or LoopLab may assume
that migration will happen, and nothing may foreclose it.
