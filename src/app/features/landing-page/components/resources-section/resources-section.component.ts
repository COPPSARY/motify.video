import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PromptComposerComponent } from '../../../../shared/components/prompt-composer/prompt-composer.component';

/** The page's last call to action: a second prompt box, the same as the hero's. */
@Component({
  selector: 'app-resources-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PromptComposerComponent],
  templateUrl: './resources-section.component.html',
  styleUrl: './resources-section.component.css',
})
export class ResourcesSectionComponent {}
