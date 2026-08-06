import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform } from 'class-transformer';
import { transformBoolean } from '@/common/utils/transform.util';
import { PaginationDto } from '@/common/dtos/pagination.dto';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

@Exclude()
export class CategoryDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description?: string;
  @Expose() sortOrder?: number;
  @Expose() isActive?: boolean;
  @Expose() createdAt: Date;
}

export class GetCategoriesQueryDto extends PaginationDto {
  @IsOptional()
  @Transform(transformBoolean)
  @IsBoolean()
  isActive?: boolean;
}
