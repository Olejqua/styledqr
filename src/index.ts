import type { QRPerformanceMetrics, StyledQROptions } from './encoder/types';
import { renderStyledQRSvg } from './render/render-styledqr-svg';
import { SVGRenderer } from './render/svg';

export { QR_CONFIG } from './config/qr-config';
export { QRCodeAdapter } from './encoder/adapter-qrcode-generator';
export type {
  LogoFormat,
  LogoOptions,
  LogoScaleStrategy,
  QRCodeData,
  QRCodeOptions,
  StyledQROptions,
  StyleOptions,
} from './encoder/types';
export type {
  NeighborInfo,
  Position,
} from './geometry/neighbors';
export { NeighborAnalyzer } from './geometry/neighbors';
// New specialized renderers
export { BackgroundRenderer } from './render/background-renderer';
export type { EyePattern } from './render/eyes';
export { EyeRenderer } from './render/eyes';
// Gradient support removed for MVP1
export { LogoRenderer } from './render/logo';
export { LogoValidator } from './render/logo-validator';
export { ModuleRenderer } from './render/module-renderer';
export { renderStyledQRSvg } from './render/render-styledqr-svg';
export type { ShapeOptions } from './render/shapes';
export { ShapeRenderer } from './render/shapes';
export { SVGRenderer } from './render/svg';
export { SVGStringBuilder } from './render/svg-builder';

/**
 * Main StyledQR class - simple API for generating beautiful QR codes
 */
export class StyledQR {
  private renderer: SVGRenderer;
  private options: StyledQROptions;

  constructor(options: StyledQROptions) {
    this.options = options;
    this.renderer = new SVGRenderer(options);
  }

  /**
   * Generate SVG string
   */
  toSVG(): string {
    return renderStyledQRSvg(this.options);
  }

  /**
   * Generate data URL
   */
  toDataURL(): string {
    return this.renderer.toDataURL();
  }

  /**
   * Generate blob
   */
  async toBlob(): Promise<Blob> {
    return this.renderer.toBlob();
  }

  /**
   * Generate and download as file
   */
  async download(filename: string = 'qr-code.svg'): Promise<void> {
    const blob = await this.toBlob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Get performance metrics for current QR code
   */
  getPerformanceMetrics(): QRPerformanceMetrics {
    return this.renderer.getPerformanceMetrics();
  }
}

// Default export
export default StyledQR;
