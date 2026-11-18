import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface TeamCard {
  readonly team: string;
  /** Finishes the team's name as one sentence: "Businesses show what they sell." */
  readonly promise: string;
  readonly body: string;
  /** What this team makes with Motify. */
  readonly makes: readonly string[];
  readonly link: string;
  readonly linkLabel: string;
  /** A real video made with Motify; it plays while the card is hovered. */
  readonly video: string;
  readonly poster: string;
}

/** Who Motify is for, each linking to the page that goes deeper for that team. */
export const TEAM_CARDS: readonly TeamCard[] = [
  {
    team: 'Businesses',
    promise: 'show what they sell.',
    body: 'Turn product photos, screenshots, and the clips you already have into videos that make your offer clear. No studio, no freelancer, no editing software.',
    makes: ['Product videos', 'Explainers', 'Promo videos'],
    link: '/software-product-video-generator',
    linkLabel: 'AI product videos',
    video: 'assets/showcase/motiks-spicy-curls.webm',
    poster: 'assets/showcase/posters/motiks-spicy-curls.jpg',
  },
  {
    team: 'Marketing teams',
    promise: 'ship every campaign on time.',
    body: 'Go from one brief to animated ads and launch videos in 16:9, 1:1, 4:5, and 9:16, all on-brand, and revise them by chat instead of opening a new ticket.',
    makes: ['Animated ads', 'Launch videos', 'Social clips'],
    link: '/ai-motion-graphics-generator',
    linkLabel: 'AI motion graphics',
    video: 'assets/showcase/tobsar-product-launch.webm',
    poster: 'assets/showcase/posters/tobsar-product-launch.jpg',
  },
  {
    team: 'Agencies',
    promise: 'deliver more for every client.',
    body: 'Keep a Brand DNA for each client, animate the PSDs your designers already made, and turn feedback into revisions in minutes instead of new timelines.',
    makes: ['Client ads', 'Animated key visuals', 'Fast revisions'],
    link: '/psd-to-video',
    linkLabel: 'Animate client PSDs',
    video: 'assets/showcase/motiks-editorial-ad.webm',
    poster: 'assets/showcase/posters/motiks-editorial-ad.jpg',
  },
];

@Component({
  selector: 'app-teams-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section id="teams" class="teams" aria-labelledby="teams-title">
      <header class="teams__intro">
        <h2 id="teams-title" class="lp-title">Built for businesses, <span class="lp-dim">marketing teams, and agencies.</span></h2>
        <p class="teams__lead">
          Motify is an AI-powered tool for making animated ads, product videos, and explainers, without a studio or a
          motion designer on staff.
        </p>
      </header>
      <div class="teams__grid">
        @for (card of cards; track card.team) {
          <a
            class="teams__card"
            [routerLink]="card.link"
            (mouseenter)="play(video)"
            (mouseleave)="stop(video)"
            (focus)="play(video)"
            (blur)="stop(video)"
          >
            <div class="teams__media">
              <video
                #video
                [poster]="card.poster"
                [attr.data-src]="card.video"
                muted
                [muted]="true"
                loop
                playsinline
                preload="none"
                aria-hidden="true"
              ></video>
            </div>
            <div class="teams__body">
              <h3>{{ card.team }} <span>{{ card.promise }}</span></h3>
              <p>{{ card.body }}</p>
              <ul class="teams__makes" aria-label="What they make">
                @for (item of card.makes; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
              <span class="teams__link">
                {{ card.linkLabel }}
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10m0 0L9 4m4 4-4 4" /></svg>
              </span>
            </div>
          </a>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }

    .teams {
      width: min(78rem, calc(100% - 3rem));
      margin: 0 auto;
      padding-top: var(--motify-section-pad);
    }

    .teams__intro {
      display: grid;
      gap: 1.5rem;
      margin-bottom: clamp(3rem, 6vw, 4.5rem);
    }

    .teams__lead {
      max-width: 40rem;
      margin: 0;
      color: var(--motify-text-quiet);
      font-size: clamp(1.05rem, 1.5vw, 1.2rem);
      line-height: 1.6;
    }

    .teams__grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .teams__card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--motify-border);
      border-radius: 1.5rem;
      background: var(--motify-surface-solid);
      color: inherit;
      text-decoration: none;
      transition: border-color 200ms ease, transform 300ms var(--motify-ease-premium), box-shadow 300ms ease;
    }

    .teams__card:hover {
      border-color: rgba(39, 88, 230, 0.6);
      box-shadow: 0 30px 70px -30px rgba(39, 88, 230, 0.45);
      transform: translateY(-4px);
    }

    .teams__card:focus-visible {
      outline: 2px solid var(--motify-cobalt-hover);
      outline-offset: 3px;
    }

    .teams__media {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: #0b0c0f;
    }

    .teams__media::after {
      position: absolute;
      inset: auto 0 0;
      height: 40%;
      content: '';
      background: linear-gradient(180deg, transparent, var(--motify-surface-solid));
      pointer-events: none;
    }

    .teams__media video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.02);
      transition: transform 700ms var(--motify-ease-premium);
    }

    .teams__card:hover .teams__media video { transform: scale(1.07); }

    .teams__body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 0.85rem;
      padding: 0.5rem 1.75rem 1.75rem;
    }

    .teams__card h3 {
      margin: 0;
      color: var(--motify-text-primary);
      font-size: clamp(1.35rem, 2vw, 1.65rem);
      font-weight: 500;
      line-height: 1.15;
      letter-spacing: -0.025em;
    }

    .teams__card h3 span { color: var(--motify-text-quiet); }

    .teams__card p {
      flex: 1;
      margin: 0;
      color: var(--motify-text-quiet);
      font-size: 0.98rem;
      line-height: 1.6;
    }

    .teams__makes {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 0.4rem 0 0;
      padding: 0;
      list-style: none;
    }

    .teams__makes li {
      padding: 0.3rem 0.7rem;
      border: 1px solid var(--motify-border-strong);
      border-radius: 999px;
      color: var(--motify-text-strong);
      font-size: 0.8rem;
    }

    .teams__link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      color: var(--motify-text-primary);
      font-size: 0.92rem;
      font-weight: 500;
    }

    .teams__card:hover .teams__link { color: #8fb0ff; }

    .teams__link svg {
      width: 1rem;
      height: 1rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 200ms ease;
    }

    .teams__card:hover .teams__link svg { transform: translateX(3px); }

    @media (max-width: 900px) {
      .teams__grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .teams { width: calc(100% - 2rem); }
      .teams__card { border-radius: 1.25rem; }
      .teams__body { padding: 0.25rem 1.25rem 1.4rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .teams__card, .teams__media video, .teams__link svg { transition: none; }
      .teams__card:hover { transform: none; }
      .teams__card:hover .teams__media video { transform: scale(1.02); }
    }
  `,
})
export class TeamsSectionComponent {
  readonly cards = TEAM_CARDS;

  /** The video loads only when first hovered, then plays from where it was. */
  play(video: HTMLVideoElement): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!video.src && video.dataset['src']) video.src = video.dataset['src'];
    video.muted = true;
    video.play().catch(() => undefined);
  }

  stop(video: HTMLVideoElement): void {
    video.pause();
  }
}
