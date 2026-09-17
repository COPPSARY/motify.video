import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export const SITE_ORIGIN = 'https://motify.video';

const DEFAULT_IMAGE = `${SITE_ORIGIN}/social-preview.png`;
const JSON_LD_ID = 'motify-page-jsonld';

export interface PageSeo {
  /** Browser + search result title. Keep under ~60 characters. */
  readonly title: string;
  /** Meta description. Keep between 70 and 160 characters. */
  readonly description: string;
  /** Route path starting with a slash, e.g. '/' or '/about'. */
  readonly path: string;
  readonly image?: string;
  /** Robots directive for pages that should not appear in search results. */
  readonly robots?: string;
  /** Optional schema.org payload rendered as a JSON-LD script tag. */
  readonly jsonLd?: Record<string, unknown>;
}

/**
 * Centralises per-route title, description, social tags and canonical URL so
 * every page self-canonicalises instead of inheriting the index.html canonical.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  apply(page: PageSeo): void {
    const url = `${SITE_ORIGIN}${page.path === '/' ? '/' : page.path}`;
    const image = page.image ?? DEFAULT_IMAGE;

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'robots', content: page.robots ?? 'index, follow' });

    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:alt', content: page.title });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: page.title });

    this.setCanonical(url);
    this.setJsonLd(page.jsonLd);
  }

  private setCanonical(url: string): void {
    const head = this.document.head;
    if (!head) {
      return;
    }

    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private setJsonLd(payload?: Record<string, unknown>): void {
    const head = this.document.head;
    if (!head) {
      return;
    }

    const existing = head.querySelector<HTMLScriptElement>(`script#${JSON_LD_ID}`);

    if (!payload) {
      existing?.remove();
      return;
    }

    const script = existing ?? this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(payload);

    if (!existing) {
      head.appendChild(script);
    }
  }
}
