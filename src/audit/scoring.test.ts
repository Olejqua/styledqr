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

  it('maps low scan confidence to high risk even with medium total', () => {
    const result = scorePreset('experimental', {
      brandFit: 5,
      scanConfidence: 2,
      visualDistinctiveness: 5,
      compositionalBalance: 5,
      deploymentFlexibility: 3,
      enterpriseSafety: 3,
    });

    expect(result.risk).toBe('high');
    expect(result.tone).toBe('expressive');
  });
});
