import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableSession } from '@/modules/floor/sessions/table-session.entity';
import { SessionStatus } from '@/modules/floor/sessions/session-status.enum';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    @InjectRepository(TableSession)
    private sessionRepo: Repository<TableSession>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.cookies?.session_id;

    if (!sessionId) {
      throw new UnauthorizedException({
        code: 'MISSING_TABLE_QR',
        message: 'Please scan the table QR code to access the session',
      });
    }

    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, status: SessionStatus.ACTIVE },
      relations: { table: true, customer: true },
    });

    if (!session) {
      throw new UnauthorizedException({
        code: 'INVALID_SESSION',
        message: 'Session invalid or expired. Please scan the table QR code again to access the session',
      });
    }

    request.session = session;
    return true;
  }
}
