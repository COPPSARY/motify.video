import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PromptComposerComponent } from '../../../../shared/components/prompt-composer/prompt-composer.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-resources-section',
  standalone: true,
  imports: [PromptComposerComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resources-section.component.html',
  styleUrl: './resources-section.component.css',
})
export class ResourcesSectionComponent {}
