import type { LogoFormat, LogoOptions } from '../encoder/types';

export interface LogoValidationResult {
  isValid: boolean;
  format?: LogoFormat;
  error?: string;
  warnings?: string[];
}

export class LogoValidator {
  private static readonly SUPPORTED_FORMATS: LogoFormat[] = [
    'svg',
    'png',
    'jpg',
    'jpeg',
    'webp',
    'gif',
    'bmp',
  ];

  private static readonly FORMAT_PATTERNS: Record<LogoFormat, RegExp[]> = {
    svg: [/\.svg$/i, /^<svg/i, /^data:image\/svg\+xml/i],
    png: [/\.png$/i, /^data:image\/png/i],
    jpg: [/\.jpg$/i, /^data:image\/jpeg/i],
    jpeg: [/\.jpeg$/i, /^data:image\/jpeg/i],
    webp: [/\.webp$/i, /^data:image\/webp/i],
    gif: [/\.gif$/i, /^data:image\/gif/i],
    bmp: [/\.bmp$/i, /^data:image\/bmp/i],
  };

  /**
   * Validate logo options and source
   */
  static validate(logoOptions: LogoOptions): LogoValidationResult {
    const warnings: string[] = [];

    // Validate required fields
    if (!logoOptions.src) {
      return { isValid: false, error: 'Logo source is required' };
    }

    // Validate size constraints
    if (logoOptions.size !== undefined) {
      if (logoOptions.size <= 0) {
        return { isValid: false, error: 'Logo size must be positive' };
      }
      if (logoOptions.size > 200) {
        warnings.push('Logo size is very large, consider using maxSize instead');
      }
    }

    if (logoOptions.maxSize !== undefined) {
      if (logoOptions.maxSize <= 0 || logoOptions.maxSize > 1) {
        return { isValid: false, error: 'maxSize must be between 0 and 1' };
      }
    }

    // Validate margin
    if (logoOptions.margin !== undefined && logoOptions.margin < 0) {
      return { isValid: false, error: 'Logo margin cannot be negative' };
    }

    // Detect and validate format
    const formatResult = LogoValidator.detectFormat(logoOptions.src);
    if (!formatResult.isValid) {
      return formatResult;
    }

    const detectedFormat = formatResult.format!;

    // Check if format is allowed
    const allowedFormats = logoOptions.allowedFormats || LogoValidator.SUPPORTED_FORMATS;
    if (!allowedFormats.includes(detectedFormat)) {
      return {
        isValid: false,
        error: `Format '${detectedFormat}' is not allowed. Allowed formats: ${allowedFormats.join(', ')}`,
      };
    }

    // Additional format-specific validations
    if (detectedFormat === 'svg') {
      const svgValidation = LogoValidator.validateSVG(logoOptions.src);
      if (!svgValidation.isValid) {
        return svgValidation;
      }
      if (svgValidation.warnings) {
        warnings.push(...svgValidation.warnings);
      }
    }

    // Validate URL format for external resources
    if (!LogoValidator.isDataURL(logoOptions.src) && !LogoValidator.isInlineSVG(logoOptions.src)) {
      const urlValidation = LogoValidator.validateURL(logoOptions.src);
      if (!urlValidation.isValid) {
        return urlValidation;
      }
    }

    return {
      isValid: true,
      format: detectedFormat,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Detect the format of the logo source
   */
  private static detectFormat(src: string): LogoValidationResult {
    for (const [format, patterns] of Object.entries(LogoValidator.FORMAT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(src)) {
          return { isValid: true, format: format as LogoFormat };
        }
      }
    }

    return {
      isValid: false,
      error: 'Unable to detect logo format. Supported formats: svg, png, jpg, jpeg, webp, gif, bmp',
    };
  }

  /**
   * Validate SVG content
   */
  private static validateSVG(src: string): LogoValidationResult {
    const warnings: string[] = [];

    if (LogoValidator.isInlineSVG(src)) {
      // Basic SVG structure validation
      if (!src.includes('<svg') || !src.includes('</svg>')) {
        return { isValid: false, error: 'Invalid SVG structure' };
      }

      // Check for viewBox or dimensions
      if (!src.includes('viewBox') && !src.includes('width') && !src.includes('height')) {
        warnings.push('SVG missing viewBox or dimensions, may not scale properly');
      }

      // Check for potentially problematic elements
      if (src.includes('<script')) {
        warnings.push('SVG contains script tags, security risk');
      }

      if (src.includes('<foreignObject')) {
        warnings.push('SVG contains foreignObject, may not render correctly');
      }
    }

    return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined };
  }

  /**
   * Validate URL format
   */
  private static validateURL(url: string): LogoValidationResult {
    try {
      const urlObj = new URL(url);

      // Check protocol
      if (!['http:', 'https:', 'data:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'Only HTTP, HTTPS, and data URLs are supported' };
      }

      // Check for suspicious patterns
      if (url.includes('javascript:') || url.includes('vbscript:')) {
        return { isValid: false, error: 'JavaScript and VBScript URLs are not allowed' };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  /**
   * Check if source is a data URL
   */
  private static isDataURL(src: string): boolean {
    return src.startsWith('data:');
  }

  /**
   * Check if source is inline SVG
   */
  private static isInlineSVG(src: string): boolean {
    return src.trim().startsWith('<svg');
  }

  /**
   * Get recommended size based on QR code size
   */
  static getRecommendedSize(qrSize: number, maxSize: number = 0.3): number {
    return Math.floor(qrSize * maxSize);
  }

  /**
   * Check if logo size is appropriate for QR code
   */
  static isSizeAppropriate(logoSize: number, qrSize: number, maxSize: number = 0.3): boolean {
    const maxAllowedSize = qrSize * maxSize;
    return logoSize <= maxAllowedSize;
  }
}
