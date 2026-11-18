import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LANDING_SOLUTIONS, SolutionsSectionComponent } from './solutions-section.component';

describe('SolutionsSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsSectionComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function render() {
    const fixture = TestBed.createComponent(SolutionsSectionComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows all three solutions at once, Motion Graphics AI first, with nothing to click open', () => {
    const element = render();
    const names = Array.from(element.querySelectorAll('.sol__copy strong')).map((name) =>
      name.textContent?.replace('Beta', '').trim(),
    );

    expect(names).toEqual(['Motion Graphics AI', 'AI Video Editor', 'PSD to Video']);
    expect(element.querySelectorAll('[role="tab"]').length).toBe(0);
    expect(element.querySelectorAll('[hidden]').length).toBe(0);
    expect(Array.from(element.querySelectorAll('.sol__copy strong')).map((name) => !!name.querySelector('.sol__beta'))).toEqual([
      false,
      true,
      true,
    ]);
  });

  it('pairs each solution with its real editor screenshot and three features, and never mentions credits', () => {
    const element = render();
    const images = Array.from(element.querySelectorAll<HTMLImageElement>('app-product-window img'));

    expect(images.map((img) => img.getAttribute('src'))).toEqual(LANDING_SOLUTIONS.map((item) => item.shot.src));
    for (const img of images) expect(img.getAttribute('alt')?.length).toBeGreaterThan(20);
    for (const block of Array.from(element.querySelectorAll('.sol__block'))) {
      expect(block.querySelectorAll('.sol__features li').length).toBe(3);
    }
    expect(element.textContent?.toLowerCase()).not.toContain('credit');
  });

  it('links each solution to its page, the prompt one to the hero box and the beta ones to sign-up', () => {
    const element = render();
    const more = Array.from(element.querySelectorAll('.sol__more')).map((link) => link.getAttribute('href'));
    const ctas = Array.from(element.querySelectorAll('.sol__cta')).map((link) => link.getAttribute('href'));

    expect(more).toEqual(['/ai-motion-graphics-generator', '/ai-video-editor', '/psd-to-video']);
    expect(ctas).toEqual(['#motion-prompt', '/signup?returnUrl=%2Feditor', '/signup?returnUrl=%2Feditor']);
  });
});
