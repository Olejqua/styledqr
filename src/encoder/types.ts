export interface QRCodeData {
  modules: boolean[][];
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export interface QRCodeOptions {
  text: string;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
}

export type LogoFormat = 'svg' | 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif' | 'bmp';
export type LogoScaleStrategy = 'fit' | 'fill' | 'stretch';

export interface LogoOptions {
  src: string;
  size?: number;
  maxSize?: number; // Maximum size relative to QR code (0.0-1.0)
  margin?: number;
  borderRadius?: number;
  backgroundColor?: string;
  scaleStrategy?: LogoScaleStrategy;
  allowedFormats?: LogoFormat[];
  placeholder?: string; // Text or emoji to show while loading
  fallbackToImage?: boolean; // Whether to fallback to <image> tag if SVG parsing fails
}

export interface StyleOptions {
  background?: string;
  foreground?: string;
  eyeStyle?: 'square' | 'rounded' | 'full-rounded';
  cornerStyle?: 'square' | 'rounded' | 'circle' | 'diamond';
  patternStyle?: 'square' | 'rounded' | 'circle' | 'diamond';
}

export interface PrettyQROptions {
  text: string;
  size?: number;
  margin?: number;
  logo?: LogoOptions;
  style?: StyleOptions;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QRPerformanceMetrics {
  qrSize: number;
  totalModules: number;
  estimatedMemoryKB: number;
}
