import {
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

  it('carries Unicode prompts to the editor without changing their content', () => {
    window.__MOTIFY_CONFIG__ = {
      motifyEditorUrl: 'https://editor.example.test/',
    };
    const prompt = 'Create a launch — សួស្តី & crisp typography';

    const target = new URL(motifyEditorUrl(prompt));

    expect(target.searchParams.get('prompt')).toBe(prompt);
  });

  it('rebuilds a safe editor URL after login', () => {
    window.__MOTIFY_CONFIG__ = {
      motifyEditorUrl: 'https://editor.example.test/',
    };

    expect(editorUrlForReturnPath('/editor?prompt=Make%20it%20move')).toBe(
      'https://editor.example.test/?prompt=Make+it+move',
    );
  });
});
