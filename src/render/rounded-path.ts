import type { ContourPoint } from './rounded-contours';

export interface RoundedPathOptions {
  moduleSize: number;
  margin: number;
  cornerRadius: number;
}

function distance(a: ContourPoint, b: ContourPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function normalize(vector: ContourPoint): ContourPoint {
  const length = Math.hypot(vector.x, vector.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: vector.x / length, y: vector.y / length };
}

function toPixel(point: ContourPoint, options: RoundedPathOptions): ContourPoint {
  return {
    x: options.margin + point.x * options.moduleSize,
    y: options.margin + point.y * options.moduleSize,
  };
}

export function buildRoundedPath(contours: ContourPoint[][], options: RoundedPathOptions): string {
  const parts: string[] = [];

  for (const contour of contours) {
    if (contour.length < 4) continue;

    const closed = contour;
    const pointCount = closed.length - 1;
    const first = toPixel(closed[0], options);
    parts.push(`M ${first.x} ${first.y}`);

    for (let i = 0; i < pointCount; i++) {
      const prev = toPixel(closed[(i - 1 + pointCount) % pointCount], options);
      const curr = toPixel(closed[i], options);
      const next = toPixel(closed[(i + 1) % pointCount], options);

      const inVector = { x: curr.x - prev.x, y: curr.y - prev.y };
      const outVector = { x: next.x - curr.x, y: next.y - curr.y };
      const inLength = distance(prev, curr);
      const outLength = distance(curr, next);

      if (inLength === 0 || outLength === 0) {
        continue;
      }

      const inUnit = normalize(inVector);
      const outUnit = normalize(outVector);
      const isStraight = inUnit.x === outUnit.x && inUnit.y === outUnit.y;

      if (isStraight) {
        parts.push(`L ${curr.x} ${curr.y}`);
        continue;
      }

      const clamp = Math.min(options.cornerRadius, inLength / 2, outLength / 2);
      const entry = {
        x: curr.x - inUnit.x * clamp,
        y: curr.y - inUnit.y * clamp,
      };
      const exit = {
        x: curr.x + outUnit.x * clamp,
        y: curr.y + outUnit.y * clamp,
      };

      parts.push(`L ${entry.x} ${entry.y}`);
      parts.push(`Q ${curr.x} ${curr.y} ${exit.x} ${exit.y}`);
    }

    parts.push('Z');
  }

  return parts.join(' ');
}
