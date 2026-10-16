import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ResourcesSectionComponent } from './resources-section.component';

describe('ResourcesSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesSectionComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('closes the page with the prompt composer and no prompt enhancer', () => {
    const fixture = TestBed.createComponent(ResourcesSectionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Have an idea? Put it in motion.');
    expect(compiled.querySelector('app-prompt-composer textarea#resources-prompt')).not.toBeNull();
    expect(compiled.querySelector('[aria-label="Enhance prompt"]')).toBeNull();
  });
});
