export const OrderStatus = {
  Pending: 'PENDING',
  Confirmed: 'CONFIRMED',
  Preparing: 'PREPARING',
  Ready: 'READY',
  Served: 'SERVED',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ORDER_STATUS_VALUES = Object.values(OrderStatus);

export const ADDABLE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.Pending,
  OrderStatus.Confirmed,
  OrderStatus.Preparing,
];

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.Pending,
  OrderStatus.Confirmed,
  OrderStatus.Preparing,
  OrderStatus.Ready,
];

export const COMPLETED_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.Served,
  OrderStatus.Completed,
  OrderStatus.Cancelled,
];
