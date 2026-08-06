import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto, CreateOrderItemDto } from './dtos/create-order.dto';
import { AddOrderItemsDto } from './dtos/add-order-items.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { QueryOrdersDto } from './dtos/query-orders.dto';
import { OrderStatus, ADDABLE_ORDER_STATUSES, ACTIVE_ORDER_STATUSES } from './constants/order.constant';
import { PaymentStatus } from './constants/payment-status.constant';
import { assertOrderTransition } from './order.state-machine';
import { OptionSnapshot } from './order.type';
import { Paginated } from '@/common/dtos/pagination.dto';

interface ProductInfo {
  id: string;
  name: string;
  sellPrice: number;
  isAvailable: boolean;
  options: ProductOptionInfo[];
}

interface ProductOptionInfo {
  id: string;
  name: string;
  required: boolean;
  values: { id: string; value: string; priceAdjustment: number }[];
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    await this.validateSession(dto.sessionId);

    const { items, subtotal } = await this.buildOrderItems(dto.items);

    const order = await this.dataSource.transaction(async (manager) => {
      const newOrder = manager.create(Order, {
        sessionId: dto.sessionId,
        customerId: dto.customerId ?? null,
        staffId: dto.staffId ?? null,
        subtotal,
        discount: 0,
        total: subtotal,
        status: OrderStatus.Pending,
        paymentStatus: PaymentStatus.Unpaid,
        notes: dto.notes ?? null,
      });

      const savedOrder = await manager.save(Order, newOrder);

      for (const item of items) {
        item.orderId = savedOrder.id;
      }
      await manager.save(OrderItem, items);

      return savedOrder;
    });

    return this.getById(order.id);
  }

  async addItems(orderId: string, dto: AddOrderItemsDto): Promise<Order> {
    const order = await this.findEntityById(orderId);

    this.assertCanAddItems(order);

    const { items, subtotal } = await this.buildOrderItems(dto.items);

    await this.dataSource.transaction(async (manager) => {
      order.subtotal += subtotal;
      order.total = order.subtotal - order.discount;
      await manager.save(Order, order);

      for (const item of items) {
        item.orderId = orderId;
      }
      await manager.save(OrderItem, items);
    });

    return this.getById(orderId);
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findEntityById(orderId);

    assertOrderTransition(order.status, dto.status);

    order.status = dto.status;
    await this.orderRepository.save(order);

    return this.getById(orderId);
  }

  async getById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { items: true },
      order: { items: { createdAt: 'ASC' } },
    });

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: `Order with ID "${orderId}" not found.`,
      });
    }

    return order;
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { items: true },
      order: { items: { createdAt: 'ASC' } },
    });

    return order;
  }

  async findActiveBySessionId(sessionId: string): Promise<Order | null> {
    const order = await this.orderRepository.findOne({
      where: {
        sessionId,
        status: In(ACTIVE_ORDER_STATUSES),
      },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });

    return order;
  }

  async findBySessionId(sessionId: string): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { sessionId },
      relations: { items: true },
      order: { createdAt: 'ASC' },
    });

    return orders;
  }

  async findAll(query: QueryOrdersDto): Promise<Paginated<Order>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.orderRepository.createQueryBuilder('order').leftJoinAndSelect('order.items', 'items');

    if (query.sessionId) {
      qb.andWhere('order.sessionId = :sessionId', { sessionId: query.sessionId });
    }
    if (query.status) {
      qb.andWhere('order.status = :status', { status: query.status });
    }
    if (query.paymentStatus) {
      qb.andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: query.paymentStatus,
      });
    }

    qb.orderBy('order.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [orders, total] = await qb.getManyAndCount();

    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async findEntityById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { items: true },
    });

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: `Order with ID "${orderId}" not found.`,
      });
    }

    return order;
  }

  private assertCanAddItems(order: Order): void {
    if (!ADDABLE_ORDER_STATUSES.includes(order.status)) {
      throw new BadRequestException({
        code: 'ORDER_CANNOT_ADD_ITEMS',
        message: `Cannot add items to order with status "${order.status}".`,
      });
    }

    if (order.paymentStatus === PaymentStatus.Paid) {
      throw new BadRequestException({
        code: 'ORDER_ALREADY_PAID',
        message: 'Order already paid, cannot add items.',
      });
    }
  }

  private async validateSession(sessionId: string): Promise<void> {
    const sessionExists = await this.dataSource.query(
      `SELECT id FROM table_sessions WHERE id = $1 AND status = 'open' LIMIT 1`,
      [sessionId],
    );

    if (!sessionExists || sessionExists.length === 0) {
      throw new BadRequestException({
        code: 'SESSION_NOT_FOUND',
        message: `Session "${sessionId}" not found or already closed.`,
      });
    }
  }

  private async buildOrderItems(itemsDto: CreateOrderItemDto[]): Promise<{ items: OrderItem[]; subtotal: number }> {
    const items: OrderItem[] = [];
    let subtotal = 0;

    for (const itemDto of itemsDto) {
      const product = await this.getProductInfo(itemDto.productId);

      if (!product.isAvailable) {
        throw new BadRequestException({
          code: 'PRODUCT_NOT_AVAILABLE',
          message: `Product "${product.name}" is currently out of stock.`,
        });
      }

      const { optionsSnapshot, priceAdjustment } = this.buildOptionsSnapshot(product, itemDto.options ?? []);

      const unitPrice = product.sellPrice + priceAdjustment;
      const itemTotal = unitPrice * itemDto.quantity;
      subtotal += itemTotal;

      const orderItem = this.orderItemRepository.create({
        productId: product.id,
        productName: product.name,
        unitPrice,
        quantity: itemDto.quantity,
        options: optionsSnapshot.length > 0 ? optionsSnapshot : null,
        total: itemTotal,
      });

      items.push(orderItem);
    }

    return { items, subtotal };
  }

  private buildOptionsSnapshot(
    product: ProductInfo,
    selectedOptions: { optionId: string; optionValueIds: string[] }[],
  ): { optionsSnapshot: OptionSnapshot[]; priceAdjustment: number } {
    const optionsSnapshot: OptionSnapshot[] = [];
    let priceAdjustment = 0;

    const selectedMap = new Map<string, string[]>();
    for (const selected of selectedOptions) {
      selectedMap.set(selected.optionId, selected.optionValueIds);
    }

    for (const option of product.options) {
      if (option.required && !selectedMap.has(option.id)) {
        throw new BadRequestException({
          code: 'PRODUCT_OPTION_REQUIRED',
          message: `Product "${product.name}" requires selection of option "${option.name}".`,
        });
      }
    }

    for (const selected of selectedOptions) {
      const productOption = product.options.find((o) => o.id === selected.optionId);

      if (!productOption) {
        throw new BadRequestException({
          code: 'PRODUCT_OPTION_NOT_FOUND',
          message: `Option "${selected.optionId}" does not belong to product "${product.name}".`,
        });
      }

      const selectedValues: OptionSnapshot['selectedValues'] = [];

      for (const valueId of selected.optionValueIds) {
        const optionValue = productOption.values.find((v) => v.id === valueId);

        if (!optionValue) {
          throw new BadRequestException({
            code: 'PRODUCT_OPTION_VALUE_NOT_FOUND',
            message: `Value "${valueId}" is not valid for option "${productOption.name}".`,
          });
        }

        selectedValues.push({
          optionValueId: optionValue.id,
          value: optionValue.value,
          priceAdjustment: optionValue.priceAdjustment,
        });

        priceAdjustment += optionValue.priceAdjustment;
      }

      optionsSnapshot.push({
        optionId: productOption.id,
        optionName: productOption.name,
        required: productOption.required,
        selectedValues,
      });
    }

    return { optionsSnapshot, priceAdjustment };
  }

  private async getProductInfo(productId: string): Promise<ProductInfo> {
    const productRows = await this.dataSource.query(
      `
      SELECT
        p.id,
        p.name,
        p.sell_price,
        p.is_available,
        COALESCE(
          json_agg(
            json_build_object(
              'id', po.id,
              'name', po.name,
              'required', po.required,
              'values', (
                SELECT COALESCE(json_agg(
                  json_build_object(
                    'id', pov.id,
                    'value', pov.value,
                    'priceAdjustment', pov.price_adjustment
                  )
                ), '[]')
                FROM product_option_values pov
                WHERE pov.option_id = po.id
              )
            )
          ) FILTER (WHERE po.id IS NOT NULL),
          '[]'
        ) AS options
      FROM products p
      LEFT JOIN product_options po ON po.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
      `,
      [productId],
    );

    if (!productRows || productRows.length === 0) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: `Product with ID "${productId}" not found.`,
      });
    }

    const row = productRows[0];
    return {
      id: row.id,
      name: row.name,
      sellPrice: row.sell_price,
      isAvailable: row.is_available,
      options: row.options ?? [],
    };
  }
}
