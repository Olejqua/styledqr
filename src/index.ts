import type { PrettyQROptions } from './encoder/types';
import { SVGRenderer } from './render/svg';

export { QRCodeAdapter } from './encoder/adapter-qrcode-generator';
export type {
  LogoOptions,
  PrettyQROptions,
  QRCodeData,
  QRCodeOptions,
  StyleOptions,
} from './encoder/types';
export type {
  NeighborInfo,
  Position,
} from './geometry/neighbors';
export { NeighborAnalyzer } from './geometry/neighbors';
export type { EyePattern } from './render/eyes';
export { EyeRenderer } from './render/eyes';
// Gradient support removed for MVP1
export { LogoRenderer } from './render/logo';
export type { ShapeOptions } from './render/shapes';
export { ShapeRenderer } from './render/shapes';
export { SVGRenderer } from './render/svg';

// New specialized renderers
export { BackgroundRenderer } from './render/background-renderer';
export { ModuleRenderer } from './render/module-renderer';
export { SVGStringBuilder } from './render/svg-builder';
export { QR_CONFIG } from './config/qr-config';

/**
 * Main PrettyQR class - simple API for generating beautiful QR codes
 */
export class PrettyQR {
  private renderer: SVGRenderer;

  constructor(options: PrettyQROptions) {
    this.renderer = new SVGRenderer(options);
  }

  /**
   * Generate SVG string
   */
  toSVG(): string {
    return this.renderer.generate();
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
}

// Default export
export default PrettyQR;
