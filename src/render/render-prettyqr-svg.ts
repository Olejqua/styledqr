import type { PrettyQROptions } from '../encoder/types';
import { SVGRenderer } from './svg';

export function renderPrettyQRSvg(options: PrettyQROptions): string {
  return new SVGRenderer(options).generate();
}
