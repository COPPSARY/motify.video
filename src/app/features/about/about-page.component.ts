import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { EXTERNAL_LINKS } from '../../shared/constants/external-links';
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
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css',
})
export class AboutPageComponent {
  readonly docsUrl = EXTERNAL_LINKS.docs;
  readonly githubUrl = EXTERNAL_LINKS.github;
  readonly members = COPPSARY_MEMBERS.map((member) => ({
    ...member,
    url: `https://github.com/${member.github}`,
    avatar: `https://github.com/${member.github}.png`,
  }));

  constructor() {
    inject(SeoService).apply({
      title: 'About Motify | AI Motion Graphics Generator',
      description:
        'Learn how Motify turns product ideas into editable AI motion graphics, promotional videos, SaaS explainers, and product launch videos.',
      path: '/about',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Motify',
        url: 'https://motify.video/about',
        description:
        'Motify is an AI motion graphics generator and open source editor built by COPPSARY for editable product videos and animations.',
        publisher: {
          '@type': 'Organization',
          name: 'COPPSARY',
          url: 'https://github.com/COPPSARY',
        },
      },
    });
  }
}
