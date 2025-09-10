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
  MAX_QR_SIZE: 50, // Threshold for using optimized renderer
  CACHE_THRESHOLD: 10,
  MEMORY_THRESHOLD_KB: 512, // Memory threshold for optimizations
  BATCH_SIZE_SMALL: 50, // Batch size for small QR codes
  BATCH_SIZE_MEDIUM: 25, // Batch size for medium QR codes
  BATCH_SIZE_LARGE: 10, // Batch size for large QR codes
  BATCH_SIZE_XLARGE: 5, // Batch size for very large QR codes
  
  // SVG configuration
  SVG_NAMESPACE: 'http://www.w3.org/2000/svg',
  DEFAULT_BACKGROUND: '#ffffff',
  DEFAULT_FOREGROUND: '#000000',
} as const;

export type QRConfig = typeof QR_CONFIG;
