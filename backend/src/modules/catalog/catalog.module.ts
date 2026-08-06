import { Module } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { CategoriesModule } from './categories/category.module';
import { ImageStorageService } from './products/image-storage.service';

@Module({
  imports: [ProductModule, CategoriesModule],
  providers: [ImageStorageService],
  exports: [ProductModule, CategoriesModule],
})
export class CatalogModule {}
