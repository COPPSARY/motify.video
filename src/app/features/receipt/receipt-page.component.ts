import { HttpErrorResponse } from '@angular/common/http';
import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../landing-page/components/footer/footer.component';
import { NavbarComponent } from '../landing-page/components/navbar/navbar.component';
import { PaymentReceiptComponent } from '../../shared/components/payment-receipt/payment-receipt.component';
import { AuthService } from '../../shared/services/auth.service';
import { BillingService, type PaymentReceipt } from '../../shared/services/billing.service';
import { SeoService } from '../../shared/services/seo.service';

type ReceiptState = 'loading' | 'ready' | 'not-found' | 'not-paid' | 'error';

/**
 * A paid payment's receipt at `/receipt?payment=<id>`. The id is a query parameter so the
 * one prerendered page serves every receipt; the receipt itself loads in the browser.
 */
@Component({
  selector: 'app-receipt-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, PaymentReceiptComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './receipt-page.component.html',
  styleUrl: './receipt-page.component.css',
})
export class ReceiptPageComponent {
  private readonly auth = inject(AuthService);
  private readonly billing = inject(BillingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly state = signal<ReceiptState>('loading');
  readonly receipt = signal<PaymentReceipt | null>(null);

  constructor() {
    inject(SeoService).apply({
      title: 'Receipt | Motify',
      description: 'Your Motify payment receipt.',
      path: '/receipt',
      robots: 'noindex, nofollow',
    });
    afterNextRender(() => void this.load());
  }

  private async load(): Promise<void> {
    const paymentId = this.route.snapshot.queryParamMap.get('payment');
    if (!paymentId) {
      this.state.set('not-found');
      return;
    }
    if (!(await this.auth.currentUser())) {
      const returnUrl = `/receipt?payment=${encodeURIComponent(paymentId)}`;
      this.auth.setPendingReturnUrl(returnUrl);
      await this.router.navigate(['/login'], { queryParams: { returnUrl } });
      return;
    }
    try {
      this.receipt.set(await this.billing.getReceipt(paymentId));
      this.state.set('ready');
    } catch (error: unknown) {
      const status = error instanceof HttpErrorResponse ? error.status : 0;
      this.state.set(status === 404 || status === 400 ? 'not-found' : status === 409 ? 'not-paid' : 'error');
    }
  }
}
