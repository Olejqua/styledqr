import { describe, expect, it } from 'vitest';
import { buildRoundedPath } from './rounded-path';

describe('buildRoundedPath', () => {
  it('builds a smooth path with quadratic corners', () => {
    const contours = [
      [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
        { x: 0, y: 0 },
      ],
    ];

    const path = buildRoundedPath(contours, { moduleSize: 10, margin: 0, cornerRadius: 3.5 });
    expect(path).toContain('Q');
    expect(path.startsWith('M ')).toBe(true);
  });
});
