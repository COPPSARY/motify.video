// Lists the parameterized routes Angular cannot discover on its own, so each
// template's gallery link and customize page is prerendered. Vercel serves only
// files that exist, so a slug left out here is a 404 on a direct visit.
// The slugs come from templates.generated.json (see fetch-templates.mjs).
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const templates = JSON.parse(await readFile(resolve(root, 'src/app/features/templates/templates.generated.json'), 'utf8'));
const slugs = templates.map((template) => template.slug);
if (slugs.length === 0) throw new Error('No template slugs in templates.generated.json; run scripts/fetch-templates.mjs first.');

const routes = slugs.flatMap((slug) => [`/templates/${slug}`, `/templates/customize/${slug}`]);
await writeFile(resolve(root, 'prerender-routes.txt'), `${routes.join('\n')}\n`, 'utf8');
console.log(`prerendering ${slugs.length} template slugs`);
