import { HttpErrorResponse } from '@angular/common/http';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { AuthService, type MotifyUser } from '../../shared/services/auth.service';
import {
  BillingService,
  type BillingInterval,
  type BillingPayment,
  type BillingPlan,
  type CheckoutInterval,
  type CreditPack,
  type MotifyWorkspace,
  type Purchase,
  type SandboxOutcome,
  type WorkspaceSubscription,
} from '../../shared/services/billing.service';
import { SeoService } from '../../shared/services/seo.service';

type CheckoutState = 'idle' | 'confirming' | 'creating' | 'pending' | 'paid' | 'expired' | 'failed' | 'error';
type CatalogStatus = 'loading' | 'ready' | 'unavailable';
type PaymentMethodId = 'bakong-khqr';

interface CheckoutSelection {
  readonly purchase: Purchase;
  readonly kind: 'PLAN' | 'CREDIT_PACK';
  readonly label: string;
  readonly amount: number;
  readonly listAmount: number;
  readonly discount: number;
  readonly currency: 'USD';
  readonly credits: number;
  readonly bonusCredits: number;
  readonly periodDays: number | null;
  readonly interval: BillingInterval | null;
}

type KnownPlanId = 'starter' | 'pro' | 'studio';
const PLAN_IDS: readonly KnownPlanId[] = ['starter', 'pro', 'studio'];

function fallbackPlan(id: KnownPlanId, name: string, price: number, credits: number, available: boolean): BillingPlan {
  return {
    id, name, price, currency: 'USD', periodDays: 30, credits, creditsPerMonth: credits,
    yearDays: 365, discountPercent: 0, yearlyDiscountPercent: 20, available,
    month: { listPrice: price, yearlyDiscount: 0, discount: 0, price },
    year: { listPrice: price * 12, yearlyDiscount: price * 12 * 0.2, discount: 0, price: price * 12 * 0.8, credits: credits * 12 },
  };
}

const FALLBACK_PLANS: readonly BillingPlan[] = [
  fallbackPlan('starter', 'Starter', 10, 150, true),
  fallbackPlan('pro', 'Pro', 20, 300, true),
  fallbackPlan('studio', 'Studio', 50, 750, false),
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
  readonly planCatalogStatus = signal<CatalogStatus>('loading');
  readonly creditPacks = signal<readonly CreditPack[]>([]);
  readonly packCatalogStatus = signal<CatalogStatus>('loading');
  readonly user = signal<MotifyUser | null>(null);
  readonly workspaces = signal<readonly MotifyWorkspace[]>([]);
  readonly workspace = signal<MotifyWorkspace | null>(null);
  readonly subscription = signal<WorkspaceSubscription | null>(null);
  readonly initializing = signal(true);
  readonly checkoutState = signal<CheckoutState>('idle');
  readonly selection = signal<CheckoutSelection | null>(null);
  readonly payment = signal<BillingPayment | null>(null);
  readonly qrDataUrl = signal('');
  readonly secondsRemaining = signal(0);
  readonly checkoutError = signal('');
  readonly pollingNotice = signal('');
  readonly selectedPaymentMethod = signal<PaymentMethodId>('bakong-khqr');
  readonly billingInterval = signal<CheckoutInterval>('month');
  readonly simulating = signal(false);

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

  plan(id: KnownPlanId): BillingPlan {
    return this.plans().find((plan) => plan.id === id)
      ?? FALLBACK_PLANS.find((plan) => plan.id === id)!;
  }

  isActivePlan(id: KnownPlanId): boolean {
    return this.subscription()?.status === 'active' && this.subscription()?.plan === id;
  }

  planButtonLabel(id: KnownPlanId): string {
    if (this.planCatalogStatus() === 'loading') return 'Loading pricing…';
    if (this.planCatalogStatus() === 'unavailable') return 'Pricing unavailable';
    if (this.yearlyPlanBlocks(id)) return 'Available after current year';
    if (this.subscription()?.status === 'expired' && this.subscription()?.plan === id) return `Renew ${this.plan(id).name}`;
    if (this.isActivePlan(id) && this.subscription()?.interval === this.selectedBillingInterval()) return 'Extend plan';
    if (this.subscription()?.status === 'active') return 'Switch plan';
    return 'Select plan';
  }

  setBillingInterval(interval: CheckoutInterval): void {
    this.billingInterval.set(interval);
  }

  selectedBillingInterval(): BillingInterval {
    return this.billingInterval() === 'year' ? 'YEAR' : 'MONTH';
  }

  planQuote(id: KnownPlanId) {
    const plan = this.plan(id);
    return this.billingInterval() === 'year' ? plan.year : plan.month;
  }

  planDisplayPrice(id: KnownPlanId): number {
    const quote = this.planQuote(id);
    return this.billingInterval() === 'year' ? quote.price / 12 : quote.price;
  }

  planDisplayListPrice(id: KnownPlanId): number {
    const quote = this.planQuote(id);
    return this.billingInterval() === 'year' ? quote.listPrice / 12 : quote.listPrice;
  }

  planCredits(id: KnownPlanId): number {
    const plan = this.plan(id);
    return this.billingInterval() === 'year' ? plan.year.credits : plan.creditsPerMonth;
  }

  planPeriodLabel(id: KnownPlanId): string {
    const plan = this.plan(id);
    return this.billingInterval() === 'year' ? `${plan.yearDays} days` : `${plan.periodDays} days`;
  }

  canPurchasePlan(id: KnownPlanId): boolean {
    return this.plan(id).available && !this.yearlyPlanBlocks(id);
  }

  private yearlyPlanBlocks(id: KnownPlanId): boolean {
    const subscription = this.subscription();
    if (subscription?.status !== 'active' || subscription.interval !== 'YEAR') return false;
    return subscription.plan !== id || this.billingInterval() !== 'year';
  }

  subscriptionEnd(): string {
    const end = this.subscription()?.currentPeriodEnd;
    return end ? this.formatDate(end) : '';
  }

  subscriptionPlanName(): string {
    const id = this.subscription()?.plan;
    return id ? this.plans().find((plan) => plan.id === id)?.name ?? id : '';
  }

  countdownLabel(): string {
    const seconds = this.secondsRemaining();
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  }

  planCatalogMessage(): string {
    return this.planCatalogStatus() === 'loading' ? 'Loading pricing…' : 'Pricing unavailable';
  }

  formatMoney(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
  }

  eligibleWorkspaces(): readonly MotifyWorkspace[] {
    return this.workspaces().filter((workspace) => workspace.kind === 'personal' && workspace.role === 'owner');
  }

  async beginCheckout(planId: KnownPlanId): Promise<void> {
    if (this.initializing() || this.planCatalogStatus() !== 'ready') return;
    const plan = this.plan(planId);
    if (!this.canPurchasePlan(planId)) return;
    const quote = this.planQuote(planId);
    const interval = this.selectedBillingInterval();
    await this.beginPurchase({
      purchase: { plan: planId, interval: this.billingInterval() },
      kind: 'PLAN',
      label: `${plan.name} · ${interval === 'YEAR' ? 'Yearly' : 'Monthly'}`,
      amount: quote.price,
      listAmount: quote.listPrice,
      discount: quote.listPrice - quote.price,
      currency: plan.currency,
      credits: this.planCredits(planId),
      bonusCredits: 0,
      periodDays: interval === 'YEAR' ? plan.yearDays : plan.periodDays,
      interval,
    });
  }

  async beginCreditPackCheckout(pack: CreditPack): Promise<void> {
    await this.beginPurchase({
      purchase: { creditPack: pack.id },
      kind: 'CREDIT_PACK',
      label: pack.name,
      amount: pack.price,
      listAmount: pack.listPrice,
      discount: pack.discount,
      currency: pack.currency,
      credits: pack.credits,
      bonusCredits: pack.bonusAvailable === false ? 0 : pack.firstPurchaseBonusCredits,
      periodDays: null,
      interval: null,
    });
  }

  async confirmCheckout(): Promise<void> {
    const selection = this.selection();
    if (selection && this.selectedPaymentMethod() === 'bakong-khqr') await this.createCheckout(selection);
  }

  async simulateSandbox(outcome: SandboxOutcome): Promise<void> {
    const payment = this.payment();
    const csrfToken = this.auth.csrfToken();
    if (!payment?.id || payment.mode !== 'sandbox' || !csrfToken || this.simulating()) return;
    this.simulating.set(true);
    try {
      await this.handlePayment(await this.billing.simulatePayment(payment.id, outcome, csrfToken));
    } catch (error: unknown) {
      this.openError(this.errorMessage(error, 'The sandbox payment could not be simulated.'));
    } finally {
      this.simulating.set(false);
    }
  }

  closeCheckout(): void {
    this.stopPolling();
    this.checkoutState.set('idle');
    this.selection.set(null);
    this.payment.set(null);
    this.qrDataUrl.set('');
    this.checkoutError.set('');
    this.pollingNotice.set('');
    this.clearCheckoutQuery();
  }

  retryCheckout(): void {
    const selection = this.selection();
    this.stopPolling();
    this.payment.set(null);
    this.qrDataUrl.set('');
    if (selection) void this.createCheckout(selection);
  }

  stopBackdrop(event: MouseEvent): void {
    event.stopPropagation();
  }

  purchaseChangesActivePlan(): boolean {
    const selected = this.selection();
    const selectedPlan = this.selectedPlanId();
    const subscription = this.subscription();
    return !!selectedPlan && subscription?.status === 'active'
      && (subscription.plan !== selectedPlan || subscription.interval !== selected?.interval);
  }

  selectedPlanId(): string | null {
    const purchase = this.selection()?.purchase;
    return purchase && 'plan' in purchase ? purchase.plan : null;
  }

  paymentItemLabel(): string {
    const payment = this.payment();
    if (!payment) return this.selection()?.label ?? 'purchase';
    return payment.kind === 'PLAN' && payment.plan
      ? this.plans().find((plan) => plan.id === payment.plan)?.name ?? payment.plan
      : `${payment.credits} credits`;
  }

  totalPackCredits(payment: BillingPayment): number {
    return payment.credits + payment.bonusCredits;
  }

  paymentCreditLabel(payment: BillingPayment): string {
    if (payment.kind === 'PLAN' && payment.interval === 'YEAR') return `${payment.credits} credits each month`;
    return `${this.totalPackCredits(payment)} credits`;
  }

  private async beginPurchase(selection: CheckoutSelection): Promise<void> {
    let currentUser = this.user();
    if (!currentUser) {
      currentUser = await this.auth.currentUser();
      this.user.set(currentUser);
    }
    if (!currentUser) {
      const query = 'plan' in selection.purchase
        ? `checkout=${selection.purchase.plan}&interval=${selection.purchase.interval}`
        : `pack=${encodeURIComponent(selection.purchase.creditPack)}`;
      const returnUrl = `/pricing?${query}`;
      this.auth.setPendingReturnUrl(returnUrl);
      await this.router.navigate(['/signup'], { queryParams: { returnUrl } });
      return;
    }

    if (!this.workspaces().length) await this.loadBillingWorkspaces();
    const eligible = this.eligibleWorkspaces();
    if (!eligible.length) {
      this.selection.set(selection);
      this.openError('We could not find your personal workspace. Open Motify once, then try again.');
      return;
    }

    this.selection.set(selection);
    if (!this.workspace() || !eligible.some((candidate) => candidate.id === this.workspace()?.id)) {
      this.workspace.set(this.preferredWorkspace(eligible));
      await this.refreshSubscription();
    }
    this.checkoutError.set('');
    this.selectedPaymentMethod.set('bakong-khqr');
    this.payment.set(null);
    this.checkoutState.set('confirming');
  }

  private async createCheckout(selection: CheckoutSelection): Promise<void> {
    const workspace = this.workspace();
    if (!workspace || !this.eligibleWorkspaces().some((candidate) => candidate.id === workspace.id)) {
      this.openError('Choose an eligible workspace before continuing.');
      return;
    }
    const csrfToken = this.auth.csrfToken();
    if (!csrfToken) {
      this.openError('Your session needs to be refreshed. Sign in again and retry the purchase.');
      return;
    }

    this.checkoutState.set('creating');
    this.checkoutError.set('');
    try {
      const payment = await this.billing.createCheckout(workspace.id, selection.purchase, csrfToken);
      await this.showPendingPayment(payment);
      this.clearCheckoutQuery();
    } catch (error: unknown) {
      this.openError(this.errorMessage(error, 'We could not start the Bakong checkout. Please try again.'));
    }
  }

  private async initialize(): Promise<void> {
    await Promise.all([this.loadPlans(), this.loadCreditPacks()]);

    const user = await this.auth.currentUser();
    if (this.destroyed) return;
    this.user.set(user);
    if (user) {
      await this.loadBillingWorkspaces();
      await this.refreshSubscription();
      if (this.subscription()?.interval === 'YEAR' && !this.route.snapshot.queryParamMap.has('interval')) {
        this.billingInterval.set('year');
      }
    }
    this.initializing.set(false);

    const requestedPlan = this.route.snapshot.queryParamMap.get('checkout');
    const requestedInterval = this.route.snapshot.queryParamMap.get('interval');
    if (requestedInterval === 'year' || requestedInterval === 'month') this.billingInterval.set(requestedInterval);
    if (this.isPlanId(requestedPlan) && this.planCatalogStatus() === 'ready' && this.canPurchasePlan(requestedPlan)) {
      await this.beginCheckout(requestedPlan);
      return;
    }
    const requestedPack = this.route.snapshot.queryParamMap.get('pack');
    const pack = this.creditPacks().find((candidate) => candidate.id === requestedPack);
    if (pack) await this.beginCreditPackCheckout(pack);
  }

  private async loadPlans(): Promise<void> {
    try {
      const plans = await this.billing.listPlans();
      if (PLAN_IDS.every((id) => plans.some((plan) => plan.id === id))) {
        this.plans.set(plans);
        this.planCatalogStatus.set('ready');
      } else {
        this.planCatalogStatus.set('unavailable');
      }
    } catch {
      this.planCatalogStatus.set('unavailable');
    }
  }

  private async loadCreditPacks(): Promise<void> {
    try {
      this.creditPacks.set(await this.billing.listCreditPacks());
      this.packCatalogStatus.set('ready');
    } catch {
      this.packCatalogStatus.set('unavailable');
    }
  }

  private async loadBillingWorkspaces(): Promise<void> {
    try {
      const workspaces = await this.billing.listWorkspaces();
      this.workspaces.set(workspaces);
      if (!this.workspace() || !workspaces.some((candidate) => candidate.id === this.workspace()?.id)) {
        this.workspace.set(this.preferredWorkspace(workspaces));
        await this.refreshSubscription();
      }
    } catch {
      this.workspaces.set([]);
      this.workspace.set(null);
    }
  }

  private preferredWorkspace(workspaces: readonly MotifyWorkspace[]): MotifyWorkspace | null {
    return workspaces.find((candidate) => candidate.kind === 'personal' && candidate.role === 'owner')
      ?? null;
  }

  private async refreshSubscription(): Promise<void> {
    const workspace = this.workspace();
    if (!workspace) {
      this.subscription.set(null);
      return;
    }
    try {
      this.subscription.set(await this.billing.getSubscription(workspace.id));
    } catch {
      this.subscription.set(null);
    }
  }

  private async showPendingPayment(payment: BillingPayment): Promise<void> {
    const selected = this.selection();
    this.payment.set(payment);
    this.checkoutState.set('pending');
    this.updateCountdown();
    if (selected && (selected.amount !== payment.amount || selected.credits !== payment.credits)) {
      this.pollingNotice.set('Resuming an existing checkout at the amount and credit grant shown on this QR.');
    } else {
      this.pollingNotice.set('');
    }
    if (payment.qr) {
      const { default: QRCode } = await import('qrcode');
      this.qrDataUrl.set(await QRCode.toDataURL(payment.qr, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#070b18', light: '#ffffff' },
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
      await this.handlePayment(await this.billing.getPayment(current.id));
    } catch {
      this.pollingNotice.set('Connection interrupted. We’ll keep checking for your payment.');
      this.schedulePoll(8_000);
    }
  }

  private async handlePayment(payment: BillingPayment): Promise<void> {
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
    if (!this.route.snapshot.queryParamMap.has('checkout') && !this.route.snapshot.queryParamMap.has('pack')) return;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { checkout: null, pack: null, interval: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private isPlanId(value: string | null): value is KnownPlanId {
    return value !== null && PLAN_IDS.includes(value as KnownPlanId);
  }

  private errorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) return fallback;
    const apiError = (error.error as { error?: { message?: string } } | null)?.error;
    return apiError?.message || fallback;
  }
}
