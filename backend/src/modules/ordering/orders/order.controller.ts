// src/modules/ordering/orders/controllers/order.controller.ts

import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { AddOrderItemsDto } from './dtos/add-order-items.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { QueryOrdersDto } from './dtos/query-orders.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

import { OrderResponseDto, OrderDetailResponseDto } from './dtos/order-response.dto';
import { OrderMapper } from './order.mapper';

@Controller('ordering/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles('owner', 'manager', 'staff')
  async findAll(@Query() query: QueryOrdersDto): Promise<OrderResponseDto[]> {
    const orders = await this.orderService.findAll(query);

    return OrderMapper.toResponseList(orders.data);
  }

  @Get(':id')
  @Roles('owner', 'manager', 'staff')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OrderDetailResponseDto> {
    const order = await this.orderService.getById(id);
    return OrderMapper.toDetailResponse(order);
  }

  @Post()
  @Roles('owner', 'manager', 'staff')
  async create(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderService.create(dto);
    return OrderMapper.toResponse(order);
  }

  @Post(':id/items')
  @Roles('owner', 'manager', 'staff')
  async addItems(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddOrderItemsDto,
  ): Promise<OrderDetailResponseDto> {
    const order = await this.orderService.addItems(id, dto);
    return OrderMapper.toDetailResponse(order);
  }

  @Patch(':id/status')
  @Roles('owner', 'manager', 'staff')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderDetailResponseDto> {
    const order = await this.orderService.updateStatus(id, dto);
    return OrderMapper.toDetailResponse(order);
  }
}
