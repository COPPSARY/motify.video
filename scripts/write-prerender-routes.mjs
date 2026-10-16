// Lists the parameterized routes Angular cannot discover on its own, so each
// template's gallery link and customize page is prerendered. A slug left out here (a
// template added after the build) is served the client-rendered shell instead
// (vercel.json), which loads it from the API.
// The slugs come from templates.generated.json (see fetch-templates.mjs).
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const templates = JSON.parse(await readFile(resolve(root, 'src/app/features/templates/templates.generated.json'), 'utf8'));
const slugs = templates.map((template) => template.slug);
if (slugs.length === 0) {
  // The API was down at build time; /templates still works because the browser loads the list.
  console.warn('No template slugs in templates.generated.json; template links will not be prerendered.');
}

const routes = slugs.flatMap((slug) => [`/templates/${slug}`, `/templates/customize/${slug}`]);
await writeFile(resolve(root, 'prerender-routes.txt'), `${routes.join('\n')}\n`, 'utf8');
console.log(`prerendering ${slugs.length} template slugs`);
