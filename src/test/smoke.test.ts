import { describe, expect, it } from 'vitest';
import shadcnRecipes from '../../docs/style-system/shadcn-recipes.md?raw';
import readme from '../../README.md?raw';

describe('test setup', () => {
  it('runs', () => {
    expect(true).toBe(true);
  });

  it('documents StyledQR as a shadcn-friendly primitive', () => {
    expect(readme).toContain('StyledQR is a rendering primitive');
    expect(readme).toContain('Bring your own shadcn/ui components');
  });

  it('contains shadcn composition recipes', () => {
    expect(shadcnRecipes).toContain('Card + StyledQR');
    expect(shadcnRecipes).toContain('Dialog + StyledQR');
    expect(shadcnRecipes).toContain('Tabs + StyledQR');
  });
});
