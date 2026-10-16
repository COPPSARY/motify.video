import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideArrowUp,
  LucideChevronDown,
  LucideMusic,
  LucidePlus,
  LucideRectangleHorizontal,
  LucideRectangleVertical,
  LucideSquare,
  LucideUpload,
  LucideX,
} from '@lucide/angular';
import { editorReturnPath } from '../../config/runtime-config';

export type CanvasAspect = '16:9' | '1:1' | '4:5' | '9:16';
export type GenerationEffort = 'medium' | 'high';
type ComposerMenu = 'add' | 'aspect' | 'effort';

export interface ComposerAttachment {
  readonly id: number;
  readonly name: string;
  readonly kind: 'image' | 'audio';
  /** Object URL for an image's thumbnail; songs show an icon instead. */
  readonly preview?: string;
}

/** The composer grows with the draft up to this height, then scrolls. */
const PROMPT_MAX_HEIGHT = 192;

/**
 * The site's version of the editor's prompt composer: attach images and songs
 * (button, paste, or drop), pick the aspect ratio and effort, and send with
 * Enter. Sending opens signup with the prompt carried to the editor.
 */
@Component({
  selector: 'app-prompt-composer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NgTemplateOutlet,
    LucideArrowUp,
    LucideChevronDown,
    LucideMusic,
    LucidePlus,
    LucideRectangleHorizontal,
    LucideRectangleVertical,
    LucideSquare,
    LucideUpload,
    LucideX,
  ],
  templateUrl: './prompt-composer.component.html',
  styleUrl: './prompt-composer.component.css',
})
export class PromptComposerComponent implements OnDestroy {
  readonly inputId = input('motion-prompt');
  readonly placeholder = input('Describe your video, or paste your script in plain words…');

  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly promptInput = viewChild<ElementRef<HTMLTextAreaElement>>('promptInput');

  readonly aspectOptions: readonly { value: CanvasAspect; name: string }[] = [
    { value: '16:9', name: 'Landscape' },
    { value: '1:1', name: 'Square' },
    { value: '4:5', name: 'Portrait' },
    { value: '9:16', name: 'Vertical' },
  ];
  readonly effortOptions: readonly { value: GenerationEffort; label: string; description: string }[] = [
    { value: 'medium', label: 'Medium', description: 'Balanced quality and wait time' },
    { value: 'high', label: 'High', description: 'More thorough and usually slower' },
  ];

  prompt = '';
  readonly attachments = signal<readonly ComposerAttachment[]>([]);
  readonly aspect = signal<CanvasAspect>('16:9');
  readonly effort = signal<GenerationEffort>('medium');
  readonly openMenu = signal<ComposerMenu | null>(null);
  readonly dragging = signal(false);
  readonly selectedAspect = computed(() => this.aspectOptions.find((option) => option.value === this.aspect())!);
  readonly selectedEffort = computed(() => this.effortOptions.find((option) => option.value === this.effort())!);

  private fileInput?: HTMLInputElement;
  private nextAttachmentId = 0;

  ngOnDestroy(): void {
    this.fileInput?.remove();
    this.attachments().forEach((attachment) => this.revokePreview(attachment));
  }

  /** Clicking anywhere outside the pickers closes the open menu; the pickers handle their own clicks. */
  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: MouseEvent): void {
    if (!this.openMenu()) return;
    const target = event.target as Element | null;
    if (!target?.closest('.composer__picker') || !this.host.contains(target)) this.openMenu.set(null);
  }

  @HostListener('document:keydown.escape')
  closeMenu(): void {
    this.openMenu.set(null);
  }

  toggleMenu(menu: ComposerMenu): void {
    this.openMenu.update((open) => (open === menu ? null : menu));
  }

  selectAspect(aspect: CanvasAspect): void {
    this.aspect.set(aspect);
    this.openMenu.set(null);
  }

  selectEffort(effort: GenerationEffort): void {
    this.effort.set(effort);
    this.openMenu.set(null);
  }

  chooseFiles(): void {
    this.openMenu.set(null);
    this.fileInput?.remove();
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,.svg,audio/*';
    input.addEventListener('change', () => {
      this.addFiles(input.files);
      input.remove();
      this.fileInput = undefined;
    });
    this.fileInput = input;
    input.click();
  }

  removeAttachment(id: number): void {
    const attachment = this.attachments().find((item) => item.id === id);
    if (attachment) this.revokePreview(attachment);
    this.attachments.update((items) => items.filter((item) => item.id !== id));
  }

  /** Pasted images and songs are attached, as in the editor; pasted text goes into the prompt as usual. */
  onPaste(event: ClipboardEvent): void {
    const files = [...(event.clipboardData?.files ?? [])].filter((file) => this.kindOf(file));
    if (!files.length) return;
    event.preventDefault();
    this.addFiles(files);
  }

  onDragOver(event: DragEvent): void {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    this.dragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    const form = event.currentTarget as HTMLElement;
    if (!form.contains(event.relatedTarget as Node | null)) this.dragging.set(false);
  }

  onDrop(event: DragEvent): void {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    this.dragging.set(false);
    this.addFiles(event.dataTransfer.files);
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
    if (this.prompt.trim()) void this.submitPrompt();
  }

  async submitPrompt(): Promise<void> {
    if (!this.prompt.trim()) return;
    await this.router.navigate(['/signup'], {
      queryParams: { returnUrl: editorReturnPath(this.prompt) },
    });
  }

  private addFiles(files: Iterable<File> | null): void {
    const added: ComposerAttachment[] = [];
    for (const file of files ?? []) {
      const kind = this.kindOf(file);
      if (!kind) continue;
      added.push({
        id: this.nextAttachmentId++,
        name: file.name || (kind === 'image' ? 'Pasted image' : 'Song'),
        kind,
        preview: kind === 'image' ? URL.createObjectURL(file) : undefined,
      });
    }
    if (added.length) this.attachments.update((items) => [...items, ...added]);
  }

  private kindOf(file: File): ComposerAttachment['kind'] | null {
    if (file.type.startsWith('image/') || /\.svg$/i.test(file.name)) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    return null;
  }

  private revokePreview(attachment: ComposerAttachment): void {
    if (attachment.preview) URL.revokeObjectURL(attachment.preview);
  }
}
