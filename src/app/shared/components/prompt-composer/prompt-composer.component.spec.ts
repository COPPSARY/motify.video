import { TestBed } from '@angular/core/testing';
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
    component.prompt = 'Make a launch video & demo';

    await component.submitPrompt();

    expect(navigate).toHaveBeenCalledWith(['/signup'], {
      queryParams: { returnUrl: '/editor?prompt=Make+a+launch+video+%26+demo' },
    });
  });

  it('does not submit an empty prompt', async () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const component = TestBed.createComponent(PromptComposerComponent).componentInstance;
    component.prompt = '   ';

    await component.submitPrompt();

    expect(navigate).not.toHaveBeenCalled();
  });

  it('has no prompt enhancer', () => {
    const fixture = TestBed.createComponent(PromptComposerComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-label="Enhance prompt"]')).toBeNull();
  });

  it('attaches pasted images and songs as removable chips, ignoring other files', () => {
    const fixture = TestBed.createComponent(PromptComposerComponent);
    const component = fixture.componentInstance;
    const clipboardData = new DataTransfer();
    clipboardData.items.add(new File(['img'], 'shot.png', { type: 'image/png' }));
    clipboardData.items.add(new File(['mp3'], 'song.mp3', { type: 'audio/mpeg' }));
    clipboardData.items.add(new File(['txt'], 'notes.txt', { type: 'text/plain' }));

    component.onPaste(new ClipboardEvent('paste', { clipboardData, cancelable: true }));
    fixture.detectChanges();

    expect(component.attachments().map(({ name, kind }) => ({ name, kind }))).toEqual([
      { name: 'shot.png', kind: 'image' },
      { name: 'song.mp3', kind: 'audio' },
    ]);
    expect(fixture.nativeElement.querySelectorAll('.composer__attachment').length).toBe(2);

    component.removeAttachment(component.attachments()[0].id);
    expect(component.attachments().map(({ name }) => name)).toEqual(['song.mp3']);
  });

  it('switches the aspect ratio and effort from their pickers', () => {
    const component = TestBed.createComponent(PromptComposerComponent).componentInstance;

    component.toggleMenu('aspect');
    component.selectAspect('9:16');
    component.selectEffort('high');

    expect(component.aspect()).toBe('9:16');
    expect(component.effort()).toBe('high');
    expect(component.openMenu()).toBeNull();
  });
});
