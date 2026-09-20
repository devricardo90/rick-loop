# Rick Loop — Version Identity

Status: **CANDIDATE**, established at M0, ratified at M9.

## The problem this resolves

The source experiment carried **four** simultaneous version identities in its
tree and **nine** recorded values in its register (foundation plan §2.3). There
is no single artifact that can be called "the v1.5 loop", so there is nothing
coherent to port *from* and nothing to compare a port *against*.

M0 therefore establishes one candidate identity, bound to one commit, before any
code moves.

## The single candidate identity

```
RICK_LOOP_V2_0_0
```

| Property | Value |
| --- | --- |
| Identity | `RICK_LOOP_V2_0_0` |
| State | **CANDIDATE** until AC-10 (self-hosting) passes at M9 |
| Declared in | `core/version.mjs` — **one** module, one exported constant |
| Baseline source repository | `RecompraCRM` |
| **Baseline source commit** | **`87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a`** |
| Baseline commit date | 2026-09-20 10:29:31 +0200 |
| Baseline commit subject | `docs(audit): final Rick Loop evaluation, lessons, and RCC transfer plan (#48)` |
| **Merge-gate freeze commit** | **`2b1e2f76c7b72e583fcfef84ee74b89b0ac5db44`** (PR #23, 2026-08-23) |
| Behavioural contract | `test/golden/merge-gate-vectors.json`, 57 vectors |

Two commits are named because they answer two different questions.
`87d27d1` is **what was copied** — the tree state every ported file comes from.
`2b1e2f7` is **what must not change** — the point at which the six merge-gate
functions reached their final form (FINDING-002).

## Why not continue the v1.x numbering

Rejected. Three reasons, in order of weight:

1. **There is no coherent v1.5 to increment from.** Continuing the sequence would
   assert a predecessor that does not exist as a single artifact.
2. **The contract changes.** v2 adds required register fields (C3), a
   computed-truth pointer gate (C1/C2), and a mandatory spec gate from task 1
   (C6). A register written by v1.x does not validate under v2's schema. That is
   a major-version break by any honest reading.
3. **The unit of reuse changes.** v1 was scripts embedded in a product; v2 is a
   project-agnostic core plus adapters and config. The thing being versioned is
   not the same thing.

## Why `CANDIDATE` and not simply `2.0.0`

Because nothing has been ported yet. Declaring a released version at M0 would be
the exact defect class this project exists to correct: **a pointer advancing
ahead of the state it describes.**

The identity becomes `RELEASED` when AC-10 passes — when v2 has driven one real
task through its own gate in this repository. Until then, every artifact that
names a version names it as a candidate.

## Binding rules, enforced by `version.test.mjs` (AC-9)

1. **One declaration.** `core/version.mjs` exports `RICK_LOOP_VERSION`. No other
   module, skill, workflow or document may declare a version literal; they import
   or interpolate it.
2. **Every declaration matches.** The test scans `core/`, `adapters/`, `skills/`,
   `templates/` and `docs/protocol/` for anything matching
   `RICK_LOOP_V[0-9_]+` or `Rick Loop v[0-9.]+` and fails on any value that is
   not the constant. This is the check whose absence produced §2.3.
3. **The baseline binding is asserted.** `core/version.mjs` also exports
   `SOURCE_BASELINE_COMMIT` and `GATE_FROZEN_COMMIT`; the golden-vector file's
   `source_commit` and `gate_frozen_at` must equal them, or the suite fails.
4. **Register entries carry the constant**, never a literal, and never a
   `_PROPOSED` suffix. The source recorded `RICK_LOOP_V1_3_3_PROPOSED` and
   `RICK_LOOP_V1_3_4_PROPOSED` as if they were versions; a proposal is a PR, not
   an identity.
5. **The skill declares the same value.** `skills/loop/SKILL.md` was the artifact
   that drifted furthest in the source (a superseded skill sat untouched from
   2026-08-05 while the protocol advanced). Its declared version is in scope for
   rule 2.

## Shape of the module

```js
// core/version.mjs — the only place a Rick Loop version is written.
export const RICK_LOOP_VERSION = "RICK_LOOP_V2_0_0";
export const RICK_LOOP_VERSION_STATE = "CANDIDATE";   // → "RELEASED" at M9, AC-10
export const SOURCE_BASELINE_COMMIT = "87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a";
export const GATE_FROZEN_COMMIT = "2b1e2f76c7b72e583fcfef84ee74b89b0ac5db44";
```

## What this identity does not claim

- It does not claim the ported code is verified. That is AC-1 through AC-13.
- It does not claim v1.x was ever coherently versioned. It was not; §2.3 records why.
- It does not supersede or renumber any source artifact. The source keeps its own
  register values, amendments and skill headers exactly as written.
