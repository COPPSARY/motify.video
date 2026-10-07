import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HELP_TOPICS } from '../../shared/data/help-topics.data';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css',
})
export class HelpPageComponent {
  readonly topics = HELP_TOPICS;

  constructor() {
    inject(SeoService).apply({
      title: 'Help & Product Guidance | Motify',
      description:
        'Help with Motify accounts, credits, Brand DNA, supported inputs, rendering, exports, troubleshooting, and feature availability.',
      path: '/help',
    });
  }
}
