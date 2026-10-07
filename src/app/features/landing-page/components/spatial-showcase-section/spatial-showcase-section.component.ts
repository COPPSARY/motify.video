import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  QueryList,
  ViewChildren,
  signal,
} from '@angular/core';

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
  templateUrl: './spatial-showcase-section.component.html',
  styleUrl: './spatial-showcase-section.component.css',
})
export class SpatialShowcaseSectionComponent implements OnDestroy {
  @ViewChildren('storyPanel', { read: ElementRef })
  private readonly storyPanels!: QueryList<ElementRef<HTMLElement>>;

  @ViewChildren('showcaseVideo', { read: ElementRef })
  private readonly showcaseVideos!: QueryList<ElementRef<HTMLVideoElement>>;

  readonly stories: readonly ShowcaseStory[] = [
    {
      id: 'saas-motion',
      category: 'SaaS videos',
      description: 'Make product demos and UI animations look clear, polished, and professional.',
      videos: [
        {
          src: 'assets/claude.mp4',
          poster: 'assets/showcase/posters/claude.jpg',
          label: 'Animated SaaS workflow',
        },
        {
          src: 'assets/motify-web.mp4',
          poster: 'assets/showcase/posters/motify-web.jpg',
          label: 'Animated product interface',
        },
      ],
    },
    {
      id: 'marketing-ads',
      category: 'Marketing ads',
      description: 'Create focused ads that grab attention and sell the value of your product quickly.',
      videos: [
        {
          src: 'assets/showcase/bookmebus.mp4',
          poster: 'assets/showcase/posters/bookmebus.jpg',
          label: 'BookMeBus marketing video',
        },
        {
          src: 'assets/showcase/motify-60fps.mp4',
          poster: 'assets/showcase/posters/motify-60fps.jpg',
          label: 'Animated marketing story',
        },
        {
          src: 'assets/showcase/recoup.mp4',
          poster: 'assets/showcase/posters/recoup.jpg',
          label: 'Recoup marketing animation',
        },
        {
          src: 'assets/showcase/relay.mp4',
          poster: 'assets/showcase/posters/relay.jpg',
          label: 'Relay product promotion',
        },
      ],
    },
    {
      id: 'explainer-video',
      category: 'Explainer videos',
      description: 'Turn complex ideas into engaging stories people can follow and remember.',
      videos: [
        {
          src: 'assets/showcase/motify-test-run.mp4',
          poster: 'assets/showcase/posters/motify-test-run.jpg',
          label: 'Motify workflow explainer',
        },
        {
          src: 'assets/showcase/kiritts.mp4',
          poster: 'assets/showcase/posters/kiritts.jpg',
          label: 'KiriTTS explainer animation',
        },
        {
          src: 'assets/notes-app.mp4',
          label: 'Notes application explainer',
        },
      ],
    },
    {
      id: 'brand-stories',
      category: 'Brand stories',
      description: 'Bring your typography, colors, and visual style together in motion that feels like your brand.',
      videos: [
        {
          src: 'assets/showcase/tessera.mp4',
          poster: 'assets/showcase/posters/tessera.jpg',
          label: 'Tessera brand animation',
        },
        {
          src: 'project.mp4',
          label: 'Motify brand composition',
        },
      ],
    },
    {
      id: 'feature-announcements',
      category: 'Feature announcements',
      description: 'Show what changed, why it matters, and what users can do next.',
      videos: [
        {
          src: 'assets/showcase/motify-brand-dna.mp4',
          poster: 'assets/showcase/posters/motify-brand-dna.jpg',
          label: 'Motify Brand DNA feature announcement',
        },
        {
          src: 'assets/showcase/relay.mp4',
          poster: 'assets/showcase/posters/relay.jpg',
          label: 'Relay feature announcement',
        },
        {
          src: 'assets/motify-web.mp4',
          poster: 'assets/showcase/posters/motify-web.jpg',
          label: 'Motify feature walkthrough',
        },
      ],
    },
  ];

  readonly activeStory = signal(this.stories[0].id);
  private scrollFrame?: number;

  constructor() {
    afterNextRender(() => {
      this.updateActiveStory();
      this.showcaseVideos.forEach((video) => this.startVideo(video.nativeElement));
    });
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

  playVideo(event: Event): void {
    this.startVideo(event.currentTarget as HTMLVideoElement);
  }

  private startVideo(video: HTMLVideoElement): void {
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    void video.play().catch(() => undefined);
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

    if (activeId) this.activeStory.set(activeId);
  }
}
