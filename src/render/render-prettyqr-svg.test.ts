import { describe, expect, it } from 'vitest';
import { renderPrettyQRSvg } from './render-prettyqr-svg';

describe('renderPrettyQRSvg', () => {
  it('is deterministic for the same input', () => {
    const options = {
      text: 'hello',
      size: 180,
      style: { foreground: '#000000', background: '#ffffff' },
    };

    expect(renderPrettyQRSvg(options)).toBe(renderPrettyQRSvg(options));
  });

  it('returns svg markup', () => {
    const output = renderPrettyQRSvg({ text: 'hello' });
    expect(output).toContain('<svg');
  });

  it('changes output when style changes', () => {
    const a = renderPrettyQRSvg({
      text: 'hello',
      style: { foreground: '#000000' },
    });
    const b = renderPrettyQRSvg({
      text: 'hello',
      style: { foreground: '#ff0000' },
    });

    expect(a).not.toBe(b);
  });

  it('renders rounded payment recipe style as contour path output', () => {
    const output = renderPrettyQRSvg({
      text: 'solana:pay-demo',
      style: {
        foreground: '#229ed9',
        background: '#ffffff',
        patternStyle: 'rounded',
        eyeStyle: 'rounded',
      },
    });

    expect(output).toContain('<path');
    expect(output).toContain('fill-rule="evenodd"');
  });
});
