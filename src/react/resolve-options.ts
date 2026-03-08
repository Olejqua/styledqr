import type { StyledQROptions } from '../encoder/types';
import { STYLED_QR_PRESETS } from './presets';
import type { StyledQROptionsOverride, StyledQRPreset, StyledQRProps } from './types';

function clampSize(size: number | undefined): number | undefined {
  if (size === undefined || Number.isNaN(size)) {
    return undefined;
  }

  return Math.max(64, size);
}

function mergeOptions(
  base: StyledQROptionsOverride,
  shortProps: StyledQROptions,
  override: StyledQROptionsOverride | undefined,
): StyledQROptions {
  return {
    ...base,
    ...shortProps,
    ...override,
    style: {
      ...base.style,
      ...shortProps.style,
      ...override?.style,
    },
  };
}

export function resolveStyledQROptions(props: StyledQRProps): StyledQROptions {
  if (!props.value.trim()) {
    throw new Error('value is required');
  }

  const presetName = (props.preset ?? 'default') as StyledQRPreset;
  const preset = STYLED_QR_PRESETS[presetName] ?? STYLED_QR_PRESETS.default;
  const shortProps: StyledQROptions = {
    text: props.value,
    size: clampSize(props.size),
  };
  const merged = mergeOptions(preset, shortProps, props.options);

  return {
    ...merged,
    size: clampSize(merged.size),
  };
}
