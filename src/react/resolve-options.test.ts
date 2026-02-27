import { describe, expect, it } from 'vitest';
import { resolvePrettyQROptions } from './resolve-options';

describe('resolvePrettyQROptions', () => {
  it('applies precedence preset < short props < options', () => {
    const resolved = resolvePrettyQROptions({
      value: 'hello',
      preset: 'rounded',
      size: 180,
      options: {
        size: 240,
        style: {
          foreground: '#111111',
        },
      },
    });

    expect(resolved.text).toBe('hello');
    expect(resolved.size).toBe(240);
    expect(resolved.style?.foreground).toBe('#111111');
    expect(resolved.style?.background).toBe('#ffffff');
  });

  it('uses default preset when preset is not provided', () => {
    const resolved = resolvePrettyQROptions({ value: 'hello' });
    expect(resolved.style?.foreground).toBe('#000000');
  });

  it('falls back to default preset for unknown preset values', () => {
    const resolved = resolvePrettyQROptions({
      value: 'hello',
      preset: 'unknown-preset' as never,
    });

    expect(resolved.style?.foreground).toBe('#000000');
  });

  it('clamps size to minimum 64', () => {
    const resolved = resolvePrettyQROptions({ value: 'hello', size: 12 });
    expect(resolved.size).toBe(64);
  });

  it('throws for empty value', () => {
    expect(() => resolvePrettyQROptions({ value: '' })).toThrow('value is required');
  });
});
