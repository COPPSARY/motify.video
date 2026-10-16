import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input, NgZone } from '@angular/core';

/** Off-screen previews that may buffer at the same time; the rest wait their turn. */
const PREFETCH_SLOTS = 2;
/** A prefetch that has not reached `canplaythrough` by then gives its slot to the next one. */
const PREFETCH_TIMEOUT_MS = 10_000;

const waiting = new Set<() => void>();
let activePrefetches = 0;
let pageSettled: Promise<void> | undefined;

/** Resolves once the page has loaded and the browser is idle, so prefetching never competes with first paint. */
function whenPageSettled(): Promise<void> {
  return (pageSettled ??= new Promise<void>((resolve) => {
    const idle = () =>
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback(() => resolve(), { timeout: 2000 })
        : setTimeout(resolve, 500);
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
  }));
}

function drainQueue(): void {
  for (const start of waiting) {
    if (activePrefetches >= PREFETCH_SLOTS) return;
    waiting.delete(start);
    start();
  }
}

function saveData(): boolean {
  return (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
}

/**
 * A muted preview video that starts buffering about a screen and a half before
 * it scrolls into view (a couple at a time, once the page has settled), plays
 * while it is on screen and pauses once it leaves. The host gets `is-ready` when
 * its first frame is decoded, so the container can show a skeleton until then.
 *
 * The server renders the element without a `src`, so prerendered pages never
 * start downloading every preview at once.
 */
@Directive({
  selector: 'video[appLazyVideo]',
  standalone: true,
  host: {
    preload: 'none',
    '(loadeddata)': 'markReady()',
    '(loadedmetadata)': 'silence()',
    '(play)': 'silence()',
    '(volumechange)': 'silence()',
  },
})
export class LazyVideoDirective {
  readonly src = input.required<string>({ alias: 'appLazyVideo' });

  private readonly video = inject<ElementRef<HTMLVideoElement>>(ElementRef).nativeElement;
  private readonly observers: IntersectionObserver[] = [];
  private attached = false;
  private releasePrefetch?: () => void;
  private readonly startPrefetch = () => this.prefetch();

  constructor() {
    const zone = inject(NgZone);
    afterNextRender(() => {
      this.silence();
      if (typeof IntersectionObserver === 'undefined') {
        this.play();
        return;
      }
      // Observers and timers stay outside the zone so they never hold up app stability (and event replay).
      zone.runOutsideAngular(() => {
        this.observe('0px', (visible) => (visible ? this.play() : this.video.pause()));
        if (!saveData()) this.observe('150% 0px', (near) => (near ? this.queuePrefetch() : waiting.delete(this.startPrefetch)));
      });
    });
    inject(DestroyRef).onDestroy(() => {
      this.observers.forEach((observer) => observer.disconnect());
      waiting.delete(this.startPrefetch);
      this.releasePrefetch?.();
    });
  }

  markReady(): void {
    this.video.classList.add('is-ready');
  }

  silence(): void {
    if (!this.video.muted) this.video.muted = true;
    if (this.video.volume !== 0) this.video.volume = 0;
  }

  private observe(rootMargin: string, onChange: (intersecting: boolean) => void): void {
    const observer = new IntersectionObserver(([entry]) => onChange(entry.isIntersecting), { rootMargin });
    observer.observe(this.video);
    this.observers.push(observer);
  }

  private queuePrefetch(): void {
    if (this.attached) return;
    waiting.add(this.startPrefetch);
    void whenPageSettled().then(drainQueue);
  }

  /** Buffers the preview while it is still off screen, holding a slot until enough has arrived. */
  private prefetch(): void {
    if (!this.attach()) return;
    activePrefetches++;
    const done = () => {
      clearTimeout(timer);
      this.video.removeEventListener('canplaythrough', done);
      this.video.removeEventListener('error', done);
      this.releasePrefetch = undefined;
      activePrefetches--;
      drainQueue();
    };
    const timer = setTimeout(done, PREFETCH_TIMEOUT_MS);
    this.video.addEventListener('canplaythrough', done);
    this.video.addEventListener('error', done);
    this.releasePrefetch = done;
  }

  /** Sets the source once; false when it was already set or there is none. */
  private attach(): boolean {
    const src = this.src();
    if (this.attached || !src) return false;
    this.attached = true;
    waiting.delete(this.startPrefetch);
    this.video.preload = 'auto';
    this.video.src = src;
    return true;
  }

  private play(): void {
    this.attach();
    if (!this.attached) return;
    void this.video.play().catch(() => undefined);
  }
}
