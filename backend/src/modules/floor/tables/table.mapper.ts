import { plainToInstance } from 'class-transformer';
import { Table } from './table.entity';
import { TableResponseDto } from './table.dto';

export class TableMapper {
  static toResponse(table: Table): TableResponseDto {
    return plainToInstance(TableResponseDto, table, { excludeExtraneousValues: true });
  }
  static toResponses(tables: Table[]): TableResponseDto[] {
    return tables.map((table) => this.toResponse(table));
  }
}
