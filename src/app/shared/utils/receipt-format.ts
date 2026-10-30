import type { PaymentReceipt, ReceiptLineItem } from '../services/billing.service';

// Bakong payments settle in Cambodia, so a receipt shows the same dates wherever it is opened.
const RECEIPT_TIME_ZONE = 'Asia/Phnom_Penh';

/** Thin and narrow no-break spaces from Intl, as plain spaces, so the PDF's standard fonts can draw them. */
function plainSpaces(text: string): string {
  return text.replace(/[   ]/g, ' ');
}

export function formatReceiptMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

/** "October 15, 2026" */
export function formatReceiptDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: RECEIPT_TIME_ZONE }).format(new Date(value));
}

/** "Oct 15 – Nov 14, 2026" */
export function formatReceiptPeriod(period: NonNullable<ReceiptLineItem['period']>): string {
  const format = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: RECEIPT_TIME_ZONE });
  return plainSpaces(format.formatRange(new Date(period.start), new Date(period.end)));
}

/** The lines under a line item's description: its period, then credits and other details. */
/**
 * The discount rows under the subtotal: the plan's own discounts, then the promo code on a line of its own
 * ("Promo code NEWYEAR"). The same rows as the API's PDF and email (packages/receipts/receipt-format.ts).
 */
export function receiptDiscounts(receipt: Pick<PaymentReceipt, 'discount' | 'promoCode' | 'promoDiscount'>): { label: string; amount: number }[] {
  const promo = receipt.promoCode ? receipt.promoDiscount ?? 0 : 0;
  const other = Math.round((receipt.discount - promo) * 100) / 100;
  return [
    ...(other > 0 ? [{ label: 'Discount', amount: other }] : []),
    ...(promo > 0 ? [{ label: `Promo code ${receipt.promoCode}`, amount: promo }] : []),
  ];
}

export function receiptLineDetails(item: ReceiptLineItem): string[] {
  return [...(item.period ? [formatReceiptPeriod(item.period)] : []), ...item.details];
}

/** "Bakong KHQR - se•••@aclb" */
export function receiptPaymentMethod(receipt: PaymentReceipt): string {
  const { type, account } = receipt.paymentMethod;
  return account ? `${type} - ${account}` : type;
}

export function receiptFileName(receipt: PaymentReceipt): string {
  return `Receipt-${receipt.receiptNumber}.pdf`;
}
