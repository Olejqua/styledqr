# PrettyQR

Beautiful, stylable QR codes (SVG) with logo and patterns, Telegram-like aesthetics.

## Features

- 🎨 Beautiful QR codes with customizable styles
- 🖼️ Logo/image support in the center
- 🌈 Gradient backgrounds and patterns
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
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    foreground: '#ffffff',
    eyeStyle: 'rounded'
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
      preset='telegram'
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
