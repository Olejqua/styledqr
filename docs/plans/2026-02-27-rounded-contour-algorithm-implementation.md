# Rounded Contour Algorithm Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current per-module rounded renderer with a contour-based rounded renderer that removes visible jagged/beaded artifacts while preserving QR readability.

**Architecture:** Build a binary data-module mask (excluding eyes/logo-safe zones), upscale it to a fine grid, run a conservative contour extraction (marching-squares-like edge tracing), and emit one or more SVG paths with controlled smoothing. Keep a feature flag for A/B comparisons and preserve existing square/circle/diamond styles.

**Tech Stack:** TypeScript, SVG path generation, Vitest, Vite playground, existing StyledQR render pipeline.

---

### Task 1: Baseline + Quality Metrics Harness

**Files:**
- Create: `src/render/rounded-metrics.ts`
- Modify: `src/render/module-renderer.test.ts`
- Test: `src/render/module-renderer.test.ts`

**Step 1: Write the failing test**

```ts
it('computes rounded quality metrics for style regression checks', () => {
  const metrics = analyzeRoundedArtifacts(sampleSvg);
  expect(metrics.seamSegments).toBeGreaterThan(0);
  expect(metrics.pathCount).toBeGreaterThan(0);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/render/module-renderer.test.ts`
Expected: FAIL because `analyzeRoundedArtifacts` does not exist.

**Step 3: Write minimal implementation**

```ts
export function analyzeRoundedArtifacts(svg: string) {
  return { seamSegments: 0, pathCount: 0 };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/render/module-renderer.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/render/rounded-metrics.ts src/render/module-renderer.test.ts
git commit -m "test: add rounded quality metrics harness"
```

### Task 2: Build Binary Mask For Rounded Data Region

**Files:**
- Create: `src/render/rounded-mask.ts`
- Modify: `src/render/module-renderer.ts`
- Test: `src/render/rounded-mask.test.ts`

**Step 1: Write the failing test**

```ts
it('builds mask excluding eye and logo areas', () => {
  const mask = buildRoundedMask({ qrData, eyePositions, logoAreas, upscale: 4 });
  expect(mask.width).toBeGreaterThan(0);
  expect(mask.data.some(Boolean)).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/render/rounded-mask.test.ts`
Expected: FAIL because mask builder does not exist.

**Step 3: Write minimal implementation**

```ts
export function buildRoundedMask(...) {
  return { width, height, data };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/render/rounded-mask.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/render/rounded-mask.ts src/render/rounded-mask.test.ts src/render/module-renderer.ts
git commit -m "feat: build rounded binary mask"
```

### Task 3: Extract Contours From Mask

**Files:**
- Create: `src/render/rounded-contours.ts`
- Test: `src/render/rounded-contours.test.ts`

**Step 1: Write the failing test**

```ts
it('extracts closed contour loops from mask', () => {
  const contours = extractContours(mask);
  expect(contours.length).toBeGreaterThan(0);
  expect(contours[0][0]).toEqual(contours[0][contours[0].length - 1]);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/render/rounded-contours.test.ts`
Expected: FAIL because contour extraction is missing.

**Step 3: Write minimal implementation**

```ts
export function extractContours(mask: Mask): Point[][] {
  // conservative edge trace first; no smoothing yet
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/render/rounded-contours.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/render/rounded-contours.ts src/render/rounded-contours.test.ts
git commit -m "feat: extract closed contours for rounded style"
```

### Task 4: Convert Contours To Smooth SVG Paths

**Files:**
- Create: `src/render/rounded-path.ts`
- Modify: `src/render/module-renderer.ts`
- Test: `src/render/rounded-path.test.ts`

**Step 1: Write the failing test**

```ts
it('emits smooth path commands without circle primitives', () => {
  const d = buildRoundedPath(contours, { smoothness: 0.35 });
  expect(d).toContain('Q');
  expect(d).not.toContain('<circle');
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/render/rounded-path.test.ts`
Expected: FAIL because path builder is missing.

**Step 3: Write minimal implementation**

```ts
export function buildRoundedPath(...) {
  return 'M ... Z';
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/render/rounded-path.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/render/rounded-path.ts src/render/rounded-path.test.ts src/render/module-renderer.ts
git commit -m "feat: render rounded style from contour paths"
```

### Task 5: Add Safety Constraints For Scan Reliability

**Files:**
- Create: `src/render/rounded-constraints.ts`
- Modify: `src/render/rounded-mask.ts`
- Test: `src/render/rounded-constraints.test.ts`

**Step 1: Write the failing test**

```ts
it('preserves minimum bridge thickness after smoothing', () => {
  const constrained = enforceRoundedConstraints(mask, { minBridgePx: 2 });
  expect(constrained.valid).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/render/rounded-constraints.test.ts`
Expected: FAIL because constraints layer is missing.

**Step 3: Write minimal implementation**

```ts
export function enforceRoundedConstraints(...) {
  return { valid: true, mask };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/render/rounded-constraints.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/render/rounded-constraints.ts src/render/rounded-constraints.test.ts src/render/rounded-mask.ts
git commit -m "feat: enforce rounded rendering decode constraints"
```

### Task 6: Integrate A/B Toggle In Playground

**Files:**
- Modify: `examples/playground/main.ts`
- Modify: `examples/playground/index.html`
- Test: `src/render/render-styledqr-svg.test.ts`

**Step 1: Write the failing test**

```ts
it('uses contour rounded renderer when advancedRounded is enabled', () => {
  const svg = renderStyledQR({ ..., style: { patternStyle: 'rounded', advancedRounded: true } });
  expect(svg).toContain('<path');
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/render/render-styledqr-svg.test.ts`
Expected: FAIL because toggle is unsupported.

**Step 3: Write minimal implementation**

```ts
if (style.patternStyle === 'rounded' && style.advancedRounded) {
  return renderRoundedFromContour(...);
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/render/render-styledqr-svg.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add examples/playground/main.ts examples/playground/index.html src/render/render-styledqr-svg.test.ts
git commit -m "feat: add advanced rounded toggle in playground"
```

### Task 7: Visual + Regression Validation Gate

**Files:**
- Modify: `README.md`
- Create: `docs/style-system/rounded-rendering-notes.md`

**Step 1: Write the failing test**

```ts
it('reduces seam artifact metric versus legacy rounded renderer', () => {
  expect(nextMetrics.seamSegments).toBeLessThan(legacyMetrics.seamSegments);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/render/module-renderer.test.ts`
Expected: FAIL before metric target is met.

**Step 3: Write minimal implementation**

- Tune smoothing/min bridge defaults until metric target passes.
- Document defaults and tradeoffs.

**Step 4: Run full verification**

Run:
- `pnpm run test`
- `pnpm run build`
- `pnpm run typecheck`
- `pnpm run check`
Expected: all pass.

**Step 5: Commit**

```bash
git add README.md docs/style-system/rounded-rendering-notes.md src/render
git commit -m "feat: ship contour-based rounded algorithm with validation notes"
```

---

## Research Notes To Apply During Implementation

- Prefer contour extraction over per-module geometry to avoid local seam artifacts.
- Keep finder/alignment/timing modules untouched.
- Enforce conservative smoothing; never allow diagonal-only bridges to merge.
- Validate against at least two real scanners and one synthetic decode test suite.
