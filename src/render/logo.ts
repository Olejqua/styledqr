import type { LogoOptions } from '../encoder/types'

export class LogoRenderer {
  /**
   * Render a logo in the center of the QR code
   */
  static renderLogo(
    logoOptions: LogoOptions,
    qrSize: number,
    moduleSize: number
  ): string {
    const {
      src,
      size = Math.floor(qrSize * 0.2),
      margin = 2,
      borderRadius = 0,
      backgroundColor = 'white'
    } = logoOptions

    const logoSize = size * moduleSize
    const logoMargin = margin * moduleSize
    const centerX = (qrSize * moduleSize) / 2
    const centerY = (qrSize * moduleSize) / 2

    const logoX = centerX - logoSize / 2
    const logoY = centerY - logoSize / 2

    // Create a background circle/rectangle for the logo
    const background = backgroundColor !== 'transparent' 
      ? `<rect 
           x="${logoX - logoMargin}" 
           y="${logoY - logoMargin}" 
           width="${logoSize + logoMargin * 2}" 
           height="${logoSize + logoMargin * 2}" 
           rx="${borderRadius}" 
           ry="${borderRadius}" 
           fill="${backgroundColor}"/>`
      : ''

    // Handle different logo sources
    let logoElement = ''
    if (src.startsWith('data:')) {
      // Data URL (base64 image)
      logoElement = `<image 
        x="${logoX}" 
        y="${logoY}" 
        width="${logoSize}" 
        height="${logoSize}" 
        href="${src}"
        preserveAspectRatio="xMidYMid meet"/>`
    } else if (src.startsWith('<svg')) {
      // Inline SVG
      const svgContent = src.replace(/<svg[^>]*>/, '').replace('</svg>', '')
      logoElement = `<g transform="translate(${logoX}, ${logoY}) scale(${logoSize / 100})">
        ${svgContent}
      </g>`
    } else {
      // External URL
      logoElement = `<image 
        x="${logoX}" 
        y="${logoY}" 
        width="${logoSize}" 
        height="${logoSize}" 
        href="${src}"
        preserveAspectRatio="xMidYMid meet"/>`
    }

    return `<g class="logo">
      ${background}
      ${logoElement}
    </g>`
  }

  /**
   * Create a mask for the logo area to ensure QR code readability
   */
  static createLogoMask(
    logoOptions: LogoOptions,
    qrSize: number,
    moduleSize: number
  ): string {
    const { size = Math.floor(qrSize * 0.2), margin = 2 } = logoOptions
    const logoSize = size * moduleSize
    const logoMargin = margin * moduleSize
    const centerX = (qrSize * moduleSize) / 2
    const centerY = (qrSize * moduleSize) / 2

    const logoX = centerX - logoSize / 2
    const logoY = centerY - logoSize / 2

    return `<mask id="logo-mask">
      <rect width="100%" height="100%" fill="white"/>
      <rect 
        x="${logoX - logoMargin}" 
        y="${logoY - logoMargin}" 
        width="${logoSize + logoMargin * 2}" 
        height="${logoSize + logoMargin * 2}" 
        fill="black"/>
    </mask>`
  }

  /**
   * Check if a position should be cleared for logo placement
   */
  static shouldClearForLogo(
    row: number,
    col: number,
    logoOptions: LogoOptions,
    qrSize: number
  ): boolean {
    const { size = Math.floor(qrSize * 0.2), margin = 2 } = logoOptions
    const logoSize = size + margin * 2
    const centerRow = Math.floor(qrSize / 2)
    const centerCol = Math.floor(qrSize / 2)
    const halfSize = Math.floor(logoSize / 2)

    return (
      row >= centerRow - halfSize &&
      row <= centerRow + halfSize &&
      col >= centerCol - halfSize &&
      col <= centerCol + halfSize
    )
  }
}
