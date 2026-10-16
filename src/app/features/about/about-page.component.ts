import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  imports: [NavbarComponent, FooterComponent, RouterLink],
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
          name: 'COPPSARY',
          url: 'https://github.com/COPPSARY',
        },
      },
    });
  }
}
