import { describe, expect, it } from 'vitest';
import { scorePreset } from './scoring';

describe('scorePreset', () => {
  it('calculates weighted total using SMB+Enterprise weights', () => {
    const result = scorePreset('default', {
      brandFit: 4,
      scanConfidence: 5,
      visualDistinctiveness: 2,
      compositionalBalance: 4,
      deploymentFlexibility: 5,
      enterpriseSafety: 5,
    });

    expect(result.total).toBeCloseTo(4.15, 2);
  });
});
