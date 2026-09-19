import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideArrowUp, LucidePlus, LucideSparkles } from '@lucide/angular';
import { ExternalLinkCardComponent } from '../../../../shared/components/external-link-card/external-link-card.component';
import { editorReturnPath } from '../../../../shared/config/runtime-config';
import { RESOURCE_LINKS } from '../../../../shared/constants/external-links';
import { ResourceLink } from '../../../../shared/models/landing.models';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-resources-section',
  standalone: true,
  imports: [FormsModule, ExternalLinkCardComponent, ScrollRevealDirective, LucideArrowUp, LucidePlus, LucideSparkles],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resources-section.component.html',
  styleUrl: './resources-section.component.css',
})
export class ResourcesSectionComponent {
  private readonly router = inject(Router);
  readonly resources: readonly ResourceLink[] = RESOURCE_LINKS;
  prompt = '';
  assetMenuOpen = false;
  selectedAsset = '';

  toggleAssetMenu(): void {
    this.assetMenuOpen = !this.assetMenuOpen;
  }

  chooseAsset(kind: 'image' | 'video'): void {
    this.assetMenuOpen = false;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = kind === 'image' ? 'image/*,.svg' : 'video/*';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (file) this.selectedAsset = file.name;
      input.remove();
    });
    input.click();
  }

  onPromptKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) return;

    event.preventDefault();
    void this.submitPrompt();
  }

  enhancePrompt(): void {
    const prompt = this.prompt.trim();
    this.prompt = prompt
      ? `${prompt} Make it polished, cinematic, and aligned with the brand.`
      : 'Create a polished, cinematic launch video that feels aligned with my brand.';
  }

  async submitPrompt(): Promise<void> {
    await this.router.navigate(['/signup'], {
      queryParams: { returnUrl: editorReturnPath(this.prompt) },
    });
  }
}
