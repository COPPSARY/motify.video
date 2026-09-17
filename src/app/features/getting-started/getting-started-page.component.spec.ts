import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GettingStartedPageComponent } from './getting-started-page.component';

describe('GettingStartedPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GettingStartedPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the setup video, install commands, assets guidance, and Product Hunt badge', () => {
    const fixture = TestBed.createComponent(GettingStartedPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const video = compiled.querySelector<HTMLVideoElement>('video[src="installation1.mp4"]');
    expect(video).withContext('installation video should render near the top').not.toBeNull();

    const text = compiled.textContent ?? '';
    expect(text).toContain('git clone https://github.com/COPPSARY/Motify.git');
    expect(text).toContain('npm install && npm run dev');
    expect(text).toContain('assets/');

    expect(compiled.querySelectorAll('app-product-hunt-badge').length).toBe(1);
  });
});
