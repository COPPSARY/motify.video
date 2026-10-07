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
      title: 'Product Marketing Resources | Motify',
      description:
        'Practical guides, prompt templates, brand direction, playbooks, and video craft for SaaS product marketing teams.',
      path: '/resources',
    });
  }
}
