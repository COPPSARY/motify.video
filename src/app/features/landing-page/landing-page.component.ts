import { afterNextRender, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../shared/services/seo.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { HeroReelComponent } from './components/hero-reel/hero-reel.component';
import { TrustStripComponent } from './components/trust-strip/trust-strip.component';
import { HighlightsCarouselComponent } from './components/highlights-carousel/highlights-carousel.component';
import { StartFromComponent } from './components/start-from/start-from.component';
import { FeatureBentoComponent } from './components/feature-bento/feature-bento.component';
import { TeamsSectionComponent } from './components/teams-section/teams-section.component';
import { ResourcesSectionComponent } from './components/resources-section/resources-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { LazyVideoDirective } from '../../shared/directives/lazy-video.directive';
import previews from '../templates/template-previews.generated.json';
import { LandingDemoStore } from './landing-demo';

export interface FeaturedTemplate {
  readonly slug: string;
  readonly title: string;
  readonly video: string;
  /** CSS `aspect-ratio` of the preview. */
  readonly aspect: string;
}

export interface LandingFaq {
  readonly question: string;
  readonly answer: string;
}

const templatePreviews: readonly Pick<FeaturedTemplate, 'slug' | 'video'>[] = previews;

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
  { slug: 'tempo-feature-announcement', title: 'Introducing Auto-Schedule', aspect: '1 / 1' },
  { slug: 'codeloom-red-to-green', title: 'Red to Green', aspect: '16 / 9' },
  { slug: 'motiks-retro-editorial', title: 'Playful Retro Editorial', aspect: '4 / 5' },
  { slug: 'say-it-louder', title: 'Say It Louder', aspect: '9 / 16' },
  { slug: 'northwind-logo-reveal', title: 'Mark in Motion', aspect: '1 / 1' },
] as const;

const previewVideo = (slug: string) => templatePreviews.find((preview) => preview.slug === slug)?.video ?? '';

// A template the build could not read has no preview, so its card is left out.
export const FEATURED_TEMPLATES: readonly FeaturedTemplate[] = featured
  .map((template) => ({ ...template, video: previewVideo(template.slug) }))
  .filter((template) => template.video);

/** Rendered on the page and mirrored into FAQPage JSON-LD, so the two never drift. */
export const LANDING_FAQS: readonly LandingFaq[] = [
  {
    question: 'What is Motify?',
    answer:
      'Motify is an AI video generator for product and marketing teams. Describe an idea in plain words and Motify creates an on-brand motion graphics video, such as a launch video, product demo, animated ad, or explainer, that you refine by chatting and export as MP4.',
  },
  {
    question: 'Who is Motify for?',
    answer:
      'Product teams announcing launches and features, marketing teams producing ads and social content, and agencies delivering motion graphics for clients. No motion-design experience is needed.',
  },
  {
    question: 'Can Motify make videos in my brand’s style?',
    answer:
      'Yes. Brand DNA saves your colors, type, logo, and voice once, or reads them from your website, and Motify applies them to every video automatically.',
  },
  {
    question: 'Can Motify edit my own footage?',
    answer:
      'Yes, in beta. Upload your raw clips and the AI video editor cuts them into a promo video, between words, with captions, title cards, and B-roll. Then refine it by chatting.',
  },
  {
    question: 'Can I animate a Photoshop design?',
    answer:
      'Yes, in beta. PSD to Video imports your Photoshop file and animates its layers exactly where you designed them, without redrawing anything, for a flat 20 credits per video.',
  },
  {
    question: 'Can I change the result?',
    answer:
      'Yes. Ask Tiffy in plain language to change the hook, pacing, copy, music, or visual direction, and the video updates without starting over.',
  },
  {
    question: 'Which formats can I export?',
    answer:
      'Landscape 16:9, square 1:1, portrait 4:5, and vertical 9:16, exported as MP4 for websites, LinkedIn, YouTube, Reels, TikTok, and Stories. You can use them in paid campaigns and client work.',
  },
  {
    question: 'Do I need a card to try Motify?',
    answer: 'No. Start free, describe your first video, and see the draft before committing to anything.',
  },
];

export const LANDING_TITLE = 'AI Video Generator for Product & Marketing Teams | Motify';
const SITE = 'https://motify.video/';
const DESCRIPTION =
  'Motify is the AI video generator for product and marketing teams. Turn an idea into on-brand launch videos, product demos, and ads in every format. Start free.';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavbarComponent,
    HeroSectionComponent,
    HeroReelComponent,
    TrustStripComponent,
    HighlightsCarouselComponent,
    StartFromComponent,
    FeatureBentoComponent,
    TeamsSectionComponent,
    ResourcesSectionComponent,
    FooterComponent,
    LazyVideoDirective,
    RouterLink,
  ],
  providers: [LandingDemoStore],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent {
  readonly featuredTemplates = FEATURED_TEMPLATES;
  readonly faqs = LANDING_FAQS;

  constructor() {
    inject(SeoService).apply({
      title: LANDING_TITLE,
      description: DESCRIPTION,
      path: '/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SoftwareApplication',
            name: 'Motify',
            applicationCategory: 'MultimediaApplication',
            applicationSubCategory: 'AI video generator',
            operatingSystem: 'Web',
            url: SITE,
            image: 'https://motify.video/social-preview.jpg?v=2',
            description: DESCRIPTION,
            audience: { '@type': 'BusinessAudience', audienceType: 'Product teams, marketing teams, and agencies' },
            featureList: [
              'AI video generation from a text prompt',
              'Brand DNA: brand colors, type, logo, and voice applied automatically',
              'Refine videos by chatting',
              'Export MP4 in 16:9, 1:1, 4:5, and 9:16',
              'Motion templates for launch videos, product demos, and ads',
              'AI video editor that cuts your own footage into promo videos (beta)',
              'PSD to Video: animate Photoshop designs layer by layer (beta)',
            ],
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            creator: { '@type': 'Organization', name: 'COPPSARY', url: 'https://github.com/COPPSARY' },
          },
          {
            '@type': 'FAQPage',
            mainEntity: LANDING_FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
        ],
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
}
