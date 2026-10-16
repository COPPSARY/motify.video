import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroSectionComponent } from './hero-section.component';

describe('HeroSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the hero section', () => {
    const fixture = TestBed.createComponent(HeroSectionComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the outcome, the aurora background, and the prompt composer', () => {
    const fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Create motion graphics in minutes.');
    expect(compiled.textContent).toContain('For businesses, marketing teams, and agencies.');
    expect(compiled.querySelector('app-aurora')).not.toBeNull();
    expect(compiled.querySelector('app-prompt-composer textarea#motion-prompt')).not.toBeNull();
    expect(compiled.querySelectorAll('.composer__submit').length).toBe(1);
  });
});
