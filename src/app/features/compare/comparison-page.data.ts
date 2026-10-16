export interface ComparisonRow {
  readonly need: string;
  readonly motify: string;
  readonly alternative: string;
}

export interface ComparisonPage {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly alternativeName: string;
  readonly heading: string;
  readonly lead: string;
  readonly verdict: string;
  readonly chooseMotify: readonly string[];
  readonly chooseAlternative: readonly string[];
  readonly rows: readonly ComparisonRow[];
  readonly closing: string;
}

export const COMPARISON_PAGES: Record<string, ComparisonPage> = {
  'after-effects': {
    slug: 'after-effects',
    title: 'Motify vs After Effects for Motion Graphics',
    description:
      'Compare Motify and Adobe After Effects for animated ads, product animations, explainer videos, workflow speed, and creative control.',
    alternativeName: 'After Effects',
    heading: 'Motify vs After Effects for motion graphics',
    lead:
      'Both can produce polished motion graphics, but they begin from different assumptions: Motify starts with your idea, brand context, and AI direction, while After Effects starts with a professional motion-design workspace.',
    verdict:
      'Choose Motify when a business, marketing team, or agency needs to move from an idea to a finished motion graphic quickly, without learning a timeline. Choose After Effects when a specialist needs deep compositing, custom effects, plugins, and frame-level production control.',
    chooseMotify: ['You want an AI-generated first direction', 'Marketers and clients need to revise the story', 'Your brand and real visuals drive the video', 'Changes should happen by asking, not keyframing'],
    chooseAlternative: ['A motion designer owns the production', 'The project needs advanced compositing or VFX', 'You depend on an established plugin pipeline', 'Every technical parameter needs manual control'],
    rows: [
      { need: 'Starting point', motify: 'An idea, your website, assets, and a prompt', alternative: 'Blank composition, template, or imported design' },
      { need: 'Primary workflow', motify: 'AI direction, then refinement by plain-language prompts', alternative: 'Manual layer, keyframe, effect, and composition work' },
      { need: 'Best fit', motify: 'Animated ads, product animations, explainers, and social content', alternative: 'Bespoke motion design, compositing, and visual effects' },
      { need: 'Learning curve', motify: 'Designed for businesses, marketing teams, and agencies', alternative: 'Designed for trained editors and motion designers' },
    ],
    closing:
      'Motify is an easier alternative for everyday motion graphics, not a claim to replace the full depth of After Effects. Teams can also use both: Motify for fast campaign production and After Effects for exceptional hero work.',
  },
  canva: {
    slug: 'canva',
    title: 'Motify vs Canva AI Video for Motion Graphics',
    description:
      'Compare Motify and Canva AI video for animated ads, product animations, explainers, templates, brand control, and motion.',
    alternativeName: 'Canva',
    heading: 'Motify vs Canva AI video for motion graphics',
    lead:
      'Canva is a broad visual design platform with approachable templates and general video tools. Motify is a focused AI workflow for motion graphics you refine by chatting.',
    verdict:
      'Choose Motify when the motion itself—the story, pacing, and animation—is the center of the work. Choose Canva when your team wants a familiar all-purpose design surface for templated social assets and lightweight video assembly.',
    chooseMotify: ['The piece should be animated, not assembled from slides', 'You want AI to plan the story and the motion', 'Revisions by chat should preserve the project', 'Motion, pacing, and your real visuals need focused control'],
    chooseAlternative: ['Your team already works from Canva templates', 'The asset is mostly slides, stock media, or social graphics', 'You need a broad visual-content suite', 'Simple drag-and-drop assembly is the priority'],
    rows: [
      { need: 'Core focus', motify: 'Animated ads, product animations, explainers, and motion social content', alternative: 'General design, templates, social content, and video editing' },
      { need: 'AI role', motify: 'Plans and generates a complete motion direction', alternative: 'Assists broad creation and editing workflows' },
      { need: 'Brand context', motify: 'Built around your visuals, message, and Brand DNA', alternative: 'Added by the creator inside a general design project' },
      { need: 'Refinement', motify: 'Plain-language changes to copy, scenes, pacing, and music', alternative: 'Template and design-surface editing' },
    ],
    closing:
      'The decision is less about which tool can export video and more about where the creative structure comes from. Motify starts from the story and the motion; Canva starts from a general design canvas.',
  },
  synthesia: {
    slug: 'synthesia',
    title: 'Motify vs Synthesia for Product Videos',
    description:
      'Compare Motify and Synthesia for product videos, explainers, launch stories, AI presenters, motion graphics, and brand-led workflows.',
    alternativeName: 'Synthesia',
    heading: 'Motify vs Synthesia for product videos',
    lead:
      'Synthesia is centered on presenter-led business video. Motify is centered on designed product motion, software interfaces, and launch narratives you can keep refining.',
    verdict:
      'Choose Motify when the product interface and motion story should lead. Choose Synthesia when an AI presenter, voice delivery, localization, or training-style format is the main communication device.',
    chooseMotify: ['The software UI is the visual proof', 'You need a launch film or motion-led explainer', 'Brand typography and animation should lead', 'Revisions should be as easy as describing them'],
    chooseAlternative: ['An AI avatar should present the message', 'The format is training or internal communication', 'Presenter-led localization is central', 'Slide-like business video fits the audience'],
    rows: [
      { need: 'Visual center', motify: 'Product UI, typography, shapes, and motion composition', alternative: 'AI presenter, script, voice, and supporting visuals' },
      { need: 'Best fit', motify: 'Product launches, feature stories, explainers, and ads', alternative: 'Training, enablement, internal communication, and presenter videos' },
      { need: 'Revision model', motify: 'Prompt-driven revisions on the same project', alternative: 'Script- and scene-led presenter workflow' },
      { need: 'Product demonstration', motify: 'Designed around product states and visual hierarchy', alternative: 'Typically explained by a presenter with supporting media' },
    ],
    closing:
      'A presenter can create familiarity, while motion-led product storytelling can keep attention on the software itself. Pick the format that provides the strongest proof for the message.',
  },
};
