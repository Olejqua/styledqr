import { describe, expect, it } from 'vitest';
import shadcnRecipes from '../../docs/style-system/shadcn-recipes.md?raw';
import readme from '../../README.md?raw';

describe('test setup', () => {
  it('runs', () => {
    expect(true).toBe(true);
  });

  it('documents PrettyQR as a shadcn-friendly primitive', () => {
    expect(readme).toContain('PrettyQR is a rendering primitive');
    expect(readme).toContain('Bring your own shadcn/ui components');
  });

  it('contains shadcn composition recipes', () => {
    expect(shadcnRecipes).toContain('Card + PrettyQR');
    expect(shadcnRecipes).toContain('Dialog + PrettyQR');
    expect(shadcnRecipes).toContain('Tabs + PrettyQR');
  });
});
