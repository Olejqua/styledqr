import { QRCodeAdapter } from '../encoder/adapter-qrcode-generator';
import { BackgroundRenderer } from '../render/background-renderer';
import { EyeRenderer } from '../render/eyes';
import { ModuleRenderer } from '../render/module-renderer';
import { LogoRenderer } from '../render/logo';
import { SVGStringBuilder } from '../render/svg-builder';
import type { StyleOptions } from '../encoder/types';
import type {
  IQRCodeAdapter,
  IBackgroundRenderer,
  IEyeRenderer,
  IModuleRenderer,
  ILogoRenderer,
  IStringBuilder,
} from './interfaces';

/**
 * Adapter implementations for DI container
 */
export class QRCodeAdapterImpl implements IQRCodeAdapter {
  private adapter = new QRCodeAdapter();

  generate(options: any): any {
    return this.adapter.generate(options);
  }
}

export class BackgroundRendererImpl implements IBackgroundRenderer {
  render(style: StyleOptions): string {
    return BackgroundRenderer.render(style);
  }
}

export class EyeRendererImpl implements IEyeRenderer {
  private renderer: EyeRenderer;

  constructor(moduleSize: number, style: StyleOptions) {
    this.renderer = new EyeRenderer(moduleSize, style);
  }

  renderAllEyes(moduleSize: number, qrSize: number, margin: number): string {
    return this.renderer.renderAllEyes(moduleSize, qrSize, margin);
  }
}

export class ModuleRendererImpl implements IModuleRenderer {
  renderModules(options: any): string {
    return ModuleRenderer.renderModules(options);
  }
}

export class LogoRendererImpl implements ILogoRenderer {
  createLogoMask(logo: any, qrSize: number, moduleSize: number): string {
    return LogoRenderer.createLogoMask(logo, qrSize, moduleSize);
  }

  renderLogo(logo: any, qrSize: number, moduleSize: number): string {
    return LogoRenderer.renderLogo(logo, qrSize, moduleSize);
  }

  shouldClearForLogo(row: number, col: number, logo: any, qrSize: number): boolean {
    return LogoRenderer.shouldClearForLogo(row, col, logo, qrSize);
  }
}

export class StringBuilderImpl implements IStringBuilder {
  private builder = new SVGStringBuilder();

  append(part: string): this {
    this.builder.append(part);
    return this;
  }

  build(): string {
    return this.builder.build();
  }
}
