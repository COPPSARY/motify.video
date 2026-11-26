import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { PromotionService } from '../../services/promotion.service';

/** The thin sale bar over the navbar. Clicking it claims the code and opens /pricing. */
@Component({
  selector: 'app-promo-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (promo.showBar() && promo.live(); as live) {
      <div class="promo-bar" role="region" aria-label="Sale">
        <span class="promo-bar__dots" aria-hidden="true"></span>
        <button type="button" class="promo-bar__main" (click)="claim()">
          <span class="promo-bar__tag">{{ live.title }}</span>
          <span class="promo-bar__percent">{{ live.percent }}% off <em>every plan</em></span>
          <span class="promo-bar__clock" aria-label="Time left">
            @if (promo.remaining().days !== '00') { <b>{{ promo.remaining().days }}</b><i>d</i> }
            <b>{{ promo.remaining().hours }}</b><i>h</i>
            <b>{{ promo.remaining().minutes }}</b><i>m</i>
            <b>{{ promo.remaining().seconds }}</b><i>s</i>
          </span>
          <span class="promo-bar__cta">Use {{ live.code }} <span aria-hidden="true">→</span></span>
        </button>
        <button type="button" class="promo-bar__close" aria-label="Hide sale banner" (click)="promo.dismissBar()">×</button>
      </div>
    }
  `,
  styles: `
    .promo-bar {
      position: fixed;
      inset: 0 0 auto;
      z-index: 101;
      height: var(--promo-bar-h);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      isolation: isolate;
      background:
        radial-gradient(40% 260% at 50% 130%, rgba(39, 88, 230, 0.55), transparent 70%),
        linear-gradient(90deg, var(--motify-ink, #07080a), #0a1230 50%, var(--motify-ink, #07080a));
      border-bottom: 1px solid rgba(39, 88, 230, 0.35);
      font-family: var(--motify-font-sans);
    }
    /* A drifting field of cobalt dots, echoing the login globe. */
    .promo-bar__dots {
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image:
        radial-gradient(rgba(120, 155, 255, 0.55) 1px, transparent 1.2px),
        radial-gradient(rgba(255, 255, 255, 0.25) 0.8px, transparent 1px);
      background-size: 9px 9px, 23px 17px;
      background-position: 0 0, 5px 4px;
      mask-image: radial-gradient(60% 140% at 50% 100%, #000, transparent 75%);
      animation: promo-bar-drift 30s linear infinite;
    }
    @keyframes promo-bar-drift { to { background-position: 90px 0, 120px 4px; } }
    .promo-bar__main {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      height: 100%;
      padding: 0 1rem;
      border: 0;
      background: none;
      color: #fff;
      font: inherit;
      cursor: pointer;
    }
    .promo-bar__tag {
      padding: 0.18rem 0.55rem;
      border: 1px solid rgba(157, 180, 255, 0.35);
      border-radius: 999px;
      color: #c9d6ff;
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .promo-bar__percent {
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.03em;
    }
    .promo-bar__percent em {
      margin-left: 0.15rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      font-style: normal;
      font-weight: 400;
      letter-spacing: 0;
    }
    .promo-bar__clock { display: flex; align-items: center; gap: 0.15rem; }
    .promo-bar__clock b {
      min-width: 1.8rem;
      padding: 0.2rem 0.3rem;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 0.4rem;
      background: rgba(7, 8, 10, 0.65);
      font-size: 0.82rem;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      text-align: center;
    }
    .promo-bar__clock i { margin-right: 0.25rem; color: rgba(255, 255, 255, 0.45); font-size: 0.7rem; font-style: normal; }
    .promo-bar__cta {
      padding: 0.42rem 1rem;
      border-radius: 999px;
      background: var(--motify-cobalt, #1f45b0);
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14) inset, 0 4px 16px -4px rgba(39, 88, 230, 0.9);
      font-size: 0.8rem;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.2s ease;
    }
    .promo-bar__main:hover .promo-bar__cta { background: var(--motify-cobalt-hover, #2758e6); }
    .promo-bar__close {
      position: absolute;
      right: 0.9rem;
      border: 0;
      background: none;
      color: rgba(255, 255, 255, 0.55);
      font-size: 1.3rem;
      line-height: 1;
      cursor: pointer;
    }
    .promo-bar__close:hover { color: #fff; }
    @media (max-width: 760px) {
      .promo-bar__tag, .promo-bar__percent em, .promo-bar__clock i { display: none; }
      .promo-bar__main { gap: 0.55rem; }
      .promo-bar__percent { font-size: 0.95rem; }
      .promo-bar__clock b { min-width: 1.4rem; font-size: 0.72rem; }
      .promo-bar__cta { font-size: 0.72rem; padding: 0.28rem 0.6rem; }
    }
    @media (max-width: 440px) { .promo-bar__clock { display: none; } }
    @media (prefers-reduced-motion: reduce) { .promo-bar__dots { animation: none; } }
  `,
})
export class PromoBarComponent implements OnInit {
  protected readonly promo = inject(PromotionService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  constructor() {
    // The navbar and page content move down by the bar's height while it shows.
    effect(() => this.document.documentElement.classList.toggle('has-promo-bar', this.promo.showBar()));
  }

  ngOnInit(): void {
    void this.promo.load();
  }

  protected claim(): void {
    const live = this.promo.live();
    if (!live) return;
    this.promo.claim(live.code);
    void this.router.navigate(['/pricing'], { queryParams: { promo: live.code } });
  }
}
