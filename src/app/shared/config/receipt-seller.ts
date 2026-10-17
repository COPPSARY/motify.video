/** Who issues Motify receipts: printed on the receipt page and in the downloaded PDF. */
export interface ReceiptSeller {
  readonly name: string;
  readonly handle: string;
  readonly addressLines: readonly string[];
  readonly email: string;
}

export const RECEIPT_SELLER: ReceiptSeller = {
  name: 'Motify',
  handle: '@motify',
  addressLines: ['Phnom Penh 120101', 'Cambodia'],
  email: 'billing@motify.video',
};
