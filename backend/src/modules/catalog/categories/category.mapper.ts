import { plainToInstance } from 'class-transformer';
import { Category } from './category.entity';
import { CategoryDto } from './category.dto';

export class CategoryMapper {
  static toResponse(category: Category): CategoryDto {
    return plainToInstance(CategoryDto, category, { excludeExtraneousValues: true });
  }

  static toResponseList(categories: Category[]): CategoryDto[] {
    return categories.map((category) => this.toResponse(category));
  }
}
