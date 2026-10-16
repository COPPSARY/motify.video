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
 * scripts/fetch-templates.mjs); when the build could not read it, the browser
 * asks GET /v1/prompt-templates instead, and the pages offer a retry if that
 * fails too.
 */
@Injectable({ providedIn: 'root' })
export class TemplateStore {
  private readonly http = inject(HttpClient);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private request?: Promise<void>;

  readonly templates = signal<readonly MotionTemplate[]>(MOTION_TEMPLATES);
  readonly state = signal<TemplateLoadState>(MOTION_TEMPLATES.length ? 'ready' : 'loading');

  find(slug: string | null | undefined): MotionTemplate | undefined {
    return this.templates().find((template) => template.slug === slug);
  }

  /** Resolves once the list is in, or has failed; the server never fetches. */
  load(): Promise<void> {
    if (this.state() === 'ready' || !this.browser) return Promise.resolve();
    return (this.request ??= this.fetch());
  }

  retry(): Promise<void> {
    this.request = undefined;
    return this.load();
  }

  private async fetch(): Promise<void> {
    this.state.set('loading');
    try {
      const { data } = await firstValueFrom(
        this.http.get<{ data: MotionTemplate[] }>(`${motifyApiUrl()}/v1/prompt-templates`),
      );
      if (!Array.isArray(data) || data.length === 0) throw new Error('The API returned no templates.');
      this.templates.set(data);
      this.state.set('ready');
    } catch {
      this.state.set('error');
    }
  }
}
