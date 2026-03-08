import type { StyledQROptions } from '../encoder/types';
import { SVGRenderer } from './svg';

export function renderStyledQRSvg(options: StyledQROptions): string {
  return new SVGRenderer(options).generate();
}
