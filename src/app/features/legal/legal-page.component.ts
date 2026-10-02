import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { SeoService } from '../../shared/services/seo.service';

export type LegalDocument = 'terms' | 'privacy' | 'refund';

const LEGAL_PAGE_META: Record<LegalDocument, { title: string; description: string; path: string }> = {
  terms: {
    title: 'Terms and Conditions | Motify',
    description: 'Terms and conditions governing accounts, subscriptions, credits, content, and use of Motify.',
    path: '/terms',
  },
  privacy: {
    title: 'Privacy Policy | Motify',
    description: 'Learn what personal information Motify collects, why we use it, and the choices available to you.',
    path: '/privacy',
  },
  refund: {
    title: 'Refund Policy | Motify',
    description: 'Read the Motify refund and Bakong KHQR payment support policy.',
    path: '/refund-policy',
  },
};

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legal-page.component.html',
  styleUrl: './legal-page.component.css',
})
export class LegalPageComponent {
  readonly documentType = inject(ActivatedRoute).snapshot.data['document'] as LegalDocument;
  readonly lastUpdated = 'October 2, 2026';

  constructor() {
    inject(SeoService).apply(LEGAL_PAGE_META[this.documentType]);
  }
}
