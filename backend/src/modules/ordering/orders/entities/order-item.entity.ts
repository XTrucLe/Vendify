import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { OptionSnapshot } from '../order.type';

@Entity('order_items')
@Index(['orderId'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id', type: 'uuid', nullable: true })
  productId: string | null;

  @Column({ name: 'product_name', type: 'varchar', length: 180 })
  productName: string;

  @Column({ name: 'unit_price', type: 'int' })
  unitPrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'options_snapshot', type: 'jsonb', nullable: true })
  options: OptionSnapshot[] | null;

  @Column({ type: 'int' })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
