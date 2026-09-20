# FINDING-001 — ROADMAP header pointers stale at the source's final commit

| Field | Value |
| --- | --- |
| Finding id | `FINDING-001` |
| Class | `POINTER_ADVANCED_WHILE_ITS_EXPLANATION_STAYED_BEHIND` |
| Severity | **P1** |
| Status | `OPEN` — carried into Rick Loop v2 as correction C2 |
| Recorded | 2026-09-20, Rick Loop v2 phase M0 |
| Observed in | `RecompraCRM` @ `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a` |
| Recorded by | Rick Loop v2 foundation audit |
| Source repository modified | **No** |

## Recording discipline

This finding is **new evidence about a historical artifact**, filed in the v2
repository. It does not amend, correct or annotate any document in the source
repository.

Specifically, the following were **not** touched and must not be:

- `docs/evidence/RICK-LOOP-FINAL-AUDIT.md` — its count of **17 occurrences** was accurate for the evidence available when it was written, and stays as written.
- `docs/operations/RICK-LOOP-LESSONS-LEARNED.md` — lesson 4 stays as written.
- `docs/operations/LOOP-REGISTER.jsonl` — append-only; no entry is added to the source register by this project.
- `docs/roadmap/ROADMAP.md`, `STATE.md`, `HANDOFF.md` — the drift itself is **preserved in place as the evidence**. Fixing it in the source would destroy the artifact this finding documents and would violate the read-only constraint.

The source's count of 17 is therefore **not superseded**. This is the
**eighteenth occurrence**, numbered relative to that count, and the first one
observed to be *live* rather than historical.

## Statement

At the source's final commit, the three documents the protocol treats as
authoritative disagree about the current position of the roadmap:

| Source | `current_task` | `next_eligible_task` | `loop_version` |
| --- | --- | --- | --- |
| `docs/operations/STATE.md:77-79` | `TASK-16` | `TASK-16` | `RICK_LOOP_V1_5` |
| `docs/operations/HANDOFF.md:10-12` | `TASK-16` | `TASK-16` | `RICK_LOOP_V1_5` |
| **`docs/roadmap/ROADMAP.md:6-8`** | **`TASK-12`** | **`TASK-12`** | **`RICK_LOOP_V1_3`** |

The ROADMAP header is **four tasks stale** and names a superseded protocol
version, in the file `resolveNextEligibleTask` reads, at the commit that merged
the experiment's own final audit.

`ROADMAP.md:3` additionally reads `status: RUNNING`, while
`STATE.md:8` reads `global_status: EXPERIMENT_COMPLETED_WAITING_OWNER_REVIEW`.

## Gate state at the time of the observation

Every gate was green. From the source's own audit and register for PR #48:
`Validate` green, independent review clean on the exact head, preflight 9/9.

## Why no gate detected it — mechanism, read from the code

Two gates could conceivably have caught this. Neither is capable of it.

**1. `detectStateDrift` — `scripts/rick-loop-controller.mjs:324`**

Every pointer comparison in the function is `pointersDiffer(state, …, handoff, …)`.
Its parameter list is `{ state, handoff, git, pr, prewrite }`. **The ROADMAP is
not a parameter.** STATE and HANDOFF agree with each other here, so the function
is silent by construction.

**2. `comparePointers` — `scripts/rick-loop-preflight.mjs:94`**

This one *does* read the ROADMAP, through `readRoadmapEntryFields(text, entryId)`
— which parses the sub-fields beneath a `- [ ] <ID> — title` entry heading. The
set it compares is `TRACKED_POINTERS` (`preflight.mjs:38-40`):

```js
"ARCH-04.impl_branch":  { …, roadmap: "impl_branch",  entry: "ARCH-04" },
"ARCH-04.impl_stage":   { …, roadmap: "impl_stage",   entry: "ARCH-04" },
"ARCH-04.next_action":  { …, roadmap: "next_action",  entry: "ARCH-04" },
```

All three are scoped to the entry `ARCH-04`. The **header block of ROADMAP.md
lies outside every entry heading**, so `readRoadmapEntryFields` never reaches it
for any tracked pointer.

**Conclusion:** the ROADMAP header is compared by nothing. Not by a check that
passed — by no check at all.

## Relationship to the source audit's §14.3

The final audit names a related gap and frames it as *"a check comparing two
documents to each other, but not to computed truth, can pass while both are
wrong."*

This finding is **narrower and stronger**. In the audit's example, STATE and
HANDOFF both recorded `none` and disagreed with the resolver — two sources
agreeing with each other and with neither reality nor a third source. Here, the
third source is not merely uncompared against computed truth; **it is outside
the comparison set entirely, for the whole run**, including for pointers that
STATE and HANDOFF do cross-check between themselves.

Fixing §14.3 as stated — cross-checking recorded pointers against
`roadmap_next_eligible_task` — would have caught this occurrence only by
accident, because STATE and HANDOFF are correct here and the ROADMAP is the
document that is wrong.

## Correction required in v2

Tracked in the foundation plan as **C2**, with **C1** as its structural half.

1. The ROADMAP **header** joins the tracked pointer set as a first-class scope
   (`{ scope: "header", field: … }`), alongside the existing entry scope.
2. Every recorded pointer is cross-checked against **computed truth**, not only
   against the other recorded copies.
3. `status`/`global_status` consistency is checked across the three sources.
4. `updated_at` freshness is checked against the file's own last commit
   timestamp — identified during the source run and never implemented.

## Regression test

This occurrence becomes a fixture, not a memory. Required by **AC-5**:

> `test/core/pointers.test.mjs` loads the three-source state captured below and
> asserts that preflight **fails**. A build in which this fixture passes is a
> build in which C2 has regressed.

Fixture values, frozen from `87d27d1`:

```json
{
  "state":   { "current_task": "TASK-16", "next_eligible_task": "TASK-16", "loop_version": "RICK_LOOP_V1_5" },
  "handoff": { "current_task": "TASK-16", "next_eligible_task": "TASK-16", "loop_version": "RICK_LOOP_V1_5" },
  "roadmap_header": { "current_task": "TASK-12", "next_eligible_task": "TASK-12", "loop_version": "RICK_LOOP_V1_3", "status": "RUNNING" },
  "computed": { "roadmap_next_eligible_task": "TASK-16" },
  "expected": { "preflight_pass": false, "reason_contains": "pointer_disagreement" }
}
```

## Reproduction

Read-only, against the source repository:

```
git -C <source> rev-parse HEAD                     # 87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a
grep -nE "^(current_task|next_eligible_task|loop_version|global_status):" docs/operations/STATE.md
grep -nE "^(current_task|next_eligible_task|loop_version|status):"        docs/roadmap/ROADMAP.md
grep -nE "^(current_task|next_eligible_task|loop_version):"               docs/operations/HANDOFF.md
```
