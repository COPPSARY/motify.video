import { jsPDF } from 'jspdf';
import { RECEIPT_SELLER } from '../config/receipt-seller';
import type { PaymentReceipt } from '../services/billing.service';
import { drawReceipt } from './receipt-pdf';

const receipt: PaymentReceipt = {
  paymentId: 'payment-1',
  mode: 'live',
  kind: 'PLAN',
  invoiceNumber: 'MTF-7Q2KX9P4LM',
  receiptNumber: '8A1F-9C03-BE7D',
  paidAt: '2026-10-15T08:00:00.000Z',
  currency: 'USD',
  billTo: { name: 'Prom Sereyreaksa', email: 'buyer@example.com' },
  paymentMethod: { type: 'Bakong KHQR', account: 'se•••@aclb', transactionHash: 'hash-1' },
  lineItems: [{
    description: 'Motify Pro · Monthly',
    period: { start: '2026-10-15T08:00:00.000Z', end: '2026-11-14T08:00:00.000Z' },
    details: ['300 credits'],
    quantity: 1, unitPrice: 20, amount: 20,
  }],
  subtotal: 20, discount: 0, total: 20, amountPaid: 20,
};

describe('drawReceipt', () => {
  it('draws a one-page receipt with its numbers, buyer and amounts', () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });

    drawReceipt(doc, receipt, RECEIPT_SELLER);
    const pdf = doc.output();

    expect(doc.getNumberOfPages()).toBe(1);
    for (const text of ['Receipt', '8A1F-9C03-BE7D', 'MTF-7Q2KX9P4LM', 'Prom Sereyreaksa', '$20.00 paid on October 15, 2026', 'Payment history']) {
      expect(pdf).toContain(`(${text})`);
    }
  });
});
