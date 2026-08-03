import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Staff } from './staff.entity';
import { CreateStaffDto, UpdateStaffDto, UpdateStaffPasswordDto } from './staff.dto';
import { PasswordUtil } from '@/common/utils/password.util';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async createStaff(dto: CreateStaffDto): Promise<Staff> {
    await this.ensureStaffDoesNotExist(dto);

    const passwordHash = await PasswordUtil.hashPassword(dto.password);

    const staff = this.staffRepository.create({
      ...dto,
      passwordHash,
      isActive: true,
      isVerified: false,
    });

    return this.staffRepository.save(staff);
  }

  async updateStaff(id: string, dto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findStaffOrThrow(id);

    this.staffRepository.merge(staff, dto);
    return this.staffRepository.save(staff);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    const staff = await this.findStaffOrThrow(id);
    staff.lastLoginAt = new Date();
    staff.refreshToken = refreshToken;
    await this.staffRepository.save(staff);
  }

  async updateLastLogin(id: string): Promise<void> {
    const staff = await this.findStaffOrThrow(id);
    await this.staffRepository.save(staff);
  }

  async changeStaffPassword(id: string, dto: UpdateStaffPasswordDto): Promise<void> {
    const staff = await this.findStaffOrThrow(id);

    const isValid = await PasswordUtil.comparePasswords(dto.oldPassword, staff.passwordHash);
    if (!isValid) {
      throw new ConflictException({
        code: 'INVALID_PASSWORD',
        message: 'Invalid password',
      });
    }

    staff.passwordHash = await PasswordUtil.hashPassword(dto.newPassword);

    await this.staffRepository.save(staff);
  }

  async getStaffById(id: string): Promise<Staff> {
    return this.findStaffOrThrow(id);
  }

  async getStaffByUsername(username: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { username },
    });
    if (!staff)
      throw new NotFoundException({
        code: 'STAFF_NOT_FOUND',
        message: 'Staff not found',
      });
    return staff;
  }

  async getAllStaff(): Promise<Staff[]> {
    return this.staffRepository.find();
  }

  async softDeleteStaff(id: string): Promise<void> {
    await this.updateStatus(id, {
      isActive: false,
    });
  }

  async verifyStaff(id: string): Promise<void> {
    await this.updateStatus(id, {
      isVerified: true,
    });
  }

  async restoreStaff(id: string): Promise<void> {
    await this.findStaffOrThrow(id);

    await this.updateStatus(id, {
      isActive: true,
    });
  }

  async removeStaff(id: string): Promise<void> {
    const staff = await this.findStaffOrThrow(id);
    await this.staffRepository.remove(staff);
  }

  private async findStaffOrThrow(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException({
        code: 'STAFF_NOT_FOUND',
        message: 'Staff not found',
      });
    }

    return staff;
  }

  private async ensureStaffDoesNotExist(dto: CreateStaffDto): Promise<void> {
    const where: FindOptionsWhere<Staff>[] = [{ username: dto.username }];

    if (dto.email !== undefined) {
      where.push({ email: dto.email });
    }

    if (dto.phone !== undefined) {
      where.push({ phone: dto.phone });
    }

    const existed = await this.staffRepository.findOne({ where });

    if (existed) {
      throw new ConflictException({
        code: 'STAFF_ALREADY_EXISTS',
        message: 'Staff already exists',
      });
    }
  }

  private async updateStatus(id: string, payload: Partial<Pick<Staff, 'isActive' | 'isVerified'>>): Promise<void> {
    const staff = await this.findStaffOrThrow(id);

    Object.assign(staff, payload);

    await this.staffRepository.save(staff);
  }
}
