import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductOption } from './entities/product-option.entity';
import { OptionValue } from './entities/option-value.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoriesModule } from '../categories/category.module';
import { ImageStorageService } from './image-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductOption, OptionValue]), CategoriesModule],
  controllers: [ProductController],
  providers: [ProductService, ImageStorageService],
  exports: [ProductService],
})
export class ProductModule {}
