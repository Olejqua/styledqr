import { describe, expect, it } from 'vitest';
import type { AuditCriterionId, PresetAuditScore } from './types';

describe('audit types', () => {
  it('exports criterion ids and score shape', () => {
    const id: AuditCriterionId = 'brandFit';
    const score: PresetAuditScore = {
      preset: 'default',
      criteria: {
        brandFit: 4,
        scanConfidence: 5,
        visualDistinctiveness: 2,
        compositionalBalance: 4,
        deploymentFlexibility: 5,
        enterpriseSafety: 5,
      },
      total: 4.3,
      risk: 'low',
      tone: 'conservative',
      recommendation: 'safe-default',
    };

    expect(id).toBe('brandFit');
    expect(score.total).toBeGreaterThan(0);
  });
});
