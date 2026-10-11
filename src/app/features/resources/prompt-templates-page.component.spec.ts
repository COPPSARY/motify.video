import { extractPromptFields, populatePrompt } from './prompt-templates-page.component';

describe('prompt template fields', () => {
  it('extracts unique variables while preserving nested guidance', () => {
    const fields = extractPromptFields(
      'For [PRODUCT NAME], write [INTRO LINE: e.g. [GOAL] in three steps]. Repeat [PRODUCT NAME].',
    );

    expect(fields).toEqual([
      {
        key: 'PRODUCT NAME',
        token: '[PRODUCT NAME]',
        tokens: ['[PRODUCT NAME]'],
        label: 'PRODUCT NAME',
        hint: 'Enter product name',
      },
      {
        key: 'INTRO LINE',
        token: '[INTRO LINE: e.g. [GOAL] in three steps]',
        tokens: ['[INTRO LINE: e.g. [GOAL] in three steps]'],
        label: 'INTRO LINE',
        hint: 'e.g. [GOAL] in three steps',
      },
    ]);
  });

  it('replaces every matching variable and leaves blank variables editable', () => {
    const prompt = '[PRODUCT NAME] by [COMPANY NAME]. Try [PRODUCT NAME].';
    const fields = extractPromptFields(prompt);

    expect(
      populatePrompt(prompt, fields, {
        'PRODUCT NAME': 'Motify',
        'COMPANY NAME': '   ',
      }),
    ).toBe('Motify by [COMPANY NAME]. Try Motify.');
  });

  it('uses one value for annotated and plain versions of the same variable', () => {
    const prompt = '[EVENT TYPE: webinar / conference] starts now. Join the [EVENT TYPE].';
    const fields = extractPromptFields(prompt);

    expect(fields).toHaveSize(1);
    expect(populatePrompt(prompt, fields, { 'EVENT TYPE': 'webinar' })).toBe(
      'webinar starts now. Join the webinar.',
    );
  });
});
