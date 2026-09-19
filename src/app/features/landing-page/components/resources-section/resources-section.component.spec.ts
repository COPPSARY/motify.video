import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ResourcesSectionComponent } from './resources-section.component';
import { RESOURCE_LINKS } from '../../../../shared/constants/external-links';

describe('ResourcesSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesSectionComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render exactly one app-external-link-card per entry in RESOURCE_LINKS', () => {
    const fixture = TestBed.createComponent(ResourcesSectionComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('app-external-link-card');

    expect(cards.length).toBe(RESOURCE_LINKS.length);
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
