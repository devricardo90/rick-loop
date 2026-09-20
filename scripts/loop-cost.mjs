// scripts/loop-cost.mjs — M1-AC-11: cumulative review spend reportable
// The cap is read from the canonical decision record (docs/governance/OWNER-DECISIONS.md),
// never hardcoded. Per M1-AC-11: "The cap value is read from the canonical decision
// record, never hardcoded here."
// Supersedes entries: entries with a `supersedes` field indicate that the
// referenced entry's cost/status has been corrected. Per OD-3 rule 3,
// "never zero" — cost: 0 is forbidden for any dispatch.
import { readFileSync } from 'node:fs';

const DECISION_PATH = new URL('../docs/governance/OWNER-DECISIONS.md', import.meta.url);
const REGISTER_PATH = new URL('../docs/operations/LOOP-REGISTER.jsonl', import.meta.url);

function readCap() {
  const doc = readFileSync(DECISION_PATH).toString();
  const match = doc.match(/\$\s*(\d+(?:\.\d+)?)\s*cap/);
  if (!match) {
    throw new Error(
      'Could not find review cost cap in docs/governance/OWNER-DECISIONS.md. ' +
      'Expected a dollar amount near "cap" in the OD-3 section.'
    );
  }
  return parseFloat(match[1]);
}

function main() {
  const cap = readCap();
  const lines = readFileSync(REGISTER_PATH).toString().trim().split('\n');
  let total = 0;
  let unknown = 0;
  const entries = [];
  const supersededCommits = new Set();
  const correctionEntries = [];

  // First pass: collect supersedes references
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.supersedes && Array.isArray(entry.supersedes)) {
        for (const su of entry.supersedes) {
          supersededCommits.add(su);
        }
        correctionEntries.push(entry);
      }
    } catch { /* skip invalid lines */ }
  }

  // Second pass: evaluate costs, applying supersede corrections
  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      let cost = entry.cost ?? 'UNKNOWN';
      const isSuperseded = supersededCommits.has(entry.commit);

      // If this entry is superseded by a correction, the actual cost is UNKNOWN
      if (isSuperseded) {
        cost = 'UNKNOWN';
      }

      if (cost === 'UNKNOWN') {
        unknown++;
      } else {
        total += typeof cost === 'number' ? cost : 0;
      }
      entries.push({ commit: entry.commit, cost, status: entry.status, isSuperseded });
    } catch { /* skip invalid lines */ }
  }

  const spend = total;
  const remainder = cap - spend;
  const allUnknown = unknown === entries.length;
  const hasCorrections = correctionEntries.length > 0;

  console.log(`Review cost report (OD-3 cap: $${cap})`);
  console.log(`  Entries: ${entries.length}`);
  if (hasCorrections) {
    console.log(`  Corrections applied: ${correctionEntries.length} (supersedes ${correctionEntries.reduce((s, e) => s + e.supersedes.length, 0)} original entries)`);
  }
  if (allUnknown) {
    console.log(`  Actual spend: UNKNOWN (all entries carry cost: UNKNOWN per OD-3 rule 3)`);
    console.log(`  Cost recorded: $0 (no numeric cost entries exist after supersede corrections)`);
  } else {
    console.log(`  Cost recorded: $${spend}`);
  }
  console.log(`  Unknown cost: ${unknown} entries`);
  console.log(`  Remainder: $${remainder}`);
  if (allUnknown || hasCorrections) {
    console.log(`  WARNING: UNKNOWN costs are NOT zero. No actual spending may be claimed.`);
  }
}

main();
