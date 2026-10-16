import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService return URL', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    window.__MOTIFY_CONFIG__ = { motifyApiUrl: 'https://api.example.test' };
  });

  afterEach(() => {
    http.verify();
    sessionStorage.removeItem('motify-pending-return-url');
    delete window.__MOTIFY_CONFIG__;
  });

  it('keeps an editor prompt in the Google callback URL', () => {
    const auth = TestBed.inject(AuthService);
    const returnPath = '/editor?prompt=Launch+video+%26+demo';
    auth.setPendingReturnUrl(returnPath);

    const googleUrl = new URL(auth.googleLoginUrl());
    const returnTo = new URL(googleUrl.searchParams.get('returnTo')!);

    expect(returnTo.origin).toBe(window.location.origin);
    expect(returnTo.pathname).toBe('/login');
    expect(returnTo.searchParams.get('returnUrl')).toBe(returnPath);
  });

  it('keeps a pending pricing checkout in the Google callback URL', () => {
    const auth = TestBed.inject(AuthService);
    const returnPath = '/pricing?checkout=pro';
    auth.setPendingReturnUrl(returnPath);

    const googleUrl = new URL(auth.googleLoginUrl());
    const returnTo = new URL(googleUrl.searchParams.get('returnTo')!);

    expect(returnTo.origin).toBe(window.location.origin);
    expect(returnTo.pathname).toBe('/login');
    expect(returnTo.searchParams.get('returnUrl')).toBe(returnPath);
  });

  it('resends a signup OTP to a normalized email address', async () => {
    const request = TestBed.inject(AuthService).resendSignupOtp(' DESIGNER@example.com ');

    const pending = http.expectOne('https://api.example.test/v1/auth/otp/send');
    expect(pending.request.body).toEqual({ email: 'designer@example.com' });
    expect(pending.request.withCredentials).toBeTrue();
    pending.flush(null, { status: 202, statusText: 'Accepted' });

    await request;
  });

  it('verifies an email OTP and stores the returned session', async () => {
    const auth = TestBed.inject(AuthService);
    const user = {
      id: 'user-1', email: 'designer@example.com', emailVerified: true,
      displayName: 'Designer', avatarUrl: null,
    };
    const verification = auth.verifyEmailOtp(' DESIGNER@example.com ', '12345678');

    const pending = http.expectOne('https://api.example.test/v1/auth/otp/verify');
    expect(pending.request.body).toEqual({ email: 'designer@example.com', token: '12345678' });
    pending.flush({ data: { verificationRequired: false, user, csrfToken: 'otp-csrf', newAccount: true } });

    await expectAsync(verification).toBeResolvedTo({ user, newAccount: true });
    expect(auth.user()).toEqual(user);
    expect(auth.csrfToken()).toBe('otp-csrf');
  });
});
