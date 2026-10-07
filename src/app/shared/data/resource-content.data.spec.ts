import { PROMPT_TEMPLATES, RESOURCE_CATEGORIES } from './resource-content.data';

describe('resource content', () => {
  it('provides twelve structured, editable product marketing prompts', () => {
    expect(PROMPT_TEMPLATES.length).toBe(12);

    for (const template of PROMPT_TEMPLATES) {
      expect(template.prompt).toContain('Goal:');
      expect(template.prompt).toContain('Target audience:');
      expect(template.prompt).toContain('Product context:');
      expect(template.prompt).toContain('Customer problem:');
      expect(template.prompt).toContain('Key proof points:');
      expect(template.prompt).toContain('Tone and style:');
      expect(template.prompt).toContain('Call to action:');
      expect(template.prompt).toContain('Output format:');
    }
  });

  it('labels directional workflows as concepts rather than current capabilities', () => {
    const playbooks = RESOURCE_CATEGORIES.find((category) => category.id === 'playbooks');
    const conceptGuides = playbooks?.entries.filter((entry) => entry.label === 'Concept guide') ?? [];

    expect(conceptGuides.map((entry) => entry.title)).toEqual([
      'Turn one update into multiple assets',
      'Review and approval for marketing teams',
    ]);
  });
});
