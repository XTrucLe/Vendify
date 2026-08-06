import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto, UpdateTableDto, TableResponseDto } from './table.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { TableMapper } from './table.mapper';

@Controller('tables')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TableController {
  constructor(private tablesService: TableService) {}

  @Post()
  @Roles('owner', 'manager')
  async create(@Body() dto: CreateTableDto): Promise<TableResponseDto> {
    const table = await this.tablesService.create(dto);
    return TableMapper.toResponse(table);
  }

  @Get()
  @Roles('owner', 'manager', 'staff')
  async findAll(): Promise<TableResponseDto[]> {
    const tables = await this.tablesService.findAll();
    return TableMapper.toResponseList(tables);
  }

  @Get(':id')
  @Roles('owner', 'manager', 'staff')
  async findById(@Param('id') id: string): Promise<TableResponseDto> {
    const table = await this.tablesService.findById(id);
    return TableMapper.toResponse(table);
  }

  @Put(':id')
  @Roles('owner', 'manager')
  async update(@Param('id') id: string, @Body() dto: UpdateTableDto): Promise<TableResponseDto> {
    const table = await this.tablesService.update(id, dto);
    return TableMapper.toResponse(table);
  }

  @Delete(':id')
  @Roles('owner')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.tablesService.delete(id);
  }
}
