import type { PrettyQROptionsOverride, PrettyQRPreset } from './types';

export const PRETTY_QR_PRESETS: Record<PrettyQRPreset, PrettyQROptionsOverride> = {
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
  telegram: {
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
  mono: {
    margin: 4,
    size: 256,
    errorCorrectionLevel: 'M',
    style: {
      background: '#ffffff',
      foreground: '#111111',
      eyeStyle: 'square',
      cornerStyle: 'square',
      patternStyle: 'square',
    },
  },
};
