import {
  editorReturnPath,
  editorUrlForReturnPath,
  motifyApiUrl,
  motifyEditorUrl,
} from './runtime-config';

describe('Motify runtime config', () => {
  afterEach(() => {
    delete window.__MOTIFY_CONFIG__;
  });

  it('uses configured API and editor origins', () => {
    window.__MOTIFY_CONFIG__ = {
      motifyApiUrl: 'https://api.example.test/',
      motifyEditorUrl: 'https://editor.example.test/app',
    };

    expect(motifyApiUrl()).toBe('https://api.example.test');
    expect(motifyEditorUrl()).toBe('https://editor.example.test/app');
  });

  it('fails clearly when the API URL is missing', () => {
    expect(() => motifyApiUrl()).toThrowError(/MOTIFY_API_URL/);
  });

  it('carries Unicode prompts to the editor without changing their content', () => {
    window.__MOTIFY_CONFIG__ = {
      motifyEditorUrl: 'https://editor.example.test/',
    };
    const prompt = 'Create a launch — សួស្តី & crisp typography';

    const target = new URL(motifyEditorUrl(prompt));

    expect(target.searchParams.get('prompt')).toBe(prompt);
  });

  it('preserves a landing page prompt through sign in', () => {
    window.__MOTIFY_CONFIG__ = { motifyEditorUrl: 'https://editor.example.test/' };
    const prompt = 'Launch — សួស្តី & motion';
    const returnPath = editorReturnPath(prompt);

    expect(new URL(returnPath, 'https://motify.invalid').searchParams.get('prompt')).toBe(prompt);
    expect(new URL(editorUrlForReturnPath(returnPath)).searchParams.get('prompt')).toBe(prompt);
  });

  it('rebuilds a safe editor URL after login', () => {
    window.__MOTIFY_CONFIG__ = {
      motifyEditorUrl: 'https://editor.example.test/',
    };

    expect(editorUrlForReturnPath('/editor?prompt=Make%20it%20move')).toBe(
      'https://editor.example.test/?prompt=Make+it+move',
    );
  });

  it('flags a new account for the app only when asked', () => {
    window.__MOTIFY_CONFIG__ = { motifyEditorUrl: 'https://editor.example.test/' };

    const plain = new URL(motifyEditorUrl('Hi'));
    expect([...plain.searchParams.keys()]).toEqual(['prompt']);

    const fresh = new URL(motifyEditorUrl('Hi', { newAccount: true }));
    expect(fresh.searchParams.get('newAccount')).toBe('1');
    expect(fresh.searchParams.get('prompt')).toBe('Hi');
  });

  it('keeps the prompt and flags a new account when returning to the app', () => {
    window.__MOTIFY_CONFIG__ = { motifyEditorUrl: 'https://editor.example.test/' };
    const returnPath = editorReturnPath('Launch & ship');

    const fresh = new URL(editorUrlForReturnPath(returnPath, true));
    expect(fresh.searchParams.get('prompt')).toBe('Launch & ship');
    expect(fresh.searchParams.get('newAccount')).toBe('1');
    expect(new URL(editorUrlForReturnPath(returnPath)).searchParams.has('newAccount')).toBeFalse();
  });
});
