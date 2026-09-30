import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { SeoService } from '../../shared/services/seo.service';
import { AuthService, type MotifyUser } from '../../shared/services/auth.service';
import {
  BillingService,
  type BillingPayment,
  type BillingPlan,
  type MotifyWorkspace,
  type PlanId,
  type WorkspaceSubscription,
} from '../../shared/services/billing.service';

type CheckoutState = 'idle' | 'confirming' | 'creating' | 'pending' | 'paid' | 'expired' | 'failed' | 'error';
type PaymentMethodId = 'bakong-khqr' | 'card';

const FALLBACK_PLANS: readonly BillingPlan[] = [
  { id: 'starter', name: 'Starter', price: 10, currency: 'USD', periodDays: 30, credits: 150, available: true },
  { id: 'pro', name: 'Pro', price: 20, currency: 'USD', periodDays: 30, credits: 300, available: true },
  { id: 'studio', name: 'Studio', price: 50, currency: 'USD', periodDays: 30, credits: 750, available: false },
];

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pricing-page.component.html',
  styleUrl: './pricing-page.component.css',
})
export class PricingPageComponent implements OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly billing = inject(BillingService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly plans = signal<readonly BillingPlan[]>(FALLBACK_PLANS);
  readonly user = signal<MotifyUser | null>(null);
  readonly workspace = signal<MotifyWorkspace | null>(null);
  readonly subscription = signal<WorkspaceSubscription | null>(null);
  readonly initializing = signal(true);
  readonly checkoutState = signal<CheckoutState>('idle');
  readonly payment = signal<BillingPayment | null>(null);
  readonly qrDataUrl = signal('');
  readonly secondsRemaining = signal(0);
  readonly checkoutError = signal('');
  readonly pollingNotice = signal('');
  readonly selectedPaymentMethod = signal<PaymentMethodId>('bakong-khqr');

  private pollTimer?: number;
  private countdownTimer?: number;
  private destroyed = false;

  constructor() {
    inject(SeoService).apply({
      title: 'AI Video Generator Pricing | Motify',
      description:
        'Compare Motify plans for creating AI product videos, promotional videos, SaaS explainers, motion graphics, and campaign variations.',
      path: '/pricing',
    });
    afterNextRender(() => void this.initialize());
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopPolling();
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    if (this.checkoutState() !== 'idle') this.closeCheckout();
  }

  plan(id: PlanId): BillingPlan {
    return this.plans().find((plan) => plan.id === id)
      ?? FALLBACK_PLANS.find((plan) => plan.id === id)!;
  }

  isActivePlan(id: PlanId): boolean {
    return this.subscription()?.status === 'active' && this.subscription()?.plan === id;
  }

  planButtonLabel(id: PlanId): string {
    if (this.isActivePlan(id)) return 'Extend plan';
    if (this.subscription()?.status === 'active') return 'Switch plan';
    if (this.checkoutState() === 'creating' && this.payment()?.plan === id) return 'Preparing…';
    return 'Select plan';
  }

  subscriptionEnd(): string {
    const end = this.subscription()?.currentPeriodEnd;
    return end ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(end)) : '';
  }

  countdownLabel(): string {
    const seconds = this.secondsRemaining();
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  }

  async beginCheckout(planId: PlanId): Promise<void> {
    if (this.initializing()) return;
    const plan = this.plan(planId);
    if (!plan.available) return;

    let currentUser = this.user();
    if (!currentUser) {
      currentUser = await this.auth.currentUser();
      this.user.set(currentUser);
    }
    if (!currentUser) {
      const returnUrl = `/pricing?checkout=${planId}`;
      this.auth.setPendingReturnUrl(returnUrl);
      await this.router.navigate(['/signup'], { queryParams: { returnUrl } });
      return;
    }

    this.checkoutError.set('');
    this.selectedPaymentMethod.set('bakong-khqr');
    this.payment.set({
      id: '', workspaceId: this.workspace()?.id ?? '', plan: planId, amount: plan.price, currency: plan.currency,
      billNumber: '', status: 'PENDING', qr: null, expiresAt: '', paidAt: null, createdAt: '',
    });
    this.checkoutState.set('confirming');
  }

  async confirmCheckout(): Promise<void> {
    const planId = this.payment()?.plan;
    if (planId && this.selectedPaymentMethod() === 'bakong-khqr') await this.createCheckout(planId);
  }

  selectPaymentMethod(method: PaymentMethodId): void {
    if (method === 'bakong-khqr') this.selectedPaymentMethod.set(method);
  }

  private async createCheckout(planId: PlanId): Promise<void> {
    const plan = this.plan(planId);

    let workspace = this.workspace();
    if (!workspace) workspace = await this.loadBillingWorkspace();
    if (!workspace) {
      this.openError('We could not find a workspace you own. Open Motify once, then try again.');
      return;
    }

    const csrfToken = this.auth.csrfToken();
    if (!csrfToken) {
      this.openError('Your session needs to be refreshed. Sign in again and retry the purchase.');
      return;
    }

    this.checkoutState.set('creating');
    this.checkoutError.set('');
    this.payment.set({
      id: '', workspaceId: workspace.id, plan: planId, amount: plan.price, currency: plan.currency,
      billNumber: '', status: 'PENDING', qr: null, expiresAt: '', paidAt: null, createdAt: '',
    });
    try {
      const payment = await this.billing.createCheckout(workspace.id, planId, csrfToken);
      await this.showPendingPayment(payment);
      this.clearCheckoutQuery();
    } catch (error: unknown) {
      this.openError(this.errorMessage(error, 'We could not start the Bakong checkout. Please try again.'));
    }
  }

  closeCheckout(): void {
    this.stopPolling();
    this.checkoutState.set('idle');
    this.payment.set(null);
    this.qrDataUrl.set('');
    this.checkoutError.set('');
    this.pollingNotice.set('');
    this.clearCheckoutQuery();
  }

  retryCheckout(): void {
    const plan = this.payment()?.plan;
    this.closeCheckout();
    if (plan) void this.createCheckout(plan);
  }

  stopBackdrop(event: MouseEvent): void {
    event.stopPropagation();
  }

  private async initialize(): Promise<void> {
    try {
      const plans = await this.billing.listPlans();
      if (plans.length) this.plans.set(plans);
    } catch {
      // Keep the server-mirrored fallback cards visible when billing is disabled.
    }

    const user = await this.auth.currentUser();
    if (this.destroyed) return;
    this.user.set(user);
    if (user) {
      const workspace = await this.loadBillingWorkspace();
      if (workspace) {
        try {
          this.subscription.set(await this.billing.getSubscription(workspace.id));
        } catch {
          // Checkout will show the actionable API error if the user selects a plan.
        }
      }
    }
    this.initializing.set(false);

    const requestedPlan = this.route.snapshot.queryParamMap.get('checkout');
    if (requestedPlan === 'starter' || requestedPlan === 'pro') {
      await this.beginCheckout(requestedPlan);
    }
  }

  private async loadBillingWorkspace(): Promise<MotifyWorkspace | null> {
    try {
      const workspaces = await this.billing.listWorkspaces();
      const workspace = workspaces.find((candidate) => candidate.kind === 'personal' && candidate.role === 'owner')
        ?? workspaces.find((candidate) => candidate.role === 'owner')
        ?? null;
      this.workspace.set(workspace);
      return workspace;
    } catch {
      return null;
    }
  }

  private async showPendingPayment(payment: BillingPayment): Promise<void> {
    this.payment.set(payment);
    this.checkoutState.set('pending');
    this.updateCountdown();
    if (payment.qr) {
      const { default: QRCode } = await import('qrcode');
      this.qrDataUrl.set(await QRCode.toDataURL(payment.qr, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#07080a', light: '#ffffff' },
      }));
    }
    this.countdownTimer = window.setInterval(() => this.updateCountdown(), 1_000);
    this.schedulePoll(1_000);
  }

  private schedulePoll(delay: number): void {
    this.pollTimer = window.setTimeout(() => void this.pollPayment(), delay);
  }

  private async pollPayment(): Promise<void> {
    const current = this.payment();
    if (!current?.id || this.destroyed || this.checkoutState() !== 'pending') return;
    try {
      const payment = await this.billing.getPayment(current.id);
      if (this.destroyed) return;
      this.payment.set(payment);
      this.pollingNotice.set('');
      if (payment.status === 'PAID') {
        this.stopPolling();
        this.checkoutState.set('paid');
        if (payment.subscription) this.subscription.set(payment.subscription);
        return;
      }
      if (payment.status === 'EXPIRED') {
        this.stopPolling();
        this.checkoutState.set('expired');
        return;
      }
      if (payment.status === 'FAILED') {
        this.stopPolling();
        this.checkoutState.set('failed');
        return;
      }
      this.schedulePoll(4_000);
    } catch {
      this.pollingNotice.set('Connection interrupted. We’ll keep checking for your payment.');
      this.schedulePoll(8_000);
    }
  }

  private updateCountdown(): void {
    const expiresAt = this.payment()?.expiresAt;
    if (!expiresAt) return;
    this.secondsRemaining.set(Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1_000)));
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearTimeout(this.pollTimer);
    if (this.countdownTimer !== undefined) window.clearInterval(this.countdownTimer);
    this.pollTimer = undefined;
    this.countdownTimer = undefined;
  }

  private openError(message: string): void {
    this.stopPolling();
    this.checkoutError.set(message);
    this.checkoutState.set('error');
  }

  private clearCheckoutQuery(): void {
    if (!this.route.snapshot.queryParamMap.has('checkout')) return;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { checkout: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private errorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) return fallback;
    const apiError = (error.error as { error?: { message?: string } } | null)?.error;
    return apiError?.message || fallback;
  }
}
