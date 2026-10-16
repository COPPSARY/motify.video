import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.css',
})
export class FeaturesSectionComponent {
  readonly resources = [
    {
      title: 'Motion Templates',
      description: 'Finished animated ads, product animations, and explainers you can make your own.',
      route: '/templates',
      action: 'Browse templates',
      kind: 'prompts',
    },
    {
      title: 'Start Here',
      description: 'Learn the simplest path from an idea to a finished motion graphic.',
      route: '/resources/start-here',
      action: 'Start the guide',
      kind: 'start',
    },
    {
      title: 'Brand DNA',
      description: 'Bring your colors, type, voice, and assets into every video.',
      route: '/resources/brand-dna',
      action: 'Build your brand',
      kind: 'brand',
    },
    {
      title: 'Playbooks',
      description: 'Workflows for animated ads, launches, social content, and client work.',
      route: '/resources/playbooks',
      action: 'Browse playbooks',
      kind: 'playbooks',
    },
    {
      title: 'Video Craft',
      description: 'Practical guidance for pacing, scenes, motion, and transitions.',
      route: '/resources/video-craft',
      action: 'Learn video craft',
      kind: 'craft',
    },
  ] as const;
}
