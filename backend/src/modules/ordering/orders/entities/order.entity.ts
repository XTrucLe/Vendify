import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../constants/order.constant';
import { PaymentStatus } from '../constants/payment-status.constant';

@Entity('orders')
@Index(['sessionId', 'status'])
@Index(['status'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string | null;

  @Column({ name: 'customer_name', type: 'varchar', length: 180, nullable: true })
  customerName: string | null;

  @Column({ name: 'staff_id', type: 'uuid', nullable: true })
  staffId: string | null;

  @Column({ type: 'int', default: 0 })
  subtotal: number;

  @Column({ type: 'int', default: 0 })
  discount: number;

  @Column({ type: 'int', default: 0 })
  total: number;

  @Column({ type: 'varchar', length: 20, default: OrderStatus.Pending })
  status: OrderStatus;

  @Column({ name: 'payment_status', type: 'varchar', length: 20, default: PaymentStatus.Unpaid })
  paymentStatus: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: false })
  items: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
