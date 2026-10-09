export interface HelpTopicSection {
  readonly heading: string;
  readonly body: string;
  readonly bulletPoints?: readonly string[];
}

export interface HelpTopicRelatedLink {
  readonly label: string;
  readonly url: string;
  readonly isExternal?: boolean;
}

export interface HelpTopic {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly overview: string;
  readonly sections: readonly HelpTopicSection[];
  readonly relatedLinks: readonly HelpTopicRelatedLink[];
}

export const HELP_TOPICS: readonly HelpTopic[] = [
  {
    id: 'account',
    slug: 'account',
    title: 'Account & credits',
    tagline: 'Understand credit balance, personal workspaces, and renewals',
    overview:
      'Learn how Motify accounts, workspaces, plan credits, renewals, and editing work so you can manage projects and usage with confidence.',
    sections: [
      {
        heading: 'What uses credits',
        body:
          'Credits cover the generation and rendering computation behind each video project. Simple draft edits, previewing keyframes, and reviewing existing projects do not consume credits.',
        bulletPoints: [
          'Full video generation runs use credits based on length and resolution.',
          'Reviewing drafts and inspecting timelines is always free.',
          'Failed renders caused by system errors are not charged.',
        ],
      },
      {
        heading: 'Workspace management',
        body:
          'Purchases and subscriptions are attached to your personal workspace. If you work across teams, switch workspaces from your settings to access team assets.',
      },
      {
        heading: 'Renewals & credit balance',
        body:
          'Plan credits refresh every billing cycle (monthly or yearly). Top-up pack credits remain in your balance according to your plan terms.',
      },
    ],
    relatedLinks: [
      { label: 'View pricing plans', url: '/pricing' },
      { label: 'Contact support', url: 'mailto:support@motify.video', isExternal: true },
    ],
  },
  {
    id: 'brand-dna',
    slug: 'brand-dna',
    title: 'Brand DNA setup',
    tagline: 'Give Motify the context your team already knows',
    overview:
      'Set up Motify Brand DNA with your logo, colors, fonts, voice, visual style, website, and target audience for consistent video output.',
    sections: [
      {
        heading: 'Core brand assets',
        body:
          'Upload SVG or high-resolution PNG logos with dark and light variants. Define your primary HEX colors, secondary accents, and typographic hierarchy.',
        bulletPoints: [
          'Upload vector SVGs for crisp scaling across resolutions.',
          'Define background and text contrast pairs.',
          'Set primary brand typography and fallback fonts.',
        ],
      },
      {
        heading: 'Voice and tone definition',
        body:
          'Specify whether your voice is authoritative, conversational, energetic, or technical. Give explicit examples of phrases your brand uses and phrases to avoid.',
      },
      {
        heading: 'Audience calibration',
        body:
          'Define the persona watching your videos—such as seed-stage founders, enterprise DevOps engineers, or growth marketers—so framing matches their context.',
      },
    ],
    relatedLinks: [
      { label: 'Open Brand DNA guides', url: '/resources/brand-dna' },
      { label: 'Browse prompt templates', url: '/resources/prompt-templates' },
    ],
  },
  {
    id: 'inputs',
    slug: 'inputs',
    title: 'Supported inputs',
    tagline: 'Start with a brief, then add the evidence',
    overview:
      'Learn which prompts, product links, images, logos, screenshots, and video assets Motify accepts—and how to label references clearly.',
    sections: [
      {
        heading: 'Text briefs & site links',
        body:
          'You can provide direct URLs to your landing page or documentation. Motify inspects the site to extract key headlines, color tokens, and product concepts.',
      },
      {
        heading: 'Asset formats & dimensions',
        body:
          'Supported image formats include PNG, JPG, and SVG. For video clips, MP4 and WebM up to 4K are supported. For transparent graphics, transparent PNG or SVG is recommended.',
        bulletPoints: [
          'Static images: PNG, JPG, WebP, SVG.',
          'Motion assets: MP4, WebM (up to 4K resolution).',
          'Resolution: Provide 2x or 3x assets for retina displays.',
        ],
      },
      {
        heading: 'Inspiration vs. In-video elements',
        body:
          'Clearly label whether an uploaded screenshot is meant to be featured directly in the video sequence or provided as visual inspiration for motion choreography.',
      },
    ],
    relatedLinks: [
      { label: 'Use structured prompt templates', url: '/resources/prompt-templates' },
      { label: 'Video craft best practices', url: '/resources/video-craft' },
    ],
  },
  {
    id: 'export',
    slug: 'export',
    title: 'Export & rendering',
    tagline: 'Review the final sequence before rendering',
    overview:
      'Review aspect ratios, audio, timing, rendering controls, and export formats before producing your final Motify video.',
    sections: [
      {
        heading: 'Aspect ratios & framing',
        body:
          'Select 16:9 for landing page heroes, YouTube, and product demos. Select 1:1 for LinkedIn feeds and Instagram. Select 9:16 for TikTok, Instagram Reels, and YouTube Shorts.',
      },
      {
        heading: 'Audio & voiceover tracks',
        body:
          'Verify background music volume and AI voiceover pacing in the timeline preview prior to initiating final rendering.',
      },
      {
        heading: 'Render speeds & quality',
        body:
          'Cloud rendering generates production-ready MP4 files at 60 FPS with optimal H.264 compression for web streaming.',
      },
    ],
    relatedLinks: [
      { label: 'Video craft best practices', url: '/resources/video-craft' },
      { label: 'View pricing plans', url: '/pricing' },
    ],
  },
  {
    id: 'troubleshooting',
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    tagline: 'Separate a content problem from a rendering problem',
    overview:
      'When a generated video does not match expectations, isolating whether the issue is prompt framing, asset configuration, or cloud rendering saves time.',
    sections: [
      {
        heading: 'Story or pacing issues',
        body:
          'If the video feels unfocused or rushed, reduce the number of key messages. One clear problem and one concrete proof point outperforms a dense feature list.',
        bulletPoints: [
          'If the story is wrong, revise the audience, goal, proof, or CTA.',
          'If a brand choice is wrong, update Brand DNA and name the expected behavior.',
          'If an asset is missing, confirm whether it is a reference or an in-video asset.',
          'If rendering fails repeatedly, keep the project URL and contact support.',
        ],
      },
      {
        heading: 'Render failure recovery',
        body:
          'If rendering fails, verify your network connection and retry from the editor export panel. If issues persist, send the project URL to support.',
      },
    ],
    relatedLinks: [
      { label: 'Contact support', url: 'mailto:support@motify.video', isExternal: true },
      { label: 'Account & credits help', url: '/help/account' },
    ],
  },
  {
    id: 'availability',
    slug: 'availability',
    title: 'Feature availability',
    tagline: 'Current workspace features and changelog updates',
    overview:
      'See which Motify features are available today, which workflows are conceptual, and where to ask about upcoming capabilities.',
    sections: [
      {
        heading: 'Active workspace features',
        body:
          'Current production features include Brand DNA asset extraction, structured prompt execution, multi-format export (16:9, 1:1, 9:16), Bakong KHQR checkout, and cloud timeline editing.',
      },
      {
        heading: 'Upcoming capabilities',
        body:
          'Integrations with Figma and Linear, team collaboration roles, and programmatic API access are in active development.',
      },
    ],
    relatedLinks: [
      { label: 'Partner with Motify', url: '/partners' },
      {
        label: 'Ask about a feature',
        url: 'mailto:support@motify.video?subject=Motify%20feature%20availability',
        isExternal: true,
      },
    ],
  },
];

export function getHelpTopic(id: string): HelpTopic | undefined {
  return HELP_TOPICS.find((topic) => topic.id === id || topic.slug === id);
}
