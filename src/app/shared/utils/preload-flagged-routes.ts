import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { mergeMap, Observable, of, timer } from 'rxjs';

/**
 * Downloads lazy routes marked `data: { preload: true }` shortly after the first
 * page settles, so navigating to them from the landing page does not wait on a
 * chunk download. Everything else stays lazy until it is visited.
 */
@Injectable({ providedIn: 'root' })
export class PreloadFlaggedRoutes implements PreloadingStrategy {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (!this.browser || !route.data?.['preload']) return of(null);
    return timer(1500).pipe(mergeMap(() => load()));
  }
}
