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
} from '@angular/core';
import { useMotion } from '../../../../shared/motion/gsap-loader';
import { LandingDemoStore } from '../../landing-demo';

const FADE_MS = 150;

/**
 * Real Motify output under the hero, following the example chosen in the hero
 * chips. Changing the example crossfades to its video. The frame grows from a
 * smaller, tilted card to full size as it scrolls in (scrubbed to scroll).
 *
 * The server renders only the poster; the video starts loading once the reel
 * is about a screen away.
 */
@Component({
  selector: 'app-hero-reel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="reel" class="reel" aria-label="Videos made with Motify">
      <figure class="reel__frame">
        <video
          #video
          class="reel__video"
          [class.is-swapping]="swapping()"
          [attr.poster]="store.active().poster"
          [attr.aria-label]="store.active().caption + ', made with Motify'"
          muted
          loop
          playsinline
          preload="none"
        ></video>
      </figure>
      <p class="reel__caption" aria-live="polite">
        <span class="reel__caption-mark" aria-hidden="true"></span>
        <span class="reel__caption-kind">{{ store.active().label }}</span>
        <span class="reel__caption-dot" aria-hidden="true">·</span>
        {{ store.active().caption }}, made with Motify.
      </p>
    </section>
  `,
  styleUrl: './hero-reel.component.css',
})
export class HeroReelComponent {
  protected readonly store = inject(LandingDemoStore);
  protected readonly swapping = signal(false);
  private readonly videoRef = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  /** Set once the reel is near the viewport; until then nothing downloads. */
  private readonly started = signal(false);
  private swapTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const video = this.videoRef().nativeElement;
      video.muted = true;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          if (entry.isIntersecting) {
            if (!this.started()) this.started.set(true);
            else void video.play().catch(() => undefined);
          } else if (this.started()) {
            video.pause();
          }
        },
        { rootMargin: '100% 0px' },
      );
      observer.observe(video);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        clearTimeout(this.swapTimer);
      });
    });

    // Load the first video once in range, then crossfade whenever the example changes.
    let shown = '';
    effect(() => {
      const demo = this.store.active();
      if (!this.started()) return;
      untracked(() => {
        if (demo.video === shown) return;
        const first = shown === '';
        shown = demo.video;
        this.swapTo(demo.video, first);
      });
    });

    useMotion(({ gsap, reduced }) => {
      if (reduced) return;
      gsap.fromTo(
        '.reel__frame',
        { scale: 0.84, rotateX: 14, y: 40, borderRadius: '2.25rem' },
        {
          scale: 1,
          rotateX: 0,
          y: 0,
          borderRadius: '1.25rem',
          ease: 'none',
          scrollTrigger: { trigger: '.reel', start: 'top 95%', end: 'top 15%', scrub: 0.6 },
        },
      );
    });
  }

  private swapTo(src: string, immediate: boolean): void {
    const video = this.videoRef().nativeElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const load = () => {
      video.src = src;
      video.addEventListener('playing', () => this.swapping.set(false), { once: true });
      void video.play().catch(() => this.swapping.set(false));
    };

    clearTimeout(this.swapTimer);
    if (immediate || reduced) {
      load();
      return;
    }
    this.swapping.set(true);
    this.swapTimer = setTimeout(load, FADE_MS);
  }
}
