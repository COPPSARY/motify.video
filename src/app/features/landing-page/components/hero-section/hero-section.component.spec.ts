import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
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

  it('should render a focused outcome, prompt CTA, and product proof', () => {
    const fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Create motion graphics in minutes.');
    expect(compiled.textContent).toContain('Built for growing teams.');
    expect(compiled.querySelector('.hero__composer')).not.toBeNull();
    expect(compiled.querySelector('textarea#motion-prompt')).not.toBeNull();
    expect(compiled.querySelectorAll('.hero__submit').length).toBe(1);
  });

  it('opens signup with the prompt preserved for the editor', async () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const component = TestBed.createComponent(HeroSectionComponent).componentInstance;
    component.prompt = 'Make a launch video & demo';

    await component.submitPrompt();

    expect(navigate).toHaveBeenCalledWith(['/signup'], {
      queryParams: { returnUrl: '/editor?prompt=Make+a+launch+video+%26+demo' },
    });
  });
});
