import {
  MOTION_TEMPLATES,
  getMotionTemplate,
  renderTemplatePrompt,
  templateAspect,
  templateDefaults,
} from './template-library.data';

describe('motion template library', () => {
  it('uses unique slugs and defines every prompt field', () => {
    expect(new Set(MOTION_TEMPLATES.map((template) => template.slug)).size).toBe(MOTION_TEMPLATES.length);

    for (const template of MOTION_TEMPLATES) {
      const keys = new Set(template.fields.map((field) => field.key));
      for (const segment of template.prompt) {
        if (segment.field) expect(keys.has(segment.field)).withContext(template.slug).toBeTrue();
      }
    }
  });

  it('names a preview per slug and covers several aspect ratios', () => {
    for (const template of MOTION_TEMPLATES) {
      expect(template.video).withContext(template.slug).toMatch(/^\/templates\/[a-z0-9-]+\.webm$/);
    }
    expect(new Set(MOTION_TEMPLATES.map((template) => template.video)).size).toBe(MOTION_TEMPLATES.length);
    expect(new Set(MOTION_TEMPLATES.map((template) => template.aspectRatio)).size).toBeGreaterThanOrEqual(4);
  });

  it('turns an aspect ratio into CSS and flags tall previews', () => {
    expect(templateAspect(getMotionTemplate('kept-every-coin')!)).toEqual({ css: '9 / 16', tall: true });
    expect(templateAspect(getMotionTemplate('fold-space')!)).toEqual({ css: '1 / 1', tall: true });
    expect(templateAspect(getMotionTemplate('order-to-doorstep')!)).toEqual({ css: '16 / 9', tall: false });
  });

  it('falls back to defaults for blank custom values', () => {
    const template = getMotionTemplate('showreel')!;
    const original = renderTemplatePrompt(template, templateDefaults(template));
    const withBlankConcept = renderTemplatePrompt(template, { ...templateDefaults(template), concept: '  ' });
    expect(withBlankConcept).toBe(original);
  });

  it('renders custom values into the final plain-text prompt', () => {
    const template = getMotionTemplate('paper-moon')!;
    const result = renderTemplatePrompt(template, { concept: 'A small kite searches for the wind' });
    expect(result).toContain('A small kite searches for the wind');
    expect(result).not.toContain('undefined');
  });
});
