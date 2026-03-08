import { describe, expect, it } from 'vitest';

describe('react entrypoint', () => {
  it('exports StyledQR from react entrypoint', async () => {
    const mod = await import('./index');
    expect(mod.StyledQR).toBeDefined();
  });
});
