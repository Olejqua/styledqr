import type {
  IQRCodeAdapter,
  IBackgroundRenderer,
  IEyeRenderer,
  IModuleRenderer,
  ILogoRenderer,
  IStringBuilder,
} from './interfaces';

/**
 * Simple Dependency Injection Container
 */
export class DIContainer {
  private services = new Map<string, any>();

  /**
   * Register a service in the container
   */
  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  /**
   * Register a factory function for lazy instantiation
   */
  registerFactory<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  /**
   * Get a service from the container
   */
  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service '${key}' not found in container`);
    }

    // If it's a factory function, call it and cache the result
    if (typeof service === 'function') {
      const instance = service();
      this.services.set(key, instance);
      return instance;
    }

    return service;
  }

  /**
   * Check if a service is registered
   */
  has(key: string): boolean {
    return this.services.has(key);
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
  }
}

/**
 * Service keys
 */
export const SERVICE_KEYS = {
  QR_CODE_ADAPTER: 'qrCodeAdapter',
  BACKGROUND_RENDERER: 'backgroundRenderer',
  EYE_RENDERER: 'eyeRenderer',
  MODULE_RENDERER: 'moduleRenderer',
  LOGO_RENDERER: 'logoRenderer',
  STRING_BUILDER: 'stringBuilder',
} as const;

/**
 * Default container instance
 */
export const container = new DIContainer();
