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
  readonly prompt: string;
}

export const RESOURCE_CATEGORIES: readonly ResourceCategory[] = [
  {
    id: 'start-here',
    number: '01',
    title: 'Start Here',
    description: 'Learn the Motify product marketing workflow, from a focused brief and product context to a clear, publishable first video.',
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

export const PROMPT_TEMPLATES: readonly PromptTemplate[] = [
  {
    id: 'saas-product-launch',
    title: 'SaaS Product Launch',
    description: 'Launch a SaaS product with a hook, problem, brand reveal, feature proof, product shot, and CTA.',
    format: '20s · 1920×1080 · 16:9',
    prompt: `Build a 20-second [FORMAT: 1920x1080 16:9] launch video for [PRODUCT NAME] by [COMPANY NAME]: [ONE-LINE DESCRIPTION]. Audience: [TARGET AUDIENCE]. One master GSAP timeline, HTML/CSS/inline SVG only, no photos or stock video, all layers named and editable, a #camera wrapper per scene.

STYLE: soft light-grey gradient background (#F7F7F8 to #E4E4E7) with 4 large blurred white blobs drifting slowly. Text in [FONT, default Inter] weights 600/700, letter-spacing -0.02em, ink #111. Accent color [BRAND COLOR HEX] used only for key words, motion paths, and the logo. No third-party brand logos. Do not use glitch, RGB split, scan lines, or digital-noise transitions unless explicitly requested.

ANIMATION QUALITY: one evolving accent spline threads through the film and motivates scene changes. Every scene needs a clear hero action, a quieter secondary action, and a visible settle before the next beat. Use expo.out entrances, back.out(1.35) pops, power3.in exits, curved motion paths, layered parallax, and directional SVG motion blur on fast moves. Avoid fade-only entrances and do not repeat the same transition twice. Keep copy readable for at least 0.7s after it settles.

SCENE 1 (0-2s) Hook: centered text "[HOOK LINE]" at 90px bold. The line rises through a clipped mask while "[KEY WORD]" follows the accent spline 4 frames later, overshoots slightly, and draws a short underline. Background blobs drift at three depths.
SCENE 2 (2-4.5s) Problem: the underline accelerates offscreen and whip-pans into a charcoal stage. Five small workload chips crowd the frame on curved paths, briefly obscuring the center before snapping outward and defocusing. White text "[PROBLEM STATEMENT]" resolves sharply in the cleared space. Transition out through a circular focus pull, not a glitch.
SCENE 3 (4.5-8s) Brand reveal: the focus circle becomes a 210px accent squircle tile with a simple logo glyph for [COMPANY NAME]. It anticipates with an 8% squash, pops forward, slides left with shadow lag, and "[PRODUCT NAME]" types beside it. "[TAGLINE]" draws on in accent as tiny orbiting dots settle into the logo.
SCENE 4 (8-13s) Features: heading "[SECTION HEADING]" reveals with a left-to-right text mask. Three pastel pill cards (645x172px, radius 44px; pink #FFC9D0, blue #CFE0FF, green #CCF7CC) travel up the accent spline and stack with springy overlap: "[FEATURE 1 TITLE]" / "[FEATURE 1 SUBTITLE]", "[FEATURE 2 TITLE]" / "[FEATURE 2 SUBTITLE]", "[FEATURE 3 TITLE]" / "[FEATURE 3 SUBTITLE]". Their oversized SVG icons peek beyond the right and bottom edges, rotate 8-14 degrees on entry, then settle with follow-through.
SCENE 5 (13-17s) Product shot: the top feature card tilts toward camera and unfolds into a CSS 3D [DEVICE: phone / laptop]. Its screen shows [SCREEN DESCRIPTION: e.g. a dashboard with a bar chart and a sidebar] built from simple HTML shapes that animate in sequence. Three chips—"[CHIP 1]", "[CHIP 2]", "[CHIP 3]"—orbit on different elliptical paths with scale and blur for depth while the device counter-rotates 20 degrees.
SCENE 6 (17-20s) CTA: the camera dives through the device screen into dark navy (#0D0F1A). Logo tile and "[PRODUCT NAME]" land at center. A white URL pill grows from the final accent-path dot and types "[WEBSITE URL]"; its accent arrow button recoils, launches forward 10px, and settles. Subline "[CTA TEXT]" rises in grey. Hold the finished lockup for 0.8s.`,
  },
  {
    id: 'feature-announcement',
    title: 'Feature Announcement / Product Update',
    description: 'Introduce one product update through a focused UI demo, before-and-after proof, and CTA.',
    format: '12s · 1920×1080 · 16:9',
    prompt: `Build a 12-second [FORMAT: 1920x1080 16:9] feature announcement for [PRODUCT NAME] by [COMPANY NAME]. The new feature is "[FEATURE NAME]": [WHAT IT DOES IN ONE SENTENCE]. One master GSAP timeline, HTML/CSS/inline SVG only, named editable layers, #camera wrapper per scene.

STYLE: light gradient background (#F7F7F8 to #E4E4E7) with blurred white blobs, [FONT, default Inter] 600/700, ink #111, accent [BRAND COLOR HEX], soft shadows (0 25px 60px rgba(0,0,0,.18)). No third-party brand logos. Do not use glitch, RGB split, scan lines, or noise cuts.

ANIMATION QUALITY: treat the cursor as a character and the feature UI as the stage. Give the cursor anticipation, arced travel, hover magnetism, click compression, and a fading accent trail. UI reactions must cascade from the clicked control instead of appearing all at once. Use expo.out, back.out(1.35), perspective tilts, mask reveals, and directional blur; never rely on a plain dissolve for a major beat.

SCENE 1 (0-2s): a small pill "New in [PRODUCT NAME]" rides an accent line in from the left, bends upward, and docks above the headline. "[FEATURE NAME]" at 120px reveals word-by-word through clipped masks; the accent word stretches from 85% to 105% width before settling. Subtitle "[SUBTITLE]" slides into the space the line creates.
SCENE 2 (2-6s) UI demo: the pill expands and unfolds into a rounded app window (1100x650, radius 32px) showing [FEATURE UI DESCRIPTION: e.g. a table with filter chips and a toggle], built from editable HTML cards and rows. The window lands with a subtle 3D tilt. A cursor arcs in, is gently attracted to "[ACTION BUTTON LABEL]", compresses the button on click, and releases an accent ripple. The response—[RESULT: e.g. rows reorder, a chart draws in]—propagates outward in 0.08s steps. Callouts "[CALLOUT 1]" and "[CALLOUT 2]" draw from the ripple with elbowed SVG leader lines; a soft magnifier ring briefly enlarges each target.
SCENE 3 (6-9s) Before/after: the app window rotates 6 degrees and splits into two floating panels. Left panel "Before: [BEFORE STATE]" is muted and slightly recessed; right panel "After: [AFTER STATE]" is accent-tinted and 6% closer to camera. A draggable divider sweeps across once, carrying UI fragments from the old state into their new positions. Finish with the right panel snapping full-frame.
SCENE 4 (9-12s) CTA: one UI control scales rapidly toward camera and becomes a dark navy stage (#0D0F1A). White text "[AVAILABILITY LINE: e.g. Available today for all plans]" rises and settles. Accent button "[CTA TEXT]" draws its border clockwise, fills from left to right, and performs one restrained magnetic pulse. "[WEBSITE URL]" appears below in grey. Hold 0.7s.`,
  },
  {
    id: 'problem-solution-explainer',
    title: 'Problem to Solution Explainer',
    description: 'Turn a customer pain into a clear product story with steps, benefits, proof, and a closing CTA.',
    format: '30s · 1920×1080 · 16:9',
    prompt: `Build a 30-second [FORMAT: 1920x1080 16:9] explainer video for [COMPANY NAME]'s [PRODUCT NAME], which helps [AUDIENCE] to [CORE BENEFIT]. One master GSAP timeline, HTML/CSS/inline SVG only, named editable layers, #camera wrapper per scene.

STYLE: soft light gradient background with blurred white blobs, [FONT, default Inter] 600/700, ink #111, accent [BRAND COLOR HEX]. No third-party brand logos or photos. Do not use glitch, RGB split, scan lines, or digital-noise transitions.

ANIMATION QUALITY: the story moves from visual overload to satisfying order. Use asymmetric curved orbits, foreground/background scale, text masks, camera push-ins, and directional blur. Elements should anticipate, overshoot, and settle with small follow-through. Each transition must transform an existing object into the next scene's first object; avoid unrelated hard cuts and fade-only movement.

SCENE 1 (0-3s) Setup: small text "[SETUP LINE: e.g. These days]" appears through a narrow focus band. A simple icon of [SUBJECT ICON] grows from an accent dot with 10% squash-and-stretch; two faint echo shapes trail it and dissolve as it settles.
SCENE 2 (3-8s) Pain: "[PAIN HEADLINE]" at 90px pushes toward camera while five flat tool glyphs—"[TOOL/PAIN 1]", "[TOOL/PAIN 2]", "[TOOL/PAIN 3]", "[TOOL/PAIN 4]", "[TOOL/PAIN 5]"—orbit a CSS 3D phone on different curved paths and depth planes. Their paths tighten, labels overlap, notification dots multiply, and the phone tilts under the visual weight. The accent keyword stays sharp while the clutter smears directionally.
SCENE 3 (8-10s) Consequence: the crowded orbit collapses into one tiny central dot; the background irises to charcoal around it. The dot stretches into a thin beam that reveals white text "[CONSEQUENCE LINE]" from the center outward. Let the words drift apart by 8px as the camera slowly pushes in—clean, tense, and quiet, with no glitch treatment.
SCENE 4 (10-13s) Reveal: the beam bends into an accent path and redraws the logo tile for [COMPANY NAME]. The tile pops forward, slides left with shadow follow-through, and "[PRODUCT NAME]. [TAGLINE]." types beside it. The scattered pain glyphs re-enter as tiny organized dots and lock into a neat grid behind the logo.
SCENE 5 (13-19s) How it works: heading "[HOW IT WORKS HEADING]" reveals as the accent path draws downward. Three pastel pill cards (pink, blue, green, 645x172px) travel along it, rotate from -6/4/-3 degrees, and click into an orderly stack: "[STEP 1 TITLE]" / "[STEP 1 SUBTITLE]", "[STEP 2 TITLE]" / "[STEP 2 SUBTITLE]", "[STEP 3 TITLE]" / "[STEP 3 SUBTITLE]". Numbered dots 1, 2, 3 pulse only as each corresponding card arrives; card icons perform a small secondary action after the text settles.
SCENE 6 (19-25s) Benefits: the stack fans outward in 3D and becomes three large rounded cards. Each card has an SVG icon and headline—"[BENEFIT 1]", "[BENEFIT 2]", "[BENEFIT 3]"—plus [PROOF 1: e.g. "3x faster"], [PROOF 2], [PROOF 3]. Animate the first proof as an odometer, the second as a circular stroke, and the third as a check made from two springing line segments. The camera pans across the cards with foreground parallax instead of showing all three statically.
SCENE 7 (25-30s) CTA: the final check expands into a wipe to dark navy (#0D0F1A). Logo tile and "[PRODUCT NAME]" assemble from the ordered dots at center. Subline "[CTA TEXT]" rises below. A white URL pill grows from a dot, types "[WEBSITE URL]", and gives one soft elastic settle. Hold the finished composition for 1s.`,
  },
  {
    id: 'kinetic-brand-statement',
    title: 'Kinetic Typography Brand Statement',
    description: 'Express a company belief through tightly directed kinetic type, contrast, and a clean sign-off.',
    format: '15s · 1920×1080 · 16:9',
    prompt: `Build a 15-second [FORMAT: 1920x1080 16:9] kinetic typography brand film for [COMPANY NAME], expressing the belief: "[CORE BELIEF OR MISSION STATEMENT]". Typography only (no photos, no stock video). One master GSAP timeline, HTML/CSS/inline SVG only, named editable layers, #camera wrapper per scene.

STYLE: alternate between light gradient scenes (#F7F7F8 to #E4E4E7 with blurred white blobs), one saturated accent scene, and one black scene. [FONT, default Inter] weights 600/700, letter-spacing -0.03em, ink #111, accent [BRAND COLOR HEX]. Do not use glitch, RGB split, scan lines, or noise cuts.

ANIMATION QUALITY: make typography behave like physical material. Mix clipped line reveals, word swaps, variable-width stretching, baseline waves, letter tunnels, underline drawing, and camera crops. Give fast words directional SVG blur, then a crisp settle. Use anticipation and follow-through on scale changes. Every scene must introduce a different typographic idea; never transition six scenes with the same zoom or dissolve.

SCENE 1 (0-3s): "[LINE 1]" at 100px reveals through three horizontal masks. "[EMPHASIS WORD 1]" arrives 4 frames later along a shallow arc, stretches from 70% to 110% width, and settles at 100%. Camera pushes from 100% to 210% until the final word becomes an abstract crop that fills the frame.
SCENE 2 (3-6s): the cropped letter becomes a window containing "[LINE 2]". Words climb in one at a time with a 0.08s overlap; alternating words enter from above and below, then their baselines ripple once like a wave. One tiny accent word drifts behind at 60% scale for parallax.
SCENE 3 (6-8s) Contrast: the words compress into a single vertical bar that flips the frame to black as it sweeps across. White text "[CONTRAST LINE: the problem or old way]" appears too tightly tracked, then exhales to normal spacing while a soft radial spotlight opens behind it. End by letting one keyword fall downward and pull the whole line with it—no glitch treatment.
SCENE 4 (8-11s): the falling keyword lands on a saturated accent-colored floor and bounces into "[LINE 3: the turn]" at 110px. "[EMPHASIS WORD 2]" travels forward from deep Z-space, overshoots, and casts a short shadow. A thin underline draws left-to-right, loops around the word once, then becomes the next transition.
SCENE 5 (11-13s): the loop expands into a light frame containing "[LINE 4: the promise]". Build the line from oversized letters arriving at different depths; they snap to one baseline and scale from 94% to 100% with a restrained back.out settle. Add a faint echo line that lags by 3 frames and disappears.
SCENE 6 (13-15s) Sign-off: the last period expands into an accent squircle logo tile for [COMPANY NAME]. It squashes on arrival, slides left, and "[COMPANY NAME]. [TAGLINE]." types beside it while the background blobs slow almost to a stop. Hold 1s.`,
  },
  {
    id: 'stats-social-proof',
    title: 'Stats and Social Proof',
    description: 'Build credibility with supplied metrics, testimonial cards, customer names, and a concise CTA.',
    format: '15s · 1920×1080 · 16:9',
    prompt: `Build a 15-second [FORMAT: 1920x1080 16:9] social-proof video for [COMPANY NAME]'s [PRODUCT NAME], aimed at [AUDIENCE]. One master GSAP timeline, HTML/CSS/inline SVG only, named editable layers, #camera wrapper per scene. Use only the numbers and quotes I provide.

STYLE: light gradient background with blurred white blobs, [FONT, default Inter] 600/700, ink #111, accent [BRAND COLOR HEX]. Cards: white, radius 36px, shadow 0 25px 60px rgba(0,0,0,.15). No photos or third-party logos. Do not use glitch, RGB split, scan lines, or noisy distortion.

ANIMATION QUALITY: make the data feel tactile and celebratory without becoming casino-like. Use 3D card fanning, odometer rolls, stroke drawing, sparkline travel, spotlight sweeps, carousel depth, and small star/icon follow-through. Every metric must animate in a way that explains its graphic. Keep all supplied numbers and quotes exact; never invent proof.

SCENE 1 (0-2s) Hook: "[HOOK LINE]" at 90px rises through a clipped mask. "[KEY WORD]" arrives as an accent-colored counter tile that flips once and clicks into the sentence; a soft spotlight follows it across the background.
SCENE 2 (2-7s) Stats: three cards fan from one central stack with perspective and land at slightly different rotations. Card 1 rolls to "[STAT 1 VALUE]" above "[STAT 1 LABEL]" while an accent progress ring chases the count. Card 2 rolls to "[STAT 2 VALUE]" / "[STAT 2 LABEL]" as a segmented bar fills with 0.05s overlap. Card 3 rolls to "[STAT 3 VALUE]" / "[STAT 3 LABEL]" while a sparkline draws and its endpoint bounces once. After each completes, the next card moves 4% closer to camera; finish with all three aligned and readable.
SCENE 3 (7-11s) Testimonials: the stat cards rotate edge-on and become a two-card quote carousel. Card 1 shows "[QUOTE 1]" and "[NAME 1], [ROLE 1] at [CUSTOMER COMPANY 1]"; Card 2 shows "[QUOTE 2]" and "[NAME 2], [ROLE 2] at [CUSTOMER COMPANY 2]". Colored initial avatars roll in along the card edge. Five accent stars draw as tiny strokes, overshoot, and settle. Keep one card foregrounded while the other peeks from behind for depth.
SCENE 4 (11-13s) Trust row: the carousel spins into a thin accent line under "[TRUST HEADING: e.g. Trusted by teams at]". Four soft grey text pills—"[CUSTOMER 1]", "[CUSTOMER 2]", "[CUSTOMER 3]", "[CUSTOMER 4]"—ride the line in as a wave, alternating 12px above and below it before snapping to one row.
SCENE 5 (13-15s) CTA: the accent line loops into a circle and expands to reveal dark navy (#0D0F1A). Logo tile and "[COMPANY NAME]" assemble at center. Accent button "[CTA TEXT]" performs one press-and-release motion; "[WEBSITE URL]" draws below in grey. Hold 0.7s.`,
  },
  {
    id: 'how-it-works',
    title: 'How It Works: 3 Steps',
    description: 'Explain a product workflow in three connected steps with mini UI demonstrations and a final CTA.',
    format: '20s · 1920×1080 · 16:9',
    prompt: `Build a 20-second [FORMAT: 1920x1080 16:9] "how it works" video for [PRODUCT NAME] by [COMPANY NAME], which helps [AUDIENCE] to [CORE BENEFIT] in three steps. One master GSAP timeline, HTML/CSS/inline SVG only, named editable layers, #camera wrapper per scene.

STYLE: light gradient background with blurred white blobs, [FONT, default Inter] 600/700, ink #111, accent [BRAND COLOR HEX]. A 6px curved accent line with rounded caps connects the whole film and is drawn with stroke-dashoffset. No photos or third-party brand logos. Do not use glitch, RGB split, scan lines, or noise cuts.

ANIMATION QUALITY: the accent line is both navigator and shape-shifter. It guides camera pans, becomes UI borders, loops around icons, and resolves into the CTA bar. Use path-following motion, bank objects slightly into curves, add near/mid/far parallax, and give every numbered stop anticipation plus a clean settle. Each mini UI must show a meaningful action and result, not decorative loading.

SCENE 1 (0-3s) Intro: "[INTRO LINE: e.g. [GOAL] in three steps]" at 90px reveals in two clipped lines. The number or key word arrives on an accent dot, overshoots its baseline, and settles. The dot loops once around the headline, then draws the 6px path offscreen as the camera begins to follow.
SCENE 2 (3-8s) Step 1: the camera banks gently along the line toward badge "1"; foreground dots cross faster than background blobs. The line wraps into a large squircle icon of [STEP 1 ICON], which pops with squash-and-stretch. "[STEP 1 TITLE]" and "[STEP 1 DESCRIPTION]" reveal beside a mini UI showing [STEP 1 UI: e.g. a text input being typed into]. Type the input character-by-character, show a cursor blink, then let the line become the input's focus border before exiting toward step 2.
SCENE 3 (8-13s) Step 2: the camera overtakes a few small path markers and eases onto badge "2". Icon [STEP 2 ICON], "[STEP 2 TITLE]", and "[STEP 2 DESCRIPTION]" arrive on staggered depth planes. Mini UI: [STEP 2 UI: e.g. cards populating one by one with a loading shimmer]. Replace generic shimmer with three cards that grow from the path, populate in sequence, and settle with slight rotation follow-through.
SCENE 4 (13-18s) Step 3: the line corkscrews once in shallow 3D and flattens into badge "3". Icon [STEP 3 ICON], "[STEP 3 TITLE]", and "[STEP 3 DESCRIPTION]" resolve as the mini UI performs [STEP 3 UI: e.g. a finished result card with a green tick that pops in]. Build the result from separate pieces, then draw the tick as two springing SVG strokes. All three numbered badges briefly appear connected in the background before the camera pushes into the tick.
SCENE 5 (18-20s) CTA: the tick becomes a wipe to dark navy (#0D0F1A). Logo tile and "[PRODUCT NAME]" settle at center. The continuous line completes its journey by curling into a white pill bar, typing "[WEBSITE URL]", and docking an accent arrow at the right. Subline "[CTA TEXT]" rises in grey. Hold 0.6s.`,
  },
  {
    id: 'event-webinar-promo',
    title: 'Event / Webinar Promo',
    description: 'Promote an event with a date-led hook, title reveal, optional speakers, agenda, and registration CTA.',
    format: '15s · 1920×1080 · 16:9',
    prompt: `Build a 15-second [FORMAT: 1920x1080 16:9] promo video for [COMPANY NAME]'s [EVENT TYPE: webinar / conference / live demo / launch event] "[EVENT TITLE]". One master GSAP timeline, HTML/CSS/inline SVG only, named editable layers, #camera wrapper per scene. No photos.

STYLE: light gradient background with blurred white blobs, [FONT, default Inter] 600/700, ink #111, accent [BRAND COLOR HEX]. Use simple celebratory geometry—rings, ticket notches, calendar tabs, rays, dots—rather than confetti everywhere. Do not use glitch, RGB split, scan lines, or noise cuts.

ANIMATION QUALITY: build the promo around an evolving event-ticket motif. Use clipped type, kinetic date numerals, rotating rings, avatar orbit arcs, card stacking, calendar-page flips, and one restrained burst of shapes. Give fast moves directional blur, give icons springy follow-through, and reserve at least 0.6s of readable hold per information beat. Avoid repeated zoom transitions and fade-only entrances.

SCENE 1 (0-2s) Date hook: an accent ticket pill "[EVENT TYPE] · [DATE]" tears on from the left through a clipped mask, complete with two semicircle notches. Its date numerals roll vertically and stop with a tiny bounce. Below, "[HOOK QUESTION: e.g. Ready to [GOAL]?]" rises at 90px while one keyword follows a curved accent ray into place.
SCENE 2 (2-4s) Title reveal: the ticket expands to fill the frame, flips edge-on, and reveals a dark navy reverse side. "[EVENT TITLE]" at 120px appears through three rotating rings that align like an aperture; the title starts oversized and settles to 100% as the rings become a thin halo. Use a clean poster-style reveal, not a glitch.
SCENE 3 (4-8s) Speakers: the halo arcs back onto the light background as three circular avatar placeholders with initials. They orbit once at different radii, then dock side-by-side with a 0.15s stagger. Show "[SPEAKER NAME]" and "[SPEAKER ROLE]" for [SPEAKER 1], [SPEAKER 2], [SPEAKER 3]. Each avatar gets one subtle secondary motion—a nodding dot, rotating ring segment, or floating badge—after it settles. This scene is optional; if omitted, give the extra time to agenda readability.
SCENE 4 (8-12s) Agenda: the orbit arcs straighten into a vertical schedule line. Three pastel cards (pink, blue, green, 645x172px, radius 44px) travel along it and stack with springy overlap: "[TIME 1]" "[AGENDA ITEM 1]", "[TIME 2]" "[AGENDA ITEM 2]", "[TIME 3]" "[AGENDA ITEM 3]". Times flip like compact calendar tiles; oversized SVG icons peek from the right edge, cropped by the cards, and settle with 6-10 degree rotation follow-through.
SCENE 5 (12-15s) Register: the final calendar tile flips forward and becomes a dark navy (#0D0F1A) registration card showing "[DATE]", "[TIME] [TIMEZONE]", and "[LOCATION OR 'Online']". A restrained burst of six accent rays marks the landing. Button "[CTA TEXT: e.g. Save your seat]" draws its outline, fills, and performs one press-release. A white pill bar expands from the button's highlight and types "[REGISTRATION URL]". Hold 0.7s.`,
  },
  {
    id: 'ai-prompt-to-result',
    title: 'AI Workflow: Prompt to Result',
    description: 'Turn an AI-powered workflow into a tactile prompt, generation, customization, and result story.',
    format: '20s · 1920×1080 · 16:9',
    prompt: `Build a 20-second [FORMAT: 1920x1080 16:9] AI workflow video for [PRODUCT NAME] by [COMPANY NAME]. It turns [USER INPUT] into [FINAL RESULT] for [TARGET AUDIENCE]. One master GSAP timeline, HTML/CSS/inline SVG only, named editable layers, #camera wrapper per scene. Build a fictional interface from simple shapes; do not copy or display third-party product UI or logos.

STYLE: alternate warm black (#09090B) with soft off-white (#F7F7F5) and one full-frame [BRAND COLOR HEX] scene. Use [FONT, default Inter] 600/700, ink #111, white text on dark scenes, rounded UI with 28-36px radii, soft bloom, and fine grain made with a lightweight CSS gradient. Do not use glitch, RGB split, scan lines, or random noise cuts.

ANIMATION QUALITY: the prompt cursor is the recurring hero. It travels between scenes, becomes a microphone pulse, a loading stroke, a selection box, and finally the logo mark. Use traced borders, masked type, cursor magnetism, progress morphs, UI parallax, depth tilts, and result assembly. Every action must cause the next action. Use expo.out, power3.inOut, back.out(1.3), and directional SVG blur; no fade-only beats.

SCENE 1 (0-3s) Question: on warm black, small text "[OPENING QUESTION]" appears inside a soft radial spotlight. A blinking accent cursor types the final key phrase, pauses, then drags a luminous selection across it. The selection rectangle expands into the next scene.
SCENE 2 (3-6s) Prompt: on off-white, a centered prompt composer grows from the selection box. Type "[PROMPT TEXT]" in two natural bursts with a blinking caret. A thin accent border traces around the composer, and two option chips—"[OPTION 1]" and "[OPTION 2]"—spring in underneath. The cursor chooses one chip, then clicks "[GENERATE BUTTON LABEL]" with compression and an outward ripple.
SCENE 3 (6-9s) Input mode: the ripple fills the frame with [BRAND COLOR HEX]. A microphone or upload icon grows from its center and pulses to three concentric waveform rings while text "[INPUT MODE LINE]" reveals through a mask. The rings contract into a single progress pill.
SCENE 4 (9-13s) Generation: return to off-white. The progress pill cycles through "[STATUS 1]", "[STATUS 2]", and "[STATUS 3]" while changing width to fit each label. Around it, interface fragments for [GENERATION UI DESCRIPTION] arrive from shallow Z-depth, snap to a grid, and assemble [FINAL RESULT] piece by piece. Use purposeful stagger and a small completion check, not a generic spinner.
SCENE 5 (13-17s) Customize: the finished result tilts 5 degrees toward camera. A large cursor selects "[EDITABLE ELEMENT]", revealing handles and a compact floating toolbar. It changes [CUSTOMIZATION ACTION], and the result responds immediately with a before/after scrub line. The selected element then detaches, scales toward camera, and becomes the brand transition.
SCENE 6 (17-20s) Finish: the detached element resolves into a simple logo glyph for [COMPANY NAME] on a full-frame brand-color stage. "[PRODUCT NAME]" and "[TAGLINE]" lock beside it. A white pill types "[WEBSITE URL]" while subline "[CTA TEXT]" rises below. Add one quiet logo breathing motion and hold the final lockup for 0.8s.`,
  },
  {
    id: 'visual-product-world-tour',
    title: 'Visual Product World Tour',
    description: 'Present a larger platform through cinematic depth, capability cards, interface proof, and a connected-system finale.',
    format: '25s · 1920×1080 · 16:9',
    prompt: `Build a 25-second [FORMAT: 1920x1080 16:9] visual product world tour for [PRODUCT NAME] by [COMPANY NAME]: [PLATFORM PROMISE]. Audience: [TARGET AUDIENCE]. One master GSAP timeline, HTML/CSS/inline SVG only, named editable layers, #camera wrapper per scene. Use invented product UI and generic icons only; do not recreate any third-party brand, website, or reference video 1:1.

STYLE: dramatic black opening, clean off-white proof scenes, and luminous gradients using [BRAND COLOR HEX] plus [SECONDARY COLOR HEX]. Typography [FONT, default Inter] 600/700. Build depth with CSS perspective, beveled polygon panels, subtle bloom, layered shadows, and restrained glass highlights. Do not use glitch, RGB split, scan lines, or digital-noise transitions.

ANIMATION QUALITY: design one continuous camera journey through a product world. Use an iris made of faceted panels, foreground occlusion, shallow 3D UI planes, card storms that organize into grids, spotlight sweeps, path-drawn system maps, and object-to-object match cuts. Bank the camera gently into moves, add directional blur only while velocity is high, and finish every move with a readable settle. No two scenes may use the same entrance.

SCENE 1 (0-4s) Portal: a small monochrome logo glyph for [COMPANY NAME] appears on off-white, then collapses into a black dot. The dot opens into a dark portal surrounded by 8-10 faceted polygon panels carrying slow [BRAND COLOR HEX] / [SECONDARY COLOR HEX] gradients. The camera flies through the aperture as text fragments assemble into "[OPENING LINE]" at different depths.
SCENE 2 (4-8s) Scale: the final portal panel becomes a tilted product window showing [PRIMARY UI DESCRIPTION]. A soft gradient spotlight travels across the interface while large text "[SCALE OR PROOF LINE]" remains pinned in front. UI rows stream behind it at different speeds; one important row lifts forward and becomes a compact terminal or command card.
SCENE 3 (8-12s) Workflow: on off-white, the command card types "[COMMAND OR INPUT]". Its cursor launches right and pulls three layered UI windows into view, demonstrating [WORKFLOW RESULT]. Windows arrive with slight perspective offsets and shadow lag, then align into one clean composition. Caption "[WORKFLOW HEADLINE]" reveals from the cursor trail.
SCENE 4 (12-17s) Capability wall: the aligned windows rotate edge-on and burst into six dark rounded capability cards that rush from Z-depth, briefly overlap, then organize into an asymmetric wall. Feature the three readable cards "[CAPABILITY 1]", "[CAPABILITY 2]", and "[CAPABILITY 3]" with short subtitles [CAPABILITY 1 DETAIL], [CAPABILITY 2 DETAIL], [CAPABILITY 3 DETAIL]. A large cursor pushes one card aside, causing neighboring cards to reflow with springy collision and follow-through.
SCENE 5 (17-21s) Connected system: the selected card flattens into a purple/accent pill node labeled "[CENTRAL NODE]". Four more nodes—"[NODE 1]", "[NODE 2]", "[NODE 3]", "[NODE 4]"—arrive on curved paths. SVG connectors draw between them, pulses travel down the lines, and the whole graph gently rotates in shallow 3D while the camera pulls back to reveal the system.
SCENE 6 (21-25s) Close: connector lines converge into the logo glyph for [COMPANY NAME]. The graph nodes orbit once and dock into a clean final lockup with "[PRODUCT NAME]" and "[TAGLINE]". A luminous bar sweeps under the logo and resolves into a pill containing "[WEBSITE URL]" and "[CTA TEXT]". Hold for 1s with only slow gradient drift.`,
  },
];

export function resourceCategory(id: ResourceCategoryId): ResourceCategory {
  const category = RESOURCE_CATEGORIES.find((candidate) => candidate.id === id);
  if (!category) throw new Error(`Unknown resource category: ${id}`);
  return category;
}
