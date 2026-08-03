import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './table.entity';
import { CreateTableDto, UpdateTableDto } from './table.dto';
import { TableStatus } from './status.enum';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepo: Repository<Table>,
  ) {}

  async create(dto: CreateTableDto): Promise<Table> {
    const existing = await this.tableRepo.findOne({
      where: { tableNumber: dto.tableNumber },
    });
    if (existing) {
      throw new ConflictException({
        code: 'TABLE_EXISTS',
        message: 'The table has already existed',
      });
    }

    const table = this.tableRepo.create({
      ...dto,
      capacity: dto.capacity ?? 4,
      status: TableStatus.AVAILABLE,
    });
    return this.tableRepo.save(table);
  }

  async findAll(): Promise<Table[]> {
    return this.tableRepo.find({ order: { tableNumber: 'ASC' } });
  }

  async findById(id: string): Promise<Table> {
    const table = await this.tableRepo.findOne({ where: { id } });
    if (!table)
      throw new NotFoundException({
        code: 'TABLE_NOT_FOUND',
        message: 'Table not found',
      });
    return table;
  }

  async update(id: string, dto: UpdateTableDto): Promise<Table> {
    const table = await this.findById(id);

    if (dto.tableNumber && dto.tableNumber !== table.tableNumber) {
      const existing = await this.tableRepo.findOne({
        where: { tableNumber: dto.tableNumber },
      });
      if (existing)
        throw new ConflictException({
          code: 'TABLE_EXISTS',
          message: 'The table has already existed',
        });
    }

    Object.assign(table, dto);
    return this.tableRepo.save(table);
  }

  async delete(id: string): Promise<void> {
    const table = await this.findById(id);
    await this.tableRepo.remove(table);
  }

  async updateStatus(id: string, status: Table['status']): Promise<void> {
    await this.tableRepo.update(id, { status });
  }
}
