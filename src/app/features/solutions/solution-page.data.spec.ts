import { SOLUTION_PAGES } from './solution-page.data';

describe('SOLUTION_PAGES', () => {
  it('defines a unique, indexable landing page for each priority workflow', () => {
    const pages = Object.values(SOLUTION_PAGES);
    const slugs = new Set(pages.map((page) => page.slug));

    expect(pages.length).toBe(4);
    expect(slugs.size).toBe(pages.length);

    for (const page of pages) {
      expect(page.title.length).toBeLessThanOrEqual(60);
      expect(page.description.length).toBeGreaterThanOrEqual(70);
      expect(page.description.length).toBeLessThanOrEqual(160);
      expect(page.benefits.length).toBe(3);
      expect(page.steps.length).toBe(3);
      expect(page.faqs.length).toBe(3);
    }
  });
});
