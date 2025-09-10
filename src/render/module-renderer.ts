import type { QRCodeData, StyleOptions } from '../encoder/types';
import { QR_CONFIG } from '../config/qr-config';
import { ShapeRenderer } from './shapes';
import { EyeRenderer } from './eyes';
import { LogoRenderer } from './logo';
import { SVGStringBuilder } from './svg-builder';

export interface ModuleRenderOptions {
  qrData: QRCodeData;
  moduleSize: number;
  margin: number;
  style: StyleOptions;
  logo?: any; // LogoOptions
}

export class ModuleRenderer {
  /**
   * Render all QR code modules (excluding eyes) - optimized version
   */
  static renderModules(options: ModuleRenderOptions): string {
    const { qrData, moduleSize, margin, style, logo } = options;
    const { modules, size: qrSize } = qrData;
    
    const builder = new SVGStringBuilder();
    const shapeStyle = (style.patternStyle || 'square') as 'square' | 'rounded' | 'circle' | 'diamond';
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

          // Create getNeighbor function for smart patterns
          const getNeighbor = (xOffset: number, yOffset: number): boolean => {
            const newRow = row + yOffset;
            const newCol = col + xOffset;
            if (newRow < 0 || newRow >= qrSize || newCol < 0 || newCol >= qrSize) return false;
            return modules[newRow][newCol];
          };

          // Use shape renderer with getNeighbor function for smart patterns
          const shape = ShapeRenderer.render({
            size: moduleSize,
            style: shapeStyle,
            getNeighbor: shapeStyle === 'rounded' ? getNeighbor : undefined,
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
