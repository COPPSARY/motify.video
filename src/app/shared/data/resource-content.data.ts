export type ResourceCategoryId =
  | 'start-here'
  | 'brand-dna'
  | 'playbooks'
  | 'video-craft'
  | 'examples';

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

export interface PromptTemplate {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly format: string;
  readonly opening: string;
  readonly prompt: string;
}

export const RESOURCE_CATEGORIES: readonly ResourceCategory[] = [
  {
    id: 'start-here',
    number: '01',
    title: 'Start Here',
    description: 'Learn the product marketing workflow before you make the first frame.',
    entries: [
      {
        title: 'What is product marketing content?',
        description: 'Understand the content that connects a product change to a customer decision.',
        takeaways: ['Lead with the customer problem', 'Show the product as proof', 'End with one clear next step'],
      },
      {
        title: 'From product update to publishable video',
        description: 'Turn release notes into a focused story with an audience, promise, proof, and CTA.',
        takeaways: ['Extract the change', 'Choose one audience', 'Build a proof-led narrative'],
      },
      {
        title: 'Your first Motify project',
        description: 'Bring a clear brief, useful product context, and the assets the viewer should actually see.',
        takeaways: ['State the goal', 'Add product and brand context', 'Review message before polish'],
      },
      {
        title: 'How to write a useful content brief',
        description: 'Give the creative system enough direction without prescribing every visual decision.',
        takeaways: ['Name the audience', 'Define the customer problem', 'List proof points and constraints'],
      },
      {
        title: 'Demo vs. launch vs. feature announcement',
        description: 'Choose the format based on what the audience needs to understand or do next.',
        takeaways: ['Demo explains the workflow', 'Launch creates a moment', 'Feature content isolates one improvement'],
      },
      {
        title: 'Product marketing checklist for SaaS teams',
        description: 'A final pass for message, evidence, brand consistency, format, and distribution.',
        takeaways: ['Check the claim', 'Check the proof', 'Check the destination'],
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
        description: 'Build a practical source of truth for the way your company looks, sounds, and speaks.',
        takeaways: ['Logo and brand assets', 'Colors and fonts', 'Website and product context'],
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
        title: 'Creating a brand-consistent video',
        description: 'Keep message, typography, color, pacing, and visual language working as one system.',
        takeaways: ['Start from Brand DNA', 'Use product truth as proof', 'Review the whole sequence, not isolated frames'],
      },
      {
        title: 'Brand consistency checklist',
        description: 'A quick review before a product video leaves the workspace.',
        takeaways: ['Correct logo usage', 'Approved color and type', 'Right tone, style, and audience'],
        label: 'Checklist',
      },
      {
        title: 'How to give AI better brand context',
        description: 'Explain the decisions behind the brand so the model can apply them in new situations.',
        takeaways: ['Share the website link', 'Describe tone and style', 'Name the target audience'],
      },
    ],
  },
  {
    id: 'playbooks',
    number: '04',
    title: 'Product Marketing Playbooks',
    description: 'Repeatable workflows for turning product work into market-ready communication.',
    entries: [
      {
        title: 'Product update to launch content',
        description: 'Translate a changelog item into a customer-facing story and focused launch asset.',
        takeaways: ['Find the outcome', 'Select proof', 'Match message to channel'],
      },
      {
        title: 'Feature release campaign',
        description: 'Plan the core message, launch video, supporting posts, and follow-up education.',
        takeaways: ['Anchor the campaign in one promise', 'Sequence awareness and proof', 'Reuse the same message spine'],
      },
      {
        title: 'Product demo workflow',
        description: 'Build a demo around a viewer task rather than a tour of every interface control.',
        takeaways: ['Start with the task', 'Show only decisive steps', 'End on the achieved outcome'],
      },
      {
        title: 'Product Hunt launch playbook',
        description: 'Prepare a clear launch story, visual proof, founder context, and coordinated follow-up.',
        takeaways: ['Lead with the sharpest value', 'Make the product visible', 'Prepare replies and follow-up content'],
      },
      {
        title: 'How to market a product with a small team',
        description: 'Prioritize fewer, reusable messages and a workflow the team can sustain.',
        takeaways: ['Choose one campaign goal', 'Create a reusable source brief', 'Review once, distribute deliberately'],
      },
      {
        title: 'Turn one update into multiple assets',
        description: 'A future-facing workflow for adapting one approved story across formats and channels.',
        takeaways: ['Keep one source narrative', 'Adapt framing by channel', 'Preserve the same proof points'],
        label: 'Concept guide',
      },
      {
        title: 'Create content without a video editor',
        description: 'Use a prompt-led workflow to direct the story, inspect the result, and refine what matters.',
        takeaways: ['Brief in plain language', 'Review structure first', 'Refine scenes and pacing'],
      },
      {
        title: 'Build a repeatable content workflow',
        description: 'Standardize inputs, reviews, and outputs without making every campaign feel identical.',
        takeaways: ['Use a shared brief', 'Capture Brand DNA once', 'Keep an approval checklist'],
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
    number: '05',
    title: 'Video Craft',
    description: 'Practical direction for making product stories clearer, faster, and easier to watch.',
    entries: [
      {
        title: 'How to write a strong opening hook',
        description: 'Open with a relevant tension, outcome, or surprise instead of a generic introduction.',
        takeaways: ['Earn attention immediately', 'Make the topic obvious', 'Create a reason to keep watching'],
      },
      {
        title: 'Product demo script structure',
        description: 'Move from problem to action to evidence without narrating every click.',
        takeaways: ['Set the task', 'Show the decisive action', 'Land on the result'],
      },
      {
        title: 'Problem-Agitation-Solution explained',
        description: 'Use PAS when the cost of the current workflow needs to be felt before the product appears.',
        takeaways: ['Name the problem', 'Make the consequence concrete', 'Resolve with credible proof'],
      },
      {
        title: 'How much text to put on screen',
        description: 'Keep each frame readable at the speed and size where it will actually be watched.',
        takeaways: ['One thought per beat', 'Prefer concrete language', 'Read it aloud at final timing'],
      },
      {
        title: 'How to show software UI clearly',
        description: 'Direct attention to the important action without shrinking the product into a screenshot wall.',
        takeaways: ['Crop around the task', 'Use motion to guide focus', 'Keep labels legible'],
      },
      {
        title: 'Product video pacing',
        description: 'Balance momentum with enough time for the viewer to understand each proof point.',
        takeaways: ['Change on meaning', 'Hold on evidence', 'Use rhythm to signal importance'],
      },
      {
        title: 'Voiceover best practices',
        description: 'Write for the ear, leave room for visuals, and avoid saying what the screen already proves.',
        takeaways: ['Use spoken language', 'Keep sentences short', 'Let visuals carry detail'],
      },
      {
        title: 'Choosing 16:9, 1:1, or 9:16',
        description: 'Choose the frame from the destination and the product material you need to show.',
        takeaways: ['16:9 for demos and presentations', '1:1 for flexible feeds', '9:16 for mobile-first stories'],
      },
      {
        title: 'How to create a strong CTA',
        description: 'Ask for one action that naturally follows the promise and proof in the video.',
        takeaways: ['Use one verb', 'Make the next step specific', 'Match the CTA to audience readiness'],
      },
      {
        title: 'Common mistakes in SaaS product videos',
        description: 'Avoid feature lists, unreadable UI, vague claims, slow openings, and crowded endings.',
        takeaways: ['Choose a story over a tour', 'Show proof at readable scale', 'Finish on one message'],
        label: 'Checklist',
      },
    ],
  },
  {
    id: 'examples',
    number: '06',
    title: 'Creative Inspiration',
    description: 'See how a goal becomes a brief, script, visual direction, and final asset.',
    entries: [
      {
        title: 'Product demo examples',
        description: 'Task-led demos that make a product workflow easy to understand.',
        takeaways: ['Goal', 'Brief', 'Script', 'Visual direction', 'Final asset'],
        label: 'Example',
      },
      {
        title: 'Feature launch examples',
        description: 'Focused launch stories built around one meaningful product improvement.',
        takeaways: ['Goal', 'Brief', 'Script', 'Visual direction', 'Final asset'],
        label: 'Example',
      },
      {
        title: 'Product Hunt video examples',
        description: 'Fast, proof-rich introductions designed for a launch-day audience.',
        takeaways: ['Goal', 'Brief', 'Script', 'Visual direction', 'Final asset'],
        label: 'Example',
      },
      {
        title: 'Before-and-after breakdowns',
        description: 'Compare a vague first brief with the sharper story created from better context.',
        takeaways: ['What changed', 'Why it changed', 'What the viewer understands now'],
        label: 'Example',
      },
      {
        title: 'How this video was made',
        description: 'Annotated decisions across message, script, pacing, product proof, and brand direction.',
        takeaways: ['Goal', 'Brief', 'Script', 'Visual direction', 'Final asset'],
        label: 'Example',
      },
      {
        title: 'Strong vs. weak product messaging',
        description: 'Side-by-side examples of specific, credible claims and the vague alternatives they replace.',
        takeaways: ['Specific audience', 'Concrete outcome', 'Visible evidence'],
        label: 'Example',
      },
      {
        title: 'SaaS landing page video examples',
        description: 'Videos that support the page narrative without repeating every line of copy.',
        takeaways: ['Clarify the promise', 'Demonstrate proof', 'Support the page CTA'],
        label: 'Example',
      },
      {
        title: 'Video script gallery',
        description: 'Reusable story structures for launches, demos, explainers, comparisons, and case studies.',
        takeaways: ['Hook', 'Problem', 'Proof', 'Resolution', 'CTA'],
        label: 'Example',
      },
    ],
  },
];

const prompt = (fields: Record<string, string>): string =>
  Object.entries(fields)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n\n');

export const PROMPT_TEMPLATES: readonly PromptTemplate[] = [
  ['product-launch', 'Product launch video', 'Introduce a new product with a clear market promise.', '16:9 launch film', 'Create a product launch video'],
  ['feature-announcement', 'Feature announcement', 'Turn one release into a focused customer story.', '16:9 or 1:1', 'Create a feature announcement video'],
  ['product-demo', 'Product demo script', 'Show a real task, the decisive action, and the result.', '16:9 product demo', 'Create a product demo video'],
  ['problem-explainer', 'Customer problem explainer', 'Make the pain concrete before introducing the product.', '1:1 explainer', 'Create a customer problem explainer'],
  ['product-hunt', 'Product Hunt launch', 'Explain the product quickly to a launch-day audience.', '16:9 launch video', 'Create a Product Hunt launch video'],
  ['founder-walkthrough', 'Founder-led walkthrough', 'Pair founder context with a concise product demonstration.', '16:9 walkthrough', 'Create a founder-led product walkthrough'],
  ['social-update', 'Social video from an update', 'Turn release notes into a useful, channel-ready story.', '1:1 social video', 'Create a social video from a product update'],
  ['linkedin', 'LinkedIn announcement', 'Frame a product change around why it matters to the market.', '1:1 LinkedIn video', 'Create a LinkedIn product announcement'],
  ['vertical', 'Short-form vertical video', 'Deliver one sharp idea with mobile-first pacing.', '9:16 vertical video', 'Create a short-form vertical product video'],
  ['comparison', 'Product comparison video', 'Compare approaches fairly around a customer decision.', '16:9 comparison', 'Create a product comparison video'],
  ['case-study', 'Case study video', 'Turn a customer outcome into a credible proof story.', '16:9 case study', 'Create a customer case study video'],
  ['website-hero', 'Website hero video', 'Support a landing-page promise with immediate visual proof.', '16:9 silent-loop hero', 'Create a website hero video'],
].map(([id, title, description, format, opening]) => ({
  id,
  title,
  description,
  format,
  opening,
  prompt: prompt({
    Goal: `${opening}. The single outcome I want is [desired outcome].`,
    'Target audience': '[role, company type, awareness level, and what they care about]',
    'Product context': '[what the product is, how it works, and the product or website link]',
    'Customer problem': '[the current struggle, its consequence, and why existing options fall short]',
    'Key proof points': '[three specific features, results, screenshots, metrics, or customer evidence]',
    'Tone and style': '[brand voice, pacing, visual references, colors, fonts, and what to avoid]',
    'Call to action': '[one concrete next step for the viewer]',
    'Output format': `${format}; [duration]; [with or without voiceover/captions].`,
  }),
}));

export function resourceCategory(id: ResourceCategoryId): ResourceCategory {
  const category = RESOURCE_CATEGORIES.find((candidate) => candidate.id === id);
  if (!category) throw new Error(`Unknown resource category: ${id}`);
  return category;
}
