import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableSession } from './table-session.entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TableModule } from '../tables/table.module';
import { CustomerModule } from '../../identity/customers/customer.module';
import { SessionGuard } from './guards/session.guard';

@Module({
  imports: [TypeOrmModule.forFeature([TableSession]), TableModule, CustomerModule],
  providers: [SessionService, SessionGuard],
  controllers: [SessionController],
  exports: [SessionService, SessionGuard],
})
export class SessionModule {}
