export { SVGRenderer } from './render/svg'
export { QRCodeAdapter } from './encoder/adapter-qrcode-generator'
export { NeighborAnalyzer } from './geometry/neighbors'
export { EyeRenderer } from './render/eyes'
export { LogoRenderer } from './render/logo'
export { GradientRenderer } from './render/gradient'
export { ShapeRenderer } from './render/shapes'

export type {
  QRCodeData,
  QRCodeOptions,
  LogoOptions,
  StyleOptions,
  PrettyQROptions
} from './encoder/types'

export type {
  Position,
  NeighborInfo
} from './geometry/neighbors'

export type {
  EyePattern
} from './render/eyes'

export type {
  ShapeOptions
} from './render/shapes'

export type {
  GradientOptions
} from './render/gradient'

/**
 * Main PrettyQR class - simple API for generating beautiful QR codes
 */
export class PrettyQR {
  private renderer: SVGRenderer

  constructor(options: PrettyQROptions) {
    this.renderer = new SVGRenderer(options)
  }

  /**
   * Generate SVG string
   */
  toSVG(): string {
    return this.renderer.generate()
  }

  /**
   * Generate data URL
   */
  toDataURL(): string {
    return this.renderer.toDataURL()
  }

  /**
   * Generate blob
   */
  async toBlob(): Promise<Blob> {
    return this.renderer.toBlob()
  }

  /**
   * Generate and download as file
   */
  async download(filename: string = 'qr-code.svg'): Promise<void> {
    const blob = await this.toBlob()
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }
}

// Default export
export default PrettyQR
