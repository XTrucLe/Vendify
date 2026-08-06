import { IsEnum } from 'class-validator';
import { OrderStatus, ORDER_STATUS_VALUES } from '../constants/order.constant';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: `Trạng thái phải là một trong: ${ORDER_STATUS_VALUES.join(', ')}`,
  })
  status: OrderStatus;
}
