import type { QRCodeData, QRCodeOptions, StyleOptions } from '../encoder/types';

/**
 * Interface for QR code generation
 */
export interface IQRCodeAdapter {
  generate(options: QRCodeOptions): QRCodeData;
}

/**
 * Interface for background rendering
 */
export interface IBackgroundRenderer {
  render(style: StyleOptions): string;
}

/**
 * Interface for eye rendering
 */
export interface IEyeRenderer {
  renderAllEyes(moduleSize: number, qrSize: number, margin: number): string;
}

/**
 * Interface for module rendering
 */
export interface IModuleRenderer {
  renderModules(options: {
    qrData: QRCodeData;
    moduleSize: number;
    margin: number;
    style: StyleOptions;
    logo?: any;
  }): string;
}

/**
 * Interface for logo rendering
 */
export interface ILogoRenderer {
  createLogoMask(logo: any, qrSize: number, moduleSize: number): string;
  renderLogo(logo: any, qrSize: number, moduleSize: number): string;
  shouldClearForLogo(row: number, col: number, logo: any, qrSize: number): boolean;
}

/**
 * Interface for string building
 */
export interface IStringBuilder {
  append(part: string): this;
  build(): string;
}
