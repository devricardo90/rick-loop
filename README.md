# Rick Loop

An independent, reusable development automation protocol: a deterministic,
fail-closed gate around autonomous roadmap execution.

Rick Loop v1 ran as an embedded experiment inside a real product
(`RecompraCRM`, TASK-01 through TASK-16). v2 extracts the proven half into a
project-agnostic core, corrects the half the experiment showed to be defective,
and makes the protocol reusable across repositories.

## Status

**FOUNDATION / SOURCE AUDIT.** No runtime code has been ported yet.

### Canonical documents

Each subject has exactly one authoritative file. Nothing restates another.

| Document | Authoritative for |
| --- | --- |
| [`docs/foundation/RICK-LOOP-V2-FOUNDATION-PLAN.md`](docs/foundation/RICK-LOOP-V2-FOUNDATION-PLAN.md) | The plan, and **the only roadmap** — source inventory, structure, reusable components, corrections, milestone sequence M0–M9, regression tests, acceptance criteria, risks |
| [`docs/governance/OWNER-DECISIONS.md`](docs/governance/OWNER-DECISIONS.md) | **Owner decisions OD-1 … OD-5** |
| [`docs/governance/BOOTSTRAP-EXCEPTION.md`](docs/governance/BOOTSTRAP-EXCEPTION.md) | `GBE-001` — what has and has not been gated, reviewed or validated |
| [`docs/protocol/VERSION-IDENTITY.md`](docs/protocol/VERSION-IDENTITY.md) | The single version identity and its source-commit binding |
| [`docs/foundation/M1-M2-ACCEPTANCE-CRITERIA.md`](docs/foundation/M1-M2-ACCEPTANCE-CRITERIA.md) | M1 and M2 acceptance criteria |
| [`docs/evidence/`](docs/evidence/) | Findings, each with its own reproduction steps |
| [`test/golden/`](test/golden/) | The frozen merge-gate behavioural contract |

**Phase:** M0 complete. M1 (governance bootstrap) is next.

**Governance status:** this repository currently has **zero gate-verified
merges**. See `GBE-001` — the statement is deliberate, and closing it is M1's
job.

## Principles carried from the experiment

- The gate outranks judgement, including the agent's own.
- A check that cannot be evaluated is a failure, never a silent pass.
- A guard that cannot fail is indistinguishable from no gate.
- Review is exact-head and independent, or it is not review.
- A written lesson is an intention; only a mechanical check is a control.

## Source

The experiment repository is **read-only** for the duration of v2 extraction,
development and LoopLab testing, and is not modified by this project. Audited at
`87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a`.

The restriction is temporary rather than permanent: after v2 is validated, the
owner may authorise installing it there through a separate, reviewed migration.
That decision has not been taken. See OD-5.
