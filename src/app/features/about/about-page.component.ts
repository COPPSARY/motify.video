import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { SeoService } from '../../shared/services/seo.service';

const COPPSARY_MEMBERS = ['Reaksa', 'Davann', 'Ilong', 'Panha', 'Sophanith', 'Heang'] as const;

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css',
})
export class AboutPageComponent {
  readonly members = COPPSARY_MEMBERS.map((name) => ({
    name,
    avatar: `assets/team/${name.toLowerCase()}.webp`,
  }));

  constructor() {
    inject(SeoService).apply({
      title: 'About Motify | Motion Graphics Made Easier',
      description:
        'Motify is a Cambodian-led startup making motion graphics easier for businesses and agencies, from animated ads to product animations and explainer videos.',
      path: '/about',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Motify: Motion graphics, made easier',
        url: 'https://motify.video/about',
        description:
          'Motify is a Cambodian-led startup making motion graphics easier for businesses and agencies, from animated ads to product animations and explainer videos.',
        publisher: {
          '@type': 'Organization',
          name: 'Motify',
          url: 'https://motify.video/',
          sameAs: ['https://www.linkedin.com/company/motifyai/'],
        },
      },
    });
  }
}
