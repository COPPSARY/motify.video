import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCheck,
  LucideClipboard,
  LucideRotateCcw,
} from '@lucide/angular';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { SeoService } from '../../shared/services/seo.service';
import {
  getMotionTemplate,
  promptSegmentValue,
  renderTemplatePrompt,
  templateDefaults,
} from './template-library.data';

@Component({
  selector: 'app-template-customize-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    LucideArrowLeft,
    LucideCheck,
    LucideClipboard,
    LucideRotateCcw,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './template-customize-page.component.html',
  styleUrl: './template-customize-page.component.css',
})
export class TemplateCustomizePageComponent {
  private readonly document = inject(DOCUMENT);
  readonly template = getMotionTemplate(inject(ActivatedRoute).snapshot.paramMap.get('slug'));
  readonly values = signal<Readonly<Record<string, string>>>(
    this.template ? templateDefaults(this.template) : {},
  );
  readonly copied = signal(false);
  readonly promptSegmentValue = promptSegmentValue;
  readonly promptText = computed(() =>
    this.template ? renderTemplatePrompt(this.template, this.values()) : '',
  );

  constructor() {
    const seo = inject(SeoService);
    if (this.template) {
      seo.apply({
        title: `Customize ${this.template.title} | Motify`,
        description: `Customize the ${this.template.title} motion design prompt and copy the finished brief.`,
        path: `/templates/customize/${this.template.slug}`,
      });
    } else {
      seo.apply({
        title: 'Template Not Found | Motify',
        description: 'This motion design template could not be found.',
        path: '/templates',
        robots: 'noindex, follow',
      });
    }
  }

  fieldValue(key: string): string {
    return this.values()[key] ?? '';
  }

  isCustomized(key: string): boolean {
    if (!this.template) return false;
    const definition = this.template.fields.find((field) => field.key === key);
    const value = this.fieldValue(key).trim();
    return Boolean(value && value !== definition?.defaultValue);
  }

  updateField(key: string, value: string | number): void {
    this.values.update((current) => ({ ...current, [key]: String(value ?? '') }));
  }

  reset(): void {
    if (!this.template) return;
    this.values.set(templateDefaults(this.template));
    this.copied.set(false);
  }

  async copyPrompt(): Promise<void> {
    if (!this.template) return;
    const text = this.promptText();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        this.fallbackCopy(text);
      }
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch {
      try {
        this.fallbackCopy(text);
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1800);
      } catch {
        this.copied.set(false);
      }
    }
  }

  private fallbackCopy(text: string): void {
      const textarea = this.document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      this.document.body.appendChild(textarea);
      textarea.select();
      this.document.execCommand('copy');
      textarea.remove();
  }
}
