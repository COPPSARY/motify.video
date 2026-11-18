import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroSectionComponent } from './hero-section.component';
import { LANDING_DEMOS, LandingDemoStore } from '../../landing-demo';

describe('HeroSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent],
      providers: [provideRouter([]), LandingDemoStore],
    }).compileComponents();
  });

  it('leads with one h1, a subhead that says who Motify is for and what it makes, then the aurora and the composer', () => {
    const fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const headings = compiled.querySelectorAll('h1');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('Create motion graphics in minutes.');
    expect(compiled.textContent).toContain('For businesses, marketing teams, and agencies.');
    expect(compiled.querySelector('app-aurora')).not.toBeNull();
    expect(compiled.querySelector('app-prompt-composer textarea#motion-prompt')).not.toBeNull();
    expect(compiled.querySelectorAll('.composer__submit').length).toBe(1);
  });

  it('offers one chip per example, with the first one pressed', () => {
    const fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.detectChanges();
    const chips = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.hero__chip'));

    expect(chips.map((chip) => chip.textContent?.trim())).toEqual(LANDING_DEMOS.map((demo) => demo.label));
    expect(chips.map((chip) => chip.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false', 'false']);
  });

  it('choosing a chip selects its example and types its prompt into the box', fakeAsync(() => {
    const fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const ad = LANDING_DEMOS.find((demo) => demo.id === 'ad')!;

    Array.from(element.querySelectorAll<HTMLButtonElement>('.hero__chip'))
      .find((chip) => chip.textContent?.trim() === ad.label)!
      .click();
    tick(3000);
    flush();
    fixture.detectChanges();
    tick();

    expect(TestBed.inject(LandingDemoStore).active().id).toBe('ad');
    expect(element.querySelector('.hero__chip.is-active')?.textContent?.trim()).toBe(ad.label);
    expect(element.querySelector<HTMLTextAreaElement>('textarea#motion-prompt')?.value).toBe(ad.prompt);
  }));
});
