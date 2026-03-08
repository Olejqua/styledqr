# StyledQR React SDK Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an SSR-first React SDK entrypoint (`styledqr/react`) with a hybrid API (`value`, `size`, `preset`, `options`) and deterministic SVG rendering.

**Architecture:** Extract a pure core render function and a small options resolver (`preset < short props < options`), then build a thin React adapter on top. Keep v1 minimal: one component, no provider/hook abstractions, and strict TDD for each behavior.

**Tech Stack:** TypeScript, React, Vitest, Testing Library, tsup.

---

### Task 1: Test Infrastructure for TDD

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Step 1: Write the failing test**

Create a smoke test file:

```ts
import { describe, expect, it } from 'vitest';

describe('test setup', () => {
  it('runs', () => {
    expect(true).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test`  
Expected: FAIL because test script/config does not exist.

**Step 3: Write minimal implementation**

- Add scripts in `package.json`:
  - `"test": "vitest run"`
  - `"test:watch": "vitest"`
- Add Vitest config (`environment: 'jsdom'`, setup file path).
- Add setup file import for `@testing-library/jest-dom/vitest`.

**Step 4: Run test to verify it passes**

Run: `pnpm run test`  
Expected: PASS with 1 passing test.

**Step 5: Commit**

```bash
git add package.json tsconfig.json vitest.config.ts src/test/setup.ts
git commit -m "test: add vitest infrastructure for react sdk"
```

### Task 2: Define React API Types

**Files:**
- Create: `src/react/types.ts`
- Test: `src/react/types.test.ts`

**Step 1: Write the failing test**

Write type-level expectations (runtime smoke + compile references):

```ts
import { describe, expect, it } from 'vitest';
import type { StyledQRProps } from './types';

describe('StyledQRProps', () => {
  it('is importable', () => {
    const props: StyledQRProps = { value: 'hello' };
    expect(props.value).toBe('hello');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/react/types.test.ts`  
Expected: FAIL because file/types do not exist.

**Step 3: Write minimal implementation**

Add `StyledQRPreset` and `StyledQRProps` with:
- `value`, `size`, `preset`, `options`
- `className`, `style`, `title`, `desc`, `aria-label`, `id`

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/react/types.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/react/types.ts src/react/types.test.ts
git commit -m "feat: add react sdk prop types"
```

### Task 3: Add Presets and Options Resolver

**Files:**
- Create: `src/react/presets.ts`
- Create: `src/react/resolve-options.ts`
- Test: `src/react/resolve-options.test.ts`

**Step 1: Write the failing test**

Add tests for merge precedence:

```ts
it('applies precedence preset < short props < options', () => {
  // assert final resolved style/size values
});
```

Include tests for:
- default preset behavior
- unknown preset fallback
- size clamp to 64
- empty value handling signal (throw or error object per design)

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/react/resolve-options.test.ts`  
Expected: FAIL because resolver not implemented.

**Step 3: Write minimal implementation**

Implement deterministic resolver:
- map `value -> text`
- clamp invalid `size`
- merge preset defaults, then short props, then `options`

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/react/resolve-options.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/react/presets.ts src/react/resolve-options.ts src/react/resolve-options.test.ts
git commit -m "feat: add react preset resolver with merge precedence"
```

### Task 4: Extract Pure Core Render Function

**Files:**
- Modify: `src/index.ts`
- Create: `src/render/render-styledqr-svg.ts`
- Test: `src/render/render-styledqr-svg.test.ts`

**Step 1: Write the failing test**

Add tests for:
- deterministic output for same input
- output contains `<svg`
- output changes when style changes

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/render/render-styledqr-svg.test.ts`  
Expected: FAIL because function does not exist.

**Step 3: Write minimal implementation**

Implement:

```ts
export function renderStyledQRSvg(options: StyledQROptions): string {
  return new SVGRenderer(options).generate();
}
```

Refactor `StyledQR.toSVG()` to call this function.

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/render/render-styledqr-svg.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/index.ts src/render/render-styledqr-svg.ts src/render/render-styledqr-svg.test.ts
git commit -m "refactor: extract pure svg render function"
```

### Task 5: Implement SSR-First React Component

**Files:**
- Create: `src/react/StyledQR.tsx`
- Test: `src/react/StyledQR.test.tsx`

**Step 1: Write the failing test**

Tests:
- renders SVG markup for valid props
- applies `className` and wrapper `style`
- renders a11y attributes (`role`, `aria-label`)
- includes title/desc semantics when provided

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/react/StyledQR.test.tsx`  
Expected: FAIL because component is missing.

**Step 3: Write minimal implementation**

Implement component:
- resolve final options
- call pure render function
- wrap SVG with stable container markup
- safe fallback on errors in production path

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/react/StyledQR.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/react/StyledQR.tsx src/react/StyledQR.test.tsx
git commit -m "feat: add ssr-first react StyledQR component"
```

### Task 6: Add React Entrypoint + Package Exports

**Files:**
- Create: `src/react/index.ts`
- Modify: `package.json`
- Modify: `tsup.config.ts`
- Test: `src/react/entrypoint.test.ts`

**Step 1: Write the failing test**

Smoke test import path:

```ts
it('exports StyledQR from react entrypoint', async () => {
  const mod = await import('./index');
  expect(mod.StyledQR).toBeDefined();
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/react/entrypoint.test.ts`  
Expected: FAIL because entrypoint/exports missing.

**Step 3: Write minimal implementation**

- Export `StyledQR`, `StyledQRProps`, `StyledQRPreset`.
- Configure tsup for multi-entry build.
- Add `./react` in `exports` map with `types/import/require`.

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/react/entrypoint.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/react/index.ts package.json tsup.config.ts src/react/entrypoint.test.ts
git commit -m "build: add styledqr/react entrypoint exports"
```

### Task 7: Validate Full Quality Gate

**Files:**
- Modify: `README.md`
- Optional: `examples/playground/main.ts`

**Step 1: Write the failing test**

Add one integration-style test for end-to-end props merge in React component.

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/react/StyledQR.integration.test.tsx`  
Expected: FAIL before final adjustments.

**Step 3: Write minimal implementation**

Adjust implementation only as needed to satisfy test.

**Step 4: Run test to verify it passes**

Run in order:
- `pnpm run test`
- `pnpm run build`
- `pnpm run typecheck`
- `pnpm run check`

Expected: all PASS.

**Step 5: Commit**

```bash
git add README.md examples/playground/main.ts src/react
git commit -m "docs: add react sdk usage and finalize quality gates"
```

## Notes for Implementation

- Keep v1 API minimal (YAGNI).
- Do not introduce client-only hooks unless required.
- Prefer direct imports over barrel indirection for bundle clarity.
- Keep tests behavior-oriented; avoid over-mocking.
- Preserve existing unrelated working tree changes.

## Definition of Done

- `styledqr/react` import works with types.
- SSR-safe `StyledQR` renders deterministic SVG.
- Merge precedence is fully tested.
- Fallback/error behavior is covered by tests.
- Build, typecheck, lint/check, and tests are green.

