import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  buildPrompt,
  GOAL_DETAILS,
  keyBlanksFor,
  ONBOARDING_GOALS,
  PROMPT_LEVELS,
  templateFor,
  type OnboardingGoal,
  type ProductAnswers,
  type PromptLevel,
} from '../../shared/data/onboarding.data';
import { PROMPT_TEMPLATES } from '../../shared/data/resource-content.data';
import { motifyEditorUrl, promptFromReturnPath } from '../../shared/config/runtime-config';
import { AuthService } from '../../shared/services/auth.service';
import { BrandService } from '../../shared/services/brand.service';
import { SeoService } from '../../shared/services/seo.service';

export type WelcomeStep = 'level' | 'goal' | 'product' | 'ready';

const STEPS: readonly WelcomeStep[] = ['level', 'goal', 'product', 'ready'];

/** Accepts "acme.com" or a full URL; returns '' for anything that isn't a web address. */
export function normalizeWebsite(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.hostname.includes('.') ? url.toString() : '';
  } catch {
    return '';
  }
}

/** "CTA TEXT" → "Cta text"; reads better as a form label than shouting. */
function sentenceCase(label: string): string {
  const lower = label.toLowerCase().replace(/\bcta\b/, 'call to action');
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** The API explains unreadable sites in plain words; anything else gets a generic retry hint. */
function extractMessage(error: unknown): string {
  const message = (error as { error?: { error?: { message?: string } } } | null)?.error?.error?.message;
  return message || 'We couldn\u2019t read that site. Fill it in below instead.';
}

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css',
})
export class WelcomePageComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly brand = inject(BrandService);

  readonly levels = PROMPT_LEVELS;
  readonly goals = ONBOARDING_GOALS;
  readonly allTemplates = PROMPT_TEMPLATES;
  readonly stepCount = STEPS.length;

  /** Only app return paths are honored; anything else falls back to the app home. */
  readonly returnUrl: string;
  /** What they typed on the homepage before signing up, if anything. */
  readonly pendingPrompt: string;

  readonly step = signal<WelcomeStep>('level');
  readonly level = signal<PromptLevel>('beginner');
  readonly goal = signal<OnboardingGoal>('launch');

  readonly name = signal('');
  readonly description = signal('');
  readonly audience = signal('');
  readonly color = signal('');
  readonly website = signal('');
  readonly productError = signal('');
  readonly saving = signal(false);
  readonly brandSaveFailed = signal(false);

  /** Website reading (Site Intelligence), when the API offers it. */
  readonly canExtract = signal(false);
  readonly extracting = signal(false);
  readonly extractError = signal('');
  /** The site the fields were filled from, shown so the person knows to check them. */
  readonly filledFrom = signal('');

  /** Experienced: answers to the template's key blanks. */
  readonly extras = signal<Readonly<Record<string, string>>>({});
  /** Expert: the template they picked, and their hand edits to the prompt. */
  readonly expertTemplateId = signal('');
  readonly expertPrompt = signal('');
  readonly showFullPrompt = signal(false);

  readonly stepNumber = computed(() => STEPS.indexOf(this.step()) + 1);
  readonly template = computed(() => templateFor(this.goal()));
  readonly beats = computed(() => GOAL_DETAILS[this.goal()].beats);
  readonly keyBlanks = computed(() => keyBlanksFor(this.goal()).map((field) => ({ ...field, label: sentenceCase(field.label) })));

  private readonly answers = computed<ProductAnswers>(() => ({
    name: this.name(),
    description: this.description(),
    audience: this.audience(),
    color: this.color(),
    website: normalizeWebsite(this.website()),
  }));

  /** Beginner and experienced: the goal's template, filled in. A homepage prompt rides along as a note. */
  readonly builtPrompt = computed(() => {
    const prompt = buildPrompt(this.template(), this.answers(), this.extras());
    return this.pendingPrompt ? `${prompt}\n\nAlso from me: ${this.pendingPrompt}` : prompt;
  });

  readonly finalPrompt = computed(() => (this.level() === 'expert' ? this.expertPrompt() : this.builtPrompt()));

  constructor() {
    const requested = inject(ActivatedRoute).snapshot.queryParamMap.get('returnUrl') ?? '';
    this.returnUrl = requested.startsWith('/editor') ? requested : '/editor';
    this.pendingPrompt = promptFromReturnPath(this.returnUrl);

    inject(SeoService).apply({
      title: 'Welcome to Motify',
      description: 'Set up your first Motify video.',
      path: '/welcome',
      robots: 'noindex, nofollow',
    });

    afterNextRender(() => {
      void this.auth.currentUser().then((user) => {
        if (!user) void this.router.navigate(['/login'], { queryParams: { returnUrl: this.returnUrl } });
        else void this.brand.canExtract().then((available) => this.canExtract.set(available));
      });
    });
  }

  chooseLevel(level: PromptLevel): void {
    this.level.set(level);
    this.step.set('goal');
  }

  chooseGoal(goal: OnboardingGoal): void {
    this.goal.set(goal);
    this.extras.set({});
    this.step.set('product');
  }

  async continueFromProduct(): Promise<void> {
    if (!this.name().trim()) {
      this.productError.set('Add your product name.');
      return;
    }
    if (this.website().trim() && !normalizeWebsite(this.website())) {
      this.productError.set('Check the website, e.g. acme.com.');
      return;
    }
    this.productError.set('');
    this.saving.set(true);
    try {
      await this.brand.saveBasics(this.answers());
      this.brandSaveFailed.set(false);
    } catch {
      // Not a blocker: the video still gets these answers through the prompt.
      this.brandSaveFailed.set(true);
    }
    this.saving.set(false);
    this.chooseExpertTemplate(this.template().id);
    this.step.set('ready');
  }

  /** Reads the website and pre-fills the fields; the person still checks them before continuing. */
  async fillFromWebsite(): Promise<void> {
    const website = normalizeWebsite(this.website());
    if (!website) {
      this.extractError.set('Enter your website first, e.g. acme.com.');
      return;
    }
    this.extractError.set('');
    this.extracting.set(true);
    try {
      const found = await this.brand.extractFromWebsite(website);
      // Only fill what the person hasn't typed themselves.
      const fill = (current: string, next: string) => current.trim() || next;
      this.name.set(fill(this.name(), found.name));
      this.description.set(fill(this.description(), found.description));
      this.audience.set(fill(this.audience(), found.audience));
      this.color.set(this.color() || found.color);
      this.filledFrom.set(new URL(website).hostname.replace(/^www\./, ''));
    } catch (error: unknown) {
      this.extractError.set(extractMessage(error));
    }
    this.extracting.set(false);
  }

  setExtra(key: string, value: string): void {
    this.extras.update((extras) => ({ ...extras, [key]: value }));
  }

  chooseExpertTemplate(id: string): void {
    const template = PROMPT_TEMPLATES.find((item) => item.id === id) ?? this.template();
    this.expertTemplateId.set(template.id);
    const prompt = buildPrompt(template, this.answers());
    this.expertPrompt.set(this.pendingPrompt ? `${prompt}\n\nAlso from me: ${this.pendingPrompt}` : prompt);
  }

  back(): void {
    const index = STEPS.indexOf(this.step());
    if (index > 0) this.step.set(STEPS[index - 1]);
  }

  /** Straight to the app with only what they typed on the homepage. */
  skip(): void {
    this.leaveFor(motifyEditorUrl(this.pendingPrompt || undefined));
  }

  create(): void {
    this.leaveFor(
      motifyEditorUrl(this.finalPrompt(), {
        // Experts know their way around; everyone else gets the app tour.
        tour: this.level() !== 'expert',
        level: this.level(),
        goal: this.goal(),
        brandName: this.name(),
      }),
    );
  }

  protected leaveFor(url: string): void {
    window.location.href = url;
  }
}
