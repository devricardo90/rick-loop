# Rick Loop v2 — Technical Foundation Plan

Phase: FOUNDATION / SOURCE AUDIT
Canonical repository: `https://github.com/devricardo90/rick-loop`
Source experiment: `RecompraCRM` @ `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a` (read-only)
Audited: 2026-09-20

## How to read this document

Evidence labels follow the source experiment's convention, because the point of
this phase is to inherit its discipline rather than restart it.

| Label | Meaning |
| --- | --- |
| **PROVEN** | Verified in this audit from repository facts, or carried from an audit section that verified it |
| **PARTIALLY PROVEN** | Evidence exists for part of the claim; the gap is named |
| **NOT TESTED** | No evidence exists either way |
| **FAILED** | Attempted and did not work |

Findings labelled **[NEW]** were produced by this audit and appear in no source
document. They are stated with the location that produced them so the owner can
re-derive them without trusting this file.

---

## 0. Headline

The source experiment produced a **load-bearing merge gate that is worth
porting unchanged**, and a **bookkeeping layer that is not yet worth porting at
all**. This audit confirms the final audit's own conclusion and then extends it:
the dominant defect class it documented seventeen times is **still live at the
audited commit**, unflagged, in the document the resolver reads.

Two decisions follow, and both are recommendations, not faits accomplis:

1. **v2 is a rewrite of the bookkeeping layer around a verbatim port of the
   gate.** The gate's value is that it was never adjusted; porting it with edits
   would discard the only thing the experiment proved.
2. **The source is not v2, and is not coherently v1.5 either.** Four different
   version identities coexist in the tree at HEAD (§2.3). Any plan that treats
   the current source as a versioned baseline is building on an unnamed artifact.

---

## 1. Repository and remote verification

**PROVEN.**

| Fact | Value |
| --- | --- |
| Target working directory | `C:\Users\ricardodev\Desktop\rick-loop` |
| Target remote (`origin`) | `https://github.com/devricardo90/rick-loop.git` |
| Target branch | `main`, **no commits** at audit time |
| Target remote state | `isEmpty: true`, no default branch |
| Source repository | `C:\Users\ricardodev\Desktop\RecompraCRM`, branch `main` |
| Source HEAD | `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a`, 2026-09-20 10:29:31 +0200 |
| Source HEAD subject | `docs(audit): final Rick Loop evaluation, lessons, and RCC transfer plan (#48)` |
| Source treated as | **READ-ONLY** — no write, no branch, no config change was performed |

Nothing in this audit modified RecompraCRM. Every command used was a read:
`git log`, `git rev-parse`, `find`, `grep`, `wc`, `cat`, `sed -n`, and two
read-only `gh` queries (`gh pr list --state open`, `gh repo view`).

### 1.1 The bootstrap paradox, named rather than worked around

The owner instruction is *"use the normal review and merge governance for
changes."* At audit time the target repository has **no commits, no default
branch, no gate, no preflight and no CI** — the governance being invoked does
not exist yet in the repository it would govern.

This is not resolved by pretending otherwise. The sequencing in §7 makes the
governance tooling itself the first reviewed increment (M1), and until it is
merged, every change lands on a branch and through a pull request for owner
review rather than being self-merged. **The gate cannot gate its own arrival;
it can only be the first thing that arrives.** This is recorded as an accepted
residual, not as a satisfied requirement.

---

## 2. Source inventory

### 2.1 Loop implementation — the runtime core

All eight modules are plain Node ESM under `scripts/` in the source.

| Module | Lines | Last touched | Role |
| --- | --- | --- | --- |
| `rick-loop-controller.mjs` | 980 | `b72670f` 2026-08-23 | Decision kernel: merge gate, drift detection, wait/re-entry, pre-write journal |
| `rick-loop-controller-check.mjs` | 738 | — | Regression suite (208 assert calls) |
| `rick-loop-review-dispatch.mjs` | 331 | `70c19d0` 2026-09-18 | Controller-owned `workflow_dispatch` review dispatch |
| `rick-loop-review-dispatch-check.mjs` | 721 | — | Regression suite (110 assert calls) |
| `rick-loop-validation.mjs` | 343 | `4dbade2` 2026-08-24 | AC/DoD coverage, fast gates, validation verdict |
| `rick-loop-v1.4-check.mjs` | 218 | — | Validation regression suite (60 assert calls) |
| `rick-loop-watcher.mjs` | 287 | `1a27df3` 2026-09-18 | Retryable-wait polling, review retry/re-dispatch |
| `rick-loop-preflight.mjs` | 273 | `f3fc479` 2026-09-18 | Nine fail-closed pre-dispatch checks |
| `rick-loop-supervisor.mjs` | 168 | `70c19d0` 2026-09-18 | Authoritative decision surface over the kernel |
| `rick-loop-roadmap.mjs` | 117 | `ad2f748` 2026-08-20 | Plan parsing, `resolveNextEligibleTask` |
| `rick-loop-stats.mjs` | 94 | `4dbade2` 2026-08-24 | Register-derived projection |

**Total: 4,270 lines, of which 1,677 are regression tests (378 assert calls).**

### 2.2 Skills, workflows, state and documentation

| Artifact | Size | Notes |
| --- | --- | --- |
| `.claude/skills/loop/SKILL.md` | 48 lines | Canonical entrypoint, declares "Rick Loop v1.5" |
| `.claude/skills/rick-validator/SKILL.md` | 24 lines | Forked-context independent validator |
| `skills/rick-autonomous-roadmap-loop/SKILL.md` | 65 lines | **Superseded**, last touched 2026-08-05, never updated |
| `.github/workflows/claude-pr-review.yml` | 178 lines | `workflow_dispatch`-only since ARCH-04 |
| `.github/workflows/claude-pr-review-meta.yml` | 200 lines | Secondary reviewer |
| `.github/workflows/validate.yml` | 142 lines | 24 hardcoded RecompraCRM `npm run test:*` steps (31 `npm run` steps total) |
| `docs/operations/STATE.md` | 395 lines | `state_version: 85`, flat YAML |
| `docs/operations/HANDOFF.md` | 273 lines | Resume path |
| `docs/operations/LOOP-REGISTER.jsonl` | 170 lines | Append-only event truth |
| `docs/roadmap/ROADMAP.md` | — | Plan + resolver input |
| `docs/evidence/*.md` | 19 files | TASK-01…16, ARCH-04, pilot audit, final audit |
| `docs/specs/*.md` | 9 files | ARCH-04 + TASK-09…16 **only** |
| `RICK-LOOP-V1.3.md` + 3 amendments + `V1.4` | 5 files | Protocol never consolidated |

### 2.3 Version identity — **[NEW] PROVEN**

The source does not have a single version. Four identities coexist at HEAD:

| Source | Declared version |
| --- | --- |
| `rick-loop-controller.mjs:13` | `RICK_LOOP_V1_3_3` |
| `rick-loop-supervisor.mjs:6` | `RICK_LOOP_V1_5` |
| `.claude/skills/loop/SKILL.md:8` | `Rick Loop v1.5` |
| `docs/roadmap/ROADMAP.md:6` | `RICK_LOOP_V1_3` |

`LOOP-REGISTER.jsonl` carries **nine distinct `loop_version` values** across 170
lines, including two that were never ratified:

```
RICK_LOOP_V1_4: 71   RICK_LOOP_V1_5: 35   (absent): 20   RICK_LOOP_V1_3_1: 15
RICK_LOOP_V1_3_4_PROPOSED: 9   RICK_LOOP_V1_3: 8   RICK_LOOP_V1_3_4: 6
RICK_LOOP_V1_3_3_PROPOSED: 5   RICK_LOOP_V1_3_2: 1
```

The protocol itself lives across five unconsolidated documents while the runtime
declares two further values.

**Consequence for v2:** there is no coherent artifact to call "the v1.5 loop".
v2 must declare one version constant, sourced from one place, asserted by a test
that fails when any declaration diverges (AC-9).

---

## 3. Dependencies on RecompraCRM

### 3.1 The important result — **[NEW] PROVEN**

**The loop core imports no product code.** Every import across all eight runtime
modules resolves to a Node builtin or a sibling loop module:

```
node:url(7)  node:fs(6)  node:child_process(6)  node:path(3)  node:crypto(3)
node:os(1)  node:assert(2)  + 11 sibling ./rick-loop-*.mjs imports
```

No `@prisma/client`, no `next`, no `lib/`, no `app/`. The package's four runtime
dependencies belong to the product, not to the loop. **The loop's true external
dependencies are `node`, `git` and the `gh` CLI.**

This is the single most favourable finding for reuse: coupling is confined to
constants and one regex family, not to logic. The extraction is a
parameterisation exercise, not a rewrite.

### 3.2 Every coupling point, enumerated

| # | Location | Coupling | Kind |
| --- | --- | --- | --- |
| D1 | `controller.mjs:616,622,628`; `preflight.mjs:223-225,257`; `stats.mjs:4` | Hardcoded `docs/operations/STATE.md`, `HANDOFF.md`, `LOOP-REGISTER.jsonl`, `docs/roadmap/ROADMAP.md` | Path constant |
| D2 | `controller.mjs:119`; `validation.mjs:312`; `supervisor.mjs:143` | Hardcoded `docs/specs/${task}.md` | Path constant |
| D3 | `controller.mjs:104,105,114`; `roadmap.mjs:46` | `TASK-\d+` / `ARCH-` literal ID grammar | ID scheme |
| D4 | `preflight.mjs:38-40` | `TRACKED_POINTERS` hardcodes `entry: "ARCH-04"` on all three pointers | **Governance item identity** |
| D5 | `validation.mjs:19` | `prisma/migrations/` in `CRITICAL_PATH_PATTERNS` | Product stack |
| D6 | `validation.mjs:14-20` | `app/api/`, `lib/.*(domain\|forecast\|…)` critical paths | Product layout |
| D7 | `review-dispatch.mjs:13`; `watcher.mjs:8` | `CLAUDE_REVIEW_WORKFLOW = "claude-pr-review.yml"` | CI identity |
| D8 | `controller.mjs:62` **and** `supervisor.mjs:11` | Two **divergent** `DOCS_ONLY_ALLOWLIST` regexes for one concept | **Duplicated rule** |
| D9 | `controller.mjs:30`; `preflight.mjs:157` | `DEFAULT_BRANCH = "main"` | Config default |
| D10 | `controller.mjs:33` | `GOVERNANCE_TASK = "LOOP-GOVERNANCE"` | ID scheme |
| D11 | `.github/workflows/validate.yml` | 24 RecompraCRM-specific `npm run test:*` steps (31 `npm run` steps total) | CI content |
| D12 | `package.json` | `loop:*` / `test:loop-*` scripts mixed into a Next.js app manifest | Packaging |

D1, D2, D7, D9 are mechanical. **D4 and D8 are defects, not merely coupling**,
and are promoted to §5 (C2, C5).

---

## 4. Proven components — port as-is

Carried from the final audit §15 and the transfer plan Tier A. Each was verified
in production across 43 merged PRs.

| # | Component | Evidence | Disposition |
| --- | --- | --- | --- |
| P1 | `evaluateMergeAllowed`, `isCleanReviewResult`, `countUnresolvedFindings`, `selectMergeResult`, `buildAnchoredResults`, `filterAnchoredCleanComments` | **PROVEN, and re-derived precisely in M0** — all six last changed at `2b1e2f7` (PR #23, 2026-08-23) and unchanged across the **23 PRs merged after it**; outranked agent judgement on #40, #39, #45. See FINDING-002: the source audit's wording *"not modified by any of the 43 merged PRs"* is imprecise, because PR #23 was itself a merged PR that modified them | **Port byte-identical.** Move the file; do not edit the logic |
| P2 | Exact-head verdict contract (`Reviewed commit: <sha>` + explicit clean phrase + independent author + zero unresolved anchored findings) | **PROVEN** — `countUnresolvedFindings` correctly excluded `isOutdated` threads on #44 | Port unchanged, **including author independence** |
| P3 | `rick-loop-preflight.mjs` — nine fail-closed checks; unevaluable ⇒ failure | **PROVEN** — blocked its own PR (#39); blocked #47's dispatch on red CI | Port; preserve the fail-closed property |
| P4 | `rick-loop-review-dispatch.mjs` — `workflow_dispatch`, exact-head verification, `--ref <default branch>` | **PROVEN** — 16/81 cancelled pre-cutover vs 1/18 after; duplicate dispatch refused in `IN_FLIGHT` and `REVIEWED` | Port with the `--ref` security property intact |
| P5 | Automatic recovery and re-entry — `startWait`, `recordPoll`, `evaluateWaitEscalation`, `describeReentry`, `reconstructWaitFromFacts`, pre-write journal | **PROVEN** — survived notebook shutdown and usage-limit interruption; reconstructed from git/PR/CI rather than from stale STATE | Port; keep facts-first reconstruction |
| P6 | Schema-isolation test pattern | **PROVEN** — TASK-15; no schema leaked, shared row counts unchanged | Port as a documented pattern (adapter level) |
| P7 | Ephemeral Playwright policy | **PROVEN** — TASK-14/15 complied; nothing tracked | Port as policy |
| P8 | Regression suites — 378 assert calls, `node:assert` only | **PROVEN** — zero framework dependency | Port **first**, before any correction (§7) |

**Constraint carried from the transfer plan's sequencing section:** porting Tier
A *partially* is worse than not porting it. The gate's value is that it cannot be
adjusted under pressure — including by the person porting it.

---

## 5. Components requiring correction

Ordered by the cost of getting them wrong, not by effort. C1–C10 map to the
owner's named correction list; C11–C12 carry Tier B items that remain open.

### C1 — Computed state and generated HANDOFF
**Defect (transfer plan B2.1, audit §14.3):** `detectStateDrift` compares
STATE's `next_eligible_task` to HANDOFF's **for mutual agreement only**. The
final audit's own PR set both to `none` while the resolver returned TASK-16: the
two files agreed with each other, disagreed with reality, and the gate passed.

**Correction:** cross-check every recorded pointer against **computed truth**.
The controller already computes `roadmap_next_eligible_task`; nothing consults
it. HANDOFF's pointer block becomes **generated** from computed state rather
than hand-written, so the class is structurally unavailable rather than merely
checked. Human prose stays hand-written, below an explicit marker.

### C2 — Narrative and pointer consistency — **[NEW] evidence, and it is live**
**Defect, PROVEN at the audited commit.** The audit documents 17 occurrences of
*a pointer advancing while the prose explaining it stayed behind*, and treats
them as historical. An **eighteenth is live at `87d27d1`**:

| Source | `current_task` | `next_eligible_task` | `loop_version` |
| --- | --- | --- | --- |
| `docs/operations/STATE.md:77-79` | TASK-16 | TASK-16 | `RICK_LOOP_V1_5` |
| `docs/operations/HANDOFF.md:10-12` | TASK-16 | TASK-16 | `RICK_LOOP_V1_5` |
| **`docs/roadmap/ROADMAP.md:6-8`** | **TASK-12** | **TASK-12** | **`RICK_LOOP_V1_3`** |

The ROADMAP header is **four tasks stale** and names a superseded protocol
version — in the file `resolveNextEligibleTask` reads, at the commit that merged
the final audit, with `Validate` green, review clean and preflight 9/9.

**Why every gate missed it, PROVEN by reading the gates:**

- `detectStateDrift` (`controller.mjs:324`) compares STATE ↔ HANDOFF **only**. The ROADMAP is not a party to that comparison.
- `comparePointers` (`preflight.mjs:94`) reads ROADMAP **entry sub-fields** through `readRoadmapEntryFields`, and `TRACKED_POINTERS` names only `ARCH-04`. The ROADMAP **header block is compared by nothing at all**.

This is a **sharper finding than the audit's own §14.3**, which frames the gap
as "recorded pointer vs computed truth". The narrower truth is that **one of the
three sources the protocol calls authoritative sits structurally outside the
pointer gate**, and did so for the entire run.

**Correction:** the ROADMAP header joins the tracked pointer set; `updated_at`
freshness is checked against the file's own last commit timestamp (identified
during the source run, **never implemented**); current-state claims must appear
above an explicit historical marker, and that placement is checked.

### C3 — LOOP-REGISTER schema and severity — **[NEW] measurement**
**Defect (transfer plan B1):** 120 of 182 finding records carry no severity.
This audit measured the schema directly: **170 lines, 0 invalid JSON, 282
distinct keys, and `severity` present on exactly 1 line (0.6%)**. The key space
includes one-off narrative fields such as `why_this_one_is_the_sharpest` and
`fourth_instance_and_why_it_is_the_worst`.

The register is a **prose journal with JSON syntax**. Line-level JSON validity —
the only property preflight checks — is satisfied while the schema is absent.

**Correction:** a closed core schema (`run_id`, `task`, `event`, `status`,
`severity`, `at`, plus a typed `findings[]` array replacing `finding`,
`finding_2` … `finding_7`), validated **on append**, with an open `notes` object
for narrative. Severity required on any entry carrying a finding.

### C4 — Authoritative validation coverage
**Defect (audit §5, transfer plan honest limits):** `validation_attempts: 1`,
`validation_failures: 0` across the entire run. The `rick-validator` path is
**PARTIALLY PROVEN at best** — exercised once, never observed to fail.

By the source's own lesson 1, *a gate that cannot fail is indistinguishable from
no gate*. This is the **least proven** component being carried forward, and it
is a gate.

**Correction:** failing-path tests for every declared validation rejection rule ID, each observed firing, before
the path is relied upon; record every attempt and every failure.

### C5 — Deterministic rule duplication — **[NEW]**
**Defect:** `DOCS_ONLY_ALLOWLIST` exists twice with **different content**.
`controller.mjs:62` omits the `RICK-LOOP-V*-AMENDMENT` and nested-evidence
alternatives that `supervisor.mjs:11` includes. One concept, two regexes, two
behaviours, and no test comparing them. **The rule drifted from itself** — the
same class as C2, expressed in code rather than prose.

**Correction:** one definition in core, imported by both; a test asserting a
single source of truth.

### C6 — Complete SDD from task one
**Defect (audit §9, lesson 6):** specs began at TASK-09. TASK-01…08 have
validation evidence but **no acceptance criteria to check it against**, so a
third of the roadmap is unverifiable in principle. Where specs existed,
TASK-15's took 5 review rounds and caught **8 defects before any implementation
existed**.

**Correction:** the spec gate is mandatory from task 1 and enforced by the
controller, not by convention.

### C7 — Orphan PR detection — **[NEW] confirmation**
**Defect (audit §3):** PR **#21** (`fix/rick-loop-executor-dispatch`, opened
2026-08-20) is **still open at audit time** — 31 days, unreferenced by any later
work, invisible to every gate. Verified today: it is now the repository's *only*
open PR.

**Correction:** reconciliation enumerates all open PRs, not only the one matching
the current task, and reports any PR not owned by an active roadmap item.

### C8 — Resolver decision gates
**Defect (transfer plan C1):** `ARCH-03` exists only as a STATE/HANDOFF mention
with no ROADMAP entry, so it is **invisible to `resolveNextEligibleTask` and can
never be selected**. Confirmed structurally: the resolver's only input is the
parsed ROADMAP plan.

**Correction:** every work item requires a ROADMAP entry at creation; the
controller refuses to record an item it cannot resolve, and reports items
mentioned in STATE/HANDOFF that have no plan entry.

### C9 — Review-cost telemetry
**Defect (audit §12, lesson 10):** only **6 of 99** review runs have recoverable
cost ($5.82 total, mean $0.97, range $0.58–$1.14). The 16 cancelled runs — *the
ones most worth measuring* — never printed a result line, so their spend is real
and unrecoverable.

**Correction:** record cost at **dispatch**, reconcile at completion, and treat
an unreconciled dispatch as a cost of unknown magnitude rather than as zero.

### C10 — Evidence integrity
**Defect (audit §4 third class, lesson 12):** three of PR #47's five rounds found
defects in **tests and evidence**, not in shipped behaviour: rejection rules with
no failing-case test for 5 of 7 rules; an evidence document claiming *"PROVADO —
com asserção sobre falha"* where no such assertion existed for five ACs; and
smoke coverage proving only failure paths against a spec that promised the
healthy path too.

**No gate caught any of them, and none could** — they are claims about whether
evidence is adequate.

**Correction, scoped honestly:** this is **not fully mechanisable**.

What is mechanisable:

1. **Every rejection rule carries a stable rule ID**, and each ID must be
   *observed to fire* by a failing-case test that asserts on that ID. Counting is
   not sufficient and was rejected at M0 in response to an independent review
   finding (P2) on PR #1: **two failing tests exercising the same rule while a
   third rule has none still reports parity**, which reproduces the exact
   evidence gap C10 exists to prevent. The check is a set comparison —
   `{rule IDs declared} ⊆ {rule IDs observed firing in a failing test}` — not a
   count, and not the mere existence of a named test.
2. An evidence document asserting "proved by failure assertion" must name a test
   id, and that id must exist and be observed to fail when the guard is inverted.

What remains human: whether the evidence is *sufficient*. v2 states this limit
rather than implying coverage it does not have.

### C11 — Secrets-hygiene self-reference (Tier B3)
Five self-references, answered by allowlist growth until the seventh was solved
structurally. **Correction:** a dedicated fixtures path excluded by path, with
the narrowness of the exclusion asserted by the suite; keep the staleness rule,
which is the part that works.

### C12 — Cleanup that silently no-ops (Tier B4)
`prisma.sale.delete(...)` with an empty `catch` reported success having deleted
nothing, for months. **Correction:** never swallow cleanup failures — assert that
cleanup succeeded, or use schema isolation (P6), which removes the need.
Adapter level.

---

## 6. Proposed repository structure

Principle: **the core cannot name a project.** Anything RecompraCRM-shaped is a
value in a config file or a function in an adapter.

```
rick-loop/
├── README.md
├── package.json                  # zero runtime deps; node:test only
├── rick-loop.config.example.json # the whole project surface, in one file
│
├── core/                         # reusable, project-agnostic, no I/O of its own
│   ├── merge-gate.mjs            # P1 — ported byte-identical
│   ├── review-contract.mjs       # P2 — exact-head verdict contract
│   ├── preflight.mjs             # P3 — fail-closed checks
│   ├── review-dispatch.mjs       # P4 — dispatch economics
│   ├── controller.mjs            # decision kernel
│   ├── supervisor.mjs            # authoritative decision surface
│   ├── watcher.mjs               # P5 — retryable waits
│   ├── reentry.mjs               # P5 — wait / pre-write / reconstruction
│   ├── roadmap.mjs               # plan parse + resolver (+ C8 gates)
│   ├── validation.mjs            # AC/DoD coverage (+ C4)
│   ├── register.mjs              # NEW — C3 schema + append validator
│   ├── pointers.mjs              # NEW — C1/C2 computed-truth cross-check
│   ├── handoff.mjs               # NEW — C1 generated pointer block
│   ├── telemetry.mjs             # NEW — C9 dispatch-time cost
│   ├── orphans.mjs               # NEW — C7 open-PR reconciliation
│   └── rules.mjs                 # C5 — single home for shared rules
│
├── adapters/
│   ├── github-cli.mjs            # every `gh` invocation, isolated
│   ├── git.mjs                   # every `git` invocation, isolated
│   └── docs-layout.mjs           # D1/D2 — config → concrete paths
│
├── config/
│   └── schema.mjs                # config validation; fails closed on unknown keys
│
├── skills/
│   ├── loop/SKILL.md
│   └── rick-validator/SKILL.md
│
├── templates/                    # NOT this repository's live CI
│   ├── workflows/claude-pr-review.yml
│   ├── workflows/claude-pr-review-meta.yml
│   ├── workflows/validate.yml    # parameterised; no project test names
│   └── docs/{STATE,HANDOFF,ROADMAP,SPEC}.template.md
│
├── test/
│   ├── characterization/         # M2 — locks ported behaviour before any edit
│   ├── core/                     # ported 378 assertions + new coverage
│   └── fixtures/                 # C11 — excluded by path, narrowness asserted
│
├── .github/workflows/            # this repository's own CI
│
└── docs/
    ├── foundation/               # this plan
    ├── protocol/RICK-LOOP-V2.md  # §2.3 — ONE consolidated protocol document
    ├── operations/               # STATE, HANDOFF, LOOP-REGISTER for rick-loop itself
    └── evidence/
```

### 6.1 The configuration surface

Every coupling point in §3.2 becomes a key. The config is validated and **fails
closed on an unknown or missing key**, consistent with P3.

```jsonc
{
  "project": { "name": "<project>", "defaultBranch": "main" },
  "ids": {
    "taskPattern": "TASK-\\d+",           // D3
    "archPattern": "ARCH-\\d+",
    "governanceTask": "LOOP-GOVERNANCE"   // D10
  },
  "paths": {                               // D1, D2
    "state": "docs/operations/STATE.md",
    "handoff": "docs/operations/HANDOFF.md",
    "register": "docs/operations/LOOP-REGISTER.jsonl",
    "roadmap": "docs/roadmap/ROADMAP.md",
    "spec": "docs/specs/{task}.md",
    "evidence": "docs/evidence/{task}-validation.md"
  },
  "pointers": {                            // D4 — no longer ARCH-04-shaped
    "tracked": [
      { "id": "roadmap.header.current_task",
        "state": "current_task", "handoff": "current_task",
        "roadmap": { "scope": "header", "field": "current_task" },
        "computed": "controller.current_task" },         // C1
      { "id": "roadmap.header.next_eligible_task",
        "state": "next_eligible_task", "handoff": "next_eligible_task",
        "roadmap": { "scope": "header", "field": "next_eligible_task" },
        "computed": "controller.roadmap_next_eligible_task" }
    ],
    "entryScoped": [ /* per-item pointers; entry id supplied by the caller */ ]
  },
  "review": {                              // D7 — IDENTITY ONLY, never contract
    "workflow": "claude-pr-review.yml",
    "metaWorkflow": "claude-pr-review-meta.yml"
    // NOT configurable, by design — see "The contract is not a config key" below:
    //   author independence, clean-verdict phrases, exact-head anchoring,
    //   and zero-unresolved-findings live in core and have no config surface.
  },
  "validation": {
    "fastGates": ["lint", "typecheck", "unit", "integration", "build"],
    "criticalPaths": ["(^|/)prisma/migrations/", "(^|/)app/api/"]   // D5, D6
  },
  "docsOnlyAllowlist": ["..."]             // D8 — one definition
}
```

`config/schema.mjs` asserts that **no core module reads a path or ID absent from
the config** (AC-4).

### 6.2 The contract is not a config key

*Added at M0 in response to an independent review finding (P1) on PR #1; see
`docs/governance/BOOTSTRAP-EXCEPTION.md`.*

The first draft of §6.1 exposed `requireIndependentAuthor: true` and
`cleanVerdictPhrases` as configuration. That was a defect, and a serious one:
**a consuming repository could have set `requireIndependentAuthor: false` and
disabled the author-independence rule that P2 and OD-2 both call
non-negotiable** — the rule whose absence produced the source's
`CLEAN_VERDICT_FROM_ONE_AUTHOR_MARKED_ANOTHER_AUTHORS_REVIEW_CLEAN` defect.
Requiring the key to be present does not fail closed; it only guarantees that an
unsafe value is stated explicitly.

It would also have reintroduced, through the back door, precisely the property
this project exists to prevent: **a gate adjustable under pressure.** A config
file is the easiest place in a repository to apply that pressure.

The rule, now explicit:

> **Configuration may name identities. It may never state the contract.**

| Belongs in config | Belongs in core, with no config surface |
| --- | --- |
| Which workflow file to dispatch | That the review author must differ from the PR author |
| Which branch is default | Which phrases constitute an explicit clean verdict |
| Where STATE/HANDOFF/ROADMAP live | That the verdict must name the exact HEAD |
| Which ID grammar names a task | That unresolved findings must be zero, and that unknown is not zero |
| Which fast gates exist | That an unevaluable check is a failure |

Enforced by **AC-14**: `config.test.mjs` asserts that no key under `review`
influences `isCleanReviewResult`, `buildAnchoredResults` or
`evaluateMergeAllowed`, and that a config supplying `requireIndependentAuthor`,
`cleanVerdictPhrases` or any other contract key is **rejected as an unknown
key** rather than honoured.

---

## 7. Migration sequence

Ten increments. Each is independently reviewable and leaves the repository in a
working state. **Nothing in M3–M8 begins until M2 is green**, because the
characterization suite is the only thing that can prove a correction did not
weaken the gate.

| # | Increment | Content | Exit condition |
| --- | --- | --- | --- |
| **M0** | Foundation record | This plan; owner review | Plan merged |
| **M1** | Governance bootstrap | `package.json` (zero deps), this repository's CI, branch protection, the §6 templates | `main` protected; CI green; §1.1 residual closed |
| **M2** | **Characterization port** | Copy the 8 core modules and all 378 assertions **unedited** except import paths; add golden-vector tests over `evaluateMergeAllowed`, `isCleanReviewResult`, `countUnresolvedFindings`, `selectMergeResult`, `evaluatePreflight`, `evaluateDispatch` | 378 assertions green + golden vectors recorded. **No behaviour changed in this step** |
| **M3** | Parameterisation | D1, D2, D3, D7, D9, D10 → config; `adapters/*` extracted; C5 rule deduplicated | Config-driven; M2 still green **bit-for-bit** on the merge-gate vectors |
| **M4** | Register schema | C3 — closed core schema, typed findings array, append-time validation, required severity; the 170 source lines imported as a **read-only historical fixture** | An invalid append is refused, with every declared rejection rule ID observed firing in a failing test |
| **M5** | Computed state | C1 + C2 — computed-truth cross-check, generated HANDOFF pointer block, ROADMAP header in the pointer set, `updated_at` freshness | The §5/C2 live drift is **reproduced as a failing test**, then passes |
| **M6** | Resolver + orphans | C7, C8 — open-PR enumeration, plan-entry requirement, unresolvable-item reporting | A PR #21-shaped orphan is detected in fixture; an ARCH-03-shaped item is refused |
| **M7** | Validation + evidence | C4, C6, C10 — validation failing-path tests, spec mandatory from task 1, guard rule-ID coverage, evidence test-id assertions | Every declared rejection rule ID is observed firing in a failing test |
| **M8** | Telemetry + hygiene | C9, C11, C12 — dispatch-time cost, fixtures exclusion, cleanup assertions | Cost recorded at dispatch; an unreconciled dispatch is not reported as zero |
| **M9** | Baseline declaration | One `RICK_LOOP_V2_0` constant; consolidated `docs/protocol/RICK-LOOP-V2.md`; v2 runs its own loop on a throwaway item | Self-hosting proof (AC-10) |

**M2 is the load-bearing step.** Porting the gate and *then* proving it unchanged
is the only sequence in which "we did not weaken it" is a fact rather than an
intention. The source's lesson 4 applies directly: a figure repeated in n places
needs a sweep for all n — here, a behaviour proven in one repository needs a
vector suite in the other, not an assurance.

---

## 8. Regression tests

### 8.1 Ported, unchanged (M2)
378 assert calls across three suites, `node:assert` only. They must run **before**
any correction and stay green through M3–M8.

### 8.2 Golden vectors (M2) — new
Frozen input/output pairs for the six gate functions, stored as JSON. Any change
to a vector requires an explicit, reviewed diff. This makes weakening the gate
**visible as a data change**, rather than hidden inside a logic edit.

### 8.3 New suites, by correction

| Suite | Proves | Answers |
| --- | --- | --- |
| `pointers.test.mjs` | Recorded pointers cross-checked against computed truth; **the §5/C2 three-source drift fails the gate**; `updated_at` staleness detected | C1, C2 |
| `register.test.mjs` | Append refused for: missing `severity` on a finding, unknown top-level key, invalid JSON, missing `run_id`/`task`/`event` — **every declared rule ID observed firing in a failing test** | C3 |
| `rules.test.mjs` | `DOCS_ONLY_ALLOWLIST` has exactly one definition; controller and supervisor resolve identically | C5 |
| `orphans.test.mjs` | An open PR with no active roadmap item is reported | C7 |
| `resolver.test.mjs` | An item without a plan entry is refused at creation, and reported if already present | C8 |
| `validation-failpaths.test.mjs` | Every declared validation rejection rule ID is observed firing in a failing test | C4 |
| `spec-gate.test.mjs` | Task 1 without a spec cannot start | C6 |
| `evidence-integrity.test.mjs` | Declared guard rule IDs are a subset of rule IDs observed firing in failing tests (set comparison, never a count); evidence "failure assertion" claims name an existing test id | C10 |
| `telemetry.test.mjs` | Cost recorded at dispatch; an unreconciled dispatch reports unknown, not zero | C9 |
| `config.test.mjs` | No core module reads a path/ID absent from config; an unknown config key fails closed | §6.1 |
| `version.test.mjs` | Exactly one version constant; every declaration matches it | §2.3 |

### 8.4 The standing rule
From lessons 1 and 2, both promoted from prose into CI:

1. **Every guard has a test that makes it fail.** A declared rule ID not observed firing in any failing test is a build failure; counting rules against tests is explicitly not sufficient.
2. **Anything that scans tracked files is validated after its own files are tracked.** The source's guard passed locally and failed CI twice for exactly this reason.

---

## 9. Acceptance criteria

Each AC is provable by a named command or test. Following the validator
contract: a partial result is not a pass.

| AC | Criterion | Proof |
| --- | --- | --- |
| **AC-1** | The six merge-gate functions are byte-identical to the source, modulo import paths | Diff against source @ `87d27d1`; golden vectors green |
| **AC-2** | Preflight remains fail-closed: every unevaluable check is a failure | One test per check forcing unevaluable input |
| **AC-3** | Dispatch uses `--ref <default branch>`; a PR-branch ref is refused | `buildDispatchArgs` test asserting refusal |
| **AC-4** | No core module names a project-specific path, ID or workflow | `config.test.mjs` + static scan of `core/` |
| **AC-5** | A recorded pointer disagreeing with computed truth fails preflight | The §5/C2 fixture, reproduced from `87d27d1` |
| **AC-6** | A register append without required `severity` on a finding is refused | `register.test.mjs` |
| **AC-7** | An open PR with no active roadmap item is reported by reconciliation | PR #21 fixture |
| **AC-8** | A work item without a ROADMAP entry cannot be recorded | ARCH-03 fixture |
| **AC-9** | Exactly one version constant exists, and every declaration matches it | `version.test.mjs` |
| **AC-10** | v2 executes one throwaway task end-to-end in `rick-loop` itself: spec → validation → dispatched exact-head review → gate → merge | Self-hosting run, evidence recorded |
| **AC-11** | Review cost is recorded at dispatch; a cancelled run reports unknown cost | `telemetry.test.mjs` |
| **AC-12** | Every declared validation rejection rule ID is observed firing in a failing-case test | `validation-failpaths.test.mjs` |
| **AC-13** | RecompraCRM is unmodified | `git status` clean and `git rev-parse HEAD` still `87d27d1` |
| **AC-14** | No configuration key can weaken the review contract: a config supplying `requireIndependentAuthor`, `cleanVerdictPhrases` or any other contract key is **rejected as unknown**, not honoured | `config.test.mjs`; see §6.2 |

**AC-10 is the baseline declaration.** Until v2 has driven one real task through
its own gate, it is a plan that compiles, not a verified loop.

---

## 10. Risks and dependencies

### 10.1 Risks

| # | Risk | Severity | Mitigation |
| --- | --- | --- | --- |
| R1 | **The port weakens the gate while "improving" it.** Its proven property is that it was never adjusted; a rewrite is the likeliest moment to adjust it | **High** | M2 before M3–M8; golden vectors; AC-1 byte-identity |
| R2 | **Correcting C1/C2 reproduces C1/C2.** The final audit drifted four times *while documenting drift*, twice *while fixing it* | **High** | Generated pointers rather than checked ones; grep-sweep before declaring a correction done (lesson 4); C2's own live instance as the regression fixture |
| R3 | **The validation path is trusted on a single observation** — `validation_attempts: 1`, `failures: 0` | **High** | C4/AC-12 before the path is relied on; treat as unproven until failing paths exist |
| R4 | Register migration rewrites history to fit the new schema | Medium | The 170 source lines import **read-only as fixture**; the new schema governs new entries only; append-only invariant preserved |
| R5 | Config indirection makes the gate harder to read than the hardcoded original | Medium | Config carries values only — **no logic, no predicates**; core stays readable |
| R6 | Skills drift from the runtime, as `skills/rick-autonomous-roadmap-loop` did (untouched since 2026-08-05 while the protocol reached v1.5) | Medium | One skills location; a test asserting the skill's declared version matches AC-9's constant |
| R7 | Evidence integrity (C10) is presented as solved when it is partly human | Medium | C10 states its limit explicitly; no AC claims full coverage |
| R8 | v2 is declared on green tests without self-hosting | Medium | AC-10 is mandatory for the baseline declaration |
| R9 | Accidental write to RecompraCRM during extraction | **High** | Copy-out only; AC-13 asserts the source HEAD is unchanged; no branch, commit or config operation on the source |
| R10 | `node_modules`, `.next` and the six `.tmp-task09-lockorder-*` directories get copied along | Low | Explicit file allowlist for extraction, never a directory copy |

### 10.2 Dependencies

| Kind | Dependency | Status |
| --- | --- | --- |
| Runtime | Node.js ≥ 24 (source ran v24.15.0) | **Available** |
| Runtime | `git` | Available |
| Runtime | `gh` CLI, authenticated | **Available** — `devricardo90`, keyring |
| Platform | GitHub Actions on `devricardo90/rick-loop` | Repository exists, **empty**; no workflows yet |
| Platform | `anthropics/claude-code-action@v1` + review credentials | **NOT TESTED in this repository** — carried from source config, unverified here |
| Platform | A second, independent reviewer identity | Required by P2's independence rule; **must be provisioned before AC-10** |
| Owner | Branch protection on `main` | **Owner action**, M1 |
| Owner | Review budget authorisation (source mean: $0.97/review) | **Owner decision**, before AC-10 |

### 10.3 Explicit non-goals for this phase

- The 10-sprint LoopLab experiment. **Not started**, per instruction.
- Any deployment capability. The source's deploy path is **NOT TESTED** — its smoke script has proven failure paths and has never run against a deployment. Nothing here should be read as deployment experience.
- Concurrent task execution. **NOT TESTED** in the source; every task ran one at a time.
- Retroactive specs for TASK-01…08. Not attempted in the source, not attempted here.

---

## 11. Proposed implementation sequence

1. **M0** — owner reviews this plan; confirm the §1.1 bootstrap residual and the §12 open decisions.
2. **M1** — governance bootstrap, so that subsequent increments are actually governed.
3. **M2** — characterization port. **Highest value per unit of risk**, and the only moment at which "unchanged" is cheap to prove.
4. **M3** — parameterisation, with M2 as the standing invariant.
5. **M4 + M5** — register schema and computed state, following the transfer plan's own sequencing: *fix B1 and B2 before running an autonomous loop of any length.*
6. **M6 → M8** — resolver/orphans, validation/evidence, telemetry/hygiene.
7. **M9** — one version, one protocol document, and AC-10 self-hosting.

---

## 12. Open decisions for the owner

Each blocks a specific increment; none blocks M0–M2.

| # | Decision | Blocks | Recommendation |
| --- | --- | --- | --- |
| **OD-1** | Does the 170-line source register migrate as a historical fixture, or does v2 start with an empty register? | M4 | **Fixture, read-only.** It is the evidence base for §5 and must not be rewritten to fit a schema it predates |
| **OD-2** | Second independent reviewer identity for this repository | AC-10 | Provision before M9. P2's independence rule is non-negotiable and was proven load-bearing on #40 |
| **OD-3** | Review budget for v2's own loop | AC-10 | Authorise a capped amount; the source mean was $0.97/review |
| **OD-4** | Does `rick-loop` ship as an npm package, a git submodule, or a copied `core/` directory? | M3 structure | **Copied `core/` + config** first. Packaging is a distribution question, and the source proved nothing about it |
| **OD-5** | Is RecompraCRM ever migrated onto v2, or does it stay frozen at the experiment? | Out of scope for M0–M9 | **Stay frozen.** It is a real product, and the instruction is read-only |

---

## 13. M0 outputs

This plan is one of seven M0 artifacts. The others carry the detail this
document only summarises, and each is authoritative for its own subject.

| Artifact | Authoritative for |
| --- | --- |
| `docs/evidence/FINDING-001-roadmap-header-drift.md` | The live three-source drift (C2), its mechanism, and its regression fixture |
| `docs/evidence/FINDING-002-merge-gate-provenance.md` | The precise freeze point of the six gate functions, and the correction to P1's wording |
| `docs/protocol/VERSION-IDENTITY.md` | `RICK_LOOP_V2_0_0` (CANDIDATE) and its binding to source commits |
| `docs/governance/BOOTSTRAP-EXCEPTION.md` | `GBE-001` — what was and was not gated, reviewed or validated |
| `docs/foundation/M1-M2-ACCEPTANCE-CRITERIA.md` | The explicit criteria for M1 and M2 |
| `test/golden/merge-gate-vectors.json` | The frozen behavioural contract — 57 vectors |
| `test/golden/README.md` | What the vectors are, and the rule that a diff in them is a behaviour change |

Two corrections were applied to this document during M0 review, both from an
independent review of PR #1, and both recorded in `GBE-001` rather than applied
silently: **§6.2** (configuration may not state the review contract, new AC-14)
and **C10/§8** (rule-ID set comparison, never count parity). Two imprecise
figures of my own were also corrected and swept: the register's distinct-key
count (282, not "~250") and `validate.yml`'s step count (24 test steps of 31
total, not "20+").

---

## Summary of findings

**PROVEN and portable:** a deterministic fail-closed merge gate that held for 43
merges without being weakened, a dispatch mechanism with measured economics
(16/81 cancelled → 1/18), fail-closed preflight, an exact-head review contract
with author independence, and recovery that reconstructs from repository facts.
The core imports **no product code**, so the extraction is parameterisation
rather than a rewrite.

**PROVEN and broken:** the bookkeeping layer. The dominant defect class is not
historical — **the ROADMAP header is four tasks stale at the audited commit**, in
the file the resolver reads, with every gate green, because **no gate compares it
to anything**. The register carries 282 distinct ad-hoc keys and one severity field
across 170 lines. The protocol answers to four names and nine recorded version
values.

**Least proven, and it is a gate:** authoritative validation ran once and never
failed. By the source's own first lesson, that is indistinguishable from no gate.

**The sequencing this implies:** port the gate verbatim and prove it unchanged
before correcting anything around it. The experiment's most repeated defect was
introduced *by correction passes* — four times inside the audit that documented
it. v2's first obligation is not to repeat that.
