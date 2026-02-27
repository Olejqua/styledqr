import { describe, expect, it } from 'vitest';
import { extractContours } from './rounded-contours';

describe('extractContours', () => {
  it('extracts a closed contour from a single active module', () => {
    const mask = [[true]];
    const contours = extractContours(mask);

    expect(contours).toHaveLength(1);
    expect(contours[0].length).toBeGreaterThanOrEqual(5);
    expect(contours[0][0]).toEqual(contours[0][contours[0].length - 1]);
  });

  it('keeps diagonal modules as separate contours', () => {
    const mask = [
      [true, false],
      [false, true],
    ];

    const contours = extractContours(mask);
    expect(contours).toHaveLength(2);
  });
});
