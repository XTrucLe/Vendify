import { Controller, Get, Post, Patch, Body, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { SessionService } from './session.service';
import { ScanQRDto, IdentifySessionDto, SessionResponseDto } from './session.dto';
import { Public } from '@/common/decorators/public.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { SessionMapper } from './session.mapper';
import { SessionCookieUtil } from '@/common/utils/session-cookie.util';

@Controller('sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Public()
  @Post('scan')
  async scanQR(@Body() dto: ScanQRDto, @Res({ passthrough: true }) res: Response): Promise<SessionResponseDto> {
    const session = await this.sessionService.scanQR(dto.tableId);

    const encryptedId = SessionCookieUtil.encrypt(session.id);

    res.cookie('session_id', encryptedId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // temporary set default code session cookie for hour
    });

    return SessionMapper.toResponse(session);
  }

  @Public()
  @Post(':id/identify')
  async identify(@Param('id') id: string, @Body() dto: IdentifySessionDto): Promise<SessionResponseDto> {
    const session = await this.sessionService.identify(id, dto.phone);
    return SessionMapper.toResponse(session);
  }

  @Get('active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'manager', 'staff')
  async findAllActive(): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionService.findAllActive();
    return SessionMapper.toResponseList(sessions);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'manager', 'staff')
  async complete(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.sessionService.complete(id);
    return { success: true };
  }

  @Patch(':id/force-close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'manager', 'staff')
  async forceClose(@Param('id') id: string, @Body('reason') reason: string): Promise<{ success: boolean }> {
    await this.sessionService.forceClose(id, reason);
    return { success: true };
  }
}
