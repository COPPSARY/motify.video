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
    title: 'AI Launch Video Generator | Motify',
    description:
      'Create launch and announcement videos for a new product, feature, menu, event, or offer. Refine the story, pacing, and brand by chatting, then export.',
    eyebrow: 'Launches and announcements',
    heading: 'AI launch video generator',
    lead:
      'Turn something new—a product, a feature, a menu, an event, or an offer—into a polished launch video built around your real visuals and brand, not generic stock footage.',
    promise:
      'Motify plans the story and creates the motion. When feedback arrives, ask Tiffy for the change and keep the same project instead of starting over.',
    outcome: 'A launch-ready video your team, or your client, can refine together.',
    benefits: [
      {
        title: 'Start with what is new',
        body: 'Describe the launch, who it is for, why it matters, and the one thing viewers should do next, in plain language.',
      },
      {
        title: 'Show the real thing',
        body: 'Attach product photos, screenshots, logos, and music, and build scenes around the details your audience needs to see.',
      },
      {
        title: 'Revise without rebuilding',
        body: 'Ask for changes to the hook, copy, pacing, music, or visual direction in plain language, and the same video updates.',
      },
    ],
    steps: [
      { number: '01', title: 'Describe the launch', body: 'Tell Motify what is launching, who it is for, and the one action the viewer should take.' },
      { number: '02', title: 'Review the direction', body: 'Check the story, scenes, emphasis, and visual hierarchy before you polish the details.' },
      { number: '03', title: 'Refine and export', body: 'Ask Tiffy to adjust the message and motion, apply your Brand DNA, and export the format each channel needs.' },
    ],
    bestFor: ['Product launches', 'Feature announcements', 'New menus and offers', 'Event promos', 'Paid launch campaigns'],
    notFor:
      'Motify makes designed motion graphics. A live-action campaign with actors, locations, or complex visual effects may still need a production studio.',
    faqs: [
      {
        question: 'Can Motify create a launch video from my website?',
        answer: 'Yes. Share your website link and describe the launch, then attach photos, screenshots, or music when the video needs to show specific details.',
      },
      {
        question: 'Can I change the launch video after it is made?',
        answer: 'Yes. Describe what should change, such as the headline, a scene, the pacing, or the music, and Tiffy revises the same project instead of handing you a fixed render.',
      },
      {
        question: 'Does the launch video stay on brand?',
        answer: 'Motify uses your Brand DNA—including logo, colors, typefaces, voice, visual style, and audience—to guide the composition.',
      },
    ],
  },
  'motion-graphics': {
    slug: 'ai-motion-graphics-generator',
    title: 'AI Motion Graphics Generator | Motify',
    description:
      'Generate motion graphics from a prompt. Direct scenes, copy, and pacing in plain language, refine by chatting, and export a polished video.',
    eyebrow: 'Idea to polished motion',
    heading: 'AI motion graphics generator',
    lead:
      'Describe the message you want to share and get a structured motion composition with typography, shapes, your visuals, and intentional pacing.',
    promise:
      'Unlike a one-shot video model, Motify keeps the composition structured, so a follow-up message can change one headline, one scene, or the whole story.',
    outcome: 'Motion graphics that stay editable after the first draft.',
    benefits: [
      {
        title: 'Get a complete direction',
        body: 'Move from a short description to an organized sequence with a hook, visual hierarchy, transitions, supporting motion, and a clear ending.',
      },
      {
        title: 'Refine any scene by asking',
        body: 'Ask for new copy, a different layout, faster pacing, or a reordered story, and Motify updates the composition instead of starting from scratch.',
      },
      {
        title: 'Make motion fit the message',
        body: 'Use calm, clear motion for explainers, energetic pacing for ads, or expressive typography for announcements and social content.',
      },
    ],
    steps: [
      { number: '01', title: 'Describe your idea', body: 'Say what it is for, who will watch it, the format, your brand, and the feel you want, in normal language.' },
      { number: '02', title: 'Get the first draft', body: 'Motify plans and creates the scenes, then checks the result for creative and technical problems.' },
      { number: '03', title: 'Direct the details', body: 'Ask for broad revisions or small, specific changes in plain language, then preview and export.' },
    ],
    bestFor: ['Animated ads', 'Product animations', 'Explainer videos', 'Social content', 'Kinetic typography'],
    notFor:
      'Motify focuses on designed, brand-controlled motion graphics. It is not intended to replace a photorealistic text-to-video model for cinematic live-action scenes.',
    faqs: [
      {
        question: 'What can the AI motion graphics generator create?',
        answer: 'Animated ads, product animations, explainer videos, launch and announcement videos, brand stories, and short social content.',
      },
      {
        question: 'Can I change a single element after generation?',
        answer: 'Yes. The project stays structured, so you can ask for a specific change, like a new headline, a different color, or a slower reveal, without regenerating everything.',
      },
      {
        question: 'Do I need motion-design experience?',
        answer: 'No. Start in plain language or from a template. Every refinement is a conversation, so there is no timeline or keyframe tool to learn.',
      },
    ],
  },
  'software-product': {
    slug: 'software-product-video-generator',
    title: 'AI Product Animation Generator | Motify',
    description:
      'Create product animations that show features, details, and how things work. Use your real product visuals and brand, then refine every scene by chatting.',
    eyebrow: 'Product animations',
    heading: 'AI product animation generator',
    lead:
      'Create product animations that show what your product does, the details that make it different, and what a viewer should do next—built from your real product visuals.',
    promise:
      'Motify combines your product visuals, brand, and a clear story with revisions by chat, so the animation stays accurate as your message evolves.',
    outcome: 'A clear product story that shows the real thing.',
    benefits: [
      {
        title: 'Show one thing well',
        body: 'Focus each animation on a feature, a detail, or a way of using the product instead of listing everything at once.',
      },
      {
        title: 'Keep the product accurate',
        body: 'Attach your product photos, renders, or screenshots so packaging, labels, and interfaces stay recognizable.',
      },
      {
        title: 'Make versions for every channel',
        body: 'Adapt the same product story for a website, a paid ad, a social post, or a wider demo without rebuilding the creative.',
      },
    ],
    steps: [
      { number: '01', title: 'Choose the product moment', body: 'Pick one feature, detail, or benefit the audience should remember.' },
      { number: '02', title: 'Add your visuals and brand', body: 'Attach product images or screenshots, set your Brand DNA, and name the call to action.' },
      { number: '03', title: 'Create, review, and adapt', body: 'Refine the story and motion, then export versions that fit each channel.' },
    ],
    bestFor: ['Product showcases', 'Feature highlights', 'App and software demos', 'Website videos', 'Product ads'],
    notFor:
      'Motify animates your product inside designed motion graphics. Live-action lifestyle footage and AI model try-ons need a different production approach.',
    faqs: [
      {
        question: 'Can Motify animate physical products?',
        answer: 'Yes. Attach product photos or renders and Motify builds designed motion around them, from snack-packaging ads to editorial product spots. It does not generate live-action footage.',
      },
      {
        question: 'Can I make a software demo without recording my screen?',
        answer: 'Yes. You can build the story from screenshots and interface images. For an exact click-by-click tutorial, you may also bring in prepared screen recordings.',
      },
      {
        question: 'Can one project produce different aspect ratios?',
        answer: 'Motify supports landscape, square, portrait, and vertical formats, so the same direction can be adapted for each channel.',
      },
    ],
  },
};
