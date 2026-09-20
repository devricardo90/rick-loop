# FINDING-002 — Merge-gate provenance is more precise than the source audit stated

| Field | Value |
| --- | --- |
| Finding id | `FINDING-002` |
| Class | `CLAIM_STATED_MORE_BROADLY_THAN_ITS_EVIDENCE_SUPPORTS` |
| Severity | **P2** |
| Status | `RESOLVED_IN_V2_DOCUMENTATION` — the source document stays as written |
| Recorded | 2026-09-20, Rick Loop v2 phase M0 |
| Observed in | `RecompraCRM` @ `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a` |
| Source repository modified | **No** |

## Why this is recorded

The foundation plan's decision **P1** — port the merge gate byte-identical — and
its acceptance criterion **AC-1** both rest on the claim that the gate was never
weakened. That claim was carried into the v2 plan from the source audit in the
source's own wording. M0 required verifying the diff and naming unsupported
claims, so the claim its plan depends on was the first one checked.

It is **substantially true and slightly overstated**, in both documents.

## The claim as written in the source

`docs/evidence/RICK-LOOP-FINAL-AUDIT.md` §10 and §15, and the transfer plan's
Tier A1:

> `evaluateMergeAllowed`, `isCleanReviewResult`, `countUnresolvedFindings`,
> `selectMergeResult`, `buildAnchoredResults` and `filterAnchoredCleanComments`
> were **not modified by any of the 43 merged PRs**.

The v2 foundation plan reproduced that wording verbatim in its P1 row before
this finding.

## What the repository shows

Per-function history, read with `git log -L '/^export function <fn>/,/^}/'`:

| Function | Commits in its history | Last change |
| --- | --- | --- |
| `evaluateMergeAllowed` | 1 | `2b1e2f7` 2026-08-23 |
| `isCleanReviewResult` | 1 | `2b1e2f7` 2026-08-23 |
| `countUnresolvedFindings` | 1 | `2b1e2f7` 2026-08-23 |
| `selectMergeResult` | 1 | `2b1e2f7` 2026-08-23 |
| `buildAnchoredResults` | 1 | `2b1e2f7` 2026-08-23 |
| `filterAnchoredCleanComments` | 2 — introduced `3854a4d` 2026-08-19 | `2b1e2f7` 2026-08-23 |

`2b1e2f7` is the merge of **PR #23**, *"fix(loop): require published review
before merge"*. PR #23 is itself one of the 43 merged PRs, and it **did** modify
all six functions — it is the commit that gave them their final form.

**PRs merged after `2b1e2f7`: 23.** None touched any of the six.

## The correction

Not *"unmodified by any of the 43 merged PRs"*, but:

> **All six functions reached their final form at `2b1e2f7` (PR #23,
> 2026-08-23) and were unchanged across the 23 PRs merged afterwards.**

## Does this weaken P1 or AC-1?

**No, and it strengthens what can be asserted.**

- The property P1 relies on — *the gate was not adjusted under pressure during the run* — holds, with a named freeze point and a countable 23-PR window instead of an unbounded claim.
- PR #23's direction matters: it **tightened** the gate (requiring a published review before merge). The gate was strengthened once, then frozen. That is a different and better story than "never touched".
- AC-1 becomes sharper. Byte-identity is now asserted against a **specific commit**, `2b1e2f7`, rather than against a vaguely-dated notion of "the source version".

## Why it is recorded rather than quietly fixed

This is the source's lesson 3 and lesson 11 applied to the v2 project's own
first artifact: a claim inherited without verification, corrected in the
document that depends on it, and disclosed rather than silently edited — in the
same phase that promises no gate will be weakened during the port.

The correction is applied to the v2 foundation plan's P1 row. **No source
document is amended.** The audit's §10 and §15 stay exactly as written; they are
historical evidence, and their imprecision is now documented here rather than
erased there.

## Consequences applied

1. Foundation plan **P1** now states the freeze commit and the 23-PR window, and references this finding.
2. `test/golden/merge-gate-vectors.json` records `gate_frozen_at: 2b1e2f76c7b72e583fcfef84ee74b89b0ac5db44`.
3. **AC-1** (restated in the M1/M2 acceptance criteria) requires byte-identity against the six function bodies as they exist at `2b1e2f7`, which is also their form at `87d27d1`.

## Reproduction

Read-only, against the source repository:

```
for fn in evaluateMergeAllowed isCleanReviewResult countUnresolvedFindings \
          selectMergeResult buildAnchoredResults filterAnchoredCleanComments; do
  git log --format='%h %ad %s' --date=short \
    -L "/^export function $fn/,/^}/:scripts/rick-loop-controller.mjs"
done

git log --oneline 2b1e2f7..HEAD | grep -cE '\(#[0-9]+\)$'    # 23
```
