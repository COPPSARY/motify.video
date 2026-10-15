export interface MotifyRuntimeConfig {
  readonly motifyApiUrl?: string;
  readonly motifyEditorUrl?: string;
}

declare global {
  interface Window {
    __MOTIFY_CONFIG__?: MotifyRuntimeConfig;
  }
}

const LOCAL_EDITOR_URL = 'http://localhost:5173/';
const PRODUCTION_EDITOR_URL = 'https://app.motify.video/';
export const EDITOR_AUTH_PATH = '/login?returnUrl=%2Feditor';

function isLocalBrowser(): boolean {
  return typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
}

export function motifyApiUrl(): string {
  const configured = typeof window === 'undefined'
    ? undefined
    : window.__MOTIFY_CONFIG__?.motifyApiUrl;
  if (!configured?.trim()) {
    throw new Error('MOTIFY_API_URL is missing from the runtime configuration.');
  }
  return trimTrailingSlash(configured.trim());
}

/**
 * `newAccount` marks a visitor who has just created an account, so the app
 * starts its own first-run flow (Brand DNA, then Prompt Templates and a tour).
 */
export function motifyEditorUrl(prompt?: string, options: { readonly newAccount?: boolean } = {}): string {
  const configured = typeof window === 'undefined'
    ? undefined
    : window.__MOTIFY_CONFIG__?.motifyEditorUrl;
  const url = new URL(configured || (isLocalBrowser() ? LOCAL_EDITOR_URL : PRODUCTION_EDITOR_URL));
  const normalizedPrompt = prompt?.trim();
  if (normalizedPrompt) url.searchParams.set('prompt', normalizedPrompt);
  if (options.newAccount) url.searchParams.set('newAccount', '1');
  return url.toString();
}

export function editorReturnPath(prompt?: string): string {
  const url = new URL('/editor', 'https://motify.invalid');
  const normalizedPrompt = prompt?.trim();
  if (normalizedPrompt) url.searchParams.set('prompt', normalizedPrompt);
  return `${url.pathname}${url.search}`;
}

/** The prompt carried in an `/editor?prompt=` return path, if any. */
export function promptFromReturnPath(returnUrl: string): string {
  return new URL(returnUrl, 'https://motify.invalid').searchParams.get('prompt')?.trim() ?? '';
}

export function editorUrlForReturnPath(returnUrl: string, newAccount = false): string {
  const returnPath = new URL(returnUrl, 'https://motify.invalid');
  return motifyEditorUrl(returnPath.searchParams.get('prompt') ?? undefined, { newAccount });
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}
