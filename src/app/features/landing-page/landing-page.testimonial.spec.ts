import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';

describe('Testimonial heading', () => {
  it('does not paint the word behind the speech bubble', async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();
    const heading = fixture.nativeElement as HTMLElement;
    const wrapper = heading.querySelector<HTMLElement>('.testimonials__think')!;
    const word = wrapper.querySelector<HTMLElement>('.testimonials__think-word')!;
    const icon = wrapper.querySelector<SVGElement>('.testimonials__think-icon')!;

    word.style.animationDelay = '-3s';
    word.style.animationPlayState = 'paused';
    icon.style.animationDelay = '-3s';
    icon.style.animationPlayState = 'paused';

    expect(getComputedStyle(wrapper).backgroundImage).toBe('none');
    expect(Number(getComputedStyle(word).opacity)).toBeLessThan(0.01);
    expect(Number(getComputedStyle(icon).opacity)).toBeGreaterThan(0.99);

    word.style.animationDelay = '-2.2s';
    icon.style.animationDelay = '-2.2s';
    expect(Number(getComputedStyle(word).opacity)).toBeGreaterThan(0.01);
    expect(Number(getComputedStyle(word).opacity)).toBeLessThan(0.99);
    expect(Number(getComputedStyle(icon).opacity)).toBeLessThan(0.01);

    word.style.animationDelay = '-2.5s';
    icon.style.animationDelay = '-2.5s';
    expect(Number(getComputedStyle(word).opacity)).toBeLessThan(0.01);
    expect(Number(getComputedStyle(icon).opacity)).toBeGreaterThan(0.01);
    expect(Number(getComputedStyle(icon).opacity)).toBeLessThan(0.99);
  });
});
