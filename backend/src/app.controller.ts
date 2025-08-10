import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Activity, ActivityRecord } from '@lifetrack/lib';
import { type CallingContext as CC } from './domain/calling.context';
import { type RecordUpsertDto } from './dto/record.dto';
import dayjs from 'dayjs';
import { AuthGuard } from '@nestjs/passport';
import { CallingContext } from './auth/calling.context.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Get("/activities")
  async getActivities(@CallingContext() ctx: CC): Promise<Activity[]> {
    return this.appService.getActivities(ctx);
  }
  @Get("/records")
  async getRecordsHistory(
    @CallingContext() ctx: CC,
    @Query('start') startParam?: string,
    @Query('end') endParam?: string): Promise<ActivityRecord[]> {
      const start = !startParam ? `${dayjs().year()}-01-01` : startParam;
      const end = !endParam ? `${dayjs().year()}-12-31` : endParam;
      return this.appService.getRecords(ctx, dayjs(start), dayjs(end));
  }
  
  @Post("/record")
  async newRecord(@CallingContext() ctx: CC,@Body() dto: RecordUpsertDto): Promise<ActivityRecord> {
    return this.appService.addRecord(ctx, dayjs(dto.date), dto.activityId)
  }

  @Patch("/record/:id")
  async downsertRecord(@CallingContext() ctx: CC, @Param('id') id: string): Promise<ActivityRecord | null> {
    return this.appService.downsertRecord(ctx, id);
  }
}
