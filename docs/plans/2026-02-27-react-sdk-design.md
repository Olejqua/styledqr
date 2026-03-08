# StyledQR React SDK Design

## Summary

This document defines the first React SDK milestone for StyledQR using an SSR-first architecture. The SDK will be published as an additional entrypoint in the existing package: `styledqr/react`. The first release focuses on one component (`StyledQR`) and one composable options pipeline that maps a simple React API into the existing core renderer.

The design intentionally avoids extra abstractions in v1 (no provider, no hook-only API, no multi-package split). The goal is to restore development momentum with a stable, testable surface that supports both quick usage and full control.

## Goals

- Ship an SSR-safe React component for Next.js and plain React projects.
- Keep the existing package (`styledqr`) and add a React entrypoint.
- Support hybrid API:
  - Short props (`value`, `size`, `preset`)
  - Full override via `options`
- Ensure deterministic output and predictable merge rules.
- Apply test-first development for each behavior.

## Non-goals (v1)

- Separate package `@styledqr/react`
- Hook/context API
- Client-only rendering mode
- Advanced runtime theming system

## Recommended Architecture (Option B)

1. Extract a pure core function:
   - `renderStyledQRSvg(options: StyledQROptions): string`
   - Lives in the core package, no React dependency.
2. React layer:
   - `StyledQR` component in `src/react/StyledQR.tsx`
   - Maps props to core options and calls `renderStyledQRSvg`.
3. Preset system:
   - Static preset map with minimal styles (`telegram`, `minimal`, `mono`).
   - Merge order: `preset < short props < options`.
4. Entry points:
   - Keep `styledqr` root exports as-is.
   - Add `styledqr/react` export target.

This approach minimizes client JavaScript and aligns with Vercel guidance: keep heavy computation in pure functions and avoid unnecessary client state/effects for deterministic rendering.

## Public API (v1)

```ts
type StyledQRPreset = 'telegram' | 'minimal' | 'mono';

interface StyledQRProps {
  value: string;
  size?: number;
  preset?: StyledQRPreset;
  options?: Omit<StyledQROptions, 'text' | 'size'> & { size?: number };
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  desc?: string;
  'aria-label'?: string;
  id?: string;
}
```

Behavior:
- `value` maps to `text`.
- `size` maps to `size`.
- `options` overrides everything else.
- Accessibility:
  - wrapper with `role="img"`
  - optional `<title>` and `<desc>` inside SVG for semantic labeling.

## Data Flow

1. Validate and normalize props.
2. Resolve preset defaults.
3. Merge normalized short props.
4. Merge `options` as final override.
5. Call `renderStyledQRSvg(finalOptions)`.
6. Return component with deterministic SVG markup.

Validation policy:
- Empty `value`: dev error; production fallback markup.
- Invalid `size`: clamp to a safe minimum (64).
- Logo-format checks remain in existing core validation.

## Error Handling

- Development:
  - Throw explicit errors for invalid required input.
- Production:
  - Render safe fallback container with `data-styledqr-error` for diagnostics.
- Never access `window`/`document` in React render path.

## Testing Strategy

1. Core tests
   - render function determinism
   - merge precedence
   - validation behavior
2. React tests
   - markup + a11y attributes
   - fallback behavior on render errors
   - stable output for same props
3. Package surface tests
   - `styledqr/react` export and type checks

Development follows strict red-green-refactor for each behavior.

## Performance Notes (Vercel-aligned)

- Keep logic synchronous and deterministic in render path.
- Avoid effects/state for derived values.
- Avoid extra client-only wrappers.
- Keep imports direct and minimal to avoid bundle bloat.

## Rollout

1. Add test tooling for TS + React component tests.
2. Implement pure render API + presets + merge utility.
3. Implement React component and react entrypoint.
4. Validate build/types and run full test suite.

