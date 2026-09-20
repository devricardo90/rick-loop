# Repository State

## Genesis

| Field | Value |
| --- | --- |
| Genesis commit | `3521730` ("chore: genesis commit for the Rick Loop v2 repository") |
| Pushed to | `main` directly, no gate, no protection |
| Branch | `main` (protected) |
| Current HEAD | `f76cc75` (first gate-verified merge) |

## Gate-verified merges

**1.** Commit `f76cc75` — PR #1 ("docs(foundation): Rick Loop v2 technical foundation plan")
merged through protected `main` with CI passing. Narrow bootstrap exception applied.
See `docs/operations/GBE-001-CLOSURE.md`.

## GBE-001

**CLOSED.** All five closure conditions satisfied:
1. `main` protected — MET
2. CI workflow active — MET
3. Golden vectors enforced in CI — MET
4. Written statement created — MET
5. First gate-verified merge (`f76cc75`) — MET

## Current milestone

**M1 (governance bootstrap) COMPLETE.** All M1 acceptance criteria satisfied:
- M1-AC-1 through M1-AC-3: Platform gates configured and verified
- M1-AC-4 through M1-AC-11: All deliverables created and verified
- GBE-001 closed

Next milestone: M2 (characterization port).

## Register schema

v2 schema. See `docs/protocol/VERSION-IDENTITY.md`.

## Review cost telemetry

- OD-3 cap: $40 (read from `docs/governance/OWNER-DECISIONS.md`)
- Recorded spend: $0 (all pre-M1 entries carry `cost: UNKNOWN` per OD-3 rule 3)
- Remaining budget: $40
- `npm run loop:cost` derives spend, cap, and remainder from the register

## RecompraCRM

`C:/Users/ricardodev/Desktop/RecompraCRM/` — read-only. HEAD still `87d27d1`. No modifications.
