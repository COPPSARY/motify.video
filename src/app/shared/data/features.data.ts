import { Feature } from '../models/landing.models';

export const FEATURES: readonly Feature[] = [
  {
    id: 'first-draft',
    title: 'Start with a prompt',
    description: 'Describe an idea and get a polished first scene.',
    icon: 'mouse-pointer',
  },
  {
    id: 'visual-refine',
    title: 'Edit the timeline',
    description: 'Change scenes, timing, and transitions in the editor.',
    icon: 'timeline',
  },
  {
    id: 'final-video',
    title: 'Export the final cut',
    description: 'Preview your video, then export and share it.',
    icon: 'download',
  },
];
