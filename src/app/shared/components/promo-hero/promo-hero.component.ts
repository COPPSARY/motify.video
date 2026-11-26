import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { mountGlobe } from '../../../features/login/globe';
import { PromotionService } from '../../services/promotion.service';

/** The sale banner above the pricing cards: a cobalt sunrise over the dotted globe. Clicking it applies the code. */
@Component({
  selector: 'app-promo-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (promo.live(); as live) {
      <button type="button" class="promo-hero" [class.promo-hero--applied]="promo.applied()" (click)="claim()">
        <canvas #globe class="promo-hero__globe" aria-hidden="true"></canvas>
        <span class="promo-hero__veil" aria-hidden="true"></span>

        <span class="promo-hero__content">
          <span class="promo-hero__eyebrow">{{ live.title }} · ends in</span>
          <span class="promo-hero__percent">{{ live.percent }}<small>% off</small></span>
          <span class="promo-hero__clock" aria-label="Time left">
            @if (promo.remaining().days !== '00') {
              <span><b>{{ promo.remaining().days }}</b><i>days</i></span>
            }
            <span><b>{{ promo.remaining().hours }}</b><i>hrs</i></span>
            <span><b>{{ promo.remaining().minutes }}</b><i>min</i></span>
            <span><b>{{ promo.remaining().seconds }}</b><i>sec</i></span>
          </span>
          <span class="promo-hero__cta">
            @if (promo.applied()) {
              <span class="promo-hero__check" aria-hidden="true">✓</span> {{ live.code }} applied to every plan
            } @else {
              {{ live.ctaLabel }} <span aria-hidden="true">→</span>
            }
          </span>
        </span>
      </button>
    }
  `,
  styles: `
    :host { display: block; margin-bottom: 3rem; }
    .promo-hero {
      position: relative;
      display: block;
      width: 100%;
      height: clamp(17rem, 26vw, 20rem);
      padding: 0;
      overflow: hidden;
      isolation: isolate;
      border: 1px solid rgba(39, 88, 230, 0.32);
      border-radius: var(--motify-radius-lg, 1.25rem);
      background: radial-gradient(70% 60% at 50% 0%, rgba(31, 69, 176, 0.16), transparent 70%), var(--motify-ink, #07080a);
      color: var(--motify-white, #fff);
      font: inherit;
      font-family: var(--motify-font-sans);
      text-align: center;
      cursor: pointer;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .promo-hero:hover {
      border-color: rgba(39, 88, 230, 0.7);
      box-shadow: 0 0 0 1px rgba(39, 88, 230, 0.25), 0 24px 60px -24px rgba(31, 69, 176, 0.7);
    }
    .promo-hero:focus-visible { outline: 2px solid var(--motify-cobalt-hover, #2758e6); outline-offset: 3px; }
    .promo-hero__globe {
      position: absolute;
      inset: 0;
      z-index: -2;
      width: 100%;
      height: 100%;
      animation: promo-globe-in 1.2s ease both;
    }
    @keyframes promo-globe-in { from { opacity: 0; transform: translateY(12px); } }
    .promo-hero__veil {
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
      background-size: 18px 18px;
      mask-image: linear-gradient(180deg, #000, transparent 55%);
      pointer-events: none;
    }
    .promo-hero__content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.55rem;
      height: 100%;
      padding: 1.5rem 1rem 0;
    }
    .promo-hero__eyebrow {
      padding: 0.3rem 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      background: rgba(7, 8, 10, 0.6);
      color: rgba(255, 255, 255, 0.72);
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .promo-hero__percent {
      font-size: clamp(3.6rem, 8vw, 5.4rem);
      font-weight: 700;
      line-height: 0.95;
      letter-spacing: -0.06em;
      background: linear-gradient(180deg, #ffffff 30%, #9db4ff 75%, #2758e6 110%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .promo-hero__percent small {
      margin-left: 0.2rem;
      font-size: 0.38em;
      font-weight: 500;
      letter-spacing: -0.02em;
    }
    .promo-hero__clock { display: flex; gap: 0.4rem; }
    .promo-hero__clock span {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 3.1rem;
      padding: 0.3rem 0.4rem 0.25rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.6rem;
      background: rgba(7, 8, 10, 0.7);
      backdrop-filter: blur(6px);
    }
    .promo-hero__clock b {
      font-size: 1.15rem;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      line-height: 1.1;
    }
    .promo-hero__clock i {
      color: rgba(255, 255, 255, 0.45);
      font-size: 0.6rem;
      font-style: normal;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .promo-hero__cta {
      position: absolute;
      bottom: 1.4rem;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.65rem 1.25rem;
      border-radius: 999px;
      background: var(--motify-cobalt, #1f45b0);
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) inset, 0 10px 30px -8px rgba(39, 88, 230, 0.9);
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.2s ease;
    }
    .promo-hero:hover .promo-hero__cta { background: var(--motify-cobalt-hover, #2758e6); }
    .promo-hero--applied .promo-hero__cta {
      background: rgba(7, 8, 10, 0.78);
      box-shadow: 0 0 0 1px rgba(157, 180, 255, 0.5) inset;
    }
    .promo-hero__check {
      display: inline-grid;
      place-items: center;
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      background: var(--motify-cobalt-hover, #2758e6);
      font-size: 0.7rem;
    }
    @media (prefers-reduced-motion: reduce) { .promo-hero__globe { animation: none; } }
  `,
})
export class PromoHeroComponent implements OnInit {
  protected readonly promo = inject(PromotionService);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('globe');
  /** Fired after the code is claimed, so the page can bring the cards into view. */
  readonly claimed = output<string>();

  constructor() {
    let stop: (() => void) | undefined;
    let mounted: HTMLCanvasElement | undefined;
    afterRenderEffect(() => {
      const canvas = this.canvas()?.nativeElement;
      if (canvas === mounted) return;
      stop?.();
      mounted = canvas;
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      stop = canvas ? mountGlobe(canvas, { still, placement: 'horizon', tint: 'cobalt' }) : undefined;
    });
    inject(DestroyRef).onDestroy(() => stop?.());
  }

  ngOnInit(): void {
    void this.promo.load();
  }

  protected claim(): void {
    const live = this.promo.live();
    if (!live) return;
    this.promo.claim(live.code);
    this.claimed.emit(live.code);
  }
}
