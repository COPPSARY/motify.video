import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { AuroraComponent } from '../../../../shared/components/aurora/aurora.component';
import { PromptComposerComponent } from '../../../../shared/components/prompt-composer/prompt-composer.component';
import { LandingDemoStore } from '../../landing-demo';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuroraComponent, PromptComposerComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
})
export class HeroSectionComponent {
  /** Ink into the brand cobalt, so the hero glow carries the brand color. */
  readonly auroraColors = ['#081233', '#1f45b0', '#0b1f5c'];
  /** "motion" assembles letter by letter, the page's one entrance moment. */
  readonly motionLetters = [...'motion'];
  protected readonly store = inject(LandingDemoStore);

  /** Position of the sliding indicator behind the active chip. */
  protected readonly pill = signal({ x: 0, w: 0 });
  private readonly composer = viewChild.required(PromptComposerComponent);
  private readonly chipRow = viewChild.required<ElementRef<HTMLElement>>('chipRow');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.placePill();
      const onResize = () => this.placePill();
      window.addEventListener('resize', onResize, { passive: true });
      // Web fonts change chip widths after first paint.
      document.fonts?.ready.then(() => this.placePill());
      destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
    });
  }

  choose(id: string, chip: HTMLElement): void {
    const demo = this.store.select(id);
    this.composer().fill(demo.prompt);
    // Measure the chip that was pressed, not whichever one still carries the class.
    this.placePill(chip);
    // On phones the chip row scrolls sideways; keep the chosen chip fully visible.
    chip.scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  private placePill(chip?: HTMLElement): void {
    const index = this.store.demos.indexOf(this.store.active());
    const target = chip ?? this.chipRow().nativeElement.querySelectorAll<HTMLElement>('.hero__chip')[index];
    if (target) this.pill.set({ x: target.offsetLeft, w: target.offsetWidth });
  }
}
