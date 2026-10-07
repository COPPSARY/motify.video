import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { SeoService } from '../../shared/services/seo.service';

const COPPSARY_MEMBERS = [
  { name: 'Reaksa', github: 'PromSereyreaksa' },
  { name: 'Davann', github: 'imposter-dot-com' },
  { name: 'Ilong', github: 'Chea-Ilong' },
  { name: 'Panha', github: 'Nhaaa4' },
  { name: 'Sophanith', github: 'nithkidd' },
  { name: 'Heang', github: 'Bunheang360' },
] as const;

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css',
})
export class AboutPageComponent {
  readonly members = COPPSARY_MEMBERS.map((member) => ({
    ...member,
    url: `https://github.com/${member.github}`,
    avatar: `https://github.com/${member.github}.png`,
  }));

  constructor() {
    inject(SeoService).apply({
      title: 'About Motify | Product Marketing Content Workflow',
      description:
        'Motify helps growing SaaS teams turn product updates and marketing goals into accurate, on-brand, production-ready content.',
      path: '/about',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Motify',
        url: 'https://motify.video/about',
        description:
          'Motify is a product marketing content workflow for growing SaaS teams.',
        publisher: {
          '@type': 'Organization',
          name: 'COPPSARY',
          url: 'https://github.com/COPPSARY',
        },
      },
    });
  }
}
