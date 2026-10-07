import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PROMPT_TEMPLATES, type PromptTemplate } from '../../shared/data/resource-content.data';
import { SeoService } from '../../shared/services/seo.service';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';

export interface PromptFormValues {
  outcome: string;
  targetAudience: string;
  productContext: string;
  customerProblem: string;
  proofPoints: string;
  toneAndStyle: string;
  cta: string;
  duration: string;
}

const DEFAULT_SAMPLE_VALUES: Record<string, Partial<PromptFormValues>> = {
  'product-launch': {
    outcome: 'Announce Motify v2 and drive 1,000+ early access signups',
    targetAudience: 'SaaS founders, developers, and product marketing leads',
    productContext: 'Motify (motify.video) — a code-first AI motion graphics editor for product videos',
    customerProblem: 'Creating custom motion graphics takes weeks of manual agency back-and-forth',
    proofPoints: 'Editable HTML/CSS canvas, Brand DNA context engine, instant 4K MP4 export',
    toneAndStyle: 'Bold, minimal dark aesthetics, rhythmic pacing, crisp typography',
    cta: 'Start creating free at motify.video',
    duration: '60 seconds; with voiceover and captions',
  },
  'product-demo': {
    outcome: 'Show how easy it is to customize brand colors and motion in 3 steps',
    targetAudience: 'Product designers and growth marketers',
    productContext: 'Motify web studio with live timeline inspection',
    customerProblem: 'Static screenshots fail to explain dynamic software workflows',
    proofPoints: 'Interactive timeline scrubbing, instant preview, one-click asset export',
    toneAndStyle: 'Clear, direct, educational yet modern and polished',
    cta: 'Try the interactive demo at motify.video/demo',
    duration: '45 seconds; with captions',
  },
};

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

  readonly outcome = signal('');
  readonly targetAudience = signal('');
  readonly productContext = signal('');
  readonly customerProblem = signal('');
  readonly proofPoints = signal('');
  readonly toneAndStyle = signal('');
  readonly cta = signal('');
  readonly duration = signal('');

  readonly copied = signal(false);

  readonly selectedTemplate = computed(() => {
    const id = this.selectedId();
    return this.templates.find((t) => t.id === id) ?? this.templates[0];
  });

  readonly generatedPrompt = computed(() => {
    const t = this.selectedTemplate();

    const goal = this.outcome().trim()
      ? `${t.opening}. The single outcome I want is ${this.outcome().trim()}.`
      : `${t.opening}. The single outcome I want is [desired outcome].`;

    const audience = this.targetAudience().trim() || '[role, company type, awareness level, and what they care about]';
    const context = this.productContext().trim() || '[what the product is, how it works, and the product or website link]';
    const problem = this.customerProblem().trim() || '[the current struggle, its consequence, and why existing options fall short]';
    const proof = this.proofPoints().trim() || '[three specific features, results, screenshots, metrics, or customer evidence]';
    const tone = this.toneAndStyle().trim() || '[brand voice, pacing, visual references, colors, fonts, and what to avoid]';
    const callToAction = this.cta().trim() || '[one concrete next step for the viewer]';
    const outputFormat = this.duration().trim()
      ? `${t.format}; ${this.duration().trim()}.`
      : `${t.format}; [duration]; [with or without voiceover/captions].`;

    return `Goal: ${goal}

Target audience: ${audience}

Product context: ${context}

Customer problem: ${problem}

Key proof points: ${proof}

Tone and style: ${tone}

Call to action: ${callToAction}

Output format: ${outputFormat}`;
  });

  constructor() {
    inject(SeoService).apply({
      title: 'Product Marketing Prompt Templates | Motify',
      description:
        'Interactive structured prompts for product launches, demos, feature announcements, social videos, case studies, and more.',
      path: '/resources/prompt-templates',
    });
  }

  selectTemplate(id: string): void {
    this.selectedId.set(id);
  }

  fillSample(): void {
    const id = this.selectedId();
    const sample = DEFAULT_SAMPLE_VALUES[id] ?? DEFAULT_SAMPLE_VALUES['product-launch'];
    this.outcome.set(sample.outcome ?? 'Introduce the new release and drive product trials');
    this.targetAudience.set(sample.targetAudience ?? 'SaaS founders and product marketers');
    this.productContext.set(sample.productContext ?? 'Motify (motify.video) web-native motion editor');
    this.customerProblem.set(sample.customerProblem ?? 'Video production is too slow and disconnected from product truth');
    this.proofPoints.set(sample.proofPoints ?? 'Live canvas, Brand DNA styling, 4K export');
    this.toneAndStyle.set(sample.toneAndStyle ?? 'Fast-paced, modern dark theme, punchy typography');
    this.cta.set(sample.cta ?? 'Create your first project at motify.video');
    this.duration.set(sample.duration ?? '45 seconds; with captions');
  }

  clearInputs(): void {
    this.outcome.set('');
    this.targetAudience.set('');
    this.productContext.set('');
    this.customerProblem.set('');
    this.proofPoints.set('');
    this.toneAndStyle.set('');
    this.cta.set('');
    this.duration.set('');
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
      // ignore
    }
  }
}
