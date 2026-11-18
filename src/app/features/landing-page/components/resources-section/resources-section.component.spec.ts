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

  it('closes the page with its own prompt box, like the hero’s', () => {
    const fixture = TestBed.createComponent(ResourcesSectionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Your next launch video is one prompt away.',
    );
    expect(compiled.querySelector('app-prompt-composer textarea#closing-prompt')).not.toBeNull();
    expect(compiled.querySelectorAll('.composer__submit').length).toBe(1);
    expect(compiled.querySelector('a.resources__button')).toBeNull();
    expect(compiled.textContent).toContain('No card required.');
  });
});
