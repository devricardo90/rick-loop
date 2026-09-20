# Handoff

## Current state

**M1 (governance bootstrap) COMPLETE.** All M1 acceptance criteria satisfied.
GBE-001 is CLOSED. The first merge through the protected branch with CI passing (`f76cc75`) occurred on 2026-09-20 under the narrow bootstrap exception. The full merge gate (`evaluateMergeAllowed`) has been ported at M2 (byte-identical to source `87d27d1`).

## M1 acceptance criteria matrix

| AC | Status | Evidence |
| --- | --- | --- |
| M1-AC-1 | MET | Branch protection on `main`: PR required, linear history, no direct push |
| M1-AC-2 | MET | `validate.yml` active on GitHub, runs on every PR to `main` |
| M1-AC-3 | MET | Direct push to `main` rejected by branch protection |
| M1-AC-4 | MET | `package.json` with zero runtime dependencies |
| M1-AC-5 | MET | `core/version.mjs` single version declaration (AC-9) |
| M1-AC-6 | MET | Golden vectors enforced in CI via `test:golden` |
| M1-AC-7 | MET | GBE-001 closure statement created |
| M1-AC-8 | EXCEPTION | First merge through protected branch with CI passing under narrow bootstrap exception: `f76cc75`. Full merge gate (`evaluateMergeAllowed`) not yet ported (M2). Bootstrap exception is NOT a full-gate merge. |
| M1-AC-9 | MET | `core/` contains `version.mjs` + 7 ported merge-gate modules |
| M1-AC-10 | CORRECTED | All register entries carry `cost: "UNKNOWN"` per OD-3 rule 3. `cost: 0` is explicitly forbidden by OD-3 rule 3 ("never zero"). `npm run loop:cost` reports all entries as UNKNOWN; actual spending is not zero. |
| M1-AC-11 | MET | `npm run loop:cost` reads cap from `OWNER-DECISIONS.md`, never hardcoded |

## Open items

- M2 (characterization port): 6 merge-gate functions ported byte-identical, 57 golden vectors passing, 63 assertions passing. PR pending independent CLEAN review and gate-enforced merge.
- M2-AC-7: Mutation demonstration (deliberate gate inversion → red suite → revert)
- M2-AC-10: Independent CLEAN review and PR merge through gate
- M3+ corrections (C1–C12)
- No LoopLab (M9 or later)
- RecompraCRM untouched (read-only)

## Not done

- M2-AC-7: Mutation demonstration pending
- M2-AC-10: Independent CLEAN review and gate-enforced merge pending
- No LoopLab (M9 or later)
- No corrections C1–C12 (M3 or later)
- RecompraCRM untouched (read-only)

## RecompraCRM

`C:/Users/ricardodev/Desktop/RecompraCRM/` — read-only. HEAD still `87d27d1`. No modifications.
