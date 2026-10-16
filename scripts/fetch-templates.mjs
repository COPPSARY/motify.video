// Pulls the motion templates from the backend (GET /v1/prompt-templates) into generated JSON the site
// is built from, so the gallery, the customize pages and the prerendered routes share the backend's
// copy instead of a second one kept here. Writes:
//   templates.generated.json          every template (fields and prompt included)
//   template-previews.generated.json  slug, video and aspect ratio only, for the landing page
//
// When the API can't be read, an earlier copy is kept (or an empty one written) and the gallery asks the
// API from the browser instead, so a backend outage never fails the deploy.
//
//   node scripts/fetch-templates.mjs                 production build: a prompt that doesn't render to its
//                                                    defaultPrompt fails the build
//   node scripts/fetch-templates.mjs --allow-stale   dev and tests: that mismatch is only a warning
//
// Both files are git-ignored. `video` is kept exactly as the API returns it: a permanent link the API
// streams itself, safe to bake into prerendered pages.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, 'src/app/features/templates');
const allowStale = process.argv.includes('--allow-stale');
const values = { ...(await readDotEnv(resolve(root, '.env'))), ...process.env };
const apiUrl = values.MOTIFY_API_URL?.trim().replace(/\/$/, '');
if (!apiUrl) throw new Error('MOTIFY_API_URL must be set in .env or the build environment.');

/** Bad data, not an outage, so it is not covered by the keep-the-previous-copy fallback. */
class PromptMismatchError extends Error {}

try {
  const response = await fetch(`${apiUrl}/v1/prompt-templates`, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { data } = await response.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('the API returned no templates');

  const mismatched = data.filter((template) => renderPrompt(template) !== template.defaultPrompt);
  if (mismatched.length > 0) {
    const message = `prompt segments don't render to defaultPrompt for: ${mismatched.map((template) => template.slug).join(', ')}`;
    if (!allowStale) throw new PromptMismatchError(message);
    console.warn(message);
  }

  const templates = data.map(({ sortOrder: _sortOrder, defaultPrompt: _defaultPrompt, ...template }) => template);
  const previews = templates.map(({ slug, video, aspectRatio }) => ({ slug, video, aspectRatio }));
  await writeFile(resolve(outDir, 'templates.generated.json'), `${JSON.stringify(templates, null, 2)}\n`, 'utf8');
  await writeFile(resolve(outDir, 'template-previews.generated.json'), `${JSON.stringify(previews, null, 2)}\n`, 'utf8');
  console.log(`fetched ${templates.length} templates`);
} catch (error) {
  if (error instanceof PromptMismatchError) throw error;
  for (const name of ['templates.generated.json', 'template-previews.generated.json']) {
    const path = resolve(outDir, name);
    const existing = await readFile(path, 'utf8').catch(() => null);
    if (existing === null) await writeFile(path, '[]\n', 'utf8');
  }
  console.warn(`could not read templates (${error.message}); keeping the previous copy, the gallery loads them in the browser`);
}

/** The prompt with every field at its default, as the site renders it (renderTemplatePrompt). */
function renderPrompt(template) {
  return template.prompt.map((segment) => {
    if (!segment.field) return segment.text ?? '';
    const field = template.fields.find((item) => item.key === segment.field);
    return `${segment.before ?? ''}${field?.defaultValue ?? ''}${segment.after ?? ''}`;
  }).join('');
}

async function readDotEnv(path) {
  try {
    const text = await readFile(path, 'utf8');
    return Object.fromEntries(text.split(/\r?\n/).flatMap((line) => {
      const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
      if (!match || match[2].startsWith('#')) return [];
      return [[match[1], match[2].replace(/^(['"])(.*)\1$/, '$2')]];
    }));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
}
