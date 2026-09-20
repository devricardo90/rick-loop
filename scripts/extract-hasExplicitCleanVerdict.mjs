import { execSync } from 'child_process';
import { writeFileSync } from 'node:fs';

const source = execSync(
  'cd C:/Users/ricardodev/Desktop/RecompraCRM && git --no-pager show 87d27d1:scripts/rick-loop-controller.mjs',
  { encoding: 'utf8' }
);

// Extract hasExplicitCleanVerdict
const pattern = /export function hasExplicitCleanVerdict\s*\([^)]*\)\s*\{/s;
const match = source.match(pattern);
if (!match) {
  console.error('NOT FOUND: hasExplicitCleanVerdict');
  process.exit(1);
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
writeFileSync('C:/Users/ricardodev/Desktop/rick-loop/core/hasExplicitCleanVerdict.mjs', body + '\n');
console.log('Wrote core/hasExplicitCleanVerdict.mjs (' + body.length + ' chars)');
