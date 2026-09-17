import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const development = process.argv.includes('--development');
const values = { ...(await readDotEnv(resolve(root, '.env'))), ...process.env };
const config = {
  motifyApiUrl: values.MOTIFY_API_URL || (development ? 'http://localhost:3000' : 'https://motify-backend.onrender.com'),
  motifyEditorUrl: values.MOTIFY_EDITOR_URL || (development ? 'http://localhost:5173/' : 'https://app.motify.video/'),
};

await writeFile(
  resolve(root, 'public', 'motify-config.js'),
  `window.__MOTIFY_CONFIG__ = ${JSON.stringify(config)};\n`,
  'utf8',
);

async function readDotEnv(path) {
  try {
    const text = await readFile(path, 'utf8');
    return Object.fromEntries(text.split(/\r?\n/).flatMap((line) => {
      const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
      if (!match || match[2].startsWith('#')) return [];
      const value = match[2].replace(/^(['"])(.*)\1$/, '$2');
      return [[match[1], value]];
    }));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
}
