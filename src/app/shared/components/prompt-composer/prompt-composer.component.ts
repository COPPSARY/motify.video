import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideArrowUp } from '@lucide/angular';
import { editorReturnPath } from '../../config/runtime-config';

/** The composer grows with the draft up to this height, then scrolls. */
const PROMPT_MAX_HEIGHT = 208;
/** Typing speed when a suggestion is written into the box. */
const TYPE_INTERVAL_MS = 14;

/**
 * The site's prompt box. Only the text travels to the editor (through signup),
 * so the site offers only text: no attachments or pickers that would be lost.
 * Enter sends, Shift+Enter starts a new line.
 */
@Component({
  selector: 'app-prompt-composer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LucideArrowUp],
  templateUrl: './prompt-composer.component.html',
  styleUrl: './prompt-composer.component.css',
})
export class PromptComposerComponent implements OnDestroy {
  readonly inputId = input('motion-prompt');
  readonly placeholder = input('Describe your video…');

  private readonly router = inject(Router);
  private readonly promptInput = viewChild<ElementRef<HTMLTextAreaElement>>('promptInput');

  readonly prompt = signal('');
  private typingTimer?: ReturnType<typeof setInterval>;

  ngOnDestroy(): void {
    this.stopTyping();
  }

  /**
   * Writes a suggestion into the box as real, editable text, typed out unless the
   * visitor prefers reduced motion, then focuses the box with the caret at the end.
   */
  fill(text: string): void {
    this.stopTyping();
    const reduced =
      typeof window === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.setPrompt(text);
      this.focusAtEnd();
      return;
    }

    let length = 0;
    this.setPrompt('');
    this.focusAtEnd();
    this.typingTimer = setInterval(() => {
      length = Math.min(text.length, length + 2);
      this.setPrompt(text.slice(0, length));
      if (length === text.length) {
        this.stopTyping();
        this.focusAtEnd();
      }
    }, TYPE_INTERVAL_MS);
  }

  onPromptInput(value: string): void {
    // The visitor took over: stop any suggestion still being typed.
    this.stopTyping();
    this.setPrompt(value);
  }

  resizePrompt(): void {
    const textarea = this.promptInput()?.nativeElement;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, PROMPT_MAX_HEIGHT)}px`;
  }

  /** Enter sends, Shift+Enter starts a new line, as in the editor's composer. */
  onPromptKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    if (this.prompt().trim()) void this.submitPrompt();
  }

  async submitPrompt(): Promise<void> {
    const prompt = this.prompt().trim();
    if (!prompt) return;
    await this.router.navigate(['/signup'], {
      queryParams: { returnUrl: editorReturnPath(prompt) },
    });
  }

  private setPrompt(value: string): void {
    this.prompt.set(value);
    queueMicrotask(() => this.resizePrompt());
  }

  private focusAtEnd(): void {
    const textarea = this.promptInput()?.nativeElement;
    if (!textarea) return;
    textarea.focus({ preventScroll: true });
    queueMicrotask(() => textarea.setSelectionRange(textarea.value.length, textarea.value.length));
  }

  private stopTyping(): void {
    if (this.typingTimer !== undefined) clearInterval(this.typingTimer);
    this.typingTimer = undefined;
  }
}
