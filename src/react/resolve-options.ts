import type { PrettyQROptions } from '../encoder/types';
import { PRETTY_QR_PRESETS } from './presets';
import type { PrettyQRProps, PrettyQRPreset } from './types';

function clampSize(size: number | undefined): number | undefined {
  if (size === undefined || Number.isNaN(size)) {
    return undefined;
  }

  return Math.max(64, size);
}

function mergeOptions(
  base: PrettyQROptions,
  shortProps: PrettyQROptions,
  override: PrettyQROptions | undefined
): PrettyQROptions {
  return {
    ...base,
    ...shortProps,
    ...override,
    style: {
      ...base.style,
      ...shortProps.style,
      ...override?.style
    }
  };
}

export function resolvePrettyQROptions(props: PrettyQRProps): PrettyQROptions {
  if (!props.value.trim()) {
    throw new Error('value is required');
  }

  const presetName = (props.preset ?? 'default') as PrettyQRPreset;
  const preset = PRETTY_QR_PRESETS[presetName] ?? PRETTY_QR_PRESETS.default;
  const shortProps: PrettyQROptions = {
    text: props.value,
    size: clampSize(props.size)
  };
  const merged = mergeOptions(preset, shortProps, props.options);

  return {
    ...merged,
    size: clampSize(merged.size)
  };
}
