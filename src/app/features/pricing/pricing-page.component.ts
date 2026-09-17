import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pricing-page.component.html',
  styleUrl: './pricing-page.component.css',
})
export class PricingPageComponent {
  constructor() {
    inject(SeoService).apply({
      title: 'AI Video Generator Pricing | Motify',
      description:
        'Compare Motify plans for creating AI product videos, promotional videos, SaaS explainers, motion graphics, and campaign variations.',
      path: '/pricing',
    });
  }
}
