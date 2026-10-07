import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideArrowUp, LucidePlus, LucideSparkles } from '@lucide/angular';
import { editorReturnPath } from '../../../../shared/config/runtime-config';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-resources-section',
  standalone: true,
  imports: [FormsModule, RouterLink, ScrollRevealDirective, LucideArrowUp, LucidePlus, LucideSparkles],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resources-section.component.html',
  styleUrl: './resources-section.component.css',
})
export class ResourcesSectionComponent {
  private readonly router = inject(Router);
  readonly resources = [
    {
      title: 'Prompt Templates',
      description: 'Copy and customize structured briefs for twelve real product marketing jobs.',
      href: '/resources/prompt-templates',
      meta: '12 templates',
    },
    {
      title: 'Brand DNA',
      description: 'Give AI useful context about your logo, voice, colors, type, style, and audience.',
      href: '/resources/brand-dna',
      meta: '6 guides',
    },
    {
      title: 'Marketing Playbooks',
      description: 'Repeatable workflows for launches, demos, feature releases, and small teams.',
      href: '/resources/playbooks',
      meta: '9 playbooks',
    },
  ] as const;
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
