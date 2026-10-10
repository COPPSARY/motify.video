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
    title: 'Motify vs After Effects for Product Videos',
    description:
      'Compare Motify and Adobe After Effects for SaaS launch videos, product explainers, editable motion graphics, workflow speed, and creative control.',
    alternativeName: 'After Effects',
    heading: 'Motify vs After Effects for product videos',
    lead:
      'Both can produce polished motion graphics, but they begin from different assumptions: Motify starts with product context and AI direction, while After Effects starts with a professional motion-design workspace.',
    verdict:
      'Choose Motify when a SaaS team needs to move from brief to editable product story quickly. Choose After Effects when a specialist needs deep compositing, custom effects, plugins, and frame-level production control.',
    chooseMotify: ['You want an AI-generated first direction', 'Product marketers need to revise the story', 'Real UI and brand context drive the video', 'The team wants prompt, canvas, and timeline editing'],
    chooseAlternative: ['A motion designer owns the production', 'The project needs advanced compositing or VFX', 'You depend on an established plugin pipeline', 'Every technical parameter needs manual control'],
    rows: [
      { need: 'Starting point', motify: 'Product brief, site, assets, and a prompt', alternative: 'Blank composition, template, or imported design' },
      { need: 'Primary workflow', motify: 'AI direction plus canvas and timeline refinement', alternative: 'Manual layer, keyframe, effect, and composition work' },
      { need: 'Best fit', motify: 'Repeatable SaaS launch and product-marketing videos', alternative: 'Bespoke motion design, compositing, and visual effects' },
      { need: 'Learning curve', motify: 'Designed for founders and marketing teams', alternative: 'Designed for trained editors and motion designers' },
    ],
    closing:
      'Motify is an easier alternative for recurring product promos, not a claim to replace the full depth of After Effects. Teams can also use both: Motify for fast campaign production and After Effects for exceptional hero work.',
  },
  canva: {
    slug: 'canva',
    title: 'Motify vs Canva AI Video for SaaS Teams',
    description:
      'Compare Motify and Canva AI video for SaaS launches, product demos, templates, brand control, editable motion, and product-marketing workflows.',
    alternativeName: 'Canva',
    heading: 'Motify vs Canva AI video for SaaS teams',
    lead:
      'Canva is a broad visual design platform with approachable templates and general video tools. Motify is a focused AI workflow for software product stories and editable motion graphics.',
    verdict:
      'Choose Motify when the software product, launch narrative, and motion direction are the center of the work. Choose Canva when your team wants a familiar all-purpose design surface for templated social assets and lightweight video assembly.',
    chooseMotify: ['The video must explain a software workflow', 'You want AI to plan a product-marketing story', 'Prompt-based revisions should preserve the project', 'Motion, pacing, and real UI need focused control'],
    chooseAlternative: ['Your team already works from Canva templates', 'The asset is mostly slides, stock media, or social graphics', 'You need a broad visual-content suite', 'Simple drag-and-drop assembly is the priority'],
    rows: [
      { need: 'Core focus', motify: 'SaaS explainers, launches, demos, and motion ads', alternative: 'General design, templates, social content, and video editing' },
      { need: 'AI role', motify: 'Plans and generates a product-led motion direction', alternative: 'Assists broad creation and editing workflows' },
      { need: 'Product context', motify: 'Built around real product UI, positioning, and Brand DNA', alternative: 'Added by the creator inside a general design project' },
      { need: 'Refinement', motify: 'Prompt, canvas, text, scene, and timeline changes', alternative: 'Template and design-surface editing' },
    ],
    closing:
      'The decision is less about which tool can export video and more about where the creative structure comes from. Motify starts from the product story; Canva starts from a general design canvas.',
  },
  synthesia: {
    slug: 'synthesia',
    title: 'Motify vs Synthesia for Product Videos',
    description:
      'Compare Motify and Synthesia for SaaS product videos, explainers, launch stories, AI presenters, editable motion graphics, and brand-led workflows.',
    alternativeName: 'Synthesia',
    heading: 'Motify vs Synthesia for product videos',
    lead:
      'Synthesia is centered on presenter-led business video. Motify is centered on designed product motion, software interfaces, and launch narratives that remain editable.',
    verdict:
      'Choose Motify when the product interface and motion story should lead. Choose Synthesia when an AI presenter, voice delivery, localization, or training-style format is the main communication device.',
    chooseMotify: ['The software UI is the visual proof', 'You need a launch film or motion-led explainer', 'Brand typography and animation should lead', 'The project needs canvas and timeline refinement'],
    chooseAlternative: ['An AI avatar should present the message', 'The format is training or internal communication', 'Presenter-led localization is central', 'Slide-like business video fits the audience'],
    rows: [
      { need: 'Visual center', motify: 'Product UI, typography, shapes, and motion composition', alternative: 'AI presenter, script, voice, and supporting visuals' },
      { need: 'Best fit', motify: 'Product launches, feature stories, explainers, and ads', alternative: 'Training, enablement, internal communication, and presenter videos' },
      { need: 'Editing model', motify: 'Prompt plus canvas and timeline control', alternative: 'Script- and scene-led presenter workflow' },
      { need: 'Product demonstration', motify: 'Designed around product states and visual hierarchy', alternative: 'Typically explained by a presenter with supporting media' },
    ],
    closing:
      'A presenter can create familiarity, while motion-led product storytelling can keep attention on the software itself. Pick the format that provides the strongest proof for the message.',
  },
  'video-agency': {
    slug: 'video-agency',
    title: 'Motify vs a Video Agency for Product Launches',
    description:
      'Compare Motify with hiring a video agency for SaaS product launches, including speed, revision control, creative direction, scale, and flagship production.',
    alternativeName: 'a video agency',
    heading: 'Motify vs hiring a video agency for product launches',
    lead:
      'An AI product-video workflow and a skilled agency solve different production problems. The right choice depends on the importance of the asset, the volume you need, and who should own creative decisions.',
    verdict:
      'Choose Motify for recurring launches, feature announcements, campaign variations, and fast iteration. Hire an agency when a flagship film needs original strategy, bespoke craft, live production, or an experienced team making high-stakes creative decisions.',
    chooseMotify: ['You ship product updates frequently', 'The internal team knows the product story', 'You need multiple formats or campaign variations', 'Fast revision and reusable brand context matter'],
    chooseAlternative: ['The launch film is a major brand investment', 'You need actors, locations, 3D, or live production', 'External creative leadership is valuable', 'Bespoke craft matters more than production volume'],
    rows: [
      { need: 'Brief to first direction', motify: 'Generated from product and brand context', alternative: 'Developed through discovery and creative direction' },
      { need: 'Revision cycle', motify: 'Prompt and direct editor changes by your team', alternative: 'Managed through feedback rounds and production schedules' },
      { need: 'Scale', motify: 'Designed for frequent videos and variations', alternative: 'Best suited to selected, higher-investment productions' },
      { need: 'Production range', motify: 'Web-native motion and product-led video', alternative: 'Can include original filming, 3D, sound, and specialist post-production' },
    ],
    closing:
      'The strongest strategy can be hybrid: reserve agency budget for the rare asset that must be exceptional, and use Motify for the ongoing product content that needs to keep pace with shipping.',
  },
};
