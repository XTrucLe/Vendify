import { SetMetadata } from '@nestjs/common';
import { StaffRole } from '../constants/roles.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: StaffRole[]) => SetMetadata(ROLES_KEY, roles);
