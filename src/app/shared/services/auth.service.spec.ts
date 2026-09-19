import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService return URL', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    window.__MOTIFY_CONFIG__ = { motifyApiUrl: 'https://api.example.test' };
  });

  afterEach(() => {
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
});
