import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly startTime = Date.now();

  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      startTime: this.startTime,
    };
  }

  getStatus() {
    return {
      status: 'alive',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      startTime: this.startTime,
    };
  }
}
