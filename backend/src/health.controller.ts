import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/ready')
  async getActivities() {
    return { status: 'OK' };
  }
}
