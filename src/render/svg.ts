import { QRCodeAdapter } from '../encoder/adapter-qrcode-generator';
import type { PrettyQROptions, QRCodeData, StyleOptions } from '../encoder/types';
import { NeighborAnalyzer } from '../geometry/neighbors';
import { EyeRenderer } from './eyes';
import { GradientRenderer } from './gradient';
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
    const moduleSize = Math.floor(size / (qrSize + margin * 2));
    const actualSize = qrSize * moduleSize;
    const totalSize = actualSize + margin * moduleSize * 2;

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

    // Add gradient definitions if needed
    if (style.gradient) {
      const gradientId = 'qr-gradient';
      elements.push(
        GradientRenderer.createGradient({
          ...style.gradient,
          id: gradientId,
        }),
      );
    }

    // Add logo mask if logo is present
    if (this.options.logo) {
      elements.push(LogoRenderer.createLogoMask(this.options.logo, qrSize, moduleSize));
    }

    // Background
    const backgroundFill = style.gradient ? 'url(#qr-gradient)' : style.background || '#ffffff';
    elements.push(`<rect width="100%" height="100%" fill="${backgroundFill}"/>`);

    // QR code modules
    const moduleElements: string[] = [];

    for (let row = 0; row < qrSize; row++) {
      for (let col = 0; col < qrSize; col++) {
        const isDark = modules[row][col];
        const x = marginSize + col * moduleSize;
        const y = marginSize + row * moduleSize;

        // Skip if this is part of an eye pattern
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
          const shapeStyle = style.patternStyle || 'square';
          const shape = ShapeRenderer.render({
            size: moduleSize,
            style: shapeStyle,
            cornerRadius: shapeStyle === 'rounded' ? moduleSize * 0.2 : 0,
          });

          moduleElements.push(`<g transform="translate(${x}, ${y})" fill="${style.foreground || '#000000'}">
            ${shape}
          </g>`);
        }
      }
    }

    // Add eyes
    elements.push(eyeRenderer.renderAllEyes(moduleSize, qrSize));

    // Add modules
    elements.push(...moduleElements);

    // Add logo
    if (this.options.logo) {
      elements.push(LogoRenderer.renderLogo(this.options.logo, qrSize, moduleSize));
    }

    return elements.join('');
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
