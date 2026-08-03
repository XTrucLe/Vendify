import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto, CustomerResponseDto } from './customer.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CustomerMapper } from './customer.mapper';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('me')
  async getMyCustomer(@CurrentUser('phone') phone: string): Promise<CustomerResponseDto> {
    const customer = await this.customerService.getCustomerByPhone(phone);
    return CustomerMapper.toResponse(customer);
  }

  @Get()
  @Roles('owner', 'manager')
  async getAllCustomers(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerService.getAllCustomers();
    return CustomerMapper.toResponses(customers);
  }

  @Put('me')
  async updateMyCustomer(
    @CurrentUser('phone') phone: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.updateCustomer(phone, dto);
    return CustomerMapper.toResponse(customer);
  }

  @Patch('soft-delete/:id')
  @Roles('owner', 'manager')
  async softDeleteCustomer(@Param('id') id: string) {
    await this.customerService.softDeleteCustomer(id);
  }

  @Patch('restore/:id')
  @Roles('owner', 'manager')
  async restoreCustomer(@Param('id') id: string) {
    await this.customerService.restoreCustomer(id);
  }
}
