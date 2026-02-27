export interface ContourPoint {
  x: number;
  y: number;
}

interface Edge {
  start: ContourPoint;
  end: ContourPoint;
  dir: 0 | 1 | 2 | 3;
  used: boolean;
}

function pointKey(point: ContourPoint): string {
  return `${point.x},${point.y}`;
}

function makeEdge(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  dir: 0 | 1 | 2 | 3,
): Edge {
  return {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    dir,
    used: false,
  };
}

function turnPriority(prevDir: number, dir: number): number {
  const right = (prevDir + 1) % 4;
  const straight = prevDir;
  const left = (prevDir + 3) % 4;
  const back = (prevDir + 2) % 4;

  if (dir === right) return 0;
  if (dir === straight) return 1;
  if (dir === left) return 2;
  if (dir === back) return 3;
  return 4;
}

export function extractContours(mask: boolean[][]): ContourPoint[][] {
  if (mask.length === 0 || mask[0]?.length === 0) {
    return [];
  }

  const rows = mask.length;
  const cols = mask[0].length;
  const edges: Edge[] = [];

  const isFilled = (row: number, col: number): boolean => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
    return mask[row][col];
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!mask[row][col]) continue;

      if (!isFilled(row - 1, col)) {
        edges.push(makeEdge(col, row, col + 1, row, 0));
      }
      if (!isFilled(row, col + 1)) {
        edges.push(makeEdge(col + 1, row, col + 1, row + 1, 1));
      }
      if (!isFilled(row + 1, col)) {
        edges.push(makeEdge(col + 1, row + 1, col, row + 1, 2));
      }
      if (!isFilled(row, col - 1)) {
        edges.push(makeEdge(col, row + 1, col, row, 3));
      }
    }
  }

  if (edges.length === 0) {
    return [];
  }

  const outgoing = new Map<string, Edge[]>();
  for (const edge of edges) {
    const key = pointKey(edge.start);
    const bucket = outgoing.get(key);
    if (bucket) {
      bucket.push(edge);
    } else {
      outgoing.set(key, [edge]);
    }
  }

  const contours: ContourPoint[][] = [];

  for (const edge of edges) {
    if (edge.used) continue;

    const contour: ContourPoint[] = [{ ...edge.start }];
    edge.used = true;

    let current = edge.end;
    let previousDir = edge.dir;

    while (true) {
      contour.push({ ...current });

      if (current.x === contour[0].x && current.y === contour[0].y) {
        break;
      }

      const nextCandidates = (outgoing.get(pointKey(current)) || []).filter(
        (candidate) => !candidate.used,
      );
      if (nextCandidates.length === 0) {
        break;
      }

      nextCandidates.sort(
        (a, b) => turnPriority(previousDir, a.dir) - turnPriority(previousDir, b.dir),
      );
      const nextEdge = nextCandidates[0];
      nextEdge.used = true;
      previousDir = nextEdge.dir;
      current = nextEdge.end;
    }

    if (
      contour.length >= 4 &&
      contour[0].x === contour[contour.length - 1].x &&
      contour[0].y === contour[contour.length - 1].y
    ) {
      contours.push(contour);
    }
  }

  return contours;
}
