import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideArrowRight } from '@lucide/angular';
import { AuthService } from '../../shared/services/auth.service';
import { SeoService } from '../../shared/services/seo.service';
import { editorUrlForReturnPath } from '../../shared/config/runtime-config';

type AuthMode = 'signin' | 'signup';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideArrowRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly auth = inject(AuthService);

  readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/editor';
  readonly hasPendingPrompt = this.returnUrl.startsWith('/editor?') &&
    new URL(this.returnUrl, 'https://motify.invalid').searchParams.has('prompt');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly mode = signal<AuthMode>(
    this.route.snapshot.data['mode'] === 'signup' ? 'signup' : 'signin',
  );
  /** Set once the verification mail is on its way, which replaces the form. */
  readonly verificationSentTo = signal('');
  email = '';
  password = '';

  constructor() {
    const signingUp = this.mode() === 'signup';
    inject(SeoService).apply({
      title: signingUp ? 'Sign up for Motify' : 'Log in to Motify',
      description: signingUp
        ? 'Create a Motify account to generate HTML, CSS, and GSAP motion graphics from a prompt.'
        : 'Sign in to create and refine HTML, CSS, and GSAP motion graphics with Motify.',
      path: signingUp ? '/signup' : '/login',
      robots: 'noindex, nofollow',
    });

    afterNextRender(() => {
      void this.auth.currentUser().then((user) => {
        if (user && this.returnUrl.startsWith('/editor')) {
          window.location.href = editorUrlForReturnPath(this.returnUrl);
        }
      });
    });
  }

  setMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.error.set('');
    this.verificationSentTo.set('');
  }

  async continueToMotify(): Promise<void> {
    if (!this.email || !this.password) {
      this.error.set('Enter your email and password to continue.');
      return;
    }
    if (this.mode() === 'signup' && this.password.length < 8) {
      this.error.set('Choose a password of at least 8 characters.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      if (this.mode() === 'signup') {
        this.auth.setPendingReturnUrl(this.returnUrl);
        await this.auth.signUp(this.email, this.password);
        this.verificationSentTo.set(this.email.trim());
        this.password = '';
        this.loading.set(false);
        return;
      }
      await this.auth.login(this.email, this.password);
    } catch (error: unknown) {
      this.error.set(this.messageFor(error));
      this.loading.set(false);
      return;
    }
    if (this.returnUrl.startsWith('/editor')) {
      window.location.href = editorUrlForReturnPath(this.returnUrl);
      return;
    }
    void this.router.navigateByUrl(this.returnUrl.startsWith('/') ? this.returnUrl : '/');
  }

  loginWithGoogle(): void {
    this.auth.setPendingReturnUrl(this.returnUrl);
    window.location.href = this.auth.googleLoginUrl();
  }

  private messageFor(error: unknown): string {
    const code =
      error instanceof HttpErrorResponse
        ? (error.error as { error?: { code?: string; message?: string } } | null)?.error
        : undefined;
    // An address that already has an account is a wrong-form mistake, not a
    // failure: send the user to the sign-in tab rather than a dead end.
    if (code?.code === 'ACCOUNT_ALREADY_EXISTS') {
      this.mode.set('signin');
      return 'That account already exists. Sign in instead.';
    }
    if (code?.message) return code.message;
    return this.mode() === 'signup'
      ? 'We could not create your account. Check your details and try again.'
      : 'We could not sign you in. Check your details and try again.';
  }
}
