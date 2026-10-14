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
      title: 'Prompt Templates',
      description: 'Proven prompts for launches, demos, feature announcements, and ads.',
      route: '/resources/prompt-templates',
      action: 'Explore templates',
      kind: 'prompts',
    },
    {
      title: 'Storyboard Generator',
      description: 'Turn one idea into a clear nine-scene video plan.',
      route: '/resources/storyboard-generator',
      action: 'Build a storyboard',
      kind: 'storyboard',
    },
    {
      title: 'Start Here',
      description: 'Learn the simplest workflow from prompt to finished video.',
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
      title: 'Marketing Playbooks',
      description: 'Frameworks for stronger hooks, stories, and calls to action.',
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
    {
      title: 'Examples',
      description: 'See what product teams can create with Motify.',
      route: '/resources/examples',
      action: 'Watch examples',
      kind: 'examples',
    },
  ] as const;
}
