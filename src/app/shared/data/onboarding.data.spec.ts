import { extractPromptFields } from '../utils/prompt-fields';
import { buildPrompt, GOAL_DETAILS, keyBlanksFor, ONBOARDING_GOALS, templateFor, type ProductAnswers } from './onboarding.data';

const acme: ProductAnswers = {
  name: 'Acme',
  description: 'Turns release notes into launch videos',
  audience: 'Product marketers',
  color: '#ff5a1f',
  website: 'https://www.acme.com/',
};

describe('onboarding data', () => {
  it('maps every goal to a real prompt template and real key blanks', () => {
    for (const goal of ONBOARDING_GOALS) {
      const template = templateFor(goal.id);
      const labels = extractPromptFields(template.prompt).map((field) => field.key);
      for (const blank of GOAL_DETAILS[goal.id].keyBlanks) {
        expect(labels).withContext(`${goal.id} → ${blank}`).toContain(blank);
      }
      expect(keyBlanksFor(goal.id).length).toBe(GOAL_DETAILS[goal.id].keyBlanks.length);
    }
  });

  it('fills product answers into the template and leaves no raw blanks behind', () => {
    for (const goal of ONBOARDING_GOALS) {
      const prompt = buildPrompt(templateFor(goal.id), acme);
      expect(prompt).withContext(goal.id).toContain('Acme');
      expect(prompt).withContext(goal.id).toContain('#ff5a1f');
      expect(extractPromptFields(prompt).filter((field) => !field.label.startsWith('(')))
        .withContext(`${goal.id} still has blanks`).toEqual([]);
    }
  });

  it('uses template defaults, the website host, and hands the rest to Tiffy', () => {
    const prompt = buildPrompt(templateFor('launch'), acme, { 'HOOK LINE': 'Ship it today' });
    expect(prompt).toContain('Ship it today');
    expect(prompt).toContain('Inter');
    expect(prompt).toContain('acme.com');
    expect(prompt).not.toContain('www.acme.com');
    expect(prompt).toContain('(your pick: key word)');
  });

  it('never starts a beginner from a template that would invent quotes or stats', () => {
    for (const goal of ONBOARDING_GOALS) {
      expect(GOAL_DETAILS[goal.id].templateId).not.toBe('stats-social-proof');
      expect(GOAL_DETAILS[goal.id].templateId).not.toBe('problem-solution-explainer');
    }
  });
});
