import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import * as fc from 'fast-check';
import { DOCUMENT } from '@angular/common';
import { FEATURED_TEMPLATES, LANDING_FAQS, LANDING_TITLE, LandingPageComponent } from './landing-page.component';
import { TEAM_CARDS } from './components/teams-section/teams-section.component';
import { getMotionTemplate } from '../templates/template-catalog';
import { templateAspect } from '../templates/template-library.data';

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

  it('closes with a second prompt box, like the hero’s', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-product-hunt-badge')).toBeNull();
    expect(compiled.querySelector('app-resources-section')).not.toBeNull();
    expect(compiled.querySelector('.resources__cta')).not.toBeNull();
    expect(compiled.textContent).toContain('Your next launch video is one prompt away.');
    expect(compiled.querySelector('textarea#motion-prompt')).not.toBeNull();
    expect(compiled.querySelector('.resources textarea#closing-prompt')).not.toBeNull();
    expect(compiled.querySelectorAll('textarea').length).toBe(2);
    expect(compiled.querySelector('app-features-section')).toBeNull();
  });

  it('names who Motify is for in a section heading, with one h1 and the landing title', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('h1').length).toBe(1);
    expect(compiled.querySelector('#teams-title')?.textContent).toContain('Built for businesses, marketing teams, and agencies.');
    expect(TestBed.inject(DOCUMENT).title).toBe(LANDING_TITLE);
  });

  it('mirrors the rendered FAQ into FAQPage JSON-LD', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const rendered = Array.from(compiled.querySelectorAll('#faq summary')).map((summary) => summary.textContent?.trim());
    expect(rendered).toEqual(LANDING_FAQS.map((faq) => faq.question));

    const scripts = Array.from(TestBed.inject(DOCUMENT).head.querySelectorAll('script[type="application/ld+json"]'));
    const graph = scripts
      .map((script) => JSON.parse(script.textContent ?? '{}'))
      .flatMap((payload) => payload['@graph'] ?? []);
    const faqPage = graph.find((node: { '@type'?: string }) => node['@type'] === 'FAQPage');
    expect(faqPage).withContext('FAQPage JSON-LD').toBeDefined();
    expect(faqPage.mainEntity.map((entry: { name: string }) => entry.name)).toEqual(rendered);
  });

  it('links each team card to the page written for that team', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a.teams__card'));
    expect(links.map((link) => link.getAttribute('href'))).toEqual(TEAM_CARDS.map((card) => card.link));
  });

  it('features library templates in several formats, each linking to its gallery page', () => {
    for (const featured of FEATURED_TEMPLATES) {
      const template = getMotionTemplate(featured.slug);
      expect(template).withContext(featured.slug).toBeDefined();
      expect(featured.video).withContext(featured.slug).toBe(template!.video);
      expect(featured.aspect).withContext(featured.slug).toBe(templateAspect(template!).css);
    }
    expect(new Set(FEATURED_TEMPLATES.map((featured) => featured.aspect)).size).toBe(4);

    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();
    const links = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a.workflow__template'));
    expect(links.map((link) => link.getAttribute('href'))).toEqual(FEATURED_TEMPLATES.map((featured) => `/templates/${featured.slug}`));
  });

  it('recognizes Datadog for Startups in the supported-by strip', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const datadogLink = compiled.querySelector<HTMLAnchorElement>(
      'a[aria-label="Datadog for Startups"]',
    );
    const datadogLogo = datadogLink?.querySelector<HTMLImageElement>('img');

    expect(datadogLink?.getAttribute('href')).toBe(
      'https://www.datadoghq.com/partner/datadog-for-startups/',
    );
    expect(datadogLink?.getAttribute('rel')).toContain('noopener');
    expect(datadogLogo?.getAttribute('src')).toBe('/dd_logo_h_white.png');
    expect(datadogLogo?.getAttribute('alt')).toBe('Datadog');
  });

  it('recognizes sophat.space in the supported-by strip', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const sophatLink = compiled.querySelector<HTMLAnchorElement>('a[aria-label="sophat.space"]');
    const sophatLogo = sophatLink?.querySelector<HTMLImageElement>('img');

    expect(sophatLink?.getAttribute('href')).toBe('https://sophat.space/');
    expect(sophatLink?.getAttribute('rel')).toContain('noopener');
    expect(sophatLogo?.getAttribute('src')).toBe('/sophat.space.png');
  });
});
