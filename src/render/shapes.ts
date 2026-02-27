export interface ShapeOptions {
  size: number;
  style: 'square' | 'rounded' | 'circle' | 'diamond';
  cornerRadius?: number;
  getNeighbor?: (xOffset: number, yOffset: number) => boolean;
}

export class ShapeRenderer {
  /**
   * Render a square shape
   */
  static square(size: number, cornerRadius: number = 0): string {
    if (cornerRadius > 0) {
      return `<rect width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}"/>`;
    }
    return `<rect width="${size}" height="${size}"/>`;
  }

  /**
   * Render a circle shape
   */
  static circle(size: number): string {
    const radius = size / 2;
    return `<circle cx="${radius}" cy="${radius}" r="${radius}"/>`;
  }

  /**
   * Render a diamond shape
   */
  static diamond(size: number): string {
    const half = size / 2;
    const points = [
      `${half},0`, // top
      `${size},${half}`, // right
      `${half},${size}`, // bottom
      `0,${half}`, // left
    ].join(' ');
    return `<polygon points="${points}"/>`;
  }

  /**
   * Render a smart rounded shape based on neighbors (like competitor)
   */
  static smartRounded(
    size: number,
    getNeighbor?: (xOffset: number, yOffset: number) => boolean,
  ): string {
    if (!getNeighbor) {
      return ShapeRenderer.square(size);
    }

    const leftNeighbor = getNeighbor(-1, 0);
    const rightNeighbor = getNeighbor(1, 0);
    const topNeighbor = getNeighbor(0, -1);
    const bottomNeighbor = getNeighbor(0, 1);

    const neighborsCount = [leftNeighbor, rightNeighbor, topNeighbor, bottomNeighbor].filter(
      Boolean,
    ).length;

    if (neighborsCount === 0) {
      // No neighbors - fully rounded (circle)
      return ShapeRenderer.circle(size);
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      // Many neighbors or opposite neighbors - square
      return ShapeRenderer.square(size);
    }

    if (neighborsCount === 2) {
      // Two neighbors - rounded corner
      let rotation = 0;
      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }
      return ShapeRenderer.cornerRounded(size, rotation);
    }

    if (neighborsCount === 1) {
      // One neighbor - rounded side
      let rotation = 0;
      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }
      return ShapeRenderer.sideRounded(size, rotation);
    }

    return ShapeRenderer.square(size);
  }

  /**
   * Render a corner rounded shape
   */
  static cornerRounded(size: number, rotation: number = 0): string {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;

    const path = `M 0 0 v ${size} h ${size} v ${-size / 2} a ${radius} ${radius} 0 0 0 ${-radius} ${-radius}`;

    return `<path d="${path}" transform="rotate(${(rotation * 180) / Math.PI} ${cx} ${cy})"/>`;
  }

  /**
   * Render a side rounded shape
   */
  static sideRounded(size: number, rotation: number = 0): string {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;

    const path = `M 0 0 v ${size} h ${size / 2} a ${radius} ${radius} 0 0 0 0 ${-size}`;

    return `<path d="${path}" transform="rotate(${(rotation * 180) / Math.PI} ${cx} ${cy})"/>`;
  }

  /**
   * Render a corners rounded shape
   */
  static cornersRounded(size: number, rotation: number = 0): string {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;

    const path = `M 0 ${size / 2} v ${size / 2} a ${radius} ${radius} 0 0 0 ${radius} ${radius} h ${size / 2} v ${-size / 2} a ${radius} ${radius} 0 0 0 ${-radius} ${-radius}`;

    return `<path d="${path}" transform="rotate(${(rotation * 180) / Math.PI} ${cx} ${cy})"/>`;
  }

  /**
   * Render a corner extra rounded shape
   */
  static cornerExtraRounded(size: number, rotation: number = 0): string {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size;

    const path = `M 0 0 v ${size} h ${size} a ${radius} ${radius} 0 0 0 ${-radius} ${-radius}`;

    return `<path d="${path}" transform="rotate(${(rotation * 180) / Math.PI} ${cx} ${cy})"/>`;
  }

  /**
   * Render a shape based on options
   */
  static render(options: ShapeOptions): string {
    const { size, style, cornerRadius = 0, getNeighbor } = options;

    switch (style) {
      case 'square':
        return ShapeRenderer.square(size, cornerRadius);
      case 'rounded':
        return getNeighbor
          ? ShapeRenderer.smartRounded(size, getNeighbor)
          : ShapeRenderer.square(size, cornerRadius || size * 0.2);
      case 'circle':
        return ShapeRenderer.circle(size);
      case 'diamond':
        return ShapeRenderer.diamond(size);
      default:
        return ShapeRenderer.square(size);
    }
  }

  // Gradient support removed for MVP1
}
