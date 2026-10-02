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

const plans: readonly BillingPlan[] = [
  { id: 'starter', name: 'Starter', price: 10, currency: 'USD', periodDays: 30, credits: 150, available: true },
  { id: 'pro', name: 'Pro', price: 20, currency: 'USD', periodDays: 30, credits: 300, available: true },
  { id: 'studio', name: 'Studio', price: 50, currency: 'USD', periodDays: 30, credits: 750, available: true },
];

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
    billing.listCreditPacks.and.resolveTo([
      { id: 'credits-65', price: 5, currency: 'USD', credits: 65 },
    ]);
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
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Plan expired');
    expect(text).toContain('Renew Pro');
  });

  it('uses the backend economics for complete-video estimates', () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.plans.set(plans);

    expect(component.estimatedVideos('starter')).toBe(5);
    expect(component.estimatedVideos('pro')).toBe(10);
    expect(component.estimatedVideos('studio')).toBe(25);
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
  });

  it('allows only owner workspaces for plan purchases and any membership for packs', async () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.workspaces.set(workspaces);
    component.initializing.set(false);
    component.planCatalogStatus.set('ready');
    component.plans.set(plans);

    await component.beginCheckout('pro');
    expect(component.eligibleWorkspaces().map((workspace) => workspace.id)).toEqual(['personal-1', 'team-owner']);

    component.closeCheckout();
    await component.beginCreditPackCheckout({ id: 'credits-65', price: 5, currency: 'USD', credits: 65 });
    expect(component.eligibleWorkspaces().map((workspace) => workspace.id)).toEqual(['personal-1', 'team-editor', 'team-owner']);
  });

  it('labels an active-plan change as a switch and the same plan as an extension', () => {
    const component = TestBed.createComponent(PricingPageComponent).componentInstance;
    component.planCatalogStatus.set('ready');
    component.plans.set(plans);
    component.subscription.set({
      status: 'active',
      plan: 'starter',
      currentPeriodStart: '2026-10-01T00:00:00.000Z',
      currentPeriodEnd: '2026-10-31T00:00:00.000Z',
    });

    expect(component.planButtonLabel('starter')).toBe('Extend plan');
    expect(component.planButtonLabel('pro')).toBe('Switch plan');
  });
});
