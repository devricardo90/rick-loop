# M1 and M2 — Acceptance Criteria

Established at M0. Each criterion names how it is proved. Following the source's
validator contract: **a partial result is not a pass**, and a criterion that
cannot be evaluated is a failure, not a silent pass.

Scope note: M1 and M2 deliver **no behaviour change**. M1 builds the governance
that was missing (`GBE-001`); M2 moves the proven code and proves it did not
change. Every correction (C1–C12) belongs to M3 and later, and **any correction
attempted inside M1 or M2 is a scope violation** to be rejected in review.

---

## M1 — Governance bootstrap

**Goal:** the repository can govern its own changes, and the bootstrap exception
closes.

### Deliverables

| Item | Content |
| --- | --- |
| `package.json` | **Zero runtime dependencies.** `node:test` only. Scripts: `test`, `test:golden` |
| `.github/workflows/validate.yml` | Runs on every PR to `main`; parameterised; **no project-specific test names** |
| Branch protection on `main` | PR required, direct pushes rejected, required check, linear history |
| `core/version.mjs` | The single version declaration (`docs/protocol/VERSION-IDENTITY.md`) |
| `test/golden/merge-gate-vectors.json` | Already captured at M0; wired into CI at M1 |
| `docs/operations/STATE.md`, `HANDOFF.md`, `LOOP-REGISTER.jsonl` | This repository's own loop documents, seeded |
| `templates/` | Workflow and document templates, not this repository's live CI |

### Acceptance criteria

| AC | Criterion | Proof |
| --- | --- | --- |
| **M1-AC-1** | `main` is protected: direct push rejected, PR required, linear history | `gh api repos/devricardo90/rick-loop/branches/main/protection` returns a protection object, **not** `404 Branch not protected` |
| **M1-AC-2** | A required CI check runs on every PR to `main` | `gh pr checks <n>` reports a check; a PR cannot merge while it is red |
| **M1-AC-3** | A direct push to `main` is rejected by the platform | Attempted push fails; the rejection is recorded. **Not** asserted by reading the settings page |
| **M1-AC-4** | `npm test` runs with **zero** installed dependencies | `npm ci` on a clean checkout installs nothing; `npm test` passes |
| **M1-AC-5** | Exactly one version declaration exists and every occurrence matches | `version.test.mjs` (AC-9) |
| **M1-AC-6** | The golden vectors are enforced in CI | `test:golden` runs in `validate.yml`; a deliberately mutated vector turns CI red, demonstrated once and recorded |
| **M1-AC-7** | `GBE-001` closure conditions 1–4 are met, and a statement in `docs/operations/` names the genesis commit and PR #1 as **not gate-verified** | `docs/governance/BOOTSTRAP-EXCEPTION.md` updated to `CLOSED`, with the naming statement merged |
| **M1-AC-8** | The first PR merged **through** the gate is recorded as the repository's first gate-verified merge | Register entry, v2 schema, naming the PR and its verdict |
| **M1-AC-9** | No core runtime code is present | `core/` contains only `version.mjs`. M1 ships governance, not the port |
| **M1-AC-10** | Review cost is recorded **at dispatch**, not only at completion (OD-3 operating rule 3) | Every review dispatched from M1 onward has a register entry carrying its cost or an explicit `cost: UNKNOWN`; a cancelled run is `UNKNOWN`, never omitted and never zero |
| **M1-AC-11** | Cumulative review spend against the OD-3 cap is reportable at any time | `npm run loop:cost` (or an equivalent documented command) sums the register's cost entries and prints spend, cap and remainder. The cap value is read from the canonical decision record, never hardcoded here |

### M1 exit condition

`GBE-001` is `CLOSED`, and the repository has **at least one** commit on `main`
whose merge passed a required check through a protected branch. Before that
moment the honest count of gate-verified merges is zero, and it is stated as
zero.

---

## M2 — Characterization port

**Goal:** the proven code is in this repository and is **demonstrably the same
code**, with its behaviour frozen before anything is corrected.

> **M2 must preserve the original merge-gate behaviour before any refactoring or
> correction.** This is the load-bearing constraint of the entire project. The
> gate's only proven property is that it was not adjusted; the port is the most
> likely moment to adjust it, and a behaviour change made here would be
> indistinguishable from the behaviour it replaced.

### Deliverables

| Item | Content |
| --- | --- |
| `core/*.mjs` | The 8 runtime modules, copied from source `87d27d1` |
| `test/core/*.test.mjs` | The 3 regression suites, 378 assert calls, copied |
| `test/golden/merge-gate-vectors.json` | Enforced against the ported code |
| `docs/evidence/M2-validation.md` | The port's evidence document |

### What may change, exhaustively

Only these three categories. **Anything else is a scope violation.**

1. **Import specifiers** — `./rick-loop-controller.mjs` → `../core/controller.mjs`.
2. **File and directory names** — `scripts/rick-loop-x.mjs` → `core/x.mjs`.
3. **Nothing else.** Not formatting, not comments, not variable names, not
   dead-code removal, not lint fixes, not "obvious" cleanups, not type
   annotations, not reordering.

Constants stay hardcoded at M2 even though M3 will parameterise them. Coupling
points D1–D12 are **left in place**. C5's duplicated `DOCS_ONLY_ALLOWLIST` is
**copied twice, still divergent**, because deduplicating it is a behaviour
change and belongs to M3.

### Acceptance criteria

| AC | Criterion | Proof |
| --- | --- | --- |
| **M2-AC-1** | The six merge-gate function bodies are **byte-identical** to source `87d27d1` (their form since `2b1e2f7`) | Extract each function body from source and from `core/`; `sha256` of each pair is equal. Recorded in the evidence document |
| **M2-AC-2** | All 57 golden vectors reproduce **exactly**, including `null` vs `0` distinctions | `test:golden` passes against `core/`; zero diffs |
| **M2-AC-3** | All 378 ported assert calls pass | `npm test` |
| **M2-AC-4** | Every non-gate ported module is byte-identical to source apart from the three permitted change categories | Per-file diff, reviewed; each diff line is an import specifier or a filename |
| **M2-AC-5** | No correction from C1–C12 is present | Reviewed diff; the evidence document states explicitly that no correction was applied |
| **M2-AC-6** | The port introduces no dependency | `package.json` still has zero runtime dependencies; `core/` imports only `node:*` and siblings |
| **M2-AC-7** | A deliberately mutated gate is caught | Temporarily invert one condition in `evaluateMergeAllowed`; the golden suite must turn red. Reverted, and the demonstration recorded. **A suite that has only ever passed proves nothing** (source lesson 1) |
| **M2-AC-8** | The vectors' provenance is asserted | `source_commit` and `gate_frozen_at` in the vector file equal `SOURCE_BASELINE_COMMIT` and `GATE_FROZEN_COMMIT` in `core/version.mjs` |
| **M2-AC-9** | RecompraCRM is unmodified | `git -C <source> status --porcelain` empty; `git -C <source> rev-parse HEAD` = `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a` |
| **M2-AC-10** | M2 lands through the gate M1 built | PR merged with the required check green and an independent exact-head review |

### M2 exit condition

`core/` holds the proven code; its behaviour is frozen by 57 vectors and 378
assertions; the freeze has been **demonstrated to fail** when the gate is
mutated (M2-AC-7); and no correction has been applied. Only then does M3 begin.

### Why M2-AC-7 is not optional

The source's first and most expensive lesson: *a gate that cannot fail is
indistinguishable from no gate.* A golden suite that has only ever passed is
exactly such a gate. The mutation demonstration is the only evidence that the
freeze is real, and it must be performed and recorded, not assumed.

---

## Standing constraints for both milestones

1. **RecompraCRM is read-only for the duration of v2 extraction, development and LoopLab** (OD-5). Files are copied out; nothing is written in. Asserted by M2-AC-9 and AC-13. The restriction is temporary — a later, separately reviewed migration may be authorised — but nothing in M1 or M2 may assume it or prepare for it.
2. **Review is dispatched once per HEAD, never per push** (OD-3 operating rule 2), and never on a head that has not passed local gates (rule 1). The $40 cap makes cancelled runs unaffordable.
3. **No LoopLab.** The 10-sprint experiment does not begin at M1 or M2.
4. **No correction before M3.** C1–C12 are out of scope for both milestones.
5. **Every claim of governance names what actually ran.** While `GBE-001` is open, no artifact may describe this repository's commits as gate-verified.
6. **Owner decisions are not restated here.** OD-1…OD-5 live only in `docs/governance/OWNER-DECISIONS.md`; this document cites them by number and applies them.
