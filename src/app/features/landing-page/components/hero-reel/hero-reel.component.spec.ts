import { TestBed } from '@angular/core/testing';
import { HeroReelComponent } from './hero-reel.component';
import { LANDING_DEMOS, LandingDemoStore } from '../../landing-demo';

describe('HeroReelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroReelComponent],
      providers: [LandingDemoStore],
    }).compileComponents();
  });

  it('shows the chosen example: its poster, its caption, and nothing downloading yet', () => {
    const fixture = TestBed.createComponent(HeroReelComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const video = element.querySelector('video')!;

    expect(video.getAttribute('poster')).toBe(LANDING_DEMOS[0].poster);
    expect(video.getAttribute('preload')).toBe('none');
    expect(element.querySelector('.reel__caption')?.textContent).toContain(LANDING_DEMOS[0].caption);

    const ad = TestBed.inject(LandingDemoStore).select('ad');
    fixture.detectChanges();

    expect(video.getAttribute('poster')).toBe(ad.poster);
    expect(element.querySelector('.reel__caption')?.textContent).toContain(ad.caption);
    expect(element.querySelector('.reel__caption-kind')?.textContent).toBe(ad.label);
  });
});
