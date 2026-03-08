import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StyledQR } from './StyledQR';

describe('StyledQR integration', () => {
  it('applies props merge precedence end-to-end', () => {
    const withShortOnly = render(<StyledQR value='hello' preset='rounded' size={180} />);
    const withOptionsOverride = render(
      <StyledQR
        value='hello'
        preset='rounded'
        size={180}
        options={{
          size: 240,
          style: { foreground: '#ff0000' },
        }}
      />,
    );

    const shortSvgWidth = Number(
      withShortOnly.container.querySelector('svg')?.getAttribute('width') ?? 0,
    );
    const overrideSvgWidth = Number(
      withOptionsOverride.container.querySelector('svg')?.getAttribute('width') ?? 0,
    );

    expect(withOptionsOverride.container.firstElementChild).toHaveAttribute(
      'data-styledqr',
      'true',
    );
    expect(withOptionsOverride.container.querySelector('svg')?.outerHTML).toContain('#ff0000');
    expect(overrideSvgWidth).toBeGreaterThan(shortSvgWidth);
  });

  it('exposes aria-label on rendered svg', () => {
    render(<StyledQR value='https://example.com' aria-label='Payment QR' />);
    const svg = screen.getByLabelText('Payment QR');

    expect(svg.tagName.toLowerCase()).toBe('svg');
  });
});
