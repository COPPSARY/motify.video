export type ResourceCategoryId =
  | 'start-here'
  | 'brand-dna'
  | 'playbooks'
  | 'video-craft';

export interface ResourceEntry {
  readonly title: string;
  readonly description: string;
  readonly takeaways: readonly string[];
  readonly label?: 'Guide' | 'Checklist' | 'Concept guide' | 'Example';
}

export interface ResourceCategory {
  readonly id: ResourceCategoryId;
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly entries: readonly ResourceEntry[];
}

export const RESOURCE_CATEGORIES: readonly ResourceCategory[] = [
  {
    id: 'start-here',
    number: '01',
    title: 'Start Here',
    description: 'Learn the Motify workflow, from a clear idea and your brand context to a finished motion graphic you can publish.',
    entries: [
      {
        title: 'What can you make with Motify?',
        description: 'Animated ads, product animations, explainer videos, and marketing and social content.',
        takeaways: ['Animated ads that bring campaign ideas to life', 'Product animations that show features and details', 'Explainers and social content that add motion to your message'],
      },
      {
        title: 'From idea to finished motion graphic',
        description: 'Turn a rough idea into a focused piece with a goal, an audience, a message, and a next step.',
        takeaways: ['Name the goal', 'Pick one audience', 'Choose the one message to land'],
      },
      {
        title: 'Your first Motify project',
        description: 'Bring a clear description, your brand context, and the images or music the viewer should see and hear.',
        takeaways: ['Describe it in plain words', 'Attach your images and music', 'Review the message before the polish'],
      },
      {
        title: 'How to describe what you want',
        description: 'Give enough direction to shape the result without prescribing every frame.',
        takeaways: ['Say what it is for', 'Describe the look and feel', 'List must-have text, assets, and constraints'],
      },
      {
        title: 'Ad vs. product animation vs. explainer',
        description: 'Choose the format from what the viewer should feel, see, or understand.',
        takeaways: ['An ad catches attention and sells one idea', 'A product animation shows features and how things work', 'An explainer makes an idea easy to follow'],
      },
      {
        title: 'Before-you-publish checklist',
        description: 'A final pass on message, brand, format, and where the motion graphic will be posted.',
        takeaways: ['Check the message', 'Check the brand', 'Check the format and destination'],
        label: 'Checklist',
      },
    ],
  },
  {
    id: 'brand-dna',
    number: '02',
    title: 'Brand DNA',
    description: 'Give Motify the context it needs to make every output feel unmistakably yours.',
    entries: [
      {
        title: 'How to define your Brand DNA',
        description: 'Build a practical source of truth for the way your business looks, sounds, and speaks.',
        takeaways: ['Logo and brand assets', 'Colors and fonts', 'Website and business context'],
      },
      {
        title: 'Brand voice and tone guide',
        description: 'Separate the voice that stays consistent from the tone that changes by moment.',
        takeaways: ['Define three voice traits', 'Add language to use and avoid', 'Show real examples'],
      },
      {
        title: 'Choosing colors, fonts, and visual references',
        description: 'Provide a useful visual system instead of a loose collection of inspiration.',
        takeaways: ['Name primary and support colors', 'Define type roles', 'Explain what each reference contributes'],
      },
      {
        title: 'Creating brand-consistent motion',
        description: 'Keep message, typography, color, pacing, and visual language working as one system.',
        takeaways: ['Start from Brand DNA', 'Show your real products and assets', 'Review the whole sequence, not isolated frames'],
      },
      {
        title: 'Brand consistency checklist',
        description: 'A quick review before a motion graphic leaves the workspace.',
        takeaways: ['Correct logo usage', 'Approved color and type', 'Right tone, style, and audience'],
        label: 'Checklist',
      },
      {
        title: 'How to give AI better brand context',
        description: 'Explain the decisions behind the brand so the model can apply them in new situations.',
        takeaways: ['Share the website link', 'Describe tone and style', 'Name the target audience'],
      },
      {
        title: 'Managing several brands',
        description: 'Agencies and multi-brand teams can keep each brand’s context separate and ready to use.',
        takeaways: ['One Brand DNA per brand or client', 'Pick the brand before you create', 'Review against that brand’s checklist'],
      },
    ],
  },
  {
    id: 'playbooks',
    number: '03',
    title: 'Playbooks',
    description: 'Repeatable workflows for campaigns, launches, social content, and client work.',
    entries: [
      {
        title: 'Animated ad campaign',
        description: 'Plan one campaign idea, the hero ad, and the versions each channel needs.',
        takeaways: ['Anchor on one idea', 'Make the first second count', 'Adapt the cut for each channel'],
      },
      {
        title: 'Product animation workflow',
        description: 'Show features, details, and how things work without overcrowding the frame.',
        takeaways: ['Start with the detail that matters', 'Show one feature per beat', 'End on the product'],
      },
      {
        title: 'Explainer video workflow',
        description: 'Turn a service, process, or idea into a story viewers can follow and remember.',
        takeaways: ['Start from the viewer’s question', 'Explain in clear steps', 'Close with the next action'],
      },
      {
        title: 'Launch and announcement playbook',
        description: 'Prepare a launch moment for a new product, menu, event, offer, or feature.',
        takeaways: ['Lead with what is new', 'Make it visible', 'Plan the follow-up posts'],
      },
      {
        title: 'Social content workflow',
        description: 'Keep a steady rhythm of short motion posts without starting from zero each time.',
        takeaways: ['Reuse a visual system', 'Batch your ideas', 'Keep each post to one thought'],
      },
      {
        title: 'Motion graphics for client work',
        description: 'Explore directions early and deliver variations for clients faster.',
        takeaways: ['Show directions before polish', 'Keep each client’s Brand DNA separate', 'Share drafts for feedback early'],
      },
      {
        title: 'Turn one update into multiple assets',
        description: 'A future-facing workflow for adapting one approved story across formats and channels.',
        takeaways: ['Keep one source narrative', 'Adapt framing by channel', 'Preserve the same key message'],
        label: 'Concept guide',
      },
      {
        title: 'Create motion graphics without a video editor',
        description: 'Describe the story, review the result, and refine what matters by chatting.',
        takeaways: ['Describe it in plain language', 'Review structure first', 'Refine scenes and pacing'],
      },
      {
        title: 'Review and approval for marketing teams',
        description: 'A concept for keeping comments, decisions, and approved versions connected to the work.',
        takeaways: ['Assign decision owners', 'Review message before motion', 'Record the approved version'],
        label: 'Concept guide',
      },
    ],
  },
  {
    id: 'video-craft',
    number: '04',
    title: 'Video Craft',
    description: 'Practical direction for making motion graphics clearer, more engaging, and easier to watch.',
    entries: [
      {
        title: 'How to write a strong opening hook',
        description: 'Open with a relevant tension, outcome, or surprise instead of a generic introduction.',
        takeaways: ['Earn attention immediately', 'Make the topic obvious', 'Create a reason to keep watching'],
      },
      {
        title: 'Explainer script structure',
        description: 'Move from question to answer to next step without narrating every detail.',
        takeaways: ['Set up the question', 'Show the key steps', 'Land on the outcome'],
      },
      {
        title: 'Problem-Agitation-Solution explained',
        description: 'Use PAS when the cost of the problem needs to be felt before the solution appears.',
        takeaways: ['Name the problem', 'Make the consequence concrete', 'Resolve with something the viewer can see'],
      },
      {
        title: 'How much text to put on screen',
        description: 'Keep each frame readable at the speed and size where it will actually be watched.',
        takeaways: ['One thought per beat', 'Prefer concrete language', 'Read it aloud at final timing'],
      },
      {
        title: 'How to show a product clearly',
        description: 'Direct attention to the detail that matters instead of filling the frame.',
        takeaways: ['Crop around what matters', 'Use motion to guide focus', 'Keep labels legible'],
      },
      {
        title: 'Motion pacing',
        description: 'Balance momentum with enough time for the viewer to take in each moment.',
        takeaways: ['Change on meaning', 'Hold on what matters', 'Use rhythm to signal importance'],
      },
      {
        title: 'Music and voiceover',
        description: 'Let the soundtrack set the mood, and write any voiceover for the ear, not the page.',
        takeaways: ['Match music to the feeling', 'Keep spoken sentences short', 'Let visuals carry detail'],
      },
      {
        title: 'Choosing 16:9, 1:1, 4:5, or 9:16',
        description: 'Choose the frame from where the motion graphic will be watched.',
        takeaways: ['16:9 for websites and presentations', '1:1 and 4:5 for feeds', '9:16 for Reels, TikTok, and Stories'],
      },
      {
        title: 'How to create a strong CTA',
        description: 'Ask for one action that naturally follows the message of the piece.',
        takeaways: ['Use one verb', 'Make the next step specific', 'Match the CTA to how ready the viewer is'],
      },
      {
        title: 'Common motion graphics mistakes',
        description: 'Avoid crowded frames, unreadable text, vague messages, slow openings, and busy endings.',
        takeaways: ['Choose one message', 'Keep text readable', 'Finish on one action'],
        label: 'Checklist',
      },
    ],
  },
];

export function resourceCategory(id: ResourceCategoryId): ResourceCategory {
  const category = RESOURCE_CATEGORIES.find((candidate) => candidate.id === id);
  if (!category) throw new Error(`Unknown resource category: ${id}`);
  return category;
}
