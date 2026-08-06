import { Exclude, Expose } from 'class-transformer';
import { OrderStatus } from '../constants/order.constant';
import { PaymentStatus } from '../constants/payment-status.constant';
import { OptionSnapshot } from '../order.type';

@Exclude()
export class OrderItemResponseDto {
  @Expose() id: string;
  @Expose() productName: string;
  @Expose() quantity: number;
  @Expose() price: number;
  @Expose() options: OptionSnapshot[] | null;
  @Expose() total: number;
}

@Exclude()
export class OrderResponseDto {
  @Expose() id: string;
  @Expose() sessionId: string;
  @Expose() customerName: string | null;
  @Expose() staffId: string | null;
  @Expose() subtotal: number;
  @Expose() discount: number;
  @Expose() total: number;
  @Expose() status: OrderStatus;
  @Expose() paymentStatus: PaymentStatus;
  @Expose() notes: string | null;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}

@Exclude()
export class OrderDetailResponseDto extends OrderResponseDto {
  @Expose() items: OrderItemResponseDto[];
}
