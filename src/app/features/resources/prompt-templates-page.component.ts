import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PROMPT_TEMPLATES } from '../../shared/data/resource-content.data';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

export interface PromptField {
  readonly key: string;
  readonly token: string;
  readonly tokens: readonly string[];
  readonly label: string;
  readonly hint: string;
}

export function extractPromptFields(prompt: string): readonly PromptField[] {
  const tokens: string[] = [];
  let depth = 0;
  let start = -1;

  for (let index = 0; index < prompt.length; index += 1) {
    if (prompt[index] === '[') {
      if (depth === 0) start = index;
      depth += 1;
    } else if (prompt[index] === ']' && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        const token = prompt.slice(start, index + 1);
        if (!tokens.includes(token)) tokens.push(token);
        start = -1;
      }
    }
  }

  const fields: Array<{
    key: string;
    token: string;
    tokens: string[];
    label: string;
    hint: string;
  }> = [];

  for (const token of tokens) {
    const content = token.slice(1, -1);
    const colon = content.indexOf(':');
    const defaultMarker = ', default ';
    const defaultSeparator = content.indexOf(defaultMarker);
    const label = (
      colon >= 0
        ? content.slice(0, colon)
        : defaultSeparator >= 0
          ? content.slice(0, defaultSeparator)
          : content
    ).trim();
    const hint =
      colon >= 0
        ? content.slice(colon + 1).trim()
        : defaultSeparator >= 0
          ? `default ${content.slice(defaultSeparator + defaultMarker.length).trim()}`
          : `Enter ${label.toLowerCase()}`;
    const existing = fields.find((field) => field.key === label);
    if (existing) {
      existing.tokens.push(token);
    } else {
      fields.push({ key: label, token, tokens: [token], label, hint });
    }
  }

  return fields;
}

export function populatePrompt(
  prompt: string,
  fields: readonly PromptField[],
  values: Readonly<Record<string, string>>,
): string {
  return fields.reduce((result, field) => {
    const value = values[field.key]?.trim();
    return value
      ? field.tokens.reduce((populated, token) => populated.split(token).join(value), result)
      : result;
  }, prompt);
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
  readonly templates = PROMPT_TEMPLATES;
  readonly selectedId = signal<string>(PROMPT_TEMPLATES[0].id);
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
