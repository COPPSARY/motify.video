// Writes the template library as JSON: the seed the backend's motion_templates
// table is filled from, and the brief list the preview renderer generates from.
// Each entry carries the authored fields and segments plus `defaultPrompt`, the
// prompt exactly as the gallery shows it.
//
//   node scripts/export-template-seed.mjs [--out <file>]   (default: stdout)
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Node 22.18+ strips the file's type annotations on import.
const { MOTION_TEMPLATES, renderTemplatePrompt } = await import(
  '../src/app/features/templates/template-library.data.ts'
);

const seed = MOTION_TEMPLATES.map((template, index) => ({
  ...template,
  sortOrder: index,
  defaultPrompt: renderTemplatePrompt(template),
}));
const json = `${JSON.stringify(seed, null, 2)}\n`;

const outIndex = process.argv.indexOf('--out');
if (outIndex >= 0) {
  const out = resolve(process.argv[outIndex + 1]);
  await writeFile(out, json, 'utf8');
  console.error(`wrote ${seed.length} templates to ${out}`);
} else {
  process.stdout.write(json);
}
