import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductOptionDto, ProductOptionResponseDto } from './product-option.dto';
import { PartialType } from '@nestjs/mapped-types';
import { transformBoolean } from '@/common/utils/transform.util';
import { PaginationDto } from '@/common/dtos/pagination.dto';

export class CreateProductDto {
  @IsString()
  @MaxLength(180)
  name: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  basePrice: number;

  @IsInt()
  @Min(0)
  sellPrice: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  options?: ProductOptionDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class UpdateAvailabilityDto {
  @IsBoolean()
  isAvailable: boolean;
}

export class GetProductsQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(transformBoolean)
  @IsBoolean()
  isAvailable?: boolean;
}

@Exclude()
export class ProductResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() categoryId: string;
  @Expose() description?: string;
  @Expose() basePrice: number;
  @Expose() sellPrice: number;
  @Expose() imageUrl?: string;
  @Expose() isAvailable: boolean;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose()
  @Type(() => ProductOptionResponseDto)
  options: ProductOptionResponseDto[];
}
