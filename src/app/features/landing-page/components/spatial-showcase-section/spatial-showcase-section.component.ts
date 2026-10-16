import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  QueryList,
  ViewChildren,
  signal,
} from '@angular/core';
import { LazyVideoDirective } from '../../../../shared/directives/lazy-video.directive';

interface ShowcaseStory {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly videos: readonly ShowcaseVideo[];
}

interface ShowcaseVideo {
  readonly src: string;
  readonly poster?: string;
  readonly label: string;
}

@Component({
  selector: 'app-spatial-showcase-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LazyVideoDirective],
  templateUrl: './spatial-showcase-section.component.html',
  styleUrl: './spatial-showcase-section.component.css',
})
export class SpatialShowcaseSectionComponent implements OnDestroy {
  @ViewChildren('storyPanel', { read: ElementRef })
  private readonly storyPanels!: QueryList<ElementRef<HTMLElement>>;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly stories: readonly ShowcaseStory[] = [
    {
      id: 'saas-motion',
      category: 'SaaS videos',
      description: 'Make product demos and UI animations look clear, polished, and professional.',
      videos: [
        {
          src: 'assets/claude.webm',
          poster: 'assets/showcase/posters/claude.jpg',
          label: 'Animated SaaS workflow',
        },
        {
          src: 'assets/showcase/bookmebus.webm',
          poster: 'assets/showcase/posters/bookmebus.jpg',
          label: 'BookMeBus SaaS video',
        },
        {
          src: 'assets/showcase/kiritts.webm',
          poster: 'assets/showcase/posters/kiritts.jpg',
          label: 'KiriTTS SaaS video',
        },
        {
          src: 'assets/showcase/motify-test-run.webm',
          poster: 'assets/showcase/posters/motify-test-run.jpg',
          label: 'Motify test run walkthrough',
        },
      ],
    },
    {
      id: 'product-ads',
      category: 'Product Ads',
      description: 'Create focused ads that grab attention and sell the value of your product quickly.',
      videos: [
        {
          src: 'assets/showcase/motiks-spicy-curls.webm',
          poster: 'assets/showcase/posters/motiks-spicy-curls.jpg',
          label: 'Motiks Spicy Curls Fire & Lime product ad',
        },
        {
          src: 'assets/showcase/motiks-editorial-ad.webm',
          poster: 'assets/showcase/posters/motiks-editorial-ad.jpg',
          label: 'Motiks minimalist editorial ad',
        },
      ],
    },
    {
      id: 'motion-graphics',
      category: 'Motion Graphics Animations',
      description: 'Bring your typography, colors, and visual style together in expressive, story-driven motion.',
      videos: [
        {
          src: 'assets/showcase/porco-rosso-just-breathe.webm',
          poster: 'assets/showcase/posters/porco-rosso-just-breathe.jpg',
          label: 'Porco Rosso — Just Breathe motion graphics',
        },
        {
          src: 'assets/showcase/paper-moon.webm',
          poster: 'assets/showcase/posters/paper-moon.jpg',
          label: 'Paper Moon motion graphics',
        },
      ],
    },
    {
      id: 'product-demo',
      category: 'Product Demo',
      description: 'Walk viewers through your product so they see exactly how it works and why it matters.',
      videos: [
        {
          src: 'assets/showcase/tobsar-product-launch.webm',
          poster: 'assets/showcase/posters/tobsar-product-launch.jpg',
          label: 'TobSar product launch and dashboard tour',
        },
        {
          src: 'assets/showcase/morakot-cbs-walkthrough.webm',
          poster: 'assets/showcase/posters/morakot-cbs-walkthrough.jpg',
          label: 'Morakot CBS core banking walkthrough',
        },
      ],
    },
  ];

  readonly activeStory = signal(this.stories[0].id);
  private scrollFrame?: number;

  constructor() {
    afterNextRender(() => this.updateActiveStory());
  }

  ngOnDestroy(): void {
    if (this.scrollFrame !== undefined && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.scrollFrame);
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  trackActiveStory(): void {
    if (this.scrollFrame !== undefined) return;
    this.scrollFrame = window.requestAnimationFrame(() => {
      this.scrollFrame = undefined;
      this.updateActiveStory();
    });
  }

  selectStory(id: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.activeStory.set(id);
    if (typeof document !== 'undefined') {
      const panel = document.getElementById(id);
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  private updateActiveStory(): void {
    const panels = this.storyPanels?.toArray() ?? [];
    if (!panels.length || typeof window === 'undefined') return;

    const readingLine = Math.min(window.innerHeight * 0.38, 360);
    let activeId = panels[0].nativeElement.id;

    for (const panel of panels) {
      if (panel.nativeElement.getBoundingClientRect().top > readingLine) break;
      activeId = panel.nativeElement.id;
    }

    if (!activeId || activeId === this.activeStory()) return;
    this.activeStory.set(activeId);
    this.revealActiveTab(activeId);
  }

  /** On phones the categories are a horizontal strip; keep the active one in view as the page scrolls. */
  private revealActiveTab(id: string): void {
    const nav = this.host.querySelector<HTMLElement>('.showcase-stories__rail nav');
    const index = this.stories.findIndex((story) => story.id === id);
    const tab = nav?.children[index] as HTMLElement | undefined;
    if (!nav || !tab || nav.scrollWidth <= nav.clientWidth) return;
    const left = tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }
}
