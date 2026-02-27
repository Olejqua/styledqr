import { describe, expect, it } from 'vitest';
import { ShapeRenderer } from './shapes';

describe('ShapeRenderer.smartRounded', () => {
  it('keeps convex rounded corner for simple L-turn (2 neighbors)', () => {
    const shape = ShapeRenderer.smartRounded(10, (xOffset, yOffset) => {
      if (xOffset === -1 && yOffset === 0) return true; // left
      if (xOffset === 0 && yOffset === -1) return true; // top
      if (xOffset === -1 && yOffset === -1) return false; // top-left diagonal
      return false;
    });

    expect(shape).not.toContain('fill-rule="evenodd"');
  });

  it('adds inner rounded cutout for dense junction with missing diagonal', () => {
    const shape = ShapeRenderer.smartRounded(10, (xOffset, yOffset) => {
      if (xOffset === -1 && yOffset === 0) return true;
      if (xOffset === 0 && yOffset === -1) return true;
      if (xOffset === 1 && yOffset === 0) return true;
      if (xOffset === -1 && yOffset === -1) return false;
      return false;
    });

    expect(shape).toContain('fill-rule="evenodd"');
    expect(shape).toMatch(/L 2\.8\d* 0 A 2\.8\d* 2\.8\d*/);
    expect(shape).not.toContain('L 5 0 A 5 5 0 0 0 0 5 Z');
  });

  it('does not add inner cutout when diagonals are connected', () => {
    const shape = ShapeRenderer.smartRounded(10, (xOffset, yOffset) => {
      if (xOffset === -1 && yOffset === 0) return true; // left
      if (xOffset === 0 && yOffset === -1) return true; // top
      if (xOffset === -1 && yOffset === -1) return true; // top-left diagonal
      return false;
    });

    expect(shape).not.toContain('fill-rule="evenodd"');
  });
});
