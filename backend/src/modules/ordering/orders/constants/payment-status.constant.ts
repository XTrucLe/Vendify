export const PaymentStatus = {
  Unpaid: 'unpaid',
  Pending: 'pending',
  Paid: 'paid',
  Refunded: 'refunded',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PAYMENT_STATUS_VALUES = Object.values(PaymentStatus);
