import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { editorUrlForReturnPath } from './shared/config/runtime-config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly auth = inject(AuthService);

  /** True while a navigation has been pending long enough to be noticeable. */
  readonly navigating = signal(false);

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) this.trackNavigation();

    afterNextRender(() => {
      void this.auth.currentUser().then((user) => {
        if (!user) return;
        // The API adds newAccount=1 to the redirect only for the sign-in that created the account.
        const newAccount = new URLSearchParams(window.location.search).get('newAccount') === '1';
        const returnUrl = this.auth.consumePendingReturnUrl() ?? (newAccount ? '/editor' : null);
        if (!returnUrl || !returnUrl.startsWith('/editor')) return;
        window.location.href = editorUrlForReturnPath(returnUrl, newAccount);
      });
    });
  }

  /** Shows the loading bar when a click does not land on its page within a beat. */
  private trackNavigation(): void {
    let pending: ReturnType<typeof setTimeout> | undefined;
    const subscription = inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(pending);
        pending = setTimeout(() => this.navigating.set(true), 120);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        clearTimeout(pending);
        this.navigating.set(false);
      }
    });
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(pending);
      subscription.unsubscribe();
    });
  }
}
