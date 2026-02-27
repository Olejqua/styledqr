import type { PrettyQROptions } from '../encoder/types';

export type PrettyQRPreset = 'default' | 'rounded' | 'diamond' | 'circle';
export type PrettyQROptionsOverride = Omit<PrettyQROptions, 'text'>;

export interface PrettyQRProps {
  value: string;
  size?: number;
  preset?: PrettyQRPreset;
  options?: PrettyQROptionsOverride;
  className?: string;
  style?: Record<string, string | number>;
  title?: string;
  desc?: string;
  'aria-label'?: string;
  id?: string;
}
