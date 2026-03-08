# StyledQR

[![npm version](https://img.shields.io/npm/v/styledqr?logo=npm)](https://www.npmjs.com/package/styledqr)
[![npm downloads](https://img.shields.io/npm/dm/styledqr?logo=npm)](https://www.npmjs.com/package/styledqr)
[![Release](https://github.com/Olejqua/styledqr/actions/workflows/release.yml/badge.svg)](https://github.com/Olejqua/styledqr/actions/workflows/release.yml)

Beautiful, stylable QR codes (SVG) with logo and patterns.

## Features

- 🎨 Beautiful QR codes with customizable styles
- 🖼️ Logo/image support in the center
- 🎯 Sharp and rounded pattern presets
- 👁️ Custom eye patterns
- 📐 Geometric shapes and patterns
- ⚡ Lightweight and fast
- 📱 SVG output for perfect scaling

## Installation

```bash
npm install styledqr
# or
yarn add styledqr
# or
pnpm add styledqr
```

## Usage

```typescript
import { StyledQR } from 'styledqr'

const qr = new StyledQR({
  text: 'Hello, World!',
  size: 256,
  logo: {
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    size: 64
  },
  style: {
    background: '#ffffff',
    foreground: '#0b1324',
    eyeStyle: 'rounded',
    patternStyle: 'rounded'
  }
})

const svg = qr.toSVG()
```

## React Usage

```tsx
import { StyledQR } from 'styledqr/react';

export function App() {
  return (
    <StyledQR
      value='https://example.com'
      size={256}
      preset='rounded'
      options={{
        style: {
          foreground: '#229ed9',
        },
      }}
      aria-label='Example QR code'
    />
  );
}
```

## Tailwind Usage

StyledQR is a rendering primitive. Bring your own shadcn/ui components (Card, Dialog, Tabs, etc.) around it.

```tsx
import { StyledQR } from 'styledqr/react';

export function PaymentQr() {
  return (
    <StyledQR
      value='solana:pay-demo'
      preset='rounded'
      className='w-full [&>svg]:w-full [&>svg]:h-auto'
      aria-label='Payment QR'
    />
  );
}
```

More copy-paste composition examples: `docs/style-system/shadcn-recipes.md`.

## Releases

- Changelog: `CHANGELOG.md`
- Automated publishing: `.github/workflows/release.yml`
- Release flow:
1. Run `pnpm changeset` and describe the change.
2. Push to `main`.
3. GitHub Action creates/updates a "Version Packages" PR.
4. Merge that PR to publish to npm and create a GitHub Release.

Required GitHub secret:
- `NPM_TOKEN` (automation token with publish rights to `styledqr`).

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Run playground
pnpm play

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## License

MIT
