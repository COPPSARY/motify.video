import { COMPARISON_PAGES } from './comparison-page.data';

describe('COMPARISON_PAGES', () => {
  it('keeps comparison metadata concise and every comparison substantive', () => {
    const pages = Object.values(COMPARISON_PAGES);
    const slugs = new Set(pages.map((page) => page.slug));

    expect(pages.length).toBe(4);
    expect(slugs.size).toBe(pages.length);

    for (const page of pages) {
      expect(page.title.length).toBeLessThanOrEqual(60);
      expect(page.description.length).toBeGreaterThanOrEqual(70);
      expect(page.description.length).toBeLessThanOrEqual(160);
      expect(page.chooseMotify.length).toBeGreaterThanOrEqual(4);
      expect(page.chooseAlternative.length).toBeGreaterThanOrEqual(4);
      expect(page.rows.length).toBeGreaterThanOrEqual(4);
    }
  });
});
