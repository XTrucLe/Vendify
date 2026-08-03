import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CustomerLoginDto {
  @IsPhoneNumber('VN')
  @IsNotEmpty()
  phone: string;
}
