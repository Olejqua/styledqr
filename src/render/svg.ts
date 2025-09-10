import { QRCodeAdapter } from '../encoder/adapter-qrcode-generator';
import type { PrettyQROptions, QRCodeData, StyleOptions } from '../encoder/types';
import { QR_CONFIG } from '../config/qr-config';
import { BackgroundRenderer } from './background-renderer';
import { EyeRenderer } from './eyes';
import { LogoRenderer } from './logo';
import { ModuleRenderer } from './module-renderer';
import { SVGStringBuilder } from './svg-builder';

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
    const { text, size = QR_CONFIG.DEFAULT_SIZE, margin = QR_CONFIG.DEFAULT_MARGIN, style = {} } = this.options;

    // Generate QR code data
    const qrData = this.qrAdapter.generate({
      text,
      size: 0, // Let QR code determine its own size
      errorCorrectionLevel: this.options.errorCorrectionLevel || 'M',
    });

    const qrSize = qrData.size;
    // Calculate module size to fit the requested size
    const availableSize = size - margin * 2;
    const moduleSize = Math.max(QR_CONFIG.DEFAULT_MODULE_SIZE, Math.floor(availableSize / qrSize));
    const actualSize = qrSize * moduleSize;
    const totalSize = actualSize + margin * 2;

    // Create SVG content using specialized renderers
    const svgContent = this.renderQRCode(qrData, moduleSize, margin, style);

    return `<svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="${QR_CONFIG.SVG_NAMESPACE}">
      ${svgContent}
    </svg>`;
  }

  private renderQRCode(
    qrData: QRCodeData,
    moduleSize: number,
    margin: number,
    style: StyleOptions,
  ): string {
    const { size: qrSize } = qrData;
    const eyeRenderer = new EyeRenderer(moduleSize, style);
    const builder = new SVGStringBuilder();

    // Add logo mask if logo is present
    if (this.options.logo) {
      builder.append(LogoRenderer.createLogoMask(this.options.logo, qrSize, moduleSize));
    }

    // Background
    builder.append(BackgroundRenderer.render(style));

    // Render eyes first with eyeStyle
    const eyeElements = eyeRenderer.renderAllEyes(moduleSize, qrSize, margin);
    builder.append(eyeElements);

    // QR code modules (excluding eyes) - now using optimized renderer
    const moduleElements = ModuleRenderer.renderModules({
      qrData,
      moduleSize,
      margin,
      style,
      logo: this.options.logo,
    });
    builder.append(moduleElements);

    // Add logo
    if (this.options.logo) {
      builder.append(LogoRenderer.renderLogo(this.options.logo, qrSize, moduleSize));
    }

    return builder.build();
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

  /**
   * Get performance metrics for current QR code
   */
  getPerformanceMetrics(): any {
    const { size = QR_CONFIG.DEFAULT_SIZE } = this.options;
    const qrData = this.qrAdapter.generate({
      text: this.options.text,
      size: 0,
      errorCorrectionLevel: this.options.errorCorrectionLevel || 'M',
    });
    
    return {
      qrSize: qrData.size,
      totalModules: qrData.size * qrData.size,
      estimatedMemoryKB: (qrData.size * qrData.size * 100) / 1024,
    };
  }
}
