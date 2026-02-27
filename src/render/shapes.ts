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
    const topLeftNeighbor = getNeighbor(-1, -1);
    const topRightNeighbor = getNeighbor(1, -1);
    const bottomRightNeighbor = getNeighbor(1, 1);
    const bottomLeftNeighbor = getNeighbor(-1, 1);

    const neighborsCount = [leftNeighbor, rightNeighbor, topNeighbor, bottomNeighbor].filter(
      Boolean,
    ).length;

    if (neighborsCount === 0) {
      // No neighbors - fully rounded (circle)
      return ShapeRenderer.circle(size);
    }

    const radius = size / 2;
    const innerRadius = size * 0.28;

    const topLeftOuter = !topNeighbor && !leftNeighbor;
    const topRightOuter = !topNeighbor && !rightNeighbor;
    const bottomRightOuter = !bottomNeighbor && !rightNeighbor;
    const bottomLeftOuter = !bottomNeighbor && !leftNeighbor;

    const allowInnerCutout = neighborsCount >= 3;
    const topLeftInner = allowInnerCutout && topNeighbor && leftNeighbor && !topLeftNeighbor;
    const topRightInner = allowInnerCutout && topNeighbor && rightNeighbor && !topRightNeighbor;
    const bottomRightInner =
      allowInnerCutout && bottomNeighbor && rightNeighbor && !bottomRightNeighbor;
    const bottomLeftInner =
      allowInnerCutout && bottomNeighbor && leftNeighbor && !bottomLeftNeighbor;

    const tl = topLeftOuter ? radius : 0;
    const tr = topRightOuter ? radius : 0;
    const br = bottomRightOuter ? radius : 0;
    const bl = bottomLeftOuter ? radius : 0;

    let d = `M ${tl} 0`;
    d += ` H ${size - tr}`;
    if (tr > 0) {
      d += ` A ${tr} ${tr} 0 0 1 ${size} ${tr}`;
    } else {
      d += ` L ${size} 0`;
    }

    d += ` V ${size - br}`;
    if (br > 0) {
      d += ` A ${br} ${br} 0 0 1 ${size - br} ${size}`;
    } else {
      d += ` L ${size} ${size}`;
    }

    d += ` H ${bl}`;
    if (bl > 0) {
      d += ` A ${bl} ${bl} 0 0 1 0 ${size - bl}`;
    } else {
      d += ` L 0 ${size}`;
    }

    d += ` V ${tl}`;
    if (tl > 0) {
      d += ` A ${tl} ${tl} 0 0 1 ${tl} 0`;
    } else {
      d += ' L 0 0';
    }
    d += ' Z';

    const hasInnerCutouts = topLeftInner || topRightInner || bottomRightInner || bottomLeftInner;
    if (!hasInnerCutouts) {
      return `<path d="${d}"/>`;
    }

    if (topLeftInner) {
      d += ` M 0 0 L ${innerRadius} 0 A ${innerRadius} ${innerRadius} 0 0 0 0 ${innerRadius} Z`;
    }
    if (topRightInner) {
      d += ` M ${size} 0 L ${size - innerRadius} 0 A ${innerRadius} ${innerRadius} 0 0 1 ${size} ${innerRadius} Z`;
    }
    if (bottomRightInner) {
      d += ` M ${size} ${size} L ${size - innerRadius} ${size} A ${innerRadius} ${innerRadius} 0 0 0 ${size} ${size - innerRadius} Z`;
    }
    if (bottomLeftInner) {
      d += ` M 0 ${size} L ${innerRadius} ${size} A ${innerRadius} ${innerRadius} 0 0 1 0 ${size - innerRadius} Z`;
    }

    return `<path d="${d}" fill-rule="evenodd"/>`;
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
