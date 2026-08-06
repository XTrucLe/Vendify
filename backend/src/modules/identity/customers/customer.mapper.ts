import { plainToInstance } from 'class-transformer';
import { Customer } from './customer.entity';
import { CustomerResponseDto } from './customer.dto';

export class CustomerMapper {
  static toResponse(customer: Customer): CustomerResponseDto {
    return plainToInstance(CustomerResponseDto, customer);
  }
  static toResponseList(customers: Customer[]): CustomerResponseDto[] {
    return customers.map((customer) => this.toResponse(customer));
  }
}
