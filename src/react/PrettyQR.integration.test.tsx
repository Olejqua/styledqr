import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrettyQR } from './PrettyQR';

describe('PrettyQR integration', () => {
  it('applies props merge precedence end-to-end', () => {
    const withShortOnly = render(<PrettyQR value='hello' preset='rounded' size={180} />);
    const withOptionsOverride = render(
      <PrettyQR
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
      'data-prettyqr',
      'true',
    );
    expect(withOptionsOverride.container.querySelector('svg')?.outerHTML).toContain('#ff0000');
    expect(overrideSvgWidth).toBeGreaterThan(shortSvgWidth);
  });
});
