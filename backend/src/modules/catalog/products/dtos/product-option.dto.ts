import { Exclude, Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProductOptionValueDto {
  @IsString()
  @MaxLength(120)
  value: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  priceAdjustment?: number;
}

export class ProductOptionDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionValueDto)
  values: ProductOptionValueDto[];
}

@Exclude()
export class OptionValueResponseDto {
  @Expose() value: string;
  @Expose() priceAdjustment?: number;
}

@Exclude()
export class ProductOptionResponseDto {
  @Expose() name: string;
  @Expose() required?: boolean;
  @Expose()
  @Type(() => OptionValueResponseDto)
  values: OptionValueResponseDto[];
}
