import type { QRCodeData } from '../encoder/types';

export function buildRoundedMask(
  qrData: QRCodeData,
  eyePositions: Set<string>,
  logoAreas: Set<string>,
): boolean[][] {
  const { modules, size } = qrData;
  const mask: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false),
  );

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const key = `${row},${col}`;
      if (eyePositions.has(key) || logoAreas.has(key)) {
        continue;
      }
      mask[row][col] = modules[row][col];
    }
  }

  return mask;
}
