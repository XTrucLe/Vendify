import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, GoneException } from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from '../session.service';
import { SessionCookieUtil } from '@/common/utils/session-cookie.util';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const encrypted = request.cookies?.vendify_session;

    if (!encrypted) {
      throw new UnauthorizedException({
        code: 'SESSION_REQUIRED',
        message: 'Please scan the QR code at the table to start ordering.',
      });
    }

    const sessionId = SessionCookieUtil.decrypt(encrypted);
    if (!sessionId) {
      throw new UnauthorizedException({
        code: 'SESSION_INVALID',
        message: 'Invalid session. Please scan the QR code at the table to start ordering.',
      });
    }

    const session = await this.sessionService.findById(sessionId);
    if (!session) {
      throw new GoneException({
        code: 'SESSION_EXPIRED',
        message: 'The ordering session has ended. Please scan the QR code again.',
      });
    }

    request['session'] = session;
    return true;
  }
}
