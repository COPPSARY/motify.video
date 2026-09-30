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

  it('creates a credentialed checkout with the session CSRF token', async () => {
    const result = billing.createCheckout('workspace-1', 'pro', 'csrf-token');
    const request = http.expectOne('https://api.example.test/v1/workspaces/workspace-1/billing/payments');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    expect(request.request.headers.get('X-CSRF-Token')).toBe('csrf-token');
    expect(request.request.body).toEqual({ plan: 'pro' });
    request.flush({ data: { id: 'payment-1', workspaceId: 'workspace-1', plan: 'pro', amount: 20, currency: 'USD', billNumber: 'MTF-TEST', status: 'PENDING', qr: '000201', expiresAt: new Date().toISOString(), paidAt: null, createdAt: new Date().toISOString() } });
    await expectAsync(result).toBeResolvedTo(jasmine.objectContaining({ id: 'payment-1', status: 'PENDING' }));
  });
});
