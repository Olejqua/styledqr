import React from 'react';
import type { CSSProperties } from 'react';
import { renderPrettyQRSvg } from '../render/render-prettyqr-svg';
import { resolvePrettyQROptions } from './resolve-options';
import type { PrettyQRProps } from './types';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function decorateSvg(svg: string, props: PrettyQRProps): string {
  const attributes: string[] = ['role="img"'];

  if (props.id) {
    attributes.push(`id="${escapeHtml(props.id)}"`);
  }

  if (props['aria-label']) {
    attributes.push(`aria-label="${escapeHtml(props['aria-label'])}"`);
  }

  let output = svg.replace('<svg ', `<svg ${attributes.join(' ')} `);

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
        className={props.className}
        style={props.style as CSSProperties | undefined}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }

    return <div className={props.className} style={props.style as CSSProperties | undefined} />;
  }
}
