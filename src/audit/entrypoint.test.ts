import { describe, expect, it } from 'vitest';
import { scorePreset } from '../index';

describe('audit exports', () => {
  it('exports scorePreset from package root', () => {
    expect(typeof scorePreset).toBe('function');
  });
});
