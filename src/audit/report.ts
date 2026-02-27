import { CURRENT_PRESET_CRITERIA } from './current-preset-audit';
import { scorePreset } from './scoring';
import type { PresetAuditScore } from './types';

function scoreCurrentPresets(): PresetAuditScore[] {
  return Object.entries(CURRENT_PRESET_CRITERIA)
    .map(([preset, criteria]) => scorePreset(preset, criteria))
    .sort((a, b) => b.total - a.total || a.preset.localeCompare(b.preset));
}

function toRow(score: PresetAuditScore): string {
  return `| ${score.preset} | ${score.total.toFixed(2)} | ${score.risk} | ${score.tone} | ${score.recommendation} |`;
}

export function buildPresetAuditReport(): string {
  const scores = scoreCurrentPresets();
  const rows = scores.map(toRow).join('\n');

  return `# Preset Audit (Expert Review)

## Scope

- Segment focus: SMB + Enterprise
- Method: expert scoring only (no usage analytics)
- Policy: all style combinations remain available; output is soft guidance

## Scoring Model

Weights:
- brandFit: 25%
- scanConfidence: 25%
- visualDistinctiveness: 15%
- compositionalBalance: 15%
- deploymentFlexibility: 10%
- enterpriseSafety: 10%

## Results

| Preset | Total | Risk | Tone | Recommendation |
|---|---:|---|---|---|
${rows}
`;
}

