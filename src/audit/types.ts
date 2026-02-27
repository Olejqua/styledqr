export type AuditCriterionId =
  | 'brandFit'
  | 'scanConfidence'
  | 'visualDistinctiveness'
  | 'compositionalBalance'
  | 'deploymentFlexibility'
  | 'enterpriseSafety';

export type RiskLevel = 'low' | 'medium' | 'high';
export type Tone = 'conservative' | 'balanced' | 'expressive';
export type AuditCriterionScore = 1 | 2 | 3 | 4 | 5;

export type PresetCriteria = Record<AuditCriterionId, AuditCriterionScore>;

export interface PresetAuditScore {
  preset: string;
  criteria: PresetCriteria;
  total: number;
  risk: RiskLevel;
  tone: Tone;
  recommendation: string;
}
