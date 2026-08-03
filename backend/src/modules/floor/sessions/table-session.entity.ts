import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';
import { Table } from '../tables/table.entity';
import { Customer } from '../../identity/customers/customer.entity';
import { SessionStatus } from './session-status.enum';

@Entity('table_sessions')
export class TableSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'table_id' })
  @Index()
  tableId: string;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.ACTIVE })
  status: SessionStatus;

  @CreateDateColumn({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'ended_at', nullable: true })
  endedAt: Date;

  @Column({ name: 'closed_reason', type: 'text', nullable: true })
  closedReason: string;

  @ManyToOne(() => Table)
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @UpdateDateColumn({ name: 'last_activity_at' })
  lastActivityAt: Date;
}
