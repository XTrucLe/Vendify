import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsDateString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsPhoneNumber('VN')
  phone: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;
}

@Exclude()
export class CustomerResponseDto {
  @Expose() id: string;
  @Expose() fullName: string;
  @Expose() email: string;
  @Expose() phone: string;
  @Expose() loyaltyPoints: number;
  @Expose() isActive: boolean;
  @Expose() dateOfBirth: Date;
}
