import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(dto: CreateCustomerDto): Promise<Customer> {
    await this.ensureCustomerDoesNotExist(dto);

    const customer = this.customerRepository.create({
      ...dto,
    });
    return this.customerRepository.save(customer);
  }

  async updateCustomer(phone: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findCustomerOrThrow(phone);

    this.customerRepository.merge(customer, dto);
    return this.customerRepository.save(customer);
  }

  async getCustomerByPhone(phone: string): Promise<Customer> {
    return this.findCustomerOrThrow(phone);
  }

  async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException({
        code: 'CUSTOMER_NOT_FOUND',
        message: 'Customer not found',
      });
    }
    return customer;
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { phone },
    });
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async softDeleteCustomer(phone: string): Promise<void> {
    await this.updateStatus(phone, {
      isBlocked: true,
    });
  }

  async restoreCustomer(phone: string): Promise<void> {
    await this.updateStatus(phone, {
      isBlocked: false,
    });
  }

  private async ensureCustomerDoesNotExist(dto: CreateCustomerDto): Promise<void> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { phone: dto.phone },
    });
    if (existingCustomer) {
      throw new ConflictException({
        code: 'CUSTOMER_ALREADY_EXISTS',
        message: 'Customer already exists',
      });
    }
  }

  private async findCustomerOrThrow(phone: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { phone },
    });
    if (!customer) {
      throw new NotFoundException({
        code: 'CUSTOMER_NOT_FOUND',
        message: 'Customer not found',
      });
    }
    return customer;
  }

  private async updateStatus(phone: string, payload: Partial<Pick<Customer, 'isBlocked'>>): Promise<void> {
    const customer = await this.findCustomerOrThrow(phone);
    this.customerRepository.merge(customer, payload);
    await this.customerRepository.save(customer);
  }
}
