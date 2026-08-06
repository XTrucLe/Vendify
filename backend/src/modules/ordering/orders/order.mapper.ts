import { plainToInstance } from 'class-transformer';
import { Order } from './entities/order.entity';
import { OrderResponseDto, OrderDetailResponseDto } from './dtos/order-response.dto';

export class OrderMapper {
  static toResponse(order: Order): OrderResponseDto {
    return plainToInstance(OrderResponseDto, order, { excludeExtraneousValues: true });
  }
  static toResponseList(orders: Order[]): OrderResponseDto[] {
    return orders.map((order) => this.toResponse(order));
  }

  static toDetailResponse(order: Order): OrderDetailResponseDto {
    return plainToInstance(
      OrderDetailResponseDto,
      {
        ...order,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.productName,
          quantity: item.quantity,
          price: item.unitPrice,
          options: item.options,
          total: item.total,
        })),
      },
      { excludeExtraneousValues: true },
    );
  }

  static toDetailResponseList(orders: Order[]): OrderDetailResponseDto[] {
    return orders.map((order) => this.toDetailResponse(order));
  }
}
