import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, signal } from '@angular/core';
import { EXTERNAL_LINKS } from '../../shared/constants/external-links';
import { SeoService } from '../../shared/services/seo.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { SpatialShowcaseSectionComponent } from './components/spatial-showcase-section/spatial-showcase-section.component';
import { ResourcesSectionComponent } from './components/resources-section/resources-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { ValuePointsComponent } from './components/value-points/value-points.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { LucideMessagesSquare } from '@lucide/angular';

const COPPSARY_MEMBERS = [
  { name: 'Reaksa', github: 'PromSereyreaksa' },
  { name: 'Davann', github: 'imposter-dot-com' },
  { name: 'Ilong', github: 'Chea-Ilong' },
  { name: 'Panha', github: 'Nhaaa4' },
  { name: 'Sophanith', github: 'nithkidd' },
  { name: 'Heang', github: 'Bunheang360' },
] as const;

const TESTIMONIALS = [
  {
    quote:
      'I spent hours looking for the right starting point for a feature promotion. Motify helps me create the direction, then shape the details until it feels right.',
    author: 'Prom Sereyreaksa',
    role: 'Founder, Motify',
  },
  {
    quote:
      'The best part is that the first generation is not the finish line. I can adjust the scenes and pacing directly instead of rewriting the same prompt.',
    author: 'Early Motify user',
    role: 'Product team',
  },
  {
    quote:
      'Motify gives the speed of generative video without taking away the decisions that make a launch feel like your product.',
    author: 'Motify community',
    role: 'Early access feedback',
  },
] as const;

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
    LucideMessagesSquare,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnDestroy {
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly repositoryUrl = EXTERNAL_LINKS.github;
  readonly members = COPPSARY_MEMBERS.map((member) => ({
    ...member,
    url: `https://github.com/${member.github}`,
    avatar: `https://github.com/${member.github}.png`,
  }));
  readonly testimonials = TESTIMONIALS;
  readonly activeTestimonial = signal(0);
  private testimonialTimer?: number;

  ngOnDestroy(): void {
    if (this.testimonialTimer !== undefined && typeof window !== 'undefined') {
      window.clearInterval(this.testimonialTimer);
    }
  }

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
        image: 'https://motify.video/social-preview.png',
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

      this.testimonialTimer = window.setInterval(() => this.nextTestimonial(), 6500);
    });
  }

  nextTestimonial(): void {
    this.activeTestimonial.update((index) => (index + 1) % this.testimonials.length);
    this.changeDetector.markForCheck();
  }

  previousTestimonial(): void {
    this.activeTestimonial.update((index) => (index - 1 + this.testimonials.length) % this.testimonials.length);
    this.changeDetector.markForCheck();
  }

  goToTestimonial(index: number): void {
    this.activeTestimonial.set(Math.max(0, Math.min(this.testimonials.length - 1, index)));
    this.changeDetector.markForCheck();
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
