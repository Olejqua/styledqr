import QRCode from 'qrcode-generator';
import type { QRCodeData, QRCodeOptions } from './types';

export class QRCodeAdapter {
  private qr: QRCode;

  constructor() {
    this.qr = QRCode(0, 'M');
  }

  generate(options: QRCodeOptions): QRCodeData {
    const { text, errorCorrectionLevel = 'M' } = options;

    // Set error correction level
    const ecLevel = this.getErrorCorrectionLevel(errorCorrectionLevel);
    this.qr = QRCode(0, ecLevel);

    // Add data
    this.qr.addData(text);
    this.qr.make();

    // Get modules
    const modules: boolean[][] = [];
    const moduleCount = this.qr.getModuleCount();

    for (let row = 0; row < moduleCount; row++) {
      modules[row] = [];
      for (let col = 0; col < moduleCount; col++) {
        modules[row][col] = this.qr.isDark(row, col);
      }
    }

    return {
      modules,
      size: moduleCount,
      errorCorrectionLevel,
    };
  }

  private getErrorCorrectionLevel(level: string): any {
    switch (level) {
      case 'L':
        return 'L';
      case 'M':
        return 'M';
      case 'Q':
        return 'Q';
      case 'H':
        return 'H';
      default:
        return 'M';
    }
  }
}
