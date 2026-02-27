import { QR_CONFIG } from '../config/qr-config';
import type { LogoOptions, QRCodeData, StyleOptions } from '../encoder/types';
import { EyeRenderer } from './eyes';
import { LogoRenderer } from './logo';
import { extractContours } from './rounded-contours';
import { buildRoundedMask } from './rounded-mask';
import { buildRoundedPath } from './rounded-path';
import { ShapeRenderer } from './shapes';
import { SVGStringBuilder } from './svg-builder';

export interface ModuleRenderOptions {
  qrData: QRCodeData;
  moduleSize: number;
  margin: number;
  style: StyleOptions;
  logo?: LogoOptions;
}

export class ModuleRenderer {
  private static isActiveModule(
    row: number,
    col: number,
    qrSize: number,
    modules: boolean[][],
    eyePositions: Set<string>,
    logoAreas: Set<string>,
  ): boolean {
    if (row < 0 || row >= qrSize || col < 0 || col >= qrSize) {
      return false;
    }

    const key = `${row},${col}`;
    if (eyePositions.has(key) || logoAreas.has(key)) {
      return false;
    }

    return modules[row][col];
  }

  private static renderRoundedBlobModules(
    qrData: QRCodeData,
    moduleSize: number,
    margin: number,
    foreground: string,
    eyePositions: Set<string>,
    logoAreas: Set<string>,
  ): string {
    const mask = buildRoundedMask(qrData, eyePositions, logoAreas);
    const contours = extractContours(mask);
    if (contours.length === 0) {
      return '';
    }

    const d = buildRoundedPath(contours, {
      moduleSize,
      margin,
      cornerRadius: moduleSize * 0.35,
    });

    return `<path d="${d}" fill="${foreground}" fill-rule="evenodd"/>`;
  }

  /**
   * Render all QR code modules (excluding eyes) - optimized version
   */
  static renderModules(options: ModuleRenderOptions): string {
    const { qrData, moduleSize, margin, style, logo } = options;
    const { modules, size: qrSize } = qrData;

    const builder = new SVGStringBuilder();
    const shapeStyle = (style.patternStyle || 'square') as
      | 'square'
      | 'rounded'
      | 'circle'
      | 'diamond';
    const foreground = style.foreground || QR_CONFIG.DEFAULT_FOREGROUND;

    // Pre-compute eye positions for faster lookup
    const eyePositions = new Set<string>();
    for (let row = 0; row < qrSize; row++) {
      for (let col = 0; col < qrSize; col++) {
        if (EyeRenderer.isEyePosition(row, col, qrSize)) {
          eyePositions.add(`${row},${col}`);
        }
      }
    }

    // Pre-compute logo areas for faster lookup
    const logoAreas = new Set<string>();
    if (logo) {
      for (let row = 0; row < qrSize; row++) {
        for (let col = 0; col < qrSize; col++) {
          if (LogoRenderer.shouldClearForLogo(row, col, logo, qrSize)) {
            logoAreas.add(`${row},${col}`);
          }
        }
      }
    }

    if (shapeStyle === 'rounded') {
      return ModuleRenderer.renderRoundedBlobModules(
        qrData,
        moduleSize,
        margin,
        foreground,
        eyePositions,
        logoAreas,
      );
    }

    // Render modules in batches for better performance
    for (let row = 0; row < qrSize; row++) {
      for (let col = 0; col < qrSize; col++) {
        const key = `${row},${col}`;

        // Skip eye patterns
        if (eyePositions.has(key)) {
          continue;
        }

        // Skip logo areas
        if (logoAreas.has(key)) {
          continue;
        }

        if (modules[row][col]) {
          const x = margin + col * moduleSize;
          const y = margin + row * moduleSize;

          const shape = ShapeRenderer.render({
            size: moduleSize,
            style: shapeStyle,
          });

          builder.append(`<g transform="translate(${x}, ${y})" fill="${foreground}">
            ${shape}
          </g>`);
        }
      }
    }

    return builder.build();
  }
}
