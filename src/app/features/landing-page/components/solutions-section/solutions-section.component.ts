import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductWindowComponent } from '../../../../shared/components/product-window/product-window.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import {
  MOTION_GRAPHICS_SHOT,
  type ProductShot,
  PSD_TO_VIDEO_SHOT,
  VIDEO_EDITOR_SHOT,
} from '../../../../shared/data/product-shots';

export interface SolutionFeature {
  readonly title: string;
  readonly body: string;
}

export interface LandingSolution {
  readonly id: 'motion-graphics' | 'video-editor' | 'psd-to-video';
  readonly name: string;
  readonly beta: boolean;
  readonly title: string;
  /** Follows the product name in the paragraph beside the title. */
  readonly body: string;
  readonly features: readonly SolutionFeature[];
  readonly cta: string;
  /** The solution page that explains the feature in depth. */
  readonly link: string;
  readonly linkLabel: string;
  readonly accent: string;
  readonly shot: ProductShot;
}

/** Motify's three products, in the order a new visitor meets them. Screenshots are the real editor. */
export const LANDING_SOLUTIONS: readonly LandingSolution[] = [
  {
    id: 'motion-graphics',
    name: 'Motion Graphics AI',
    beta: false,
    title: 'Type an idea. Get a finished animation.',
    body: 'turns a few plain words into an animated ad, launch video, or explainer. It writes the story, plans every scene, and animates it in your brand.',
    features: [
      { title: 'Planned for you', body: 'Your brief becomes named scenes, from the hook to the end card.' },
      { title: 'Always on-brand', body: 'Your logo, colors, type, and voice from Brand DNA, in every video.' },
      { title: 'Every format', body: '16:9, 1:1, 4:5, and 9:16, exported as MP4 for every channel.' },
    ],
    cta: 'Write a prompt',
    link: '/ai-motion-graphics-generator',
    linkLabel: 'Explore Motion Graphics AI',
    accent: '#2758e6',
    shot: MOTION_GRAPHICS_SHOT,
  },
  {
    id: 'video-editor',
    name: 'AI Video Editor',
    beta: true,
    title: 'Upload raw clips. Get an edited video.',
    body: 'turns interviews, demos, and event footage into a finished promo. It cuts between sentences and adds captions, titles, and motion graphics.',
    features: [
      { title: 'Cuts between words', body: 'Every clip is read word by word, so nobody is cut off mid-sentence.' },
      { title: 'Captions that move', body: 'Animated captions in Khmer, English, or both, styled your way.' },
      { title: 'Edit by chatting', body: 'Ask Tiffy for a shorter intro or more energy, or edit it by hand.' },
    ],
    cta: 'Try the AI Video Editor',
    link: '/ai-video-editor',
    linkLabel: 'How it works',
    accent: '#e8a317',
    shot: VIDEO_EDITOR_SHOT,
  },
  {
    id: 'psd-to-video',
    name: 'PSD to Video',
    beta: true,
    title: 'Bring a Photoshop design. Watch it move.',
    body: 'animates the design your team already approved. Every layer arrives exactly where you placed it, and only the motion is new.',
    features: [
      { title: 'Every layer kept', body: 'Type, images, masks, and layer styles, exactly where you placed them.' },
      { title: 'Matched to Photoshop', body: 'The import is checked against Photoshop’s own preview of the design.' },
      { title: 'Motion only', body: 'Say how it should move, or let Motify decide. The design stays untouched.' },
    ],
    cta: 'Try PSD to Video',
    link: '/psd-to-video',
    linkLabel: 'How it works',
    accent: '#8b5cf6',
    shot: PSD_TO_VIDEO_SHOT,
  },
];

/**
 * Motify's three solutions, stacked: each is a block with a statement title, a
 * short paragraph, the real editor, and three features in a row. Everything is
 * visible as you scroll; nothing has to be clicked open.
 */
@Component({
  selector: 'app-solutions-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductWindowComponent, ScrollRevealDirective],
  templateUrl: './solutions-section.component.html',
  styleUrl: './solutions-section.component.css',
})
export class SolutionsSectionComponent {
  readonly solutions = LANDING_SOLUTIONS;

  /** "Write a prompt" goes back to the hero's prompt box: one place to type. */
  toPrompt(event: MouseEvent): void {
    const prompt = document.getElementById('motion-prompt');
    if (!prompt) return;
    event.preventDefault();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    prompt.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    prompt.focus({ preventScroll: true });
  }
}
