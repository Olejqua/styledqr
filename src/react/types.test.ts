import { describe, expect, it } from 'vitest';
import type { StyledQRProps } from './types';
import './types';

describe('StyledQRProps', () => {
  it('is importable', () => {
    const props: StyledQRProps = { value: 'hello' };
    expect(props.value).toBe('hello');
  });
});
