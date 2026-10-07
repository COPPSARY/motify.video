import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PartnersPageComponent } from './partners-page.component';

describe('PartnersPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnersPageComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('renders all partnership content with direct email copy actions', async () => {
    const fixture = TestBed.createComponent(PartnersPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';

    expect(text).toContain('Partner with Motify.');
    expect(text).toContain('General Inquiries & Partnerships');
    expect(text).toContain('hello@motify.video');
    expect(text).toContain('Talk to Founder');
    expect(text).toContain('sereyreaksa.prom@motify.video');
    expect(text).toContain('Agencies & Creative Studios');
    expect(text).toContain('Technology & Platforms');
    expect(text).toContain('Affiliates & Creators');

    const main = compiled.querySelector('.partners');
    expect(main).not.toBeNull();

    const component = fixture.componentInstance;
    await component.copyEmail('hello@motify.video');
  });
});
