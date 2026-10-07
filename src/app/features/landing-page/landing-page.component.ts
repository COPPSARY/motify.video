import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../shared/services/seo.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { SpatialShowcaseSectionComponent } from './components/spatial-showcase-section/spatial-showcase-section.component';
import { ResourcesSectionComponent } from './components/resources-section/resources-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { ValuePointsComponent } from './components/value-points/value-points.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavbarComponent,
    HeroSectionComponent,
    FeaturesSectionComponent,
    SpatialShowcaseSectionComponent,
    ResourcesSectionComponent,
    FooterComponent,
    ValuePointsComponent,
    ScrollRevealDirective,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  constructor() {
    inject(SeoService).apply({
      title: 'Motify — AI Video Generator for SaaS Marketing',
      description:
        'Create editable AI explainer videos, SaaS launch videos, product demos, promotional videos, and motion graphics from a prompt.',
      path: '/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Motify',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'macOS, Windows, Linux',
        url: 'https://motify.video/',
        image: 'https://motify.video/social-preview.jpg?v=2',
        description:
          'Motify is an AI explainer and SaaS launch video generator for product demos, promotional videos, feature announcements, and editable motion graphics.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        creator: {
          '@type': 'Organization',
          name: 'COPPSARY',
          url: 'https://github.com/COPPSARY',
        },
      },
    });

    afterNextRender(() => {
      // Do not restore an old anchor position when the landing page is refreshed.
      if (window.location.hash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    });
  }

  updateWorkflowGlow(event: PointerEvent): void {
    const card = event.currentTarget as HTMLElement | null;
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    card.style.setProperty('--glow-x', `${x}%`);
    card.style.setProperty('--glow-y', `${y}%`);
    card.style.setProperty('--glow-intensity', '1');
    card.style.setProperty('--border-intensity', '1');
  }

  resetWorkflowGlow(event: PointerEvent): void {
    const card = event.currentTarget as HTMLElement | null;
    if (!card) return;
    card.style.setProperty('--glow-intensity', '0');
    card.style.setProperty('--border-intensity', '0');
  }

}
