import type { StyleOptions } from '../encoder/types';

export class BackgroundRenderer {
  /**
   * Render background rectangle
   */
  static render(style: StyleOptions): string {
    const backgroundFill = style.background || '#ffffff';
    return `<rect width="100%" height="100%" fill="${backgroundFill}"/>`;
  }
}
