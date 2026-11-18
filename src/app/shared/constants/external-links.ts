export const EXTERNAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/motifyai/',
  editor: 'https://app.motify.video/',
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
