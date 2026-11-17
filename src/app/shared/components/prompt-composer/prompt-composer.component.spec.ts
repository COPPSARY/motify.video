import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PromptComposerComponent } from './prompt-composer.component';

describe('PromptComposerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptComposerComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('opens signup with the prompt preserved for the editor', async () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const component = TestBed.createComponent(PromptComposerComponent).componentInstance;
    component.prompt.set('Make a launch video & demo');

    await component.submitPrompt();

    expect(navigate).toHaveBeenCalledWith(['/signup'], {
      queryParams: { returnUrl: '/editor?prompt=Make+a+launch+video+%26+demo' },
    });
  });

  it('does not submit an empty prompt, and keeps the button disabled until there is text', async () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const fixture = TestBed.createComponent(PromptComposerComponent);
    const component = fixture.componentInstance;
    component.prompt.set('   ');
    fixture.detectChanges();

    await component.submitPrompt();

    expect(navigate).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.composer__submit').disabled).toBeTrue();
  });

  it('offers only text: no attachments, aspect, effort, or enhancer that would be lost on the way', () => {
    const fixture = TestBed.createComponent(PromptComposerComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[aria-label="Attach an image or song"]')).toBeNull();
    expect(element.querySelector('.composer__chip')).toBeNull();
    expect(element.querySelector('[aria-label="Enhance prompt"]')).toBeNull();
    expect(element.querySelectorAll('textarea').length).toBe(1);
  });

  it('types a suggestion into the box as real, sendable text', fakeAsync(() => {
    const fixture = TestBed.createComponent(PromptComposerComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.fill('A launch video for our dashboard.');
    tick(2000);
    flush();
    fixture.detectChanges();

    expect(component.prompt()).toBe('A launch video for our dashboard.');
    expect(fixture.nativeElement.querySelector('.composer__submit').disabled).toBeFalse();
  }));

  it('stops typing a suggestion as soon as the visitor types', fakeAsync(() => {
    const component = TestBed.createComponent(PromptComposerComponent).componentInstance;

    component.fill('A long suggestion that would keep typing for a while.');
    tick(30);
    component.onPromptInput('My own idea');
    tick(2000);
    flush();

    expect(component.prompt()).toBe('My own idea');
  }));
});
