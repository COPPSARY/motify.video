import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

/**
 * Four product strengths as a bento grid. Each tile's small illustration plays
 * once when the tile is revealed (`reveal--visible` from ScrollRevealDirective).
 * Without that class (server HTML, no JS, reduced motion) the illustrations
 * simply show their finished state.
 */
@Component({
  selector: 'app-feature-bento',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollRevealDirective],
  templateUrl: './feature-bento.component.html',
  styleUrl: './feature-bento.component.css',
})
export class FeatureBentoComponent {}
