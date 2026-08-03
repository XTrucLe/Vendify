import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class ScanQRDto {
  @IsString()
  tableId: string;
}

export class IdentifySessionDto {
  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  fullName?: string;
}

@Exclude()
export class SessionResponseDto {
  @Expose() sessionId: string;
  @Expose() tableId: string;
  @Expose() tableNumber: string;
  @Expose() customerId: string;
  @Expose() customerName: string;
  @Expose() status: string;
  @Expose() startedAt: Date;
}
