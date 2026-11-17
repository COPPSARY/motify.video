import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';

export interface HighlightClip {
  readonly category: string;
  readonly title: string;
  readonly video: string;
  readonly poster: string;
}

/** Real videos made with Motify. The ones the hero does not show come first. */
export const HIGHLIGHT_CLIPS: readonly HighlightClip[] = [
  { category: 'SaaS video', title: 'Animated SaaS workflow', video: 'assets/claude.webm', poster: 'assets/showcase/posters/claude.jpg' },
  { category: 'SaaS video', title: 'BookMeBus', video: 'assets/showcase/bookmebus.webm', poster: 'assets/showcase/posters/bookmebus.jpg' },
  { category: 'SaaS video', title: 'KiriTTS', video: 'assets/showcase/kiritts.webm', poster: 'assets/showcase/posters/kiritts.jpg' },
  { category: 'Ad', title: 'Motiks editorial ad', video: 'assets/showcase/motiks-editorial-ad.webm', poster: 'assets/showcase/posters/motiks-editorial-ad.jpg' },
  { category: 'Motion graphics', title: 'Porco Rosso, Just Breathe', video: 'assets/showcase/porco-rosso-just-breathe.webm', poster: 'assets/showcase/posters/porco-rosso-just-breathe.jpg' },
  { category: 'Product demo', title: 'Motify test run', video: 'assets/showcase/motify-test-run.webm', poster: 'assets/showcase/posters/motify-test-run.jpg' },
  { category: 'Launch video', title: 'TobSar product launch', video: 'assets/showcase/tobsar-product-launch.webm', poster: 'assets/showcase/posters/tobsar-product-launch.jpg' },
  { category: 'Ad', title: 'Motiks Spicy Curls', video: 'assets/showcase/motiks-spicy-curls.webm', poster: 'assets/showcase/posters/motiks-spicy-curls.jpg' },
  { category: 'Motion graphics', title: 'Paper Moon', video: 'assets/showcase/paper-moon.webm', poster: 'assets/showcase/posters/paper-moon.jpg' },
  { category: 'Product demo', title: 'Morakot CBS walkthrough', video: 'assets/showcase/morakot-cbs-walkthrough.webm', poster: 'assets/showcase/posters/morakot-cbs-walkthrough.jpg' },
];

/**
 * One clip at a time, centred, with its neighbours peeking. The active clip plays
 * from the start and, when it ends, the carousel moves on to the next one. The
 * progress dots show how far the clip has played. Swipe, arrows, dots, and a
 * pause control are all available; with reduced motion it never moves by itself.
 *
 * The server HTML renders posters only; videos load when they become active.
 */
@Component({
  selector: 'app-highlights-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './highlights-carousel.component.html',
  styleUrl: './highlights-carousel.component.css',
})
export class HighlightsCarouselComponent {
  readonly clips = HIGHLIGHT_CLIPS;
  readonly active = signal(0);
  /** The visitor's choice; Pause stops playback and auto-advance. */
  readonly playing = signal(true);
  /** How far the active clip has played, 0 to 1. */
  readonly progress = signal(0);

  private readonly inView = signal(false);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly cards = viewChildren<ElementRef<HTMLElement>>('card');
  private readonly videos = viewChildren<ElementRef<HTMLVideoElement>>('video');
  private browserReady = false;
  /** While a programmatic scroll is running, cards passing by must not become active. */
  private steering = false;
  private steerTimer?: ReturnType<typeof setTimeout>;
  private frame = 0;
  private shownIndex = -1;
  /** Becomes true the first time the section is near the screen; nothing downloads before. */
  private started = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.browserReady = true;
      const track = this.track().nativeElement;

      const cardObserver = new IntersectionObserver(
        (entries) => {
          if (this.steering) return;
          const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => this.cardIndex(entry.target));
          if (visible.length) this.active.set(visible[0]);
        },
        { root: track, threshold: 0.6 },
      );
      this.cards().forEach((card) => cardObserver.observe(card.nativeElement));

      const sectionObserver = new IntersectionObserver(([entry]) => this.inView.set(!!entry?.isIntersecting), {
        threshold: 0.25,
      });
      sectionObserver.observe(track);

      // Start buffering the first clips about a screen before the section arrives.
      const warmObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          warmObserver.disconnect();
          this.started = true;
          this.syncPlayback();
        },
        { rootMargin: '100% 0px' },
      );
      warmObserver.observe(track);

      const onVisibility = () => this.inView.set(document.visibilityState === 'visible' && this.isOnScreen(track));
      document.addEventListener('visibilitychange', onVisibility);

      destroyRef.onDestroy(() => {
        cardObserver.disconnect();
        sectionObserver.disconnect();
        warmObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        cancelAnimationFrame(this.frame);
        clearTimeout(this.steerTimer);
      });

      this.syncPlayback();
    });

    // Play only the active clip, and only while the visitor can see it and has not paused.
    effect(() => {
      this.active();
      this.playing();
      this.inView();
      untracked(() => this.syncPlayback());
    });
  }

  go(index: number): void {
    const count = this.clips.length;
    const next = ((index % count) + count) % count;
    this.active.set(next);
    this.scrollToCard(next);
  }

  next(): void {
    this.go(this.active() + 1);
  }

  previous(): void {
    this.go(this.active() - 1);
  }

  togglePlaying(): void {
    this.playing.update((value) => !value);
  }

  onEnded(index: number): void {
    if (index !== this.active()) return;
    if (this.reducedMotion()) {
      // Never move on its own; leave the clip on its last frame.
      this.progress.set(1);
      return;
    }
    this.next();
  }

  private syncPlayback(): void {
    if (!this.browserReady || !this.started) return;
    const active = this.active();
    const shouldPlay = this.playing() && this.inView();

    this.videos().forEach(({ nativeElement: video }, index) => {
      const clip = this.clips[index];
      const isActive = index === active;
      const isNext = index === (active + 1) % this.clips.length;
      if ((isActive || isNext) && !video.getAttribute('src')) {
        video.muted = true;
        video.preload = isActive ? 'auto' : 'metadata';
        video.src = clip.video;
      }
      if (!isActive) {
        video.pause();
        return;
      }
      if (this.shownIndex !== active) {
        this.shownIndex = active;
        video.currentTime = 0;
        this.progress.set(0);
      }
      if (shouldPlay) void video.play().catch(() => undefined);
      else video.pause();
    });

    cancelAnimationFrame(this.frame);
    if (shouldPlay) this.trackProgress();
  }

  private trackProgress(): void {
    const video = this.videos()[this.active()]?.nativeElement;
    if (!video) return;
    const tick = () => {
      if (video.duration > 0) this.progress.set(Math.min(1, video.currentTime / video.duration));
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  private scrollToCard(index: number): void {
    const track = this.track().nativeElement;
    const card = this.cards()[index]?.nativeElement;
    if (!card || typeof track.scrollTo !== 'function') return;
    this.steering = true;
    clearTimeout(this.steerTimer);
    this.steerTimer = setTimeout(() => (this.steering = false), 700);
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: this.reducedMotion() ? 'auto' : 'smooth',
    });
  }

  private cardIndex(element: Element): number {
    return this.cards().findIndex((card) => card.nativeElement === element);
  }

  private isOnScreen(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  private reducedMotion(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
