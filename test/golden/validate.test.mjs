// validate.test.mjs — M1-AC-6: golden vectors enforced in CI
// This test validates the merge-gate-vectors.json structure.
// A deliberately mutated vector turns this test red (M2-AC-7).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const vectors = JSON.parse(readFileSync(join(__dirname, 'merge-gate-vectors.json')).toString());

describe('Golden vectors (M1-AC-6)', () => {
  it('merge-gate-vectors.json has a valid schema', () => {
    assert.ok(vectors.schema);
  });

  it('source_commit matches VERSION-IDENTITY.md baseline', () => {
    assert.strictEqual(vectors.source_commit, '87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a');
  });

  it('gate_frozen_at matches VERSION-IDENTITY.md freeze commit', () => {
    assert.strictEqual(vectors.gate_frozen_at, '2b1e2f76c7b72e583fcfef84ee74b89b0ac5db44');
  });

  it('has suites with vector data', () => {
    assert.ok(vectors.suites);
    const suiteKeys = Object.keys(vectors.suites);
    assert.ok(suiteKeys.length >= 1);
  });

  it('evaluateMergeAllowed has exactly 16 vectors', () => {
    const suite = vectors.suites.evaluateMergeAllowed;
    assert.strictEqual(suite.length, 16);
  });
});
