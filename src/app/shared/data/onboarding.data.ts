import { extractPromptFields, populatePrompt, type PromptField } from '../utils/prompt-fields';
import { PROMPT_TEMPLATES, type PromptTemplate } from './resource-content.data';

/**
 * /welcome for new accounts: who they are, what they're making, what the
 * product is, then their first prompt, built from a prompt template. Nothing
 * here is stored except the brand answers, which go to Brand DNA.
 */
export type PromptLevel = 'beginner' | 'experienced' | 'expert';

export type OnboardingGoal = 'launch' | 'feature' | 'social-ad' | 'explainer';

export interface OnboardingOption<T extends string> {
  readonly id: T;
  readonly label: string;
  readonly description: string;
}

/** A still from the landing page showcase, shown on the goal's tile. */
export interface GoalPreview {
  readonly poster: string;
}

export interface GoalOption extends OnboardingOption<OnboardingGoal> {
  readonly preview: GoalPreview;
}

export interface GoalDetails {
  /** The prompt template this goal starts from. */
  readonly templateId: string;
  /** The film's beats, for people who'd rather not read a prompt. */
  readonly beats: readonly string[];
  /** Blanks worth asking an experienced prompter; the rest are filled automatically. */
  readonly keyBlanks: readonly string[];
}

/** The answers that fill a template's common blanks. */
export interface ProductAnswers {
  readonly name: string;
  readonly description: string;
  readonly audience: string;
  readonly color: string;
  readonly website: string;
}

export const PROMPT_LEVELS: readonly OnboardingOption<PromptLevel>[] = [
  { id: 'beginner', label: 'Beginner', description: 'New to AI prompts' },
  { id: 'experienced', label: 'Experienced', description: "I've written a few" },
  { id: 'expert', label: 'Expert', description: 'I write detailed prompts' },
];

export const ONBOARDING_GOALS: readonly GoalOption[] = [
  {
    id: 'launch',
    label: 'Product launch',
    description: 'Introduce your product',
    preview: { poster: 'assets/showcase/posters/motify-60fps.jpg' },
  },
  {
    id: 'feature',
    label: 'Feature update',
    description: 'Show one new thing',
    preview: { poster: 'assets/showcase/posters/motify-brand-dna.jpg' },
  },
  {
    id: 'social-ad',
    label: 'Social ad',
    description: 'A short, bold clip',
    preview: { poster: 'assets/showcase/posters/bookmebus.jpg' },
  },
  {
    id: 'explainer',
    label: 'Explainer',
    description: 'How it works, step by step',
    preview: { poster: 'assets/showcase/posters/kiritts.jpg' },
  },
];

export const GOAL_DETAILS: Readonly<Record<OnboardingGoal, GoalDetails>> = {
  launch: {
    templateId: 'saas-product-launch',
    beats: ['Hook', 'Problem', 'Your product', 'Three features', 'Call to action'],
    keyBlanks: ['HOOK LINE', 'PROBLEM STATEMENT', 'CTA TEXT'],
  },
  feature: {
    templateId: 'feature-announcement',
    beats: ['The new feature', 'It in action', 'Before and after', 'Call to action'],
    keyBlanks: ['FEATURE NAME', 'RESULT', 'CTA TEXT'],
  },
  'social-ad': {
    templateId: 'kinetic-brand-statement',
    beats: ['Bold opening line', 'Contrast', 'Your belief', 'Logo and tagline'],
    keyBlanks: ['CORE BELIEF OR MISSION STATEMENT', 'TAGLINE'],
  },
  explainer: {
    templateId: 'how-it-works',
    beats: ['The promise', 'Step one', 'Step two', 'Step three', 'Call to action'],
    keyBlanks: ['STEP 1 TITLE', 'STEP 2 TITLE', 'STEP 3 TITLE', 'CTA TEXT'],
  },
};

/** Which answer fills which blank, across every template. */
const ANSWER_BLANKS: Readonly<Record<keyof ProductAnswers, readonly string[]>> = {
  name: ['PRODUCT NAME', 'COMPANY NAME'],
  description: ['ONE-LINE DESCRIPTION', 'WHAT IT DOES IN ONE SENTENCE', 'CORE BENEFIT', 'PLATFORM PROMISE'],
  audience: ['TARGET AUDIENCE', 'AUDIENCE'],
  color: ['BRAND COLOR HEX'],
  website: ['WEBSITE URL', 'REGISTRATION URL'],
};

export function templateFor(goal: OnboardingGoal): PromptTemplate {
  const template = PROMPT_TEMPLATES.find((item) => item.id === GOAL_DETAILS[goal].templateId);
  if (!template) throw new Error(`Missing prompt template for ${goal}`);
  return template;
}

/** The blanks an experienced prompter is asked to fill, in the order the template uses them. */
export function keyBlanksFor(goal: OnboardingGoal): readonly PromptField[] {
  const wanted = GOAL_DETAILS[goal].keyBlanks;
  return extractPromptFields(templateFor(goal).prompt).filter((field) => wanted.includes(field.key));
}

/**
 * Fills a template: product answers where they fit, the template's own
 * defaults (font, format), the person's extra answers, and hands every
 * remaining blank to Tiffy as "your pick" rather than leaving brackets.
 */
export function buildPrompt(
  template: PromptTemplate,
  answers: ProductAnswers,
  extras: Readonly<Record<string, string>> = {},
): string {
  const fields = extractPromptFields(template.prompt);
  const values: Record<string, string> = {};
  for (const [answer, blanks] of Object.entries(ANSWER_BLANKS) as [keyof ProductAnswers, readonly string[]][]) {
    const value = answer === 'website' ? displayHost(answers.website) : answers[answer].trim();
    if (value) for (const blank of blanks) values[blank] = value;
  }
  for (const field of fields) {
    const extra = extras[field.key]?.trim();
    if (extra) values[field.key] = extra;
    else if (!values[field.key]) values[field.key] = defaultFor(field);
  }
  return populatePrompt(template.prompt, fields, values);
}

/** `default Inter` hints and the format hint become the value; anything else is Tiffy's call. */
function defaultFor(field: PromptField): string {
  if (field.hint.startsWith('default ')) return field.hint.slice('default '.length);
  if (field.key === 'FORMAT' && field.hint) return field.hint;
  return `(your pick: ${field.label.toLowerCase()})`;
}

function displayHost(website: string): string {
  try {
    return website ? new URL(website).hostname.replace(/^www\./, '') : '';
  } catch {
    return '';
  }
}
