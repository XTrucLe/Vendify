import { plainToInstance } from 'class-transformer';
import { StaffResponseDto, StaffDetailResponseDto } from './staff.dto';
import { Staff } from './staff.entity';

export class StaffMapper {
  static toResponse(staff: Staff): StaffResponseDto {
    return plainToInstance(StaffResponseDto, staff, {
      excludeExtraneousValues: true,
    });
  }

  static toDetailResponse(staff: Staff): StaffDetailResponseDto {
    return plainToInstance(StaffDetailResponseDto, staff, {
      excludeExtraneousValues: true,
    });
  }

  static toResponses(staffs: Staff[]): StaffResponseDto[] {
    return staffs.map((staff) => this.toResponse(staff));
  }

  static toDetailResponses(staffs: Staff[]): StaffDetailResponseDto[] {
    return staffs.map((staff) => this.toDetailResponse(staff));
  }
}
