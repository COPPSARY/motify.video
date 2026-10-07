import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ResourcesSectionComponent } from './resources-section.component';

describe('ResourcesSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesSectionComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the featured internal resource destinations', () => {
    const fixture = TestBed.createComponent(ResourcesSectionComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll<HTMLAnchorElement>('.resources__card');

    expect(cards.length).toBe(3);
    expect(Array.from(cards).map((card) => card.getAttribute('href'))).toEqual([
      '/resources/prompt-templates',
      '/resources/brand-dna',
      '/resources/playbooks',
    ]);
  });

  it('uses the same signup flow for a prompt from the resources composer', async () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const component = TestBed.createComponent(ResourcesSectionComponent).componentInstance;
    component.prompt = 'Show the new feature';

    await component.submitPrompt();

    expect(navigate).toHaveBeenCalledWith(['/signup'], {
      queryParams: { returnUrl: '/editor?prompt=Show+the+new+feature' },
    });
  });
});
