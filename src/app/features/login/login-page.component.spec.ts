import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { SeoService } from '../../shared/services/seo.service';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent OTP flow', () => {
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    auth = Object.assign(
      jasmine.createSpyObj<AuthService>('AuthService', [
        'currentUser', 'signUp', 'login', 'resendSignupOtp', 'verifyEmailOtp',
        'setPendingReturnUrl', 'googleLoginUrl',
      ]),
      { user: signal(null), sessionResolved: signal(true) },
    );
    auth.currentUser.and.resolveTo(null);
    auth.signUp.and.resolveTo(null);
    auth.resendSignupOtp.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { mode: 'signup' },
              queryParamMap: { get: (key: string) => key === 'returnUrl' ? '/pricing' : null },
            },
          },
        },
        { provide: SeoService, useValue: jasmine.createSpyObj<SeoService>('SeoService', ['apply']) },
      ],
    }).compileComponents();
  });

  it('shows the OTP form when signup requires verification', async () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance;
    component.email = 'designer@example.com';
    component.password = 'secret123';

    await component.continueToMotify();
    fixture.detectChanges();

    expect(component.verificationSentTo()).toBe('designer@example.com');
    expect(fixture.nativeElement.querySelector('input[autocomplete="one-time-code"]')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Verify email');
  });

  it('verifies a valid OTP and continues to the requested page', async () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance;
    const user = {
      id: 'user-1', email: 'designer@example.com', emailVerified: true,
      displayName: 'Designer', avatarUrl: null,
    };
    auth.verifyEmailOtp.and.resolveTo({ user, newAccount: true });
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
    component.verificationSentTo.set(user.email);
    component.otpCode = '12345678';

    await component.verifyOtp();

    expect(auth.verifyEmailOtp).toHaveBeenCalledWith(user.email, '12345678');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/pricing');
  });
});
