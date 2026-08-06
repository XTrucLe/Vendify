import {
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
  IsInt,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemOptionDto {
  @IsUUID()
  optionId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  optionValueIds: string[];
}

export class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemOptionDto)
  options?: CreateOrderItemOptionDto[];
}

export class CreateOrderDto {
  @IsUUID()
  sessionId: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsUUID()
  staffId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
