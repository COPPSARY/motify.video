import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { RECEIPT_SELLER } from '../../config/receipt-seller';
import type { PaymentReceipt, ReceiptLineItem } from '../../services/billing.service';
import {
  formatReceiptDate,
  formatReceiptMoney,
  receiptLineDetails,
  receiptPaymentMethod,
} from '../../utils/receipt-format';
import { downloadReceiptPdf } from '../../utils/receipt-pdf';

/** A paid Bakong payment's receipt, laid out like the PDF it downloads. */
@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payment-receipt.component.html',
  styleUrl: './payment-receipt.component.css',
})
export class PaymentReceiptComponent {
  @Input({ required: true }) receipt!: PaymentReceipt;

  readonly seller = RECEIPT_SELLER;
  readonly downloading = signal(false);
  readonly downloadError = signal('');

  money(amount: number): string {
    return formatReceiptMoney(amount, this.receipt.currency);
  }

  paidOn(): string {
    return formatReceiptDate(this.receipt.paidAt);
  }

  details(item: ReceiptLineItem): string[] {
    return receiptLineDetails(item);
  }

  paymentMethod(): string {
    return receiptPaymentMethod(this.receipt);
  }

  async download(): Promise<void> {
    if (this.downloading()) return;
    this.downloading.set(true);
    this.downloadError.set('');
    try {
      await downloadReceiptPdf(this.receipt, this.seller);
    } catch {
      this.downloadError.set('The PDF could not be created. Please try again.');
    } finally {
      this.downloading.set(false);
    }
  }
}
