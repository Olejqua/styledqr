# Shadcn Primitive Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Position PrettyQR as a Tailwind/shadcn-friendly QR primitive with polished API usage docs and copy-paste composition recipes.

**Architecture:** Keep the library scope focused on one React primitive (`PrettyQR`) and avoid shipping higher-level UI wrappers. Improve integration ergonomics (className/responsive usage guidance) and add shadcn composition recipes in docs/examples only. Validate with focused React/render tests and full package quality gates.

**Tech Stack:** TypeScript, React 18+, Vitest, Vite playground, Tailwind/shadcn composition patterns.

---

### Task 1: Add Tailwind Integration Guidance To README

**Files:**
- Modify: `README.md`
- Test: `src/react/PrettyQR.test.tsx`

**Step 1: Write the failing test**

```ts
it('keeps className on the wrapper so Tailwind utilities can target nested svg', () => {
  render(<PrettyQR value="https://example.com" className="w-full [&>svg]:h-auto" />);
  const wrapper = screen.getByTestId('prettyqr-wrapper');
  expect(wrapper.className).toContain('w-full');
  expect(wrapper.className).toContain('[&>svg]:h-auto');
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/react/PrettyQR.test.tsx`
Expected: FAIL due to missing `data-testid` or missing assertion target.

**Step 3: Write minimal implementation**

```tsx
return (
  <div
    data-testid='prettyqr-wrapper'
    data-prettyqr='true'
    className={props.className}
    style={props.style as CSSProperties | undefined}
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/react/PrettyQR.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add README.md src/react/PrettyQR.test.tsx src/react/PrettyQR.tsx
git commit -m "docs: add tailwind integration guidance for PrettyQR"
```

### Task 2: Document Primitive Positioning + Shadcn Strategy

**Files:**
- Modify: `README.md`

**Step 1: Write the failing test**

Create an expectation in docs lint/snapshot test (if no docs test exists, add one lightweight string assertion in existing smoke suite):

```ts
it('describes PrettyQR as a composable primitive for shadcn', () => {
  const readme = fs.readFileSync('README.md', 'utf8');
  expect(readme).toContain('PrettyQR is a rendering primitive');
  expect(readme).toContain('Bring your own shadcn/ui components');
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/test/smoke.test.ts`
Expected: FAIL because README phrases are missing.

**Step 3: Write minimal implementation**

Add a new section in README:

```md
## Shadcn/ui Positioning

PrettyQR is a rendering primitive.
Bring your own shadcn/ui components (Card, Dialog, Tabs, etc.) around it.
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/test/smoke.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add README.md src/test/smoke.test.ts
git commit -m "docs: define PrettyQR primitive positioning for shadcn"
```

### Task 3: Add Shadcn Recipe Snippets (Docs-Only, Copy-Paste)

**Files:**
- Modify: `README.md`
- Create: `docs/style-system/shadcn-recipes.md`

**Step 1: Write the failing test**

```ts
it('contains three shadcn composition recipes', () => {
  const recipes = fs.readFileSync('docs/style-system/shadcn-recipes.md', 'utf8');
  expect(recipes).toContain('Card + PrettyQR');
  expect(recipes).toContain('Dialog + PrettyQR');
  expect(recipes).toContain('Tabs + PrettyQR');
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/test/smoke.test.ts`
Expected: FAIL because file/sections do not exist.

**Step 3: Write minimal implementation**

Create recipe doc with complete snippets:

```tsx
<Card className='w-full max-w-sm'>
  <CardContent className='p-6'>
    <PrettyQR
      value='solana:...'
      className='w-full [&>svg]:w-full [&>svg]:h-auto'
      preset='rounded'
    />
  </CardContent>
</Card>
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/test/smoke.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add README.md docs/style-system/shadcn-recipes.md src/test/smoke.test.ts
git commit -m "docs: add shadcn composition recipes for PrettyQR"
```

### Task 4: Add Playground Preset Scenarios For Shadcn-like Layouts

**Files:**
- Modify: `examples/playground/main.ts`
- Modify: `examples/playground/index.html`
- Test: `src/render/render-prettyqr-svg.test.ts`

**Step 1: Write the failing test**

```ts
it('renders rounded preset config used in shadcn payment recipe', () => {
  const svg = renderPrettyQRSvg({
    text: 'solana:pay-demo',
    style: { patternStyle: 'rounded', foreground: '#229ed9' },
  });
  expect(svg).toContain('<path');
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/render/render-prettyqr-svg.test.ts`
Expected: FAIL if scenario constants are not wired.

**Step 3: Write minimal implementation**

Add ready-to-preview scenarios in playground controls and route them to existing renderer options.

**Step 4: Run test to verify it passes**

Run: `pnpm run test -- src/render/render-prettyqr-svg.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add examples/playground/main.ts examples/playground/index.html src/render/render-prettyqr-svg.test.ts
git commit -m "feat: add shadcn-oriented playground scenarios"
```

### Task 5: Final Quality Gate + Release Readiness Check

**Files:**
- Modify: `README.md` (final small fixes if any)
- Modify: `docs/style-system/shadcn-recipes.md` (final polish)

**Step 1: Write the failing test**

Add one integration assertion for accessibility:

```ts
it('includes role and optional aria-label in rendered svg for recipe examples', () => {
  render(<PrettyQR value='https://example.com' aria-label='Payment QR' />);
  const wrapper = screen.getByLabelText('Payment QR');
  expect(wrapper).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/react/PrettyQR.integration.test.tsx`
Expected: FAIL if query target is mismatched.

**Step 3: Write minimal implementation**

Adjust test target/metadata injection only as needed (YAGNI, no new API surface).

**Step 4: Run full verification**

Run:
- `pnpm run test`
- `pnpm run build`
- `pnpm run typecheck`
- `pnpm run check`
- `pnpm pack --json`
Expected: all pass and tarball includes `dist/*`, `README.md`, `package.json`.

**Step 5: Commit**

```bash
git add README.md docs/style-system/shadcn-recipes.md src/react src/render examples/playground
git commit -m "chore: finalize shadcn primitive integration docs and validation"
```

---

## Execution Notes

- Follow @superpowers:test-driven-development strictly for each behavior change.
- Keep YAGNI: no new UI-kit components, no `Card` abstractions in package API.
- Keep messaging consistent: PrettyQR is primitive-first; shadcn is composition layer.
- If any visual regression appears in `rounded`, stop and re-run the contour tests before continuing.
