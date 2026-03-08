import type { StyledQROptions } from '../encoder/types';

export type StyledQRPreset = 'default' | 'rounded' | 'diamond' | 'circle';
export type StyledQROptionsOverride = Omit<StyledQROptions, 'text'>;

export interface StyledQRProps {
  value: string;
  size?: number;
  preset?: StyledQRPreset;
  options?: StyledQROptionsOverride;
  className?: string;
  style?: Record<string, string | number>;
  title?: string;
  desc?: string;
  'aria-label'?: string;
  id?: string;
}
