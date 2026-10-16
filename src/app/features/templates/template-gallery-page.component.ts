import { DOCUMENT, Location } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideArrowRight,
  LucideCheck,
  LucideClipboard,
  LucideSparkles,
  LucideX,
} from '@lucide/angular';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { LazyVideoDirective } from '../../shared/directives/lazy-video.directive';
import { SeoService } from '../../shared/services/seo.service';
import { MotionTemplate, renderTemplatePrompt, templateAspect } from './template-library.data';
import { TemplateStore } from './template-store';

@Component({
  selector: 'app-template-gallery-page',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    LazyVideoDirective,
    LucideArrowRight,
    LucideCheck,
    LucideClipboard,
    LucideSparkles,
    LucideX,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './template-gallery-page.component.html',
  styleUrl: './template-gallery-page.component.css',
})
export class TemplateGalleryPageComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly seo = inject(SeoService);
  private readonly document = inject(DOCUMENT);
  private previouslyFocused: HTMLElement | null = null;
  private previousBodyOverflow = '';
  readonly store = inject(TemplateStore);

  @ViewChild('closeButton') private closeButton?: ElementRef<HTMLButtonElement>;

  readonly renderTemplatePrompt = renderTemplatePrompt;
  readonly templateAspect = templateAspect;
  readonly selectedSlug = signal<string | null>(null);
  readonly activeCategory = signal('All');
  readonly copied = signal(false);
  /** Placeholder card shapes while the list loads, in the formats the library uses. */
  readonly skeletonAspects = ['16 / 9', '9 / 16', '1 / 1', '4 / 5', '16 / 9', '4 / 5', '9 / 16', '1 / 1'];

  /** Every category the templates use, in the order they first appear. */
  readonly categories = computed(() => [
    'All',
    ...new Set(this.store.templates().flatMap((template) => template.categories)),
  ]);

  readonly visibleTemplates = computed(() => {
    const category = this.activeCategory();
    const templates = this.store.templates();
    return category === 'All' ? templates : templates.filter((template) => template.categories.includes(category));
  });

  readonly selectedTemplate = computed(() => this.store.find(this.selectedSlug()));

  constructor() {
    // `/templates/:slug` is the gallery with that template open, so it can be linked and shared.
    const slug = inject(ActivatedRoute).snapshot.paramMap.get('slug');
    const linked = slug ? this.store.find(slug) : undefined;
    this.applySeo(linked);
    if (linked) {
      this.selectedSlug.set(linked.slug);
      afterNextRender(() => {
        this.previousBodyOverflow = this.document.body.style.overflow;
        this.document.body.style.overflow = 'hidden';
        this.closeButton?.nativeElement.focus();
        void this.store.load();
      });
      return;
    }
    afterNextRender(async () => {
      // The live list replaces the baked one, so templates added since the build appear too.
      await this.store.load();
      if (!slug) return;
      // A template newer than the build resolves once the API answers.
      const late = this.store.find(slug);
      if (late) this.openTemplate(late);
      else if (this.store.state() === 'ready') this.location.replaceState('/templates');
    });
  }

  /** The gallery's metadata, or one template's when it is open. */
  private applySeo(template?: MotionTemplate): void {
    this.seo.apply(template
      ? {
          title: `${template.title} — Motion Design Template | Motify`,
          description: template.description,
          path: `/templates/${template.slug}`,
        }
      : {
          title: 'Motion Design Templates | Motify',
          description: 'Browse curated, customizable motion design prompts with finished video previews.',
          path: '/templates',
        });
  }

  setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  categoryCount(category: string): number {
    return this.store.templates().filter((template) => template.categories.includes(category)).length;
  }

  openTemplate(template: MotionTemplate): void {
    this.previouslyFocused = this.document.activeElement as HTMLElement | null;
    this.previousBodyOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    this.selectedSlug.set(template.slug);
    this.copied.set(false);
    // The URL follows the open template without adding history entries.
    this.location.replaceState(`/templates/${template.slug}`);
    this.applySeo(template);
    setTimeout(() => this.closeButton?.nativeElement.focus());
  }

  closeTemplate(): void {
    if (!this.selectedSlug()) return;
    this.selectedSlug.set(null);
    this.document.body.style.overflow = this.previousBodyOverflow;
    this.location.replaceState('/templates');
    this.applySeo();
    this.previouslyFocused?.focus();
  }

  async copyPrompt(template: MotionTemplate): Promise<void> {
    try {
      await this.writeClipboard(renderTemplatePrompt(template));
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch {
      this.copied.set(false);
    }
  }

  async customize(template: MotionTemplate): Promise<void> {
    this.closeTemplate();
    await this.router.navigate(['/templates/customize', template.slug]);
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.closeTemplate();
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = this.previousBodyOverflow;
  }

  private async writeClipboard(text: string): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Fall through to the selection-based copy path.
      }
    }
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
