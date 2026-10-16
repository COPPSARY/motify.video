import { afterNextRender, ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { AuroraComponent } from '../../../../shared/components/aurora/aurora.component';
import { PromptComposerComponent } from '../../../../shared/components/prompt-composer/prompt-composer.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuroraComponent, PromptComposerComponent, ScrollRevealDirective],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent implements OnDestroy {
  readonly auroraColors = ['#0d003c', '#00173b', '#5227FF'];
  readonly typedPrompt = signal('');
  private typingTimer?: number;
  private readonly examples = [
    'Create an animated ad for our summer menu...',
    'Turn this product photo into a short product animation...',
    'Make an explainer video for how our service works...',
  ];

  constructor() {
    afterNextRender(() => this.startPromptTyping());
  }

  ngOnDestroy(): void {
    if (this.typingTimer !== undefined) window.clearInterval(this.typingTimer);
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
}
