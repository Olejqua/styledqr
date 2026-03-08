import type { StyledQROptionsOverride, StyledQRPreset } from './types';

export const STYLED_QR_PRESETS: Record<StyledQRPreset, StyledQROptionsOverride> = {
  default: {
    margin: 4,
    size: 256,
    errorCorrectionLevel: 'M',
    style: {
      background: '#ffffff',
      foreground: '#000000',
      eyeStyle: 'square',
      cornerStyle: 'square',
      patternStyle: 'square',
    },
  },
  rounded: {
    margin: 4,
    size: 256,
    errorCorrectionLevel: 'M',
    style: {
      background: '#ffffff',
      foreground: '#229ed9',
      eyeStyle: 'rounded',
      cornerStyle: 'rounded',
      patternStyle: 'rounded',
    },
  },
  circle: {
    margin: 4,
    size: 256,
    errorCorrectionLevel: 'M',
    style: {
      background: '#ffffff',
      foreground: '#0b1324',
      eyeStyle: 'full-rounded',
      cornerStyle: 'circle',
      patternStyle: 'circle',
    },
  },
  diamond: {
    margin: 4,
    size: 256,
    errorCorrectionLevel: 'M',
    style: {
      background: '#ffffff',
      foreground: '#0f172a',
      eyeStyle: 'square',
      cornerStyle: 'diamond',
      patternStyle: 'diamond',
    },
  },
};
