import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';
import { EXTERNAL_LINKS } from '../../../../shared/constants/external-links';

describe('FooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the footer', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the GitHub link with EXTERNAL_LINKS.github, target="_blank" and rel="noopener noreferrer"', () => {
    const fixture = TestBed.createComponent(FooterComponent);
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

  it('should render the copyright line including the current year', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const currentYear = new Date().getFullYear().toString();
    const copyrightEl = compiled.querySelector('.footer__copyright');

    expect(copyrightEl).withContext('copyright element should exist').not.toBeNull();
    expect(copyrightEl?.textContent).toContain(currentYear);
  });

  // Property 12: brand asset usage — footer renders logo.svg as the wordmark.
  // Validates: Requirements 7.1, 15.4
  it('should render an <img> whose src resolves to logo.svg', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const logoImg = compiled.querySelector<HTMLImageElement>('.footer__logo');

    expect(logoImg).withContext('footer logo <img> should exist').not.toBeNull();
    expect(logoImg?.getAttribute('src')).toBe('logo.svg');
    expect(compiled.textContent).toContain('Product marketing content, grounded in your product and your brand.');
    expect(logoImg?.src.endsWith('logo.svg')).withContext('resolved src should end with logo.svg').toBe(true);
  });

  it('should provide the public support and inquiry email links', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('a[href="mailto:hello@motify.video"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="mailto:support@motify.video"]')).not.toBeNull();
  });

  it('links the internal resource library without obsolete install or package links', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('a[href="/resources/prompt-templates"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/resources/brand-dna"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/blog"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/resources/storyboard-generator"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/getting-started"]')).toBeNull();
    expect(compiled.textContent).not.toContain('npm package');
    expect(compiled.textContent).not.toContain('Product Hunt');
    expect(compiled.textContent).not.toContain('Documentation');
  });

  it('links the commercial solution and comparison pages', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('a[href="/ai-saas-launch-video-generator"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/ai-motion-graphics-generator"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/software-product-video-generator"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/canvas-ai-video-editor"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/compare/after-effects"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/compare/canva"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/compare/synthesia"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/compare/video-agency"]')).not.toBeNull();
  });

  it('should link the GitHub, Facebook, and TikTok social profiles', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('a[aria-label="Motify on GitHub"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="https://facebook.com/motify.video/"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="https://www.tiktok.com/@motify855"]')).not.toBeNull();
  });

  it('should make every legal policy available in footer navigation', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('a[href="/terms"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/privacy"]')).not.toBeNull();
    expect(compiled.querySelector('a[href="/refund-policy"]')).not.toBeNull();
  });
});
