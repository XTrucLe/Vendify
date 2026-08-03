import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { StaffService } from '../../staff/staff.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private staffService: StaffService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.access_token,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    const staff = await this.staffService.getStaffById(payload.sub);

    if (!staff) {
      throw new UnauthorizedException({
        code: 'STAFF_NOT_FOUND',
        message: 'Staff not found',
      });
    }

    if (!staff.isActive) {
      throw new UnauthorizedException({
        code: 'STAFF_ACCOUNT_DISABLED',
        message: 'Staff account is disabled',
      });
    }

    return {
      id: staff.id,
      username: staff.username,
      fullName: staff.fullName,
      role: staff.role,
    };
  }
}
