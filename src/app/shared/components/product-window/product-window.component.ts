import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ProductShot } from '../../data/product-shots';

/**
 * Screenshots of the real editor in a browser window. The window tilts up into
 * place as it scrolls into view, and a glow in the accent color sits behind it.
 * Given several shots, it cross-fades to the active one.
 */
@Component({
  selector: 'app-product-window',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pw" [style.--accent]="accent()">
      <div class="pw__glow" aria-hidden="true"></div>
      <div class="pw__window">
        <div class="pw__bar" aria-hidden="true">
          <span class="pw__dots"><i></i><i></i><i></i></span>
          <span class="pw__url">motify.video</span>
        </div>
        <div class="pw__screen" [style.aspect-ratio]="ratio()">
          @for (shot of shots(); track shot.src; let i = $index) {
            <figure
              class="pw__shot"
              [class.is-active]="i === active()"
              [style.width.%]="widths()[i]"
              [style.left.%]="(100 - widths()[i]) / 2"
              [attr.aria-hidden]="i !== active()"
            >
              <img
                [src]="shot.src"
                [alt]="shot.alt"
                [width]="shot.width"
                [height]="shot.height"
                [attr.loading]="i === 0 && eager() ? null : 'lazy'"
                decoding="async"
              />
            </figure>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './product-window.component.css',
})
export class ProductWindowComponent {
  readonly shots = input.required<readonly ProductShot[]>();
  readonly active = input(0);
  /** The color of the glow behind the window. */
  readonly accent = input('#2758e6');
  /** Load the first screenshot straight away, for a window near the top of the page. */
  readonly eager = input(false);

  /** The screen fits the widest screenshot; narrower ones sit centered in it. */
  private readonly widest = computed(() =>
    this.shots().reduce((a, b) => (b.width / b.height > a.width / a.height ? b : a)),
  );
  protected readonly ratio = computed(() => `${this.widest().width} / ${this.widest().height}`);
  /** Each shot's width as a percentage of the screen, at full height. Exact, so nothing sits on a half pixel. */
  protected readonly widths = computed(() => {
    const screen = this.widest().width / this.widest().height;
    return this.shots().map((shot) => ((shot.width / shot.height) / screen) * 100);
  });
}
