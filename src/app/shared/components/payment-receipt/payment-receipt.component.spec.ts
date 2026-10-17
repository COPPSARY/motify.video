import { TestBed } from '@angular/core/testing';
import type { PaymentReceipt } from '../../services/billing.service';
import { PaymentReceiptComponent } from './payment-receipt.component';

const base: Omit<PaymentReceipt, 'kind' | 'lineItems' | 'subtotal' | 'discount' | 'total' | 'amountPaid'> = {
  paymentId: 'payment-1',
  mode: 'live',
  invoiceNumber: 'MTF-7Q2KX9P4LM',
  receiptNumber: '8A1F-9C03-BE7D',
  paidAt: '2026-10-15T08:00:00.000Z',
  currency: 'USD',
  billTo: { name: 'Prom Sereyreaksa', email: 'buyer@example.com' },
  paymentMethod: { type: 'Bakong KHQR', account: 'se•••@aclb', transactionHash: 'hash-1' },
};

function render(receipt: PaymentReceipt): HTMLElement {
  const fixture = TestBed.createComponent(PaymentReceiptComponent);
  fixture.componentInstance.receipt = receipt;
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('PaymentReceiptComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PaymentReceiptComponent] }).compileComponents();
  });

  it('renders a yearly plan with its period, discount and payer', () => {
    const element = render({
      ...base,
      kind: 'PLAN',
      lineItems: [{
        description: 'Motify Pro · Yearly',
        period: { start: '2026-10-15T08:00:00.000Z', end: '2027-10-15T08:00:00.000Z' },
        details: ['300 credits each month'],
        quantity: 1, unitPrice: 240, amount: 240,
      }],
      subtotal: 240, discount: 48, total: 192, amountPaid: 192,
    });
    const text = element.textContent ?? '';

    expect(text).toContain('Receipt number');
    expect(text).toContain('8A1F-9C03-BE7D');
    expect(text).toContain('$192.00 paid on October 15, 2026');
    expect(text).toContain('Motify Pro · Yearly');
    expect(text).toContain('Oct 15, 2026 – Oct 15, 2027');
    expect(text).toContain('-$48.00');
    expect(text).toContain('Bakong KHQR - se•••@aclb');
    expect(text).toContain('Prom Sereyreaksa');
    expect(element.querySelector('.receipt__sandbox')).toBeNull();
  });

  it('renders a credit pack with its bonus line and marks sandbox receipts', () => {
    const element = render({
      ...base,
      mode: 'sandbox',
      kind: 'CREDIT_PACK',
      lineItems: [
        { description: 'Motify credit pack · 135 credits', period: null, details: [], quantity: 1, unitPrice: 10, amount: 10 },
        { description: 'First-purchase bonus', period: null, details: ['+27 credits'], quantity: 1, unitPrice: 0, amount: 0 },
      ],
      subtotal: 10, discount: 0, total: 10, amountPaid: 10,
    });
    const rows = element.querySelectorAll('.receipt__items tbody tr');

    expect(rows.length).toBe(2);
    expect(rows[1].textContent).toContain('+27 credits');
    expect(element.textContent).not.toContain('Discount');
    expect(element.querySelector('.receipt__sandbox')).not.toBeNull();
    expect(element.querySelector('.receipt-actions__download')?.textContent).toContain('Download PDF');
  });
});
