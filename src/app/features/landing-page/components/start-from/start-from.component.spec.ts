import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { START_FROM_TABS, StartFromComponent } from './start-from.component';

describe('StartFromComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartFromComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function render() {
    const fixture = TestBed.createComponent(StartFromComponent);
    fixture.detectChanges();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('offers the three ways in, marking only the two new features as beta', () => {
    const { element } = render();
    const tabs = Array.from(element.querySelectorAll('[role="tab"]'));

    expect(tabs.map((tab) => tab.textContent?.replace('Beta', '').trim())).toEqual(['Prompt', 'Footage', 'Photoshop']);
    expect(tabs.map((tab) => !!tab.querySelector('.sf__beta'))).toEqual([false, true, true]);
    expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
  });

  it('keeps every panel in the HTML for search engines, showing only the open one', () => {
    const { element } = render();
    const panels = Array.from(element.querySelectorAll<HTMLElement>('[role="tabpanel"]'));

    expect(panels.length).toBe(START_FROM_TABS.length);
    expect(panels.map((panel) => panel.hidden)).toEqual([false, true, true]);
    expect(element.textContent).toContain('AI video editor');
    expect(element.textContent).toContain('PSD to Video');
  });

  it('opens a tab on click and with the arrow keys', () => {
    const { fixture, element } = render();
    const tab = (id: string) => element.querySelector<HTMLButtonElement>(`#sf-tab-${id}`)!;

    tab('footage').click();
    fixture.detectChanges();
    expect(tab('footage').getAttribute('aria-selected')).toBe('true');
    expect(element.querySelector<HTMLElement>('#sf-panel-footage')!.hidden).toBeFalse();

    tab('footage').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe('psd');
    expect(tab('psd').getAttribute('tabindex')).toBe('0');
  });

  it('sends the beta features to sign-up and links each to its own page', () => {
    const { element } = render();
    const footage = element.querySelector('#sf-panel-footage')!;
    const psd = element.querySelector('#sf-panel-psd')!;

    expect(footage.querySelector('.sf__cta')?.getAttribute('href')).toBe('/signup?returnUrl=%2Feditor');
    expect(footage.querySelector('.sf__more')?.getAttribute('href')).toBe('/ai-video-editor');
    expect(psd.querySelector('.sf__more')?.getAttribute('href')).toBe('/psd-to-video');
    expect(element.querySelector('#sf-panel-prompt .sf__cta')?.getAttribute('href')).toBe('#motion-prompt');
  });
});
