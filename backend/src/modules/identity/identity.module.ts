import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customers/customer.module';

@Module({
  imports: [StaffModule, AuthModule, CustomerModule],
  exports: [StaffModule, AuthModule, CustomerModule],
})
export class IdentityModule {}
