import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional, IsInt, Min, IsIn } from 'class-validator';

export class CreateTableDto {
  @IsString()
  tableNumber: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  zone?: string;
}

export class UpdateTableDto {
  @IsString()
  @IsOptional()
  tableNumber?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsIn(['available', 'occupied', 'reserved', 'maintenance'])
  @IsOptional()
  status?: 'available' | 'occupied' | 'reserved' | 'maintenance';

  @IsString()
  @IsOptional()
  zone?: string;
}

@Exclude()
export class TableResponseDto {
  @Expose() id: string;
  @Expose() tableNumber: string;
  @Expose() name: string;
  @Expose() capacity: number;
  @Expose() status: string;
  @Expose() zone: string;
  @Expose() createdAt: Date;
}
