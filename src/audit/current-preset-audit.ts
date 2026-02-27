import type { PresetCriteria } from './types';

export const CURRENT_PRESET_CRITERIA: Record<string, PresetCriteria> = {
  default: {
    brandFit: 4,
    scanConfidence: 5,
    visualDistinctiveness: 2,
    compositionalBalance: 4,
    deploymentFlexibility: 5,
    enterpriseSafety: 5,
  },
  telegram: {
    brandFit: 4,
    scanConfidence: 4,
    visualDistinctiveness: 4,
    compositionalBalance: 4,
    deploymentFlexibility: 4,
    enterpriseSafety: 4,
  },
  mono: {
    brandFit: 5,
    scanConfidence: 5,
    visualDistinctiveness: 2,
    compositionalBalance: 4,
    deploymentFlexibility: 5,
    enterpriseSafety: 5,
  },
};
