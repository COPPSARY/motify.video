import { TestBed } from '@angular/core/testing';
import { HIGHLIGHT_CLIPS, HighlightsCarouselComponent } from './highlights-carousel.component';

describe('HighlightsCarouselComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HighlightsCarouselComponent] }).compileComponents();
  });

  it('renders every clip as a poster, downloading nothing until the section is near the screen', () => {
    const fixture = TestBed.createComponent(HighlightsCarouselComponent);
    fixture.detectChanges();
    const videos = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.hl__card video'));

    expect(videos.length).toBe(HIGHLIGHT_CLIPS.length);
    expect(videos.map((video) => video.getAttribute('poster'))).toEqual(HIGHLIGHT_CLIPS.map((clip) => clip.poster));
    expect(videos.some((video) => video.getAttribute('src'))).toBeFalse();
  });

  it('starts on the first clip and moves to the next with the arrow, updating the dot and caption', () => {
    const fixture = TestBed.createComponent(HighlightsCarouselComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const caption = () => element.querySelector('.hl__caption')?.textContent?.replace(/\s+/g, ' ').trim();
    const currentDot = () =>
      Array.from(element.querySelectorAll('.hl__dot')).findIndex((dot) => dot.getAttribute('aria-current') === 'true');

    expect(currentDot()).toBe(0);
    expect(caption()).toContain(HIGHLIGHT_CLIPS[0].title);

    element.querySelector<HTMLButtonElement>('[aria-label="Next video"]')!.click();
    fixture.detectChanges();

    expect(currentDot()).toBe(1);
    expect(caption()).toContain(HIGHLIGHT_CLIPS[1].title);
    expect(element.querySelectorAll('.hl__card')[1].classList).toContain('is-active');
  });

  it('wraps from the first clip back to the last', () => {
    const fixture = TestBed.createComponent(HighlightsCarouselComponent);
    fixture.componentInstance.previous();
    expect(fixture.componentInstance.active()).toBe(HIGHLIGHT_CLIPS.length - 1);
  });

  it('can be paused, which the button reports', () => {
    const fixture = TestBed.createComponent(HighlightsCarouselComponent);
    fixture.detectChanges();
    const button = () => (fixture.nativeElement as HTMLElement).querySelector('.hl__button')!;

    expect(button().getAttribute('aria-pressed')).toBe('false');
    (button() as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.playing()).toBeFalse();
    expect(button().getAttribute('aria-pressed')).toBe('true');
    expect(button().getAttribute('aria-label')).toBe('Play videos');
  });
});
