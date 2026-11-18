import {
  MOTION_GRAPHICS_SHOT,
  type ProductShot,
  PSD_TO_VIDEO_SHOT,
  VIDEO_EDITOR_SHOT,
} from '../../shared/data/product-shots';

export interface SolutionStep {
  readonly number: string;
  readonly title: string;
  readonly body: string;
}

export interface SolutionFaq {
  readonly question: string;
  readonly answer: string;
}

export interface SolutionCapability {
  readonly title: string;
  readonly body: string;
}

export interface SolutionPage {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
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
  /** A feature still in beta: the page says so next to its heading. */
  readonly beta?: boolean;
  /** A screenshot of the real editor, shown full width under the hero. */
  readonly shot?: ProductShot;
  /** The glow behind the screenshot. */
  readonly accent?: string;
  /** What the feature can do, in the editor's own terms. */
  readonly capabilities?: readonly SolutionCapability[];
}


export const SOLUTION_PAGES: Record<string, SolutionPage> = {
  'motion-graphics': {
    slug: 'ai-motion-graphics-generator',
    title: 'AI Motion Graphics Generator | Motify',
    description:
      'Generate motion graphics from a prompt. Direct scenes, copy, and pacing in plain language, refine by chatting, and export a polished video.',
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
    bestFor: ['Animated ads', 'Launch videos', 'Product animations', 'Explainer videos', 'Social content', 'Kinetic typography'],
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
    shot: MOTION_GRAPHICS_SHOT,
    accent: '#2758e6',
    capabilities: [
      {
        title: 'Brand DNA',
        body: 'Save your logo, colors, typefaces, and voice once, or let Motify read them from your website. Every video uses them.',
      },
      {
        title: 'Scenes you can name',
        body: 'Each video is planned as named scenes, like Hook, Statement, and End card, so you can change one without touching the rest.',
      },
      {
        title: 'Tiffy, your editor',
        body: 'Ask in plain words for a shorter intro, a new headline, or a slower reveal, and the same project updates.',
      },
      {
        title: 'Your real visuals',
        body: 'Attach product photos, app screenshots, and logos, and Motify builds the scenes around them.',
      },
      {
        title: 'Voice-over when you need it',
        body: 'Add a voice-over that reads your script, or keep the video to music, type, and motion.',
      },
      {
        title: 'Every format',
        body: 'Make it 16:9, 1:1, 4:5, or 9:16 and export MP4 for your website, ads, and social channels.',
      },
    ],
  },
  'software-product': {
    slug: 'software-product-video-generator',
    title: 'AI Product Animation Generator | Motify',
    description:
      'Create product animations that show features, details, and how things work. Use your real product visuals and brand, then refine every scene by chatting.',
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
  'video-editor': {
    slug: 'ai-video-editor',
    beta: true,
    title: 'AI Video Editor for Promo Videos | Motify',
    description:
      'Upload your raw clips and the Motify AI video editor cuts them into a promo video with captions, title cards, and B-roll. Refine it by chatting.',
    heading: 'AI video editor',
    lead:
      'Upload the footage you already have, such as interviews, product demos, or event clips, and Motify cuts it into a promotional video you can refine and export.',
    promise:
      'Motify reads what is said in every clip and cuts in the pauses between words, never mid-sentence. Title cards and B-roll go over the talk, so the speaker is never cut off.',
    outcome: 'A rough cut of your own footage, ready to refine.',
    benefits: [
      {
        title: 'Cuts that respect the words',
        body: 'Each clip is transcribed with word timings, so cut points land between words and the video fits the length you ask for.',
      },
      {
        title: 'Captions, cards, and B-roll',
        body: 'Add captions and translate them, put title cards and your own pictures over the talk, and fill gaps with stock B-roll.',
      },
      {
        title: 'Change it by chatting',
        body: 'Ask for a shorter cut, a different opening, or more B-roll in plain words, and the same edit updates.',
      },
    ],
    steps: [
      { number: '01', title: 'Upload your clips', body: 'Add the raw footage and pick a starting style, such as Talking head, Studio explainer, Paper documentary, Shop promo, or Product launch.' },
      { number: '02', title: 'Get a first cut', body: 'Motify reads what is said in every clip, picks the best moments, and cuts them into a video with captions and titles.' },
      { number: '03', title: 'Refine and export', body: 'Tap a suggested edit, ask Tiffy for your own, or adjust it by hand, then export in 9:16, 16:9, or 1:1.' },
    ],
    bestFor: ['Customer testimonials', 'Founder and talking-head videos', 'Event recaps', 'Recorded product demos', 'Short social cut-downs'],
    notFor:
      'The AI video editor works with footage you upload. It does not film new shots or generate people. It is in beta, so expect it to keep improving.',
    faqs: [
      {
        question: 'What footage can I use?',
        answer: 'Your own video clips, such as interviews, demos, and event footage. Motify reads each clip once, so reusing a clip in another project does not process it again.',
      },
      {
        question: 'Will the edit cut people off mid-sentence?',
        answer: 'No. Cut points are moved into the pauses between words, and cards or B-roll are placed over the talk instead of interrupting it.',
      },
      {
        question: 'Is the AI video editor available now?',
        answer: 'Yes, in beta. You can use it in the Motify editor today; it may change as we improve it.',
      },
    ],
    shot: VIDEO_EDITOR_SHOT,
    accent: '#e8a317',
    capabilities: [
      {
        title: 'Cuts between words',
        body: 'Every clip is transcribed with word timings, so cuts land in the pauses and nobody is cut off mid-sentence.',
      },
      {
        title: 'Silences and fillers, gone',
        body: 'Remove dead air and filler words from the whole video in one click.',
      },
      {
        title: 'Captions that move',
        body: 'Stacked kinetic captions and more styles that blur, pop, or fade in, in English, Khmer, or both.',
      },
      {
        title: 'Titles and motion cards',
        body: 'Add a headline, a price badge, a name and place, or a call to action. Motify makes the motion graphics and plays them over the talk.',
      },
      {
        title: 'B-roll and your pictures',
        body: 'Search stock B-roll in the Clips tab, upload your logo and product photos, or paste a picture straight into the chat.',
      },
      {
        title: 'By hand or by chat',
        body: 'Trim, split, and reorder on the timeline yourself for free, or ask Tiffy. Every change can be undone.',
      },
    ],
  },
  'psd-to-video': {
    slug: 'psd-to-video',
    beta: true,
    title: 'PSD to Video: Animate Photoshop Designs | Motify',
    description:
      'Turn a Photoshop design into an animated video. Motify keeps every layer exactly as you designed it and adds only the motion.',
    heading: 'PSD to video',
    lead:
      'Import your Photoshop file and Motify animates the layers you already designed: your type, images, and groups, each in its exact position.',
    promise:
      'Your design stays your design. Motify does not redraw, restyle, or reword anything; it only writes the motion.',
    outcome: 'Your Photoshop design, now in motion.',
    benefits: [
      {
        title: 'Every layer kept',
        body: 'Pixel layers, type layers, and groups come in at their exact Photoshop positions, with their names, sizes, opacity, and order.',
      },
      {
        title: 'Motion only',
        body: 'The animation is added on top of the finished design, so the layout, wording, and style your team approved stay untouched.',
      },
      {
        title: 'Change it by asking',
        body: 'Pick any layer, even one hidden under another, and ask Tiffy to change how it moves.',
      },
    ],
    steps: [
      { number: '01', title: 'Import your PSD', body: 'Upload the Photoshop file. It is read in your browser, and each layer becomes an element in its exact place.' },
      { number: '02', title: 'Say how it should move', body: 'Pick a length and, if you like, describe the motion. Motify animates the layers you have.' },
      { number: '03', title: 'Refine and export', body: 'Preview the animation, ask Tiffy to change any layer’s motion, and export the video.' },
    ],
    bestFor: ['Social posts designed in Photoshop', 'Ads and banners', 'Posters and key visuals', 'Menu and event graphics', 'Agency deliverables'],
    notFor:
      'PSD to Video animates the design as it is. If the layout or wording needs to change, change it in Photoshop first, or start a new video from a prompt.',
    faqs: [
      {
        question: 'Will Motify change my design?',
        answer: 'No. It keeps every layer, its position, size, text, and stacking order exactly as in Photoshop, and only adds the motion.',
      },
      {
        question: 'Which Photoshop files work?',
        answer: 'Standard .psd files. Save them with Maximize PSD Compatibility turned on, so Motify can match every layer to Photoshop’s own preview of the design.',
      },
      {
        question: 'Is PSD to Video available now?',
        answer: 'Yes, in beta. You can use it in the Motify editor today; it may change as we improve it.',
      },
    ],
    shot: PSD_TO_VIDEO_SHOT,
    accent: '#8b5cf6',
    capabilities: [
      {
        title: 'Every layer, in place',
        body: 'Pixel, type, and group layers keep their names, positions, sizes, opacity, visibility, and stacking order.',
      },
      {
        title: 'Layer styles kept',
        body: 'Drop and inner shadows, glows, strokes, color and gradient overlays, satin, and bevel are drawn the way Photoshop draws them.',
      },
      {
        title: 'Masks and adjustments',
        body: 'Layer, vector, and clipping masks come through, and adjustment layers like Levels, Curves, and Hue/Saturation still apply.',
      },
      {
        title: 'Matched to Photoshop',
        body: 'After import, Motify compares the layers with the preview Photoshop saved in your file and corrects any difference.',
      },
      {
        title: 'Say how it should move',
        body: 'Add an optional note, like “slow and premium” or “the logo lands last”, or let Motify decide. Re-animate from the chat any time.',
      },
      {
        title: 'Pick any layer',
        body: 'The Design panel lists every layer, even one hidden under another, so you can select it and ask for a change.',
      },
    ],
  },
};
