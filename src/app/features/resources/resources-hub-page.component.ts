import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RESOURCE_CATEGORIES } from '../../shared/data/resource-content.data';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

@Component({
  selector: 'app-resources-hub-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resources-hub-page.component.html',
  styleUrl: './resources-hub-page.component.css',
})
export class ResourcesHubPageComponent {
  readonly categories = RESOURCE_CATEGORIES;

  constructor() {
    inject(SeoService).apply({
      title: 'Motion Graphics Resources | Motify',
      description:
        'Motion templates and practical guides for animated ads, product animations, explainer videos, and social content, for businesses, marketing teams, and agencies.',
      path: '/resources',
    });
  }
}
