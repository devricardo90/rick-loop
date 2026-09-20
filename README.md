# Rick Loop

An independent, reusable development automation protocol: a deterministic,
fail-closed gate around autonomous roadmap execution.

Rick Loop v1 ran as an embedded experiment inside a real product
(`RecompraCRM`, TASK-01 through TASK-16). v2 extracts the proven half into a
project-agnostic core, corrects the half the experiment showed to be defective,
and makes the protocol reusable across repositories.

## Status

**FOUNDATION / SOURCE AUDIT.** No runtime code has been ported yet.

The current deliverable is the technical foundation plan:

- [`docs/foundation/RICK-LOOP-V2-FOUNDATION-PLAN.md`](docs/foundation/RICK-LOOP-V2-FOUNDATION-PLAN.md)

It contains the source inventory, the proposed repository structure, the
components proven reusable, the corrections required before reuse, the
migration sequence, the regression tests, the acceptance criteria, and the
risks and dependencies.

## Principles carried from the experiment

- The gate outranks judgement, including the agent's own.
- A check that cannot be evaluated is a failure, never a silent pass.
- A guard that cannot fail is indistinguishable from no gate.
- Review is exact-head and independent, or it is not review.
- A written lesson is an intention; only a mechanical check is a control.

## Source

The experiment repository is **read-only** and is not modified by this project.
Audited at `87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a`.
