import { afterNextRender, ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideArrowUp, LucidePlus, LucideSparkles } from '@lucide/angular';
import { motifyEditorUrl } from '../../../../shared/constants/external-links';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ScrollRevealDirective,
    LucideArrowUp,
    LucidePlus,
    LucideSparkles,
  ],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements OnDestroy {
  prompt = '';
  assetMenuOpen = false;
  selectedAsset = '';
  readonly typedPrompt = signal('');
  private typingTimer?: number;
  private assetInput?: HTMLInputElement;
  private readonly examples = [
    'Create a cinematic launch video for my new product...',
    'Turn this feature update into a bold motion ad...',
    'Make a clean product demo with energetic transitions...',
  ];

  constructor() {
    afterNextRender(() => this.startPromptTyping());
  }

  ngOnDestroy(): void {
    if (this.typingTimer !== undefined) window.clearInterval(this.typingTimer);
    this.assetInput?.remove();
  }

  toggleAssetMenu(): void {
    this.assetMenuOpen = !this.assetMenuOpen;
  }

  chooseAsset(kind: 'image' | 'video'): void {
    this.assetMenuOpen = false;
    this.assetInput?.remove();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = kind === 'image' ? 'image/*,.svg' : 'video/*';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (file) this.selectedAsset = file.name;
      input.remove();
      this.assetInput = undefined;
    });
    this.assetInput = input;
    input.click();
  }

  onPromptKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) return;

    event.preventDefault();
    void this.submitPrompt();
  }

  private startPromptTyping(): void {
    let exampleIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    this.typingTimer = window.setInterval(() => {
      const example = this.examples[exampleIndex] ?? '';
      if (!deleting) {
        characterIndex += 1;
        this.typedPrompt.set(example.slice(0, characterIndex));
        if (characterIndex === example.length) deleting = true;
      } else {
        characterIndex -= 1;
        this.typedPrompt.set(example.slice(0, characterIndex));
        if (characterIndex === 0) {
          deleting = false;
          exampleIndex = (exampleIndex + 1) % this.examples.length;
        }
      }
    }, 62);
  }

  async submitPrompt(): Promise<void> {
    window.location.href = `${motifyEditorUrl()}?prompt=${encodeURIComponent(this.prompt.trim())}`;
  }

  enhancePrompt(): void {
    const prompt = this.prompt.trim();
    this.prompt = prompt
      ? `${prompt} Make it polished, cinematic, and aligned with the brand.`
      : 'Create a polished, cinematic launch video that feels aligned with my brand.';
  }
}
