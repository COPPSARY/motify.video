import { PROMPT_TEMPLATES, RESOURCE_CATEGORIES } from './resource-content.data';

describe('resource content', () => {
  it('provides nine scene-directed, editable product marketing prompts', () => {
    expect(PROMPT_TEMPLATES.length).toBe(9);
    expect(PROMPT_TEMPLATES.map((template) => template.id)).toEqual([
      'saas-product-launch',
      'feature-announcement',
      'problem-solution-explainer',
      'kinetic-brand-statement',
      'stats-social-proof',
      'how-it-works',
      'event-webinar-promo',
      'ai-prompt-to-result',
      'visual-product-world-tour',
    ]);

    for (const template of PROMPT_TEMPLATES) {
      expect(template.prompt).toContain('One master GSAP timeline');
      expect(template.prompt).toContain('HTML/CSS/inline SVG only');
      expect(template.prompt).toContain('#camera wrapper per scene');
      expect(template.prompt).toContain('SCENE 1');
      expect(template.prompt).toMatch(/CTA|Sign-off/);
      expect(template.prompt).toContain('ANIMATION QUALITY:');
      expect(template.prompt).toContain('Do not use glitch');
      expect(template.prompt).toContain('[');
      expect(template.prompt).toContain(']');
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
