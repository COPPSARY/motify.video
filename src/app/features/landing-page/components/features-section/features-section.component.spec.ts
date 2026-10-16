import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FeaturesSectionComponent } from './features-section.component';

describe('FeaturesSectionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesSectionComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('links one resource card to the template gallery and each remaining guide', () => {
    const fixture = TestBed.createComponent(FeaturesSectionComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('a.resource-card')).map((card) =>
      card.getAttribute('href'),
    );

    expect(links).toEqual([
      '/templates',
      '/resources/start-here',
      '/resources/brand-dna',
      '/resources/playbooks',
      '/resources/video-craft',
    ]);
  });
});
