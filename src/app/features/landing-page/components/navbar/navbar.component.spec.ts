import { ApplicationRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { EXTERNAL_LINKS } from '../../../../shared/constants/external-links';
import { EDITOR_AUTH_PATH } from '../../../../shared/config/runtime-config';

describe('NavbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should create the navbar', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the GitHub link with EXTERNAL_LINKS.github, target="_blank" and rel="noopener noreferrer"', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const githubLink = compiled.querySelector<HTMLAnchorElement>(
      `a[href="${EXTERNAL_LINKS.github}"]`,
    );

    expect(githubLink).withContext('GitHub anchor should exist').not.toBeNull();
    expect(githubLink?.getAttribute('href')).toBe(EXTERNAL_LINKS.github);
    expect(githubLink?.getAttribute('target')).toBe('_blank');
    expect(githubLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('routes Editor through the site login page', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const editorLink = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('a'))
      .find((link) => link.textContent?.trim() === 'Editor');

    expect(editorLink?.getAttribute('href')).toBe(EDITOR_AUTH_PATH);
    expect(compiled.querySelector<HTMLAnchorElement>(`a[href="${EXTERNAL_LINKS.editor}"]`)).toBeNull();
  });

  /**
   * Property 12: Brand asset usage
   * Validates: Requirements 3.5, 15.4
   *
   * The navbar renders the Motify wordmark as an <img> whose source resolves
   * to the supplied `logo.svg` asset (served at the site root).
   */
  it('renders the brand as an <img> whose src resolves to logo.svg (Property 12)', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const brandImg = compiled.querySelector<HTMLImageElement>('.navbar__brand img');

    expect(brandImg).withContext('brand <img> should exist').not.toBeNull();
    // The bound attribute is the raw asset path...
    expect(brandImg?.getAttribute('src')).toBe('logo.svg');
    // ...and the resolved DOM `src` property ends with the logo.svg asset.
    expect(brandImg?.src.endsWith('logo.svg'))
      .withContext(`resolved src should end with logo.svg, got "${brandImg?.src}"`)
      .toBeTrue();
  });

  /**
   * Scroll state (Requirements 3.6, 3.7)
   *
   * The `scrolled` state starts `false` (the valid resting / server-rendered
   * state) and flips to `true` — toggling the `navbar--scrolled` class — after
   * the page is scrolled past the threshold (`window.scrollY > 8`).
   */
  describe('scroll state (browser platform)', () => {
    let scrollYValue: number;
    let originalDescriptor: PropertyDescriptor | undefined;

    beforeEach(async () => {
      scrollYValue = 0;
      originalDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        get: () => scrollYValue,
      });

      await TestBed.configureTestingModule({
        imports: [NavbarComponent],
        providers: [provideRouter([]), provideHttpClient()],
      }).compileComponents();
    });

    afterEach(() => {
      if (originalDescriptor) {
        Object.defineProperty(window, 'scrollY', originalDescriptor);
      } else {
        // Remove our override so the native prototype getter is restored.
        delete (window as unknown as { scrollY?: number }).scrollY;
      }
    });

    it('starts scrolled=false and flips to true after a scroll past the threshold', async () => {
      const fixture = TestBed.createComponent(NavbarComponent);
      fixture.detectChanges();

      // The scroll listener is attached via afterNextRender (browser-only);
      // flush render hooks so the listener is registered and the initial
      // resting state has been computed.
      TestBed.inject(ApplicationRef).tick();
      await fixture.whenStable();

      const nav = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
        '.navbar',
      );
      expect(nav).withContext('nav element should exist').not.toBeNull();

      // Resting state: not scrolled -> no navbar--scrolled class.
      expect(nav?.classList.contains('navbar--scrolled'))
        .withContext('resting state must not carry the scrolled class')
        .toBeFalse();
      expect(
        (fixture.componentInstance as unknown as { scrolled: () => boolean }).scrolled(),
      )
        .withContext('scrolled() must start false')
        .toBeFalse();

      // Simulate scrolling past the 8px threshold.
      scrollYValue = 100;
      window.dispatchEvent(new Event('scroll'));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        (fixture.componentInstance as unknown as { scrolled: () => boolean }).scrolled(),
      )
        .withContext('scrolled() must flip to true after scrolling past the threshold')
        .toBeTrue();
      expect(nav?.classList.contains('navbar--scrolled'))
        .withContext('nav must gain the navbar--scrolled class after scrolling')
        .toBeTrue();

      fixture.destroy();
    });
  });
});
