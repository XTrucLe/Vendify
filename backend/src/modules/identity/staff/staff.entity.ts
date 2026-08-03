import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { type StaffRole } from '@/common/constants/roles.constant';
import { STAFF_ROLES } from './../../../common/constants/roles.constant';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true, nullable: true })
  username: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @Column({ length: 255, unique: true, nullable: true })
  email: string;

  @Column({ length: 20, unique: true, nullable: true })
  @Index()
  phone: string;

  @Column({ name: 'full_name', length: 100, nullable: true })
  fullName: string;

  @Column({ name: 'role', type: 'varchar', length: 20, default: STAFF_ROLES.STAFF })
  role: StaffRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string | null;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
