export type TemplateFieldType = 'text' | 'number' | 'textarea';

export interface TemplateField {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  readonly defaultValue: string;
  readonly placeholder: string;
  readonly type: TemplateFieldType;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
}

export interface TemplatePromptSegment {
  readonly text?: string;
  readonly field?: string;
  readonly before?: string;
  readonly after?: string;
}

/** The canvas the preview was rendered at; the editor supports each of these. */
export type TemplateAspectRatio = '16:9' | '1:1' | '4:5' | '9:16';

export interface MotionTemplate {
  readonly slug: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly categories: readonly string[];
  readonly video: string;
  readonly aspectRatio: TemplateAspectRatio;
  readonly special?: boolean;
  readonly fields: readonly TemplateField[];
  readonly prompt: readonly TemplatePromptSegment[];
}

const field = (
  key: string,
  label: string,
  description: string,
  defaultValue: string,
  placeholder: string,
  type: TemplateFieldType = 'text',
  constraints: Pick<TemplateField, 'min' | 'max' | 'step'> = {},
): TemplateField => ({ key, label, description, defaultValue, placeholder, type, ...constraints });

export const MOTION_TEMPLATES: readonly MotionTemplate[] = [
  {
    slug: 'bookmebus-journey',
    title: 'One Seat, Then the Whole Journey',
    eyebrow: 'BookMeBus',
    description: 'A connected product story where a ticket transforms into an entire journey.',
    categories: ['Product', 'Kinetic type', '2D'],
    video: '/templates/bookmebus-journey.webm',
    aspectRatio: '16:9',
    fields: [
      field('concept', 'Concept', 'The central idea connecting every scene.', 'One seat, then the whole journey', 'e.g. One tap, then the whole trip'),
      field('typography', 'Typography', 'A Google Font or a few fonts for the model to choose from.', 'Plus Jakarta Sans, Geist or Inter', 'e.g. Plus Jakarta Sans or Geist'),
      field('colors', 'Colors', 'Color names or hex codes.', 'BookMeBus sky blue, navy, orange accent', 'e.g. #45B8E8, navy, orange'),
      field('length', 'Length (seconds)', 'This story works best between 12 and 20 seconds.', '15', '15', 'number', { min: 12, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' },
      { field: 'length' },
      { text: '-second motion design spot for BookMeBus, a Cambodian bus, van, ferry and train booking app. Concept: "' },
      { field: 'concept' },
      { text: '". A ticket becomes a route, becomes a backpack, becomes a destination. Commit to it and name it in one line before you start. Every shot is made out of the previous one: shapes, type and color transform into the next scene instead of cutting or fading. One typeface (a bold geometric sans such as ' },
      { field: 'typography' },
      { text: '), a palette of at most three colors (' },
      { field: 'colors' },
      { text: ') plus black and white, one consistent camera language (flat 2D, soft shadows). Show range: kinetic type ("Pick your seat."), shape morphing (ticket blue to full-screen blue with a bus on a dotted route), a UI moment (backpack with six status pills: Seat confirmed, Boarding point, E-ticket sent, Operator contact, Free Wi-Fi, All set), destination reveals (Kep, Siem Reap, Koh Rong with route labels), and an end title ("You take the seat. We handle the rest."). </direction>\n\n<structure> Open on a single seat-selection tile. The selected seat compresses into a ticket; its edge extends into a dotted route as a bus travels across the frame. The route folds into a backpack and the six status pills lock into place around it. The backpack tag stretches into destination cards for Kep, Siem Reap and Koh Rong. Finish by folding the route back into the BookMeBus end card and the line "You take the seat. We handle the rest." Keep every transition motivated by the object already on screen. </structure>' },
    ],
  },
  {
    slug: 'showreel',
    title: 'Fold & Flight',
    eyebrow: 'Paper Airplane Showreel',
    description: 'A beat-driven showreel where a paper plane carries every transition.',
    categories: ['Showreel', 'Kinetic type', '3D'],
    video: '/templates/fold-and-flight.webm',
    aspectRatio: '16:9',
    fields: [
      field('concept', 'Concept', 'The central visual idea that connects the video.', 'Travel agency, paper airplane 2D animation', 'e.g. Ink becomes type becomes architecture'),
      field('typography', 'Typography', 'A Google Font or a few fonts for the model to choose from.', 'Geist, Inter or a bold display face from Google Fonts', 'e.g. Geist and a bold display face'),
      field('colors', 'Colors', 'Keep the palette intentionally limited.', 'at most three colors plus black and white', 'e.g. cobalt, cream and vermilion'),
      field('length', 'Length (seconds)', 'A focused showreel works best from 15 to 30 seconds.', '15', '15', 'number', { min: 15, max: 30, step: 1 }),
      field('tempo', 'Tempo (BPM)', 'The beat that guides the animation timing.', '120', '120', 'number', { min: 100, max: 128, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second motion design showreel that proves you are a world-class motion designer. Concept: ' }, { field: 'concept' },
      { text: '. Commit to it and name it in one line before you start. Every shot is made out of the previous one: shapes, type and color transform into the next scene instead of cutting or fading. One typeface (' }, { field: 'typography' },
      { text: '), a palette of ' }, { field: 'colors' },
      { text: ', one consistent camera language. Show range: kinetic type, shape morphing, a 2D-to-3D moment, a data or UI moment, and an end title. Give each one an equal share of the time. Banned: particle bursts, glows, lens flares, camera shake, RGB split, crossfades, generic gradients, bouncy easing, holds longer than half a second, anything that looks like a template. </direction>\n\n<structure> ' },
      { field: 'tempo' },
      { text: ' BPM, something happens on every beat. First bar: hook. Then one technique per bar, each flowing out of the last. Last full bar: the strongest moment. Final half bar: end title, and the final frame matches the first so it loops. </structure>' },
    ],
  },
  {
    slug: 'opus-motion-designer',
    title: 'Opus 5.5 — Motion Designer',
    eyebrow: 'Motion system study',
    description: 'A precise orange-dot motif travels through UI, type, graphs, and shape.',
    categories: ['Showreel', 'Typography', 'UI'],
    video: '/templates/opus-motion-designer.webm',
    aspectRatio: '16:9',
    fields: [
      field('colors', 'Colors', 'The core canvas, background, and accent palette.', 'warm off-white, near-black, vivid orange', 'e.g. cream, charcoal, electric blue'),
      field('motif', 'Connecting motif', 'The object that travels through every scene.', 'orange dot', 'e.g. cobalt square'),
      field('length', 'Length (seconds)', 'Keep the study tight and energetic.', '15', '15', 'number', { min: 10, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A 2D motion design film in 16:9. Use a ' }, { field: 'colors' },
      { text: ' palette. The ' }, { field: 'motif' },
      { text: ' connects every scene: it starts in the UI, becomes the dot over a letter, traces a spring graph, grows into a shape and returns on the end card. A cursor makes the opening click feel real. Keep the motion sharp and controlled, with small spring overshoots and no dead time. Banned: stock footage, gradients, glows, particle bursts, random transitions and motion that isn\'t connected to an element already on screen. </direction>\n\n<structure> Around ' }, { field: 'length' },
      { text: ' seconds, with a visual change on every major beat. Open: a cursor clicks the orange toggle beside "Reduce Motion". The letters bend and move into place until only "Motion" remains, with the orange dot above the "i". Spring: the dot jumps away from the word and lands on a graph. Its path draws a spring response, overshoots the target and settles beside a "+22%" callout. Shape: the dot shoots across a line, grows into an orange circle and fills the frame. A black rounded square rotates inside it, then stretches into a pill. The scene contracts to a single orange dot on black. Type: words like "SPRINGS", "EASING", "KINETIC TYPE", "3D" and "SOUND" orbit the dot. The circle of type opens out into a field of tiny dots. Reveal: the halftone field expands and flips to black, revealing the final card: "Opus 5.5", "Motion designer." and "0 keyframes". </structure>' },
    ],
  },
  {
    slug: 'paper-moon',
    title: 'Paper Moon',
    eyebrow: 'Animated short',
    description: 'A tiny paper boat chases the moon through an emotional hand-drawn journey.',
    categories: ['Storytelling', '2D', 'Character'],
    video: '/templates/paper-moon.webm',
    aspectRatio: '16:9',
    fields: [
      field('concept', 'Concept', 'The character, desire, and emotional goal.', 'A tiny paper boat tries to reach the moon', 'e.g. A matchstick searches for the sunrise', 'textarea'),
      field('length', 'Length (seconds)', 'Short-film structure tuned for 12 to 25 seconds.', '15', '15', 'number', { min: 12, max: 25, step: 1 }),
      field('style', 'Visual style', 'Describe the drawing and animation treatment.', 'expressive hand-drawn shapes, unusual compositions, and fluid frame-by-frame animation', 'e.g. cut paper, graphite lines, restrained watercolor', 'textarea'),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second, entirely 2D animated short film. Concept: **' }, { field: 'concept' },
      { text: '.** Tell a complete visual story with no dialogue. The boat sails across a puddle, gets swept into a rushing stream, survives a waterfall, and discovers that the moon it has been chasing is only a reflection. At the final moment, the sun rises, the reflection disappears, and the boat finds itself floating in an endless ocean. Turn the ending into a surprising new beginning. Use ' }, { field: 'style' },
      { text: '. Let the world transform organically as the story progresses. Build emotion through timing, scale, anticipation, and visual contrast rather than decorative effects. Make it feel like a short film from an independent animation studio, not a motion graphics template. Unexpected, charming, cinematic, and visually inventive. Every second must advance the story. End on an unforgettable image.' },
    ],
  },
  {
    slug: 'motify-product-agent',
    title: 'Generate with Tiffy',
    eyebrow: 'Motify product workflow',
    description: 'An agent-first workflow that turns verified product UI into a Motify-ready brief.',
    categories: ['Special', 'Product', 'UI'],
    video: '/templates/motify-generate-with-tiffy.webm',
    aspectRatio: '16:9',
    special: true,
    fields: [
      field('feature', 'Feature to showcase', 'Tell the coding agent which real workflow to inspect.', 'the primary product-generation workflow', 'e.g. Brand DNA setup or prompt-to-video flow', 'textarea'),
      field('length', 'Length (seconds)', 'The duration of the final product animation.', '12', '12', 'number', { min: 8, max: 20, step: 1 }),
      field('format', 'Format', 'Canvas size and orientation for the resulting brief.', '1080×1080 square', 'e.g. 1920×1080 landscape'),
    ],
    prompt: [
      { text: 'Inspect the actual product codebase and UI. Identify ' }, { field: 'feature' },
      { text: ', understand how users interact with it, and return a complete, production-ready prompt containing both <direction> and <structure> blocks.\n\n1. <direction>\nWrite a concise creative brief for a ' }, { field: 'length' },
      { text: '-second, ' }, { field: 'format' },
      { text: ' product animation at 29.97 fps, mastered at 59.94 fps.\nInclude:\n- Visual style, art direction, palette, typography, and brand identity based on the actual product.\n- A clear visual story following the user\'s journey through the feature.\n- How the most important interactions, interface responses, and final outcome should be animated.\n- Motion language, pacing, camera behavior, and transitions.\n- Creative constraints that prevent generic templates and inaccurate UI.\nThe direction should describe the intended visual experience, not prescribe every scene\'s exact implementation. Make it specific to the product and feature.\n\n2. <structure>\nDocument the actual product UI and user workflow in enough detail for an animation system to recreate it accurately.\nInclude:\n- Product: Name, purpose, and core value proposition.\n- Feature: What it does and why it matters.\n- Entry point: Where the user starts, including navigation paths and relevant controls.\n- Workflow: Numbered user actions, such as clicking buttons, entering text, selecting options, and submitting forms.\n- UI details: Actual labels, component types, dimensions, colors, typography, layout, spacing, and positioning.\n- System responses: What visibly changes after each action, including menus, dialogs, loading states, animations, and results.\n- Final state: What the user achieves and what the interface looks like afterward.\n- Brand identity: Actual logo, brand colors, fonts, and visual conventions.\n\nUse concrete values where they can be verified from the codebase. Use relative positions when exact coordinates are responsive or unavailable. Clearly distinguish verified details from unknowns. Treat the actual codebase as the source of truth. Follow real component implementations, interaction handlers, navigation, and state changes. Select the most visually compelling steps for the animation instead of trying to represent every workflow detail. Keep <direction> focused on storytelling and visual treatment, and <structure> focused on factual product UI and behavior. Make the two blocks consistent. Do not invent features, UI elements, brand claims, or interaction behavior. Do not modify the codebase.\n\nReturn only the two complete blocks, in this exact order:\n<direction> ... </direction>\n<structure> ... </structure>' },
    ],
  },
  {
    slug: 'moticrm-chaos-to-clarity',
    title: 'Customer Chaos to Clarity',
    eyebrow: 'MotiCRM',
    description: 'A hand-drawn product story where scattered relationships flow into one calm workspace.',
    categories: ['Product', 'Storytelling', '2D'],
    video: '/templates/moticrm-chaos-to-clarity.webm',
    aspectRatio: '16:9',
    fields: [
      field('product', 'Product name', 'The product the story is about.', 'MotiCRM', 'e.g. Fieldnote'),
      field('productType', 'What it is', 'One short phrase describing the product.', 'a CRM app', 'e.g. a client portal for agencies'),
      field('story', 'Story', 'The transformation the film should show.', 'turning scattered customer relationships into meaningful connections and organized growth', 'e.g. turning lost leads into loyal customers', 'textarea'),
      field('length', 'Length (seconds)', 'This story works best between 12 and 20 seconds.', '15', '15', 'number', { min: 12, max: 20, step: 1 }),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second cinematic 2D animated product demo in 16:9 for ' }, { field: 'product' },
      { text: ', ' }, { field: 'productType' },
      { text: '. Tell a complete visual story about ' }, { field: 'story' },
      { text: '. Open with a compelling visual hook, then reveal ' }, { field: 'product' },
      { text: ' through fluid, purposeful interface interactions that demonstrate how it works. Let customer information, conversations, deals, and relationships flow naturally into a unified workspace. Show the product solving a real problem rather than simply displaying features. Use expressive hand-drawn shapes, unexpected compositions, seamless transitions, and inventive frame-by-frame animation. Build momentum through timing, scale, anticipation, and visual contrast. Make the interface feel alive without sacrificing clarity or usability. Premium independent animation studio quality, with a distinctive creative vision. No dialogue, no generic dashboards, no decorative effects, no motion graphics template clichés. Every second must advance the story. End with a striking visual that communicates how ' }, { field: 'product' },
      { text: ' turns customer chaos into clarity.' },
    ],
  },
  {
    slug: 'codeloom-red-to-green',
    title: 'Red to Green',
    eyebrow: 'Codeloom · AI coding tool',
    description: 'One failing test, one thread through the repo, one green check.',
    categories: ['Product', 'UI'],
    video: '/templates/codeloom-red-to-green.webm',
    aspectRatio: '16:9',
    fields: [
      field('product', 'Product name', 'The AI coding tool being launched.', 'Codeloom', 'e.g. Patchwork'),
      field('promise', 'What it does', 'The promise of the tool in one phrase.', 'reads your whole repository and ships the fix', 'e.g. reviews every pull request before you do', 'textarea'),
      field('colors', 'Colors', 'Keep it to a dark canvas and one success color.', 'near-black, terminal green #3DDC84, warm white, and one red reserved for the failing test', 'e.g. charcoal, cyan, white, red'),
      field('typography', 'Typography', 'A code face and a statement face.', 'JetBrains Mono for code, Inter for statements', 'e.g. IBM Plex Mono and Geist'),
      field('tagline', 'End line', 'The final line on the end card.', 'Describe the fix. Review the diff. Ship.', 'e.g. Less debugging. More shipping.'),
      field('length', 'Length (seconds)', 'Tight and technical works best from 12 to 20 seconds.', '15', '15', 'number', { min: 12, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second 16:9 product film for ' }, { field: 'product' },
      { text: ', an AI coding agent that ' }, { field: 'promise' },
      { text: '. Concept: a single red failing test turns green, and everything the agent touched on the way is shown as one continuous thread. Dark editor canvas with a palette of ' }, { field: 'colors' },
      { text: '. Typography: ' }, { field: 'typography' },
      { text: '. The code is real and legible: short TypeScript lines, never lorem ipsum or blurred text. A cursor appears only while the agent is typing. Transitions grow out of the code itself: a line extends into a diff, a diff folds into a file tree, a file tree collapses into a single check mark. Banned: hacker clichés, matrix rain, glitch, holographic HUDs, floating 3D laptops, glowing brains, neon gradients. </direction>\n\n<structure> Open on a terminal where `npm test` prints "1 failing: checkout.test.ts" in red. A prompt bar types "Fix the failing checkout test." The agent\'s thread draws a line from the error into the repository and three files light up in the tree: cart.ts, pricing.ts, checkout.test.ts. Push into pricing.ts as a two-line diff writes itself: the rounding bug removed in red, the fix added in green. The thread pulls back out, the tests rerun line by line, and the red line flips to "12 passing". The green check expands into the end card: "' }, { field: 'product' },
      { text: '" and "' }, { field: 'tagline' },
      { text: '" </structure>' },
    ],
  },
  {
    slug: 'kept-every-coin',
    title: 'Every Coin Has a Place',
    eyebrow: 'Kept · Banking app',
    description: 'A vertical fintech story where one paycheck rolls into labelled jars.',
    categories: ['Product', 'UI', '2D'],
    video: '/templates/kept-every-coin.webm',
    aspectRatio: '9:16',
    fields: [
      field('product', 'Product name', 'The banking app being shown.', 'Kept', 'e.g. Ledgerly'),
      field('productType', 'What it does', 'The core promise of the app.', 'a mobile banking app that sorts every paycheck into goals automatically', 'e.g. a savings app for freelancers', 'textarea'),
      field('goals', 'Goals', 'Four savings jars the paycheck fills.', 'Rent, Groceries, Travel fund, Emergency', 'e.g. Tuition, Bills, Wedding, Rainy day'),
      field('colors', 'Colors', 'A calm, trustworthy palette.', 'deep forest green, cream, and a single coin gold', 'e.g. navy, white, mint'),
      field('typography', 'Typography', 'A friendly, legible sans.', 'Plus Jakarta Sans', 'e.g. Manrope'),
      field('tagline', 'End line', 'The final line on the end card.', 'Every dollar, already somewhere good.', 'e.g. Money with a plan.'),
      field('length', 'Length (seconds)', 'Social-length vertical works best from 10 to 20 seconds.', '15', '15', 'number', { min: 10, max: 20, step: 1 }),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second vertical 9:16 2D animated product film for ' }, { field: 'product' },
      { text: ', ' }, { field: 'productType' },
      { text: '. Concept: a single coin finds its place. A paycheck arrives as one heavy gold coin, splits into smaller coins that roll into four labelled jars (' }, { field: 'goals' },
      { text: '), and the jars become the app\'s goal cards on a phone screen that fills the frame. Show one real interaction: a thumb drags the third goal\'s slider from 20% to 30% and every jar rebalances with physical weight. Numbers count up with tabular figures, amounts are realistic, and the interface stays calm and trustworthy: generous spacing, rounded cards, one accent color. Palette: ' }, { field: 'colors' },
      { text: '. Typeface: ' }, { field: 'typography' },
      { text: '. Compose for the tall frame from the start: coins fall top to bottom, jars stack vertically, nothing is a centered landscape layout. Motion is weighted and reassuring: coins have mass, jars settle with a small overshoot, nothing flashes. Banned: credit cards flying past, dollar-sign rain, stock-chart arrows, glows, confetti. End on the phone screen pulling back into a single jar with the line "' }, { field: 'tagline' },
      { text: '" and the ' }, { field: 'product' },
      { text: ' wordmark.' },
    ],
  },
  {
    slug: 'hush-turn-the-world-down',
    title: 'Turn the World Down',
    eyebrow: 'Hush · Product ad',
    description: 'A 4:5 feed ad where city noise collapses into a single quiet line.',
    categories: ['Marketing', 'Product', 'Kinetic type'],
    video: '/templates/hush-turn-the-world-down.webm',
    aspectRatio: '4:5',
    fields: [
      field('product', 'Product name', 'The physical product being advertised.', 'Hush', 'e.g. Halo Buds'),
      field('productDescription', 'Product', 'What the product is.', 'noise-cancelling over-ear headphones', 'e.g. wireless earbuds with transparency mode'),
      field('features', 'Features', 'Three short callouts, one per beat.', '40-hour battery, adaptive noise cancelling, folds flat', 'e.g. 8-hour battery, spatial audio, sweat-proof', 'textarea'),
      field('colors', 'Colors', 'A restrained product palette.', 'bone white, graphite, and a single muted coral', 'e.g. sand, black, electric blue'),
      field('tagline', 'End line', 'The headline on the end card.', 'Turn the world down.', 'e.g. Hear only what matters.'),
      field('cta', 'Call to action', 'The button text on the end card.', 'Shop now', 'e.g. Pre-order today'),
      field('length', 'Length (seconds)', 'Feed ads work best from 10 to 15 seconds.', '15', '15', 'number', { min: 8, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second 4:5 social product ad for ' }, { field: 'product' },
      { text: ', ' }, { field: 'productDescription' },
      { text: '. Concept: the world turns down. The ad has one job: make the viewer feel noise collapse into quiet the moment the product goes on. Open loud: a crowded composition of hand-drawn city noise set as typography ("HONK", "DRILL", "CHATTER", "SIRENS"), stacked, overlapping and jittering. The headphones arrive and close around the frame like a pair of brackets; every word shrinks, softens and slides down into a single flat line. Then one beat of near-stillness where that line breathes as a calm waveform. Product hero: a clean flat illustration of the product turning slowly, with one feature callout per beat: ' }, { field: 'features' },
      { text: '. Palette: ' }, { field: 'colors' },
      { text: '. Typeface: a confident grotesk such as Space Grotesk. Use the tall 4:5 frame: noise piles up from the bottom, the hero sits in the upper two-thirds, callouts stack beneath it. Banned: lens flares, chrome reflections, floating sparkles, glossy renders, stock sound-wave loops. </direction>\n\n<structure> First fifth: noise words pile up. Second fifth: the product closes the frame and the words collapse into one line, which breathes as a waveform. Middle: product hero with three callouts, one per beat. Final fifth: end card "' }, { field: 'tagline' },
      { text: '" with the ' }, { field: 'product' },
      { text: ' name and a "' }, { field: 'cta' },
      { text: '" button. </structure>' },
    ],
  },
  {
    slug: 'tempo-feature-announcement',
    title: 'Introducing Auto-Schedule',
    eyebrow: 'Feature announcement',
    description: 'A square launch post where the new feature books a crowded week by itself.',
    categories: ['Marketing', 'UI', 'Kinetic type'],
    video: '/templates/tempo-feature-announcement.webm',
    aspectRatio: '1:1',
    fields: [
      field('product', 'Product', 'The app getting the new feature.', 'Tempo, a calendar app', 'e.g. Orbit, a project tracker'),
      field('featureName', 'Feature name', 'What the feature is called.', 'Auto-Schedule', 'e.g. Smart Inbox'),
      field('featureDescription', 'What it does', 'The feature in one sentence.', 'finds time for your tasks and books it around your meetings', 'e.g. sorts every message by what needs a reply', 'textarea'),
      field('problem', 'Problem line', 'The opening sentence that states the pain.', 'Your to-do list doesn\'t fit in your week.', 'e.g. Your inbox has 412 unread messages.'),
      field('colors', 'Colors', 'One accent marks everything the feature touches.', 'white, ink black, and electric violet', 'e.g. cream, navy, lime'),
      field('availability', 'Availability line', 'The last line on the end card.', 'Available today on every plan.', 'e.g. Rolling out this week.'),
      field('length', 'Length (seconds)', 'Announcements work best from 10 to 15 seconds.', '12', '12', 'number', { min: 8, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second 1:1 feature announcement for ' }, { field: 'product' },
      { text: '. The new feature is ' }, { field: 'featureName' },
      { text: ', which ' }, { field: 'featureDescription' },
      { text: '. Lead with the problem in one sentence of kinetic type, then show the feature doing the work inside a believable interface. The interface is the star: a week view with real-looking meeting blocks beside a task list. Typography: Inter, bold for statements. Palette: ' }, { field: 'colors' },
      { text: ', with the accent reserved for anything the feature touches. Every block that moves is moved by the feature, never for decoration. Motion is crisp and confident: blocks snap into slots with a small overshoot, staggered about 0.08s apart. Compose for the square frame: the week view fills it edge to edge. </direction>\n\n<structure> Open on the line "' }, { field: 'problem' },
      { text: '" The words drop into a cramped week view as unscheduled tasks. A cursor clicks a single accent button labelled "' }, { field: 'featureName' },
      { text: '". Tasks lift off the list and slot themselves into free time between meetings, one per beat; a focus block grows to two hours on Thursday morning. The week zooms out to show four calm, balanced weeks. The button morphs into the end card: "' }, { field: 'featureName' },
      { text: '. Now in ' }, { field: 'product' },
      { text: '." and "' }, { field: 'availability' },
      { text: '" </structure>' },
    ],
  },
  {
    slug: 'say-it-louder',
    title: 'Say It Louder',
    eyebrow: 'Kinetic typography',
    description: 'A vertical type-only manifesto where every sentence is built from the last.',
    categories: ['Design', 'Kinetic type'],
    video: '/templates/say-it-louder.webm',
    aspectRatio: '9:16',
    fields: [
      field('script', 'Script', 'Three or four short sentences, one per bar.', 'Make it simple. Then make it bold. Then make it move. Then make it yours.', 'e.g. Start small. Ship often. Listen closely. Repeat.', 'textarea'),
      field('typography', 'Typography', 'A heavy display face, plus one contrast face.', 'a heavy condensed sans such as Oswald, with one serif italic for emphasis', 'e.g. Anton and Fraunces Italic'),
      field('colors', 'Colors', 'Two neutrals and one signal color.', 'off-black, paper white, and signal red', 'e.g. cream, ink, cobalt'),
      field('tempo', 'Tempo (BPM)', 'Every beat lands a word.', '120', '120', 'number', { min: 90, max: 140, step: 1 }),
      field('length', 'Length (seconds)', 'Reels and shorts work best from 10 to 20 seconds.', '15', '15', 'number', { min: 8, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second vertical 9:16 kinetic typography piece set to ' }, { field: 'tempo' },
      { text: ' BPM. The text is a short manifesto: "' }, { field: 'script' },
      { text: '" Type is the only visual element: no icons, no photos, no shapes that are not letters or parts of letters. Typeface: ' }, { field: 'typography' },
      { text: '. Palette: ' }, { field: 'colors' },
      { text: ', with the signal color reserved for the single most important word in each sentence. Give each sentence its own technique: words stacking and compressing to fill the frame, a single word scaling past the edges until its counter becomes the next background, letters sliding on a hidden grid, and a final line set so large it only reads as the camera pulls back. Each sentence is built out of the previous sentence\'s letters. Banned: typewriter effects, glitch, words fading in and out one by one, drop shadows, gradient fills. </direction>\n\n<structure> One sentence per bar; every beat lands a word. Use the vertical frame deliberately: stacks read top to bottom, wipes travel vertically, and nothing is composed as a centered landscape block. Final bar: the last sentence locks into a full-frame typographic poster and holds for exactly one beat, then the last frame matches the first so it loops. </structure>' },
    ],
  },
  {
    slug: 'northwind-logo-reveal',
    title: 'Mark in Motion',
    eyebrow: 'Logo reveal',
    description: 'A logo carved out of its own construction grid, like a sketchbook resolving.',
    categories: ['Design'],
    video: '/templates/northwind-logo-reveal.webm',
    aspectRatio: '1:1',
    fields: [
      field('brand', 'Brand name', 'The name in the wordmark.', 'Northwind', 'e.g. Halden & Co.'),
      field('brandDescription', 'What the brand is', 'One phrase for the brand.', 'a sustainable architecture studio', 'e.g. a specialty coffee roaster'),
      field('logo', 'Logo description', 'Describe the mark and wordmark so they can be rebuilt.', 'a wordmark in a geometric sans with a mark made of three stacked chevrons, like wind passing over a roof', 'e.g. a circle split by a single diagonal, beside a lowercase wordmark', 'textarea'),
      field('colors', 'Colors', 'Brand colors.', 'warm sand, deep slate, and one leaf green', 'e.g. #0E2A47, cream, copper'),
      field('typography', 'Wordmark typeface', 'The face for the wordmark.', 'Space Grotesk', 'e.g. Sora'),
      field('tagline', 'Tagline', 'A line under the lockup.', 'Built with the weather.', 'e.g. Roasted this morning.'),
      field('length', 'Length (seconds)', 'Logo reveals work best from 6 to 12 seconds.', '8', '8', 'number', { min: 5, max: 15, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second 1:1 logo reveal for ' }, { field: 'brand' },
      { text: ', ' }, { field: 'brandDescription' },
      { text: '. The logo: ' }, { field: 'logo' },
      { text: '. Build the logo out of its own construction geometry: a precise grid, circles and guide lines draw first, the mark\'s shapes are cut from them, and the guides retract the moment the shapes are complete. It should feel like watching a designer\'s sketchbook resolve into a finished identity. Palette: ' }, { field: 'colors' },
      { text: '. Wordmark typeface: ' }, { field: 'typography' },
      { text: '. Lines draw at constant speed, shapes land with mass, and the wordmark tracks in from wide letter spacing to tight. Banned: light sweeps, shine passes, particle explosions, 3D extrusions, lens flares, smoke. </direction>\n\n<structure> First 30%: a construction grid draws across the square frame and guide circles intersect. Next 30%: the mark\'s shapes are carved out of the guides one at a time and drop into place. Next 25%: the wordmark tracks in beneath the mark as its letter spacing tightens, and the guides retract. Final 15%: the finished lockup with the tagline "' }, { field: 'tagline' },
      { text: '" breathes gently and holds. </structure>' },
    ],
  },
  {
    slug: 'living-poster',
    title: 'Living Poster',
    eyebrow: 'Animated poster',
    description: 'A Swiss-style event poster that rearranges itself on the grid and loops.',
    categories: ['Design', 'Kinetic type'],
    video: '/templates/living-poster.webm',
    aspectRatio: '4:5',
    fields: [
      field('event', 'Event', 'The name of the event.', 'Phnom Penh Design Week', 'e.g. Lisbon Jazz Nights'),
      field('dates', 'Dates', 'Written exactly as they should appear.', '6–12 December 2026', 'e.g. 14–16 March'),
      field('venue', 'Venue', 'Where it happens.', 'Bophana Center', 'e.g. Teatro Tivoli'),
      field('footer', 'Footer line', 'Small print at the bottom of the poster.', 'Free entry. All welcome.', 'e.g. Tickets at the door.'),
      field('colors', 'Colors', 'Flat poster colors.', 'poster red, cobalt blue, and warm yellow on paper white, with black type', 'e.g. orange, forest green, cream'),
      field('length', 'Length (seconds)', 'A looping poster works best from 8 to 15 seconds.', '12', '12', 'number', { min: 6, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second 4:5 animated poster for ' }, { field: 'event' },
      { text: ', ' }, { field: 'dates' },
      { text: ', at ' }, { field: 'venue' },
      { text: '. Design it first as a real Swiss International Style poster (a strict modular grid, flush-left type, huge numerals, flat geometric shapes), then let it come alive: shapes shift positions on the grid, the date numerals rotate and restack, and the composition rearranges itself three times while always looking like a finished poster. Every frame should be printable. Palette: ' }, { field: 'colors' },
      { text: '. Typeface: Inter Tight or another neo-grotesk, set tight. Motion snaps to the grid: shapes move on clean axes, overshoot slightly, and lock. Banned: drop shadows, gradients, mockup frames, paper textures, fades. </direction>\n\n<structure> Poster A: a giant circle and the event name in three stacked lines. The circle rolls along the grid and becomes the counter of the first date numeral. Poster B: the dates in huge numerals, with bars dividing the days. The bars slide into a staircase and a square climbs it. Poster C: everything settles into the final layout with the event, dates, venue and "' }, { field: 'footer' },
      { text: '" in the footer. The last frame matches the first so the poster loops. </structure>' },
    ],
  },
  {
    slug: 'order-to-doorstep',
    title: 'From Order to Doorstep',
    eyebrow: 'Workflow explainer',
    description: 'One parcel travels a self-drawing diagram from checkout to delivery.',
    categories: ['Explainer', 'UI'],
    video: '/templates/order-to-doorstep.webm',
    aspectRatio: '16:9',
    fields: [
      field('process', 'Process', 'The workflow being explained.', 'an online order travels from checkout to a customer\'s doorstep', 'e.g. a support ticket goes from inbox to resolved', 'textarea'),
      field('steps', 'Steps', 'The steps in order, separated by arrows.', 'Checkout → Payment confirmed → Warehouse picks the item → Packed and labelled → Out for delivery → Delivered', 'e.g. Submitted → Triaged → Assigned → Fixed → Closed', 'textarea'),
      field('carrier', 'Traveling object', 'The one object that moves through every step.', 'a small parcel icon', 'e.g. a ticket card'),
      field('colors', 'Colors', 'One accent marks the active step.', 'white background, ink navy lines, and one tangerine accent', 'e.g. cream, charcoal, teal'),
      field('tagline', 'End line', 'The final line over the full diagram.', 'Six steps. One parcel. Zero guesswork.', 'e.g. Every ticket, accounted for.'),
      field('length', 'Length (seconds)', 'Give each step enough time to read.', '18', '18', 'number', { min: 12, max: 30, step: 1 }),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second 16:9 explainer animation that shows how ' }, { field: 'process' },
      { text: '. Draw the process as one continuous diagram that builds itself from left to right: ' }, { field: 'steps' },
      { text: '. A single object, ' }, { field: 'carrier' },
      { text: ', travels the whole path, and each step is introduced only when it arrives: the node draws in, a short label sets beside it, and a one-line micro-illustration shows what happens there. The camera tracks the object at a steady pace and pulls back at the end to reveal the full diagram at once. Diagram style: clean line icons with 2px strokes and rounded joins. Palette: ' }, { field: 'colors' },
      { text: ', with the accent reserved for the traveling object and the active step. Typeface: Inter. Keep it legible: every label holds long enough to read, and only one step is active at a time. Banned: stock illustrations, clip-art people, arrows that pop in all at once, decorative particles. End on the full workflow with the line "' }, { field: 'tagline' },
      { text: '"' },
    ],
  },
  {
    slug: 'shape-of-data',
    title: 'The Shape of a Year',
    eyebrow: 'Data visualization',
    description: 'Twelve months of data morph from bars to a line to a year-clock to one insight.',
    categories: ['Explainer', 'Design'],
    video: '/templates/shape-of-data.webm',
    aspectRatio: '4:5',
    fields: [
      field('topic', 'Topic', 'What the data is about.', 'a city bike-share program in its first year', 'e.g. a newsletter\'s first year of subscribers'),
      field('title', 'Title', 'The opening title line.', 'One year of rides', 'e.g. Year one, in numbers'),
      field('data', 'Data', 'Twelve labelled values. The film uses only these numbers.', 'Jan 4k, Feb 5k, Mar 9k, Apr 14k, May 21k, Jun 26k, Jul 29k, Aug 28k, Sep 24k, Oct 18k, Nov 11k, Dec 8k', 'e.g. Jan 120, Feb 180, Mar 260, ...', 'textarea'),
      field('insight', 'Insight', 'The one sentence the story builds to.', 'Ridership is seasonal, but the winter low is double where the year started.', 'e.g. Growth doubled after the March redesign.', 'textarea'),
      field('colors', 'Colors', 'One data color and one highlight.', 'chalk white background, charcoal type, teal for data, and one coral highlight for the insight', 'e.g. cream, ink, cobalt, orange'),
      field('length', 'Length (seconds)', 'Data stories work best from 15 to 25 seconds.', '18', '18', 'number', { min: 12, max: 30, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second 4:5 data story about ' }, { field: 'topic' },
      { text: '. The data: ' }, { field: 'data' },
      { text: '. Use only these numbers and do not invent others. The insight to land: ' }, { field: 'insight' },
      { text: ' Tell it as a story, not a dashboard: each chart grows out of the previous one. Bars rise one month per beat with a counting label; the bars melt into a smooth line; the line wraps into a circular year-clock showing the seasonal shape; the clock collapses into two numbers compared side by side. Palette: ' }, { field: 'colors' },
      { text: '. Typeface: Inter with tabular numbers. Compose for the tall feed frame: the chart fills the upper two-thirds and the labels and insight sit beneath it. Axis labels are honest and readable, and the value axis starts at zero. Banned: 3D bars, pie charts, glowing data, dashboards with many panels, random decorative numbers. </direction>\n\n<structure> 1) The title "' }, { field: 'title' },
      { text: '" sets in. 2) Twelve bars rise month by month with their values. 3) The bars morph into a line chart and the peak is annotated. 4) The line wraps into a radial year-clock. 5) It collapses to the first and last values side by side, and the insight sentence lands. End on the insight. </structure>' },
    ],
  },
  {
    slug: 'lock-and-key',
    title: 'Lock & Key',
    eyebrow: 'Technical concept',
    description: 'Public-key encryption explained with one padlock, one key, and no jargon until the end.',
    categories: ['Explainer', 'Storytelling', '2D'],
    video: '/templates/lock-and-key.webm',
    aspectRatio: '16:9',
    fields: [
      field('concept', 'Concept', 'The technical idea to explain.', 'public-key encryption', 'e.g. how a load balancer works'),
      field('audience', 'Audience', 'Who should understand it by the end.', 'someone who has never written code', 'e.g. a new product manager'),
      field('metaphor', 'Metaphor', 'One metaphor the whole film stays inside.', 'an open padlock anyone can snap shut, and a single key only the receiver owns', 'e.g. a restaurant host seating guests across tables', 'textarea'),
      field('colors', 'Colors', 'A friendly, limited palette.', 'off-white, ink blue, and one mustard yellow for the keys', 'e.g. cream, forest green, coral'),
      field('tagline', 'End line', 'The final line.', 'Anyone can lock it. Only you can open it.', 'e.g. Many servers. One front door.'),
      field('length', 'Length (seconds)', 'Concept explainers work best from 15 to 30 seconds.', '20', '20', 'number', { min: 12, max: 30, step: 1 }),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second 16:9 explainer that makes ' }, { field: 'concept' },
      { text: ' intuitive for ' }, { field: 'audience' },
      { text: '. Use one central metaphor and stay inside it: ' }, { field: 'metaphor' },
      { text: '. Two characters, a sender and a receiver, are simple geometric figures (a circle and a rounded square) with no faces. The receiver hands out copies of their open padlock. The sender writes a message, places it in a box and snaps the receiver\'s padlock shut. A third figure intercepts the box on the way and tries every key it has; nothing opens. The box reaches the receiver, their private key turns, and the message unfolds. Only then reveal the real terms, once, as labels that attach to the metaphor: open padlock becomes "public key", the receiver\'s key becomes "private key", the locked box becomes "ciphertext". Style: flat 2D with thick friendly outlines on a soft paper background. Palette: ' }, { field: 'colors' },
      { text: '. Typeface: Inter. Clarity beats spectacle: one idea on screen at a time, and labels hold long enough to read. Banned: binary rain, hooded hackers, glowing circuits, matrix code. End on the line "' }, { field: 'tagline' },
      { text: '"' },
    ],
  },
  {
    slug: 'fold-space',
    title: 'Fold Space',
    eyebrow: 'Abstract 3D study',
    description: 'A flat square folds into a cube, scatters into a grid, ripples, and loops.',
    categories: ['Experiment', '3D'],
    video: '/templates/fold-space.webm',
    aspectRatio: '1:1',
    fields: [
      field('concept', 'Concept', 'The idea behind the study.', 'a flat square learns it has depth', 'e.g. a circle discovers gravity'),
      field('colors', 'Colors', 'Flat face colors on a dark ground.', 'ultramarine, warm orange, and off-white on a black background', 'e.g. lime, lilac, white on charcoal'),
      field('title', 'Credit', 'A small title shown in the final second.', 'Fold Space', 'e.g. Study No. 4'),
      field('length', 'Length (seconds)', 'Loops work best from 8 to 15 seconds.', '12', '12', 'number', { min: 6, max: 20, step: 1 }),
    ],
    prompt: [
      { text: '<direction> A ' }, { field: 'length' },
      { text: '-second 1:1 abstract motion study in 3D transformations. Concept: ' }, { field: 'concept' },
      { text: '. Use only flat colored planes moving through real 3D space with CSS perspective: no textures, no images, and no text until the last second. A single square folds along its edges into a cube; the cube unfolds into a cross-shaped net; the net\'s six faces fly apart, turn to face the camera and tile into a perfect grid; the grid ripples like a wave in depth; the wave flattens back into the original square. Palette: ' }, { field: 'colors' },
      { text: '. Light is implied with face color only: each face is one flat tone, shifted slightly by its angle. Motion is mechanical and satisfying: folds hinge exactly on edges, rotations land on 90°, waves are smooth and continuous. Banned: glows, bloom, particles, reflections, gradients, lens effects, camera shake. </direction>\n\n<structure> Five movements of equal length: fold, unfold, scatter and tile, ripple, return. Each movement starts from the exact silhouette the previous one ended on. The final frame is identical to the first so the piece loops seamlessly, with a small credit "' }, { field: 'title' },
      { text: '" in the corner for the last second. </structure>' },
    ],
  },
  {
    slug: 'motiks-spicy-curls',
    title: 'Spicy Curls Fire & Lime',
    eyebrow: 'Motiks · Snack commercial',
    description: 'A high-energy snack ad of extreme close-ups, flying seasoning, and a fiery product reveal.',
    categories: ['Marketing', 'Product'],
    video: '/templates/motiks-spicy-curls.webm',
    aspectRatio: '16:9',
    fields: [
      field('brand', 'Brand', 'The snack brand being advertised.', 'Motiks', 'e.g. Crunchwave'),
      field('product', 'Product', 'What the snack is.', 'crunchy rolled tortilla chips', 'e.g. kettle-cooked potato chips'),
      field('colors', 'Colors', 'The intense palette for the ad.', 'fiery red and purple', 'e.g. electric green and black'),
      field('length', 'Length (seconds)', 'Short, punchy ads work best from 6 to 15 seconds.', '10', '10', 'number', { min: 6, max: 15, step: 1 }),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second high-energy ' }, { field: 'brand' },
      { text: ' advertisement. Extreme close-ups, ' }, { field: 'colors' },
      { text: ' visuals, ' }, { field: 'product' },
      { text: ', explosive seasoning, and bold kinetic motion. Make every shot feel intense, rebellious, and delicious, with fast seamless transitions and striking cinematic composition. Build to an irresistible final product reveal. Premium snack commercial, unforgettable visual impact.' },
    ],
  },
  {
    slug: 'motiks-minimalist-editorial',
    title: 'Minimalist Editorial Ad',
    eyebrow: 'Motiks · Product ad',
    description: 'Clean type, a restrained palette, and the packaging as the quiet hero.',
    categories: ['Marketing', 'Design', 'Product'],
    video: '/templates/motiks-minimalist-editorial.webm',
    aspectRatio: '16:9',
    fields: [
      field('brand', 'Brand', 'The brand being advertised.', 'Motiks', 'e.g. Halden Tea'),
      field('colors', 'Colors', 'A restrained two-color palette.', 'red-and-yellow', 'e.g. green-and-cream'),
      field('length', 'Length (seconds)', 'Minimal ads work best from 6 to 15 seconds.', '10', '10', 'number', { min: 6, max: 15, step: 1 }),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second minimalist ' }, { field: 'brand' },
      { text: ' advertisement using clean graphic design, simple typography, and smooth motion. Feature the product packaging alongside a few carefully composed text elements, subtle transitions, and a restrained ' }, { field: 'colors' },
      { text: ' palette. Keep the layout balanced, the animation effortless, and the product the focus. Modern editorial art direction, confident pacing, and a polished commercial finish. Less is more.' },
    ],
  },
  {
    slug: 'motiks-retro-editorial',
    title: 'Playful Retro Editorial',
    eyebrow: 'Motiks · Snack ad',
    description: 'A magazine-style 4:5 ad where one chip plays with oversized type and color blocks.',
    categories: ['Marketing', 'Design', 'Kinetic type'],
    video: '/templates/motiks-retro-editorial.webm',
    aspectRatio: '4:5',
    fields: [
      field('brand', 'Brand', 'The snack brand being advertised.', 'Motiks', 'e.g. Crunchwave'),
      field('hero', 'Hero product', 'The single product at the center of the ad.', 'A single rolled tortilla chip', 'e.g. A single pretzel twist'),
      field('colors', 'Colors', 'The color-blocking palette.', 'bold red, cream, and purple', 'e.g. mustard, navy, and pink'),
      field('length', 'Length (seconds)', 'Feed ads work best from 6 to 15 seconds.', '10', '10', 'number', { min: 6, max: 15, step: 1 }),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second ' }, { field: 'brand' },
      { text: ' snack advertisement in a 4:5 vertical format. Art direction: playful retro editorial design inspired by printed magazine ads. ' }, { field: 'hero' },
      { text: ' becomes the hero, surrounded by oversized typography, geometric shapes, and ' }, { field: 'colors' },
      { text: ' color blocking. Use deliberate composition, satisfying transitions, and subtle paper-texture movement. Let the product and typography interact in unexpected ways, ending with a clean, memorable ' }, { field: 'brand' },
      { text: ' brand reveal. Stylish, graphic, and full of personality. No excessive effects.' },
    ],
  },
  {
    slug: 'yk-coffee-highlands',
    title: 'Specialty Coffee Highlands',
    eyebrow: 'YK Coffee · Luxury product ad',
    description: 'Packaging revealed through soft light, drifting steam, and slow, deliberate camera moves.',
    categories: ['Marketing', 'Product'],
    video: '/templates/yk-coffee-highlands.webm',
    aspectRatio: '16:9',
    fields: [
      field('brand', 'Brand', 'The brand being advertised.', 'YK Coffee', 'e.g. Halden Tea'),
      field('colors', 'Colors', 'The rich, low-key palette.', 'deep blacks, warm golden highlights, and rich coffee-brown tones', 'e.g. charcoal, copper, and cream'),
      field('format', 'Format', 'The aspect ratio to generate.', '4:5', 'e.g. 16:9'),
      field('length', 'Length (seconds)', 'Luxury spots work best from 8 to 15 seconds.', '10', '10', 'number', { min: 6, max: 15, step: 1 }),
    ],
    prompt: [
      { text: 'Create a ' }, { field: 'length' },
      { text: '-second premium ' }, { field: 'brand' },
      { text: ' advertisement in ' }, { field: 'format' },
      { text: ' format. Center the coffee packaging as the hero, surrounded by ' }, { field: 'colors' },
      { text: '. Use elegant typography, soft directional lighting, subtle drifting steam, and slow, deliberate camera movement. Reveal the packaging through refined shadows and controlled highlights, emphasizing craftsmanship, aroma, and quality. Sophisticated luxury-brand art direction, restrained animation, and a beautiful final product shot. Minimal, confident, and timeless.' },
    ],
  },
];

export function getMotionTemplate(slug: string | null | undefined): MotionTemplate | undefined {
  return MOTION_TEMPLATES.find((template) => template.slug === slug);
}

/** The preview's ratio as a CSS `aspect-ratio` value, and whether it is taller than wide. */
export function templateAspect(template: MotionTemplate): { readonly css: string; readonly tall: boolean } {
  const [width, height] = template.aspectRatio.split(':').map(Number);
  return { css: `${width} / ${height}`, tall: height >= width };
}

export function templateDefaults(template: MotionTemplate): Readonly<Record<string, string>> {
  return Object.fromEntries(template.fields.map((item) => [item.key, item.defaultValue]));
}

export function promptSegmentValue(
  template: MotionTemplate,
  segment: TemplatePromptSegment,
  values: Readonly<Record<string, string>>,
): string {
  if (!segment.field) return segment.text ?? '';
  const definition = template.fields.find((item) => item.key === segment.field);
  const value = values[segment.field]?.trim() || definition?.defaultValue || '';
  return `${segment.before ?? ''}${value}${segment.after ?? ''}`;
}

export function renderTemplatePrompt(
  template: MotionTemplate,
  values: Readonly<Record<string, string>> = {},
): string {
  return template.prompt.map((segment) => promptSegmentValue(template, segment, values)).join('');
}
