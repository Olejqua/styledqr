import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrettyQR } from './PrettyQR';

describe('PrettyQR', () => {
  it('renders SVG markup for valid props', () => {
    const { container } = render(<PrettyQR value='hello' />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('applies className and wrapper style', () => {
    const { container } = render(
      <PrettyQR value='hello' className='qr' style={{ padding: '8px' }} />,
    );
    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper).toHaveClass('qr');
    expect(wrapper.style.padding).toBe('8px');
  });

  it('keeps tailwind utility classes on wrapper for svg targeting', () => {
    const { container } = render(
      <PrettyQR value='hello' className='w-full [&>svg]:h-auto [&>svg]:w-full' />,
    );
    const wrapper = container.querySelector('[data-testid="prettyqr-wrapper"]') as HTMLElement;

    expect(wrapper.className).toContain('w-full');
    expect(wrapper.className).toContain('[&>svg]:h-auto');
    expect(wrapper.className).toContain('[&>svg]:w-full');
  });

  it('renders role and aria-label attributes', () => {
    const { container } = render(<PrettyQR value='hello' aria-label='QR code' />);
    const svg = container.querySelector('svg');

    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('QR code');
  });

  it('includes title and desc semantics when provided', () => {
    const { container } = render(<PrettyQR value='hello' title='QR Title' desc='QR Description' />);

    expect(container.querySelector('svg title')?.textContent).toBe('QR Title');
    expect(container.querySelector('svg desc')?.textContent).toBe('QR Description');
  });
});
