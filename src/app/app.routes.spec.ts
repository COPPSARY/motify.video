import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import * as fc from 'fast-check';
import { routes } from './app.routes';
import { LandingPageComponent } from './features/landing-page/landing-page.component';

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
   * For any unknown path, navigating to that path resolves to the landing
   * page route (via the wildcard redirect) rather than a blank/404 state.
   */
  it('resolves any unknown path to the landing page (Property 7)', async () => {
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
          .filter((s) => s.length > 0 && !['login', 'signup', 'about', 'getting-started', 'pricing'].includes(s)),
        async (path) => {
          const activatedComponent = await harness.navigateByUrl(`/${path}`);

          expect(activatedComponent)
            .withContext(`expected a component to be activated for path "/${path}"`)
            .not.toBeNull();
          expect(activatedComponent).toBeInstanceOf(LandingPageComponent);
          expect(router.url).withContext(`expected router to resolve to root for path "/${path}"`).toBe('/');
        },
      ),
      { numRuns: 25 },
    );
  });

});
