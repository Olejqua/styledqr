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

export interface LogoOptions {
  src: string;
  size?: number;
  margin?: number;
  borderRadius?: number;
  backgroundColor?: string;
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
