// scripts/loop-cost.mjs — M1-AC-11: cumulative review spend reportable
import { readFileSync } from 'node:fs';

const cap = 40; // OD-3 cap, read from canonical decision record

function main() {
  const registerPath = new URL('../docs/operations/LOOP-REGISTER.jsonl', import.meta.url);
  const lines = readFileSync(registerPath).toString().trim().split('\n');
  let total = 0;
  let unknown = 0;
  const entries = [];

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      const cost = entry.cost ?? 'UNKNOWN';
      if (cost === 'UNKNOWN') {
        unknown++;
      } else {
        total += cost;
      }
      entries.push({ commit: entry.commit, cost, status: entry.status });
    } catch { /* skip invalid lines */ }
  }

  const measured = total;
  const spend = measured;
  const remainder = cap - spend;

  console.log(`Review cost report (OD-3 cap: $${cap})`);
  console.log(`  Entries: ${entries.length}`);
  console.log(`  Cost recorded: $${spend}`);
  console.log(`  Unknown cost: ${unknown} entries`);
  console.log(`  Remainder: $${remainder}`);
}

main();
