import { Injectable, signal } from '@angular/core';

export interface LandingDemo {
  readonly id: string;
  /** Chip label in the hero. */
  readonly label: string;
  /** Typed into the prompt box when the chip is chosen; sendable as is. */
  readonly prompt: string;
  /** A real video made with Motify, shown in the reel under the hero. */
  readonly video: string;
  readonly poster: string;
  readonly caption: string;
}

export const LANDING_DEMOS: readonly LandingDemo[] = [
  {
    id: 'motion',
    label: 'Motion graphics',
    prompt: "A 15-second animated short: a paper boat sails across a night puddle toward the moon's reflection.",
    video: 'assets/showcase/paper-moon.webm',
    poster: 'assets/showcase/posters/paper-moon.jpg',
    caption: 'Paper Moon',
  },
  {
    id: 'launch',
    label: 'Launch video',
    prompt: 'A 30-second launch video for our new dashboard. Show onboarding and the key features, then end on our logo.',
    video: 'assets/showcase/tobsar-product-launch.webm',
    poster: 'assets/showcase/posters/tobsar-product-launch.jpg',
    caption: 'TobSar product launch',
  },
  {
    id: 'demo',
    label: 'Product demo',
    prompt: 'A product demo of our banking app: sign in, check accounts, send a transfer. Calm and clear.',
    video: 'assets/showcase/morakot-cbs-walkthrough.webm',
    poster: 'assets/showcase/posters/morakot-cbs-walkthrough.jpg',
    caption: 'Morakot CBS core banking walkthrough',
  },
  {
    id: 'ad',
    label: 'Ad',
    prompt: 'A punchy ad for our new spicy chips flavor. Bold type, fast cuts, fire and lime colors.',
    video: 'assets/showcase/motiks-spicy-curls.webm',
    poster: 'assets/showcase/posters/motiks-spicy-curls.jpg',
    caption: 'Motiks Spicy Curls ad',
  },
];

/** Which demo the hero chips have chosen; the reel under the hero plays it. */
@Injectable()
export class LandingDemoStore {
  readonly demos = LANDING_DEMOS;
  readonly active = signal<LandingDemo>(LANDING_DEMOS[0]);

  select(id: string): LandingDemo {
    const demo = LANDING_DEMOS.find((item) => item.id === id) ?? LANDING_DEMOS[0];
    this.active.set(demo);
    return demo;
  }
}
