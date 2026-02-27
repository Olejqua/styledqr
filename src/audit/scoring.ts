import type { AuditCriterionId, PresetAuditScore, PresetCriteria, RiskLevel, Tone } from './types';

const WEIGHTS: Record<AuditCriterionId, number> = {
  brandFit: 0.25,
  scanConfidence: 0.25,
  visualDistinctiveness: 0.15,
  compositionalBalance: 0.15,
  deploymentFlexibility: 0.1,
  enterpriseSafety: 0.1,
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function toRisk(scanConfidence: number, total: number): RiskLevel {
  if (scanConfidence <= 2 || total < 3) {
    return 'high';
  }

  if (scanConfidence === 3 || total < 4) {
    return 'medium';
  }

  if (total >= 4) {
    return 'low';
  }
  return 'medium';
}

function toTone(criteria: PresetCriteria): Tone {
  if (criteria.visualDistinctiveness >= 4) {
    return 'expressive';
  }

  if (criteria.enterpriseSafety >= 4) {
    return 'conservative';
  }

  return 'balanced';
}

function toRecommendation(total: number): string {
  if (total >= 4.5) {
    return 'primary-production';
  }

  if (total >= 4) {
    return 'safe-default';
  }

  if (total >= 3) {
    return 'use-with-review';
  }

  return 'experimental-only';
}

export function scorePreset(preset: string, criteria: PresetCriteria): PresetAuditScore {
  const total = round(
    criteria.brandFit * WEIGHTS.brandFit +
      criteria.scanConfidence * WEIGHTS.scanConfidence +
      criteria.visualDistinctiveness * WEIGHTS.visualDistinctiveness +
      criteria.compositionalBalance * WEIGHTS.compositionalBalance +
      criteria.deploymentFlexibility * WEIGHTS.deploymentFlexibility +
      criteria.enterpriseSafety * WEIGHTS.enterpriseSafety,
  );

  return {
    preset,
    criteria,
    total,
    risk: toRisk(criteria.scanConfidence, total),
    tone: toTone(criteria),
    recommendation: toRecommendation(total),
  };
}

export { WEIGHTS as PRESET_AUDIT_WEIGHTS };
