import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The page's last call to action. It does not repeat the prompt box: it takes the
 * visitor back up to the one in the hero and puts the cursor in it. Without
 * JavaScript the link still jumps there.
 */
@Component({
  selector: 'app-resources-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resources-section.component.html',
  styleUrl: './resources-section.component.css',
})
export class ResourcesSectionComponent {
  toPrompt(event: MouseEvent): void {
    const prompt = document.getElementById('motion-prompt');
    if (!prompt) return;
    event.preventDefault();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    prompt.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    prompt.focus({ preventScroll: true });
  }
}
