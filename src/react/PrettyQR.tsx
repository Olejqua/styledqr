import type { CSSProperties } from 'react';
import { renderPrettyQRSvg } from '../render/render-prettyqr-svg';
import { resolvePrettyQROptions } from './resolve-options';
import type { PrettyQRProps } from './types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decorateSvg(svg: string, props: PrettyQRProps): string {
  const attributes: string[] = ['role="img"'];

  if (props.id) {
    attributes.push(`id="${escapeHtml(props.id)}"`);
  }

  if (props['aria-label']) {
    attributes.push(`aria-label="${escapeHtml(props['aria-label'])}"`);
  }

  const output = svg.replace('<svg ', `<svg ${attributes.join(' ')} `);

  if (!props.title && !props.desc) {
    return output;
  }

  const title = props.title ? `<title>${escapeHtml(props.title)}</title>` : '';
  const desc = props.desc ? `<desc>${escapeHtml(props.desc)}</desc>` : '';

  return output.replace('>', `>${title}${desc}`);
}

export function PrettyQR(props: PrettyQRProps) {
  try {
    const svg = decorateSvg(renderPrettyQRSvg(resolvePrettyQROptions(props)), props);

    return (
      <div
        data-testid='prettyqr-wrapper'
        data-prettyqr='true'
        className={props.className}
        style={props.style as CSSProperties | undefined}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG is generated internally from validated options and escaped metadata.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }

    return (
      <div
        data-testid='prettyqr-wrapper'
        data-prettyqr='true'
        className={props.className}
        style={props.style as CSSProperties | undefined}
      />
    );
  }
}
