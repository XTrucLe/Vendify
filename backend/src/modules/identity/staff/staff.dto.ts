import { STAFF_ROLES, type StaffRole } from '@/common/constants/roles.constant';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsEmail, IsOptional, MinLength, IsEnum, Matches } from 'class-validator';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{6,}$/;
const PASSWORD_MESSAGE =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';

export class CreateStaffDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_MESSAGE,
  })
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  fullName?: string;
}

export class UpdateStaffDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(STAFF_ROLES)
  @IsOptional()
  role?: StaffRole;
}

export class UpdateStaffPasswordDto {
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_MESSAGE,
  })
  newPassword: string;
}

@Exclude()
export class StaffResponseDto {
  @Expose() id: string;
  @Expose() username: string;
  @Expose() email: string;
  @Expose() phone: string;
  @Expose() fullName: string;
  @Expose() role: StaffRole;
  @Expose() isActive: boolean;
  @Expose() isVerified: boolean;
  @Expose() lastLoginAt: Date;
  @Expose() createdAt: Date;
}

@Exclude()
export class StaffDetailResponseDto extends StaffResponseDto {
  @Expose() updatedAt: Date;
}
