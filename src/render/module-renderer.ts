import type { QRCodeData, StyleOptions } from '../encoder/types';
import { ShapeRenderer } from './shapes';
import { EyeRenderer } from './eyes';
import { LogoRenderer } from './logo';

export interface ModuleRenderOptions {
  qrData: QRCodeData;
  moduleSize: number;
  margin: number;
  style: StyleOptions;
  logo?: any; // LogoOptions
}

export class ModuleRenderer {
  /**
   * Render all QR code modules (excluding eyes)
   */
  static renderModules(options: ModuleRenderOptions): string {
    const { qrData, moduleSize, margin, style, logo } = options;
    const { modules, size: qrSize } = qrData;
    
    const moduleElements: string[] = [];

    for (let row = 0; row < qrSize; row++) {
      for (let col = 0; col < qrSize; col++) {
        const isDark = modules[row][col];
        const x = margin + col * moduleSize;
        const y = margin + row * moduleSize;

        // Skip eye patterns - they are rendered separately
        if (EyeRenderer.isEyePosition(row, col, qrSize)) {
          continue;
        }

        // Skip if this is in the logo area
        if (logo && LogoRenderer.shouldClearForLogo(row, col, logo, qrSize)) {
          continue;
        }

        if (isDark) {
          const shapeStyle = (style.patternStyle || 'square') as 'square' | 'rounded' | 'circle' | 'diamond';
          
          // Create getNeighbor function for smart patterns
          const getNeighbor = (xOffset: number, yOffset: number): boolean => {
            const newRow = row + yOffset;
            const newCol = col + xOffset;
            if (newRow < 0 || newRow >= qrSize || newCol < 0 || newCol >= qrSize) return false;
            return qrData.modules[newRow][newCol];
          };

          // Use shape renderer with getNeighbor function for smart patterns
          const shape = ShapeRenderer.render({
            size: moduleSize,
            style: shapeStyle,
            getNeighbor: shapeStyle === 'rounded' ? getNeighbor : undefined,
          });
          
          moduleElements.push(`<g transform="translate(${x}, ${y})" fill="${style.foreground || '#000000'}">
            ${shape}
          </g>`);
        }
      }
    }

    return moduleElements.join('');
  }
}
