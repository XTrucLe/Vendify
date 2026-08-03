import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { DecimalTransformer } from '@/common/transformers/decimal.transform';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  @Index()
  phone: string;

  @Column({ length: 255, unique: true, nullable: true })
  @Index()
  email: string;

  @Column({ name: 'full_name', length: 100, nullable: true })
  fullName: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'loyalty_points', type: 'int', default: 0 })
  loyaltyPoints: number;

  @Column({
    name: 'total_spent',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: DecimalTransformer,
  })
  totalSpent: number;

  @Column({ name: 'visit_count', type: 'int', default: 0 })
  visitCount: number;

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
