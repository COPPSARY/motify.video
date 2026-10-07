import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideCode2,
  LucideDownload,
  LucideMousePointer2,
  LucideSparkles,
  LucideTimerReset,
} from '@lucide/angular';
import { FEATURES } from '../../../../shared/data/features.data';
import { Feature } from '../../../../shared/models/landing.models';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [
    RouterLink,
    ScrollRevealDirective,
    LucideCode2,
    LucideDownload,
    LucideMousePointer2,
    LucideSparkles,
    LucideTimerReset,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.css',
})
export class FeaturesSectionComponent {
  readonly features: readonly Feature[] = FEATURES;

  visualAsset(icon: string): string {
    switch (icon) {
      case 'mouse-pointer':
        return 'assets/prompt.png';
      case 'timeline':
        return 'assets/timeframe.png';
      case 'download':
        return 'assets/export.png';
      default:
        return 'assets/prompt.png';
    }
  }
}
