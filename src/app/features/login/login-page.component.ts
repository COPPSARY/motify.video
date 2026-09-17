import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideArrowRight } from '@lucide/angular';
import { AuthService } from '../../shared/services/auth.service';
import { SeoService } from '../../shared/services/seo.service';
import { editorUrlForReturnPath } from '../../shared/config/runtime-config';

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

  readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  readonly loading = signal(false);
  readonly error = signal('');
  email = '';
  password = '';

  constructor() {
    inject(SeoService).apply({
      title: 'Log in to Motify',
      description: 'Sign in to create and refine HTML, CSS, and GSAP motion graphics with Motify.',
      path: '/login',
      robots: 'noindex, nofollow',
    });
  }

  async continueToMotify(): Promise<void> {
    if (!this.email || !this.password) {
      this.error.set('Enter your email and password to continue.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.login(this.email, this.password);
    } catch {
      this.error.set('We could not sign you in. Check your details and try again.');
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
}
