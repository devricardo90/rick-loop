// execute.test.mjs — M2-AC-2: run golden vectors against ported functions
// Each golden vector is an input/output pair. The ported functions must
// produce the exact same output as recorded in the vectors.
// A deliberately mutated gate turns this test red (M2-AC-7).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const vectors = JSON.parse(readFileSync(join(__dirname, 'merge-gate-vectors.json')).toString());

// Import ported functions (byte-identical to source 87d27d1)
import { evaluateMergeAllowed } from '../../core/evaluateMergeAllowed.mjs';
import { isCleanReviewResult } from '../../core/isCleanReviewResult.mjs';
import { countUnresolvedFindings } from '../../core/countUnresolvedFindings.mjs';
import { filterAnchoredCleanComments } from '../../core/filterAnchoredCleanComments.mjs';
import { buildAnchoredResults } from '../../core/buildAnchoredResults.mjs';
import { selectMergeResult } from '../../core/selectMergeResult.mjs';

const suiteMap = {
  evaluateMergeAllowed,
  isCleanReviewResult,
  countUnresolvedFindings,
  filterAnchoredCleanComments,
  buildAnchoredResults,
  selectMergeResult
};

for (const [suiteName, suite] of Object.entries(vectors.suites)) {
  const fn = suiteMap[suiteName];
  describe(suiteName + ' (' + suite.length + ' vectors)', () => {
    for (const vector of suite) {
      it(vector.name, () => {
        const input = vector.input;
        const expected = vector.output;
        let actual;
        if (Array.isArray(input)) {
          // Function takes array of arguments (e.g., selectMergeResult takes [results])
          actual = fn(...input);
        } else {
          // Function takes a single object parameter
          actual = fn(input);
        }
        assert.deepStrictEqual(actual, expected,
          'Vector "' + vector.name + '" failed: expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
      });
    }
  });
}

describe('M2-AC-2 total', () => {
  it('all 57 golden vectors reproduce exactly', () => {
    const total = Object.values(vectors.suites).reduce(function(sum, s) { return sum + s.length; }, 0);
    assert.strictEqual(total, 57);
  });
});
