import { describe, expect, it } from 'vitest';
import type { QRCodeData } from '../encoder/types';
import { ModuleRenderer } from './module-renderer';

function createQrData(size: number): QRCodeData {
  return {
    size,
    errorCorrectionLevel: 'M',
    modules: Array.from({ length: size }, () => Array.from({ length: size }, () => false)),
  };
}

describe('ModuleRenderer rounded style', () => {
  it('renders rounded modules as contour path without circle primitives', () => {
    const qrData = createQrData(21);
    qrData.modules[10][10] = true;
    qrData.modules[10][11] = true;

    const svg = ModuleRenderer.renderModules({
      qrData,
      moduleSize: 10,
      margin: 0,
      style: {
        foreground: '#000000',
        patternStyle: 'rounded',
      },
    });

    expect(svg).not.toContain('<circle');
    expect(svg).toContain('<path');
    expect(svg).toContain('fill-rule="evenodd"');
  });
});
