import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto, GetCategoriesQueryDto } from './category.dto';
import { Paginated } from '@/common/dtos/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findOne({
      where: {
        name: dto.name.trim(),
      },
    });

    if (existing) {
      throw new BadRequestException({
        code: 'CATEGORY_NAME_EXISTS',
        message: 'Category name already exists',
      });
    }

    const category = this.categoryRepository.create({
      name: dto.name.trim(),
      description: dto.description ?? null,
      sortOrder: dto.sortOrder ?? 0,
      isActive: dto.isActive ?? true,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(query: GetCategoriesQueryDto): Promise<Paginated<Category>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.categoryRepository.createQueryBuilder('category');

    if (query.isActive !== undefined) {
      qb.andWhere('category.is_active = :isActive', {
        isActive: query.isActive,
      });
    }

    qb.orderBy('category.sort_order', 'ASC');
    qb.addOrderBy('category.created_at', 'DESC');

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found',
      });
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getById(id);

    if (dto.name !== undefined) {
      const existing = await this.categoryRepository.findOne({ where: { name: dto.name.trim() } });

      if (existing && existing.id !== id) {
        throw new BadRequestException({
          code: 'CATEGORY_NAME_EXISTS',
          message: 'Category name already exists',
        });
      }

      category.name = dto.name.trim();
    }

    if (dto.description !== undefined) {
      category.description = dto.description;
    }

    if (dto.sortOrder !== undefined) {
      category.sortOrder = dto.sortOrder;
    }

    if (dto.isActive !== undefined) {
      category.isActive = dto.isActive;
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: { products: true } });

    if (!category) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found',
      });
    }

    if (category.products && category.products.length > 0) {
      throw new BadRequestException({
        code: 'CATEGORY_HAS_PRODUCTS',
        message: 'Cannot delete a category that contains products. Please deactivate it instead of deleting it.',
      });
    }

    await this.categoryRepository.remove(category);

    return { success: true };
  }
}
