import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
} from '@angular/core';
import { EXTERNAL_LINKS } from '../../constants/external-links';
import { GithubStarsService } from '../../services/github-stars.service';
import { formatStarCount } from '../../utils/format-count';

export type GithubStarBadgeSize = 'compact' | 'default';

/**
 * Displays a GitHub icon link with a live star count for the Motify repo.
 *
 * SSR-safe: the star count is fetched only in the browser (via
 * `afterNextRender`), so the server always renders the icon-only resting
 * state. If the count can't be fetched, the badge still renders as a plain
 * GitHub link with no count shown (fails silently, never throws).
 */
@Component({
  selector: 'app-github-star-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './github-star-badge.component.html',
  styleUrl: './github-star-badge.component.css',
})
export class GithubStarBadgeComponent {
  @Input() size: GithubStarBadgeSize = 'default';

  private readonly starsService = inject(GithubStarsService);

  readonly githubUrl = EXTERNAL_LINKS.github;
  readonly stars = this.starsService.stars;
  private readonly fallbackStarCount = 61;
  protected readonly formattedStars = computed(() => {
    return formatStarCount(this.stars() ?? this.fallbackStarCount);
  });

  constructor() {
    // Browser-only: never issue the network request during SSR.
    afterNextRender(() => this.starsService.load());
  }

  protected readonly starsLabel = computed(() => {
    return `${this.formattedStars()} GitHub stars`;
  });
}
