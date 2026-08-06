import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from './constants/order.constant';

const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.Pending]: [OrderStatus.Confirmed, OrderStatus.Cancelled],

  [OrderStatus.Confirmed]: [OrderStatus.Preparing, OrderStatus.Cancelled],

  [OrderStatus.Preparing]: [OrderStatus.Ready],

  [OrderStatus.Ready]: [OrderStatus.Served],

  [OrderStatus.Served]: [OrderStatus.Completed],

  [OrderStatus.Completed]: [],

  [OrderStatus.Cancelled]: [],
};

export function canTransition(currentStatus: OrderStatus, nextStatus: OrderStatus): boolean {
  const allowed = ORDER_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(nextStatus) : false;
}

export function assertOrderTransition(currentStatus: OrderStatus, nextStatus: OrderStatus): void {
  const allowed = ORDER_TRANSITIONS[currentStatus] ?? [];

  if (!allowed.includes(nextStatus)) {
    throw new BadRequestException({
      code: 'INVALID_ORDER_STATUS_TRANSITION',
      message: `Cannot transition order from ${currentStatus} to ${nextStatus}`,
    });
  }
}
