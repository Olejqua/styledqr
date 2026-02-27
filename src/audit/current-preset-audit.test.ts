import { describe, expect, it } from 'vitest';
import { CURRENT_PRESET_CRITERIA } from './current-preset-audit';

describe('CURRENT_PRESET_CRITERIA', () => {
  it('contains default, telegram, mono', () => {
    expect(Object.keys(CURRENT_PRESET_CRITERIA).sort()).toEqual(['default', 'mono', 'telegram']);
  });
});
