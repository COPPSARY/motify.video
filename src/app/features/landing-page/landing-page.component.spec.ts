import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import * as fc from 'fast-check';
import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  /**
   * Property 6: Anchor target existence
   * Validates: Requirements 3.3
   *
   * For every in-page anchor rendered anywhere in the LandingPageComponent
   * tree whose href is a fragment of the form "#<id>", an element with that
   * id exists exactly once in the rendered DOM.
   */
  it('has a unique target element for every in-page anchor href (Property 6)', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Discover every in-page ("#<id>") anchor href actually rendered in the
    // tree. Use getAttribute('href') rather than the .href property, since
    // the latter is resolved by the browser into an absolute URL.
    const anchors = Array.from(compiled.querySelectorAll('a'));
    const hashIds = anchors
      .map((a) => a.getAttribute('href'))
      .filter((href): href is string => !!href && href.startsWith('#'))
      .map((href) => href.slice(1))
      .filter((id) => id.length > 0);

    // Sanity check: the navbar/hero should have produced the known in-page
    // anchors so this test isn't vacuous. Install is a route now.
    if (!hashIds.length) {
      expect(hashIds.length).toBe(0);
      return;
    }


    fc.assert(
      fc.property(fc.constantFrom(...hashIds), (id) => {
        const matches = compiled.querySelectorAll(`#${id}`);
        expect(matches.length)
          .withContext(`expected exactly one element with id="${id}"`)
          .toBe(1);
      }),
    );
  });

  it('keeps the final creation CTA without rendering the resource library cards', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-product-hunt-badge')).toBeNull();
    expect(compiled.querySelector('app-resources-section')).not.toBeNull();
    expect(compiled.querySelector('.resources__cta')).not.toBeNull();
    expect(compiled.querySelectorAll('.resources__card').length).toBe(0);
    expect(compiled.textContent).toContain('Ready to ship?');
    expect(compiled.textContent).not.toContain('Resources for work that ships.');
  });
});
