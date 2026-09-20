# Repository State

## Genesis

| Field | Value |
| --- | --- |
| Genesis commit | `3521730` ("chore: genesis commit for the Rick Loop v2 repository") |
| Pushed to | `main` directly, no gate, no protection |
| Branch | `main` (protected) |
| Current HEAD | `c84c9f6` (M2 bootstrap: 6 gate functions ported, 57 golden vectors passing) |

## Gate-verified merges

**1.** Commit `f76cc75` — PR #1 ("docs(foundation): Rick Loop v2 technical foundation plan")
merged through protected `main` with CI passing under narrow bootstrap exception.
Review returned FINDINGS (not clean). Full merge gate (`evaluateMergeAllowed`) ported at M2 (byte-identical to source `87d27d1`).
See `docs/operations/GBE-001-CLOSURE.md`.

## GBE-001

**CLOSED.** All five closure conditions satisfied:
1. `main` protected — MET
2. CI workflow active — MET
3. Golden vectors enforced in CI — MET
4. Written statement created — MET
5. First merge through protected branch with CI passing (`f76cc75`) — bootstrap exception — via condition 5

## Current milestone

**M1 (governance bootstrap) COMPLETE.** All M1 acceptance criteria satisfied.
GBE-001 is CLOSED.

**M2 (characterization port) IN PROGRESS.** 6 merge-gate functions ported byte-identically from source `87d27d1`. 57 golden vectors pass against ported functions. 63 tests pass. Branch `m2-characterization-port` active. PR pending independent CLEAN review and gate-enforced merge.
- M2-AC-1: SATISFIED
- M2-AC-2: SATISFIED (57/57 vectors)
- M2-AC-3: SATISFIED (63 assertions)
- M2-AC-4 through M2-AC-6: SATISFIED
- M2-AC-7: PENDING (mutation demonstration)
- M2-AC-8 through M2-AC-10: PENDING

Next milestone: M3 (corrections C1–C12) or M2 completion.

## Register schema

v2 schema. See `docs/protocol/VERSION-IDENTITY.md`.

## Review cost telemetry

- OD-3 cap: $40 (read from `docs/governance/OWNER-DECISIONS.md`)
- Recorded spend: UNKNOWN (all register entries carry `cost: UNKNOWN` per OD-3 rule 3; no cost may be claimed as zero)
- Remaining budget: $40
- `npm run loop:cost` derives spend, cap, and remainder from the register

## RecompraCRM

`C:/Users/ricardodev/Desktop/RecompraCRM/` — read-only. HEAD still `87d27d1`. No modifications.
