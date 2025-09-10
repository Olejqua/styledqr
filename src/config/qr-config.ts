/**
 * Configuration constants for QR code rendering
 */
export const QR_CONFIG = {
  // Eye configuration
  EYE_SIZE: 7,
  CORNER_RADIUS_MULTIPLIER: 0.6,
  
  // Default values
  DEFAULT_SIZE: 256,
  DEFAULT_MARGIN: 4,
  DEFAULT_MODULE_SIZE: 1,
  
  // Performance thresholds
  MAX_QR_SIZE: 100,
  CACHE_THRESHOLD: 10,
  
  // SVG configuration
  SVG_NAMESPACE: 'http://www.w3.org/2000/svg',
  DEFAULT_BACKGROUND: '#ffffff',
  DEFAULT_FOREGROUND: '#000000',
} as const;

export type QRConfig = typeof QR_CONFIG;
