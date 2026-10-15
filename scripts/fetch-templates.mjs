// Pulls the motion templates from the backend (GET /v1/prompt-templates) into generated JSON the site
// is built from, so the gallery, the customize pages and the prerendered routes share the backend's
// copy instead of a second one kept here. Writes:
//   templates.generated.json          every template (fields and prompt included)
//   template-previews.generated.json  slug, video and aspect ratio only, for the landing page
//
//   node scripts/fetch-templates.mjs                 production build: fails if the API can't be read
//   node scripts/fetch-templates.mjs --allow-stale   dev and tests: keep an earlier file, or write an empty one
//
// Both files are git-ignored. Video links are rewritten onto MOTIFY_API_URL, the API the build reads from.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, 'src/app/features/templates');
const allowStale = process.argv.includes('--allow-stale');
const values = { ...(await readDotEnv(resolve(root, '.env'))), ...process.env };
const apiUrl = values.MOTIFY_API_URL?.trim().replace(/\/$/, '');
if (!apiUrl) throw new Error('MOTIFY_API_URL must be set in .env or the build environment.');

try {
  const response = await fetch(`${apiUrl}/v1/prompt-templates`, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { data } = await response.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('the API returned no templates');

  const templates = data.map(({ sortOrder: _sortOrder, defaultPrompt: _defaultPrompt, ...template }) => ({
    ...template,
    video: `${apiUrl}/v1/prompt-templates/${template.slug}/video`,
  }));
  const previews = templates.map(({ slug, video, aspectRatio }) => ({ slug, video, aspectRatio }));
  await writeFile(resolve(outDir, 'templates.generated.json'), `${JSON.stringify(templates, null, 2)}\n`, 'utf8');
  await writeFile(resolve(outDir, 'template-previews.generated.json'), `${JSON.stringify(previews, null, 2)}\n`, 'utf8');
  console.log(`fetched ${templates.length} templates`);
} catch (error) {
  if (!allowStale) {
    throw new Error(`Could not read templates: ${error.message}. Start the backend or fix MOTIFY_API_URL.`);
  }
  for (const name of ['templates.generated.json', 'template-previews.generated.json']) {
    const path = resolve(outDir, name);
    const existing = await readFile(path, 'utf8').catch(() => null);
    if (existing === null) await writeFile(path, '[]\n', 'utf8');
  }
  console.warn(`could not read templates (${error.message}); keeping the previous copy`);
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
