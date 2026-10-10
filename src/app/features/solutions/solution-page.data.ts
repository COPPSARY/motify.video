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
      'Create editable SaaS launch videos from a product brief, website, and real UI assets. Refine the story, scenes, timing, and brand before export.',
    eyebrow: 'AI video for SaaS launches',
    heading: 'AI SaaS launch video generator',
    lead:
      'Turn a product update, launch brief, or website into a polished video direction built around your real software—not generic stock footage.',
    promise:
      'Motify plans the story, generates the motion composition, and keeps the result editable so your team can respond to launch feedback without starting over.',
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
        body: 'Prompt changes to the hook, pacing, voiceover, or visual direction, then make precise text and timing adjustments in the editor.',
      },
    ],
    steps: [
      { number: '01', title: 'Describe the launch', body: 'Give Motify the product, audience, launch moment, and one action the viewer should take.' },
      { number: '02', title: 'Review the direction', body: 'Inspect the planned story, scenes, product emphasis, and visual hierarchy before the final cut.' },
      { number: '03', title: 'Refine and export', body: 'Adjust messaging and motion, apply Brand DNA, and export the format your launch channel needs.' },
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
        question: 'Can I edit the generated launch video?',
        answer: 'Yes. You can request changes in plain language and manually edit text, scenes, timing, and transitions instead of accepting a fixed render.',
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
      'Generate editable motion graphics from a prompt. Direct scenes in plain language, adjust elements on the canvas, refine timing, and export a polished video.',
    eyebrow: 'Prompt to editable motion',
    heading: 'AI motion graphics generator',
    lead:
      'Describe the message you need to communicate and get a structured motion composition with typography, shapes, product visuals, and intentional pacing.',
    promise:
      'Unlike a one-shot video model, Motify keeps the composition adjustable. Change the story with a prompt or tune individual elements on the canvas and timeline.',
    outcome: 'Motion graphics that remain useful after the first generation.',
    benefits: [
      {
        title: 'Generate a complete direction',
        body: 'Move from a short brief to an organized sequence with a hook, visual hierarchy, transitions, supporting motion, and a clear ending.',
      },
      {
        title: 'Keep every scene editable',
        body: 'Adjust copy, layout, position, timing, easing, and scene order without flattening the project into an opaque clip.',
      },
      {
        title: 'Make motion fit the message',
        body: 'Use restrained motion for product clarity, energetic pacing for campaigns, or brand-led typography for announcements and social content.',
      },
    ],
    steps: [
      { number: '01', title: 'Write the brief', body: 'Describe the goal, audience, format, brand, message, and motion style in normal language.' },
      { number: '02', title: 'Generate the composition', body: 'Motify plans and creates the scenes, then checks the result for creative and technical problems.' },
      { number: '03', title: 'Direct the details', body: 'Prompt broader revisions or use the canvas and timeline for precise adjustments before export.' },
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
        question: 'Can I edit individual elements after generation?',
        answer: 'Yes. The project stays structured so you can refine scenes with prompts and adjust text, layout, timing, and transitions directly.',
      },
      {
        question: 'Do I need motion-design experience?',
        answer: 'No. You can begin in plain language. The visual editor remains available when you want more direct control over a specific scene or transition.',
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
      'Motify combines product context, marketing structure, real interface assets, and editable motion so your video stays accurate as the message evolves.',
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
        answer: 'Motify is primarily designed for SaaS and software product marketing. It emphasizes UI, product workflows, messaging, and editable motion rather than catalog-scale photo-to-video generation.',
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
  'canvas-editor': {
    slug: 'canvas-ai-video-editor',
    title: 'Canvas-Based AI Video Editor | Motify',
    description:
      'Generate video with AI, refine scenes using plain-language prompts, and edit text, elements, timing, and transitions on a visual canvas and timeline.',
    eyebrow: 'AI direction with hands-on control',
    heading: 'Canvas-based AI video editor',
    lead:
      'Use AI for the first direction, then keep control. Prompt broad creative changes and make precise visual edits without regenerating the entire video.',
    promise:
      'Motify connects natural-language direction to an editable canvas and timeline, giving product teams a practical middle ground between one-shot generation and a complex professional editor.',
    outcome: 'A faster first draft without giving up control of the final details.',
    benefits: [
      {
        title: 'Edit AI videos with plain language',
        body: 'Ask for a sharper hook, slower reveal, clearer product emphasis, different tone, or revised visual direction in the words your team already uses.',
      },
      {
        title: 'Make precise canvas changes',
        body: 'Select elements, revise text, adjust layout, and inspect the visual result directly when a small change does not need another AI generation.',
      },
      {
        title: 'Control the timeline',
        body: 'Tune scene duration, easing, transitions, and pacing so the final cut supports the message instead of following a rigid template.',
      },
    ],
    steps: [
      { number: '01', title: 'Prompt the first direction', body: 'Describe the outcome and let Motify create a coherent starting composition.' },
      { number: '02', title: 'Review on the canvas', body: 'Inspect the hierarchy, copy, product visuals, and scene structure where the final motion is composed.' },
      { number: '03', title: 'Refine by prompt or hand', body: 'Use the fastest editing method for each change, then preview and export the finished video.' },
    ],
    bestFor: ['Prompt-led video editing', 'Canvas text editing', 'Timeline refinement', 'Collaborative review', 'Reusable product campaigns'],
    notFor:
      'Motify simplifies product-marketing motion, but it does not try to reproduce every compositing, rotoscoping, or visual-effects control found in a specialist desktop suite.',
    faqs: [
      {
        question: 'Can I edit an AI video with a text prompt?',
        answer: 'Yes. You can describe changes to the hook, pacing, scene, voiceover, or visual direction in plain language and continue refining the same project.',
      },
      {
        question: 'What can I change directly on the canvas?',
        answer: 'You can make targeted changes to visible elements and text, then use the timeline to refine scene timing, transitions, and pacing.',
      },
      {
        question: 'Do manual edits use AI credits?',
        answer: 'Minor text and manual timeline edits do not use generation credits. AI-generated revisions may use credits depending on the requested operation.',
      },
    ],
  },
};
