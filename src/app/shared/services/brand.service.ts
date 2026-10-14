import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { motifyApiUrl } from '../config/runtime-config';
import { AuthService } from './auth.service';

/** What onboarding asks about the product; a small slice of Brand DNA. */
export interface BrandBasics {
  readonly name: string;
  readonly description: string;
  readonly audience: string;
  /** `#rrggbb`, or '' when none was picked. */
  readonly color: string;
  /** A normalized http(s) URL, or ''. */
  readonly website: string;
}

interface BrandResource {
  readonly revision: number;
  readonly dna: {
    readonly identity: { readonly name: string; readonly websiteUrl: string; readonly tagline: string };
    readonly visual: { readonly colors: readonly { id: string; name: string; hex: string; role: string }[]; readonly fonts: readonly unknown[] };
    readonly product: { readonly description: string; readonly features: readonly unknown[]; readonly targetAudience: string };
    readonly story: Record<string, string>;
    readonly voice: { readonly tone: readonly string[]; readonly writingStyle: string };
  };
}

/**
 * Onboarding's line to Brand DNA (the same document the app's Brand Kit edits):
 * read a website into it, then save what the person confirmed. A confirmed
 * value is saved as their own edit, so a later website read never replaces it.
 */
@Injectable({ providedIn: 'root' })
export class BrandService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  /** Whether this API can read websites; older deployments and kill-switched ones cannot. */
  async canExtract(): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.get<{ data: { brandExtraction?: boolean } }>(`${motifyApiUrl()}/v1/capabilities`));
      return response.data.brandExtraction === true;
    } catch {
      return false;
    }
  }

  /** Reads the website into Brand DNA (never over what the person typed) and returns what is now known. */
  async extractFromWebsite(website: string): Promise<BrandBasics> {
    const response = await firstValueFrom(this.http.post<{ data: { brand: BrandResource } }>(
      `${motifyApiUrl()}/v1/brand/extract`,
      { url: website },
      { withCredentials: true, headers: { 'X-CSRF-Token': this.requireCsrf() } },
    ));
    const { dna } = response.data.brand;
    return {
      name: dna.identity.name,
      description: dna.product.description,
      audience: dna.product.targetAudience,
      color: primaryColor(dna.visual.colors),
      website: dna.identity.websiteUrl,
    };
  }

  async saveBasics(basics: BrandBasics): Promise<void> {
    const csrfToken = this.requireCsrf();
    const url = `${motifyApiUrl()}/v1/brand`;
    const current = await firstValueFrom(this.http.get<{ data: BrandResource }>(url, { withCredentials: true }));
    const { dna } = current.data;
    // What the person left blank keeps whatever Brand DNA already had.
    const take = (existing: string, next: string) => next.trim() || existing;
    const color = basics.color.toLowerCase();
    const colors = !color || color === primaryColor(dna.visual.colors)
      ? dna.visual.colors
      : [{ id: crypto.randomUUID().slice(0, 8), name: 'Primary', hex: color, role: 'primary' }, ...dna.visual.colors.filter((item) => item.role !== 'primary' && item.hex !== color)];

    const next = {
      ...dna,
      identity: { ...dna.identity, name: take(dna.identity.name, basics.name), websiteUrl: take(dna.identity.websiteUrl, basics.website) },
      product: {
        ...dna.product,
        description: take(dna.product.description, basics.description),
        targetAudience: take(dna.product.targetAudience, basics.audience),
      },
      visual: { ...dna.visual, colors: colors.slice(0, 12) },
    };
    await firstValueFrom(this.http.put(
      url,
      { revision: current.data.revision, dna: next },
      { withCredentials: true, headers: { 'X-CSRF-Token': csrfToken } },
    ));
  }

  private requireCsrf(): string {
    const csrfToken = this.auth.csrfToken();
    if (!csrfToken) throw new Error('Sign in again to save your brand.');
    return csrfToken;
  }
}

function primaryColor(colors: readonly { hex: string; role: string }[]): string {
  return (colors.find((color) => color.role === 'primary') ?? colors[0])?.hex ?? '';
}
