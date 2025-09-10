import type { StyleOptions } from '../encoder/types';
import { ShapeRenderer } from './shapes';

export interface EyePattern {
  outer: string;
  inner: string;
  center: string;
}

export class EyeRenderer {
  private style: StyleOptions;

  constructor(_size: number, style: StyleOptions) {
    this.style = style;
  }

  /**
   * Render a complete eye pattern
   */
  renderEye(_x: number, _y: number, moduleSize: number): EyePattern {
    const eyeStyle = this.style.eyeStyle || 'square';
    const cornerRadius = moduleSize * 0.2;

    // Outer square (7x7 modules)
    const outerSize = moduleSize * 7;
    const outer = ShapeRenderer.render({
      size: outerSize,
      style: eyeStyle,
      cornerRadius: eyeStyle === 'rounded' ? cornerRadius * 3 : 0,
    });

    // Inner square (5x5 modules)
    const innerSize = moduleSize * 5;
    const inner = ShapeRenderer.render({
      size: innerSize,
      style: eyeStyle,
      cornerRadius: eyeStyle === 'rounded' ? cornerRadius * 2 : 0,
    });

    // Center square (3x3 modules)
    const centerSize = moduleSize * 3;
    const center = ShapeRenderer.render({
      size: centerSize,
      style: eyeStyle,
      cornerRadius: eyeStyle === 'rounded' ? cornerRadius : 0,
    });

    return { outer, inner, center };
  }

  /**
   * Render all three eyes of a QR code
   */
  renderAllEyes(moduleSize: number, qrSize: number): string {
    const eyes = [];
    const eyeSize = moduleSize * 7;
    const margin = moduleSize * 4;

    // Top-left eye
    const topLeft = this.renderEye(0, 0, moduleSize);
    eyes.push(this.wrapEye(topLeft, margin, margin, eyeSize));

    // Top-right eye
    const topRight = this.renderEye(qrSize - 7, 0, moduleSize);
    eyes.push(this.wrapEye(topRight, qrSize - margin - eyeSize, margin, eyeSize));

    // Bottom-left eye
    const bottomLeft = this.renderEye(0, qrSize - 7, moduleSize);
    eyes.push(this.wrapEye(bottomLeft, margin, qrSize - margin - eyeSize, eyeSize));

    return eyes.join('');
  }

  private wrapEye(eye: EyePattern, x: number, y: number, size: number): string {
    const { outer, inner, center } = eye;
    const offset = (size - 7) / 2; // Center the 7x7 pattern

    return `<g transform="translate(${x + offset}, ${y + offset})">
      <g fill="${this.style.background || '#000000'}">
        ${outer}
      </g>
      <g fill="${this.style.foreground || '#ffffff'}">
        ${inner}
      </g>
      <g fill="${this.style.background || '#000000'}">
        ${center}
      </g>
    </g>`;
  }

  /**
   * Check if a position is part of an eye pattern
   */
  static isEyePosition(row: number, col: number, qrSize: number): boolean {
    const eyeSize = 7;
    const margin = 4;

    // Top-left eye
    if (row < eyeSize + margin && col < eyeSize + margin) {
      return true;
    }

    // Top-right eye
    if (row < eyeSize + margin && col >= qrSize - eyeSize - margin) {
      return true;
    }

    // Bottom-left eye
    if (row >= qrSize - eyeSize - margin && col < eyeSize + margin) {
      return true;
    }

    return false;
  }
}
