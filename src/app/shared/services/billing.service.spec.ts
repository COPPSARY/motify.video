import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BillingService } from './billing.service';

describe('BillingService', () => {
  let billing: BillingService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    window.__MOTIFY_CONFIG__ = { motifyApiUrl: 'https://api.example.test' };
    billing = TestBed.inject(BillingService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    delete window.__MOTIFY_CONFIG__;
  });

  it('loads the public plan catalog from the backend', async () => {
    const result = billing.listPlans();
    const request = http.expectOne('https://api.example.test/v1/billing/plans');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeFalse();
    request.flush({ data: [{ id: 'starter', name: 'Starter', price: 10, currency: 'USD', periodDays: 30, credits: 150, available: true }] });
    await expectAsync(result).toBeResolvedTo([jasmine.objectContaining({ id: 'starter', price: 10 })]);
  });

  it('loads the public credit-pack catalog from the backend', async () => {
    const result = billing.listCreditPacks();
    const request = http.expectOne('https://api.example.test/v1/billing/credit-packs');
    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ data: [{ id: 'credits-65', name: '65 credits', price: 5, listPrice: 5, yearlyDiscount: 0, discount: 0, discountPercent: 0, currency: 'USD', credits: 65, firstPurchaseBonusPercent: 20, firstPurchaseBonusCredits: 13, bonusAvailable: true }] });
    await expectAsync(result).toBeResolvedTo([jasmine.objectContaining({ id: 'credits-65', credits: 65 })]);
  });

  it('creates a credentialed plan checkout with the session CSRF token', async () => {
    const result = billing.createCheckout('workspace-1', { plan: 'pro', interval: 'year' }, 'csrf-token');
    const request = http.expectOne('https://api.example.test/v1/workspaces/workspace-1/billing/payments');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    expect(request.request.headers.get('X-CSRF-Token')).toBe('csrf-token');
    expect(request.request.body).toEqual({ plan: 'pro', interval: 'year' });
    request.flush({ data: { id: 'payment-1', workspaceId: 'workspace-1', mode: 'live', kind: 'PLAN', plan: 'pro', interval: 'YEAR', creditPack: null, credits: 300, bonusCredits: 0, listAmount: 240, discount: 48, amount: 192, currency: 'USD', billNumber: 'MTF-TEST', status: 'PENDING', qr: '000201', expiresAt: new Date().toISOString(), paidAt: null, createdAt: new Date().toISOString() } });
    await expectAsync(result).toBeResolvedTo(jasmine.objectContaining({ id: 'payment-1', status: 'PENDING' }));
  });

  it('creates a credit-pack checkout using the backend pack id', async () => {
    const result = billing.createCheckout('workspace/one', { creditPack: 'credits-65' }, 'csrf-token');
    const request = http.expectOne('https://api.example.test/v1/workspaces/workspace%2Fone/billing/payments');
    expect(request.request.body).toEqual({ creditPack: 'credits-65' });
    request.flush({ data: { id: 'payment-2', workspaceId: 'workspace/one', mode: 'live', kind: 'CREDIT_PACK', plan: null, interval: null, creditPack: 'credits-65', credits: 65, bonusCredits: 13, listAmount: 5, discount: 0, amount: 5, currency: 'USD', billNumber: 'MTF-PACK', status: 'PENDING', qr: '000201', expiresAt: new Date().toISOString(), paidAt: null, createdAt: new Date().toISOString() } });
    await expectAsync(result).toBeResolvedTo(jasmine.objectContaining({ kind: 'CREDIT_PACK', credits: 65 }));
  });

  it('settles a sandbox checkout with CSRF protection', async () => {
    const result = billing.simulatePayment('payment/1', 'paid', 'csrf-token');
    const request = http.expectOne('https://api.example.test/v1/payments/payment%2F1/sandbox');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ outcome: 'paid' });
    expect(request.request.headers.get('X-CSRF-Token')).toBe('csrf-token');
    request.flush({ data: { id: 'payment/1', workspaceId: 'workspace-1', mode: 'sandbox', kind: 'PLAN', plan: 'pro', interval: 'MONTH', creditPack: null, credits: 300, bonusCredits: 0, listAmount: 20, discount: 0, amount: 20, currency: 'USD', billNumber: 'MTF-TEST', status: 'PAID', qr: null, expiresAt: new Date().toISOString(), paidAt: new Date().toISOString(), createdAt: new Date().toISOString(), subscription: { status: 'active', plan: 'pro', interval: 'MONTH', currentPeriodStart: new Date().toISOString(), currentPeriodEnd: new Date().toISOString() }, creditBalance: 350 } });
    await expectAsync(result).toBeResolvedTo(jasmine.objectContaining({ mode: 'sandbox', status: 'PAID', creditBalance: 350 }));
    expect(billing.subscription()?.plan).toBe('pro');
  });
});
