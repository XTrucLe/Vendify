import { Module } from '@nestjs/common';
import { TableModule } from './tables/table.module';
import { SessionModule } from './sessions/session.module';

@Module({
  imports: [TableModule, SessionModule],
  exports: [TableModule, SessionModule],
})
export class FloorModule {}
