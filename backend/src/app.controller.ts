import { Activity, ActivityRecordDTO } from '@lifetrack/lib';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import dayjs from 'dayjs';
import { AppService } from './app.service';
import { CallingContext } from './auth/calling.context.decorator';
import { type CallingContext as CC } from './domain/calling.context';
import { type ActivityDto, type ActivityUpdateDto } from './dto/activity.dto';
import { type RecordUpsertDto } from './dto/record.dto';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }

  @Get("/activities")
  async getActivities(@CallingContext() ctx: CC): Promise<Activity[]> {
    return this.appService.getActivities(ctx);
  }
  @Get("/activities/top")
  async getTopActivities(@CallingContext() ctx: CC): Promise<Activity[]> {
    return this.appService.getTopActivities(ctx, 5);
  }
  @Post("/activity")
  async addActivity(@CallingContext() ctx: CC, @Body() dto: ActivityDto): Promise<Activity> {
    return this.appService.addActivity(ctx, dto);
  }
  @Delete("/activity/:id")
  async deleteActivity(@CallingContext() ctx: CC, @Param("id") id: string): Promise<void> {
    return this.appService.deleteActivity(ctx, { id });
  }
  @Patch("/activity")
  async updateActivity(@CallingContext() ctx: CC, @Body() dto: ActivityUpdateDto) {
    return this.appService.updateActivity(ctx, dto);
  }

  @Get("/records")
  async getRecordsHistory(
    @CallingContext() ctx: CC,
    @Query('start') startParam?: string,
    @Query('end') endParam?: string): Promise<ActivityRecordDTO[]> {
    const start = !startParam ? `${dayjs().year()}-01-01` : startParam;
    const end = !endParam ? `${dayjs().year()}-12-31` : endParam;
    const list = await this.appService.getRecords(ctx, dayjs(start), dayjs(end));
    return list.map(record => ({ ...record, date: record.date.format("YYYY-MM-DD") }));
  }

  @Post("/record")
  async newRecord(@CallingContext() ctx: CC, @Body() dto: RecordUpsertDto): Promise<ActivityRecordDTO> {
    const r = await this.appService.addRecord(ctx, dayjs(dto.date), dto.activityId);
    return { ...r, date: r.date.format("YYYY-MM-DD") }
  }

  @Patch("/record/:id")
  async downsertRecord(@CallingContext() ctx: CC, @Param('id') id: string): Promise<ActivityRecordDTO | null> {
    const record = await this.appService.downsertRecord(ctx, id);
    return record ? {
      ...record,
      date: record.date.format("YYYY-MM-DD")
    } : null
  }
}
