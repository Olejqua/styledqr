import { describe, expect, it } from 'vitest';
import type { QRCodeData } from '../encoder/types';
import { buildRoundedMask } from './rounded-mask';

describe('buildRoundedMask', () => {
  it('excludes eye and logo areas', () => {
    const qrData: QRCodeData = {
      size: 3,
      errorCorrectionLevel: 'M',
      modules: [
        [true, true, true],
        [true, true, true],
        [true, true, true],
      ],
    };

    const eyePositions = new Set(['0,0']);
    const logoAreas = new Set(['1,1']);

    const mask = buildRoundedMask(qrData, eyePositions, logoAreas);

    expect(mask[0][0]).toBe(false);
    expect(mask[1][1]).toBe(false);
    expect(mask[2][2]).toBe(true);
  });
});
