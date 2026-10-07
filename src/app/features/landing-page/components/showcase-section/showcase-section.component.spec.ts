import { TestBed } from '@angular/core/testing';
import { ShowcaseSectionComponent } from './showcase-section.component';

describe('ShowcaseSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseSectionComponent],
    }).compileComponents();
  });

  it('should render the intentional framing message without extra step cards', () => {
    const fixture = TestBed.createComponent(ShowcaseSectionComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.showcase__inline-logo').length).toBe(0);
    expect(compiled.textContent).toContain('Make every frame feel intentional');
    expect(compiled.textContent).not.toContain('npx @coppsary/motify skills add');
    expect(compiled.querySelector('.showcase__step')).toBeNull();
    expect(compiled.querySelector('.showcase__install')).toBeNull();
    expect(compiled.querySelector('.showcase__agent')).toBeNull();
  });

  it('should not render a demo video in the showcase section (no duplicate of the hero video)', () => {
    const fixture = TestBed.createComponent(ShowcaseSectionComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('video')).toBeNull();
  });

  it('should not duplicate the hero showcase gif', () => {
    const fixture = TestBed.createComponent(ShowcaseSectionComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('img[src="showcase-2.gif"]')).toBeNull();
  });
});
