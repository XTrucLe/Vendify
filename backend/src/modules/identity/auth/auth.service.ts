import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { toMilliseconds } from '@/common/utils/millisecond.util';
import { PasswordUtil } from '@/common/utils/password.util';

import { LoginDto } from './auth.dto';
import { Staff } from '../staff/staff.entity';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class AuthService {
  private readonly access: { secret: string; expiresIn: string };
  private readonly refresh: { secret: string; expiresIn: string };
  private readonly isProduction: boolean;

  constructor(
    private staffService: StaffService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.access = {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.config.getOrThrow<string>('JWT_EXPIRES_IN'),
    };

    this.refresh = {
      secret: this.config.getOrThrow<string>('REFRESH_SECRET'),
      expiresIn: this.config.getOrThrow<string>('REFRESH_EXPIRES_IN'),
    };

    this.isProduction = this.config.get<string>('NODE_ENV') === 'production';
  }

  async login(dto: LoginDto, res: Response) {
    const staff = await this.findAndValidateStaff(dto.username, dto.password);

    const accessToken = this.signAccessToken(staff);
    const refreshToken = this.signRefreshToken(staff);

    await this.staffService.updateRefreshToken(staff.id, refreshToken);
    await this.staffService.updateLastLogin(staff.id);

    this.setCookies(res, accessToken, refreshToken);
  }

  async logout(staffId: string, res: Response) {
    await this.staffService.updateRefreshToken(staffId, null);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { success: true };
  }

  async refreshToken(token: string, res: Response) {
    const decoded = this.verifyRefreshToken(token);
    const staff = await this.staffService.getStaffById(decoded.sub);

    if (!staff.isActive) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_DISABLED',
        message: 'Account is disabled',
      });
    }

    if (staff.refreshToken !== token) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Refresh token is invalid',
      });
    }

    const accessToken = this.signAccessToken(staff);
    const newRefreshToken = this.signRefreshToken(staff);

    await this.staffService.updateRefreshToken(staff.id, newRefreshToken);
    this.setCookies(res, accessToken, newRefreshToken);

    return { success: true };
  }

  private async findAndValidateStaff(username: string, password: string): Promise<Staff> {
    const staff = await this.staffService.getStaffByUsername(username);
    if (!staff) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password',
      });
    }
    if (!staff.isActive) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_DISABLED',
        message: 'Account is disabled',
      });
    }

    const isPasswordValid = await PasswordUtil.comparePasswords(password, staff.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password',
      });
    }

    return staff;
  }

  private verifyRefreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.refresh.secret,
      });

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException({
          code: 'INVALID_TOKEN_TYPE',
          message: 'Token is not a refresh token',
        });
      }

      return decoded;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Refresh token is invalid or expired',
      });
    }
  }

  private signAccessToken(staff: Staff): string {
    return this.jwtService.sign(
      { sub: staff.id, username: staff.username, role: staff.role, type: 'access' },
      {
        secret: this.access.secret,
        expiresIn: this.access.expiresIn as any,
      },
    );
  }

  private signRefreshToken(staff: Staff): string {
    return this.jwtService.sign(
      { sub: staff.id, type: 'refresh' },
      {
        secret: this.refresh.secret,
        expiresIn: this.refresh.expiresIn as any,
      },
    );
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const options = { httpOnly: true, secure: this.isProduction, sameSite: 'lax' as const };

    res.cookie('access_token', accessToken, {
      ...options,
      maxAge: toMilliseconds(this.access.expiresIn),
    });

    res.cookie('refresh_token', refreshToken, {
      ...options,
      maxAge: toMilliseconds(this.refresh.expiresIn),
    });
  }
}
