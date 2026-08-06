import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import {
  CreateStaffDto,
  UpdateStaffDto,
  UpdateStaffPasswordDto,
  StaffResponseDto,
  StaffDetailResponseDto,
} from './staff.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { StaffMapper } from './staff.mapper';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles('owner', 'manager')
  async createStaff(@Body() dto: CreateStaffDto): Promise<StaffResponseDto> {
    const staff = await this.staffService.createStaff(dto);
    return StaffMapper.toResponse(staff);
  }

  @Get()
  @Roles('owner', 'manager')
  async getAllStaff(): Promise<StaffResponseDto[]> {
    const staffs = await this.staffService.getAllStaff();
    return StaffMapper.toResponseList(staffs);
  }

  @Get(':id')
  @Roles('owner', 'manager')
  async getStaff(@Param('id') id: string): Promise<StaffDetailResponseDto> {
    const staff = await this.staffService.getStaffById(id);
    return StaffMapper.toDetailResponse(staff);
  }

  @Put(':id')
  @Roles('owner', 'manager')
  async updateStaff(@Param('id') id: string, @Body() dto: UpdateStaffDto): Promise<StaffResponseDto> {
    const staff = await this.staffService.updateStaff(id, dto);
    return StaffMapper.toResponse(staff);
  }

  @Put(':id/password')
  async changeStaffPassword(@CurrentUser('id') id: string, @Body() dto: UpdateStaffPasswordDto): Promise<void> {
    await this.staffService.changeStaffPassword(id, dto);
  }

  @Put(':id/verify')
  @Roles('owner', 'manager')
  async verifyStaff(@Param('id') id: string): Promise<void> {
    await this.staffService.verifyStaff(id);
  }

  @Put(':id/restore')
  @Roles('owner', 'manager')
  async restoreStaff(@Param('id') id: string): Promise<void> {
    await this.staffService.restoreStaff(id);
  }

  @Delete(':id/soft')
  @Roles('owner', 'manager')
  async softDeleteStaff(@Param('id') id: string): Promise<void> {
    await this.staffService.softDeleteStaff(id);
  }

  @Delete(':id')
  @Roles('owner')
  async deleteStaff(@Param('id') id: string): Promise<void> {
    await this.staffService.removeStaff(id);
  }
}
