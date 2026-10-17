import type { jsPDF } from 'jspdf';
import type { ReceiptSeller } from '../config/receipt-seller';
import type { PaymentReceipt } from '../services/billing.service';
import {
  formatReceiptDate,
  formatReceiptMoney,
  receiptFileName,
  receiptLineDetails,
  receiptPaymentMethod,
} from './receipt-format';

// US Letter in points, laid out like the reference receipt.
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LEFT = 36;
const RIGHT = PAGE_WIDTH - LEFT;
const INK = '#1a1a1a';
const MUTED = '#6b6b6b';
const RULE = '#e3e3e3';

/** Builds the receipt as a vector PDF (selectable text) and saves it as `Receipt-<number>.pdf`. */
export async function downloadReceiptPdf(receipt: PaymentReceipt, seller: ReceiptSeller): Promise<void> {
  // Loaded on click only, like the KHQR code generator, so jsPDF stays out of the main bundle.
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  drawReceipt(doc, receipt, seller);
  doc.save(receiptFileName(receipt));
}

export function drawReceipt(doc: jsPDF, receipt: PaymentReceipt, seller: ReceiptSeller): void {
  const money = (amount: number) => formatReceiptMoney(amount, receipt.currency);
  const paidOn = formatReceiptDate(receipt.paidAt);
  doc.setProperties({ title: `Receipt ${receipt.receiptNumber}`, author: seller.name, subject: `Motify receipt ${receipt.invoiceNumber}` });
  doc.setTextColor(INK);

  text(doc, 'Receipt', LEFT, 52, { size: 20, bold: true });
  if (receipt.mode === 'sandbox') {
    text(doc, 'SANDBOX - NO MONEY MOVED', LEFT + 92, 50, { size: 8, bold: true, color: '#b42318' });
  }
  drawLogo(doc, RIGHT - 28, 30, 28);

  let y = 82;
  for (const [label, value] of [
    ['Invoice number', receipt.invoiceNumber],
    ['Receipt number', receipt.receiptNumber],
    ['Date paid', paidOn],
  ]) {
    text(doc, label, LEFT, y, { size: 9, bold: true });
    text(doc, value, LEFT + 76, y, { size: 9 });
    y += 13.5;
  }

  // Seller and buyer side by side.
  y = 140;
  const billToX = 251;
  text(doc, seller.name, LEFT, y, { size: 9, bold: true });
  text(doc, seller.handle, LEFT + doc.getTextWidth(seller.name) + 8, y, { size: 9, color: MUTED });
  text(doc, 'Bill to', billToX, y, { size: 9, bold: true });
  const sellerLines = [...seller.addressLines, seller.email];
  const buyerLines = [receipt.billTo.name, receipt.billTo.email];
  const rows = Math.max(sellerLines.length, buyerLines.length);
  for (let row = 0; row < rows; row += 1) {
    const lineY = y + 16 + row * 13.5;
    if (sellerLines[row]) text(doc, sellerLines[row], LEFT, lineY, { size: 9 });
    if (buyerLines[row]) text(doc, buyerLines[row], billToX, lineY, { size: 9 });
  }
  y += 16 + rows * 13.5 + 26;

  text(doc, `${money(receipt.amountPaid)} paid on ${paidOn}`, LEFT, y, { size: 13, bold: true });
  y += 32;

  // Line items.
  const qtyX = 430;
  const unitX = 505;
  tableHeader(doc, y, [
    ['Description', LEFT, 'left'],
    ['Qty', qtyX, 'right'],
    ['Unit price', unitX, 'right'],
    ['Amount', RIGHT, 'right'],
  ]);
  y += 20;
  for (const item of receipt.lineItems) {
    const description = doc.setFontSize(9).splitTextToSize(item.description, qtyX - LEFT - 40) as string[];
    const lines = [...description, ...receiptLineDetails(item)];
    text(doc, String(item.quantity), qtyX, y, { size: 9, align: 'right' });
    text(doc, money(item.unitPrice), unitX, y, { size: 9, align: 'right' });
    text(doc, money(item.amount), RIGHT, y, { size: 9, align: 'right' });
    lines.forEach((line, index) => text(doc, line, LEFT, y + index * 13.5, { size: 9, color: index < description.length ? INK : MUTED }));
    y += lines.length * 13.5 + 8;
  }

  // Totals, right-aligned under the table.
  const totalsX = 306;
  const totals: [string, string, boolean][] = [['Subtotal', money(receipt.subtotal), false]];
  if (receipt.discount > 0) totals.push(['Discount', `-${money(receipt.discount)}`, false]);
  totals.push(['Total', money(receipt.total), false], ['Amount paid', money(receipt.amountPaid), true]);
  y += 4;
  for (const [label, value, bold] of totals) {
    rule(doc, totalsX, y - 10, RIGHT);
    text(doc, label, totalsX, y, { size: 9, bold });
    text(doc, value, RIGHT, y, { size: 9, bold, align: 'right' });
    y += 14;
  }
  y += 30;

  // Payment history.
  text(doc, 'Payment history', LEFT, y, { size: 13, bold: true });
  y += 30;
  const dateX = 299;
  const paidX = 470;
  tableHeader(doc, y, [
    ['Payment method', LEFT, 'left'],
    ['Date', dateX, 'left'],
    ['Amount paid', paidX, 'right'],
    ['Receipt number', RIGHT, 'right'],
  ]);
  y += 20;
  text(doc, receiptPaymentMethod(receipt), LEFT, y, { size: 9 });
  text(doc, paidOn, dateX, y, { size: 9 });
  text(doc, money(receipt.amountPaid), paidX, y, { size: 9, align: 'right' });
  text(doc, receipt.receiptNumber, RIGHT, y, { size: 9, align: 'right' });
  if (receipt.paymentMethod.transactionHash) {
    y += 22;
    text(doc, `Bakong transaction hash: ${receipt.paymentMethod.transactionHash}`, LEFT, y, { size: 7.5, color: MUTED });
  }

  rule(doc, LEFT, PAGE_HEIGHT - 60, RIGHT);
  text(doc, 'Page 1 of 1', RIGHT, PAGE_HEIGHT - 40, { size: 8, align: 'right' });
}

interface TextStyle {
  readonly size: number;
  readonly bold?: boolean;
  readonly color?: string;
  readonly align?: 'left' | 'right';
}

function text(doc: jsPDF, value: string, x: number, y: number, style: TextStyle): void {
  doc.setFont('helvetica', style.bold ? 'bold' : 'normal');
  doc.setFontSize(style.size);
  doc.setTextColor(style.color ?? INK);
  doc.text(value, x, y, { align: style.align ?? 'left' });
}

function rule(doc: jsPDF, x1: number, y: number, x2: number, color = RULE, width = 0.75): void {
  doc.setDrawColor(color);
  doc.setLineWidth(width);
  doc.line(x1, y, x2, y);
}

function tableHeader(doc: jsPDF, y: number, columns: [string, number, 'left' | 'right'][]): void {
  for (const [label, x, align] of columns) text(doc, label, x, y, { size: 7.5, align });
  rule(doc, LEFT, y + 6, RIGHT, INK, 1);
}

/** The Motify mark (public/logo.svg: a 72-unit square of four shapes), drawn in ink at `size` points. */
function drawLogo(doc: jsPDF, x: number, y: number, size: number): void {
  const s = size / 72;
  const at = (px: number, py: number): [number, number] => [x + (px - 24) * s, y + (py - 24) * s];
  doc.setFillColor(INK);
  doc.triangle(...at(24, 24), ...at(58, 58), ...at(24, 58), 'F');
  doc.triangle(...at(96, 24), ...at(96, 58), ...at(62, 58), 'F');
  doc.rect(...at(24, 62), 34 * s, 34 * s, 'F');
  // A quarter disc centred on (96, 62): from (62, 62) along the arc to (96, 96), then back to the centre.
  const k = 0.5523 * 34 * s;
  const [startX, startY] = at(62, 62);
  doc.lines([[0, k, 34 * s - k, 34 * s, 34 * s, 34 * s], [0, -34 * s], [-34 * s, 0]], startX, startY, [1, 1], 'F', true);
}
