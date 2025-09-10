/**
 * String builder pattern for efficient SVG generation
 */
export class SVGStringBuilder {
  private parts: string[] = [];

  /**
   * Append a string part to the builder
   */
  append(part: string): this {
    this.parts.push(part);
    return this;
  }

  /**
   * Append multiple parts at once
   */
  appendAll(parts: string[]): this {
    this.parts.push(...parts);
    return this;
  }

  /**
   * Build the final SVG string
   */
  build(): string {
    return this.parts.join('');
  }

  /**
   * Get current length
   */
  get length(): number {
    return this.parts.length;
  }

  /**
   * Clear all parts
   */
  clear(): this {
    this.parts = [];
    return this;
  }
}
