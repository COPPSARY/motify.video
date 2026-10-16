import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { mergeMap, Observable, of } from 'rxjs';

/**
 * Downloads lazy routes marked `data: { preload: true }` as soon as the first
 * page goes idle, so navigating to them from the landing page does not wait on
 * a chunk download. Everything else stays lazy until it is visited.
 *
 * The wait runs outside the zone: a pending zone timer keeps the app unstable,
 * and hydration holds early clicks (event replay) until it is stable.
 */
@Injectable({ providedIn: 'root' })
export class PreloadFlaggedRoutes implements PreloadingStrategy {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly zone = inject(NgZone);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (!this.browser || !route.data?.['preload']) return of(null);
    return this.idle().pipe(mergeMap(() => load()));
  }

  private idle(): Observable<void> {
    return new Observable<void>((subscriber) => {
      const done = () => this.zone.run(() => {
        subscriber.next();
        subscriber.complete();
      });
      return this.zone.runOutsideAngular(() => {
        if (typeof requestIdleCallback === 'function') {
          const handle = requestIdleCallback(done, { timeout: 1500 });
          return () => cancelIdleCallback(handle);
        }
        const handle = setTimeout(done, 300);
        return () => clearTimeout(handle);
      });
    });
  }
}
