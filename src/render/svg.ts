import { QRCodeAdapter } from '../encoder/adapter-qrcode-generator';
import type { PrettyQROptions, QRCodeData, StyleOptions } from '../encoder/types';
import { NeighborAnalyzer } from '../geometry/neighbors';
import { EyeRenderer } from './eyes';
import { LogoRenderer } from './logo';
import { ShapeRenderer } from './shapes';

export class SVGRenderer {
  private qrAdapter: QRCodeAdapter;
  private options: PrettyQROptions;

  constructor(options: PrettyQROptions) {
    this.qrAdapter = new QRCodeAdapter();
    this.options = options;
  }

  /**
   * Generate the complete SVG QR code
   */
  generate(): string {
    const { text, size = 256, margin = 4, style = {} } = this.options;

    // Generate QR code data
    const qrData = this.qrAdapter.generate({
      text,
      size: 0, // Let QR code determine its own size
      errorCorrectionLevel: this.options.errorCorrectionLevel || 'M',
    });

    const qrSize = qrData.size;
    // Calculate module size to fit the requested size
    const availableSize = size - margin * 2;
    const moduleSize = Math.max(1, Math.floor(availableSize / qrSize));
    const actualSize = qrSize * moduleSize;
    const totalSize = actualSize + margin * 2;

    // Create SVG content
    const svgContent = this.renderQRCode(qrData, moduleSize, margin, style);

    return `<svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">
      ${svgContent}
    </svg>`;
  }

  private renderQRCode(
    qrData: QRCodeData,
    moduleSize: number,
    margin: number,
    style: StyleOptions,
  ): string {
    const { modules, size: qrSize } = qrData;
    const _analyzer = new NeighborAnalyzer(modules);
    const eyeRenderer = new EyeRenderer(moduleSize, style);

    const marginSize = margin * moduleSize;
    const elements: string[] = [];

    // Gradient support removed for MVP1

    // Add logo mask if logo is present
    if (this.options.logo) {
      elements.push(LogoRenderer.createLogoMask(this.options.logo, qrSize, moduleSize));
    }

    // Background
    const backgroundFill = style.background || '#ffffff';
    elements.push(`<rect width="100%" height="100%" fill="${backgroundFill}"/>`);

    // Render eyes first with eyeStyle
    const eyeElements = eyeRenderer.renderAllEyes(moduleSize, qrSize, margin);
    elements.push(eyeElements);

    // QR code modules (excluding eyes)
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
        if (
          this.options.logo &&
          LogoRenderer.shouldClearForLogo(row, col, this.options.logo, qrSize)
        ) {
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

    // Add modules (excluding eyes)
    elements.push(...moduleElements);

    // Add logo
    if (this.options.logo) {
      elements.push(LogoRenderer.renderLogo(this.options.logo, qrSize, moduleSize));
    }

    return elements.join('');
  }

  /**
   * Check if a position is part of a timing pattern
   */
  private isTimingPattern(row: number, col: number, qrSize: number): boolean {
    // Timing patterns are on row 6 and column 6
    return row === 6 || col === 6;
  }



  /**
   * Check if a module is on the edge of the QR code and should be rounded
   * Based on the correct algorithm for QR code edge detection
   */
  private isEdgeModule(row: number, col: number, qrSize: number): boolean {
    // Check if module is on the outer edge
    const isOuterEdge = row === 0 || row === qrSize - 1 || col === 0 || col === qrSize - 1;
    
    if (!isOuterEdge) return false;
    
    // Exclude finder patterns (7x7 modules in corners)
    // Top-left finder pattern (0,0) to (6,6)
    if (row < 7 && col < 7) return false;
    
    // Top-right finder pattern (0, qrSize-7) to (6, qrSize-1)
    if (row < 7 && col >= qrSize - 7) return false;
    
    // Bottom-left finder pattern (qrSize-7, 0) to (qrSize-1, 6)
    if (row >= qrSize - 7 && col < 7) return false;
    
    return true;
  }

  /**
   * Generate QR code and return as data URL
   */
  toDataURL(): string {
    const svg = this.generate();
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
  }

  /**
   * Generate QR code and return as blob
   */
  async toBlob(): Promise<Blob> {
    const svg = this.generate();
    return new Blob([svg], { type: 'image/svg+xml' });
  }
}
