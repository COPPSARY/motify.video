import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * A muted preview video that only loads once it nears the viewport, plays while
 * it is on screen and pauses once it leaves. The host gets `is-ready` when its
 * first frame is decoded, so the container can show a skeleton until then.
 *
 * The server renders the element without a `src`, so prerendered pages never
 * start downloading every preview at once.
 */
@Directive({
  selector: 'video[appLazyVideo]',
  standalone: true,
  host: {
    '(loadeddata)': 'markReady()',
    '(loadedmetadata)': 'silence()',
    '(play)': 'silence()',
    '(volumechange)': 'silence()',
  },
})
export class LazyVideoDirective {
  readonly src = input.required<string>({ alias: 'appLazyVideo' });

  private readonly video = inject<ElementRef<HTMLVideoElement>>(ElementRef).nativeElement;
  private observer?: IntersectionObserver;
  private loaded = false;

  constructor() {
    afterNextRender(() => {
      this.silence();
      if (typeof IntersectionObserver === 'undefined') {
        this.play();
        return;
      }
      this.observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? this.play() : this.video.pause()),
        { rootMargin: '300px 0px' },
      );
      this.observer.observe(this.video);
    });
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }

  markReady(): void {
    this.video.classList.add('is-ready');
  }

  silence(): void {
    if (!this.video.muted) this.video.muted = true;
    if (this.video.volume !== 0) this.video.volume = 0;
  }

  private play(): void {
    const src = this.src();
    if (!src) return;
    if (!this.loaded) {
      this.loaded = true;
      this.video.src = src;
    }
    void this.video.play().catch(() => undefined);
  }
}
