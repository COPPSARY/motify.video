import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { motifyApiUrl } from '../config/runtime-config';

/** The promotion row the API serves from `promotion_banners` (switched on and off with its `enabled` column). */
interface PromotionBannerResponse {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly ctaLabel: string | null;
  readonly ctaUrl: string | null;
  readonly endsAt: string;
}

export interface ActivePromotion {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly ctaLabel: string;
  /** The promo code the banner sells, read from `?promo=` in its CTA URL. */
  readonly code: string;
  /** The percentage off, read from the title or message ("55% off"). */
  readonly percent: number;
  readonly endsAt: number;
}

const DISMISSED_KEY = 'motify.promo-bar.dismissed';
const APPLIED_KEY = 'motify.promo.applied';

/**
 * The live promotion, if any. Turning the `promotion_banners` row off in Supabase
 * (enabled = false, or ends_at passed) hides the top bar, the pricing banner and the
 * pricing card discount together.
 */
@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly http = inject(HttpClient);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private loading?: Promise<void>;

  readonly promotion = signal<ActivePromotion | null>(null);
  readonly now = signal(Date.now());
  readonly barDismissed = signal(this.readSession(DISMISSED_KEY) !== null);
  /** The code the visitor claimed from a banner; it only counts while that promotion is live. */
  private readonly claimedCode = signal(this.readSession(APPLIED_KEY));

  readonly live = computed(() => {
    const promotion = this.promotion();
    return promotion && promotion.endsAt > this.now() ? promotion : null;
  });

  readonly applied = computed(() => {
    const promotion = this.live();
    const claimed = this.claimedCode();
    return promotion && claimed && claimed.toUpperCase() === promotion.code.toUpperCase() ? promotion : null;
  });

  readonly showBar = computed(() => !!this.live() && !this.barDismissed());

  /** Loads the active promotion once per visit and starts the countdown clock. */
  load(): Promise<void> {
    if (!this.browser) return Promise.resolve();
    this.loading ??= this.fetch();
    return this.loading;
  }

  claim(code: string): void {
    this.claimedCode.set(code);
    this.writeSession(APPLIED_KEY, code);
  }

  unclaim(): void {
    this.claimedCode.set(null);
    try { sessionStorage.removeItem(APPLIED_KEY); } catch { /* storage blocked */ }
  }

  dismissBar(): void {
    this.barDismissed.set(true);
    this.writeSession(DISMISSED_KEY, '1');
  }

  /** Days, hours, minutes and seconds left, zero-padded. */
  readonly remaining = computed(() => {
    const promotion = this.live();
    const total = promotion ? Math.max(0, Math.floor((promotion.endsAt - this.now()) / 1000)) : 0;
    const pad = (value: number) => String(value).padStart(2, '0');
    return {
      days: pad(Math.floor(total / 86400)),
      hours: pad(Math.floor((total % 86400) / 3600)),
      minutes: pad(Math.floor((total % 3600) / 60)),
      seconds: pad(total % 60),
    };
  });

  private async fetch(): Promise<void> {
    try {
      const response = await firstValueFrom(this.http.get<{ data: PromotionBannerResponse | null }>(
        `${motifyApiUrl()}/v1/promotions/banner`,
        { withCredentials: true },
      ));
      this.promotion.set(response.data ? this.toPromotion(response.data) : null);
    } catch {
      this.promotion.set(null);
    }
    if (this.promotion()) setInterval(() => this.now.set(Date.now()), 1000);
  }

  private toPromotion(banner: PromotionBannerResponse): ActivePromotion | null {
    const code = banner.ctaUrl
      ? new URL(banner.ctaUrl, 'https://motify.invalid').searchParams.get('promo')?.trim()
      : null;
    const percent = Number(/(\d{1,3})\s*%/.exec(`${banner.title} ${banner.message}`)?.[1] ?? 0);
    if (!code) return null;
    return {
      id: banner.id,
      title: banner.title,
      message: banner.message,
      ctaLabel: banner.ctaLabel ?? 'Claim offer',
      code: code.toUpperCase(),
      percent: Math.min(percent, 100),
      endsAt: new Date(banner.endsAt).getTime(),
    };
  }

  private readSession(key: string): string | null {
    if (!this.browser) return null;
    try { return sessionStorage.getItem(key); } catch { return null; }
  }

  private writeSession(key: string, value: string): void {
    try { sessionStorage.setItem(key, value); } catch { /* storage blocked */ }
  }
}
