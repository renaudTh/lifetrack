import {
  Activity,
  ActivityRecordDTO,
  HistoryStatsDTO,
  StatsEngine,
  toHistoryStatsDTO,
} from '@lifetrack/lib';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import dayjs from 'dayjs';
import { AppService } from './app.service';
import { CallingContext } from './auth/calling.context.decorator';
import { type CallingContext as CC } from './domain/calling.context';
import {
  assertOrderedRange,
  parseDateParam,
  parseSamplingParam,
} from './dto/range.query';
import {
  parseActivityDto,
  parseActivityUpdateDto,
  parseRecordUpsertDto,
  parseUuidParam,
} from './dto/body.validation';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/activities')
  async getActivities(@CallingContext() ctx: CC): Promise<Activity[]> {
    return this.appService.getActivities(ctx);
  }
  @Get('/activities/top')
  async getTopActivities(@CallingContext() ctx: CC): Promise<Activity[]> {
    return this.appService.getTopActivities(ctx, 5);
  }
  @Post('/activity')
  async addActivity(
    @CallingContext() ctx: CC,
    @Body() body: unknown,
  ): Promise<Activity> {
    return this.appService.addActivity(ctx, parseActivityDto(body));
  }
  @Delete('/activity/:id')
  async deleteActivity(
    @CallingContext() ctx: CC,
    @Param('id') id: string,
  ): Promise<void> {
    return this.appService.deleteActivity(ctx, {
      id: parseUuidParam(id, 'id'),
    });
  }
  @Patch('/activity')
  async updateActivity(@CallingContext() ctx: CC, @Body() body: unknown) {
    return this.appService.updateActivity(ctx, parseActivityUpdateDto(body));
  }

  @Get('/records')
  async getRecordsHistory(
    @CallingContext() ctx: CC,
    @Query('start') startParam?: string,
    @Query('end') endParam?: string,
  ): Promise<ActivityRecordDTO[]> {
    const start = parseDateParam(startParam, `${dayjs().year()}-01-01`);
    const end = parseDateParam(endParam, `${dayjs().year()}-12-31`);
    assertOrderedRange(start, end);
    const list = await this.appService.getRecords(ctx, start, end);
    return list.map((record) => ({
      ...record,
      date: record.date.format('YYYY-MM-DD'),
    }));
  }

  @Get('/stats')
  async getStats(
    @CallingContext() ctx: CC,
    @Query('start') startParam?: string,
    @Query('end') endParam?: string,
    @Query('sampling') samplingParam?: string,
  ): Promise<HistoryStatsDTO> {
    const start = parseDateParam(startParam, `${dayjs().year()}-01-01`);
    const end = parseDateParam(endParam, `${dayjs().year()}-12-31`);
    assertOrderedRange(start, end);
    const sampling = parseSamplingParam(samplingParam);
    const list = await this.appService.getRecords(ctx, start, end);
    const history = new StatsEngine(start, end, list).computeStats(sampling);
    return toHistoryStatsDTO(history);
  }

  @Post('/record')
  async newRecord(
    @CallingContext() ctx: CC,
    @Body() body: unknown,
  ): Promise<ActivityRecordDTO> {
    const dto = parseRecordUpsertDto(body);
    const r = await this.appService.addRecord(
      ctx,
      dayjs(dto.date),
      dto.activityId,
    );
    return { ...r, date: r.date.format('YYYY-MM-DD') };
  }

  @Patch('/record/:id')
  async downsertRecord(
    @CallingContext() ctx: CC,
    @Param('id') id: string,
  ): Promise<ActivityRecordDTO | null> {
    const record = await this.appService.downsertRecord(
      ctx,
      parseUuidParam(id, 'id'),
    );
    return record
      ? {
          ...record,
          date: record.date.format('YYYY-MM-DD'),
        }
      : null;
  }
}
