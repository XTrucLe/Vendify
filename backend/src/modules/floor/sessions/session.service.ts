import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableSession } from './table-session.entity';
import { TableService } from '../tables/table.service';
import { CustomerService } from '../../identity/customers/customer.service';
import { SessionStatus } from './session-status.enum';
import { TableStatus } from '../tables/status.enum';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(TableSession)
    private sessionRepo: Repository<TableSession>,
    private tablesService: TableService,
    private customerService: CustomerService,
  ) {}

  async scanQR(tableId: string): Promise<TableSession> {
    await this.tablesService.findById(tableId);

    const activeSession = await this.findActiveByTableId(tableId);
    if (activeSession) return activeSession;

    const session = this.sessionRepo.create({
      tableId,
      status: SessionStatus.ACTIVE,
    });
    const savedSession = await this.sessionRepo.save(session);

    await this.tablesService.updateStatus(tableId, TableStatus.OCCUPIED);

    return this.findById(savedSession.id);
  }

  async identify(sessionId: string, phone: string): Promise<TableSession> {
    const session = await this.findById(sessionId);
    if (session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException({
        code: 'SESSION_ALREADY_COMPLETED',
        message: 'The session has ended.',
      });
    }

    const customer = await this.customerService.findByPhone(phone);

    if (customer) session.customerId = customer.id;
    const updated = await this.sessionRepo.save(session);
    return this.findById(updated.id);
  }

  async complete(sessionId: string): Promise<void> {
    const session = await this.findById(sessionId);
    if (session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException({
        code: 'SESSION_ALREADY_COMPLETED',
        message: 'The session has ended.',
      });
    }

    session.status = SessionStatus.COMPLETED;
    session.endedAt = new Date();
    await this.sessionRepo.save(session);

    await this.tablesService.updateStatus(session.tableId, TableStatus.AVAILABLE);
  }

  async forceClose(sessionId: string, reason: string): Promise<void> {
    const session = await this.findById(sessionId);
    if (session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException({
        code: 'SESSION_ALREADY_COMPLETED',
        message: 'The session has ended.',
      });
    }

    session.status = SessionStatus.CLOSED;
    session.closedReason = reason;
    session.endedAt = new Date();
    await this.sessionRepo.save(session);
  }

  async findById(id: string): Promise<TableSession> {
    const session = await this.sessionRepo.findOne({
      where: { id },
      relations: { table: true, customer: true },
    });
    if (!session)
      throw new NotFoundException({
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
    return session;
  }

  async findActiveByTableId(tableId: string): Promise<TableSession | null> {
    return this.sessionRepo.findOne({
      where: { tableId, status: SessionStatus.ACTIVE },
      relations: { table: true, customer: true },
    });
  }

  async findAllActive(): Promise<TableSession[]> {
    return this.sessionRepo.find({
      where: { status: SessionStatus.ACTIVE },
      relations: { table: true, customer: true },
      order: { startedAt: 'DESC' },
    });
  }
}
