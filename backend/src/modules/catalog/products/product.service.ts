import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductOption } from './entities/product-option.entity';
import { OptionValue } from './entities/option-value.entity';
import { CreateProductDto, GetProductsQueryDto, UpdateProductDto } from './dtos/product.dto';
import { Paginated } from '@/common/dtos/pagination.dto';
import { ImageStorageService } from './image-storage.service';
import { CategoriesService } from '../categories/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly categoriesService: CategoriesService,
    private readonly dataSource: DataSource,
    private readonly imageStorageService: ImageStorageService,
  ) {}

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const category = await this.categoriesService.getById(categoryId);

    if (!category) {
      throw new BadRequestException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found or inactive',
      });
    }
  }

  async create(dto: CreateProductDto): Promise<Product> {
    await this.ensureCategoryExists(dto.categoryId);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = queryRunner.manager.create(Product, {
        name: dto.name.trim(),
        categoryId: dto.categoryId,
        description: dto.description ?? null,
        basePrice: dto.basePrice,
        sellPrice: dto.sellPrice,
        imageUrl: dto.imageUrl ?? null,
        isAvailable: dto.isAvailable ?? true,
      });

      const savedProduct = await queryRunner.manager.save(product);

      if (dto.options && dto.options.length > 0) {
        const optionEntities = dto.options.map((optionDto) => {
          const option = queryRunner.manager.create(ProductOption, {
            productId: savedProduct.id,
            name: optionDto.name.trim(),
            required: optionDto.required ?? false,
          });

          option.values = optionDto.values.map((valueDto) =>
            queryRunner.manager.create(OptionValue, {
              value: valueDto.value.trim(),
              priceAdjustment: valueDto.priceAdjustment ?? 0,
            }),
          );
          return option;
        });
        await queryRunner.manager.save(optionEntities);
      }

      await queryRunner.commitTransaction();

      return this.getById(savedProduct.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: GetProductsQueryDto): Promise<Paginated<Product>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.productRepository.createQueryBuilder('product').leftJoinAndSelect('product.category', 'category');

    if (query.categoryId) qb.andWhere('product.category_id = :categoryId', { categoryId: query.categoryId });

    if (query.keyword) qb.andWhere('product.name ILIKE :keyword', { keyword: `%${query.keyword.trim()}%` });

    if (query.isAvailable !== undefined)
      qb.andWhere('product.is_available = :isAvailable', { isAvailable: query.isAvailable });

    qb.orderBy('product.created_at', 'DESC');

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getById(id: string): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.options', 'options')
      .leftJoinAndSelect('options.values', 'values')
      .where('product.id = :id', { id })
      .orderBy('options.created_at', 'ASC')
      .addOrderBy('values.price_adjustment', 'ASC')
      .getOne();

    if (!product)
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      });

    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(Product, { where: { id } });

      if (!product)
        throw new NotFoundException({
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        });

      if (dto.categoryId) {
        await this.ensureCategoryExists(dto.categoryId);
        product.categoryId = dto.categoryId;
      }

      if (dto.name !== undefined) product.name = dto.name.trim();

      if (dto.description !== undefined) product.description = dto.description;

      if (dto.basePrice !== undefined) product.basePrice = dto.basePrice;

      if (dto.sellPrice !== undefined) product.sellPrice = dto.sellPrice;

      if (dto.imageUrl !== undefined) product.imageUrl = dto.imageUrl;

      if (dto.isAvailable !== undefined) product.isAvailable = dto.isAvailable;

      await queryRunner.manager.save(product);

      if (dto.options !== undefined) {
        const existingOptions = await queryRunner.manager.find(ProductOption, {
          where: { productId: id },
          relations: { values: true },
        });

        if (existingOptions.length > 0) await queryRunner.manager.remove(existingOptions);

        if (dto.options.length > 0) {
          const optionEntities = dto.options.map((optionDto) => {
            const option = queryRunner.manager.create(ProductOption, {
              productId: id,
              name: optionDto.name.trim(),
              required: optionDto.required ?? false,
            });

            option.values = optionDto.values.map((valueDto) =>
              queryRunner.manager.create(OptionValue, {
                value: valueDto.value.trim(),
                priceAdjustment: valueDto.priceAdjustment ?? 0,
              }),
            );

            return option;
          });

          await queryRunner.manager.save(optionEntities);
        }
      }

      await queryRunner.commitTransaction();

      return this.getById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateAvailability(id: string, isAvailable: boolean): Promise<Product> {
    const product = await this.getById(id);
    if (product.isAvailable === isAvailable)
      throw new BadRequestException({
        code: 'PRODUCT_AVAILABILITY_UNCHANGED',
        message: 'Product availability is already set to the specified value',
      });
    product.isAvailable = isAvailable;
    return this.productRepository.save(product);
  }

  async uploadImage(id: string, file: any): Promise<Product> {
    const product = await this.getById(id);

    if (product.imageUrl) await this.imageStorageService.deleteProductImage(product.imageUrl);

    const imageUrl = await this.imageStorageService.saveProductImage(file, id);
    product.imageUrl = imageUrl;
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product)
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      });

    await this.productRepository.softRemove(product);

    return { success: true };
  }
}
