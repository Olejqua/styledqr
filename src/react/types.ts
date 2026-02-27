import type { PrettyQROptions } from '../encoder/types';

export type PrettyQRPreset = 'default' | 'telegram' | 'mono';

export interface PrettyQRProps {
  value: string;
  size?: number;
  preset?: PrettyQRPreset;
  options?: PrettyQROptions;
  className?: string;
  style?: Record<string, string | number>;
  title?: string;
  desc?: string;
  'aria-label'?: string;
  id?: string;
}
