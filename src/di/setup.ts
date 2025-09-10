import { container, SERVICE_KEYS } from './container';
import {
  QRCodeAdapterImpl,
  BackgroundRendererImpl,
  EyeRendererImpl,
  ModuleRendererImpl,
  LogoRendererImpl,
  StringBuilderImpl,
} from './adapters';

/**
 * Setup default services in the DI container
 */
export function setupDefaultServices(): void {
  // Register singleton services
  container.register(SERVICE_KEYS.QR_CODE_ADAPTER, new QRCodeAdapterImpl());
  container.register(SERVICE_KEYS.BACKGROUND_RENDERER, new BackgroundRendererImpl());
  container.register(SERVICE_KEYS.MODULE_RENDERER, new ModuleRendererImpl());
  container.register(SERVICE_KEYS.LOGO_RENDERER, new LogoRendererImpl());

  // Register factory for services that need parameters
  container.registerFactory(SERVICE_KEYS.EYE_RENDERER, () => new EyeRendererImpl(0, {}));
  container.registerFactory(SERVICE_KEYS.STRING_BUILDER, () => new StringBuilderImpl());
}

/**
 * Initialize DI container with default services
 */
export function initializeDI(): void {
  setupDefaultServices();
}
