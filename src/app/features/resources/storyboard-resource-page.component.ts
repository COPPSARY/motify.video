import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

@Component({
  selector: 'app-storyboard-resource-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './storyboard-resource-page.component.html',
  styleUrl: './storyboard-resource-page.component.css',
})
export class StoryboardResourcePageComponent {
  readonly formats = [
    { name: 'Landscape', ratio: '16:9' },
    { name: 'Portrait', ratio: '9:16' },
    { name: 'Square', ratio: '1:1' },
    { name: 'Social', ratio: '4:5' },
    { name: 'Photo', ratio: '3:2' },
    { name: 'Cinematic', ratio: '21:9' },
  ] as const;

  constructor() {
    inject(SeoService).apply({
      title: 'AI Storyboard Generator for Product Videos | Motify',
      description:
        'Plan and approve a branded nine-scene product story, then use the storyboard as a visual reference for your next Motify video prompt.',
      path: '/resources/storyboard-generator',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Motify Storyboard Generator Guide',
        description: 'A guide to planning branded nine-scene product videos with the Motify Storyboard Generator.',
        url: 'https://motify.video/resources/storyboard-generator',
      },
    });
  }
}
