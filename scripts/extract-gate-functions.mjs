// Extracts six merge-gate functions byte-identically from source 87d27d1
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const source = execSync(
  'cd C:/Users/ricardodev/Desktop/RecompraCRM && git --no-pager show 87d27d1:scripts/rick-loop-controller.mjs',
  { encoding: 'utf8' }
);

const functions = [
  'evaluateMergeAllowed',
  'isCleanReviewResult',
  'countUnresolvedFindings',
  'filterAnchoredCleanComments',
  'buildAnchoredResults',
  'selectMergeResult'
];

const outputDir = 'C:/Users/ricardodev/Desktop/rick-loop/core';

for (const fn of functions) {
  const pattern = new RegExp('export function ' + fn + '\\s*\\([^)]*\\)\\s*\\{', 's');
  const match = source.match(pattern);
  if (!match) {
    console.error('NOT FOUND: ' + fn);
    continue;
  }
  const startIdx = match.index;
  const startBrace = match[0].length;
  let depth = 0;
  let endIdx = startIdx + startBrace;
  for (let i = startIdx + startBrace - 1; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}') depth--;
    if (depth === 0) { endIdx = i + 1; break; }
  }
  const body = source.substring(startIdx, endIdx);
  const filename = fn + '.mjs';
  const filepath = outputDir + '/' + filename;
  writeFileSync(filepath, body + '\n');
  console.log('Wrote core/' + filename + ' (' + body.length + ' chars)');
}
