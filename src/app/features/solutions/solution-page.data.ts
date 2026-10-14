export interface SolutionStep {
  readonly number: string;
  readonly title: string;
  readonly body: string;
}

export interface SolutionFaq {
  readonly question: string;
  readonly answer: string;
}

export interface SolutionPage {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly lead: string;
  readonly promise: string;
  readonly outcome: string;
  readonly benefits: readonly {
    readonly title: string;
    readonly body: string;
  }[];
  readonly steps: readonly SolutionStep[];
  readonly bestFor: readonly string[];
  readonly notFor: string;
  readonly faqs: readonly SolutionFaq[];
}

export const SOLUTION_PAGES: Record<string, SolutionPage> = {
  'saas-launch': {
    slug: 'ai-saas-launch-video-generator',
    title: 'AI SaaS Launch Video Generator | Motify',
    description:
      'Create SaaS launch videos from a product brief, website, and real UI assets. Refine the story, pacing, and brand by prompting, then export.',
    eyebrow: 'AI video for SaaS launches',
    heading: 'AI SaaS launch video generator',
    lead:
      'Turn a product update, launch brief, or website into a polished video direction built around your real software—not generic stock footage.',
    promise:
      'Motify plans the story and generates the motion composition. When launch feedback arrives, ask Tiffy for the change and keep the same project instead of starting over.',
    outcome: 'A launch-ready story your product, marketing, and brand teams can refine together.',
    benefits: [
      {
        title: 'Start with product context',
        body: 'Paste a product link or describe the launch, audience, value proposition, proof points, and call to action in plain language.',
      },
      {
        title: 'Show the actual product',
        body: 'Build scenes around screenshots, interface states, logos, colors, typography, and the product details your audience needs to understand.',
      },
      {
        title: 'Revise without rebuilding',
        body: 'Ask for changes to the hook, copy, pacing, music, or visual direction in plain language, and the same video updates.',
      },
    ],
    steps: [
      { number: '01', title: 'Describe the launch', body: 'Give Motify the product, audience, launch moment, and one action the viewer should take.' },
      { number: '02', title: 'Review the direction', body: 'Inspect the planned story, scenes, product emphasis, and visual hierarchy before the final cut.' },
      { number: '03', title: 'Refine and export', body: 'Ask Tiffy to adjust messaging and motion, apply Brand DNA, and export the format your launch channel needs.' },
    ],
    bestFor: ['Product launches', 'Feature announcements', 'Product Hunt videos', 'Homepage hero videos', 'Paid launch campaigns'],
    notFor:
      'Motify is designed for product-led motion and software stories. A live-action campaign with actors, locations, or complex visual effects may still need a production studio.',
    faqs: [
      {
        question: 'Can Motify create a SaaS launch video from a website?',
        answer: 'Yes. You can provide a product link and a launch brief, then add screenshots or other assets when the video needs to show specific interface states.',
      },
      {
        question: 'Can I change the generated launch video?',
        answer: 'Yes. Describe what should change, such as the headline, a scene, the pacing, or the music, and Tiffy revises the same project instead of handing you a fixed render.',
      },
      {
        question: 'Does the launch video stay on brand?',
        answer: 'Motify uses your Brand DNA—including logo, colors, typefaces, voice, visual style, and audience context—to guide the composition.',
      },
    ],
  },
  'motion-graphics': {
    slug: 'ai-motion-graphics-generator',
    title: 'AI Motion Graphics Generator | Motify',
    description:
      'Generate motion graphics from a prompt. Direct scenes, copy, and pacing in plain language, refine by chatting, and export a polished video.',
    eyebrow: 'Prompt to polished motion',
    heading: 'AI motion graphics generator',
    lead:
      'Describe the message you need to communicate and get a structured motion composition with typography, shapes, product visuals, and intentional pacing.',
    promise:
      'Unlike a one-shot video model, Motify keeps the composition structured, so a follow-up prompt can change one headline, one scene, or the whole story.',
    outcome: 'Motion graphics that remain useful after the first generation.',
    benefits: [
      {
        title: 'Generate a complete direction',
        body: 'Move from a short brief to an organized sequence with a hook, visual hierarchy, transitions, supporting motion, and a clear ending.',
      },
      {
        title: 'Refine any scene by asking',
        body: 'Ask for new copy, a different layout, faster pacing, or a reordered story, and Motify updates the composition instead of starting from scratch.',
      },
      {
        title: 'Make motion fit the message',
        body: 'Use restrained motion for product clarity, energetic pacing for campaigns, or brand-led typography for announcements and social content.',
      },
    ],
    steps: [
      { number: '01', title: 'Write the brief', body: 'Describe the goal, audience, format, brand, message, and motion style in normal language.' },
      { number: '02', title: 'Generate the composition', body: 'Motify plans and creates the scenes, then checks the result for creative and technical problems.' },
      { number: '03', title: 'Direct the details', body: 'Ask for broad revisions or small, specific changes in plain language, then preview and export.' },
    ],
    bestFor: ['SaaS explainers', 'UI animations', 'Motion ads', 'Feature announcements', 'Kinetic typography'],
    notFor:
      'Motify focuses on designed, brand-controlled motion graphics. It is not intended to replace a photorealistic text-to-video model for cinematic live-action scenes.',
    faqs: [
      {
        question: 'What can the AI motion graphics generator create?',
        answer: 'It can create product explainers, launch videos, UI-led demos, motion ads, feature announcements, brand stories, and short social videos.',
      },
      {
        question: 'Can I change a single element after generation?',
        answer: 'Yes. The project stays structured, so you can ask for a specific change, like a new headline, a different color, or a slower reveal, without regenerating everything.',
      },
      {
        question: 'Do I need motion-design experience?',
        answer: 'No. Start in plain language or from a prompt template. Every refinement is a conversation, so there is no timeline or keyframe tool to learn.',
      },
    ],
  },
  'software-product': {
    slug: 'software-product-video-generator',
    title: 'AI Product Video Generator for SaaS | Motify',
    description:
      'Create software product videos, demos, explainers, and ads with AI. Use your real UI and brand, then refine every scene before exporting the final cut.',
    eyebrow: 'Product videos for software teams',
    heading: 'AI product video generator for SaaS',
    lead:
      'Create product videos that explain what your software does, why it matters, and what a viewer should do next—without turning the interface into generic AI imagery.',
    promise:
      'Motify combines product context, marketing structure, real interface assets, and prompt-driven revisions so your video stays accurate as the message evolves.',
    outcome: 'A clear product story built for software—not an ecommerce photo montage.',
    benefits: [
      {
        title: 'Explain one valuable workflow',
        body: 'Focus the video on a customer problem and the product behavior that solves it instead of listing every feature in the release notes.',
      },
      {
        title: 'Protect product accuracy',
        body: 'Use real screenshots and product assets so buttons, labels, states, and visual proof remain recognizable to prospects and customers.',
      },
      {
        title: 'Create campaign variations',
        body: 'Adapt the same product story for a landing page, feature announcement, paid ad, social post, or wider demo without rebuilding the creative system.',
      },
    ],
    steps: [
      { number: '01', title: 'Choose the product moment', body: 'Select one problem, workflow, feature, or launch promise the audience should remember.' },
      { number: '02', title: 'Add proof and brand context', body: 'Provide the site, interface assets, proof points, visual identity, and desired call to action.' },
      { number: '03', title: 'Generate, review, and adapt', body: 'Refine the story and composition, then export versions that fit each marketing channel.' },
    ],
    bestFor: ['Software product demos', 'SaaS explainers', 'Feature walkthroughs', 'Landing-page videos', 'Product marketing ads'],
    notFor:
      'This workflow is optimized for digital products and software interfaces. Physical-product lifestyle footage and AI model try-ons require a different production approach.',
    faqs: [
      {
        question: 'Is Motify an ecommerce product video generator?',
        answer: 'Motify is primarily designed for SaaS and software product marketing. It emphasizes UI, product workflows, messaging, and product-led motion rather than catalog-scale photo-to-video generation.',
      },
      {
        question: 'Can I make a product demo without recording my screen?',
        answer: 'Yes. You can build a story from screenshots and interface assets. For an exact click-by-click tutorial, you may also bring in prepared screen-recording assets.',
      },
      {
        question: 'Can one project produce different aspect ratios?',
        answer: 'Motify supports wider product-video formats and vertical short-form output so the same campaign direction can be adapted for different channels.',
      },
    ],
  },
};
