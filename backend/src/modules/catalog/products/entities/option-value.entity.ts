import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductOption } from './product-option.entity';

@Entity('option_values')
export class OptionValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'option_id', type: 'uuid' })
  optionId: string;

  @ManyToOne(() => ProductOption, (option) => option.values, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'option_id' })
  option: ProductOption;

  @Column({ type: 'varchar', length: 120 })
  value: string;

  @Column({ name: 'price_adjustment', type: 'int', default: 0 })
  priceAdjustment: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
