import { describe, expect, it } from 'vitest';
import { buildPresetAuditReport } from './report';

describe('buildPresetAuditReport', () => {
  it('returns markdown table with score columns', () => {
    const md = buildPresetAuditReport();
    expect(md).toContain('| Preset | Total | Risk | Tone | Recommendation |');
    expect(md).toContain('default');
    expect(md).toContain('telegram');
    expect(md).toContain('mono');
  });
});
