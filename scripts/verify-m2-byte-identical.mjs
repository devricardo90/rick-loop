// Verify all six merge-gate function bodies are byte-identical to source 87d27d1
import { execSync } from 'child_process';
import { readFileSync } from 'node:fs';

const source = execSync(
  'cd C:/Users/ricardodev/Desktop/RecompraCRM && git --no-pager show 87d27d1:scripts/rick-loop-controller.mjs',
  { encoding: 'utf8' }
);

const functions = ['evaluateMergeAllowed', 'isCleanReviewResult', 'countUnresolvedFindings', 'filterAnchoredCleanComments', 'buildAnchoredResults', 'selectMergeResult'];

let allOk = true;
for (const fn of functions) {
  const pattern = new RegExp('export function ' + fn + '\\s*\\([^)]*\\)\\s*\\{', 's');
  const match = source.match(pattern);
  if (!match) {
    console.error(fn + ': NOT FOUND in source');
    allOk = false;
    continue;
  }
  const content = readFileSync('core/' + fn + '.mjs', 'utf8');
  const body = content.trim();
  const startIdx = source.indexOf(body);
  if (startIdx === -1) {
    console.error(fn + ': BODY NOT FOUND in source');
    allOk = false;
  } else {
    const sourceBody = source.substring(startIdx, startIdx + body.length);
    const ok = sourceBody === body;
    console.log(fn + ': ' + (ok ? 'BYTE-IDENTICAL' : 'MISMATCH'));
    if (!ok) allOk = false;
  }
}

console.log('\nAll six function bodies byte-identical: ' + (allOk ? 'PASS' : 'FAIL'));
if (allOk) {
  console.log('M2-AC-1 SATISFIED: Six merge-gate function bodies are byte-identical to source 87d27d1.');
}
