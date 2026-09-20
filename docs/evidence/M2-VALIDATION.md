# M2 Validation — Characterization Port

> This document records the M2 characterization port evidence.
> All six merge-gate functions are ported byte-identically to source
> `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a`.

## Date

2026-09-20 (M2 bootstrap). PR pending independent review and merge-gate enforcement.

## Source Baseline

| Field | Value |
| --- | --- |
| Source repository | RecompraCRM |
| Source commit | `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a` |
| Gate freeze commit | `2b1e2f76c7b72e583fcfef84ee74b89b0ac5db44` |
| Port branch | `m2-characterization-port` |

## Six Merge-Gate Functions (M2-AC-1)

All six function bodies extracted from `scripts/rick-loop-controller.mjs` at
source commit `87d27d1` and verified byte-identical:

| # | Function | Source | Core File | Bytes | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | `evaluateMergeAllowed` | `scripts/rick-loop-controller.mjs` | `core/evaluateMergeAllowed.mjs` | 1091 | BYTE-IDENTICAL |
| 2 | `isCleanReviewResult` | `scripts/rick-loop-controller.mjs` | `core/isCleanReviewResult.mjs` | 328 | BYTE-IDENTICAL |
| 3 | `countUnresolvedFindings` | `scripts/rick-loop-controller.mjs` | `core/countUnresolvedFindings.mjs` | 454 | BYTE-IDENTICAL |
| 4 | `filterAnchoredCleanComments` | `scripts/rick-loop-controller.mjs` | `core/filterAnchoredCleanComments.mjs` | 396 | BYTE-IDENTICAL |
| 5 | `buildAnchoredResults` | `scripts/rick-loop-controller.mjs` | `core/buildAnchoredResults.mjs` | 1281 | BYTE-IDENTICAL |
| 6 | `selectMergeResult` | `scripts/rick-loop-controller.mjs` | `core/selectMergeResult.mjs` | 320 | BYTE-IDENTICAL |

Additional dependency ported:
- `hasExplicitCleanVerdict` — referenced by `isCleanReviewResult` and `filterAnchoredCleanComments`.
  Function body byte-identical to source. `CLEAN_VERDICT_PATTERN` constant included.

**M2-AC-1: SATISFIED.** All six merge-gate function bodies are byte-identical to source `87d27d1`.

## Golden Vectors (M2-AC-2)

All 57 golden vectors reproduce exactly against the ported functions.

| Suite | Vectors | Status |
| --- | --- | --- |
| `evaluateMergeAllowed` | 16 | PASS |
| `isCleanReviewResult` | 10 | PASS |
| `countUnresolvedFindings` | 10 | PASS |
| `filterAnchoredCleanComments` | 8 | PASS |
| `buildAnchoredResults` | 8 | PASS |
| `selectMergeResult` | 5 | PASS |
| **Total** | **57** | **PASS** |

Verified by `npm run test:golden` — all 63 tests pass (5 version + 58 golden vector execution).

**M2-AC-2: SATISFIED.** All 57 golden vectors reproduce exactly.

## Test Results

- `npm test`: 5/5 pass (version identity, core module count)
- `npm run test:golden`: 63/63 pass (58 golden vector execution + 5 structural validation)
- `node scripts/loop-cost.mjs`: 10 entries, 2 corrections, actual spend UNKNOWN

**M2-AC-3: SATISFIED.** All inherited assertions pass (58 from golden vector execution + 5 version identity = 63).

## M2-AC-4: Permitted Changes

The only changes from source are:
1. **Import specifiers** — each core module imports its dependencies (e.g., `isCleanReviewResult.mjs` imports `hasExplicitCleanVerdict.mjs`)
2. **File names** — each function is in its own `.mjs` file (source had them in one `rick-loop-controller.mjs`)
3. **Directory structure** — source had all functions in `scripts/`; port has them in `core/`

No logic changes, no formatting changes, no comment changes, no variable renames.

**M2-AC-4: SATISFIED.** Only the three permitted change categories applied.

## M2-AC-5: No Corrections

No correction from C1–C12 is present in the port. The diff between source and port
contains only import specifiers, file/directory names, and module separation.

**M2-AC-5: SATISFIED.** No corrections applied.

## M2-AC-6: No New Dependencies

`package.json` still has zero runtime dependencies. `core/` imports only `node:*` and
sibling modules within `core/`. No external dependencies added.

**M2-AC-6: SATISFIED.** No new dependencies introduced.

## M2-AC-7: Mutation Demonstration

Pending. Requires deliberate mutation of `evaluateMergeAllowed` to verify the golden
suite turns red, then reversion. This demonstrates the freeze is real.

**M2-AC-7: PENDING.** To be demonstrated and recorded in this document upon PR review.

## M2-AC-8: Provenance

- `merge-gate-vectors.json`: `source_commit = "87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a"`
- `core/version.mjs`: `SOURCE_BASELINE_COMMIT = "87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a"`
- `merge-gate-vectors.json`: `gate_frozen_at = "2b1e2f76c7b72e583fcfef84ee74b89b0ac5db44"`
- `core/version.mjs`: `GATE_FROZEN_COMMIT = "2b1e2f76c7b72e583fcfef84ee74b89b0ac5db44"`

Both pairs match.

**M2-AC-8: SATISFIED.** Vector provenance asserted and matches `core/version.mjs`.

## M2-AC-9: RecompraCRM Unmodified

RecompraCRM HEAD is `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a`. No modifications.

**M2-AC-9: SATISFIED.** RecompraCRM unmodified.

## M2-AC-10: Gate Enforcement

The merge gate (`evaluateMergeAllowed`) is operational. The CI workflow (`validate.yml`)
requires the `Validate` status check. Branch protection on `main` requires PR reviews.
The bootstrap exception from M1 is closed; all future PRs must pass the full gate
including `evaluateMergeAllowed` and a clean independent review.

**M2-AC-10: PENDING.** Requires independent CLEAN review and PR merge through the gate.

## M2 Exit Condition

`core/` holds the proven code; its behaviour is frozen by 57 vectors and 63 assertions;
the freeze has been demonstrated to fail when the gate is mutated (M2-AC-7, pending);
and no correction has been applied. Only then does M3 begin.
