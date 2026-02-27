# PrettyQR

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
npm install prettyqr
# or
yarn add prettyqr
# or
pnpm add prettyqr
```

## Usage

```typescript
import { PrettyQR } from 'prettyqr'

const qr = new PrettyQR({
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
import { PrettyQR } from 'prettyqr/react';

export function App() {
  return (
    <PrettyQR
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

PrettyQR is a rendering primitive. Bring your own shadcn/ui components (Card, Dialog, Tabs, etc.) around it.

```tsx
import { PrettyQR } from 'prettyqr/react';

export function PaymentQr() {
  return (
    <PrettyQR
      value='solana:pay-demo'
      preset='rounded'
      className='w-full [&>svg]:w-full [&>svg]:h-auto'
      aria-label='Payment QR'
    />
  );
}
```

More copy-paste composition examples: `docs/style-system/shadcn-recipes.md`.

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
