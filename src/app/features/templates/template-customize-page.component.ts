import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
import { MotionTemplate, promptSegmentValue, renderTemplatePrompt, templateDefaults } from './template-library.data';
import { TemplateStore } from './template-store';

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
  private readonly seo = inject(SeoService);
  private readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('slug');
  readonly store = inject(TemplateStore);
  readonly template = computed(() => this.store.find(this.slug));
  readonly values = signal<Readonly<Record<string, string>>>({});
  readonly copied = signal(false);
  readonly promptSegmentValue = promptSegmentValue;
  readonly promptText = computed(() => {
    const template = this.template();
    return template ? renderTemplatePrompt(template, this.values()) : '';
  });

  constructor() {
    this.select(this.template());
    // The build had no templates, so the page fills in once the API answers.
    if (!this.template()) afterNextRender(() => void this.store.load().then(() => this.select(this.template())));
  }

  private select(template?: MotionTemplate): void {
    if (template) {
      this.values.set(templateDefaults(template));
      this.seo.apply({
        title: `Customize ${template.title} | Motify`,
        description: `Customize the ${template.title} motion design prompt and copy the finished brief.`,
        path: `/templates/customize/${template.slug}`,
      });
    } else {
      this.seo.apply({
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
    const definition = this.template()?.fields.find((field) => field.key === key);
    const value = this.fieldValue(key).trim();
    return Boolean(value && value !== definition?.defaultValue);
  }

  updateField(key: string, value: string | number): void {
    this.values.update((current) => ({ ...current, [key]: String(value ?? '') }));
  }

  reset(): void {
    const template = this.template();
    if (!template) return;
    this.values.set(templateDefaults(template));
    this.copied.set(false);
  }

  async copyPrompt(): Promise<void> {
    if (!this.template()) return;
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
