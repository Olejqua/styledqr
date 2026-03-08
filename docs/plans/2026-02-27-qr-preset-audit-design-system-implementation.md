# QR Preset Audit & Design System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a non-blocking QR style design system and expert preset audit flow (with scoring) for SMB + Enterprise use cases.

**Architecture:** Add a small `audit` domain in the library with typed scoring criteria, weighted aggregation, and preset passports. Keep all combinations allowed (no hard bans) and return soft outputs only: total score, risk level, tone, and recommendation text. Expose a tiny report generator script and document current presets (`default`, `telegram`, `mono`) using the same deterministic scoring model.

**Tech Stack:** TypeScript, Vitest, existing StyledQR preset config, Markdown docs.

---

### Task 1: Add Typed Audit Model

**Files:**
- Create: `src/audit/types.ts`
- Test: `src/audit/types.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import type { AuditCriterionId, PresetAuditScore } from './types';

describe('audit types', () => {
  it('exports criterion ids and score shape', () => {
    const id: AuditCriterionId = 'brandFit';
    const score: PresetAuditScore = {
      preset: 'default',
      criteria: { brandFit: 4, scanConfidence: 5, visualDistinctiveness: 2, compositionalBalance: 4, deploymentFlexibility: 5, enterpriseSafety: 5 },
      total: 4.3,
      risk: 'low',
      tone: 'conservative',
      recommendation: 'safe-default',
    };

    expect(id).toBe('brandFit');
    expect(score.total).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/audit/types.test.ts`  
Expected: FAIL with module not found (`./types`).

**Step 3: Write minimal implementation**

```ts
export type AuditCriterionId =
  | 'brandFit'
  | 'scanConfidence'
  | 'visualDistinctiveness'
  | 'compositionalBalance'
  | 'deploymentFlexibility'
  | 'enterpriseSafety';

export type RiskLevel = 'low' | 'medium' | 'high';
export type Tone = 'conservative' | 'balanced' | 'expressive';

export interface PresetAuditScore {
  preset: string;
  criteria: Record<AuditCriterionId, 1 | 2 | 3 | 4 | 5>;
  total: number;
  risk: RiskLevel;
  tone: Tone;
  recommendation: string;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/audit/types.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/audit/types.ts src/audit/types.test.ts
git commit -m "feat: add typed model for preset audit scoring"
```

### Task 2: Implement Weighted Scoring Engine

**Files:**
- Create: `src/audit/scoring.ts`
- Test: `src/audit/scoring.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { scorePreset } from './scoring';

describe('scorePreset', () => {
  it('calculates weighted total using SMB+Enterprise weights', () => {
    const result = scorePreset('default', {
      brandFit: 4,
      scanConfidence: 5,
      visualDistinctiveness: 2,
      compositionalBalance: 4,
      deploymentFlexibility: 5,
      enterpriseSafety: 5,
    });

    expect(result.total).toBeCloseTo(4.25, 2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/audit/scoring.test.ts`  
Expected: FAIL because `scorePreset` does not exist.

**Step 3: Write minimal implementation**

```ts
const WEIGHTS = {
  brandFit: 0.25,
  scanConfidence: 0.25,
  visualDistinctiveness: 0.15,
  compositionalBalance: 0.15,
  deploymentFlexibility: 0.1,
  enterpriseSafety: 0.1,
} as const;

export function scorePreset(preset: string, criteria: Record<AuditCriterionId, 1|2|3|4|5>): PresetAuditScore {
  const total =
    criteria.brandFit * WEIGHTS.brandFit +
    criteria.scanConfidence * WEIGHTS.scanConfidence +
    criteria.visualDistinctiveness * WEIGHTS.visualDistinctiveness +
    criteria.compositionalBalance * WEIGHTS.compositionalBalance +
    criteria.deploymentFlexibility * WEIGHTS.deploymentFlexibility +
    criteria.enterpriseSafety * WEIGHTS.enterpriseSafety;
  // map risk/tone/recommendation in smallest working way
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/audit/scoring.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/audit/scoring.ts src/audit/scoring.test.ts
git commit -m "feat: add weighted preset scoring engine"
```

### Task 3: Add Risk/Tone Mapping (Soft Guidance, No Bans)

**Files:**
- Modify: `src/audit/scoring.ts`
- Test: `src/audit/scoring.test.ts`

**Step 1: Write the failing test**

```ts
it('maps low score to high risk and expressive tone', () => {
  const result = scorePreset('experimental', {
    brandFit: 2,
    scanConfidence: 2,
    visualDistinctiveness: 5,
    compositionalBalance: 2,
    deploymentFlexibility: 2,
    enterpriseSafety: 1,
  });

  expect(result.risk).toBe('high');
  expect(result.tone).toBe('expressive');
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/audit/scoring.test.ts`  
Expected: FAIL on risk/tone assertions.

**Step 3: Write minimal implementation**

```ts
function toRisk(scanConfidence: number, total: number): RiskLevel {
  if (scanConfidence <= 2 || total < 3) return 'high';
  if (scanConfidence === 3 || total < 4) return 'medium';
  return 'low';
}

function toTone(distinctiveness: number, enterpriseSafety: number): Tone {
  if (distinctiveness >= 4 && enterpriseSafety <= 3) return 'expressive';
  if (distinctiveness <= 2 && enterpriseSafety >= 4) return 'conservative';
  return 'balanced';
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/audit/scoring.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/audit/scoring.ts src/audit/scoring.test.ts
git commit -m "feat: add soft risk and tone mapping for presets"
```

### Task 4: Create Current Preset Expert Audit Data

**Files:**
- Create: `src/audit/current-preset-audit.ts`
- Test: `src/audit/current-preset-audit.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { CURRENT_PRESET_CRITERIA } from './current-preset-audit';

describe('CURRENT_PRESET_CRITERIA', () => {
  it('contains default, telegram, mono', () => {
    expect(Object.keys(CURRENT_PRESET_CRITERIA).sort()).toEqual(['default', 'mono', 'telegram']);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/audit/current-preset-audit.test.ts`  
Expected: FAIL because dataset does not exist.

**Step 3: Write minimal implementation**

```ts
export const CURRENT_PRESET_CRITERIA = {
  default: { brandFit: 4, scanConfidence: 5, visualDistinctiveness: 2, compositionalBalance: 4, deploymentFlexibility: 5, enterpriseSafety: 5 },
  telegram: { brandFit: 4, scanConfidence: 4, visualDistinctiveness: 4, compositionalBalance: 4, deploymentFlexibility: 4, enterpriseSafety: 4 },
  mono: { brandFit: 5, scanConfidence: 5, visualDistinctiveness: 2, compositionalBalance: 4, deploymentFlexibility: 5, enterpriseSafety: 5 },
} as const;
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/audit/current-preset-audit.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/audit/current-preset-audit.ts src/audit/current-preset-audit.test.ts
git commit -m "feat: add expert criteria dataset for current presets"
```

### Task 5: Generate Deterministic Audit Report Markdown

**Files:**
- Create: `src/audit/report.ts`
- Create: `src/audit/generate-report.ts`
- Test: `src/audit/report.test.ts`
- Create: `docs/style-system/preset-audit.md`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { buildPresetAuditReport } from './report';

describe('buildPresetAuditReport', () => {
  it('returns markdown table with score columns', () => {
    const md = buildPresetAuditReport();
    expect(md).toContain('| Preset | Total | Risk | Tone |');
    expect(md).toContain('default');
    expect(md).toContain('telegram');
    expect(md).toContain('mono');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/audit/report.test.ts`  
Expected: FAIL because report builder missing.

**Step 3: Write minimal implementation**

```ts
// report.ts
export function buildPresetAuditReport(): string {
  // score CURRENT_PRESET_CRITERIA via scorePreset(...)
  // produce markdown summary + table
}

// generate-report.ts
import { writeFileSync } from 'node:fs';
import { buildPresetAuditReport } from './report';
writeFileSync('docs/style-system/preset-audit.md', buildPresetAuditReport(), 'utf8');
```

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/audit/report.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/audit/report.ts src/audit/generate-report.ts src/audit/report.test.ts docs/style-system/preset-audit.md
git commit -m "feat: add deterministic markdown report for preset audit"
```

### Task 6: Expose Audit API and Script

**Files:**
- Modify: `src/index.ts`
- Modify: `package.json`
- Test: `src/audit/entrypoint.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { scorePreset } from '../index';

describe('audit exports', () => {
  it('exports scorePreset from package root', () => {
    expect(typeof scorePreset).toBe('function');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/audit/entrypoint.test.ts`  
Expected: FAIL because export/script are missing.

**Step 3: Write minimal implementation**

```ts
// src/index.ts
export { scorePreset } from './audit/scoring';
export { CURRENT_PRESET_CRITERIA } from './audit/current-preset-audit';
export type { PresetAuditScore, AuditCriterionId, RiskLevel, Tone } from './audit/types';
```

Add script in `package.json`:

```json
{
  "scripts": {
    "audit:presets": "tsx src/audit/generate-report.ts"
  }
}
```

(If `tsx` is not installed, add it to devDependencies first.)

**Step 4: Run test to verify it passes**

Run: `pnpm run test src/audit/entrypoint.test.ts`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/index.ts package.json pnpm-lock.yaml src/audit/entrypoint.test.ts
git commit -m "feat: expose audit api and add preset audit script"
```

### Task 7: Final Quality Gate + Documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/style-system/preset-audit.md`

**Step 1: Write the failing test**

Add one integration test:

```ts
it('audit report ranks current presets with stable ordering', () => {
  const md = buildPresetAuditReport();
  expect(md).toContain('## Ranking');
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test src/audit/report.test.ts`  
Expected: FAIL before ranking section implementation.

**Step 3: Write minimal implementation**

- Add ranking section to report builder.
- Add README section:
  - “How to run preset audit”
  - “How to read risk/tone”

**Step 4: Run test to verify it passes**

Run in order:
- `pnpm run test`
- `pnpm run build`
- `pnpm run typecheck`
- `pnpm run check`

Expected: all commands PASS.

**Step 5: Commit**

```bash
git add README.md docs/style-system/preset-audit.md src/audit
git commit -m "docs: add preset audit workflow and ranking output"
```

## Definition of Done

- Current presets are audited by one explicit expert model.
- No style combinations are blocked by code.
- Report includes score, risk, tone, and recommendation per preset.
- Root package exports audit API for tooling/UI use.
- Full quality gate is green.

