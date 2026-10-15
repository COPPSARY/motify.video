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
import previews from '../templates/template-previews.generated.json';

export interface FeaturedTemplate {
  readonly slug: string;
  readonly title: string;
  readonly video: string;
  /** CSS `aspect-ratio` of the preview. */
  readonly aspect: string;
}

/**
 * A mix of formats from the template library. Titles and aspect ratios are a
 * light copy so the prompt library stays out of the landing bundle; the video
 * comes from the small previews file built from the backend. The spec checks
 * both against the library. Each card opens `/templates/:slug`.
 */
const featured = [
  { slug: 'moticrm-chaos-to-clarity', title: 'Customer Chaos to Clarity', aspect: '16 / 9' },
  { slug: 'kept-every-coin', title: 'Every Coin Has a Place', aspect: '9 / 16' },
  { slug: 'living-poster', title: 'Living Poster', aspect: '4 / 5' },
  { slug: 'paper-moon', title: 'Paper Moon', aspect: '16 / 9' },
  { slug: 'tempo-feature-announcement', title: 'Introducing Auto-Schedule', aspect: '1 / 1' },
  { slug: 'motiks-retro-editorial', title: 'Playful Retro Editorial', aspect: '4 / 5' },
  { slug: 'say-it-louder', title: 'Say It Louder', aspect: '9 / 16' },
  { slug: 'codeloom-red-to-green', title: 'Red to Green', aspect: '16 / 9' },
  { slug: 'northwind-logo-reveal', title: 'Mark in Motion', aspect: '1 / 1' },
  { slug: 'shape-of-data', title: 'The Shape of a Year', aspect: '4 / 5' },
  { slug: 'motiks-spicy-curls', title: 'Spicy Curls Fire & Lime', aspect: '16 / 9' },
  { slug: 'fold-space', title: 'Fold Space', aspect: '1 / 1' },
] as const;

const previewVideo = (slug: string) => previews.find((preview) => preview.slug === slug)?.video ?? '';

export const FEATURED_TEMPLATES: readonly FeaturedTemplate[] = featured.map((template) => ({
  ...template,
  video: previewVideo(template.slug),
}));

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

  readonly featuredTemplates = FEATURED_TEMPLATES;

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
