import { plainToInstance } from 'class-transformer';
import { Product } from './entities/product.entity';
import { ProductResponseDto } from './dtos/product.dto';

export class ProductMapper {
  static toResponse(product: Product): ProductResponseDto {
    return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
  }
  static toResponseList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => this.toResponse(product));
  }
}
