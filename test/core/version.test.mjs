// version.test.mjs — AC-9: exactly one version declaration, every occurrence matches
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  RICK_LOOP_VERSION,
  RICK_LOOP_VERSION_STATE,
  SOURCE_BASELINE_COMMIT,
  GATE_FROZEN_COMMIT
} from '../../core/version.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Version identity (AC-9)', () => {
  it('exports RICK_LOOP_VERSION as RICK_LOOP_V2_0_0', () => {
    assert.strictEqual(RICK_LOOP_VERSION, 'RICK_LOOP_V2_0_0');
  });

  it('exports RICK_LOOP_VERSION_STATE as CANDIDATE', () => {
    assert.strictEqual(RICK_LOOP_VERSION_STATE, 'CANDIDATE');
  });

  it('exports SOURCE_BASELINE_COMMIT matching VERSION-IDENTITY.md', () => {
    assert.strictEqual(SOURCE_BASELINE_COMMIT, '87d27d1f2f94a4fa64b0b6e789b1d1d99d1dc27a');
  });

  it('exports GATE_FROZEN_COMMIT matching VERSION-IDENTITY.md', () => {
    assert.strictEqual(GATE_FROZEN_COMMIT, '2b1e2f76c7b72e583fcfef84ee74b89b0ac5db44');
  });

  it('core/ contains only version.mjs', () => {
    const coreDir = join(__dirname, '..', '..', 'core');
    const entries = readdirSync(coreDir);
    assert.strictEqual(entries.length, 1);
    assert.strictEqual(entries[0], 'version.mjs');
  });
});
