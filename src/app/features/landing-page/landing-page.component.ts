import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
    RouterLink,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnDestroy {
  @ViewChildren('templatePreview')
  private templatePreviews!: QueryList<ElementRef<HTMLVideoElement>>;

  private templatePreviewObserver?: IntersectionObserver;

  readonly featuredTemplates = [
    { title: 'One Seat, Then the Whole Journey', videoSrc: '/templates/bookmebus-journey.webm' },
    { title: 'Fold and Flight', videoSrc: '/templates/fold-and-flight.webm' },
    { title: 'Generate with Tiffy', videoSrc: '/templates/motify-generate-with-tiffy.webm' },
    { title: 'Motion Designer', videoSrc: '/templates/opus-motion-designer.webm' },
    { title: 'Paper Moon', videoSrc: '/templates/paper-moon.webm' },
  ] as const;

  constructor() {
    inject(SeoService).apply({
      title: 'Motify — AI Video Generator for SaaS Marketing',
      description:
        'Create AI explainer videos, SaaS launch videos, product demos, promotional videos, and motion graphics from a prompt.',
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
          'Motify is an AI explainer and SaaS launch video generator for product demos, promotional videos, feature announcements, and motion graphics you refine by prompting.',
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

      this.templatePreviewObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const video = entry.target as HTMLVideoElement;
            this.keepPreviewSilent(video);

            if (entry.isIntersecting) {
              void video.play().catch(() => undefined);
            } else {
              video.pause();
            }
          }
        },
        { rootMargin: '240px 0px', threshold: 0.08 },
      );

      for (const preview of this.templatePreviews) {
        this.templatePreviewObserver.observe(preview.nativeElement);
      }
    });
  }

  silenceTemplatePreview(event: Event): void {
    this.keepPreviewSilent(event.currentTarget as HTMLVideoElement);
  }

  ngOnDestroy(): void {
    this.templatePreviewObserver?.disconnect();
  }

  private keepPreviewSilent(video: HTMLVideoElement): void {
    if (!video.muted) {
      video.muted = true;
    }

    if (video.volume !== 0) {
      video.volume = 0;
    }
  }
}
