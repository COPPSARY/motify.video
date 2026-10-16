import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AboutPageComponent } from './about-page.component';

describe('AboutPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('renders the motion graphics positioning and primary use cases', () => {
    const fixture = TestBed.createComponent(AboutPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';

    expect(text).toContain('About Motify: Motion graphics, made easier');
    expect(text).toContain('Cambodian-led startup');
    expect(text).toContain('Animated ads');
    expect(text).toContain('Product animations');
    expect(text).toContain('Explainer videos');
    expect(text).toContain('Marketing and social content');
    expect(text).toContain('AI helps with the production process.');
    expect(text).toContain('Good motion starts with understanding.');
    expect(text).toContain('Their understanding and creative direction are what make the work distinct.');
    expect(text).toContain('Have an idea? Put it in motion.');
    expect(compiled.querySelectorAll('.about__uses-grid li').length).toBe(4);
    expect(compiled.querySelector<HTMLAnchorElement>('.about__button')?.textContent).toContain('Try Motify');
    expect(text).not.toContain('—');
  });

  it('links the CTA to login with the editor return path', () => {
    const fixture = TestBed.createComponent(AboutPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector<HTMLAnchorElement>('.about__button');
    expect(button?.getAttribute('href')).toBe('/login?returnUrl=%2Feditor');
  });

  it('renders the COPPSARY team and all six member avatars', () => {
    const fixture = TestBed.createComponent(AboutPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Built by COPPSARY');
    expect(compiled.querySelectorAll('.about__team-member').length).toBe(6);
  });
});
