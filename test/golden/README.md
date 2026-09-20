# Golden vectors — the frozen merge-gate contract

`merge-gate-vectors.json` holds **57 frozen input/output pairs** for the six
merge-gate functions, captured at M0 from the source experiment.

## Provenance

| Field | Value |
| --- | --- |
| Source repository | `RecompraCRM` (read-only) |
| Source commit | `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a` |
| Gate freeze commit | `2b1e2f76c7b72e583fcfef84ee74b89b0ac5db44` (PR #23, 2026-08-23) |
| Captured by | Read-only `import()` of `scripts/rick-loop-controller.mjs` |
| Captured at | 2026-09-20, phase M0 |

Capture was side-effect free: the module guards its entrypoint with
`if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();`
at line 980, so importing it executes constant declarations only. Nothing was
written to the source repository.

## What these vectors are

**Observed behaviour, not desired behaviour.**

They record what the gate *did* at the commit that ran 43 merges, including any
quirk. They are not a specification, and they are not an opinion about what the
gate should do. If a vector looks wrong, that is a finding about the source
gate — to be raised as one, at M3 or later, never by quietly editing a vector.

## The rule

> **A diff in this file is a behaviour change and must be reviewed as one.**

The entire point of M2 is that the merge gate is ported without being adjusted.
Logic edits hide in 900-line diffs; a changed expected value in a JSON file does
not. That asymmetry is the mechanism.

Concretely:

- A PR that changes `core/` **and** this file is presumed to have changed behaviour until the diff proves otherwise.
- A PR that changes this file alone is either a capture-methodology fix or a mistake; it needs its own justification.
- Vectors are **added** freely for new coverage. Existing vectors change only with an explicit, reviewed rationale naming what behaviour changed and why.

## Coverage

| Function | Vectors | What they pin |
| --- | --- | --- |
| `evaluateMergeAllowed` | 16 | Each of the 8 checks failing in isolation; unknown-evidence fail-closed; merge-before-review ordering. **Exactly 2 of 16 return `allowed: true`** |
| `isCleanReviewResult` | 10 | `APPROVED` vs `COMMENTED`; the clean-phrase requirement; contraction variant; non-integer findings |
| `countUnresolvedFindings` | 10 | `null` (unknown) vs `0`; resolved and outdated exclusion; both comment shapes; the PR #44 outdated-thread case |
| `filterAnchoredCleanComments` | 8 | Short and full SHA anchoring; clean phrase without anchor; anchor without clean phrase; case insensitivity |
| `buildAnchoredResults` | 8 | Author independence; missing login; ordering by timestamp; findings propagation; non-anchored drop |
| `selectMergeResult` | 5 | `CHANGES_REQUESTED` outranking a clean result; independent-and-clean selection; fallback to last |

### The distinctions that matter most

Three vector pairs exist specifically because collapsing them would silently
weaken the gate:

1. **`null` is not `0`.** `countUnresolvedFindings` returns `null` for unknown evidence, and `evaluateMergeAllowed` refuses on `null`. A port that coerces unknown to zero passes a naive test suite and destroys the fail-closed property.
2. **`COMMENTED` is not clean.** A review action without an explicit clean phrase is not a clean verdict. The source recorded a defect where one author's clean verdict marked another author's review clean.
3. **Independence is computed, not asserted.** `buildAnchoredResults` derives `independent` from the login comparison; a missing login yields `false`, never `true`.

## Regenerating

Do not regenerate to make a failing test pass. The vectors are the reference;
the code is what is being checked against them.

Regeneration is legitimate only when adding coverage against the **unmodified
source** at `87d27d1`, and the regenerated file must leave every existing vector
byte-identical.
