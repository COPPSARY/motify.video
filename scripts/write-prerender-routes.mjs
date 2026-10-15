// Lists the parameterized routes Angular cannot discover on its own, so each
// template's gallery link and customize page is prerendered. Vercel serves only
// files that exist, so a slug left out here is a 404 on a direct visit.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const library = await readFile(resolve(root, 'src/app/features/templates/template-library.data.ts'), 'utf8');
const slugs = [...library.matchAll(/^ {4}slug: '([a-z0-9-]+)',$/gm)].map((match) => match[1]);
if (slugs.length === 0) throw new Error('No template slugs found in template-library.data.ts.');

const routes = slugs.flatMap((slug) => [`/templates/${slug}`, `/templates/customize/${slug}`]);
await writeFile(resolve(root, 'prerender-routes.txt'), `${routes.join('\n')}\n`, 'utf8');
console.log(`prerendering ${slugs.length} template slugs`);
