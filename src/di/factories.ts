import { EyeRenderer } from '../render/eyes';
import { SVGStringBuilder } from '../render/svg-builder';
import type { StyleOptions } from '../encoder/types';
import type { IEyeRenderer, IStringBuilder } from './interfaces';

/**
 * Factory functions for creating services with parameters
 */
export class ServiceFactories {
  /**
   * Create eye renderer with parameters
   */
  static createEyeRenderer(moduleSize: number, style: StyleOptions): IEyeRenderer {
    return new EyeRenderer(moduleSize, style) as any;
  }

  /**
   * Create string builder
   */
  static createStringBuilder(): IStringBuilder {
    return new SVGStringBuilder() as any;
  }
}
