import { MotionTemplate } from './template-library.data';
import templates from './templates.generated.json';

/**
 * The motion templates, as the backend served them when the site was built
 * (see scripts/fetch-templates.mjs). The types and prompt helpers live in
 * template-library.data.ts.
 */
export const MOTION_TEMPLATES: readonly MotionTemplate[] = templates as readonly MotionTemplate[];

export function getMotionTemplate(slug: string | null | undefined): MotionTemplate | undefined {
  return MOTION_TEMPLATES.find((template) => template.slug === slug);
}
