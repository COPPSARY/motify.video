import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { motifyApiUrl } from '../../shared/config/runtime-config';
import { MOTION_TEMPLATES } from './template-catalog';
import { MotionTemplate } from './template-library.data';

export type TemplateLoadState = 'ready' | 'loading' | 'error';

/**
 * The templates the pages render. The build bakes in the API's list (see
 * scripts/fetch-templates.mjs) so pages render at once and prerender; in the
 * browser, GET /v1/prompt-templates then replaces it, so a template added in
 * the admin shows up without a redeploy. When that request fails the baked
 * copy stays, and with no baked copy the pages offer a retry.
 */
@Injectable({ providedIn: 'root' })
export class TemplateStore {
  private readonly http = inject(HttpClient);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private request?: Promise<void>;

  readonly templates = signal<readonly MotionTemplate[]>(MOTION_TEMPLATES);
  readonly state = signal<TemplateLoadState>(MOTION_TEMPLATES.length ? 'ready' : 'loading');
  /** True once the live list has answered (or failed); the server never asks, so it stays on the baked copy. */
  readonly settled = signal(!this.browser);

  find(slug: string | null | undefined): MotionTemplate | undefined {
    return this.templates().find((template) => template.slug === slug);
  }

  /** Resolves once the live list is in, or has failed. Asks the API once per visit. */
  load(): Promise<void> {
    if (!this.browser) return Promise.resolve();
    return (this.request ??= this.fetch());
  }

  retry(): Promise<void> {
    this.request = undefined;
    return this.load();
  }

  private async fetch(): Promise<void> {
    if (!this.templates().length) this.state.set('loading');
    try {
      const { data } = await firstValueFrom(
        this.http.get<{ data: MotionTemplate[] }>(`${motifyApiUrl()}/v1/prompt-templates`),
      );
      if (!Array.isArray(data) || data.length === 0) throw new Error('The API returned no templates.');
      this.templates.set(data);
      this.state.set('ready');
    } catch {
      if (!this.templates().length) this.state.set('error');
    } finally {
      this.settled.set(true);
    }
  }
}
