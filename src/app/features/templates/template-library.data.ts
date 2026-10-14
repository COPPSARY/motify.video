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

export interface MotionTemplate {
  readonly slug: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly categories: readonly string[];
  readonly video: string;
  readonly special?: boolean;
  readonly fields: readonly TemplateField[];
  readonly prompt: readonly TemplatePromptSegment[];
}

const field = (
  key: string,
  label: string,
  description: string,
  defaultValue: string,
  placeholder: string,
  type: TemplateFieldType = 'text',
  constraints: Pick<TemplateField, 'min' | 'max' | 'step'> = {},
): TemplateField => ({ key, label, description, defaultValue, placeholder, type, ...constraints });

export const MOTION_TEMPLATES: readonly MotionTemplate[] = [
  {
    slug: 'bookmebus-journey',
    title: 'One Seat, Then the Whole Journey',
    eyebrow: 'BookMeBus',
    description: 'A connected product story where a ticket transforms into an entire journey.',
    categories: ['Product', 'Kinetic type', '2D'],
    video: '/templates/bookmebus-journey.webm',
    fields: [
      field('concept', 'Concept', 'The central idea connecting every scene.', 'One seat, then the whole journey', 'e.g. One tap, then the whole trip'),
      field('typography', 'Typography', 'A Google Font or a few fonts for the model to choose from.', 'Plus Jakarta Sans, Geist or Inter', 'e.g. Plus Jakarta Sans or Geist'),
      field('colors', 'Colors', 'Color names or hex codes.', 'BookMeBus sky blue, navy, orange accent', 'e.g. #45B8E8, navy, orange'),
      field('length', 'Length (seconds)', 'This story works best between 12 and 20 seconds.', '15', '15', 'number', { min: 12, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' },
      { field: 'length' },
      { text: '-second motion design spot for BookMeBus, a Cambodian bus, van, ferry and train booking app. Concept: "' },
      { field: 'concept' },
      { text: '". A ticket becomes a route, becomes a backpack, becomes a destination. Commit to it and name it in one line before you start. Every shot is made out of the previous one: shapes, type and color transform into the next scene instead of cutting or fading. One typeface (a bold geometric sans such as ' },
      { field: 'typography' },
      { text: '), a palette of at most three colors (' },
      { field: 'colors' },
      { text: ') plus black and white, one consistent camera language (flat 2D, soft shadows). Show range: kinetic type ("Pick your seat."), shape morphing (ticket blue to full-screen blue with a bus on a dotted route), a UI moment (backpack with six status pills: Seat confirmed, Boarding point, E-ticket sent, Operator contact, Free Wi-Fi, All set), destination reveals (Kep, Siem Reap, Koh Rong with route labels), and an end title ("You take the seat. We handle the rest."). </direction>\n\n<structure> Open on a single seat-selection tile. The selected seat compresses into a ticket; its edge extends into a dotted route as a bus travels across the frame. The route folds into a backpack and the six status pills lock into place around it. The backpack tag stretches into destination cards for Kep, Siem Reap and Koh Rong. Finish by folding the route back into the BookMeBus end card and the line "You take the seat. We handle the rest." Keep every transition motivated by the object already on screen. </structure>' },
    ],
  },
  {
    slug: 'showreel',
    title: 'Fold & Flight',
    eyebrow: 'Paper Airplane Showreel',
    description: 'A beat-driven showreel where a paper plane carries every transition.',
    categories: ['Showreel', 'Kinetic type', '3D'],
    video: '/templates/fold-and-flight.webm',
    fields: [
      field('concept', 'Concept', 'The central visual idea that connects the video.', 'Travel agency, paper airplane 2D animation', 'e.g. Ink becomes type becomes architecture'),
      field('typography', 'Typography', 'A Google Font or a few fonts for the model to choose from.', 'Geist, Inter or a bold display face from Google Fonts', 'e.g. Geist and a bold display face'),
      field('colors', 'Colors', 'Keep the palette intentionally limited.', 'at most three colors plus black and white', 'e.g. cobalt, cream and vermilion'),
      field('length', 'Length (seconds)', 'A focused showreel works best from 15 to 30 seconds.', '15', '15', 'number', { min: 15, max: 30, step: 1 }),
      field('tempo', 'Tempo (BPM)', 'The beat that guides the animation timing.', '120', '120', 'number', { min: 100, max: 128, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second motion design showreel that proves you are a world-class motion designer. Concept: ' }, { field: 'concept' },
      { text: '. Commit to it and name it in one line before you start. Every shot is made out of the previous one: shapes, type and color transform into the next scene instead of cutting or fading. One typeface (' }, { field: 'typography' },
      { text: '), a palette of ' }, { field: 'colors' },
      { text: ', one consistent camera language. Show range: kinetic type, shape morphing, a 2D-to-3D moment, a data or UI moment, and an end title. Give each one an equal share of the time. Banned: particle bursts, glows, lens flares, camera shake, RGB split, crossfades, generic gradients, bouncy easing, holds longer than half a second, anything that looks like a template. </direction>\n\n<structure> ' },
      { field: 'tempo' },
      { text: ' BPM, something happens on every beat. First bar: hook. Then one technique per bar, each flowing out of the last. Last full bar: the strongest moment. Final half bar: end title, and the final frame matches the first so it loops. </structure>' },
    ],
  },
  {
    slug: 'opus-motion-designer',
    title: 'Opus 5.5 — Motion Designer',
    eyebrow: 'Motion system study',
    description: 'A precise orange-dot motif travels through UI, type, graphs, and shape.',
    categories: ['Showreel', 'Typography', 'UI'],
    video: '/templates/opus-motion-designer.webm',
    fields: [
      field('colors', 'Colors', 'The core canvas, background, and accent palette.', 'warm off-white, near-black, vivid orange', 'e.g. cream, charcoal, electric blue'),
      field('motif', 'Connecting motif', 'The object that travels through every scene.', 'orange dot', 'e.g. cobalt square'),
      field('length', 'Length (seconds)', 'Keep the study tight and energetic.', '15', '15', 'number', { min: 10, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A 2D motion design film in 16:9. Use a ' }, { field: 'colors' },
      { text: ' palette. The ' }, { field: 'motif' },
      { text: ' connects every scene: it starts in the UI, becomes the dot over a letter, traces a spring graph, grows into a shape and returns on the end card. A cursor makes the opening click feel real. Keep the motion sharp and controlled, with small spring overshoots and no dead time. Banned: stock footage, gradients, glows, particle bursts, random transitions and motion that isn\'t connected to an element already on screen. </direction>\n\n<structure> Around ' }, { field: 'length' },
      { text: ' seconds, with a visual change on every major beat. Open: a cursor clicks the orange toggle beside "Reduce Motion". The letters bend and move into place until only "Motion" remains, with the orange dot above the "i". Spring: the dot jumps away from the word and lands on a graph. Its path draws a spring response, overshoots the target and settles beside a "+22%" callout. Shape: the dot shoots across a line, grows into an orange circle and fills the frame. A black rounded square rotates inside it, then stretches into a pill. The scene contracts to a single orange dot on black. Type: words like "SPRINGS", "EASING", "KINETIC TYPE", "3D" and "SOUND" orbit the dot. The circle of type opens out into a field of tiny dots. Reveal: the halftone field expands and flips to black, revealing the final card: "Opus 5.5", "Motion designer." and "0 keyframes". </structure>' },
    ],
  },
  {
    slug: 'paper-moon',
    title: 'Paper Moon',
    eyebrow: 'Animated short',
    description: 'A tiny paper boat chases the moon through an emotional hand-drawn journey.',
    categories: ['Storytelling', '2D', 'Character'],
    video: '/templates/paper-moon.webm',
    fields: [
      field('concept', 'Concept', 'The character, desire, and emotional goal.', 'A tiny paper boat tries to reach the moon', 'e.g. A matchstick searches for the sunrise', 'textarea'),
      field('length', 'Length (seconds)', 'Short-film structure tuned for 12 to 25 seconds.', '15', '15', 'number', { min: 12, max: 25, step: 1 }),
      field('style', 'Visual style', 'Describe the drawing and animation treatment.', 'expressive hand-drawn shapes, unusual compositions, and fluid frame-by-frame animation', 'e.g. cut paper, graphite lines, restrained watercolor', 'textarea'),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second, entirely 2D animated short film. Concept: **' }, { field: 'concept' },
      { text: '.** Tell a complete visual story with no dialogue. The boat sails across a puddle, gets swept into a rushing stream, survives a waterfall, and discovers that the moon it has been chasing is only a reflection. At the final moment, the sun rises, the reflection disappears, and the boat finds itself floating in an endless ocean. Turn the ending into a surprising new beginning. Use ' }, { field: 'style' },
      { text: '. Let the world transform organically as the story progresses. Build emotion through timing, scale, anticipation, and visual contrast rather than decorative effects. Make it feel like a short film from an independent animation studio, not a motion graphics template. Unexpected, charming, cinematic, and visually inventive. Every second must advance the story. End on an unforgettable image.' },
    ],
  },
  {
    slug: 'motify-product-agent',
    title: 'Generate with Tiffy',
    eyebrow: 'Motify product workflow',
    description: 'An agent-first workflow that turns verified product UI into a Motify-ready brief.',
    categories: ['Special', 'Product', 'UI'],
    video: '/templates/motify-generate-with-tiffy.webm',
    special: true,
    fields: [
      field('feature', 'Feature to showcase', 'Tell the coding agent which real workflow to inspect.', 'the primary product-generation workflow', 'e.g. Brand DNA setup or prompt-to-video flow', 'textarea'),
      field('length', 'Length (seconds)', 'The duration of the final product animation.', '12', '12', 'number', { min: 8, max: 20, step: 1 }),
      field('format', 'Format', 'Canvas size and orientation for the resulting brief.', '1080×1080 square', 'e.g. 1920×1080 landscape'),
    ],
    prompt: [
      { text: 'Inspect the actual product codebase and UI. Identify ' }, { field: 'feature' },
      { text: ', understand how users interact with it, and return a complete, production-ready prompt containing both <direction> and <structure> blocks.\n\n1. <direction>\nWrite a concise creative brief for a ' }, { field: 'length' },
      { text: '-second, ' }, { field: 'format' },
      { text: ' product animation at 29.97 fps, mastered at 59.94 fps.\nInclude:\n- Visual style, art direction, palette, typography, and brand identity based on the actual product.\n- A clear visual story following the user\'s journey through the feature.\n- How the most important interactions, interface responses, and final outcome should be animated.\n- Motion language, pacing, camera behavior, and transitions.\n- Creative constraints that prevent generic templates and inaccurate UI.\nThe direction should describe the intended visual experience, not prescribe every scene\'s exact implementation. Make it specific to the product and feature.\n\n2. <structure>\nDocument the actual product UI and user workflow in enough detail for an animation system to recreate it accurately.\nInclude:\n- Product: Name, purpose, and core value proposition.\n- Feature: What it does and why it matters.\n- Entry point: Where the user starts, including navigation paths and relevant controls.\n- Workflow: Numbered user actions, such as clicking buttons, entering text, selecting options, and submitting forms.\n- UI details: Actual labels, component types, dimensions, colors, typography, layout, spacing, and positioning.\n- System responses: What visibly changes after each action, including menus, dialogs, loading states, animations, and results.\n- Final state: What the user achieves and what the interface looks like afterward.\n- Brand identity: Actual logo, brand colors, fonts, and visual conventions.\n\nUse concrete values where they can be verified from the codebase. Use relative positions when exact coordinates are responsive or unavailable. Clearly distinguish verified details from unknowns. Treat the actual codebase as the source of truth. Follow real component implementations, interaction handlers, navigation, and state changes. Select the most visually compelling steps for the animation instead of trying to represent every workflow detail. Keep <direction> focused on storytelling and visual treatment, and <structure> focused on factual product UI and behavior. Make the two blocks consistent. Do not invent features, UI elements, brand claims, or interaction behavior. Do not modify the codebase.\n\nReturn only the two complete blocks, in this exact order:\n<direction> ... </direction>\n<structure> ... </structure>' },
    ],
  },
];

export function getMotionTemplate(slug: string | null | undefined): MotionTemplate | undefined {
  return MOTION_TEMPLATES.find((template) => template.slug === slug);
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
