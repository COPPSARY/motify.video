export type TemplateFieldType = 'text' | 'number' | 'textarea';

export interface TemplateField {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  readonly defaultValue: string;
  readonly placeholder: string;
  readonly type: TemplateFieldType;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
}

export interface TemplatePromptSegment {
  readonly text?: string;
  readonly field?: string;
  readonly before?: string;
  readonly after?: string;
}

/** The canvas the preview was rendered at; the editor supports each of these. */
export type TemplateAspectRatio = '16:9' | '1:1' | '4:5' | '9:16';

export interface MotionTemplate {
  readonly slug: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly categories: readonly string[];
  /** A permanent link to the preview; the API redirects it to the video file. */
  readonly video: string;
  readonly aspectRatio: TemplateAspectRatio;
  readonly special?: boolean;
  readonly fields: readonly TemplateField[];
  readonly prompt: readonly TemplatePromptSegment[];
}

/** The preview's ratio as a CSS `aspect-ratio` value, and whether it is taller than wide. */
export function templateAspect(template: MotionTemplate): { readonly css: string; readonly tall: boolean } {
  const [width, height] = template.aspectRatio.split(':').map(Number);
  return { css: `${width} / ${height}`, tall: height >= width };
}

export function templateDefaults(template: MotionTemplate): Readonly<Record<string, string>> {
  return Object.fromEntries(template.fields.map((item) => [item.key, item.defaultValue]));
}

export function promptSegmentValue(
  template: MotionTemplate,
  segment: TemplatePromptSegment,
  values: Readonly<Record<string, string>>,
): string {
  if (!segment.field) return segment.text ?? '';
  const definition = template.fields.find((item) => item.key === segment.field);
  const value = values[segment.field]?.trim() || definition?.defaultValue || '';
  return `${segment.before ?? ''}${value}${segment.after ?? ''}`;
}

export function renderTemplatePrompt(
  template: MotionTemplate,
  values: Readonly<Record<string, string>> = {},
): string {
  return template.prompt.map((segment) => promptSegmentValue(template, segment, values)).join('');
}
