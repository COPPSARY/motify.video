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

  it('should render the product-focused prompt composer', () => {
    const fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Create SaaS videos');
    expect(compiled.querySelector('.hero__composer')).not.toBeNull();
    expect(compiled.querySelector('textarea#motion-prompt')).not.toBeNull();
    expect(compiled.querySelector('.hero__submit')).not.toBeNull();
  });

  it('opens the site signup flow with the prompt preserved for the editor', async () => {
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
