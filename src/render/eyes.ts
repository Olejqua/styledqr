import { QR_CONFIG } from '../config/qr-config';
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
    const cornerRadius = moduleSize * QR_CONFIG.CORNER_RADIUS_MULTIPLIER;

    // Outer square (7x7 modules)
    const outerSize = moduleSize * QR_CONFIG.EYE_SIZE;
    const outer = this.renderEyePart(outerSize, eyeStyle, cornerRadius * 3);

    // Inner square (5x5 modules)
    const innerSize = moduleSize * 5;
    const inner = this.renderEyePart(innerSize, eyeStyle, cornerRadius * 2);

    // Center square (3x3 modules)
    const centerSize = moduleSize * 3;
    const center = this.renderEyePart(centerSize, eyeStyle, cornerRadius);

    return { outer, inner, center };
  }

  /**
   * Render a single eye part with specific style
   */
  private renderEyePart(
    size: number,
    style: 'square' | 'rounded' | 'full-rounded',
    cornerRadius: number,
  ): string {
    switch (style) {
      case 'square':
        return ShapeRenderer.render({
          size,
          style: 'square',
          cornerRadius: 0,
        });
      case 'rounded':
        return ShapeRenderer.render({
          size,
          style: 'square',
          cornerRadius,
        });
      case 'full-rounded':
        return ShapeRenderer.render({
          size,
          style: 'circle',
        });
      default:
        return ShapeRenderer.render({
          size,
          style: 'square',
          cornerRadius: 0,
        });
    }
  }

  /**
   * Render all three eyes of a QR code
   * Based on competitor's approach - three fixed positions
   */
  renderAllEyes(moduleSize: number, qrSize: number, margin: number): string {
    const eyes = [];

    // Top-left eye (0, 0)
    const topLeft = this.renderEye(0, 0, moduleSize);
    eyes.push(this.wrapEye(topLeft, margin, margin, moduleSize));

    // Top-right eye (0, qrSize-7)
    const topRight = this.renderEye(0, qrSize - 7, moduleSize);
    eyes.push(this.wrapEye(topRight, (qrSize - 7) * moduleSize + margin, margin, moduleSize));

    // Bottom-left eye (qrSize-7, 0)
    const bottomLeft = this.renderEye(qrSize - 7, 0, moduleSize);
    eyes.push(this.wrapEye(bottomLeft, margin, (qrSize - 7) * moduleSize + margin, moduleSize));

    return eyes.join('');
  }

  private wrapEye(eye: EyePattern, x: number, y: number, moduleSize: number): string {
    const { outer, inner, center } = eye;

    return `<g transform="translate(${x}, ${y})">
      <g fill="${this.style.foreground || '#000000'}">
        ${outer}
      </g>
      <g transform="translate(${moduleSize}, ${moduleSize})" fill="${this.style.background || '#ffffff'}">
        ${inner}
      </g>
      <g transform="translate(${moduleSize * 2}, ${moduleSize * 2})" fill="${this.style.foreground || '#000000'}">
        ${center}
      </g>
    </g>`;
  }

  /**
   * Check if a position is part of an eye pattern
   * Based on competitor's approach with squareMask and dotMask
   */
  static isEyePosition(row: number, col: number, qrSize: number): boolean {
    const eyeSize = QR_CONFIG.EYE_SIZE;

    // Top-left eye (0, 0)
    if (row < eyeSize && col < eyeSize) {
      return true;
    }

    // Top-right eye (0, qrSize-7)
    if (row < eyeSize && col >= qrSize - eyeSize) {
      return true;
    }

    // Bottom-left eye (qrSize-7, 0)
    if (row >= qrSize - eyeSize && col < eyeSize) {
      return true;
    }

    return false;
  }
}
