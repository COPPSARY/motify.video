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
    expect(compiled.textContent).toContain('AI tool that makes SaaS explainers and launch videos.');
    expect(logoImg?.src.endsWith('logo.svg')).withContext('resolved src should end with logo.svg').toBe(true);
  });

  it('should provide a partnership and business inquiry Gmail link', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const inquiryLink = compiled.querySelector<HTMLAnchorElement>('.footer__business-link');

    expect(inquiryLink).withContext('business inquiry link should exist').not.toBeNull();
    expect(inquiryLink?.getAttribute('href')).toContain('mail.google.com/mail/');
    expect(inquiryLink?.getAttribute('href')).toContain('to=prumsereyreaksa%40gmail.com');
    expect(inquiryLink?.getAttribute('target')).toBe('_blank');
    expect(inquiryLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
