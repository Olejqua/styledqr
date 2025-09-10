export interface ShapeOptions {
  size: number;
  style: 'square' | 'rounded' | 'circle' | 'diamond' | 'dots';
  cornerRadius?: number;
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
   * Render dots pattern
   */
  static dots(size: number, dotSize: number = 2): string {
    const dots = [];
    const spacing = size / 3;
    const offset = spacing / 2;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = offset + i * spacing;
        const y = offset + j * spacing;
        dots.push(`<circle cx="${x}" cy="${y}" r="${dotSize}"/>`);
      }
    }

    return dots.join('');
  }

  /**
   * Render a shape based on options
   */
  static render(options: ShapeOptions): string {
    const { size, style, cornerRadius = 0 } = options;

    switch (style) {
      case 'square':
        return ShapeRenderer.square(size, cornerRadius);
      case 'rounded':
        return ShapeRenderer.square(size, cornerRadius || size * 0.2);
      case 'circle':
        return ShapeRenderer.circle(size);
      case 'diamond':
        return ShapeRenderer.diamond(size);
      case 'dots':
        return ShapeRenderer.dots(size);
      default:
        return ShapeRenderer.square(size);
    }
  }

  /**
   * Create a gradient definition
   */
  static createGradient(
    id: string,
    type: 'linear' | 'radial',
    colors: string[],
    direction: number = 0,
  ): string {
    if (type === 'linear') {
      const x1 = Math.cos(((direction - 90) * Math.PI) / 180);
      const y1 = Math.sin(((direction - 90) * Math.PI) / 180);
      const x2 = -x1;
      const y2 = -y1;

      const stops = colors
        .map(
          (color, index) =>
            `<stop offset="${(index / (colors.length - 1)) * 100}%" stop-color="${color}"/>`,
        )
        .join('');

      return `<defs>
        <linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
          ${stops}
        </linearGradient>
      </defs>`;
    } else {
      const stops = colors
        .map(
          (color, index) =>
            `<stop offset="${(index / (colors.length - 1)) * 100}%" stop-color="${color}"/>`,
        )
        .join('');

      return `<defs>
        <radialGradient id="${id}" cx="50%" cy="50%" r="50%">
          ${stops}
        </radialGradient>
      </defs>`;
    }
  }
}
