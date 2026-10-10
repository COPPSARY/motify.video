import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { SeoService } from '../../shared/services/seo.service';
import { COMPARISON_PAGES } from './comparison-page.data';

@Component({
  selector: 'app-comparison-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comparison-page.component.html',
  styleUrl: './comparison-page.component.css',
})
export class ComparisonPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly page = COMPARISON_PAGES[this.route.snapshot.data['comparison'] as string] ?? COMPARISON_PAGES['after-effects'];

  constructor() {
    inject(SeoService).apply({
      title: this.page.title,
      description: this.page.description,
      path: `/compare/${this.page.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: this.page.heading,
        url: `https://motify.video/compare/${this.page.slug}`,
        description: this.page.description,
        about: [
          { '@type': 'SoftwareApplication', name: 'Motify', url: 'https://motify.video/' },
          { '@type': 'Thing', name: this.page.alternativeName },
        ],
      },
    });
  }
}
