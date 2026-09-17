export interface MotifyRuntimeConfig {
  readonly motifyApiUrl?: string;
  readonly motifyEditorUrl?: string;
}

declare global {
  interface Window {
    __MOTIFY_CONFIG__?: MotifyRuntimeConfig;
  }
}

const LOCAL_API_URL = 'http://localhost:3000';
const PRODUCTION_API_URL = 'https://motify-backend.onrender.com';
const LOCAL_EDITOR_URL = 'http://localhost:5173/';
const PRODUCTION_EDITOR_URL = 'https://app.motify.site/';

function isLocalBrowser(): boolean {
  return typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
}

export function motifyApiUrl(): string {
  const configured = typeof window === 'undefined'
    ? undefined
    : window.__MOTIFY_CONFIG__?.motifyApiUrl;
  return trimTrailingSlash(configured || (isLocalBrowser() ? LOCAL_API_URL : PRODUCTION_API_URL));
}

export function motifyEditorUrl(prompt?: string): string {
  const configured = typeof window === 'undefined'
    ? undefined
    : window.__MOTIFY_CONFIG__?.motifyEditorUrl;
  const url = new URL(configured || (isLocalBrowser() ? LOCAL_EDITOR_URL : PRODUCTION_EDITOR_URL));
  const normalizedPrompt = prompt?.trim();
  if (normalizedPrompt) url.searchParams.set('prompt', normalizedPrompt);
  return url.toString();
}

export function editorUrlForReturnPath(returnUrl: string): string {
  const returnPath = new URL(returnUrl, 'https://motify.invalid');
  return motifyEditorUrl(returnPath.searchParams.get('prompt') ?? undefined);
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}
