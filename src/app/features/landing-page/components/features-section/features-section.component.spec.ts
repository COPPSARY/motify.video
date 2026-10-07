import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FeaturesSectionComponent } from './features-section.component';
import { FEATURES } from '../../../../shared/data/features.data';

describe('FeaturesSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesSectionComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render exactly one feature card per entry in FEATURES', () => {
    const fixture = TestBed.createComponent(FeaturesSectionComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.feature-card');

    expect(cards.length).toBe(FEATURES.length);
  });

  it('should render feature icons as SVGs instead of raw icon names', () => {
    const fixture = TestBed.createComponent(FeaturesSectionComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.feature-card__icon svg');
    const iconText = Array.from(compiled.querySelectorAll('.feature-card__icon'))
      .map((icon) => icon.textContent ?? '')
      .join('');

    expect(icons.length).toBe(FEATURES.length);
    for (const feature of FEATURES) {
      expect(iconText).not.toContain(feature.icon);
    }
  });

  it('should render zero cards without throwing when features is empty', () => {
    const fixture = TestBed.createComponent(FeaturesSectionComponent);
    (fixture.componentInstance as unknown as { features: readonly unknown[] }).features = [];

    expect(() => fixture.detectChanges()).not.toThrow();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.feature-card');

    expect(cards.length).toBe(0);
  });
});
