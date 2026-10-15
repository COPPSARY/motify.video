import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  constructor() {
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
}
