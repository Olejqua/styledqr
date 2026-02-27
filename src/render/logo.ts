import type { LogoOptions, LogoScaleStrategy } from '../encoder/types';
import { LogoValidator } from './logo-validator';

export class LogoRenderer {
  /**
   * Load external SVG content
   */
  private static async loadExternalSVG(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load SVG: ${response.statusText}`);
      }
      return await response.text();
    } catch {
      return url; // Fallback to URL
    }
  }
  /**
   * Render a logo in the center of the QR code (synchronous version)
   */
  static renderLogo(logoOptions: LogoOptions, qrSize: number, moduleSize: number): string {
    // Validate logo options first
    const validation = LogoValidator.validate(logoOptions);
    if (!validation.isValid) {
      return LogoRenderer.renderPlaceholder(
        logoOptions,
        qrSize,
        moduleSize,
        validation.error || 'Logo validation failed',
      );
    }

    const {
      src,
      size,
      maxSize = 0.3,
      margin = 2,
      borderRadius = 0,
      backgroundColor = 'white',
      scaleStrategy = 'fit',
    } = logoOptions;

    // Calculate appropriate size
    const calculatedSize = LogoRenderer.calculateLogoSize(size, qrSize, maxSize, scaleStrategy);
    const logoSize = calculatedSize * moduleSize;
    const logoMargin = margin * moduleSize;
    const centerX = (qrSize * moduleSize) / 2;
    const centerY = (qrSize * moduleSize) / 2;

    const logoX = centerX - logoSize / 2;
    const logoY = centerY - logoSize / 2;

    // Create a background circle/rectangle for the logo
    const background =
      backgroundColor !== 'transparent'
        ? `<rect 
           x="${logoX - logoMargin}" 
           y="${logoY - logoMargin}" 
           width="${logoSize + logoMargin * 2}" 
           height="${logoSize + logoMargin * 2}" 
           rx="${borderRadius}" 
           ry="${borderRadius}" 
           fill="${backgroundColor}"/>`
        : '';

    // Handle different logo sources
    let logoElement = '';
    if (src.startsWith('data:')) {
      // Data URL (base64 image)
      logoElement = `<image 
        x="${logoX}" 
        y="${logoY}" 
        width="${logoSize}" 
        height="${logoSize}" 
        href="${src}"
        preserveAspectRatio="xMidYMid meet"/>`;
    } else if (src.startsWith('<svg')) {
      // Inline SVG - extract content and handle properly
      logoElement = LogoRenderer.renderInlineSVG(src, logoX, logoY, logoSize);
    } else {
      // External URL
      logoElement = `<image 
        x="${logoX}" 
        y="${logoY}" 
        width="${logoSize}" 
        height="${logoSize}" 
        href="${src}"
        preserveAspectRatio="xMidYMid meet"/>`;
    }

    return `<g class="logo">
      ${background}
      ${logoElement}
    </g>`;
  }

  /**
   * Render a logo with async SVG loading support
   */
  static async renderLogoAsync(
    logoOptions: LogoOptions,
    qrSize: number,
    moduleSize: number,
  ): Promise<string> {
    const {
      src,
      size = Math.floor(qrSize * 0.2),
      margin = 2,
      borderRadius = 0,
      backgroundColor = 'white',
    } = logoOptions;

    const logoSize = size * moduleSize;
    const logoMargin = margin * moduleSize;
    const centerX = (qrSize * moduleSize) / 2;
    const centerY = (qrSize * moduleSize) / 2;

    const logoX = centerX - logoSize / 2;
    const logoY = centerY - logoSize / 2;

    // Create a background circle/rectangle for the logo
    const background =
      backgroundColor !== 'transparent'
        ? `<rect 
           x="${logoX - logoMargin}" 
           y="${logoY - logoMargin}" 
           width="${logoSize + logoMargin * 2}" 
           height="${logoSize + logoMargin * 2}" 
           rx="${borderRadius}" 
           ry="${borderRadius}" 
           fill="${backgroundColor}"/>`
        : '';

    // Handle different logo sources
    let logoElement = '';
    if (src.startsWith('data:')) {
      // Data URL (base64 image)
      logoElement = `<image 
        x="${logoX}" 
        y="${logoY}" 
        width="${logoSize}" 
        height="${logoSize}" 
        href="${src}"
        preserveAspectRatio="xMidYMid meet"/>`;
    } else if (src.startsWith('<svg')) {
      // Inline SVG - extract content and handle properly
      logoElement = LogoRenderer.renderInlineSVG(src, logoX, logoY, logoSize);
    } else if (src.endsWith('.svg')) {
      // External SVG - try to load it
      try {
        const svgContent = await LogoRenderer.loadExternalSVG(src);
        if (svgContent.startsWith('<svg')) {
          logoElement = LogoRenderer.renderInlineSVG(svgContent, logoX, logoY, logoSize);
        } else {
          // Fallback to image if loading failed
          logoElement = `<image 
            x="${logoX}" 
            y="${logoY}" 
            width="${logoSize}" 
            height="${logoSize}" 
            href="${src}"
            preserveAspectRatio="xMidYMid meet"/>`;
        }
      } catch {
        // Fallback to image
        logoElement = `<image 
          x="${logoX}" 
          y="${logoY}" 
          width="${logoSize}" 
          height="${logoSize}" 
          href="${src}"
          preserveAspectRatio="xMidYMid meet"/>`;
      }
    } else {
      // External URL (non-SVG)
      logoElement = `<image 
        x="${logoX}" 
        y="${logoY}" 
        width="${logoSize}" 
        height="${logoSize}" 
        href="${src}"
        preserveAspectRatio="xMidYMid meet"/>`;
    }

    return `<g class="logo">
      ${background}
      ${logoElement}
    </g>`;
  }

  /**
   * Render inline SVG content properly
   */
  private static renderInlineSVG(svgString: string, x: number, y: number, size: number): string {
    try {
      // Extract SVG content and attributes
      const svgMatch = svgString.match(/<svg([^>]*)>(.*?)<\/svg>/s);
      if (!svgMatch) {
        // Fallback to image if parsing fails
        return `<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/svg+xml;base64,${btoa(svgString)}" preserveAspectRatio="xMidYMid meet"/>`;
      }

      const [, attributes, content] = svgMatch;

      // Extract viewBox or width/height
      const viewBoxMatch = attributes.match(/viewBox="([^"]*)"/);
      const widthMatch = attributes.match(/width="([^"]*)"/);
      const heightMatch = attributes.match(/height="([^"]*)"/);

      let viewBox = '0 0 100 100'; // Default viewBox
      if (viewBoxMatch) {
        viewBox = viewBoxMatch[1];
      } else if (widthMatch && heightMatch) {
        const width = parseFloat(widthMatch[1]);
        const height = parseFloat(heightMatch[1]);
        viewBox = `0 0 ${width} ${height}`;
      }

      // Parse viewBox
      const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);

      // Calculate scaling to fit in the logo area
      const scale = size / Math.max(vbWidth, vbHeight);
      const scaledWidth = vbWidth * scale;
      const scaledHeight = vbHeight * scale;

      // Center the scaled content
      const offsetX = (size - scaledWidth) / 2;
      const offsetY = (size - scaledHeight) / 2;

      return `<g transform="translate(${x + offsetX}, ${y + offsetY}) scale(${scale})">
        ${content}
      </g>`;
    } catch {
      // Fallback to image if SVG parsing fails
      return `<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/svg+xml;base64,${btoa(svgString)}" preserveAspectRatio="xMidYMid meet"/>`;
    }
  }

  /**
   * Create a mask for the logo area to ensure QR code readability
   */
  static createLogoMask(logoOptions: LogoOptions, qrSize: number, moduleSize: number): string {
    const { size = Math.floor(qrSize * 0.2), margin = 2 } = logoOptions;
    const logoSize = size * moduleSize;
    const logoMargin = margin * moduleSize;
    const centerX = (qrSize * moduleSize) / 2;
    const centerY = (qrSize * moduleSize) / 2;

    const logoX = centerX - logoSize / 2;
    const logoY = centerY - logoSize / 2;

    return `<defs>
      <mask id="logo-mask">
        <rect width="100%" height="100%" fill="white"/>
        <rect 
          x="${logoX - logoMargin}" 
          y="${logoY - logoMargin}" 
          width="${logoSize + logoMargin * 2}" 
          height="${logoSize + logoMargin * 2}" 
          fill="black"/>
      </mask>
    </defs>`;
  }

  /**
   * Check if a position should be cleared for logo placement
   */
  static shouldClearForLogo(
    row: number,
    col: number,
    logoOptions: LogoOptions,
    qrSize: number,
  ): boolean {
    const { size = Math.floor(qrSize * 0.2), margin = 2 } = logoOptions;
    const logoSize = size + margin * 2;
    const centerRow = Math.floor(qrSize / 2);
    const centerCol = Math.floor(qrSize / 2);
    const halfSize = Math.floor(logoSize / 2);

    return (
      row >= centerRow - halfSize &&
      row <= centerRow + halfSize &&
      col >= centerCol - halfSize &&
      col <= centerCol + halfSize
    );
  }

  /**
   * Calculate appropriate logo size based on strategy and constraints
   */
  private static calculateLogoSize(
    requestedSize: number | undefined,
    qrSize: number,
    maxSize: number,
    scaleStrategy: LogoScaleStrategy,
  ): number {
    // If no size specified, use recommended size
    if (!requestedSize) {
      return LogoValidator.getRecommendedSize(qrSize, maxSize);
    }

    // Check if size is appropriate
    if (LogoValidator.isSizeAppropriate(requestedSize, qrSize, maxSize)) {
      return requestedSize;
    }

    // Apply scaling strategy
    const maxAllowedSize = qrSize * maxSize;

    switch (scaleStrategy) {
      case 'fit':
        // Scale down to fit within maxSize while maintaining aspect ratio
        return Math.min(requestedSize, maxAllowedSize);

      case 'fill':
        // Scale to fill the maxSize area
        return maxAllowedSize;

      case 'stretch':
        // Use requested size but clamp to maxSize
        return Math.min(requestedSize, maxAllowedSize);

      default:
        return Math.min(requestedSize, maxAllowedSize);
    }
  }

  /**
   * Render placeholder when logo fails to load or validate
   */
  private static renderPlaceholder(
    logoOptions: LogoOptions,
    qrSize: number,
    moduleSize: number,
    errorMessage: string,
  ): string {
    const { placeholder = '⚠️', backgroundColor = 'white', margin = 2 } = logoOptions;
    const size = LogoRenderer.calculateLogoSize(
      logoOptions.size,
      qrSize,
      logoOptions.maxSize || 0.3,
      'fit',
    );
    const logoSize = size * moduleSize;
    const logoMargin = margin * moduleSize;
    const centerX = (qrSize * moduleSize) / 2;
    const centerY = (qrSize * moduleSize) / 2;

    const logoX = centerX - logoSize / 2;
    const logoY = centerY - logoSize / 2;

    return `<g class="logo-placeholder">
      <rect 
        x="${logoX - logoMargin}" 
        y="${logoY - logoMargin}" 
        width="${logoSize + logoMargin * 2}" 
        height="${logoSize + logoMargin * 2}" 
        fill="${backgroundColor}"
        stroke="#ff6b6b"
        stroke-width="2"
        stroke-dasharray="5,5"/>
      <text 
        x="${centerX}" 
        y="${centerY + logoSize * 0.1}" 
        text-anchor="middle" 
        font-size="${logoSize * 0.6}" 
        fill="#ff6b6b"
        font-family="Arial, sans-serif">
        ${placeholder}
      </text>
      <title>${errorMessage}</title>
    </g>`;
  }
}
