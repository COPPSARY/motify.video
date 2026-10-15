import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PROMPT_TEMPLATES } from '../../shared/data/resource-content.data';
import { extractPromptFields, populatePrompt } from '../../shared/utils/prompt-fields';
import { editorReturnPath, motifyEditorUrl } from '../../shared/config/runtime-config';
import { AuthService } from '../../shared/services/auth.service';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

export { extractPromptFields, populatePrompt, type PromptField } from '../../shared/utils/prompt-fields';

export function templateIdOrDefault(id: string | null): string {
  return PROMPT_TEMPLATES.some((template) => template.id === id) ? (id as string) : PROMPT_TEMPLATES[0].id;
}

@Component({
  selector: 'app-prompt-templates-page',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prompt-templates-page.component.html',
  styleUrl: './prompt-templates-page.component.css',
})
export class PromptTemplatesPageComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly templates = PROMPT_TEMPLATES;
  /** `?template=<id>` (from a guide) opens that template; unknown ids fall back to the first. */
  readonly selectedId = signal<string>(
    templateIdOrDefault(inject(ActivatedRoute).snapshot.queryParamMap.get('template')),
  );
  readonly values = signal<Readonly<Record<string, string>>>({});
  readonly copied = signal(false);

  readonly selectedTemplate = computed(() => {
    const id = this.selectedId();
    return this.templates.find((template) => template.id === id) ?? this.templates[0];
  });

  readonly fields = computed(() => extractPromptFields(this.selectedTemplate().prompt));

  readonly generatedPrompt = computed(() => {
    return populatePrompt(this.selectedTemplate().prompt, this.fields(), this.values());
  });

  /** Blanks still showing their [PLACEHOLDER], so the user knows before sending. */
  readonly unfilledCount = computed(() => {
    const values = this.values();
    return this.fields().filter((field) => !values[field.key]?.trim()).length;
  });

  constructor() {
    inject(SeoService).apply({
      title: 'Product Marketing Prompt Templates | Motify',
      description:
        'Customizable, scene-directed prompts for SaaS launches, feature announcements, explainers, social proof, events, and more.',
      path: '/resources/prompt-templates',
    });
  }

  selectTemplate(id: string): void {
    this.selectedId.set(id);
    this.values.set({});
    this.copied.set(false);
  }

  fieldValue(token: string): string {
    return this.values()[token] ?? '';
  }

  updateField(token: string, value: string): void {
    this.values.update((values) => ({ ...values, [token]: value }));
  }

  clearInputs(): void {
    this.values.set({});
  }

  /** Signed in: straight to the app with this prompt. Otherwise sign up first; the prompt rides along. */
  useInMotify(): void {
    const prompt = this.generatedPrompt();
    if (this.auth.user()) {
      window.location.href = motifyEditorUrl(prompt);
      return;
    }
    void this.router.navigate(['/signup'], { queryParams: { returnUrl: editorReturnPath(prompt) } });
  }

  async copyPrompt(): Promise<void> {
    const text = this.generatedPrompt();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard access can be unavailable in restricted browser contexts.
    }
  }
}
