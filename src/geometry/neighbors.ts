export interface Position {
  row: number
  col: number
}

export interface NeighborInfo {
  position: Position
  isDark: boolean
  distance: number
}

export class NeighborAnalyzer {
  private modules: boolean[][]
  private size: number

  constructor(modules: boolean[][]) {
    this.modules = modules
    this.size = modules.length
  }

  /**
   * Get all neighbors of a given position within a certain radius
   */
  getNeighbors(row: number, col: number, radius: number = 1): NeighborInfo[] {
    const neighbors: NeighborInfo[] = []
    
    for (let r = Math.max(0, row - radius); r <= Math.min(this.size - 1, row + radius); r++) {
      for (let c = Math.max(0, col - radius); c <= Math.min(this.size - 1, col + radius); c++) {
        if (r === row && c === col) continue
        
        const distance = Math.sqrt((r - row) ** 2 + (c - col) ** 2)
        if (distance <= radius) {
          neighbors.push({
            position: { row: r, col: c },
            isDark: this.modules[r][c],
            distance
          })
        }
      }
    }
    
    return neighbors
  }

  /**
   * Check if a position is part of a corner (finder pattern)
   */
  isCorner(row: number, col: number): boolean {
    const cornerSize = 7
    const margin = 0
    
    // Top-left corner
    if (row < cornerSize + margin && col < cornerSize + margin) {
      return true
    }
    
    // Top-right corner
    if (row < cornerSize + margin && col >= this.size - cornerSize - margin) {
      return true
    }
    
    // Bottom-left corner
    if (row >= this.size - cornerSize - margin && col < cornerSize + margin) {
      return true
    }
    
    return false
  }

  /**
   * Check if a position is part of an eye (finder pattern)
   */
  isEye(row: number, col: number): boolean {
    return this.isCorner(row, col)
  }

  /**
   * Get the center position of the QR code
   */
  getCenter(): Position {
    return {
      row: Math.floor(this.size / 2),
      col: Math.floor(this.size / 2)
    }
  }

  /**
   * Check if a position is in the center area (for logo placement)
   */
  isCenterArea(row: number, col: number, logoSize: number = 8): boolean {
    const center = this.getCenter()
    const halfSize = Math.floor(logoSize / 2)
    
    return (
      row >= center.row - halfSize &&
      row <= center.row + halfSize &&
      col >= center.col - halfSize &&
      col <= center.col + halfSize
    )
  }
}
