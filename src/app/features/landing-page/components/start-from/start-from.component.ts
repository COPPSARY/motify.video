import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export interface StartFromTab {
  readonly id: 'prompt' | 'footage' | 'psd';
  readonly label: string;
  readonly beta: boolean;
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  /** The page that explains the feature in depth, for the beta features. */
  readonly more?: { readonly label: string; readonly link: string };
}

export const START_FROM_TABS: readonly StartFromTab[] = [
  {
    id: 'prompt',
    label: 'Prompt',
    beta: false,
    title: 'Describe it.',
    body: 'Write your idea in plain words. Motify plans the story and animates it on-brand.',
    cta: 'Write a prompt',
  },
  {
    id: 'footage',
    label: 'Footage',
    beta: true,
    title: 'Upload your clips.',
    body: 'The AI video editor cuts your raw footage into a promo video, between words, with captions, title cards, and B-roll.',
    cta: 'Try the AI video editor',
    more: { label: 'How the AI video editor works', link: '/ai-video-editor' },
  },
  {
    id: 'psd',
    label: 'Photoshop',
    beta: true,
    title: 'Import your PSD.',
    body: 'Motify animates the layers you designed, exactly where you placed them. Nothing is redrawn. 20 credits a video.',
    cta: 'Try PSD to Video',
    more: { label: 'How PSD to Video works', link: '/psd-to-video' },
  },
];

/**
 * The three ways into Motify: a prompt, your own footage, or a Photoshop design.
 * Tabs with a sliding indicator; each panel pairs a short claim with a small
 * interface mock that plays once when its tab opens. Every panel is in the
 * server HTML (inactive ones are `hidden`), so all of the copy is crawlable.
 */
@Component({
  selector: 'app-start-from',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './start-from.component.html',
  styleUrl: './start-from.component.css',
})
export class StartFromComponent {
  readonly tabs = START_FROM_TABS;
  readonly active = signal<StartFromTab['id']>('prompt');
  protected readonly pill = signal({ x: 0, w: 0 });
  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.placePill();
      const onResize = () => this.placePill();
      window.addEventListener('resize', onResize, { passive: true });
      document.fonts?.ready.then(() => this.placePill());
      destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
    });
  }

  select(id: StartFromTab['id'], focus = false): void {
    this.active.set(id);
    const button = this.buttonFor(id);
    if (focus) button?.focus();
    this.placePill(button);
  }

  /** Arrow keys move between tabs, as in any tab list. */
  onTabKeydown(event: KeyboardEvent, index: number): void {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const target =
      event.key === 'Home' ? 0 : event.key === 'End' ? this.tabs.length - 1 : step ? (index + step + this.tabs.length) % this.tabs.length : -1;
    if (target < 0) return;
    event.preventDefault();
    this.select(this.tabs[target].id, true);
  }

  /** "Write a prompt" goes back to the hero's prompt box: one place to type. */
  toPrompt(event: MouseEvent): void {
    const prompt = document.getElementById('motion-prompt');
    if (!prompt) return;
    event.preventDefault();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    prompt.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    prompt.focus({ preventScroll: true });
  }

  private buttonFor(id: StartFromTab['id']): HTMLButtonElement | undefined {
    return this.tabButtons()[this.tabs.findIndex((tab) => tab.id === id)]?.nativeElement;
  }

  private placePill(button = this.buttonFor(this.active())): void {
    if (button) this.pill.set({ x: button.offsetLeft, w: button.offsetWidth });
  }
}
