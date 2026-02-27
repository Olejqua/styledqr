import { describe, expect, it } from 'vitest';
import type { PrettyQRProps } from './types';
import './types';

describe('PrettyQRProps', () => {
  it('is importable', () => {
    const props: PrettyQRProps = { value: 'hello' };
    expect(props.value).toBe('hello');
  });
});
