import { Module } from '@nestjs/common';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [OrderModule],
  exports: [OrderModule],
})
export class OrderingModule {}
