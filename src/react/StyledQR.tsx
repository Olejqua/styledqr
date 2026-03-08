import type { CSSProperties } from 'react';
import { renderStyledQRSvg } from '../render/render-styledqr-svg';
import { resolveStyledQROptions } from './resolve-options';
import type { StyledQRProps } from './types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decorateSvg(svg: string, props: StyledQRProps): string {
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

export function StyledQR(props: StyledQRProps) {
  try {
    const svg = decorateSvg(renderStyledQRSvg(resolveStyledQROptions(props)), props);

    return (
      <div
        data-testid='styledqr-wrapper'
        data-styledqr='true'
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
        data-testid='styledqr-wrapper'
        data-styledqr='true'
        className={props.className}
        style={props.style as CSSProperties | undefined}
      />
    );
  }
}
