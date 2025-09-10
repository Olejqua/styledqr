export interface GradientOptions {
  type: 'linear' | 'radial'
  colors: string[]
  direction?: number
  id: string
}

export class GradientRenderer {
  /**
   * Create a linear gradient definition
   */
  static createLinearGradient(options: GradientOptions): string {
    const { colors, direction = 0, id } = options
    
    // Convert direction from degrees to SVG coordinates
    const radians = (direction - 90) * Math.PI / 180
    const x1 = 0.5 + 0.5 * Math.cos(radians)
    const y1 = 0.5 + 0.5 * Math.sin(radians)
    const x2 = 0.5 - 0.5 * Math.cos(radians)
    const y2 = 0.5 - 0.5 * Math.sin(radians)

    const stops = colors.map((color, index) => {
      const offset = (index / (colors.length - 1)) * 100
      return `<stop offset="${offset}%" stop-color="${color}"/>`
    }).join('')

    return `<defs>
      <linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
        ${stops}
      </linearGradient>
    </defs>`
  }

  /**
   * Create a radial gradient definition
   */
  static createRadialGradient(options: GradientOptions): string {
    const { colors, id } = options

    const stops = colors.map((color, index) => {
      const offset = (index / (colors.length - 1)) * 100
      return `<stop offset="${offset}%" stop-color="${color}"/>`
    }).join('')

    return `<defs>
      <radialGradient id="${id}" cx="50%" cy="50%" r="50%">
        ${stops}
      </radialGradient>
    </defs>`
  }

  /**
   * Create a gradient based on type
   */
  static createGradient(options: GradientOptions): string {
    switch (options.type) {
      case 'linear':
        return this.createLinearGradient(options)
      case 'radial':
        return this.createRadialGradient(options)
      default:
        return this.createLinearGradient(options)
    }
  }

  /**
   * Parse CSS gradient string and convert to SVG gradient
   */
  static parseCSSGradient(cssGradient: string, id: string): string {
    // Simple linear gradient parser
    if (cssGradient.includes('linear-gradient')) {
      const match = cssGradient.match(/linear-gradient\(([^)]+)\)/)
      if (match) {
        const content = match[1]
        const parts = content.split(',')
        
        // Extract direction (first part)
        let direction = 0
        const firstPart = parts[0].trim()
        if (firstPart.includes('deg')) {
          direction = parseFloat(firstPart.replace('deg', ''))
        } else if (firstPart.includes('to ')) {
          const directionMap: { [key: string]: number } = {
            'to top': 0,
            'to right': 90,
            'to bottom': 180,
            'to left': 270,
            'to top right': 45,
            'to bottom right': 135,
            'to bottom left': 225,
            'to top left': 315
          }
          direction = directionMap[firstPart] || 0
        }

        // Extract colors
        const colors = parts.slice(1).map(part => {
          const trimmed = part.trim()
          // Remove percentage if present
          return trimmed.replace(/\s+\d+%/, '').trim()
        })

        return this.createLinearGradient({
          type: 'linear',
          colors,
          direction,
          id
        })
      }
    }

    // Fallback to solid color
    return `<defs>
      <linearGradient id="${id}">
        <stop offset="0%" stop-color="${cssGradient}"/>
        <stop offset="100%" stop-color="${cssGradient}"/>
      </linearGradient>
    </defs>`
  }
}
