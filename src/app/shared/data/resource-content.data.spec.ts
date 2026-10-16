import { RESOURCE_CATEGORIES } from './resource-content.data';

describe('resource content', () => {
  it('numbers the categories in order with no gaps', () => {
    expect(RESOURCE_CATEGORIES.map((category) => category.number)).toEqual(['01', '02', '03', '04']);
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
