export const EXTERNAL_LINKS = {
  github: 'https://github.com/COPPSARY/Motify',
  editor: 'https://app.motify.video/',
  contactProfile: 'https://github.com/COPPSARY',
  contactEmail: 'mailto:support@motify.video',
} as const;

export function motifyEditorUrl(): string {
  if (
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ) {
    return 'http://localhost:5173/';
  }
  return EXTERNAL_LINKS.editor;
}
