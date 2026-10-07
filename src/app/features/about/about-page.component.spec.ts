import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AboutPageComponent } from './about-page.component';

describe('AboutPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPageComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('renders vision, mission, and founder quote without emojis', () => {
    const fixture = TestBed.createComponent(AboutPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';

    expect(text).toContain('Vision');
    expect(text).toContain('A world where teams can focus on building and improving their products while their marketing content keeps pace.');
    expect(text).toContain('Mission');
    expect(text).toContain('Motify turns product updates and marketing goals into clear, accurate, on-brand marketing content—without the usual production bottleneck.');
    expect(text).toContain('Teams should be able to focus on, and improve their products, Motify will handle announcing their great products');
    expect(text).toContain('Reaksa, Founder');
    expect(text).not.toContain('Partner with us');
    expect(compiled.querySelector('.about__pill-btn')).toBeNull();
  });

  it('renders all COPPSARY team avatars', () => {
    const fixture = TestBed.createComponent(AboutPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const avatars = compiled.querySelectorAll('.about__team-member');
    expect(avatars.length).toBe(6);
  });
});
