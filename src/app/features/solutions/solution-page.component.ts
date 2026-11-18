import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { ProductWindowComponent } from '../../shared/components/product-window/product-window.component';
import { SeoService } from '../../shared/services/seo.service';
import { SOLUTION_PAGES } from './solution-page.data';

@Component({
  selector: 'app-solution-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, ProductWindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solution-page.component.html',
  styleUrl: './solution-page.component.css',
})
export class SolutionPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly page = SOLUTION_PAGES[this.route.snapshot.data['solution'] as string] ?? SOLUTION_PAGES['motion-graphics'];
  readonly related = Object.values(SOLUTION_PAGES).filter((item) => item.slug !== this.page.slug);
  readonly shots = this.page.shot ? [this.page.shot] : [];

  constructor() {
    inject(SeoService).apply({
      title: this.page.title,
      description: this.page.description,
      path: `/${this.page.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            name: this.page.heading,
            url: `https://motify.video/${this.page.slug}`,
            description: this.page.description,
          },
          {
            '@type': 'SoftwareApplication',
            name: 'Motify',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Web',
            url: 'https://motify.video/',
            description: this.page.promise,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
          {
            '@type': 'FAQPage',
            mainEntity: this.page.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ],
      },
    });
  }
}
