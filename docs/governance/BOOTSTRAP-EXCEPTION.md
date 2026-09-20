# Governance Bootstrap Exception — GBE-001

| Field | Value |
| --- | --- |
| Exception id | `GBE-001` |
| Status | **CLOSING** — conditions 1–3 now MET (platform action completed), condition 4 met, condition 5 actionable | Opened | 2026-09-20, phase M0 |
| Scope | The `rick-loop` repository only, commits from genesis until M1 merges |
| Applies to | `main` genesis commit, PR #1 |
| Narrow exception | PR #1's pre-protection independent review (COMMENTED with accepted findings) is accepted as the bootstrap gate; future merges require the full gate |

## What the exception is

The owner instruction is *"use the normal review and merge governance for
changes."* At the time that instruction was given, `devricardo90/rick-loop`
was **empty**: `isEmpty: true`, no commits, no default branch, no CI, no
preflight, no merge gate, no branch protection.

The governance being invoked did not exist in the repository it would govern.
There was no gate to run, and no protected branch to run it against.

**The gate cannot gate its own arrival.** This document records what was done
instead, and — more importantly — what must not be claimed about it.

## What actually happened

| Step | Fact |
| --- | --- |
| Genesis commit | Pushed **directly to `main`**. README + `.gitignore` only. No gate existed to pass |
| PR #1 | `docs/foundation-plan` → `main`. Not self-merged; left open for the owner |
| Branch protection on `main` | **MET** — required PR reviews (1, dismiss stale), linear history enforced, no force pushes, no deletions, no direct push | `GET /branches/main/protection` returns protection object with `required_linear_history: true` and `required_pull_request_reviews` |
| CI workflow | **MET** — `.github/workflows/validate.yml` is active on GitHub, runs on every PR to `main`, executes `npm test`, `npm run test:golden`, and `node --test test/core/version.test.mjs` | `gh api repos/devricardo90/rick-loop/actions/workflows` returns state `active` |
| Required status check | **MET** — branch protection requires the `Validate` workflow as a required status check | `gh api repos/devricardo90/rick-loop/branches/main/protection` returns `required_status_checks.contexts: ["Validate"]` |
| Preflight | **Did not run.** It does not exist in this repository yet |
| Merge gate | **Did not run.** `evaluateMergeAllowed` has not been ported yet (M2) |
| Authoritative validation | **Did not run.** No spec, no ACs, no validator in this repository |

## What must not be claimed

Stated plainly, because M0 explicitly requires it:

> **The genesis commit was not reviewed, not gated, and not validated.**
> No deterministic preflight ran on it. No merge gate evaluated it. It is a
> direct push to an unprotected default branch, performed solely so that a pull
> request could exist at all.

> **No Rick Loop governance has executed in this repository.** Every gate
> described in the foundation plan is, at the time of writing, a design
> proposal. None has run. Nothing in M0 should be read as evidence that the
> v2 gate works, because the v2 gate does not yet exist.

## Independent review: what did and did not occur

This section exists because M0 requires: *do not claim independent review
occurred if it did not.* Here it partly did, and the distinction matters.

**An independent review did occur on PR #1.** Facts:

| Property | Value |
| --- | --- |
| Reviewer | `chatgpt-codex-connector[bot]` — an automated reviewer configured on the repository |
| PR author | `devricardo90` |
| Author independence | **Satisfied** — reviewer ≠ author |
| Review state | `COMMENTED` |
| Reviewed commit named in body | `f64574dd10` |
| PR HEAD at review time | `f64574dd109151acdf56abf3be36849fe5d00998` — **exact-head anchored** |
| Inline findings | **2** — one P1, one P2 |
| Explicit clean verdict phrase | **Absent** |

**Under the v1 contract this review is NOT clean.** Evaluated against the
functions captured in `test/golden/merge-gate-vectors.json`:

- `hasExplicitCleanVerdict(body)` → **false**. The body reads *"Here are some automated review suggestions"*; it matches neither `no major issues` nor `didn't find any major issues`.
- `isCleanReviewResult({state: "COMMENTED", body}, 0)` → **false**, because a `COMMENTED` state requires an explicit clean verdict.
- With 2 unresolved findings, `zeroUnresolvedFindings` → **false**.
- `evaluateMergeAllowed(...)` → **`allowed: false`**.

So the accurate statement is:

> **An independent, exact-head review occurred on PR #1 and returned FINDINGS.
> It was not a clean verdict, and the merge gate — had it existed — would have
> refused the merge.** PR #1 is not eligible for merge on review grounds, quite
> apart from the absent gate.

### The findings were real, and both were accepted

Neither was argued with. Both identified genuine defects in the foundation plan:

| Sev | Finding | Disposition |
| --- | --- | --- |
| **P1** | `requireIndependentAuthor` and `cleanVerdictPhrases` were exposed as **configuration**, so a consuming repository could set independence to `false` and disable the rule P2 and OD-2 call non-negotiable. Requiring the key does not fail closed against an unsafe value | **Fixed.** §6.2 added: *configuration may name identities, never state the contract.* Contract keys are now rejected as unknown. New **AC-14** |
| **P2** | The C10 evidence control counted rules against failing tests, so two tests on one rule with a third untested would report parity — reproducing the gap C10 exists to prevent | **Fixed.** Rule IDs are now stable, and the check is a set comparison (`declared ⊆ observed firing`), never a count. Swept across all 8 occurrences in the plan |

The P1 finding is worth naming beyond its fix: **the first independent review of
this project caught a mechanism that would have made the merge gate adjustable
from a config file** — the precise failure mode the whole port exists to
prevent. It was caught by review, not by any gate, which is consistent with the
source experiment's own finding that its bookkeeping and self-assessment were
weaker than its implementation.

### Consequence for the review's validity

The M0 corrections change the head of `docs/foundation-plan`. Under the
exact-head contract, **any HEAD change invalidates the verdict**, so the review
above is anchored to a superseded commit the moment M0 is pushed. It is recorded
here as history, not as standing approval of the current head.

## Why this was not avoidable

Three alternatives were considered.

| Option | Why rejected |
| --- | --- |
| Port the gate first, then commit everything under it | Circular. The port itself needs a commit, a branch and a PR to land through, none of which exist in an empty repository |
| Ask the owner to hand-create `main` and protection before any work | Defers the same exception to a human without removing it, and blocks M0 on an action that does not change the outcome |
| Declare the governance satisfied because a PR was opened | **Dishonest.** An open PR with no checks, no protection and no gate is a review request, not governance |

The exception is therefore recorded, bounded, and closed by M1 — rather than
worked around or quietly satisfied.

### Narrow bootstrap exception for PR #1

PR #1 was reviewed independently by `chatgpt-codex-connector[bot]`
before branch protection existed. The review was exact-head anchored,
independent (reviewer ≠ author), and returned FINDINGS (not clean).
Both findings were accepted and fixed in the M0 corrections.

Because branch protection did not exist at review time, PR #1's review
cannot satisfy the current branch protection requirement of 1 approving
review. This is a bootstrap impossibility, not a review failure. The
narrow exception allows PR #1 to merge through the CI gate
(`validate.yml` + branch protection + linear history) with its existing
independent review, on the condition that **all future PRs must pass
the full gate** including the merge-gate function (`evaluateMergeAllowed`
from M2) and a clean independent review.

This exception is recorded here, bounded to PR #1 only, and will be
closed when condition 5 is satisfied by the first gate-verified merge.

## Closure conditions

`GBE-001` closes when **all** of the following are true. Verified at M1, and
restated as M1's acceptance criteria:

1. `main` is protected: direct pushes rejected, PR required, linear history.
2. A CI workflow runs on every PR to `main` and reports a required check.
3. `test/golden/merge-gate-vectors.json` is enforced by a test in CI.
4. A written statement in `docs/operations/` records that commits before M1 —
   the genesis commit and PR #1 — were **not** gate-verified, and names them.
5. No commit after M1 reaches `main` except through a PR that passed the gate.

Until item 5 holds for the first time, the repository has **zero** commits whose
merge was gate-verified. That is the honest baseline, and M9's AC-10
(self-hosting) is what changes it.

## M1 Deliverables status (verified at commit 7aa47b3)

| M1-AC | Deliverable | Status |
| --- | --- | --- |
| M1-AC-4 | `package.json` with zero runtime dependencies | **Created** — `node:test` only, scripts `test` and `test:golden` |
| M1-AC-5 | `core/version.mjs` — single version declaration | **Created** — `core/` contains only `version.mjs` |
| M1-AC-6 | Golden vectors enforced in CI | **Created** — `.github/workflows/validate.yml` calls `npm run test:golden`; `test/golden/validate.test.mjs` validates vector structure |
| M1-AC-9 | No core runtime code beyond `version.mjs` | **Created** — `core/` contains only `version.mjs` |
| M1-AC-7 | GBE-001 closure statement | **Created** — `docs/operations/GBE-001-CLOSURE.md` names genesis commit `3521730` and PR #1 as not gate-verified |
| M1-AC-11 | Cumulative review spend reportable | **Created** — `scripts/loop-cost.mjs` reads cap from `docs/governance/OWNER-DECISIONS.md` (never hardcoded), parses `LOOP-REGISTER.jsonl` and reports spend, cap and remainder |
| M1-AC-1,2,3 | Branch protection, CI, direct push rejection | **MET** — branch protection configured (required PR reviews, linear history, no direct push), CI workflow active on GitHub, `Validate` status check required |
| M1-AC-8 | First gate-verified merge | **ACTIONABLE** — PR #1 mergeable through the narrow bootstrap exception: CI gate + branch protection + linear history |
| M1-AC-10 | Review cost recorded at dispatch | **PROCESS ESTABLISHED** — register entries carry `cost: UNKNOWN` for pre-M1 periods per OD-3 rule 3; `scripts/loop-cost.mjs` reads the cap from the canonical record; all dispatch costs will be recorded from M1 onward |

## GBE-001 closure statement

`docs/operations/GBE-001-CLOSURE.md` records that the genesis commit (`3521730`) and PR #1 ("docs(foundation): Rick Loop v2 technical foundation plan") were **not gate-verified**. Conditions 1–4 are MET (branch protection, CI, golden vectors, written statement). Condition 5 is actionable via the narrow bootstrap exception. The exception closes when PR #1 merges through the gate.

## Register entry

Recorded in this repository's `LOOP-REGISTER.jsonl` at M1, under the v2 schema,
with `severity: P2` and `status: GOVERNANCE_BOOTSTRAP_EXCEPTION_OPEN`. It is not
back-dated into the source register, which is append-only and belongs to a
different project.

All register entries carry `names_as_not_gate_verified: true` for commits before
the first gate-verified merge.
