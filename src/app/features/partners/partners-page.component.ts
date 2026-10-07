import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-partners-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './partners-page.component.html',
  styleUrl: './partners-page.component.css',
})
export class PartnersPageComponent {
  readonly copiedEmail = signal<string | null>(null);

  constructor() {
    inject(SeoService).apply({
      title: 'Partner with Motify | Agencies, Creators & Tech Partners',
      description:
        'Collaborate with Motify. We work with product marketing agencies, design studios, creators, and technology partners building the future of SaaS video workflows.',
      path: '/partners',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Partner with Motify',
        url: 'https://motify.video/partners',
        description: 'Partnership opportunities with Motify.',
      },
    });
  }

  async copyEmail(email: string): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(email);
        this.copiedEmail.set(email);
        setTimeout(() => {
          if (this.copiedEmail() === email) {
            this.copiedEmail.set(null);
          }
        }, 2200);
      }
    } catch {
      // ignore clipboard error
    }
  }
}
