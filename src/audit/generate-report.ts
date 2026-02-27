import { mkdirSync, writeFileSync } from 'node:fs';
import { buildPresetAuditReport } from './report';

const outputDir = 'docs/style-system';
const outputFile = `${outputDir}/preset-audit.md`;

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, buildPresetAuditReport(), 'utf8');
console.log(`Preset audit report written to ${outputFile}`);
