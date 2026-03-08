import { describe, expect, it } from 'vitest';
import { renderStyledQRSvg } from './render-styledqr-svg';

describe('renderStyledQRSvg', () => {
  it('is deterministic for the same input', () => {
    const options = {
      text: 'hello',
      size: 180,
      style: { foreground: '#000000', background: '#ffffff' },
    };

    expect(renderStyledQRSvg(options)).toBe(renderStyledQRSvg(options));
  });

  it('returns svg markup', () => {
    const output = renderStyledQRSvg({ text: 'hello' });
    expect(output).toContain('<svg');
  });

  it('changes output when style changes', () => {
    const a = renderStyledQRSvg({
      text: 'hello',
      style: { foreground: '#000000' },
    });
    const b = renderStyledQRSvg({
      text: 'hello',
      style: { foreground: '#ff0000' },
    });

    expect(a).not.toBe(b);
  });

  it('renders rounded payment recipe style as contour path output', () => {
    const output = renderStyledQRSvg({
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
