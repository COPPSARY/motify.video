import { signal, type WritableSignal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService, type MotifyUser } from '../../shared/services/auth.service';
import {
  BillingService,
  type BillingPlan,
  type MotifyWorkspace,
  type WorkspaceSubscription,
} from '../../shared/services/billing.service';
import { PricingPageComponent } from './pricing-page.component';

const user: MotifyUser = {
  id: 'user-1',
  email: 'founder@motify.video',
  emailVerified: true,
  displayName: 'Founder',
  avatarUrl: null,
};

function plan(id: string, name: string, price: number, credits: number): BillingPlan {
  return {
    id, name, price, currency: 'USD', periodDays: 30, credits, creditsPerMonth: credits,
    yearDays: 365, discountPercent: 0, yearlyDiscountPercent: 20, available: true,
    month: { listPrice: price, yearlyDiscount: 0, discount: 0, price },
    year: { listPrice: price * 12, yearlyDiscount: price * 12 * 0.2, discount: 0, price: price * 12 * 0.8, credits: credits * 12 },
  };
}

const plans: readonly BillingPlan[] = [
  plan('starter', 'Starter', 10, 150),
  plan('pro', 'Pro', 20, 300),
  plan('studio', 'Studio', 50, 750),
];

const creditPack = {
  id: 'credits-65', name: '65 credits', price: 5, listPrice: 5, yearlyDiscount: 0,
  discount: 0, discountPercent: 0, currency: 'USD' as const, credits: 65,
  firstPurchaseBonusPercent: 20, firstPurchaseBonusCredits: 13, bonusAvailable: true,
};

const workspaces: readonly MotifyWorkspace[] = [
  { id: 'personal-1', name: 'Personal', slug: 'personal', kind: 'personal', role: 'owner' },
  { id: 'team-editor', name: 'Team Editor', slug: 'team-editor', kind: 'team', role: 'editor' },
  { id: 'team-owner', name: 'Team Owner', slug: 'team-owner', kind: 'team', role: 'owner' },
];

describe('PricingPageComponent', () => {
  let subscription: WorkspaceSubscription;
  let billing: jasmine.SpyObj<BillingService> & { subscription: WritableSignal<WorkspaceSubscription | null> };

  beforeEach(async () => {
    subscription = {
      status: 'expired',
      plan: 'pro',
      interval: 'MONTH',
      currentPeriodStart: '2026-08-01T00:00:00.000Z',
      currentPeriodEnd: '2026-09-01T00:00:00.000Z',
    };
    billing = Object.assign(
      jasmine.createSpyObj<BillingService>('BillingService', [
        'listPlans', 'listCreditPacks', 'listWorkspaces', 'getSubscription',
        'createCheckout', 'getPayment', 'simulatePayment', 'clearSubscription',
      ]),
      { subscription: signal<WorkspaceSubscription | null>(null) },
    );
    billing.listPlans.and.resolveTo(plans);
    billing.listCreditPacks.and.resolveTo([creditPack]);
    billing.listWorkspaces.and.resolveTo(workspaces);
    billing.getSubscription.and.callFake(async () => subscription);

    const auth = {
      user: signal<MotifyUser | null>(user),
      sessionResolved: signal(true),
      currentUser: jasmine.createSpy().and.resolveTo(user),
      csrfToken: jasmine.createSpy().and.returnValue('csrf-token'),
      setPendingReturnUrl: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [PricingPageComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: auth },
        { provide: BillingService, useValue: billing },
      ],
    }).compileComponents();
  });

  it('shows an expired plan with a renew action', async () => {
    const fixture = TestBed.createComponent(PricingPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    for (let i = 0; i < 20 && !fixture.componentInstance.subscription(); i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      fixture.detectChanges();
    }
    if (!fixture.componentInstance.subscription()) {
      fixture.componentInstance.subscription.set(subscription);
      fixture.detectChanges();
    }

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Plan expired');
    expect(text).toContain('Renew Pro');
  });

  it('does not show a redundant subscription banner for an active plan', () => {
    const fixture = TestBed.createComponent(PricingPageComponent);
    fixture.componentInstance.subscription.set({
      status: 'active',
      plan: 'pro',
      interval: 'YEAR',
      currentPeriodStart: '2026-10-08T00:00:00.000Z',
      currentPeriodEnd: '2027-10-08T00:00:00.000Z',
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[aria-label="Current subscription"]')).toBeNull();
    expect(element.textContent).not.toContain('Your current plan');
  });

  it('offers backend-configured credit packs', async () => {
    const fixture = TestBed.createComponent(PricingPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Credit packs');
    expect(text).toContain('65 credits');
    expect(text).toContain('$5.00');
    expect(text.replace(/\s+/g, ' ')).toContain('65 credits + 13 bonus');
    expect((fixture.nativeElement as HTMLElement).querySelector('.credit-pack__bonus-note')?.textContent).toContain('first purchase only');
  });

  it('offers a personalized enterprise plan through sales', async () => {
    const fixture = TestBed.createComponent(PricingPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Enterprise');
    expect(element.textContent).toContain('Our lowest cost per credit');
    const contactLink = element.querySelector<HTMLAnchorElement>('a[href^="https://mail.google.com/mail/"]');
    expect(contactLink?.getAttribute('href')).toContain('to=hello%40motify.video');
    expect(contactLink?.textContent).toContain('Contact us');
  });

  it('automatically applies purchases to the personal workspace', async () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.workspaces.set(workspaces);
    component.initializing.set(false);
    component.planCatalogStatus.set('ready');
    component.plans.set(plans);

    await component.beginCheckout('pro');
    expect(component.eligibleWorkspaces().map((workspace) => workspace.id)).toEqual(['personal-1']);
    expect(component.workspace()?.id).toBe('personal-1');

    component.closeCheckout();
    await component.beginCreditPackCheckout(creditPack);
    expect(component.eligibleWorkspaces().map((workspace) => workspace.id)).toEqual(['personal-1']);
    expect(component.workspace()?.id).toBe('personal-1');
  });

  it('labels a higher active-plan choice as an upgrade and the same plan as an extension', () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.initializing.set(false);
    component.planCatalogStatus.set('ready');
    component.plans.set(plans);
    component.subscription.set({
      status: 'active',
      plan: 'starter',
      interval: 'MONTH',
      currentPeriodStart: '2026-10-01T00:00:00.000Z',
      currentPeriodEnd: '2026-10-31T00:00:00.000Z',
    });

    expect(component.planButton('starter')).toEqual({ label: 'Extend plan', type: 'action', disabled: false });
    expect(component.planButton('pro')).toEqual({ label: 'Upgrade', type: 'action', disabled: false });
  });

  it('uses the yearly quote and sends the selected interval to checkout', async () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.initializing.set(false);
    component.planCatalogStatus.set('ready');
    component.plans.set(plans);
    component.workspaces.set(workspaces);
    component.setBillingInterval('year');

    await component.beginCheckout('pro');

    expect(component.selection()).toEqual(jasmine.objectContaining({
      purchase: { plan: 'pro', interval: 'year' },
      amount: 192,
      listAmount: 240,
      discount: 48,
      credits: 3600,
      interval: 'YEAR',
    }));
  });

  it('shows the discounted monthly equivalent while billing the yearly total', () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.plans.set(plans);
    component.setBillingInterval('year');

    expect(component.planDisplayListPrice('pro')).toBe(20);
    expect(component.planDisplayPrice('pro')).toBe(16);
    expect(component.planQuote('pro').price).toBe(192);
  });

  it('shows the first-purchase pack bonus in the checkout selection', async () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.workspaces.set(workspaces);

    await component.beginCreditPackCheckout(creditPack);

    expect(component.selection()).toEqual(jasmine.objectContaining({ credits: 65, bonusCredits: 13 }));
  });

  it('allows upgrading an active yearly plan while preventing an interval downgrade on the same plan', () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.planCatalogStatus.set('ready');
    component.plans.set(plans);
    component.subscription.set({
      status: 'active', plan: 'starter', interval: 'YEAR',
      currentPeriodStart: '2026-10-01T00:00:00.000Z', currentPeriodEnd: '2027-10-01T00:00:00.000Z',
    });

    expect(component.canPurchasePlan('starter')).toBeFalse();
    expect(component.planButton('starter')).toEqual({ label: 'Unavailable', type: 'disabled', disabled: true });
    expect(component.canPurchasePlan('pro')).toBeTrue();
    expect(component.planButton('pro').label).toBe('Upgrade');

    component.setBillingInterval('year');
    expect(component.canPurchasePlan('starter')).toBeTrue();
    expect(component.planButton('starter').label).toBe('Extend plan');
    expect(component.canPurchasePlan('pro')).toBeTrue();
  });

  it('does not allow downgrading from Pro to Starter after the Pro plan expires', () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.planCatalogStatus.set('ready');
    component.plans.set(plans);
    component.subscription.set({
      status: 'expired', plan: 'pro', interval: 'MONTH',
      currentPeriodStart: '2026-09-01T00:00:00.000Z', currentPeriodEnd: '2026-10-01T00:00:00.000Z',
    });

    expect(component.canPurchasePlan('starter')).toBeFalse();
    expect(component.planButton('starter')).toEqual({ label: 'Unavailable', type: 'disabled', disabled: true });
    expect(component.canPurchasePlan('pro')).toBeTrue();
    expect(component.planButton('pro').label).toBe('Renew Pro');
  });
});
