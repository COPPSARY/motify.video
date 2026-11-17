import { TestBed } from '@angular/core/testing';
import { ResourcesSectionComponent } from './resources-section.component';

describe('ResourcesSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ResourcesSectionComponent] }).compileComponents();
  });

  it('closes the page with one button back to the hero prompt, not a second prompt box', () => {
    const fixture = TestBed.createComponent(ResourcesSectionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Your next launch video is one prompt away.',
    );
    expect(compiled.querySelector('a.resources__button')?.getAttribute('href')).toBe('#motion-prompt');
    expect(compiled.textContent).toContain('No card required.');
    expect(compiled.querySelector('textarea')).toBeNull();
  });

  it('moves focus to the hero prompt box when the button is pressed', () => {
    const prompt = document.createElement('textarea');
    prompt.id = 'motion-prompt';
    document.body.appendChild(prompt);
    const fixture = TestBed.createComponent(ResourcesSectionComponent);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('a.resources__button')!.click();

    expect(document.activeElement).toBe(prompt);
    prompt.remove();
  });
});
