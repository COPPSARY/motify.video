import { ResourceLink } from '../models/landing.models';

export const EXTERNAL_LINKS = {
  productHunt: 'https://www.producthunt.com/products/motify',
  productHuntEmbed:
    'https://www.producthunt.com/products/motify?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-motify-2',
  github: 'https://github.com/COPPSARY/Motify',
  docs: 'https://motify.mintlify.app/',
  npm: 'https://www.npmjs.com/package/@coppsary/motify',
  editor: 'https://app.motify.video/',
  contactProfile: 'https://github.com/COPPSARY',
  contactEmail: 'mailto:coppsary@gmail.com',
} as const;

export function motifyEditorUrl(): string {
  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://localhost:5173/';
  }
  return EXTERNAL_LINKS.editor;
}

export const RESOURCE_LINKS: readonly ResourceLink[] = [
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Guides and API reference for Motify.',
    url: EXTERNAL_LINKS.docs,
    icon: 'book',
  },
  {
    id: 'github',
    title: 'GitHub',
    description: 'Source code, issues, and releases.',
    url: EXTERNAL_LINKS.github,
    icon: 'github',
  },
  {
    id: 'productHunt',
    title: 'Product Hunt',
    description: 'Follow the launch and community feedback.',
    url: EXTERNAL_LINKS.productHunt,
    icon: 'rocket',
  },
];
