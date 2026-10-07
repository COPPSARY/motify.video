import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import * as fc from 'fast-check';
import { routes } from './app.routes';
import { NotFoundPageComponent } from './features/not-found/not-found-page.component';

describe('app.routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient()],
    });
  });

  /**
   * Property 7: No dead route
   * Validates: Requirements 10.2
   *
   * For any unknown path, navigating to that path resolves to the dedicated
   * not-found page rather than the homepage or a blank state.
   */
  it('resolves any unknown path to the not-found page (Property 7)', async () => {
    // RouterTestingHarness only allows a single instance per test, so it is
    // created once and reused across all property runs (the harness's root
    // component with its RouterOutlet is designed to be reused across
    // multiple navigateByUrl calls within the same test).
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);

    await fc.assert(
      fc.asyncProperty(
        fc
          .stringMatching(/^[a-zA-Z0-9_-]+$/)
          .filter(
            (s) =>
              s.length > 0 &&
              ![
                'login',
                'signup',
                'about',
                'partners',
                'getting-started',
                'resources',
                'help',
                'pricing',
                'terms',
                'privacy',
                'refund-policy',
                '404',
              ].includes(s),
          ),
        async (path) => {
          const activatedComponent = await harness.navigateByUrl(`/${path}`);

          expect(activatedComponent)
            .withContext(`expected a component to be activated for path "/${path}"`)
            .not.toBeNull();
          expect(activatedComponent).toBeInstanceOf(NotFoundPageComponent);
          expect(router.url)
            .withContext(`expected router to preserve the missing path "/${path}"`)
            .toBe(`/${path}`);
        },
      ),
      { numRuns: 25 },
    );
  });

});
