import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface TeamCard {
  readonly team: string;
  readonly body: string;
  readonly link: string;
  readonly linkLabel: string;
}

/** Who Motify is for, each linking to the page that goes deeper for that team. */
export const TEAM_CARDS: readonly TeamCard[] = [
  {
    team: 'Product teams',
    body: 'Launch videos, feature announcements, and product demos that show what you shipped.',
    link: '/ai-saas-launch-video-generator',
    linkLabel: 'Product launch videos',
  },
  {
    team: 'Marketing teams',
    body: 'Animated ads and social clips in 16:9, 1:1, 4:5, and 9:16, on-brand from one idea.',
    link: '/ai-motion-graphics-generator',
    linkLabel: 'AI motion graphics',
  },
  {
    team: 'Agencies',
    body: 'A Brand DNA per client and polished motion graphics without After Effects timelines.',
    link: '/compare/after-effects',
    linkLabel: 'Motify vs After Effects',
  },
];

@Component({
  selector: 'app-teams-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section id="teams" class="teams" aria-labelledby="teams-title">
      <h2 id="teams-title" class="lp-title">The AI video generator <span class="lp-dim">for product and marketing teams.</span></h2>
      <div class="teams__grid">
        @for (card of cards; track card.team) {
          <a class="teams__card" [routerLink]="card.link">
            <h3>{{ card.team }}</h3>
            <p>{{ card.body }}</p>
            <span class="teams__link">
              {{ card.linkLabel }}
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10m0 0L9 4m4 4-4 4" /></svg>
            </span>
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

    .teams h2 { margin-bottom: clamp(3rem, 6vw, 4.5rem); }

    .teams__grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .teams__card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 2rem;
      border: 1px solid var(--motify-border);
      border-radius: 1.5rem;
      background: var(--motify-surface-solid);
      color: inherit;
      text-decoration: none;
      transition: border-color 150ms ease, background-color 150ms ease;
    }

    .teams__card:hover {
      border-color: rgba(39, 88, 230, 0.6);
      background: #14161c;
    }

    .teams__card:focus-visible {
      outline: 2px solid var(--motify-cobalt-hover);
      outline-offset: 3px;
    }

    .teams__card h3 {
      margin: 0;
      color: var(--motify-text-primary);
      font-size: clamp(1.3rem, 2vw, 1.6rem);
      font-weight: 600;
      letter-spacing: -0.025em;
    }

    .teams__card p {
      flex: 1;
      margin: 0;
      color: var(--motify-text-quiet);
      font-size: 1rem;
      line-height: 1.6;
    }

    .teams__link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
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
    }

    @media (max-width: 900px) {
      .teams__grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .teams { width: calc(100% - 2rem); }
      .teams__card { padding: 1.5rem; border-radius: 1.25rem; }
    }
  `,
})
export class TeamsSectionComponent {
  readonly cards = TEAM_CARDS;
}
