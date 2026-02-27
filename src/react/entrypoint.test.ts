import { describe, expect, it } from 'vitest';

describe('react entrypoint', () => {
  it('exports PrettyQR from react entrypoint', async () => {
    const mod = await import('./index');
    expect(mod.PrettyQR).toBeDefined();
  });
});
